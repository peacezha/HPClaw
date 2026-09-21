// dsh 引擎路由：决定 /api/ai/stream 的 agent 请求走 dsh sidecar 还是 HPClaw 自有
// legacy 引擎（runAgent）。纯函数，不感知 sidecar 可用性——可用性由调用方
// （ensureSidecar）另行检查，不可用时回退 legacy。

export interface SelectDshEngineOptions {
  /** 环境变量 HPCLAW_AI_ENGINE 一类显式覆盖：'dsh' | 'legacy' */
  envEngine?: string;
  mode: string;
  hasWorkflowRunContext: boolean;
  provider: string;
  /** 用户设置：auto / native / dsh。 */
  requestedEngine?: string;
}

export type AiEngineKind = 'dsh' | 'legacy';

export interface EngineSelection {
  engine: AiEngineKind;
  reason: string;
}

export function selectDshEngine(opts: SelectDshEngineOptions): EngineSelection {
  // env=legacy 是一票否决；env=dsh 只是倾向，仍受下列规则约束。
  if (opts.envEngine === 'legacy') return { engine: 'legacy', reason: 'env override' };
  // 正式流程（workflow run）有自有关键路径与结构化状态工具，dsh 暂不接。
  if (opts.hasWorkflowRunContext) return { engine: 'legacy', reason: 'workflow run context' };
  // 当前 dsh sidecar 只正确配置 DeepSeek 官方 provider。其他提供方必须走
  // 内置适配器；env=dsh 也不能绕过能力约束，否则会拿 DeepSeek 路由调用错误 Key。
  if (opts.provider !== 'deepseek') return { engine: 'legacy', reason: 'provider not supported by dsh' };
  if (opts.mode !== 'agent') return { engine: 'legacy', reason: 'non-agent mode' };
  if (opts.requestedEngine === 'native') return { engine: 'legacy', reason: 'user selected native' };
  if (opts.requestedEngine === 'dsh') return { engine: 'dsh', reason: 'user selected dsh' };
  if (opts.envEngine === 'dsh') return { engine: 'dsh', reason: 'env override' };
  return { engine: 'dsh', reason: 'default' };
}
