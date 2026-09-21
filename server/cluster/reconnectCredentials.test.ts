import { describe, expect, it, vi } from 'vitest';
import { buildReconnectCredentials } from './reconnectCredentials';

describe('buildReconnectCredentials', () => {
  const current = {
    host: 'cluster.example',
    port: 22,
    username: 'alice',
    password: 'old-password',
    verificationCode: '123456',
    expectedFingerprint: 'sha256:test',
  };

  it('generates a fresh code from the TOTP secret and keeps session identity', () => {
    const generate = vi.fn(() => '654321');
    expect(buildReconnectCredentials(current, {
      password: 'saved-password',
      totpSecret: 'JBSWY3DPEHPK3PXP',
    }, generate)).toEqual({
      ...current,
      password: 'saved-password',
      verificationCode: '654321',
    });
    expect(generate).toHaveBeenCalledWith('JBSWY3DPEHPK3PXP');
  });

  it('never reuses an expired one-time code when no TOTP secret is available', () => {
    expect(buildReconnectCredentials(current, undefined, () => 'unused').verificationCode).toBe('');
  });
});
