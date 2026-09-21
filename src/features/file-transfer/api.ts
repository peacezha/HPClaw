import type { FileEntry, TransferTask } from '@/shared/fileTransfer';
import type { FilePreviewPayload, PreviewDescriptor } from '@/shared/filePreview';
import { toDisplayError } from '../../utils/displayError';

const BASE = '';

function request(
  path: string,
  sessionId: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-SSH-Session-Id': sessionId,
      ...options.headers,
    },
  });
}

async function handleResponse(res: Response): Promise<any> {
  if (!res.ok) {
    let body: any;
    try {
      body = await res.json();
    } catch {
      body = { error: res.statusText };
    }
    const error = new Error(
      toDisplayError(body, res.statusText || `HTTP ${res.status}`),
    ) as Error & { code?: string; status?: number };
    const nested = body?.error;
    error.code = typeof nested?.code === 'string'
      ? nested.code
      : typeof body?.code === 'string' ? body.code : undefined;
    error.status = res.status;
    throw error;
  }
  return res.json();
}

// Remote file operations

export async function listRemoteFiles(
  sessionId: string,
  remotePath: string,
  signal?: AbortSignal,
): Promise<{ entries: FileEntry[] }> {
  const path = `/api/remote/files?path=${encodeURIComponent(remotePath)}`;
  const res = await request(path, sessionId, { signal });
  return handleResponse(res);
}

export async function statRemote(
  sessionId: string,
  remotePath: string,
): Promise<{ entry: FileEntry }> {
  const path = `/api/remote/stat?path=${encodeURIComponent(remotePath)}`;
  const res = await request(path, sessionId);
  return handleResponse(res);
}

export async function mkdirRemote(
  sessionId: string,
  remotePath: string,
): Promise<{ ok: boolean }> {
  const res = await request('/api/remote/mkdir', sessionId, {
    method: 'POST',
    body: JSON.stringify({ path: remotePath }),
  });
  return handleResponse(res);
}

export async function touchRemote(
  sessionId: string,
  remotePath: string,
): Promise<{ ok: boolean }> {
  const res = await request('/api/remote/touch', sessionId, {
    method: 'POST',
    body: JSON.stringify({ path: remotePath }),
  });
  return handleResponse(res);
}

export interface WalkResult {
  files: { path: string; size: number }[];
  dirs: string[];
  truncated: boolean;
}

export async function walkRemote(
  sessionId: string,
  remotePath: string,
): Promise<WalkResult> {
  const path = `/api/remote/walk?path=${encodeURIComponent(remotePath)}`;
  const res = await request(path, sessionId);
  return handleResponse(res);
}

export async function renameRemote(
  sessionId: string,
  from: string,
  to: string,
): Promise<{ ok: boolean }> {
  const res = await request('/api/remote/rename', sessionId, {
    method: 'POST',
    body: JSON.stringify({ from, to }),
  });
  return handleResponse(res);
}

export async function copyRemote(
  sessionId: string,
  sourcePaths: string[],
  targetDirectory: string,
): Promise<{ paths: string[] }> {
  const res = await request('/api/remote/copy', sessionId, {
    method: 'POST',
    body: JSON.stringify({ sourcePaths, targetDirectory }),
  });
  return handleResponse(res);
}

export async function removeRemote(
  sessionId: string,
  remotePath: string,
  recursive: boolean,
): Promise<{ removed: number }> {
  const res = await request('/api/remote/remove', sessionId, {
    method: 'POST',
    body: JSON.stringify({ path: remotePath, recursive }),
  });
  return handleResponse(res);
}

export async function removePreviewRemote(
  sessionId: string,
  remotePath: string,
  recursive: boolean,
): Promise<{ entries: FileEntry[]; total: number; recursive: boolean }> {
  const res = await request('/api/remote/remove/preview', sessionId, {
    method: 'POST',
    body: JSON.stringify({ path: remotePath, recursive }),
  });
  return handleResponse(res);
}

export async function chmodRemote(
  sessionId: string,
  remotePath: string,
  mode: number,
): Promise<{ ok: boolean }> {
  const res = await request('/api/remote/chmod', sessionId, {
    method: 'POST',
    body: JSON.stringify({ path: remotePath, mode }),
  });
  return handleResponse(res);
}

export async function previewRemote(
  sessionId: string,
  remotePath: string,
  _descriptor?: PreviewDescriptor,
  signal?: AbortSignal,
): Promise<FilePreviewPayload> {
  const path = `/api/remote/preview?path=${encodeURIComponent(remotePath)}`;
  const res = await request(path, sessionId, { signal });
  return handleResponse(res);
}

export async function writeRemote(
  sessionId: string,
  remotePath: string,
  content: string,
): Promise<{ ok: boolean }> {
  const res = await request('/api/remote/write', sessionId, {
    method: 'POST',
    body: JSON.stringify({ path: remotePath, content }),
  });
  return handleResponse(res);
}

export async function searchRemote(
  sessionId: string,
  root: string,
  query: string,
): Promise<{ entries: FileEntry[]; truncated: boolean }> {
  const path = `/api/remote/search?root=${encodeURIComponent(root)}&query=${encodeURIComponent(query)}`;
  const res = await request(path, sessionId);
  return handleResponse(res);
}

// Transfer operations

export async function listTransfers(
  sessionId: string,
): Promise<TransferTask[]> {
  const res = await request('/api/transfers', sessionId);
  return handleResponse(res);
}

export async function enqueueTransfer(
  sessionId: string,
  input: Omit<
    TransferTask,
    'id' | 'state' | 'createdAt' | 'updatedAt' | 'bytesPerSecond'
  >,
): Promise<TransferTask> {
  const res = await request('/api/transfers', sessionId, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  const data = await handleResponse(res);
  return data.transfer || data;
}

export async function preflightRemoteCopy(
  sourceSessionId: string,
  sourcePath: string,
  destinationSessionId: string,
  targetDirectory: string,
): Promise<void> {
  const res = await request('/api/transfers/preflight-remote-copy', destinationSessionId, {
    method: 'POST',
    body: JSON.stringify({ sourceSessionId, sourcePath, targetDirectory }),
  });
  await handleResponse(res);
}

export async function pauseTransfer(
  sessionId: string,
  taskId: string,
): Promise<void> {
  const res = await request(`/api/transfers/${taskId}/pause`, sessionId, {
    method: 'POST',
  });
  await handleResponse(res);
}

export async function resumeTransfer(
  sessionId: string,
  taskId: string,
): Promise<void> {
  const res = await request(`/api/transfers/${taskId}/resume`, sessionId, {
    method: 'POST',
  });
  await handleResponse(res);
}

export async function cancelTransfer(
  sessionId: string,
  taskId: string,
): Promise<void> {
  const res = await request(`/api/transfers/${taskId}/cancel`, sessionId, {
    method: 'POST',
  });
  await handleResponse(res);
}

export async function retryTransfer(
  sessionId: string,
  taskId: string,
): Promise<void> {
  const res = await request(`/api/transfers/${taskId}/retry`, sessionId, {
    method: 'POST',
  });
  await handleResponse(res);
}

export async function removeTransfer(
  sessionId: string,
  taskId: string,
): Promise<void> {
  const res = await request(`/api/transfers/${taskId}`, sessionId, {
    method: 'DELETE',
  });
  await handleResponse(res);
}

export async function clearCompletedTransfers(
  sessionId: string,
): Promise<{ ok: boolean; removed: string[] }> {
  const res = await request('/api/transfers/completed', sessionId, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

export async function updateTransferSettings(
  sessionId: string,
  settings: { concurrency?: number; bandwidthLimit?: number | null },
): Promise<void> {
  const res = await request('/api/transfers/settings', sessionId, {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
  await handleResponse(res);
}
