import FilePane from './FilePane';
import type { FilePaneAdapter, FilePaneProps } from './FilePane';
import type { FileEntry, FileSide } from '@/shared/fileTransfer';
import type { PaneState } from './controller';
import { isLocalDrivesRoot } from './localDrives';

function createLocalAdapter(): FilePaneAdapter {
  return {
    side: 'local' as FileSide,

    async list(path: string, signal: AbortSignal): Promise<FileEntry[]> {
      const desktop = window.hpclawDesktop;
      if (!desktop) throw new Error('桌面应用模式下可用');
      // 盘符列表层级（此电脑）：列盘符而不是目录内容。
      // 条目 kind 为 directory，双击即走既有导航进入盘符根。
      if (isLocalDrivesRoot(path)) {
        const drives = await desktop.localFiles.listDrives();
        return drives.map((drive) => ({
          name: drive,
          path: drive,
          kind: 'directory' as const,
          size: 0,
          modifiedAt: 0,
        }));
      }
      return desktop.localFiles.list(path);
    },

    async mkdir(path: string): Promise<void> {
      const desktop = window.hpclawDesktop;
      if (!desktop) throw new Error('桌面应用模式下可用');
      return desktop.localFiles.mkdir(path);
    },

    async createFile(path: string): Promise<void> {
      const desktop = window.hpclawDesktop;
      if (!desktop) throw new Error('桌面应用模式下可用');
      return desktop.localFiles.createFile(path);
    },

    async rename(from: string, to: string): Promise<void> {
      const desktop = window.hpclawDesktop;
      if (!desktop) throw new Error('桌面应用模式下可用');
      return desktop.localFiles.rename(from, to);
    },

    async removePreview(paths: string[]): Promise<{
      entries: FileEntry[];
      total: number;
      recursive?: boolean;
    }> {
      const desktop = window.hpclawDesktop;
      if (!desktop) throw new Error('桌面应用模式下可用');
      // Stat each path to build a preview approximation
      const entries: FileEntry[] = [];
      for (const p of paths) {
        try {
          const stat = await desktop.localFiles.stat(p);
          entries.push(stat);
        } catch {
          entries.push({
            name: p.split(/[/\\]/).pop() || '',
            path: p,
            kind: 'file',
            size: 0,
            modifiedAt: 0,
          });
        }
      }
      return { entries, total: entries.length };
    },

    async remove(paths: string[]): Promise<void> {
      const desktop = window.hpclawDesktop;
      if (!desktop) throw new Error('桌面应用模式下可用');
      for (const p of paths) {
        await desktop.localFiles.trash(p);
      }
    },

  };
}

interface LocalFilePaneProps
  extends Omit<
    FilePaneProps,
    'adapter'
  > {
  // No additional props needed
}

export default function LocalFilePane(props: LocalFilePaneProps) {
  const desktop =
    typeof window !== 'undefined' && window.hpclawDesktop;

  if (!desktop) {
    return (
      <div className="file-transfer-pane flex items-center justify-center text-scholar-500 text-sm">
        <p>桌面应用模式下可用</p>
      </div>
    );
  }

  const adapter = createLocalAdapter();

  return <FilePane {...props} adapter={adapter} endpointId="local" />;
}
