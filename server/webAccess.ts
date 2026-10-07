import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

export interface WebAccessConfig {
  enabled: boolean;
  host: string;
  username: string;
  password: string;
  origin?: string;
}

export function readWebAccessConfig(env: NodeJS.ProcessEnv = process.env): WebAccessConfig {
  const enabled = env.HPCLAW_WEB_MODE === '1';
  const host = enabled ? (env.HPCLAW_HOST || '127.0.0.1') : '127.0.0.1';
  if (!enabled) return { enabled, host, username: '', password: '' };
  const username = env.HPCLAW_WEB_USERNAME || 'hpclaw';
  const password = env.HPCLAW_WEB_PASSWORD || '';
  if (!/^[A-Za-z0-9_.-]{1,64}$/.test(username) || password.length < 16 || password.includes('\0')) {
    throw new Error('Web deployment requires a valid username and HPCLAW_WEB_PASSWORD of at least 16 characters');
  }
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) throw new Error('Web deployment requires SESSION_SECRET of at least 32 characters');
  let origin: string | undefined;
  if (env.HPCLAW_WEB_ORIGIN) {
    const url = new URL(env.HPCLAW_WEB_ORIGIN);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      throw new Error('HPCLAW_WEB_ORIGIN must be an HTTP(S) origin, without credentials, path or query');
    }
    origin = url.origin;
  }
  if (!['localhost', '127.0.0.1', '::1'].includes(host) && !origin) {
    throw new Error('A network-facing web deployment requires HPCLAW_WEB_ORIGIN');
  }
  origin ||= `http://${host === '::1' ? '[::1]' : host}:${env.PORT || 3003}`;
  return { enabled, host, username, password, origin };
}

function digest(value: string): Buffer { return crypto.createHash('sha256').update(value).digest(); }
function equal(left: string, right: string): boolean {
  return crypto.timingSafeEqual(digest(left), digest(right));
}

export function createWebAccess(config: WebAccessConfig, getBridgeToken: () => string) {
  const sessionKey = digest(`${config.username}\0${config.password}`).toString('hex');
  const basic = (header: unknown): boolean => {
    if (typeof header !== 'string' || header.length > 4096 || !/^Basic /i.test(header)) return false;
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    return equal(decoded, `${config.username}:${config.password}`);
  };
  const originAllowed = (origin: unknown): boolean => {
    if (!origin) return true; // CLI / trusted bridge calls have no browser Origin.
    if (typeof origin !== 'string' || origin === 'null') return false;
    if (config.origin) return origin === config.origin;
    try {
      const url = new URL(origin);
      return ['http:', 'https:'].includes(url.protocol) && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    } catch { return false; }
  };
  const authorized = (req: { headers: Record<string, unknown>; session?: any }): boolean => {
    return basic(req.headers.authorization) || (
      typeof req.session?.hpclawWebAccess === 'string' && equal(req.session.hpclawWebAccess, sessionKey)
    );
  };
  const middleware = (req: Request, res: Response, next: NextFunction) => {
    if (!config.enabled) return next();
    // Check cross-site mutations even when the browser has cached HTTP credentials.
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !originAllowed(req.get('Origin'))) {
      return res.status(403).json({ error: 'Cross-origin web request denied' });
    }
    const remote = req.socket.remoteAddress;
    const bridge = req.get('X-HPClaw-Bridge');
    if (req.path.startsWith('/api/bridge/') && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remote || '')
      && bridge && equal(bridge, getBridgeToken())) return next();
    if (!authorized(req)) {
      res.setHeader('WWW-Authenticate', 'Basic realm="HPClaw", charset="UTF-8"');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(401).send('HPClaw web access requires authentication');
    }
    if (req.session) (req.session as any).hpclawWebAccess = sessionKey;
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  };
  return { middleware, originAllowed, authorized };
}
