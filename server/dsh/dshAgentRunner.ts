// dsh 引擎编排：server.ts 的 /api/ai/stream agent 分支在 selectDshEngine 判为 dsh 时调用。
// 流程：ensureSidecar（失败 → 'fallback' 让调用方走 legacy）→ 会话映射冷恢复 →
// selectModel（best-effort）→ prompt → mux 帧翻译 → 审批挂起确认 → turn/end 收尾。

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { bindDshSession, type DshConfirmationPolicy } from './bridgeState';
import { DshClient } from './dshClient';
import { ensureSidecar } from './dshSidecar';
import { createTranslateState, createTranslator } from './dshTranslate';
import { normalizeDeepSeekBaseUrl, redactDshSensitiveText } from './dshConfigSafety';
import { writeFileAtomic0600 } from './fileUtils';
import { addBindings, extractSubmittedJobIds, initJobAgentBindings } from './jobAgentBindings';

export interface DshAgentProfile {
  provider: string;
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface DshAgentOptions {
  send: (event: any) => void;
  requestAbort: AbortSignal;
  requestId: string;
  profile: DshAgentProfile;
  userText: string;
  summary?: string;
  locale: 'zh-CN' | 'en-US';
  /** 本次 agent 请求对应的集群 SSH 会话（桥路由靠它定位目标连接） */
  sshSessionId?: string;
  /** 用户选择的本地工作区（dsh 会话 cwd；不同目录映射不同 dsh 会话） */
  workspace?: string;
  /** 当前激活的 HPClaw 对话 id（作业唤醒时回写续跑内容用；可能未保存过） */
  conversationId?: string;
  /** HPClaw 会话标识 → dsh sessionId 的持久化映射键 */
  conversationKey: string;
  /** 与内置 Agent 相同的命令/文件确认策略。 */
  confirmationPolicy?: DshConfirmationPolicy;
  dataRoot: string;
  pluginSourceDir: string;
  skillDirs: string[];
  /** Agent 拿到作业号后立即交给服务端 watcher，避免短作业漏检。 */
  onJobsSubmitted?: (jobIds: string[]) => void;
  /** 复用 server.ts 的挂起确认机制：给用户发 confirm、等待 /api/ai/confirm 裁决 */
  onConfirm: (meta: { rpcId: string; sessionId: string; approvalId: string; command: string; risk: string }) => Promise<boolean>;
  /** 把 dsh ask_user_question 交给前端，在原 SSE 连接上等待用户回答。 */
  onQuestion: (meta: {
    rpcId: string;
    sessionId: string;
    questions: Array<{
      id: string;
      question: string;
      detail?: string;
      header?: string;
      options?: Array<{ label: string; description?: string }>;
      multiSelect?: boolean;
    }>;
  }) => Promise<{ answers: Array<{ id: string; selected: string[]; custom?: string }> } | null>;
}

export type DshAgentOutcome = 'completed' | 'fallback';

/** mux 空闲上限：90s 无任何帧先重连一次，再 90s 无帧判超时收尾（硬兜底由 server.ts 看门狗负责）。 */
const MUX_IDLE_TIMEOUT_MS = 90_000;

function readSessionMap(file: string): Record<string, string> {
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const out: Record<string, string> = {};
      for (const [key, value] of Object.entries(raw)) {
        if (typeof value === 'string') out[key] = value;
      }
      return out;
    }
  } catch { /* 文件不存在或损坏：按空映射处理 */ }
  return {};
}

export async function runDshAgent(opts: DshAgentOptions): Promise<DshAgentOutcome> {
  const zh = opts.locale !== 'en-US';
  opts.send({
    type: 'status',
    phase: 'preparing',
    message: zh ? '正在启动 dsh 引擎…' : 'Starting the dsh engine…',
    requestId: opts.requestId,
  });

  const extraEnv: Record<string, string | undefined> = {};
  if (opts.profile.provider === 'deepseek' && opts.profile.apiKey) {
    extraEnv.DEEPSEEK_API_KEY = opts.profile.apiKey;
    try {
      extraEnv.DEEPSEEK_BASE_URL = normalizeDeepSeekBaseUrl(opts.profile.baseUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      opts.send({ type: 'error', error: redactDshSensitiveText(message), requestId: opts.requestId });
      return 'completed';
    }
  }

  // 无集群会话时 dsh 桥工具（run_command 走集群）不可用：不发 error 事件，回退
  // legacy 引擎由调用方重跑本轮，避免把"requires an active SSH session"硬错误抛给用户。
  if (!opts.sshSessionId) {
    console.warn('[dsh] 无活动集群会话，回退 legacy 引擎');
    return 'fallback';
  }

  const sidecar = await ensureSidecar({
    pluginSourceDir: opts.pluginSourceDir,
    skillDirs: opts.skillDirs,
    extraEnv,
  });
  if (!sidecar.ok || !sidecar.baseUrl) {
    // sidecar 不可用：不发 error 事件，由调用方无缝回退 legacy 引擎重跑本轮。
    console.warn('[dsh] sidecar 不可用，回退 legacy 引擎: %s', sidecar.reason || 'unknown');
    return 'fallback';
  }

  try {
    const client = new DshClient(sidecar.baseUrl);

    // HPClaw 会话 → dsh sessionId 映射落盘（读-改-写），重启后冷恢复上下文。
    // 选了工作区时：cwd 用工作区（dsh 的本地文件/bash 工具落点），映射键带上
    // 目录哈希——不同工作区是独立的 dsh 会话。
    const sessionCwd = opts.workspace || opts.dataRoot;
    const mapKey = opts.workspace
      ? `${opts.conversationKey}@${createHash('sha1').update(opts.workspace).digest('hex').slice(0, 10)}`
      : opts.conversationKey;
    const mapFile = path.join(opts.dataRoot, 'dsh-sessions.json');
    const sessionMap = readSessionMap(mapFile);
    const mappedSessionId = sessionMap[mapKey];
    const sessionId = await client.createSession({ cwd: sessionCwd, sessionId: mappedSessionId });
    if (sessionId && sessionId !== mappedSessionId) {
      sessionMap[mapKey] = sessionId;
      try {
        writeFileAtomic0600(mapFile, JSON.stringify(sessionMap, null, 2));
      } catch (err) {
        console.warn('[dsh] 会话映射落盘失败: %s', err instanceof Error ? err.message : String(err));
      }
    }
    if (!opts.sshSessionId) {
      // 防御性检查（正常路径已在函数入口拦截回退 legacy）。
      console.warn('[dsh] 无活动集群会话，跳过本次运行');
      return 'fallback';
    }
    bindDshSession({
      dshSessionId: sessionId,
      sshSessionId: opts.sshSessionId,
      workspaceRoot: sessionCwd,
      conversationKey: opts.conversationKey,
      confirmationPolicy: opts.confirmationPolicy || 'dangerous',
    });

    await client.selectModel({ sessionId, provider: 'deepseek-official', model: opts.profile.model });

    const languageInstruction = zh
      ? '面向用户的内容使用中文。命令、路径、文件名、工具原始输出和科学标识符保持原样。'
      : 'Use English for all user-facing text. Keep commands, paths, filenames, raw tool output, and scientific identifiers unchanged.';
    const displayInstruction = zh
      ? '在对话中展示图片或图表时，直接用标准 Markdown 图片语法写文件路径（![描述](路径)）：集群绝对路径、本地绝对路径（C:\\...）和工作区相对路径都会被客户端自动内联渲染；不要为此启动临时 HTTP 服务，也不要 base64 内联。表格用标准 Markdown 表格语法。'
      : 'To show images or charts in chat, write standard Markdown image syntax with plain file paths (![desc](path)): cluster absolute paths, local absolute paths (C:\\...) and workspace-relative paths are all rendered inline by the client. Never start a temporary HTTP server or inline base64 for this. Use standard Markdown tables for tabular data.';
    const autonomyInstruction = zh
      ? '目标和路径明确时直接使用工具完成安全操作并验证结果，不要只把命令发给用户自己执行；仅在缺少关键科学参数或遇到高风险操作确认时暂停。'
      : 'When the goal and paths are clear, use tools to complete safe operations and verify the result instead of handing commands back to the user; pause only for a missing scientific decision or a high-risk confirmation.';
    const text = languageInstruction
      + `\n${displayInstruction}`
      + `\n${autonomyInstruction}`
      + (opts.summary ? `\n\n对话摘要：${opts.summary}` : '')
      + `\n\n${opts.userText}`;
    // 必须先完成 mux WebSocket 握手，再提交 prompt。否则极快的回答可能在
    // 订阅建立前已经发出 assistant/message 与 turn/end，界面只剩“已接管”。
    return await runMuxLoop(opts, client, sessionId, zh, text);
  } catch (err) {
    const message = redactDshSensitiveText(err instanceof Error ? err.message : String(err));
    console.error('[dsh] 运行失败: %s', message);
    opts.send({
      type: 'error',
      error: zh ? `dsh 引擎运行失败：${message}` : `dsh engine failed: ${message}`,
      requestId: opts.requestId,
    });
    return 'completed';
  }
}

function runMuxLoop(opts: DshAgentOptions, client: DshClient, sessionId: string, zh: boolean, promptText: string): Promise<DshAgentOutcome> {
  return new Promise(resolve => {
    const state = createTranslateState(sessionId);
    let finished = false;
    let reconnected = false;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let promptSettleTimer: ReturnType<typeof setTimeout> | undefined;
    let mux: { close: () => void } | undefined;
    let promptStarted = false;
    const pendingQuestionRpcIds = new Set<string>();

    const sendError = (message: string): void => {
      opts.send({ type: 'error', error: message, requestId: opts.requestId });
    };

    const finish = (result: DshAgentOutcome): void => {
      if (finished) return;
      finished = true;
      if (idleTimer) clearTimeout(idleTimer);
      if (promptSettleTimer) clearTimeout(promptSettleTimer);
      opts.requestAbort.removeEventListener('abort', onAbort);
      try { mux?.close(); } catch { /* 已关闭 */ }
      resolve(result);
    };

    const respondPendingApproval = async (event: any): Promise<void> => {
      const index = state.pendingApprovals.findIndex(p => p.rpcId === String(event?.id ?? ''));
      const pending = index >= 0 ? state.pendingApprovals.splice(index, 1)[0] : state.pendingApprovals.pop();
      if (!pending) return;
      let approved = false;
      try {
        approved = await opts.onConfirm({
          rpcId: pending.rpcId,
          sessionId: pending.sessionId,
          approvalId: pending.approvalId,
          command: String(event?.command ?? ''),
          risk: String(event?.risk ?? 'unknown'),
        });
      } catch {
        approved = false;
      }
      await client.respondApproval({
        rpcId: pending.rpcId,
        sessionId: pending.sessionId,
        approvalId: pending.approvalId,
        outcome: approved ? 'allowed-once' : 'rejected',
      });
    };

    const startPromptAfterBaseline = (): void => {
      if (finished || promptStarted || pendingQuestionRpcIds.size > 0) return;
      if (promptSettleTimer) clearTimeout(promptSettleTimer);
      // events.mux 在新连接上会紧接着重放未回答反问。给基线帧一个
      // 很短的收敛窗口，避免先把新 prompt 排到仍等答案的旧 turn 后面。
      promptSettleTimer = setTimeout(() => {
        promptSettleTimer = undefined;
        if (pendingQuestionRpcIds.size === 0) void startPromptOnce();
      }, 75);
      promptSettleTimer.unref?.();
    };

    const respondQuestion = async (frame: any): Promise<void> => {
      const rpcId = String(frame?.rpcId || '');
      const payload = frame?.payload;
      if (!rpcId || payload?.sessionId !== sessionId || pendingQuestionRpcIds.has(rpcId)) return;
      const questions = Array.isArray(payload?.questions) ? payload.questions : [];
      if (questions.length === 0) return;

      pendingQuestionRpcIds.add(rpcId);
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = undefined;
      }
      if (promptSettleTimer) {
        clearTimeout(promptSettleTimer);
        promptSettleTimer = undefined;
      }

      try {
        const answer = await opts.onQuestion({ rpcId, sessionId, questions });
        if (finished) return;
        if (!answer) {
          await client.cancel(sessionId).catch(() => { /* 取消尽力而为 */ });
          opts.send({ type: 'done', content: '__CANCELLED__', requestId: opts.requestId });
          finish('completed');
          return;
        }
        const accepted = await client.respondQuestion({ rpcId, sessionId, answer });
        if (!accepted) {
          sendError(zh ? 'dsh 未接受用户的回答，请重试本轮任务' : 'dsh did not accept the user answer; please retry this turn');
          finish('completed');
        }
      } catch (err) {
        if (!finished) {
          const detail = redactDshSensitiveText(err instanceof Error ? err.message : String(err));
          sendError(zh ? `dsh 回答反问失败：${detail}` : `Failed to answer dsh question: ${detail}`);
          finish('completed');
        }
      } finally {
        pendingQuestionRpcIds.delete(rpcId);
        if (!finished) {
          armIdleTimer();
          // 冷恢复时先解决旧反问，再提交用户这次的“继续”或新指令。
          if (!promptStarted) startPromptAfterBaseline();
        }
      }
    };

    const translator = createTranslator({
      send: (event: any) => {
        if (!event || typeof event !== 'object') return;
        if (event.type === 'confirm') {
          // confirm 的 SSE 展示与挂起裁决都在 opts.onConfirm（server.ts 既有机制）里，
          // 这里只负责把裁决结果回给 dsh。
          void respondPendingApproval(event);
          return;
        }
        // 作业绑定：run_command 输出捕获 bsub 作业号 → 登记（jobWatcher 终态时
        // dshJobResumer 凭绑定把"作业完成"注入同一条 dsh 会话，闭合 Agent 外圈）。
        if (event.type === 'tool_result' && event.name === 'run_command' && sessionId) {
          try {
            const jobIds = extractSubmittedJobIds(String(event.result ?? ''));
            if (jobIds.length > 0) {
              initJobAgentBindings(opts.dataRoot);
              const added = addBindings(jobIds, {
                sshSessionId: opts.sshSessionId || '',
                conversationKey: opts.conversationKey,
                dshSessionId: sessionId,
                engine: 'dsh',
                conversationId: opts.conversationId,
                workspace: opts.workspace,
                confirmationPolicy: opts.confirmationPolicy,
                // apiKey 不写入绑定文件（明文落盘风险）；唤醒时由 resumer 从服务端加密配置读取
                profile: {
                  provider: opts.profile.provider,
                  model: opts.profile.model,
                  baseUrl: opts.profile.baseUrl,
                },
                locale: opts.locale,
              });
              opts.onJobsSubmitted?.(jobIds);
              if (added > 0) console.log('[dsh] 作业绑定登记: %s → session %s', jobIds.join(','), sessionId);
            }
          } catch (err) {
            console.warn('[dsh] 作业绑定登记失败: %s', err instanceof Error ? err.message : String(err));
          }
        }
        if (event.type === 'done' || event.type === 'error') {
          opts.send({ ...event, requestId: opts.requestId });
        } else {
          opts.send(event);
        }
        if (event.type === 'done' || event.type === 'error') finish('completed');
      },
    });

    const startPromptOnce = async (): Promise<void> => {
      if (finished || promptStarted) return;
      promptStarted = true;
      try {
        const accepted = await client.prompt({ sessionId, text: promptText });
        if (accepted?.accepted === false) {
          sendError(zh ? 'dsh 拒绝了本次请求' : 'dsh rejected the prompt');
          finish('completed');
          return;
        }
        if (finished) return;
        opts.send({
          type: 'status',
          phase: 'working',
          message: zh ? 'dsh 引擎已接管，正在执行…' : 'The dsh engine is working…',
          requestId: opts.requestId,
        });
      } catch (err) {
        const detail = redactDshSensitiveText(err instanceof Error ? err.message : String(err));
        sendError(zh ? `dsh 提交请求失败：${detail}` : `dsh prompt failed: ${detail}`);
        finish('completed');
      }
    };

    const armIdleTimer = (): void => {
      if (idleTimer) clearTimeout(idleTimer);
      // 用户正在回答时不能当成 dsh 空闲超时。SSE 心跳仍会保持前端连接。
      if (pendingQuestionRpcIds.size > 0) {
        idleTimer = undefined;
        return;
      }
      idleTimer = setTimeout(onIdle, MUX_IDLE_TIMEOUT_MS);
      idleTimer.unref?.();
    };

    const connect = (): void => {
      mux = client.connectMux({
        onOpened: () => {
          armIdleTimer();
          startPromptAfterBaseline();
        },
        onFrame: frame => {
          if (frame?.method === 'question/requested' && frame?.payload?.sessionId === sessionId) {
            void respondQuestion(frame);
            return;
          }
          armIdleTimer();
          translator.translateFrame(frame, state);
        },
        onClosed: () => {
          if (finished) return;
          if (!reconnected) {
            reconnected = true;
            console.warn('[dsh] mux 连接断开，重连一次');
            connect();
            armIdleTimer();
          } else {
            sendError(zh ? 'dsh 引擎连接中断' : 'dsh engine connection lost');
            finish('completed');
          }
        },
      });
    };

    const onIdle = (): void => {
      if (finished) return;
      if (!reconnected) {
        reconnected = true;
        console.warn('[dsh] mux 90s 无帧，主动重连一次');
        try { mux?.close(); } catch { /* 已关闭 */ }
        connect();
        armIdleTimer();
      } else {
        sendError(zh ? 'dsh 引擎响应超时' : 'dsh engine response timed out');
        finish('completed');
      }
    };

    const onAbort = (): void => {
      void client.cancel(sessionId).catch(() => { /* 取消尽力而为 */ });
      finish('completed');
    };

    opts.requestAbort.addEventListener('abort', onAbort, { once: true });
    if (opts.requestAbort.aborted) {
      onAbort();
      return;
    }

    connect();
    armIdleTimer();
  });
}
