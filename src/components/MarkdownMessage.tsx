import React, { useState } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileImage, PanelRightOpen, Play } from 'lucide-react';
import type { Element } from 'hast';
import type { WebPanelRequest } from './WebPanelDrawer';
import { buildChatFileViewUrls } from './rich-content/ContentFetcher';
import HtmlArtifactCard from './rich-content/HtmlArtifactCard';
import ImageLightbox from './ImageLightbox';
import { stripDsmlMarkup } from '../../shared/dsml';

/** Agent 协议标签转 Markdown：<execute>→代码块，<done>/<ask>→加粗摘要；
 *  顺带剥离模型误写进正文的 DSML 工具标记（历史消息渲染时同样生效）。 */
function normalizeAgentMarkup(content: string): string {
  return stripDsmlMarkup(content)
    .replace(/<execute>([\s\S]*?)<\/execute>/g, (_: string, command: string) => `\`\`\`bash\n${command.trim()}\n\`\`\``)
    .replace(/<done>([\s\S]*?)<\/done>/g, (_: string, summary: string) => `**${summary.trim()}**`)
    .replace(/<ask>([\s\S]*?)<\/ask>/g, (_: string, question: string) => `**${question.trim()}**`);
}

/**
 * Windows 图片路径保护：CommonMark 把链接目的地里的 `\` 当转义符（`\.`→`.`、`\_`→`_`），
 * `C:\dir\.hidden\x.png` 这类路径会被吃掉一层导致 404。解析前把图片目的地中的
 * 单反斜杠翻倍，转义处理后恰好还原。（尖括号目的地 <...> 不处理转义，无需保护。）
 */
function protectWindowsImagePaths(content: string): string {
  return content.replace(
    /(!\[[^\]]*\]\(\s*)([a-zA-Z]:\\[^)\s]+)/g,
    (_m: string, pre: string, p: string) => pre + p.replace(/\\/g, '\\\\'),
  );
}

/**
 * Markdown 图片 src → 原始文件路径：剥 file:// scheme；mdast-util-to-hast 的
 * normalizeUri 会把反斜杠等字符 percent-encode（Windows 路径进来是 `C:%5C...`），
 * 盘符路径解码还原（含裸 % 的非法串保持原样）。
 */
export function normalizeChatImagePath(src: string): string {
  let filePath = src.replace(/^file:\/\//i, '');
  // file:///C:/x.png → C:/x.png（Windows file URL 盘符前的多余斜杠）
  if (/^\/[a-zA-Z]:/.test(filePath)) filePath = filePath.slice(1);
  if (/^[a-zA-Z]:/.test(filePath)) {
    try { filePath = decodeURIComponent(filePath); } catch { /* keep as-is */ }
  }
  return filePath;
}

/**
 * 对话内 Markdown 图片的候选 src（按优先级排序）：http(s)/data/blob 原样；
 * 其余按文件路径处理——路由不能只按 sessionId 判定（dsh 引擎始终在本地产出文件，
 * 而对话会话可能绑定集群），Windows 绝对路径仅本地，点前缀相对路径本地优先，
 * 其余有集群会话先集群、本地兜底。调用方依次尝试，全部失败再降级。
 */
export function resolveChatImageCandidates(
  src: string,
  opts: { sessionId?: string | null; workspace?: string } = {},
): string[] {
  if (/^(https?:|data:|blob:)/i.test(src)) return [src];
  const filePath = normalizeChatImagePath(src);
  return buildChatFileViewUrls(filePath, { sessionId: opts.sessionId, workspace: opts.workspace });
}

/** 兼容旧签名：取首个候选。 */
export function resolveChatImageSrc(
  src: string,
  opts: { sessionId?: string | null; workspace?: string } = {},
): string {
  return resolveChatImageCandidates(src, opts)[0];
}

/**
 * react-markdown 默认 urlTransform 会清空 file:/data:/blob: 与 Windows 盘符路径
 * （冒号在首个斜杠前即视为协议；盘符路径此时已被 normalizeUri 编码为 C:%5C...）。
 * 这几类是客户端可处理的文件形态，放行；其余（含 javascript: 等）仍走默认消毒。
 */
function chatUrlTransform(url: string): string {
  if (/^(file:|data:|blob:)/i.test(url) || /^[a-zA-Z]:(?:[\\/]|%5c)/i.test(url)) return url;
  return defaultUrlTransform(url);
}

/** Markdown 内联图片：文件路径重写到文件服务端点并依次重试；全部失败降级为路径文本，不留破图。
 *  点击行为：http(s) 图且给了 onOpenWebPanel → 侧边栏打开；其余（文件路径/data:/blob:）→ 全屏放大。 */
function ChatImage({ src, alt, sessionId, workspace, onOpenWebPanel, onExpandImage }: {
  src: string;
  alt: string;
  sessionId?: string | null;
  workspace?: string;
  onOpenWebPanel?: (request: WebPanelRequest) => void;
  onExpandImage?: (src: string, title?: string) => void;
}) {
  const [attempt, setAttempt] = useState(0);
  const candidates = resolveChatImageCandidates(src, { sessionId, workspace });

  if (attempt >= candidates.length) {
    return (
      <span className="inline-flex items-center gap-1 max-w-full px-1.5 py-0.5 rounded bg-scholar-900/70 border border-scholar-700/60 text-xs text-scholar-400">
        <FileImage className="w-3 h-3 shrink-0" />
        <code className="break-all" title={alt || undefined}>{normalizeChatImagePath(src)}</code>
      </span>
    );
  }

  const resolved = candidates[attempt];
  const isWebImage = /^https?:\/\//i.test(resolved);
  const openSidePanel = isWebImage && onOpenWebPanel
    ? () => onOpenWebPanel({ url: resolved, title: alt || undefined })
    : undefined;
  const expand = !isWebImage && onExpandImage
    ? () => onExpandImage(resolved, alt || undefined)
    : undefined;
  const clickable = !!(openSidePanel || expand);
  return (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      className={`max-w-full max-h-96 object-contain rounded-lg border border-scholar-700/60 bg-scholar-950/40 ${clickable ? 'cursor-pointer' : ''} ${openSidePanel ? 'hover:border-accent/50' : ''}`}
      title={openSidePanel ? '点击在侧边打开' : expand ? '点击放大' : undefined}
      onError={() => setAttempt(a => a + 1)}
      onClick={openSidePanel ?? expand}
    />
  );
}

/** 递归取 hast 节点文本（代码块内容可能被拆成多个 text 子节点） */
function hastText(node: Element | Element['children'][number] | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if ('children' in node) return node.children.map(child => hastText(child)).join('');
  return '';
}

/**
 * 从代码块的 hast <pre> 节点提取可渲染的完整 HTML 页面：
 * 仅 ```html 围栏且内容像完整页面（含 <!DOCTYPE 或 <html>）才返回源码，否则 null。
 */
function extractFullPageHtml(preNode: unknown): string | null {
  const element = preNode as Element | undefined;
  if (!element || element.type !== 'element') return null;
  const code = element.children.find(
    (child): child is Element => child.type === 'element' && child.tagName === 'code',
  );
  if (!code) return null;
  const className = code.properties?.className;
  const classes = Array.isArray(className) ? className.join(' ') : typeof className === 'string' ? className : '';
  if (!/(?:^|\s)language-html(?:\s|$)/.test(classes)) return null;
  const text = hastText(code).replace(/\n$/, '');
  return /<!doctype\s+html|<html[\s>]/i.test(text) ? text : null;
}

/** ```html 围栏的"渲染为交互页面"入口：点开就地渲染 HtmlArtifactCard（源码来自围栏内容） */
function HtmlFenceLauncher({ html }: { html: string }) {
  const [rendered, setRendered] = useState(false);
  if (rendered) return <HtmlArtifactCard title="交互页面" html={html} />;
  return (
    <button
      type="button"
      onClick={() => setRendered(true)}
      className="mt-1 mb-2 inline-flex items-center gap-1 px-2 py-1 rounded-md border border-accent/40 bg-accent/10 text-[11px] text-accent hover:bg-accent/20 transition-colors"
    >
      <Play className="w-3 h-3" />
      渲染为交互页面
    </button>
  );
}

/** 代码块渲染：```html 完整页面围栏在代码块下方追加渲染入口；普通代码块原样输出 */
function ChatPre({ node, children }: { node?: unknown; children?: React.ReactNode }) {
  const html = extractFullPageHtml(node);
  return (
    <>
      <pre>{children}</pre>
      {html !== null && <HtmlFenceLauncher html={html} />}
    </>
  );
}

interface MarkdownMessageProps {
  content: string;
  /** 提供时，http(s) 链接旁出现"在侧边打开"按钮，点击交给侧边网页栏 */
  onOpenWebPanel?: (request: WebPanelRequest) => void;
  /** 集群会话 id（'local-workbench'/空 = 本地工作台）：决定 Markdown 图片路径重写到哪个文件服务端点 */
  sessionId?: string | null;
  /** 本地工作区：/api/local/files/view 的路径解析根之一 */
  workspace?: string;
}

// React.memo：流式期间每个 token 都触发整体重渲染；content 引用稳定的历史消息直接跳过
const MarkdownMessage = React.memo(function MarkdownMessage({ content, onOpenWebPanel, sessionId, workspace }: MarkdownMessageProps) {
  // 文件图全屏放大（http 图保持"侧边打开"，不进 lightbox）
  const [lightbox, setLightbox] = useState<{ src: string; title?: string } | null>(null);
  return (
    <div className="hpclaw-markdown text-sm leading-6 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={chatUrlTransform}
        components={{
          pre: ChatPre,
          a: ({ children, href, ...props }) => {
            const isWebLink = !!href && /^https?:\/\//i.test(href);
            return (
              <>
                <a {...props} href={href} target="_blank" rel="noreferrer">{children}</a>
                {isWebLink && onOpenWebPanel && (
                  <button
                    type="button"
                    className="inline-flex items-center align-middle ml-0.5 p-0.5 rounded text-accent/70 hover:text-accent hover:bg-accent/10"
                    title="在侧边打开"
                    aria-label="在侧边打开"
                    onClick={(event) => {
                      event.preventDefault();
                      onOpenWebPanel({ url: href, title: typeof children === 'string' ? children : undefined });
                    }}
                  >
                    <PanelRightOpen className="w-3 h-3" />
                  </button>
                )}
              </>
            );
          },
          img: ({ src, alt }) => (
            <ChatImage
              key={typeof src === 'string' ? src : ''}
              src={typeof src === 'string' ? src : ''}
              alt={typeof alt === 'string' ? alt : ''}
              sessionId={sessionId}
              workspace={workspace}
              onOpenWebPanel={onOpenWebPanel}
              onExpandImage={(resolved, title) => setLightbox({ src: resolved, title })}
            />
          ),
        }}
      >
        {protectWindowsImagePaths(normalizeAgentMarkup(content))}
      </ReactMarkdown>
      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
});

export default MarkdownMessage;
