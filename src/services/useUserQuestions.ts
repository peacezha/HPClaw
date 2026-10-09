import { useCallback, useEffect, useRef, useState } from 'react';
import type { UserQuestionAnswer, UserQuestionOption } from '@/shared/aiQuestions';
import { ensureUserChoiceOptions } from '@/shared/askOptions';

export interface PendingUserQuestion {
  key: string; id?: string; question: string; options: UserQuestionOption[]; multiSelect: boolean; expiresAt?: number;
}

export function useUserQuestions(opts: { english: boolean; onAnswered: (text: string) => void;
  onLegacyAnswer: (text: string) => Promise<void> }) {
  const settings = useRef(opts); settings.current = opts;
  const queue = useRef(new Map<string, PendingUserQuestion>());
  const resolved = useRef(new Set<string>());
  const sending = useRef(new Set<string>());
  const loggedAnswers = useRef(new Set<string>());
  const generation = useRef(0);
  const [items, setItems] = useState<PendingUserQuestion[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const refresh = () => { setItems([...queue.current.values()]); setBusy(sending.current.has(queue.current.keys().next().value || '')); };
  const recordAnswer = (key: string, text: string) => {
    if (!text || loggedAnswers.current.has(key)) return;
    loggedAnswers.current.add(key);
    if (loggedAnswers.current.size > 512) loggedAnswers.current.delete(loggedAnswers.current.values().next().value!);
    settings.current.onAnswered(text);
  };
  const remove = (key: string) => {
    queue.current.delete(key); resolved.current.add(key); sending.current.delete(key);
    if (resolved.current.size > 512) resolved.current.delete(resolved.current.values().next().value!);
    refresh();
  };
  const reply = useCallback(async (answer: UserQuestionAnswer | null): Promise<void> => {
    const pending = queue.current.values().next().value;
    if (!pending || sending.current.has(pending.key)) return;
    const epoch = generation.current;
    const text = answer ? [...answer.selected, answer.custom?.trim()].filter(Boolean).join('\n') : '';
    if (answer && !text) return;
    sending.current.add(pending.key); setError(''); refresh();
    try {
      if (!pending.id) {
        remove(pending.key);
        if (answer) await settings.current.onLegacyAnswer(text);
        return;
      }
      const response = await fetch('/api/ai/question', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pending.id, ...(answer ? { answer } : { cancelled: true }) }), signal: AbortSignal.timeout(30_000) });
      const receipt = await response.json();
      if (epoch !== generation.current) return;
      if (!response.ok || receipt.success !== true) {
        if (['answered', 'expired', 'cancelled'].includes(receipt.reason)) {
          remove(pending.key);
          setNotice('settled');
          return;
        }
        throw new Error('question_not_acknowledged');
      }
      remove(pending.key);
      if (answer) recordAnswer(pending.key, text);
      setNotice(answer ? 'answered' : 'cancelled');
    } catch {
      if (epoch === generation.current && queue.current.has(pending.key)) setError('delivery_unverified');
    } finally { if (epoch === generation.current) { sending.current.delete(pending.key); refresh(); } }
  }, []);
  const handleEvent = useCallback((event: any) => {
    const id = typeof event.id === 'string' && event.id ? event.id : undefined;
    if (event.type === 'ask_resolved' && id) {
      const wasPending = queue.current.has(id);
      // A server acknowledgement can arrive on SSE before the HTTP receipt or
      // turn/end. Persist the exact accepted answer once, even if that turn ends fast.
      if (wasPending && event.reason === 'answered' && Array.isArray(event.answer?.selected)) {
        recordAnswer(id, [...event.answer.selected, event.answer.custom].filter(item => typeof item === 'string' && item).join('\n'));
      }
      remove(id);
      if (wasPending && ['expired', 'cancelled'].includes(event.reason)) {
        setError(''); setNotice('ended');
      }
      return;
    }
    const key = id || 'legacy-question';
    if (event.type !== 'ask' || (id && (resolved.current.has(key) || queue.current.has(key)))) return;
    if (typeof event.expiresAt === 'number' && event.expiresAt <= Date.now()) { remove(key); return; }
    const question = String(event.question || (settings.current.english ? 'Please confirm the next step.' : '请确认下一步。'));
    const labels: string[] = id ? (Array.isArray(event.options) ? event.options.filter((item: unknown) => typeof item === 'string') : [])
      : ensureUserChoiceOptions(question, event.options, settings.current.english ? 'en-US' : 'zh-CN');
    const options = [...new Set(labels)].map(label => {
      const description = Array.isArray(event.optionDetails) ? event.optionDetails.find((item: any) => item?.label === label)?.description : undefined;
      return { label, ...(typeof description === 'string' ? { description } : {}) };
    });
    queue.current.set(key, { key, id, question, options, multiSelect: event.multiSelect === true, expiresAt: event.expiresAt });
    setError(''); setNotice(''); refresh();
  }, []);
  const clear = useCallback(() => {
    generation.current++; queue.current.clear(); sending.current.clear();
    setItems([]); setBusy(false); setError(''); setNotice('');
  }, []);
  useEffect(() => () => { generation.current++; }, []);
  const notices: Record<string, string> = opts.english ? {
    settled: 'This question is no longer pending. No new task was submitted.',
    answered: 'Answer delivered. The agent will continue the existing task.',
    cancelled: 'Question cancelled; no cluster job was terminated.',
    ended: 'The question expired or was cancelled; this was not a user rejection. No cluster job was terminated.',
  } : {
    settled: '该问题已回答、过期或取消；没有重新提交任务。',
    answered: '回答已送达，Agent 将继续原任务。',
    cancelled: '已取消本次问答，未终止任何集群作业。',
    ended: '问答已过期或取消，不代表你拒绝了操作；未终止任何集群作业。',
  };
  return { pending: items[0], count: items.length, busy,
    error: error ? opts.english ? 'Answer delivery is unverified. Your answer is retained; retry this question. No new task was submitted.'
      : '回答送达状态尚未核验，已保留你的答案。请重试本次问答；没有重新提交任务。' : '',
    notice: notices[notice] || '', handleEvent, reply, clear };
}
