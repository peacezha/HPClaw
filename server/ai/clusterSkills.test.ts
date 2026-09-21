import { describe, expect, it } from 'vitest';
import { buildClusterSkillScanCommand, clusterSkillFromRecord, parseClusterSkillScanOutput } from './clusterSkills';

describe('cluster skill scanner helpers', () => {
  it('parses newline-delimited scanner records and skips malformed or unsupported lines', () => {
    const output = [
      JSON.stringify({ rel: '1.txt', text: 'cluster note', size: 12, mtime: 100 }),
      'not json',
      JSON.stringify({ rel: 'image.png', text: 'binary', size: 6, mtime: 101 }),
    ].join('\n');

    const records = parseClusterSkillScanOutput(output);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({ rel: '1.txt', text: 'cluster note', size: 12, mtime: 100 });
  });

  it('converts scanner records to cluster skill metadata', () => {
    const skill = clusterSkillFromRecord({ rel: 'pipelines/run.sh', text: 'bsub < job.lsf', size: 14, mtime: 200 });

    expect(skill?.filename).toBe('cluster/pipelines/run');
    expect(skill?.source).toBe('cluster');
    expect(skill?.category).toBe('cluster');
    expect(skill?.sourcePath).toBe('cluster:~/hpclaw_skills/pipelines/run.sh');
  });

  it('builds a scanner command for hpclaw_skills with limits', () => {
    const command = buildClusterSkillScanCommand();

    expect(command).toContain('hpclaw_skills');
    expect(command).toContain('MAX_FILES');
    expect(command).toContain('MAX_BYTES');
    expect(command).toContain('MAX_TOTAL_BYTES');
  });
});

describe('scanClusterSkills', () => {
  it('扫描集群技能并按缓存键缓存', async () => {
    const { scanClusterSkills } = await import('./clusterSkills');
    const raw = JSON.stringify({ rel: 'notes/run.sh', text: '#!/bin/bash\necho hi', size: 20 }) + '\n';
    let calls = 0;
    const exec = async () => { calls++; return raw; };
    const first = await scanClusterSkills(exec, 'vitest-s1', 60_000);
    const second = await scanClusterSkills(exec, 'vitest-s1', 60_000);
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(1);
    expect(first[0]?.source).toBe('cluster');
    expect(calls).toBe(1); // 第二次命中缓存
  });

  it('扫描失败返回空数组，不阻塞本地技能', async () => {
    const { scanClusterSkills } = await import('./clusterSkills');
    const exec = async (): Promise<string> => { throw new Error('ssh down'); };
    expect(await scanClusterSkills(exec, 'vitest-s2', 60_000)).toEqual([]);
  });

  it('缓存过期后立即返回旧结果并在后台刷新', async () => {
    const { scanClusterSkills } = await import('./clusterSkills');
    const firstRaw = JSON.stringify({ rel: 'notes/old.md', text: 'old', size: 3 }) + '\n';
    const nextRaw = JSON.stringify({ rel: 'notes/new.md', text: 'new', size: 3 }) + '\n';
    let resolveRefresh!: (value: string) => void;
    const refresh = new Promise<string>(resolve => { resolveRefresh = resolve; });
    let calls = 0;
    const exec = async () => {
      calls++;
      return calls === 1 ? firstRaw : refresh;
    };

    const first = await scanClusterSkills(exec, 'vitest-stale', 0);
    const stale = await scanClusterSkills(exec, 'vitest-stale', 0);

    expect(first[0]?.filename).toContain('old');
    expect(stale[0]?.filename).toContain('old');
    expect(calls).toBe(2);
    resolveRefresh(nextRaw);
    await refresh;
  });
});
