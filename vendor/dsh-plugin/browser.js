/**
 * browser.js — HPClaw browser-control tools for dsh (v0.4.0).
 *
 * 零依赖 CDP（Chrome DevTools Protocol）实现，运行环境为 vendored Node 22
 * （全局 WebSocket + fetch）：
 *   - 浏览器发现：config.browserPath 优先，否则按候选数组找本机 Edge/Chrome；
 *   - 启动：独立 user-data-dir（不碰用户日常浏览器的标签页/登录态），随机空闲
 *     端口开 --remote-debugging-port，轮询 /json/version 就绪；
 *   - 会话：/json/new（PUT，新版 Chrome 要求；失败回退 GET）拿页面级
 *     webSocketDebuggerUrl，id 自增 JSON-RPC 风格收发；
 *   - 工具：browse_open / browse_eval / browse_click / browse_type /
 *     browse_screenshot / browse_close，全部不抛异常、串行调度。
 *
 * createBrowserController 同时导出供离线自测（不经 dsh/模型）使用。
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'

/** 本机浏览器候选（config.browserPath 优先于该列表）。 */
const BROWSER_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
]

const EVAL_RESULT_CAP = 8 * 1024
const TEXT_SNIPPET_CAP = 2 * 1024
const CDP_CALL_TIMEOUT_MS = 30_000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function findBrowserExecutable(configPath) {
  if (typeof configPath === 'string' && configPath.length > 0) {
    return existsSync(configPath) ? configPath : null
  }
  for (const candidate of BROWSER_CANDIDATES) {
    if (existsSync(candidate)) return candidate
  }
  return null
}

/** 让内核分一个空闲端口后立刻释放（CDP 启动窗口期够短，竞态可接受）。 */
function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

async function fetchJson(url, timeoutMs, method = 'GET') {
  const res = await fetch(url, { method, signal: AbortSignal.timeout(timeoutMs) })
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`)
  return await res.json()
}

/**
 * 页面/浏览器级 CDP WebSocket 连接：id 自增发 {id, method, params}，
 * Promise 映射应答；事件帧（无 id）忽略。断线时挂起的调用全部 reject。
 */
class CdpConnection {
  constructor(wsUrl) {
    this.wsUrl = wsUrl
    this.ws = null
    this.nextId = 1
    this.pending = new Map()
  }

  connect(timeoutMs = 10_000) {
    return new Promise((resolve, reject) => {
      let settled = false
      const timer = setTimeout(() => {
        if (!settled) { settled = true; try { this.ws?.close() } catch { /* ignore */ } ; reject(new Error(`CDP WebSocket connect timed out: ${this.wsUrl}`)) }
      }, timeoutMs)
      const ws = new WebSocket(this.wsUrl)
      this.ws = ws
      ws.addEventListener('open', () => { if (!settled) { settled = true; clearTimeout(timer); resolve() } })
      ws.addEventListener('error', (ev) => {
        if (!settled) { settled = true; clearTimeout(timer); reject(new Error(`CDP WebSocket error: ${ev.message ?? 'unknown'}`)) }
      })
      ws.addEventListener('message', (ev) => {
        let msg
        try { msg = JSON.parse(typeof ev.data === 'string' ? ev.data : '') } catch { return }
        if (msg == null || typeof msg.id !== 'number') return // 事件帧不处理
        const entry = this.pending.get(msg.id)
        if (!entry) return
        this.pending.delete(msg.id)
        clearTimeout(entry.timer)
        if (msg.error) entry.reject(new Error(`${entry.method} failed: ${msg.error.message ?? JSON.stringify(msg.error)}`))
        else entry.resolve(msg.result ?? {})
      })
      ws.addEventListener('close', () => {
        for (const [id, entry] of this.pending) {
          this.pending.delete(id)
          clearTimeout(entry.timer)
          entry.reject(new Error(`CDP WebSocket closed while awaiting ${entry.method}`))
        }
      })
    })
  }

  send(method, params = {}, timeoutMs = CDP_CALL_TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== 1) return reject(new Error(`CDP WebSocket not open (cannot send ${method})`))
      const id = this.nextId++
      const timer = setTimeout(() => {
        if (this.pending.delete(id)) reject(new Error(`${method} timed out after ${timeoutMs}ms`))
      }, timeoutMs)
      this.pending.set(id, { resolve, reject, timer, method })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }

  close() {
    try { this.ws?.close() } catch { /* ignore */ }
    this.ws = null
  }
}

/**
 * 浏览器控制器：惰性启动浏览器，维护一个活动标签页的 CDP 连接。
 * 所有方法返回结构化结果、不抛异常（调用方直接用返回值喂模型）。
 */
export function createBrowserController(config = {}) {
  let child = null
  let port = null
  let browserWsUrl = null
  let page = null // CdpConnection（活动标签页）

  const reset = () => {
    page?.close()
    page = null
    child = null
    port = null
    browserWsUrl = null
  }

  /** 确保浏览器进程在跑且 CDP 就绪；进程被杀后下次调用自动重启。 */
  async function ensureBrowser() {
    if (child && port) {
      try {
        const ver = await fetchJson(`http://127.0.0.1:${port}/json/version`, 2_000)
        if (ver?.webSocketDebuggerUrl) { browserWsUrl = ver.webSocketDebuggerUrl; return }
      } catch { /* 进程僵死/端口不通，走重启 */ }
      reset()
    }
    const exe = findBrowserExecutable(config.browserPath)
    if (!exe) {
      const err = new Error('browser_not_found: no Edge/Chrome found; set config.browserPath explicitly')
      err.code = 'browser_not_found'
      throw err
    }
    port = await findFreePort()
    const userDataDir = config.cdpUserDataDir || path.join(os.tmpdir(), 'hpclaw-cdp-profile')
    const headless = config.browserHeadless === true
    const args = [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      ...(headless ? ['--headless=new'] : []),
      'about:blank',
    ]
    child = spawn(exe, args, { stdio: 'ignore', windowsHide: false })
    child.on('exit', () => reset())
    child.on('error', () => reset())
    const deadline = Date.now() + 15_000
    let ver = null
    while (Date.now() < deadline) {
      try {
        ver = await fetchJson(`http://127.0.0.1:${port}/json/version`, 1_000)
        if (ver?.webSocketDebuggerUrl) break
        ver = null
      } catch { await sleep(300) }
    }
    if (!ver?.webSocketDebuggerUrl) {
      reset()
      throw new Error('cdp_not_ready: /json/version not reachable within 15s after launching the browser')
    }
    browserWsUrl = ver.webSocketDebuggerUrl
  }

  /** 确保有一个连着活动标签页的页面级 CDP 连接。 */
  async function ensurePage() {
    await ensureBrowser()
    if (page) {
      // 探活：旧标签页可能已被关掉
      try { await page.send('Runtime.evaluate', { expression: '1', returnByValue: true }, 3_000); return } catch { page.close(); page = null }
    }
    let tab
    try {
      tab = await fetchJson(`http://127.0.0.1:${port}/json/new?about:blank`, 5_000, 'PUT')
    } catch {
      tab = await fetchJson(`http://127.0.0.1:${port}/json/new?about:blank`, 5_000) // 旧版回退 GET
    }
    if (!tab?.webSocketDebuggerUrl) throw new Error('failed to open a new tab via /json/new')
    page = new CdpConnection(tab.webSocketDebuggerUrl)
    await page.connect()
    await page.send('Page.enable')
    await page.send('Runtime.enable')
  }

  async function evaluate(expression) {
    const result = await page.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) {
      const detail = result.exceptionDetails.exception?.description
        ?? result.exceptionDetails.text
        ?? 'unknown evaluation exception'
      const err = new Error(String(detail))
      err.code = 'evaluation_exception'
      throw err
    }
    return result.result?.value
  }

  async function open(url) {
    try {
      if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
        return { ok: false, error: `invalid url (must start with http:// or https://): ${String(url)}` }
      }
      await ensurePage()
      await page.send('Page.navigate', { url })
      // 轮询 document.readyState === 'complete'（≤20s）
      const deadline = Date.now() + 20_000
      let readyState = ''
      while (Date.now() < deadline) {
        try {
          readyState = await evaluate('document.readyState')
          if (readyState === 'complete') break
        } catch { /* 导航途中上下文销毁属正常，继续轮询 */ }
        await sleep(400)
      }
      if (readyState !== 'complete') {
        return { ok: false, error: `page did not reach readyState=complete within 20s (last: ${readyState || 'unknown'})`, url }
      }
      const [title, finalUrl, bodyText] = await Promise.all([
        evaluate('document.title'),
        evaluate('location.href'),
        evaluate("document.body ? document.body.innerText : ''"),
      ])
      return {
        ok: true,
        title: String(title ?? ''),
        url: String(finalUrl ?? url),
        textSnippet: String(bodyText ?? '').slice(0, TEXT_SNIPPET_CAP),
      }
    } catch (err) {
      return { ok: false, error: err.code ?? String(err.message ?? err) }
    }
  }

  async function evalExpression(expression) {
    try {
      if (typeof expression !== 'string' || expression.trim().length === 0) {
        return { ok: false, error: 'invalid args: "expression" must be a non-empty string' }
      }
      await ensurePage()
      const value = await evaluate(expression)
      let serialized
      try { serialized = JSON.stringify(value) } catch { serialized = String(value) }
      if (serialized === undefined) serialized = String(value)
      if (serialized.length > EVAL_RESULT_CAP) {
        serialized = serialized.slice(0, EVAL_RESULT_CAP) + `...[truncated, ${serialized.length - EVAL_RESULT_CAP} chars omitted]`
      }
      return { ok: true, result: serialized }
    } catch (err) {
      return { ok: false, error: err.code ?? String(err.message ?? err) }
    }
  }

  async function click(selector) {
    try {
      if (typeof selector !== 'string' || selector.trim().length === 0) {
        return { ok: false, error: 'invalid args: "selector" must be a non-empty string' }
      }
      await ensurePage()
      const found = await evaluate(
        `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.click(); return true })()`,
      )
      if (found !== true) return { ok: false, error: `selector_not_found: ${selector}` }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.code ?? String(err.message ?? err) }
    }
  }

  async function type(selector, text) {
    try {
      if (typeof selector !== 'string' || selector.trim().length === 0) {
        return { ok: false, error: 'invalid args: "selector" must be a non-empty string' }
      }
      await ensurePage()
      const found = await evaluate(
        `(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) return false;
          el.focus();
          el.value = ${JSON.stringify(String(text ?? ''))};
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        })()`,
      )
      if (found !== true) return { ok: false, error: `selector_not_found: ${selector}` }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.code ?? String(err.message ?? err) }
    }
  }

  async function screenshot(destPath) {
    try {
      await ensurePage()
      const shot = await page.send('Page.captureScreenshot', { format: 'png' }, 60_000)
      if (typeof shot?.data !== 'string' || shot.data.length === 0) {
        return { ok: false, error: 'Page.captureScreenshot returned no data' }
      }
      const buffer = Buffer.from(shot.data, 'base64')
      const filePath = typeof destPath === 'string' && destPath.trim().length > 0
        ? destPath
        : path.join(os.tmpdir(), `hpclaw-screenshot-${Date.now()}.png`)
      await writeFile(filePath, buffer)
      return { ok: true, path: filePath, bytes: buffer.length }
    } catch (err) {
      return { ok: false, error: err.code ?? String(err.message ?? err) }
    }
  }

  async function close() {
    try {
      const wasRunning = child != null
      page?.close()
      page = null
      if (browserWsUrl) {
        try {
          const browser = new CdpConnection(browserWsUrl)
          await browser.connect(5_000)
          await browser.send('Browser.close', {}, 5_000)
          browser.close()
        } catch {
          if (child) { try { child.kill() } catch { /* ignore */ } }
        }
      } else if (child) {
        try { child.kill() } catch { /* ignore */ }
      }
      reset()
      return { ok: true, wasRunning }
    } catch (err) {
      reset()
      return { ok: false, error: err.code ?? String(err.message ?? err) }
    }
  }

  return { open, eval: evalExpression, click, type, screenshot, close }
}

/* ------------------------------------------------------------------ */
/* dsh 工具注册                                                         */
/* ------------------------------------------------------------------ */

const BROWSER_OK_ERROR_SCHEMA = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    error: { type: 'string', description: 'Machine-readable error kind or message (browser_not_found | cdp_not_ready | selector_not_found | evaluation_exception | ...).' },
  },
  required: ['ok'],
  additionalProperties: false,
}

function renderBrowserResult(toolName, okText) {
  return (_args, value) => [{
    type: 'text',
    text: value.ok
      ? (typeof okText === 'function' ? okText(value) : okText)
      : `${toolName} failed: ${value.error ?? 'unknown error'}`,
  }]
}

/** 注册 browse_* 工具组（全部串行调度，共享一个浏览器进程/标签页）。 */
export function registerBrowserTools(ctx, config = {}) {
  const controller = createBrowserController(config)
  const launchNote = config.browserHeadless === true ? 'headless' : 'headed'

  ctx.tools.register({
    name: 'browse_open',
    description:
      `Open a URL in the local browser (Edge/Chrome via CDP, ${launchNote}, isolated user-data-dir — the user's own tabs are untouched). ` +
      'Launches the browser on demand, waits for readyState=complete (up to 20s), and returns { ok, title, url, textSnippet } ' +
      '(first 2KB of page text). Use for web demos and page verification.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'http(s) URL to open.' },
      },
      required: ['url'],
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          title: { type: 'string' },
          url: { type: 'string', description: 'Final URL after navigation/redirects.' },
          textSnippet: { type: 'string', description: "First 2KB of document.body.innerText." },
          error: { type: 'string' },
        },
        required: ['ok'],
        additionalProperties: false,
      },
      render: renderBrowserResult('browse_open', (v) => `Opened ${v.url}\ntitle: ${v.title}\n${v.textSnippet ?? ''}`),
    },
    timeoutMs: 90_000,
    isConcurrencySafe: () => false,
    async execute(args) {
      return await controller.open(args?.url)
    },
  })

  ctx.tools.register({
    name: 'browse_eval',
    description:
      'Evaluate a JavaScript expression in the currently open browser page (Runtime.evaluate with returnByValue + awaitPromise). ' +
      'Returns { ok, result } with the JSON-serialized value (capped at 8KB), or { ok:false, error }. ' +
      'Use sparingly and only on the page relevant to the current task.',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'JavaScript expression to evaluate in the page context, e.g. "document.title".' },
      },
      required: ['expression'],
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          result: { type: 'string', description: 'JSON-serialized evaluation result (≤8KB).' },
          error: { type: 'string' },
        },
        required: ['ok'],
        additionalProperties: false,
      },
      render: renderBrowserResult('browse_eval', (v) => v.result ?? '(undefined)'),
    },
    timeoutMs: 60_000,
    isConcurrencySafe: () => false,
    async execute(args) {
      return await controller.eval(args?.expression)
    },
  })

  ctx.tools.register({
    name: 'browse_click',
    description:
      'Click the first element matching a CSS selector in the current browser page. ' +
      'Returns { ok:true } or { ok:false, error:"selector_not_found" } when nothing matches.',
    parameters: {
      type: 'object',
      properties: {
        selector: { type: 'string', description: 'CSS selector, e.g. "#submit" or "button.primary".' },
      },
      required: ['selector'],
    },
    output: {
      schema: BROWSER_OK_ERROR_SCHEMA,
      render: renderBrowserResult('browse_click', (v) => `clicked (ok=${v.ok})`),
    },
    timeoutMs: 60_000,
    isConcurrencySafe: () => false,
    async execute(args) {
      return await controller.click(args?.selector)
    },
  })

  ctx.tools.register({
    name: 'browse_type',
    description:
      'Set the value of an input/textarea matched by a CSS selector and dispatch input+change events ' +
      '(framework-friendly). Returns { ok:true } or { ok:false, error:"selector_not_found" }.',
    parameters: {
      type: 'object',
      properties: {
        selector: { type: 'string', description: 'CSS selector of the input element.' },
        text: { type: 'string', description: 'Text to set as the element value.' },
      },
      required: ['selector', 'text'],
    },
    output: {
      schema: BROWSER_OK_ERROR_SCHEMA,
      render: renderBrowserResult('browse_type', (v) => `typed (ok=${v.ok})`),
    },
    timeoutMs: 60_000,
    isConcurrencySafe: () => false,
    async execute(args) {
      return await controller.type(args?.selector, args?.text)
    },
  })

  ctx.tools.register({
    name: 'browse_screenshot',
    description:
      'Capture a PNG screenshot of the current browser page (Page.captureScreenshot) and save it to disk. ' +
      'Returns { ok, path, bytes }. When `path` is omitted the file goes to the system temp dir as hpclaw-screenshot-<ts>.png.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Absolute output path for the PNG. Optional.' },
      },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          path: { type: 'string' },
          bytes: { type: 'integer' },
          error: { type: 'string' },
        },
        required: ['ok'],
        additionalProperties: false,
      },
      render: renderBrowserResult('browse_screenshot', (v) => `screenshot saved: ${v.path} (${v.bytes} bytes)`),
    },
    timeoutMs: 90_000,
    isConcurrencySafe: () => false,
    async execute(args) {
      return await controller.screenshot(args?.path)
    },
  })

  ctx.tools.register({
    name: 'browse_close',
    description:
      'Close the controlled browser process (Browser.close via CDP, falling back to killing the process). ' +
      'The next browse_open relaunches it automatically.',
    parameters: { type: 'object', properties: {} },
    output: {
      schema: BROWSER_OK_ERROR_SCHEMA,
      render: renderBrowserResult('browse_close', (v) => (v.wasRunning ? 'browser closed' : 'browser was not running')),
    },
    timeoutMs: 30_000,
    isConcurrencySafe: () => false,
    async execute() {
      return await controller.close()
    },
  })
}
