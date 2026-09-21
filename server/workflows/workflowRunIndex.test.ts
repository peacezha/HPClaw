import { describe, expect, it, vi } from 'vitest';
import { appendWorkflowRunIndexCommand, importLegacyWorkflowRunIndex, readIndexedWorkflowRuns } from './workflowRunIndex';

describe('workflow run index', () => {
  const home = '/public/home/u';
  const d1 = `${home}/hpclaw_flows/rna/03_workspace/runs/run-1`;

  it('正常刷新只读索引列出的 run.json，不使用目录 glob', async () => {
    const commands: string[] = [];
    const exec = vi.fn(async (command: string) => {
      commands.push(command);
      if (command.startsWith('tail -n')) return `${d1}\n${d1}\n`;
      return `===RUN:${d1}===\n${JSON.stringify({ runId: 'run-1', workflowId: 'wf', runDir: d1, steps: [], status: 'running' })}\n`;
    });
    const runs = await readIndexedWorkflowRuns(exec, home, 20);
    expect(runs).toHaveLength(1);
    expect(runs[0].runDir).toBe(d1);
    expect(commands.join('\n')).not.toContain('*');
  });

  it('创建运行的索引追加命令只写一个明确目录', () => {
    const command = appendWorkflowRunIndexCommand(home, d1);
    expect(command).toContain('run-index.txt');
    expect(command).toContain(d1);
    expect(command).not.toContain('*');
  });

  it('只有显式导入历史时才使用旧目录发现', async () => {
    const exec = vi.fn()
      .mockResolvedValueOnce(`${d1}\n`)
      .mockResolvedValueOnce('');
    expect(await importLegacyWorkflowRunIndex(exec, home)).toBe(1);
    expect(exec.mock.calls[0][0]).toContain('*/run.json');
  });
});
