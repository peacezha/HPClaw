export interface LoginCredentials {
  host: string;
  port: string;
  username: string;
  password: string;
  verificationCode: string;
  expectedFingerprint?: string;
}

export interface LoginResponse {
  ok: boolean;
  data: {
    success?: boolean;
    sessionId?: string;
    home?: string;
    code?: string;
    fingerprint?: string;
    error?: string;
  };
  trustedFingerprint?: string;
}

interface LoginTrustOptions {
  request: (credentials: LoginCredentials) => Promise<LoginResponse>;
  confirmFingerprint: (fingerprint: string) => boolean | Promise<boolean>;
}

const TRUSTED_FINGERPRINT_PREFIX = 'hpclaw_trusted_host_fingerprint:';

function fingerprintStorageKey(credentials: Pick<LoginCredentials, 'host' | 'port' | 'username'>): string {
  return TRUSTED_FINGERPRINT_PREFIX + [
    credentials.host.trim().toLowerCase(),
    credentials.port.trim(),
    credentials.username.trim(),
  ].map(encodeURIComponent).join('|');
}

export function getStoredFingerprint(credentials: Pick<LoginCredentials, 'host' | 'port' | 'username'>): string {
  try {
    return localStorage.getItem(fingerprintStorageKey(credentials)) || '';
  } catch {
    return '';
  }
}

export function storeTrustedFingerprint(
  credentials: Pick<LoginCredentials, 'host' | 'port' | 'username'>,
  fingerprint: string,
): void {
  try {
    const key = fingerprintStorageKey(credentials);
    const value = fingerprint.trim();
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // localStorage unavailable
  }
}

export async function loginWithFingerprintConfirmation(
  credentials: LoginCredentials,
  { request, confirmFingerprint }: LoginTrustOptions,
): Promise<LoginResponse> {
  const initialResponse = await request(credentials);
  const fingerprint = initialResponse.data.fingerprint;
  if (
    initialResponse.ok
    || initialResponse.data.code !== 'HOST_FINGERPRINT_REQUIRED'
    || typeof fingerprint !== 'string'
    || !fingerprint
  ) {
    return initialResponse;
  }

  if (!await confirmFingerprint(fingerprint)) return initialResponse;
  const trustedResponse = await request({ ...credentials, expectedFingerprint: fingerprint });
  if (trustedResponse.ok && trustedResponse.data.success) {
    return { ...trustedResponse, trustedFingerprint: fingerprint };
  }
  return trustedResponse;
}
