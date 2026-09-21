import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FolderOpen,
  Loader2,
  RefreshCw,
  Save,
  X,
} from 'lucide-react';
import type { UpdateSettings, UpdateState } from '../types/desktop';

interface UpdateCenterDialogProps {
  onClose: () => void;
}

const initialState: UpdateState = {
  phase: 'idle',
  currentVersion: '—',
  availableVersion: '',
  percent: 0,
  bytesPerSecond: 0,
  transferred: 0,
  total: 0,
  message: '正在读取更新状态…',
  updateUrl: '',
  autoCheck: true,
  configured: false,
  supported: false,
};

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(units.length - 1, Math.floor(Math.log(value) / Math.log(1024)));
  return `${(value / (1024 ** index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function UpdateCenterDialog({ onClose }: UpdateCenterDialogProps) {
  const updater = window.hpclawDesktop?.updates;
  const [state, setState] = useState<UpdateState>(initialState);
  const [settings, setSettings] = useState<UpdateSettings>({ updateUrl: '', autoCheck: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!updater) {
      setState(previous => ({ ...previous, message: '更新中心仅在 HPClaw 桌面版中可用' }));
      return;
    }
    let active = true;
    const stop = updater.onStatus(next => {
      if (active) setState(next);
    });
    Promise.all([updater.getState(), updater.getSettings()])
      .then(([nextState, nextSettings]) => {
        if (!active) return;
        setState(nextState);
        setSettings(nextSettings);
      })
      .catch(reason => {
        if (active) setError(reason instanceof Error ? reason.message : String(reason));
      });
    return () => {
      active = false;
      stop();
    };
  }, [updater]);

  const run = async (operation: () => Promise<UpdateState>) => {
    setBusy(true);
    setError('');
    try {
      setState(await operation());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  };

  const saveSettings = async () => {
    if (!updater) return;
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      const next = await updater.saveSettings(settings);
      setSettings(next);
      setState(await updater.getState());
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  };

  const activeOperation = busy || ['checking', 'downloading', 'installing'].includes(state.phase);
  const statusTone = state.phase === 'error'
    ? 'border-red-500/40 bg-red-500/5 text-red-400'
    : state.phase === 'downloaded' || state.phase === 'not-available'
      ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
      : 'border-scholar-700 bg-scholar-900/70 text-scholar-300';

  return (
    <div className="fixed inset-0 z-50 bg-scholar-950/75 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-lg border border-scholar-600 bg-scholar-800 shadow-lg" onClick={event => event.stopPropagation()}>
        <div className="px-4 py-3 border-b border-scholar-700 flex items-center gap-2 sticky top-0 bg-scholar-800 z-10">
          <RefreshCw className="w-4.5 h-4.5 text-accent" />
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-scholar-100">软件更新</h2>
            <p className="text-[10px] text-scholar-500">当前版本 {state.currentVersion}</p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="关闭更新中心"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className={`rounded-lg border px-3 py-3 flex items-start gap-2 ${statusTone}`}>
            {activeOperation
              ? <Loader2 className="w-4 h-4 animate-spin shrink-0 mt-0.5" />
              : state.phase === 'downloaded' || state.phase === 'not-available'
                ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                : state.phase === 'error'
                  ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  : <RefreshCw className="w-4 h-4 shrink-0 mt-0.5" />}
            <div className="min-w-0 flex-1">
              <p className="text-xs leading-relaxed">{state.message}</p>
              {state.availableVersion && state.availableVersion !== state.currentVersion && (
                <p className="text-[10px] mt-1 opacity-80">可用版本：{state.availableVersion}</p>
              )}
            </div>
          </div>

          {(state.phase === 'downloading' || state.phase === 'downloaded') && (
            <div>
              <div className="h-2 rounded-full bg-scholar-700 overflow-hidden">
                <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${state.percent}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-scholar-500">
                <span>{Math.round(state.percent)}%</span>
                <span>{state.total > 0 ? `${formatBytes(state.transferred)} / ${formatBytes(state.total)}` : ''}{state.bytesPerSecond > 0 ? ` · ${formatBytes(state.bytesPerSecond)}/s` : ''}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              className="btn-primary justify-center"
              disabled={!updater || !state.supported || !settings.updateUrl || activeOperation}
              onClick={() => updater && void run(updater.check)}
            >
              {state.phase === 'checking' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              检查更新
            </button>
            {state.phase === 'available' ? (
              <button className="btn-primary justify-center" disabled={!updater || activeOperation} onClick={() => updater && void run(updater.download)}>
                <Download className="w-4 h-4" />下载更新
              </button>
            ) : state.phase === 'downloaded' ? (
              <button className="btn-primary justify-center" disabled={!updater || activeOperation} onClick={() => updater && void run(updater.install)}>
                <Download className="w-4 h-4" />安装并重启
              </button>
            ) : (
              <button className="btn-ghost justify-center" disabled={!updater || activeOperation} onClick={() => updater && void run(updater.pickAndInstall)}>
                <FolderOpen className="w-4 h-4" />选择本地安装包
              </button>
            )}
          </div>

          <div className="border-t border-scholar-700 pt-4 space-y-3">
            <div>
              <label className="block text-xs text-scholar-300 mb-1">更新服务器地址</label>
              <input
                type="url"
                value={settings.updateUrl}
                onChange={event => setSettings(previous => ({ ...previous, updateUrl: event.target.value }))}
                placeholder="https://example.com/hpclaw/updates/"
                className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
              <p className="mt-1 text-[10px] text-scholar-500 leading-relaxed">
                地址中需放置 latest.yml、安装包和 blockmap。没有服务器时，可直接使用上方“选择本地安装包”。
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs text-scholar-300">
              <input
                type="checkbox"
                checked={settings.autoCheck}
                onChange={event => setSettings(previous => ({ ...previous, autoCheck: event.target.checked }))}
              />
              启动后自动检查，并每 6 小时检查一次
            </label>
            <button className="btn-ghost w-full justify-center" disabled={!updater || busy} onClick={() => void saveSettings()}>
              {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
              {saved ? '已保存' : '保存更新设置'}
            </button>
          </div>

          {error && <p className="text-xs text-red-400 flex items-start gap-1.5"><AlertCircle className="w-4 h-4 shrink-0" />{error}</p>}
          {!state.supported && updater && (
            <p className="text-[10px] text-amber-400 leading-relaxed">当前运行的不是安装版，不能使用在线增量更新；仍可选择本地安装包升级。</p>
          )}
        </div>
      </div>
    </div>
  );
}
