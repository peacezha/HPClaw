import { useMemo } from 'react';
import FilePane from './FilePane';
import type { FilePaneAdapter, FilePaneProps } from './FilePane';
import type { FileEntry, FileSide } from '@/shared/fileTransfer';
import type { PaneState } from './controller';
import {
  listRemoteFiles,
  mkdirRemote,
  touchRemote,
  renameRemote,
  removeRemote,
  removePreviewRemote,
} from './api';

interface RemoteFilePaneProps
  extends Omit<FilePaneProps, 'adapter'> {
  sessionId: string | null;
}

export default function RemoteFilePane({
  sessionId,
  ...rest
}: RemoteFilePaneProps) {
  const adapter = useMemo<FilePaneAdapter | null>(() => {
    if (!sessionId) return null;

    return {
      side: 'remote' as FileSide,

      async list(path: string, signal: AbortSignal): Promise<FileEntry[]> {
        const result = await listRemoteFiles(sessionId, path, signal);
        return result.entries;
      },

      async mkdir(path: string): Promise<void> {
        await mkdirRemote(sessionId, path);
      },

      async createFile(path: string): Promise<void> {
        await touchRemote(sessionId, path);
      },

      async rename(from: string, to: string): Promise<void> {
        await renameRemote(sessionId, from, to);
      },

      async removePreview(paths: string[]): Promise<{
        entries: FileEntry[];
        total: number;
        recursive?: boolean;
      }> {
        const results = await Promise.all(
          paths.map((p) =>
            removePreviewRemote(sessionId, p, true).catch(() => ({
              entries: [] as FileEntry[],
              total: 0,
              recursive: true,
            })),
          ),
        );
        const entries = results.flatMap((r) => r.entries);
        const total = results.reduce((sum, r) => sum + r.total, 0);
        return { entries, total, recursive: true };
      },

      async remove(paths: string[]): Promise<void> {
        for (const p of paths) {
          await removeRemote(sessionId, p, true);
        }
      },

    };
  }, [sessionId]);

  if (!adapter) {
    return (
      <div className="file-transfer-pane flex items-center justify-center text-scholar-500 text-sm">
        <p>未连接</p>
      </div>
    );
  }

  return <FilePane {...rest} adapter={adapter} endpointId={sessionId} folderClickNavigates />;
}
