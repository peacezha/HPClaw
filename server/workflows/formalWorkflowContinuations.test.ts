import { afterEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  addFormalWorkflowContinuations,
  FORMAL_RECONCILE_MAX_ATTEMPTS,
  handleFormalReconcileFailure,
  initFormalWorkflowContinuations,
  isFormalWorkflowReconcileDue,
  listPendingFormalWorkflowContinuations,
  markFormalWorkflowJobFinished,
  markFormalWorkflowResuming,
  markFormalWorkflowWaitingUser,
  noteFormalWorkflowReconcileAttempt,
  reconcileBackoffMs,
  removeFormalWorkflowContinuation,
  resetFormalWorkflowReconcileAttempts,
} from './formalWorkflowContinuations';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function setup() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'trace-continuation-'));
  roots.push(root);
  initFormalWorkflowContinuations(root);
  return { host: 'HPC.EXAMPLE', port: 22, username: 'Lin' };
}

function setupRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'trace-continuation-'));
  roots.push(root);
  initFormalWorkflowContinuations(root);
  return { root, connection: { host: 'hpc.example', port: 22, username: 'lin' } };
}

describe('formal workflow continuations', () => {
  it('restores pending jobs by stable connection identity instead of transient session id', () => {
    const connection = setup();
    const [record] = addFormalWorkflowContinuations(['48217'], {
      runDir: '/home/lin/trace_flows/rna/RUN-1', workflowId: 'rna', runId: 'RUN-1', connection, sessionId: 'old-session',
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
  it('retains conversation metadata across restart and does not undo an explicit pause on duplicate DONE', () => {
    const connection = setup();
    const [record] = addFormalWorkflowContinuations(['123'], {
      runDir: '/run', workflowId: 'wf', runId: 'r', connection,
      conversationId: 'original-chat', locale: 'en-US', confirmationPolicy: 'dangerous',
    });
    markFormalWorkflowJobFinished(connection, '123', 'DONE', 'new-session');
    expect(listPendingFormalWorkflowContinuations(connection)[0]).toMatchObject({
      conversationId: 'original-chat', locale: 'en-US', terminalStatus: 'DONE', state: 'job_finished',
    });
    markFormalWorkflowWaitingUser(record.id);
    expect(markFormalWorkflowJobFinished(connection, '123', 'DONE', 'new-session')).toEqual([]);
    expect(listPendingFormalWorkflowContinuations(connection)).toEqual([]);
  });
});

describe('对账失败退避与暂停', () => {
  it('退避序列 45s→2min→5min→15min 封顶', () => {
    expect(reconcileBackoffMs(1)).toBe(45_000);
    expect(reconcileBackoffMs(2)).toBe(120_000);
    expect(reconcileBackoffMs(3)).toBe(300_000);
    expect(reconcileBackoffMs(4)).toBe(900_000);
    expect(reconcileBackoffMs(99)).toBe(900_000);
  });

  it('失败计数递增并按退避到期；成功后清零重新计', () => {
    const { connection } = setupRoot();
    const [record] = addFormalWorkflowContinuations(['801'], {
      runDir: '/run', workflowId: 'wf', runId: 'r-801', connection,
    });
    // 新记录（无失败）立即到期
    expect(isFormalWorkflowReconcileDue(record, 1_000_000)).toBe(true);

    const t0 = 1_000_000;
    let current = noteFormalWorkflowReconcileAttempt(record.id, t0)!;
    expect(current.reconcileAttempts).toBe(1);
    expect(current.lastAttemptAt).toBe(t0);
    expect(isFormalWorkflowReconcileDue(current, t0 + 44_999)).toBe(false);
    expect(isFormalWorkflowReconcileDue(current, t0 + 45_000)).toBe(true);

    current = noteFormalWorkflowReconcileAttempt(record.id, t0 + 45_000)!;
    expect(current.reconcileAttempts).toBe(2);
    expect(isFormalWorkflowReconcileDue(current, t0 + 45_000 + 119_999)).toBe(false);
    expect(isFormalWorkflowReconcileDue(current, t0 + 45_000 + 120_000)).toBe(true);

    noteFormalWorkflowReconcileAttempt(record.id, t0 + 200_000);
    current = noteFormalWorkflowReconcileAttempt(record.id, t0 + 400_000)!;
    expect(current.reconcileAttempts).toBe(4);
    expect(isFormalWorkflowReconcileDue(current, t0 + 400_000 + 899_999)).toBe(false);
    expect(isFormalWorkflowReconcileDue(current, t0 + 400_000 + 900_000)).toBe(true);

    // 第 5 次起封顶 15min
    current = noteFormalWorkflowReconcileAttempt(record.id, t0 + 1_400_000)!;
    expect(current.reconcileAttempts).toBe(5);
    expect(isFormalWorkflowReconcileDue(current, t0 + 1_400_000 + 899_999)).toBe(false);
    expect(isFormalWorkflowReconcileDue(current, t0 + 1_400_000 + 900_000)).toBe(true);

    // 计数持久化：重新加载后仍在
    const persisted = listPendingFormalWorkflowContinuations(connection)[0];
    expect(persisted.reconcileAttempts).toBe(5);
    expect(persisted.lastAttemptAt).toBe(t0 + 1_400_000);

    resetFormalWorkflowReconcileAttempts(record.id);
    const cleared = listPendingFormalWorkflowContinuations(connection)[0];
    expect(cleared.reconcileAttempts ?? 0).toBe(0);
    expect(cleared.lastAttemptAt).toBeUndefined();
    expect(isFormalWorkflowReconcileDue(cleared, t0 + 1_400_001)).toBe(true);
  });

  it('兼容旧版落盘记录：缺少 reconcileAttempts/lastAttemptAt 时按 0 处理并立即到期', () => {
    const { root, connection } = setupRoot();
    const [record] = addFormalWorkflowContinuations(['802'], {
      runDir: '/run', workflowId: 'wf', runId: 'r-802', connection,
    });
    noteFormalWorkflowReconcileAttempt(record.id, 1234);
    // 模拟旧版本写出的文件：剥掉新字段后重新加载
    const file = path.join(root, 'formal-workflow-continuations.json');
    const legacy = JSON.parse(fs.readFileSync(file, 'utf8')).map((item: Record<string, unknown>) => {
      delete item.reconcileAttempts;
      delete item.lastAttemptAt;
      return item;
    });
    fs.writeFileSync(file, JSON.stringify(legacy));
    initFormalWorkflowContinuations(root);
    const loaded = listPendingFormalWorkflowContinuations(connection)[0];
    expect(loaded.id).toBe(record.id);
    expect(loaded.reconcileAttempts).toBeUndefined();
    expect(loaded.lastAttemptAt).toBeUndefined();
    expect(isFormalWorkflowReconcileDue(loaded, Date.now())).toBe(true);
  });

  it('连续失败未达上限只重试；达到上限暂停为 waiting_user、写明恢复方式并通知', async () => {
    const { connection } = setupRoot();
    const [record] = addFormalWorkflowContinuations(['901'], {
      runDir: '/run', workflowId: 'wf', runId: 'r-901', connection,
    });
    const paused: Array<{ runDir: string; error: string }> = [];
    const notifications: Array<{ title: string; content: string }> = [];
    const deps = {
      pauseRun: async (runDir: string, error: string) => { paused.push({ runDir, error }); },
      notify: (title: string, content: string) => { notifications.push({ title, content }); },
    };
    for (let i = 1; i < FORMAL_RECONCILE_MAX_ATTEMPTS; i++) {
      const result = await handleFormalReconcileFailure(record, deps);
      expect(result).toEqual({ action: 'retry', attempts: i });
    }
    expect(paused).toHaveLength(0);
    expect(notifications).toHaveLength(0);
    expect(listPendingFormalWorkflowContinuations(connection)).toHaveLength(1);

    const final = await handleFormalReconcileFailure(record, deps);
    expect(final.action).toBe('pause');
    expect(final.attempts).toBe(FORMAL_RECONCILE_MAX_ATTEMPTS);
    expect(paused).toHaveLength(1);
    expect(paused[0].runDir).toBe('/run');
    expect(paused[0].error).toContain('连续失败 8 次');
    expect(paused[0].error).toContain('作业未被取消');
    expect(paused[0].error).toContain('继续');
    expect(notifications).toHaveLength(1);
    expect(notifications[0].content).toContain('r-901');
    // 记录已转 waiting_user，sweep 不会再捞起
    expect(listPendingFormalWorkflowContinuations(connection)).toEqual([]);
  });

  it('pauseRun 失败不影响暂停决策与通知', async () => {
    const { connection } = setupRoot();
    const [record] = addFormalWorkflowContinuations(['902'], {
      runDir: '/run', workflowId: 'wf', runId: 'r-902', connection,
    });
    let attempts = 0;
    const notifications: string[] = [];
    for (let i = 0; i < FORMAL_RECONCILE_MAX_ATTEMPTS; i++) {
      const result = await handleFormalReconcileFailure(record, {
        pauseRun: async () => { throw new Error('cluster still slow'); },
        notify: (_t: string, c: string) => { notifications.push(c); },
      });
      attempts = result.attempts;
    }
    expect(attempts).toBe(FORMAL_RECONCILE_MAX_ATTEMPTS);
    expect(notifications).toHaveLength(1);
    expect(listPendingFormalWorkflowContinuations(connection)).toEqual([]);
  });
});
