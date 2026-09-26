// 流程（Workflow）共享类型（与 server/workflows/workflowTypes.ts 对齐）
import type { FlowManifest } from './flowManifest';

export type { FlowManifest } from './flowManifest';

export interface WorkflowStep {
  /** 稳定步骤标识；依赖图使用它连边。旧流程未提供时运行时生成 step-NN。 */
  id?: string;
  title: string;
  command: string;
  notes?: string;
  optional?: boolean;
  /**
   * 本步骤依赖的步骤 id。未提供表示沿用旧版串行语义（依赖紧邻前一步）；
   * 显式 [] 表示可直接从“开始”节点进入，用于并行分支。
   */
  dependsOn?: string[];
  /** 流程图泳道/阶段标签，仅用于表达真实任务分支，不改变命令内容。 */
  phase?: string;
  /** 本步骤独立的可调参数（阈值、限定值等，带默认值），在运行面板逐步配置 */
  params?: WorkflowParam[];
  /** Agent 执行契约；BioSkills 导入流程用它追溯原始章节并按需加载关联技能。 */
  agent?: WorkflowStepAgent;
}

export interface WorkflowStepAgent {
  kind: 'decision' | 'compute' | 'qc' | 'report';
  /** 来源类型；paper 流程用于区分正文证据与代码仓库证据。 */
  sourceType?: 'bioskills' | 'paper' | 'repository' | 'user';
  sourcePath?: string;
  sourceSection?: string;
  /** 对来源内容的短句转述，禁止把模型推测伪装成论文原文。 */
  evidence?: string;
  confidence?: 'high' | 'medium' | 'low';
  /** 本步骤预期消费/产出的文件或数据对象，供 Agent 逐步核对。 */
  inputs?: string[];
  outputs?: string[];
  /** 论文或仓库没有给出足够执行细节，运行前必须由用户确认。 */
  requiresReview?: boolean;
  skillRefs?: string[];
  template?: boolean;
  contractVersion?: string;
}

export interface PaperWorkflowQuestion {
  question: string;
  blocking: boolean;
  affectsSteps?: number[];
}

export interface PaperToolLink {
  canonicalName: string;
  paperMention?: string;
  codeMention?: string;
  paperSection?: string;
  codePath?: string;
  status: 'matched' | 'paper_only' | 'code_only' | 'unverified';
  knowledgeBase?: string;
}

export interface PaperWorkflowQuality {
  score: number;
  readiness: 'ready_for_review' | 'needs_input' | 'insufficient';
  dimensions: {
    evidence: number;
    executability: number;
    parameters: number;
    resources: number;
    qc: number;
  };
  blockers: string[];
  warnings: string[];
  supportedSteps: number;
  totalSteps: number;
}

/** 文献导入的可追溯信息与确定性质量报告；随流程保存，避免导入提示关闭后丢失。 */
export interface WorkflowPaperImport {
  importerVersion: string;
  sourceLabel: string;
  doi?: string;
  repoUrl?: string;
  repoFiles?: string[];
  primaryPath?: string;
  methodSections: string[];
  excludedBranches: string[];
  unresolvedQuestions: PaperWorkflowQuestion[];
  /** CoPaLink 风格的论文工具—代码工具跨来源对照，未匹配项必须显式保留。 */
  toolLinks: PaperToolLink[];
  quality: PaperWorkflowQuality;
  /** 用户已在编辑器查看并确认过缺口；不代表论文没有缺失信息。 */
  reviewedAt?: number;
}

export interface WorkflowProvenance {
  provider?: 'bioskills' | 'encode-dcc' | 'encode-partner' | 'hpclaw';
  sourcePath?: string;
  sourceName?: string;
  sourceDigest?: string;
  /** 上游权威来源及固定版本，避免“参考某流程”被误标成官方实现。 */
  sourceUrl?: string;
  sourceRef?: string;
  upstreamWorkflow?: string;
  implementation?: 'official-wrapper' | 'compatible-reimplementation' | 'reference-extension';
  importerVersion?: string;
  customized?: boolean;
}

/** 随应用分发的管线文件：首次使用流程时自动部署到集群流程家目录 */
export interface WorkflowAsset {
  /** 内置资源文件（pipelines/ 下的相对路径），如 hidog/hidogV11.py */
  source: string;
  /** 部署目标：流程家目录 01_software/ 下的相对路径，如 hidog/hidogV11.py */
  remotePath: string;
  label?: string;
}

export interface WorkflowParam {
  name: string;
  label: string;
  defaultValue?: string;
  /** 表单控件类型，缺省 text */
  type?: 'text' | 'number' | 'select' | 'boolean' | 'path';
  /** type=select 时的选项 */
  options?: string[];
  placeholder?: string;
  /** 是否必填；缺省：有 defaultValue 视为可选，否则必填。可选参数留空由 AI 运行时处理 */
  required?: boolean;
  /** number 类型的范围与步长约束。 */
  min?: number;
  max?: number;
  step?: number;
  /** text/path 类型的正则校验（不含斜杠）。 */
  pattern?: string;
  /** 给用户的补充说明。 */
  help?: string;
}

export type WorkflowSource = 'builtin' | 'user' | 'ai';

/**
 * 流程分类（面板分组与筛选用）。内置流程按 id 映射到这 7 类
 * （映射表在 server/workflows/workflowStore.ts 的 BUILTIN_CATEGORIES）；
 * 用户/AI 流程可在编辑器选择或自定义分类，缺省归入“其他”。
 */
export const WORKFLOW_CATEGORIES = [
  '基因组与变异分析',
  '转录组与表观调控',
  '单细胞与免疫分析',
  '蛋白代谢与多组学',
  '微生物与病原分析',
  '基因编辑与 CRISPR',
  '任务管理与通用工具',
] as const;

export interface Workflow {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  /** 面板分组/筛选分类；建议取 WORKFLOW_CATEGORIES，也允许自定义，缺省归入“其他” */
  category?: string;
  params: WorkflowParam[];
  steps: WorkflowStep[];
  /** 资源清单（必要软件/参考数据/QC 关卡） */
  manifest?: FlowManifest;
  /** 随应用分发的管线文件（首次使用自动部署到集群），如 HiDOG 三个核心 py */
  assets?: WorkflowAsset[];
  /** 系统导入来源与版本。 */
  provenance?: WorkflowProvenance;
  /** 从论文导入时的证据、排除分支、待确认问题与质量评分。 */
  paperImport?: WorkflowPaperImport;
  source: WorkflowSource;
  createdAt: number;
  updatedAt: number;
}
