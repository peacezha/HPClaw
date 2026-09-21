import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerLegacyJobBindings } from './legacyJobBindings';
import { getBinding, initJobAgentBindings, listBindings } from '../dsh/jobAgentBindings';

let tmpDir = '';

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'legacy-bindings-test-'));
  initJobAgentBindings(tmpDir);
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('registerLegacyJobBindings', () => {
  it('registers bindings with the legacy engine marker and aligned fields', () => {
    const added = registerLegacyJobBindings('ssh-1', ['424242', '424243'], {
      conversationKey: 'ssh-1:saved-conv-1',
      conversationId: 'conv-1',
      workspace: '/data/work',
      confirmationPolicy: 'state_changes',
      profile: { provider: 'deepseek', model: 'deepseek-chat', baseUrl: 'https://api.deepseek.com' },
      locale: 'zh-CN',
    });
    expect(added).toBe(2);

    const binding = getBinding('424242', 'ssh-1');
    expect(binding).toMatchObject({
      jobId: '424242',
      sshSessionId: 'ssh-1',
      conversationKey: 'ssh-1:saved-conv-1',
      dshSessionId: '',
      engine: 'legacy',
      conversationId: 'conv-1',
      workspace: '/data/work',
      confirmationPolicy: 'state_changes',
      profile: { provider: 'deepseek', model: 'deepseek-chat', baseUrl: 'https://api.deepseek.com' },
      locale: 'zh-CN',
      resumeCount: 0,
    });
  });

  it('dedupes by jobId+sshSessionId without double counting', () => {
    const meta = { conversationKey: 'k', conversationId: 'c' };
    expect(registerLegacyJobBindings('ssh-1', ['100'], meta)).toBe(1);
    expect(registerLegacyJobBindings('ssh-1', ['100'], meta)).toBe(0);
    expect(registerLegacyJobBindings('ssh-2', ['100'], meta)).toBe(1);
    expect(listBindings()).toHaveLength(2);
  });
});
