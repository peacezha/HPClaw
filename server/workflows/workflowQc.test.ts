import { afterEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import type { Server } from 'node:http';
import type { WorkflowRun, WorkflowRunPatch } from '../../shared/workflowRun';
import { buildWorkflowRunSummary, createWorkflowRun, updateWorkflowRun } from './workflowRunService';
import { registerWorkflowRunRoutes } from './registerWorkflowRunRoutes';

vi.mock('./workflowStore', () => ({ loadWorkflows: vi.fn(async () => []) }));

const runDir = '/home/qc/hpclaw_flows/qc/03_workspace/runs/qc-test';
function fixture(qc?: 'pass' | 'warn' | 'fail') {
  let stored: WorkflowRun = {
    runId: 'qc-test', workflowId: 'qc', workflowName: 'QC test', workflowVersion: 1,
    runDir, revision: 4, status: qc === 'fail' ? 'waiting_user' : 'running',
    currentStep: 1, totalSteps: 2, startedAt: 1, updatedAt: 2, heartbeatAt: 2,
    config: { inputs: [], params: {}, stepParams: {}, referenceOverrides: {}, skippedSteps: [], stepCommandOverrides: {} },
    steps: [
      { n: 1, stepId: 'qc', title: 'QC', status: qc ? 'done' : 'running',
        qc: qc ? { status: qc, metrics: { FRiP: '0.005', report: '/data/样本/qc.tsv' } } : undefined,
        qcCriteria: [{ afterStep: 1, metric: 'FRiP', pass: '>=0.01' }],
        evidence: ['results/qc.tsv'], summary: 'Read QC metrics from results/qc.tsv' },
      { n: 2, stepId: 'downstream', title: 'Downstream', status: 'pending' },
    ],
  };
  const exec = vi.fn(async (command: string) => {
    if (command.startsWith(`cat '${runDir}/run.json'`)) return JSON.stringify(stored);
    const encoded = command.match(/printf %s '([^']+)' \| base64 -d/)?.[1];
    if (encoded) {
      const raw = Buffer.from(encoded, 'base64').toString('utf8');
      if (raw.startsWith('{')) stored = JSON.parse(raw);
    }
    return '';
  });
  return { exec, get run() { return stored; }, update: (patch: WorkflowRunPatch, acknowledged = false) =>
    updateWorkflowRun(exec, '/home/qc', runDir, patch, { acknowledgeFailedQc: acknowledged }) };
}

describe('QC progression guard', () => {
  it('persists real metrics and pauses even when the QC process finished successfully', async () => {
    const env = fixture();
    const run = await env.update({ step: { n: 1, status: 'done', qc: { status: 'fail', metrics: { FRiP: '0.005' } } } });
    expect(run.status).toBe('waiting_user');
    expect(run.steps[0].status).toBe('done');
    expect(run.error).toContain('不建议继续下游分析');
    expect(run.steps[0].qc?.metrics).toEqual({ FRiP: '0.005' });
    expect(run.endedAt).toBeUndefined();
  });
  it('cannot clear a failure by changing RUN status, starting the next step, or forging an override', async () => {
    const env = fixture('fail');
    await expect(env.update({ step: { n: 2, status: 'running' } })).rejects.toThrow('不建议继续');
    const run = await env.update({ status: 'running', error: '', step: { n: 1, qcOverride: { approvedAt: 1000, revision: 4 } } });
    expect(run.status).toBe('waiting_user');
    expect(run.steps[0].qcOverride).toBeUndefined();
    expect(run.steps[1].status).toBe('pending');
    expect(run.error).toContain('不建议继续');
  });
  it('all steps done is not equivalent to QC passed', async () => {
    const env = fixture('fail');
    env.run.steps[1].status = 'done';
    const run = await env.update({ status: 'done' });
    expect(run.status).toBe('waiting_user');
    expect(run.reportPath).toBeUndefined();
  });
  it('only an explicit revision-bound acknowledgement allows progression, without changing QC', async () => {
    const env = fixture('fail');
    await expect(env.update({ status: 'running' }, true)).rejects.toThrow('revision');
    await expect(env.update({ status: 'running', expectedRevision: 3 }, true)).rejects.toThrow('当前 4');
    expect(env.run.revision).toBe(4);
    const run = await env.update({ status: 'running', expectedRevision: 4 }, true);
    expect(run.status).toBe('running');
    expect(run.steps[0].qc?.status).toBe('fail');
    expect(run.steps[0].qcOverride).toMatchObject({ revision: 4 });
    expect(run.steps[0].qcOverride?.approvedAt).toBeGreaterThan(0);
    const progressed = await env.update({ step: { n: 2, status: 'running' } });
    expect(progressed.currentStep).toBe(2);
    const report = buildWorkflowRunSummary(progressed);
    expect(report).toContain('不建议继续下游分析');
    expect(report).toContain('这不代表质控通过');
    expect(report).toContain('FRiP: 0.005');
  });
  it('a new failed assessment invalidates old consent and cannot silently reuse it', async () => {
    const env = fixture('fail');
    await env.update({ expectedRevision: 4, status: 'running' }, true);
    const run = await env.update({ step: { n: 1, qc: { status: 'fail', metrics: { FRiP: '0.004' } } } });
    expect(run.status).toBe('waiting_user');
    expect(run.steps[0].qcOverride).toBeUndefined();
    await expect(env.update({ step: { n: 2, status: 'running' } })).rejects.toThrow('不建议继续');
  });
  it('warnings are visible but not misclassified as failures; a new pass clears a QC pause', async () => {
    const warned = fixture('warn');
    const run = await warned.update({ step: { n: 2, status: 'running' } });
    expect(run.status).toBe('running');
    expect(buildWorkflowRunSummary(run)).toContain('质控存在警告');
    const failed = fixture('fail');
    await failed.update({ status: 'running' });
    const passed = await failed.update({ step: { n: 1, qc: { status: 'pass', metrics: { FRiP: '0.05' } } } });
    expect(passed.error).toBeUndefined();
    expect((await failed.update({ step: { n: 2, status: 'running' } })).status).toBe('running');
  });
  it('declared QC requires a valid assessment, not just exit success or an invalid QC object', async () => {
    const env = fixture();
    await expect(env.update({ step: { n: 1, status: 'done', evidence: ['exit code 0'] } })).rejects.toThrow('实际指标');
    await expect(env.update({ step: { n: 1, status: 'done', qc: { status: 'invalid' } as any } })).rejects.toThrow('实际指标');
    const run = await env.update({ step: { n: 1, status: 'done', qc: { status: 'pass', metrics: { FRiP: '0.05' } } } });
    expect(run.steps[0].status).toBe('done');
  });
  it('rerun resets verdict and consent but retains declared criteria', async () => {
    const env = fixture('fail');
    await env.update({ status: 'running', expectedRevision: 4 }, true);
    const run = await env.update({ restartFromStep: 1 });
    expect(run.steps[0].qc).toBeUndefined();
    expect(run.steps[0].qcOverride).toBeUndefined();
    expect(run.steps[0].qcCriteria).toHaveLength(1);
    expect(run.status).toBe('running');
  });
  it('copies each declared QC gate into the corresponding new RUN step', async () => {
    const exec = vi.fn(async () => '');
    const run = await createWorkflowRun(exec, '/home/qc', {
      id: 'gates', name: 'QC', description: '', keywords: [], params: [], source: 'user', createdAt: 1, updatedAt: 1,
      steps: [{ title: 'QC', command: 'echo qc' }, { title: 'Downstream', command: 'echo next' }],
      manifest: { software: [], references: [], qcGates: [{ afterStep: 1, metric: 'FRiP', pass: '>=0.01' }] },
    }, {}, true);
    expect(run.steps[0].qcCriteria).toEqual([{ afterStep: 1, metric: 'FRiP', pass: '>=0.01' }]);
    expect(run.steps[1].qcCriteria).toEqual([]);
  });
});

const servers: Server[] = [];
afterEach(async () => { await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve())))); });
async function api(env = fixture('fail'), authenticated = true) {
  const app = express();
  app.use(express.json());
  registerWorkflowRunRoutes(app, () => authenticated ? { sessionId: 'qc-session', home: '/home/qc', exec: env.exec } : undefined);
  const server = app.listen(0, '127.0.0.1');
  servers.push(server);
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address() as { port: number };
  return { env, post: (body: object) => fetch(`http://127.0.0.1:${address.port}/api/workflow-runs/resume`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ runDir, ...body }),
  }) };
}

describe('QC resume API', () => {
  it('requires a cluster session', async () => {
    const { post } = await api(fixture('fail'), false);
    expect((await post({ expectedRevision: 4, acknowledgeFailedQc: true })).status).toBe(401);
  });
  it.each([undefined, false, 'true'])('cannot bypass QC without a literal acknowledgement (%s)', async flag => {
    const { post, env } = await api();
    const response = await post({ expectedRevision: 4, acknowledgeFailedQc: flag });
    expect(response.status).toBe(409);
    expect((await response.json()).error).toContain('不建议继续');
    expect(env.run.revision).toBe(4);
  });
  it('requires fresh revision, allows explicit confirmation and preserves failure evidence', async () => {
    const { post, env } = await api();
    expect((await post({ acknowledgeFailedQc: true })).status).toBe(409);
    expect((await post({ expectedRevision: 3, acknowledgeFailedQc: true })).status).toBe(409);
    const response = await post({ expectedRevision: 4, acknowledgeFailedQc: true });
    expect(response.status).toBe(200);
    const { run } = await response.json();
    expect(run.status).toBe('running');
    expect(run.steps[0].qc.status).toBe('fail');
    expect(run.steps[0].qcOverride.revision).toBe(4);
    expect(env.run.revision).toBe(5);
  });
});
