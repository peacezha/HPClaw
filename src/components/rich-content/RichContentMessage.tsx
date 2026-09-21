import { useState, useEffect, useMemo } from 'react';
import { RendererRegistry } from './RendererRegistry';
import { extractFilePaths } from './FilePathExtractor';
import { detectFileType } from './FileTypeDetector';
import { fetchChatFileContent, buildFileViewUrl } from './ContentFetcher';
import HtmlArtifactCard from './HtmlArtifactCard';
import ImageLightbox from '../ImageLightbox';
import type { CardContent, RendererType } from './RendererRegistry';
import type { WebPanelRequest } from '../WebPanelDrawer';

interface RichContentMessageProps {
  children: string; // AI response text
  className?: string;
  /** 集群会话：连接集群时拉取远程文件（SFTP）；否则按本地模式走 /api/local/files/* */
  sessionId?: string | null;
  /** 本地模式下的工作区（服务端允许根之一），从 AIChat 顶层读一次传入 */
  workspace?: string;
  /** 裸相对路径（results/x.png）的解析基准（如流程 RUN 目录）；未提供时按服务端默认解析 */
  pathBase?: string | null;
  /** 提供时，.html 交互卡保留"在侧边预览"入口（仅集群会话：侧边网页栏只支持集群读取） */
  onOpenWebPanel?: (request: WebPanelRequest) => void;
  /** 限定卡片类型（如 ['image','table']）：执行过程等紧凑场景只出图/表，不给代码文件出卡 */
  onlyTypes?: RendererType[];
}

/** 裸相对路径加上解析基准（绝对/点前缀/盘符路径原样返回） */
function resolveWithBase(path: string, pathBase?: string | null): string {
  if (!pathBase) return path;
  if (path.startsWith('/') || path.startsWith('~') || path.startsWith('.') || /^[a-zA-Z]:[\\/]/.test(path)) return path;
  return `${pathBase.replace(/\/+$/, '')}/${path}`;
}

/** 交互式网页文件：.html/.htm/.xhtml 由 HtmlArtifactCard 原地渲染，不再出代码卡 */
const HTML_PATH_RE = /\.(html?|xhtml)$/i;

export function RichContentMessage({ children: text, className = '', sessionId, workspace, pathBase, onOpenWebPanel, onlyTypes }: RichContentMessageProps) {
  const [cards, setCards] = useState<CardContent[]>([]);
  const [loading, setLoading] = useState<Set<string>>(new Set());
  // 当前放大的图片卡片（ImageCard 的放大按钮/图片点击触发）
  const [expanded, setExpanded] = useState<CardContent | null>(null);
  const isRemote = !!sessionId && sessionId !== 'local-workbench';
  // 数组字面量 prop 在父组件重渲染时引用会变，用 join 后的字符串做依赖，避免重复拉取/重复出卡
  const onlyKey = onlyTypes ? onlyTypes.join(',') : '';

  // .html/.htm/.xhtml 路径（集群或本地）：渲染成交互式 HTML 卡（默认收起，展开才拉取）
  const htmlPaths = useMemo(
    () => ((!onlyTypes || onlyTypes.includes('log'))
      ? [...new Set(extractFilePaths(text).filter(p => HTML_PATH_RE.test(p)).map(p => resolveWithBase(p, pathBase)))].slice(0, 3)
      : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, onlyKey, pathBase],
  );

  useEffect(() => {
    const paths = extractFilePaths(text);
    if (paths.length === 0) return;

    const uniquePaths = [...new Set(paths)].slice(0, 5); // Max 5 inline cards

    for (const path of uniquePaths) {
      // 裸相对路径（results/x.png）先按基准（如流程 RUN 目录）解析，否则只能显示文本链接
      const resolvedPath = resolveWithBase(path, pathBase);
      // 网页文件交给 HtmlArtifactCard（默认收起、展开时才拉取），不再出代码卡
      if (htmlPaths.includes(resolvedPath)) continue;
      setLoading(prev => new Set(prev).add(path));
      const fileType = detectFileType(resolvedPath);
      const entry = RendererRegistry.get(fileType);
      // Skip generic for inline display; onlyTypes 限定时不属范围的一律跳过
      if (!entry || entry.priority < 50 || (onlyTypes && !onlyTypes.includes(fileType))) {
        setLoading(prev => { const s = new Set(prev); s.delete(path); return s; });
        continue;
      }
      const request = fetchChatFileContent(resolvedPath, { sessionId, workspace });
      request
        .then(card => setCards(prev => [...prev, card]))
        .catch(() => {
          // 两端都取不到（不存在或越界）——静默跳过
        })
        .finally(() => setLoading(prev => { const s = new Set(prev); s.delete(path); return s; }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, sessionId, isRemote, workspace, onlyKey, pathBase]);

  const showHtmlCards = htmlPaths.length > 0;
  if (cards.length === 0 && !showHtmlCards) return null;

  return (
    <div className={`rich-content-cards space-y-2 mt-2 ${className}`}>
      {cards.map((card, i) => {
        const entry = RendererRegistry.get(card.type);
        if (!entry) return null;
        const CardComponent = entry.component;
        return (
          <CardComponent
            key={i}
            content={card}
            onExpand={card.type === 'image' ? () => setExpanded(card) : undefined}
          />
        );
      })}
      {htmlPaths.map(path => (
        <HtmlArtifactCard
          key={path}
          path={path}
          sessionId={sessionId}
          workspace={workspace}
          onOpenWebPanel={isRemote ? onOpenWebPanel : undefined}
        />
      ))}
      {loading.size > 0 && (
        <div className="text-[10px] text-zinc-500 animate-pulse">加载文件中...</div>
      )}
      {expanded && (
        <ImageLightbox
          src={buildFileViewUrl(expanded.filePath, {
            sessionId: expanded.sessionId,
            local: expanded.local,
            workspace: expanded.workspace,
          })}
          title={expanded.fileName}
          dimensions={expanded.metadata.dimensions}
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  );
}
