// 作业完成 / AI 续跑提醒中枢：挂在 App 根部的全局 effect。
// 对每个活跃计算资源 socket 监听 job:finished（服务端 emitEvent 广播到 workflow-runs
// 房间的 JobEvent）与 ai:resumed（AIChat 只消费指向当前对话的，这里兜底非当前对话），
// 产出三类提醒：Web 桌面通知（窗口切后台也有效）、应用内右下角 toast、侧栏主导航未读角标。
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type { WorkbenchSidebarTab } from '../components/WorkbenchSidebar';
import {
  createEventDeduper,
  ensureNotificationPermission,
  firstExcerptLine,
  JOB_TOAST_DURATION_MS,
  JOB_TOAST_MAX_VISIBLE,
  showDesktopNotification,
  type AiResumedPayload,
  type JobFinishedPayload,
  type JobToastItem,
} from '../services/jobNotifications';

export interface UseJobNotificationCenterOptions {
  /** App 的 sockets state：按 sessionId 的活跃计算资源 socket 字典 */
  sockets: Record<string, Socket>;
  workbenchSidebarTab: WorkbenchSidebarTab;
  /** 当前对话 id（本地工作台标签）；ai:resumed 指向它时交给 AIChat 自己刷新 */
  activeConversationId: string | null;
  /** 跳到计算资源视图并展开作业面板 */
  onOpenJobsView: () => void;
  /** 打开指定对话（经 App 的 handleLoadConversation） */
  onOpenConversation: (conversationId: string) => void;
  t: (value: string) => string;
}

export interface JobNotificationCenter {
  toasts: JobToastItem[];
  /** “计算资源”导航项未读角标：不在计算资源视图时收到 job:finished 计数 +1，进入视图清零 */
  jobUnread: number;
  /** “对话”导航项未读角标：指向非当前对话的 ai:resumed 计数，打开对应对话后移除 */
  conversationUnread: number;
  dismissToast: (id: number) => void;
  /** 点击 toast：作业类跳作业面板，AI 类打开对应对话 */
  activateToast: (toast: JobToastItem) => void;
}

export function useJobNotificationCenter({
  sockets,
  workbenchSidebarTab,
  activeConversationId,
  onOpenJobsView,
  onOpenConversation,
  t,
}: UseJobNotificationCenterOptions): JobNotificationCenter {
  const [toasts, setToasts] = useState<JobToastItem[]>([]);
  const [jobUnread, setJobUnread] = useState(0);
  // AI 续跑指向的非当前对话 id 列表；角标计数 = 列表长度
  const [pendingAiConversations, setPendingAiConversations] = useState<string[]>([]);
  const toastIdRef = useRef(0);
  const toastTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const notifyDeduperRef = useRef<((key: string) => boolean) | null>(null);
  if (!notifyDeduperRef.current) notifyDeduperRef.current = createEventDeduper();
  // socket 处理器经 ref 读最新视图/对话状态，避免视图切换导致监听重挂
  const workbenchSidebarTabRef = useRef(workbenchSidebarTab);
  workbenchSidebarTabRef.current = workbenchSidebarTab;
  const activeConversationIdRef = useRef(activeConversationId);
  activeConversationIdRef.current = activeConversationId;

  const dismissToast = useCallback((id: number) => {
    const timer = toastTimersRef.current.get(id);
    if (timer) clearTimeout(timer);
    toastTimersRef.current.delete(id);
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const pushToast = useCallback((toast: Omit<JobToastItem, 'id'>) => {
    const id = ++toastIdRef.current;
    setToasts(prev => {
      const next = [...prev, { ...toast, id }];
      const overflow = next.length - JOB_TOAST_MAX_VISIBLE;
      if (overflow <= 0) return next;
      // 超出的最旧条目连其自动消失定时器一起丢弃
      for (const dropped of next.slice(0, overflow)) {
        const timer = toastTimersRef.current.get(dropped.id);
        if (timer) clearTimeout(timer);
        toastTimersRef.current.delete(dropped.id);
      }
      return next.slice(overflow);
    });
    toastTimersRef.current.set(id, setTimeout(() => dismissToast(id), JOB_TOAST_DURATION_MS));
  }, [dismissToast]);

  // 桌面通知权限：用户首次交互后请求一次（拒绝/不支持则静默降级，仅靠应用内 toast）
  useEffect(() => {
    const ask = () => ensureNotificationPermission();
    window.addEventListener('pointerdown', ask, { once: true });
    return () => window.removeEventListener('pointerdown', ask);
  }, []);

  useEffect(() => () => {
    for (const timer of toastTimersRef.current.values()) clearTimeout(timer);
    toastTimersRef.current.clear();
  }, []);

  // 进入计算资源视图即清零作业未读角标
  useEffect(() => {
    if (workbenchSidebarTab === 'compute') setJobUnread(0);
  }, [workbenchSidebarTab]);

  // 对话被打开后从 AI 续跑待读列表移除（含 toast 点击跳转与手动切换两条路径）
  useEffect(() => {
    if (!activeConversationId) return;
    setPendingAiConversations(prev => (
      prev.includes(activeConversationId) ? prev.filter(item => item !== activeConversationId) : prev
    ));
  }, [activeConversationId]);

  // 对每个活跃计算资源 socket 挂 job:finished / ai:resumed 监听（注意解绑）
  useEffect(() => {
    const dedup = notifyDeduperRef.current!;
    const cleanups = Object.values(sockets).map(socket => {
      const onJobFinished = (payload: JobFinishedPayload) => {
        if (!payload || typeof payload.jobId !== 'string' || !payload.name) return;
        if (dedup(`job:${payload.jobId}:${payload.status}`)) return;
        if (workbenchSidebarTabRef.current !== 'compute') setJobUnread(count => count + 1);
        const statusLabel = payload.status === 'EXIT' ? t('作业异常结束') : t('作业完成');
        const title = `${statusLabel} · ${payload.status} · ${payload.name}`;
        const body = [`#${payload.jobId}`, firstExcerptLine(payload.excerpt)].filter(Boolean).join(' · ');
        pushToast({ kind: 'job', title, body, status: payload.status, time: payload.finishedAt ?? Date.now() });
        showDesktopNotification(title, body, onOpenJobsView);
      };
      const onAiResumed = (payload: AiResumedPayload) => {
        const conversationId = payload?.conversationId;
        if (!conversationId || conversationId === activeConversationIdRef.current) return;
        if (dedup(`ai:${payload.jobId || ''}:${conversationId}`)) return;
        setPendingAiConversations(prev => (prev.includes(conversationId) ? prev : [...prev, conversationId]));
        const title = `${t('AI 已继续处理作业')}${payload.jobId ? ` #${payload.jobId}` : ''}`;
        pushToast({ kind: 'ai', title, body: payload.preview, time: Date.now(), conversationId });
        showDesktopNotification(title, payload.preview || '', () => onOpenConversation(conversationId));
      };
      socket.on('job:finished', onJobFinished);
      socket.on('ai:resumed', onAiResumed);
      return () => {
        socket.off('job:finished', onJobFinished);
        socket.off('ai:resumed', onAiResumed);
      };
    });
    return () => { for (const cleanup of cleanups) cleanup(); };
  }, [sockets, t, pushToast, onOpenJobsView, onOpenConversation]);

  const activateToast = useCallback((toast: JobToastItem) => {
    dismissToast(toast.id);
    if (toast.kind === 'ai' && toast.conversationId) onOpenConversation(toast.conversationId);
    else onOpenJobsView();
  }, [dismissToast, onOpenConversation, onOpenJobsView]);

  return {
    toasts,
    jobUnread,
    conversationUnread: pendingAiConversations.length,
    dismissToast,
    activateToast,
  };
}
