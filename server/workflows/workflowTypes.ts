// 分析流程（Workflow）数据模型：用户可自定义、关键词可触发的分步命令模板。
import type { FlowManifest } from '../../shared/flowManifest';

export interface WorkflowStep {
  title: string;
  /** 命令模板，支持 {{参数名}} 占位 */
  command: string;
  notes?: string;
  optional?: boolean;
  /** 本步骤独立的可调参数（阈值、限定值等，带默认值），在运行面板逐步配置 */
  params?: WorkflowParam[];
  /** Agent 执行契约；BioSkills 导入流程用它追溯原始章节并按需加载关联技能。 */
  agent?: WorkflowStepAgent;
}

export interface WorkflowStepAgent {
  kind: 'decision' | 'compute' | 'qc' | 'report';
  sourceType?: 'bioskills' | 'paper' | 'repository' | 'user';
  sourcePath?: string;
  sourceSection?: string;
  evidence?: string;
  confidence?: 'high' | 'medium' | 'low';
  inputs?: string[];
  outputs?: string[];
  requiresReview?: boolean;
  skillRefs?: string[];
  /** 命令是需按现场数据渲染的参考模板，不允许不经检查直接执行。 */
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
  toolLinks: PaperToolLink[];
  quality: PaperWorkflowQuality;
  reviewedAt?: number;
}

export interface WorkflowProvenance {
  provider?: 'bioskills';
  sourcePath?: string;
  sourceName?: string;
  sourceDigest?: string;
  importerVersion?: string;
  /** 用户在流程编辑器修改过后置 true，后续自动种子升级不覆盖用户内容。 */
  customized?: boolean;
}

/** 随应用分发的管线文件：首次使用流程时自动部署到集群流程家目录 */
export interface WorkflowAsset {
  /** 内置资源文件（pipelines/ 下的相对路径） */
  source: string;
  /** 部署目标：流程家目录 01_software/ 下的相对路径 */
  remotePath: string;
  label?: string;
}

export interface WorkflowParam {
  /** 占位名（不含花括号），如 SAMPLE */
  name: string;
  /** 显示给用户的说明 */
  label: string;
  defaultValue?: string;
  /** 表单控件类型，缺省 text */
  type?: 'text' | 'number' | 'select' | 'boolean' | 'path';
  /** type=select 时的选项 */
  options?: string[];
  /** 输入占位提示 */
  placeholder?: string;
  /**
   * 是否必填；缺省规则：有 defaultValue 视为可选，否则必填。
   * 可选参数留空时不下发，由 AI 在运行过程中按需处理（如协助找参考数据或构建索引）。
   */
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  help?: string;
}

export type WorkflowSource = 'builtin' | 'user' | 'ai';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  /** 触发关键词（中英文均可） */
  keywords: string[];
  /** 面板分组/筛选分类；内置流程由 BUILTIN_CATEGORIES 按 id 注入，用户/AI 流程可自选 */
  category?: string;
  params: WorkflowParam[];
  steps: WorkflowStep[];
  /** 资源清单（必要软件/参考数据/QC 关卡），预检与四板块目录的依据 */
  manifest?: FlowManifest;
  /** 随应用分发的管线文件（首次使用自动部署到集群） */
  assets?: WorkflowAsset[];
  /** 系统导入来源与版本，便于升级、追溯和保护用户修改。 */
  provenance?: WorkflowProvenance;
  /** 从论文导入时保留的来源证据与完整度报告。 */
  paperImport?: WorkflowPaperImport;
  source: WorkflowSource;
  createdAt: number;
  updatedAt: number;
}

/** 用命令模板和参数值渲染最终命令 */
export function renderWorkflowCommand(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (whole, name: string) => {
    const value = values[name];
    return value !== undefined && value !== '' ? value : whole;
  });
}

/** 把流程渲染为给 agent 的执行指导文本 */
export function formatWorkflowForAgent(workflow: Workflow, values: Record<string, string> = {}): string {
  const lines: string[] = [];
  lines.push(`## 匹配的分析流程：${workflow.name}`);
  if (workflow.description) lines.push(workflow.description);
  lines.push('');
  lines.push('按以下步骤执行（可根据实际情况微调命令，但不要跳过步骤）：');
  workflow.steps.forEach((step, i) => {
    const optional = step.optional ? '（可选）' : '';
    lines.push(`${i + 1}. ${step.title}${optional}`);
    lines.push('```bash');
    lines.push(renderWorkflowCommand(step.command, values));
    lines.push('```');
    if (step.notes) lines.push(`   注意：${step.notes}`);
    if (step.agent?.sourceSection) lines.push(`   来源：${step.agent.sourceSection}${step.agent.sourcePath ? `（${step.agent.sourcePath}）` : ''}`);
    if (step.agent?.evidence) lines.push(`   证据：${step.agent.evidence}`);
    if (step.agent?.inputs?.length) lines.push(`   输入：${step.agent.inputs.join('、')}`);
    if (step.agent?.outputs?.length) lines.push(`   预期输出：${step.agent.outputs.join('、')}`);
    if (step.agent?.requiresReview) lines.push('   门禁：运行前必须由用户确认，禁止按模板直接提交。');
  });
  return lines.join('\n');
}
