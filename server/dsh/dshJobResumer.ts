// 作业完成自动唤醒 AI 会话：jobWatcher 发现作业 DONE/EXIT 后调用 maybeResumeAgent。
// 经 dsh sidecar 冷恢复绑定会话、投递唤醒 prompt、收集 assistant 文本并回显到
// 对话与 UI。全流程不 throw——任何一步失败仅 log 并 return（作业监控路径不能被打断）。

import { DshClient } from './dshClient';
import {
  ensureSidecar as defaultEnsureSidecar,
  type EnsureSidecarOptions,
  type EnsureSidecarResult,
} from './dshSidecar';
import type { JobAgentBinding } from './jobAgentBindings';
import { bindDshSession } from './bridgeState';
import { normalizeDeepSeekBaseUrl, redactDshSensitiveText } from './dshConfigSafety';

export interface ResumeJobEvent {
  sessionId: string;
  jobId: string;
  status: string;
}

export interface ResumeConversationMessage {
  role: string;
  content: string;
}

/** 便于测试注入的 DshClient 结构子集。 */
export interface DshClientLike {
  createSession(opts: { cwd: string; sessionId?: string }): Promise<string>;
  selectModel(opts: { sessionId: string; provider: string; model: string }): Promise<void>;
  prompt(opts: { sessionId: string; text: string }): Promise<{ accepted?: boolean }>;
  connectMux(hooks: { onOpened?: () => void; onFrame: (frame: any) => void; onClosed: () => void }): { close: () => void };
}

export interface ResumeAgentDeps {
  dataRoot: string;
  pluginSourceDir: string;
  skillDirs: string[];
  getBinding: (jobId: string, sshSessionId: string) => JobAgentBinding | undefined;
  markResumed: (jobId: string, sshSessionId: string) => void;
  exec: (sshSessionId: string, command: string, timeoutMs?: number) => Promise<string>;
  appendConversation?: (conversationId: string, messages: ResumeConversationMessage[], sshSessionId?: string) => Promise<boolean>;
  emitToUi?: (sshSessionId: string, payload: unknown) => void;
  notify?: (title: string, content: string) => Promise<void>;
  now?: () => number;
  /** 测试覆盖用；缺省走 dshSidecar 的真实 ensureSidecar */
  ensureSidecar?: (opts: EnsureSidecarOptions) => Promise<EnsureSidecarResult>;
  /** 测试覆盖用；缺省 new DshClient(baseUrl) */
  createClient?: (baseUrl: string) => DshClientLike;
}

const MAX_RESUME_PER_JOB = 3;
const MUX_IDLE_TIMEOUT_MS = 90_000;
const MUX_HARD_TIMEOUT_MS = 10 * 60_000;
const OUTPUT_EXCERPT_MAX = 3 * 1024;

// 同一 dshSessionId 的并发唤醒互斥（避免作业批量结束时重复投递 prompt）。
const resumeLocks = new Set<string>();

function buildWakeText(binding: JobAgentBinding, jobId: string, status: string, tail: string): string {
  const excerpt = tail.trim() ? tail.slice(0, OUTPUT_EXCERPT_MAX) : '';
  if (binding.locale === 'en-US') {
    return `Job ${jobId} has finished. Final status: ${status}.`
      + (excerpt ? `\n\nOutput excerpt:\n${excerpt}` : '')
      + '\n\nPlease read the full output and continue the previous task; if the task is already complete, briefly summarize the results.'
      + ' This is an autonomous background resume: do not ask the user questions — analyze and finish on your own, noting any assumptions you made.';
  }
  return `作业 ${jobId} 已结束，终态：${status}。`
    + (excerpt ? `\n\n输出摘要：\n${excerpt}` : '')
    + '\n\n请读取完整输出并继续之前的任务；如果任务已完成，请简要总结结果。'
    + ' 这是后台自动续跑：不要反问用户——请自主分析收尾，如有假设请在总结里注明。';
}

function buildSysMessage(binding: JobAgentBinding, jobId: string, status: string): string {
  return binding.locale === 'en-US'
    ? `[System] Job ${jobId} finished (${status}); the conversation was resumed automatically.`
    : `【系统】作业 ${jobId} 已结束（${status}），已自动继续处理。`;
}

/** 先订阅 mux 再投递 prompt，收集 assistant 文本并避免快速回答丢帧。 */
function promptAndCollectAssistantText(client: DshClientLike, sessionId: string, promptText: string): Promise<string> {
  return new Promise(resolve => {
    let text = '';
    let finished = false;
    let promptStarted = false;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const mux = client.connectMux({
      onOpened: () => {
        if (finished || promptStarted) return;
        promptStarted = true;
        void client.prompt({ sessionId, text: promptText }).then(accepted => {
          if (accepted?.accepted === false) finish();
        }).catch(err => {
          console.warn('[dsh-resume] 唤醒 prompt 提交失败: %s', redactDshSensitiveText(err instanceof Error ? err.message : String(err)));
          finish();
        });
      },
      onFrame: frame => {
        if (finished || frame?.method !== 'session/event') return;
        if (frame.payload?.sessionId !== sessionId) return;
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(finish, MUX_IDLE_TIMEOUT_MS);
        idleTimer.unref?.();
        const event = frame.payload.event;
        const chunk = event?.type === 'assistant/chunk' ? event.data?.chunk : undefined;
        if (chunk?.type === 'text-delta' && typeof chunk.text === 'string') {
          text += chunk.text;
        } else if (event?.type === 'turn/end') {
          finish();
        }
      },
      onClosed: () => finish(),
    });
    const finish = (): void => {
      if (finished) return;
      finished = true;
      if (idleTimer) clearTimeout(idleTimer);
      clearTimeout(hardTimer);
      try { mux.close(); } catch { /* 已关闭 */ }
      resolve(text);
    };
    idleTimer = setTimeout(finish, MUX_IDLE_TIMEOUT_MS);
    idleTimer.unref?.();
    const hardTimer = setTimeout(finish, MUX_HARD_TIMEOUT_MS);
    hardTimer.unref?.();
  });
}

export async function maybeResumeAgent(evt: ResumeJobEvent, deps: ResumeAgentDeps): Promise<void> {
  try {
    if (process.env.HPCLAW_JOB_RESUME === 'off') return;
    const binding = deps.getBinding(evt.jobId, evt.sessionId);
    if (!binding) return;
    // legacy(内置)引擎的绑定没有 dsh 会话，由 legacyJobResumer 接管，这里不重复唤醒。
    if (binding.engine === 'legacy') return;
    if (binding.resumeCount >= MAX_RESUME_PER_JOB) {
      console.warn('[dsh-resume] 作业 %s 已自动续跑 %d 次，达到上限，跳过', evt.jobId, binding.resumeCount);
      return;
    }
    if (resumeLocks.has(binding.dshSessionId)) {
      console.warn('[dsh-resume] 会话 %s 正在续跑中，跳过作业 %s 的重复唤醒', binding.dshSessionId, evt.jobId);
      return;
    }
    resumeLocks.add(binding.dshSessionId);
    try {
      await runResume(evt, binding, deps);
    } finally {
      resumeLocks.delete(binding.dshSessionId);
    }
  } catch (err) {
    console.error('[dsh-resume] 作业 %s 唤醒失败: %s', evt.jobId, redactDshSensitiveText(err instanceof Error ? err.message : String(err)));
  }
}

async function runResume(evt: ResumeJobEvent, binding: JobAgentBinding, deps: ResumeAgentDeps): Promise<void> {
  const jobId = /^[\d._]+$/.test(evt.jobId) ? evt.jobId : '';
  // 输出摘要：失败不阻塞（空串）。
  const tail = jobId
    ? await deps.exec(evt.sessionId, `bpeek ${jobId} | tail -60`, 20_000).catch(() => '')
    : '';

  const extraEnv: Record<string, string | undefined> = {};
  if (binding.profile?.provider === 'deepseek') {
    // apiKey 不落盘（job-agent-bindings.json 只存 provider/model/baseUrl）；
    // 唤醒时从服务端共享配置（加密存储）读取。
    let apiKey = binding.profile.apiKey;
    if (!apiKey) {
      try {
        const { loadServerAiProfile } = await import('../ai/serverAiProfile');
        apiKey = loadServerAiProfile()?.apiKey;
      } catch { /* 无可用 key 时交给 dsh 自身凭据 */ }
    }
    if (apiKey) extraEnv.DEEPSEEK_API_KEY = apiKey;
    extraEnv.DEEPSEEK_BASE_URL = normalizeDeepSeekBaseUrl(binding.profile.baseUrl);
  }
  const ensure = deps.ensureSidecar ?? defaultEnsureSidecar;
  const sidecar = await ensure({
    pluginSourceDir: deps.pluginSourceDir,
    skillDirs: deps.skillDirs,
    extraEnv,
  });
  if (!sidecar.ok || !sidecar.baseUrl) {
    console.warn('[dsh-resume] sidecar 不可用，跳过作业 %s 唤醒: %s', evt.jobId, sidecar.reason || 'unknown');
    return;
  }

  const client = (deps.createClient ?? (baseUrl => new DshClient(baseUrl)))(sidecar.baseUrl);
  const sessionId = await client.createSession({
    cwd: binding.workspace || deps.dataRoot,
    sessionId: binding.dshSessionId,
  }) || binding.dshSessionId;
  bindDshSession({
    dshSessionId: sessionId,
    sshSessionId: evt.sessionId,
    workspaceRoot: binding.workspace || deps.dataRoot,
    conversationKey: binding.conversationKey,
    confirmationPolicy: binding.confirmationPolicy || 'dangerous',
  });
  await client.selectModel({
    sessionId,
    provider: 'deepseek-official',
    model: binding.profile?.model || 'deepseek-v4-pro',
  });

  const wakeText = buildWakeText(binding, evt.jobId, evt.status, tail);
  const finalText = await promptAndCollectAssistantText(client, sessionId, wakeText);
  const preview = finalText.slice(0, 200);

  if (binding.conversationId && deps.appendConversation) {
    try {
      await deps.appendConversation(binding.conversationId, [
        { role: 'user', content: buildSysMessage(binding, evt.jobId, evt.status) },
        { role: 'assistant', content: finalText || (binding.locale === 'en-US' ? '(resume produced no text)' : '(续跑未产生文本)') },
      ], binding.sshSessionId);
    } catch (err) {
      console.warn('[dsh-resume] 会话回写失败: %s', err instanceof Error ? err.message : String(err));
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
    console.warn('[dsh-resume] UI 事件失败: %s', err instanceof Error ? err.message : String(err));
  }
  try {
    await deps.notify?.(
      binding.locale === 'en-US' ? 'Job finished, AI resumed' : '作业完成，AI 已继续处理',
      preview,
    );
  } catch (err) {
    console.warn('[dsh-resume] 通知失败: %s', err instanceof Error ? err.message : String(err));
  }
  deps.markResumed(evt.jobId, evt.sessionId);
}
