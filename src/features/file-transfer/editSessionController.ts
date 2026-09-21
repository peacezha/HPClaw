import type { FileEntry, TransferTask } from '@/shared/fileTransfer';
import { makeTemporaryTransferName } from '@/shared/fileTransfer';
import type { RemoteEditSession } from '@/shared/remoteEdit';

export type TransferInput = Omit<
  TransferTask,
  'id' | 'state' | 'createdAt' | 'updatedAt' | 'bytesPerSecond'
>;

export type EditAction =
  | { type: 'open'; sessionId: string }
  | { type: 'synced'; sessionId: string; fingerprint: string }
  | { type: 'failed'; sessionId: string; error: string };

export function createEditDownloadTask(
  session: RemoteEditSession,
  file: FileEntry,
  profileId: string,
  taskId: string,
): TransferInput {
  return {
    profileId,
    sessionId: session.sshSessionId,
    direction: 'download',
    localPath: session.localPath,
    remotePath: file.path,
    temporaryPath: makeTemporaryTransferName(session.localPath, taskId, 'local'),
    totalBytes: file.size,
    transferredBytes: 0,
    conflictPolicy: 'overwrite',
    verificationMode: 'size',
    retryCount: 0,
  };
}

export function createEditUploadTask(
  session: RemoteEditSession,
  size: number,
  profileId: string,
  taskId: string,
): TransferInput {
  return {
    profileId,
    sessionId: session.sshSessionId,
    direction: 'upload',
    localPath: session.localPath,
    remotePath: session.remotePath,
    temporaryPath: makeTemporaryTransferName(session.remotePath, taskId, 'remote'),
    totalBytes: size,
    transferredBytes: 0,
    conflictPolicy: 'overwrite',
    verificationMode: 'size',
    retryCount: 0,
  };
}

export function canOpenCachedEditSession(session: RemoteEditSession): boolean {
  if (['editing', 'opening', 'uploading'].includes(session.state)) return true;
  return session.state === 'failed' && Boolean(session.lastLocalFingerprint);
}

export function nextEditAction(
  session: RemoteEditSession,
  task: TransferTask,
): EditAction | null {
  if (task.state === 'failed') {
    return {
      type: 'failed',
      sessionId: session.id,
      error: task.error || '传输失败',
    };
  }
  if (task.state !== 'completed') return null;
  if (task.direction === 'download') {
    return { type: 'open', sessionId: session.id };
  }
  return {
    type: 'synced',
    sessionId: session.id,
    fingerprint: session.lastLocalFingerprint || '',
  };
}
