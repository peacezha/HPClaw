// 对话内流程配置卡：AI 输出 [TRACE_WORKFLOW_CONFIGURE] 标记（或流程匹配 chips 主动插入）时，
// 在对话里渲染成表单卡片，用户点选参数与输入目录后直接创建正式运行并交给 AI 执行。
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ExternalLink, FolderOpen, GitBranch, Loader2, Play, Plus, Trash2,
} from 'lucide-react';
import type { Workflow } from '@/shared/workflow';
import type { PreflightResult, PreflightRunReport } from '@/shared/flowManifest';
import { isPendingDisposal } from '@/shared/workflowCatalog';
import type { PickPathKind } from '@/shared/fileTransfer';
import { createWorkflowRun, listWorkflows, runPreflightForConfig, type WorkflowRunConfigInput } from '../features/workflows/api';
import { composeRunMessage, type PreRunCheckSummary } from '../features/workflows/compose';
import WorkflowPreflightCard from './WorkflowPreflightCard';
import {
  defaultParamValues,
  defaultStepValues,
  isWorkflowParamRequired,
  ParamField,
  validateParamValue,
} from './FlowRunnerDrawer';

interface WorkflowConfigCardProps {
  workflowId: string;
  /** 集群会话；无集群（本地工作台）时为 null，"确认运行"禁用并提示 */
  sessionId?: string | null;
  /** 打开集群文件树/传输工作区选择集群文件或目录，取消时 resolve null */
  onPickRemoteFolder?: (kind?: PickPathKind) => Promise<string | null>;
  /** 把组装好的执行协议作为用户消息发出并触发 AI（等价流程主页"运行流程"）；
   *  options.dedicatedConversation=true 时由 App 开该次运行专属的对话执行，不串进当前聊天 */
  onSendMessage: (text: string, options?: { dedicatedConversation?: boolean }) => void;
  /** 在流程运行面板打开该流程（步骤级高级配置） */
  onOpenRunner?: (workflow: Workflow) => void;
}

export default function WorkflowConfigCard({ workflowId, sessionId, onPickRemoteFolder, onSendMessage, onOpenRunner }: WorkflowConfigCardProps) {
  // undefined=加载中，null=未找到
  const [workflow, setWorkflow] = useState<Workflow | null | undefined>(undefined);
  const [inputs, setInputs] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [stepValues, setStepValues] = useState<Record<number, Record<string, string>>>({});
  // 用户为参考数据改指的实际路径（按参考数据名），启动前整体检查解答时写回
  const [refOverrides, setRefOverrides] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [starting, setStarting] = useState(false);
  const [started, setStarted] = useState(false);
  // 启动前整体检查：非 null 时在卡片内展示集中问题清单
  const [preRunReport, setPreRunReport] = useState<PreflightRunReport | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let stopped = false;
    listWorkflows()
      .then(all => {
        if (stopped) return;
        const found = all.find(item => item.id === workflowId) || null;
        setWorkflow(found);
        if (found) {
          setParamValues(defaultParamValues(found));
          setStepValues(defaultStepValues(found));
        }
      })
      .catch(() => { if (!stopped) setWorkflow(null); });
    return () => { stopped = true; };
  }, [workflowId]);

  const manifest = workflow?.manifest;
  const needInputs = !!workflow && (!!manifest?.inputHint || workflow.params.some(p => /INPUT|DATA|FASTQ| SAMPLE/i.test(p.name)));
  const missingParams = useMemo(
    () => (workflow?.params || []).filter(p => isWorkflowParamRequired(p) && !(paramValues[p.name] ?? '').trim()).map(p => p.label || p.name),
    [workflow, paramValues],
  );
  // 步骤级必填参数无默认值时，卡片无法完整配置，引导去流程页
  const hasAdvancedRequired = !!workflow?.steps.some(step =>
    (step.params || []).some(p => isWorkflowParamRequired(p) && !p.defaultValue));

  const addInput = useCallback((p: string) => {
    const v = p.trim();
    if (v) setInputs(list => (list.includes(v) ? list : [...list, v]));
  }, []);

  const pickFolder = useCallback(async () => {
    if (!onPickRemoteFolder) return;
    const picked = await onPickRemoteFolder('any');
    if (picked) addInput(picked);
  }, [onPickRemoteFolder, addInput]);

  const pickPathForParam = useCallback(async (paramName: string, kind: 'file' | 'folder') => {
    if (!onPickRemoteFolder) return;
    const picked = await onPickRemoteFolder(kind);
    if (picked) setParamValues(v => ({ ...v, [paramName]: picked }));
  }, [onPickRemoteFolder]);

  const buildConfig = useCallback((): WorkflowRunConfigInput => ({
    inputs,
    params: paramValues,
    stepParams: stepValues,
    referenceOverrides: refOverrides,
    skippedSteps: [],
    stepCommandOverrides: {},
  }), [inputs, paramValues, stepValues, refOverrides]);

  // 正式创建运行并提交执行协议；preflightResult/preRunCheck 来自启动前整体检查，不再硬编码 null
  const start = useCallback(async (preflightResult: PreflightResult | null, preRunCheck: PreRunCheckSummary) => {
    if (!workflow || !sessionId) return;
    setFormError('');
    setStarting(true);
    try {
      const run = await createWorkflowRun(workflow.id, buildConfig(), sessionId);
      onSendMessage(composeRunMessage(workflow, {
        preflight: preflightResult,
        preRunCheck,
        inputs,
        paramValues,
        stepValues,
        referenceOverrides: refOverrides,
        run: { runId: run.runId || run.runDir.split('/').pop() || 'run', runDir: run.runDir },
      }), { dedicatedConversation: true });
      setStarted(true);
      setPreRunReport(null);
    } catch (e: any) {
      setFormError(e?.message || '创建流程运行失败');
    } finally {
      setStarting(false);
    }
  }, [workflow, sessionId, buildConfig, inputs, paramValues, stepValues, refOverrides, onSendMessage]);

  // 启动前整体检查：无问题直接建运行；有问题在卡片内展示集中清单，解答后重检，通过才继续
  const checkBeforeRun = useCallback(async () => {
    if (!workflow || !sessionId) return;
    setFormError('');
    setChecking(true);
    try {
      const report = await runPreflightForConfig(workflow.id, buildConfig(), sessionId);
      if (report.issues.length === 0) {
        await start(report.preflight, { passed: true });
      } else {
        setPreRunReport(report);
      }
    } catch (e: any) {
      setFormError(`启动前整体检查失败：${e?.message || String(e)}`);
    } finally {
      setChecking(false);
    }
  }, [workflow, sessionId, buildConfig, start]);

  // 用户明确接受剩余警告，仍然开始运行（有 blocker 时卡片内禁用该按钮）
  const handleRunAnyway = useCallback(async () => {
    if (!preRunReport) return;
    const acceptedWarnings = preRunReport.issues
      .filter(issue => issue.severity === 'warn')
      .map(issue => `${issue.label || issue.name}：${issue.message}`);
    await start(preRunReport.preflight, { passed: false, acceptedWarnings });
  }, [preRunReport, start]);

  // 缺失软件/参考数据交给 AI 补齐（留在当前对话，与流程面板的 provision 消息一致）
  const handleProvision = useCallback((kind: 'software' | 'references', name: string, detail?: string) => {
    if (!workflow) return;
    const kindLabel = kind === 'software' ? '软件' : '参考数据';
    onSendMessage([
      `流程「${workflow.name}」（ID: ${workflow.id}）的${kindLabel}「${name}」未就绪${detail ? `（${detail}）` : ''}。`,
      '请直接修复，不用先报方案等我确认：优先 module load 或安装到流程家目录 02_reference/（或你判断的合适位置），下载和安装只能在登录节点进行（计算节点无网络）。',
      '修复后用一条精确命令验证该项，然后重新核查并继续流程；只有确实需要我抉择时才 ask_user。',
    ].join('\n'));
  }, [workflow, onSendMessage]);

  const handleConfirm = useCallback(async () => {
    if (workflow && isPendingDisposal(workflow)) { setFormError('此流程在待弃置中，不能发起新运行。请在流程管理中恢复；已有任务不受影响。'); return; }
    if (!workflow || !sessionId || started) return;
    if (needInputs && inputs.length === 0) {
      setFormError('请先选择要处理的数据目录');
      return;
    }
    if (missingParams.length > 0) {
      setFormError(`还有参数未填写：${missingParams.join('、')}`);
      return;
    }
    const validationErrors: string[] = [];
    workflow.params.forEach(p => {
      const error = validateParamValue(p, paramValues[p.name] ?? '');
      if (error) validationErrors.push(error);
    });
    if (validationErrors.length > 0) {
      setFormError(validationErrors.slice(0, 3).join('；'));
      return;
    }
    // 前端校验过后，先做启动前整体检查（软件/参考数据/输入/参数/脚本占位符）
    await checkBeforeRun();
  }, [workflow, sessionId, started, needInputs, inputs, missingParams, paramValues, checkBeforeRun]);

  if (workflow === undefined) {
    return (
      <div className="rounded-lg border border-scholar-700/60 bg-scholar-800/40 p-3 flex items-center gap-2 text-[11px] text-scholar-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" /> 正在读取流程定义…
      </div>
    );
  }
  if (workflow === null) {
    return (
      <div className="rounded-lg border border-scholar-700/60 bg-scholar-800/40 p-3 text-[11px] text-scholar-400 flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> 流程（{workflowId}）已不存在，可能已被删除。
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-accent/25 bg-scholar-800/40 overflow-hidden">
      <header className="px-3 py-2 flex items-center gap-2 border-b border-scholar-700/40">
        <GitBranch className="w-3.5 h-3.5 text-accent shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-scholar-100 truncate">
            <span>流程配置</span> · <span>{workflow.name}</span>
            <span className="ml-1.5 text-[10px] font-normal text-scholar-500">{workflow.steps.length} 个步骤</span>
          </p>
          {workflow.description && <p className="text-[10px] text-scholar-400 truncate">{workflow.description}</p>}
        </div>
        {onOpenRunner && (
          <button type="button" onClick={() => onOpenRunner(workflow)}
            className="btn-ghost !text-[10px] !px-2 shrink-0" title="在流程页打开完整配置与监控">
            <ExternalLink className="w-3 h-3" /> 在流程页打开
          </button>
        )}
      </header>

      <div className="p-3 space-y-2.5">
        {/* 启动前整体检查的集中问题清单：解答写回配置，重检通过后自动继续 */}
        {preRunReport ? (
          <WorkflowPreflightCard
            workflow={workflow}
            report={preRunReport}
            paramValues={paramValues}
            stepValues={stepValues}
            refOverrides={refOverrides}
            inputs={inputs}
            onParamChange={(name, value) => setParamValues(prev => ({ ...prev, [name]: value }))}
            onStepParamChange={(step, name, value) => setStepValues(prev => ({ ...prev, [step]: { ...(prev[step] || {}), [name]: value } }))}
            onReferenceChange={(name, path) => setRefOverrides(prev => ({ ...prev, [name]: path }))}
            onInputChange={(index, value) => setInputs(list => list.map((p, i) => (i === index ? value : p)))}
            onProvision={handleProvision}
            onPickPath={onPickRemoteFolder}
            onRecheck={() => void checkBeforeRun()}
            onRunAnyway={() => void handleRunAnyway()}
            onCancel={() => setPreRunReport(null)}
            busy={checking || starting}
          />
        ) : (<>
        {/* 数据选择（纯参数流程不显示） */}
        {needInputs && (
          <section>
            <p className="text-[10px] text-scholar-400 mb-1 flex items-center gap-1">
              <FolderOpen className="w-3 h-3 text-accent" /> 数据选择
              <span className="text-scholar-500">{manifest?.inputHint || '选择计算资源上要处理的数据目录'}</span>
            </p>
            <div className="space-y-1.5">
              {inputs.map(p => (
                <div key={p} className="flex items-center gap-1.5 bg-scholar-950/60 rounded px-2 py-1">
                  <FolderOpen className="w-3 h-3 text-scholar-500 shrink-0" />
                  <code className="flex-1 text-[11px] text-scholar-200 truncate" title={p}>{p}</code>
                  <button type="button" onClick={() => setInputs(list => list.filter(x => x !== p))}
                    className="text-scholar-500 hover:text-red-500 shrink-0" aria-label="移除"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <div className="flex gap-1.5">
                <button type="button" onClick={() => void pickFolder()} disabled={!onPickRemoteFolder || !sessionId}
                  className="btn-ghost !text-[11px] !px-2.5" title={onPickRemoteFolder ? '打开计算资源文件树选择文件或目录' : '需要先连接计算资源'}>
                  <FolderOpen className="w-3 h-3" /> 选择文件或目录
                </button>
                <input value={manualInput} onChange={e => setManualInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { addInput(manualInput); setManualInput(''); } }}
                  placeholder="或手动输入计算资源路径后回车"
                  className="flex-1 bg-scholar-950 border border-scholar-600 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-accent/50" />
                {manualInput.trim() && (
                  <button type="button" onClick={() => { addInput(manualInput); setManualInput(''); }} className="btn-ghost !text-[11px] !px-2">
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 全局参数 */}
        {workflow.params.length > 0 && (
          <section>
            <p className="text-[10px] text-scholar-400 mb-1">参数配置（{workflow.params.length} 个）</p>
            <div className="grid grid-cols-2 gap-2">
              {workflow.params.map(p => (
                <ParamField key={p.name} param={p}
                  value={paramValues[p.name] ?? ''}
                  onChange={v => setParamValues(prev => ({ ...prev, [p.name]: v }))}
                  onPickPath={p.type === 'path' && onPickRemoteFolder && sessionId ? kind => void pickPathForParam(p.name, kind) : undefined}
                  required={isWorkflowParamRequired(p)}
                />
              ))}
            </div>
          </section>
        )}

        {hasAdvancedRequired && (
          <p className="text-[10px] text-amber-500 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            本流程还有步骤级必填参数，建议在流程页完成完整配置后再运行。
          </p>
        )}
        {formError && <p className="text-[11px] text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{formError}</p>}
        {!sessionId && (
          <p className="text-[11px] text-amber-500 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> 当前未连接计算资源，连接后即可从卡片直接运行。
          </p>
        )}

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void handleConfirm()} disabled={!sessionId || starting || checking || started || isPendingDisposal(workflow)}
            className="btn-primary flex-1 !py-2 text-xs">
            {starting || checking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            {started ? '已发起运行' : starting ? '正在创建正式运行…' : checking ? '正在整体检查…' : '确认运行'}
          </button>
        </div>
        {started && (
          <p className="text-[10px] text-emerald-500">已创建正式运行，执行进度见下方流程运行卡。</p>
        )}
        </>)}
      </div>
    </div>
  );
}
