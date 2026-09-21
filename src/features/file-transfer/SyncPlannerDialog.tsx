import { useState, useCallback } from 'react';
import {
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  Trash2,
  SkipForward,
  AlertTriangle,
  GitCompareArrows,
} from 'lucide-react';
import type { FileEntry, FileSide } from '@/shared/fileTransfer';
import { buildSyncPlan, type SyncAction, type SyncPlan } from './syncPlanUtils';

export interface SyncPlannerDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (actions: SyncAction[]) => void;
  sourceEntries: FileEntry[];
  targetEntries: FileEntry[];
  sourceLabel?: string;
  targetLabel?: string;
  sourceSide?: FileSide;
}

const ACTION_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  upload: { label: '上传', icon: <ArrowUp size={14} />, color: 'text-yellow-600' },
  download: { label: '下载', icon: <ArrowDown size={14} />, color: 'text-blue-600' },
  delete: { label: '删除', icon: <Trash2 size={14} />, color: 'text-red-600' },
  conflict: { label: '冲突', icon: <AlertTriangle size={14} />, color: 'text-orange-600' },
  skip: { label: '跳过', icon: <SkipForward size={14} />, color: 'text-scholar-500' },
};

const ACTION_COLORS: Record<string, string> = {
  upload: 'var(--color-status-ok, #4ade80)',
  download: 'var(--color-status-info, #60a5fa)',
  delete: 'var(--color-status-error, #f87171)',
  conflict: 'var(--color-status-warn, #fbbf24)',
  skip: 'var(--color-scholar-500, #6b7894)',
};

export default function SyncPlannerDialog({
  open,
  onClose,
  onApply,
  sourceEntries,
  targetEntries,
  sourceLabel = '源目录',
  targetLabel = '目标目录',
}: SyncPlannerDialogProps) {
  const [plan, setPlan] = useState<SyncPlan | null>(null);
  const [deleteExtraneous, setDeleteExtraneous] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCompare = useCallback(() => {
    setComparing(true);
    setTimeout(() => {
      const result = buildSyncPlan(sourceEntries, targetEntries, { deleteExtraneous });
      setPlan(result);
      setComparing(false);
    }, 0);
  }, [sourceEntries, targetEntries, deleteExtraneous]);

  const handleApply = useCallback(() => {
    if (!plan) return;

    if (plan.summary.delete > 0) {
      setShowConfirm(true);
    } else {
      onApply(plan.actions);
      onClose();
    }
  }, [plan, onApply, onClose]);

  const handleConfirmApply = useCallback(() => {
    if (!plan) return;
    onApply(plan.actions);
    setShowConfirm(false);
    onClose();
  }, [plan, onApply, onClose]);

  const handleCloseConfirm = useCallback(() => {
    setShowConfirm(false);
  }, []);

  if (!open) return null;

  return (
    <>
      <div className="file-transfer-dialog-overlay" onClick={onClose}>
        <div
          className="file-transfer-dialog file-transfer-sync"
          onClick={(e) => e.stopPropagation()}
          data-testid="sync-planner"
        >
          {/* Header */}
          <div className="dialog-title flex items-center gap-2">
            <GitCompareArrows size={16} />
            <span className="flex-1">同步规划器</span>
            <button className="queue-action-btn" onClick={onClose}>
              <X size={14} />
            </button>
          </div>

          {/* Directory paths */}
          <div className="dialog-body">
            <div className="conflict-info">
              <div className="conflict-info-row">
                <span className="conflict-label">{sourceLabel}</span>
                <span className="conflict-value text-xs">
                  {sourceEntries.length > 0
                    ? `${sourceEntries.length} 个条目`
                    : '（空）'}
                </span>
              </div>
              <div className="conflict-info-row">
                <span className="conflict-label">{targetLabel}</span>
                <span className="conflict-value text-xs">
                  {targetEntries.length > 0
                    ? `${targetEntries.length} 个条目`
                    : '（空）'}
                </span>
              </div>
            </div>
          </div>

          {/* Delete checkbox */}
          <div className="px-4 pb-2">
            <label className="flex items-center gap-2 text-xs text-scholar-400 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteExtraneous}
                onChange={(e) => setDeleteExtraneous(e.target.checked)}
                className="accent-[#3b82f6]"
              />
              删除目标目录中多余的文件
            </label>
          </div>

          {/* Compare button */}
          <div className="px-4 pb-3">
            <button
              className="file-transfer-btn-primary w-full"
              onClick={handleCompare}
              disabled={comparing}
              data-testid="sync-compare-btn"
            >
              {comparing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="search-spinner" />
                  比较中...
                </span>
              ) : (
                '比较目录'
              )}
            </button>
          </div>

          {/* Summary counts */}
          {plan && (
            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-3 text-xs" data-testid="sync-summary">
                {plan.summary.upload > 0 && (
                  <span className="sync-summary-item" style={{ color: ACTION_COLORS.upload }}>
                    <ArrowUp size={12} /> 上传 {plan.summary.upload}
                  </span>
                )}
                {plan.summary.download > 0 && (
                  <span className="sync-summary-item" style={{ color: ACTION_COLORS.download }}>
                    <ArrowDown size={12} /> 下载 {plan.summary.download}
                  </span>
                )}
                {plan.summary.conflict > 0 && (
                  <span className="sync-summary-item" style={{ color: ACTION_COLORS.conflict }}>
                    <AlertTriangle size={12} /> 冲突 {plan.summary.conflict}
                  </span>
                )}
                {plan.summary.skip > 0 && (
                  <span className="sync-summary-item" style={{ color: ACTION_COLORS.skip }}>
                    <SkipForward size={12} /> 跳过 {plan.summary.skip}
                  </span>
                )}
                {plan.summary.delete > 0 && (
                  <span className="sync-summary-item" style={{ color: ACTION_COLORS.delete }}>
                    <Trash2 size={12} /> 删除 {plan.summary.delete}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action list */}
          {plan && plan.actions.length > 0 && (
            <div className="px-4 pb-3 max-h-48 overflow-y-auto" data-testid="sync-action-list">
              <div className="text-xs text-scholar-500 mb-1">操作列表：</div>
              {plan.actions.map((action, idx) => {
                const meta = ACTION_LABELS[action.kind];
                return (
                  <div
                    key={`${action.name}-${idx}`}
                    className="sync-action-row"
                    data-testid={`sync-action-${idx}`}
                  >
                    <span className={`${meta?.color || ''}`}>{meta?.icon}</span>
                    <span className="sync-action-name">{action.name}</span>
                    <span className="sync-action-size text-scholar-500">
                      {action.size >= 1024 * 1024
                        ? `${(action.size / (1024 * 1024)).toFixed(1)} MB`
                        : action.size >= 1024
                          ? `${(action.size / 1024).toFixed(0)} KB`
                          : `${action.size} B`}
                    </span>
                    <span className={`sync-action-kind ${meta?.color || ''}`}>
                      {meta?.label || action.kind}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Apply button */}
          {plan && plan.actions.length > 0 && (
            <div className="flex gap-2 justify-end px-4 pb-4">
              <button className="file-transfer-btn-cancel" onClick={onClose}>
                取消
              </button>
              <button
                className="file-transfer-btn-primary"
                onClick={handleApply}
                data-testid="sync-apply-btn"
              >
                应用同步
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation dialog for deletions */}
      {showConfirm && (
        <div className="file-transfer-dialog-overlay" style={{ zIndex: 3000 }}>
          <div className="file-transfer-dialog" data-testid="sync-confirm-dialog">
            <div className="dialog-title">确认同步</div>
            <div className="dialog-body">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="mb-2">
                    以下操作将包含删除目标目录中的文件，此操作不可撤销：
                  </p>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    {plan?.actions
                      .filter((a) => a.kind === 'delete')
                      .map((a, i) => (
                        <li key={i} className="text-red-600">
                          {a.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="file-transfer-dialog-actions">
              <button
                className="file-transfer-btn-cancel"
                onClick={handleCloseConfirm}
              >
                取消
              </button>
              <button
                className="file-transfer-btn-danger"
                onClick={handleConfirmApply}
                data-testid="sync-confirm-apply"
              >
                确认执行
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
