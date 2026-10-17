import { describe, expect, it } from 'vitest';
import { AgentTurnClock } from './agentTurnClock';
describe('active Agent execution clock', () => {
  it('excludes human waiting and resumes the same remaining budget', () => {
    let now = 0; const clock = new AgentTurnClock(() => now);
    now = 10 * 60_000; clock.observe({ type: 'ask', id: 'q1' });
    now += 12 * 60_000; clock.observe({ type: 'ask', id: 'q1' });
    expect(clock.snapshot()).toMatchObject({ activeMs: 10 * 60_000, waitingHuman: true });
    clock.observe({ type: 'ask_resolved', id: 'q1', reason: 'answered' });
    now += 4 * 60_000;
    expect(clock.snapshot()).toMatchObject({ activeMs: 14 * 60_000, humanWaitMs: 12 * 60_000, waitingHuman: false });
  });
  it('waits until every question/approval resolves', () => {
    let now = 0; const clock = new AgentTurnClock(() => now);
    clock.observe({ type: 'ask', id: 'q' }); clock.observe({ type: 'confirm', id: 'c' });
    now = 900_000; clock.observe({ type: 'ask_resolved', id: 'q' });
    expect(clock.snapshot().waitingHuman).toBe(true);
    clock.observe({ type: 'confirm_resolved', id: 'c' });
    expect(clock.snapshot()).toMatchObject({ activeMs: 0, humanWaitMs: 900_000, waitingHuman: false });
  });
  it('reports the tool and stage duration, not a supposed cluster hang', () => {
    let now = 0; const clock = new AgentTurnClock(() => now);
    clock.observe({ type: 'tool_call', name: 'run_command' });
    now = 60_000; clock.observe({ type: 'status', phase: 'working' });
    now = 900_000;
    expect(clock.snapshot()).toMatchObject({ activeMs: 900_000, stage: 'waiting_tool', stageMs: 900_000, lastTool: 'run_command', lastEventAgeMs: 840_000 });
  });
  it('treats plan review as a human wait that does not consume the active budget', () => {
    let now = 0; const clock = new AgentTurnClock(() => now);
    clock.observe({ type: 'plan_review', id: 'pr1' });
    now += 10 * 60_000;
    expect(clock.snapshot()).toMatchObject({ activeMs: 0, waitingHuman: true, stage: 'waiting_approval' });
    clock.observe({ type: 'plan_review_resolved', id: 'pr1', reason: 'approved' });
    expect(clock.snapshot()).toMatchObject({ waitingHuman: false, stage: 'resuming' });
    now += 30_000;
    expect(clock.snapshot()).toMatchObject({ activeMs: 30_000, humanWaitMs: 10 * 60_000 });
  });
});
