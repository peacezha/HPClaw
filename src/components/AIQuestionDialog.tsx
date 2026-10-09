import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import type { PendingUserQuestion } from '../services/useUserQuestions';
import type { UserQuestionAnswer } from '@/shared/aiQuestions';
import { isManualInputChoice, isPathPickerChoice } from '@/shared/askOptions';

/** Kept outside the scrolling chat log: incoming tokens must not hide the answer controls. */
export default function AIQuestionDialog({ question, english, busy, error, count, onReply, onPickPath, onDefer, open }: {
  question: PendingUserQuestion; english: boolean; busy: boolean; error: string; count: number;
  onReply: (answer: UserQuestionAnswer | null) => Promise<void>; onPickPath?: () => Promise<string | null>;
  onDefer: () => void;
  open: boolean;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const [picking, setPicking] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!open) return;
    const prior = document.activeElement as HTMLElement | null;
    const target = panel.current;
    target?.focus();
    return () => { if (prior?.isConnected) prior.focus(); };
  }, [open]);
  const disabled = busy || picking;
  const choose = async (label: string) => {
    if (!question.id && isManualInputChoice(label)) { input.current?.focus(); return; }
    if (!question.id && isPathPickerChoice(label) && onPickPath) {
      setPicking(true);
      try { const path = await onPickPath(); if (path) setCustom(path); }
      finally { setPicking(false); }
      return;
    }
    setSelected(current => question.multiSelect ? current.includes(label) ? current.filter(item => item !== label) : [...current, label] : [label]);
  };
  if (!open) return null;
  return createPortal(<div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-3 sm:p-6">
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="ai-question-title" aria-describedby="ai-question-text"
      data-testid="ai-question-dialog" tabIndex={-1}
      onKeyDown={event => {
        // Escape/backdrop do not silently cancel a task or answer on the user's behalf.
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); }
        if (event.key !== 'Tab') return;
        const focusable = Array.from(panel.current?.querySelectorAll<HTMLButtonElement | HTMLTextAreaElement>('button, textarea') || [])
          .filter(element => !element.disabled);
        if (!focusable.length) { event.preventDefault(); return; }
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) { event.preventDefault(); first.focus(); }
      }}
      className="w-full max-w-xl max-h-[85dvh] flex flex-col overflow-hidden rounded-2xl border border-scholar-600 bg-scholar-900 text-scholar-100 shadow-2xl outline-none">
      <header className="flex gap-3 items-start p-5 pb-3 shrink-0">
        <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div>
          <h2 id="ai-question-title" className="text-base font-semibold">{english ? 'The agent needs your answer' : 'Agent 需要你回答'}{count > 1 ? ` (${count})` : ''}</h2>
          <p className="mt-1 text-sm text-scholar-300">{english ? 'Answer this question to continue the existing task.' : '回答本次问题后，继续原任务。'}</p>
        </div>
      </header>
      <form className="min-h-0 flex flex-col" onSubmit={event => { event.preventDefault(); if (!disabled && (selected.length || custom.trim())) void onReply({ selected, ...(custom.trim() ? { custom: custom.trim() } : {}) }); }}>
        <div className="overflow-y-auto min-h-0 px-5 pb-4">
          <p id="ai-question-text" data-user-content="true" className="text-sm whitespace-pre-wrap break-words leading-6">{question.question}</p>
          {question.options.length > 0 && <fieldset className="mt-4 space-y-2">
            <legend className="text-xs text-scholar-300 mb-2">{question.multiSelect ? english ? 'Select one or more options' : '可选择多项' : english ? 'Select one option or enter an answer' : '选择一项，或填写你的回答'}</legend>
            {question.options.map(option => <button key={option.label} type="button" disabled={disabled} aria-pressed={selected.includes(option.label)}
              onClick={() => void choose(option.label)}
              className={`w-full text-left flex items-start gap-2 rounded-xl border px-3 py-2.5 transition-colors disabled:opacity-50 ${selected.includes(option.label) ? 'border-accent bg-accent/10 text-scholar-100' : 'border-scholar-700 hover:border-accent/60 bg-scholar-950 text-scholar-200'}`}>
              <span className={`mt-0.5 h-4 w-4 shrink-0 flex items-center justify-center border ${question.multiSelect ? 'rounded' : 'rounded-full'} ${selected.includes(option.label) ? 'border-accent bg-accent text-white' : 'border-scholar-500'}`}>
                {selected.includes(option.label) && <Check className="h-3 w-3" />}
              </span>
              <span data-user-content="true" className="min-w-0 break-words text-sm">{option.label}{option.description && <span className="block mt-1 text-xs text-scholar-300">{option.description}</span>}</span>
            </button>)}
          </fieldset>}
          <label className="block mt-4 text-sm text-scholar-200" htmlFor="ai-question-answer">{english ? 'Your answer / additional details' : '你的回答 / 补充说明'}</label>
          <textarea ref={input} id="ai-question-answer" value={custom} onChange={event => setCustom(event.target.value)} disabled={disabled} rows={3}
            placeholder={english ? 'Enter your answer here…' : '在这里填写回答…'}
            className="mt-2 w-full resize-y rounded-xl border border-scholar-600 bg-scholar-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50" />
          {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
        </div>
        <footer className="shrink-0 flex flex-wrap justify-end gap-2 border-t border-scholar-700 p-4">
          <button type="button" disabled={disabled} onClick={onDefer} className="mr-auto px-2 py-2 text-sm text-scholar-300 hover:text-scholar-100 disabled:opacity-50">{english ? 'Answer later' : '稍后回答'}</button>
          <button type="button" disabled={disabled} onClick={() => void onReply(null)} className="px-4 py-2 text-sm rounded-lg border border-scholar-600 hover:bg-scholar-800 disabled:opacity-50">{english ? 'Cancel question' : '取消本次问答'}</button>
          <button type="submit" disabled={disabled || (!selected.length && !custom.trim())} className="px-4 py-2 text-sm rounded-lg bg-accent text-white hover:bg-accent-dark disabled:opacity-40 flex items-center gap-2">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}{busy ? english ? 'Sending…' : '正在送达…' : english ? 'Submit answer' : '提交回答'}
          </button>
        </footer>
      </form>
    </div>
  </div>, document.body);
}
