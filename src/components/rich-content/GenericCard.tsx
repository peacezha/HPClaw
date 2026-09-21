import { FileText, Download, ExternalLink } from 'lucide-react';
import type { CardProps } from './RendererRegistry';
import { getFileCategory } from './FileTypeDetector';

const CATEGORY_ICONS: Record<string, string> = {
  image: 'text-emerald-600',
  table: 'text-blue-600',
  code: 'text-amber-600',
  sequence: 'text-emerald-600',
  variant: 'text-purple-600',
  pdf: 'text-red-600',
  log: 'text-zinc-500',
};

export default function GenericCard({ content, onExpand }: CardProps) {
  const category = getFileCategory(content.filePath);
  const iconColor = CATEGORY_ICONS[category] || 'text-zinc-500';

  return (
    <div className="rich-card p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-3">
      <div className={`p-2 bg-zinc-800 rounded-lg shrink-0 ${iconColor}`}>
        <FileText className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-300 truncate">{content.fileName}</p>
        <p className="text-[10px] text-zinc-500">
          {(content.metadata.size / 1024).toFixed(0)}KB · {content.metadata.mime || category}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {onExpand && (
          <button
            onClick={onExpand}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded"
            aria-label="在面板中打开"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => {
            const a = document.createElement('a');
            a.href = `/api/files/download?path=${encodeURIComponent(content.filePath)}`;
            a.download = content.fileName;
            a.click();
          }}
          className="p-1.5 text-zinc-500 hover:text-emerald-400 rounded"
          aria-label="下载文件"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
