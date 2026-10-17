import { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { PendingPlanReview, PlanReviewAction, PlanReviewStepInput } from '../services/usePlanReviews';

/**
 * 计划审批卡（内嵌在对话区，不抢焦点）：逐条列出步骤，标题与验证方法可直接编辑。
 * 「批准」无修改时原样通过；有修改则以 edit 送达，服务端按改过的步骤继续。
 * 「取消」取消本轮，计划标记 cancelled，不执行任何操作。
 */
export default function PlanReviewCard({ review, english, busy, error, onDecide }: {
  review: PendingPlanReview;
  english: boolean;
  busy: boolean;
  error: string;
  onDecide: (id: string, action: PlanReviewAction, steps?: PlanReviewStepInput[]) => Promise<void>;
}) {
  const [draft, setDraft] = useState<PlanReviewStepInput[]>(review.steps);
  useEffect(() => { setDraft(review.steps); }, [review.id, review.steps]);
  const edited = draft.some((step, index) =>
    step.title !== review.steps[index]?.title || step.verification !== review.steps[index]?.verification);
  const valid = draft.every(step => step.title.trim() && step.verification.trim());
  const updateStep = (index: number, patch: Partial<PlanReviewStepInput>) => {
    setDraft(current => current.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  };
  const approve = () => {
    if (!valid) return;
    if (edited) void onDecide(review.id, 'edit', draft.map(step => ({ title: step.title.trim(), verification: step.verification.trim() })));
    else void onDecide(review.id, 'approve');
  };
  return (
    <div role="dialog" aria-label={english ? 'Plan approval' : '计划审批'} data-testid="plan-review-card"
      className="mx-3 mb-2 p-3 bg-accent/5 border border-accent/30 rounded-lg shrink-0 overflow-hidden">
      <div className="flex items-start gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-sm text-accent font-medium">{english ? 'Plan approval' : '计划审批'}</p>
          <p className="text-xs text-scholar-300 mt-1">{english
            ? 'Review the plan before the agent starts. You may edit step text; the plan runs only after approval.'
            : 'Agent 已制定计划，批准后才动手。可直接修改步骤文本；批准后按最终步骤执行。'}</p>
          <p data-user-content="true" className="text-xs text-scholar-100 mt-1.5 font-medium break-words">{english ? 'Goal: ' : '目标：'}{review.goal}</p>
        </div>
      </div>
      <ol className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {draft.map((step, index) => (
          <li key={index} className="rounded-md border border-scholar-700 bg-scholar-950 p-2">
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[10px] text-scholar-500">{index + 1}.</span>
              <input
                value={step.title}
                disabled={busy}
                onChange={event => updateStep(index, { title: event.target.value })}
                aria-label={english ? `Step ${index + 1} title` : `步骤 ${index + 1} 标题`}
                className="flex-1 min-w-0 bg-transparent border-0 border-b border-transparent text-xs text-scholar-100 focus:outline-none focus:border-accent/60"
              />
            </div>
            <input
              value={step.verification}
              disabled={busy}
              onChange={event => updateStep(index, { verification: event.target.value })}
              aria-label={english ? `Step ${index + 1} verification` : `步骤 ${index + 1} 验证方法`}
              className="mt-1 w-full bg-transparent border-0 border-b border-transparent text-[11px] text-scholar-400 focus:outline-none focus:border-accent/60"
            />
          </li>
        ))}
      </ol>
      {!valid && <p role="alert" className="mt-2 text-[11px] text-amber-400">{english ? 'Every step needs a title and a verification method.' : '每个步骤都需要标题和验证方法。'}</p>}
      {error && <p role="alert" className="mt-2 text-xs text-red-400">{error}</p>}
      <div className="flex gap-2 justify-end mt-3">
        <button disabled={busy} onClick={() => void onDecide(review.id, 'cancel')}
          className="px-3 py-1.5 text-xs bg-[rgb(var(--danger-rgb)/0.15)] text-[var(--color-danger)] border border-[rgb(var(--danger-rgb)/0.3)] rounded-lg hover:bg-[rgb(var(--danger-rgb)/0.25)] transition-colors">
          {english ? 'Cancel plan' : '取消计划'}
        </button>
        <button disabled={busy || !valid} onClick={approve}
          className="px-3 py-1.5 text-xs bg-accent/15 text-accent border border-accent/30 rounded-lg hover:bg-accent/25 font-medium transition-colors disabled:opacity-40 flex items-center gap-1.5">
          {busy && <Loader2 className="h-3 w-3 animate-spin" />}
          {busy
            ? (english ? 'Sending…' : '正在送达…')
            : edited
              ? (english ? 'Approve edited plan' : '批准修改后的计划')
              : (english ? 'Approve plan' : '批准计划')}
        </button>
      </div>
    </div>
  );
}
