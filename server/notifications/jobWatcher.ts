// 作业监控器：按会话标签的调度器（LSF bjobs / Slurm squeue / PBS qstat / 无）轮询，检测作业完成（DONE/EXIT/消失），产生事件并触发通知。
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { dataPath } from '../paths';
import {
  loadSchedulerType, jobsCommand, parseJobsOutput, lsfFinalStateCommand, slurmFinalStateCommand,
  pbsFinalStateCommand, lsfOutputTailCommand, slurmOutputTailCommand, type SchedulerType,
} from './scheduler';
import type { JobEntry } from '../ai/types';
import { loadNotifyConfig, sendNotification, type NotifyConfig } from './notifyService';

export interface JobEvent {
  jobId: string;
  name: string;
  status: 'DONE' | 'EXIT';
  queue: string;
  time: number;
  notified: boolean;
  notifyError?: string;
  /** 作业输出尾部摘要（bpeek/slurm-out 尾部，截断 ~2000 字符）；无输出或读取失败时缺省。 */
  excerpt?: string;
}

const EVENTS_PATH = dataPath('job-events.json');
const MAX_EVENTS = 50;
/** JobEvent.excerpt 的字符上限（命令已 tail 30 行，超长时保留最末尾——结果通常在最后）。 */
const EXCERPT_MAX_CHARS = 2000;
/** 已通知作业 ID 去重集合上限：桌面应用长期运行只增不减会膨胀，超出时淘汰最早插入的 */
const MAX_NOTIFIED_JOB_IDS = 1000;

export async function loadJobEvents(): Promise<JobEvent[]> {
  try {
    const raw = await fs.readFile(EVENTS_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveJobEvents(events: JobEvent[]): Promise<void> {
  await fs.mkdir(path.dirname(EVENTS_PATH), { recursive: true });
  const tmp = `${EVENTS_PATH}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(events.slice(0, MAX_EVENTS), null, 2), 'utf-8');
  await fs.rename(tmp, EVENTS_PATH);
}

/**
 * 对比前后两次 bjobs 快照，找出"新完成"的作业。
 * - 上次在跑（RUN/PEND/UNKNOWN），这次 DONE/EXIT → 完成
 * - 上次在跑，这次消失 → 完成（状态用 bjobs -l 补查，查不到按 DONE 处理由调用方决定）
 */
export function detectFinishedJobs(
  prev: JobEntry[],
  next: JobEntry[],
): { jobId: string; name: string; status: 'DONE' | 'EXIT'; queue: string }[] {
  const nextById = new Map(next.map(j => [j.jobId, j]));
  const finished: { jobId: string; name: string; status: 'DONE' | 'EXIT'; queue: string }[] = [];
  for (const p of prev) {
    if (p.status === 'DONE' || p.status === 'EXIT') continue; // 早已完成
    const n = nextById.get(p.jobId);
    if (!n) {
      // 从 bjobs 消失 = 已结束（LSF 完成作业会滚出默认列表）
      finished.push({ jobId: p.jobId, name: p.name, status: 'DONE', queue: p.queue });
    } else if (n.status === 'DONE' || n.status === 'EXIT') {
      finished.push({ jobId: p.jobId, name: n.name || p.name, status: n.status, queue: n.queue || p.queue });
    }
  }
  return finished;
}

export interface WatchSessionLike {
  cluster: { exec: (cmd: string, timeout?: number) => Promise<string>; state?: string };
  username: string;
  /** 该账号登录时探测并打标签的调度器；缺省回退到全局手动配置 */
  scheduler?: SchedulerType;
}

interface WatcherDeps {
  emitEvent?: (event: JobEvent, sessionId: string) => void;
  getNotifyConfig?: () => Promise<NotifyConfig>;
  notify?: (config: NotifyConfig, title: string, content: string) => Promise<{ ok: boolean; error?: string }>;
  /**
   * 首轮基线判定用：该作业是否挂着"尚未唤醒"的 job-agent 绑定（重启恢复场景）。
   * 有绑定的作业即使首轮即终态也要发事件，让唤醒链路闭合；无绑定的历史作业维持静默基线。
   */
  hasPendingBinding?: (sessionId: string, jobId: string) => boolean;
}

export class JobWatcher {
  private timers = new Map<string, ReturnType<typeof setInterval>>();
  private sessions = new Map<string, WatchSessionLike>();
  private prevJobs = new Map<string, JobEntry[]>();
  private notifiedJobIds = new Set<string>();

  constructor(private deps: WatcherDeps = {}) {}

  /** 运行期更新依赖（实时推送等） */
  configure(deps: WatcherDeps): void {
    this.deps = { ...this.deps, ...deps };
  }

  /** 开始监控某个集群会话的作业 */
  start(sessionId: string, session: WatchSessionLike, intervalMs = 45_000): void {
    this.sessions.set(sessionId, session);
    if (this.timers.has(sessionId)) return;
    void this.poll(sessionId, session);
    const timer = setInterval(() => void this.poll(sessionId, session), intervalMs);
    this.timers.set(sessionId, timer);
  }

  /** 用户手动重探调度器后同步到在跑的监控会话 */
  setScheduler(sessionId: string, scheduler: SchedulerType): void {
    const session = this.sessions.get(sessionId);
    if (session) session.scheduler = scheduler;
  }

  /**
   * Agent 拿到提交回执时立即登记作业，避免短作业在两个 45 秒轮询之间
   * 提交并结束后既没进入上次快照、也不会触发终态事件。
   */
  trackJobs(sessionId: string, jobIds: string[]): void {
    const prev = [...(this.prevJobs.get(sessionId) || [])];
    const known = new Set(prev.map(job => job.jobId));
    for (const jobId of jobIds) {
      if (!/^[\d._]+$/.test(jobId) || known.has(jobId)) continue;
      prev.push({
        jobId,
        name: `Agent Job ${jobId}`,
        status: 'UNKNOWN',
        cores: 0,
        queue: 'unknown',
        runtime: '',
      });
      known.add(jobId);
    }
    if (prev.length > 0) this.prevJobs.set(sessionId, prev);
  }

  stop(sessionId: string): void {
    const timer = this.timers.get(sessionId);
    if (timer) clearInterval(timer);
    this.timers.delete(sessionId);
    this.sessions.delete(sessionId);
    this.prevJobs.delete(sessionId);
  }

  stopAll(): void {
    for (const id of [...this.timers.keys()]) this.stop(id);
  }

  /**
   * 记录已通知的作业 ID 并维护上限：Set 按插入序迭代，超限时从头部淘汰最早的 ID。
   * 重复插入时先删再插，刷新其插入位置，避免刚通知过仍需去重的近期 ID 被误淘汰。
   */
  private rememberNotified(sessionId: string, jobId: string): void {
    const key = `${sessionId}:${jobId}`;
    this.notifiedJobIds.delete(key);
    this.notifiedJobIds.add(key);
    if (this.notifiedJobIds.size > MAX_NOTIFIED_JOB_IDS) {
      const overflow = this.notifiedJobIds.size - MAX_NOTIFIED_JOB_IDS;
      const oldest = this.notifiedJobIds.keys();
      for (let i = 0; i < overflow; i++) {
        const id = oldest.next().value;
        if (id === undefined) break;
        this.notifiedJobIds.delete(id);
      }
    }
  }

  /** Slurm 作业从 squeue 消失后用 sacct 补查最终状态；查不到按 DONE 处理 */
  private async resolveSlurmFinalStatus(session: WatchSessionLike, jobId: string): Promise<'DONE' | 'EXIT'> {
    try {
      const raw = await session.cluster.exec(slurmFinalStateCommand(jobId), 10_000);
      const state = raw.trim().split(/\s+/)[0]?.toUpperCase() || '';
      if (!state) return 'DONE';
      return state === 'COMPLETED' ? 'DONE' : 'EXIT';
    } catch {
      return 'DONE'; // sacct 不可用时按完成处理
    }
  }

  /** PBS 作业离开 qstat 后用 qstat -x -f 补查：Exit_status=0 判 DONE。 */
  private async resolvePbsFinalStatus(session: WatchSessionLike, jobId: string): Promise<'DONE' | 'EXIT'> {
    try {
      const raw = await session.cluster.exec(pbsFinalStateCommand(jobId), 10_000);
      if (!raw.trim()) return 'DONE';
      if (/job_state\s*=\s*[CF]/i.test(raw) && /Exit_status\s*=\s*0\b/.test(raw)) return 'DONE';
      if (/Exit_status\s*=\s*0\b/.test(raw)) return 'DONE';
      return 'EXIT';
    } catch {
      return 'DONE';
    }
  }

  private async resolveLsfFinalStatus(session: WatchSessionLike, jobId: string): Promise<'DONE' | 'EXIT'> {
    try {
      const raw = await session.cluster.exec(lsfFinalStateCommand(jobId), 10_000);
      const state = raw.trim().split(/\s+/)[0]?.toUpperCase() || '';
      return state === 'EXIT' ? 'EXIT' : 'DONE';
    } catch {
      return 'DONE';
    }
  }

  private async poll(sessionId: string, session: WatchSessionLike): Promise<void> {
    // 会话级调度器标签优先（登录探测打标）；老会话无标签时回退全局手动配置
    const scheduler = session.scheduler ?? await loadSchedulerType();
    let jobs: JobEntry[];
    try {
      const raw = await session.cluster.exec(jobsCommand(scheduler), 15_000);
      jobs = parseJobsOutput(scheduler, raw);
    } catch {
      return; // 采集失败跳过本轮
    }

    const prev = this.prevJobs.get(sessionId);
    this.prevJobs.set(sessionId, jobs);
    if (!prev) {
      // 首轮只记录基线：已经在 DONE/EXIT 的历史作业不提醒。
      // 例外：挂着未唤醒 job-agent 绑定的作业（重启恢复期间结束的）首轮也要发事件，
      // 否则绑定作业既无事件也无唤醒，监控闭环断裂。
      for (const j of jobs) {
        if (j.status !== 'DONE' && j.status !== 'EXIT') continue;
        if (this.deps.hasPendingBinding?.(sessionId, j.jobId)) {
          await this.emitFinishedEvent(sessionId, session, scheduler, {
            jobId: j.jobId,
            name: j.name,
            status: j.status,
            queue: j.queue,
          });
        } else {
          this.rememberNotified(sessionId, j.jobId);
        }
      }
      return;
    }

    const finished = detectFinishedJobs(prev, jobs);
    // Slurm 的 squeue 只显示活跃作业，结束即消失，失败会被"消失=DONE"误判，用 sacct 补查
    const nextIds = new Set(jobs.map(j => j.jobId));
    for (const job of finished) {
      if (nextIds.has(job.jobId)) continue;
      if (scheduler === 'slurm') {
        job.status = await this.resolveSlurmFinalStatus(session, job.jobId);
      } else if (scheduler === 'pbs') {
        job.status = await this.resolvePbsFinalStatus(session, job.jobId);
      } else if (scheduler === 'none') {
        job.status = 'DONE'; // 无调度器：进程消失即结束，成败由后续验证产物判定
      } else {
        job.status = await this.resolveLsfFinalStatus(session, job.jobId);
      }
    }
    for (const job of finished) {
      await this.emitFinishedEvent(sessionId, session, scheduler, job);
    }
  }

  /** 作业输出尾部摘要：bpeek/slurm-out 读取失败或无输出时留空，不阻塞事件。 */
  private async fetchOutputExcerpt(session: WatchSessionLike, scheduler: SchedulerType, jobId: string): Promise<string | undefined> {
    // PBS 无 bpeek 等价物（输出直接落工作目录文件）；无调度器时没有作业输出概念
    if (scheduler === 'pbs' || scheduler === 'none') return undefined;
    try {
      const command = scheduler === 'slurm' ? slurmOutputTailCommand(jobId) : lsfOutputTailCommand(jobId);
      const raw = (await session.cluster.exec(command, 10_000)).trim();
      if (!raw) return undefined;
      return raw.length > EXCERPT_MAX_CHARS ? raw.slice(-EXCERPT_MAX_CHARS) : raw;
    } catch {
      return undefined;
    }
  }

  /** 单个终态作业的去重、摘要采集、通知、持久化与实时推送（首轮恢复与常规轮询共用）。 */
  private async emitFinishedEvent(
    sessionId: string,
    session: WatchSessionLike,
    scheduler: SchedulerType,
    job: { jobId: string; name: string; status: 'DONE' | 'EXIT'; queue: string },
  ): Promise<void> {
    const notificationKey = `${sessionId}:${job.jobId}`;
    if (this.notifiedJobIds.has(notificationKey)) return;
    this.rememberNotified(sessionId, job.jobId);

    const event: JobEvent = {
      jobId: job.jobId,
      name: job.name,
      status: job.status,
      queue: job.queue,
      time: Date.now(),
      notified: false,
    };
    const excerpt = await this.fetchOutputExcerpt(session, scheduler, job.jobId);
    if (excerpt) event.excerpt = excerpt;

    // 触发通知
    try {
      const config = this.deps.getNotifyConfig
        ? await this.deps.getNotifyConfig()
        : await loadNotifyConfig();
      if (config.enabled) {
        const notify = this.deps.notify ?? sendNotification;
        const icon = job.status === 'DONE' ? '✅' : '❌';
        const result = await notify(
          config,
          `${icon} 集群作业${job.status === 'DONE' ? '完成' : '失败'}: ${job.name}`,
          `作业 ${job.jobId} (${job.name}) 已结束，状态 ${job.status}，队列 ${job.queue}。\n账号 ${session.username}，时间 ${new Date().toLocaleString('zh-CN')}。`,
        );
        event.notified = result.ok;
        if (!result.ok) event.notifyError = result.error;
      }
    } catch (err: any) {
      event.notifyError = err?.message || String(err);
    }

    // 持久化事件 + 实时推送
    try {
      const events = await loadJobEvents();
      events.unshift(event);
      await saveJobEvents(events);
    } catch { /* 持久化失败不阻塞 */ }
    this.deps.emitEvent?.(event, sessionId);
  }
}

export const jobWatcher = new JobWatcher();
