// 对话内嵌网页预览：assistant 答复中的 http(s) 链接生成可折叠预览卡。
// 默认收起——不自动加载外网；展开后 Electron 用 <webview>（与侧边网页栏同
// partition，可交互），浏览器 dev 环境（无 window.hpclawDesktop）回退 sandbox
// iframe 并提示"部分网站禁止内嵌"。webview 加载失败给错误态 + 重试。
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Globe, Loader2, PanelRightOpen, RefreshCw } from 'lucide-react';
import type { WebPanelRequest } from './WebPanelDrawer';

const MAX_EMBEDS = 2;

/** 去掉 URL 末尾粘连的散文标点（含中文标点）；配对括号只在失衡时才从末尾剥除（保留 wiki 式带括号 URL） */
function trimTrailingPunctuation(url: string): string {
  let u = url.replace(/[.,;:!?'"_*。，、；：？！“”‘’（）【】《》]+$/, '');
  const pairs: Array<[string, string]> = [['(', ')'], ['[', ']'], ['{', '}']];
  for (const [open, close] of pairs) {
    const opens = u.split(open).length - 1;
    let closes = u.split(close).length - 1;
    while (closes > opens && u.endsWith(close)) {
      u = u.slice(0, -1);
      closes--;
    }
  }
  return u;
}

function isLocalServiceUrl(url: string): boolean {
  // localhost/127.0.0.1 是本地文件服务端点，不是可内嵌的网页
  return /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::|\/|$)/i.test(url);
}

/**
 * 从消息文本提取可内嵌的 http(s) URL：裸 URL + markdown 链接目的地；
 * 排除 markdown 图片目的地与 localhost/127.0.0.1，去重，最多 max 个。
 */
export function extractWebUrls(text: string, max = MAX_EMBEDS): string[] {
  if (!text) return [];
  const urls: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string) => {
    const url = trimTrailingPunctuation(raw.trim());
    if (!/^https?:\/\//i.test(url)) return;
    if (isLocalServiceUrl(url)) return;
    if (seen.has(url)) return;
    seen.add(url);
    urls.push(url);
  };
  // 1) 先整体剔除 markdown 图片语法：![alt](dest) 里的 URL 不出卡片
  const withoutImages = text.replace(/!\[[^\]]*\]\(\s*<?[^)\s]+>?(?:\s+["'][^"']*["'])?\s*\)/g, ' ');
  // 2) 单次扫描，按文档顺序收集：markdown 链接目的地 | 裸 URL
  const combinedRe = /\[[^\]]*\]\(\s*<?(https?:\/\/[^)\s]+)>?(?:\s+["'][^"']*["'])?\s*\)|(https?:\/\/[^\s<>"'`]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = combinedRe.exec(withoutImages)) !== null) push(match[1] ?? match[2]);
  return urls.slice(0, max);
}

function domainOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

type LoadState = 'loading' | 'ready' | 'error';

/** Electron：<webview> 内嵌（partition 与侧边网页栏一致，会话互通且可交互） */
function EmbedWebview({ url }: { url: string }) {
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
    <div className="relative h-96 bg-white">
      {state === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-scholar-900 text-scholar-400">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {state === 'error' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-scholar-900 px-6 text-center">
          <p className="text-xs text-scholar-300">网页加载失败</p>
          <button type="button" onClick={handleRetry} className="btn-ghost !text-[11px] !px-2.5 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> 重试
          </button>
        </div>
      )}
      <webview
        ref={webviewRef}
        src={url}
        partition="hpclaw-webpanel"
        // 与 WebPanelDrawer 相同：属性存在即允许弹窗（主进程再转系统浏览器）
        {...{ allowpopups: 'true' as unknown as boolean }}
        className={`h-full w-full border-0 ${state === 'error' ? 'invisible' : ''}`}
        data-testid="web-embed-webview"
      />
    </div>
  );
}

/** 浏览器 dev（无 hpclawDesktop）：sandbox iframe 回退；X-Frame-Options 拒嵌时给提示 */
function EmbedIframe({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="flex flex-col h-96 bg-white">
      <div className="relative flex-1 min-h-0">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-scholar-900 text-scholar-400">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
        <iframe
          src={url}
          title="网页预览"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          className="h-full w-full border-0"
          data-testid="web-embed-iframe"
        />
      </div>
      <div className="shrink-0 px-2 py-1 text-[10px] bg-scholar-950/80 text-scholar-500 border-t border-scholar-700/60">
        部分网站禁止内嵌，可在侧边栏或浏览器打开
      </div>
    </div>
  );
}

function WebEmbedCard({ url, onOpenWebPanel }: { url: string; onOpenWebPanel?: (request: WebPanelRequest) => void }) {
  const [open, setOpen] = useState(false);
  const isDesktop = typeof window !== 'undefined' && !!window.hpclawDesktop;

  return (
    <div className="rounded-lg border border-scholar-700/70 bg-scholar-900/60 overflow-hidden" data-testid="web-embed-card">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5">
        <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
        <div className="flex-1 min-w-0" data-i18n-skip="true">
          <div className="text-[11px] text-scholar-200 truncate">{domainOf(url)}</div>
          <div className="text-[10px] text-scholar-500 truncate font-mono">{url}</div>
        </div>
        {onOpenWebPanel && (
          <button
            type="button"
            className="btn-icon"
            title="在侧边打开"
            aria-label="在侧边打开"
            onClick={() => onOpenWebPanel({ url, title: domainOf(url) })}
          >
            <PanelRightOpen className="w-3.5 h-3.5" />
          </button>
        )}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="btn-icon"
          title="在浏览器中打开"
          aria-label="在浏览器中打开"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
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
          {isDesktop ? <EmbedWebview url={url} /> : <EmbedIframe url={url} />}
        </div>
      )}
    </div>
  );
}

interface WebEmbedListProps {
  /** assistant 答复全文（内部提取 http(s) URL，最多 2 个） */
  text: string;
  /** 提供时标题栏出现"在侧边打开"按钮，交给侧边网页栏 */
  onOpenWebPanel?: (request: WebPanelRequest) => void;
  className?: string;
}

export default function WebEmbedList({ text, onOpenWebPanel, className = '' }: WebEmbedListProps) {
  const urls = useMemo(() => extractWebUrls(text), [text]);
  if (urls.length === 0) return null;
  return (
    <div className={`space-y-2 mt-2 ${className}`} data-testid="web-embed-list">
      {urls.map(url => (
        <WebEmbedCard key={url} url={url} onOpenWebPanel={onOpenWebPanel} />
      ))}
    </div>
  );
}
