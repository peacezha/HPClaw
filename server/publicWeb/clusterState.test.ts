// @vitest-environment node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { ClusterWebState } from './clusterState';
const directories: string[] = [];
const initialKey = process.env.TRACE_ENCRYPTION_KEY;
afterEach(() => {
  if (initialKey === undefined) delete process.env.TRACE_ENCRYPTION_KEY; else process.env.TRACE_ENCRYPTION_KEY = initialKey;
  for (const dir of directories.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});
function root() { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'trace-state-test-')); directories.push(dir); return dir; }
function remote() {
  const files = new Map<string, string>();
  const permissions = new Map<string, number>();
  let locked = false;
  const service = {
    async readPreview(file: string) { if (!files.has(file)) throw Object.assign(new Error('missing'), { code: 2 }); return Buffer.from(files.get(file)!); },
    async writeFile(file: string, data: string) { files.set(file, data); },
    async chmod(file: string, mode: number) { permissions.set(file, mode); },
  };
  const exec = async (command: string) => {
    if (command.startsWith('if mkdir')) { if (locked) return ''; locked = true; return 'TRACE_LOCK_OK'; }
    if (command.startsWith('rmdir')) locked = false;
    if (command.startsWith('mv -f')) { const paths = [...command.matchAll(/'([^']+)'/g)].map(match => match[1]); files.set(paths[1], files.get(paths[0])!); files.delete(paths[0]); }
    return '';
  };
  return { files, service: service as any, exec, permissions };
}
it('restores legacy cluster settings and encryption keys before writing the TRACE namespace', async () => {
  const r = remote(), bytes = Buffer.from([0, 255, 7]);
  r.files.set('/home/alice/hpclaw_web/state.json', JSON.stringify({ version: 1, key: 'a'.repeat(64), files: {
    'ai-profile.json': 'encrypted-old-key', 'skills/private/image.png': 'hpclaw-binary-base64:' + bytes.toString('base64'),
  } }));
  process.env.TRACE_ENCRYPTION_KEY = 'b'.repeat(64);
  const local = root(), state = new ClusterWebState(local); await state.attach(r.service, '/home/alice', r.exec);
  expect(process.env.TRACE_ENCRYPTION_KEY).toBe('a'.repeat(64));
  expect(fs.readFileSync(path.join(local, 'skills/private/image.png'))).toEqual(bytes);
  await state.flush(); expect(JSON.parse(r.files.get('/home/alice/trace_web/state.json')!).key).toBe('a'.repeat(64));
  expect(r.files.has('/home/alice/hpclaw_web/state.json')).toBe(true);
});
it('commits private settings on the cluster, restores keys and excludes conversations / bridge tokens', async () => {
  const r = remote(); const local = root(); process.env.TRACE_ENCRYPTION_KEY = 'a'.repeat(64);
  const state = new ClusterWebState(local); await state.attach(r.service, '/home/alice', r.exec);
  fs.writeFileSync(path.join(local, 'ai-profile.json'), '{"apiKey":"encrypted"}');
  fs.writeFileSync(path.join(local, 'dsh-bridge.json'), 'never-persist');
  await state.flush(); const stored = JSON.parse(r.files.get('/home/alice/trace_web/state.json')!);
  expect(Object.keys(stored.files)).toEqual(['ai-profile.json']); expect(stored.key).toBe('a'.repeat(64));
  expect([...r.permissions.values()]).toContain(0o600);
  process.env.TRACE_ENCRYPTION_KEY = 'b'.repeat(64);
  const fresh = root(); await new ClusterWebState(fresh).attach(r.service, '/home/alice', r.exec);
  expect(fs.readFileSync(path.join(fresh, 'ai-profile.json'), 'utf8')).toBe('{"apiKey":"encrypted"}');
  expect(process.env.TRACE_ENCRYPTION_KEY).toBe('a'.repeat(64));
});
it('rejects concurrent same-account overwrites and permission failures without clearing remote state', async () => {
  const r = remote(); const a = root(); const b = root(); process.env.TRACE_ENCRYPTION_KEY = 'a'.repeat(64);
  const first = new ClusterWebState(a); const second = new ClusterWebState(b);
  await first.attach(r.service, '/home/alice', r.exec); await second.attach(r.service, '/home/alice', r.exec);
  fs.writeFileSync(path.join(a, 'ai-profile.json'), 'alice'); await first.flush();
  fs.writeFileSync(path.join(b, 'ai-profile.json'), 'other'); await expect(second.flush()).rejects.toThrow('其他会话');
  expect(JSON.parse(r.files.get('/home/alice/trace_web/state.json')!).files['ai-profile.json']).toBe('alice');
  const bad = { ...r.service, readPreview: async () => { throw Object.assign(new Error('denied'), { code: 3 }); } };
  await expect(new ClusterWebState(root()).attach(bad, '/home/alice', r.exec)).rejects.toThrow('denied');
});
it('restores custom skill YAML and binary assets byte-for-byte from cluster state', async () => {
  const r = remote(); const local = root(); process.env.TRACE_ENCRYPTION_KEY = 'a'.repeat(64);
  fs.mkdirSync(path.join(local, 'skills', 'private'), { recursive: true });
  const bytes = Buffer.from([0, 255, 137, 80, 78, 71]);
  fs.writeFileSync(path.join(local, 'skills/private/figure.png'), bytes);
  fs.writeFileSync(path.join(local, 'skills/private/settings.yaml'), 'threads: 10\n');
  const state = new ClusterWebState(local); await state.attach(r.service, '/home/alice', r.exec); await state.flush();
  const restored = root(); await new ClusterWebState(restored).attach(r.service, '/home/alice', r.exec);
  expect(fs.readFileSync(path.join(restored, 'skills/private/figure.png'))).toEqual(bytes);
  expect(fs.readFileSync(path.join(restored, 'skills/private/settings.yaml'), 'utf8')).toBe('threads: 10\n');
});
