export type AgentPlanStepStatus = 'pending' | 'running' | 'waiting' | 'done' | 'failed' | 'skipped';

export interface AgentPlanStep {
  id: string;
  title: string;
  verification: string;
  status: AgentPlanStepStatus;
  summary?: string;
  evidence?: string[];
  startedAt?: number;
  finishedAt?: number;
}

export interface AgentExecutionPlan {
  goal: string;
  steps: AgentPlanStep[];
  createdAt: number;
  updatedAt: number;
}

export class AgentPlanState {
  private value: AgentExecutionPlan | null = null;

  restore(value: unknown): AgentExecutionPlan | null {
    if (!value || typeof value !== 'object') return null;
    const raw = value as Partial<AgentExecutionPlan>;
    if (!String(raw.goal || '').trim() || !Array.isArray(raw.steps)) return null;
    const validStatuses = new Set<AgentPlanStepStatus>(['pending', 'running', 'waiting', 'done', 'failed', 'skipped']);
    const steps = raw.steps.slice(0, 12).map((step, index) => {
      const item = step as Partial<AgentPlanStep>;
      const status = validStatuses.has(item.status as AgentPlanStepStatus) ? item.status as AgentPlanStepStatus : 'pending';
      return {
        id: String(item.id || index + 1).slice(0, 30),
        title: String(item.title || '').trim().slice(0, 300),
        verification: String(item.verification || '').trim().slice(0, 500),
        status,
        summary: item.summary ? String(item.summary).slice(0, 4000) : undefined,
        evidence: Array.isArray(item.evidence) ? item.evidence.map(String).slice(0, 30) : undefined,
        startedAt: Number.isFinite(item.startedAt) ? Number(item.startedAt) : undefined,
        finishedAt: Number.isFinite(item.finishedAt) ? Number(item.finishedAt) : undefined,
      };
    }).filter(step => step.title && step.verification);
    if (steps.length === 0 || steps.filter(step => step.status === 'running').length > 1) return null;
    const now = Date.now();
    this.value = {
      goal: String(raw.goal).trim().slice(0, 500),
      steps,
      createdAt: Number.isFinite(raw.createdAt) ? Number(raw.createdAt) : now,
      updatedAt: Number.isFinite(raw.updatedAt) ? Number(raw.updatedAt) : now,
    };
    return this.snapshot();
  }

  set(goal: string, steps: Array<{ title: string; verification: string }>, now = Date.now()): AgentExecutionPlan {
    if (this.value) throw new Error('计划已经创建；请更新已有步骤，不要重复创建计划。');
    const cleanSteps = steps
      .map((step, index) => ({
        id: String(index + 1),
        title: String(step.title || '').trim().slice(0, 300),
        verification: String(step.verification || '').trim().slice(0, 500),
        status: 'pending' as const,
      }))
      .filter(step => step.title && step.verification);
    if (cleanSteps.length === 0) throw new Error('计划至少需要一个包含验证方法的步骤。');
    this.value = {
      goal: String(goal || '').trim().slice(0, 500),
      steps: cleanSteps,
      createdAt: now,
      updatedAt: now,
    };
    return this.snapshot()!;
  }

  get(): AgentExecutionPlan | null {
    return this.snapshot();
  }

  hasPlan(): boolean {
    return this.value !== null;
  }

  activeStep(): AgentPlanStep | null {
    return this.value?.steps.find(step => step.status === 'running') ?? null;
  }

  update(
    id: string,
    status: Exclude<AgentPlanStepStatus, 'pending'>,
    details: { summary?: string; evidence?: string[] } = {},
    now = Date.now(),
  ): AgentExecutionPlan {
    if (!this.value) throw new Error('尚未创建计划。');
    const step = this.value.steps.find(item => item.id === String(id));
    if (!step) throw new Error(`计划步骤不存在: ${id}`);

    const allowed: Record<AgentPlanStepStatus, AgentPlanStepStatus[]> = {
      pending: ['running', 'skipped'],
      running: ['waiting', 'done', 'failed'],
      waiting: ['running', 'skipped'],
      failed: ['running', 'skipped'],
      done: [],
      skipped: [],
    };
    if (!allowed[step.status].includes(status)) {
      throw new Error(`非法步骤状态转换: ${step.status} -> ${status}`);
    }
    if (status === 'running') {
      const other = this.value.steps.find(item => item.id !== step.id && item.status === 'running');
      if (other) throw new Error(`步骤 ${other.id} 仍在执行，请先完成或暂停它。`);
      step.startedAt ??= now;
      delete step.finishedAt;
    }
    if (status === 'done' && !String(details.summary || '').trim()) {
      throw new Error('完成步骤时必须提供基于真实输出的 summary。');
    }

    step.status = status;
    if (details.summary !== undefined) step.summary = String(details.summary).trim().slice(0, 4000);
    if (details.evidence !== undefined) {
      step.evidence = details.evidence.map(String).map(item => item.trim()).filter(Boolean).slice(0, 30);
    }
    if (status === 'done' || status === 'failed' || status === 'skipped') step.finishedAt = now;
    this.value.updatedAt = now;
    return this.snapshot()!;
  }

  isComplete(): boolean {
    return !!this.value && this.value.steps.every(step => step.status === 'done' || step.status === 'skipped');
  }

  recordActiveEvidence(items: string[], now = Date.now()): AgentExecutionPlan | null {
    const step = this.activeStep();
    if (!step || !this.value) return this.snapshot();
    const existing = step.evidence ?? [];
    step.evidence = [...existing, ...items.map(String).map(item => item.trim()).filter(Boolean)]
      .slice(-30)
      .map(item => item.slice(0, 2000));
    this.value.updatedAt = now;
    return this.snapshot();
  }

  reset(): void {
    if (this.activeStep()) throw new Error('当前仍有 running 步骤，必须先标记 waiting/failed/done 才能重置计划。');
    this.value = null;
  }

  private snapshot(): AgentExecutionPlan | null {
    if (!this.value) return null;
    return JSON.parse(JSON.stringify(this.value)) as AgentExecutionPlan;
  }
}
