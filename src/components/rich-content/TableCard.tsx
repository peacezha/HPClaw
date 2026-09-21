import { useState, useMemo } from 'react';
import { Table2, Download, ChevronDown } from 'lucide-react';
import type { CardProps } from './RendererRegistry';
import { buildFileViewUrl } from './ContentFetcher';

const PAGE_SIZE = 25;

function parseCSV(text: string, delimiter: ',' | '\t'): string[][] {
  const lines = text.trim().split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === delimiter && !inQuotes) { result.push(cell.trim()); cell = ''; continue; }
      cell += ch;
    }
    result.push(cell.trim());
    return result;
  });
}

export default function TableCard({ content }: CardProps) {
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const delimiter = content.fileName.endsWith('.tsv') || content.fileName.endsWith('.tab') ? '\t' : ',';

  const { headers, rows, totalRows } = useMemo(() => {
    let text = content.content;
    if (text.startsWith('data:')) {
      const base64 = text.split(',')[1] || text;
      try { text = atob(base64); } catch { /* not base64 */ }
    }
    const parsed = parseCSV(text, delimiter);
    if (parsed.length === 0) return { headers: [], rows: [], totalRows: 0 };
    return {
      headers: parsed[0],
      rows: parsed.slice(1),
      totalRows: parsed.length - 1,
    };
  }, [content.content, delimiter]);

  const displayRows = expanded ? rows : rows.slice(0, PAGE_SIZE);

  return (
    <div className="rich-card bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 border-b border-zinc-800">
        <span className="text-xs text-zinc-300 flex items-center gap-1.5">
          <Table2 className="w-3.5 h-3.5 text-blue-400" />
          {content.fileName}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400">{totalRows} rows × {headers.length} cols</span>
          <button
            onClick={() => {
              const a = document.createElement('a');
              // 本地下载没有 /api/files/download 对应物：用 view 字节流 + download 属性另存
              a.href = content.local
                ? buildFileViewUrl(content.filePath, { local: true, workspace: content.workspace })
                : `/api/files/download?path=${encodeURIComponent(content.filePath)}${content.sessionId ? `&sessionId=${encodeURIComponent(content.sessionId)}` : ''}`;
              a.download = content.fileName;
              a.click();
            }}
            className="p-1 text-zinc-400 hover:text-zinc-200"
            aria-label="下载表格"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="overflow-auto max-h-80">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-zinc-800 sticky top-0">
            <tr>
              <th className="px-2 py-1.5 text-left text-zinc-200 font-semibold border-b border-zinc-600 w-8">#</th>
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-1.5 text-left text-zinc-100 font-semibold border-b border-zinc-600 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, ri) => (
              <tr key={ri} className="hover:bg-zinc-800/60">
                <td className="px-2 py-1 text-zinc-200 border-b border-zinc-800/50">{page * PAGE_SIZE + ri + 1}</td>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-1 text-zinc-100 border-b border-zinc-800/50 whitespace-nowrap max-w-64 truncate">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > PAGE_SIZE && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-2 text-center text-xs text-zinc-400 bg-zinc-800/30 hover:bg-zinc-800/50 flex items-center justify-center gap-1"
        >
          <ChevronDown className="w-3 h-3" />
          显示全部 {totalRows} 行
        </button>
      )}
    </div>
  );
}
