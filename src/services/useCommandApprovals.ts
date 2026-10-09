import { useCallback, useRef, useState } from 'react';

export interface PendingCommandApproval {
  id: string; command: string; risk: string; title?: string; expiresAt?: number;
}
export function useCommandApprovals(opts: {
  english: boolean; trusted: () => boolean; onTrust: () => void;
}) {
  const options = useRef(opts); options.current = opts;
  const queue = useRef(new Map<string, PendingCommandApproval>());
  const resolved = useRef(new Set<string>());
  const sending = useRef(new Set<string>());
  const generation = useRef(0);
  const [items, setItems] = useState<PendingCommandApproval[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const refresh = () => {
    setItems([...queue.current.values()]);
    setBusy(sending.current.has(queue.current.keys().next().value || ''));
  };
  const remove = (id: string) => {
    queue.current.delete(id); resolved.current.add(id); sending.current.delete(id);
    if (resolved.current.size > 512) resolved.current.delete(resolved.current.values().next().value!);
    refresh();
  };
  const decide = useCallback(async (id: string, action: 'execute' | 'reject' | 'trust') => {
    if (!queue.current.has(id) || sending.current.has(id)) return;
    sending.current.add(id); setError(''); refresh();
    const epoch = generation.current;
    const english = options.current.english;
    try {
      const response = await fetch('/api/ai/confirm', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved: action !== 'reject' }),
        signal: AbortSignal.timeout(30_000),
      });
      const receipt = await response.json();
      if (epoch !== generation.current) return;
      if (!response.ok || receipt.success !== true) {
        if (receipt.reason === 'expired' || receipt.reason === 'cancelled' || receipt.reason === 'allowed' || receipt.reason === 'rejected') {
          remove(id);
          setNotice(english ? 'This approval is no longer pending. No command was resubmitted.' : '该确认已结束或过期，没有重新执行命令。');
          return;
        }
        throw new Error('approval_not_acknowledged');
      }
      if (action === 'trust') options.current.onTrust();
      remove(id);
      setNotice(english
        ? action === 'reject' ? 'Command rejected; it was not executed.' : 'Approval delivered. Awaiting the actual execution result.'
        : action === 'reject' ? '已拒绝，命令未执行。' : '确认已送达，正在等待实际执行结果。');
    } catch {
      // Keep the exact request visible. Retrying only sends this approval ID;
      // the server cannot execute an already settled request twice.
      if (epoch === generation.current && queue.current.has(id)) setError(english
        ? 'Approval delivery is unverified. Check the connection and retry this confirmation; the command has not been resubmitted.'
        : '确认送达状态尚未核验。请检查连接后重试确认；没有重新提交命令。');
    } finally { if (epoch === generation.current) { sending.current.delete(id); refresh(); } }
  }, []);
  const handleEvent = useCallback((event: any) => {
    if (event.type === 'confirm_resolved') {
      const wasPending = queue.current.has(String(event.id));
      remove(String(event.id));
      if (wasPending && (event.reason === 'expired' || event.reason === 'cancelled')) {
        setError('');
        setNotice(options.current.english
          ? 'Approval expired or was cancelled; this was not a user rejection. The command was not authorized.'
          : '确认已超时或取消，不代表你点了拒绝；该命令未获执行许可。');
      }
      return;
    }
    const id = typeof event.id === 'string' ? event.id : '';
    if (event.type !== 'confirm' || !id || resolved.current.has(id) || queue.current.has(id)) return;
    if (typeof event.expiresAt === 'number' && event.expiresAt <= Date.now()) { remove(id); return; }
    const item = { id, command: String(event.command || ''), risk: String(event.risk || 'unknown'),
      title: event.title, expiresAt: event.expiresAt };
    queue.current.set(id, item); setError(''); setNotice(''); refresh();
    if (options.current.trusted() && item.risk !== 'destructive' && item.risk !== 'unknown')
      void decide(id, 'execute');
  }, [decide]);
  const clear = useCallback(() => { generation.current++; queue.current.clear(); sending.current.clear(); setItems([]); setBusy(false); setError(''); }, []);
  return { pending: items[0], count: items.length, busy, error, notice, decide, handleEvent, clear };
}
