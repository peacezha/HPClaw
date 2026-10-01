import type {
  PaperWorkflowQuestion,
  PaperParameterEvidence,
  PaperRawDataRecord,
  PaperReproducibilityAudit,
  PaperToolLink,
  Workflow,
  WorkflowPaperImport,
  WorkflowStep,
} from './workflowTypes';

export const PAPER_IMPORTER_VERSION = 'paper-agent-v3';

export interface PaperContextSummary {
  originalChars: number;
  selectedChars: number;
  truncated: boolean;
  selectionMode: 'methods' | 'fulltext-fallback';
  methodSections: string[];
  dataSections?: string[];
}

export interface PaperExtractionMeta {
  primaryPath: string;
  methodSections: string[];
  excludedBranches: string[];
  unresolvedQuestions: PaperWorkflowQuestion[];
  toolLinks: PaperToolLink[];
  rawData: PaperRawDataRecord[];
  parameterEvidence: PaperParameterEvidence[];
  warnings: string[];
}

const clampScore = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

function cleanStrings(value: unknown, limit: number, itemLimit = 300): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => String(item ?? '').trim())
    .filter(Boolean)
    .slice(0, limit)
    .map(item => item.slice(0, itemLimit));
}

/** 清洗模型返回的“提取说明”；所有缺失项保持缺失，不替模型补写事实。 */
export function sanitizePaperExtractionMeta(value: unknown): PaperExtractionMeta {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const questions = Array.isArray(raw.unresolvedQuestions)
    ? raw.unresolvedQuestions
      .filter(item => item && typeof item === 'object')
      .map((item: any): PaperWorkflowQuestion => {
        const affectsSteps = Array.isArray(item.affectsSteps)
          ? item.affectsSteps.map(Number).filter((n: number) => Number.isInteger(n) && n > 0).slice(0, 30)
          : undefined;
        return {
          question: String(item.question || '').trim().slice(0, 500),
          blocking: item.blocking !== false,
          ...(affectsSteps?.length ? { affectsSteps } : {}),
        };
      })
      .filter(item => item.question)
      .slice(0, 30)
    : [];
  const toolLinks = Array.isArray(raw.toolLinks)
    ? raw.toolLinks
      .filter(item => item && typeof item === 'object')
      .map((item: any): PaperToolLink => {
        const status = ['matched', 'paper_only', 'code_only', 'unverified'].includes(String(item.status))
          ? item.status as PaperToolLink['status']
          : 'unverified';
        const link: PaperToolLink = {
          canonicalName: String(item.canonicalName || item.paperMention || item.codeMention || '').trim().slice(0, 150),
          status,
        };
        for (const key of ['paperMention', 'codeMention', 'paperSection', 'codePath', 'knowledgeBase'] as const) {
          const field = String(item[key] || '').trim();
          if (field) link[key] = field.slice(0, key === 'codePath' ? 500 : 200);
        }
        return link;
      })
      .filter(item => item.canonicalName)
      .slice(0, 50)
    : [];
  const rawData = Array.isArray(raw.rawData)
    ? raw.rawData
      .filter(item => item && typeof item === 'object')
      .map((item: any, index): PaperRawDataRecord => {
        const record: PaperRawDataRecord = {
          id: String(item.id || `D${index + 1}`).trim().slice(0, 50),
          runAccessions: cleanStrings(item.runAccessions, 100, 100),
          files: cleanStrings(item.files, 100, 500),
          urls: cleanStrings(item.urls, 100, 1000),
          checksums: cleanStrings(item.checksums, 100, 200),
          evidence: String(item.evidence || item.sentence || '').trim().slice(0, 1000),
        };
        for (const key of ['repository', 'projectAccession', 'sampleAccession', 'sampleName', 'condition', 'replicate', 'assay', 'layout'] as const) {
          const field = String(item[key] || '').trim();
          if (field) record[key] = field.slice(0, 300);
        }
        return record;
      })
      .filter(item => item.evidence || item.projectAccession || item.sampleAccession || item.runAccessions.length || item.files.length)
      .slice(0, 500)
    : [];
  const parameterEvidence = Array.isArray(raw.parameterEvidence)
    ? raw.parameterEvidence
      .filter(item => item && typeof item === 'object')
      .map((item: any, index): PaperParameterEvidence => ({
        id: String(item.id || `P${index + 1}`).trim().slice(0, 50),
        name: String(item.name || '').trim().slice(0, 200),
        value: String(item.value || '').trim().slice(0, 300),
        ...(item.appliesTo ? { appliesTo: String(item.appliesTo).trim().slice(0, 300) } : {}),
        evidence: String(item.evidence || item.sentence || '').trim().slice(0, 1000),
        covered: item.covered === true,
      }))
      .filter(item => item.name && item.value)
      .slice(0, 500)
    : [];
  return {
    primaryPath: String(raw.primaryPath || '').trim().slice(0, 500),
    methodSections: cleanStrings(raw.methodSections, 30, 200),
    excludedBranches: cleanStrings(raw.excludedBranches, 30, 500),
    unresolvedQuestions: questions,
    toolLinks,
    rawData,
    parameterEvidence,
    warnings: cleanStrings(raw.warnings, 30, 500),
  };
}

function hasStableDataLocator(item: PaperRawDataRecord): boolean {
  // 项目 accession 只能定位整个研究，不能证明某个样本对应哪个原始文件。
  return Boolean(item.sampleAccession || item.runAccessions.length || item.files.length || item.urls.length);
}

export function evaluatePaperReproducibility(
  workflow: Pick<Workflow, 'steps'>,
  extraction: PaperExtractionMeta,
): PaperReproducibilityAudit {
  const rawData = extraction.rawData;
  const locatable = rawData.filter(hasStableDataLocator);
  const mapped = rawData.filter(item => hasStableDataLocator(item) && Boolean(item.sampleName || item.sampleAccession));
  const rawDataStatus: PaperReproducibilityAudit['rawDataStatus'] = rawData.length === 0
    ? 'missing'
    : locatable.length === rawData.length && mapped.length === rawData.length
      ? 'complete'
      : 'partial';
  const coveredParams = extraction.parameterEvidence.filter(item => item.covered).length;
  const parameterStatus: PaperReproducibilityAudit['parameterStatus'] = extraction.parameterEvidence.length === 0
    ? 'missing'
    : coveredParams === extraction.parameterEvidence.length
      ? 'complete'
      : 'partial';
  const hasAcquisitionStep = workflow.steps.some(step =>
    /(?:prefetch|fasterq-dump|fastq-dump|enaDataGet|ascp|aspera|wget|curl|download|下载|获取原始数据|raw[_-]?data[_-]?manifest)/i
      .test(`${step.title}\n${step.command}`),
  );
  const missing: string[] = [];
  if (rawDataStatus === 'missing') missing.push('未从正文/数据可用性章节提取原始数据仓库、accession 或文件来源');
  if (rawDataStatus === 'partial') missing.push('原始数据记录缺少稳定 accession/文件定位或样本映射');
  if (rawData.length > 0 && !hasAcquisitionStep) missing.push('流程缺少按 accession/文件清单获取原始数据并生成 manifest 的步骤');
  if (parameterStatus === 'missing') missing.push('未形成论文参数—流程参数的逐条证据表');
  if (parameterStatus === 'partial') missing.push(`${extraction.parameterEvidence.length - coveredParams} 个论文参数尚未进入流程或明确排除`);
  return { rawDataStatus, parameterStatus, hasAcquisitionStep, missing };
}

function placeholderNames(workflow: Pick<Workflow, 'steps' | 'manifest'>): string[] {
  const found = new Set<string>();
  for (const step of workflow.steps) {
    for (const match of step.command.matchAll(/\{\{\s*([\w.-]+)\s*\}\}/g)) found.add(match[1]);
  }
  for (const reference of workflow.manifest?.references ?? []) {
    for (const match of reference.path.matchAll(/\{\{\s*([\w.-]+)\s*\}\}/g)) found.add(match[1]);
  }
  return [...found];
}

function hasRunnableCommand(step: WorkflowStep): boolean {
  if (step.agent?.kind !== 'compute') return true;
  const command = step.command.trim();
  if (!command || /REVIEW_REQUIRED|TODO|待补充|无法确定|论文未(?:说明|提供).*命令/i.test(command)) return false;
  if (/\brm\s+(?:-[^\s]+\s+)*[/~]|\bsudo\b|(?:curl|wget)[^\n|]*\|\s*(?:ba)?sh\b/i.test(command)) return false;
  return !/^#/.test(command.replace(/^#BSUB[^\n]*\n/gm, '').trim());
}

function unique(items: string[]): string[] {
  return [...new Set(items.map(item => item.trim()).filter(Boolean))];
}

/**
 * 对文献流程做确定性审计。评分不是“AI 自评”，而是按已保存字段逐项计算，
 * 因而缺证据、缺参数、缺 QC 的结果不会被包装成可直接运行。
 */
export function evaluatePaperWorkflow(
  workflow: Pick<Workflow, 'params' | 'steps' | 'manifest'>,
  extraction: PaperExtractionMeta,
  context: PaperContextSummary,
  sourceLabel: string,
): WorkflowPaperImport['quality'] {
  const steps = workflow.steps;
  const totalSteps = steps.length;
  const computeSteps = steps.filter(step => step.agent?.kind === 'compute');
  const supportedSteps = steps.filter(step => {
    const agent = step.agent;
    return Boolean(agent?.sourceSection && agent.evidence && agent.confidence !== 'low');
  }).length;

  const evidence = totalSteps ? clampScore((supportedSteps / totalSteps) * 100) : 0;
  const runnable = computeSteps.filter(hasRunnableCommand).length;
  const ioDeclared = computeSteps.filter(step => (step.agent?.inputs?.length ?? 0) > 0 && (step.agent?.outputs?.length ?? 0) > 0).length;
  const executability = computeSteps.length
    ? clampScore((runnable / computeSteps.length) * 65 + (ioDeclared / computeSteps.length) * 35)
    : 0;

  const declared = new Set(workflow.params.map(param => param.name));
  for (const step of steps) for (const param of step.params ?? []) declared.add(param.name);
  const placeholders = placeholderNames(workflow);
  const undeclared = placeholders.filter(name => !declared.has(name));
  const paramsWithBasis = [...workflow.params, ...steps.flatMap(step => step.params ?? [])]
    .filter(param => (param.defaultValue !== undefined && String(param.defaultValue).trim() !== '') || param.required === true).length;
  const allParams = workflow.params.length + steps.reduce((sum, step) => sum + (step.params?.length ?? 0), 0);
  const declarationScore = placeholders.length ? ((placeholders.length - undeclared.length) / placeholders.length) * 75 : 55;
  const basisScore = allParams ? (paramsWithBasis / allParams) * 25 : 0;
  const parameters = clampScore(declarationScore + basisScore);

  const manifest = workflow.manifest;
  const software = manifest?.software ?? [];
  const references = manifest?.references ?? [];
  const versionedSoftware = software.filter(item => /\d/.test(item.module || '')).length;
  const resourceBase = computeSteps.length && software.length === 0 ? 0 : Math.min(55, software.length * 18);
  const reproducibility = evaluatePaperReproducibility(workflow, extraction);
  const dataResourceScore = reproducibility.rawDataStatus === 'complete' ? 15 : reproducibility.rawDataStatus === 'partial' ? 7 : 0;
  const resources = clampScore(
    resourceBase
    + Math.min(15, references.length * 8)
    + (manifest?.inputHint ? 10 : 0)
    + (software.length ? (versionedSoftware / software.length) * 5 : 0)
    + dataResourceScore,
  );

  const qcSteps = steps.filter(step => step.agent?.kind === 'qc').length;
  const qcGates = manifest?.qcGates ?? [];
  const qc = clampScore(Math.min(55, qcSteps * 30) + Math.min(45, qcGates.length * 25));

  const score = clampScore(
    evidence * 0.30
    + executability * 0.25
    + parameters * 0.20
    + resources * 0.15
    + qc * 0.10,
  );

  const blockers: string[] = [];
  const warnings: string[] = [...extraction.warnings];
  if (totalSteps === 0) blockers.push('没有提取到有效步骤');
  if (computeSteps.length === 0) blockers.push('没有识别到可执行的计算步骤');
  if (context.selectionMode === 'fulltext-fallback' || extraction.methodSections.length === 0) {
    blockers.push('未可靠定位 Methods/方法章节，当前结果可能来自摘要或结果段');
  }
  if (/摘要|落地页/i.test(sourceLabel)) blockers.push('DOI 来源可能只有摘要，不能证明流程完整');
  if (runnable < computeSteps.length) blockers.push(`${computeSteps.length - runnable} 个计算步骤缺少可核验的完整命令`);
  const reviewSteps = steps.filter(step => step.agent?.requiresReview).length;
  if (reviewSteps > 0) blockers.push(`${reviewSteps} 个步骤被标记为运行前必须确认`);
  const blockingQuestions = extraction.unresolvedQuestions.filter(question => question.blocking);
  if (blockingQuestions.length > 0) blockers.push(`${blockingQuestions.length} 个关键信息需要用户确认`);
  if (undeclared.length > 0) blockers.push(`命令中有未声明参数：${undeclared.join('、')}`);
  blockers.push(...reproducibility.missing);
  if (supportedSteps < totalSteps) warnings.push(`${totalSteps - supportedSteps} 个步骤缺少中高可信度的章节证据`);
  if (software.length === 0 && computeSteps.length > 0) warnings.push('没有形成软件环境清单');
  const unmatchedTools = extraction.toolLinks.filter(link => link.status === 'paper_only' || link.status === 'code_only');
  if (unmatchedTools.length > 0) {
    warnings.push(`${unmatchedTools.length} 个工具在论文与代码之间未匹配：${unmatchedTools.map(link => link.canonicalName).join('、')}`);
  }
  if (extraction.toolLinks.length === 0) warnings.push('没有形成论文工具—仓库工具对照');
  if (qcSteps === 0 || qcGates.length === 0) warnings.push('论文未形成完整的 QC 步骤与可执行门禁');
  if (context.truncated) warnings.push('原文超过上下文上限，已优先保留方法章节与代码链接');

  const readiness = totalSteps < 2 || computeSteps.length === 0 || score < 45
    ? 'insufficient'
    : blockers.length > 0 || score < 75
      ? 'needs_input'
      : 'ready_for_review';
  return {
    score,
    readiness,
    dimensions: { evidence, executability, parameters, resources, qc },
    blockers: unique(blockers),
    warnings: unique(warnings),
    supportedSteps,
    totalSteps,
  };
}
