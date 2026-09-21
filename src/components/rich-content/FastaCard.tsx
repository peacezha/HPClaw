import { useState, useMemo } from 'react';
import { Dna, ChevronDown, Download } from 'lucide-react';
import type { CardProps } from './RendererRegistry';

interface SeqRecord {
  header: string;
  sequence: string;
  length: number;
  gcContent: number;
}

function parseFasta(text: string): SeqRecord[] {
  const records: SeqRecord[] = [];
  let current: SeqRecord | null = null;

  const lines = text.split('\n');
  for (const line of lines) {
    if (line.startsWith('>')) {
      if (current) records.push(current);
      current = { header: line.slice(1).trim(), sequence: '', length: 0, gcContent: 0 };
    } else if (current) {
      const seq = line.trim().toUpperCase();
      current.sequence += seq;
    }
  }
  if (current) records.push(current);

  for (const rec of records) {
    rec.length = rec.sequence.length;
    const gc = (rec.sequence.match(/[GC]/g) || []).length;
    rec.gcContent = rec.length > 0 ? (gc / rec.length) * 100 : 0;
  }

  return records;
}

function isFastq(text: string): boolean {
  return text.trim().startsWith('@') && text.includes('\n+\n');
}

export default function FastaCard({ content }: CardProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const records = useMemo(() => {
    let text = content.content;
    if (text.startsWith('data:')) {
      try { text = atob(text.split(',')[1] || text); } catch {}
    }
    if (isFastq(text)) {
      const lines = text.split('\n');
      const seqLines = lines.filter((_, i) => i % 4 === 1);
      const seqText = seqLines.map((s, i) => `>read_${i + 1}\n${s}`).join('\n');
      return parseFasta(seqText);
    }
    return parseFasta(text);
  }, [content.content]);

  const isFastqFile = content.fileName.endsWith('.fastq') || content.fileName.endsWith('.fq');
  const totalBp = records.reduce((sum, r) => sum + r.length, 0);
  const avgGC = records.length > 0 ? records.reduce((sum, r) => sum + r.gcContent, 0) / records.length : 0;

  return (
    <div className="rich-card bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 border-b border-zinc-800">
        <span className="text-xs text-zinc-300 flex items-center gap-1.5">
          <Dna className="w-3.5 h-3.5 text-emerald-400" />
          {content.fileName}
          <span className="text-[10px] text-zinc-400">
            {isFastqFile ? 'FASTQ' : 'FASTA'}
          </span>
        </span>
        <button
          onClick={() => {
            const a = document.createElement('a');
            a.href = `/api/files/download?path=${encodeURIComponent(content.filePath)}`;
            a.download = content.fileName;
            a.click();
          }}
          className="p-1 text-zinc-500 hover:text-zinc-300"
          aria-label="下载文件"
        >
          <Download className="w-3 h-3" />
        </button>
      </div>

      <div className="px-3 py-2 grid grid-cols-4 gap-2 text-center bg-zinc-950/50">
        <div>
          <div className="text-sm font-semibold text-emerald-400">{records.length}</div>
          <div className="text-[10px] text-zinc-400">Sequences</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-blue-400">{(totalBp / 1000).toFixed(1)}k</div>
          <div className="text-[10px] text-zinc-400">Total bp</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-amber-400">{avgGC.toFixed(1)}%</div>
          <div className="text-[10px] text-zinc-400">Avg GC</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-300">
            {records.length > 0 ? (totalBp / records.length).toFixed(0) : 0}
          </div>
          <div className="text-[10px] text-zinc-400">Avg Length</div>
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto p-2 space-y-1">
        {records.slice(0, 20).map((rec, i) => (
          <div key={i} className="text-xs">
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              className="w-full flex items-center gap-1.5 p-1.5 rounded hover:bg-zinc-800/50 text-left"
            >
              <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${expandedIdx === i ? '' : '-rotate-90'}`} />
              <span className="text-zinc-300 truncate flex-1">{rec.header.slice(0, 60)}</span>
              <span className="text-[10px] text-zinc-400 shrink-0">{rec.length}bp</span>
            </button>
            {expandedIdx === i && (
              <div className="ml-5 mt-1 p-2 bg-zinc-950 rounded font-mono text-[11px] text-emerald-400 break-all max-h-32 overflow-y-auto">
                {rec.sequence.slice(0, 1000)}
                {rec.sequence.length > 1000 && <span className="text-zinc-500"> ... ({rec.sequence.length - 1000} more bp)</span>}
              </div>
            )}
          </div>
        ))}
        {records.length > 20 && (
          <div className="text-center text-[10px] text-zinc-400 py-1">
            ... 还有 {records.length - 20} 条序列
          </div>
        )}
      </div>
    </div>
  );
}
