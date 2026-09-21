import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { Express, Request, Response } from 'express';
import type { Server as SocketIOServer } from 'socket.io';
import type { SFTPWrapper } from 'ssh2';
import type { ClusterSession } from '../cluster/clusterSession';
import { resolveRequestSessionId } from '../cluster/sessionRequest';
import { TransferEngine, type TransferAdapter } from './transferEngine';
import { loadTasks } from './transferStore';
import type { TransferTask, ConflictPolicy, VerificationMode } from '../../shared/fileTransfer';

// ---------------------------------------------------------------------------
//  Types
// ---------------------------------------------------------------------------

export interface TransferRouteSession {
  cluster: ClusterSession;
  home: string;
  /** 直连互传需要主机信息（host/port/username） */
  info?: { host: string; port: number; username: string };
}

type ResolveTransferSession = (sessionId: string | undefined) => TransferRouteSession | undefined;

// ---------------------------------------------------------------------------
//  Production adapter
// ---------------------------------------------------------------------------

export function createTransferAdapter(resolveSession: ResolveTransferSession): TransferAdapter {
  const getSftp = (sessionId: string) => {
    const session = resolveSession(sessionId);
    if (!session) throw new Error('SSH session not found');
    return session.cluster.getSftp();
  };

  const statRemote = (remotePath: string, sessionId: string): Promise<{ size: number }> =>
    new Promise((resolve, reject) => {
      getSftp(sessionId).stat(remotePath, (err, attrs) => {
        if (err) reject(err);
        else resolve({ size: attrs.size ?? 0 });
      });
    });

  return {
    remoteSize: async (remotePath, sessionId) => {
      const attrs = await statRemote(remotePath, sessionId);
      return attrs.size;
    },

    localSize: async (localPath) => {
      const stat = await fs.promises.stat(localPath);
      return stat.size;
    },

    openLocalRead: (localPath, offset) =>
      fs.createReadStream(localPath, { start: offset }),

    openRemoteWrite: (remotePath, offset, sessionId) => {
      const sftp = getSftp(sessionId);
      return sftp.createWriteStream(remotePath, { start: offset });
    },

    openRemoteRead: (remotePath, offset, sessionId) => {
      const sftp = getSftp(sessionId);
      return sftp.createReadStream(remotePath, { start: offset });
    },

    openLocalWrite: (localPath, offset) =>
      fs.createWriteStream(localPath, { start: offset }),

    verify: async (localPath, remotePath, mode, context) => {
      if (mode === 'size') {
        const localStat = await fs.promises.stat(localPath);
        const remoteSize = await statRemote(remotePath, context.sessionId);
        if (localStat.size !== remoteSize.size) {
          throw new Error('size mismatch');
        }
      } else {
        const localHash = await computeFileHash(localPath);
        const remoteHash = await computeRemoteHash(getSftp(context.sessionId).createReadStream(remotePath));
        if (localHash !== remoteHash) {
          throw new Error('checksum mismatch');
        }
      }
    },

    remoteRename: async (from, to, sessionId) => {
      const sftp = getSftp(sessionId);
      await renameRemoteForOverwrite(sftp, from, to);
    },

    localRename: async (from, to) => {
      await fs.promises.rename(from, to);
    },

    remoteUnlink: async (path, sessionId) => {
      const sftp = getSftp(sessionId);
      await new Promise<void>((resolve, reject) => {
        sftp.unlink(path, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },

    localUnlink: async (path) => {
      await fs.promises.unlink(path).catch(() => {});
    },

    execRemote: async (command, sessionId, timeoutMs) => {
      const session = resolveSession(sessionId);
      if (!session) throw new Error('SSH session not found');
      return session.cluster.exec(command, timeoutMs ?? 30_000);
    },

    getSessionInfo: (sessionId) => {
      const session = resolveSession(sessionId) as { info?: { host: string; port: number; username: string } } | undefined;
      return session?.info;
    },

    prepareRemoteCopy: async ({
      sourcePath,
      destinationPath,
      sourceSessionId,
      destinationSessionId,
    }) => {
      const source = resolveSession(sourceSessionId);
      const destination = resolveSession(destinationSessionId);
      if (!source || !destination) throw new Error('集群互传权限预检失败：SSH 会话已失效');
      const quote = (value: string) => `'${value.replace(/'/g, `'"'"'`)}'`;

      // 源端当前账号：文件需 r，每层父目录需 x。只增加 owner 位，
      // 如当前用户不是 owner 则 chmod 会明确失败，不会放宽其他用户权限。
      const sourceParent = path.posix.dirname(sourcePath);
      const sourceCommand = [
        `f=${quote(sourcePath)}`,
        'if [ -d "$f" ]; then ([ -r "$f" ] && [ -x "$f" ]) || chmod u+rx "$f"; else [ -r "$f" ] || chmod u+r "$f"; fi',
        `p=${quote(sourceParent)}`,
        'while :; do [ -x "$p" ] || chmod u+x "$p" || exit 41; [ "$p" = / ] && break; n=$(dirname -- "$p"); [ "$n" = "$p" ] && break; p="$n"; done',
        '[ -r "$f" ] && { [ ! -d "$f" ] || [ -x "$f" ]; } || { echo "source path is not readable/traversable after user-only permission repair" >&2; exit 42; }',
      ].join('; ');
      await source.cluster.exec(sourceCommand, 20_000).catch(error => {
        throw new Error(`源文件权限不足：${error instanceof Error ? error.message : String(error)}`);
      });

      // 目标端：定位最近已存在的父目录，补当前 owner 的 wx，创建缺失
      // 目录后再检查最终父目录。这覆盖“上一层没有 x/w”的常见失败。
      const destinationParent = path.posix.dirname(destinationPath);
      const destinationCommand = [
        `target=${quote(destinationParent)}`,
        'p="$target"',
        'while [ ! -e "$p" ]; do n=$(dirname -- "$p"); [ "$n" = "$p" ] && break; p="$n"; done',
        '[ -d "$p" ] || { echo "nearest destination parent is not a directory" >&2; exit 43; }',
        'if [ ! -x "$p" ] || [ ! -w "$p" ]; then chmod u+rwx "$p" || exit 44; fi',
        'mkdir -p -- "$target"',
        'if [ ! -x "$target" ] || [ ! -w "$target" ]; then chmod u+rwx "$target" || exit 45; fi',
        '[ -x "$target" ] && [ -w "$target" ] || { echo "destination parent is not writable" >&2; exit 46; }',
      ].join('; ');
      await destination.cluster.exec(destinationCommand, 20_000).catch(error => {
        throw new Error(`目标目录及上层权限不足：${error instanceof Error ? error.message : String(error)}`);
      });
    },
  };
}

async function computeFileHash(filePath: string): Promise<string> {
  const hash = createHash('sha256');
  const stream = fs.createReadStream(filePath);
  await pipeline(stream, hash);
  return hash.digest('hex');
}

async function computeRemoteHash(stream: NodeJS.ReadableStream): Promise<string> {
  const hash = createHash('sha256');
  await pipeline(stream, hash);
  return hash.digest('hex');
}

function sftpNoResult(invoke: (callback: (error?: Error) => void) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    invoke(error => error ? reject(error) : resolve());
  });
}

function isMissingRemoteFile(error: unknown): boolean {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? (error as { code?: unknown }).code
    : undefined;
  const message = error instanceof Error ? error.message : String(error);
  return code === 2 || code === 'ENOENT' || /no such file|not found|does not exist/i.test(message);
}

async function remotePathExists(
  sftp: SFTPWrapper,
  remotePath: string,
): Promise<boolean> {
  try {
    await new Promise<void>((resolve, reject) => {
      sftp.stat(remotePath, (error: Error | undefined) => error ? reject(error) : resolve());
    });
    return true;
  } catch (error) {
    if (isMissingRemoteFile(error)) return false;
    throw error;
  }
}

async function renameRemoteForOverwrite(
  sftp: SFTPWrapper,
  from: string,
  to: string,
): Promise<void> {
  if (typeof sftp.ext_openssh_rename === 'function') {
    try {
      await sftpNoResult(callback => sftp.ext_openssh_rename(from, to, callback));
      return;
    } catch {
      // Fall back to portable SFTP operations below.
    }
  }

  try {
    await sftpNoResult(callback => sftp.rename(from, to, callback));
    return;
  } catch (renameError) {
    if (!await remotePathExists(sftp, to)) throw renameError;
    try {
      await sftpNoResult(callback => sftp.unlink(to, callback));
    } catch (unlinkError) {
      if (!isMissingRemoteFile(unlinkError)) throw unlinkError;
    }
    await sftpNoResult(callback => sftp.rename(from, to, callback));
  }
}

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

function sendError(res: Response, status: number, code: string, message: string): void {
  res.status(status).json({ error: { code, message } });
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} is required`);
  return value;
}

function optionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error('must be a finite number');
  return n;
}

// ---------------------------------------------------------------------------
//  Route registration
// ---------------------------------------------------------------------------

export async function registerTransferRoutes(
  app: Express,
  io: SocketIOServer,
  resolveSession: ResolveTransferSession,
): Promise<void> {
  const adapter = createTransferAdapter(resolveSession);

  const engine = new TransferEngine(adapter, {
    concurrency: 2,
    emit: (event, data) => {
      if (event === 'transfer:updated') {
        io.emit('transfer:updated', data);
      }
      if (event === 'transfer:removed') {
        io.emit('transfer:removed', data);
      }
    },
  });

  const requestSessionId = (req: Request): string | undefined =>
    resolveRequestSessionId({
      cookie: (req.session as any)?.sshSessionId,
      header: req.get('X-SSH-Session-Id'),
      auth: undefined,
    }, id => Boolean(resolveSession(id)));

  // Helper to extract session from request
  const withSession = (req: Request, res: Response): TransferRouteSession | undefined => {
    const sessionId = requestSessionId(req);
    const session = sessionId ? resolveSession(sessionId) : undefined;
    if (!session) {
      sendError(res, 401, 'SSH_SESSION_REQUIRED', 'An active SSH session is required');
      return undefined;
    }
    return session;
  };

  // 文件夹展开/创建之前先做一次权限预检，因此空文件夹互传也能补足父目录权限。
  app.post('/api/transfers/preflight-remote-copy', async (req, res) => {
    const destinationSessionId = requestSessionId(req);
    // requestSessionId 会过滤已失效的会话。这里必须显式结束响应；之前的
    // 短路 return 会让浏览器请求永久 pending，界面表现为传输一直转圈。
    if (!destinationSessionId) {
      sendError(res, 401, 'SSH_SESSION_REQUIRED', 'An active SSH session is required');
      return;
    }
    try {
      const sourceSessionId = requiredString(req.body?.sourceSessionId, 'sourceSessionId');
      const sourcePath = requiredString(req.body?.sourcePath, 'sourcePath');
      const targetDirectory = requiredString(req.body?.targetDirectory, 'targetDirectory');
      if (!resolveSession(sourceSessionId)) throw new Error('源集群 SSH 会话已失效');
      await adapter.prepareRemoteCopy!({
        sourcePath,
        destinationPath: path.posix.join(targetDirectory, '.hpclaw-permission-check'),
        sourceSessionId,
        destinationSessionId,
      });
      res.json({ ok: true });
    } catch (error) {
      sendError(res, 403, 'REMOTE_COPY_PERMISSION_DENIED', error instanceof Error ? error.message : String(error));
    }
  });

  const requireOwnedTask = (req: Request, res: Response): TransferTask | undefined => {
    const sessionId = requestSessionId(req);
    if (!sessionId) {
      sendError(res, 401, 'SSH_SESSION_REQUIRED', 'An active SSH session is required');
      return undefined;
    }
    const task = engine.getTask(String(req.params.id || ''));
    if (!task || task.sessionId !== sessionId) {
      sendError(res, 404, 'TRANSFER_NOT_FOUND', 'Transfer task not found for this SSH session');
      return undefined;
    }
    return task;
  };

  // -----------------------------------------------------------------------
  //  GET /api/transfers — list tasks (?sessionId= 只返回该集群的任务，多标签页隔离)
  // -----------------------------------------------------------------------
  app.get('/api/transfers', (req, res) => {
    const sessionId = requestSessionId(req);
    if (!sessionId) {
      sendError(res, 401, 'SSH_SESSION_REQUIRED', 'An active SSH session is required');
      return;
    }
    res.json({ transfers: engine.list().filter(task => task.sessionId === sessionId) });
  });

  // -----------------------------------------------------------------------
  //  POST /api/transfers — enqueue new transfer
  // -----------------------------------------------------------------------
  app.post('/api/transfers', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;

    try {
      const direction = requiredString(req.body?.direction, 'direction');
      if (direction !== 'upload' && direction !== 'download' && direction !== 'remote-copy') {
        throw new Error('direction must be "upload", "download" or "remote-copy"');
      }
      const localPath = requiredString(req.body?.localPath, 'localPath');
      const remotePath = requiredString(req.body?.remotePath, 'remotePath');
      const totalBytes = optionalNumber(req.body?.totalBytes) ?? 0;
      const transferredBytes = optionalNumber(req.body?.transferredBytes) ?? 0;
      const conflictPolicy = (req.body?.conflictPolicy as string) || 'ask';
      const verificationMode = (req.body?.verificationMode as string) || 'size';
      // remote-copy：源集群会话（读取侧）；sessionId（body/路由解析）为目标写入侧
      const sourceSessionId = typeof req.body?.sourceSessionId === 'string' ? req.body.sourceSessionId : undefined;
      if (direction === 'remote-copy' && !sourceSessionId) {
        throw new Error('remote-copy requires sourceSessionId');
      }

      const task = engine.enqueue({
        profileId: requiredString(req.body?.profileId, 'profileId'),
        direction: direction as 'upload' | 'download' | 'remote-copy',
        sourceSessionId,
        localPath,
        remotePath,
        temporaryPath: requiredString(req.body?.temporaryPath, 'temporaryPath'),
        totalBytes,
        transferredBytes,
        conflictPolicy: conflictPolicy as ConflictPolicy,
        verificationMode: verificationMode as VerificationMode,
        retryCount: 0,
      });

      // Auto-resume (starts immediately if capacity available)
      await engine.resume(task.id, requestSessionId(req) || '');

      // Broadcast summary
      io.emit('transfer:summary', { total: engine.list().length });

      res.status(201).json({ transfer: task });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/is required|must be/.test(message)) {
        sendError(res, 400, 'INVALID_TRANSFER_REQUEST', message);
      } else {
        sendError(res, 500, 'TRANSFER_OPERATION_FAILED', message);
      }
    }
  });

  // -----------------------------------------------------------------------
  //  DELETE /api/transfers/completed — clear completed/cancelled tasks
  //  (registered before /:id so 'completed' is not treated as an id)
  // -----------------------------------------------------------------------
  app.delete('/api/transfers/completed', (req, res) => {
    const session = withSession(req, res);
    if (!session) return;

    const sessionId = requestSessionId(req)!;
    const removed = engine.clearCompleted(task => task.sessionId === sessionId);
    io.emit('transfer:summary', { total: engine.list().length });
    res.json({ ok: true, removed });
  });

  // -----------------------------------------------------------------------
  //  DELETE /api/transfers/:id — remove a terminal-state task
  // -----------------------------------------------------------------------
  app.delete('/api/transfers/:id', (req, res) => {
    if (!requireOwnedTask(req, res)) return;

    try {
      engine.remove(requiredString(req.params.id, 'id'));
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendError(res, 400, 'TRANSFER_REMOVE_FAILED', message);
    }
  });

  // -----------------------------------------------------------------------
  //  POST /api/transfers/:id/pause
  // -----------------------------------------------------------------------
  app.post('/api/transfers/:id/pause', async (req, res) => {
    if (!requireOwnedTask(req, res)) return;

    try {
      await engine.pause(requiredString(req.params.id, 'id'));
      io.emit('transfer:updated', engine.list().find(t => t.id === req.params.id));
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendError(res, 400, 'TRANSFER_PAUSE_FAILED', message);
    }
  });

  // -----------------------------------------------------------------------
  //  POST /api/transfers/:id/resume
  // -----------------------------------------------------------------------
  app.post('/api/transfers/:id/resume', async (req, res) => {
    if (!requireOwnedTask(req, res)) return;

    try {
      const sessionId = requestSessionId(req);
      await engine.resume(requiredString(req.params.id, 'id'), sessionId || '');
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendError(res, 400, 'TRANSFER_RESUME_FAILED', message);
    }
  });

  // -----------------------------------------------------------------------
  //  POST /api/transfers/:id/cancel
  // -----------------------------------------------------------------------
  app.post('/api/transfers/:id/cancel', async (req, res) => {
    if (!requireOwnedTask(req, res)) return;

    try {
      const id = requiredString(req.params.id, 'id');
      await engine.cancel(id);
      io.emit('transfer:summary', { total: engine.list().length });
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendError(res, 400, 'TRANSFER_CANCEL_FAILED', message);
    }
  });

  // -----------------------------------------------------------------------
  //  POST /api/transfers/:id/retry
  // -----------------------------------------------------------------------
  app.post('/api/transfers/:id/retry', async (req, res) => {
    if (!requireOwnedTask(req, res)) return;

    try {
      const sessionId = requestSessionId(req);
      await engine.retry(requiredString(req.params.id, 'id'), sessionId || '');
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendError(res, 400, 'TRANSFER_RETRY_FAILED', message);
    }
  });

  // -----------------------------------------------------------------------
  //  PUT /api/transfers/settings
  // -----------------------------------------------------------------------
  app.put('/api/transfers/settings', (req, res) => {
    const session = withSession(req, res);
    if (!session) return;

    try {
      const concurrency = req.body?.concurrency;
      if (concurrency !== undefined) {
        const c = Number(concurrency);
        if (![1, 2, 3, 4].includes(c)) throw new Error('concurrency must be 1-4');
        engine.setConcurrency(c as 1 | 2 | 3 | 4);
      }
      const bandwidthLimit = req.body?.bandwidthLimit;
      if (bandwidthLimit !== undefined) {
        engine.setBandwidthLimit(bandwidthLimit === null ? null : Number(bandwidthLimit));
      }
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendError(res, 400, 'TRANSFER_SETTINGS_FAILED', message);
    }
  });

  // Restore persisted tasks — 必须放在所有路由注册之后（本函数是 async，
  // 调用方不 await；若恢复逻辑在路由注册前 await，路由会晚于 SPA 兜底
  // app.get('*') 注册，导致 GET /api/transfers 永远返回 index.html）
  const restored = await loadTasks();
  for (const task of restored) {
    // Use the internal task map directly so we don't re-generate IDs
    (engine as any).tasks.set(task.id, task);
    (engine as any).emitTaskUpdated(task);
  }
}
