// 对话内流程运行卡：用户消息中的 [HPCLAW_WORKFLOW_RUN] 标记不再显示原始协议文本，
// 改渲染本卡片——实时展示环境状态、步骤时间线、每步脚本/日志入口与输出结果。
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Socket } from 'socket.io-client';
import {
  AlertTriangle, Database, FileText, FolderOpen, GitBranch, Loader2, Package, RefreshCw, Table2, Upload,
} from 'lucide-react';
import type { WorkflowExecutionContext } from '@/shared/workflowExecution';
import type { Workflow } from '@/shared/workflow';
import type { PreflightResult } from '@/shared/flowManifest';
import { buildChatFileViewUrls, fetchChatFileContent } from './rich-content/ContentFetcher';
import type { CardContent } from './rich-content/RendererRegistry';
import TableCard from './rich-content/TableCard';
import ImageLightbox from './ImageLightbox';
import {
  deployWorkflowAssets,
  fetchWorkflowRuns,
  getCachedPreflight,
  listWorkflows,
  mergeWorkflowRunUpdate,
  resumeWorkflowRun,
  runPreflight,
  type WorkflowRun,
} from '../features/workflows/api';
import { composeResumeRunMessage } from '../features/workflows/compose';
import { EnvItems, LogDialog, ReportDialog, RunCodeDialog, RunItem } from './FlowRunnerDrawer';

interface WorkflowRunCardProps {
  context: WorkflowExecutionContext;
  /** 集群会话；无集群（本地工作台）时为 null */
  sessionId?: string | null;
  socket?: Socket | null;
  /** 在文件传输工作区定位到指定集群目录 */
  onOpenRemoteFolder?: (path: string) => void;
  /** 提供时"查看报告"改走侧边网页栏；缺省时回退 ReportDialog 弹窗 */
  onOpenReport?: (reportPath: string) => void;
  /** 续跑/环境补齐等协议文本作为用户消息发出并触发 AI */
  onSendMessage: (text: string) => void;
}

const OUTPUT_IMAGE_RE = /\.(png|jpe?g|gif|svg|bmp|webp)$/i;
const OUTPUT_TABLE_RE = /\.(csv|tsv|tab)$/i;

/** 产物路径解析：run.json 里的产物常是 RUN 相对路径（results/x.png），
 * 直接拿去取文件会定位到别处导致只显示文本链接——统一先解析为绝对路径。 */
export function resolveRunOutputPath(path: string, runDir?: string | null): string {
  const trimmed = String(path || '').trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('/') || trimmed.startsWith('~') || /^[a-zA-Z]:[\\/]/.test(trimmed)) return trimmed;
  if (!runDir) return trimmed;
  return `${runDir.replace(/\/+$/, '')}/${trimmed.replace(/^\.?\//, '')}`;
}

function outputFileName(path: string): string {
  return path.split(/[\\/]/).pop() || path;
}

/** 输出区图片产物：缩略图直接出图（集群/本地候选依次重试），点击全屏放大；全失败不显示图 */
function OutputImageThumb({ path, sessionId }: { path: string; sessionId?: string | null }) {
  const candidates = useMemo(() => buildChatFileViewUrls(path, { sessionId }), [path, sessionId]);
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);
  if (attempt >= candidates.length) return null;
  const src = candidates[attempt];
  return (
    <>
      <img
        src={src}
        alt={outputFileName(path)}
        loading="lazy"
        onError={() => setAttempt(value => value + 1)}
        onClick={() => setExpanded(true)}
        className="max-h-28 max-w-full object-contain rounded border border-scholar-700/60 bg-scholar-950/40 cursor-pointer hover:border-accent/50"
        title="点击放大"
        data-testid="output-image-thumb"
      />
      {expanded && <ImageLightbox src={src} title={outputFileName(path)} onClose={() => setExpanded(false)} />}
    </>
  );
}

/** 输出区表格产物（csv/tsv）：按需拉取内容出 TableCard，与对话内表格卡同一 fetch 通路 */
function OutputTablePreview({ path, sessionId }: { path: string; sessionId?: string | null }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<CardContent | null>(null);
  const [failed, setFailed] = useState(false);

  const toggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (card || failed || loading) return;
    setLoading(true);
    try {
      setCard(await fetchChatFileContent(path, { sessionId }));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <button type="button" onClick={() => void toggle()} className="btn-ghost !text-[10px] !px-2 shrink-0" aria-expanded={open}>
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Table2 className="w-3 h-3" />} 表格预览
      </button>
      {open && failed && <p className="text-[10px] text-scholar-500 px-1">读取失败，可打开目录查看原文件</p>}
      {open && card && <TableCard content={card} />}
    </div>
  );
}

/** 输出区单行产物：图片给缩略图，表格给预览按钮，所有路径保留"打开所在目录" */
function OutputRow({ path, sessionId, onOpenFolder }: { path: string; sessionId?: string | null; onOpenFolder: (path: string) => void }) {
  const isImage = OUTPUT_IMAGE_RE.test(path);
  const isTable = OUTPUT_TABLE_RE.test(path);
  return (
    <div className="space-y-1">
      {isImage && <OutputImageThumb path={path} sessionId={sessionId} />}
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => onOpenFolder(path)}
          className="flex-1 min-w-0 flex items-center gap-1.5 bg-scholar-950/60 rounded px-2 py-1 text-left hover:bg-scholar-800/60 transition-colors"
          title="在文件传输工作区打开所在目录">
          <FileText className="w-3 h-3 text-scholar-500 shrink-0" />
          <code className="flex-1 text-[10px] text-scholar-300 truncate">{path}</code>
        </button>
      </div>
      {isTable && <OutputTablePreview path={path} sessionId={sessionId} />}
    </div>
  );
}

export default function WorkflowRunCard({ context, sessionId, socket, onOpenRemoteFolder, onOpenReport, onSendMessage }: WorkflowRunCardProps) {
  const [run, setRun] = useState<WorkflowRun | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(() => !!socket?.connected);
  const [logOpen, setLogOpen] = useState(false);
  const [reportPath, setReportPath] = useState<string | null>(null);
  const [codeRun, setCodeRun] = useState<WorkflowRun | null>(null);
  const [resuming, setResuming] = useState(false);
  const [error, setError] = useState('');
  // 环境区（展开时懒加载缓存预检）
  const [preflight, setPreflight] = useState<PreflightResult | null | undefined>(undefined);
  const [checkingAll, setCheckingAll] = useState(false);
  const [itemBusy, setItemBusy] = useState<Record<string, boolean>>({});
  const [deployBusy, setDeployBusy] = useState(false);
  const [deployNote, setDeployNote] = useState('');

  const matchesContext = useCallback((candidate: WorkflowRun | undefined | null): candidate is WorkflowRun => {
    if (!candidate) return false;
    return candidate.runDir === context.runDir || (!!context.runId && candidate.runId === context.runId);
  }, [context.runDir, context.runId]);

  useEffect(() => {
    const connected = () => setRealtimeConnected(true);
    const disconnected = () => setRealtimeConnected(false);
    setRealtimeConnected(!!socket?.connected);
    socket?.on('connect', connected);
    socket?.on('disconnect', disconnected);
    return () => {
      socket?.off('connect', connected);
      socket?.off('disconnect', disconnected);
    };
  }, [socket]);

  // 流程定义：名称、manifest 与内置管线文件
  useEffect(() => {
    let stopped = false;
    listWorkflows()
      .then(all => { if (!stopped) setWorkflow(all.find(item => item.id === context.workflowId) || null); })
      .catch(() => { /* 名称回退 workflowId */ });
    return () => { stopped = true; };
  }, [context.workflowId]);

  // 运行状态：Socket 实时增量 + 60 秒断线补偿（与流程主页同一通路）
  useEffect(() => {
    if (!sessionId) return;
    let stopped = false;
    const load = async () => {
      try {
        const all = await fetchWorkflowRuns(sessionId);
        if (stopped) return;
        const found = all.find(matchesContext);
        if (found) setRun(current => mergeWorkflowRunUpdate(current ? [current] : [], found)[0]);
        setLoaded(true);
      } catch { /* 下轮再试 */ }
    };
    const onRunUpdated = (payload: { run?: WorkflowRun }) => {
      if (!stopped && matchesContext(payload?.run)) {
        setRun(current => mergeWorkflowRunUpdate(current ? [current] : [], payload.run!)[0]);
        setLoaded(true);
      }
    };
    void load();
    socket?.on('workflow:run-updated', onRunUpdated);
    socket?.on('connect', load);
    const timer = setInterval(load, 60_000);
    return () => {
      stopped = true;
      clearInterval(timer);
      socket?.off('workflow:run-updated', onRunUpdated);
      socket?.off('connect', load);
    };
  }, [sessionId, socket, matchesContext]);

  // 展开时读取缓存预检
  useEffect(() => {
    if (!expanded || !sessionId || !workflow || preflight !== undefined) return;
    let stopped = false;
    getCachedPreflight(workflow.id, sessionId)
      .then(result => { if (!stopped) setPreflight(result); })
      .catch(() => { if (!stopped) setPreflight(null); });
    return () => { stopped = true; };
  }, [expanded, sessionId, workflow, preflight]);

  const manifest = workflow?.manifest;
  const envReady = preflight?.ready;
  const envFailed = !!preflight && [...preflight.software, ...preflight.references]
    .some(i => !i.ok && i.required && i.detail && i.detail !== '未检查');
  const placeholderRefNames = useMemo(
    () => (manifest?.references ?? []).filter(r => /\{\{[^}]+\}\}/.test(r.path)).map(r => r.name),
    [manifest],
  );
  const outputs = useMemo(() => {
    const list: string[] = [];
    for (const step of run?.steps || []) {
      for (const output of step.outputs || []) {
        const resolved = resolveRunOutputPath(output, run?.runDir);
        if (resolved && !list.includes(resolved)) list.push(resolved);
      }
    }
    return list;
  }, [run]);

  const doCheckAll = useCallback(async () => {
    if (!sessionId || !workflow) return;
    setCheckingAll(true);
    setError('');
    try {
      setPreflight(await runPreflight(workflow.id, sessionId));
    } catch (e: any) {
      // 校验失败必须可见，否则用户会以为没点成功
      setError(`环境检查失败：${e?.message || String(e)}`);
    } finally {
      setCheckingAll(false);
    }
  }, [sessionId, workflow]);

  const doCheckItem = useCallback(async (kind: 'software' | 'references', name: string) => {
    if (!sessionId || !workflow) return;
    setItemBusy(b => ({ ...b, [`${kind}:${name}`]: true }));
    setError('');
    try {
      const only = kind === 'software' ? { software: [name] } : { references: [name] };
      setPreflight(await runPreflight(workflow.id, sessionId, only));
    } catch (e: any) {
      setError(`校验「${name}」失败：${e?.message || String(e)}`);
    } finally {
      setItemBusy(b => ({ ...b, [`${kind}:${name}`]: false }));
    }
  }, [sessionId, workflow]);

  // 部署内置管线文件到集群（deployWorkflowAssets 链路），完成后重新全量检查
  const handleDeploy = useCallback(async () => {
    if (!sessionId || !workflow) return;
    setDeployBusy(true);
    setDeployNote('');
    try {
      const { results } = await deployWorkflowAssets(workflow.id, sessionId);
      const failed = results.filter(r => !r.ok);
      setDeployNote(failed.length === 0
        ? `已部署 ${results.length} 个管线文件`
        : failed.map(r => `${r.remotePath || '部署失败'}：${r.error || '失败'}`).join('；'));
      if (failed.length === 0) await doCheckAll();
    } catch (e: any) {
      setDeployNote(e?.message || '部署失败');
    } finally {
      setDeployBusy(false);
    }
  }, [sessionId, workflow, doCheckAll]);

  // 缺失项一键补齐：组装消息发给 AI（直接修复，登录节点操作；只有真正需要抉择才询问）
  const handleProvision = useCallback((kind: 'software' | 'references', name: string, detail?: string) => {
    if (!workflow) return;
    const kindLabel = kind === 'software' ? '软件' : '参考数据';
    onSendMessage([
      `流程「${workflow.name}」（ID: ${workflow.id}）的${kindLabel}「${name}」未就绪${detail ? `（${detail}）` : ''}。`,
      '请直接修复，不用先报方案等我确认：优先 module load 或安装到流程家目录 02_reference/（或你判断的合适位置），下载和安装只能在登录节点进行（计算节点无网络）。',
      '修复后用一条精确命令验证该项，然后重新核查并继续流程；只有确实需要我抉择时才 ask_user。',
    ].join('\n'));
  }, [onSendMessage, workflow]);

  const handleResume = useCallback(async () => {
    if (!sessionId || !run) return;
    if (!workflow) {
      setError('流程定义缺失，无法续跑');
      return;
    }
    setResuming(true);
    setError('');
    try {
      const updated = await resumeWorkflowRun(run.runDir, run.revision, sessionId);
      setRun(updated);
      onSendMessage(composeResumeRunMessage(workflow, updated));
    } catch (e: any) {
      setError(e?.message || '继续流程失败，请刷新状态后重试');
    } finally {
      setResuming(false);
    }
  }, [sessionId, run, workflow, onSendMessage]);

  const openParentFolder = useCallback((path: string) => {
    if (!onOpenRemoteFolder) return;
    const index = path.lastIndexOf('/');
    onOpenRemoteFolder(index > 0 ? path.slice(0, index) : path);
  }, [onOpenRemoteFolder]);

  // 查看报告：有侧边网页栏回调时优先走侧边栏，否则回退 ReportDialog 弹窗
  const openReport = useCallback((path: string) => {
    if (onOpenReport) onOpenReport(path);
    else setReportPath(path);
  }, [onOpenReport]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 px-1 text-[10px] text-scholar-500">
        <GitBranch className="w-3 h-3 text-accent shrink-0" />
        <span>正式流程运行</span>
        <span className="text-scholar-300 font-medium truncate">{workflow?.name || context.workflowId}</span>
        <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${realtimeConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <span className="shrink-0">{realtimeConnected ? '实时' : '重连中'}</span>
      </div>

      {!run && (
        <div className="rounded-lg border border-scholar-700/50 bg-scholar-950/50 p-2.5">
          {!sessionId ? (
            <p className="text-[11px] text-scholar-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" /> 未连接计算资源，无法读取该运行的实时状态。
            </p>
          ) : !loaded ? (
            <p className="text-[11px] text-scholar-400 flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-accent shrink-0" /> 正在读取运行状态…
            </p>
          ) : (
            <>
              <p className="text-[11px] text-scholar-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" /> 未找到该运行的最新状态（可能已被清理）。
              </p>
              <p className="mt-1 text-[9px] text-scholar-500 font-mono break-all" title={context.runDir}>工作目录：{context.runDir}</p>
              {onOpenRemoteFolder && (
                <button type="button" onClick={() => onOpenRemoteFolder(context.runDir)} className="mt-1.5 btn-ghost !text-[10px] !px-2">
                  <FolderOpen className="w-3 h-3" /> 打开目录
                </button>
              )}
            </>
          )}
        </div>
      )}

      {run && (
        <RunItem
          run={run}
          expanded={expanded}
          onToggle={() => setExpanded(value => !value)}
          onShowLog={() => setLogOpen(true)}
          onShowReport={() => run.reportPath && openReport(run.reportPath)}
          onShowCode={() => setCodeRun(run)}
          onOpenFolder={() => onOpenRemoteFolder?.(run.runDir)}
          onResume={() => void handleResume()}
          resuming={resuming}
        />
      )}

      {/* 环境/预检状态：展开时可见，缺项可一键部署或交给 AI 补齐 */}
      {run && expanded && workflow && (manifest?.software.length || manifest?.references.length || workflow.assets?.length) && (
        <section className="rounded-lg border border-scholar-700/60 bg-scholar-800/40">
          <header className="px-3 py-2 flex items-center gap-2 border-b border-scholar-700/40">
            <Package className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-scholar-100 flex-1">执行环境</span>
            {preflight && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                envReady ? 'bg-emerald-500/15 text-emerald-500'
                : envFailed ? 'bg-orange-500/15 text-orange-500'
                : 'bg-scholar-700/50 text-scholar-400'}`}>
                {envReady ? '已就绪' : envFailed ? '有缺失' : '部分未检查'}
              </span>
            )}
            <button type="button" onClick={() => void doCheckAll()} disabled={checkingAll || !sessionId}
              className="btn-ghost !text-[11px] !px-2" title="SSH 只读核查全部软件与参考数据">
              {checkingAll ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} 全部检查
            </button>
          </header>
          <div className="p-2 space-y-1">
            <EnvItems
              title="必要软件" icon={<Package className="w-3 h-3" />}
              items={preflight?.software ?? (manifest?.software ?? []).map(s => ({ name: s.name, ok: false, required: s.required, detail: undefined }))}
              checked={preflight != null}
              kind="software"
              itemBusy={itemBusy}
              onCheck={name => void doCheckItem('software', name)}
              onProvision={(name, detail) => handleProvision('software', name, detail)}
              sessionId={sessionId}
            />
            <EnvItems
              title="必要参考数据" icon={<Database className="w-3 h-3" />}
              items={(preflight?.references ?? (manifest?.references ?? []).map(r => ({ name: r.name, ok: false, required: r.required, detail: r.path })))}
              checked={preflight != null}
              kind="references"
              itemBusy={itemBusy}
              onCheck={name => void doCheckItem('references', name)}
              onProvision={(name, detail) => handleProvision('references', name, detail)}
              sessionId={sessionId}
              placeholderNames={placeholderRefNames}
            />
            {!manifest?.software.length && !manifest?.references.length && (
              <p className="text-[11px] text-scholar-500 px-1 py-1">本流程无软件与参考数据依赖</p>
            )}
            {workflow.assets && workflow.assets.length > 0 && (
              <div className="mt-1.5 rounded-md border border-accent/20 bg-accent/5 p-2">
                <div className="flex items-center gap-2">
                  <Package className="w-3 h-3 text-accent shrink-0" />
                  <span className="text-[10px] font-medium text-scholar-200 flex-1">
                    管线文件（{workflow.assets.length} 个，已随应用内置）
                  </span>
                  <button type="button" onClick={() => void handleDeploy()} disabled={deployBusy || !sessionId}
                    className="btn-primary !text-[10px] !px-2 !py-0.5"
                    title="把内置管线文件上传到计算资源流程家目录 01_software/">
                    {deployBusy ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Upload className="w-2.5 h-2.5" />}
                    安装部署
                  </button>
                </div>
                <p className="mt-1 text-[9px] text-scholar-500">
                  {workflow.assets.map(a => a.label || a.remotePath).join('、')}
                </p>
                {deployNote && <p className="mt-1 text-[9px] text-scholar-400">{deployNote}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 输出结果：路径列表 + 打开目录 + 报告入口 */}
      {run && expanded && (outputs.length > 0 || run.reportPath) && (
        <section className="rounded-lg border border-scholar-700/60 bg-scholar-800/40">
          <header className="px-3 py-2 flex items-center gap-2 border-b border-scholar-700/40">
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-scholar-100 flex-1">输出结果</span>
            <span className="text-[10px] text-scholar-500">{outputs.length} 个产物</span>
          </header>
          <div className="p-2 space-y-1.5">
            {outputs.map(path => (
              <OutputRow key={path} path={path} sessionId={sessionId} onOpenFolder={openParentFolder} />
            ))}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => run.runDir && onOpenRemoteFolder?.(run.runDir)} className="btn-ghost !text-[10px] !px-2">
                <FolderOpen className="w-3 h-3" /> 打开目录
              </button>
              {run.reportPath && (
                <button type="button" onClick={() => openReport(run.reportPath!)} className="btn-ghost !text-[10px] !px-2">
                  <FileText className="w-3 h-3" /> 查看报告
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {error && <p className="text-[11px] text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{error}</p>}

      {logOpen && run && sessionId && (
        <LogDialog runDir={run.runDir} sessionId={sessionId} onClose={() => setLogOpen(false)} />
      )}
      {reportPath && sessionId && (
        <ReportDialog reportPath={reportPath} sessionId={sessionId} onClose={() => setReportPath(null)} />
      )}
      {codeRun && sessionId && (
        <RunCodeDialog
          run={codeRun}
          sessionId={sessionId}
          onClose={() => setCodeRun(null)}
          onRunUpdated={updated => {
            setRun(updated);
            setCodeRun(updated);
          }}
        />
      )}
    </div>
  );
}
