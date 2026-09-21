import {
  Check,
  ChevronRight,
  Cpu,
  HardDrive,
  LogOut,
  Plus,
  Server,
  TerminalSquare,
  X,
} from 'lucide-react';

export interface ComputeBackendTarget {
  id: string;
  label: string;
  detail: string;
  kind: 'local' | 'cluster';
}

interface ComputeBackendDrawerProps {
  open: boolean;
  targets: ComputeBackendTarget[];
  activeTargetId: string;
  aiClusterControl: boolean;
  onClose: () => void;
  onSelectTarget: (id: string) => void;
  onAddCluster: () => void;
  onDisconnect: (id: string) => void;
  onToggleAiCluster: () => void;
  onOpenFileTransfer: () => void;
  onOpenTerminal: () => void;
}

/** 算力后台抽屉：资源管理（AI 计算资源执行开关 / 执行目标 / 终端与文件传输入口）。
    终端与作业面板已移至主区集群控制台（ClusterConsole）。 */
export default function ComputeBackendDrawer({
  open,
  targets,
  activeTargetId,
  aiClusterControl,
  onClose,
  onSelectTarget,
  onAddCluster,
  onDisconnect,
  onToggleAiCluster,
  onOpenFileTransfer,
  onOpenTerminal,
}: ComputeBackendDrawerProps) {
  const activeTarget = targets.find(target => target.id === activeTargetId) ?? targets[0];
  const clusterActive = activeTarget?.kind === 'cluster';

  return (
    <>
      <button
        type="button"
        aria-label="关闭算力后台"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(760px,92vw)] flex-col border-l border-scholar-700 bg-scholar-900 shadow-lg transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-scholar-700 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Cpu className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-scholar-50">算力后台</h2>
              <p className="truncate text-[11px] text-scholar-400">
                当前目标：{activeTarget?.label || '本地执行'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-icon" aria-label="关闭算力后台">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-5">
            <div className="mb-5 rounded-lg border border-accent/20 bg-accent/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-scholar-100">AI 计算资源执行</p>
                  <p className="mt-1 text-xs leading-5 text-scholar-400">
                    对话始终保留在工作台；开启后，AI 才会把计算命令发送到当前计算资源。
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-label="AI 计算资源执行"
                  aria-checked={clusterActive && aiClusterControl}
                  disabled={!clusterActive}
                  onClick={onToggleAiCluster}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    clusterActive && aiClusterControl ? 'bg-accent' : 'bg-scholar-600'
                  }`}
                >
                  <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
                    clusterActive && aiClusterControl ? 'left-6' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-scholar-200">执行目标</p>
                <p className="mt-0.5 text-[11px] text-scholar-500">切换目标不会切换或清空当前对话</p>
              </div>
              <button type="button" onClick={onAddCluster} className="btn-primary">
                <Plus className="h-3.5 w-3.5" /> 连接计算资源
              </button>
            </div>

            <div className="space-y-2">
              {targets.map(target => {
                const active = target.id === activeTargetId;
                const Icon = target.kind === 'local' ? HardDrive : Server;
                return (
                  <div
                    key={target.id}
                    className={`group flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                      active ? 'border-accent/35 bg-accent/8' : 'border-scholar-700 bg-scholar-950/45 hover:border-scholar-600'
                    }`}
                  >
                    <button type="button" onClick={() => onSelectTarget(target.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-accent/15 text-accent' : 'bg-scholar-800 text-scholar-400'}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-scholar-100">{target.label}</span>
                        <span className="mt-0.5 block truncate text-[11px] text-scholar-400">{target.detail}</span>
                      </span>
                      {active ? <Check className="h-4 w-4 shrink-0 text-accent" /> : <ChevronRight className="h-4 w-4 shrink-0 text-scholar-500" />}
                    </button>
                    {target.kind === 'cluster' && (
                      <button
                        type="button"
                        onClick={() => onDisconnect(target.id)}
                        className="btn-icon opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                        title="断开计算资源"
                        aria-label={`断开 ${target.label}`}
                      >
                        <LogOut className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!clusterActive}
                onClick={onOpenTerminal}
                className="flex items-center justify-between rounded-lg border border-scholar-700 bg-scholar-950/45 p-3 text-left text-xs text-scholar-200 transition-colors hover:border-scholar-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="flex items-center gap-2"><TerminalSquare className="h-4 w-4 text-accent" /> 打开终端</span>
                <ChevronRight className="h-3.5 w-3.5 text-scholar-500" />
              </button>
              <button
                type="button"
                disabled={!clusterActive}
                onClick={onOpenFileTransfer}
                className="flex items-center justify-between rounded-lg border border-scholar-700 bg-scholar-950/45 p-3 text-left text-xs text-scholar-200 transition-colors hover:border-scholar-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-accent" /> 文件传输</span>
                <ChevronRight className="h-3.5 w-3.5 text-scholar-500" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
