import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTransferAdapter, registerTransferRoutes } from './registerTransferRoutes';

vi.mock('./transferStore', () => ({ loadTasks: vi.fn(async () => []) }));

const tempDirs: string[] = [];

async function makeTempDir(): Promise<string> {
  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'hpclaw-transfer-routes-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map(dir => fs.promises.rm(dir, { recursive: true, force: true })));
});

describe('createTransferAdapter', () => {
  it('verifies downloaded temporary files against remote SFTP size', async () => {
    const dir = await makeTempDir();
    const localTemp = path.join(dir, 'filecan.out.part');
    await fs.promises.writeFile(localTemp, Buffer.alloc(1525));

    const sftp = {
      stat: (remotePath: string, callback: (err: Error | null, attrs?: { size: number }) => void) => {
        expect(remotePath).toBe('/public/home/hpzhang/filecan.out');
        callback(null, { size: 1525 });
      },
    };
    const adapter = createTransferAdapter(() => ({
      cluster: { getSftp: () => sftp },
      home: '/public/home/hpzhang',
    } as any));

    await expect(adapter.verify(
      localTemp,
      '/public/home/hpzhang/filecan.out',
      'size',
      { direction: 'download', sessionId: 'ssh-1' },
    )).resolves.toBeUndefined();
  });

  it('replaces an existing remote destination when upload rename cannot overwrite it', async () => {
    const calls: string[] = [];
    let renameAttempts = 0;
    const sftp = {
      stat: (remotePath: string, callback: (err: Error | null, attrs?: { size: number }) => void) => {
        calls.push(`stat:${remotePath}`);
        callback(null, { size: 1513 });
      },
      rename: (from: string, to: string, callback: (err?: Error) => void) => {
        calls.push(`rename:${from}->${to}`);
        renameAttempts += 1;
        callback(renameAttempts === 1 ? new Error('Failure') : undefined);
      },
      unlink: (remotePath: string, callback: (err?: Error) => void) => {
        calls.push(`unlink:${remotePath}`);
        callback();
      },
    };
    const adapter = createTransferAdapter(() => ({
      cluster: { getSftp: () => sftp },
      home: '/public/home/hpzhang',
    } as any));

    await expect(adapter.remoteRename(
      '/public/home/hpzhang/.minimap.err.hpclaw-test.part',
      '/public/home/hpzhang/minimap.err',
      'ssh-1',
    )).resolves.toBeUndefined();

    expect(calls).toEqual([
      'rename:/public/home/hpzhang/.minimap.err.hpclaw-test.part->/public/home/hpzhang/minimap.err',
      'stat:/public/home/hpzhang/minimap.err',
      'unlink:/public/home/hpzhang/minimap.err',
      'rename:/public/home/hpzhang/.minimap.err.hpclaw-test.part->/public/home/hpzhang/minimap.err',
    ]);
  });

  it('preflights both clusters and repairs only current-user source/parent permissions', async () => {
    const sourceExec = vi.fn(async () => '');
    const destinationExec = vi.fn(async () => '');
    const adapter = createTransferAdapter((sessionId) => ({
      cluster: {
        exec: sessionId === 'source' ? sourceExec : destinationExec,
        getSftp: () => ({}),
      },
      home: sessionId === 'source' ? '/home/alice' : '/home/bob',
    } as any));

    await adapter.prepareRemoteCopy!({
      sourcePath: '/private/alice/project/a.fa',
      destinationPath: '/scratch/bob/results/.a.fa.hpclaw.part',
      sourceSessionId: 'source',
      destinationSessionId: 'destination',
    });

    expect(sourceExec).toHaveBeenCalledOnce();
    expect(destinationExec).toHaveBeenCalledOnce();
    const sourceCommand = String(sourceExec.mock.calls[0][0]);
    const destinationCommand = String(destinationExec.mock.calls[0][0]);
    expect(sourceCommand).toContain('chmod u+r "$f"');
    expect(sourceCommand).toContain('chmod u+x "$p"');
    expect(destinationCommand).toContain('chmod u+rwx "$p"');
    expect(destinationCommand).toContain('/scratch/bob/results');
    expect(`${sourceCommand}\n${destinationCommand}`).not.toMatch(/chmod\s+(?:777|a\+|o\+)/);
  });
});

describe('registerTransferRoutes', () => {
  it('ends preflight with 401 when the destination session is stale', async () => {
    let preflight: ((req: any, res: any) => Promise<void>) | undefined;
    const app = {
      get: vi.fn(),
      post: vi.fn((route: string, handler: (req: any, res: any) => Promise<void>) => {
        if (route === '/api/transfers/preflight-remote-copy') preflight = handler;
      }),
      put: vi.fn(),
      delete: vi.fn(),
    };
    const io = { emit: vi.fn() };
    await registerTransferRoutes(app as any, io as any, () => undefined);

    const response = {
      status: vi.fn(),
      json: vi.fn(),
    } as any;
    response.status.mockReturnValue(response);
    await preflight!({ session: {}, get: vi.fn(() => 'stale-session') }, response);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.objectContaining({ code: 'SSH_SESSION_REQUIRED' }),
    }));
  });
});
