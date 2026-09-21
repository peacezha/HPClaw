import { describe, expect, it } from 'vitest';
import { resolveTransferProfileId } from './sessionIdentity';

describe('resolveTransferProfileId', () => {
  it('uses the active profile when one is connected', () => {
    expect(resolveTransferProfileId({
      activeProfileId: 'profile-1',
      profileId: 'profile-prop',
      sessionId: 'ssh-1',
    })).toBe('profile-1');
  });

  it('falls back to the prop profile id', () => {
    expect(resolveTransferProfileId({
      activeProfileId: '',
      profileId: 'profile-prop',
      sessionId: 'ssh-1',
    })).toBe('profile-prop');
  });

  it('falls back to a stable current-session id for main login sessions without a profile', () => {
    expect(resolveTransferProfileId({
      activeProfileId: '',
      profileId: undefined,
      sessionId: 'ssh-1',
    })).toBe('session:ssh-1');
  });
});
