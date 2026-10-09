import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { Express, Request, Response } from 'express';
import type { ClusterSession } from '../cluster/clusterSession';
import { resolveRequestSessionId } from '../cluster/sessionRequest';
import { assertSafeRemoteMutation } from './pathSafety';
import { SftpFileService } from './sftpFileService';
import { classifyPreview } from '../../shared/filePreview';
import { streamHtmlReport } from './htmlReportStream';
import { remoteReportCandidates } from './resolveReportPath';

const MAX_SEARCH_RESULTS = 5_000;
/** /api/files/read(+batch) 单文件读取上限：AI 回答内联卡片只承载小结果文件 */
const FILE_READ_MAX_BYTES = 10 * 1024 * 1024;
/** Dedicated report reader: large self-contained scientific HTML is common. */
const HTML_REPORT_MAX_BYTES = 100 * 1024 * 1024;
/** Relative report assets can be larger plots/data bundles, but remain bounded. */
/** /api/files/view 直出上限：与 shared/filePreview 图片组一致 */
const FILE_VIEW_MAX_BYTES = 25 * 1024 * 1024;
/** 批量读取的单次文件数上限（前端内联卡片最多 5 个） */
const FILE_READ_BATCH_MAX = 10;

/** 与 ContentFetcher.ts 的契约保持一致：文本 utf8，二进制 base64 */
interface RemoteFileContent {
  filePath: string;
  content: string;
  metadata: { size: number; mime: string };
}

export interface RemoteFileRouteSession {
  cluster: ClusterSession;
  home: string;
  /** Injection point for focused route tests. Production resolves a service from the current SFTP channel. */
  service?: SftpFileService;
}

export type ResolveRemoteFileSession = (sessionId: string | undefined) => RemoteFileRouteSession | undefined;

function sendError(res: Response, status: number, code: string, message: string): void {
  res.status(status).json({ error: { code, message } });
}

function requestError(error: unknown): { status: number; code: string; message: string } {
  const message = error instanceof Error ? error.message : String(error);
  const errorCode = typeof error === 'object' && error !== null && 'code' in error
    ? (error as { code?: unknown }).code
    : undefined;
  if (errorCode === 'ENOENT' || errorCode === 2 || /no such file|not found/i.test(message)) {
    return { status: 404, code: 'REMOTE_FILE_NOT_FOUND', message };
  }
  if (errorCode === 'EACCES' || errorCode === 'EPERM' || errorCode === 3 || /permission denied|access denied/i.test(message)) {
    return { status: 403, code: 'REMOTE_FILE_FORBIDDEN', message };
  }
  if (errorCode === 'EEXIST' || errorCode === 'ENOTEMPTY' || errorCode === 11 || /already exists|not empty/i.test(message)) {
    return { status: 409, code: 'REMOTE_FILE_CONFLICT', message };
  }
  if (/path|mode|query|preview limit|protected remote| is required|recursive must|must be an integer|positive integer/i.test(message)) {
    return { status: 400, code: 'INVALID_REMOTE_FILE_REQUEST', message };
  }
  return { status: 500, code: 'REMOTE_FILE_OPERATION_FAILED', message };
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} is required`);
  return value;
}

/** 带 HTTP 语义的业务错误：read/view 的 413/415 需要与 requestError 的 SFTP 归一化区分 */
class HttpFileError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message);
  }
}

function sendRouteError(res: Response, error: unknown): void {
  if (error instanceof HttpFileError) {
    sendError(res, error.status, error.code, error.message);
    return;
  }
  const problem = requestError(error);
  sendError(res, problem.status, problem.code, problem.message);
}

/** 读取远程文件并按文本/二进制编码：复用 classifyPreview 的 MIME 与文本判定 */
async function readRemoteFileContent(service: SftpFileService, remotePath: string, maxBytes: number): Promise<RemoteFileContent> {
  const { entry, descriptor } = await resolveReadableRemoteFile(service, remotePath, maxBytes);
  const preview = await service.readPreview(remotePath, {
    mode: descriptor.mode === 'binary' ? 'binary' : 'text',
    maxBytes,
  });
  return {
    filePath: entry.path,
    content: preview.content,
    metadata: { size: entry.size, mime: descriptor.mime },
  };
}

/** read/view 共用的前置校验：存在性、目录、大小上限、格式可支持性 */
async function resolveReadableRemoteFile(service: SftpFileService, remotePath: string, maxBytes: number) {
  const entry = await service.stat(remotePath);
  if (entry.kind === 'directory') throw new HttpFileError(400, 'REMOTE_FILE_IS_DIRECTORY', 'path is a directory');
  if (entry.size > maxBytes) {
    throw new HttpFileError(413, 'REMOTE_FILE_TOO_LARGE', `file size ${entry.size} exceeds the ${maxBytes} byte limit`);
  }
  const descriptor = classifyPreview(entry.name, entry.size);
  if (descriptor.mode === 'unsupported') {
    throw new HttpFileError(415, 'REMOTE_FILE_UNSUPPORTED', descriptor.reason || 'Unsupported file type');
  }
  return { entry, descriptor };
}

function optionalBoolean(value: unknown): boolean {
  if (value === undefined) return false;
  if (typeof value !== 'boolean') throw new Error('recursive must be a boolean');
  return value;
}

function contentTypeForAsset(filePath: string): string {
  const extension = path.posix.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
    '.csv': 'text/csv; charset=utf-8', '.tsv': 'text/tab-separated-values; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
    '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm',
    '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
  };
  return types[extension] || 'application/octet-stream';
}

function decodeAssetRoot(token: string): string {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    if (!decoded.startsWith('/')) throw new Error('asset root must be absolute');
    return decoded;
  } catch {
    throw new Error('invalid HTML asset root');
  }
}

export function registerFileRoutes(app: Express, resolveSession: ResolveRemoteFileSession): void {
  // querySessionId 仅用于 <img src> 这类无法携带请求头的场景（与 /api/files/download 的 ?sessionId= 同理）
  const withSession = (req: Request, res: Response, querySessionId?: unknown): RemoteFileRouteSession | undefined => {
    const explicit = typeof querySessionId === 'string' ? querySessionId : req.get('X-SSH-Session-Id');
    if (explicit && !resolveSession(explicit)) {
      sendError(res, 401, 'SSH_SESSION_REQUIRED', 'The requested SSH session is not active');
      return undefined;
    }
    const sessionId = resolveRequestSessionId({
      cookie: (req.session as any)?.sshSessionId,
      header: explicit,
      auth: undefined,
    }, id => Boolean(resolveSession(id)));
    const session = sessionId ? resolveSession(sessionId) : undefined;
    if (!session) {
      sendError(res, 401, 'SSH_SESSION_REQUIRED', 'An active SSH session is required');
      return undefined;
    }
    return session;
  };

  const serviceFor = (session: RemoteFileRouteSession): SftpFileService => session.service
    ?? new SftpFileService(session.cluster.getSftp(), session.home, session.cluster.exec.bind(session.cluster));

  app.get('/api/remote/files', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const remotePath = requiredString(req.query.path, 'path');
      res.json({ entries: await serviceFor(session).list(remotePath) });
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.get('/api/remote/stat', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      res.json({ entry: await serviceFor(session).stat(requiredString(req.query.path, 'path')) });
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.post('/api/remote/mkdir', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      await serviceFor(session).mkdir(requiredString(req.body?.path, 'path'));
      res.status(201).json({ ok: true });
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.post('/api/remote/touch', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      await serviceFor(session).touch(requiredString(req.body?.path, 'path'));
      res.status(201).json({ ok: true });
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.get('/api/remote/walk', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      res.json(await serviceFor(session).walk(requiredString(req.query.path, 'path')));
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.post('/api/remote/rename', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      await serviceFor(session).rename(requiredString(req.body?.from, 'from'), requiredString(req.body?.to, 'to'));
      res.json({ ok: true });
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.post('/api/remote/copy', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const sourcePaths = req.body?.sourcePaths;
      if (!Array.isArray(sourcePaths) || sourcePaths.length === 0) {
        throw new Error('source paths are required');
      }
      if (!sourcePaths.every(value => typeof value === 'string' && value.trim())) {
        throw new Error('source paths must be non-empty strings');
      }
      const targetDirectory = requiredString(req.body?.targetDirectory, 'target directory');
      res.json(await serviceFor(session).copy(sourcePaths, targetDirectory));
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.post('/api/remote/remove/preview', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const remotePath = assertSafeRemoteMutation(requiredString(req.body?.path, 'path'), session.home);
      const recursive = optionalBoolean(req.body?.recursive);
      const entry = await serviceFor(session).stat(remotePath);
      res.json({ entries: [entry], total: 1, recursive });
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.post('/api/remote/remove', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const remotePath = assertSafeRemoteMutation(requiredString(req.body?.path, 'path'), session.home);
      const result = await serviceFor(session).remove(remotePath, optionalBoolean(req.body?.recursive));
      res.json(result);
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.post('/api/remote/chmod', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const mode = req.body?.mode;
      if (!Number.isInteger(mode)) throw new Error('mode must be an integer');
      await serviceFor(session).chmod(requiredString(req.body?.path, 'path'), mode);
      res.json({ ok: true });
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.get('/api/remote/preview', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const remotePath = requiredString(req.query.path, 'path');
      const service = serviceFor(session);
      const entry = await service.stat(remotePath);
      const descriptor = classifyPreview(entry.name, entry.size);
      if (descriptor.mode === 'unsupported') {
        sendError(res, 415, 'REMOTE_PREVIEW_UNSUPPORTED', descriptor.reason || 'Unsupported preview type');
        return;
      }
      const preview = await service.readPreview(remotePath, {
        mode: descriptor.mode,
        maxBytes: descriptor.maxBytes,
        ...(descriptor.lineLimit === undefined ? {} : { lineLimit: descriptor.lineLimit }),
      });
      res.json(preview);
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.post('/api/remote/write', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const remotePath = assertSafeRemoteMutation(requiredString(req.body?.path, 'path'), session.home);
      const content = requiredString(req.body?.content, 'content');
      await serviceFor(session).writeFile(remotePath, content);
      res.json({ ok: true });
    } catch (error) {
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    }
  });

  app.get('/api/remote/search', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    const controller = new AbortController();
    const abort = (): void => controller.abort();
    req.once('aborted', abort);
    res.once('close', abort);
    try {
      const entries = [];
      let truncated = false;
      for await (const batch of serviceFor(session).search(
        requiredString(req.query.root, 'root'),
        requiredString(req.query.query, 'query'),
        controller.signal,
        MAX_SEARCH_RESULTS + 1,
      )) {
        const remaining = MAX_SEARCH_RESULTS - entries.length;
        entries.push(...batch.slice(0, remaining));
        if (batch.length > remaining) {
          truncated = true;
          controller.abort();
          break;
        }
      }
      res.json({ entries, truncated });
    } catch (error) {
      if (controller.signal.aborted || res.destroyed) return;
      const problem = requestError(error);
      sendError(res, problem.status, problem.code, problem.message);
    } finally {
      req.off('aborted', abort);
      res.off('close', abort);
    }
  });

  // ── AI 对话富内容卡片：远程文件内容读取（rich-content 卡片 + 侧边网页栏） ──

  app.post('/api/files/read', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const remotePath = requiredString(req.body?.path, 'path');
      res.json(await readRemoteFileContent(serviceFor(session), remotePath, FILE_READ_MAX_BYTES));
    } catch (error) {
      sendRouteError(res, error);
    }
  });

  /** Large scientific report source. Kept separate so ordinary inline cards
   * retain their conservative 10 MiB guard. */
  app.post('/api/files/html/read', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const remotePath = requiredString(req.body?.path, 'path');
      const result = await readRemoteFileContent(serviceFor(session), remotePath, HTML_REPORT_MAX_BYTES);
      if (!/^text\/html\b/i.test(result.metadata.mime)) {
        throw new HttpFileError(415, 'REMOTE_HTML_REQUIRED', 'path is not an HTML document');
      }
      res.json(result);
    } catch (error) {
      sendRouteError(res, error);
    }
  });

  app.post('/api/files/html/resolve', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const service = serviceFor(session);
      const candidates = remoteReportCandidates(requiredString(req.body?.path, 'path'), session.home, req.body?.basePaths);
      const matches = [];
      for (const candidate of candidates) {
        try { matches.push(await service.stat(candidate)); }
        catch (error) { if (requestError(error).status !== 404) throw error; }
      }
      if (!matches.length) throw new HttpFileError(404, 'REMOTE_FILE_NOT_FOUND', 'Report not found in the supplied project directories. Provide its full cluster path.');
      if (matches.length > 1) {
        res.status(409).json({ error: { code: 'REMOTE_REPORT_AMBIGUOUS', message: 'Multiple reports match this relative path. Select the exact report.', candidates: matches.map(entry => entry.path) } });
        return;
      }
      const entry = matches[0];
      if (entry.kind === 'directory' || !/\.x?html?$/i.test(entry.name)) throw new HttpFileError(415, 'REMOTE_HTML_REQUIRED', 'path is not an HTML document');
      res.json({ filePath: entry.path, metadata: { size: entry.size, mime: 'text/html' } });
    } catch (error) { sendRouteError(res, error); }
  });

  app.get('/api/files/html/document', async (req, res) => {
    const session = withSession(req, res, req.query.sessionId);
    if (!session) return;
    try {
      const service = serviceFor(session);
      const entry = await service.stat(requiredString(req.query.path, 'path'));
      if (entry.kind === 'directory' || !/\.x?html?$/i.test(entry.name)) throw new HttpFileError(415, 'REMOTE_HTML_REQUIRED', 'path is not an HTML document');
      const sessionId = typeof req.query.sessionId === 'string' ? req.query.sessionId : req.get('X-SSH-Session-Id') || (req.session as any)?.sshSessionId;
      const reportAccess = process.env.HPCLAW_PUBLIC_WORKER === '1' ? req.get('X-HPClaw-Report-Access') : '';
      const base = reportAccess && /^[a-f0-9]{64}$/.test(reportAccess)
        ? `/api/public/report-assets/${reportAccess}/`
        : `/api/files/html-assets/${encodeURIComponent(sessionId)}/${Buffer.from(path.posix.dirname(entry.path)).toString('base64url')}/`;
      const assetBaseUrl = new URL(base, `${req.protocol}://${req.get('host')}`).href;
      await streamHtmlReport(service.openReadStream(entry.path), res, req.query.scripts !== '0', { assetBaseUrl, allowRemoteNetwork: req.query.network === '1' });
    } catch (error) { if (!res.headersSent && !res.destroyed) sendRouteError(res, error); }
  });

  /**
   * Read-only SFTP asset proxy for sandboxed reports. The encoded root fixes
   * the report directory; path.resolve + containment prevents ../ traversal.
   * Keeping the session in the URL also makes multiple clusters deterministic
   * when the active UI tab changes while a report remains open.
   */
  app.get('/api/files/html-assets/:sessionId/:rootToken/*', async (req, res) => {
    const session = withSession(req, res, req.params.sessionId);
    if (!session) return;
    try {
      const root = decodeAssetRoot(requiredString(req.params.rootToken, 'root token'));
      const relative = String(req.params[0] || '').replace(/^\/+/, '');
      const target = path.posix.resolve(root, relative || '.');
      const normalizedRoot = path.posix.resolve(root);
      if (target !== normalizedRoot && !target.startsWith(`${normalizedRoot}/`)) {
        throw new HttpFileError(403, 'REMOTE_HTML_ASSET_OUTSIDE_ROOT', 'HTML asset escapes the report directory');
      }
      const service = serviceFor(session);
      const entry = await service.stat(target);
      if (process.env.HPCLAW_PUBLIC_WORKER === '1') {
        const sftp = session.cluster.getSftp();
        const canonical = (file: string) => new Promise<string>((resolve, reject) => sftp.realpath(file, (error, value) => error ? reject(error) : resolve(value)));
        const [realRoot, realTarget] = await Promise.all([canonical(normalizedRoot), canonical(target)]);
        const privatePart = (file: string) => file.split('/').some(part => part.startsWith('.') || ['hpclaw_web', 'hpclaw_conversations', 'hpclaw_skills'].includes(part));
        if ((realTarget !== realRoot && !realTarget.startsWith(realRoot.replace(/\/$/, '') + '/')) || privatePart(realRoot) || privatePart(realTarget)) {
          throw new HttpFileError(403, 'REMOTE_HTML_ASSET_FORBIDDEN', 'Report assets cannot escape the directory or read private credential stores');
        }
      }
      if (entry.kind === 'directory') throw new HttpFileError(400, 'REMOTE_FILE_IS_DIRECTORY', 'asset path is a directory');
      res.setHeader('Content-Type', contentTypeForAsset(target));
      res.setHeader('Content-Length', String(entry.size));
      res.setHeader('Cache-Control', 'private, max-age=60');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Access-Control-Allow-Origin', 'null');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "sandbox; default-src 'none'");
      await pipeline(service.openReadStream(target), res);
    } catch (error) {
      if (!res.headersSent && !res.destroyed) sendRouteError(res, error);
    }
  });

  app.post('/api/files/read/batch', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const paths = req.body?.paths;
      if (!Array.isArray(paths) || paths.length === 0 || paths.length > FILE_READ_BATCH_MAX
        || !paths.every(value => typeof value === 'string' && value.trim())) {
        throw new Error(`paths must be an array of 1-${FILE_READ_BATCH_MAX} non-empty strings`);
      }
      // 单文件失败（不存在/超限/格式不支持）不拖垮整批：跳过，与前端"静默跳过"语义一致
      const contents: RemoteFileContent[] = [];
      const service = serviceFor(session);
      for (const remotePath of paths) {
        try {
          contents.push(await readRemoteFileContent(service, remotePath, FILE_READ_MAX_BYTES));
        } catch { /* per-file failures are omitted from the batch result */ }
      }
      res.json(contents);
    } catch (error) {
      sendRouteError(res, error);
    }
  });

  app.get('/api/files/view', async (req, res) => {
    const session = withSession(req, res, req.query.sessionId);
    if (!session) return;
    try {
      const remotePath = requiredString(req.query.path, 'path');
      const service = serviceFor(session);
      const { descriptor } = await resolveReadableRemoteFile(service, remotePath, FILE_VIEW_MAX_BYTES);
      const preview = await service.readPreview(remotePath, {
        mode: descriptor.mode === 'binary' ? 'binary' : 'text',
        maxBytes: FILE_VIEW_MAX_BYTES,
      });
      const buffer = preview.encoding === 'base64'
        ? Buffer.from(preview.content, 'base64')
        : Buffer.from(preview.content, 'utf8');
      const isText = preview.encoding === 'utf8';
      res.setHeader('Content-Type', `${descriptor.mime}${isText ? '; charset=utf-8' : ''}`);
      res.setHeader('Content-Length', String(buffer.length));
      res.setHeader('Cache-Control', 'private, max-age=30');
      res.end(buffer);
    } catch (error) {
      sendRouteError(res, error);
    }
  });
}
