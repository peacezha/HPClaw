import type { EvidenceInventory } from './learnFromPaper';

const normalize = (value: string) => value.normalize('NFKC').replace(/\s+/g, ' ').trim();
const computational = /\b(?:reads?|sequences?|peaks?|motifs?|genomes?|genes?|expression|statistics|statistical|enrichment|alignment|mapping|quantif\w*|bioinformatics)\b|比对|富集|定量|统计|质控/i;
const operation = /\b(?:aligned|mapped|mapping|cleaned|trimmed|filtered|removed|identified|detected|called|calling|compared|estimated|classified|calculated|normalized|quantified|downloaded|analy[sz]ed|used|performed)\b|比对|计算|过滤|分析|下载/i;

/** A quoted source must actually occur in the input; model claims alone are not evidence. */
export function paperQuoteExists(quote: unknown, text: string): boolean {
  return typeof quote === 'string' && normalize(quote).length >= 15
    && normalize(text).includes(normalize(quote));
}

export function groundEvidenceInventory(value: unknown, text: string): EvidenceInventory | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const inventory = Object.fromEntries(
    ['tools', 'parameters', 'thresholds', 'inputs', 'references', 'stepsMentioned', 'datasets'].map(key => [
      key, Array.isArray(raw[key]) ? raw[key].filter(item =>
        item && typeof item === 'object' && paperQuoteExists(item.sentence, text)).slice(0, 500) : [],
    ]),
  ) as unknown as EvidenceInventory;
  return Object.values(inventory).some(items => items.length) ? inventory : null;
}

/**
 * Conservative recovery, not an invented pipeline. Only source sentences describing
 * analysis operations become review-only steps. Never scan the bibliography.
 */
export function scanPaperAnalysis(text: string): EvidenceInventory {
  const lines = text.split('\n');
  const start = lines.findIndex(line => /^(?:method[s]?|materials and methods|data analysis|bioinformatics(?: analysis)?)$/i.test(line.trim()));
  const content = lines.slice(start >= 0 ? start + 1 : 0).join('\n').split(/\nReferences\s*\n/i)[0];
  const sentences = content.replace(/\n+/g, ' ').split(/(?<=[.!?])\s+(?=[A-Z\u4e00-\u9fff])/u);
  const stepsMentioned = sentences.filter(sentence =>
    sentence.length >= 25 && sentence.length <= 1500 && computational.test(sentence) && operation.test(sentence)
    // Bench-only extraction/sequencing is not a computational analysis.
    && !/\b(?:surface.sterilized|germinated|DNA was extracted|RNA was extracted|ligated|amplified by PCR|sequenced by)\b/i.test(sentence),
  ).slice(0, 40).map((sentence, index) => ({
    id: 'REC' + (index + 1), what: sentence.trim().slice(0, 180), sentence: sentence.trim(),
  }));
  const dataText = text.split(/\nReferences\s*\n/i)[0];
  const datasets = [...dataText.matchAll(/\b(?:GSE|GSM|SRP|SRR|PRJNA|PRJEB|ERP|ERR|DRP|DRR)\d+\b/g)]
    .filter((match, index, all) => all.findIndex(item => item[0] === match[0]) === index)
    .map((match, index) => {
      const accession = match[0];
      const offset = match.index!;
      const sentence = dataText.slice(Math.max(0, offset - 160), offset + accession.length + 160);
      const locator = /^(?:SRR|ERR|DRR)/.test(accession) ? { runAccessions: [accession] }
        : /^GSM/.test(accession) ? { sampleAccession: accession } : { projectAccession: accession };
      return { id: 'DATA' + (index + 1), ...locator, sentence };
    });
  return { tools: [], parameters: [], thresholds: [], inputs: [], references: [], stepsMentioned, datasets };
}

export function hasUsablePaperSteps(value: any): boolean {
  const workflow = value?.workflow && typeof value.workflow === 'object' ? value.workflow : value;
  return Array.isArray(workflow?.steps) && workflow.steps.some((step: any) =>
    typeof step?.title === 'string' && step.title.trim()
    && typeof step.command === 'string' && step.command.trim());
}

/** Retain evidence even if the model omitted CLI; explicitly block execution, never fake success. */
export function recoverPaperWorkflow(value: any, evidence: EvidenceInventory | null, paperText: string, english = false): { value: any; recovered: number } {
  const envelope = value?.workflow && typeof value.workflow === 'object' ? value : { workflow: value && typeof value === 'object' ? value : {} };
  const workflow = envelope.workflow;
  const extraction = envelope.extraction && typeof envelope.extraction === 'object' ? envelope.extraction : {};
  let recovered = 0;
  const makeStep = (title: string, quote: string) => {
    recovered++;
    const gap = english ? 'The paper describes this analysis, but a complete executable command must be verified.'
      : '原文明确描述此分析，但完整命令、输入输出及参数映射仍需核对。';
    return {
      title: title.slice(0, 180),
      command: '# HPCLAW_REVIEW_REQUIRED\n# REVIEW_REQUIRED: ' + gap + '\nexit 2',
      notes: quote,
      agent: { kind: 'compute', sourceType: 'paper', sourcePath: 'paper', sourceSection: 'Methods (recovered evidence)',
        evidence: quote, confidence: 'low', requiresReview: true, template: true, contractVersion: 'paper-agent-v5' },
    };
  };
  let steps = Array.isArray(workflow.steps) ? workflow.steps.map((step: any) => {
    if (!step || typeof step !== 'object') return null;
    if (typeof step.title === 'string' && step.title.trim() && typeof step.command === 'string' && step.command.trim()) return step;
    const quote = step.agent?.evidence || step.evidence;
    if (typeof step.title === 'string' && step.title.trim() && paperQuoteExists(quote, paperText)
      && computational.test(quote) && operation.test(quote)) return makeStep(step.title, quote);
    return null;
  }).filter(Boolean) : [];
  if (!steps.length) {
    const grounded = (evidence?.stepsMentioned || []).filter(step => paperQuoteExists(step.sentence, paperText));
    const candidates = grounded.length ? grounded : scanPaperAnalysis(paperText).stepsMentioned;
    steps = candidates.filter(step => computational.test(step.sentence) && operation.test(step.sentence))
      .slice(0, 40).map((step, index) => makeStep(
        (english ? 'Review: ' : '待核对：') + (typeof step.what === 'string' ? step.what : 'analysis ' + (index + 1)), step.sentence));
  }
  if (!recovered) return { value, recovered: 0 };
  const warning = english ? 'Recovered source-supported analysis steps after incomplete model output. This is a review-only draft, not a runnable reproduction.'
    : '模型未生成完整命令，已恢复原文支持的计算分析步骤并保存为待核对草稿；这不代表已经能直接复现。';
  return { recovered, value: {
    ...envelope, workflow: { ...workflow, name: workflow.name || (english ? 'Paper analysis — review required' : '文献分析（待核对）'), steps },
    extraction: { ...extraction, warnings: [...(Array.isArray(extraction.warnings) ? extraction.warnings : []), warning],
      unresolvedQuestions: [...(Array.isArray(extraction.unresolvedQuestions) ? extraction.unresolvedQuestions : []),
        { question: warning, blocking: true }] },
  } };
}
