// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { clearWorkflowHabits, getWorkflowHabitSuggestion, recordWorkflowHabit } from './workflowHabits';

describe('workflow habits', () => {
  beforeEach(() => localStorage.clear());

  it('suggests only repeated values after at least two uses', () => {
    const sample = { params: { queue: 'normal', threads: '8' }, stepParams: { 1: { mode: 'strict' } }, skippedSteps: [3] };
    recordWorkflowHabit('qc', sample);
    expect(getWorkflowHabitSuggestion('qc')).toBeNull();
    recordWorkflowHabit('qc', sample);
    expect(getWorkflowHabitSuggestion('qc')).toMatchObject({
      params: { queue: 'normal', threads: '8' },
      stepParams: { 1: { mode: 'strict' } },
      skippedSteps: [3],
      sampleCount: 2,
    });
  });

  it('never stores paths or token-like secrets and can be cleared', () => {
    recordWorkflowHabit('safe', {
      params: { input: '/data/private', token: 'a'.repeat(90), queue: 'normal' },
      stepParams: {},
      skippedSteps: [],
    });
    recordWorkflowHabit('safe', {
      params: { input: '/data/private', token: 'a'.repeat(90), queue: 'normal' },
      stepParams: {},
      skippedSteps: [],
    });
    expect(getWorkflowHabitSuggestion('safe')?.params).toEqual({ queue: 'normal' });
    clearWorkflowHabits('safe');
    expect(getWorkflowHabitSuggestion('safe')).toBeNull();
  });
});
