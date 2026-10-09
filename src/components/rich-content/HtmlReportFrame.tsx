import { useEffect, useId, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { isWindowsAbsolutePath } from './ContentFetcher';
import { useWorkflowText } from '../../i18n';

export default function HtmlReportFrame({ path, sessionId, workspace, remoteBasePaths, title = '网页预览', initialScripts = true }: {
  path: string; sessionId?: string | null; workspace?: string; remoteBasePaths?: string[]; title?: string; initialScripts?: boolean;
}) {
  const inputId = useId();
  const displayText = useWorkflowText();
  const [requestedPath, setRequestedPath] = useState(path);
  const [correctedPath, setCorrectedPath] = useState(path);
  const [matches, setMatches] = useState<string[]>([]);
  useEffect(() => { setRequestedPath(path); setCorrectedPath(path); }, [path]);
  const localOnly = isWindowsAbsolutePath(requestedPath) || !sessionId || sessionId === 'local-workbench';
  const preferLocal = localOnly || /^(?:\.\/)?\.dsh-vision-toolkit\//.test(requestedPath) || (!remoteBasePaths?.length && /^\.[\w./\\-]/.test(requestedPath));
  const basesKey = JSON.stringify(remoteBasePaths || []);
  const [report, setReport] = useState<{ filePath: string; metadata: { size: number }; local: boolean } | null>(null);
  const local = report?.local ?? preferLocal;
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [scripts, setScripts] = useState(initialScripts);
  const [network, setNetwork] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setReport(null); setError(''); setMatches([]);
    (async () => {
      const candidates = localOnly ? [true] : remoteBasePaths?.length && !preferLocal ? [false] : [preferLocal, !preferLocal];
      for (const [index, candidateLocal] of candidates.entries()) {
        const response = await fetch(candidateLocal ? '/api/local/files/html/resolve' : '/api/files/html/resolve', {
          method: 'POST', headers: { 'Content-Type': 'application/json', ...(!candidateLocal && sessionId ? { 'X-SSH-Session-Id': sessionId } : {}) },
          body: JSON.stringify({ path: requestedPath, ...(candidateLocal && workspace ? { workspace } : {}), ...(!candidateLocal && remoteBasePaths?.length ? { basePaths: remoteBasePaths } : {}) }), signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) {
          if (!controller.signal.aborted && result.error?.code === 'REMOTE_REPORT_AMBIGUOUS') setMatches(result.error.candidates || []);
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
  }, [requestedPath, sessionId, workspace, localOnly, preferLocal, basesKey, retry]);
  const query = new URLSearchParams({ path: report?.filePath || requestedPath, scripts: scripts ? '1' : '0', network: network ? '1' : '0' });
  if (!local && sessionId) query.set('sessionId', sessionId);
  if (local && workspace) query.set('workspace', workspace);
  const src = `${local ? '/api/local/files' : '/api/files'}/html/document?${query}`;
  return <div className="flex h-full min-h-0 flex-1 flex-col" data-testid="html-report-frame">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-scholar-700/60 px-2.5 py-1 text-[10px] text-scholar-500 shrink-0">
      <span>{displayText('隔离预览 ·')} {displayText(local ? '本地资源' : '集群资源')} {displayText('· 流式加载')}{report ? ` · ${(report.metadata.size / 1024 / 1024).toFixed(1)} MiB` : ''}</span>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="text-accent hover:underline" onClick={() => setNetwork(!network)}>{displayText(network ? '禁止外部资源' : '允许外部资源')}</button>
        <button type="button" className="text-accent hover:underline" onClick={() => setScripts(!scripts)}>{displayText(scripts ? '关闭网页脚本' : '启用交互内容')}</button>
        <button type="button" className="text-accent hover:underline" onClick={() => setRetry(value => value + 1)} aria-label={displayText('重新读取报告')}><RefreshCw className="h-3.5 w-3.5" /></button>
      </div>
    </div>
    {report && report.filePath !== requestedPath && <p className="shrink-0 break-all border-b border-scholar-700/60 px-2.5 py-1 font-mono text-[10px] text-scholar-400" data-user-content="true">{report.filePath}</p>}
    {error ? <div className="flex min-h-48 flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <p>{displayText('网页加载失败')}</p><p className="break-all text-xs text-scholar-300" data-user-content="true">{displayText(error)}</p>
      {matches.map(match => <button key={match} type="button" className="break-all text-left text-xs text-accent" data-user-content="true" onClick={() => { setCorrectedPath(match); setRequestedPath(match); }}>{match}</button>)}
      {!localOnly && <div className="w-full max-w-lg space-y-2">
        <label className="block text-xs text-scholar-400" htmlFor={inputId}>{displayText('集群报告完整路径')}</label>
        <input id={inputId} value={correctedPath} onChange={event => setCorrectedPath(event.target.value)} placeholder={displayText('例如 /project/07_report/report.html')} className="w-full rounded border border-scholar-600 bg-scholar-950 px-2 py-1.5 text-xs" />
        <button type="button" className="btn-ghost" disabled={!correctedPath.startsWith('/')} onClick={() => { setRequestedPath(correctedPath); setRetry(value => value + 1); }}>{displayText('按完整路径打开')}</button>
      </div>}
      <button type="button" className="btn-ghost" onClick={() => setRetry(value => value + 1)}>{displayText('重试')}</button>
    </div> : report ? <iframe key={`${src}|${retry}`} title={displayText(title)} src={src} sandbox={scripts ? 'allow-scripts' : ''} referrerPolicy="no-referrer" className="min-h-0 w-full flex-1 border-0 bg-white" data-testid="html-report-iframe" onError={() => setError('报告传输失败，请重试')} />
      : <div className="flex min-h-48 flex-1 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-scholar-300" /></div>}
  </div>;
}
