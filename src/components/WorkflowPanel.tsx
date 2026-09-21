import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Socket } from 'socket.io-client';
import {
  Search, Plus, Sparkles, ChevronDown, ChevronRight, Play, Pencil, Trash2,
  Loader2, AlertCircle, X, GitBranch, CheckCircle2, XCircle, Circle,
  ShieldCheck, ShieldAlert, Wrench, FileText, Package, Database, FolderGit2,
  BookOpen, AlertTriangle, Activity,
} from 'lucide-react';
import type { Workflow, WorkflowPaperImport, WorkflowParam, WorkflowStep } from '@/shared/workflow';
import { WORKFLOW_CATEGORIES } from '@/shared/workflow';
import type { FlowManifest, PreflightResult } from '@/shared/flowManifest';
import { workflowSlug } from '@/shared/flowManifest';
import {
  createWorkflow, deleteWorkflow, draftWorkflow, getCachedPreflight, learnFromPaper,
  fetchWorkflowRuns, listWorkflows, mergeWorkflowRunUpdate, reconcileWorkflowRunSnapshot,
  runBelongsToWorkflow, runPreflight, updateWorkflow, type WorkflowRun,
} from '../features/workflows/api';

const RUN_STATUS: Record<string, { label: string; cls: string }> = {
  blocked_env: { label: '环境未就绪', cls: 'bg-orange-100 text-orange-700' },
  running: { label: '运行中', cls: 'bg-sky-100 text-sky-700' },
  waiting_user: { label: '等待确认', cls: 'bg-amber-100 text-amber-700' },
  waiting_jobs: { label: '后台监控', cls: 'bg-indigo-100 text-indigo-700' },
  done: { label: '已完成', cls: 'bg-emerald-100 text-emerald-700' },
  failed: { label: '失败', cls: 'bg-red-100 text-red-600' },
  cancelled: { label: '已取消', cls: 'bg-gray-100 text-gray-600' },
  unknown: { label: '未知', cls: 'bg-scholar-700/50 text-scholar-400' },
};

const QC_BADGE: Record<string, { label: string; cls: string }> = {
  pass: { label: 'QC 通过', cls: 'bg-emerald-100 text-emerald-700' },
  warn: { label: 'QC 警告', cls: 'bg-amber-100 text-amber-700' },
  fail: { label: 'QC 未过', cls: 'bg-red-100 text-red-600' },
};

interface WorkflowPanelProps {
  /** 点击"使用流程"：把组合好的执行指令发回聊天 */
  onUseWorkflow: (message: string) => void;
  /** 打开流程的可视化运行面板 */
  onOpenRunner: (workflow: Workflow) => void;
  /** AI 起草用的模型配置 */
  aiProfile: { provider: string; model: string; apiKey: string };
  /** 当前集群会话：流程运行监控与预检按会话读取 */
  sessionId?: string | null;
  /** 复用终端连接接收流程状态增量事件。 */
  socket?: Socket | null;
}

const SOURCE_LABELS: Record<string, string> = {
  builtin: '内置',
  user: '自定义',
  ai: 'AI 生成',
};

/** 未设置分类的流程归入的展示分组 */
const UNCATEGORIZED_CATEGORY = '其他';

/** 分类排序：7 个内置分类按固定顺序在前，自定义分类按字典序，“其他”垫底 */
function orderWorkflowCategories(categories: Iterable<string>): string[] {
  const present = new Set([...categories].map(c => c.trim()).filter(Boolean));
  const custom = [...present]
    .filter(c => c !== UNCATEGORIZED_CATEGORY && !(WORKFLOW_CATEGORIES as readonly string[]).includes(c))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));
  return [...WORKFLOW_CATEGORIES, ...custom, UNCATEGORIZED_CATEGORY].filter(c => present.has(c));
}

type EditorState = {
  id?: string;
  name: string;
  description: string;
  keywords: string;
  /** 分类名（WORKFLOW_CATEGORIES 之一或自定义）；undefined 表示未分类 */
  category?: string;
  params: WorkflowParam[];
  steps: WorkflowStep[];
  /** 学习/起草时附带的资源清单（编辑器不展示，保存时原样保留） */
  manifest?: FlowManifest;
  /** 文献导入证据与质量审计；保存后仍可追溯。 */
  paperImport?: WorkflowPaperImport;
  source?: Workflow['source'];
};

/** 文献学习后的编辑器提示（工具校验结果、参考仓库） */
type LearnNotice = {
  repoUsed: string | null;
  missingTools: string[];
  okTools: Array<{ name: string; hit?: string }>;
  paperImport: WorkflowPaperImport;
};

const emptyEditor = (): EditorState => ({
  name: '',
  description: '',
  keywords: '',
  params: [],
  steps: [{ title: '', command: '' }],
});

export default function WorkflowPanel({ onUseWorkflow, onOpenRunner, aiProfile, sessionId, socket }: WorkflowPanelProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [draftMode, setDraftMode] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [drafting, setDrafting] = useState(false);
  const [learnMode, setLearnMode] = useState(false);
  const [learnDoi, setLearnDoi] = useState('');
  const [learning, setLearning] = useState(false);
  const [learnStatus, setLearnStatus] = useState('');
  const [learnNotice, setLearnNotice] = useState<LearnNotice | null>(null);
  const [paperReviewConfirmed, setPaperReviewConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [realtimeConnected, setRealtimeConnected] = useState(() => !!socket?.connected);
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);
  // 预检结果缓存：key = workflowId；undefined=未加载，null=集群上无缓存
  const [preflights, setPreflights] = useState<Record<string, PreflightResult | null | undefined>>({});
  const [preflightBusy, setPreflightBusy] = useState<Record<string, boolean>>({});

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setWorkflows(await listWorkflows());
    } catch (e: any) {
      setError(e.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

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

  // 流程运行监控：Socket 增量推送为主，60 秒低频快照只做断线补偿。
  useEffect(() => {
    if (!sessionId) { setRuns([]); return; }
    let stopped = false;
    const load = async () => {
      try {
        const next = await fetchWorkflowRuns(sessionId);
        if (!stopped) setRuns(current => reconcileWorkflowRunSnapshot(current, next));
      } catch { /* 会话未就绪时下轮再试 */ }
    };
    const onRunUpdated = (payload: { run?: WorkflowRun }) => {
      if (!stopped && payload?.run) setRuns(current => mergeWorkflowRunUpdate(current, payload.run));
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
  }, [sessionId, socket]);

  // 展开流程卡片时加载缓存的预检结果
  useEffect(() => {
    if (!expandedId || !sessionId) return;
    if (preflights[expandedId] !== undefined) return;
    let stopped = false;
    getCachedPreflight(expandedId, sessionId)
      .then(result => { if (!stopped) setPreflights(p => ({ ...p, [expandedId]: result })); })
      .catch(() => { if (!stopped) setPreflights(p => ({ ...p, [expandedId]: null })); });
    return () => { stopped = true; };
  }, [expandedId, sessionId, preflights]);

  const handlePreflight = async (w: Workflow) => {
    if (!sessionId) { setError('需要先连接计算资源会话'); return; }
    setPreflightBusy(b => ({ ...b, [w.id]: true }));
    setError('');
    try {
      const result = await runPreflight(w.id, sessionId);
      setPreflights(p => ({ ...p, [w.id]: result }));
    } catch (e: any) {
      setError(e.message || '预检失败');
    } finally {
      setPreflightBusy(b => ({ ...b, [w.id]: false }));
    }
  };

  // 使用流程：打开可视化运行面板（预检/选数据/配参数在面板内完成）
  const handleUse = (w: Workflow) => {
    onOpenRunner(w);
  };

  // 让 AI 补齐缺失项（安装软件/下载参考数据，AI 会先征得用户同意）
  const handleProvision = (w: Workflow, result: PreflightResult) => {
    const missing = [
      ...result.software.filter(i => !i.ok && i.required).map(i => `软件「${i.name}」：${i.detail || '缺失'}`),
      ...result.references.filter(i => !i.ok && i.required).map(i => `参考数据「${i.name}」：${i.detail || '缺失'}`),
    ];
    const lines = [
      `流程「${w.name}」（ID: ${w.id}）预检发现以下必需项未就绪：`,
      ...missing.map(m => `- ${m}`),
      '',
      '请帮我补齐：先告诉我你的方案（安装哪个 module/包、参考数据放哪里），征得我同意后再操作；',
      '注意：下载和安装只能在登录节点进行（计算节点无网络）。补齐后请重新核查并更新预检结果。',
      `流程家目录：~/hpclaw_flows/（软件清单见 01_software/manifest.json，参考数据清单见 02_reference/manifest.json）`,
    ];
    onUseWorkflow(lines.join('\n'));
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return workflows.filter(w => !query
      || w.name.toLowerCase().includes(query)
      || w.description.toLowerCase().includes(query)
      || w.keywords.some(k => k.toLowerCase().includes(query)));
  }, [workflows, search]);

  // 分类分组：按 category 分组渲染组头；类别筛选只影响展示不影响搜索
  const groupedWorkflows = useMemo(() => {
    const byCategory = new Map<string, Workflow[]>();
    for (const w of filtered) {
      const category = w.category?.trim() || UNCATEGORIZED_CATEGORY;
      if (categoryFilter !== 'all' && category !== categoryFilter) continue;
      byCategory.set(category, [...(byCategory.get(category) || []), w]);
    }
    return orderWorkflowCategories(byCategory.keys())
      .map(c => ({ category: c, items: byCategory.get(c)! }));
  }, [filtered, categoryFilter]);

  // 筛选下拉列出搜索命中的全部分类（不受当前筛选值影响，保证随时可切换）
  const presentCategories = useMemo(
    () => orderWorkflowCategories(filtered.map(w => w.category?.trim() || UNCATEGORIZED_CATEGORY)),
    [filtered],
  );
  // 一次归属计算供所有卡片复用，避免每次输入/展开时反复做 workflows × runs 扫描。
  const { runsByWorkflow, orphanRuns } = useMemo(() => {
    const byWorkflow = new Map<string, WorkflowRun[]>();
    const orphaned: WorkflowRun[] = [];
    for (const run of runs) {
      const workflow = workflows.find(item => runBelongsToWorkflow(run, item));
      if (!workflow) orphaned.push(run);
      else byWorkflow.set(workflow.id, [...(byWorkflow.get(workflow.id) || []), run]);
    }
    return { runsByWorkflow: byWorkflow, orphanRuns: orphaned };
  }, [runs, workflows]);

  const handleDelete = async (w: Workflow) => {
    if (!window.confirm(`删除流程定义「${w.name}」？已有运行目录、结果和报告不会被删除。`)) return;
    try {
      await deleteWorkflow(w.id);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSave = async () => {
    if (!editor) return;
    const steps = editor.steps.filter(s => s.title.trim() && s.command.trim());
    if (!editor.name.trim() || steps.length === 0) {
      setError('流程名称和至少一个有效步骤（标题+命令）必填');
      return;
    }
    if (editor.paperImport && !paperReviewConfirmed) {
      setError('请先查看文献完整度、未匹配工具和待确认问题，并勾选“我已检查文献提取结果”');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: editor.name.trim(),
        description: editor.description.trim(),
        keywords: editor.keywords.split(/[,，]/).map(k => k.trim()).filter(Boolean),
        // 空串表示用户主动清除分类（服务端据此删除字段）
        category: editor.category?.trim() || '',
        params: editor.params.filter(p => p.name.trim()),
        steps,
        manifest: editor.manifest,
        paperImport: editor.paperImport
          ? { ...editor.paperImport, reviewedAt: editor.paperImport.reviewedAt || Date.now() }
          : undefined,
        source: editor.source,
      };
      if (editor.id) await updateWorkflow(editor.id, payload);
      else await createWorkflow(payload);
      setEditor(null);
      setLearnNotice(null);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDraft = async () => {
    if (!draftText.trim() || !aiProfile.apiKey) return;
    setDrafting(true);
    setError('');
    try {
      const draft = await draftWorkflow(draftText.trim(), aiProfile);
      setEditor({
        name: draft.name || '',
        description: draft.description || '',
        keywords: (draft.keywords || []).join(', '),
        params: draft.params || [],
        steps: draft.steps?.length ? draft.steps : [{ title: '', command: '' }],
        manifest: draft.manifest,
        // 保留草稿来源（'ai'），保存后流程标记为“AI 生成”而不是“自定义”
        source: draft.source,
      });
      setDraftMode(false);
      setDraftText('');
      setLearnNotice(null);
      setPaperReviewConfirmed(false);
    } catch (e: any) {
      setError(e.message || 'AI 生成失败');
    } finally {
      setDrafting(false);
    }
  };

  /** 把学习到的流程草稿装进编辑器 */
  const openLearnedDraft = (
    draft: Partial<Workflow>,
    notice?: {
      repoUsed: string | null;
      softwareCheck: Array<{ name: string; status: string; hit?: string }>;
      paperImport: WorkflowPaperImport;
    },
  ) => {
    setEditor({
      name: draft.name || '',
      description: draft.description || '',
      keywords: (draft.keywords || []).join(', '),
      params: draft.params || [],
      steps: draft.steps?.length ? draft.steps : [{ title: '', command: '' }],
      manifest: draft.manifest,
      paperImport: notice?.paperImport || draft.paperImport,
      source: 'ai',
    });
    if (notice) {
      setLearnNotice({
        repoUsed: notice.repoUsed,
        missingTools: notice.softwareCheck.filter(s => s.status === 'missing').map(s => s.name),
        okTools: notice.softwareCheck.filter(s => s.status === 'ok').map(s => ({ name: s.name, hit: s.hit })),
        paperImport: notice.paperImport,
      });
    } else {
      setLearnNotice(null);
    }
    setLearnMode(false);
    setDraftMode(false);
    setLearnDoi('');
    setLearnStatus('');
    setPaperReviewConfirmed(false);
  };

  // 从 DOI 学习：后端解析 DOI → 抓全文 → LLM 提取流程
  const handleLearnDoi = async () => {
    if (!learnDoi.trim() || !aiProfile.apiKey) return;
    setLearning(true);
    setError('');
    setLearnStatus('正在解析 DOI 并获取全文…');
    try {
      const { draft, source, paperChars, repoUsed, softwareCheck, paperImport } = await learnFromPaper({ doi: learnDoi.trim() }, aiProfile);
      setLearnStatus(`已学习 ${source}（${Math.round(paperChars / 1000)}k 字符）`);
      openLearnedDraft(draft, { repoUsed, softwareCheck, paperImport });
    } catch (e: any) {
      setLearnStatus('');
      setError(e.message || '文献学习失败');
    } finally {
      setLearning(false);
    }
  };

  // 从 PDF 学习：前端 pdfjs 提取文本（前 50 页）→ 后端 LLM 提取流程
  const handleLearnPdf = async (file: File) => {
    if (!aiProfile.apiKey) return;
    setLearning(true);
    setError('');
    setLearnStatus('正在解析 PDF…');
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString();
      const doc = await pdfjs.getDocument({ data: bytes }).promise;
      const parts: string[] = [];
      const maxPages = Math.min(doc.numPages, 50);
      for (let p = 1; p <= maxPages; p++) {
        const page = await doc.getPage(p);
        const content = await page.getTextContent();
        parts.push(content.items.map((it: any) => `${it.str}${it.hasEOL ? '\n' : ' '}`).join(''));
        if (parts.join('\n').length > 220_000) break;
      }
      const paperText = parts.join('\n');
      if (paperText.length < 800) throw new Error('PDF 提取的文本太少（可能是扫描件图片型 PDF）');
      setLearnStatus(`已提取 ${Math.round(paperText.length / 1000)}k 字符，AI 学习中…`);
      const { draft, repoUsed, softwareCheck, paperImport } = await learnFromPaper({ paperText }, aiProfile);
      openLearnedDraft(draft, { repoUsed, softwareCheck, paperImport });
    } catch (e: any) {
      setLearnStatus('');
      setError(e.message || 'PDF 学习失败');
    } finally {
      setLearning(false);
    }
  };

  // ─── 编辑器视图 ───
  if (editor) {
    const editableManifest: FlowManifest = editor.manifest ?? { software: [], references: [], qcGates: [] };
    const setManifest = (manifest: FlowManifest) => setEditor({ ...editor, manifest });
    const paperAudit = editor.paperImport;
    const paperReadiness = paperAudit?.quality.readiness === 'ready_for_review'
      ? '结构较完整，仍需人工复核'
      : paperAudit?.quality.readiness === 'needs_input'
        ? '有缺口，需要补充/确认'
        : '证据不足，不建议直接运行';
    return (
      <div className="flex-1 overflow-y-auto flex flex-col p-3 space-y-3">
        <div className="flex items-center justify-between shrink-0">
          <h3 className="text-sm font-medium text-scholar-100">{editor.id ? '编辑流程' : '新建流程'}</h3>
          <button onClick={() => { setEditor(null); setLearnNotice(null); }} className="btn-icon" aria-label="返回"><X className="w-4 h-4" /></button>
        </div>
        {error && <p className="text-xs text-red-600 flex items-center gap-1 shrink-0"><AlertCircle className="w-3 h-3" />{error}</p>}
        {learnNotice && (
          <div className="text-[11px] rounded-lg border border-accent/20 bg-accent/5 p-2 space-y-0.5 shrink-0">
            {learnNotice.repoUsed && (
              <p className="text-scholar-300">已参考代码仓库：<code className="text-accent/90">{learnNotice.repoUsed}</code>（步骤以仓库代码为准）</p>
            )}
            {learnNotice.okTools.length > 0 && (
              <p className="text-emerald-500">Bioconda 已收录：{learnNotice.okTools.map(t => t.hit && t.hit !== t.name.toLowerCase() ? `${t.name}→${t.hit}` : t.name).join('、')}</p>
            )}
            {learnNotice.missingTools.length > 0 && (
              <p className="text-amber-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />
                以下工具名未在 Bioconda 收录，请确认：{learnNotice.missingTools.join('、')}
              </p>
            )}
          </div>
        )}
        {paperAudit && (
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-2.5 space-y-2 text-[11px] shrink-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-scholar-100 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> 文献流程审计
              </p>
              <span className={`px-1.5 py-0.5 rounded font-medium ${paperAudit.quality.score >= 75 ? 'bg-emerald-500/15 text-emerald-500' : paperAudit.quality.score >= 45 ? 'bg-amber-500/15 text-amber-500' : 'bg-red-500/15 text-red-500'}`}>
                {paperAudit.quality.score}/100 · {paperReadiness}
              </span>
            </div>
            <p className="text-scholar-400">来源：{paperAudit.sourceLabel}{paperAudit.doi ? ` · DOI ${paperAudit.doi}` : ''}</p>
            {paperAudit.primaryPath && <p className="text-scholar-300">主路径：{paperAudit.primaryPath}</p>}
            <div className="grid grid-cols-5 gap-1 text-center text-[9px]">
              {([
                ['证据', paperAudit.quality.dimensions.evidence], ['可执行', paperAudit.quality.dimensions.executability],
                ['参数', paperAudit.quality.dimensions.parameters], ['资源', paperAudit.quality.dimensions.resources],
                ['QC', paperAudit.quality.dimensions.qc],
              ] as const).map(([label, score]) => (
                <div key={label} className="rounded bg-scholar-950/80 px-1 py-1 text-scholar-400">
                  <span className="block text-scholar-200">{score}</span>{label}
                </div>
              ))}
            </div>
            {paperAudit.quality.blockers.length > 0 && (
              <div>
                <p className="text-red-500 font-medium">保存/运行前必须检查</p>
                {paperAudit.quality.blockers.map((item, index) => <p key={index} className="text-red-400">• {item}</p>)}
              </div>
            )}
            {paperAudit.unresolvedQuestions.length > 0 && (
              <div>
                <p className="text-amber-500 font-medium">待确认问题</p>
                {paperAudit.unresolvedQuestions.map((item, index) => (
                  <p key={index} className="text-scholar-300">• {item.question}{item.affectsSteps?.length ? `（影响步骤 ${item.affectsSteps.join('、')}）` : ''}</p>
                ))}
              </div>
            )}
            {paperAudit.toolLinks.length > 0 && (
              <div>
                <p className="text-scholar-300 font-medium">论文 ↔ 代码工具对照（CoPaLink 思路）</p>
                <div className="mt-1 space-y-1">
                  {paperAudit.toolLinks.map((link, index) => (
                    <div key={`${link.canonicalName}-${index}`} className="flex items-center gap-1.5 rounded bg-scholar-950/70 px-1.5 py-1">
                      <span className={link.status === 'matched' ? 'text-emerald-500' : 'text-amber-500'}>
                        {link.status === 'matched' ? '已匹配' : link.status === 'paper_only' ? '仅论文' : link.status === 'code_only' ? '仅代码' : '未验证'}
                      </span>
                      <span className="text-scholar-200">{link.paperMention || '—'} ↔ {link.codeMention || '—'}</span>
                      {link.knowledgeBase && <span className="text-scholar-500 ml-auto">{link.knowledgeBase}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {paperAudit.excludedBranches.length > 0 && (
              <details>
                <summary className="text-scholar-300 cursor-pointer">未混入主流程的对照/替代分支（{paperAudit.excludedBranches.length}）</summary>
                {paperAudit.excludedBranches.map((item, index) => <p key={index} className="text-scholar-400 mt-0.5">• {item}</p>)}
              </details>
            )}
            <label className="flex items-start gap-1.5 rounded border border-amber-400/20 p-1.5 text-scholar-200 cursor-pointer">
              <input type="checkbox" checked={paperReviewConfirmed} onChange={event => setPaperReviewConfirmed(event.target.checked)} className="mt-0.5" />
              我已检查论文证据、未匹配工具和待确认问题；保存的是可继续修改的流程草稿，不把缺失信息当成论文事实。
            </label>
          </div>
        )}

        <input value={editor.name} onChange={e => setEditor({ ...editor, name: e.target.value })}
          placeholder="流程名称 *" className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
        <input value={editor.description} onChange={e => setEditor({ ...editor, description: e.target.value })}
          placeholder="一句话描述用途" className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
        <input value={editor.keywords} onChange={e => setEditor({ ...editor, keywords: e.target.value })}
          placeholder="触发关键词，用逗号分隔（如：转录组, rnaseq, 质控）" className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
        <CategoryPicker value={editor.category} onChange={category => setEditor({ ...editor, category })} />

        {/* 参数 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-scholar-300">参数（命令里用 {'{{参数名}}'} 占位）</span>
            <button onClick={() => setEditor({ ...editor, params: [...editor.params, { name: '', label: '' }] })}
              className="text-xs text-accent hover:underline">+ 参数</button>
          </div>
          {editor.params.map((p, i) => (
            <div key={i} className="flex gap-1.5">
              <input value={p.name} placeholder="参数名" onChange={e => {
                const params = [...editor.params]; params[i] = { ...p, name: e.target.value };
                setEditor({ ...editor, params });
              }} className="w-24 bg-scholar-950 border border-scholar-600 rounded px-2 py-1 text-xs focus:outline-none" />
              <input value={p.label} placeholder="说明" onChange={e => {
                const params = [...editor.params]; params[i] = { ...p, label: e.target.value };
                setEditor({ ...editor, params });
              }} className="flex-1 bg-scholar-950 border border-scholar-600 rounded px-2 py-1 text-xs focus:outline-none" />
              <input value={p.defaultValue || ''} placeholder="默认值" onChange={e => {
                const params = [...editor.params]; params[i] = { ...p, defaultValue: e.target.value };
                setEditor({ ...editor, params });
              }} className="w-20 bg-scholar-950 border border-scholar-600 rounded px-2 py-1 text-xs focus:outline-none" />
              <select value={p.type || 'text'} onChange={e => {
                const params = [...editor.params]; params[i] = { ...p, type: e.target.value as WorkflowParam['type'] };
                setEditor({ ...editor, params });
              }} className="w-20 bg-scholar-950 border border-scholar-600 rounded px-1 py-1 text-[10px] focus:outline-none">
                <option value="text">文本</option><option value="number">数字</option><option value="select">选项</option>
                <option value="boolean">开关</option><option value="path">路径</option>
              </select>
              <label className="flex items-center gap-1 text-[10px] text-scholar-400 shrink-0">
                <input type="checkbox" checked={p.required === true} onChange={e => {
                  const params = [...editor.params]; params[i] = { ...p, required: e.target.checked };
                  setEditor({ ...editor, params });
                }} />必填
              </label>
              <button onClick={() => setEditor({ ...editor, params: editor.params.filter((_, j) => j !== i) })}
                className="text-scholar-400 hover:text-red-600 px-1" aria-label="删除参数"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>

        {/* 环境、参考数据与 QC：结构化配置，运行前预检和步骤门禁共用 */}
        <div className="space-y-2 rounded-lg border border-scholar-700 bg-scholar-950/50 p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-scholar-300">环境与 QC 配置</span>
            <span className="text-[10px] text-scholar-500">AI 与运行器共同使用</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-scholar-400">必要软件</span>
              <button onClick={() => setManifest({ ...editableManifest, software: [...editableManifest.software, { name: '', required: true }] })}
                className="text-[10px] text-accent hover:underline">+ 软件</button>
            </div>
            {editableManifest.software.map((item, i) => (
              <div key={i} className="flex gap-1.5">
                <input value={item.name} placeholder="软件名" onChange={e => {
                  const software = [...editableManifest.software]; software[i] = { ...item, name: e.target.value }; setManifest({ ...editableManifest, software });
                }} className="w-32 bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-[10px]" />
                <input value={item.module || ''} placeholder="module/版本或留空" onChange={e => {
                  const software = [...editableManifest.software]; software[i] = { ...item, module: e.target.value }; setManifest({ ...editableManifest, software });
                }} className="flex-1 bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-[10px]" />
                <label className="flex items-center gap-1 text-[10px] text-scholar-400"><input type="checkbox" checked={item.required} onChange={e => {
                  const software = [...editableManifest.software]; software[i] = { ...item, required: e.target.checked }; setManifest({ ...editableManifest, software });
                }} />必需</label>
                <button onClick={() => setManifest({ ...editableManifest, software: editableManifest.software.filter((_, j) => j !== i) })}
                  aria-label="删除软件" className="text-scholar-500 hover:text-red-500"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-scholar-400">参考数据</span>
              <button onClick={() => setManifest({ ...editableManifest, references: [...editableManifest.references, { name: '', path: '', type: 'other', required: true }] })}
                className="text-[10px] text-accent hover:underline">+ 参考数据</button>
            </div>
            {editableManifest.references.map((item, i) => (
              <div key={i} className="flex gap-1.5">
                <input value={item.name} placeholder="名称" onChange={e => {
                  const references = [...editableManifest.references]; references[i] = { ...item, name: e.target.value }; setManifest({ ...editableManifest, references });
                }} className="w-28 bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-[10px]" />
                <input value={item.path} placeholder="绝对路径或 {{参数}}" onChange={e => {
                  const references = [...editableManifest.references]; references[i] = { ...item, path: e.target.value }; setManifest({ ...editableManifest, references });
                }} className="flex-1 bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-[10px] font-mono" />
                <select value={item.type} onChange={e => {
                  const references = [...editableManifest.references]; references[i] = { ...item, type: e.target.value as typeof item.type }; setManifest({ ...editableManifest, references });
                }} className="w-24 bg-scholar-900 border border-scholar-600 rounded px-1 py-1 text-[10px]">
                  <option value="genome">基因组</option><option value="index">索引</option><option value="annotation">注释</option>
                  <option value="database">数据库</option><option value="other">其他</option>
                </select>
                <label className="flex items-center gap-1 text-[10px] text-scholar-400"><input type="checkbox" checked={item.required} onChange={e => {
                  const references = [...editableManifest.references]; references[i] = { ...item, required: e.target.checked }; setManifest({ ...editableManifest, references });
                }} />必需</label>
                <button onClick={() => setManifest({ ...editableManifest, references: editableManifest.references.filter((_, j) => j !== i) })}
                  aria-label="删除参考数据" className="text-scholar-500 hover:text-red-500"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-scholar-400">QC 关卡</span>
              <button onClick={() => setManifest({ ...editableManifest, qcGates: [...editableManifest.qcGates, { afterStep: 1, metric: '', pass: '' }] })}
                className="text-[10px] text-accent hover:underline">+ QC</button>
            </div>
            {editableManifest.qcGates.map((item, i) => (
              <div key={i} className="flex gap-1.5">
                <input type="number" min={1} value={item.afterStep} title="在哪一步之后检查" onChange={e => {
                  const qcGates = [...editableManifest.qcGates]; qcGates[i] = { ...item, afterStep: Number(e.target.value) }; setManifest({ ...editableManifest, qcGates });
                }} className="w-14 bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-[10px]" />
                <input value={item.metric} placeholder="指标" onChange={e => {
                  const qcGates = [...editableManifest.qcGates]; qcGates[i] = { ...item, metric: e.target.value }; setManifest({ ...editableManifest, qcGates });
                }} className="w-28 bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-[10px]" />
                <input value={item.pass} placeholder="通过标准，如 >80%" onChange={e => {
                  const qcGates = [...editableManifest.qcGates]; qcGates[i] = { ...item, pass: e.target.value }; setManifest({ ...editableManifest, qcGates });
                }} className="flex-1 bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-[10px]" />
                <input value={item.warn || ''} placeholder="警告标准" onChange={e => {
                  const qcGates = [...editableManifest.qcGates]; qcGates[i] = { ...item, warn: e.target.value }; setManifest({ ...editableManifest, qcGates });
                }} className="w-28 bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-[10px]" />
                <button onClick={() => setManifest({ ...editableManifest, qcGates: editableManifest.qcGates.filter((_, j) => j !== i) })}
                  aria-label="删除QC" className="text-scholar-500 hover:text-red-500"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* 步骤 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-scholar-300">步骤（按执行顺序）</span>
            <button onClick={() => setEditor({ ...editor, steps: [...editor.steps, { title: '', command: '' }] })}
              className="text-xs text-accent hover:underline">+ 步骤</button>
          </div>
          {editor.steps.map((s, i) => (
            <div key={i} className="bg-scholar-950 border border-scholar-700 rounded-lg p-2 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-scholar-400 w-4 shrink-0">{i + 1}.</span>
                <input value={s.title} placeholder="步骤标题 *" onChange={e => {
                  const steps = [...editor.steps]; steps[i] = { ...s, title: e.target.value };
                  setEditor({ ...editor, steps });
                }} className="flex-1 bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-xs focus:outline-none" />
                <label className="flex items-center gap-1 text-[10px] text-scholar-400 shrink-0">
                  <input type="checkbox" checked={!!s.optional} onChange={e => {
                    const steps = [...editor.steps]; steps[i] = { ...s, optional: e.target.checked };
                    setEditor({ ...editor, steps });
                  }} />可选
                </label>
                <button onClick={() => setEditor({ ...editor, steps: editor.steps.filter((_, j) => j !== i) })}
                  className="text-scholar-400 hover:text-red-600 px-0.5" aria-label="删除步骤"><Trash2 className="w-3 h-3" /></button>
              </div>
              <textarea value={s.command} placeholder="命令模板 *（如：bsub -q normal -n 8 &quot;fastqc {{SAMPLE}}.fq.gz&quot;）" rows={2}
                onChange={e => {
                  const steps = [...editor.steps]; steps[i] = { ...s, command: e.target.value };
                  setEditor({ ...editor, steps });
                }} className="w-full bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-xs font-mono focus:outline-none resize-y" />
              <input value={s.notes || ''} placeholder="备注（可选）" onChange={e => {
                const steps = [...editor.steps]; steps[i] = { ...s, notes: e.target.value };
                setEditor({ ...editor, steps });
              }} className="w-full bg-scholar-900 border border-scholar-600 rounded px-2 py-1 text-xs focus:outline-none" />
              <div className="rounded border border-scholar-700/80 p-1.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-scholar-400">本步骤可调参数</span>
                  <button onClick={() => {
                    const steps = [...editor.steps];
                    steps[i] = { ...s, params: [...(s.params || []), { name: '', label: '', type: 'text', required: false }] };
                    setEditor({ ...editor, steps });
                  }} className="text-[10px] text-accent hover:underline">+ 参数</button>
                </div>
                {(s.params || []).map((param, paramIndex) => (
                  <div key={paramIndex} className="flex gap-1">
                    <input value={param.name} placeholder="参数名" onChange={event => {
                      const steps = [...editor.steps]; const params = [...(s.params || [])];
                      params[paramIndex] = { ...param, name: event.target.value }; steps[i] = { ...s, params }; setEditor({ ...editor, steps });
                    }} className="w-20 bg-scholar-900 border border-scholar-600 rounded px-1.5 py-1 text-[10px]" />
                    <input value={param.label} placeholder="说明" onChange={event => {
                      const steps = [...editor.steps]; const params = [...(s.params || [])];
                      params[paramIndex] = { ...param, label: event.target.value }; steps[i] = { ...s, params }; setEditor({ ...editor, steps });
                    }} className="flex-1 bg-scholar-900 border border-scholar-600 rounded px-1.5 py-1 text-[10px]" />
                    <input value={param.defaultValue || ''} placeholder="默认值/留空" onChange={event => {
                      const steps = [...editor.steps]; const params = [...(s.params || [])];
                      params[paramIndex] = { ...param, defaultValue: event.target.value }; steps[i] = { ...s, params }; setEditor({ ...editor, steps });
                    }} className="w-20 bg-scholar-900 border border-scholar-600 rounded px-1.5 py-1 text-[10px]" />
                    <select value={param.type || 'text'} onChange={event => {
                      const steps = [...editor.steps]; const params = [...(s.params || [])];
                      params[paramIndex] = { ...param, type: event.target.value as WorkflowParam['type'] }; steps[i] = { ...s, params }; setEditor({ ...editor, steps });
                    }} className="w-16 bg-scholar-900 border border-scholar-600 rounded px-1 text-[9px]">
                      <option value="text">文本</option><option value="number">数字</option><option value="select">选项</option>
                      <option value="boolean">开关</option><option value="path">路径</option>
                    </select>
                    <label className="flex items-center gap-0.5 text-[9px] text-scholar-400"><input type="checkbox" checked={param.required === true} onChange={event => {
                      const steps = [...editor.steps]; const params = [...(s.params || [])];
                      params[paramIndex] = { ...param, required: event.target.checked }; steps[i] = { ...s, params }; setEditor({ ...editor, steps });
                    }} />必填</label>
                    <button onClick={() => {
                      const steps = [...editor.steps]; steps[i] = { ...s, params: (s.params || []).filter((_, index) => index !== paramIndex) }; setEditor({ ...editor, steps });
                    }} aria-label="删除步骤参数" className="text-scholar-500 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
              {s.agent && (
                <details className={`rounded border p-1.5 ${s.agent.requiresReview ? 'border-amber-500/40 bg-amber-500/5' : 'border-scholar-700/80'}`}>
                  <summary className="text-[10px] text-scholar-300 cursor-pointer">
                    Agent 证据与输入输出 · {s.agent.confidence === 'high' ? '高可信' : s.agent.confidence === 'medium' ? '中可信' : '低可信'}
                    {s.agent.requiresReview ? ' · 必须确认' : ''}
                  </summary>
                  <div className="mt-1.5 grid grid-cols-2 gap-1">
                    <select value={s.agent.kind} onChange={event => {
                      const steps = [...editor.steps]; steps[i] = { ...s, agent: { ...s.agent!, kind: event.target.value as NonNullable<WorkflowStep['agent']>['kind'] } }; setEditor({ ...editor, steps });
                    }} className="bg-scholar-900 border border-scholar-600 rounded px-1.5 py-1 text-[10px]">
                      <option value="decision">决策</option><option value="compute">计算</option><option value="qc">QC</option><option value="report">报告</option>
                    </select>
                    <select value={s.agent.confidence || 'low'} onChange={event => {
                      const steps = [...editor.steps]; steps[i] = { ...s, agent: { ...s.agent!, confidence: event.target.value as NonNullable<WorkflowStep['agent']>['confidence'] } }; setEditor({ ...editor, steps });
                    }} className="bg-scholar-900 border border-scholar-600 rounded px-1.5 py-1 text-[10px]">
                      <option value="high">高可信</option><option value="medium">中可信</option><option value="low">低可信</option>
                    </select>
                    <input value={s.agent.sourceSection || ''} placeholder="论文章节/代码规则" onChange={event => {
                      const steps = [...editor.steps]; steps[i] = { ...s, agent: { ...s.agent!, sourceSection: event.target.value } }; setEditor({ ...editor, steps });
                    }} className="col-span-2 bg-scholar-900 border border-scholar-600 rounded px-1.5 py-1 text-[10px]" />
                    <textarea value={s.agent.evidence || ''} placeholder="来源证据的短句转述" rows={2} onChange={event => {
                      const steps = [...editor.steps]; steps[i] = { ...s, agent: { ...s.agent!, evidence: event.target.value } }; setEditor({ ...editor, steps });
                    }} className="col-span-2 bg-scholar-900 border border-scholar-600 rounded px-1.5 py-1 text-[10px] resize-y" />
                    <textarea value={(s.agent.inputs || []).join('\n')} placeholder="预期输入，每行一个" rows={2} onChange={event => {
                      const steps = [...editor.steps]; steps[i] = { ...s, agent: { ...s.agent!, inputs: event.target.value.split('\n').map(value => value.trim()).filter(Boolean) } }; setEditor({ ...editor, steps });
                    }} className="bg-scholar-900 border border-scholar-600 rounded px-1.5 py-1 text-[10px] resize-y" />
                    <textarea value={(s.agent.outputs || []).join('\n')} placeholder="预期输出，每行一个" rows={2} onChange={event => {
                      const steps = [...editor.steps]; steps[i] = { ...s, agent: { ...s.agent!, outputs: event.target.value.split('\n').map(value => value.trim()).filter(Boolean) } }; setEditor({ ...editor, steps });
                    }} className="bg-scholar-900 border border-scholar-600 rounded px-1.5 py-1 text-[10px] resize-y" />
                    <label className="col-span-2 flex items-center gap-1 text-[10px] text-amber-500"><input type="checkbox" checked={s.agent.requiresReview === true} onChange={event => {
                      const steps = [...editor.steps]; steps[i] = { ...s, agent: { ...s.agent!, requiresReview: event.target.checked } }; setEditor({ ...editor, steps });
                    }} />运行前必须由用户确认本步骤</label>
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 shrink-0 pt-1">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} 保存流程
          </button>
          <button onClick={() => { setEditor(null); setLearnNotice(null); }} className="btn-ghost">取消</button>
        </div>
      </div>
    );
  }

  // ─── 列表视图 ───
  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* 搜索 + 操作 */}
      <div className="shrink-0 p-3 pb-1 flex gap-1.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-scholar-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="搜索流程或关键词..."
            className="w-full bg-scholar-950 border border-scholar-600 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
        </div>
        <button onClick={() => { setDraftMode(m => !m); setLearnMode(false); }} className="btn-ghost !px-2.5 text-xs" title="AI 辅助生成流程">
          <Sparkles className="w-3.5 h-3.5 text-accent" /> AI 生成
        </button>
        <button onClick={() => { setLearnMode(m => !m); setDraftMode(false); }} className="btn-ghost !px-2.5 text-xs" title="从论文 PDF 或 DOI 学习分析流程">
          <BookOpen className="w-3.5 h-3.5 text-accent" /> 文献学习
        </button>
        <button onClick={() => { setLearnNotice(null); setPaperReviewConfirmed(false); setEditor(emptyEditor()); }} className="btn-primary !px-2.5 text-xs" title="新建流程">
          <Plus className="w-3.5 h-3.5" /> 新建
        </button>
      </div>
      {/* 分类筛选：选项为当前库中实际出现的分类（7 个内置分类 + 自定义 + 其他） */}
      <div className="shrink-0 px-3 pt-1.5">
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          title="按分类筛选"
          className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-2 py-1.5 text-xs text-scholar-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent">
          <option value="all">全部分类</option>
          {presentCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {sessionId && (
        <div className="shrink-0 px-3 pt-1 flex items-center gap-1.5 text-[10px] text-scholar-500">
          <span className={`w-1.5 h-1.5 rounded-full ${realtimeConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {realtimeConnected ? '流程状态实时同步中' : '实时连接恢复中，状态将自动补齐'}
        </div>
      )}

      {/* AI 起草 */}
      {draftMode && (
        <div className="mx-3 mt-2 p-3 bg-accent/5 border border-accent/20 rounded-lg space-y-2 shrink-0">
          <p className="text-xs text-scholar-200 font-medium">描述你想要的分析流程，AI 帮你起草：</p>
          <textarea value={draftText} onChange={e => setDraftText(e.target.value)} rows={3}
            placeholder="例如：我想做 ChIP-seq 分析，从质控到 peak calling"
            className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" />
          <div className="flex gap-2">
            <button onClick={handleDraft} disabled={drafting || !draftText.trim() || !aiProfile.apiKey} className="btn-primary flex-1 !text-xs">
              {drafting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> 生成中...</> : <><Sparkles className="w-3.5 h-3.5" /> 生成草稿</>}
            </button>
            <button onClick={() => setDraftMode(false)} className="btn-ghost !text-xs">取消</button>
          </div>
          {!aiProfile.apiKey && <p className="text-[10px] text-scholar-400">需要先在 AI 设置里配置 API Key</p>}
        </div>
      )}

      {/* 文献与仓库双来源提取：Methods 主路径 + CoPaLink 风格工具对齐 + 确定性审计 */}
      {learnMode && (
        <div className="mx-3 mt-2 p-3 bg-accent/5 border border-accent/20 rounded-lg space-y-2 shrink-0">
          <p className="text-xs text-scholar-200 font-medium">从文献生成可审计流程：提取 Methods 主路径，对齐论文与仓库工具，再检查完整度</p>
          <div className="flex gap-1.5">
            <input value={learnDoi} onChange={e => setLearnDoi(e.target.value)}
              placeholder="DOI，如 10.1093/bioinformatics/xxx"
              className="flex-1 bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50" />
            <button onClick={handleLearnDoi} disabled={learning || !learnDoi.trim() || !aiProfile.apiKey}
              className="btn-primary !px-2.5 !text-xs">
              {learning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BookOpen className="w-3.5 h-3.5" />} 学习
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className={`btn-ghost !text-xs cursor-pointer ${learning ? 'opacity-50 pointer-events-none' : ''}`}>
              <FileText className="w-3.5 h-3.5" /> 上传 PDF
              <input type="file" accept=".pdf,application/pdf" className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) void handleLearnPdf(f);
                  e.target.value = '';
                }} />
            </label>
            {learnStatus && <span className="text-[10px] text-scholar-400">{learnStatus}</span>}
          </div>
          <p className="text-[10px] text-scholar-500">DOI 优先取 PMC 开放全文；非开放论文请上传 PDF（最多 50 页）。低可信步骤、未匹配工具和缺失参数会明确标出，必须人工确认后才能保存。</p>
          {!aiProfile.apiKey && <p className="text-[10px] text-scholar-400">需要先在 AI 设置里配置 API Key</p>}
        </div>
      )}

      {error && <p className="mx-3 mt-2 text-xs text-red-600 flex items-center gap-1 shrink-0"><AlertCircle className="w-3 h-3" />{error}</p>}

      {/* 运行监控：无法归属到任何流程的运行（正常应很少；各流程的任务在对应卡片内管理） */}
      {orphanRuns.length > 0 && (
        <div className="mx-3 mt-2 shrink-0 space-y-1.5">
          <p className="text-[11px] font-medium text-scholar-300 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-accent" /> 未归属流程的运行 ({orphanRuns.length})
          </p>
          {orphanRuns.slice(0, 5).map(run => (
            <RunCard
              key={run.runDir}
              run={run}
              expanded={expandedRunId === run.runDir}
              onToggle={() => setExpandedRunId(expandedRunId === run.runDir ? null : run.runDir)}
              sessionId={sessionId}
            />
          ))}
        </div>
      )}

      {/* 流程列表 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 mt-1">
        {loading && workflows.length === 0 ? (
          <div className="flex justify-center p-8 text-scholar-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : groupedWorkflows.length === 0 ? (
          <p className="text-center text-scholar-400 text-xs mt-8">{search || categoryFilter !== 'all' ? '无匹配流程' : '暂无流程，点击"新建"或"AI 生成"创建'}</p>
        ) : groupedWorkflows.map(group => (
          <div key={group.category} className="space-y-1.5">
            <p className="px-1 pt-1 text-[10px] font-medium text-scholar-500">{group.category}（{group.items.length}）</p>
            {group.items.map(w => {
          const preflight = preflights[w.id];
          const busy = !!preflightBusy[w.id];
          const flowRuns = runsByWorkflow.get(w.id) || [];
          const latestReport = flowRuns.find(r => r.reportPath)?.reportPath;
          return (
          <div key={w.id} className="bg-scholar-800/50 hover:bg-scholar-800 border border-scholar-700/50 rounded-lg transition-colors">
            <button onClick={() => setExpandedId(expandedId === w.id ? null : w.id)}
              className="w-full flex items-start gap-2 p-2.5 text-left">
              <GitBranch className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-scholar-100 truncate">{w.name}</span>
                  <span className="text-[9px] px-1 rounded bg-accent/10 text-accent shrink-0">
                    {w.provenance?.provider === 'bioskills'
                      ? `BioSkills v${w.provenance.importerVersion}${w.provenance.customized ? ' · 已自定义' : ''}`
                      : SOURCE_LABELS[w.source] || w.source}
                  </span>
                  <span className="text-[9px] text-scholar-500 shrink-0">{w.steps.length} 步</span>
                  {w.paperImport && (
                    <span className={`text-[9px] px-1 rounded shrink-0 ${w.paperImport.quality.score >= 75 ? 'bg-emerald-500/10 text-emerald-500' : w.paperImport.quality.score >= 45 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                      文献审计 {w.paperImport.quality.score}
                    </span>
                  )}
                  {preflight && (
                    preflight.ready
                      ? <span className="text-[9px] px-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0 flex items-center gap-0.5"><ShieldCheck className="w-2.5 h-2.5" />环境就绪</span>
                      : <span className="text-[9px] px-1 rounded bg-orange-500/10 text-orange-500 shrink-0 flex items-center gap-0.5"><ShieldAlert className="w-2.5 h-2.5" />有缺失</span>
                  )}
                </div>
                {w.description && <p className="text-[11px] text-scholar-400 truncate mt-0.5">{w.description}</p>}
                <div className="flex flex-wrap gap-1 mt-1">
                  {w.keywords.slice(0, 5).map(k => (
                    <span key={k} className="text-[9px] px-1.5 py-0.5 rounded-full bg-scholar-700/60 text-scholar-300">{k}</span>
                  ))}
                </div>
              </div>
              {expandedId === w.id ? <ChevronDown className="w-3.5 h-3.5 text-scholar-400 shrink-0 mt-1" /> : <ChevronRight className="w-3.5 h-3.5 text-scholar-400 shrink-0 mt-1" />}
            </button>

            {expandedId !== w.id && (
              <div className="px-2 pb-2 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUse(w)}
                  className="btn-ghost !text-[10px] !px-2"
                  title="打开运行配置"
                >
                  <Play className="w-3 h-3" /> 运行
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLearnNotice(null);
                    setPaperReviewConfirmed(Boolean(w.paperImport?.reviewedAt));
                    setEditor({
                      id: w.id, name: w.name, description: w.description,
                      keywords: w.keywords.join(', '), category: w.category, params: w.params, steps: w.steps,
                      manifest: w.manifest, paperImport: w.paperImport, source: w.source,
                    });
                  }}
                  className="btn-ghost !text-[10px] !px-2"
                  title="修改流程"
                >
                  <Pencil className="w-3 h-3" /> 修改
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(w)}
                  className="btn-ghost !text-[10px] !px-2 hover:!text-red-600"
                  title="删除流程定义（不会删除已有运行文件夹）"
                >
                  <Trash2 className="w-3 h-3" /> 删除
                </button>
              </div>
            )}

            {expandedId === w.id && (
              <div className="px-3 pb-2.5 pt-0.5 space-y-1 border-t border-scholar-700/50">
                <div className="mt-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <FolderGit2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="text-[10px] text-scholar-300 flex-1">专属目录 · 每次运行独立 RUN</span>
                    <span className="text-[9px] text-emerald-500">禁止全局扫描</span>
                  </div>
                  <code className="block mt-1 text-[9px] text-scholar-500 break-all">~/hpclaw_flows/{workflowSlug(w.name)}/</code>
                </div>
                <button onClick={() => handleUse(w)} className="btn-primary w-full !text-xs mt-1.5">
                  <Play className="w-3 h-3" /> 选择数据并运行
                </button>
                {/* 本流程的任务记录（环境 + 任务一体管理） */}
                {flowRuns.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <p className="text-[10px] font-medium text-scholar-400">任务记录（{flowRuns.length}）</p>
                    {flowRuns.slice(0, 3).map(run => (
                      <RunCard
                        key={run.runDir}
                        run={run}
                        expanded={expandedRunId === run.runDir}
                        onToggle={() => setExpandedRunId(expandedRunId === run.runDir ? null : run.runDir)}
                        sessionId={sessionId}
                      />
                    ))}
                    {flowRuns.length > 3 && (
                      <p className="text-[9px] text-scholar-500">还有 {flowRuns.length - 3} 次历史运行，打开运行面板查看全部</p>
                    )}
                  </div>
                )}
                <details className="mt-1.5 rounded-md border border-scholar-700/50 bg-scholar-950/30">
                  <summary className="px-2 py-1.5 text-[10px] text-scholar-400 cursor-pointer list-none flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" /> 查看资源和 {w.steps.length} 个详细步骤
                  </summary>
                  <div className="px-2 pb-2 border-t border-scholar-700/40">
                    <FlowSections
                      workflow={w}
                      preflight={preflight}
                      runs={flowRuns}
                      latestReport={latestReport}
                      sessionId={sessionId}
                    />
                    {w.steps.map((s, i) => (
                      <div key={i} className="mt-1.5">
                    <p className="text-[11px] text-scholar-200">{i + 1}. {s.title}{s.optional ? <span className="text-scholar-500">（可选）</span> : null}</p>
                    {s.agent?.sourceSection && (
                      <p className="text-[9px] text-scholar-500 mt-0.5">
                        来源：{s.agent.sourceSection}
                        {s.agent.skillRefs?.length ? ` · 技能：${s.agent.skillRefs.join('、')}` : ''}
                        {s.agent.confidence ? ` · ${s.agent.confidence === 'high' ? '高可信' : s.agent.confidence === 'medium' ? '中可信' : '低可信'}` : ''}
                        {s.agent.requiresReview ? ' · 运行前确认' : ''}
                      </p>
                    )}
                    {s.agent?.evidence && <p className="text-[9px] text-scholar-400 mt-0.5">依据：{s.agent.evidence}</p>}
                    <code className="block text-[10px] text-scholar-400 bg-scholar-950 rounded px-1.5 py-1 mt-0.5 break-all whitespace-pre-wrap max-h-32 overflow-y-auto">{s.command}</code>
                      </div>
                    ))}
                  </div>
                </details>
                <div className="flex gap-1.5 mt-2 pt-1">
                  <button onClick={() => void handlePreflight(w)} disabled={busy || !sessionId}
                    title={sessionId ? 'SSH 核查必要软件与参考数据' : '需要先连接计算资源'}
                    className="btn-ghost !text-xs">
                    {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />} 检查环境
                  </button>
                  {preflight && !preflight.ready && (
                    <button onClick={() => handleProvision(w, preflight)} title="让 AI 引导补齐缺失项"
                      className="btn-ghost !text-xs !text-orange-500"><Wrench className="w-3 h-3" /> 补齐</button>
                  )}
                  <button onClick={() => {
                    setLearnNotice(null);
                    setPaperReviewConfirmed(Boolean(w.paperImport?.reviewedAt));
                    setEditor({
                      id: w.id, name: w.name, description: w.description,
                      keywords: w.keywords.join(', '), category: w.category, params: w.params, steps: w.steps,
                      manifest: w.manifest, paperImport: w.paperImport, source: w.source,
                    });
                  }} className="btn-ghost !text-xs"><Pencil className="w-3 h-3" /> 编辑</button>
                  <button onClick={() => void handleDelete(w)} className="btn-ghost !text-xs hover:!text-red-600"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            )}
          </div>
          );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** 流程分类选择：7 个内置分类 + 自定义输入；未分类时保存归入“其他”组 */
function CategoryPicker({ value, onChange }: { value?: string; onChange: (category: string | undefined) => void }) {
  const isPreset = (WORKFLOW_CATEGORIES as readonly string[]).includes(value || '');
  const [customMode, setCustomMode] = useState(Boolean(value) && !isPreset);
  const showInput = customMode || (Boolean(value) && !isPreset);
  return (
    <div className="flex gap-1.5">
      <select
        value={showInput ? '__custom__' : (value || '')}
        onChange={e => {
          const next = e.target.value;
          if (next === '__custom__') {
            setCustomMode(true);
            onChange(undefined);
          } else {
            setCustomMode(false);
            onChange(next || undefined);
          }
        }}
        title="流程分类"
        className={`bg-scholar-950 border border-scholar-600 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent ${showInput ? 'w-32 shrink-0' : 'w-full'}`}
      >
        <option value="">未分类</option>
        {WORKFLOW_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        <option value="__custom__">自定义分类…</option>
      </select>
      {showInput && (
        <input value={value || ''} onChange={e => onChange(e.target.value.trim() || undefined)}
          placeholder="自定义分类名" className="flex-1 bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
      )}
    </div>
  );
}

/** 四板块状态区：必要软件 / 必要参考数据 / 工作区 / 质控与结果 */
function FlowSections({ workflow, preflight, runs, latestReport, sessionId }: {
  workflow: Workflow;
  preflight?: PreflightResult | null;
  runs: WorkflowRun[];
  latestReport?: string;
  sessionId?: string | null;
}) {
  const manifest = workflow.manifest;
  const swItems = preflight?.software ?? manifest?.software.map(s => ({ name: s.name, ok: false, required: s.required, detail: undefined })) ?? [];
  const refItems = preflight?.references ?? manifest?.references.map(r => ({ name: r.name, ok: false, required: r.required, detail: r.path })) ?? [];
  const hasChecks = preflight !== undefined && preflight !== null;
  const swOk = swItems.filter(i => i.ok).length;
  const refOk = refItems.filter(i => i.ok).length;
  const activeRun = runs.find(r => r.status === 'running' || r.status === 'waiting_user' || r.status === 'waiting_jobs' || r.status === 'blocked_env');
  const checkedAt = preflight ? new Date(preflight.checkedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="mt-1.5 mb-1 rounded-lg border border-scholar-700/60 bg-scholar-900/40 divide-y divide-scholar-700/40">
      {/* 板块1：必要软件 */}
      <div className="p-2">
        <p className="text-[10px] font-medium text-scholar-300 flex items-center gap-1">
          <Package className="w-3 h-3 text-accent" /> 必要软件
          {swItems.length > 0 && hasChecks && <span className="text-scholar-500">（{swOk}/{swItems.length} 就绪）</span>}
          {swItems.length === 0 && <span className="text-scholar-500">（无依赖）</span>}
        </p>
        {swItems.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {swItems.map(i => (
              <span key={i.name} title={i.detail || ''}
                className={`text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                  !hasChecks ? 'bg-scholar-700/60 text-scholar-300'
                  : i.ok ? 'bg-emerald-500/10 text-emerald-500'
                  : i.required ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-500'}`}>
                {hasChecks && (i.ok ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />)}
                {i.name}{!i.required ? '（可选）' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* 板块2：必要参考数据 */}
      <div className="p-2">
        <p className="text-[10px] font-medium text-scholar-300 flex items-center gap-1">
          <Database className="w-3 h-3 text-accent" /> 必要参考数据
          {refItems.length > 0 && hasChecks && <span className="text-scholar-500">（{refOk}/{refItems.length} 就绪）</span>}
          {refItems.length === 0 && <span className="text-scholar-500">（无依赖）</span>}
        </p>
        {refItems.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {refItems.map(i => (
              <span key={i.name} title={i.detail || ''}
                className={`text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                  !hasChecks ? 'bg-scholar-700/60 text-scholar-300'
                  : i.ok ? 'bg-emerald-500/10 text-emerald-500'
                  : i.required ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-500'}`}>
                {hasChecks && (i.ok ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />)}
                {i.name}{!i.required ? '（可选）' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* 板块3：工作区 */}
      <div className="p-2">
        <p className="text-[10px] font-medium text-scholar-300 flex items-center gap-1">
          <FolderGit2 className="w-3 h-3 text-accent" /> 工作区
          <span className="text-scholar-500">
            {runs.length === 0 ? '（尚未运行）' : `（${runs.length} 次运行${activeRun ? '，进行中' : ''}）`}
          </span>
        </p>
        {activeRun && (
          <p className="mt-0.5 text-[9px] text-sky-500">
            最近运行：{(RUN_STATUS[activeRun.status] || RUN_STATUS.unknown).label}
            {activeRun.currentStep && activeRun.totalSteps ? ` · 步骤 ${activeRun.currentStep}/${activeRun.totalSteps}` : ''}
          </p>
        )}
      </div>
      {/* 板块4：质控与最终运行文件 */}
      <div className="p-2">
        <p className="text-[10px] font-medium text-scholar-300 flex items-center gap-1">
          <FileText className="w-3 h-3 text-accent" /> 质控与结果
          {latestReport
            ? <a href={`/api/files/download?path=${encodeURIComponent(latestReport)}${sessionId ? `&sessionId=${encodeURIComponent(sessionId)}` : ''}`}
                download className="text-accent hover:underline">下载最近报告</a>
            : <span className="text-scholar-500">（暂无报告）</span>}
        </p>
      </div>
      {hasChecks && checkedAt && (
        <p className="px-2 py-1 text-[9px] text-scholar-500">
          预检时间 {checkedAt} · 调度器 {preflight!.scheduler}
          {preflight!.moduleSystem ? ` · Module ${preflight!.moduleSystem === 'ready' ? '可用' : preflight!.moduleSystem === 'unavailable' ? '未初始化' : '未知'}` : ''}
        </p>
      )}
      {!hasChecks && (
        <p className="px-2 py-1 text-[9px] text-scholar-500">尚未预检，点击"检查环境"核查软件与参考数据</p>
      )}
    </div>
  );
}

/** 单次流程运行卡片：状态、进度、可展开的步骤时间线 */
function RunCard({ run, expanded, onToggle, sessionId }: { run: WorkflowRun; expanded: boolean; onToggle: () => void; sessionId?: string | null }) {
  const st = run.stale
    ? { label: '疑似中断', cls: 'bg-gray-500/20 text-gray-400' }
    : RUN_STATUS[run.status] || RUN_STATUS.unknown;
  const total = run.totalSteps || run.steps?.length || 0;
  const current = run.currentStep ?? (run.steps?.filter(s => s.status === 'done').length ?? 0);
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const currentTitle = run.steps?.find(s => s.status === 'running')?.title;
  const started = run.startedAt ? new Date(run.startedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="bg-scholar-800/60 border border-scholar-700/60 rounded-lg">
      <button onClick={onToggle} className="w-full text-left p-2.5">
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown className="w-3.5 h-3.5 text-scholar-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-scholar-500 shrink-0" />}
          <span className="text-xs font-medium text-scholar-100 truncate flex-1">{run.workflowName || run.runId || run.runDir.split('/').pop()}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${st.cls}`}>{st.label}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-scholar-700/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${run.status === 'failed' ? 'bg-red-500' : run.status === 'blocked_env' ? 'bg-orange-500' : 'bg-accent'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] text-scholar-400 shrink-0">{current}/{total}</span>
        </div>
        {currentTitle && run.status === 'running' && (
          <p className="mt-1 text-[10px] text-sky-600 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> {currentTitle}
          </p>
        )}
        <div className="mt-0.5 flex items-center gap-2">
          {started && <p className="text-[10px] text-scholar-500">{started} · {run.runDir.replace(/^~\//, '')}</p>}
          {run.reportPath && (
            <a href={`/api/files/download?path=${encodeURIComponent(run.reportPath)}${sessionId ? `&sessionId=${encodeURIComponent(sessionId)}` : ''}`}
              download onClick={e => e.stopPropagation()}
              className="text-[10px] text-accent hover:underline flex items-center gap-0.5 shrink-0">
              <FileText className="w-3 h-3" /> 报告
            </a>
          )}
        </div>
      </button>
      {expanded && run.steps && run.steps.length > 0 && (
        <div className="px-3 pb-2.5 space-y-1 border-t border-scholar-700/50 pt-2">
          {run.steps.map(s => (
            <div key={s.n} className="text-[11px]">
              <div className="flex items-center gap-1.5">
                {s.status === 'done' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  : s.status === 'failed' ? <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  : s.status === 'running' ? <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin shrink-0" />
                  : <Circle className="w-3.5 h-3.5 text-scholar-600 shrink-0" />}
                <span className={`flex-1 min-w-0 truncate ${s.status === 'running' ? 'text-scholar-100 font-medium' : 'text-scholar-300'}`}>
                  {s.n}. {s.title}
                </span>
                {s.qc && (
                  <span className={`text-[9px] px-1 rounded shrink-0 ${(QC_BADGE[s.qc.status] || QC_BADGE.pass).cls}`}>
                    {(QC_BADGE[s.qc.status] || QC_BADGE.pass).label}
                  </span>
                )}
                {s.jobIds && s.jobIds.length > 0 && (
                  <span className="text-[9px] text-scholar-500 shrink-0">#{s.jobIds.join(' #')}</span>
                )}
              </div>
              {s.qc?.metrics && Object.keys(s.qc.metrics).length > 0 && (
                <p className="ml-5 text-[9px] text-scholar-500 leading-snug">
                  {Object.entries(s.qc.metrics).map(([k, v]) => `${k}: ${v}`).join('；')}
                </p>
              )}
              {s.summary && <p className="ml-5 text-[10px] text-scholar-400 leading-snug">{s.summary}</p>}
              {s.outputs && s.outputs.length > 0 && (
                <div className="ml-5 mt-0.5 space-y-0.5">
                  {s.outputs.slice(0, 6).map(o => (
                    <code key={o} className="block text-[9px] text-accent/80 bg-scholar-900/60 px-1 py-0.5 rounded truncate" title={o}>{o}</code>
                  ))}
                  {s.outputs.length > 6 && <p className="text-[9px] text-scholar-500">…共 {s.outputs.length} 个产出</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {expanded && run.error && <p className="px-3 pb-2 text-[10px] text-red-500">{run.error}</p>}
    </div>
  );
}
