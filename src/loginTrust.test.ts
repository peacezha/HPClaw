// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import {
  getStoredFingerprint,
  loginWithFingerprintConfirmation,
  storeTrustedFingerprint,
  type LoginCredentials,
} from './loginTrust';

const credentials: LoginCredentials = {
  host: 'hpc.example.edu',
  port: '22',
  username: 'lin',
  password: 'secret',
  verificationCode: '123456',
};

describe('loginWithFingerprintConfirmation', () => {
  it('asks the web user to trust a required host fingerprint and retries with that exact fingerprint', async () => {
    const request = vi.fn()
      .mockResolvedValueOnce({ ok: false, data: { code: 'HOST_FINGERPRINT_REQUIRED', fingerprint: 'SHA256:new-host' } })
      .mockResolvedValueOnce({ ok: true, data: { success: true, sessionId: 'session-1' } });
    const confirmFingerprint = vi.fn(async () => true);

    const result = await loginWithFingerprintConfirmation(credentials, { request, confirmFingerprint });

    expect(confirmFingerprint).toHaveBeenCalledWith('SHA256:new-host');
    expect(request).toHaveBeenNthCalledWith(1, credentials);
    expect(request).toHaveBeenNthCalledWith(2, {
      ...credentials,
      expectedFingerprint: 'SHA256:new-host',
    });
    expect(result).toEqual({
      ok: true,
      data: { success: true, sessionId: 'session-1' },
      trustedFingerprint: 'SHA256:new-host',
    });
  });

  it('does not retry or trust a fingerprint when the user declines confirmation', async () => {
    const required = { ok: false, data: { code: 'HOST_FINGERPRINT_REQUIRED', fingerprint: 'SHA256:new-host' } };
    const request = vi.fn().mockResolvedValue(required);
    const confirmFingerprint = vi.fn(async () => false);

    await expect(loginWithFingerprintConfirmation(credentials, { request, confirmFingerprint })).resolves.toEqual(required);
    expect(request).toHaveBeenCalledOnce();
    expect(confirmFingerprint).toHaveBeenCalledWith('SHA256:new-host');
  });

  it('stores trusted fingerprints by host, port, and username', async () => {
    localStorage.clear();

    const keyCredentials = { ...credentials, password: '', verificationCode: '' };

    expect(getStoredFingerprint(keyCredentials)).toBe('');
    storeTrustedFingerprint(keyCredentials, 'SHA256:new-host');

    expect(getStoredFingerprint(keyCredentials)).toBe('SHA256:new-host');
    expect(getStoredFingerprint({ ...keyCredentials, username: 'other' })).toBe('');
  });
});
