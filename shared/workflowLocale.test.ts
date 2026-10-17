import { describe, expect, it } from 'vitest';
import { builtinWorkflows } from '../server/workflows/workflowStore';
import { localizeWorkflowMetadata, reportCommandForLanguage } from './workflowLocale';
import { buildWorkflowStepScript, createWorkflowRun, buildWorkflowRunSummary } from '../server/workflows/workflowRunService';

describe('workflow and report language', () => {
  it('localizes every built-in display field without rewriting executable content or parameter values', () => {
    for (const source of builtinWorkflows()) {
      const before = JSON.stringify(source);
      const en = localizeWorkflowMetadata(source, 'en');
      const display = [en.name, en.description, en.manifest?.inputHint,
        ...en.params.flatMap(p => [p.label, p.help, p.placeholder]),
        ...en.steps.flatMap(s => [s.title, s.notes, s.phase, ...(s.params || []).flatMap(p => [p.label, p.help, p.placeholder])]),
        ...(en.manifest?.references || []).flatMap(v => [v.name, v.source]),
        ...(en.manifest?.qcGates || []).flatMap(v => [v.metric, v.pass, v.warn])];
      expect(display.filter(value => value && /[\u3400-\u9fff]/.test(value)), source.id).toEqual([]);
      expect(en.steps.map(s => s.command)).toEqual(source.steps.map(s => s.command));
      expect(en.params.map(p => [p.name, p.defaultValue, p.options])).toEqual(source.params.map(p => [p.name, p.defaultValue, p.options]));
      expect(JSON.stringify(source)).toBe(before);
    }
  });
  it('only rewrites known report CLIs and never attaches a flag to another shell command', () => {
    expect(reportCommandForLanguage('python3 "{{RUN}}/tools/encode_native_report.py" --language zh --assay dap', 'en'))
      .toBe('python3 "{{RUN}}/tools/encode_native_report.py" --assay dap --language en');
    expect(reportCommandForLanguage('python3 hidogV11_trace_report.py --mode amplicon', 'zh')).toContain('--language zh');
    for (const command of ['echo "encode_native_report.py --language zh"', 'python3 my_report.py --language zh',
      'python3 encode_native_report.py --language zh && echo done']) {
      expect(reportCommandForLanguage(command, 'en')).toBe(command);
    }
  });
  it('persists the selected language into snapshots, report scripts and deterministic run summaries', async () => {
    const source = builtinWorkflows().find(w => w.id === 'builtin-dapseq-tf')!;
    const before = JSON.stringify(source);
    const written = new Map<string, string>();
    const run = await createWorkflowRun(async command => {
      for (const match of command.matchAll(/printf %s '([^']+)' \| base64 -d > '([^']+)'/g)) {
        written.set(match[2], Buffer.from(match[1], 'base64').toString('utf8'));
      }
      return '';
    }, '/home/u', source, { inputs: ['/data/reads'], reportLanguage: 'en' }, true);
    expect(run.config.reportLanguage).toBe('en');
    expect(run.workflowName).not.toMatch(/[\u3400-\u9fff]/);
    expect(run.steps[6].title).toBe('Biological-replicate IDR reproducibility assessment');
    expect(buildWorkflowStepScript(source, run.config, 9, run.runDir)).toContain('--language en');
    expect(buildWorkflowRunSummary(run)).toContain('Run report');
    expect(buildWorkflowRunSummary(run)).not.toContain('运行报告');
    expect(JSON.stringify(source)).toBe(before);
    expect([...written.values()].some(value => value.includes('Run scripts'))).toBe(true);
    const snapshot = [...written.entries()].find(([key]) => key.includes('workflow.snapshot.json'))?.[1];
    expect(JSON.parse(snapshot!).steps[8].command).toContain('--language en');
  });
});
