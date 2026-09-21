import { describe, expect, it } from 'vitest';
import { selectDshEngine } from './engineRouter';

describe('selectDshEngine', () => {
  it('routes plain agent mode with a supported provider to dsh by default', () => {
    expect(selectDshEngine({ mode: 'agent', hasWorkflowRunContext: false, provider: 'deepseek' }))
      .toEqual({ engine: 'dsh', reason: 'default' });
  });

  it('lets env=legacy veto everything', () => {
    expect(selectDshEngine({ envEngine: 'legacy', mode: 'agent', hasWorkflowRunContext: false, provider: 'deepseek' }))
      .toEqual({ engine: 'legacy', reason: 'env override' });
  });

  it('routes workflow run contexts to legacy even with env=dsh', () => {
    expect(selectDshEngine({ envEngine: 'dsh', mode: 'agent', hasWorkflowRunContext: true, provider: 'deepseek' }))
      .toEqual({ engine: 'legacy', reason: 'workflow run context' });
  });

  it('routes every non-DeepSeek provider to legacy even with env=dsh', () => {
    for (const provider of ['gemini', 'openai', 'grok', 'moonshot', 'custom-openai']) {
      expect(selectDshEngine({ envEngine: 'dsh', mode: 'agent', hasWorkflowRunContext: false, provider }))
        .toEqual({ engine: 'legacy', reason: 'provider not supported by dsh' });
    }
  });

  it('routes non-agent modes to legacy', () => {
    for (const mode of ['chat', 'analysis', 'autocomplete']) {
      expect(selectDshEngine({ mode, hasWorkflowRunContext: false, provider: 'deepseek' }))
        .toEqual({ engine: 'legacy', reason: 'non-agent mode' });
    }
    expect(selectDshEngine({ envEngine: 'dsh', mode: 'chat', hasWorkflowRunContext: false, provider: 'deepseek' }))
      .toEqual({ engine: 'legacy', reason: 'non-agent mode' });
  });

  it('honors env=dsh when no other rule forces legacy', () => {
    expect(selectDshEngine({ envEngine: 'dsh', mode: 'agent', hasWorkflowRunContext: false, provider: 'deepseek' }))
      .toEqual({ engine: 'dsh', reason: 'env override' });
  });

  it('lets the user select native or dsh for compatible agent requests', () => {
    expect(selectDshEngine({ requestedEngine: 'native', mode: 'agent', hasWorkflowRunContext: false, provider: 'deepseek' }))
      .toEqual({ engine: 'legacy', reason: 'user selected native' });
    expect(selectDshEngine({ requestedEngine: 'dsh', mode: 'agent', hasWorkflowRunContext: false, provider: 'deepseek' }))
      .toEqual({ engine: 'dsh', reason: 'user selected dsh' });
  });

  it('keeps structured workflows on the native engine even when dsh is selected', () => {
    expect(selectDshEngine({ requestedEngine: 'dsh', mode: 'agent', hasWorkflowRunContext: true, provider: 'deepseek' }))
      .toEqual({ engine: 'legacy', reason: 'workflow run context' });
  });

  it('applies env=legacy before the other constraints', () => {
    expect(selectDshEngine({ envEngine: 'legacy', mode: 'chat', hasWorkflowRunContext: true, provider: 'gemini' }))
      .toEqual({ engine: 'legacy', reason: 'env override' });
  });
});
