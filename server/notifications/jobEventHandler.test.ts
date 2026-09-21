import { describe, expect, it, vi } from 'vitest';
import { createJobEventHandler } from './jobEventHandler';
import type { JobEvent } from './jobWatcher';

function makeEvent(overrides: Partial<JobEvent> = {}): JobEvent {
  return {
    jobId: '424242',
    name: 'Agent Job 424242',
    status: 'DONE',
    queue: 'normal',
    time: Date.now(),
    notified: false,
    excerpt: 'result tail',
    ...overrides,
  };
}

describe('createJobEventHandler', () => {
  it('dispatches reconcile, job:finished socket event and both resume chains', () => {
    const deps = {
      reconcileWorkflow: vi.fn(),
      emitToRoom: vi.fn(),
      resumeDshAgent: vi.fn(),
      resumeLegacyAgent: vi.fn(),
    };
    const handler = createJobEventHandler(deps);
    const event = makeEvent();
    handler(event, 'ssh-1');

    expect(deps.reconcileWorkflow).toHaveBeenCalledWith('ssh-1', '424242', 'DONE');
    // job:finished 推送 JobEvent 本体（含 excerpt），房间路由由 server.ts 的 emitToRoom 装配
    expect(deps.emitToRoom).toHaveBeenCalledWith('ssh-1', 'job:finished', event);
    const evt = { sessionId: 'ssh-1', jobId: '424242', status: 'DONE' };
    expect(deps.resumeDshAgent).toHaveBeenCalledWith(evt);
    expect(deps.resumeLegacyAgent).toHaveBeenCalledWith(evt);
  });

  it('works with partial deps (missing hooks are skipped)', () => {
    const handler = createJobEventHandler({});
    expect(() => handler(makeEvent(), 'ssh-1')).not.toThrow();
  });

  it('passes EXIT status through to the workflow reconciler and resumers', () => {
    const deps = { reconcileWorkflow: vi.fn(), resumeLegacyAgent: vi.fn() };
    createJobEventHandler(deps)(makeEvent({ status: 'EXIT' }), 'ssh-2');
    expect(deps.reconcileWorkflow).toHaveBeenCalledWith('ssh-2', '424242', 'EXIT');
    expect(deps.resumeLegacyAgent).toHaveBeenCalledWith({ sessionId: 'ssh-2', jobId: '424242', status: 'EXIT' });
  });
});
