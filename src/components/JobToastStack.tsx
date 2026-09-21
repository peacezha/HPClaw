// 应用内右下角浮层通知：作业完成 / AI 续跑提醒。
// Portal 挂到 body，深色专业风（scholar 色板随主题切换），点击整条执行跳转，右上角 × 关闭。
import { createPortal } from 'react-dom';
import { BellRing, MessageSquareText, X } from 'lucide-react';
import { getStoredLocale } from '../i18n';
import type { JobToastItem } from '../services/jobNotifications';

interface JobToastStackProps {
  toasts: JobToastItem[];
  /** 点击 toast 主体：跳转计算资源作业面板 / 打开对应对话 */
  onActivate: (toast: JobToastItem) => void;
  onDismiss: (id: number) => void;
}

const TOAST_STATUS_STYLES: Record<string, string> = {
  DONE: 'bg-emerald-500/15 text-emerald-500',
  EXIT: 'bg-red-500/15 text-red-500',
};

export default function JobToastStack({ toasts, onActivate, onDismiss }: JobToastStackProps) {
  if (toasts.length === 0) return null;
  const dateLocale = getStoredLocale();
  return createPortal(
    <div className="fixed bottom-4 right-4 z-[90] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2" role="status" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          role="button"
          tabIndex={0}
          onClick={() => onActivate(toast)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onActivate(toast);
            }
          }}
          className="cursor-pointer rounded-lg border border-scholar-600 bg-scholar-900/95 p-3 shadow-xl backdrop-blur transition-colors hover:border-accent/50"
        >
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-accent">
              {toast.kind === 'ai' ? <MessageSquareText className="h-3.5 w-3.5" /> : <BellRing className="h-3.5 w-3.5" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {toast.status && (
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${TOAST_STATUS_STYLES[toast.status] ?? ''}`}>
                    {toast.status}
                  </span>
                )}
                <span className="truncate text-xs font-medium text-scholar-100">{toast.title}</span>
              </div>
              {toast.body && (
                <p className="mt-1 line-clamp-2 break-all text-[11px] leading-4 text-scholar-400" data-user-content="true">
                  {toast.body}
                </p>
              )}
              <p className="mt-1 text-[10px] text-scholar-500">
                {new Date(toast.time).toLocaleTimeString(dateLocale)}
              </p>
            </div>
            <button
              type="button"
              aria-label="关闭"
              onClick={event => {
                event.stopPropagation();
                onDismiss(toast.id);
              }}
              className="shrink-0 text-scholar-500 transition-colors hover:text-scholar-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>,
    document.body,
  );
}
