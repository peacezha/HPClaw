import { describe, expect, it } from 'vitest';
import { reportBasePaths } from './reportPaths';
import { formatWorkflowExecutionContext } from './workflowExecution';

describe('report directory hints', () => {
  it('recovers project and RUN directories from a long conversation', () => {
    const runDir = '/home/u/hpclaw_flows/dap/03_workspace/runs/dap-1';
    const messages = [
      { role: 'user', content: `Analyze /home/u/project\n${formatWorkflowExecutionContext({ workflowId: 'dap', runId: 'dap-1', runDir })}` },
      ...Array.from({ length: 674 }, () => ({ role: 'assistant', content: 'Still running.' })),
      { role: 'system', content: '{"content":"cd /home/u/project\\nOUTPUT_DIR=/home/u/results\\n"}' },
    ];
    expect(reportBasePaths(messages)).toEqual(['/home/u/project', '/home/u/results', runDir]);
  });
  it('ignores Windows paths, URLs, input files, and traversal; bounds hints', () => {
    expect(reportBasePaths([{ role: 'user', content: 'C:/work/abc https://example.org/path /home/u/reads.fastq.gz /safe/../other' }])).toEqual([]);
    expect(reportBasePaths([{ role: 'user', content: Array.from({ length: 30 }, (_, i) => `/project/${i}`).join(' ') }])).toHaveLength(8);
  });
  it('uses only history supplied for that artifact, not later RUNs', () => {
    const history = [{ role: 'user', content: 'Analyze /old/project' }, { role: 'assistant', content: '07_report/report.html' }];
    expect(reportBasePaths(history)).toEqual(['/old/project']);
  });
});
