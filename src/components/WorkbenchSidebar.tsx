import { useCallback, useEffect, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Cpu,
  Database,
  FolderTree,
  GitBranch,
  HardDrive,
  Loader2,
  MessageCircle,
  MessageSquare,
  Moon,
  Play,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings2,
  Sparkles,
  Sun,
} from 'lucide-react';
import type { FileEntry, PickPathKind } from '@/shared/fileTransfer';
import type { Workflow } from '@/shared/workflow';
import { WORKFLOW_CATEGORIES } from '@/shared/workflow';
import { listWorkflows } from '../features/workflows/api';
import type { ComputeBackendTarget } from './ComputeBackendDrawer';
import ConversationList from './ConversationList';
import ClusterFileTree from './ClusterFileTree';

export type WorkbenchSidebarTab = 'conversations' | 'compute' | 'files' | 'workflows' | 'webapis';

/** 主导航：四个主项横排在侧栏上部（图标在上、小字在下，像移动底栏） */
const NAV_ITEMS: Array<{ id: WorkbenchSidebarTab; label: string; icon: typeof MessageSquare }> = [
  { id: 'conversations', label: '对话', icon: MessageSquare },
  { id: 'compute', label: '计算资源', icon: Cpu },
  { id: 'files', label: '文件', icon: FolderTree },
  { id: 'workflows', label: '流程', icon: GitBranch },
];

/** 侧栏上部按当前 section 显示的标题（与主导航项同名，标明所在区） */
const SECTION_TITLES: Record<WorkbenchSidebarTab, string> = {
  conversations: '对话',
  compute: '计算资源',
  files: '文件',
  workflows: '流程',
  webapis: '数据资源',
};

/** 未设置 category 的流程归入“其他”组（与 WorkflowPanel 一致） */
const UNCATEGORIZED_CATEGORY = '其他';

/** 分类排序：7 个内置分类按固定顺序在前，自定义分类按字典序，“其他”垫底（与 WorkflowPanel 一致） */
function orderWorkflowCategories(categories: Iterable<string>): string[] {
  const present = new Set([...categories].map(c => c.trim()).filter(Boolean));
  const custom = [...present]
    .filter(c => c !== UNCATEGORIZED_CATEGORY && !(WORKFLOW_CATEGORIES as readonly string[]).includes(c))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));
  return [...WORKFLOW_CATEGORIES, ...custom, UNCATEGORIZED_CATEGORY].filter(c => present.has(c));
}

interface WorkbenchSidebarProps {
  activeTab: WorkbenchSidebarTab;
  onActiveTabChange: (tab: WorkbenchSidebarTab) => void;
  /** 已连接计算资源数量（>0 时在“计算资源”导航上显示徽标） */
  connectedComputeCount: number;
  /** 各导航项的未读提醒数（作业完成 → compute；AI 续跑 → conversations），缺省或 0 不显示 */
  unreadCounts?: Partial<Record<WorkbenchSidebarTab, number>>;
  onOpenQQBotSettings: () => void;
  onOpenUpdateCenter: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  sessionId?: string | null;
  home?: string;
  activeConversationId?: string | null;
  loadingConversationId?: string | null;
  conversationRefresh?: number;
  onLoadConversation: (id: string) => void;
  onNewConversation: () => void;
  onSelectWorkflow: (workflow: Workflow) => void;
  /** 打开流程管理页（新建/编辑/AI 生成/文献学习） */
  onManageWorkflows: () => void;
  selectedWorkflowId?: string | null;
  selectedPath?: string | null;
  onSelectPath: (entry: FileEntry) => void;
  pickMode?: boolean;
  /** 路径选取模式下的可选类型：只选文件 / 只选目录 / 均可（默认 folder，维持旧行为） */
  pickKind?: PickPathKind;
  onConfirmPick?: (path: string) => void;
  onCancelPick?: () => void;
  /** 计算目标清单（本地 AI 工作台 + 各已连接计算资源） */
  computeTargets: ComputeBackendTarget[];
  activeComputeTargetId: string;
  onSelectComputeTarget: (id: string) => void;
  onAddCluster: () => void;
  /** 打开资源管理抽屉（ComputeBackendDrawer） */
  onOpenComputeBackend: () => void;
}

export default function WorkbenchSidebar({
  activeTab,
  onActiveTabChange,
  connectedComputeCount,
  unreadCounts,
  onOpenQQBotSettings,
  onOpenUpdateCenter,
  theme,
  onToggleTheme,
  sessionId,
  home,
  activeConversationId,
  loadingConversationId,
  conversationRefresh,
  onLoadConversation,
  onNewConversation,
  onSelectWorkflow,
  onManageWorkflows,
  selectedWorkflowId,
  selectedPath,
  onSelectPath,
  pickMode,
  pickKind,
  onConfirmPick,
  onCancelPick,
  computeTargets,
  activeComputeTargetId,
  onSelectComputeTarget,
  onAddCluster,
  onOpenComputeBackend,
}: WorkbenchSidebarProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const [workflowError, setWorkflowError] = useState('');
  const [workflowSearch, setWorkflowSearch] = useState('');
  // 流程分组折叠状态：默认全部展开，记忆在组件内
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const refreshWorkflows = useCallback(async () => {
    setLoadingWorkflows(true);
    setWorkflowError('');
    try {
      setWorkflows(await listWorkflows());
    } catch (cause) {
      setWorkflowError(cause instanceof Error ? cause.message : '流程加载失败');
    } finally {
      setLoadingWorkflows(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'workflows' && workflows.length === 0) void refreshWorkflows();
  }, [activeTab, refreshWorkflows, workflows.length]);

  const visibleWorkflows = workflows.filter(workflow => {
    const query = workflowSearch.trim().toLowerCase();
    if (!query) return true;
    return `${workflow.name} ${workflow.description} ${workflow.keywords.join(' ')}`.toLowerCase().includes(query);
  });
  // 按分类分组（搜索筛选在前，空组不渲染）；组顺序与流程管理页一致
  const byCategory = new Map<string, Workflow[]>();
  for (const workflow of visibleWorkflows) {
    const category = workflow.category?.trim() || UNCATEGORIZED_CATEGORY;
    byCategory.set(category, [...(byCategory.get(category) || []), workflow]);
  }
  const groupedWorkflows = orderWorkflowCategories(byCategory.keys())
    .map(category => ({ category, items: byCategory.get(category)! }));

  return (
    <aside className="w-[288px] max-w-[34vw] min-w-[232px] h-full shrink-0 border-r border-scholar-700 bg-scholar-950 flex flex-col overflow-hidden">
      {/* 品牌块 */}
      <div className="flex shrink-0 items-center gap-2 px-4 pt-3.5 pb-1.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-semibold tracking-wide text-scholar-50">HPClaw</span>
      </div>

      <div className="px-3 pt-1.5 pb-2 shrink-0">
        {/* 区标题行：固定单行高度，动作（新任务/管理流程）收进同一行，
            各板块切换时导航与内容位置不再上下跳动 */}
        <div className="flex h-8 items-center justify-between gap-2 px-1">
          <p className="text-xs font-semibold tracking-wide text-scholar-200">{SECTION_TITLES[activeTab]}</p>
          {activeTab === 'conversations' && (
            <button
              type="button"
              onClick={onNewConversation}
              className="btn-ghost !text-[10px] !px-2 !py-1"
              title="新建对话任务"
            >
              <Plus className="h-3 w-3 text-accent" /> 新任务
            </button>
          )}
          {activeTab === 'workflows' && (
            <button type="button" onClick={onManageWorkflows} className="btn-ghost !text-[10px] !px-2 !py-1" title="管理流程（新建/编辑/AI 生成/文献学习）">
              <Settings2 className="w-3 h-3" /> 管理流程
            </button>
          )}
        </div>
      </div>

      {/* 主导航：对话 / 计算资源 / 文件 / 流程 —— 横排（图标在上、小字在下，省纵向空间） */}
      <nav className="shrink-0 grid grid-cols-4 gap-1 px-2 pb-2.5" aria-label="主导航">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = item.id === activeTab;
          const badge = item.id === 'compute' ? connectedComputeCount : 0;
          const unread = unreadCounts?.[item.id] ?? 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onActiveTabChange(item.id)}
              aria-pressed={active}
              title={item.label}
              className={`relative flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 transition-colors ${
                active ? 'bg-accent/15 text-scholar-50' : 'text-scholar-400 hover:bg-scholar-800/70 hover:text-scholar-200'
              }`}
            >
              <span className="relative">
                <Icon className={`h-4 w-4 ${active ? 'text-accent' : ''}`} />
                {(badge > 0 || unread > 0) && (
                  <span className={`absolute -top-1 -right-1.5 flex h-3 min-w-3 items-center justify-center rounded-full px-0.5 text-[8px] font-semibold leading-none ${
                    unread > 0 ? 'bg-red-500 text-white' : 'bg-scholar-600 text-scholar-200'
                  }`}>
                    {unread > 0 ? (unread > 99 ? '99+' : unread) : badge}
                  </span>
                )}
              </span>
              <span className={`text-[10px] leading-tight truncate max-w-full ${active ? 'text-scholar-100' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mx-3 h-px bg-scholar-700/70" />

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-scholar-900/35">
        {activeTab === 'conversations' && (
          <ConversationList
            isOpen
            embedded
            onClose={() => undefined}
            onLoad={onLoadConversation}
            activeConversationId={activeConversationId || null}
            loadingConversationId={loadingConversationId}
            onNewConversation={onNewConversation}
            refreshTrigger={conversationRefresh}
            sessionId={sessionId}
          />
        )}

        {activeTab === 'compute' && (
          <div className="h-full min-h-0 flex flex-col">
            <div className="px-3 py-2 border-b border-scholar-700/60">
              <p className="text-xs font-medium text-scholar-100">计算目标</p>
              <p className="mt-0.5 text-[10px] leading-4 text-scholar-400">没有计算资源也能用：本地 AI 可完成分析与对话</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {computeTargets.map(target => {
                const active = target.id === activeComputeTargetId;
                const Icon = target.kind === 'local' ? HardDrive : Server;
                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => onSelectComputeTarget(target.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2.5 text-left transition-colors ${
                      active ? 'border-accent/30 bg-accent/10' : 'border-transparent hover:bg-scholar-800'
                    }`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-accent/15 text-accent' : 'bg-scholar-800 text-scholar-400'}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-scholar-100">{target.label}</span>
                      <span className="mt-0.5 block truncate text-[10px] text-scholar-400">{target.detail}</span>
                    </span>
                    {active && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={onAddCluster}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-scholar-600 px-2.5 py-2 text-xs text-scholar-300 transition-colors hover:border-accent/40 hover:text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> 添加计算资源
              </button>
            </div>
            <div className="border-t border-scholar-700 px-3 py-2">
              <button
                type="button"
                onClick={onOpenComputeBackend}
                className="flex w-full items-center justify-between text-[11px] text-scholar-300 transition-colors hover:text-accent"
              >
                <span>资源管理</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <ClusterFileTree
            sessionId={sessionId}
            home={home}
            selectedPath={selectedPath}
            onSelect={onSelectPath}
            pickMode={pickMode}
            pickKind={pickKind}
            onConfirmPick={onConfirmPick}
            onCancelPick={onCancelPick}
          />
        )}

        {activeTab === 'webapis' && (
          <div className="px-3 py-3">
            <p className="text-xs font-medium text-scholar-100">网络数据资源</p>
            <p className="mt-1 text-[10px] leading-4 text-scholar-400">
              已集成公开生信数据库的 API，对话中提问即可调用；主区域可浏览接口、测试连通性
            </p>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="h-full min-h-0 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-scholar-700/60">
              <div>
                <p className="text-xs font-medium text-scholar-100">正式流程</p>
                <p className="text-[10px] text-scholar-400">选择后在主页面配置</p>
              </div>
              <div className="flex items-center gap-0.5">
                <button type="button" onClick={() => void refreshWorkflows()} className="btn-icon" aria-label="刷新流程" title="刷新流程">
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingWorkflows ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            <label className="relative mx-2 mt-2">
              <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-scholar-400" />
              <input
                value={workflowSearch}
                onChange={event => setWorkflowSearch(event.target.value)}
                className="w-full rounded-md border border-scholar-700 bg-scholar-950 py-1.5 pl-7 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
                placeholder="搜索流程..."
              />
            </label>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {loadingWorkflows && workflows.length === 0 && <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-accent" /></div>}
              {workflowError && <p className="p-2 text-[11px] text-red-500">{workflowError}</p>}
              {groupedWorkflows.map(group => {
                const collapsed = !!collapsedGroups[group.category];
                return (
                  <div key={group.category} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setCollapsedGroups(prev => ({ ...prev, [group.category]: !prev[group.category] }))}
                      className="flex w-full items-center gap-1 px-1 pt-1 text-left text-[10px] font-medium text-scholar-500 transition-colors hover:text-scholar-300"
                      aria-expanded={!collapsed}
                    >
                      {collapsed ? <ChevronRight className="h-3 w-3 shrink-0" /> : <ChevronDown className="h-3 w-3 shrink-0" />}
                      {group.category}（{group.items.length}）
                    </button>
                    {!collapsed && group.items.map(workflow => (
                      <div
                        key={workflow.id}
                        className={`group flex items-center gap-1 rounded-lg border transition-colors ${
                          workflow.id === selectedWorkflowId
                            ? 'border-accent/30 bg-accent/10'
                            : 'border-transparent hover:bg-scholar-800'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectWorkflow(workflow)}
                          title={workflow.description || `${workflow.steps.length} 个步骤`}
                          className="min-w-0 flex-1 px-2.5 py-1.5 text-left"
                        >
                          <span className="block text-xs font-medium text-scholar-100 truncate">{workflow.name}</span>
                        </button>
                        {/* 真按钮：与点条目同通路（选中并打开运行配置页），hover/聚焦时显现 */}
                        <button
                          type="button"
                          onClick={() => onSelectWorkflow(workflow)}
                          title="配置并运行"
                          aria-label="配置并运行"
                          className="mr-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-accent opacity-0 transition-opacity hover:bg-accent/15 group-hover:opacity-100 focus-visible:opacity-100"
                        >
                          <Play className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="px-3 py-2 border-t border-scholar-700 text-[10px] text-scholar-400">
              {visibleWorkflows.length} 个匹配流程
            </div>
          </div>
        )}
      </div>

      {/* 底部工具：主题 / QQ / 更新 / 数据资源——与主导航同款（图标在上、小字在下），
          避免窄空间下文字被挤成竖排 */}
      <div className="grid shrink-0 grid-cols-4 gap-1 border-t border-scholar-700 px-2 py-1.5">
        <button type="button" onClick={onToggleTheme} className="btn-ghost !px-1 !py-1.5 flex-col" title="切换主题" aria-label="切换主题">
          {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          <span className="text-[10px] leading-tight">主题</span>
        </button>
        <button type="button" onClick={() => onActiveTabChange('webapis')} className={`btn-ghost !px-1 !py-1.5 flex-col ${activeTab === 'webapis' ? 'text-accent' : ''}`} title="数据资源" aria-label="数据资源" aria-pressed={activeTab === 'webapis'}>
          <Database className="h-3.5 w-3.5" />
          <span className="text-[10px] leading-tight">资源</span>
        </button>
        <button type="button" onClick={onOpenQQBotSettings} className="btn-ghost !px-1 !py-1.5 flex-col" title="QQ 机器人" aria-label="QQ 机器人">
          <MessageCircle className="h-3.5 w-3.5" />
          <span className="text-[10px] leading-tight">QQ</span>
        </button>
        <button type="button" onClick={onOpenUpdateCenter} className="btn-ghost !px-1 !py-1.5 flex-col" title="软件更新" aria-label="软件更新">
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="text-[10px] leading-tight">更新</span>
        </button>
      </div>
    </aside>
  );
}
