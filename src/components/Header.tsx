import { LogOut, Bot, FolderOpen, TerminalSquare, Sun, Moon, Activity, MessageCircle, RefreshCw } from 'lucide-react';
import { LanguageToggle } from '../i18n';
import { HPCLAW_DISPLAY_NAME, IS_COMPETITION_EDITION } from '../edition';

interface HeaderProps {
  username: string;
  host: string;
  port: string;
  connected: boolean;
  workspaceView: 'chat' | 'workflow' | 'cluster';
  activeRightPanel: 'history' | 'jobs' | null;
  onWorkspaceViewChange: (view: 'chat' | 'cluster') => void;
  onToggleRightPanel: (panel: 'history' | 'jobs') => void;
  onOpenFileTransfer: () => void;
  onOpenQQBotSettings: () => void;
  onOpenUpdateCenter: () => void;
  onLogout: () => void;
  aiClusterControl: boolean;
  onToggleAiCluster: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({
  username, host, port,
  connected, workspaceView, activeRightPanel,
  onWorkspaceViewChange, onToggleRightPanel, onOpenFileTransfer, onOpenQQBotSettings, onOpenUpdateCenter, onLogout,
  aiClusterControl, onToggleAiCluster, theme, onToggleTheme
}: HeaderProps) {
  return (
    <header className="bg-scholar-900 border-b border-scholar-700 pl-4 pr-3 py-2 flex items-center justify-between shrink-0">
      {/* ── 品牌 + 连接状态 ── */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <TerminalSquare className="w-4.5 h-4.5 text-accent" />
        </div>
        <div className="min-w-0">
          <h1 className="font-semibold text-scholar-50 text-sm font-sans tracking-wide leading-tight">{HPCLAW_DISPLAY_NAME}</h1>
          {IS_COMPETITION_EDITION && (
            <span className="inline-flex mt-0.5 rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-medium text-accent">轻量竞赛版</span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-scholar-400 leading-tight truncate">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${connected ? 'bg-emerald-500' : 'bg-scholar-500'}`}></span>
            <span className="truncate">{connected ? `${username}@${host}:${port}` : '本地 AI 工作台'}</span>
          </div>
        </div>
      </div>

      {/* ── 操作区 ── */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center rounded-lg bg-scholar-800 p-0.5 mr-1">
          <button
            type="button"
            onClick={() => onWorkspaceViewChange('chat')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${workspaceView !== 'cluster' ? 'bg-scholar-900 text-scholar-50 shadow-sm' : 'text-scholar-400 hover:text-scholar-200'}`}
            aria-pressed={workspaceView !== 'cluster'}
          >
            <Bot className="w-3.5 h-3.5" /> AI 工作台
          </button>
          <button
            type="button"
            onClick={() => onWorkspaceViewChange('cluster')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${workspaceView === 'cluster' ? 'bg-scholar-900 text-scholar-50 shadow-sm' : 'text-scholar-400 hover:text-scholar-200'}`}
            aria-pressed={workspaceView === 'cluster'}
          >
            <TerminalSquare className="w-3.5 h-3.5" /> 集群控制台
          </button>
        </div>
        <button
          onClick={() => onToggleRightPanel('jobs')}
          className="btn-icon"
          data-active={activeRightPanel === 'jobs'}
          title="作业监控"
          aria-label="作业监控"
        >
          <Activity className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={onOpenFileTransfer}
          className="btn-primary ml-1"
          disabled={!connected}
          title="打开文件传输工作区"
          aria-label="文件传输"
        >
          <FolderOpen className="w-4 h-4" />
          文件传输
        </button>

        <div className="w-px h-5 bg-scholar-600 mx-1.5" />

        <LanguageToggle />

        {/* 主题切换 */}
        <button
          onClick={onToggleTheme}
          className="btn-icon"
          title={theme === 'dark' ? '切换到白天模式' : '切换到黑夜模式'}
          aria-label={theme === 'dark' ? '切换到白天模式' : '切换到黑夜模式'}
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* QQ 机器人配置 */}
        <button
          onClick={onOpenQQBotSettings}
          className="btn-icon"
          title="QQ 机器人配置"
          aria-label="QQ 机器人配置"
        >
          <MessageCircle className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={onOpenUpdateCenter}
          className="btn-icon"
          title="软件更新"
          aria-label="软件更新"
        >
          <RefreshCw className="w-4.5 h-4.5" />
        </button>

        {/* AI 集群控制开关 */}
        <div className="flex items-center gap-1.5" title={aiClusterControl ? '允许 AI 在集群执行命令：已开启' : '允许 AI 在集群执行命令：已关闭'}>
          <span className="text-[10px] text-scholar-400 select-none">AI 控制</span>
          <button
            onClick={onToggleAiCluster}
            disabled={!connected}
            className={"relative w-9 h-5 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 " + (
              aiClusterControl ? 'bg-accent' : 'bg-scholar-600'
            )}
            role="switch"
            aria-checked={aiClusterControl}
            aria-label="AI 集群控制"
          >
            <span className={"absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all " + (
              aiClusterControl ? 'left-4.5' : 'left-0.5'
            )} />
          </button>
          <span className={"text-[10px] w-6 select-none " + (
            aiClusterControl ? 'text-accent font-medium' : 'text-scholar-500'
          )}>
            {aiClusterControl ? 'ON' : 'OFF'}
          </span>
        </div>

        <div className="w-px h-5 bg-scholar-600 mx-1.5" />

        <button
          onClick={onLogout}
          disabled={!connected}
          className="btn-icon hover:!bg-[rgb(var(--danger-rgb)/0.12)] hover:!text-[var(--color-danger)]"
          title="断开连接"
          aria-label="断开连接"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}
