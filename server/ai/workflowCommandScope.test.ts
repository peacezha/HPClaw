import { describe, expect, it } from 'vitest';
import { scopeWorkflowCommand } from './workflowCommandScope';

const scope = {
  home: '/public/home/u',
  runDir: '/public/home/u/hpclaw_flows/rna/03_workspace/runs/run-1',
  inputs: ['/public/home/u/projects/rna/fastq'],
  references: ['/share/ref/hg38'],
  userAuthorizedPaths: ['/scratch/u/temporary-output'],
};

describe('workflow command scope', () => {
  it('自动固定在 RUN 目录执行普通命令', () => {
    const result = scopeWorkflowCommand('echo ok > results/status.txt', scope);
    expect(result.ok).toBe(true);
    expect(result.command).toBe(`cd '${scope.runDir}' && echo ok > results/status.txt`);
  });

  it('允许在 RUN 内有限发现，并忽略 /dev/null 重定向', () => {
    const result = scopeWorkflowCommand("find . -maxdepth 2 -type f 2>/dev/null | head", scope);
    expect(result.ok).toBe(true);
  });

  it('允许读取用户明确选择的输入或参考路径', () => {
    expect(scopeWorkflowCommand('ls /public/home/u/projects/rna/fastq | head', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('find /share/ref/hg38 -maxdepth 1 -type f | head', scope).ok).toBe(true);
  });

  it('只读的环境探查不限制路径（conda env、R 库、软件目录均为合法探查）', () => {
    expect(scopeWorkflowCommand('ls /public/home/u/.local/share/mamba/envs/cyto/bin | head', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('ls -d /public/home/u/R/x86_64-pc-linux-gnu-library 2>/dev/null', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('du -sh /public/home/u', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('find /public/home/u/other -type f | head', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('ls /public/home/u | wc -l', scope).ok).toBe(true);
  });

  it('改变状态的遍历命令仍受路径授权约束', () => {
    expect(scopeWorkflowCommand('ls /etc/ssl > results/x.txt', scope)).toMatchObject({ ok: false });
    expect(scopeWorkflowCommand('ls /public/home/u/projects/rna/fastq > results/x.txt', scope).ok).toBe(true);
  });

  it('允许精确清理 RUN 或已选择输入目录中的旧产物，但保护根目录与参考数据', () => {
    expect(scopeWorkflowCommand('rm -f results/old.log', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('rm -f /public/home/u/projects/rna/fastq/*.old.bam', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('rm -rf /public/home/u/projects/rna/fastq', scope).ok).toBe(false);
    expect(scopeWorkflowCommand('rm -f /share/ref/hg38/genome.fa', scope).ok).toBe(false);
    expect(scopeWorkflowCommand('rm -rf /public/home/u', scope).ok).toBe(false);
    expect(scopeWorkflowCommand('rm -f /scratch/u/temporary-output/old.tmp', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('rm -f /scratch/other/not-mentioned.tmp', scope).ok).toBe(false);
  });

  it('模块名与变量不会被误判为路径', () => {
    expect(scopeWorkflowCommand('module load R/3.6.0 && Rscript -e "cat(1)"', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('module load R/$v 2>/dev/null; Rscript -e "cat(1)"', scope).ok).toBe(true);
  });

  it('拦截自行 cd、父目录和无界递归发现', () => {
    expect(scopeWorkflowCommand('cd /public/home/u && ls', scope).ok).toBe(false);
    expect(scopeWorkflowCommand('ls ../other', scope).ok).toBe(false);
    expect(scopeWorkflowCommand('locate "*.fq.gz"', scope).ok).toBe(false);
    expect(scopeWorkflowCommand('tree /public/home/u', scope).ok).toBe(false);
  });

  it('ls -R 仅限授权根内使用', () => {
    expect(scopeWorkflowCommand('ls -R .', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('ls -R /public/home/u/projects/rna/fastq | head -20', scope).ok).toBe(true);
    expect(scopeWorkflowCommand('ls -R /etc/ssl', scope).ok).toBe(false);
  });

  it('完全授权模式允许多路径、切换目录和授权根以外的操作', () => {
    expect(scopeWorkflowCommand('cd /scratch/a && cp one.txt /project/b/', { ...scope, unrestricted: true }))
      .toEqual({ ok: true, command: 'cd /scratch/a && cp one.txt /project/b/' });
    expect(scopeWorkflowCommand('rm -f /project/b/old.txt', { ...scope, unrestricted: true }).ok).toBe(true);
  });
});
