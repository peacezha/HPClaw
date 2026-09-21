import { detectFileType } from './FileTypeDetector';
import type { CardContent, RendererType } from './RendererRegistry';

interface FetchedContent {
  type: RendererType;
  filePath: string;
  content: string;
  metadata: {
    size: number;
    mime: string;
    dimensions?: { width: number; height: number };
    rows?: number;
  };
}

/** 多集群路由：带集群会话时经 X-SSH-Session-Id 指向对应集群（本地模式不传） */
function contentHeaders(sessionId?: string | null): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(sessionId ? { 'X-SSH-Session-Id': sessionId } : {}),
  };
}

export async function fetchFileContent(filePath: string, signal?: AbortSignal, sessionId?: string | null): Promise<CardContent> {
  const res = await fetch('/api/files/read', {
    method: 'POST',
    headers: contentHeaders(sessionId),
    body: JSON.stringify({ path: filePath }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '读取失败' }));
    throw new Error(err.error?.message || err.error || `HTTP ${res.status}`);
  }

  const data: FetchedContent = await res.json();
  const fileName = filePath.split('/').pop() || filePath;

  return {
    type: detectFileType(filePath, data.metadata.mime),
    filePath,
    fileName,
    content: data.content,
    metadata: data.metadata,
    sessionId,
  };
}

export async function fetchFileContentBatch(
  paths: string[],
  signal?: AbortSignal,
  sessionId?: string | null,
): Promise<Map<string, CardContent>> {
  const res = await fetch('/api/files/read/batch', {
    method: 'POST',
    headers: contentHeaders(sessionId),
    body: JSON.stringify({ paths }),
    signal,
  });

  if (!res.ok) {
    throw new Error('批量读取失败');
  }

  const data: FetchedContent[] = await res.json();
  const map = new Map<string, CardContent>();

  for (const item of data) {
    const fileName = item.filePath.split('/').pop() || item.filePath;
    map.set(item.filePath, {
      type: detectFileType(item.filePath, item.metadata.mime),
      filePath: item.filePath,
      fileName,
      content: item.content,
      metadata: item.metadata,
      sessionId,
    });
  }

  return map;
}

/** Windows 与 Unix 分隔符都兼容的文件名提取（本地卡片的路径形态由模型给出） */
function baseName(filePath: string): string {
  return filePath.split(/[\\/]/).pop() || filePath;
}

/**
 * <img>/<a> 用的文件直出 URL：本地模式走 /api/local/files/view（DATA_ROOT + workspace 解析），
 * 集群模式走 /api/files/view（SFTP + 会话路由）。
 */
export function buildFileViewUrl(
  filePath: string,
  opts: { sessionId?: string | null; local?: boolean; workspace?: string } = {},
): string {
  if (opts.local) {
    const workspaceParam = opts.workspace ? `&workspace=${encodeURIComponent(opts.workspace)}` : '';
    return `/api/local/files/view?path=${encodeURIComponent(filePath)}${workspaceParam}`;
  }
  const sessionParam = opts.sessionId ? `&sessionId=${encodeURIComponent(opts.sessionId)}` : '';
  return `/api/files/view?path=${encodeURIComponent(filePath)}${sessionParam}`;
}

/** 本地模式（无集群会话）的文件读取：契约与 /api/files/read 一致 */
export async function fetchLocalFileContent(filePath: string, workspace?: string, signal?: AbortSignal): Promise<CardContent> {
  const res = await fetch('/api/local/files/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: filePath, workspace: workspace || undefined }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '读取失败' }));
    throw new Error(err.error?.message || err.error || `HTTP ${res.status}`);
  }

  const data: FetchedContent = await res.json();

  return {
    type: detectFileType(filePath, data.metadata.mime),
    filePath,
    fileName: baseName(filePath),
    content: data.content,
    metadata: data.metadata,
    local: true,
    workspace: workspace || undefined,
  };
}

/** Windows 绝对路径（C:\... / C:/...）只可能是本地文件，集群端一定不存在 */
export function isWindowsAbsolutePath(filePath: string): boolean {
  return /^[a-zA-Z]:[\\/]/.test(filePath);
}

/** 点前缀相对路径（.dsh-vision-toolkit/...、./x.png）：dsh 等本地工具产物的常见形态 */
function isDotRelativePath(filePath: string): boolean {
  return /^\.{1,2}[\\/]/.test(filePath) || /^\.[A-Za-z0-9_-]/.test(filePath);
}

function hasClusterSession(sessionId?: string | null): boolean {
  return !!sessionId && sessionId !== 'local-workbench';
}

/**
 * 对话文件路径的候选 view URL（按优先级排序，调用方依次尝试）：
 * - Windows 绝对路径：仅本地（发到集群端必然失败）
 * - 点前缀相对路径：本地优先（本地工具产物居多），有集群会话时集群兜底
 * - 其余（Unix 绝对等）：有集群会话先集群后本地；无会话仅本地
 * 路由不能只按 sessionId 判定：dsh 引擎始终在本地产出文件，而对话会话可能绑定集群。
 */
export function buildChatFileViewUrls(
  filePath: string,
  opts: { sessionId?: string | null; workspace?: string } = {},
): string[] {
  const local = buildFileViewUrl(filePath, { local: true, workspace: opts.workspace });
  if (isWindowsAbsolutePath(filePath) || !hasClusterSession(opts.sessionId)) return [local];
  const cluster = buildFileViewUrl(filePath, { sessionId: opts.sessionId });
  return isDotRelativePath(filePath) ? [local, cluster] : [cluster, local];
}

/**
 * 对话文件读取（本地/集群自动路由 + 交叉重试）：
 * 主端点失败后在另一端点重试一次，覆盖"会话绑集群但文件在本地"（及反向）的场景。
 */
export async function fetchChatFileContent(
  filePath: string,
  opts: { sessionId?: string | null; workspace?: string; signal?: AbortSignal } = {},
): Promise<CardContent> {
  const fetchLocal = () => fetchLocalFileContent(filePath, opts.workspace, opts.signal);
  if (isWindowsAbsolutePath(filePath) || !hasClusterSession(opts.sessionId)) return fetchLocal();
  const fetchCluster = () => fetchFileContent(filePath, opts.signal, opts.sessionId);
  const [primary, fallback] = isDotRelativePath(filePath) ? [fetchLocal, fetchCluster] : [fetchCluster, fetchLocal];
  try {
    return await primary();
  } catch {
    return fallback();
  }
}

// Size threshold: files under this are shown inline, above show "click to load"
// 3MB：绝大多数结果图直接出图，只有特大图才退化为"点击加载"
export const INLINE_SIZE_THRESHOLD = 3 * 1024 * 1024; // 3MB
