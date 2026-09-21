// dsh web sidecar 生命周期托管：provisioning（插件安装 + cordis.patch.yml 合并）、
// spawn `dsh web`、崩溃指数退避重启、显式停止。同一时刻只允许一个启动流程，
// 并发 ensureSidecar 调用共享同一个 in-flight Promise。

import { exec, spawn, type ChildProcess } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import { APP_ROOT, DATA_ROOT, dataPath, ensureDir } from '../paths';
import { terminateProcessTree } from '../processTree';
import { repairInvalidDeepSeekBaseUrlSetting } from './dshConfigSafety';
import { writeFileAtomic0600 } from './fileUtils';

export type SidecarStatus = 'stopped' | 'provisioning' | 'starting' | 'ready' | 'restarting' | 'failed';

export interface SidecarStatusInfo {
  status: SidecarStatus;
  baseUrl?: string;
  reason?: string;
  restarts: number;
}

export interface EnsureSidecarOptions {
  /** hpclaw-dsh-plugin 源码目录（dev 下是真实目录；打包后是 .asar 内路径，会先拷出） */
  pluginSourceDir: string;
  /** 要暴露给 dsh 技能系统的技能目录列表（.asar 路径同样先拷出） */
  skillDirs: string[];
  /** 追加给 dsh 进程的环境变量（如 DEEPSEEK_API_KEY）；空值不设置 */
  extraEnv?: Record<string, string | undefined>;
  /** 缺省时在 skillDirs 里按约定相对路径探测 */
  wheatomicsScript?: string;
  githubMirrorScript?: string;
  /** 缺省 http://127.0.0.1:<PORT||3003> */
  hpclawBaseUrl?: string;
}

// 显式 undefined 的判别联合：项目 tsconfig 未开 strict，属性在两个分支都直接可访问，
// 不依赖严格模式下的判别收窄。
export type EnsureSidecarResult =
  | { ok: true; baseUrl: string; reason?: undefined }
  | { ok: false; baseUrl?: undefined; reason: string };

const MAX_RESTARTS = 3;
// 打包环境首启较慢（临时目录解压 + 依赖树大 + profile 初始化），实测首次 boot >30s；
// 给足 120s（此时 SSE 请求仍受 15 分钟看门狗保护，用户体验是"启动 dsh 引擎…"等待）。
const STARTUP_TIMEOUT_MS = 120_000;

let status: SidecarStatus = 'stopped';
let currentBaseUrl: string | undefined;
let failReason: string | undefined;
let restarts = 0;
let child: ChildProcess | undefined;
let intentionalStop = false;
let inFlight: Promise<EnsureSidecarResult> | undefined;
let lastOptions: EnsureSidecarOptions | undefined;
let activeOptionsFingerprint: string | undefined;
let ensureQueue: Promise<void> = Promise.resolve();

/**
 * 定位随应用分发的内嵌 dsh（vendor/dsh/lib/bin.js，整树 vendor、不经过 npm/打包器
 * 依赖收集——electron-builder 的生产依赖裁剪会丢掉 dsh 嵌套树里的三方包，实测踩坑）。
 * dev 下在 APP_ROOT/vendor；打包后经 asarUnpack 落在 app.asar.unpacked/vendor。
 * node_modules/@deepseek-ai 路径仅作历史兼容兜底。
 */
function resolveBundledDshBin(): string | undefined {
  const candidates: string[] = [];
  for (const rel of [path.join('vendor', 'dsh', 'lib', 'bin.js'), path.join('node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js')]) {
    const asarPath = path.join(APP_ROOT, rel);
    candidates.push(asarPath.replace(
      `${path.sep}app.asar${path.sep}`,
      `${path.sep}app.asar.unpacked${path.sep}`,
    ));
    candidates.push(asarPath);
  }
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch { /* ignore */ }
  }
  return undefined;
}

/** 随包分发的 node 运行时（vendor/node-runtime/node.exe）。 */
function resolveBundledNode(): string | undefined {
  const rel = path.join('vendor', 'node-runtime', process.platform === 'win32' ? 'node.exe' : 'node');
  const asarPath = path.join(APP_ROOT, rel);
  const unpackedPath = asarPath.replace(
    `${path.sep}app.asar${path.sep}`,
    `${path.sep}app.asar.unpacked${path.sep}`,
  );
  for (const candidate of [unpackedPath, asarPath]) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch { /* ignore */ }
  }
  return undefined;
}

/**
 * 跑内嵌 dsh 的 node 可执行：优先随包的 node.exe——Electron 的 ELECTRON_RUN_AS_NODE
 * 跑不了 dsh loader 依赖的 node-addon-require-builtin 原生模块（打包实测：
 * 同一份 vendor 树系统 node 能 boot、Electron run-as-node 不能）。兜底才用
 * HPCLAW_NODE_EXECUTABLE（Electron）/ process.execPath。
 */
function dshNodeExecutable(): string {
  return resolveBundledNode() || process.env.HPCLAW_NODE_EXECUTABLE || process.execPath;
}

/** 仅当真的把 Electron 本体当 node 用时才需要 ELECTRON_RUN_AS_NODE=1。 */
function dshNodeEnv(): Record<string, string> {
  if (resolveBundledNode()) return {};
  return process.env.HPCLAW_NODE_EXECUTABLE ? { ELECTRON_RUN_AS_NODE: '1' } : {};
}

/**
 * dsh 命令解析（内嵌优先，其他机器无需预装 dsh）：
 * 1. DSH_BIN 显式覆盖（完整命令行）；2. 内嵌 bin.js（node 直跑）；3. 全局安装兜底 npx。
 */
function dshBinCommand(): string {
  if (process.env.DSH_BIN) return process.env.DSH_BIN;
  const bundled = resolveBundledDshBin();
  if (bundled) return `${quoteArg(dshNodeExecutable())} ${quoteArg(bundled)}`;
  return 'npx @deepseek-ai/dsh';
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getSidecarStatus(): SidecarStatusInfo {
  return { status, baseUrl: currentBaseUrl, reason: failReason, restarts };
}

function optionsFingerprint(opts: EnsureSidecarOptions): string {
  const normalized = {
    pluginSourceDir: path.resolve(opts.pluginSourceDir),
    skillDirs: [...opts.skillDirs].map(item => path.resolve(item)).sort(),
    wheatomicsScript: opts.wheatomicsScript || '',
    githubMirrorScript: opts.githubMirrorScript || '',
    hpclawBaseUrl: opts.hpclawBaseUrl || '',
    extraEnv: Object.entries(opts.extraEnv || {}).sort(([a], [b]) => a.localeCompare(b)),
  };
  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}

async function waitForStoppedProcess(proc: ChildProcess | undefined): Promise<void> {
  if (!proc || proc.exitCode !== null) return;
  await Promise.race([
    new Promise<void>(resolve => proc.once('exit', () => resolve())),
    sleep(3_500),
  ]);
}

async function ensureConfiguredSidecar(opts: EnsureSidecarOptions): Promise<EnsureSidecarResult> {
  const fingerprint = optionsFingerprint(opts);
  if (status === 'failed') {
    // 上一次请求耗尽崩溃重试后，后续独立请求允许做一次全新冷启动，
    // 避免 sidecar 在整个桌面生命周期内永久熔断。
    stopSidecar();
  }
  if (status === 'ready' && activeOptionsFingerprint && activeOptionsFingerprint !== fingerprint) {
    console.log('[dsh-sidecar] provider configuration changed; restarting sidecar');
    const previous = child;
    stopSidecar();
    await waitForStoppedProcess(previous);
  }
  lastOptions = opts;
  const result = await ensureLoop(opts);
  if (result.ok) activeOptionsFingerprint = fingerprint;
  return result;
}

export function ensureSidecar(opts: EnsureSidecarOptions): Promise<EnsureSidecarResult> {
  const run = ensureQueue.then(() => ensureConfiguredSidecar(opts));
  ensureQueue = run.then(() => undefined, () => undefined);
  return run;
}

async function ensureLoop(opts: EnsureSidecarOptions): Promise<EnsureSidecarResult> {
  for (;;) {
    if (status === 'ready' && currentBaseUrl) return { ok: true, baseUrl: currentBaseUrl };
    if (status === 'failed') return { ok: false, reason: failReason || 'dsh sidecar failed' };
    if (inFlight) {
      const result = await inFlight;
      // 启动流程结束时若正处于崩溃重启窗口，继续等待重启结果而不是把中间失败抛给调用方。
      if (result.ok || status !== 'restarting') return result;
      continue;
    }
    if (status === 'restarting') {
      // 崩溃退避计时中：等重启流程被调度起来。
      await sleep(250);
      continue;
    }
    // status === 'stopped'（或首次调用）：发起唯一启动流程。本赋值同步完成，
    // 后续并发调用会撞上上面的 inFlight 分支，保证同一时刻只有一个 boot。
    intentionalStop = false;
    restarts = 0;
    inFlight = boot(opts).finally(() => { inFlight = undefined; });
  }
}

export function stopSidecar(): void {
  intentionalStop = true;
  restarts = 0;
  failReason = undefined;
  currentBaseUrl = undefined;
  activeOptionsFingerprint = undefined;
  status = 'stopped';
  const proc = child;
  child = undefined;
  if (proc) {
    const completeTreeStopped = terminateProcessTree(proc);
    if (!completeTreeStopped) {
      const killer = setTimeout(() => {
        try { proc.kill('SIGKILL'); } catch { /* 已退出 */ }
      }, 3_000);
      killer.unref?.();
    }
  }
}

async function boot(opts: EnsureSidecarOptions): Promise<EnsureSidecarResult> {
  status = 'provisioning';
  try {
    const provisioned = await provision(opts);
    if (!provisioned.ok) {
      status = 'stopped';
      failReason = provisioned.reason || 'provisioning_failed';
      return { ok: false, reason: failReason };
    }
  } catch (err) {
    status = 'stopped';
    failReason = `provisioning_failed: ${err instanceof Error ? err.message : String(err)}`;
    return { ok: false, reason: failReason };
  }

  status = 'starting';
  const started = await spawnAndWaitReady(opts);
  const startedBaseUrl = started.baseUrl;
  if (!started.ok || !startedBaseUrl) {
    status = 'stopped';
    failReason = started.reason || 'startup_failed';
    return { ok: false, reason: failReason };
  }
  status = 'ready';
  currentBaseUrl = startedBaseUrl;
  failReason = undefined;
  return { ok: true, baseUrl: startedBaseUrl };
}

/* ---------------- provisioning ---------------- */

function quoteArg(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`;
}

/** .asar 内路径对 dsh/pnpm 不可读，先递归拷到 DATA_ROOT/dsh-assets 下再使用；其余路径原样返回。 */
function materializeAsset(sourceDir: string, destDir: string): string {
  if (!sourceDir.includes('.asar')) return sourceDir;
  // 经 Electron asar 补丁 readdir 在部分路径形态下会抛 ENOENT（实测踩中）；
  // 凡是需要外部进程读取的资产一律 asarUnpack，这里映射到 app.asar.unpacked 的真实路径。
  const realSource = toUnpackedPath(sourceDir);
  fs.rmSync(destDir, { recursive: true, force: true });
  ensureDir(path.dirname(destDir));
  // bioSkills 体量大且不在 customSkillDirs 挂载列表（两层嵌套 dsh 发现不了），跳过以省启动拷贝
  copyDirRecursive(realSource, destDir, new Set(['bioSkills']));
  return destDir;
}

/** `...\resources\app.asar\<rel>` → `...\resources\app.asar.unpacked\<rel>`（unpacked 存在才换，否则原样）。 */
function toUnpackedPath(p: string): string {
  const unpacked = p.replace(
    `${path.sep}app.asar${path.sep}`,
    `${path.sep}app.asar.unpacked${path.sep}`,
  );
  if (unpacked !== p) {
    try {
      if (fs.existsSync(unpacked)) return unpacked;
    } catch { /* ignore */ }
  }
  return p;
}

/**
 * 递归目录拷贝。不能用 fs.cpSync：Electron 的 asar 补丁覆盖 readdir/stat/readFile
 * 等经典 API，但不覆盖 cpSync（打包后从 app.asar 拷出时会抛 ENOENT——实测踩中）。
 */
function copyDirRecursive(sourceDir: string, destDir: string, excludeNames?: Set<string>): void {
  ensureDir(destDir);
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (excludeNames?.has(entry.name)) continue;
    const src = path.join(sourceDir, entry.name);
    const dst = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(src, dst, excludeNames);
    } else if (entry.isFile()) {
      fs.writeFileSync(dst, fs.readFileSync(src));
    }
  }
}

function samePath(a: string, b: string): boolean {
  const na = path.resolve(a);
  const nb = path.resolve(b);
  return process.platform === 'win32' ? na.toLowerCase() === nb.toLowerCase() : na === nb;
}

function isPluginInstalledAt(linkPath: string, targetDir: string): boolean {
  try {
    if (!fs.existsSync(linkPath)) return false;
    // pnpm 本地目录装为 link:（Windows 上是 junction），realpath 可解到真实目标。
    return samePath(fs.realpathSync(linkPath), targetDir);
  } catch {
    return false;
  }
}

function runShell(command: string, timeoutMs = 120_000): Promise<{ ok: true; error?: undefined } | { ok: false; error: string }> {
  return new Promise(resolve => {
    exec(command, { cwd: DATA_ROOT, windowsHide: true, timeout: timeoutMs, env: { ...process.env, ...dshNodeEnv() } }, (error, _stdout, stderr) => {
      if (error) {
        const detail = String(stderr || '').trim();
        resolve({ ok: false, error: `${error.message}${detail ? `\n${detail.slice(0, 2000)}` : ''}` });
      } else {
        resolve({ ok: true });
      }
    });
  });
}

function resolveScript(opts: EnsureSidecarOptions, explicit: string | undefined, relative: string, skillDirs: string[]): string | undefined {
  if (explicit) return explicit;
  for (const dir of skillDirs) {
    const candidate = path.join(dir, ...relative.split('/'));
    if (fs.existsSync(candidate)) return candidate;
  }
  return undefined;
}

/**
 * 直接建立 profile 的插件 link（package.json 依赖条目 + node_modules junction），
 * 不经 `dsh plugin add`（其本质转发 pnpm，打包环境下调用不可靠——实测首请求因此
 * plugin_install_failed 回退）。junction 创建失败时调用方才回退到 plugin add。
 */
function ensurePluginLink(profileDir: string, targetDir: string): { ok: true; error?: undefined } | { ok: false; error: string } {
  try {
    const pkgFile = path.join(profileDir, 'package.json');
    let pkg: Record<string, unknown> = { name: 'dsh-profile-web', private: true };
    try {
      const parsed = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) pkg = parsed;
    } catch { /* 文件不存在：用最小骨架（profile 其余文件由 dsh boot 自愈补齐） */ }
    const deps = ((pkg as { dependencies?: Record<string, string> }).dependencies ||= {});
    const linkSpec = `link:${targetDir}`;
    if (deps['hpclaw-dsh-plugin'] !== linkSpec) {
      deps['hpclaw-dsh-plugin'] = linkSpec;
      writeFileAtomic0600(pkgFile, JSON.stringify(pkg, null, 2));
    }
    const linkPath = path.join(profileDir, 'node_modules', 'hpclaw-dsh-plugin');
    if (!isPluginInstalledAt(linkPath, targetDir)) {
      ensureDir(path.dirname(linkPath));
      fs.rmSync(linkPath, { recursive: true, force: true });
      fs.symlinkSync(targetDir, linkPath, 'junction');
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function provision(opts: EnsureSidecarOptions): Promise<{ ok: true; reason?: undefined } | { ok: false; reason: string }> {
  const dshBin = dshBinCommand();
  const dshHome = path.join(os.homedir(), '.dsh');
  const profileDir = path.join(os.homedir(), '.dsh', 'profiles', 'web');

  // DSH user settings override launch environment variables. Repair the one
  // known unsafe legacy state (an API key pasted into baseURL) before booting,
  // otherwise every request fails and the secret is copied into DSH history.
  try {
    const repair = repairInvalidDeepSeekBaseUrlSetting(path.join(dshHome, 'settings.yaml'));
    if (repair.changed) {
      console.warn('[dsh-sidecar] 已移除无效的 DeepSeek baseURL；将使用 HPClaw 中配置的接口地址');
    }
  } catch (err) {
    console.warn('[dsh-sidecar] DSH 设置安全检查失败（继续启动）: %s', err instanceof Error ? err.message : String(err));
  }

  // a. 插件目录（.asar → 拷出）
  if (!fs.existsSync(opts.pluginSourceDir)) {
    return { ok: false, reason: `plugin_install_failed: source dir not found: ${opts.pluginSourceDir}` };
  }
  const pluginTarget = materializeAsset(opts.pluginSourceDir, dataPath('dsh-assets', 'dsh-plugin'));
  const installedLink = path.join(profileDir, 'node_modules', 'hpclaw-dsh-plugin');
  if (!isPluginInstalledAt(installedLink, pluginTarget)) {
    const linked = ensurePluginLink(profileDir, pluginTarget);
    if (!linked.ok) {
      console.warn('[dsh-sidecar] 直接建立插件 link 失败（%s），回退 dsh plugin add', linked.error);
      const added = await runShell(`${dshBin} plugin --profile web add ${quoteArg(pluginTarget)}`);
      if (!added.ok) return { ok: false, reason: `plugin_install_failed: ${added.error}` };
    }
  }

  // b. cordis.patch.yml 合并两条 insert 条目
  const materializedSkillDirs = opts.skillDirs.map(dir =>
    materializeAsset(dir, dataPath('dsh-assets', 'skills', path.basename(dir))));
  const pluginConfig: Record<string, unknown> = {
    pythonBin: 'python',
    hpclawBaseUrl: opts.hpclawBaseUrl || `http://127.0.0.1:${Number(process.env.PORT || 3003)}`,
    bridgeStateFile: dataPath('dsh-bridge.json'),
    commandPolicy: 'deny',
    guardedTools: ['bash', 'pwsh'],
  };
  const wheatomicsScript = resolveScript(opts, opts.wheatomicsScript, 'wheatomics-query/scripts/wheatomics.py', materializedSkillDirs);
  const githubMirrorScript = resolveScript(opts, opts.githubMirrorScript, 'github-mirror/scripts/mirror-scout.py', materializedSkillDirs);
  if (wheatomicsScript) pluginConfig.wheatomicsScript = wheatomicsScript;
  if (githubMirrorScript) pluginConfig.githubMirrorScript = githubMirrorScript;

  mergeCordisPatch(path.join(profileDir, 'cordis.patch.yml'), {
    insert: [{ id: 'hpclaw-tools', name: 'hpclaw-dsh-plugin', config: pluginConfig }],
    override: [{ id: 'skill-filesystem', config: { customSkillDirs: materializedSkillDirs } }],
  });
  return { ok: true };
}

/* ---------------- cordis.patch.yml 合并 ---------------- */

type PatchInsertEntry = Record<string, unknown> & { id?: string };
/**
 * insert：新插件条目，进 `- insert:` 列表（如 hpclaw-tools）。
 * override：对 bundle 既有行整体替换 config 的顶层 patch op（如 skill-filesystem）——
 * dsh-base/cordis.patch.yml 注释明确 "A patch replaces the targeted row's whole config"；
 * 把 override 放进 insert 会因 id 已存在于 bundle 树而报 duplicate loader entry id（本机实测踩中）。
 */
type PatchOps = { insert: PatchInsertEntry[]; override: PatchInsertEntry[] };

function backupPatchFile(patchFile: string): void {
  if (!fs.existsSync(patchFile)) return;
  try {
    fs.copyFileSync(patchFile, `${patchFile}.bak-${Date.now()}`);
  } catch (err) {
    console.warn('[dsh-sidecar] cordis.patch.yml 备份失败: %s', err instanceof Error ? err.message : String(err));
  }
}

function upsertInsertEntry(insert: PatchInsertEntry[], entry: PatchInsertEntry): void {
  const index = insert.findIndex(item => item && typeof item === 'object' && item.id === entry.id);
  if (index >= 0) {
    // 已有同 id 条目：只替换 config，其余字段（name/group/disabled/inject 等）原样保留。
    insert[index] = { ...insert[index], config: entry.config };
  } else {
    insert.push(entry);
  }
}

/**
 * 解析失败（典型：含 !!js 自定义标签）时不覆盖用户文件，降级为文本追加。
 * patch 文件顶层是 YAML 数组，追加 `- insert:` / `- id:` 顶层元素即可延续该数组；
 * 已有同 id 条目（文本可检出）则跳过，避免重复。
 */
function appendEntriesAsText(patchFile: string, original: string, ops: PatchOps): void {
  const missingInsert = ops.insert.filter(entry => !entry.id || !original.includes(`id: ${entry.id}`));
  const missingOverride = ops.override.filter(entry => !entry.id || !original.includes(`id: ${entry.id}`));
  if (missingInsert.length === 0 && missingOverride.length === 0) return;
  backupPatchFile(patchFile);
  const opsDoc: Array<Record<string, unknown>> = [];
  if (missingInsert.length > 0) opsDoc.push({ insert: missingInsert });
  for (const entry of missingOverride) opsDoc.push({ id: entry.id, config: entry.config });
  const snippet = yamlDump(opsDoc, { lineWidth: -1, noRefs: true });
  const separator = original.length === 0 || original.endsWith('\n') ? '' : '\n';
  fs.writeFileSync(patchFile, original + separator + snippet, 'utf8');
}

function mergeCordisPatch(patchFile: string, ops: PatchOps): void {
  ensureDir(path.dirname(patchFile));
  const original = fs.existsSync(patchFile) ? fs.readFileSync(patchFile, 'utf8') : '';

  const buildMinimal = (): string => {
    const minimalDoc: Array<Record<string, unknown>> = [{ insert: ops.insert }];
    for (const entry of ops.override) minimalDoc.push({ id: entry.id, config: entry.config });
    return yamlDump(minimalDoc, { lineWidth: -1, noRefs: true });
  };

  if (!original.trim()) {
    // 文件不存在（或空）：直接创建最小文件（等价于先 `--dump-config` 引导再写，但更确定）。
    writeFileAtomic0600(patchFile, buildMinimal());
    return;
  }

  let doc: unknown;
  try {
    doc = yamlLoad(original);
  } catch (err) {
    console.warn(
      '[dsh-sidecar] cordis.patch.yml 解析失败（可能含 !!js 自定义标签），降级为文本追加、不覆盖用户文件: %s',
      err instanceof Error ? err.message : String(err),
    );
    appendEntriesAsText(patchFile, original, ops);
    return;
  }

  if (!Array.isArray(doc)) {
    console.warn('[dsh-sidecar] cordis.patch.yml 顶层不是数组（%s），备份后重建为最小文件', doc === null ? 'null' : typeof doc);
    backupPatchFile(patchFile);
    writeFileAtomic0600(patchFile, buildMinimal());
    return;
  }

  const root = doc as Array<Record<string, unknown>>;
  const overrideIds = new Set(ops.override.map(entry => entry.id).filter(Boolean));
  const managedIds = new Set([...ops.insert, ...ops.override].map(entry => entry.id).filter(Boolean));

  // 1) 从所有 insert 桶中剔除 override 条目（修复历史误合并：override 在 insert 里
  //    会与 bundle 既有行撞 id，boot 直接 duplicate loader entry id 失败——E2E 实测踩中）。
  for (const item of root) {
    if (item && typeof item === 'object' && Array.isArray((item as { insert?: unknown }).insert)) {
      const arr = (item as { insert: PatchInsertEntry[] }).insert;
      for (let i = arr.length - 1; i >= 0; i -= 1) {
        if (arr[i] && typeof arr[i] === 'object' && arr[i].id && overrideIds.has(arr[i].id)) arr.splice(i, 1);
      }
    }
  }

  // 2) 顶层非 insert 的同 id op 全部移除（去重；override 稍后以新 config 重写，
  //    insert 条目若曾以顶层 op 形式存在也一并清掉，避免与 insert 桶里的重复）。
  for (let i = root.length - 1; i >= 0; i -= 1) {
    const item = root[i];
    if (item && typeof item === 'object' && !Array.isArray((item as { insert?: unknown }).insert)) {
      const id = (item as { id?: string }).id;
      if (id && managedIds.has(id)) root.splice(i, 1);
    }
  }

  // 3) insert 条目 upsert 进第一个 insert 桶。
  let bucket = root.find(item => item && typeof item === 'object' && Array.isArray((item as { insert?: unknown }).insert)) as
    { insert: PatchInsertEntry[] } | undefined;
  if (!bucket) {
    bucket = { insert: [] };
    root.push(bucket as unknown as Record<string, unknown>);
  }
  for (const entry of ops.insert) upsertInsertEntry(bucket.insert, entry);

  // 4) override 条目以顶层 op 形式重写（整体替换 config）。
  for (const entry of ops.override) root.push({ id: entry.id, config: entry.config });

  backupPatchFile(patchFile);
  writeFileAtomic0600(patchFile, yamlDump(root, { lineWidth: -1, noRefs: true }));
}

/* ---------------- spawn / 崩溃重启 ---------------- */

function spawnAndWaitReady(opts: EnsureSidecarOptions): Promise<EnsureSidecarResult> {
  return new Promise(resolve => {
    const env: NodeJS.ProcessEnv = { ...process.env, ...dshNodeEnv() };
    for (const [key, value] of Object.entries(opts.extraEnv || {})) {
      if (value) env[key] = value;
    }
    // dshBin 是完整命令行（可能含空格参数），Windows 下必须 shell:true。
    // 注意：web 子命令不接受 --profile（实测报 unknown option '--profile'）；
    // web profile 是默认 profile，`dsh web` 即用它启动。
    const command = `${dshBinCommand()} web --host 127.0.0.1 --port 0`;
    console.log('[dsh] spawning sidecar: %s', command);
    const proc = spawn(command, {
      cwd: DATA_ROOT,
      env,
      shell: true,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child = proc;

    let settled = false;
    const done = (result: EnsureSidecarResult): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };

    const timer = setTimeout(() => {
      try { proc.kill('SIGTERM'); } catch { /* ignore */ }
      const killer = setTimeout(() => {
        try { proc.kill('SIGKILL'); } catch { /* ignore */ }
      }, 3_000);
      killer.unref?.();
      done({ ok: false, reason: `startup_timeout: dsh web 未在 ${STARTUP_TIMEOUT_MS / 1000}s 内输出监听地址` });
    }, STARTUP_TIMEOUT_MS);
    timer.unref?.();

    proc.on('error', err => done({ ok: false, reason: `spawn_failed: ${err.message}` }));
    proc.on('exit', (code, signal) => {
      done({ ok: false, reason: `dsh web 启动阶段提前退出 code=${code ?? 'null'} signal=${signal ?? 'none'}` });
      onProcessExit(code, signal);
    });

    let buffer = '';
    proc.stdout?.on('data', (chunk: Buffer) => {
      buffer += chunk.toString('utf8');
      let index: number;
      while ((index = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, index).trimEnd();
        buffer = buffer.slice(index + 1);
        if (line) console.log('[dsh] %s', line);
        const match = /dsh web: http:\/\/127\.0\.0\.1:(\d+)/.exec(line);
        if (match) void probeThenReady(`http://127.0.0.1:${match[1]}`, done);
      }
    });
    proc.stderr?.on('data', (chunk: Buffer) => {
      const line = chunk.toString('utf8').trimEnd();
      if (line) console.warn('[dsh:err] %s', line);
    });
  });
}

/** 端口出现后探活一次（GET /）；探活本身尽力而为，失败不否决就绪。 */
async function probeThenReady(
  baseUrl: string,
  done: (result: EnsureSidecarResult) => void,
): Promise<void> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5_000);
    timer.unref?.();
    await fetch(`${baseUrl}/`, { signal: controller.signal });
    clearTimeout(timer);
  } catch (err) {
    console.warn('[dsh-sidecar] 就绪探活未通过（仍按就绪处理）: %s', err instanceof Error ? err.message : String(err));
  }
  done({ ok: true, baseUrl });
}

function onProcessExit(code: number | null, signal: NodeJS.Signals | null): void {
  child = undefined;
  if (intentionalStop) return;
  if (status !== 'ready' && status !== 'restarting') return; // 启动阶段的退出由 spawnAndWaitReady 自己收尾
  currentBaseUrl = undefined;
  if (restarts >= MAX_RESTARTS) {
    status = 'failed';
    failReason = `dsh sidecar 反复退出（已达 ${MAX_RESTARTS} 次重启上限，最后 code=${code ?? 'null'} signal=${signal ?? 'none'}）`;
    console.error('[dsh-sidecar] %s', failReason);
    return;
  }
  restarts += 1;
  status = 'restarting';
  const delayMs = 1_000 * 2 ** (restarts - 1); // 1s / 2s / 4s
  console.warn('[dsh-sidecar] 进程退出 code=%s，%dms 后进行第 %d/%d 次重启', code ?? 'null', delayMs, restarts, MAX_RESTARTS);
  const opts = lastOptions;
  const timer = setTimeout(() => {
    if (intentionalStop || status !== 'restarting' || !opts || inFlight) return;
    inFlight = boot(opts).finally(() => { inFlight = undefined; });
  }, delayMs);
  timer.unref?.();
}
