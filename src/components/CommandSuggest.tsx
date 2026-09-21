import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Suggestion } from '../services/aiTerminal';
import { useI18n } from '../i18n';

interface CommandSuggestProps {
  suggestions: Suggestion[];
  cursorPixelX: number;
  cursorPixelY: number;
  lineHeight: number;
  charWidth: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onAccept: (completion: string) => void;
  onDismiss: () => void;
  commandComplete?: boolean;
}

export default function CommandSuggest({
  suggestions,
  cursorPixelX,
  cursorPixelY,
  lineHeight,
  charWidth,
  containerRef,
  onAccept,
  onDismiss,
  commandComplete = false,
}: CommandSuggestProps) {
  const { isEnglish } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions]);

  // Auto-scroll active suggestion into view
  useEffect(() => {
    if (!dropdownRef.current) return;
    const activeEl = dropdownRef.current.children[activeIndex] as HTMLElement | undefined;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // ─── Viewport-aware dropdown positioning ────────────────────────────
  const adjustedPosition = useMemo(() => {
    const container = containerRef.current;
    if (!container) {
      return { top: cursorPixelY + lineHeight + 4, left: cursorPixelX };
    }

    const containerRect = container.getBoundingClientRect();
    const MARGIN = 8;

    // Estimated dropdown size (capped, with footer)
    const estItemH = 40; // line per suggestion including explanation
    const estFooterH = 28;
    const estFullH = Math.min(suggestions.length * estItemH + estFooterH, 280);
    const dropdownEl = dropdownRef.current;
    const dropdownWidth = dropdownEl ? dropdownEl.offsetWidth : 320;
    const dropdownHeight = dropdownEl ? dropdownEl.offsetHeight : estFullH;

    const spaceBelow = containerRect.height - cursorPixelY - lineHeight - MARGIN;
    const spaceAbove = cursorPixelY - MARGIN;

    let top: number;
    let actualMaxH: number;

    if (spaceBelow >= dropdownHeight) {
      // Enough space below cursor — show below
      top = cursorPixelY + lineHeight + MARGIN;
      actualMaxH = spaceBelow;
    } else if (spaceAbove >= dropdownHeight) {
      // Not enough below but enough above — flip
      top = cursorPixelY - dropdownHeight - MARGIN;
      actualMaxH = spaceAbove;
    } else if (spaceBelow >= spaceAbove) {
      // Neither fits fully — use whichever is larger
      top = cursorPixelY + lineHeight + MARGIN;
      actualMaxH = Math.max(spaceBelow, 0);
    } else {
      top = Math.max(0, cursorPixelY - dropdownHeight - MARGIN);
      actualMaxH = Math.max(spaceAbove, 0);
    }

    // Clamp top within container
    top = Math.max(0, Math.min(top, containerRect.height - 40));

    // Horizontal
    let left = cursorPixelX;
    if (left + dropdownWidth > containerRect.width - 4) {
      left = Math.max(4, containerRect.width - dropdownWidth - 8);
    }
    left = Math.max(4, left);

    return { top, left, maxWidth: containerRect.width - left - 8, maxHeight: actualMaxH };
  }, [cursorPixelX, cursorPixelY, suggestions.length, lineHeight, containerRef]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (commandComplete) return; // Let Tab pass through to shell
      e.preventDefault();
      e.stopPropagation();
      if (suggestions[activeIndex]) {
        onAccept(suggestions[activeIndex].completion);
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onDismiss();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex(prev => Math.max(prev - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (suggestions[activeIndex]) {
        onAccept(suggestions[activeIndex].completion);
      }
      return;
    }
    // Any other typing key — dismiss
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      onDismiss();
    }
  }, [suggestions, activeIndex, onAccept, onDismiss]);

  useEffect(() => {
    if (suggestions.length === 0 || commandComplete) return;
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown, suggestions.length, commandComplete]);

  if (suggestions.length === 0 || commandComplete) return null;

  const topSuggestion = suggestions[0];

  // Detect dangerous commands for red warning
  const isDangerous = (completion: string) =>
    /\b(rm\s|delete|rmdir|kill\s-9|fdisk|dd\sif|mkfs\.|:\(\)|chmod\s777)/i.test(completion);

  return (
    <>
      {/* Ghost text overlay — inline at exact cursor position */}
      <div
        className="absolute pointer-events-none z-40 select-none overflow-hidden whitespace-nowrap"
        style={{
          left: `${cursorPixelX}px`,
          top: `${cursorPixelY}px`,
          height: `${lineHeight}px`,
          lineHeight: `${lineHeight}px`,
          maxWidth: 'calc(100% - 16px)',
        }}
      >
        <span
          className="font-mono text-sm text-scholar-500 opacity-40"
        >
          {topSuggestion.completion}
        </span>
      </div>

      {/* Dropdown — viewport-aware positioning */}
      <div
        ref={dropdownRef}
        className="absolute z-50 bg-scholar-800 border border-scholar-600 rounded-lg shadow-lg overflow-y-auto"
        style={{
          left: `${adjustedPosition.left}px`,
          top: `${adjustedPosition.top}px`,
          minWidth: '280px',
          maxWidth: `${Math.min(adjustedPosition.maxWidth || 520, 520)}px`,
          maxHeight: `${adjustedPosition.maxHeight || 280}px`,
        }}
      >
        {suggestions.map((s, i) => {
          const danger = isDangerous(s.completion);
          return (
            <div
              key={i}
              className={`px-3 py-2 cursor-pointer font-mono text-xs border-b border-scholar-700/50 last:border-b-0 transition-colors ${
                i === activeIndex
                  ? 'bg-accent/20'
                  : 'hover:bg-scholar-700'
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => onAccept(s.completion)}
            >
              <div className={i === activeIndex ? 'text-accent-dark font-medium' : 'text-scholar-200'}>
                {i === activeIndex ? '\u25B6 ' : '  '}{s.completion}
              </div>
              <div className={`text-[11px] mt-0.5 ml-4 ${danger ? 'text-red-600' : 'text-scholar-400'}`}>
                {danger ? '\u26A0 ' : ''}{isEnglish && /[\u3400-\u9fff]/.test(s.explanation)
                  ? (danger ? 'Potentially destructive command' : 'Command suggestion')
                  : s.explanation}
              </div>
            </div>
          );
        })}

        {/* Footer hint */}
        <div className="px-3 py-1.5 text-[10px] text-scholar-500 bg-scholar-900/50 border-t border-scholar-700/30 flex gap-3">
          <span>Tab 补全</span>
          <span>\u2191\u2193 浏览</span>
          <span>Esc 关闭</span>
        </div>
      </div>
    </>
  );
}
