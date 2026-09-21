// 侧边网页栏：AI 答复里的 http(s) 链接用 <webview> 内嵌；集群远程 HTML
// （report.html 等）经 /api/files/read 取回后用沙箱 iframe srcDoc 渲染。
// 支持多标签：新页面追加为标签，内容常驻（切换不重载），全部关闭后面板隐藏。
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, FileCode2, Globe, Loader2, PanelRightClose, RefreshCw, X } from 'lucide-react';
import { buildSafeHtmlPreviewDocument } from '../features/file-transfer/previewRenderers';
import { webPanelTabKey } from '../services/webPanelTabs';

export interface WebPanelRequest {
  /** http(s) 外链：<webview> 内嵌浏览 */
  url?: string;
  /** 集群远程 HTML 路径：经 /api/files/read 取回后沙箱渲染 */
  remotePath?: string;
  /** 标题栏展示名（链接文本或文件名） */
  title?: string;
  /** remotePath 所属的集群会话；本地工作台为 null（远程模式不会出现） */
  sessionId?: string | null;
}

interface WebPanelDrawerProps {
  panels: WebPanelRequest[];
  activeIndex: number;
  onSelectTab: (index: number) => void;
  onCloseTab: (index: number) => void;
  /** 关闭整个面板（全部标签） */
  onClose: () => void;
}

type LoadState = 'loading' | 'ready' | 'error';

function tabLabel(tab: WebPanelRequest): string {
  return tab.title || tab.url || tab.remotePath || '';
}

export default function WebPanelDrawer({ panels, activeIndex, onSelectTab, onCloseTab, onClose }: WebPanelDrawerProps) {
  const active = panels[activeIndex] ?? panels[panels.length - 1];
  return (
    <AnimatePresence>
      {panels.length > 0 && active && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed inset-y-0 right-0 z-40 w-[600px] max-w-[92vw] flex flex-col bg-scholar-900 border-l border-scholar-700 shadow-2xl shadow-black/50"
          data-testid="web-panel-drawer"
        >
          {/* 标签条：标题截断 + 单个关闭 × */}
          <div
            className="flex items-stretch gap-0.5 px-2 pt-1.5 border-b border-scholar-700 bg-scholar-950/80 overflow-x-auto shrink-0"
            data-testid="web-panel-tabs"
          >
            {panels.map((tab, index) => {
              const label = tabLabel(tab);
              const isActive = index === activeIndex;
              return (
                <div
                  key={webPanelTabKey(tab)}
                  className={`group flex items-center rounded-t-md border border-b-0 max-w-[180px] ${
                    isActive
                      ? 'bg-scholar-900 border-scholar-700 text-scholar-100'
                      : 'border-transparent text-scholar-400 hover:text-scholar-200 hover:bg-scholar-800/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectTab(index)}
                    aria-current={isActive}
                    title={label}
                    className="flex items-center gap-1.5 min-w-0 pl-2 pr-1 py-1.5 text-[11px]"
                  >
                    {tab.url
                      ? <Globe className="w-3 h-3 text-accent shrink-0" />
                      : <FileCode2 className="w-3 h-3 text-accent shrink-0" />}
                    <span className="truncate">{label}</span>
                  </button>
                  <button
                    type="button"
                    onClick={event => { event.stopPropagation(); onCloseTab(index); }}
                    aria-label={`关闭标签：${label}`}
                    title="关闭标签"
                    className={`p-1 mr-0.5 rounded text-scholar-500 hover:text-scholar-200 hover:bg-scholar-700/70 shrink-0 ${
                      isActive ? '' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
          <WebPanelHeader panel={active} onClose={onClose} />
          {/* 内容常驻：切换标签不重载网页，隐藏的标签保持加载状态 */}
          {panels.map((tab, index) => (
            <div
              key={webPanelTabKey(tab)}
              className={index === activeIndex ? 'flex-1 min-h-0 flex flex-col' : 'hidden'}
            >
              <WebPanelContent panel={tab} />
            </div>
          ))}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function isUrlPanel(panel: WebPanelRequest): boolean {
  return !!panel.url && /^https?:\/\//i.test(panel.url);
}

function WebPanelHeader({ panel, onClose }: { panel: WebPanelRequest; onClose: () => void }) {
  const isUrlMode = isUrlPanel(panel);
  const displayTarget = panel.url || panel.remotePath || '';
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-scholar-700 bg-scholar-950/60 shrink-0">
      {isUrlMode
        ? <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
        : <FileCode2 className="w-3.5 h-3.5 text-accent shrink-0" />}
      <div className="flex-1 min-w-0">
        {panel.title && <div className="text-xs text-scholar-100 truncate">{panel.title}</div>}
        <div className={`text-[10px] text-scholar-500 truncate font-mono ${panel.title ? '' : 'text-xs text-scholar-300'}`}>
          {displayTarget}
        </div>
      </div>
      {isUrlMode && (
        // 主进程 setWindowOpenHandler 兜底：http(s) 一律进系统浏览器
        <a
          href={panel.url}
          target="_blank"
          rel="noreferrer"
          className="btn-icon"
          title="在浏览器中打开"
          aria-label="在浏览器中打开"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
      <button type="button" onClick={onClose} className="btn-icon" title="关闭" aria-label="关闭">
        <PanelRightClose className="w-4 h-4" />
      </button>
    </div>
  );
}

function WebPanelContent({ panel }: { panel: WebPanelRequest }) {
  return isUrlPanel(panel)
    ? <WebViewContent url={panel.url!} />
    : <RemoteHtmlContent panel={panel} />;
}

/** http(s) 外链：Electron <webview> 内嵌（partition 隔离会话，不影响主窗口登录态） */
function WebViewContent({ url }: { url: string }) {
  const webviewRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    const view = webviewRef.current as (HTMLElement & { addEventListener?: (t: string, l: () => void) => void; removeEventListener?: (t: string, l: () => void) => void }) | null;
    if (!view || typeof view.addEventListener !== 'function') return undefined;
    const onReady = () => setState('ready');
    const onFail = () => setState('error');
    view.addEventListener('dom-ready', onReady);
    view.addEventListener('did-fail-load', onFail);
    return () => {
      view.removeEventListener?.('dom-ready', onReady);
      view.removeEventListener?.('did-fail-load', onFail);
    };
  }, [url]);

  const handleRetry = () => {
    setState('loading');
    const view = webviewRef.current as (HTMLElement & { reload?: () => void }) | null;
    if (view?.reload) view.reload();
    else setState('ready');
  };

  return (
    <div className="flex-1 min-h-0 relative bg-white">
      {state === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-scholar-900 text-scholar-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}
      {state === 'error' && <LoadError onRetry={handleRetry} />}
      <webview
        ref={webviewRef}
        src={url}
        partition="hpclaw-webpanel"
        // Electron 只需属性存在即允许弹窗（弹窗再由主进程转系统浏览器）；
        // 写字符串形式避免 React 对非布尔属性传 true 的开发告警
        {...{ allowpopups: 'true' as unknown as boolean }}
        className={`h-full w-full border-0 ${state === 'error' ? 'invisible' : ''}`}
        data-testid="webpanel-webview"
      />
    </div>
  );
}

/** 集群远程 HTML：取回内容后走 buildSafeHtmlPreviewDocument 的 CSP 沙箱渲染。
 *  默认启用脚本——这是用户自己的结果网页，交互图表需要 JS；CSP 仍禁外部网络，可手动关闭。 */
function RemoteHtmlContent({ panel }: { panel: WebPanelRequest }) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [allowScripts, setAllowScripts] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!panel.remotePath) return undefined;
    let stopped = false;
    setError('');
    setHtml(null);
    (async () => {
      try {
        const res = await fetch('/api/files/read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(panel.sessionId ? { 'X-SSH-Session-Id': panel.sessionId } : {}),
          },
          body: JSON.stringify({ path: panel.remotePath }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error?.message || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!stopped) setHtml(typeof data.content === 'string' ? data.content : '');
      } catch (e: any) {
        if (!stopped) setError(e?.message || String(e));
      }
    })();
    return () => { stopped = true; };
  }, [panel.remotePath, panel.sessionId, retryCount]);

  const document_ = useMemo(
    () => (html !== null ? buildSafeHtmlPreviewDocument(html, allowScripts) : ''),
    [html, allowScripts],
  );

  if (error) return <LoadError detail={error} onRetry={() => setRetryCount(count => count + 1)} />;
  if (html === null) {
    return (
      <div className="flex-1 flex items-center justify-center text-scholar-400">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex items-center justify-between gap-2 px-3 py-1 border-b border-scholar-700/60 text-[10px] text-scholar-500 shrink-0">
        <span>隔离预览 · 外部网络资源已禁用</span>
        <button
          type="button"
          onClick={() => setAllowScripts(value => !value)}
          className="text-accent hover:underline"
        >
          {allowScripts ? '关闭网页脚本' : '启用交互内容'}
        </button>
      </div>
      <iframe
        title="网页预览"
        srcDoc={document_}
        sandbox={allowScripts ? 'allow-scripts' : ''}
        referrerPolicy="no-referrer"
        className="flex-1 w-full border-0 bg-white"
        data-testid="webpanel-iframe"
      />
    </div>
  );
}

function LoadError({ detail, onRetry }: { detail?: string; onRetry: () => void }) {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center gap-2 bg-scholar-900 px-6 text-center">
      <p className="text-sm text-scholar-300">网页加载失败</p>
      {detail && <p className="text-[11px] text-scholar-500 break-all">{detail}</p>}
      <button type="button" onClick={onRetry} className="btn-ghost !text-[11px] !px-2.5 flex items-center gap-1">
        <RefreshCw className="w-3 h-3" /> 重试
      </button>
    </div>
  );
}
