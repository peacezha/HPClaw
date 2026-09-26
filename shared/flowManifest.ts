// 流程资源清单（Flow Manifest / Workflow Contract v2）共享类型。
// 描述一个分析流程运行前必须就绪的软件、参考数据，以及运行中的 QC 关卡。
// 集群侧目录约定见 docs/FLOW_AUTOMATION.md。

/** 必要软件项 */
export interface SoftwareItem {
  /** 软件名，如 FastQC */
  name: string;
  /** 集群 module 名（含版本），如 "FastQC/0.11.9"；无 module 时省略 */
  module?: string;
  /** 层级 module 的前置模块，按顺序先在隔离子 shell 中加载。 */
  prerequisiteModules?: string[];
  /** 自定义检查命令（只读），缺省按 module av / command -v 自动检查 */
  checkCmd?: string;
  /** 版本获取命令（只读，可选） */
  versionCmd?: string;
  /** 是否必需；false 表示可选项，缺失不阻断运行 */
  required: boolean;
}

/** 参考数据类型 */
export type ReferenceType = 'genome' | 'index' | 'annotation' | 'database' | 'other';

/** 必要参考数据项 */
export interface ReferenceItem {
  /** 名称，如 "kallisto 索引" */
  name: string;
  /** 集群上的绝对路径（候选；预检时可由用户改指） */
  path: string;
  type: ReferenceType;
  /** 自定义检查命令（只读），缺省用 test -e + du -sh */
  checkCmd?: string;
  /** 来源说明（下载地址/公共库说明），缺失时给用户的补齐提示 */
  source?: string;
  required: boolean;
}

/** QC 关卡：在指定步骤完成后判定指标 */
export interface QcGate {
  /** 第几步之后判定（1-based，对应 steps 下标 +1） */
  afterStep: number;
  /** 指标名，如 "Q30 比例" */
  metric: string;
  /** 通过标准（人可读），如 ">80%" */
  pass: string;
  /** 警告标准（可选） */
  warn?: string;
}

/** 流程资源清单 */
export interface FlowManifest {
  software: SoftwareItem[];
  references: ReferenceItem[];
  /** 询问用户数据位置时的提示语（可含候选 glob，如 "*_R1.fq.gz"） */
  inputHint?: string;
  qcGates: QcGate[];
}

/** 单项预检结果 */
export interface PreflightItemResult {
  name: string;
  ok: boolean;
  required: boolean;
  /** 版本号（软件）或大小（参考数据）等附加信息 */
  detail?: string;
}

/** 一次预检的结构化结果（同时缓存在集群 01_software/env-check.json 与 02_reference/ref-check.json） */
export interface PreflightResult {
  workflowId: string;
  /** 预检所对应的流程更新时间；旧缓存没有该字段时视为失效。 */
  workflowVersion?: number;
  /** 流程资源清单指纹，防止流程修改后误用旧缓存。 */
  manifestHash?: string;
  checkedAt: number;
  scheduler: 'lsf' | 'slurm' | 'pbs' | 'none' | 'unknown';
  /** 非交互 SSH 中 Module/Lmod 是否已成功初始化。旧缓存可能没有此字段。 */
  moduleSystem?: 'ready' | 'unavailable' | 'unknown';
  moduleSystemDetail?: string;
  software: PreflightItemResult[];
  references: PreflightItemResult[];
  /** 全部 required 项就绪 */
  ready: boolean;
}

/** 流程在集群上的家目录（不含 run 层） */
export function flowHome(slug: string): string {
  return `~/hpclaw_flows/${slug}`;
}

/** 简单字符串 hash（djb2 → 6 位 hex），用于中文名折叠后的去重后缀 */
function shortHash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, '0').slice(0, 6);
}

/**
 * 由流程名生成集群目录 slug。
 * 集群路径必须是纯 ASCII 且不含 shell 特殊字符（括号/引号/反引号/$ 等会让
 * 未加引号的 mkdir/cd 直接语法报错——v0.4.19 的英文名带 (...) 就曾全盘炸掉预检）：
 * - 纯 ASCII 名：非法字符替换为 _；
 * - 含中文等非 ASCII 字符：剔除后用原名短哈希做后缀防碰撞
 *   （如 "RNA-seq 差异表达全流程" → "RNA-seq-a1b2c3"，避免与 "RNA-seq 质控与定量流程" 撞目录）；
 * - 剔除后为空（纯中文名）：flow-<hash>。
 */
export function workflowSlug(name: string): string {
  const legacy = workflowSlugLegacy(name);
  const ascii = legacy
    .replace(/[^\x21-\x7e]/g, '')
    .replace(/[()[\]{}$&;'"`!]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!ascii) return `flow-${shortHash(legacy)}`;
  return ascii === legacy ? ascii : `${ascii}-${shortHash(legacy)}`.slice(0, 48);
}

/** 旧版 slug（保留中文）：仅用于识别 slug ASCII 化之前生成的运行目录归属 */
export function workflowSlugLegacy(name: string): string {
  return (name || 'workflow').replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 40);
}

/** v0.4.19–v0.4.20 期间的 slug（ASCII 保留括号）：仅用于识别该窗口期生成的运行目录归属 */
export function workflowSlugParenLegacy(name: string): string {
  const legacy = workflowSlugLegacy(name);
  const ascii = legacy
    .replace(/[^\x21-\x7e]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!ascii) return `flow-${shortHash(legacy)}`;
  return ascii === legacy ? ascii : `${ascii}-${shortHash(legacy)}`.slice(0, 48);
}
