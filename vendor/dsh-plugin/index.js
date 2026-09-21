/**
 * hpclaw-dsh-plugin v0.4.1 — HPClaw capability bridge for DeepSeek Harness (dsh).
 *
 * HPClaw 的能力以 dsh 插件形式暴露（dsh 作为通用 Agent harness，HPClaw 保留自有
 * 运行时与桌面 UI，本插件是两者之间的桥）：
 *
 *   工具（模型可直接调用）：
 *   - run_command:          在 NCPGR LSF 集群上执行一条命令的唯一途径。经"桥"回调
 *                           HPClaw 服务端（POST {baseUrl}/api/bridge/exec，桥状态
 *                           文件 {token, baseUrl, updatedAt} 每次调用重读以跟随
 *                           token 轮转），由服务端 SSH 到集群执行。内置 HPClaw 命令
 *                           风险分级：rm 直接硬拒（rm_blocked，不发 HTTP）；
 *                           destructive/network 先走 dsh 审批（ApprovalService.request），
 *                           用户放行后带 confirmed:true 提交；read/write/job/unknown 直接
 *                           提交；若意外收到 428 confirmation_required，补走一次审批后
 *                           带 confirmed:true 重试（仅一次）。wait 参数（分钟，1..30）
 *                           让服务端捕获作业号后轮询 bjobs 到终态并附 bpeek 输出
 *                           （waitedJobs），HTTP 超时随 wait 放大。网络错误/桥文件缺失/超时
 *                           一律不抛异常，返回 {ok:false, error:'bridge_unreachable'}
 *                           如实喂给模型。
 *   - cluster_fs:           集群文件与本地↔集群互传（同一桥守卫，/api/bridge/fs/*）：
 *                           list / read / write / push(本地→集群) / pull(集群→本地)。
 *                           write 级不强制用户确认（与 HPClaw 风险分级一致）。
 *   - browse_*:            本机浏览器控制（browser.js，零依赖 CDP，独立
 *                           user-data-dir 不动用户日常浏览器）：browse_open /
 *                           browse_eval / browse_click / browse_type /
 *                           browse_screenshot / browse_close。
 *   - wheatomics_query:     包装 WheatOmics 零依赖 CLI（wheatomics.py）。
 *   - github_mirror_scout:  包装 github-mirror 技能的 mirror-scout.py，
 *                           实测 GitHub 镜像速度（依赖系统 python 的 requests 包）。
 *   - hpclaw_server_health: 对本地 HPClaw 服务做 GET 探测（连通性如实上报）。
 *   - hpclaw_api_get:       对本地 HPClaw 服务的只读桥（GET 白名单端点：
 *                           /api/skills*、/api/workflows、/api/jobs/scheduler、
 *                           /api/jobs/events、/api/notify/config、/api/webapis*）。
 *   - call_web_api:         55+ 个公共生信数据 API（NCBI/Ensembl/UniProt/KEGG/
 *                           ChEMBL/Europe PMC 等）的统一查询（同一桥守卫，
 *                           POST /api/bridge/webapi；不经集群会话，集群未连也能用）。
 *                           服务目录用 hpclaw_api_get /api/webapis 发现。
 *
 *   系统提示注入：
 *   - ctx.systemPrompt.section({ name: 'hpclaw:domain', order: 100 })：HPClaw 域规则
 *     精简版（提炼自 源码/server/ai/agentRunner.ts buildAgentSystemPrompt 规则区）。
 *
 *   安全闸门（非工具，挂在工具调度管线上）：
 *   - 监听 tools/pre-execute，对 guardedTools（默认 bash + pwsh，Windows 的
 *     dsh profile 注册的是 pwsh 而非 bash）的 command 参数做 HPClaw 命令风险
 *     分级（移植自 源码/server/ai/commandSafety.ts，73 行零依赖；pwsh 附加
 *     PowerShell 高危模式）。命中 destructive 时按 commandPolicy 处理：
 *     'deny'（默认，直接拒绝）| 'ask'（走 dsh 审批）| 'off'（关闭闸门）。
 *     其余风险级放行，交给 dsh 自身沙箱。注意：run_code 等非 shell 工具不在
 *     闸门范围内（由 dsh 沙箱策略覆盖）。
 *
 * Loader contract (per @deepseek-ai/dsh-tool-todo): named exports only —
 * `name`, `inject`, `apply`; NO default export, otherwise cordis-plugin-loader
 * collapses the module and drops `inject`.
 *
 * Zero runtime dependencies on purpose: plain objects with hand-written JSON
 * Schema, which `ctx.tools.register()` accepts directly (same shape that
 * `@deepseek-ai/dsh-tools` defineTool() compiles to). That keeps the plugin
 * loadable no matter how pnpm links it into a dsh profile.
 */
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import { registerBrowserTools } from './browser.js'

export const name = 'hpclaw-tools'
// systemPrompt 必须声明注入，否则 cordis 拒绝访问 ctx.systemPrompt（同 dsh-tool-bash）
export const inject = ['tools', 'systemPrompt']

/** Cap model-bound output so a huge API response cannot flood the context. */
const OUTPUT_CAP = 64 * 1024

function clip(text) {
  if (text.length <= OUTPUT_CAP) return text
  return text.slice(0, OUTPUT_CAP) + `\n...[truncated, ${text.length - OUTPUT_CAP} chars omitted]`
}

/**
 * Run a subprocess to completion, honoring the dsh cooperative-cancel signal.
 * Resolves with { ok, exitCode, stdout, stderr } instead of throwing so the
 * model can see real CLI errors and adapt.
 */
function runProcess(command, argv, signal, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, argv, { windowsHide: true })
    let stdout = ''
    let stderr = ''
    let settled = false
    const cleanup = () => { clearTimeout(timer); signal?.removeEventListener('abort', onAbort) }
    const finish = (fn) => { if (!settled) { settled = true; cleanup(); fn() } }

    const timer = setTimeout(() => {
      finish(() => { child.kill('SIGTERM'); reject(new Error(`process timed out after ${timeoutMs}ms: ${command} ${argv.join(' ')}`)) })
    }, timeoutMs)
    const onAbort = () => {
      finish(() => { child.kill('SIGTERM'); reject(new Error(`aborted by caller: ${command} ${argv.join(' ')}`)) })
    }

    if (signal?.aborted) return onAbort()
    signal?.addEventListener('abort', onAbort, { once: true })

    child.stdout.on('data', (d) => { stdout += d })
    child.stderr.on('data', (d) => { stderr += d })
    child.on('error', (err) => finish(() => reject(new Error(`failed to start ${command}: ${err.message}`))))
    child.on('close', (code) => finish(() => resolve({
      ok: code === 0,
      exitCode: code ?? -1,
      stdout: clip(stdout.trim()),
      stderr: clip(stderr.trim()),
    })))
  })
}

/** Simple GET with timeout; never throws — reachability is part of the result. */
function httpGet(urlString, signal, timeoutMs) {
  return new Promise((resolve) => {
    const req = http.get(urlString, (res) => {
      let body = ''
      res.setEncoding('utf8')
      res.on('data', (d) => { if (body.length < OUTPUT_CAP) body += d })
      res.on('end', () => resolve({ reachable: true, status: res.statusCode ?? 0, body: clip(body.trim()) }))
    })
    req.setTimeout(timeoutMs, () => req.destroy(new Error(`request timed out after ${timeoutMs}ms`)))
    const onAbort = () => req.destroy(new Error('aborted by caller'))
    signal?.addEventListener('abort', onAbort, { once: true })
    req.on('error', (err) => resolve({ reachable: false, status: 0, body: String(err.message || err) }))
  })
}

/* ------------------------------------------------------------------ */
/* 命令风险分级：移植自 HPClaw 源码/server/ai/commandSafety.ts（保持逻辑一致） */
/* ------------------------------------------------------------------ */

const DANGEROUS_PATTERNS = [
  /\bbkill\b/, // 杀集群作业
  /\bkill\s+-9\b/,
  /\bpkill\b/,
  /\bkillall\b/,
  /\bmkfs\./, // 格式化
  /\bfdisk\b/,
  /\bdd\s+[^|]*\bof=/, // dd 写盘
  /:\(\)\s*\{/, // fork 炸弹
  /\bchmod\s+(-[a-zA-Z]+\s+)*777\b/, // 777 放权
  /\b(shutdown|reboot|halt|poweroff)\b/,
  /\|\s*(sudo\s+)?(sh|bash|zsh)\b/, // curl/wget 管道进 shell
  /\bgit\s+clone\b[^|]*\|\s*(sh|bash)\b/,
]

const READ_ONLY_COMMANDS = new Set([
  'ls', 'pwd', 'find', 'head', 'tail', 'cat', 'zcat', 'bzcat', 'xzcat', 'less',
  'wc', 'file', 'stat', 'namei', 'which', 'whereis', 'type', 'module', 'bjobs',
  'bhosts', 'bqueues', 'bacct', 'bhist', 'bpeek', 'quota', 'df', 'du', 'whoami',
  'hostname', 'date', 'env', 'printenv', 'uname', 'id', 'groups', 'grep', 'egrep',
  'fgrep', 'awk', 'cut', 'sort', 'uniq', 'tr', 'paste', 'column', 'realpath',
  'readlink', 'md5sum', 'sha1sum', 'sha256sum', 'diff', 'cmp', 'comm', 'test', '[',
])

const WRITE_COMMANDS = new Set([
  'mkdir', 'touch', 'cp', 'mv', 'install', 'tee', 'chmod', 'chown', 'chgrp',
  'sed', 'perl', 'python', 'python3', 'rscript', 'tar', 'gzip', 'gunzip', 'bgzip',
])

const JOB_COMMANDS = new Set(['bsub', 'bmod', 'bstop', 'bresume', 'brequeue'])
const NETWORK_COMMANDS = new Set(['curl', 'wget', 'scp', 'sftp', 'rsync', 'ssh', 'git'])

// PowerShell 侧高危模式（pwsh 工具专用；bash 侧 \brm\b 等规则对 pwsh 命令面覆盖不足）
const PS_DANGEROUS_PATTERNS = [
  /\bRemove-Item\b/i,
  /\b(rd|rmdir|del|erase)\b/i, // Remove-Item 的别名/	cmd 内建
  /\bStop-Process\b/i,
  /\bkill\b/i, // Stop-Process 别名（PowerShell 里 kill 不是信号语义，直接杀进程）
  /\bFormat-Volume\b/i,
  /\bClear-Disk\b/i,
  /\b(Stop|Restart)-Computer\b/i,
  /\b(iwr|irm|Invoke-WebRequest|Invoke-RestMethod)\b[^|]*\|\s*(iex|Invoke-Expression)\b/i, // 下载管道进 iex
  /\bSet-ExecutionPolicy\b/i,
]

function commandWords(command) {
  return command
    .split(/(?:&&|\|\||[;|\n])/)
    .map(part => part.trim().match(/^(?:command\s+|sudo\s+|env\s+[^\s=]+=[^\s]+\s+)*([^\s]+)/)?.[1] || '')
    .map(word => word.replace(/^.*\//, '').toLowerCase())
    .filter(Boolean)
}

function isDangerousCommand(command) {
  const normalized = command.trim()
  if (!normalized) return false
  if (/\brm\b/.test(normalized)) return true
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(normalized))
}

/** read | write | job | network | destructive | unknown（unknown 不静默放行） */
function classifyCommandRisk(command) {
  const normalized = command.trim()
  if (!normalized) return 'read'
  if (isDangerousCommand(normalized)) return 'destructive'

  const words = commandWords(normalized)
  if (words.some(word => JOB_COMMANDS.has(word))) return 'job'
  if (words.some(word => NETWORK_COMMANDS.has(word))) return 'network'

  const withoutDevNullProbe = normalized.replace(/\d*>\s*\/dev\/null/g, '')
  if (/(^|[^<])>{1,2}[^>]/.test(withoutDevNullProbe) || /<<-?\s*['"]?\w+/.test(normalized)) return 'write'
  if (/\b(sed|perl)\s+[^\n]*\s-i(?:\s|$)/i.test(normalized)) return 'write'
  if (words.some(word => WRITE_COMMANDS.has(word))) return 'write'
  if (words.length > 0 && words.every(word => READ_ONLY_COMMANDS.has(word))) return 'read'
  return 'unknown'
}

/* ------------------------------------------------------------------ */
/* run_command 桥：桥状态文件读取 + POST /api/bridge/exec（均不抛异常）      */
/* ------------------------------------------------------------------ */

/**
 * 每次调用重读桥状态文件（HPClaw 服务端每次启动/轮转都会重写 token）。
 * 读不到/解析失败不算异常——桥不可达本身就是要如实喂给模型的结果。
 */
async function readBridgeState(bridgeStateFile) {
  try {
    const raw = await readFile(bridgeStateFile, 'utf8')
    const state = JSON.parse(raw)
    if (!state || typeof state.token !== 'string' || typeof state.baseUrl !== 'string') {
      throw new Error('bridge state missing token/baseUrl')
    }
    return { ok: true, state }
  } catch (err) {
    return { ok: false, message: `cannot read bridge state file ${bridgeStateFile}: ${err.message}` }
  }
}

/**
 * POST {baseUrl}/api/bridge/exec。永不抛异常：网络错误/超时/非 JSON 响应都
 * 映射成结构化结果。428 原样上抛给调用方（由调用方决定补审批重试）。
 */
async function postBridgeExec(state, body, signal, fetchTimeoutMs, dshSessionId) {
  const signals = [AbortSignal.timeout(fetchTimeoutMs)]
  if (signal) signals.push(signal)
  const url = new URL('/api/bridge/exec', state.baseUrl).toString()
  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-HPClaw-Bridge': state.token,
        'X-HPClaw-Dsh-Session': String(dshSessionId || ''),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.any(signals),
    })
  } catch (err) {
    return {
      ok: false,
      error: 'bridge_unreachable',
      output: `POST ${url} failed: ${err.message}（HPClaw 桌面端未运行或桥未就绪，请如实告知用户）`,
    }
  }
  let data = {}
  try { data = await res.json() } catch { /* 非 JSON 响应按 HTTP 状态兜底 */ }

  if (res.status === 200) {
    const output = clip(String(data.output ?? ''))
    // 注意：dsh 要求工具返回值是 lossless JSON——值为 undefined 的键会让整个
    // 结果被判 "not lossless JSON"（实测 bsub 因此被拒）。waitedJobs 只在存在时携带。
    const waitedJobs = Array.isArray(data.waitedJobs) ? data.waitedJobs : undefined
    const withJobs = (base) => waitedJobs ? { ...base, waitedJobs } : base
    if (data.ok === true) return withJobs({ ok: true, exitCode: typeof data.exitCode === 'number' ? data.exitCode : 0, output })
    return withJobs({
      ok: false,
      exitCode: typeof data.exitCode === 'number' ? data.exitCode : -1,
      output,
      error: typeof data.error === 'string' ? data.error : 'command_failed',
    })
  }
  if (res.status === 428) {
    return {
      ok: false,
      error: 'confirmation_required',
      risk: typeof data.risk === 'string' ? data.risk : undefined,
      output: 'HPClaw 服务端要求该命令先经用户确认（confirmation_required）。',
    }
  }
  if (res.status === 422) {
    return {
      ok: false,
      error: 'rm_blocked',
      risk: 'destructive',
      output: 'HPClaw 服务端硬拒：rm 命令被策略禁止。请改用 mv 到回收目录或请用户手动删除。',
    }
  }
  if (res.status === 403) {
    return {
      ok: false,
      error: 'forbidden',
      output: 'HPClaw 桥拒绝了 token（forbidden）。桥 token 可能已轮转，请重试一次；仍失败则说明 HPClaw 桌面端需要重启桥。',
    }
  }
  if (res.status === 409) {
    return {
      ok: false,
      error: 'no_cluster_session',
      output: 'HPClaw 桌面端在运行，但尚未连接集群（no_cluster_session）。请用户在 HPClaw 界面连接集群后重试。',
    }
  }
  if (res.status === 400) {
    return { ok: false, error: 'invalid_request', output: 'HPClaw 桥判定请求无效（invalid_request）。' }
  }
  return {
    ok: false,
    error: `http_${res.status}`,
    output: clip(`HPClaw 桥返回意外状态 HTTP ${res.status}: ${JSON.stringify(data).slice(0, 2000)}`),
  }
}

/**
 * POST {baseUrl}/api/bridge/fs/<action>。与 postBridgeExec 同一 token 守卫、
 * 同一"不抛异常"约定；错误映射按 fs 端点契约（413 too_large、409 exists/
 * no_cluster_session 等）。
 */
async function postBridgeFs(state, action, body, signal, fetchTimeoutMs, dshSessionId) {
  const signals = [AbortSignal.timeout(fetchTimeoutMs)]
  if (signal) signals.push(signal)
  const url = new URL(`/api/bridge/fs/${action}`, state.baseUrl).toString()
  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-HPClaw-Bridge': state.token,
        'X-HPClaw-Dsh-Session': String(dshSessionId || ''),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.any(signals),
    })
  } catch (err) {
    return {
      ok: false,
      error: 'bridge_unreachable',
      output: `POST ${url} failed: ${err.message}（HPClaw 桌面端未运行或桥未就绪，请如实告知用户）`,
    }
  }
  let data = {}
  try { data = await res.json() } catch { /* 非 JSON 响应按 HTTP 状态兜底 */ }

  if (res.status === 200) {
    if (data.ok === true) return { ok: true, data }
    return {
      ok: false,
      error: typeof data.error === 'string' ? data.error : 'fs_failed',
      output: `HPClaw 桥拒绝了 ${action}: ${String(data.error ?? 'unknown error')}`,
    }
  }
  if (res.status === 409) {
    if (data.error === 'exists') {
      return { ok: false, error: 'exists', output: 'pull 目标本地文件已存在且未指定 overwrite（exists）。如确认覆盖请设 overwrite:true。' }
    }
    return {
      ok: false,
      error: 'no_cluster_session',
      output: 'HPClaw 桌面端在运行，但尚未连接集群（no_cluster_session）。请用户在 HPClaw 界面连接集群后重试。',
    }
  }
  if (res.status === 428) {
    return {
      ok: false,
      error: 'confirmation_required',
      risk: typeof data.risk === 'string' ? data.risk : 'write',
      output: `HPClaw 服务端要求先确认 cluster_fs ${action} 操作。`,
    }
  }
  if (res.status === 403) {
    return {
      ok: false,
      error: 'forbidden',
      output: 'HPClaw 桥拒绝了 token（forbidden）。桥 token 可能已轮转，请重试一次；仍失败则说明 HPClaw 桌面端需要重启桥。',
    }
  }
  if (res.status === 400) {
    return { ok: false, error: 'invalid_request', output: 'HPClaw 桥判定请求无效（invalid_request）。' }
  }
  if (res.status === 413) {
    return { ok: false, error: 'too_large', output: '文件或内容超过 HPClaw 桥的大小限制（too_large）。' }
  }
  return {
    ok: false,
    error: `http_${res.status}`,
    output: clip(`HPClaw 桥返回意外状态 HTTP ${res.status}: ${JSON.stringify(data).slice(0, 2000)}`),
  }
}

/** cluster_fs 的 output schema / render（沿用文本块风格）。 */
const CLUSTER_FS_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    ok: { type: 'boolean', description: 'true only when the fs action succeeded on the cluster side.' },
    output: { type: 'string', description: 'list: formatted entries; read: file content; write/push/pull: transfer summary; failure: explanation.' },
    error: { type: 'string', description: 'Machine-readable error kind: bridge_unreachable | no_cluster_session | forbidden | invalid_request | too_large | exists | fs_failed | http_<status>.' },
  },
  required: ['ok', 'output'],
  additionalProperties: false,
}

function renderClusterFsResult(args, value) {
  const action = typeof args?.action === 'string' ? args.action : 'fs'
  if (value.ok) return [{ type: 'text', text: value.output || `(cluster_fs ${action} succeeded with empty output)` }]
  return [{ type: 'text', text: `cluster_fs ${action} failed: ${value.error ?? 'unknown error'}\n${value.output || ''}` }]
}

/** run_command 的 output schema / render（沿用 renderProcessResult 的文本块风格）。 */
const RUN_COMMAND_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    ok: { type: 'boolean', description: 'true only when the command exited with code 0 on the cluster.' },
    exitCode: { type: 'integer', description: 'Cluster-side exit code, when the command actually ran.' },
    output: { type: 'string', description: 'Command output, or an explanation when the command did not run.' },
    error: { type: 'string', description: 'Machine-readable error kind: bridge_unreachable | rm_blocked | confirmation_denied | confirmation_unavailable | no_cluster_session | forbidden | invalid_request | command_failed | http_<status>.' },
    risk: { type: 'string', description: 'HPClaw risk class of the command: read | write | job | network | destructive | unknown.' },
    confirmation: { type: 'string', description: 'Approval outcome when confirmation was involved: rejected | cancelled | unavailable.' },
    waitedJobs: {
      type: 'array',
      description: 'Present when wait>0: one entry per captured LSF job with its final bjobs state and bpeek output tail.',
      items: {
        type: 'object',
        properties: {
          jobId: { description: 'LSF job ID (string or number; dsh schema 不支持 type 数组，故不设 type)。' },
          finalState: { type: 'string', description: 'Final bjobs state, e.g. DONE | EXIT | PEND (on wait timeout).' },
          tail: { type: 'string', description: 'bpeek output tail captured at job end.' },
        },
        required: ['jobId'],
        additionalProperties: true,
      },
    },
  },
  required: ['ok', 'output'],
  additionalProperties: false,
}

function renderRunCommandResult(_args, value) {
  if (value.ok) {
    const lines = [value.output || '(run_command succeeded with empty output)']
    if (Array.isArray(value.waitedJobs) && value.waitedJobs.length > 0) {
      for (const job of value.waitedJobs) {
        lines.push(`--- waited job ${job.jobId}: finalState=${job.finalState ?? '?'} ---`)
        if (job.tail) lines.push(String(job.tail))
      }
    }
    return [{ type: 'text', text: lines.join('\n') }]
  }
  const header = `run_command failed: ${value.error ?? 'unknown error'}`
    + (typeof value.exitCode === 'number' ? ` (exit code ${value.exitCode})` : '')
  const lines = [header]
  if (value.risk) lines.push(`risk: ${value.risk}`)
  if (value.confirmation) lines.push(`confirmation: ${value.confirmation}`)
  if (value.output) lines.push(value.output)
  if (Array.isArray(value.waitedJobs) && value.waitedJobs.length > 0) {
    for (const job of value.waitedJobs) {
      lines.push(`--- waited job ${job.jobId}: finalState=${job.finalState ?? '?'} ---`)
      if (job.tail) lines.push(String(job.tail))
    }
  }
  return [{ type: 'text', text: lines.join('\n') }]
}

/* ------------------------------------------------------------------ */

/** 子进程型工具共用的 output schema / render。 */
const PROCESS_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    ok: { type: 'boolean', description: 'Whether the CLI exited with code 0.' },
    exitCode: { type: 'integer' },
    stdout: { type: 'string', description: 'CLI standard output.' },
    stderr: { type: 'string', description: 'CLI standard error, if any.' },
  },
  required: ['ok', 'exitCode', 'stdout', 'stderr'],
  additionalProperties: false,
}

function renderProcessResult(toolName) {
  return (_args, value) => [{
    type: 'text',
    text: value.ok
      ? (value.stdout || `(${toolName} succeeded with empty output)`)
      : `${toolName} exited with code ${value.exitCode}.\nstderr: ${value.stderr || '(empty)'}\nstdout: ${value.stdout || '(empty)'}`,
  }]
}

export function apply(ctx, config = {}) {
  const pythonBin = config.pythonBin ?? 'python'
  const wheatomicsScript = config.wheatomicsScript
    ?? 'E:/hpclaw--/源码/skills/wheatomics-query/scripts/wheatomics.py'
  const githubMirrorScript = config.githubMirrorScript
    ?? 'E:/hpclaw--/源码/skills/github-mirror/scripts/mirror-scout.py'
  const hpclawBaseUrl = config.hpclawBaseUrl ?? 'http://127.0.0.1:3003'
  const processTimeoutMs = config.processTimeoutMs ?? 120_000
  const mirrorTimeoutMs = config.mirrorTimeoutMs ?? 240_000
  const httpTimeoutMs = config.httpTimeoutMs ?? 10_000
  // 安全闸门：'deny'（默认）| 'ask' | 'off'
  const commandPolicy = config.commandPolicy ?? 'deny'
  // dsh 的 shell 工具：Linux/macOS 注册 bash，Windows 的 profile 注册 pwsh（两者参数都叫 command）
  const guardedTools = Array.isArray(config.guardedTools) ? config.guardedTools : ['bash', 'pwsh']
  // hpclaw_api_get 的只读 GET 白名单（无需 SSH 会话的端点）
  const allowedGetPrefixes = Array.isArray(config.allowedGetPrefixes)
    ? config.allowedGetPrefixes
    : ['/api/skills', '/api/workflows', '/api/jobs/scheduler', '/api/jobs/events', '/api/notify/config', '/api/webapis']
  // run_command 桥：HPClaw 服务端写入的桥状态文件（{token, baseUrl, updatedAt}）
  const bridgeStateFile = config.bridgeStateFile ?? 'E:/hpclaw--/tmp/dsh-bridge.json'
  const maxCommandTimeoutMs = config.maxCommandTimeoutMs ?? 600_000
  // cluster_fs 单次桥调用超时（push/pull 大文件可调大）
  const fsTimeoutMs = config.fsTimeoutMs ?? 120_000
  // 浏览器控制（browser.js，CDP）：可显式指定浏览器路径/无头/user-data-dir
  const browserConfig = {
    browserPath: config.browserPath,
    browserHeadless: config.browserHeadless === true,
    cdpUserDataDir: config.cdpUserDataDir,
  }
  // dsh 审批服务（dsh-user-approval）；未组合时为 undefined，审批路径 fail-closed。
  // apply 时取一次，执行时再兜底取一次（插件加载顺序不保证 approval 先于本插件就绪）。
  const approvalAtBoot = typeof ctx.get === 'function' ? ctx.get('approval') : undefined

  /**
   * 走 dsh 审批（ApprovalService.request，签名见
   * dsh-user-approval/lib/types/index.d.ts：request(req: ApprovalRequest): Promise<ApprovalOutcome>，
   * ApprovalOutcome = 'allowed-once' | 'rejected' | 'cancelled' | 'unavailable'）。
   * 服务缺失、无 agent 可路由、无打开的 turn（request 会 throw）一律归一为
   * 'unavailable'，fail closed。reason 格式固定，HPClaw 服务端要正则解析：
   *   HPClaw 命令确认\n风险级: <risk>\n命令: <command 原文>
   */
  async function requestCommandConfirmation(exec, command, risk, toolName = 'run_command') {
    const approval = approvalAtBoot ?? (typeof ctx.get === 'function' ? ctx.get('approval') : undefined)
    if (!approval || typeof approval.request !== 'function' || !exec?.agent) {
      return 'unavailable'
    }
    try {
      const outcome = await approval.request({
        agent: exec.agent,
        toolName,
        callId: exec.callId,
        reason: `HPClaw 命令确认\n风险级: ${risk}\n命令: ${command}`,
        ...(exec.signal ? { signal: exec.signal } : {}),
      })
      return typeof outcome === 'string' ? outcome : 'unavailable'
    } catch {
      return 'unavailable'
    }
  }

  /* ---------------- 工具 0：集群命令（HPClaw 桥） ---------------- */
  ctx.tools.register({
    name: 'run_command',
    description:
      'Run ONE shell command on the NCPGR LSF cluster. This is the ONLY way to execute commands on the cluster: ' +
      'the call is bridged back to the HPClaw desktop server, which runs it over its SSH cluster session — it is NOT a local shell. ' +
      'Commands are risk-classified by HPClaw policy: `rm` is hard-blocked (use `mv` to a trash directory instead); ' +
      'destructive/network commands require one-shot user confirmation before execution; read/write/job commands run directly. ' +
      'Returns { ok, exitCode, output, error?, risk? }. When error=bridge_unreachable the HPClaw desktop app is not running — ' +
      'report that honestly to the user instead of retrying or falling back to local execution.',
    parameters: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'One shell command to run on the cluster (LSF login-node environment). No `rm`.',
        },
        timeoutMs: {
          type: 'number',
          description: 'Cluster-side timeout in milliseconds (default 30000). The bridge fetch waits timeoutMs + 15000.',
        },
        wait: {
          type: 'number',
          description:
            'Minutes (1..30) to WAIT for LSF job completion after submission: the server captures the job ID, polls bjobs to a final state, ' +
            'and returns the final output (bpeek tail) in one call. Pass 5-10 when submitting a job expected to finish within ~5 minutes; ' +
            'do NOT pass it for long-running jobs — submit, summarize, and end the turn instead.',
        },
      },
      required: ['command'],
    },
    output: {
      schema: RUN_COMMAND_OUTPUT_SCHEMA,
      render: renderRunCommandResult,
    },
    timeoutMs: maxCommandTimeoutMs + 30 * 60_000 + 60_000, // 命令上限 + wait 上限 30min + 富余
    isConcurrencySafe: () => false, // 集群命令有副作用且共享一条 SSH 会话，串行调度
    async execute(args, exec) {
      if (!args || typeof args.command !== 'string' || args.command.trim().length === 0) {
        throw new Error('invalid args: "command" must be a non-empty string')
      }
      const command = args.command
      const timeoutMs = typeof args.timeoutMs === 'number' && Number.isFinite(args.timeoutMs) && args.timeoutMs > 0
        ? Math.min(args.timeoutMs, maxCommandTimeoutMs)
        : 30_000
      // wait（分钟，1..30）：提交 LSF 作业且预计几分钟内跑完时让服务端等作业到终态
      const waitMin = typeof args.wait === 'number' && Number.isFinite(args.wait) && args.wait > 0
        ? Math.min(Math.round(args.wait), 30)
        : 0
      // HTTP 超时 = 命令超时 + wait 等待 + 富余
      const fetchTimeoutMs = timeoutMs + waitMin * 60_000 + 15_000

      // 1. HPClaw 风险分级
      const risk = classifyCommandRisk(command)

      // 2. rm 硬拒（HPClaw 策略，不发 HTTP）
      if (/\brm\b/.test(command)) {
        return {
          ok: false,
          error: 'rm_blocked',
          risk: 'destructive',
          output: 'HPClaw 策略禁止 rm 命令（未发送执行）。请改用 mv 把文件移到回收目录（如 /tmp），或请用户在集群上手动删除。',
        }
      }

      // 桥状态每次调用重读（跟随 token 轮转）；读不到 = HPClaw 桌面端未运行，如实上报
      const bridge = await readBridgeState(bridgeStateFile)
      if (!bridge.ok) {
        return {
          ok: false,
          error: 'bridge_unreachable',
          risk,
          output: `${bridge.message}（HPClaw 桌面端未运行或桥未就绪，无法执行集群命令，请如实告知用户）`,
        }
      }

      // 3. destructive / network → 先走 dsh 审批
      let confirmed = false
      if (risk === 'destructive' || risk === 'network') {
        const outcome = await requestCommandConfirmation(exec, command, risk)
        if (outcome === 'allowed-once') {
          confirmed = true
        } else if (outcome === 'rejected') {
          return {
            ok: false,
            error: 'confirmation_denied',
            risk,
            confirmation: 'rejected',
            output: '用户拒绝了该高危命令（confirmation denied）。不要重试原命令；如需继续，请与用户商量替代方案。',
          }
        } else {
          return {
            ok: false,
            error: 'confirmation_unavailable',
            risk,
            confirmation: outcome,
            output: '该命令需要用户在 HPClaw 界面确认，但当前无审批通道（审批服务不可用或已取消），命令未执行。',
          }
        }
      }

      // 4. 直接提交（read/write/job/unknown 不带 confirmed；审批通过带 confirmed:true）
      const baseBody = { command, timeoutMs, ...(waitMin > 0 ? { waitForJobs: waitMin } : {}) }
      const dshSessionId = exec?.agent?.id
      if (!dshSessionId) {
        return { ok: false, error: 'dsh_session_not_bound', risk, output: 'dsh 会话身份缺失，命令未执行。' }
      }
      let result = await postBridgeExec(bridge.state, { ...baseBody, ...(confirmed ? { confirmed: true } : {}) }, exec.signal, fetchTimeoutMs, dshSessionId)

      // 5. 意外 428（服务端策略比分级器更严）→ 补走一次审批后带 confirmed:true 重试，仅一次
      if (result.error === 'confirmation_required' && !confirmed) {
        const retryRisk = result.risk ?? risk
        const outcome = await requestCommandConfirmation(exec, command, retryRisk)
        if (outcome === 'allowed-once') {
          result = await postBridgeExec(bridge.state, { ...baseBody, confirmed: true }, exec.signal, fetchTimeoutMs, dshSessionId)
          if (result.risk === undefined) result.risk = retryRisk
        } else if (outcome === 'rejected') {
          return {
            ok: false,
            error: 'confirmation_denied',
            risk: retryRisk,
            confirmation: 'rejected',
            output: '用户拒绝了该高危命令（confirmation denied）。不要重试原命令；如需继续，请与用户商量替代方案。',
          }
        } else {
          return {
            ok: false,
            error: 'confirmation_unavailable',
            risk: retryRisk,
            confirmation: outcome,
            output: '该命令需要用户在 HPClaw 界面确认，但当前无审批通道（审批服务不可用或已取消），命令未执行。',
          }
        }
      }
      if (result.risk === undefined) result.risk = risk
      return result
    },
  })

  /* ------------- 工具 0b：集群文件与本地↔集群互传（HPClaw 桥） ------------- */
  ctx.tools.register({
    name: 'cluster_fs',
    description:
      'Cluster filesystem access and local<->cluster transfer via the HPClaw bridge (same SSH session as run_command). ' +
      'Actions: list (directory entries), read (text file content, optional maxBytes), write (create/overwrite a cluster text file), ' +
      'push (upload a LOCAL file to the cluster), pull (download a cluster file to LOCAL disk). ' +
      '`path` is always the CLUSTER-side path; `destPath` is the other end for push (local source) / pull (local destination). ' +
      'Confirmation follows the HPClaw Agent policy for this conversation; the server is authoritative and may require approval for reads or writes. ' +
      'For purely local files prefer dsh\'s built-in read/write tools instead of this tool. ' +
      'When error=bridge_unreachable / no_cluster_session, report honestly instead of retrying.',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'read', 'write', 'push', 'pull'],
          description: 'list | read | write | push (local -> cluster) | pull (cluster -> local).',
        },
        path: {
          type: 'string',
          description: 'Cluster-side path (for push it is the upload destination; for pull the download source).',
        },
        destPath: {
          type: 'string',
          description: 'The other end for push/pull: push = local source file, pull = local destination file.',
        },
        content: { type: 'string', description: 'Text content for action=write.' },
        maxBytes: { type: 'number', description: 'Optional byte cap for action=read (server truncates beyond it).' },
        overwrite: { type: 'boolean', description: 'For action=pull: allow overwriting an existing local file (default false).' },
      },
      required: ['action', 'path'],
    },
    output: {
      schema: CLUSTER_FS_OUTPUT_SCHEMA,
      render: renderClusterFsResult,
    },
    timeoutMs: fsTimeoutMs + 30_000,
    isConcurrencySafe: () => false, // 与 run_command 共享同一条 SSH 会话，串行调度
    async execute(args, exec) {
      const FS_ACTIONS = ['list', 'read', 'write', 'push', 'pull']
      if (!args || typeof args.action !== 'string' || !FS_ACTIONS.includes(args.action)) {
        throw new Error('invalid args: "action" must be one of list | read | write | push | pull')
      }
      if (typeof args.path !== 'string' || args.path.trim().length === 0) {
        throw new Error('invalid args: "path" must be a non-empty string')
      }
      const action = args.action
      if ((action === 'push' || action === 'pull') && (typeof args.destPath !== 'string' || args.destPath.trim().length === 0)) {
        throw new Error(`invalid args: "destPath" is required for ${action}`)
      }
      if (action === 'write' && typeof args.content !== 'string') {
        throw new Error('invalid args: "content" (string) is required for write')
      }

      // 桥状态每次调用重读（跟随 token 轮转）；读不到 = HPClaw 桌面端未运行，如实上报
      const bridge = await readBridgeState(bridgeStateFile)
      if (!bridge.ok) {
        return {
          ok: false,
          error: 'bridge_unreachable',
          output: `${bridge.message}（HPClaw 桌面端未运行或桥未就绪，无法访问集群文件，请如实告知用户）`,
        }
      }

      let body
      switch (action) {
        case 'list': body = { path: args.path }; break
        case 'read':
          body = { path: args.path, ...(typeof args.maxBytes === 'number' && args.maxBytes > 0 ? { maxBytes: args.maxBytes } : {}) }
          break
        case 'write': body = { path: args.path, content: args.content }; break
        case 'push': body = { localPath: args.destPath, remotePath: args.path }; break
        case 'pull':
          body = { remotePath: args.path, localPath: args.destPath, ...(args.overwrite === true ? { overwrite: true } : {}) }
          break
      }
      const dshSessionId = exec?.agent?.id
      if (!dshSessionId) {
        return { ok: false, error: 'dsh_session_not_bound', output: 'dsh 会话身份缺失，文件操作未执行。' }
      }
      let res = await postBridgeFs(bridge.state, action, body, exec.signal, fsTimeoutMs + 15_000, dshSessionId)
      if (res.error === 'confirmation_required') {
        const risk = res.risk || (action === 'list' || action === 'read' ? 'read' : 'write')
        const target = `cluster_fs ${action} ${args.path}${args.destPath ? ` -> ${args.destPath}` : ''}`
        const outcome = await requestCommandConfirmation(exec, target, risk, 'cluster_fs')
        if (outcome === 'allowed-once') {
          res = await postBridgeFs(bridge.state, action, { ...body, confirmed: true }, exec.signal, fsTimeoutMs + 15_000, dshSessionId)
        } else {
          return {
            ok: false,
            error: outcome === 'rejected' ? 'confirmation_denied' : 'confirmation_unavailable',
            output: outcome === 'rejected'
              ? '用户拒绝了该文件操作；不要原样重试。'
              : '文件操作需要用户确认，但当前审批通道不可用，操作未执行。',
          }
        }
      }
      if (!res.ok) return { ok: false, error: res.error, output: res.output }

      const d = res.data
      let output
      if (action === 'list') {
        const entries = Array.isArray(d.entries) ? d.entries : []
        const lines = entries.map(e => `${String(e.kind ?? '?').padEnd(10)} ${String(e.size ?? '').padStart(12)}  ${String(e.name ?? '')}`)
        output = `${String(d.path ?? args.path)} (${entries.length} entries)\n${lines.join('\n')}`
      } else if (action === 'read') {
        output = clip(String(d.content ?? '')) + (d.truncated ? '\n...[truncated by server]' : '')
      } else if (action === 'write') {
        output = `wrote ${d.bytes ?? '?'} bytes to ${String(d.path ?? args.path)}`
      } else if (action === 'push') {
        output = `pushed ${String(d.localPath ?? args.destPath)} -> ${String(d.remotePath ?? args.path)} (${d.bytes ?? '?'} bytes)`
      } else {
        output = `pulled ${String(d.remotePath ?? args.path)} -> ${String(d.localPath ?? args.destPath)} (${d.bytes ?? '?'} bytes)`
      }
      return { ok: true, output }
    },
  })

  /* ---------------- 工具 1：WheatOmics 查询 ---------------- */
  ctx.tools.register({
    name: 'wheatomics_query',
    description:
      'Query the WheatOmics wheat genomics platform via HPClaw\'s zero-dependency CLI (read-only HTTP API wrapper). ' +
      'Common subcommands: health (service check), about, known-search <keyword> (fuzzy search cloned genes, e.g. VRN1), ' +
      'known-gene <gene_id> (full record of one cloned gene), known-all, known-chrom <chr>, gene <gene_id> (GeneHub detail), ' +
      'pfam, interval, expr-projects, expr-query, coexpr-query, ppi, homologs, synteny, id-conversion. ' +
      'Pass the subcommand name and put its CLI arguments in `args`.',
    parameters: {
      type: 'object',
      properties: {
        subcommand: {
          type: 'string',
          description: 'wheatomics.py subcommand, e.g. "health", "known-search", "known-gene", "gene".',
        },
        args: {
          type: 'array',
          items: { type: 'string' },
          description: 'Positional/optional CLI arguments for the subcommand, e.g. ["VRN1"] for known-search. Omit if none.',
        },
      },
      required: ['subcommand'],
    },
    output: {
      schema: PROCESS_OUTPUT_SCHEMA,
      render: renderProcessResult('wheatomics_query'),
    },
    timeoutMs: processTimeoutMs + 30_000,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      if (!args || typeof args.subcommand !== 'string' || args.subcommand.length === 0) {
        throw new Error('invalid args: "subcommand" must be a non-empty string')
      }
      const extra = Array.isArray(args.args) ? args.args.map(String) : []
      const argv = [wheatomicsScript, args.subcommand, ...extra]
      return await runProcess(pythonBin, argv, exec.signal, processTimeoutMs)
    },
  })

  /* ---------------- 工具 2：GitHub 镜像测速 ---------------- */
  ctx.tools.register({
    name: 'github_mirror_scout',
    description:
      'Find the fastest GitHub mirror/proxy for the current network (HPClaw github-mirror skill). ' +
      'Use before `git clone` or downloading files/releases from github.com when direct access is slow or fails. ' +
      'Runs mirror-scout.py in GitHub mode and reports tested mirrors with real download speeds. ' +
      'Optional extra CLI flags go in `args`, e.g. ["--top","3"], ["--no-scrape"], ["--mirror","https://ghproxy.net"].',
    parameters: {
      type: 'object',
      properties: {
        args: {
          type: 'array',
          items: { type: 'string' },
          description: 'Extra flags for mirror-scout.py (--github is always prepended). Default: ["--top","5"].',
        },
      },
    },
    output: {
      schema: PROCESS_OUTPUT_SCHEMA,
      render: renderProcessResult('github_mirror_scout'),
    },
    timeoutMs: mirrorTimeoutMs + 30_000,
    isConcurrencySafe: () => false, // 测速占带宽，独占调度
    async execute(args, exec) {
      const extra = Array.isArray(args?.args) && args.args.length > 0 ? args.args.map(String) : ['--top', '5']
      const argv = [githubMirrorScript, '--github', ...extra]
      return await runProcess(pythonBin, argv, exec.signal, mirrorTimeoutMs)
    },
  })

  /* ---------------- 工具 3：HPClaw 服务探测 ---------------- */
  ctx.tools.register({
    name: 'hpclaw_server_health',
    description:
      'Probe the local HPClaw server with an HTTP GET and report reachability, status code and a body snippet. ' +
      'HPClaw exposes no dedicated /api/health route; useful GET paths include /api/workflows (workflow list).',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: `HTTP path on the HPClaw server, default "/api/health". Base URL is ${hpclawBaseUrl}.`,
        },
      },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          reachable: { type: 'boolean', description: 'Whether the server accepted the connection.' },
          status: { type: 'integer', description: 'HTTP status code, 0 when unreachable.' },
          url: { type: 'string' },
          body: { type: 'string', description: 'Response body snippet, or the connection error message.' },
        },
        required: ['reachable', 'status', 'url', 'body'],
        additionalProperties: false,
      },
      render: (_args, value) => [{
        type: 'text',
        text: value.reachable
          ? `GET ${value.url} -> HTTP ${value.status}\n${value.body}`
          : `GET ${value.url} failed: ${value.body}`,
      }],
    },
    timeoutMs: httpTimeoutMs + 10_000,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const path = typeof args?.path === 'string' && args.path.length > 0 ? args.path : '/api/health'
      const url = new URL(path, hpclawBaseUrl).toString()
      const res = await httpGet(url, exec.signal, httpTimeoutMs)
      return { reachable: res.reachable, status: res.status, url, body: res.body }
    },
  })

  /* ------------- 工具 4：HPClaw 本地 API 只读桥（GET 白名单） ------------- */
  ctx.tools.register({
    name: 'hpclaw_api_get',
    description:
      'Read-only bridge into the local HPClaw server. HTTP GET against a whitelist of endpoints that need no ' +
      'cluster (SSH) session: /api/skills (skill registry), /api/skills/search?q=..., /api/workflows (workflow list), ' +
      '/api/jobs/scheduler, /api/jobs/events, /api/notify/config. ' +
      'Returns { ok, reachable, status, body }. When reachable=false the HPClaw desktop app/server is not running.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: `API path, optionally with query string. Must start with one of: ${allowedGetPrefixes.join(', ')}`,
        },
      },
      required: ['path'],
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', description: 'true only when the server returned 2xx.' },
          reachable: { type: 'boolean' },
          status: { type: 'integer' },
          url: { type: 'string' },
          body: { type: 'string', description: 'Response body snippet, or an error/rejection message.' },
        },
        required: ['ok', 'reachable', 'status', 'url', 'body'],
        additionalProperties: false,
      },
      render: (_args, value) => [{
        type: 'text',
        text: value.ok
          ? `GET ${value.url} -> HTTP ${value.status}\n${value.body}`
          : `GET ${value.url} ${value.reachable ? `-> HTTP ${value.status}` : 'failed'}\n${value.body}`,
      }],
    },
    timeoutMs: httpTimeoutMs + 10_000,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      if (!args || typeof args.path !== 'string' || args.path.length === 0) {
        throw new Error('invalid args: "path" must be a non-empty string')
      }
      const base = new URL(hpclawBaseUrl)
      const url = new URL(args.path, base)
      // 防越权：不允许借 path 跳出本机 HPClaw origin，且必须在 GET 白名单内
      if (url.origin !== base.origin) {
        return { ok: false, reachable: false, status: 0, url: url.toString(), body: `rejected: path escapes HPClaw origin (${base.origin})` }
      }
      if (!allowedGetPrefixes.some(p => url.pathname === p || url.pathname.startsWith(p + '/'))) {
        return { ok: false, reachable: false, status: 0, url: url.toString(), body: `rejected: path not in GET whitelist: ${allowedGetPrefixes.join(', ')}` }
      }
      const res = await httpGet(url.toString(), exec.signal, httpTimeoutMs)
      return { ok: res.reachable && res.status >= 200 && res.status < 300, reachable: res.reachable, status: res.status, url: url.toString(), body: res.body }
    },
  })

  /* ------------- 工具 5：公共生信数据 API（经 HPClaw 桥 /api/bridge/webapi） ------------- */
  // 55+ 个公共数据库（NCBI/Ensembl/UniProt/KEGG/ChEMBL/Europe PMC 等）的统一调用入口。
  // 服务目录发现走 hpclaw_api_get /api/webapis（GET 白名单）；调用走桥 token 守卫的
  // POST /api/bridge/webapi，不经集群会话，因此集群未连接也能用。
  ctx.tools.register({
    name: 'call_web_api',
    description:
      'Query one of 55+ curated public bioinformatics data APIs (NCBI, Ensembl, UniProt, KEGG, STRING, ChEMBL, PubChem, ' +
      'gnomAD, Europe PMC, OpenAlex, plants/microbes resources, ...) for REAL data. The call is bridged to the HPClaw ' +
      'desktop server (POST /api/bridge/webapi), which fixes the upstream host from its registry — you only pass the ' +
      'documented params. Discover services/endpoints first with hpclaw_api_get path="/api/webapis" (catalog with all ' +
      'endpoint ids and params). Summarize results as tables/bullets and always cite the source.',
    parameters: {
      type: 'object',
      properties: {
        service: {
          type: 'string',
          description: 'Registered service id, e.g. uniprot / ensembl / kegg / string / chembl / europepmc.',
        },
        endpoint: {
          type: 'string',
          description: 'Endpoint id within that service, e.g. search / entry / lookup-id (see /api/webapis catalog).',
        },
        params: {
          type: 'object',
          description: 'Endpoint params per the catalog (path/query/body params are routed automatically server-side).',
        },
      },
      required: ['service', 'endpoint'],
    },
    timeoutMs: 50_000, // 服务端对上游 20s 超时 + 富余
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      if (!args || typeof args.service !== 'string' || !args.service.trim()
        || typeof args.endpoint !== 'string' || !args.endpoint.trim()) {
        throw new Error('invalid args: "service" and "endpoint" must be non-empty strings')
      }
      const bridge = await readBridgeState(bridgeStateFile)
      if (!bridge.ok) {
        return {
          ok: false,
          error: 'bridge_unreachable',
          output: `${bridge.message}（HPClaw 桌面端未运行或桥未就绪，无法调用公共数据 API，请如实告知用户）`,
        }
      }
      const url = new URL('/api/bridge/webapi', bridge.state.baseUrl).toString()
      const signals = [AbortSignal.timeout(45_000)]
      if (exec.signal) signals.push(exec.signal)
      let res
      try {
        res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-HPClaw-Bridge': bridge.state.token,
            'X-HPClaw-Dsh-Session': String(exec?.agent?.id || ''),
          },
          body: JSON.stringify({
            service: args.service.trim(),
            endpoint: args.endpoint.trim(),
            params: args.params && typeof args.params === 'object' ? args.params : {},
          }),
          signal: AbortSignal.any(signals),
        })
      } catch (err) {
        return {
          ok: false,
          error: 'bridge_unreachable',
          output: `POST ${url} failed: ${err.message}（HPClaw 桌面端未运行或桥未就绪，请如实告知用户）`,
        }
      }
      let data = {}
      try { data = await res.json() } catch { /* 非 JSON 响应按 HTTP 状态兜底 */ }
      if (res.status === 200) {
        if (data && data.ok === true) {
          const result = { ok: true, status: data.status, url: data.url, durationMs: data.durationMs, truncated: data.truncated === true }
          if (data.data !== undefined) result.data = data.data
          else result.text = clip(String(data.text ?? ''))
          return result
        }
        const code = data && data.error && typeof data.error.code === 'string' ? data.error.code : 'webapi_failed'
        const message = data && data.error && typeof data.error.message === 'string' ? data.error.message : 'unknown error'
        return { ok: false, error: code, output: `公共数据 API 调用失败（${code}）: ${message}` }
      }
      if (res.status === 403) {
        return { ok: false, error: 'forbidden', output: 'HPClaw 桥拒绝了 token（forbidden）。桥 token 可能已轮转，请重试一次；仍失败则说明 HPClaw 桌面端需要重启桥。' }
      }
      return {
        ok: false,
        error: `http_${res.status}`,
        output: clip(`HPClaw 桥返回意外状态 HTTP ${res.status}: ${JSON.stringify(data).slice(0, 2000)}`),
      }
    },
  })

  /* ------------- 系统提示注入：HPClaw 域规则（精简版，勿照抄全文） ------------- */
  ctx.systemPrompt.section({
    name: 'hpclaw:domain',
    order: 100,
    text:
      'HPClaw 域规则（domain rules）：\n' +
      '- 工作区语义：dsh 自带的本地文件/bash 工具都落在用户选择的本地工作区目录，与集群无关；纯本地操作用它们，' +
      '集群侧操作一律走 run_command / cluster_fs，不要混用。\n' +
      '- run_command 是在集群上执行命令的唯一途径：它桥回 HPClaw 服务端、经其 SSH 会话在 NCPGR LSF 集群执行，不是本地 shell；' +
      '本地路径/进程与集群无关。error=bridge_unreachable 表示 HPClaw 桌面端未运行，如实告知用户，不要改在本地执行。\n' +
      '- cluster_fs 做集群文件 list/read/write 和本地↔集群互传（push=本地上传到集群、pull=集群下载到本地）；path 永远是集群侧路径。\n' +
      '- 集群规范：作业一律写成 .lsf 脚本用 bsub 提交（bsub < script.lsf），不设 -M/-W（违反集群规范）；' +
      '软件用 module load（先 module av 确认，不要假设 PATH）；生物信息软件加 -R "span[hosts=1]"；' +
      '内存不足（TERM_MEMLIMIT/exit 137/OOM/SSUSP）第一反应是扩 #BSUB -n 节点数（5GB × 节点数），禁止用 -M 或 rusage[mem]。\n' +
      '- 禁止 rm：需要删除时 mv 到回收目录（如 /tmp）或请用户手动处理；rm 会被直接拒绝（rm_blocked）。\n' +
      '- destructive/network 级命令会触发用户确认（HPClaw 审批）；被拒绝后不要原样重试。一次 run_command 只跑一条命令，' +
      '等真实输出再决定下一步；失败先用 ls -ld / stat / namei 诊断，不要原样重试。\n' +
      '- 作业交接：提交了预计长时间运行的 LSF 作业后，向用户简要总结已提交的作业号与后续安排，然后自然结束本轮——' +
      '系统会在作业完成时自动唤醒你继续，不要在本轮里反复 bjobs 轮询空等。\n' +
      '- 预计几分钟内能跑完的作业：用 run_command 的 wait 参数（如 wait: 5-10，分钟）直接等作业结束拿最终输出，一轮闭环；长作业不要传 wait。\n' +
      '- browse_* 用本机浏览器（独立 user-data-dir，不碰用户日常浏览器）打开网页、eval 页面 JS、截图，适合演示与网页验证；' +
      '节制使用——eval 只在当前任务相关页面上用，不浏览与任务无关的页面。\n' +
      '- wheatomics_query 查 WheatOmics 小麦基因组平台（只读）；github_mirror_scout 实测 GitHub 镜像速度，git clone/下载前先用它选镜像。\n' +
      '- 公共生信数据（基因/蛋白/通路/化合物/变异/文献等）用 call_web_api 查 55+ 个公共数据库的真实数据：' +
      '先 hpclaw_api_get 取 /api/webapis 目录找到服务与端点 id，再按参数说明调用；回答必须标注数据来源。',
  })

  /* ------------- 浏览器控制工具组（browser.js，零依赖 CDP） ------------- */
  registerBrowserTools(ctx, browserConfig)

  /* ------------- 安全闸门：HPClaw 命令风险分级 → dsh pre-execute ------------- */
  if (commandPolicy !== 'off' && guardedTools.length > 0) {
    ctx.on('tools/pre-execute', async (exec, next) => {
      if (!guardedTools.includes(exec.name)) return next()
      const command = exec.arguments && typeof exec.arguments === 'object' && typeof exec.arguments.command === 'string'
        ? exec.arguments.command
        : ''
      if (!command.trim()) return next()
      const risk = classifyCommandRisk(command)
      // pwsh 额外过一遍 PowerShell 高危模式（bash 分级器面向 POSIX 语法，盖不住 Remove-Item 等）
      const psHit = exec.name === 'pwsh' && PS_DANGEROUS_PATTERNS.some(p => p.test(command))
      if (risk !== 'destructive' && !psHit) return next()
      const short = command.length > 120 ? command.slice(0, 120) + '…' : command
      const reason = `HPClaw 安全策略：命令命中 destructive 风险级（rm/Remove-Item/格式化/杀作业或进程/管道进 shell 等模式），已按 commandPolicy=${commandPolicy} 拦截：${short}`
      if (commandPolicy === 'ask') return { kind: 'ask', reason }
      return { kind: 'deny', reason }
    })
  }
}
