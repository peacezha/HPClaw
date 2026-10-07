import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

export const PUBLIC_WORKER = process.env.HPCLAW_PUBLIC_WORKER === '1';

export function publicRouteAllowed(url: string): boolean {
  let pathname: string;
  try { pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname).toLowerCase(); }
  catch { return false; }
  return !/^\/api\/(?:local(?:\/|$)|local-files(?:\/|$)|desktop(?:\/|$)|bridge(?:\/|$)|qqbot(?:\/|$)|transfers(?:\/|$)|transfer-credentials(?:\/|$))/.test(pathname)
    && !/\/conversations\/[^/]+\/(?:import|sync)$/.test(pathname);
}

export function workerAuthentication(req: Request, res: Response, next: NextFunction) {
  if (!PUBLIC_WORKER) return next();
  const expected = process.env.HPCLAW_PUBLIC_WORKER_TOKEN || '';
  const given = req.get('X-HPClaw-Worker') || '';
  const digest = (value: string) => crypto.createHash('sha256').update(value).digest();
  if (!expected || !crypto.timingSafeEqual(digest(given), digest(expected))) return res.sendStatus(403);
  if (!publicRouteAllowed(req.originalUrl)) return res.status(403).json({ error: '公共网页端不提供部署服务器本地功能' });
  next();
}
