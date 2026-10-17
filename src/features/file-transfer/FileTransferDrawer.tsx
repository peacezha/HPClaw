import { useEffect, useRef, useState } from 'react';
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

/** 拖动时在任意方向至少保留的可见像素，防止抽屉被拖出视口无法找回 */
const DRAG_MIN_VISIBLE_PX = 120;
/** 抽屉头高度：拖动时下移不超过视口，保证把手始终可点 */
const DRAG_HEADER_PX = 48;

export default function FileTransferDrawer({
  open,
  maximized = false,
  visible = true,
  onClose,
  onToggleMaximize,
  children,
}: FileTransferDrawerProps) {
  // 拖拽偏移：以 transform 平移抽屉（不改变布局锚点，入场动画不受影响）
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    minX: number;
    maxX: number;
    maxY: number;
  } | null>(null);

  // 最大化/还原时禁用拖动并复位偏移（最大化占满全屏，偏移无意义）
  useEffect(() => {
    dragStateRef.current = null;
    setDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, [maximized]);

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

  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (maximized || e.button !== 0) return;
    // 点在最大化/关闭按钮上不启动拖动
    if ((e.target as HTMLElement).closest('button')) return;
    const drawerWidth = drawerRef.current?.offsetWidth ?? window.innerWidth;
    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      baseX: dragOffset.x,
      baseY: dragOffset.y,
      minX: DRAG_MIN_VISIBLE_PX - drawerWidth,
      maxX: window.innerWidth - DRAG_MIN_VISIBLE_PX,
      maxY: window.innerHeight - DRAG_HEADER_PX,
    };
    // 指针捕获：即使移出窗口/iframe 边界也能持续收到 move/up
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const handleHeaderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    setDragOffset({
      x: Math.min(Math.max(drag.baseX + e.clientX - drag.startX, drag.minX), drag.maxX),
      y: Math.min(Math.max(drag.baseY + e.clientY - drag.startY, 0), drag.maxY),
    });
  };

  const handleHeaderPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragStateRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  return createPortal(
    <div className="file-transfer-overlay" role="dialog" aria-label="文件传输工作区" style={visible ? undefined : { display: 'none' }}>
      <div className="file-transfer-scrim" onClick={onClose} />
      <div
        ref={drawerRef}
        className="file-transfer-drawer"
        data-open={open}
        data-maximized={maximized}
        data-dragging={dragging || undefined}
        style={maximized ? undefined : { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
      >
        {/* Header（拖动把手） */}
        <div
          className="file-transfer-drawer-header flex items-center justify-between px-4 py-3 border-b border-scholar-700 shrink-0"
          data-dragging={dragging || undefined}
          onPointerDown={handleHeaderPointerDown}
          onPointerMove={handleHeaderPointerMove}
          onPointerUp={handleHeaderPointerEnd}
          onPointerCancel={handleHeaderPointerEnd}
        >
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
