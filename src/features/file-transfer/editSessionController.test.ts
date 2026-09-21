import { describe, expect, it } from 'vitest';
import type { FileEntry, TransferTask } from '@/shared/fileTransfer';
import {
  canOpenCachedEditSession,
  createEditDownloadTask,
  createEditUploadTask,
  nextEditAction,
} from './editSessionController';

const session = {
  id: 'edit-1',
  profileId: 'profile-1',
  sshSessionId: 'ssh-1',
  remotePath: '/work/report.docx',
  localPath: 'C:\\cache\\report.docx',
  state: 'downloading' as const,
  dirty: false,
};

const file: FileEntry = {
  name: 'report.docx',
  path: '/work/report.docx',
  kind: 'file',
  size: 42,
  modifiedAt: 1,
};

describe('edit session transfer orchestration', () => {
  it('builds a complete overwrite download into the managed cache', () => {
    expect(createEditDownloadTask(session, file, 'profile-1', 'task-1')).toMatchObject({
      direction: 'download',
      localPath: session.localPath,
      remotePath: file.path,
      totalBytes: 42,
      conflictPolicy: 'overwrite',
      verificationMode: 'size',
    });
  });

  it('builds an atomic overwrite upload to the original remote path', () => {
    const task = createEditUploadTask(
      { ...session, state: 'editing', dirty: true },
      64,
      'profile-1',
      'task-2',
    );
    expect(task).toMatchObject({
      direction: 'upload',
      localPath: session.localPath,
      remotePath: session.remotePath,
      totalBytes: 64,
      conflictPolicy: 'overwrite',
    });
    expect(task.temporaryPath).not.toBe(session.remotePath);
  });

  it('opens after download completion and marks upload completion synced', () => {
    const base = {
      id: 'transfer-1', profileId: 'profile-1', sessionId: 'ssh-1',
      localPath: session.localPath, remotePath: session.remotePath,
      temporaryPath: '/tmp', totalBytes: 42, transferredBytes: 42,
      bytesPerSecond: 0, state: 'completed', conflictPolicy: 'overwrite',
      verificationMode: 'size', retryCount: 0, createdAt: 1, updatedAt: 2,
    } satisfies Omit<TransferTask, 'direction'>;

    expect(nextEditAction(session, { ...base, direction: 'download' })).toEqual({
      type: 'open', sessionId: session.id,
    });
    expect(nextEditAction(
      { ...session, lastLocalFingerprint: 'hash-1' },
      { ...base, direction: 'upload' },
    )).toEqual({ type: 'synced', sessionId: session.id, fingerprint: 'hash-1' });
  });

  it('maps a failed transfer without losing its error', () => {
    const failed = {
      id: 'transfer-1', profileId: 'profile-1', sessionId: 'ssh-1',
      direction: 'upload', localPath: session.localPath, remotePath: session.remotePath,
      temporaryPath: '/tmp', totalBytes: 42, transferredBytes: 10,
      bytesPerSecond: 0, state: 'failed', conflictPolicy: 'overwrite',
      verificationMode: 'size', retryCount: 3, createdAt: 1, updatedAt: 2,
      error: 'network unavailable',
    } satisfies TransferTask;

    expect(nextEditAction(session, failed)).toEqual({
      type: 'failed', sessionId: session.id, error: 'network unavailable',
    });
  });

  it('does not open a failed download session without a local fingerprint', () => {
    expect(canOpenCachedEditSession({
      ...session,
      state: 'failed',
      dirty: true,
      error: 'size mismatch',
    })).toBe(false);

    expect(canOpenCachedEditSession({
      ...session,
      state: 'failed',
      dirty: true,
      lastLocalFingerprint: 'local-hash',
      error: 'upload failed',
    })).toBe(true);
  });
});
