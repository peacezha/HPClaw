import { afterEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  addFormalWorkflowContinuations,
  initFormalWorkflowContinuations,
  listPendingFormalWorkflowContinuations,
  markFormalWorkflowJobFinished,
  markFormalWorkflowResuming,
  removeFormalWorkflowContinuation,
} from './formalWorkflowContinuations';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function setup() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-continuation-'));
  roots.push(root);
  initFormalWorkflowContinuations(root);
  return { host: 'HPC.EXAMPLE', port: 22, username: 'Lin' };
}

describe('formal workflow continuations', () => {
  it('restores pending jobs by stable connection identity instead of transient session id', () => {
    const connection = setup();
    const [record] = addFormalWorkflowContinuations(['48217'], {
      runDir: '/home/lin/hpclaw_flows/rna/RUN-1', workflowId: 'rna', runId: 'RUN-1', connection, sessionId: 'old-session',
    });
    expect(listPendingFormalWorkflowContinuations({ ...connection, host: 'hpc.example', username: 'lin' })[0].jobId).toBe('48217');

    markFormalWorkflowJobFinished(connection, '48217', 'DONE', 'new-session');
    markFormalWorkflowResuming(record.id);
    const restored = listPendingFormalWorkflowContinuations(connection)[0];
    expect(restored.sessionId).toBe('new-session');
    expect(restored.resumeCount).toBe(1);

    expect(removeFormalWorkflowContinuation(record.id)).toBe(true);
    expect(listPendingFormalWorkflowContinuations(connection)).toEqual([]);
  });

  it('deduplicates the same job and run binding', () => {
    const connection = setup();
    const context = { runDir: '/run', workflowId: 'wf', runId: 'r1', connection };
    addFormalWorkflowContinuations(['1'], context);
    addFormalWorkflowContinuations(['1'], context);
    expect(listPendingFormalWorkflowContinuations(connection)).toHaveLength(1);
  });
});
