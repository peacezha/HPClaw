import type { Express, Response } from 'express';
import { resolveRequestSessionId } from '../cluster/sessionRequest';
import { loadJobEvents } from './jobWatcher';
import {
  loadSchedulerType, saveSchedulerType, jobsCommand, parseJobsOutput,
  PROCESSES_COMMAND, parseProcessesOutput, type SchedulerType,
} from './scheduler';
import { loadNotifyConfig, saveNotifyConfig, sendNotification, type NotifyConfig } from './notifyService';

interface NotifyRouteSession {
  cluster: { exec: (cmd: string, timeout?: number) => Promise<string> };
}

type ResolveSession = (sessionId: string | undefined) => NotifyRouteSession | undefined;

function sendError(res: Response, status: number, message: string): void {
  res.status(status).json({ success: false, error: message });
}

const CHANNELS = ['serverchan', 'pushplus', 'wecom', 'feishu', 'email'];

export function registerNotificationRoutes(app: Express, resolveSession: ResolveSession): void {
  const withSession = (req: any, res: Response): NotifyRouteSession | undefined => {
    const sessionId = resolveRequestSessionId({
      cookie: req.session?.sshSessionId,
      header: req.get('X-SSH-Session-Id'),
      auth: undefined,
    }, id => Boolean(resolveSession(id)));
    const session = sessionId ? resolveSession(sessionId) : undefined;
    if (!session) {
      sendError(res, 401, '需要活跃的 SSH 会话');
      return undefined;
    }
    return session;
  };

  // 当前作业列表 + 当前用户的 Linux 进程
  app.get('/api/jobs', async (req, res) => {
    const session = withSession(req, res);
    if (!session) return;
    try {
      const scheduler = await loadSchedulerType();
      const [jobsRaw, psRaw] = await Promise.all([
        session.cluster.exec(jobsCommand(scheduler), 15_000),
        // ps 失败不阻塞作业列表
        session.cluster.exec(PROCESSES_COMMAND, 15_000).catch(() => ''),
      ]);
      res.json({
        success: true,
        jobs: parseJobsOutput(scheduler, jobsRaw),
        processes: parseProcessesOutput(psRaw),
        scheduler,
      });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 当前调度器（lsf / slurm）
  app.get('/api/jobs/scheduler', async (_req, res) => {
    try {
      res.json({ success: true, scheduler: await loadSchedulerType() });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 切换调度器
  app.put('/api/jobs/scheduler', async (req, res) => {
    try {
      const scheduler = req.body?.scheduler;
      if (scheduler !== 'lsf' && scheduler !== 'slurm') {
        sendError(res, 400, 'scheduler 必须是 lsf 或 slurm');
        return;
      }
      await saveSchedulerType(scheduler as SchedulerType);
      res.json({ success: true, scheduler });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 作业完成事件（最近 50 条）
  app.get('/api/jobs/events', async (_req, res) => {
    try {
      res.json({ success: true, events: await loadJobEvents() });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 通知配置（脱敏返回）
  app.get('/api/notify/config', async (_req, res) => {
    try {
      const config = await loadNotifyConfig();
      res.json({
        success: true,
        config: {
          ...config,
          smtpPass: config.smtpPass ? '******' : '',
        },
      });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 保存通知配置
  app.put('/api/notify/config', async (req, res) => {
    try {
      const body = req.body || {};
      const channel = CHANNELS.includes(body.channel) ? body.channel : 'serverchan';
      const current = await loadNotifyConfig();
      const next: NotifyConfig = {
        enabled: Boolean(body.enabled),
        channel,
        sendKey: body.sendKey !== undefined ? String(body.sendKey || '').trim() : current.sendKey,
        token: body.token !== undefined ? String(body.token || '').trim() : current.token,
        webhook: body.webhook !== undefined ? String(body.webhook || '').trim() : current.webhook,
        smtpHost: body.smtpHost !== undefined ? String(body.smtpHost || '').trim() : current.smtpHost,
        smtpPort: body.smtpPort !== undefined ? Number(body.smtpPort) || 465 : current.smtpPort,
        smtpUser: body.smtpUser !== undefined ? String(body.smtpUser || '').trim() : current.smtpUser,
        // '******' 表示未修改，保留原值
        smtpPass: body.smtpPass === '******' ? current.smtpPass
          : body.smtpPass !== undefined ? String(body.smtpPass || '').trim()
          : current.smtpPass,
        mailTo: body.mailTo !== undefined ? String(body.mailTo || '').trim() : current.mailTo,
      };
      await saveNotifyConfig(next);
      res.json({ success: true });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 发送测试通知
  app.post('/api/notify/test', async (_req, res) => {
    try {
      const config = await loadNotifyConfig();
      const result = await sendNotification(
        config,
        '🔔 HPClaw 通知测试',
        `这是一条来自 HPClaw 的测试消息。\n如果你看到它，说明作业完成提醒已经可以正常工作。\n时间：${new Date().toLocaleString('zh-CN')}`,
      );
      if (result.ok) res.json({ success: true });
      else sendError(res, 400, result.error || '发送失败');
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });
}
