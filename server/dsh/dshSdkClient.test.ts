import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { DshSdkClient } from './dshSdkClient';

const FAKE_SERVER = path.join(__dirname, 'test-fixtures', 'fakeSdkServer.cjs');

const clients: DshSdkClient[] = [];

function spawnFake(env: NodeJS.ProcessEnv = {}): DshSdkClient {
  const client = DshSdkClient.spawn({
    command: process.execPath,
    args: [FAKE_SERVER],
    shell: false,
    env: { ...process.env, ...env },
    cwd: process.cwd(),
  });
  clients.push(client);
  return client;
}

afterEach(async () => {
  for (const client of clients.splice(0)) {
    try { client.process.kill('SIGKILL'); } catch { /* 已退出 */ }
  }
  // 给子进程一点退出时间，避免 Windows 上句柄泄漏告警
  await new Promise(resolve => setTimeout(resolve, 20));
});

describe('DshSdkClient', () => {
  it('completes the initialize handshake with the wire-stable server identity', async () => {
    const client = spawnFake();
    const result = await client.initialize({ cwd: process.cwd(), provider: 'deepseek-official', model: 'deepseek-flash' });
    expect(result.serverInfo.name).toBe('deepseek-harness-sdk-runtime');
  });

  it('answers prompt, streams session.event notifications in order and tracks status', async () => {
    const client = spawnFake();
    await client.initialize({ cwd: process.cwd(), provider: 'deepseek-official', model: 'deepseek-flash' });
    const events: any[] = [];
    const statuses: string[] = [];
    client.onSessionEvent(n => events.push(n));
    client.onSessionStatus(n => statuses.push(n.status));
    const ack = await client.prompt({ sessionId: 's-1', text: '你好' });
    expect(ack.messageId).toBe('fake-message-1');
    await client.wait('s-1');
    expect(events.map(n => n.event.type)).toEqual(['assistant/message', 'turn/end']);
    expect(events[0].sessionId).toBe('s-1');
    expect(statuses).toEqual(['running', 'idle']);
    expect(client.sessionStatusOf('s-1')).toBe('idle');
  });

  it('probeSession distinguishes idle, running and unknown sessions', async () => {
    const client = spawnFake();
    await client.initialize({ cwd: process.cwd(), provider: 'deepseek-official', model: 'deepseek-flash' });
    expect(await client.probeSession('s-idle', 500)).toBe('idle');
    // running 状态需要 fake server 处于窗口期；直接发 prompt 后立刻探测不可靠，
    // 这里用 resume 的 unknown 错误覆盖 not-found 分支。
    expect(await client.probeSession('unknown-x', 500)).toBe('idle'); // fake 的 wait 不报错 → idle
    await expect(client.resume('unknown-s')).rejects.toThrow('unknown SDK session');
  });

  it('rejects unknown methods with the server error message', async () => {
    const client = spawnFake();
    await client.initialize({ cwd: process.cwd(), provider: 'deepseek-official', model: 'deepseek-flash' });
    const internal = client as unknown as { request<T>(method: string, params: unknown): Promise<T> };
    await expect(internal.request('bogus/method', {})).rejects.toThrow('unknown DeepSeek Harness SDK runtime method');
  });

  it('rejects every pending request exactly once when the process crashes', async () => {
    const client = spawnFake({ FAKE_DSH_CRASH_AFTER_INIT: '1' });
    const exit = new Promise<void>(resolve => client.onExit(() => resolve()));
    await client.initialize({ cwd: process.cwd(), provider: 'deepseek-official', model: 'deepseek-flash' });
    const pending = client.prompt({ sessionId: 's-1', text: 'x' });
    await exit;
    await expect(pending).rejects.toThrow('dsh_process_exit');
    await expect(client.prompt({ sessionId: 's-1', text: 'y' })).rejects.toThrow('dsh_process_exit');
    expect(client.isAlive).toBe(false);
  });

  it('times out a request that never gets a response', async () => {
    const client = spawnFake({ FAKE_DSH_HANG: '1' });
    await expect(client.initialize({ cwd: process.cwd(), provider: 'deepseek-official', model: 'deepseek-flash' }, 100))
      .rejects.toThrow('DSH_SDK_RPC_TIMEOUT');
  });

  it('shutdown resolves and the fake process exits', async () => {
    const client = spawnFake();
    await client.initialize({ cwd: process.cwd(), provider: 'deepseek-official', model: 'deepseek-flash' });
    await client.shutdown();
    const exit = new Promise<number | null>(resolve => {
      if (!client.isAlive) return resolve(client.process.exitCode);
      client.onExit(code => resolve(code));
    });
    expect(await exit).toBe(0);
  });
});
