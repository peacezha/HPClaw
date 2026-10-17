// 启动前整体检查问题卡：把 preflight-run 一次扫描到的全部问题集中展示——
// 参数/路径类问题内联输入（直接写回运行配置），软件类给"让 AI 补齐"入口（走现有 provision 通道），
// 底部"全部解决后重新检查"通过后自动继续建运行；仅剩警告时可"仍然开始运行"（有 blocker 时禁用）。
import {
  AlertTriangle, CheckCircle2, Database, FileQuestion, FolderOpen, Loader2,
  Package, RefreshCw, ShieldCheck, SlidersHorizontal, Wrench,
} from 'lucide-react';
import type { Workflow } from '@/shared/workflow';
import type { PreflightRunIssue, PreflightRunReport } from '@/shared/flowManifest';
import type { PickPathKind } from '@/shared/fileTransfer';
import { useWorkflowText } from '../i18n';

export interface WorkflowPreflightCardProps {
  workflow: Workflow;
  report: PreflightRunReport;
  /** 当前编辑中的运行配置（内联解答直接写回） */
  paramValues: Record<string, string>;
  stepValues: Record<number, Record<string, string>>;
  refOverrides: Record<string, string>;
  inputs: string[];
  onParamChange: (name: string, value: string) => void;
  onStepParamChange: (step: number, name: string, value: string) => void;
  onReferenceChange: (name: string, path: string) => void;
  onInputChange: (index: number, path: string) => void;
  /** 缺失软件/参考数据交给 AI 补齐（复用流程面板的 provision 消息通道） */
  onProvision: (kind: 'software' | 'references', name: string, detail?: string) => void;
  /** 集群文件树选路径（可选；提供时路径类问题带选取按钮） */
  onPickPath?: (kind?: PickPathKind) => Promise<string | null>;
  /** 用当前编辑后的配置重新整体检查 */
  onRecheck: () => void;
  /** 明确接受剩余警告，仍然开始运行 */
  onRunAnyway: () => void;
  onCancel: () => void;
  /** 重检或建运行进行中 */
  busy: boolean;
}

const KIND_ICON: Record<PreflightRunIssue['kind'], typeof Package> = {
  software: Package,
  reference: Database,
  param: SlidersHorizontal,
  input: FolderOpen,
  placeholder: FileQuestion,
};

const KIND_LABEL: Record<PreflightRunIssue['kind'], string> = {
  software: '软件',
  reference: '参考数据',
  param: '参数',
  input: '输入数据',
  placeholder: '占位符',
};

function issueKey(issue: PreflightRunIssue): string {
  return `${issue.kind}:${issue.step ?? ''}:${issue.name}`;
}

/** 占位符问题的可编辑落点：优先全局参数，其次该步骤的步骤参数 */
function placeholderTarget(
  workflow: Workflow,
  issue: PreflightRunIssue,
): { scope: 'global' | 'step'; name: string } | null {
  for (const name of issue.name.split(',').map(s => s.trim()).filter(Boolean)) {
    if (workflow.params.some(p => p.name === name)) return { scope: 'global', name };
    if (issue.step && workflow.steps[issue.step - 1]?.params?.some(p => p.name === name)) {
      return { scope: 'step', name };
    }
  }
  return null;
}

export default function WorkflowPreflightCard({
  workflow, report,
  paramValues, stepValues, refOverrides, inputs,
  onParamChange, onStepParamChange, onReferenceChange, onInputChange,
  onProvision, onPickPath, onRecheck, onRunAnyway, onCancel, busy,
}: WorkflowPreflightCardProps) {
  const text = useWorkflowText();
  const blockers = report.issues.filter(issue => issue.severity === 'blocker');
  const warns = report.issues.filter(issue => issue.severity === 'warn');
  const hasBlockers = blockers.length > 0;

  const pickInto = async (apply: (path: string) => void) => {
    if (!onPickPath) return;
    const picked = await onPickPath('any');
    if (picked) apply(picked);
  };

  const renderEditor = (issue: PreflightRunIssue) => {
    if (issue.kind === 'param') {
      const value = issue.step
        ? (stepValues[issue.step]?.[issue.name] ?? '')
        : (paramValues[issue.name] ?? '');
      return (
        <input
          value={value}
          onChange={e => (issue.step ? onStepParamChange(issue.step, issue.name, e.target.value) : onParamChange(issue.name, e.target.value))}
          placeholder={issue.name}
          aria-label={`${KIND_LABEL.param}:${issue.label}`}
          className="mt-1 w-full bg-scholar-950 border border-scholar-600 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-accent/50"
        />
      );
    }
    if (issue.kind === 'reference') {
      return (
        <div className="mt-1 flex gap-1">
          <input
            value={refOverrides[issue.name] ?? ''}
            onChange={e => onReferenceChange(issue.name, e.target.value)}
            placeholder={text('输入集群上的实际路径')}
            aria-label={`${KIND_LABEL.reference}:${issue.label}`}
            className="flex-1 bg-scholar-950 border border-scholar-600 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
          {onPickPath && (
            <button type="button" onClick={() => void pickInto(path => onReferenceChange(issue.name, path))}
              className="btn-ghost !text-[11px] !px-2 shrink-0" title={text('选择文件或目录')} aria-label={text('选择文件或目录')}>
              <FolderOpen className="w-3 h-3" />
            </button>
          )}
        </div>
      );
    }
    if (issue.kind === 'input') {
      const index = inputs.findIndex(p => p === issue.name);
      if (index < 0) return null;
      return (
        <div className="mt-1 flex gap-1">
          <input
            value={inputs[index]}
            onChange={e => onInputChange(index, e.target.value)}
            placeholder={text('输入集群上的实际路径')}
            aria-label={`${KIND_LABEL.input}:${index + 1}`}
            className="flex-1 bg-scholar-950 border border-scholar-600 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
          {onPickPath && (
            <button type="button" onClick={() => void pickInto(path => onInputChange(index, path))}
              className="btn-ghost !text-[11px] !px-2 shrink-0" title={text('选择文件或目录')} aria-label={text('选择文件或目录')}>
              <FolderOpen className="w-3 h-3" />
            </button>
          )}
        </div>
      );
    }
    if (issue.kind === 'placeholder') {
      const target = placeholderTarget(workflow, issue);
      if (!target) {
        return <p className="mt-0.5 text-[10px] text-scholar-500">{text('可由 AI 运行时处理；仍要现在指定时请回到参数区填写。')}</p>;
      }
      const value = target.scope === 'global'
        ? (paramValues[target.name] ?? '')
        : (stepValues[issue.step!]?.[target.name] ?? '');
      return (
        <input
          value={value}
          onChange={e => (target.scope === 'global' ? onParamChange(target.name, e.target.value) : onStepParamChange(issue.step!, target.name, e.target.value))}
          placeholder={target.name}
          aria-label={`${KIND_LABEL.placeholder}:${target.name}`}
          className="mt-1 w-full bg-scholar-950 border border-scholar-600 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-accent/50"
        />
      );
    }
    return null;
  };

  const renderIssue = (issue: PreflightRunIssue) => {
    const Icon = KIND_ICON[issue.kind];
    const provisionKind = issue.kind === 'software' ? 'software' : issue.kind === 'reference' ? 'references' : null;
    return (
      <div key={issueKey(issue)} className="px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3 text-scholar-400 shrink-0" />
          <span className="text-[9px] px-1 rounded bg-scholar-700/50 text-scholar-400 shrink-0">{text(KIND_LABEL[issue.kind])}</span>
          {issue.step !== undefined && (
            <span className="text-[9px] px-1 rounded bg-scholar-700/50 text-scholar-400 shrink-0">{`${text('步骤')} ${issue.step}`}</span>
          )}
          <span className="text-[11px] text-scholar-200 font-medium truncate">{text(issue.label)}</span>
          {provisionKind && (
            <button type="button" onClick={() => onProvision(provisionKind, issue.name, issue.message)}
              className="ml-auto text-[10px] text-orange-400 hover:underline shrink-0 flex items-center gap-0.5">
              <Wrench className="w-2.5 h-2.5" /> {text('让 AI 补齐')}
            </button>
          )}
        </div>
        <p className="mt-0.5 text-[10px] text-scholar-400 break-all">{text(issue.message)}</p>
        {renderEditor(issue)}
      </div>
    );
  };

  return (
    <section className="rounded-lg border border-accent/30 bg-scholar-800/60">
      <header className="px-3 py-2 flex items-center gap-2 border-b border-scholar-700/40">
        <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
        <span className="text-xs font-medium text-scholar-100 flex-1">{text('启动前整体检查')}</span>
        <span className="text-[10px] text-scholar-500">
          {blockers.length > 0 && <span className="text-red-400">{blockers.length} {text('必须解决')}</span>}
          {blockers.length > 0 && warns.length > 0 && ' · '}
          {warns.length > 0 && <span className="text-amber-500">{warns.length} {text('建议处理')}</span>}
        </span>
      </header>

      <div className="p-2 space-y-2">
        {hasBlockers && (
          <div className="rounded-md border border-red-500/30 bg-red-500/5 divide-y divide-red-500/10">
            <p className="px-2 py-1 text-[10px] font-medium text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {text('必须解决')}
            </p>
            {blockers.map(renderIssue)}
          </div>
        )}
        {warns.length > 0 && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 divide-y divide-amber-500/10">
            <p className="px-2 py-1 text-[10px] font-medium text-amber-500 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {text('建议处理')}
            </p>
            {warns.map(renderIssue)}
          </div>
        )}
        {report.issues.length === 0 && (
          <p className="px-1 py-1 text-[11px] text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {text('全部就绪')}
          </p>
        )}
      </div>

      <div className="px-3 pb-3 flex items-center gap-2 flex-wrap">
        <button type="button" onClick={onRecheck} disabled={busy}
          className="btn-primary !text-[11px] !px-3">
          {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {text('全部解决后重新检查')}
        </button>
        <button type="button" onClick={onRunAnyway} disabled={busy || hasBlockers}
          title={hasBlockers ? text('必须先解决所有标红问题') : text('明确接受以上警告后继续')}
          className="btn-ghost !text-[11px] !px-3 disabled:opacity-40">
          {text('仍然开始运行')}
        </button>
        <button type="button" onClick={onCancel} disabled={busy}
          className="btn-ghost !text-[11px] !px-3">
          {text('取消')}
        </button>
      </div>
    </section>
  );
}
