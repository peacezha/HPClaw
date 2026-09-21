import type { ConflictPolicy } from '@/shared/fileTransfer';
import type { ConflictRequest } from './controller';

interface ConflictDialogProps {
  conflict: ConflictRequest | null;
  onResolve: (taskId: string, policy: ConflictPolicy) => void;
  onClose: () => void;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '-';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatDate(ms: number): string {
  if (!ms) return '-';
  const d = new Date(ms);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ConflictDialog({
  conflict,
  onResolve,
  onClose,
}: ConflictDialogProps) {
  if (!conflict) return null;

  return (
    <div className="file-transfer-dialog-overlay" data-testid="conflict-dialog">
      <div
        className="file-transfer-dialog"
        role="dialog"
        aria-label="文件冲突"
      >
        <h3 className="dialog-title">文件冲突</h3>

        <div className="conflict-info">
          <div className="conflict-info-row">
            <span className="conflict-label">源文件:</span>
            <span className="conflict-value">{conflict.sourcePath}</span>
          </div>
          <div className="conflict-info-row">
            <span className="conflict-label">目标文件:</span>
            <span className="conflict-value">{conflict.targetPath}</span>
          </div>
          <div className="conflict-info-row">
            <span className="conflict-label">已有文件大小:</span>
            <span className="conflict-value">
              {formatSize(conflict.existingSize)}
            </span>
          </div>
          <div className="conflict-info-row">
            <span className="conflict-label">已有文件修改时间:</span>
            <span className="conflict-value">
              {formatDate(conflict.existingModifiedAt)}
            </span>
          </div>
        </div>

        <div className="file-transfer-dialog-actions">
          <button
            type="button"
            className="file-transfer-btn-primary"
            onClick={() => onResolve(conflict.taskId, 'overwrite')}
            data-testid="conflict-overwrite"
          >
            覆盖
          </button>
          <button
            type="button"
            className="file-transfer-btn-secondary"
            onClick={() => onResolve(conflict.taskId, 'skip')}
            data-testid="conflict-skip"
          >
            跳过
          </button>
          <button
            type="button"
            className="file-transfer-btn-secondary"
            onClick={() => onResolve(conflict.taskId, 'rename')}
            data-testid="conflict-rename"
          >
            重命名
          </button>
          <button
            type="button"
            className="file-transfer-btn-secondary"
            onClick={() => onResolve(conflict.taskId, 'resume')}
            data-testid="conflict-resume"
          >
            续传
          </button>
          <button
            type="button"
            className="file-transfer-btn-cancel"
            onClick={onClose}
            data-testid="conflict-cancel"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
