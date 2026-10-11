import { describe, expect, it } from 'vitest';
import { JobWakeQueue } from './jobWakeQueue';

describe('job wake queue', () => {
  it('retains distinct completions, ignores an in-flight duplicate and serializes the same RUN', async () => {
    const queue = new JobWakeQueue();
    const calls: string[] = [];
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const first = queue.enqueue('run', 'job1', async () => { calls.push('start1'); await gate; calls.push('end1'); });
    const second = queue.enqueue('run', 'job2', async () => { calls.push('job2'); });
    await queue.enqueue('run', 'job1', async () => { throw new Error('duplicate'); });
    await queue.enqueue('other-run', 'job3', async () => { calls.push('job3'); });
    expect(calls).toEqual(['start1', 'job3']);
    release();
    await Promise.all([first, second]);
    expect(calls).toEqual(['start1', 'job3', 'end1', 'job2']);
  });

  it('does not strand later events when the first handler fails', async () => {
    const queue = new JobWakeQueue();
    const first = queue.enqueue('run', '1', async () => { throw new Error('transient read'); });
    let completed = false;
    const second = queue.enqueue('run', '2', async () => { completed = true; });
    await expect(first).rejects.toThrow('transient read');
    await second;
    expect(completed).toBe(true);
  });
});
