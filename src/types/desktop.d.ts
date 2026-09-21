import type { HostProfileMetadata, FileEntry } from '@/shared/fileTransfer';
import type { FilePreviewPayload, PreviewDescriptor } from '@/shared/filePreview';
import type { RemoteEditEvent, RemoteEditSession } from '@/shared/remoteEdit';

type UpdatePhase = 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'installing' | 'error';

interface UpdateState {
  phase: UpdatePhase;
  currentVersion: string;
  availableVersion: string;
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
  message: string;
  updateUrl: string;
  autoCheck: boolean;
  configured: boolean;
  supported: boolean;
}

interface UpdateSettings {
  updateUrl: string;
  autoCheck: boolean;
}

interface HpclawDesktop {
  /** 从 <input type="file"> 的 File 对象取回磁盘绝对路径（浏览器模式无此能力） */
  getPathForFile?(file: File): string;
  clipboard: {
    readText(): Promise<string>;
    writeText(text: string): Promise<void>;
  };
  profiles: {
    list(): Promise<HostProfileMetadata[]>;
    save(profile: {
      id: string;
      name: string;
      group: string;
      host: string;
      port: number;
      username: string;
      password?: string;
      totpSecret?: string;
      favorite?: boolean;
      defaultLocalPath?: string;
      defaultRemotePath?: string;
    }): Promise<void>;
    remove(id: string): Promise<void>;
    getCredentials(id: string): Promise<{ password: string; totpSecret: string }>;
    trustFingerprint(id: string, fingerprint: string): Promise<void>;
    connect(id: string): Promise<{ sessionId: string; fingerprint?: string }>;
  };
  secrets: {
    get(key: string): Promise<string>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
  };
  localFiles: {
    listDrives(): Promise<string[]>;
    list(dirPath: string): Promise<FileEntry[]>;
    stat(targetPath: string): Promise<FileEntry>;
    mkdir(dirPath: string): Promise<void>;
    createFile(targetPath: string): Promise<void>;
    writeFile(targetPath: string, content: string): Promise<void>;
    walk(dirPath: string): Promise<{ files: { path: string; size: number }[]; dirs: string[]; truncated: boolean }>;
    rename(from: string, to: string): Promise<void>;
    copy(sourcePaths: string[], targetDirectory: string): Promise<{ paths: string[] }>;
    trash(targetPath: string): Promise<void>;
    open(targetPath: string): Promise<{ ok: true }>;
    preview(
      targetPath: string,
      descriptor: PreviewDescriptor,
    ): Promise<FilePreviewPayload>;
    search(
      root: string,
      query: string,
    ): Promise<{ entries: FileEntry[]; truncated: boolean }>;
    cancelSearch(requestId: string): void;
  };
  dialog?: {
    pickDirectory(): Promise<string | null>;
  };
  remoteEdits: {
    prepare(metadata: {
      profileId: string;
      sshSessionId: string;
      remotePath: string;
      fileName: string;
    }): Promise<RemoteEditSession>;
    markDownloaded(id: string): Promise<RemoteEditSession>;
    open(id: string): Promise<RemoteEditSession>;
    markUploading(id: string, fingerprint: string): Promise<RemoteEditSession>;
    markSynced(id: string, fingerprint: string): Promise<RemoteEditSession>;
    markFailed(id: string, error: string): Promise<RemoteEditSession>;
    retry(id: string): Promise<RemoteEditSession>;
    discard(id: string): Promise<{ ok: boolean }>;
    list(): Promise<RemoteEditSession[]>;
    onEvent(callback: (event: RemoteEditEvent) => void): () => void;
  };
  updates?: {
    getState(): Promise<UpdateState>;
    getSettings(): Promise<UpdateSettings>;
    saveSettings(settings: UpdateSettings): Promise<UpdateSettings>;
    check(): Promise<UpdateState>;
    download(): Promise<UpdateState>;
    install(): Promise<UpdateState>;
    pickAndInstall(): Promise<UpdateState>;
    onStatus(callback: (state: UpdateState) => void): () => void;
  };
  app: {
    edition?: 'full' | 'competition';
    onBeforeCloseDecision(callback: (decision: string) => void): () => void;
  };
}

declare global {
  interface Window {
    hpclawDesktop?: HpclawDesktop;
  }
}

export type { HpclawDesktop, UpdatePhase, UpdateSettings, UpdateState };
