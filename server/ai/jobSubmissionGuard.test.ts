import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  canonicalSubmissionIntent,
  JobSubmissionGuard,
  preflightJobSubmission,
  resolveSubmissionScriptPath,
} from './jobSubmissionGuard';

const roots: string[] = [];

function createGuard(): JobSubmissionGuard {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-submit-guard-'));
  roots.push(root);
  return new JobSubmissionGuard(root);
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('job submission guard', () => {
  it('uses the resolved script path as the stable idempotency intent', () => {
    const first = canonicalSubmissionIntent(
      'cd /home/u/run && bsub < code/step-04.sh; echo done; bjobs -w',
      { conversationKey: 'conv-1' },
    );
    const second = canonicalSubmissionIntent(
      'cd /home/u/run && bsub < code/step-04.sh',
      { conversationKey: 'conv-1' },
    );
    expect(first).toEqual(second);
    expect(first.intent).toBe('bsub:script:/home/u/run/code/step-04.sh');
    expect(resolveSubmissionScriptPath('cd /home/u/run && bsub < code/step-04.sh', {}))
      .toBe('/home/u/run/code/step-04.sh');
    expect(resolveSubmissionScriptPath('sbatch --partition normal /home/u/run/code/step-04.sh; squeue', {}))
      .toBe('/home/u/run/code/step-04.sh');
  });

  it('checks script syntax and exact module loads before submission', async () => {
    const exec = vi.fn(async () => '[HPCLAW_PREFLIGHT] OK');
    const result = await preflightJobSubmission(
      'cd /home/u/run && bsub < code/step-04.sh',
      {},
      exec,
    );
    expect(result.ok).toBe(true);
    expect(result.scriptPath).toBe('/home/u/run/code/step-04.sh');
    expect(exec).toHaveBeenCalledOnce();
    const command = exec.mock.calls[0][0];
    expect(command).toContain('bash -n "$hp_script"');
    expect(command).toContain('module load "$hp_module"');
  });

  it('reports a repairable preflight failure without submitting', async () => {
    const result = await preflightJobSubmission(
      'bsub < /home/u/run/code/step-04.sh',
      {},
      async () => { throw new Error('[HPCLAW_PREFLIGHT] unavailable module: Picard/2.23.9'); },
    );
    expect(result).toMatchObject({ checked: true, ok: false });
    expect(result.output).toContain('unavailable module: Picard/2.23.9');
  });

  it('serializes concurrent attempts before a scheduler job id exists', async () => {
    const guard = createGuard();
    const input = {
      sessionId: 'ssh-1',
      conversationKey: 'conv-1',
      command: 'bsub < /home/u/run/code/step-04.sh',
      scheduler: 'lsf' as const,
      exec: vi.fn(async () => ''),
      now: 1000,
    };
    const first = await guard.prepare(input);
    const second = await guard.prepare({ ...input, now: 1001 });
    expect(first.kind).toBe('execute');
    expect(second.kind).toBe('busy');
  });

  it('returns the existing live job instead of submitting the same script twice', async () => {
    const guard = createGuard();
    const base = {
      sessionId: 'ssh-1',
      conversationKey: 'conv-1',
      command: 'cd /home/u/run && bsub < code/step-04.sh',
      scheduler: 'lsf' as const,
    };
    const first = await guard.prepare({ ...base, exec: async () => '', now: 1000 });
    expect(first.kind).toBe('execute');
    if (first.kind !== 'execute') return;
    guard.complete(first.claim, ['75598502'], 1010);

    const probe = vi.fn(async () => '75598502 PEND\n');
    const retry = await guard.prepare({ ...base, exec: probe, now: 2000 });
    expect(retry.kind).toBe('reuse');
    if (retry.kind === 'reuse') expect(retry.record.jobIds).toEqual(['75598502']);
    expect(probe).toHaveBeenCalledOnce();
  });

  it('allows a new attempt after the previous scheduler job is terminal', async () => {
    const guard = createGuard();
    const base = {
      sessionId: 'ssh-1',
      workflowRunDir: '/home/u/run',
      command: 'bsub < code/step-04.sh',
      scheduler: 'lsf' as const,
    };
    const first = await guard.prepare({ ...base, exec: async () => '', now: 1000 });
    expect(first.kind).toBe('execute');
    if (first.kind !== 'execute') return;
    guard.complete(first.claim, ['75598502'], 1010);

    const retry = await guard.prepare({ ...base, exec: async () => '75598502 EXIT\n', now: 2000 });
    expect(retry.kind).toBe('execute');
    expect(retry.kind === 'execute' ? retry.claim.claimId : '').not.toBe(first.claim.claimId);
  });
});
