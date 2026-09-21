import { useState } from 'react';
import { Code2, Copy, Check, Download } from 'lucide-react';
import type { CardProps } from './RendererRegistry';

const LANGUAGE_LABELS: Record<string, string> = {
  py: 'Python', R: 'R', r: 'R', sh: 'Bash', bash: 'Bash',
  js: 'JavaScript', ts: 'TypeScript', jsx: 'React', tsx: 'React',
  pl: 'Perl', rb: 'Ruby', jl: 'Julia', c: 'C', cpp: 'C++',
};

function detectLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return LANGUAGE_LABELS[ext] || ext || 'text';
}

export default function CodeCard({ content }: CardProps) {
  const [copied, setCopied] = useState(false);

  const lang = detectLanguage(content.fileName);
  const codeText = content.content.startsWith('data:')
    ? (() => { try { return atob(content.content.split(',')[1] || content.content); } catch { return content.content; } })()
    : content.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rich-card bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 border-b border-zinc-800">
        <span className="text-xs text-zinc-300 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          {content.fileName}
          <span className="text-[10px] text-zinc-500 bg-zinc-700 px-1.5 py-0.5 rounded">{lang}</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1 text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[10px]"
            aria-label="复制代码"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
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
      </div>
      <pre className="p-3 text-xs font-mono bg-[#09090b] overflow-x-auto max-h-80 overflow-y-auto leading-relaxed">
        <code className="text-zinc-300">{codeText.slice(0, 50000)}{codeText.length > 50000 && '\n\n... (文件过大，仅显示前 50000 字符)'}</code>
      </pre>
    </div>
  );
}
