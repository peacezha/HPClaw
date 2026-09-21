import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, ExternalLink, FileIcon, Loader2, Pencil, RotateCcw, Save, X } from 'lucide-react';
import type { FileEntry, FileSide } from '@/shared/fileTransfer';
import './fileTransfer.css';
import {
  classifyPreview,
  type FilePreviewPayload,
} from '@/shared/filePreview';
import { previewRemote, writeRemote } from './api';
import {
  decodeBase64,
  DocxPreview,
  HtmlPreview,
  ImagePreview,
  MarkdownPreview,
  MediaPreview,
  PdfPreview,
  SheetPreview,
  TextEditor,
  TextPreview,
} from './previewRenderers';

export interface FilePreviewProps {
  file: FileEntry | null;
  source?: FileSide;
  sessionId?: string;
  onClose: () => void;
  onOpen?: () => void;
  onSaved?: () => void;
}

type PreviewState =
  | { status: 'loading' }
  | { status: 'ready'; payload: FilePreviewPayload }
  | { status: 'unsupported'; reason: string }
  | { status: 'error'; message: string };

type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved' }
  | { status: 'error'; message: string };

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export default function FilePreview({
  file,
  source,
  sessionId,
  onClose,
  onOpen,
  onSaved,
}: FilePreviewProps) {
  const resolvedSource: FileSide = source || (sessionId ? 'remote' : 'local');
  const descriptor = useMemo(
    () => file ? classifyPreview(file.name, file.size) : null,
    [file],
  );
  const [state, setState] = useState<PreviewState>({ status: 'loading' });
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [saveState, setSaveState] = useState<SaveState>({ status: 'idle' });

  const loadPreview = useCallback((signal: AbortSignal) => {
    if (!file || !descriptor) return Promise.resolve();
    if (descriptor.mode === 'unsupported') {
      setState({ status: 'unsupported', reason: descriptor.reason || '暂不支持此文件类型' });
      return Promise.resolve();
    }
    setState({ status: 'loading' });
    const request = resolvedSource === 'remote'
      ? sessionId
        ? previewRemote(sessionId, file.path, descriptor, signal)
        : Promise.reject(new Error('远程预览需要活动的 SSH 会话'))
      : window.hpclawDesktop?.localFiles.preview
        ? window.hpclawDesktop.localFiles.preview(file.path, descriptor)
        : Promise.reject(new Error('本地预览仅在桌面应用中可用'));
    return request.then(payload => {
      if (!signal.aborted) setState({ status: 'ready', payload });
    }).catch(cause => {
      if (signal.aborted) return;
      const message = cause?.error?.message || cause?.message || cause?.error || '预览失败';
      setState({ status: 'error', message });
    });
  }, [descriptor, file, resolvedSource, sessionId]);

  useEffect(() => {
    const controller = new AbortController();
    void loadPreview(controller.signal);
    return () => controller.abort();
  }, [loadPreview]);

  useEffect(() => {
    setIsEditing(false);
    setEditedText('');
    setSaveState({ status: 'idle' });
  }, [file?.path, file?.size]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isEditing) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isEditing]);

  const canEdit = useMemo(() => {
    if (!descriptor) return false;
    if (!['text', 'markdown', 'html'].includes(descriptor.kind)) return false;
    if (state.status !== 'ready') return false;
    if (state.payload.truncated) return false;
    return true;
  }, [descriptor, state]);

  const handleStartEdit = useCallback(() => {
    if (state.status !== 'ready') return;
    setEditedText(state.payload.content);
    setIsEditing(true);
    setSaveState({ status: 'idle' });
  }, [state]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedText('');
    setSaveState({ status: 'idle' });
  }, []);

  const handleSave = useCallback(async () => {
    if (!file || !canEdit) return;
    setSaveState({ status: 'saving' });
    try {
      if (resolvedSource === 'remote') {
        if (!sessionId) throw new Error('远程保存需要活动的 SSH 会话');
        await writeRemote(sessionId, file.path, editedText);
      } else {
        if (!window.hpclawDesktop?.localFiles.writeFile) {
          throw new Error('本地文件保存仅在桌面应用中可用');
        }
        await window.hpclawDesktop.localFiles.writeFile(file.path, editedText);
      }
      setSaveState({ status: 'saved' });
      onSaved?.();
      const controller = new AbortController();
      await loadPreview(controller.signal);
      setIsEditing(false);
      setEditedText('');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      setSaveState({ status: 'error', message });
    }
  }, [canEdit, editedText, file, loadPreview, onSaved, resolvedSource, sessionId]);

  if (!file || !descriptor) return null;

  const renderReady = (payload: FilePreviewPayload) => {
    const binary = payload.encoding === 'base64' ? decodeBase64(payload.content) : undefined;
    if (isEditing && ['text', 'markdown', 'html'].includes(descriptor.kind)) {
      return <TextEditor text={editedText} onChange={setEditedText} />;
    }
    switch (descriptor.kind) {
      case 'image':
        return <ImagePreview base64={payload.content} mime={descriptor.mime} name={file.name} />;
      case 'pdf':
        return <PdfPreview bytes={binary!} />;
      case 'docx':
        return <DocxPreview bytes={binary!} />;
      case 'sheet':
        return payload.encoding === 'utf8'
          ? <SheetPreview text={payload.content} />
          : <SheetPreview bytes={binary!} />;
      case 'html':
        return <HtmlPreview html={payload.content} name={file.name} />;
      case 'audio':
      case 'video':
        return (
          <MediaPreview
            base64={payload.content}
            mime={descriptor.mime}
            kind={descriptor.kind}
            name={file.name}
          />
        );
      case 'markdown':
        return <MarkdownPreview text={payload.content} />;
      case 'text':
        return <TextPreview text={payload.content} truncated={payload.truncated} lineLimit={payload.lineLimit} />;
      default:
        return null;
    }
  };

  return (
    <div className="file-transfer-dialog-overlay" onClick={onClose} data-testid="preview-overlay">
      <div
        className="file-transfer-dialog preview-dialog preview-dialog-rich"
        onClick={event => event.stopPropagation()}
        data-testid="preview-dialog"
        role="dialog"
        aria-label={`预览 ${file.name}`}
      >
        <div className="dialog-title preview-dialog-title">
          <FileIcon size={16} />
          <span className="flex-1 truncate">{file.name}</span>
          <span className="preview-source-badge">{resolvedSource === 'remote' ? '计算资源' : '本地'}</span>
          {isEditing ? (
            <>
              <button
                type="button"
                className="file-transfer-btn-primary"
                onClick={() => void handleSave()}
                disabled={saveState.status === 'saving'}
                aria-label="保存"
              >
                <Save size={14} />
                {saveState.status === 'saving' ? '保存中...' : '保存'}
              </button>
              <button
                type="button"
                className="file-transfer-btn-secondary"
                onClick={handleCancelEdit}
                disabled={saveState.status === 'saving'}
              >
                <RotateCcw size={14} />取消
              </button>
            </>
          ) : (
            <>
              {canEdit && (
                <button
                  type="button"
                  className="file-transfer-btn-secondary"
                  onClick={handleStartEdit}
                  aria-label="编辑"
                >
                  <Pencil size={14} />编辑
                </button>
              )}
              {onOpen && (
                <button
                  type="button"
                  className="file-transfer-btn-primary"
                  onClick={onOpen}
                  title={resolvedSource === 'remote'
                    ? '下载到本机后使用默认软件打开；保存后会同步回计算资源'
                    : '使用系统默认关联软件打开'}
                >
                  <ExternalLink size={14} />用本机软件打开
                </button>
              )}
            </>
          )}
          <button className="queue-action-btn" onClick={onClose} aria-label="关闭预览">
            <X size={14} />
          </button>
        </div>

        <div className="preview-meta">
          <span title={file.path}>{file.path}</span>
          <span>{formatSize(file.size)}</span>
          <span>{new Date(file.modifiedAt).toLocaleString()}</span>
        </div>

        <div className="file-transfer-preview-content preview-rich-content" data-testid="preview-content">
          {state.status === 'loading' && (
            <div className="preview-centered"><Loader2 size={20} className="search-spinner" />加载中...</div>
          )}
          {state.status === 'ready' && renderReady(state.payload)}
          {state.status === 'unsupported' && (
            <div className="preview-centered">
              <AlertCircle size={24} />
              <span>{state.reason}</span>
              {onOpen && <small>可点击右上角“用本机软件打开”</small>}
            </div>
          )}
          {state.status === 'error' && (
            <div className="preview-centered preview-error" role="alert">
              <AlertCircle size={24} />
              <span>{state.message}</span>
              <button type="button" className="file-transfer-btn-secondary" onClick={() => {
                const controller = new AbortController();
                void loadPreview(controller.signal);
              }}>重试</button>
            </div>
          )}
        </div>
        {saveState.status === 'saved' && (
          <div className="preview-save-status preview-save-status-success" role="status">保存成功</div>
        )}
        {saveState.status === 'error' && (
          <div className="preview-save-status preview-save-status-error" role="alert">
            保存失败：{saveState.message}
          </div>
        )}
      </div>
    </div>
  );
}
