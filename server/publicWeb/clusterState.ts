import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { SftpFileService } from '../files/sftpFileService';

const LIMIT = 16 * 1024 * 1024;
const quote = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`;
const hash = (value?: string) => value === undefined ? '' : crypto.createHash('sha256').update(value).digest('hex');
const BINARY_PREFIX = 'hpclaw-binary-base64:';
const binary = (name: string) => /\.(?:png|jpg|jpeg|gif|pdf)$/i.test(name);
const accepted = (name: string) => /^(?:ai-profile\.json|browser-preferences\.json|notify-config\.json|scheduler-config\.json|scheduler-tags\.json|job-events\.json|job-agent-bindings\.json|formal-workflow-continuations\.json|job-submission[^/]*\.json|workflows\/[\w.-]+\.json|skills\/[^\x00-\x1f\\]+\.(?:md|txt|json|yaml|yml|toml|sh|py|js|ts|R|png|jpg|jpeg|gif|svg|pdf))$/i.test(name)
  && !name.split('/').some(part => !part || part === '.' || part === '..') && !name.includes('.skill-index');
interface State { version: 1; key: string; files: Record<string, string> }

/** Remote authority with a private, disposable working cache. No server shared user store. */
export class ClusterWebState {
  private baseline: Record<string, string> = {};
  private service?: SftpFileService;
  private home = '';
  private exec?: (command: string, timeout?: number) => Promise<string>;
  private pending: Promise<void> = Promise.resolve();
  constructor(private readonly root: string) {}

  private get directory() { return path.posix.join(this.home, 'hpclaw_web'); }
  private get file() { return path.posix.join(this.directory, 'state.json'); }

  private async read(): Promise<State | undefined> {
    try {
      const raw = await this.service!.readPreview(this.file, LIMIT);
      const parsed = JSON.parse(raw.toString('utf8'));
      if (parsed.version !== 1 || !/^[a-f0-9]{64}$/.test(parsed.key) || !parsed.files
        || typeof parsed.files !== 'object' || Array.isArray(parsed.files)
        || Object.entries(parsed.files).some(([name, data]) => !accepted(name) || typeof data !== 'string')) {
        throw new Error('集群网页设置文件无效；不会覆盖，请从备份恢复');
      }
      return parsed;
    } catch (error) {
      if ((error as any).code === 2 || (error as any).code === 'ENOENT') return undefined;
      throw error;
    }
  }

  async attach(service: SftpFileService, home: string, exec: (command: string, timeout?: number) => Promise<string>) {
    this.service = service; this.home = home; this.exec = exec;
    await exec(`umask 077; mkdir -p ${quote(this.directory)} && chmod 700 ${quote(this.directory)}`, 15000);
    const state = await this.read();
    if (state) {
      process.env.HPCLAW_ENCRYPTION_KEY = state.key;
      for (const [name, content] of Object.entries(state.files)) {
        const target = path.join(this.root, name);
        fs.mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 });
        let data: string | Buffer = content;
        if (binary(name)) {
          if (!content.startsWith(BINARY_PREFIX)) throw new Error('私人技能二进制附件编码无效，不会覆盖集群数据');
          data = Buffer.from(content.slice(BINARY_PREFIX.length), 'base64');
          if (data.toString('base64') !== content.slice(BINARY_PREFIX.length)) throw new Error('私人技能附件已损坏');
        }
        fs.writeFileSync(target, data, { mode: 0o600 });
      }
      this.baseline = { ...state.files };
    }
  }

  private snapshot(): Record<string, string> {
    const files: Record<string, string> = {};
    const walk = (dir: string, prefix = '') => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isSymbolicLink()) continue;
        const relative = prefix + entry.name;
        if (entry.isDirectory() && ['workflows', 'skills'].includes(relative.split('/')[0])) walk(path.join(dir, entry.name), relative + '/');
        else if (entry.isFile() && accepted(relative)) {
          const target = path.join(dir, entry.name);
          if (fs.statSync(target).size > LIMIT) throw new Error('单个集群设置文件超过 16 MiB');
          files[relative] = binary(relative) ? BINARY_PREFIX + fs.readFileSync(target).toString('base64') : fs.readFileSync(target, 'utf8');
        }
      }
    };
    walk(this.root);
    return files;
  }

  flush(): Promise<void> {
    const operation = this.pending.catch(() => {}).then(async () => {
      if (!this.service || !this.exec) return;
      const next = this.snapshot();
      const changed = [...new Set([...Object.keys(next), ...Object.keys(this.baseline)])]
        .filter(name => hash(next[name]) !== hash(this.baseline[name]));
      if (!changed.length) return;
      const lock = path.posix.join(this.directory, 'state.lock');
      const acquired = await this.exec(`if mkdir ${quote(lock)} 2>/dev/null; then printf HPCLAW_LOCK_OK; fi`, 10000);
      if (!acquired.includes('HPCLAW_LOCK_OK')) throw new Error('同一集群账号正在保存设置，请稍后重试');
      try {
        const remote = await this.read();
        if (remote && remote.key !== process.env.HPCLAW_ENCRYPTION_KEY) throw new Error('该账号的网页设置已由另一会话初始化，请重新登录；不会覆盖密钥');
        const files = { ...(remote?.files || {}) };
        for (const name of changed) {
          if (hash(files[name]) !== hash(this.baseline[name])) throw new Error(`集群设置已被其他会话更新：${name}；请重新登录，不会覆盖其他会话`);
          if (next[name] === undefined) delete files[name]; else files[name] = next[name];
        }
        const content = JSON.stringify({ version: 1, key: process.env.HPCLAW_ENCRYPTION_KEY, files });
        if (Buffer.byteLength(content) > LIMIT) throw new Error('私人设置总大小超过 16 MiB，请拆分自定义技能');
        const temporary = path.posix.join(this.directory, `state-${crypto.randomUUID()}.tmp`);
        await this.service.writeFile(temporary, content);
        await this.service.chmod(temporary, 0o600);
        await this.exec(`mv -f -- ${quote(temporary)} ${quote(this.file)}`, 15000);
        this.baseline = next;
      } finally { await this.exec(`rmdir -- ${quote(lock)}`, 10000); }
    });
    this.pending = operation;
    return operation;
  }
}
