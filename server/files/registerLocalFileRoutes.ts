// AI 对话富内容卡片：本地文件读取（与 registerFileRoutes 的远程契约对齐）。
// 信任模型：服务只监听 127.0.0.1，但对话文本是 AI 生成的不可信输入，
// 因此允许根固定为 DATA_ROOT + 当前工作区（workspace），不做全盘开放。

import fs from 'node:fs';
import type { Express, Response } from 'express';
import { classifyPreview } from '../../shared/filePreview';
import { DATA_ROOT } from '../paths';
import { normalizeWorkspace } from '../dsh/workspace';
import { LocalPathError, resolveLocalChatFilePath } from './localPaths';

/** /api/local/files/read(+batch) 单文件上限：与远程 read 一致 */
const LOCAL_FILE_READ_MAX_BYTES = 10 * 1024 * 1024;
/** /api/local/files/view 直出上限：与远程 view 一致 */
const LOCAL_FILE_VIEW_MAX_BYTES = 25 * 1024 * 1024;
/** 批量读取的单次文件数上限：与远程 batch 一致 */
const LOCAL_FILE_READ_BATCH_MAX = 10;

/** 与 ContentFetcher.ts 的契约保持一致：文本 utf8，二进制 base64 */
interface LocalFileContent {
  filePath: string;
  content: string;
  metadata: { size: number; mime: string };
}

export interface LocalFileRouteOptions {
  /** 允许根之一：默认 DATA_ROOT，测试可注入临时目录 */
  dataRoot?: string;
}

function sendError(res: Response, status: number, code: string, message: string): void {
  res.status(status).json({ error: { code, message } });
}

/** 带 HTTP 语义的业务错误：目录/超限/格式不支持需要与路径解析失败区分 */
class HttpLocalFileError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message);
  }
}

/** 允许根集合 = [DATA_ROOT, normalizeWorkspace(workspace)]，realpath 化并去重 */
function allowedRoots(dataRoot: string, workspace: unknown): string[] {
  const roots: string[] = [];
  try {
    roots.push(fs.realpathSync(dataRoot));
  } catch {
    roots.push(dataRoot);
  }
  const normalizedWorkspace = normalizeWorkspace(workspace);
  if (normalizedWorkspace && !roots.some(root => root.toLowerCase() === normalizedWorkspace.toLowerCase())) {
    roots.push(normalizedWorkspace);
  }
  return roots;
}

/** read/view 共用的前置校验：解析到允许根内 + 存在性、目录、大小上限、格式可支持性 */
function resolveReadableLocalFile(roots: string[], input: string, maxBytes: number) {
  const filePath = resolveLocalChatFilePath(input, roots);
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) throw new HttpLocalFileError(400, 'LOCAL_FILE_IS_DIRECTORY', 'path is a directory');
  if (stat.size > maxBytes) {
    throw new HttpLocalFileError(413, 'LOCAL_FILE_TOO_LARGE', `file size ${stat.size} exceeds the ${maxBytes} byte limit`);
  }
  const descriptor = classifyPreview(filePath, stat.size);
  if (descriptor.mode === 'unsupported') {
    throw new HttpLocalFileError(415, 'LOCAL_FILE_UNSUPPORTED', descriptor.reason || 'Unsupported file type');
  }
  return { filePath, size: stat.size, descriptor };
}

function readLocalFileContent(roots: string[], input: string, maxBytes: number): LocalFileContent {
  const { filePath, size, descriptor } = resolveReadableLocalFile(roots, input, maxBytes);
  const buffer = fs.readFileSync(filePath);
  return {
    // 回显请求方给出的原始路径：卡片文件名与 view URL 都以它为准（服务端再解析一次）
    filePath: input,
    content: descriptor.mode === 'binary' ? buffer.toString('base64') : buffer.toString('utf8'),
    metadata: { size, mime: descriptor.mime },
  };
}

function sendRouteError(res: Response, error: unknown): void {
  if (error instanceof HttpLocalFileError) {
    sendError(res, error.status, error.code, error.message);
    return;
  }
  if (error instanceof LocalPathError) {
    if (error.failure === 'required') sendError(res, 400, 'LOCAL_FILE_REQUIRED', error.message);
    else if (error.failure === 'outside') sendError(res, 403, 'LOCAL_FILE_OUTSIDE_ROOTS', error.message);
    else sendError(res, 404, 'LOCAL_FILE_NOT_FOUND', error.message);
    return;
  }
  const message = error instanceof Error ? error.message : String(error);
  const errorCode = typeof error === 'object' && error !== null && 'code' in error
    ? (error as { code?: unknown }).code
    : undefined;
  if (errorCode === 'ENOENT') sendError(res, 404, 'LOCAL_FILE_NOT_FOUND', message);
  else if (errorCode === 'EACCES' || errorCode === 'EPERM') sendError(res, 403, 'LOCAL_FILE_FORBIDDEN', message);
  else sendError(res, 500, 'LOCAL_FILE_OPERATION_FAILED', message);
}

function requiredPath(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpLocalFileError(400, 'LOCAL_FILE_REQUIRED', 'path is required');
  }
  return value;
}

export function registerLocalFileRoutes(app: Express, options: LocalFileRouteOptions = {}): void {
  const dataRoot = options.dataRoot ?? DATA_ROOT;

  app.post('/api/local/files/read', (req, res) => {
    try {
      const input = requiredPath(req.body?.path);
      const roots = allowedRoots(dataRoot, req.body?.workspace);
      res.json(readLocalFileContent(roots, input, LOCAL_FILE_READ_MAX_BYTES));
    } catch (error) {
      sendRouteError(res, error);
    }
  });

  app.post('/api/local/files/read/batch', (req, res) => {
    try {
      const paths = req.body?.paths;
      if (!Array.isArray(paths) || paths.length === 0 || paths.length > LOCAL_FILE_READ_BATCH_MAX
        || !paths.every(value => typeof value === 'string' && value.trim())) {
        throw new HttpLocalFileError(400, 'LOCAL_FILE_REQUIRED', `paths must be an array of 1-${LOCAL_FILE_READ_BATCH_MAX} non-empty strings`);
      }
      const roots = allowedRoots(dataRoot, req.body?.workspace);
      // 单文件失败（不存在/越界/超限/格式不支持）不拖垮整批：跳过，与远程 batch 语义一致
      const contents: LocalFileContent[] = [];
      for (const input of paths) {
        try {
          contents.push(readLocalFileContent(roots, input, LOCAL_FILE_READ_MAX_BYTES));
        } catch { /* per-file failures are omitted from the batch result */ }
      }
      res.json(contents);
    } catch (error) {
      sendRouteError(res, error);
    }
  });

  app.get('/api/local/files/view', (req, res) => {
    try {
      const input = requiredPath(req.query.path);
      const roots = allowedRoots(dataRoot, req.query.workspace);
      const { filePath, descriptor } = resolveReadableLocalFile(roots, input, LOCAL_FILE_VIEW_MAX_BYTES);
      const buffer = fs.readFileSync(filePath);
      const isText = descriptor.mode !== 'binary';
      res.setHeader('Content-Type', `${descriptor.mime}${isText ? '; charset=utf-8' : ''}`);
      res.setHeader('Content-Length', String(buffer.length));
      res.setHeader('Cache-Control', 'private, max-age=30');
      res.end(buffer);
    } catch (error) {
      sendRouteError(res, error);
    }
  });
}
