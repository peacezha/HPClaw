import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, FileCode2, PanelRightOpen } from 'lucide-react';
import { buildSafeHtmlPreviewDocument } from '../../features/file-transfer/previewRenderers';
import type { WebPanelRequest } from '../WebPanelDrawer';
import HtmlReportFrame from './HtmlReportFrame';

interface HtmlArtifactCardProps {
  title?: string; html?: string; path?: string; sessionId?: string | null; workspace?: string;
  onOpenWebPanel?: (request: WebPanelRequest) => void;
}

/** File reports stream directly; inline generated HTML stays in a sandboxed srcDoc. */
export default function HtmlArtifactCard({ title, html, path, sessionId, workspace, onOpenWebPanel }: HtmlArtifactCardProps) {
  const [open, setOpen] = useState(false);
  const [scripts, setScripts] = useState(true);
  const document = useMemo(() => buildSafeHtmlPreviewDocument(html || '', scripts), [html, scripts]);
  const displayName = title || path?.split(/[\\/]/).pop() || '交互页面';
  return <div className="rounded-lg border border-scholar-700/70 bg-scholar-900/60 overflow-hidden" data-testid="html-artifact-card">
    <div className="flex items-center gap-1.5 px-2.5 py-1.5">
      <FileCode2 className="w-3.5 h-3.5 text-accent shrink-0" />
      <div className="flex-1 min-w-0" data-i18n-skip="true"><div className="text-[11px] text-scholar-200 truncate">{displayName}</div>{path && <div className="text-[10px] text-scholar-500 truncate font-mono">{path}</div>}</div>
      {onOpenWebPanel && path && <button type="button" className="btn-icon" aria-label="在侧边预览" title="在侧边预览" onClick={() => onOpenWebPanel({ remotePath: path, sessionId, title: displayName, ...(workspace ? { workspace } : {}) })}><PanelRightOpen className="w-3.5 h-3.5" /></button>}
      <button type="button" className="btn-icon" aria-expanded={open} title={open ? '收起网页预览' : '展开网页预览'} aria-label={open ? '收起网页预览' : '展开网页预览'} onClick={() => setOpen(!open)}>{open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}</button>
    </div>
    {open && <div className="flex min-h-80 flex-col overflow-hidden border-t border-scholar-700/60" style={{ height: '384px', resize: 'vertical' }}>
      {html === undefined && path ? <HtmlReportFrame path={path} sessionId={sessionId} workspace={workspace} title={`网页预览 ${displayName}`} /> : <>
        <div className="flex items-center justify-between gap-2 px-2.5 py-1 text-[10px] text-scholar-500"><span>隔离预览 · 外部网络资源已禁用</span><button type="button" className="text-accent hover:underline" onClick={() => setScripts(!scripts)}>{scripts ? '关闭网页脚本' : '启用交互内容'}</button></div>
        <iframe title={`网页预览 ${displayName}`} srcDoc={document} sandbox={scripts ? 'allow-scripts' : ''} referrerPolicy="no-referrer" className="min-h-0 w-full flex-1 border-0 bg-white" data-testid="html-artifact-iframe" />
      </>}
    </div>}
  </div>;
}
