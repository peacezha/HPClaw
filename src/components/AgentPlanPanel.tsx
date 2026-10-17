import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Circle, Clock, Loader2, Minus, X } from 'lucide-react';

export interface AgentPlanPanelStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'waiting' | 'done' | 'failed' | 'skipped';
  summary?: string;
}
export interface AgentPlanPanelPlan {
  goal: string;
  steps: AgentPlanPanelStep[];
  status?: 'active' | 'cancelled';
}

const STEP_STATUS_LABEL: Record<AgentPlanPanelStep['status'], { zh: string; en: string }> = {
  pending: { zh: '待办', en: 'pending' },
  running: { zh: '进行中', en: 'running' },
  waiting: { zh: '等待', en: 'waiting' },
  done: { zh: '完成', en: 'done' },
  failed: { zh: '失败', en: 'failed' },
  skipped: { zh: '跳过', en: 'skipped' },
};

function StepStatusIcon({ status }: { status: AgentPlanPanelStep['status'] }) {
  const className = 'h-3.5 w-3.5 shrink-0';
  switch (status) {
    case 'running': return <Loader2 className={`${className} animate-spin text-accent`} />;
    case 'done': return <Check className={`${className} text-emerald-500`} />;
    case 'failed': return <X className={`${className} text-red-500`} />;
    case 'waiting': return <Clock className={`${className} text-amber-400`} />;
    case 'skipped': return <Minus className={`${className} text-scholar-500`} />;
    default: return <Circle className={`${className} text-scholar-500`} />;
  }
}

/**
 * 对话区顶部的可折叠任务清单：数据来自 set_plan/update_plan_step 事件维护的
 * 权威计划（AIChat 的 agentPlan），无计划时整条隐藏。
 */
export default function AgentPlanPanel({ plan, english }: { plan: AgentPlanPanelPlan | null; english: boolean }) {
  const [open, setOpen] = useState(false);
  if (!plan || !Array.isArray(plan.steps) || plan.steps.length === 0) return null;
  const finished = plan.steps.filter(step => step.status === 'done' || step.status === 'skipped').length;
  const total = plan.steps.length;
  const cancelled = plan.status === 'cancelled';
  const current = plan.steps.find(step => step.status === 'running')
    || plan.steps.find(step => step.status === 'waiting' || step.status === 'failed')
    || plan.steps.find(step => step.status === 'pending');
  const summary = cancelled
    ? (english ? 'Plan cancelled' : '计划已取消')
    : current && current.status !== 'done'
      ? `${english ? 'Current' : '当前'}: ${current.title}`
      : (english ? 'All steps finished' : '全部步骤已完成');
  return (
    <div data-testid="agent-plan-panel" className="mx-3 mt-2 shrink-0 rounded-lg border border-scholar-700 bg-scholar-900/95 text-xs">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-scholar-300 hover:text-scholar-100 transition-colors"
      >
        <span className={`font-medium ${cancelled ? 'text-scholar-500' : 'text-accent'}`}>{english ? 'Task list' : '任务清单'}</span>
        <span className="text-scholar-400">{english ? `Step ${finished}/${total}` : `步骤 ${finished}/${total}`}</span>
        <span className={`min-w-0 flex-1 truncate ${cancelled ? 'text-scholar-500 line-through' : 'text-scholar-300'}`}>{summary}</span>
        {open ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-scholar-500" /> : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-scholar-500" />}
      </button>
      {open && (
        <ol className="space-y-1.5 border-t border-scholar-700/70 px-3 py-2">
          {plan.steps.map(step => (
            <li key={step.id} className="flex items-start gap-2" data-step-status={step.status}>
              <span className="mt-0.5"><StepStatusIcon status={step.status} /></span>
              <span className={`min-w-0 flex-1 break-words ${step.status === 'done' || step.status === 'skipped' ? 'text-scholar-500' : step.status === 'running' ? 'text-scholar-100' : step.status === 'failed' ? 'text-red-400' : 'text-scholar-300'}`}>
                {step.id}. {step.title}
                {step.summary && <span className="block text-[10px] text-scholar-500">{step.summary}</span>}
              </span>
              <span className="shrink-0 text-[10px] text-scholar-500">{STEP_STATUS_LABEL[step.status]?.[english ? 'en' : 'zh'] || step.status}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
