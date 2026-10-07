import express from 'express';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fork } from 'node:child_process';
import { resolveClusterAddress } from './network';
import { publicRouteAllowed } from './policy';

export interface PrivateWorker {
  port: number; token: string; sessionId?: string; cookie?: string; identity: string;
  stop(): Promise<void>;
}
interface Visitor { workers: Map<string, PrivateWorker>; pending?: PrivateWorker; current?: string; touched: number; loggingIn?: boolean; attempts?: { count: number; since: number } }
export interface GatewayOptions {
  origin: string; root: string; maxWorkers?: number; idleMs?: number; allowPrivate?: boolean;
  createWorker?: (identity: string, host: string, address: string) => Promise<PrivateWorker>;
  resolveAddress?: (host: unknown, allowPrivate: boolean) => Promise<string>;
}

export async function spawnPrivateWorker(root: string, identity: string, host: string, address: string): Promise<PrivateWorker> {
  const temporaryBase = process.env.HPCLAW_RUNTIME_TMPDIR || (process.platform === 'linux' && fs.existsSync('/dev/shm') ? '/dev/shm' : os.tmpdir());
  const directory = fs.mkdtempSync(path.join(temporaryBase, 'hpclaw-public-'));
  fs.chmodSync(directory, 0o700);
  const token = crypto.randomBytes(32).toString('hex');
  const child = fork(path.join(root, 'dist-electron/server.cjs'), [], {
    env: { ...process.env, NODE_ENV: 'production', PORT: '0', HPCLAW_WEB_MODE: '',
      HPCLAW_PUBLIC_WORKER: '1', HPCLAW_PUBLIC_WORKER_TOKEN: token,
      HPCLAW_PUBLIC_SSH_HOST: host, HPCLAW_PUBLIC_SSH_ADDRESS: address,
      HPCLAW_APP_ROOT: root, HPCLAW_STATIC_ROOT: root, HPCLAW_DATA_ROOT: directory,
      HPCLAW_AI_ENGINE: 'legacy', SESSION_SECRET: crypto.randomBytes(48).toString('hex'),
      HPCLAW_ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex'),
      HPCLAW_PARENT_PID: String(process.pid), QQ_BOT_APP_ID: '', QQ_BOT_APP_SECRET: '',
    },
    stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
  });
  let stopped = false;
  const cleanup = () => fs.rmSync(directory, { recursive: true, force: true }); // Exact mkdtemp-owned cache, never a supplied path.
  child.once('exit', cleanup);
  const stop = async () => {
    if (stopped) return;
    stopped = true;
    if (child.exitCode === null && child.signalCode === null) {
      const exited = new Promise<void>(resolve => child.once('exit', () => resolve()));
      child.kill('SIGTERM');
      await Promise.race([exited, new Promise(resolve => setTimeout(resolve, 6000))]);
      if (child.exitCode === null && child.signalCode === null) { child.kill('SIGKILL'); await exited; }
    }
    cleanup();
  };
  try {
    const port = await new Promise<number>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('集群服务启动超时')), 45000);
      timer.unref();
      child.once('error', error => { clearTimeout(timer); reject(error); });
      child.once('exit', () => { clearTimeout(timer); reject(new Error('集群服务启动失败')); });
      child.on('message', (message: any) => {
        if (message?.type === 'public-worker-ready' && Number.isInteger(message.port)) {
          clearTimeout(timer); resolve(message.port);
        }
      });
    });
    return { port, token, identity, stop };
  } catch (error) { await stop(); throw error; }
}

export function createPublicGateway(options: GatewayOptions) {
  const maxWorkers = options.maxWorkers ?? 16;
  if (!Number.isInteger(maxWorkers) || maxWorkers < 1 || maxWorkers > 256) throw new Error('并发集群连接数须为 1–256');
  const origin = new URL(options.origin);
  if (!['https:', 'http:'].includes(origin.protocol) || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
    throw new Error('HPCLAW_WEB_ORIGIN 必须是网站的完整 origin，不含路径或密码');
  }
  if (origin.protocol !== 'https:' && !['127.0.0.1', 'localhost'].includes(origin.hostname)
    && process.env.HPCLAW_INSECURE_INTERNAL_HTTP !== '1') throw new Error('公共网页须使用 HTTPS；受控内网测试才可明确启用 HTTP');
  const visitors = new Map<string, Visitor>();
  const attempts = new Map<string, { count: number; since: number }>();
  let reserved = 0;
  const app = express();
  if (process.env.HPCLAW_TRUST_PROXY === '1') app.set('trust proxy', 1);
  const server = http.createServer(app);
  const cookieName = origin.protocol === 'https:' ? '__Host-hpclaw-public' : 'hpclaw-public';
  const originAllowed = (header?: string) => !header || header === origin.origin;
  const cookies = (req: http.IncomingMessage) => req.headers.cookie?.split(';').map(s => s.trim()).find(s => s.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  const visitorFor = (req: http.IncomingMessage) => {
    const id = cookies(req);
    const visitor = id && visitors.get(id);
    if (visitor) visitor.touched = Date.now();
    return visitor || undefined;
  };
  const ensureVisitor = (req: express.Request, res: express.Response) => {
    let visitor = visitorFor(req);
    if (!visitor) {
      if (visitors.size >= 512) throw new Error('当前登录入口繁忙，请稍后重试');
      const id = crypto.randomBytes(32).toString('hex');
      visitor = { workers: new Map(), touched: Date.now() };
      visitors.set(id, visitor);
      res.setHeader('Set-Cookie', `${cookieName}=${id}; Path=/; HttpOnly; SameSite=Strict${origin.protocol === 'https:' ? '; Secure' : ''}`);
    }
    return visitor;
  };
  const targetFor = (req: http.IncomingMessage): PrivateWorker | undefined => {
    const visitor = visitorFor(req);
    if (!visitor) return;
    const url = new URL((req as express.Request).originalUrl || req.url || '/', 'http://localhost');
    const embedded = url.pathname.match(/^\/api\/files\/html-assets\/([^/]+)\//)?.[1];
    const candidates = [req.headers['x-ssh-session-id'], url.searchParams.get('hpclawCluster'),
      url.searchParams.get('sessionId'), url.searchParams.get('scope'), embedded,
      (req as express.Request).body?.sessionId, (req as express.Request).body?.scopeKey].filter(Boolean);
    // An explicit foreign/expired target is never allowed to fall back to the current cluster.
    if (candidates.length) {
      if (candidates.some(value => typeof value !== 'string' || !visitor.workers.has(value))) return;
      if (new Set(candidates).size !== 1) return;
      return visitor.workers.get(candidates[0] as string);
    }
    return visitor.current ? visitor.workers.get(visitor.current) : undefined;
  };
  const upstreamHeaders = (req: http.IncomingMessage, worker: PrivateWorker) => ({
    ...req.headers, host: origin.host, cookie: worker.cookie || '',
    'x-forwarded-proto': origin.protocol.slice(0, -1), 'x-forwarded-host': origin.host,
    'x-hpclaw-worker': worker.token, 'x-ssh-session-id': worker.sessionId || '',
    authorization: '', 'x-hpclaw-bridge': '',
  });
  const proxy = (req: express.Request, res: express.Response, worker: PrivateWorker) => {
    const headers: any = upstreamHeaders(req, worker);
    let payload: string | undefined;
    if (req.is('application/json') && req.body !== undefined) {
      payload = JSON.stringify(req.body);
      headers['content-length'] = Buffer.byteLength(payload);
      delete headers['transfer-encoding'];
    }
    const upstream = http.request({ hostname: '127.0.0.1', port: worker.port, path: req.originalUrl,
      method: req.method, headers }, response => {
      const responseHeaders = { ...response.headers };
      delete responseHeaders['set-cookie'];
      res.writeHead(response.statusCode || 502, responseHeaders);
      response.pipe(res);
    });
    upstream.on('error', () => { if (!res.headersSent) res.status(502).json({ error: '集群服务暂时不可用，请重新连接' }); else res.destroy(); });
    res.on('close', () => upstream.destroy());
    if (payload !== undefined) upstream.end(payload); else req.pipe(upstream);
  };
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'same-origin');
    if (origin.protocol === 'https:') res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    next();
  });
  app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
  app.get('/api/app-info', (_req, res) => res.json({ edition: 'full', deployment: 'public-web',
    capabilities: { cluster: true, terminal: true, fileTransfer: false, filePreview: true, nativeAgent: true,
      workflowDevelopment: true, dsh: false, localWorkspace: false } }));
  app.use((req, res, next) => {
    if (!['GET', 'HEAD'].includes(req.method) && !originAllowed(req.get('Origin'))) return res.sendStatus(403);
    if (!publicRouteAllowed(req.originalUrl)) return res.status(403).json({ error: '网页端不提供部署服务器本地功能' });
    next();
  });
  app.use(express.json({ limit: '10mb' }));
  app.post('/api/login', async (req, res) => {
    let visitor: Visitor | undefined;
    let worker: PrivateWorker | undefined;
    let ownsLogin = false;
    try {
      const ip = req.ip || req.socket.remoteAddress || '';
      const previous = attempts.get(ip);
      const rate = !previous || Date.now() - previous.since > 60000 ? { count: 0, since: Date.now() } : previous;
      attempts.set(ip, rate);
      if (++rate.count > 120) return res.status(429).json({ error: '登录尝试过多，请稍后重试' });
      const { host, port, username, password } = req.body || {};
      if (!Number.isInteger(Number(port)) || Number(port) < 1 || Number(port) > 65535
        || typeof username !== 'string' || !username || username.length > 128 || /[\x00-\x1f]/.test(username)
        || typeof password !== 'string' || !password || password.length > 4096) return res.status(400).json({ error: '集群登录信息无效' });
      visitor = ensureVisitor(req, res);
      if (visitor.loggingIn) return res.status(429).json({ error: '该浏览器已有登录正在进行，请等待完成' });
      const previousVisitorRate = visitor.attempts;
      const visitorRate = !previousVisitorRate || Date.now() - previousVisitorRate.since > 60000 ? { count: 0, since: Date.now() } : previousVisitorRate;
      visitor.attempts = visitorRate;
      if (++visitorRate.count > 12) return res.status(429).json({ error: '登录尝试过多，请稍后重试' });
      visitor.loggingIn = true;
      ownsLogin = true;
      const address = await (options.resolveAddress || resolveClusterAddress)(host, Boolean(options.allowPrivate));
      const identity = JSON.stringify([host, Number(port), username]);
      worker = visitor.pending;
      if (worker && worker.identity !== identity) { await worker.stop(); reserved--; visitor.pending = undefined; worker = undefined; }
      if (!worker) {
        if (reserved >= maxWorkers || visitor.workers.size >= 4) return res.status(503).json({ error: '集群连接容量已满，请稍后重试' });
        reserved++;
        try { worker = await (options.createWorker || ((id, h, a) => spawnPrivateWorker(options.root, id, h, a)))(identity, host, address); }
        catch (error) { reserved--; throw error; }
        visitor.pending = worker;
      }
      const response = await fetch(`http://127.0.0.1:${worker.port}/api/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-HPClaw-Worker': worker.token },
        body: JSON.stringify(req.body), signal: AbortSignal.timeout(180000),
      });
      const result = await response.json();
      worker.cookie = response.headers.get('set-cookie')?.split(';')[0] || worker.cookie;
      if (response.ok && result.success && typeof result.sessionId === 'string') {
        worker.sessionId = result.sessionId;
        visitor.workers.set(result.sessionId, worker); visitor.current = result.sessionId; visitor.pending = undefined;
      } else if (response.status !== 428 && response.status !== 409) {
        await worker.stop(); reserved--; visitor.pending = undefined;
      }
      res.status(response.status).json(result);
    } catch (error) {
      if (worker && visitor?.pending === worker) { await worker.stop(); reserved--; visitor.pending = undefined; }
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : '集群登录失败' });
    } finally { if (visitor && ownsLogin) visitor.loggingIn = false; }
  });
  app.use('/api', (req, res, next) => {
    const worker = targetFor(req);
    if (!worker) return res.status(401).json({ error: '请先登录自己的集群；目标会话无效或不属于当前访客' });
    const source = req.body?.sourceSessionId;
    if (source && source !== worker.sessionId) return res.status(403).json({ error: '不允许跨会话访问' });
    if (req.path === '/logout' && req.method === 'POST') {
      const visitor = visitorFor(req)!;
      visitor.workers.delete(worker.sessionId!); visitor.current = visitor.workers.keys().next().value;
      reserved--; void worker.stop();
      return res.json({ success: true });
    }
    next();
  });
  app.use('/api', (req, res) => proxy(req, res, targetFor(req)!));
  app.use('/socket.io', (req, res) => {
    if (!originAllowed(req.get('Origin'))) return res.sendStatus(403);
    const worker = targetFor(req);
    if (!worker) return res.sendStatus(401);
    proxy(req, res, worker);
  });
  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url || '/', 'http://localhost');
    const worker = targetFor(req);
    if (!url.pathname.startsWith('/socket.io/') || !worker || !originAllowed(req.headers.origin)) return socket.destroy();
    const upstream = http.request({ hostname: '127.0.0.1', port: worker.port, path: req.url,
      headers: upstreamHeaders(req, worker) });
    upstream.on('upgrade', (response, remote, upstreamHead) => {
      socket.on('data', () => { const visitor = visitorFor(req); if (visitor) visitor.touched = Date.now(); });
      socket.write(`HTTP/1.1 101 Switching Protocols\r\n${Object.entries(response.headers).filter(([name]) => name !== 'set-cookie').map(([name, value]) => `${name}: ${value}`).join('\r\n')}\r\n\r\n`);
      if (head.length) remote.write(head); if (upstreamHead.length) socket.write(upstreamHead);
      remote.pipe(socket); socket.pipe(remote);
      socket.on('error', () => remote.destroy()); remote.on('error', () => socket.destroy());
      socket.on('close', () => remote.destroy()); remote.on('close', () => socket.destroy());
    });
    upstream.on('error', () => socket.destroy()); upstream.end();
  });
  // Mark this deployment before any client modules run: a transient app-info failure must never expose the desktop local workspace.
  const index = (_req: express.Request, res: express.Response) => {
    const html = fs.readFileSync(path.join(options.root, 'dist/index.html'), 'utf8');
    res.setHeader('Cache-Control', 'no-store');
    res.type('html').send(html.replace('<head>', '<head><script>window.hpclawPublicWeb=true;</script>'));
  };
  app.get(['/', '/index.html'], index);
  app.use(express.static(path.join(options.root, 'dist'), { index: false }));
  app.get('*', index);
  const sweep = setInterval(() => {
    for (const [id, visitor] of visitors) if (!visitor.loggingIn && Date.now() - visitor.touched > (visitor.workers.size ? (options.idleMs || 2 * 3600000) : 120000)) {
      const workers = [...visitor.workers.values(), ...(visitor.pending ? [visitor.pending] : [])];
      reserved -= workers.length; visitors.delete(id); void Promise.all(workers.map(worker => worker.stop()));
    }
    for (const [ip, rate] of attempts) if (Date.now() - rate.since > 60000) attempts.delete(ip);
  }, 30000);
  sweep.unref();
  const close = async () => {
    clearInterval(sweep);
    await Promise.all([...visitors.values()].flatMap(visitor => [...visitor.workers.values(), ...(visitor.pending ? [visitor.pending] : [])]).map(worker => worker.stop()));
    visitors.clear(); server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve()));
  };
  return { app, server, close };
}
