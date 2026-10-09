import { afterEach, describe, expect, it, vi } from 'vitest';
import { UserQuestions } from './userQuestions';

afterEach(() => vi.useRealTimers());
function fixture(extra = {}) {
  const manager = new UserQuestions(), events: any[] = [];
  const abort = new AbortController();
  const promise = manager.request({ id: 'q1', question: 'Which samples?', options: [{ label: 'A', description: 'Treatment' }, { label: 'B' }],
    signal: abort.signal, send: event => events.push(event), ...extra });
  return { manager, events, promise, abort };
}

describe('one-shot user questions', () => {
  it('registers before emitting, so an immediate answer is accepted', async () => {
    const manager = new UserQuestions();
    const result = manager.request({ id: 'q', question: 'Path?', options: [], signal: new AbortController().signal,
      send: event => { if (event.type === 'ask') expect(manager.respond('q', '/data')).toEqual({ success: true, reason: 'answered' }); } });
    expect(await result).toEqual({ selected: [], custom: '/data' });
  });
  it('retains descriptions, expiry and multiple selections in the actual answer', async () => {
    const { manager, promise, events } = fixture({ multiSelect: true });
    expect(events[0]).toMatchObject({ type: 'ask', id: 'q1', multiSelect: true, optionDetails: [{ label: 'A', description: 'Treatment' }, { label: 'B' }] });
    expect(events[0].expiresAt).toBeGreaterThan(Date.now());
    expect(manager.respond('q1', { selected: ['B', 'A', 'A'], custom: ' explanation ' }).success).toBe(true);
    expect(await promise).toEqual({ selected: ['B', 'A'], custom: 'explanation' });
    expect(manager.respond('q1', { selected: ['A'] })).toMatchObject({ success: false, reason: 'answered' });
    expect(events.filter(event => event.type === 'ask_resolved')).toHaveLength(1);
  });
  it.each([null, { selected: ['C'] }, { selected: ['A', 'B'] }, { selected: [] }, { selected: [42] }, { selected: [], custom: 42 }])('rejects invalid answers without consuming the question: %j', async input => {
    const { manager, promise } = fixture();
    expect(manager.respond('q1', input)).toMatchObject({ success: false, error: 'invalid_question_answer' });
    manager.respond('q1', 'A');
    expect(await promise).toEqual({ selected: ['A'] });
  });
  it('distinguishes expiry from cancellation and retains late-reply receipts', async () => {
    vi.useFakeTimers();
    const { manager, promise, events } = fixture({ timeoutMs: 50 });
    await vi.advanceTimersByTimeAsync(50);
    expect(await promise).toBeNull();
    expect(events[1]).toMatchObject({ type: 'ask_resolved', reason: 'expired', answered: false });
    expect(manager.respond('q1', 'A').reason).toBe('expired');
    const cancelled = fixture(); cancelled.abort.abort();
    expect(await cancelled.promise).toBeNull();
    expect(cancelled.events[1].reason).toBe('cancelled');
  });
  it('does not publish an already aborted question', async () => {
    const signal = new AbortController(); signal.abort();
    const { promise, events } = fixture({ signal: signal.signal });
    expect(await promise).toBeNull(); expect(events.some(event => event.type === 'ask')).toBe(false);
  });
});
