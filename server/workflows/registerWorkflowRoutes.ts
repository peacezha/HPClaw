import type { Express, Request, Response } from 'express';
import { generateText } from 'ai';
import { buildModel } from '../ai/agentRunner';
import { profileFromBody } from '../ai/contextBuilder';
import { deleteWorkflow, loadWorkflows, upsertWorkflow } from './workflowStore';
import { matchWorkflows } from './workflowMatch';
import { sanitizeManifest } from './flowManifest';
import {
  auditParameterCoverage, checkToolsInBioconda, extractEvidenceInventory, extractJsonObject,
  fetchPaperTextByDoi, fetchRepoCodeExcerpt, findRepoUrls, learnWorkflowFromText, normalizeDoi,
  markParameterEvidenceCoverage, parameterEvidenceFromInventory, parseWorkflowJson, preparePaperContext, rawDataFromEvidence,
  repairWorkflowJsonWithModel, reviseWorkflowDraftWithFeedback,
} from './learnFromPaper';
import {
  evaluatePaperReproducibility, evaluatePaperWorkflow, PAPER_IMPORTER_VERSION, sanitizePaperExtractionMeta,
} from './paperWorkflowQuality';
import {
  deleteLearnDraft, getLearnDraft, listLearnDrafts, saveLearnDraft, updateLearnDraft,
} from './learnDraftStore';
import type { Workflow, WorkflowPaperImport, WorkflowParam, WorkflowStep } from './workflowTypes';
import { hasUsablePaperSteps, recoverPaperWorkflow, scanPaperAnalysis } from './paperLearningRecovery';
import { attachPublicDataDownload, resolvePaperPublicData } from './paperPublicData';

function sendError(res: Response, status: number, message: string): void {
  res.status(status).json({ success: false, error: message });
}

export function sanitizeSteps(value: unknown): WorkflowStep[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(s => s && typeof s === 'object')
    .map((s: any): WorkflowStep => {
      const step: WorkflowStep = {
        title: String(s.title || '').trim(),
        command: String(s.command || '').trim(),
        notes: s.notes ? String(s.notes) : undefined,
        optional: Boolean(s.optional),
      };
      const stepId = String(s.id || '').trim();
      if (/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(stepId)) step.id = stepId.slice(0, 100);
      if (Array.isArray(s.dependsOn)) {
        const dependencies: string[] = (s.dependsOn as unknown[])
          .map((value: unknown) => String(value).trim())
          .filter((value: string) => /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value))
          .slice(0, 100);
        step.dependsOn = [...new Set<string>(dependencies)];
      }
      const phase = String(s.phase || '').trim();
      if (phase) step.phase = phase.slice(0, 100);
      if (Array.isArray(s.params)) {
        const params = sanitizeParams(s.params);
        if (params.length > 0) step.params = params;
      }
      if (s.agent && typeof s.agent === 'object') {
        const kind = ['decision', 'compute', 'qc', 'report'].includes(String(s.agent.kind))
          ? s.agent.kind as NonNullable<WorkflowStep['agent']>['kind']
          : 'compute';
        const skillRefs = Array.isArray(s.agent.skillRefs)
          ? s.agent.skillRefs.map((v: unknown) => String(v).trim()).filter(Boolean).slice(0, 30)
          : undefined;
        const sourceType = ['bioskills', 'paper', 'repository', 'user'].includes(String(s.agent.sourceType))
          ? s.agent.sourceType as NonNullable<WorkflowStep['agent']>['sourceType']
          : undefined;
        const confidence = ['high', 'medium', 'low'].includes(String(s.agent.confidence))
          ? s.agent.confidence as NonNullable<WorkflowStep['agent']>['confidence']
          : undefined;
        const inputs = Array.isArray(s.agent.inputs)
          ? s.agent.inputs.map((v: unknown) => String(v).trim()).filter(Boolean).slice(0, 30)
          : undefined;
        const outputs = Array.isArray(s.agent.outputs)
          ? s.agent.outputs.map((v: unknown) => String(v).trim()).filter(Boolean).slice(0, 30)
          : undefined;
        step.agent = {
          kind,
          ...(sourceType ? { sourceType } : {}),
          sourcePath: s.agent.sourcePath ? String(s.agent.sourcePath).slice(0, 500) : undefined,
          sourceSection: s.agent.sourceSection ? String(s.agent.sourceSection).slice(0, 300) : undefined,
          ...(s.agent.evidence ? { evidence: String(s.agent.evidence).slice(0, 600) } : {}),
          ...(confidence ? { confidence } : {}),
          ...(inputs?.length ? { inputs } : {}),
          ...(outputs?.length ? { outputs } : {}),
          ...(s.agent.requiresReview === true ? { requiresReview: true } : {}),
          skillRefs: skillRefs?.length ? skillRefs : undefined,
          template: Boolean(s.agent.template),
          contractVersion: s.agent.contractVersion ? String(s.agent.contractVersion).slice(0, 30) : undefined,
        };
      }
      return step;
    })
    .filter(s => s.title && s.command);
}

function boundedScore(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100, Math.round(number))) : 0;
}

function shortList(value: unknown, limit = 30, length = 500): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(item => String(item ?? '').trim()).filter(Boolean).slice(0, limit).map(item => item.slice(0, length));
}

/** 清洗随流程保存的文献证据与质量报告。 */
export function sanitizePaperImport(value: unknown): WorkflowPaperImport | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as any;
  const quality = raw.quality && typeof raw.quality === 'object' ? raw.quality : {};
  const readiness = ['ready_for_review', 'needs_input', 'insufficient'].includes(String(quality.readiness))
    ? quality.readiness as WorkflowPaperImport['quality']['readiness']
    : 'insufficient';
  const dimensions = quality.dimensions && typeof quality.dimensions === 'object' ? quality.dimensions : {};
  const unresolvedQuestions = Array.isArray(raw.unresolvedQuestions)
    ? raw.unresolvedQuestions
      .filter((item: unknown) => item && typeof item === 'object')
      .map((item: any) => {
        const affectsSteps = Array.isArray(item.affectsSteps)
          ? item.affectsSteps.map(Number).filter((n: number) => Number.isInteger(n) && n > 0).slice(0, 30)
          : undefined;
        return {
          question: String(item.question || '').trim().slice(0, 500),
          blocking: item.blocking !== false,
          ...(affectsSteps?.length ? { affectsSteps } : {}),
        };
      })
      .filter((item: { question: string }) => item.question)
      .slice(0, 30)
    : [];
  const toolLinks = Array.isArray(raw.toolLinks)
    ? raw.toolLinks
      .filter((item: unknown) => item && typeof item === 'object')
      .map((item: any) => {
        const status = ['matched', 'paper_only', 'code_only', 'unverified'].includes(String(item.status))
          ? item.status
          : 'unverified';
        const link: Record<string, unknown> = {
          canonicalName: String(item.canonicalName || '').trim().slice(0, 150),
          status,
        };
        for (const key of ['paperMention', 'codeMention', 'paperSection', 'codePath', 'knowledgeBase']) {
          const field = String(item[key] || '').trim();
          if (field) link[key] = field.slice(0, key === 'codePath' ? 500 : 200);
        }
        return link;
      })
      .filter(item => item.canonicalName)
      .slice(0, 50) as WorkflowPaperImport['toolLinks']
    : [];
  const extractionExtras = sanitizePaperExtractionMeta({
    rawData: raw.rawData,
    parameterEvidence: raw.parameterEvidence,
  });
  const paperImport: WorkflowPaperImport = {
    importerVersion: String(raw.importerVersion || PAPER_IMPORTER_VERSION).slice(0, 50),
    sourceLabel: String(raw.sourceLabel || '文献导入').trim().slice(0, 300),
    methodSections: shortList(raw.methodSections, 30, 200),
    excludedBranches: shortList(raw.excludedBranches),
    unresolvedQuestions,
    toolLinks,
    rawData: extractionExtras.rawData,
    parameterEvidence: extractionExtras.parameterEvidence,
    quality: {
      score: boundedScore(quality.score),
      readiness,
      dimensions: {
        evidence: boundedScore(dimensions.evidence),
        executability: boundedScore(dimensions.executability),
        parameters: boundedScore(dimensions.parameters),
        resources: boundedScore(dimensions.resources),
        qc: boundedScore(dimensions.qc),
      },
      blockers: shortList(quality.blockers),
      warnings: shortList(quality.warnings),
      supportedSteps: Math.max(0, Math.round(Number(quality.supportedSteps) || 0)),
      totalSteps: Math.max(0, Math.round(Number(quality.totalSteps) || 0)),
    },
  };
  if (raw.doi) paperImport.doi = String(raw.doi).trim().slice(0, 300);
  if (raw.repoUrl) paperImport.repoUrl = String(raw.repoUrl).trim().slice(0, 500);
  if (typeof raw.repoCommit === 'string' && /^[a-f0-9]{40}$/.test(raw.repoCommit)) paperImport.repoCommit = raw.repoCommit;
  const repoFiles = shortList(raw.repoFiles, 30, 500);
  if (repoFiles.length) paperImport.repoFiles = repoFiles;
  if (raw.primaryPath) paperImport.primaryPath = String(raw.primaryPath).trim().slice(0, 500);
  if (raw.reproducibility && typeof raw.reproducibility === 'object') {
    const repro = raw.reproducibility as any;
    paperImport.reproducibility = {
      rawDataStatus: ['complete', 'partial', 'missing'].includes(String(repro.rawDataStatus)) ? repro.rawDataStatus : 'missing',
      parameterStatus: ['complete', 'partial', 'missing'].includes(String(repro.parameterStatus)) ? repro.parameterStatus : 'missing',
      hasAcquisitionStep: repro.hasAcquisitionStep === true,
      missing: shortList(repro.missing, 30, 500),
    };
  }
  const reviewedAt = Number(raw.reviewedAt);
  if (Number.isFinite(reviewedAt) && reviewedAt > 0) paperImport.reviewedAt = reviewedAt;
  return paperImport;
}

const PARAM_TYPES = ['text', 'number', 'select', 'boolean', 'path'] as const;

export function sanitizeParams(value: unknown): WorkflowParam[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(p => p && typeof p === 'object')
    .map((p: any): WorkflowParam => {
      const param: WorkflowParam = {
        name: String(p.name || '').replace(/[{}]/g, '').trim(),
        label: String(p.label || p.name || '').trim(),
        defaultValue: p.defaultValue !== undefined ? String(p.defaultValue) : undefined,
      };
      if ((PARAM_TYPES as readonly string[]).includes(p.type)) param.type = p.type;
      if (Array.isArray(p.options)) {
        const options = p.options.map((o: unknown) => String(o).trim()).filter(Boolean).slice(0, 20);
        if (options.length > 0) param.options = options;
      }
      if (p.placeholder) param.placeholder = String(p.placeholder).slice(0, 200);
      if (typeof p.required === 'boolean') param.required = p.required;
      if (Number.isFinite(Number(p.min))) param.min = Number(p.min);
      if (Number.isFinite(Number(p.max))) param.max = Number(p.max);
      if (Number.isFinite(Number(p.step)) && Number(p.step) > 0) param.step = Number(p.step);
      if (p.pattern) param.pattern = String(p.pattern).slice(0, 300);
      if (p.help) param.help = String(p.help).slice(0, 500);
      return param;
    })
    .filter(p => p.name);
}

function sanitizeKeywords(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(v => String(v).trim()).filter(Boolean).slice(0, 20);
}

/**
 * 清洗流程分类：字符串去空白并限长 50；空串表示“清除分类”，
 * 非字符串返回 undefined（编辑时表示保持原值不变）。
 */
export function sanitizeCategory(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.trim().slice(0, 50);
}

/** POST 创建来源白名单：尊重前端明示的 user/ai，缺省按文献导入推断（历史行为）。 */
function sanitizeCreateSource(body: any): 'user' | 'ai' {
  if (body?.source === 'ai' || body?.source === 'user') return body.source;
  return body?.paperImport ? 'ai' : 'user';
}

export function sanitizeAssets(value: unknown): import('./workflowTypes').WorkflowAsset[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const assets = value
    .filter(a => a && typeof a === 'object')
    .map((a: any) => ({
      source: String(a.source || '').replace(/\.\./g, '').replace(/^[/\\]+/, '').trim(),
      remotePath: String(a.remotePath || '').replace(/\.\./g, '').replace(/^[/\\]+/, '').trim(),
      label: a.label ? String(a.label).slice(0, 100) : undefined,
    }))
    .filter(a => a.source && a.remotePath)
    .slice(0, 20);
  return assets.length > 0 ? assets : undefined;
}

const DRAFT_SYSTEM_PROMPT = `你是生信分析流程设计助手。根据用户描述，输出一个分析流程的 JSON 对象，不要输出任何其他内容（不要 markdown 代码块）。

JSON 格式：
{
  "name": "流程名称（中文）",
  "description": "一句话说明用途",
  "keywords": ["触发关键词，含中文别名和英文术语，5-8个"],
  "params": [{"name": "SAMPLE", "label": "参数说明", "defaultValue": "可选默认值"}],
  "steps": [{"title": "步骤名", "command": "命令模板", "notes": "可选注意事项", "optional": false}],
  "manifest": {
    "software": [{"name": "软件名", "module": "module名/版本（不确定可省略）", "required": true}],
    "references": [{"name": "参考数据名", "path": "集群路径（需用户指定时写 {{参数名}}）", "type": "genome|index|annotation|database|other", "required": true}],
    "inputHint": "询问用户数据位置的提示语",
    "qcGates": [{"afterStep": 2, "metric": "指标名", "pass": "通过标准", "warn": "警告标准（可选）"}]
  }
}

规则：
- 命令必须符合 HPC 集群规范：耗时超过 2 分钟的任务用 bsub -q normal 提交，禁止 rm（用 mv 到 /tmp 代替）
- 可变参数用 {{PARAM}} 占位，并在 params 中声明
- 3-7 个步骤，按真实分析顺序排列
- manifest 描述运行前必须就绪的软件与参考数据；纯运维类流程（无软件/参考依赖）可省略 manifest
- 只输出 JSON 对象本身`;

export function registerWorkflowRoutes(app: Express): void {
  app.get('/api/workflows', async (_req, res) => {
    try {
      res.json({ success: true, workflows: await loadWorkflows() });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  app.post('/api/workflows/match', async (req, res) => {
    try {
      const query = String(req.body?.query || '');
      if (!query.trim()) return res.json({ success: true, matches: [] });
      const matches = matchWorkflows(await loadWorkflows(), query, 3);
      res.json({ success: true, matches });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  app.post('/api/workflows', async (req, res) => {
    try {
      const name = String(req.body?.name || '').trim();
      if (!name) return sendError(res, 400, 'name is required');
      const steps = sanitizeSteps(req.body?.steps);
      if (steps.length === 0) return sendError(res, 400, 'steps is required');
      const workflow = await upsertWorkflow({
        name,
        description: String(req.body?.description || ''),
        keywords: sanitizeKeywords(req.body?.keywords),
        category: sanitizeCategory(req.body?.category),
        params: sanitizeParams(req.body?.params),
        steps,
        manifest: sanitizeManifest(req.body?.manifest),
        assets: sanitizeAssets(req.body?.assets),
        paperImport: sanitizePaperImport(req.body?.paperImport),
        source: sanitizeCreateSource(req.body),
      });
      res.status(201).json({ success: true, workflow });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  app.put('/api/workflows/:id', async (req, res) => {
    try {
      const name = String(req.body?.name || '').trim();
      if (!name) return sendError(res, 400, 'name is required');
      const steps = sanitizeSteps(req.body?.steps);
      if (steps.length === 0) return sendError(res, 400, 'steps is required');
      const workflow = await upsertWorkflow({
        id: String(req.params.id),
        name,
        description: String(req.body?.description || ''),
        keywords: sanitizeKeywords(req.body?.keywords),
        category: sanitizeCategory(req.body?.category),
        params: sanitizeParams(req.body?.params),
        steps,
        manifest: sanitizeManifest(req.body?.manifest),
        assets: sanitizeAssets(req.body?.assets),
        paperImport: sanitizePaperImport(req.body?.paperImport),
        source: req.body?.source === 'builtin' ? 'builtin' : req.body?.source === 'ai' ? 'ai' : 'user',
      });
      res.json({ success: true, workflow });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  app.delete('/api/workflows/:id', async (req, res) => {
    try {
      const removed = await deleteWorkflow(String(req.params.id));
      if (!removed) return sendError(res, 404, 'Workflow not found');
      res.json({ success: true });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // AI 辅助起草流程：根据自然语言描述生成流程草稿（不落库，用户确认后保存）
  app.post('/api/workflows/draft', async (req, res) => {
    try {
      const profile = profileFromBody(req.body);
      if (!profile.apiKey) return sendError(res, 400, 'Missing API Key');
      const description = String(req.body?.description || '').trim();
      if (!description) return sendError(res, 400, 'description is required');
      const locale: 'zh-CN' | 'en-US' = req.body?.locale === 'en-US' ? 'en-US' : 'zh-CN';
      const languageRule = locale === 'en-US'
        ? '\n\nLANGUAGE OVERRIDE: Write all human-readable JSON values in English. Keep commands, paths, filenames, tool names, database names and scientific identifiers unchanged.'
        : '\n\n语言要求：所有面向用户的 JSON 文本使用中文；命令、路径、文件名、工具名、数据库名和科学标识符保持原样。';

      const { text } = await generateText({
        model: buildModel(profile),
        system: DRAFT_SYSTEM_PROMPT + languageRule,
        prompt: locale === 'en-US'
          ? `Design an analysis workflow for the following request:\n${description.slice(0, 1000)}`
          : `请为以下需求设计分析流程：\n${description.slice(0, 1000)}`,
        temperature: 0.3,
        // 推理模型（reasoner/v4-pro 等）的思考过程会占用输出预算，
        // 1500 的额度会被思考耗尽导致正文为空/无 JSON，需放大预算
        maxOutputTokens: /reasoner|v4-pro|reasoning/i.test(profile.model || '') ? 8000 : 2000,
      });

      const parsed = extractJsonObject(text) as any;
      if (!parsed) return sendError(res, 502, 'AI 未返回有效 JSON，请重试');

      const draft: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'> = {
        name: String(parsed.name || description.slice(0, 30)),
        description: String(parsed.description || ''),
        keywords: sanitizeKeywords(parsed.keywords),
        params: sanitizeParams(parsed.params),
        steps: sanitizeSteps(parsed.steps),
        source: 'ai',
      };
      const manifest = sanitizeManifest(parsed.manifest);
      if (manifest) draft.manifest = manifest;
      if (draft.steps.length === 0) return sendError(res, 502, 'AI 生成的流程没有有效步骤，请重试');
      res.json({ success: true, draft });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 从文献学习流程：DOI 或论文全文文本（PDF 由前端提取）→ LLM 提取为流程草稿
  app.post('/api/workflows/learn', async (req, res) => {
    const learnStartedAt = Date.now();
    let modelDeadline: AbortSignal | undefined;
    const learnLog = (stage: string) =>
      console.log(`[paper-workflow] learn ${stage} elapsed=${Date.now() - learnStartedAt}ms`);
    try {
      learnLog('start');
      const profile = profileFromBody(req.body);
      if (!profile.apiKey) return sendError(res, 400, 'Missing API Key');
      const locale: 'zh-CN' | 'en-US' = req.body?.locale === 'en-US' ? 'en-US' : 'zh-CN';
      let paperText = String(req.body?.paperText || '').trim();
      let source = '用户上传的 PDF 文本';
      const directText = Boolean(paperText);
      if (req.body?.pasteSource === 'paste') source = '用户粘贴的方法学文本';
      let doi: string | undefined;
      if (!paperText) {
        const doiInput = String(req.body?.doi || '').trim();
        if (!doiInput) return sendError(res, 400, '需要 DOI 或论文文本');
        doi = normalizeDoi(doiInput) || undefined;
        const fetched = await fetchPaperTextByDoi(doiInput);
        paperText = fetched.text;
        source = fetched.source;
        learnLog(`fetched doi source=${source} chars=${paperText.length}`);
      }
      // 直接提供的文本（PDF 提取/用户粘贴的方法片段）允许较短；DOI 抓取的全文太短说明没抓到
      if (paperText.length < (directText ? 300 : 800)) {
        return sendError(res, 502, '获取到的论文内容太少（可能非开放获取），请改用上传 PDF 或直接粘贴方法学文本');
      }

      // 论文附带代码仓库时，抓取仓库流程代码作为步骤的事实来源（CoPaLink 代码侧）
      const context = preparePaperContext(paperText);
      const publicData = await resolvePaperPublicData(context.text);
      learnLog(`public data runs=${publicData.records.length} projects=${publicData.projects.length}`);
      const dataSummary = JSON.stringify(publicData.projects.map(project => {
        const rows = publicData.records.filter(row => row.projectAccession === project);
        return { project, runs: rows.length, samples: new Set(rows.map(row => row.sampleAccession)).size,
          examples: rows.slice(0, 3).map(row => ({ sample: row.sampleAccession, name: row.sampleName, run: row.runAccessions,
            layout: row.layout, files: row.files })), warnings: publicData.warnings.filter(item => item.startsWith(project)) };
      }));
      let codeExcerpt: Awaited<ReturnType<typeof fetchRepoCodeExcerpt>> = null;
      const repoUrls = findRepoUrls(paperText);
      for (const repoUrl of repoUrls) {
        codeExcerpt = await fetchRepoCodeExcerpt(repoUrl);
        if (codeExcerpt) break;
      }
      if (repoUrls.length > 0) learnLog(`repo ${codeExcerpt ? 'fetched ' + codeExcerpt.repoUrl : 'unavailable'}`);

      // 第一段：证据清单（工具/参数/阈值带逐字出处句）。失败不阻断，退化为单段提取。
      modelDeadline = AbortSignal.timeout(360_000);
      let evidence: Awaited<ReturnType<typeof extractEvidenceInventory>>['inventory'] = null;
      const evidenceWarnings: string[] = [];
      try {
        const inv = await extractEvidenceInventory(context.text, profile, locale, AbortSignal.any([modelDeadline, AbortSignal.timeout(120_000)]));
        evidence = inv.inventory;
        evidenceWarnings.push(...(inv.warnings || []));
        learnLog(`evidence tools=${evidence?.tools.length ?? 'n/a'} params=${evidence?.parameters.length ?? 'n/a'}`);
      } catch (err) {
        learnLog(`evidence failed: ${err instanceof Error ? err.message : String(err)}`);
      }

      // LLM 提取加总超时：论文学习曾被反馈"第一次没反应"——多半是模型/网络卡住后
      // 前端无限期空等。超时返回明确错误，让用户知道可以重试而不是干等。
      // The underlying requests are aborted; no dangling Promise.race timer or
      // separate four-minute allowance for every retry.
      const raw = await learnWorkflowFromText(context.text, profile, codeExcerpt, context, locale, evidence, undefined, modelDeadline, dataSummary);
      learnLog('llm done');
      let parseResult = await parseWorkflowJson(raw);
      let parsed = parseResult.value as any;
      const hasWorkflowSteps = hasUsablePaperSteps;
      if (!parsed) {
        console.warn('[paper-workflow] first JSON parse incomplete mode=%s chars=%d; requesting syntax repair', parseResult.mode, raw.length);
        try {
          const repairedRaw = await repairWorkflowJsonWithModel(raw, profile, modelDeadline);
          parseResult = await parseWorkflowJson(repairedRaw);
          parsed = parseResult.value as any;
        } catch (error) { learnLog('syntax recovery failed: ' + (error instanceof Error ? error.message : String(error))); }
      }
      // 证据清单明明找到了分析步骤、模型却交了空 steps（湿实验排除规则被过度执行）：
      // 拿清单拍回去重试一次（v0.4.35 根因修复：学习整体报「未能提取有效步骤」）。
      const sourceEvidence = scanPaperAnalysis(context.text);
      if (!hasWorkflowSteps(parsed) && (evidence?.stepsMentioned.length || sourceEvidence.stepsMentioned.length)) {
        const recoveryEvidence = evidence?.stepsMentioned.length ? evidence : sourceEvidence;
        learnLog(`missing executable steps despite ${recoveryEvidence!.stepsMentioned.length} evidence steps; retrying with enforcement`);
        try {
          const retryRaw = await learnWorkflowFromText(context.text, profile, codeExcerpt, context, locale, recoveryEvidence,
            '上次回答没有有效的 title + command。原文有计算分析证据，不得误判为只有湿实验。每个分析步骤须保留；缺 CLI 时写 REVIEW_REQUIRED 并标记 requiresReview=true，不得编造命令。',
            modelDeadline, dataSummary);
          const retryParsed = await parseWorkflowJson(retryRaw);
          if (retryParsed.value) {
            parsed = retryParsed.value;
            parseResult = retryParsed;
          }
        } catch (error) { learnLog('targeted recovery failed: ' + (error instanceof Error ? error.message : String(error))); }
      }
      const recovered = recoverPaperWorkflow(parsed, evidence, context.text, locale === 'en-US');
      if (recovered.recovered) { parsed = recovered.value; learnLog('recovered review steps=' + recovered.recovered); }
      if (!parsed) return sendError(res, 502, 'AI 返回内容不完整，系统自动修复后仍无法解析；请缩短论文文本或重试');
      const workflowRaw = parsed.workflow && typeof parsed.workflow === 'object' ? parsed.workflow : parsed;
      attachPublicDataDownload(workflowRaw, publicData, locale === 'en-US');
      const extraction = sanitizePaperExtractionMeta(parsed.extraction);
      extraction.warnings.push(...publicData.warnings, ...evidenceWarnings);
      if (!evidence) evidence = sourceEvidence;
      if (evidence) {
        const evidenceRawData = rawDataFromEvidence(evidence);
        const evidenceParameters = parameterEvidenceFromInventory(evidence, workflowRaw);
        if (evidenceRawData.length > 0) extraction.rawData = evidenceRawData;
        if (evidenceParameters.length > 0) extraction.parameterEvidence = evidenceParameters;
      }
      if (publicData.records.length) {
        const resolved = new Set(publicData.records.map(row => row.projectAccession));
        extraction.rawData = [...(extraction.rawData || []).filter(row => !resolved.has(row.projectAccession)),
          ...publicData.records];
        extraction.unresolvedQuestions.push({ question: locale === 'en-US'
          ? 'Confirm DATA_PROJECT and DOWNLOAD_RUNS before downloading; sample conditions/replicates are not inferred from names.'
          : '已取得真实 FASTQ 地址与校验值；运行前确认 DATA_PROJECT 和 DOWNLOAD_RUNS。条件/重复不能仅凭样本名猜测，需按实验设计核对。', blocking: true });
      }
      extraction.parameterEvidence = markParameterEvidenceCoverage(extraction.parameterEvidence, workflowRaw);
      if (parseResult.truncated || parseResult.mode === 'partial-repair') {
        extraction.warnings.push('AI 返回的 JSON 曾被截断，系统已自动闭合并恢复可解析结构；请重点复核最后几个步骤是否完整');
      } else if (parseResult.mode === 'common-repair') {
        extraction.warnings.push('AI 返回的 JSON 存在格式问题，系统已自动修复语法；流程内容仍需按文献证据复核');
      }
      extraction.methodSections = [...new Set([...extraction.methodSections, ...context.methodSections])];
      if (repoUrls.length > 0 && !codeExcerpt) {
        extraction.warnings.push('论文包含代码仓库链接，但本次未能读取到可识别的流程代码文件');
      }

      const draft: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'> = {
        name: String(workflowRaw.name || '文献流程').slice(0, 60),
        description: String(workflowRaw.description || '').slice(0, 500),
        keywords: sanitizeKeywords(workflowRaw.keywords),
        params: sanitizeParams(workflowRaw.params),
        steps: sanitizeSteps(workflowRaw.steps),
        source: 'ai',
      };
      const manifest = sanitizeManifest(workflowRaw.manifest);
      if (manifest) draft.manifest = manifest;
      if (draft.steps.length === 0) {
        // 把模型自己给出的判断告诉用户（如果有），别再只甩一句泛泛的「改贴计算部分」
        const reason = extraction.warnings[0] || extraction.primaryPath || '';
        return sendError(res, 422, `当前输入没有可核验的计算分析步骤${reason ? `（提取说明：${reason.slice(0, 200)}）` : ''}。已定位章节：${context.methodSections.join('、') || '未定位'}；可能缺少方法页、补充方法或只有实验操作。请检查 PDF 提取内容，不代表整篇论文没有分析流程。`);
      }

      // 确定性参数覆盖审计：原文明确出现的 CLI 选项/版本/阈值，草稿是否真的纳入。
      // 漏项属于复现阻断项：不能把论文明确写出的参数静默丢掉后仍宣称可运行。
      const coverage = auditParameterCoverage(context.text, workflowRaw);
      if (coverage.missing.length > 0) {
        extraction.warnings.push(
          `参数覆盖审计：原文明确出现但草稿未纳入的参数/版本/阈值共 ${coverage.missing.length} 项：`
          + coverage.missing.slice(0, 10).map(m => m.token).join('、')
          + (coverage.missing.length > 10 ? ' 等' : ''),
        );
        for (const item of coverage.missing.slice(0, 5)) {
          extraction.unresolvedQuestions.push({
            question: `原文给出了「${item.token}」（${item.kind}）但草稿未使用：${item.sentence.slice(0, 120)}`,
            blocking: true,
          });
        }
      }

      // KB 只用于验证工具实体，不把“包存在”误当成论文—代码已经匹配。
      const softwareCheck = manifest
        ? await checkToolsInBioconda(manifest.software.map(s => s.name))
        : [];
      for (const link of extraction.toolLinks) {
        const normalized = link.canonicalName.toLowerCase();
        const hit = softwareCheck.find(item => item.status === 'ok' && (
          item.name.toLowerCase() === normalized
          || item.hit === normalized
          || item.name.toLowerCase() === link.paperMention?.toLowerCase()
          || item.name.toLowerCase() === link.codeMention?.toLowerCase()
        ));
        if (hit?.hit) link.knowledgeBase = `Bioconda:${hit.hit}`;
      }
      const quality = evaluatePaperWorkflow(draft, extraction, context, source);
      const reproducibility = evaluatePaperReproducibility(draft, extraction);
      const paperImport: WorkflowPaperImport = {
        importerVersion: PAPER_IMPORTER_VERSION,
        sourceLabel: source,
        ...(doi ? { doi } : {}),
        ...(codeExcerpt ? { repoUrl: codeExcerpt.repoUrl, repoFiles: codeExcerpt.files, repoCommit: codeExcerpt.commit } : {}),
        ...(extraction.primaryPath ? { primaryPath: extraction.primaryPath } : {}),
        methodSections: extraction.methodSections,
        excludedBranches: extraction.excludedBranches,
        unresolvedQuestions: extraction.unresolvedQuestions,
        toolLinks: extraction.toolLinks,
        rawData: extraction.rawData,
        parameterEvidence: extraction.parameterEvidence,
        reproducibility,
        quality,
      };
      draft.paperImport = paperImport;
      learnLog(`assemble done steps=${draft.steps.length}`);

      // 学习成果自动进草稿箱：用户切走页面/关闭面板后可找回，也可继续与 AI 交流修订。
      let draftId: string | null = null;
      try {
        draftId = saveLearnDraft({
          name: draft.name,
          sourceLabel: source,
          doi,
          repoUrl: codeExcerpt?.repoUrl,
          draft,
          paperContext: context.text,
        }).id;
      } catch (err) {
        console.warn('[paper-workflow] learn draft persist failed (non-blocking):', err instanceof Error ? err.message : err);
      }

      res.json({
        success: true,
        draft,
        draftId,
        source,
        paperChars: paperText.length,
        repoUsed: codeExcerpt?.repoUrl || null,
        repoFiles: codeExcerpt?.files || [],
        softwareCheck,
        paperImport,
        parameterCoverage: {
          covered: coverage.found.length,
          missingCount: coverage.missing.length,
          missing: coverage.missing.slice(0, 10),
        },
        evidenceStats: evidence ? {
          tools: evidence.tools.length,
          parameters: evidence.parameters.length,
          thresholds: evidence.thresholds.length,
          references: evidence.references.length,
          datasets: evidence.datasets.length,
        } : null,
        context: {
          selectedChars: context.selectedChars,
          methodSections: context.methodSections,
          dataSections: context.dataSections,
          selectionMode: context.selectionMode,
          truncated: context.truncated,
        },
      });
    } catch (err: any) {
      sendError(res, 502, modelDeadline?.aborted ? 'AI 文献学习超过 6 分钟，已停止模型请求；这是模型响应超时，不代表论文没有计算分析步骤。' : err.message || String(err));
    }
  });

  // ── 文献学习草稿箱：学习成果持久化，可找回、可继续与 AI 交流修订 ──────────

  app.get('/api/workflows/learn-drafts', async (_req, res) => {
    try {
      res.json({ success: true, drafts: listLearnDrafts() });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  app.get('/api/workflows/learn-drafts/:id', async (req, res) => {
    try {
      const entry = getLearnDraft(String(req.params.id));
      if (!entry) return sendError(res, 404, '学习草稿不存在（可能已被清理）');
      const { paperContext: _paperContext, ...rest } = entry;
      res.json({ success: true, draft: rest });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  app.delete('/api/workflows/learn-drafts/:id', async (req, res) => {
    try {
      if (!deleteLearnDraft(String(req.params.id))) return sendError(res, 404, '学习草稿不存在');
      res.json({ success: true });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 按用户反馈修订草稿：模型只改被指出的问题，其余字段原样保留；修订后重新审计并写回草稿箱。
  app.post('/api/workflows/learn-drafts/:id/revise', async (req, res) => {
    try {
      const profile = profileFromBody(req.body);
      if (!profile.apiKey) return sendError(res, 400, 'Missing API Key');
      const feedback = String(req.body?.feedback || '').trim();
      if (!feedback) return sendError(res, 400, 'feedback is required');
      const locale: 'zh-CN' | 'en-US' = req.body?.locale === 'en-US' ? 'en-US' : 'zh-CN';
      const entry = getLearnDraft(String(req.params.id));
      if (!entry) return sendError(res, 404, '学习草稿不存在（可能已被清理）');

      const currentJson = JSON.stringify({ workflow: entry.draft }, null, 1);
      const reviseStartedAt = Date.now();
      let raw: string;
      try {
        raw = await Promise.race([
          reviseWorkflowDraftWithFeedback(currentJson, feedback, entry.paperContext, profile, locale),
          new Promise<never>((_resolve, reject) =>
            setTimeout(() => reject(new Error('AI 修订超时（超过 4 分钟）。草稿保持原样，请直接重试。')), 240_000)),
        ]);
      } finally {
        console.log(`[paper-workflow] revise llm elapsed=${Date.now() - reviseStartedAt}ms draft=${entry.id}`);
      }
      let parseResult = await parseWorkflowJson(raw);
      let parsed = parseResult.value as any;
      const workflowOf = (value: any) => (value?.workflow && typeof value.workflow === 'object' ? value.workflow : value);
      if (!parsed || !Array.isArray(workflowOf(parsed)?.steps) || workflowOf(parsed).steps.length === 0) {
        const repairedRaw = await repairWorkflowJsonWithModel(raw, profile);
        parseResult = await parseWorkflowJson(repairedRaw);
        parsed = parseResult.value as any;
      }
      if (!parsed || !Array.isArray(workflowOf(parsed)?.steps) || workflowOf(parsed).steps.length === 0) {
        return sendError(res, 502, 'AI 修订结果不完整，自动修复后仍无法解析；草稿保持原样，请换个表述重试');
      }

      const workflowRaw = workflowOf(parsed);
      const revisionNote = typeof parsed?.extraction?.revisionNote === 'string'
        ? parsed.extraction.revisionNote.trim().slice(0, 500)
        : '';
      const extraction = sanitizePaperExtractionMeta(parsed.extraction ?? {
        // 模型没回传 extraction 时沿用旧审计信息，只补修订痕迹
        primaryPath: entry.draft.paperImport?.primaryPath,
        methodSections: entry.draft.paperImport?.methodSections,
        excludedBranches: entry.draft.paperImport?.excludedBranches,
        unresolvedQuestions: entry.draft.paperImport?.unresolvedQuestions,
        toolLinks: entry.draft.paperImport?.toolLinks,
        rawData: entry.draft.paperImport?.rawData,
        parameterEvidence: entry.draft.paperImport?.parameterEvidence,
      });
      if (extraction.rawData.length === 0 && entry.draft.paperImport?.rawData) {
        extraction.rawData = entry.draft.paperImport.rawData;
      }
      if (extraction.parameterEvidence.length === 0 && entry.draft.paperImport?.parameterEvidence) {
        extraction.parameterEvidence = entry.draft.paperImport.parameterEvidence;
      }
      if (parseResult.truncated || parseResult.mode === 'partial-repair') {
        extraction.warnings.push('AI 修订返回的 JSON 曾被截断，系统已自动闭合；请重点复核末尾步骤');
      }

      const revised: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'> = {
        name: String(workflowRaw.name || entry.draft.name).slice(0, 60),
        description: String(workflowRaw.description || '').slice(0, 500),
        keywords: sanitizeKeywords(workflowRaw.keywords),
        params: sanitizeParams(workflowRaw.params),
        steps: sanitizeSteps(workflowRaw.steps),
        source: 'ai',
      };
      const manifest = sanitizeManifest(workflowRaw.manifest);
      if (manifest) revised.manifest = manifest;
      else if (entry.draft.manifest) revised.manifest = entry.draft.manifest;
      extraction.parameterEvidence = markParameterEvidenceCoverage(extraction.parameterEvidence, revised);

      const paperContextSummary = {
        originalChars: entry.paperContext?.length || 0,
        selectedChars: entry.paperContext?.length || 0,
        truncated: false,
        selectionMode: 'methods' as const,
        methodSections: extraction.methodSections,
      };
      const quality = evaluatePaperWorkflow(revised, extraction, paperContextSummary, entry.sourceLabel);
      const reproducibility = evaluatePaperReproducibility(revised, extraction);
      revised.paperImport = {
        importerVersion: PAPER_IMPORTER_VERSION,
        sourceLabel: entry.sourceLabel,
        ...(entry.doi ? { doi: entry.doi } : {}),
        ...(entry.repoUrl ? { repoUrl: entry.repoUrl } : {}),
        ...(entry.draft.paperImport?.repoCommit ? { repoCommit: entry.draft.paperImport.repoCommit } : {}),
        ...(entry.draft.paperImport?.repoFiles ? { repoFiles: entry.draft.paperImport.repoFiles } : {}),
        ...(extraction.primaryPath ? { primaryPath: extraction.primaryPath } : {}),
        methodSections: extraction.methodSections,
        excludedBranches: extraction.excludedBranches,
        unresolvedQuestions: extraction.unresolvedQuestions,
        toolLinks: extraction.toolLinks,
        rawData: extraction.rawData,
        parameterEvidence: extraction.parameterEvidence,
        reproducibility,
        quality,
      };

      const updated = updateLearnDraft(entry.id, {
        name: revised.name,
        draft: revised,
        revisionNote: revisionNote || feedback.slice(0, 120),
      });
      res.json({
        success: true,
        draft: revised,
        revisionNote,
        paperImport: revised.paperImport,
        updatedAt: updated?.updatedAt,
      });
    } catch (err: any) {
      sendError(res, 502, err.message || String(err));
    }
  });
}
