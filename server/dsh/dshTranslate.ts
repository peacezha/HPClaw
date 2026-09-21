// dsh events.mux 帧 → HPClaw SSE 事件的纯翻译层（无 IO，单测友好）。
// 帧信封：{ type:'server-request', rpcId, method:<帧type>, payload:<帧> }。
// 产出形状与前端既有契约一致：content/reasoning/tool_call/tool_result/step/confirm/done/error。

import { redactDshSensitiveText } from './dshConfigSafety';

export interface PendingApprovalMeta {
  rpcId: string;
  sessionId: string;
  approvalId: string;
}

export interface TranslateState {
  sessionId: string;
  /** 已流出的正文增量累计，turn/end 时回填 done.content */
  accumulatedText: string;
  /** assistant/message 快照正文（增量缺失时给 done.content 兜底） */
  lastAssistantText: string;
  /** tool/call 的 callId → name，供 tool/result 找回工具名 */
  toolNames: Map<string, string>;
  /** approval/requested 暂存（rpcId/sessionId/approvalId），供 respondApproval 使用 */
  pendingApprovals: PendingApprovalMeta[];
}

export function createTranslateState(sessionId: string): TranslateState {
  return {
    sessionId,
    accumulatedText: '',
    lastAssistantText: '',
    toolNames: new Map(),
    pendingApprovals: [],
  };
}

export interface TranslatorHooks {
  send: (event: any) => void;
}

export interface DshTranslator {
  translateFrame: (frameEnvelope: any, state: TranslateState) => void;
}

const CONFIRM_TITLE = 'Agent 请求执行命令';
const TOOL_RESULT_MAX = 4000;

/** dsh 的 plugin 审批 reason 形如："HPClaw 命令确认\n风险级: <risk>\n命令: <cmd>" */
const CONFIRM_REASON_PATTERN = /^HPClaw 命令确认\r?\n风险级\s*[:：]\s*(.+?)\r?\n命令\s*[:：]\s*([\s\S]*)$/;

function tryParseJson(text: unknown): unknown {
  if (typeof text !== 'string') return text ?? {};
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function createTranslator(hooks: TranslatorHooks): DshTranslator {
  const send = hooks.send;

  const translateChunk = (data: any, state: TranslateState): void => {
    const chunk = data?.chunk;
    if (chunk?.type === 'text-delta' && typeof chunk.text === 'string') {
      state.accumulatedText += chunk.text;
      send({ type: 'content', content: chunk.text });
    } else if (chunk?.type === 'reasoning-delta' && typeof chunk.text === 'string') {
      send({ type: 'reasoning', content: chunk.text });
    }
    // block-start / tool-call-delta / block-end 不直接产出：tool/call 会带完整参数。
  };

  const translateAssistantMessage = (data: any, state: TranslateState): void => {
    const content = data?.message?.content;
    if (!Array.isArray(content)) return;
    const text = content
      .filter(block => block?.type === 'text' && typeof block.text === 'string')
      .map(block => block.text)
      .join('');
    if (text) state.lastAssistantText = text;
  };

  const translateToolCall = (data: any, state: TranslateState): void => {
    const name = typeof data?.name === 'string' && data.name ? data.name : 'tool';
    if (data?.callId !== undefined && data?.callId !== null) {
      state.toolNames.set(String(data.callId), name);
    }
    send({ type: 'tool_call', name, args: tryParseJson(data?.arguments) });
  };

  const translateToolResult = (data: any, state: TranslateState): void => {
    const content = data?.message?.content;
    if (!Array.isArray(content)) return;
    for (const item of content) {
      if (!item || item.type !== 'tool-result') continue;
      const name = state.toolNames.get(String(item.toolCallId)) || 'tool';
      const texts = Array.isArray(item.content)
        ? item.content
            .filter((part: any) => part?.type === 'text' && typeof part.text === 'string')
            .map((part: any) => part.text as string)
        : [];
      let result = texts.join('\n');
      if (result.length > TOOL_RESULT_MAX) result = result.slice(0, TOOL_RESULT_MAX);
      if (item.isError || data?.isError) result = `[error] ${result}`;
      send({ type: 'tool_result', name, result });
    }
  };

  const translateSessionEvent = (payload: any, state: TranslateState): void => {
    const event = payload?.event;
    const data = event?.data;
    switch (event?.type) {
      case 'assistant/chunk':
        translateChunk(data, state);
        return;
      case 'assistant/message':
        translateAssistantMessage(data, state);
        return;
      case 'tool/call':
        translateToolCall(data, state);
        return;
      case 'tool/result':
        translateToolResult(data, state);
        return;
      case 'step/start': {
        if (typeof data?.step === 'number') send({ type: 'step', step: data.step });
        return;
      }
      case 'turn/end':
        if (data?.reason?.kind === 'error') {
          const failure = data.reason.error || data.reason.failure || {};
          const code = typeof failure.code === 'string' && failure.code ? failure.code : 'UNKNOWN';
          const detail = redactDshSensitiveText(failure.message || 'dsh 未提供详细错误信息');
          // 同步写服务端日志：此前此类错误只发前端，排查（如 QUOTA 余额不足）时无迹可查
          console.error('[dsh] 引擎执行失败（%s）: %s', code, detail);
          send({ type: 'error', error: `dsh 引擎执行失败（${code}）：${detail}` });
          return;
        }
        if (data?.reason?.kind === 'aborted') {
          send({ type: 'done', content: state.accumulatedText || '__CANCELLED__' });
          return;
        }
        if (data?.reason?.kind && data.reason.kind !== 'completed') {
          console.error('[dsh] 引擎异常结束（%s）', data.reason.kind);
          send({ type: 'error', error: `dsh 引擎异常结束（${redactDshSensitiveText(data.reason.kind)}）` });
          return;
        }
        {
          const content = state.accumulatedText || state.lastAssistantText;
          if (content.trim()) send({ type: 'done', content });
          else {
            console.error('[dsh] 引擎已结束，但没有返回可显示的回答');
            send({ type: 'error', error: 'dsh 引擎已结束，但没有返回可显示的回答' });
          }
        }
        return;
      default:
        return; // 其余 session 事件（queue/jobs/projection 等）忽略
    }
  };

  const translateApprovalRequested = (envelope: any, payload: any, state: TranslateState): void => {
    const reason = typeof payload?.reason === 'string' ? payload.reason : '';
    const match = CONFIRM_REASON_PATTERN.exec(reason);
    const command = match ? match[2].trim() : (reason || '(未提供)');
    const risk = match ? match[1].trim() : 'unknown';
    send({ type: 'confirm', id: envelope?.rpcId, command, risk, title: CONFIRM_TITLE });
    if (payload?.approvalId) {
      state.pendingApprovals.push({
        rpcId: String(envelope?.rpcId ?? ''),
        sessionId: String(payload.sessionId),
        approvalId: String(payload.approvalId),
      });
    }
  };

  const translateFrame = (frameEnvelope: any, state: TranslateState): void => {
    try {
      if (!frameEnvelope || typeof frameEnvelope !== 'object') return;
      const method = frameEnvelope.method;
      const payload = frameEnvelope.payload;
      if (method === 'session/event') {
        if (payload?.sessionId !== state.sessionId) return;
        translateSessionEvent(payload, state);
        return;
      }
      if (method === 'approval/requested') {
        if (payload?.sessionId !== state.sessionId) return;
        translateApprovalRequested(frameEnvelope, payload, state);
        return;
      }
      if (method === 'stream/error') {
        const error = payload?.error;
        console.error('[dsh] stream error: %s', error?.message || error?.code || 'unknown');
        send({ type: 'error', error: redactDshSensitiveText(error?.message || error?.code || 'dsh stream error') });
        return;
      }
      // session/subscribed、approval/resolved、session/queue、session/jobs、
      // session/projection 等其余帧一律忽略。
    } catch (err) {
      console.warn('[dsh] 帧翻译异常（已忽略）: %s', err instanceof Error ? err.message : String(err));
    }
  };

  return { translateFrame };
}
