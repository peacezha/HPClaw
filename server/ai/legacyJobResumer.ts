// legacy(内置)引擎的作业完成自动唤醒：jobWatcher 发现作业 DONE/EXIT 后调用
// maybeResumeLegacyAgent。与 dshJobResumer 平级：不走 dsh sidecar，直接向内置
// runAgent 投一条唤醒 prompt（模式抄 server.ts 的 resumeFinishedFormalWorkflowRun），
// 收集最终回答回写对话并通知 UI。全流程不 throw——任何一步失败仅 log 并 return
//（作业监控路径不能被打断）。

import { runAgent as defaultRunAgent, type AgentCtx, type AgentCB } from './agentRunner';
import type { AIMessage, AIProfile } from './types';
import type { JobAgentBinding } from '../dsh/jobAgentBindings';

export interface LegacyResumeJobEvent {
  sessionId: string;
  jobId: string;
  status: string;
}

export interface LegacyResumeDeps {
  getBinding: (jobId: string, sshSessionId: string) => JobAgentBinding | undefined;
  markResumed: (jobId: string, sshSessionId: string) => void;
  /** 取集群执行通道与家目录；会话断开时返回 undefined，本轮唤醒跳过（不消耗 resumeCount）。 */
  getSession: (sshSessionId: string) => { home: string; exec: (cmd: string, timeout?: number) => Promise<string> } | undefined;
  /** 服务端共享 AI 配置（加密存储）；无 apiKey 时跳过唤醒。 */
  loadProfile: () => AIProfile | undefined;
  skillsDir?: string;
  lsfSkillDir?: string;
  userSkillsDir?: string;
  appendConversation?: (conversationId: string, messages: AIMessage[], sshSessionId?: string) => Promise<boolean>;
  emitToUi?: (sshSessionId: string, payload: unknown) => void;
  notify?: (title: string, content: string) => Promise<void>;
  /** 唤醒轮里 Agent 新提交的作业：交给服务端 trackJobs + 续登绑定，保持监控闭环。 */
  onJobsSubmitted?: (binding: JobAgentBinding, jobIds: string[]) => void;
  /** 测试覆盖用；缺省走 agentRunner 的真实 runAgent */
  runAgent?: typeof defaultRunAgent;
}

const MAX_RESUME_PER_JOB = 3;
const RESUME_TIMEOUT_MS = 10 * 60_000;
const OUTPUT_EXCERPT_MAX = 3 * 1024;

// 同一对话的并发唤醒互斥（避免作业批量结束时重复投递 prompt）。
const resumeLocks = new Set<string>();

function buildWakeText(binding: JobAgentBinding, jobId: string, status: string, tail: string): string {
  const excerpt = tail.trim() ? tail.slice(0, OUTPUT_EXCERPT_MAX) : '';
  if (binding.locale === 'en-US') {
    return `The background watcher confirmed that job ${jobId} has finished. Final status: ${status}.`
      + (excerpt ? `\n\nOutput excerpt:\n${excerpt}` : '')
      + '\n\nPlease read the full output (e.g. bpeek or the output files), verify the results and continue the previous task; if the task is already complete, briefly summarize the results.'
      + '\n\nThis is an autonomous background resume: do NOT call ask_user — the user is not watching. Analyze and finish on your own; if the next step needs a decision, pick the recommended option and note the assumption in your summary.';
  }
  return `后台监控确认作业 ${jobId} 已结束，终态：${status}。`
    + (excerpt ? `\n\n输出摘要：\n${excerpt}` : '')
    + '\n\n请读取完整输出（如 bpeek 或输出文件），验证结果并继续之前的任务；如果任务已完成，请简要总结结果。'
    + '\n\n这是后台自动续跑：禁止调用 ask_user 反问——用户此刻不在对话前。请自主分析并收尾；若下一步需要用户拍板，直接按推荐方案执行并在总结里注明这个假设。';
}

function buildSysMessage(binding: JobAgentBinding, jobId: string, status: string): string {
  return binding.locale === 'en-US'
    ? `[System] Job ${jobId} finished (${status}); the conversation was resumed automatically.`
    : `【系统】作业 ${jobId} 已结束（${status}），已自动继续处理。`;
}

export async function maybeResumeLegacyAgent(evt: LegacyResumeJobEvent, deps: LegacyResumeDeps): Promise<void> {
  try {
    if (process.env.HPCLAW_JOB_RESUME === 'off') return;
    const binding = deps.getBinding(evt.jobId, evt.sessionId);
    // 只接管 legacy 绑定；dsh 绑定（engine 缺省）仍由 dshJobResumer 处理。
    if (!binding || binding.engine !== 'legacy') return;
    if (binding.resumeCount >= MAX_RESUME_PER_JOB) {
      console.warn('[legacy-resume] 作业 %s 已自动续跑 %d 次，达到上限，跳过', evt.jobId, binding.resumeCount);
      return;
    }
    const lockKey = `${evt.sessionId}:${binding.conversationKey}`;
    if (resumeLocks.has(lockKey)) {
      console.warn('[legacy-resume] 对话 %s 正在续跑中，跳过作业 %s 的重复唤醒', binding.conversationKey, evt.jobId);
      return;
    }
    resumeLocks.add(lockKey);
    try {
      await runResume(evt, binding, deps);
    } finally {
      resumeLocks.delete(lockKey);
    }
  } catch (err) {
    console.error('[legacy-resume] 作业 %s 唤醒失败: %s', evt.jobId, err instanceof Error ? err.message : String(err));
  }
}

async function runResume(evt: LegacyResumeJobEvent, binding: JobAgentBinding, deps: LegacyResumeDeps): Promise<void> {
  const session = deps.getSession(evt.sessionId);
  if (!session) {
    console.warn('[legacy-resume] 集群会话 %s 不在线，跳过作业 %s 唤醒', evt.sessionId, evt.jobId);
    return;
  }
  const profile = deps.loadProfile();
  if (!profile?.apiKey) {
    console.warn('[legacy-resume] 未找到可用 AI 配置，跳过作业 %s 唤醒', evt.jobId);
    return;
  }

  const jobId = /^[\d._]+$/.test(evt.jobId) ? evt.jobId : '';
  // 输出摘要：失败不阻塞（空串）。
  const tail = jobId
    ? await session.exec(`bpeek ${jobId} | tail -60`, 20_000).catch(() => '')
    : '';

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), RESUME_TIMEOUT_MS);
  timer.unref?.();
  try {
    let finalText = '';
    let askQuestion = '';
    let runError = '';
    const run = deps.runAgent ?? defaultRunAgent;
    const ctx: AgentCtx = {
      sid: evt.sessionId,
      run: (_sid, command, timeout) => session.exec(command, timeout),
      // 无人值守唤醒：需要用户确认的命令一律拒绝，保证后台收尾安全。
      confirmCommand: async () => false,
      profile,
      home: session.home,
      skillsDir: deps.skillsDir,
      lsfSkillDir: deps.lsfSkillDir,
      userSkillsDir: deps.userSkillsDir,
      runtimeConfig: {
        planningPolicy: 'auto',
        confirmationPolicy: binding.confirmationPolicy || 'dangerous',
        maxCommands: 40,
        maxSteps: 200,
      },
      onJobsSubmitted: jobIds => deps.onJobsSubmitted?.(binding, jobIds),
      conversationId: binding.conversationId,
      conversationKey: binding.conversationKey,
      locale: binding.locale ?? 'zh-CN',
    };
    const callbacks: AgentCB = {
      onText: () => {},
      onReason: () => {},
      onToolCall: name => console.log('[legacy-resume:%s] tool=%s', evt.jobId, name),
      onToolResult: () => {},
      onStep: () => {},
      onAsk: question => { askQuestion = question; },
      onDone: text => { finalText = text; },
      onErr: error => { runError = error; },
      sig: () => abort.signal,
    };
    await run(ctx, callbacks, [{ role: 'user', content: buildWakeText(binding, evt.jobId, evt.status, tail) }]);

    const zh = binding.locale !== 'en-US';
    let assistantText: string;
    if (runError) {
      assistantText = zh ? `(自动续跑失败：${runError})` : `(auto-resume failed: ${runError})`;
    } else if (finalText === '__ASK__') {
      assistantText = askQuestion
        ? (zh ? `需要用户确认后继续：${askQuestion}` : `Waiting for the user's answer: ${askQuestion}`)
        : '';
    } else {
      assistantText = finalText;
    }
    const fallback = zh ? '(续跑未产生文本)' : '(resume produced no text)';
    const preview = (assistantText || fallback).slice(0, 200);

    if (binding.conversationId && deps.appendConversation) {
      try {
        await deps.appendConversation(binding.conversationId, [
          { role: 'user', content: buildSysMessage(binding, evt.jobId, evt.status) },
          { role: 'assistant', content: assistantText || fallback },
        ], binding.sshSessionId);
      } catch (err) {
        console.warn('[legacy-resume] 会话回写失败: %s', err instanceof Error ? err.message : String(err));
      }
    }
    try {
      deps.emitToUi?.(evt.sessionId, {
        type: 'ai:resumed',
        conversationId: binding.conversationId,
        jobId: evt.jobId,
        preview,
      });
    } catch (err) {
      console.warn('[legacy-resume] UI 事件失败: %s', err instanceof Error ? err.message : String(err));
    }
    try {
      await deps.notify?.(
        zh ? '作业完成，AI 已继续处理' : 'Job finished, AI resumed',
        preview,
      );
    } catch (err) {
      console.warn('[legacy-resume] 通知失败: %s', err instanceof Error ? err.message : String(err));
    }
    deps.markResumed(evt.jobId, evt.sessionId);
  } finally {
    clearTimeout(timer);
  }
}
