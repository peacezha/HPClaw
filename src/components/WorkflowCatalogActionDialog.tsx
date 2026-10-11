import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Trash2, Archive } from 'lucide-react';
import type { Workflow } from '@/shared/workflow';
import { useWorkflowText } from '../i18n';
import { deleteWorkflow, setWorkflowLifecycle } from '../features/workflows/api';

export type WorkflowCatalogAction = { workflow: Workflow; kind: 'delete' | 'archive' };

/** App-owned confirmation: native window.confirm is unreliable in Electron. */
export default function WorkflowCatalogActionDialog({ action, onClose, onDone }: {
  action: WorkflowCatalogAction; onClose: () => void; onDone: () => void;
}) {
  const text = useWorkflowText();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const guard = useRef(false);
  const dialog = useRef<HTMLDivElement>(null);
  const deleting = action.kind === 'delete';
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return () => { if (before?.isConnected) before.focus(); };
  }, []);
  const submit = async () => {
    if (guard.current) return;
    guard.current = true; setBusy(true); setError('');
    try {
      if (deleting) await deleteWorkflow(action.workflow.id);
      else await setWorkflowLifecycle(action.workflow.id, 'pending_disposal', reason.trim());
      onDone(); onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : text('操作失败，请重试。'));
    } finally { guard.current = false; setBusy(false); }
  };
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4" onClick={event => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="workflow-catalog-title" className="w-full max-w-lg rounded-xl border border-scholar-600 bg-scholar-900 p-5 shadow-2xl"
        onKeyDown={event => {
          if (event.key === 'Escape' && !busy) { event.stopPropagation(); onClose(); }
          if (event.key !== 'Tab') return;
          const nodes = [...(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea:not(:disabled)') || [])];
          const first = nodes[0], last = nodes[nodes.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }}>
        <h2 id="workflow-catalog-title" className="flex items-center gap-2 text-base font-semibold text-scholar-50">
          {deleting ? <Trash2 className="h-5 w-5 text-red-400" /> : <Archive className="h-5 w-5 text-amber-400" />}
          {text(deleting ? '删除流程定义' : '移入待弃置')}
        </h2>
        <p data-user-content="true" className="mt-3 break-words text-sm text-scholar-100">{action.workflow.source === 'builtin' ? text(action.workflow.name) : action.workflow.name}</p>
        <p className="mt-3 text-sm leading-6 text-scholar-300">{text(deleting
          ? '仅删除流程定义。集群文件、历史运行、结果和报告不会删除，正在计算的作业不会终止。内置流程更新后也不会重新出现；定义会在本机留备份。'
          : '移出正式流程与 AI 推荐，保留全部定义和历史运行；可以随时恢复。不会终止已有作业。')}</p>
        {!deleting && <label className="mt-3 block text-xs text-scholar-300">{text('移入原因（可选）')}
          <textarea value={reason} onChange={event => setReason(event.target.value)} maxLength={1000} disabled={busy} rows={3} className="mt-1 w-full rounded-lg border border-scholar-600 bg-scholar-950 p-2 text-sm" />
        </label>}
        {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" disabled={busy} onClick={onClose} className="btn-ghost">{text('取消')}</button>
          <button type="button" disabled={busy} onClick={() => void submit()} className={`btn-primary ${deleting ? '!bg-red-600 hover:!bg-red-700' : ''}`}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}{text(busy ? '处理中…' : deleting ? '确认删除定义' : '确认移入')}
          </button>
        </div>
      </div>
    </div>, document.body,
  );
}
