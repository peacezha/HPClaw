import { useState } from 'react';
import { Plus, X, Server } from 'lucide-react';

export interface ClusterTabItem {
  id: string;
  label: string;
  sublabel?: string;
  closable?: boolean;
}

interface ClusterTabStripProps {
  tabs: ClusterTabItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  /** 拖拽排序：把 fromIndex 的标签移动到 toIndex */
  onReorder: (fromIndex: number, toIndex: number) => void;
  onClose?: (id: string) => void;
  onAdd?: () => void;
  /** sm = 传输工作区抽屉内的紧凑样式 */
  size?: 'sm' | 'md';
}

/** 集群标签条：点击切换，可左右拖拽排序，可关闭/新增 */
export default function ClusterTabStrip({
  tabs, activeId, onSelect, onReorder, onClose, onAdd, size = 'md',
}: ClusterTabStripProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const resetDrag = () => { setDragIndex(null); setOverIndex(null); };

  return (
    <div className="cluster-tab-strip flex items-center gap-0.5 overflow-x-auto min-w-0" role="tablist">
      {tabs.map((tab, i) => {
        const isActive = tab.id === activeId;
        const isDropTarget = overIndex === i && dragIndex !== null && dragIndex !== i;
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            draggable
            onDragStart={e => {
              setDragIndex(i);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', tab.id);
            }}
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOverIndex(i); }}
            onDragLeave={() => setOverIndex(prev => (prev === i ? null : prev))}
            onDrop={e => {
              e.preventDefault();
              if (dragIndex !== null && dragIndex !== i) onReorder(dragIndex, i);
              resetDrag();
            }}
            onDragEnd={resetDrag}
            onClick={() => onSelect(tab.id)}
            title={tab.sublabel || tab.label}
            className={`group flex items-center gap-1.5 ${size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5'} rounded-t-lg cursor-pointer select-none border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-scholar-800 text-scholar-100 border-accent'
                : 'text-scholar-400 hover:text-scholar-200 hover:bg-scholar-800/50 border-transparent'
            } ${isDropTarget ? 'border-l-2 !border-l-accent' : ''} ${dragIndex === i ? 'opacity-40' : ''}`}
          >
            <Server className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} shrink-0 ${isActive ? 'text-accent' : ''}`} />
            <span className={`${size === 'sm' ? 'text-[11px]' : 'text-xs'} font-medium max-w-40 truncate`}>{tab.label}</span>
            {onClose && tab.closable !== false && (
              <button
                onClick={e => { e.stopPropagation(); onClose(tab.id); }}
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-scholar-500 hover:text-red-500 transition-all shrink-0"
                aria-label={`断开 ${tab.label}`}
                title="断开并关闭"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center justify-center w-7 h-7 ml-0.5 rounded-lg text-scholar-400 hover:text-scholar-100 hover:bg-scholar-800 transition-colors shrink-0"
          aria-label="添加计算资源"
          title="添加计算资源"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
