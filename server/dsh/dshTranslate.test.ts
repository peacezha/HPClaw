import { describe, expect, it, vi } from 'vitest';
import { createTranslateState, createTranslator } from './dshTranslate';

function setup(sessionId = 'sess-1') {
  const sent: any[] = [];
  const translator = createTranslator({ send: event => sent.push(event) });
  const state = createTranslateState(sessionId);
  return { sent, translator, state };
}

function envelope(method: string, payload: unknown, rpcId = 'rpc-1') {
  return { type: 'server-request', rpcId, method, payload };
}

function sessionEvent(event: unknown, sessionId = 'sess-1', rpcId = 'rpc-1') {
  return envelope('session/event', { type: 'session/event', sessionId, event: { seq: 1, time: 0, ...(event as object) } }, rpcId);
}

describe('dshTranslate', () => {
  it('translates text-delta chunks into content events and accumulates text', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({ type: 'assistant/chunk', data: { turn: 1, step: 1, chunk: { type: 'text-delta', index: 0, text: '你好' } } }), state);
    translator.translateFrame(sessionEvent({ type: 'assistant/chunk', data: { turn: 1, step: 1, chunk: { type: 'text-delta', index: 0, text: '，世界' } } }), state);
    expect(sent).toEqual([
      { type: 'content', content: '你好' },
      { type: 'content', content: '，世界' },
    ]);
    expect(state.accumulatedText).toBe('你好，世界');
  });

  it('translates reasoning-delta chunks into reasoning events', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({ type: 'assistant/chunk', data: { turn: 1, step: 1, chunk: { type: 'reasoning-delta', index: 1, text: '先想' } } }), state);
    expect(sent).toEqual([{ type: 'reasoning', content: '先想' }]);
    expect(state.accumulatedText).toBe('');
  });

  it('ignores block-start, tool-call-delta and block-end chunks', () => {
    const { sent, translator, state } = setup();
    const data = { turn: 1, step: 1 };
    translator.translateFrame(sessionEvent({ type: 'assistant/chunk', data: { ...data, chunk: { type: 'block-start', index: 0, blockType: 'text' } } }), state);
    translator.translateFrame(sessionEvent({ type: 'assistant/chunk', data: { ...data, chunk: { type: 'tool-call-delta', index: 1, id: 'c1', name: 'bash', argumentsDelta: '{"command":' } } }), state);
    translator.translateFrame(sessionEvent({ type: 'assistant/chunk', data: { ...data, chunk: { type: 'block-end', index: 1, block: {} } } }), state);
    expect(sent).toEqual([]);
  });

  it('ignores frames for other sessions and non-session/event methods', () => {
    const { sent, translator, state } = setup('sess-1');
    translator.translateFrame(sessionEvent({ type: 'assistant/chunk', data: { chunk: { type: 'text-delta', index: 0, text: 'x' } } }, 'sess-2'), state);
    translator.translateFrame(envelope('session/subscribed', { type: 'session/subscribed', sessionId: 'sess-1', lastSeq: 3 }), state);
    translator.translateFrame(envelope('session/queue', { type: 'session/queue', sessionId: 'sess-1' }), state);
    translator.translateFrame(envelope('approval/resolved', { type: 'approval/resolved', sessionId: 'sess-1', approvalId: 'a1', outcome: 'allowed-once' }), state);
    translator.translateFrame(null, state);
    translator.translateFrame({}, state);
    expect(sent).toEqual([]);
  });

  it('translates tool/call into tool_call with parsed args and remembers the callId', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({ type: 'tool/call', data: { turn: 1, step: 1, callId: 'call-1', name: 'bash', arguments: '{"command":"ls -la"}' } }), state);
    expect(sent).toEqual([{ type: 'tool_call', name: 'bash', args: { command: 'ls -la' } }]);
    expect(state.toolNames.get('call-1')).toBe('bash');
  });

  it('keeps raw arguments when the JSON does not parse', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({ type: 'tool/call', data: { turn: 1, step: 1, callId: 'c2', name: 'bash', arguments: '{broken' } }), state);
    expect(sent).toEqual([{ type: 'tool_call', name: 'bash', args: '{broken' }]);
  });

  it('translates tool/result into tool_result using the remembered tool name', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({ type: 'tool/call', data: { turn: 1, step: 1, callId: 'call-1', name: 'wheatomics_query', arguments: '{}' } }), state);
    sent.length = 0;
    translator.translateFrame(sessionEvent({
      type: 'tool/result',
      data: {
        turn: 1,
        step: 1,
        message: { content: [{ type: 'tool-result', toolCallId: 'call-1', content: [{ type: 'text', text: 'total: 17' }, { type: 'text', text: 'records: [...]' }] }] },
      },
    }), state);
    expect(sent).toEqual([{ type: 'tool_result', name: 'wheatomics_query', result: 'total: 17\nrecords: [...]' }]);
  });

  it('falls back to a generic name for unknown callIds', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({
      type: 'tool/result',
      data: { turn: 1, step: 1, message: { content: [{ type: 'tool-result', toolCallId: 'nope', content: [{ type: 'text', text: 'x' }] }] } },
    }), state);
    expect(sent).toEqual([{ type: 'tool_result', name: 'tool', result: 'x' }]);
  });

  it('truncates tool results at 4000 chars and prefixes [error] on failure', () => {
    const { sent, translator, state } = setup();
    const long = 'y'.repeat(5000);
    translator.translateFrame(sessionEvent({
      type: 'tool/result',
      data: {
        turn: 1,
        step: 1,
        message: { content: [{ type: 'tool-result', toolCallId: 'c1', content: [{ type: 'text', text: long }], isError: true }] },
      },
    }), state);
    expect(sent).toHaveLength(1);
    expect(sent[0].type).toBe('tool_result');
    expect(sent[0].result.startsWith('[error] ')).toBe(true);
    expect(sent[0].result.length).toBe('[error] '.length + 4000);

    sent.length = 0;
    translator.translateFrame(sessionEvent({
      type: 'tool/result',
      data: {
        turn: 1,
        step: 1,
        isError: true,
        message: { content: [{ type: 'tool-result', toolCallId: 'c2', content: [{ type: 'text', text: 'outer' }] }] },
      },
    }), state);
    expect(sent[0].result).toBe('[error] outer');
  });

  it('translates step/start into a step event', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({ type: 'step/start', data: { turn: 1, step: 3 } }), state);
    expect(sent).toEqual([{ type: 'step', step: 3 }]);
  });

  it('translates turn/end into done with accumulated text', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({ type: 'assistant/chunk', data: { chunk: { type: 'text-delta', index: 0, text: '答案' } } }), state);
    translator.translateFrame(sessionEvent({ type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } }), state);
    expect(sent[1]).toEqual({ type: 'done', content: '答案' });
  });

  it('falls back to the assistant/message snapshot when no deltas streamed', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({
      type: 'assistant/message',
      data: { turn: 1, step: 1, message: { content: [{ type: 'reasoning', text: '想' }, { type: 'text', text: '快照答案' }] } },
    }), state);
    expect(sent).toEqual([]);
    translator.translateFrame(sessionEvent({ type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } }), state);
    expect(sent).toEqual([{ type: 'done', content: '快照答案' }]);
  });

  it('turn/end error becomes a visible error and redacts an API key used as the URL', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({
      type: 'turn/end',
      data: {
        turn: 1,
        reason: {
          kind: 'error',
          error: { code: 'TRANSPORT', message: 'DeepSeek API request to sk-1234567890abcdef failed' },
        },
      },
    }), state);
    expect(sent).toEqual([{
      type: 'error',
      error: 'dsh 引擎执行失败（TRANSPORT）：DeepSeek API request to sk-*** failed',
    }]);
  });

  it('turn/end error is also written to the server log for diagnosis', () => {
    // QUOTA(余额不足)等 dsh 侧错误此前只发前端、服务端无日志，排查无迹可查
    const { translator, state } = setup();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      translator.translateFrame(sessionEvent({
        type: 'turn/end',
        data: { turn: 1, reason: { kind: 'error', error: { code: 'QUOTA', message: 'Insufficient Balance' } } },
      }), state);
      expect(spy).toHaveBeenCalledWith('[dsh] 引擎执行失败（%s）: %s', 'QUOTA', 'Insufficient Balance');
    } finally {
      spy.mockRestore();
    }
  });

  it('does not report an empty completed turn as a successful answer', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({ type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } }), state);
    expect(sent).toEqual([{ type: 'error', error: 'dsh 引擎已结束，但没有返回可显示的回答' }]);
  });

  it('maps aborted turns to the existing cancelled sentinel', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(sessionEvent({ type: 'turn/end', data: { turn: 1, reason: { kind: 'aborted', reason: { kind: 'user' } } } }), state);
    expect(sent).toEqual([{ type: 'done', content: '__CANCELLED__' }]);
  });

  it('parses HPClaw confirm reasons into confirm events and records pending approvals', () => {
    const { sent, translator, state } = setup();
    const reason = 'HPClaw 命令确认\n风险级: destructive\n命令: bkill 123 && echo done';
    translator.translateFrame(
      envelope('approval/requested', { type: 'approval/requested', sessionId: 'sess-1', approvalId: 'ap-1', toolName: 'bash', callId: 'c1', reason }, 'env-rpc-7'),
      state,
    );
    expect(sent).toEqual([{ type: 'confirm', id: 'env-rpc-7', command: 'bkill 123 && echo done', risk: 'destructive', title: 'Agent 请求执行命令' }]);
    expect(state.pendingApprovals).toEqual([{ rpcId: 'env-rpc-7', sessionId: 'sess-1', approvalId: 'ap-1' }]);
  });

  it('falls back to the raw reason when the confirm format does not parse', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(
      envelope('approval/requested', { type: 'approval/requested', sessionId: 'sess-1', approvalId: 'ap-2', toolName: 'bash', reason: 'some other reason' }, 'rpc-8'),
      state,
    );
    expect(sent).toEqual([{ type: 'confirm', id: 'rpc-8', command: 'some other reason', risk: 'unknown', title: 'Agent 请求执行命令' }]);

    sent.length = 0;
    translator.translateFrame(
      envelope('approval/requested', { type: 'approval/requested', sessionId: 'sess-1', approvalId: 'ap-3', toolName: 'bash' }, 'rpc-9'),
      state,
    );
    expect(sent[0]).toEqual({ type: 'confirm', id: 'rpc-9', command: '(未提供)', risk: 'unknown', title: 'Agent 请求执行命令' });
  });

  it('ignores approval requests for other sessions', () => {
    const { sent, translator, state } = setup('sess-1');
    translator.translateFrame(
      envelope('approval/requested', { type: 'approval/requested', sessionId: 'sess-2', approvalId: 'ap-x', reason: 'HPClaw 命令确认\n风险级: write\n命令: ls' }),
      state,
    );
    expect(sent).toEqual([]);
    expect(state.pendingApprovals).toEqual([]);
  });

  it('translates stream/error into an error event', () => {
    const { sent, translator, state } = setup();
    translator.translateFrame(envelope('stream/error', { type: 'stream/error', error: { code: 'rate_limit', message: '限流了' } }), state);
    expect(sent).toEqual([{ type: 'error', error: '限流了' }]);

    sent.length = 0;
    translator.translateFrame(envelope('stream/error', { type: 'stream/error', error: { code: 'boom' } }), state);
    expect(sent).toEqual([{ type: 'error', error: 'boom' }]);

    sent.length = 0;
    translator.translateFrame(envelope('stream/error', { type: 'stream/error', error: { message: 'request sk-1234567890abcdef failed' } }), state);
    expect(sent).toEqual([{ type: 'error', error: 'request sk-*** failed' }]);
  });
});
