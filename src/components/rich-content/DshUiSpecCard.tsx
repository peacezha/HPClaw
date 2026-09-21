// validate_dsh_ui 工具产出的 UI spec 卡片：title 标题、table→表格、text→段落、
// image→与 ImageCard 同源的文件直出、link→外链。深色专业风与 rich-content 卡片对齐。

import { useState } from 'react';
import { LayoutGrid, Link2, Loader2 } from 'lucide-react';
import type { DshUiSpec } from './DshUiSpec';
import { buildFileViewUrl } from './ContentFetcher';
import ImageLightbox from '../ImageLightbox';

interface DshUiSpecCardProps {
  spec: DshUiSpec;
  /** 集群会话：远程 image 项走 /api/files/view（SFTP）；否则按本地模式解析 */
  sessionId?: string | null;
  local?: boolean;
  workspace?: string;
}

function asText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return typeof value === 'string' ? value : String(value);
}

function SpecTable({ item }: { item: Record<string, unknown> }) {
  // columns 宽容解析：字符串直接用；对象列取 label/title 为表头、key/name 为取值键
  const rawColumns = Array.isArray(item.columns) ? item.columns : [];
  const columns = rawColumns.map(col => {
    if (col && typeof col === 'object' && !Array.isArray(col)) {
      const record = col as Record<string, unknown>;
      return { label: asText(record.label ?? record.title ?? record.key ?? record.name), key: asText(record.key ?? record.name ?? record.label) };
    }
    return { label: asText(col), key: asText(col) };
  });
  const rawRows = Array.isArray(item.rows) ? item.rows : [];
  // 列缺省时从对象行收集键
  if (columns.length === 0 && rawRows.length > 0 && rawRows.every(row => row && typeof row === 'object' && !Array.isArray(row))) {
    for (const key of Object.keys(rawRows[0] as Record<string, unknown>)) columns.push({ label: key, key });
  }
  const rows = rawRows.map(row => {
    if (Array.isArray(row)) return row.map(asText);
    if (row && typeof row === 'object') return columns.map(col => asText((row as Record<string, unknown>)[col.key]));
    return [asText(row)];
  });

  return (
    <div className="overflow-auto max-h-80 border border-zinc-700 rounded">
      <table className="w-full text-xs border-collapse">
        {columns.length > 0 && (
          <thead className="bg-zinc-800 sticky top-0">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-3 py-1.5 text-left text-zinc-100 font-semibold border-b border-zinc-600 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-zinc-800/60">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-1 text-zinc-300 border-b border-zinc-800/50 whitespace-nowrap max-w-64 truncate">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpecImage({ item, sessionId, local, workspace, onExpand }: { item: Record<string, unknown> } & Pick<DshUiSpecCardProps, 'sessionId' | 'local' | 'workspace'> & { onExpand?: (src: string, title?: string) => void }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const source = asText(item.path ?? item.src ?? item.url);
  if (!source) return null;
  const caption = asText(item.text ?? item.title);
  // 外链直接用；本地/集群路径与 ImageCard 同源（view 直出）
  const src = /^https?:\/\//i.test(source)
    ? source
    : buildFileViewUrl(source, { sessionId, local, workspace });

  if (error) {
    return <div className="text-xs text-zinc-400">图片加载失败：{source}</div>;
  }
  return (
    <figure className="space-y-1">
      <div className="relative bg-[#0a0a0a] rounded overflow-hidden w-fit max-w-full">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
          </div>
        )}
        <img
          src={src}
          alt={caption || source}
          className={`max-h-80 max-w-full object-contain ${onExpand ? 'cursor-pointer' : ''}`}
          title={onExpand ? '点击放大' : undefined}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          onClick={onExpand ? () => onExpand(src, caption || undefined) : undefined}
        />
      </div>
      {caption && <figcaption className="text-[10px] text-zinc-400">{caption}</figcaption>}
    </figure>
  );
}

function SpecLink({ item }: { item: Record<string, unknown> }) {
  const href = asText(item.href ?? item.url);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-light hover:underline break-all"
    >
      <Link2 className="w-3 h-3 shrink-0" />
      {asText(item.text ?? item.label) || href}
    </a>
  );
}

export default function DshUiSpecCard({ spec, sessionId, local, workspace }: DshUiSpecCardProps) {
  const gap = Math.min(Math.max(spec.gap ?? 8, 0), 64);
  // image 条目点击后全屏放大
  const [lightbox, setLightbox] = useState<{ src: string; title?: string } | null>(null);
  return (
    <div className="rich-card mt-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden" data-dsh-ui-spec="true">
      {spec.title && (
        <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800/50 border-b border-zinc-800">
          <LayoutGrid className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-zinc-200">{spec.title}</span>
        </div>
      )}
      <div className="p-3 flex flex-col" style={{ gap }}>
        {spec.items.map((item, i) => {
          const type = asText(item.type).toLowerCase();
          if (type === 'table') return <SpecTable key={i} item={item} />;
          if (type === 'image') return <SpecImage key={i} item={item} sessionId={sessionId} local={local} workspace={workspace} onExpand={(src, title) => setLightbox({ src, title })} />;
          if (type === 'link') return <SpecLink key={i} item={item} />;
          // text 与未标注类型但带文本的项：按段落渲染
          const text = asText(item.text ?? item.content);
          if (text) return <div key={i} className="text-xs text-zinc-300 whitespace-pre-wrap break-words">{text}</div>;
          return null;
        })}
      </div>
      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
