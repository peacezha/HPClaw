import { describe, expect, it, vi } from 'vitest';
import { restoreJobAgentBindings } from './jobBindingRestore';
import type { JobAgentBinding } from '../dsh/jobAgentBindings';

function makeBinding(overrides: Partial<JobAgentBinding> = {}): JobAgentBinding {
  return {
    jobId: '424242',
    sshSessionId: 'ssh-1',
    conversationKey: 'ssh-1:saved-conv-1',
    dshSessionId: 'dsh-sess-1',
    submittedAt: Date.now(),
    resumeCount: 0,
    ...overrides,
  };
}

describe('restoreJobAgentBindings', () => {
  it('re-tracks only un-resumed bindings of the current session', () => {
    const trackJobs = vi.fn();
    const restored = restoreJobAgentBindings('ssh-1', {
      listBindings: () => [
        makeBinding({ jobId: '111' }),                                   // 本会话未唤醒 → 恢复
        makeBinding({ jobId: '222', engine: 'legacy', dshSessionId: '' }), // legacy 绑定同样恢复
        makeBinding({ jobId: '333', resumeCount: 1 }),                   // 已唤醒过 → 不重复
        makeBinding({ jobId: '444', sshSessionId: 'ssh-2' }),            // 别的会话 → 不管
      ],
      trackJobs,
    });
    expect(restored).toBe(2);
    expect(trackJobs).toHaveBeenCalledWith('ssh-1', ['111', '222']);
  });

  it('does nothing when there is no pending binding', () => {
    const trackJobs = vi.fn();
    const restored = restoreJobAgentBindings('ssh-1', { listBindings: () => [], trackJobs });
    expect(restored).toBe(0);
    expect(trackJobs).not.toHaveBeenCalled();
  });

  it('never throws when the binding store is unreadable', () => {
    const restored = restoreJobAgentBindings('ssh-1', {
      listBindings: () => { throw new Error('store corrupted'); },
    });
    expect(restored).toBe(0);
  });
});
