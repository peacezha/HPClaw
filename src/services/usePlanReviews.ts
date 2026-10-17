import { useCallback, useRef, useState } from 'react';

export interface PlanReviewStepInput { title: string; verification: string }
export interface PendingPlanReview {
  id: string;
  goal: string;
  steps: PlanReviewStepInput[];
  expiresAt?: number;
}
export type PlanReviewAction = 'approve' | 'edit' | 'cancel';

/**
 * 计划审批队列（与 useCommandApprovals 同款一次性语义）：
 * plan_review 事件入队，approve/edit/cancel 经 POST /api/ai/plan-review 送达；
 * 送达失败不丢卡片，可重试；服务端 settled 后迟到的事件不再可操作。
 */
export function usePlanReviews(opts: { english: boolean }) {
  const options = useRef(opts); options.current = opts;
  const queue = useRef(new Map<string, PendingPlanReview>());
  const resolved = useRef(new Set<string>());
  const sending = useRef(new Set<string>());
  const generation = useRef(0);
  const [items, setItems] = useState<PendingPlanReview[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const refresh = () => {
    setItems([...queue.current.values()]);
    setBusy(sending.current.has(queue.current.keys().next().value?.id || ''));
  };
  const remove = (id: string) => {
    queue.current.delete(id); resolved.current.add(id); sending.current.delete(id);
    if (resolved.current.size > 256) resolved.current.delete(resolved.current.values().next().value!);
    refresh();
  };
  const decide = useCallback(async (id: string, action: PlanReviewAction, steps?: PlanReviewStepInput[]) => {
    if (!queue.current.has(id) || sending.current.has(id)) return;
    sending.current.add(id); setError(''); refresh();
    const epoch = generation.current;
    const english = options.current.english;
    try {
      const response = await fetch('/api/ai/plan-review', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, ...(action === 'edit' && steps ? { steps } : {}) }),
        signal: AbortSignal.timeout(30_000),
      });
      const receipt = await response.json();
      if (epoch !== generation.current) return;
      if (!response.ok || receipt.success !== true) {
        if (['approved', 'edited', 'cancelled', 'expired'].includes(receipt.reason)) {
          remove(id);
          setNotice(english ? 'This plan review is no longer pending.' : '该计划审批已结束或过期。');
          return;
        }
        throw new Error('plan_review_not_acknowledged');
      }
      remove(id);
      setNotice(english
        ? action === 'cancel' ? 'Plan cancelled; nothing in it was executed.'
          : action === 'edit' ? 'Edited plan approved. The agent continues with your steps.' : 'Plan approved. The agent continues the existing task.'
        : action === 'cancel' ? '计划已取消，未执行其中任何操作。'
          : action === 'edit' ? '已批准修改后的计划，Agent 按你的步骤继续。' : '计划已批准，Agent 继续原任务。');
    } catch {
      if (epoch === generation.current && queue.current.has(id)) setError(english
        ? 'Delivery is unverified. Check the connection and retry; the plan was not executed.'
        : '送达状态尚未核验。请检查连接后重试；计划未被执行。');
    } finally { if (epoch === generation.current) { sending.current.delete(id); refresh(); } }
  }, []);
  const handleEvent = useCallback((event: any) => {
    if (event.type === 'plan_review_resolved') {
      const id = String(event.id || '');
      const wasPending = queue.current.has(id);
      remove(id);
      if (wasPending && (event.reason === 'expired' || event.reason === 'cancelled')) {
        setError('');
        setNotice(options.current.english
          ? 'Plan review expired or was cancelled; this was not a rejection and nothing was executed.'
          : '计划审批已超时或取消，不代表你点了取消；计划未被执行。');
      }
      return;
    }
    const id = typeof event.id === 'string' ? event.id : '';
    if (event.type !== 'plan_review' || !id || resolved.current.has(id) || queue.current.has(id)) return;
    if (typeof event.expiresAt === 'number' && event.expiresAt <= Date.now()) { remove(id); return; }
    const steps: PlanReviewStepInput[] = Array.isArray(event.steps)
      ? event.steps.map((step: any) => ({ title: String(step?.title || ''), verification: String(step?.verification || '') }))
          .filter(step => step.title && step.verification)
      : [];
    if (!steps.length) return;
    queue.current.set(id, { id, goal: String(event.goal || ''), steps, expiresAt: event.expiresAt });
    setError(''); setNotice(''); refresh();
  }, []);
  const clear = useCallback(() => { generation.current++; queue.current.clear(); sending.current.clear(); setItems([]); setBusy(false); setError(''); }, []);
  return { pending: items[0], count: items.length, busy, error, notice, decide, handleEvent, clear };
}
