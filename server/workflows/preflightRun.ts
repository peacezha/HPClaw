// 启动前整体检查：用本次运行配置一次性扫描整个流程的
// 软件 / 参考数据 / 输入数据存在性 / 参数完整性 / 步骤脚本未解析占位符，
// 汇总成结构化问题清单，让前端集中展示并由用户一次解答，
// 而不是运行到一半逐步踩坑、反复暂停询问。
// 所有集群检查均为只读（module 探测 / test -e），不安装、不修改环境。
import type { Workflow, WorkflowParam } from './workflowTypes';
import type {
  FlowManifest,
  PreflightResult,
  PreflightRunIssue,
  PreflightRunReport,
  ReferenceItem,
} from '../../shared/flowManifest';
import { workflowSlug } from '../../shared/flowManifest';
import { runPreflight, type ExecFn } from './preflight';
import { buildWorkflowStepScript, sanitizeRunConfig } from './workflowRunService';

/** 整体上限 120s：环境核查内部已用 120s，输入存在性检查从剩余预算里取（≤30s） */
const OVERALL_TIMEOUT_MS = 120_000;
const INPUT_CHECK_TIMEOUT_MS = 30_000;

/** shell 单引号转义 */
function shq(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/** shell 路径引用：~ 开头的路径展开为 "$HOME/..."（单引号内 ~ 不展开，会导致检查永远失败） */
function shqPath(p: string): string {
  if (p.startsWith('~/')) return `"$HOME/${p.slice(2).replace(/"/g, '')}"`;
  return shq(p);
}

const PLACEHOLDER_RE = /\{\{\s*([\w.-]+)\s*\}\}/g;

/** 文本里的 {{占位符}} 名去重列表 */
export function placeholdersOf(text: string): string[] {
  return [...new Set([...text.matchAll(PLACEHOLDER_RE)].map(match => match[1]))];
}

/** 能解析的 {{占位符}} 代入实际值；没有值的占位符原样保留（交给后续列问题项） */
function resolvePlaceholders(text: string, values: Record<string, string>): string {
  return text.replace(PLACEHOLDER_RE, (whole, name: string) => {
    const value = values[name];
    return value !== undefined && value.trim() !== '' ? value : whole;
  });
}

/** 必填判定：显式 required 优先；否则有默认值视为可选（与前端 isWorkflowParamRequired 一致） */
function isParamRequired(p: WorkflowParam): boolean {
  return p.required ?? !p.defaultValue;
}

/** 服务端参数校验：与前端 validateParamValue 同一套消息（i18n 按既有模板翻译） */
export function validateRunParam(param: WorkflowParam, value: string): string | null {
  if (!value) return null;
  if (param.type === 'number') {
    const n = Number(value);
    if (!Number.isFinite(n)) return `${param.label || param.name}必须是数字`;
    if (param.min !== undefined && n < param.min) return `${param.label || param.name}不能小于 ${param.min}`;
    if (param.max !== undefined && n > param.max) return `${param.label || param.name}不能大于 ${param.max}`;
  }
  if (param.pattern) {
    try {
      if (!new RegExp(param.pattern).test(value)) return `${param.label || param.name}格式不正确`;
    } catch { return `${param.label || param.name}的校验规则无效`; }
  }
  return null;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/**
 * 启动前整体检查主流程。单个检查环节失败（SSH 抖动、脚本渲染异常等）降级为 warn 问题项，
 * 不让整个检查 500；只有 blocker 问题会阻止"仍然开始运行"。
 */
export async function runPreflightForConfig(
  exec: ExecFn,
  workflow: Workflow,
  rawConfig: unknown,
): Promise<PreflightRunReport> {
  const startedAt = Date.now();
  const config = sanitizeRunConfig(rawConfig);
  const issues: PreflightRunIssue[] = [];

  // ── 1. 参数校验：全局参数 + 未跳过步骤的步骤参数（必填/数值范围/正则）──
  const paramIssueNames = new Set<string>();
  for (const p of workflow.params) {
    const value = (config.params[p.name] ?? '').trim();
    if (!value) {
      if (isParamRequired(p)) {
        issues.push({ kind: 'param', name: p.name, label: p.label || p.name, message: '必填参数未填写', severity: 'blocker' });
        paramIssueNames.add(p.name);
      }
      continue;
    }
    const error = validateRunParam(p, value);
    if (error) {
      issues.push({ kind: 'param', name: p.name, label: p.label || p.name, message: error, severity: 'blocker' });
      paramIssueNames.add(p.name);
    }
  }
  workflow.steps.forEach((step, index) => {
    const n = index + 1;
    if (config.skippedSteps.includes(n)) return;
    for (const p of step.params || []) {
      const value = (config.stepParams[n]?.[p.name] ?? '').trim();
      if (!value) {
        if (isParamRequired(p)) {
          issues.push({ kind: 'param', step: n, name: p.name, label: p.label || p.name, message: '必填参数未填写', severity: 'blocker' });
          paramIssueNames.add(p.name);
        }
        continue;
      }
      const error = validateRunParam(p, value);
      if (error) {
        issues.push({ kind: 'param', step: n, name: p.name, label: p.label || p.name, message: error, severity: 'blocker' });
        paramIssueNames.add(p.name);
      }
    }
  });

  // ── 2. 参考数据：先用本次配置把 {{占位符}} 解析成实际值，再跑环境核查 ──
  // 取值顺序与运行时一致：用户对该参考数据的改指（referenceOverrides，按参考数据名）> 全局参数值
  const values: Record<string, string> = { ...config.params, ...config.referenceOverrides };
  if (!(values.INPUT_DIR ?? '').trim() && config.inputs[0]) values.INPUT_DIR = config.inputs[0];
  const manifest: FlowManifest = workflow.manifest ?? { software: [], references: [], qcGates: [] };
  const resolvedReferences: ReferenceItem[] = [];
  for (const ref of manifest.references) {
    const override = (config.referenceOverrides[ref.name] ?? '').trim();
    const path = override || resolvePlaceholders(ref.path, values);
    const leftover = placeholdersOf(path);
    if (leftover.length > 0) {
      // 解析不了：列为"待用户指定路径"问题项，而不是直接判 not-ok
      issues.push({
        kind: 'reference',
        name: ref.name,
        label: ref.name,
        message: `待用户指定路径（${leftover.join('、')} 未提供）`,
        severity: ref.required ? 'blocker' : 'warn',
      });
      continue;
    }
    resolvedReferences.push({
      ...ref,
      path,
      checkCmd: ref.checkCmd ? resolvePlaceholders(ref.checkCmd, values) : undefined,
    });
  }

  let preflight: PreflightResult | null = null;
  if (manifest.software.length > 0 || resolvedReferences.length > 0) {
    try {
      // persist=false：本次按运行配置解析后的临时核查不写集群缓存，
      // 否则占位符参考数据的解析结果会顶掉面板"按需环境检查"的正式缓存。
      preflight = await runPreflight(
        exec,
        { ...workflow, manifest: { ...manifest, references: resolvedReferences } },
        undefined,
        { persist: false },
      );
      preflight.software.forEach(item => {
        if (!item.ok) {
          issues.push({
            kind: 'software', name: item.name, label: item.name,
            message: item.detail || '未就绪', severity: item.required ? 'blocker' : 'warn',
          });
        }
      });
      preflight.references.forEach(item => {
        if (!item.ok) {
          issues.push({
            kind: 'reference', name: item.name, label: item.name,
            message: item.detail || '未就绪', severity: item.required ? 'blocker' : 'warn',
          });
        }
      });
    } catch (err) {
      issues.push({
        kind: 'software', name: 'preflight', label: '环境检查',
        message: `环境检查未完成：${errorMessage(err)}`, severity: 'warn',
      });
    }
  }

  // ── 3. 输入数据存在性：一次组合只读 test -e，预算取整体 120s 的剩余（≤30s）──
  const inputs = config.inputs.filter(p => p && placeholdersOf(p).length === 0).slice(0, 50);
  const remaining = OVERALL_TIMEOUT_MS - (Date.now() - startedAt);
  if (inputs.length > 0 && remaining > 3_000) {
    try {
      const script = inputs
        .map((p, i) => `if [ -e ${shqPath(p)} ]; then echo "INPUT|${i}|1"; else echo "INPUT|${i}|0"; fi`)
        .join('\n');
      const raw = await exec(script, Math.min(remaining, INPUT_CHECK_TIMEOUT_MS));
      const seen = new Map<number, boolean>();
      for (const line of raw.split(/\r?\n/)) {
        const match = line.match(/^INPUT\|(\d+)\|([01])/);
        if (match) seen.set(Number(match[1]), match[2] === '1');
      }
      inputs.forEach((p, i) => {
        const exists = seen.get(i);
        if (exists === false) {
          issues.push({ kind: 'input', name: p, label: p, message: '输入数据路径在集群上不存在', severity: 'blocker' });
        } else if (exists === undefined) {
          issues.push({ kind: 'input', name: p, label: p, message: '未能确认输入路径存在性', severity: 'warn' });
        }
      });
    } catch (err) {
      issues.push({
        kind: 'input', name: '*', label: '输入数据',
        message: `输入数据存在性检查未完成：${errorMessage(err)}`, severity: 'warn',
      });
    }
  }

  // ── 4. 逐步渲染脚本，汇总所有未解析占位符（复用正式建运行的同一渲染管线）──
  const probeRunDir = `~/trace_flows/${workflowSlug(workflow.name)}/03_workspace/runs/preflight-scan`;
  workflow.steps.forEach((step, index) => {
    const n = index + 1;
    if (config.skippedSteps.includes(n)) return;
    try {
      const script = buildWorkflowStepScript(workflow, config, n, probeRunDir, 'lsf');
      const unresolved = placeholdersOf(script).filter(name => !paramIssueNames.has(name));
      if (unresolved.length > 0) {
        issues.push({
          kind: 'placeholder', step: n, name: unresolved.join(','), label: step.title,
          message: `步骤脚本有未解析占位符：${unresolved.join('、')}（可在参数中指定，或留空由 AI 运行时处理）`,
          severity: 'warn',
        });
      }
    } catch (err) {
      issues.push({
        kind: 'placeholder', step: n, name: '', label: step.title,
        message: `步骤脚本渲染失败：${errorMessage(err)}`, severity: 'warn',
      });
    }
  });

  return { ok: !issues.some(issue => issue.severity === 'blocker'), issues, preflight };
}
