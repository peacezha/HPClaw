import { findLatestWorkflowExecutionContext } from './workflowExecution';

/** Read-only hints from this message's own history, never another/later conversation. */
export function reportBasePaths(messages: readonly { role?: string; content?: unknown }[]): string[] {
  const bases: string[] = [];
  const add = (value: string) => {
    const clean = value.replace(/[，。；：）]+$/, '').replace(/\/+$/, '');
    if (!clean.startsWith('/') || /[\0\r\n]/.test(clean) || clean.includes('..') || bases.includes(clean)) return;
    bases.push(clean);
  };
  for (const message of [...messages].reverse()) {
    const raw = String(message.content || '');
    const text = message.role === 'system' ? raw.replace(/\\[nr]/g, '\n') : raw;
    // Explicit working/output directories, including shell text in JSON logs.
    for (const match of text.matchAll(/(?:\bcd\s+|\b(?:OUTPUT_DIR|OUTDIR|WORKDIR|RUN_DIR)\s*[=:]\s*)["'`]*(\/[^\s"'`;&<>\\]+)/g)) add(match[1]);
    // A user-supplied directory is a useful project hint, but a FASTQ/BED/script is not.
    if (message.role === 'user') for (const match of text.matchAll(/(?<![\w./~:\\-])\/(?:[A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+\/?/g)) {
      if (!/\.[A-Za-z0-9]{1,8}\/?$/.test(match[0])) add(match[0]);
    }
    if (bases.length >= 7) break;
  }
  const run = findLatestWorkflowExecutionContext([...messages]);
  if (run) add(run.runDir);
  return bases.slice(0, 8);
}
