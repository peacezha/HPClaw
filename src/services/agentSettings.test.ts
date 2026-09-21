// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadAgentSettings, normalizeAgentSettings, saveAgentSettings } from './agentSettings';

describe('agent settings', () => {
  beforeEach(() => localStorage.clear());

  it('uses safe bounded defaults', () => {
    expect(normalizeAgentSettings({ maxCommands: 999, maxSteps: 1 })).toEqual({
      engine: 'auto',
      planningPolicy: 'auto',
      confirmationPolicy: 'dangerous',
      maxCommands: 200,
      maxSteps: 10,
    });
  });

  it('defaults new installations to a longer 200-step run', () => {
    expect(loadAgentSettings()).toMatchObject({
      maxCommands: 40,
      maxSteps: 200,
    });
  });

  it('migrates the hidden legacy 50-step default without overriding a new explicit 50', () => {
    localStorage.setItem('hpclaw_agent_settings', JSON.stringify({ maxCommands: 40, maxSteps: 50 }));
    expect(loadAgentSettings().maxSteps).toBe(200);

    saveAgentSettings({ maxCommands: 40, maxSteps: 50 });
    expect(loadAgentSettings().maxSteps).toBe(50);
  });

  it('allows the new upper limits but still clamps oversized values', () => {
    expect(normalizeAgentSettings({ maxCommands: 200, maxSteps: 500 })).toMatchObject({ maxCommands: 200, maxSteps: 500 });
    expect(normalizeAgentSettings({ maxCommands: 201, maxSteps: 501 })).toMatchObject({ maxCommands: 200, maxSteps: 500 });
  });

  it('persists user policy choices', () => {
    saveAgentSettings({ engine: 'native', planningPolicy: 'always', confirmationPolicy: 'state_changes', maxCommands: 20, maxSteps: 30 });
    expect(loadAgentSettings()).toMatchObject({
      engine: 'native',
      planningPolicy: 'always',
      confirmationPolicy: 'state_changes',
      maxCommands: 20,
      maxSteps: 30,
    });
  });

  it('supports explicitly selecting dsh while rejecting unknown engines', () => {
    expect(normalizeAgentSettings({ engine: 'dsh' }).engine).toBe('dsh');
    expect(normalizeAgentSettings({ engine: 'other' }).engine).toBe('auto');
  });
});
