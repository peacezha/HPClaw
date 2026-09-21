import { describe, expect, it } from 'vitest';
import { normalizeRestoredTasks } from './transferStore';

describe('normalizeRestoredTasks', () => {
  it('restores incomplete work as paused without credentials or session ids', () => {
    const [task] = normalizeRestoredTasks([{
      id: 't1',
      state: 'running',
      sessionId: 'old',
      transferredBytes: 42,
      totalBytes: 100,
      bytesPerSecond: 5000,
      profileId: 'p1',
    } as any]);
    expect(task.state).toBe('paused');
    expect(task.sessionId).toBeUndefined();
    expect(JSON.stringify(task)).not.toContain('password');
  });

  it('drops completed and cancelled tasks, keeps failed for retry', () => {
    const tasks = normalizeRestoredTasks([
      { id: 't1', state: 'completed', profileId: 'p1' } as any,
      { id: 't2', state: 'cancelled', profileId: 'p1' } as any,
      { id: 't3', state: 'failed', profileId: 'p1' } as any,
      { id: 't4', state: 'paused', profileId: 'p1' } as any,
    ]);
    expect(tasks.map(t => t.id)).toEqual(['t3', 't4']);
    expect(tasks[0].state).toBe('failed');
    expect(tasks[1].state).toBe('paused');
  });

  it('resets bytesPerSecond to zero', () => {
    const [task] = normalizeRestoredTasks([{
      id: 't1', state: 'paused', bytesPerSecond: 999, profileId: 'p1',
    } as any]);
    expect(task.bytesPerSecond).toBe(0);
  });

  it('does not expose error for completed tasks', () => {
    const [task] = normalizeRestoredTasks([{
      id: 't1', state: 'failed', error: 'disk full', profileId: 'p1',
    } as any]);
    expect(task.state).toBe('failed');
    expect(task.error).toBe('disk full');
  });
});
