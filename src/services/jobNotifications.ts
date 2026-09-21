// 作业完成提醒的公共工具：桌面通知（Electron 渲染进程原生支持 Web Notification，
// Windows 走系统 toast，窗口切后台也能收到）+ 应用内 toast 的载荷类型与辅助函数。
// 权限只在用户首次交互后请求一次；被拒绝或运行环境不支持时静默降级为应用内 toast。

/** 服务端 emitEvent 广播到 workflow-runs 房间的 job:finished 事件载荷（JobEvent） */
export interface JobFinishedPayload {
  jobId: string;
  name: string;
  status: 'DONE' | 'EXIT';
  finishedAt?: number;
  excerpt?: string;
}

/** 服务端 dsh 续跑后广播的 ai:resumed 事件载荷 */
export interface AiResumedPayload {
  type?: string;
  conversationId?: string;
  jobId?: string;
  preview?: string;
}

/** 应用内右下角浮层通知条目 */
export interface JobToastItem {
  id: number;
  kind: 'job' | 'ai';
  /** 标题行：作业名或 AI 续跑说明 */
  title: string;
  /** 次行：jobId · excerpt 首行 / AI 答复预览 */
  body?: string;
  status?: 'DONE' | 'EXIT';
  time: number;
  conversationId?: string;
}

/** toast 自动消失时长（毫秒） */
export const JOB_TOAST_DURATION_MS = 6_000;
/** 右下角最多同时叠放的 toast 条数，超出丢弃最旧 */
export const JOB_TOAST_MAX_VISIBLE = 3;

let permissionRequestStarted = false;

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.Notification !== 'undefined';
}

/**
 * 在用户有过交互后调用（如 pointerdown 一次性监听）：权限处于 default 时发起请求，
 * 同一会话只请求一次；被拒绝/不支持时不再打扰，后续桌面通知自动跳过。
 */
export function ensureNotificationPermission(): void {
  if (!notificationsSupported()) return;
  if (Notification.permission !== 'default' || permissionRequestStarted) return;
  permissionRequestStarted = true;
  try {
    const result = Notification.requestPermission() as unknown as Promise<unknown> | undefined;
    // 旧的回调式实现不返回 Promise；Promise 被拒绝时允许下次交互再试
    result?.catch?.(() => { permissionRequestStarted = false; });
  } catch {
    permissionRequestStarted = false;
  }
}

/** 构造系统桌面通知；未授权/不支持/构造失败时返回 null（静默降级） */
export function showDesktopNotification(title: string, body: string, onClick?: () => void): Notification | null {
  if (!notificationsSupported() || Notification.permission !== 'granted') return null;
  try {
    const notification = new Notification(title, { body });
    if (onClick) {
      notification.onclick = () => {
        try { window.focus(); } catch { /* 焦点不可用时仍执行跳转 */ }
        onClick();
      };
    }
    return notification;
  } catch {
    return null;
  }
}

/** 取输出摘要的第一个非空行（限长），用于通知正文 */
export function firstExcerptLine(excerpt?: string): string {
  if (!excerpt) return '';
  const line = excerpt.split('\n').map(item => item.trim()).find(Boolean) ?? '';
  return line.length > 120 ? `${line.slice(0, 120)}…` : line;
}

/**
 * 事件去重：同一 key 在窗口期内重复出现返回 true（调用方应跳过）。
 * 防止同一作业完成事件经多条路径（重连后的 socket、StrictMode 重挂监听）重复提醒。
 */
export function createEventDeduper(windowMs = 5_000): (key: string) => boolean {
  const seen = new Map<string, number>();
  return (key: string) => {
    const now = Date.now();
    for (const [k, at] of seen) {
      if (now - at > windowMs) seen.delete(k);
    }
    if (seen.has(key)) return true;
    seen.set(key, now);
    return false;
  };
}
