// 终端 AI 网关路由：非流式一次性补全。
// /api/ai（通用一次性补全）、/api/ai/autocomplete（终端命令自动补全）、
// /api/ai/analyze-output（选中终端输出分析）三个端点共用 providerAdapters.completeAI
// 做 provider 分发（OpenAI 兼容 / Gemini），profile 解析与 /api/ai/stream 同一约定：
// 请求体携带 profile → normalizeAIProfile，并按需同步到服务端共享配置。
import type { Express, Request, Response } from 'express';
import type { AIMessage, ClusterSnapshot } from './types';
import { completeAI, extractAIText } from './providerAdapters';
import { profileFromBody, messagesFromBody } from './contextHelpers';
import { saveServerAiProfile } from './serverAiProfile';
import { buildContextBlock, buildPathSuggestions, type AutocompleteSuggestion } from './autocompleteContext';

/** 自动补全整体超时：必须足够短，否则拖累按键体验 */
const AUTOCOMPLETE_TIMEOUT_MS = 10_000;
/** 选中输出分析整体超时 */
const ANALYZE_TIMEOUT_MS = 60_000;
/** 通用一次性补全整体超时 */
const COMPLETE_TIMEOUT_MS = 120_000;
/** 发给模型的终端输出上限：只保留末尾，报错与状态通常在最后 */
const ANALYZE_MAX_CHARS = 8000;
/** 补全建议条数上限（前端最多展示 6 条，含本地历史/语法建议） */
const AUTOCOMPLETE_MAX_SUGGESTIONS = 6;
/** AI 补全的 token 预算：只要 JSON 数组，给少量即可 */
const AUTOCOMPLETE_MAX_TOKENS = 300;

export interface GatewayRoutesDeps {
  /** 取当前 SSH 会话的集群快照（仅读缓存，不远程采集）；未连接集群时返回 null */
  resolveSnapshot?: (req: Request) => ClusterSnapshot | null;
}

type GatewayLocale = 'zh-CN' | 'en-US';

function localeOf(body: any): GatewayLocale {
  return body?.locale === 'en-US' ? 'en-US' : 'zh-CN';
}

/** 超时控制器：到点 abort；请求结束后务必 cancel 释放定时器 */
function withTimeout(ms: number): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

/** 让不支持 AbortSignal 的 provider（Gemini SDK）也能被整体超时截断 */
function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(
      value => { signal.removeEventListener('abort', onAbort); resolve(value); },
      err => { signal.removeEventListener('abort', onAbort); reject(err); },
    );
  });
}

/** 统一错误响应：超时 504，provider 错误 502，不抛未捕获异常 */
function sendGatewayError(res: Response, err: any): void {
  if (res.headersSent) return;
  const message = err?.message || String(err);
  if (err?.name === 'AbortError' || /aborted|timeout/i.test(message)) {
    res.status(504).json({ error: 'AI 请求超时，请稍后重试' });
    return;
  }
  res.status(502).json({ error: message });
}

/** 截断终端输出：保留末尾 maxChars 个字符（报错与状态一般在最后） */
export function truncateOutput(text: string, maxChars = ANALYZE_MAX_CHARS): string {
  if (text.length <= maxChars) return text;
  return `...[truncated]\n${text.slice(-maxChars)}`;
}

/**
 * 构建自动补全消息：要求模型只返回 JSON 数组，
 * completion 为完整命令行（前端选中后直接替换当前输入）。
 */
export function buildAutocompleteMessages(options: {
  command: string;
  history: string[];
  snapshot: ClusterSnapshot | null;
  locale: GatewayLocale;
}): AIMessage[] {
  const explainLang = options.locale === 'en-US' ? 'English' : '中文';
  const system = [
    'You are an HPC terminal command autocomplete engine for a Linux cluster (LSF scheduler, common bioinformatics tools).',
    'Given the partial command the user is typing, suggest the most likely complete command lines.',
    'Rules:',
    '- Reply with ONLY a JSON array of up to 4 items: [{"completion": "...", "explanation": "..."}]. No markdown, no code fence, no extra text.',
    '- completion must be the full command line and should start with the user\'s current input.',
    `- explanation is one short phrase in ${explainLang}.`,
    '- Prefer commands that reference real files from the environment context and continue the user\'s recent habits.',
  ].join('\n');

  const context = buildContextBlock(options.snapshot, options.history);
  return [
    { role: 'system', content: system },
    { role: 'user', content: `当前输入: ${options.command}${context}` },
  ];
}

/** 解析模型返回的补全 JSON：容忍代码围栏与首尾噪声，过滤非法项并去重 */
export function parseAutocompleteSuggestions(
  text: string,
  command: string,
  limit = AUTOCOMPLETE_MAX_SUGGESTIONS,
): AutocompleteSuggestion[] {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const results: AutocompleteSuggestion[] = [];
  const seen = new Set<string>();
  for (const item of parsed) {
    const raw = (item as any)?.completion;
    const completion = typeof raw === 'string' ? raw.trim() : '';
    // 丢掉空项和与当前输入完全相同的项（前端也会再过滤一次）
    if (!completion || completion === command || seen.has(completion)) continue;
    seen.add(completion);
    const rawExplanation = (item as any)?.explanation;
    results.push({
      completion,
      explanation: typeof rawExplanation === 'string' ? rawExplanation.trim() : '',
    });
    if (results.length >= limit) break;
  }
  return results;
}

/** 构建输出分析消息：一句话结论 → 报错原因 → 具体下一步 */
export function buildAnalyzeMessages(options: { text: string; locale: GatewayLocale }): AIMessage[] {
  const system = options.locale === 'en-US'
    ? 'You are an HPC cluster terminal output analyzer (LSF scheduler, Linux, common bioinformatics tools). Analyze the selected terminal output: 1) one-sentence conclusion; 2) if it is an error, explain the likely cause; 3) give concrete next-step commands or checks. Be concise; keep commands, paths and filenames verbatim. Reply in English.'
    : '你是 HPC 集群终端输出分析助手（LSF 调度器、Linux、常见生信工具）。分析用户选中的终端输出：1) 一句话结论；2) 若为报错，说明最可能的原因；3) 给出具体可执行的下一步命令或检查项。保持简洁，命令、路径、文件名保持原样。';
  return [
    { role: 'system', content: system },
    { role: 'user', content: `\`\`\`\n${truncateOutput(options.text)}\n\`\`\`` },
  ];
}

/** 从一次性补全结果中取纯文本（分析场景丢弃 <thought> 包装，只留最终回答） */
function plainContent(data: any): string {
  return data?.choices?.[0]?.message?.content || '';
}

export function registerGatewayRoutes(app: Express, deps: GatewayRoutesDeps = {}): void {
  // 通用一次性（非流式）补全：请求体与 /api/ai/stream 相同，直接透传 provider 的响应 JSON
  app.post('/api/ai', async (req: Request, res: Response) => {
    const profile = profileFromBody(req.body);
    if (!profile.apiKey) {
      res.status(400).json({ error: 'Missing API Key' });
      return;
    }
    // 同步到服务端共享配置（QQ 机器人等复用同一份 AI 设置）
    saveServerAiProfile(profile);

    const { signal, cancel } = withTimeout(COMPLETE_TIMEOUT_MS);
    try {
      const data = await abortable(completeAI({
        profile,
        messages: messagesFromBody(req.body),
        isFastMode: !!req.body?.isFastMode,
        maxTokens: req.body?.maxTokens,
        signal,
      }), signal);
      res.json(data);
    } catch (err: any) {
      sendGatewayError(res, err);
    } finally {
      cancel();
    }
  });

  // 终端命令自动补全：短超时 + 低 token，失败时前端静默降级为本地建议
  app.post('/api/ai/autocomplete', async (req: Request, res: Response) => {
    const command = typeof req.body?.command === 'string' ? req.body.command : '';
    if (!command.trim()) {
      res.status(400).json({ error: 'Missing command' });
      return;
    }
    const profile = profileFromBody(req.body);
    if (!profile.apiKey) {
      res.status(400).json({ error: 'Missing API Key' });
      return;
    }
    // 每键都会触发，不做 saveServerAiProfile 磁盘写入；profile 以请求体为准

    const snapshot = deps.resolveSnapshot?.(req) ?? null;
    // 路径补全来自集群快照缓存，零延迟零 token
    const pathSuggestions = buildPathSuggestions(command, snapshot, 4);
    const history: string[] = Array.isArray(req.body?.history)
      ? req.body.history.filter((h: any) => typeof h === 'string').slice(0, 8)
      : [];

    const { signal, cancel } = withTimeout(AUTOCOMPLETE_TIMEOUT_MS);
    try {
      const data = await abortable(completeAI({
        profile,
        messages: buildAutocompleteMessages({ command, history, snapshot, locale: localeOf(req.body) }),
        isFastMode: true,
        maxTokens: AUTOCOMPLETE_MAX_TOKENS,
        signal,
      }), signal);
      const aiSuggestions = parseAutocompleteSuggestions(extractAIText(data), command);
      // 合并去重：路径建议在前（精确、免费），AI 建议补足语义
      const merged = [...pathSuggestions];
      const seen = new Set(merged.map(s => s.completion));
      for (const s of aiSuggestions) {
        if (seen.has(s.completion)) continue;
        seen.add(s.completion);
        merged.push(s);
      }
      res.json({ suggestions: merged.slice(0, AUTOCOMPLETE_MAX_SUGGESTIONS) });
    } catch (err: any) {
      // 补全失败不打扰用户：有路径建议就降级返回，否则返回错误码（前端静默降级为 []）
      if (pathSuggestions.length > 0) {
        res.json({ suggestions: pathSuggestions });
        return;
      }
      sendGatewayError(res, err);
    } finally {
      cancel();
    }
  });

  // 选中终端输出分析：截断过长输出后走一次性补全
  app.post('/api/ai/analyze-output', async (req: Request, res: Response) => {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text) {
      res.status(400).json({ error: 'Missing text' });
      return;
    }
    const profile = profileFromBody(req.body);
    if (!profile.apiKey) {
      res.status(400).json({ error: 'Missing API Key' });
      return;
    }
    // 同步到服务端共享配置（QQ 机器人等复用同一份 AI 设置）
    saveServerAiProfile(profile);

    const { signal, cancel } = withTimeout(ANALYZE_TIMEOUT_MS);
    try {
      const data = await abortable(completeAI({
        profile,
        messages: buildAnalyzeMessages({ text, locale: localeOf(req.body) }),
        maxTokens: 2048,
        signal,
      }), signal);
      res.json({ analysis: plainContent(data) });
    } catch (err: any) {
      sendGatewayError(res, err);
    } finally {
      cancel();
    }
  });
}
