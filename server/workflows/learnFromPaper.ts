// 从文献学习流程：DOI 解析与论文正文提取（供 /api/workflows/learn 使用）。
// 思路受 CoPaLink（Bioinformatics, 2026）启发：把论文中叙述的分析流程结构化；
// 这里用 LLM 直接做结构化提取，输出本项目的 Workflow JSON。
import { generateText, parsePartialJson } from 'ai';
import { buildModel } from '../ai/agentRunner';
import type { AIProfile } from '../ai/types';
import type { PaperContextSummary } from './paperWorkflowQuality';

const MAX_FETCH_TEXT = 240_000;
const MAX_MODEL_TEXT = 70_000;

/** HTML → 纯文本（去 script/style/标签、解码常用实体、压缩空白） */
export function stripHtmlToText(html: string): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<\/(p|div|section|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)));
  return text
    .split(/\r?\n/)
    .map(l => l.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
    .slice(0, MAX_FETCH_TEXT);
}

const METHOD_HEADING = /^(?:\d+(?:\.\d+)*[.)]?\s*)?(?:materials?\s+(?:and|&)\s+methods?|methods?|experimental\s+procedures?|methodology|bioinformatics(?:\s+analysis)?|computational\s+(?:methods?|analysis)|data\s+(?:processing|analysis)|statistical\s+analysis|implementation|workflow|pipeline)(?:\s*[:：].*)?$/i;
const MAJOR_HEADING = /^(?:\d+(?:\.\d+)*[.)]?\s*)?(?:abstract|introduction|background|materials?\s+(?:and|&)\s+methods?|methods?|results?|discussion|conclusions?|references|acknowledg(?:e)?ments?|supplementary\s+(?:information|materials?|methods?))(?:\s*[:：].*)?$/i;

export interface PreparedPaperContext extends PaperContextSummary {
  text: string;
}

function normalizePaperLines(input: string): string[] {
  // PDF 文本有时把标题和正文挤在同一行；只在常见一级标题周围补换行。
  const withHeadings = input.replace(
    /\s+(Abstract|Introduction|Background|Materials\s+(?:and|&)\s+Methods|Methods|Experimental Procedures|Results|Discussion|Conclusions?|References|Data Availability|Code Availability)\s+/gi,
    '\n$1\n',
  );
  return withHeadings
    .replace(/\r/g, '')
    .split('\n')
    .map(line => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * 优先选取 Methods/数据分析章节，而不是机械截取论文前 60k 字符。
 * 同时保留题名摘要开头与代码可用性/GitHub 行，便于识别研究目标和配套仓库。
 */
export function preparePaperContext(input: string): PreparedPaperContext {
  const raw = input.trim();
  const original = raw.slice(0, MAX_FETCH_TEXT);
  const lines = normalizePaperLines(original);
  const headings: Array<{ index: number; title: string }> = [];
  lines.forEach((line, index) => {
    if (line.length <= 140 && MAJOR_HEADING.test(line)) headings.push({ index, title: line });
  });
  const methodHeadings = headings.filter(heading => METHOD_HEADING.test(heading.title));
  const methodSections: string[] = [];
  const chunks: string[] = [];

  if (methodHeadings.length > 0) {
    chunks.push(lines.slice(0, Math.min(methodHeadings[0].index, 80)).join('\n').slice(0, 8_000));
    for (const heading of methodHeadings) {
      const next = headings.find(candidate => candidate.index > heading.index);
      const end = next?.index ?? Math.min(lines.length, heading.index + 1200);
      const chunk = lines.slice(heading.index, end).join('\n').slice(0, 35_000);
      if (chunk.length >= 20) {
        methodSections.push(heading.title.slice(0, 200));
        chunks.push(chunk);
      }
    }
    const availability = lines
      .filter(line => /github\.com|code availability|data availability|source code|software availability/i.test(line))
      .slice(0, 30)
      .join('\n');
    if (availability) chunks.push(`Code and data availability\n${availability}`);
  }

  const selected = methodHeadings.length > 0
    ? [...new Set(chunks)].join('\n\n').slice(0, MAX_MODEL_TEXT)
    : original.slice(0, MAX_MODEL_TEXT);
  return {
    text: selected,
    originalChars: original.length,
    selectedChars: selected.length,
    truncated: raw.length > MAX_MODEL_TEXT,
    selectionMode: methodHeadings.length > 0 ? 'methods' : 'fulltext-fallback',
    methodSections: [...new Set(methodSections)],
  };
}

async function fetchText(url: string, timeoutMs = 25_000): Promise<string> {
  const res = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: { 'User-Agent': 'HPClaw-WorkflowLearner/1.0 (mailto:hpclaw@localhost)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}（${url.slice(0, 120)}）`);
  return res.text();
}

/** 规范化 DOI 输入（支持 10.xxxx/yyy、doi.org 链接、URL 编码形式） */
export function normalizeDoi(input: string): string | null {
  const m = input.trim().match(/10\.\d{4,9}\/[^\s"<>]+/i);
  if (!m) return null;
  return m[0].replace(/[.,;:)\]]+$/, '');
}

/**
 * 按 DOI 获取论文正文文本：
 * 1. NCBI idconv 查 PMCID → PMC 全文（开放获取最完整）；
 * 2. arXiv DOI → ar5iv/abs 页面；
 * 3. 兜底 doi.org 落地页（可能只有摘要）。
 */
export async function fetchPaperTextByDoi(doiInput: string): Promise<{ text: string; source: string }> {
  const doi = normalizeDoi(doiInput);
  if (!doi) throw new Error('无法识别的 DOI 格式');

  // 1. PMC 全文
  try {
    const idconvRaw = await fetchText(
      `https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=${encodeURIComponent(doi)}&format=json&tool=hpclaw&email=hpclaw@localhost`,
    );
    const idconv = JSON.parse(idconvRaw);
    const pmcid = idconv?.records?.[0]?.pmcid;
    if (pmcid) {
      const html = await fetchText(`https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/`);
      const text = stripHtmlToText(html);
      if (text.length > 3000) return { text, source: `PMC 全文（${pmcid}）` };
    }
  } catch { /* 继续尝试其它来源 */ }

  // 2. arXiv
  const arxivMatch = doi.match(/^10\.48550\/arXiv\.(.+)$/i);
  if (arxivMatch) {
    try {
      const html = await fetchText(`https://arxiv.org/abs/${arxivMatch[1]}`);
      const text = stripHtmlToText(html);
      if (text.length > 1000) return { text, source: 'arXiv 摘要页' };
    } catch { /* 继续 */ }
  }

  // 3. doi.org 落地页兜底
  const html = await fetchText(`https://doi.org/${encodeURIComponent(doi)}`);
  const text = stripHtmlToText(html);
  if (text.length < 800) {
    throw new Error('只能获取到很少的内容（出版商页面未开放全文），请改用上传 PDF 的方式');
  }
  return { text, source: '出版商落地页（可能只有摘要）' };
}

export const LEARN_SYSTEM_PROMPT = `你是“文献方法 → 可审计 HPC Agent 流程”的严格提取器。目标不是概括论文，而是只提取一条可以追溯、可以逐步监控、允许用户修改的主分析路径。只输出一个 JSON 对象，不要 markdown 代码块，不要解释。

JSON 格式：
{
  "workflow": {
    "name": "流程名称（中文，含研究对象和关键方法）",
    "description": "说明主流程做什么，以及哪些内容仍需确认",
    "keywords": ["中英文触发词，5-10个"],
    "params": [{"name":"INPUT_DIR","label":"输入目录","type":"path|text|number|select|boolean","defaultValue":"仅论文明确给出时填写","required":true,"options":[],"help":"参数依据或待确认原因"}],
    "steps": [{
      "title": "一个可监控的原子步骤",
      "command": "HPC 命令模板；缺完整 CLI 时必须以 # REVIEW_REQUIRED: 开头说明缺口",
      "notes": "参数依据、分支选择与运行注意事项",
      "optional": false,
      "params": [{"name":"THREADS","label":"线程数","type":"number","defaultValue":"仅有依据时填写","required":false,"help":"来源"}],
      "agent": {
        "kind":"decision|compute|qc|report",
        "sourceType":"paper|repository",
        "sourcePath":"paper 或仓库相对文件名",
        "sourceSection":"原文 Methods 小节标题或仓库文件/规则名",
        "evidence":"用一句话转述该步骤的来源证据，不得捏造引文",
        "confidence":"high|medium|low",
        "inputs":["本步骤真实输入或上一步产物"],
        "outputs":["可检查的文件/目录/指标"],
        "requiresReview":false,
        "template":true,
        "contractVersion":"paper-agent-v2"
      }
    }],
    "manifest": {
      "software":[{"name":"软件名","module":"只有论文明确版本时写 name/version，否则只写 name","prerequisiteModules":["仅当仓库/module 规则明确要求时填写前置 module"],"required":true}],
      "references":[{"name":"参考数据","path":"{{已声明参数}}","type":"genome|index|annotation|database|other","required":true,"source":"论文/数据库版本依据"}],
      "inputHint":"输入文件类型、配对关系、样本表要求",
      "qcGates":[{"afterStep":2,"metric":"论文实际检查的指标","pass":"只有论文明确阈值时填写","warn":"可选"}]
    }
  },
  "extraction": {
    "primaryPath":"本次选取的主分析路径及选择理由",
    "methodSections":["实际用到的 Methods 小节"],
    "excludedBranches":["未纳入主流程的对照方法、替代软件、敏感性分析或补充实验及原因"],
    "unresolvedQuestions":[{"question":"保存/运行前需要用户确认的问题","blocking":true,"affectsSteps":[2]}],
    "toolLinks":[{"canonicalName":"标准工具名","paperMention":"论文中的原写法","codeMention":"代码中的命令/进程写法","paperSection":"章节","codePath":"仓库相对文件","status":"matched|paper_only|code_only|unverified","knowledgeBase":"仅有明确 KB 对应时填写"}],
    "warnings":["正文或仓库之间的不一致、可能缺页等"]
  }
}

硬性规则：
1. 先识别论文真正的主分析路径。基准比较、对照算法、替代分支和补充实验不得混入主步骤，放入 excludedBranches；只有生物学设计确实要求二选一时才建立 decision 步骤。
2. 步骤按数据依赖排列，不限制为 5-10 步；每步必须有可监控的 inputs、outputs 和来源。不要把整篇 Methods 压成一个步骤，也不要为凑数量拆空步骤。
3. 论文/仓库明确给出的软件版本、参数、阈值和参考数据库版本才可写默认值。没有依据时留空、required=true 或 requiresReview=true，并加入 unresolvedQuestions；严禁写“推测版本”或虚构 QC 阈值。
4. 仓库代码存在时，命令和文件依赖以仓库为事实来源，论文用于解释方法；若二者冲突，加入 warnings，不要自行选一个后隐瞒冲突。
   先分别列出论文工具名和代码中的命令/进程名，再填写 toolLinks；没有对应关系时必须保留 paper_only/code_only，不得为了看起来完整而强行配对。
5. 只有论文或仓库足以恢复 CLI 时才写可运行命令。只有软件名但无命令时写“# REVIEW_REQUIRED: 论文只说明使用 X，未给出完整 CLI”，confidence=low、requiresReview=true，禁止按常识补造参数。
6. 所有 {{PARAM}} 必须在全局或该步骤 params 中声明。路径、样本、队列、线程、参考数据等应参数化；论文固定的科学阈值也要成为可编辑步骤参数。
7. HPC 耗时步骤使用可提交的 #BSUB/bsub 模板；禁止 rm、sudo、curl|bash。decision/qc/report 可以是明确的 Agent 操作说明，但不得假装成已执行结果。
8. QC gate 只接受文中明确阈值；只有指标没有阈值时，把“阈值待定”放 unresolvedQuestions，不生成虚假的 pass。
9. 不得根据摘要恢复完整流程；找不到 Methods 时仍可输出草稿，但所有推断步骤必须 low + requiresReview，并明确警告。
10. 只输出 JSON。`;

/** 调 LLM 把论文文本提取为流程草稿 JSON 文本 */
export async function learnWorkflowFromText(
  paperText: string,
  profile: AIProfile,
  codeExcerpt?: { repoUrl: string; files: string[]; excerpt: string } | null,
  context?: PaperContextSummary,
  locale: 'zh-CN' | 'en-US' = 'zh-CN',
): Promise<string> {
  const codeSection = codeExcerpt
    ? `\n\n【配套代码仓库】${codeExcerpt.repoUrl}\n以下是该仓库中的流程代码文件（${codeExcerpt.files.join('、')}），**步骤与命令以代码为准**，论文文本用于补充说明与参数依据：\n\n${codeExcerpt.excerpt}`
    : '';
  const languageRule = locale === 'en-US'
    ? '\n\nLANGUAGE OVERRIDE: Write every human-readable JSON value (workflow name, descriptions, labels, step titles, notes, evidence, questions and warnings) in English. Keep commands, paths, filenames, software names, database names and scientific identifiers unchanged.'
    : '\n\n语言要求：所有面向用户的 JSON 文本使用中文；命令、路径、文件名、软件名、数据库名和科学标识符保持原样。';
  const { text, finishReason } = await generateText({
    model: buildModel(profile),
    system: LEARN_SYSTEM_PROMPT + languageRule,
    prompt: `请从以下论文方法上下文中提取流程。正文选择信息：${JSON.stringify(context ?? {})}\n\n${paperText.slice(0, MAX_MODEL_TEXT)}${codeSection}`,
    temperature: 0.2,
    maxOutputTokens: /reasoner|v4-pro|reasoning/i.test(profile.model || '') ? 32000 : 16000,
  });
  if (finishReason === 'length') {
    console.warn('[paper-workflow] model output reached token limit; local JSON completion will be attempted');
  }
  return text;
}

function normalizeJsonSurface(text: string): string {
  return text
    .replace(/^\uFEFF/, '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/```(?:json|javascript|js)?/gi, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

/** 修复模型 JSON 中最常见且无歧义的问题，不改变字段和值的语义。 */
function repairCommonJson(text: string): string {
  let repaired = '';
  let inString = false;
  let escaped = false;
  for (const char of text) {
    if (inString) {
      if (escaped) {
        repaired += char;
        escaped = false;
      } else if (char === '\\') {
        repaired += char;
        escaped = true;
      } else if (char === '"') {
        repaired += char;
        inString = false;
      } else if (char === '\n') repaired += '\\n';
      else if (char === '\r') repaired += '\\r';
      else if (char === '\t') repaired += '\\t';
      else repaired += char;
      continue;
    }
    repaired += char;
    if (char === '"') inString = true;
  }
  return repaired
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null');
}

function firstJsonCandidate(text: string): { text: string; complete: boolean } | null {
  const start = text.indexOf('{');
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < text.length; index++) {
    const char = text[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') { inString = true; continue; }
    if (char === '{' || char === '[') depth++;
    else if (char === '}' || char === ']') {
      depth--;
      if (depth === 0) return { text: text.slice(start, index + 1), complete: true };
    }
  }
  return { text: text.slice(start), complete: false };
}

/** 从模型输出中读取第一个完整 JSON 对象，兼容围栏、思考标签、尾逗号和字符串内原始换行。 */
export function extractJsonObject(text: string): unknown | null {
  const trimmed = normalizeJsonSurface(text);
  try { return JSON.parse(trimmed); } catch { /* 继续做括号扫描 */ }
  const candidate = firstJsonCandidate(trimmed);
  if (!candidate) return null;
  try { return JSON.parse(repairCommonJson(candidate.text)); } catch { /* 异步解析器继续处理截断 */ }
  return null;
}

export interface WorkflowJsonParseResult {
  value: unknown | null;
  mode: 'strict' | 'common-repair' | 'partial-repair' | 'failed';
  truncated: boolean;
}

/**
 * 文献流程专用解析器：先使用严格/无歧义修复，再利用 AI SDK 的线性扫描器闭合被 token 截断的 JSON。
 * partial-repair 只补齐字符串和括号，不创造新的流程字段。
 */
export async function parseWorkflowJson(text: string): Promise<WorkflowJsonParseResult> {
  const normalized = normalizeJsonSurface(text);
  try {
    return { value: JSON.parse(normalized), mode: 'strict', truncated: false };
  } catch { /* 继续 */ }
  const candidate = firstJsonCandidate(normalized);
  if (!candidate) return { value: null, mode: 'failed', truncated: false };
  const repaired = repairCommonJson(candidate.text);
  try {
    return { value: JSON.parse(repaired), mode: 'common-repair', truncated: !candidate.complete };
  } catch { /* 继续 */ }
  const partial = await parsePartialJson(repaired);
  if (partial.value && typeof partial.value === 'object') {
    return { value: partial.value, mode: 'partial-repair', truncated: true };
  }
  return { value: null, mode: 'failed', truncated: !candidate.complete };
}

/** 最后一层兜底：只纠正已有输出的 JSON 语法，不重新解释论文，也不补造方法。 */
export async function repairWorkflowJsonWithModel(raw: string, profile: AIProfile): Promise<string> {
  const { text } = await generateText({
    model: buildModel(profile),
    system: `你是 JSON 语法修复器。只输出一个有效 JSON 对象，不要 markdown、思考过程或解释。保留输入中已有的 workflow/extraction 字段、步骤顺序、命令和证据；只修复引号、转义、尾逗号、括号和截断造成的结构问题。不得新增论文未提供的方法、版本、参数或阈值。`,
    prompt: `修复下面的文献流程 JSON：\n\n${raw.slice(0, 100_000)}`,
    temperature: 0,
    maxOutputTokens: /reasoner|v4-pro|reasoning/i.test(profile.model || '') ? 32000 : 16000,
  });
  return text;
}

// ── 组件一：Bioconda 知识库工具名校验（CoPaLink 的 KB 组件思想） ──────────────

/** 生成 Bioconda 候选包名（原名小写 + 常见生信前缀） */
export function biocondaCandidates(toolName: string): string[] {
  // 截断到第一个非包名字符（"BWA (v0.7)" → "bwa"）
  const base = toolName.toLowerCase().split(/[^a-z0-9._+-]/).filter(Boolean)[0] || '';
  if (!base) return [];
  const out = [base];
  for (const prefix of ['bioconductor-', 'r-', 'perl-', 'py-']) {
    if (!base.startsWith(prefix)) out.push(prefix + base);
  }
  return out;
}

export type ToolCheckStatus = 'ok' | 'missing' | 'unknown';

/** 逐个校验工具名是否被 Bioconda 收录（网络失败记 unknown，不阻断） */
export async function checkToolsInBioconda(toolNames: string[]): Promise<Array<{ name: string; status: ToolCheckStatus; hit?: string }>> {
  const checks = toolNames.slice(0, 15).map(async (name) => {
    const candidates = biocondaCandidates(name);
    if (candidates.length === 0) return { name, status: 'missing' as ToolCheckStatus };
    for (const candidate of candidates) {
      try {
        const res = await fetch(`https://bioconda.github.io/recipes/${encodeURIComponent(candidate)}/README.html`, {
          signal: AbortSignal.timeout(8_000),
          headers: { 'User-Agent': 'HPClaw-WorkflowLearner/1.0' },
        });
        if (res.ok) return { name, status: 'ok' as ToolCheckStatus, hit: candidate };
      } catch {
        return { name, status: 'unknown' as ToolCheckStatus };
      }
    }
    return { name, status: 'missing' as ToolCheckStatus };
  });
  return Promise.all(checks);
}

// ── 组件二：论文配套代码仓库抓取（代码是步骤的事实来源） ──────────────

/** 从论文文本中找出 GitHub 仓库链接（排除明显的非流程链接） */
export function findRepoUrls(text: string): string[] {
  const re = /(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)/g;
  const seen = new Set<string>();
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const repo = m[1].replace(/\.git$/, '').replace(/[/.,;:]+$/, '');
    // 排除组织首页/议题/wiki 等深层链接，只留 owner/repo
    if (repo.split('/').length !== 2) continue;
    const url = `https://github.com/${repo}`;
    if (!seen.has(url)) {
      seen.add(url);
      out.push(url);
    }
  }
  return out.slice(0, 5);
}

/** 从仓库文件清单中挑选流程代码文件（Nextflow/Snakemake/脚本） */
export function pickWorkflowFiles(paths: string[]): string[] {
  const score = (p: string): number => {
    const lower = p.toLowerCase();
    if (/(^|\/)main\.nf$/.test(lower)) return 100;
    if (/nextflow\.config$/.test(lower)) return 90;
    if (/(^|\/)snakefile$/.test(lower)) return 95;
    if (/\.smk$/.test(lower)) return 70;
    if (/(^|\/)workflows?\/.+\.nf$/.test(lower)) return 80;
    if (/(^|\/)modules\/.+\.nf$/.test(lower)) return 60;
    if (/\.nf$/.test(lower)) return 50;
    if (/(^|\/)run[^/]*\.(sh|py)$/.test(lower)) return 40;
    return 0;
  };
  return paths
    .map(p => ({ p, s: score(p) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 8)
    .map(x => x.p);
}

/** 抓取 GitHub 仓库的流程代码摘录（无令牌，限速 60 次/小时，足够本场景） */
export async function fetchRepoCodeExcerpt(repoUrl: string): Promise<{ repoUrl: string; files: string[]; excerpt: string } | null> {
  const m = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!m) return null;
  const [_, owner, repo] = m;
  const api = `https://api.github.com/repos/${owner}/${repo}`;
  try {
    // 默认分支
    const repoInfo = await (await fetch(api, {
      signal: AbortSignal.timeout(10_000),
      headers: { 'User-Agent': 'HPClaw-WorkflowLearner/1.0', Accept: 'application/vnd.github+json' },
    })).json();
    const branch = repoInfo?.default_branch || 'main';
    const tree = await (await fetch(`${api}/git/trees/${encodeURIComponent(branch)}?recursive=1`, {
      signal: AbortSignal.timeout(15_000),
      headers: { 'User-Agent': 'HPClaw-WorkflowLearner/1.0', Accept: 'application/vnd.github+json' },
    })).json();
    if (!Array.isArray(tree?.tree)) return null;
    const paths = tree.tree.filter((t: any) => t.type === 'blob').map((t: any) => String(t.path));
    const picked = pickWorkflowFiles(paths);
    if (picked.length === 0) return null;

    const parts: string[] = [];
    const usedFiles: string[] = [];
    let total = 0;
    for (const file of picked) {
      if (total > 30_000) break;
      try {
        const raw = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${file}`, {
          signal: AbortSignal.timeout(10_000),
          headers: { 'User-Agent': 'HPClaw-WorkflowLearner/1.0' },
        });
        if (!raw.ok) continue;
        const text = (await raw.text()).slice(0, 8_000);
        parts.push(`### FILE: ${file}\n${text}`);
        usedFiles.push(file);
        total += text.length;
      } catch { /* 单文件失败跳过 */ }
    }
    if (usedFiles.length === 0) return null;
    return { repoUrl, files: usedFiles, excerpt: parts.join('\n\n').slice(0, 30_000) };
  } catch {
    return null;
  }
}
