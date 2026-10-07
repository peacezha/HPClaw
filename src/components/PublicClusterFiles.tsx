import { useState } from 'react';
import RemoteFilePane from '../features/file-transfer/RemoteFilePane';
import FilePreview from '../features/file-transfer/FilePreview';
import type { PaneState } from '../features/file-transfer/controller';
import type { FileEntry, PickPathKind } from '../../shared/fileTransfer';

/** Browser file management has only a remote endpoint; never a server-local pane. */
export default function PublicClusterFiles({ sessionId, home, initialPath, onClose, pick }: {
  sessionId: string; home: string; initialPath?: string; onClose: () => void;
  pick?: { kind?: PickPathKind; onConfirm: (path: string) => void };
}) {
  const [pane, setPane] = useState<PaneState>({ path: initialPath || home, entries: [], selected: new Set(), loading: false });
  const [preview, setPreview] = useState<FileEntry | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const open = (file: FileEntry) => {
    if (pick && pick.kind !== 'folder') pick.onConfirm(file.path); else setPreview(file);
  };
  const download = (paths: string[]) => {
    for (const file of paths) {
      const anchor = document.createElement('a');
      anchor.href = `/api/files/download?path=${encodeURIComponent(file)}&sessionId=${encodeURIComponent(sessionId)}`;
      anchor.download = file.split('/').pop() || 'download'; anchor.click();
    }
  };
  return <div className="fixed inset-0 z-50 bg-scholar-950/80 p-3 sm:p-8 flex items-center justify-center">
    <section className="w-full max-w-6xl h-[85dvh] flex flex-col rounded-xl border border-scholar-700 bg-scholar-900 shadow-2xl">
      <header className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-scholar-700">
        <div><h2 className="text-sm font-medium">集群文件</h2><p className="text-xs text-scholar-400">文件读写直接连接你的集群，不经过服务器本地工作区</p></div>
        <div className="flex items-center gap-2">
          {!pick && <label className="btn-ghost text-xs cursor-pointer">{uploading ? '正在上传…' : '上传文件'}
            <input type="file" multiple className="hidden" disabled={uploading} onChange={async event => {
              const files = Array.from(event.target.files || []); event.target.value = ''; setError(''); setUploading(true);
              try {
                for (const file of files) {
                  const destination = pane.path.replace(/\/$/, '') + '/' + file.name;
                  let replace = false;
                  if (pane.entries.some(entry => entry.name === file.name)) {
                    replace = window.confirm(`集群已存在 ${file.name}。是否替换该文件？`);
                    if (!replace) continue;
                  }
                  const response = await fetch(`/api/public/upload?path=${encodeURIComponent(destination)}&replace=${replace ? '1' : '0'}`, {
                    method: 'POST', headers: { 'Content-Type': 'application/octet-stream', 'X-SSH-Session-Id': sessionId }, body: file,
                  });
                  const result = await response.json(); if (!response.ok || !result.success) throw new Error(result.error || '上传失败');
                }
                setRefresh(value => value + 1);
              } catch (reason) { setError(reason instanceof Error ? reason.message : '上传失败'); }
              finally { setUploading(false); }
            }} />
          </label>}
          {pick && pick.kind !== 'file' && <button className="btn-primary text-xs" onClick={() => pick.onConfirm(pane.path)}>选择此目录</button>}
          <button className="btn-ghost text-xs" onClick={onClose}>关闭</button>
        </div>
      </header>
      {error && <p role="alert" className="p-3 text-sm text-red-400">{error}</p>}
      <div className="min-h-0 flex-1">
        <RemoteFilePane sessionId={sessionId} paneState={pane} fallbackPath={home} refreshToken={refresh}
          onNavigate={(path, entries, loading, error) => setPane(previous => ({ ...previous, path, entries, loading: !!loading, error }))}
          onSelect={paths => setPane(previous => ({ ...previous, selected: new Set(paths) }))}
          onDeselectAll={() => setPane(previous => ({ ...previous, selected: new Set() }))}
          onDrop={() => {}} onOpenFile={open} onPreviewFile={setPreview}
          onFileDoubleClick={open} onTransfer={pick ? undefined : download} />
      </div>
      {preview && <FilePreview file={preview} source="remote" sessionId={sessionId} onClose={() => setPreview(null)} />}
    </section>
  </div>;
}
