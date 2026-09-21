import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import './fileTransfer.css';

interface FileTransferDrawerProps {
  open: boolean;
  maximized?: boolean;
  /** 多集群标签下仅活动标签的抽屉可见；不可见时保留挂载（传输不中断） */
  visible?: boolean;
  onClose: () => void;
  onToggleMaximize?: () => void;
  onCancelTransfers?: () => void;
  children: React.ReactNode;
}

export default function FileTransferDrawer({
  open,
  maximized = false,
  visible = true,
  onClose,
  onToggleMaximize,
  children,
}: FileTransferDrawerProps) {
  useEffect(() => {
    if (!open || !visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, visible, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="file-transfer-overlay" role="dialog" aria-label="文件传输工作区" style={visible ? undefined : { display: 'none' }}>
      <div className="file-transfer-scrim" onClick={onClose} />
      <div
        className="file-transfer-drawer"
        data-open={open}
        data-maximized={maximized}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-scholar-700 shrink-0">
          <h2 className="text-sm font-semibold text-scholar-100">文件传输</h2>
          <div className="flex items-center gap-2">
            {onToggleMaximize && (
              <button
                type="button"
                onClick={onToggleMaximize}
                className="text-scholar-400 hover:text-scholar-200 transition-colors p-1 rounded"
                aria-label={maximized ? '最小化' : '最大化'}
              >
                {maximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-scholar-400 hover:text-scholar-200 transition-colors p-1 rounded"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
