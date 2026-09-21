import type { ReactNode } from 'react';
import { Activity, Cpu, HardDrive, Plus, Server } from 'lucide-react';
import ClusterTabStrip, { type ClusterTabItem } from './ClusterTabStrip';

interface ClusterConsoleProps {
  /** 集群标签（仅集群，不含本地工作台） */
  tabs: ClusterTabItem[];
  activeId: string | null;
  onSelectTab: (id: string) => void;
  onReorderTabs: (fromIndex: number, toIndex: number) => void;
  onCloseTab: (id: string) => void;
  onAddCluster: () => void;
  /** App 传入的保活终端集合（每集群一个，非活动 hidden） */
  terminalContent: ReactNode;
  /** App 传入的 JobsPanel */
  jobsContent: ReactNode;
  jobsOpen: boolean;
  onToggleJobs: () => void;
  onOpenFileTransfer: () => void;
  /** 打开算力后台抽屉（资源管理） */
  onOpenBackend: () => void;
  hasCluster: boolean;
}

/** 集群控制台：主区整页视图，终端占据主区域，作业面板在右侧可开合 */
export default function ClusterConsole({
  tabs,
  activeId,
  onSelectTab,
  onReorderTabs,
  onCloseTab,
  onAddCluster,
  terminalContent,
  jobsContent,
  jobsOpen,
  onToggleJobs,
  onOpenFileTransfer,
  onOpenBackend,
  hasCluster,
}: ClusterConsoleProps) {
  return (
    <div className="flex h-full flex-col">
      {/* 顶部工具条：集群标签 + 作业/文件传输/资源管理 */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-scholar-700 bg-scholar-950/60 px-3">
        {hasCluster && (
          <ClusterTabStrip
            tabs={tabs}
            activeId={activeId}
            onSelect={onSelectTab}
            onReorder={onReorderTabs}
            onClose={onCloseTab}
            onAdd={onAddCluster}
            size="md"
          />
        )}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleJobs}
            disabled={!hasCluster}
            aria-pressed={jobsOpen}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              jobsOpen && hasCluster
                ? 'bg-scholar-800 text-scholar-50'
                : 'text-scholar-400 hover:bg-scholar-800/60 hover:text-scholar-200'
            }`}
          >
            <Activity className="h-3.5 w-3.5" /> 作业
          </button>
          <button
            type="button"
            onClick={onOpenFileTransfer}
            disabled={!hasCluster}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-scholar-400 transition-colors hover:bg-scholar-800/60 hover:text-scholar-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HardDrive className="h-3.5 w-3.5" /> 文件传输
          </button>
          <button
            type="button"
            onClick={onOpenBackend}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-scholar-400 transition-colors hover:bg-scholar-800/60 hover:text-scholar-200"
          >
            <Cpu className="h-3.5 w-3.5" /> 资源管理
          </button>
        </div>
      </div>

      {/* 主体：终端 + 可选作业面板（relative：窄屏下面板改为遮罩式绝对定位） */}
      <div className="relative flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          {hasCluster ? terminalContent : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-scholar-800 text-scholar-400">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-scholar-200">尚未连接计算资源</p>
                <p className="mt-1 text-xs text-scholar-400">连接计算资源后即可使用终端与作业监控，没有计算资源也能用：本地 AI 可完成分析与对话</p>
              </div>
              <button type="button" onClick={onAddCluster} className="btn-primary">
                <Plus className="h-3.5 w-3.5" /> 添加计算资源
              </button>
            </div>
          )}
        </div>
        {jobsOpen && hasCluster && (
          // 窄屏（max-lg）下面板改为遮罩式浮层，避免固定 340px 把终端压没；宽屏保持并排
          <aside className="w-[340px] shrink-0 xl:w-[380px] max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:z-30 max-lg:shadow-2xl">
            {jobsContent}
          </aside>
        )}
      </div>
    </div>
  );
}
