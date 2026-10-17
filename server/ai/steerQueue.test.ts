import { describe, expect, it } from 'vitest';
import { SteerQueue } from './steerQueue';

describe('steer queue', () => {
  it('queues texts per request and take() drains them in order', () => {
    const queue = new SteerQueue();
    expect(queue.enqueue('r1', '先别提交作业')).toBe(1);
    expect(queue.enqueue('r1', '  换成 bsub -q normal  ')).toBe(2);
    expect(queue.enqueue('r2', '另一个请求的插话')).toBe(1);
    expect(queue.has('r1')).toBe(true);
    expect(queue.take('r1')).toEqual(['先别提交作业', '换成 bsub -q normal']);
    expect(queue.has('r1')).toBe(false);
    expect(queue.take('r1')).toEqual([]);
    expect(queue.take('r2')).toEqual(['另一个请求的插话']);
  });

  it('rejects empty text and caps per-request backlog', () => {
    const queue = new SteerQueue();
    expect(queue.enqueue('r1', '   ')).toBe(0);
    for (let i = 0; i < 20; i++) queue.enqueue('r1', `插话 ${i}`);
    expect(queue.enqueue('r1', '溢出')).toBe(0);
    expect(queue.take('r1')).toHaveLength(20);
  });

  it('truncates oversized text and drain() marks the turn finished', () => {
    const queue = new SteerQueue();
    queue.enqueue('r1', 'x'.repeat(5_000));
    const drained = queue.drain('r1');
    expect(drained[0]).toHaveLength(2_000);
    expect(queue.has('r1')).toBe(false);
  });

  it('clear() removes a request without affecting others', () => {
    const queue = new SteerQueue();
    queue.enqueue('r1', 'a');
    queue.enqueue('r2', 'b');
    queue.clear('r1');
    expect(queue.take('r1')).toEqual([]);
    expect(queue.take('r2')).toEqual(['b']);
  });
});
