// 流程匹配：与 skillIndex 一致的 bigram 中文分词评分。
import type { Workflow } from './workflowTypes';

function tokenize(query: string): string[] {
  const terms: string[] = [];
  const cjkRun = /[一-鿿㐀-䶿぀-ヿ豈-﫿]+/g;
  const pushLatin = (text: string) => {
    for (const tok of text.toLowerCase().split(/[^\p{L}\p{N}_-]+/u)) {
      const t = tok.trim();
      if (t.length > 1) terms.push(t);
    }
  };
  let last = 0;
  for (const m of query.matchAll(cjkRun)) {
    pushLatin(query.slice(last, m.index));
    const run = m[0];
    if (run.length === 1) terms.push(run);
    else for (let i = 0; i < run.length - 1; i++) terms.push(run.slice(i, i + 2));
    last = (m.index ?? 0) + run.length;
  }
  pushLatin(query.slice(last));
  return terms;
}

export function scoreWorkflow(workflow: Workflow, query: string): number {
  const terms = tokenize(query);
  if (terms.length === 0) return 0;

  const name = workflow.name.toLowerCase();
  const keywords = workflow.keywords.join(' ').toLowerCase();
  const desc = workflow.description.toLowerCase();
  const stepText = workflow.steps.map(s => `${s.title} ${s.command}`).join('\n').toLowerCase();

  let score = 0;
  for (const term of terms) {
    // 关键词精确命中权重最高
    if (workflow.keywords.some(k => k.toLowerCase() === term)) score += 12;
    else if (keywords.includes(term)) score += 6;
    if (name.includes(term)) score += 8;
    if (desc.includes(term)) score += 3;
    if (stepText.includes(term)) score += 1;
  }
  return score;
}

/** 返回得分最高的前 limit 个流程（score > 0） */
export function matchWorkflows(workflows: Workflow[], query: string, limit = 3): (Workflow & { score: number })[] {
  return workflows
    .map(w => ({ ...w, score: scoreWorkflow(w, query) }))
    .filter(w => w.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);
}
