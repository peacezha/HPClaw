import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Send } from 'lucide-react';

interface FloatingToolbarProps {
  visible: boolean;
  selectedText: string;
  pixelX: number;
  pixelY: number;
  lineHeight: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSendToAI: (text: string) => void;
  onAnalyzeError: (text: string) => void;
  onDismiss: () => void;
}

export default function FloatingToolbar({
  visible,
  selectedText,
  pixelX,
  pixelY,
  lineHeight,
  containerRef,
  onSendToAI,
  onAnalyzeError,
  onDismiss,
}: FloatingToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // ─── Viewport-aware positioning ──────────────────────────────────
  const position = useMemo(() => {
    const container = containerRef.current;
    if (!container) return { top: pixelY - lineHeight - 10, left: pixelX };

    const containerRect = container.getBoundingClientRect();
    const toolbarW = 180; // estimated toolbar width
    const toolbarH = 36;  // estimated toolbar height

    // Prefer above the selection line
    let top = pixelY - toolbarH - 6;
    if (top < 0) {
      // Fallback: below the selection
      top = pixelY + lineHeight + 4;
      if (top + toolbarH > containerRect.height) {
        top = Math.max(0, containerRect.height - toolbarH - 4);
      }
    }

    // Horizontal: center near the selection end, clamp to container
    let left = pixelX - toolbarW / 2;
    if (left < 4) left = 4;
    if (left + toolbarW > containerRect.width - 4) {
      left = containerRect.width - toolbarW - 4;
    }

    return { top, left };
  }, [pixelX, pixelY, lineHeight, containerRef]);

  // Click outside to dismiss
  useEffect(() => {
    if (!visible) return;
    const handleClick = (e: MouseEvent) => {
      // 只响应左键：右键要留给终端右键菜单（复制/粘贴/AI 辅助），不能先把选区状态清掉
      if (e.button !== 0) return;
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [visible, onDismiss]);

  // Esc to dismiss
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [visible, onDismiss]);

  if (!visible || !selectedText) return null;

  return (
    <motion.div
      ref={toolbarRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 flex items-center gap-1 bg-scholar-800 border border-scholar-600 rounded-lg shadow-lg px-2 py-1.5"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button
        onClick={() => { onSendToAI(selectedText); onDismiss(); }}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-scholar-200 hover:text-scholar-50 hover:bg-scholar-700 rounded transition-colors whitespace-nowrap"
        title="发送选中内容给 AI"
      >
        <Send className="w-3 h-3" />
        发送给 AI
      </button>
      <button
        onClick={() => { onAnalyzeError(selectedText); onDismiss(); }}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-accent hover:text-accent-dark hover:bg-scholar-700 rounded transition-colors whitespace-nowrap"
        title="AI 分析报错"
      >
        <AlertCircle className="w-3 h-3" />
        分析报错
      </button>
    </motion.div>
  );
}
