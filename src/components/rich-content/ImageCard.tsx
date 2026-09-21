import { useState, useRef } from 'react';
import { Maximize2, Download, Loader2 } from 'lucide-react';
import type { CardProps } from './RendererRegistry';
import { INLINE_SIZE_THRESHOLD, buildFileViewUrl } from './ContentFetcher';

export default function ImageCard({ content, onExpand }: CardProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const isLarge = content.metadata.size > INLINE_SIZE_THRESHOLD;
  const sessionParam = content.sessionId ? `&sessionId=${encodeURIComponent(content.sessionId)}` : '';
  const src = buildFileViewUrl(content.filePath, {
    sessionId: content.sessionId,
    local: content.local,
    workspace: content.workspace,
  });
  // 本地下载没有 /api/files/download 对应物：用 view 字节流 + download 属性另存
  const downloadHref = content.local
    ? src
    : `/api/files/download?path=${encodeURIComponent(content.filePath)}${sessionParam}`;

  if (error) {
    return (
      <div className="rich-card p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-300 truncate">{content.fileName}</span>
          <span className="text-[10px] text-zinc-500">{(content.metadata.size / 1024).toFixed(0)}KB</span>
        </div>
        <div className="text-xs text-zinc-500 text-center py-4">
          图片加载失败
        </div>
      </div>
    );
  }

  return (
    <div className="rich-card p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-300 truncate flex-1">{content.fileName}</span>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-zinc-500">{(content.metadata.size / 1024).toFixed(0)}KB</span>
          {content.metadata.dimensions && (
            <span className="text-[10px] text-zinc-600">
              {content.metadata.dimensions.width}×{content.metadata.dimensions.height}
            </span>
          )}
          <button
            onClick={onExpand}
            className="p-1 text-zinc-500 hover:text-zinc-300"
            aria-label="放大图片"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = downloadHref;
              a.download = content.fileName;
              a.click();
            }}
            className="p-1 text-zinc-500 hover:text-zinc-300"
            aria-label="下载图片"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {isLarge && !loaded ? (
        <button
          onClick={() => setLoaded(true)}
          className="w-full py-8 text-center text-xs text-zinc-500 bg-zinc-950 rounded hover:bg-zinc-800 transition-colors"
        >
          点击加载图片 ({(content.metadata.size / 1024).toFixed(0)}KB)
        </button>
      ) : (
        <div className="relative bg-[#0a0a0a] rounded overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
            </div>
          )}
          <img
            ref={imgRef}
            src={src}
            alt={content.fileName}
            className="w-full max-h-80 object-contain cursor-pointer"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            onClick={onExpand}
          />
        </div>
      )}
    </div>
  );
}
