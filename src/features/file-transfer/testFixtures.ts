import type {
  FileEntry,
  HostProfileMetadata,
  TransferTask,
} from '@/shared/fileTransfer';
import type { HpclawDesktop } from '@/src/types/desktop';

export function createFileEntry(overrides?: Partial<FileEntry>): FileEntry {
  return {
    name: 'file.txt',
    path: '/remote/file.txt',
    kind: 'file',
    size: 1024,
    modifiedAt: Date.now(),
    permissions: 0o644,
    owner: 'user',
    group: 'users',
    ...overrides,
  };
}

export function createHostProfile(
  overrides?: Partial<HostProfileMetadata>,
): HostProfileMetadata {
  return {
    id: 'prof-1',
    name: 'HPC Cluster',
    group: 'Default',
    host: 'hpc.example.edu',
    port: 22,
    username: 'user',
    favorite: false,
    defaultLocalPath: undefined,
    defaultRemotePath: undefined,
    fingerprint: undefined,
    hasSavedPassword: false,
    hasSavedTotp: false,
    lastUsedAt: undefined,
    ...overrides,
  };
}

export function createTransferTask(
  overrides?: Partial<TransferTask>,
): TransferTask {
  return {
    id: 'task-1',
    profileId: 'prof-1',
    sessionId: 'sess-1',
    direction: 'download',
    localPath: '/local/file.txt',
    remotePath: '/remote/file.txt',
    temporaryPath: '/remote/.file.txt.hpclaw-task-1.part',
    totalBytes: 1000,
    transferredBytes: 0,
    bytesPerSecond: 0,
    state: 'queued',
    conflictPolicy: 'ask',
    verificationMode: 'size',
    retryCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    error: undefined,
    ...overrides,
  };
}

export function mockHpclawDesktop(
  overrides?: Partial<HpclawDesktop>,
): HpclawDesktop {
  return {
    clipboard: {
      readText: async () => '',
      writeText: async () => {},
    },
    secrets: {
      get: async () => '',
      set: async () => {},
      delete: async () => {},
    },
    profiles: {
      list: async () => [],
      save: async () => {},
      remove: async () => {},
      getCredentials: async () => ({ password: '', totpSecret: '' }),
      trustFingerprint: async () => {},
      connect: async () => ({ sessionId: 'mock-session' }),
    },
    localFiles: {
      listDrives: async () => ['C:\\'],
      list: async () => [],
      stat: async () => ({
        name: '',
        path: '',
        kind: 'file',
        size: 0,
        modifiedAt: 0,
      }),
      mkdir: async () => {},
      createFile: async () => {},
      writeFile: async () => {},
      walk: async () => ({ files: [], dirs: [], truncated: false }),
      rename: async () => {},
      copy: async () => ({ paths: [] }),
      trash: async () => {},
      open: async () => ({ ok: true as const }),
      preview: async () => ({
        path: '',
        encoding: 'base64',
        content: '',
        bytesRead: 0,
        totalSize: 0,
        truncated: false,
      }),
      search: async () => ({ entries: [], truncated: false }),
      cancelSearch: () => {},
    },
    remoteEdits: {
      prepare: async metadata => ({
        id: 'mock-edit',
        ...metadata,
        localPath: 'C:\\mock-edit',
        state: 'downloading' as const,
        dirty: false,
      }),
      markDownloaded: async id => ({
        id, profileId: 'profile', sshSessionId: 'session', remotePath: '/remote',
        localPath: 'C:\\mock-edit', state: 'opening' as const, dirty: false,
      }),
      open: async id => ({
        id, profileId: 'profile', sshSessionId: 'session', remotePath: '/remote',
        localPath: 'C:\\mock-edit', state: 'editing' as const, dirty: false,
      }),
      markUploading: async (id, fingerprint) => ({
        id, profileId: 'profile', sshSessionId: 'session', remotePath: '/remote',
        localPath: 'C:\\mock-edit', state: 'uploading' as const, dirty: true,
        lastLocalFingerprint: fingerprint,
      }),
      markSynced: async (id, fingerprint) => ({
        id, profileId: 'profile', sshSessionId: 'session', remotePath: '/remote',
        localPath: 'C:\\mock-edit', state: 'synced' as const, dirty: false,
        lastLocalFingerprint: fingerprint, lastUploadedFingerprint: fingerprint,
      }),
      markFailed: async (id, error) => ({
        id, profileId: 'profile', sshSessionId: 'session', remotePath: '/remote',
        localPath: 'C:\\mock-edit', state: 'failed' as const, dirty: true, error,
      }),
      retry: async id => ({
        id, profileId: 'profile', sshSessionId: 'session', remotePath: '/remote',
        localPath: 'C:\\mock-edit', state: 'editing' as const, dirty: true,
      }),
      discard: async () => ({ ok: true as const }),
      list: async () => [],
      onEvent: () => () => {},
    },
    app: {
      onBeforeCloseDecision: () => () => {},
    },
    ...overrides,
  };
}
