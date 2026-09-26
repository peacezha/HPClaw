export type WorkflowRunStatus = 'blocked_env' | 'running' | 'waiting_user' | 'waiting_jobs' | 'done' | 'failed' | 'cancelled' | 'unknown';
export type WorkflowRunStepStatus = 'pending' | 'running' | 'done' | 'failed' | 'skipped';

export interface WorkflowRunQc {
  status: 'pass' | 'warn' | 'fail';
  metrics?: Record<string, string>;
}

export interface WorkflowRunStep {
  n: number;
  stepId: string;
  /** 稳定步骤 id 列表；流程图和运行门禁均按它判断前置关系。 */
  dependsOn?: string[];
  phase?: string;
  title: string;
  status: WorkflowRunStepStatus;
  startedAt?: number;
  finishedAt?: number;
  jobIds?: string[];
  summary?: string;
  qc?: WorkflowRunQc;
  outputs?: string[];
  /** 支撑完成判定的真实命令、日志、指标或文件证据。 */
  evidence?: string[];
  /** 本步骤在 RUN/code 下的唯一可执行脚本；用户可在运行前查看和修改。 */
  scriptPath?: string;
  scriptUpdatedAt?: number;
  /** 用户通过流程代码编辑器保存过该脚本；Agent 不得擅自覆盖。 */
  scriptUserModified?: boolean;
  /** 当前脚本内容 SHA-256。 */
  scriptHash?: string;
  /** 步骤进入 running 时冻结的脚本 SHA-256。 */
  submittedScriptHash?: string;
}

export interface WorkflowRunConfig {
  inputs: string[];
  params: Record<string, string>;
  stepParams: Record<number, Record<string, string>>;
  referenceOverrides: Record<string, string>;
  skippedSteps: number[];
  stepCommandOverrides: Record<number, string>;
}

export interface WorkflowRun {
  runId: string;
  workflowId: string;
  workflowName: string;
  workflowVersion: number;
  /** 每次受控写入递增，用于发现并发更新与旧状态覆盖。 */
  revision: number;
  runDir: string;
  /** 按步骤保存可查看、可编辑运行脚本的目录。 */
  codeDir?: string;
  /** 本次运行的强制文件边界；所有写入和默认命令工作目录均为 runDir。 */
  workspacePolicy?: 'isolated-run-v1';
  status: WorkflowRunStatus;
  startedAt: number;
  updatedAt: number;
  heartbeatAt: number;
  endedAt?: number;
  currentStep: number;
  totalSteps: number;
  config: WorkflowRunConfig;
  steps: WorkflowRunStep[];
  reportPath?: string;
  stale?: boolean;
  displayStatus?: 'stalled';
  jobStates?: Record<string, string>;
  error?: string;
}

export interface WorkflowRunPatch {
  /** 可选乐观锁；不等于当前 revision 时拒绝更新。 */
  expectedRevision?: number;
  /** 用户明确要求重跑时，把该步骤及其后续步骤原子重置为 pending。 */
  restartFromStep?: number;
  status?: WorkflowRunStatus;
  currentStep?: number;
  summary?: string;
  error?: string;
  reportPath?: string;
  step?: Partial<WorkflowRunStep> & { n: number };
}
