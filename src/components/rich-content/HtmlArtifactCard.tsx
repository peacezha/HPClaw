// 对话内交互式 HTML 内容卡：AI 答复里提到的 .html/.htm/.xhtml 文件（集群或本地
// 工作区），以及直接写在 ```html 围栏里的完整页面，都在对话中原地渲染成可交互卡片。
// 默认收起——不自动拉取文件；展开后经 buildSafeHtmlPreviewDocument 沙箱渲染
// （脚本默认启用：报告/模拟需要 JS，CSP 仍禁外部网络，可手动关闭）。
// 加载失败给错误态 + 重试；path 来源且给了 onOpenWebPanel 时保留"在侧边预览"入口
// （侧边网页栏只支持集群读取，本地路径由调用方不传 onOpenWebPanel）。
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, FileCode2, Loader2, PanelRightOpen, RefreshCw } from 'lucide-react';
import { buildSafeHtmlPreviewDocument } from '../../features/file-transfer/previewRenderers';
import { fetchChatFileContent } from './ContentFetcher';
import type { WebPanelRequest } from '../WebPanelDrawer';

interface HtmlArtifactCardProps {
  /** 标题栏展示名；path 来源缺省取文件名，html 来源缺省"交互页面" */
  title?: string;
  /** 直接给出的完整 HTML 源码（```html 围栏） */
  html?: string;
  /** 集群/本地 HTML 文件路径：展开时经 fetchChatFileContent（自动路由 + 交叉重试）取回 */
  path?: string;
  /** 集群会话 id（'local-workbench'/空 = 本地工作台） */
  sessionId?: string | null;
  /** 本地工作区（path 本地解析根之一） */
  workspace?: string;
  /** 提供时标题栏出现"在侧边预览"入口（仅 path 来源可用） */
  onOpenWebPanel?: (request: WebPanelRequest) => void;
}

/** Windows 与 Unix 分隔符都兼容的文件名提取 */
function baseName(filePath: string): string {
  return filePath.split(/[\\/]/).pop() || filePath;
}

export default function HtmlArtifactCard({ title, html, path, sessionId, workspace, onOpenWebPanel }: HtmlArtifactCardProps) {
  const [open, setOpen] = useState(false);
  // 报告/模拟需要 JS，默认启用脚本；CSP 仍禁外部网络
  const [allowScripts, setAllowScripts] = useState(true);
  const [loadedHtml, setLoadedHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isInline = html !== undefined;

  // path 来源：首次展开才拉取（默认收起不发请求）；成功后缓存，收起再展开不重拉。
  // loading 不进依赖/守卫：setLoading 触发的重渲染若清掉副作用会取消在途请求。
  useEffect(() => {
    if (!open || isInline || !path || loadedHtml !== null || error) return undefined;
    let stopped = false;
    setLoading(true);
    fetchChatFileContent(path, { sessionId, workspace })
      .then(card => { if (!stopped) setLoadedHtml(card.content); })
      .catch(cause => { if (!stopped) setError(cause instanceof Error ? cause.message : String(cause)); })
      .finally(() => { if (!stopped) setLoading(false); });
    return () => { stopped = true; };
  }, [open, isInline, path, sessionId, workspace, loadedHtml, error]);

  const sourceHtml = isInline ? html : loadedHtml;
  const document_ = useMemo(
    () => (sourceHtml != null ? buildSafeHtmlPreviewDocument(sourceHtml, allowScripts) : ''),
    [sourceHtml, allowScripts],
  );

  const displayName = title || (path ? baseName(path) : '交互页面');
  const state: 'loading' | 'ready' | 'error' = isInline ? 'ready' : error ? 'error' : loading ? 'loading' : loadedHtml !== null ? 'ready' : 'loading';

  return (
    <div className="rounded-lg border border-scholar-700/70 bg-scholar-900/60 overflow-hidden" data-testid="html-artifact-card">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5">
        <FileCode2 className="w-3.5 h-3.5 text-accent shrink-0" />
        <div className="flex-1 min-w-0" data-i18n-skip="true">
          <div className="text-[11px] text-scholar-200 truncate">{displayName}</div>
          {path && <div className="text-[10px] text-scholar-500 truncate font-mono">{path}</div>}
        </div>
        {onOpenWebPanel && path && (
          <button
            type="button"
            className="btn-icon"
            title="在侧边预览"
            aria-label="在侧边预览"
            onClick={() => onOpenWebPanel({ remotePath: path, sessionId, title: displayName })}
          >
            <PanelRightOpen className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          className="btn-icon"
          aria-expanded={open}
          title={open ? '收起网页预览' : '展开网页预览'}
          aria-label={open ? '收起网页预览' : '展开网页预览'}
          onClick={() => setOpen(value => !value)}
        >
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-scholar-700/60">
          <div className="flex items-center justify-between gap-2 px-2.5 py-1 text-[10px] text-scholar-500">
            <span>隔离预览 · 外部网络资源已禁用</span>
            <button
              type="button"
              onClick={() => setAllowScripts(value => !value)}
              className="text-accent hover:underline"
            >
              {allowScripts ? '关闭网页脚本' : '启用交互内容'}
            </button>
          </div>
          <div className="relative h-96 bg-white">
            {state === 'loading' && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-scholar-900 text-scholar-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
            {state === 'error' && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-scholar-900 px-6 text-center">
                <p className="text-xs text-scholar-300">网页加载失败</p>
                {error && <p className="text-[11px] text-scholar-500 break-all">{error}</p>}
                {/* 重试 = 清掉错误态，effect 重新拉取 */}
                <button type="button" onClick={() => setError('')} className="btn-ghost !text-[11px] !px-2.5 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> 重试
                </button>
              </div>
            )}
            {state === 'ready' && (
              <iframe
                title={`网页预览 ${displayName}`}
                srcDoc={document_}
                sandbox={allowScripts ? 'allow-scripts' : ''}
                referrerPolicy="no-referrer"
                className="h-full w-full border-0"
                data-testid="html-artifact-iframe"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
