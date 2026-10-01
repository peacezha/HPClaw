import { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { isWindowsAbsolutePath } from './ContentFetcher';

export default function HtmlReportFrame({ path, sessionId, workspace, title = '网页预览', initialScripts = true }: {
  path: string; sessionId?: string | null; workspace?: string; title?: string; initialScripts?: boolean;
}) {
  const localOnly = isWindowsAbsolutePath(path) || !sessionId || sessionId === 'local-workbench';
  const preferLocal = localOnly || /^\.[\w./\\-]/.test(path);
  const [report, setReport] = useState<{ filePath: string; metadata: { size: number }; local: boolean } | null>(null);
  const local = report?.local ?? preferLocal;
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [scripts, setScripts] = useState(initialScripts);
  const [network, setNetwork] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setReport(null); setError('');
    (async () => {
      const candidates = localOnly ? [true] : [preferLocal, !preferLocal];
      for (const [index, candidateLocal] of candidates.entries()) {
        const response = await fetch(candidateLocal ? '/api/local/files/html/resolve' : '/api/files/html/resolve', {
          method: 'POST', headers: { 'Content-Type': 'application/json', ...(!candidateLocal && sessionId ? { 'X-SSH-Session-Id': sessionId } : {}) },
          body: JSON.stringify({ path, ...(candidateLocal && workspace ? { workspace } : {}) }), signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) {
          // Retry a missing file on the other source, never hide an expired
          // cluster session or authorization failure by switching sources.
          if (response.status === 404 && index + 1 < candidates.length) continue;
          throw new Error(result.error?.message || `HTTP ${response.status}`);
        }
        if (!controller.signal.aborted) setReport({ ...result, local: candidateLocal });
        return;
      }
    })().catch(cause => { if (!controller.signal.aborted) setError(cause.message || String(cause)); });
    return () => controller.abort();
  }, [path, sessionId, workspace, localOnly, preferLocal, retry]);
  const query = new URLSearchParams({ path: report?.filePath || path, scripts: scripts ? '1' : '0', network: network ? '1' : '0' });
  if (!local && sessionId) query.set('sessionId', sessionId);
  if (local && workspace) query.set('workspace', workspace);
  const src = `${local ? '/api/local/files' : '/api/files'}/html/document?${query}`;
  return <div className="flex h-full min-h-0 flex-1 flex-col" data-testid="html-report-frame">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-scholar-700 px-3 py-2 text-[11px] text-scholar-300">
      <span>隔离预览 · {local ? '本地资源' : '集群资源'} · 流式加载{report ? ` · ${(report.metadata.size / 1024 / 1024).toFixed(1)} MiB` : ''}</span>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="text-accent hover:underline" onClick={() => setNetwork(!network)}>{network ? '禁止外部资源' : '允许外部资源'}</button>
        <button type="button" className="text-accent hover:underline" onClick={() => setScripts(!scripts)}>{scripts ? '关闭网页脚本' : '启用交互内容'}</button>
        <button type="button" className="text-accent hover:underline" onClick={() => setRetry(value => value + 1)} aria-label="重新读取报告"><RefreshCw className="h-3.5 w-3.5" /></button>
      </div>
    </div>
    {error ? <div className="flex min-h-48 flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <p>网页加载失败</p><p className="break-all text-xs text-scholar-300" data-user-content="true">{error}</p>
      <button type="button" className="btn-ghost" onClick={() => setRetry(value => value + 1)}>重试</button>
    </div> : report ? <iframe key={`${src}|${retry}`} title={title} src={src} sandbox={scripts ? 'allow-scripts' : ''} referrerPolicy="no-referrer" className="min-h-0 w-full flex-1 border-0 bg-white" data-testid="html-report-iframe" onError={() => setError('报告传输失败，请重试')} />
      : <div className="flex min-h-48 flex-1 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-scholar-300" /></div>}
  </div>;
}
