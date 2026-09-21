import type { Phase, Step, TaskPlan } from './types';

const PLANNING_SYSTEM_PROMPT = `You are an HPC bioinformatics task planner. Given a user's goal and cluster context, create a phased execution plan.

Output ONLY a JSON object (no markdown, no extra text):

{
  "goal": "one-line goal description",
  "phases": [
    {
      "id": 1,
      "name": "Phase name (Chinese OK)",
      "steps": [
        {
          "id": "1.1",
          "description": "Step description",
          "linkedSkills": ["skill-filename-1"]
        }
      ],
      "linkedSkills": ["skill-filename-1", "skill-filename-2"],
      "entryConditions": ["condition to start this phase"]
    }
  ]
}

Rules:
- Break the task into 2-5 phases
- Each phase has 1-4 concrete steps
- linkedSkills: reference actual skill filenames that are relevant
- entryConditions: what must be true before this phase can start
- Order phases logically (QC before alignment, etc.)
- Output ONLY the JSON object`;

export function buildPlanningPrompt(
  goal: string,
  clusterContext: string,
  availableSkills: string[],
): string {
  return [
    PLANNING_SYSTEM_PROMPT,
    '',
    `Available skills: ${availableSkills.join(', ') || '(none)'}`,
    `Cluster context:\n${clusterContext || '(unknown)'}`,
    '',
    `User goal: ${goal}`,
  ].join('\n');
}

export function parsePlanFromResponse(raw: string): TaskPlan | null {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      goal: String(parsed.goal || ''),
      phases: Array.isArray(parsed.phases)
        ? parsed.phases.map((p: any, i: number) => ({
            id: Number(p.id) || i + 1,
            name: String(p.name || `Phase ${i + 1}`),
            status: 'pending' as const,
            steps: Array.isArray(p.steps)
              ? p.steps.map((s: any) => ({
                  id: String(s.id || `${i + 1}.1`),
                  description: String(s.description || ''),
                  status: 'pending' as const,
                  linkedSkills: Array.isArray(s.linkedSkills) ? s.linkedSkills.map(String) : [],
                }))
              : [],
            linkedSkills: Array.isArray(p.linkedSkills) ? p.linkedSkills.map(String) : [],
            entryConditions: Array.isArray(p.entryConditions) ? p.entryConditions.map(String) : [],
          }))
        : [],
      currentPhase: 0,
      createdAt: Date.now(),
    };
  } catch {
    return null;
  }
}

export function formatPlanForAI(plan: TaskPlan | null): string {
  if (!plan) return '';

  const lines: string[] = ['## 执行计划'];

  lines.push(`**目标**: ${plan.goal}`);
  lines.push(`**当前阶段**: ${plan.phases.filter(p => p.status === 'done').length}/${plan.phases.length}`);

  for (const phase of plan.phases) {
    const statusIcon = phase.status === 'done' ? '✅' :
      phase.status === 'active' ? '🔄' :
      phase.status === 'failed' ? '❌' : '⏳';
    lines.push(`\n### ${statusIcon} 阶段${phase.id}: ${phase.name}`);
    lines.push(`关联技能: ${phase.linkedSkills.join(', ') || '(无)'}`);

    for (const step of phase.steps) {
      const stepIcon = step.status === 'done' ? '✅' :
        step.status === 'running' ? '🔄' :
        step.status === 'failed' ? '❌' : '⬜';
      lines.push(`  ${stepIcon} ${step.id}: ${step.description}`);
    }
  }

  return lines.join('\n');
}

export class AgentPlanner {
  private plan: TaskPlan | null = null;

  setPlan(plan: TaskPlan): void {
    this.plan = plan;
  }

  currentPlan(): TaskPlan | null {
    return this.plan;
  }

  currentPhase(): Phase | null {
    if (!this.plan) return null;
    return this.plan.phases.find(p => p.id === this.plan!.currentPhase) ?? null;
  }

  activatePhase(phaseId: number): Phase | null {
    if (!this.plan) return null;
    const phase = this.plan.phases.find(p => p.id === phaseId);
    if (!phase) return null;
    phase.status = 'active';
    this.plan.currentPhase = phaseId;
    return phase;
  }

  completePhase(phaseId: number): void {
    if (!this.plan) return;
    const phase = this.plan.phases.find(p => p.id === phaseId);
    if (phase) {
      phase.status = 'done';
      for (const step of phase.steps) {
        step.status = 'done';
      }
    }
  }

  failPhase(phaseId: number): void {
    if (!this.plan) return;
    const phase = this.plan.phases.find(p => p.id === phaseId);
    if (phase) phase.status = 'failed';
  }

  updateStep(phaseId: number, stepId: string, updates: Partial<Step>): void {
    if (!this.plan) return;
    const phase = this.plan.phases.find(p => p.id === phaseId);
    if (!phase) return;
    const step = phase.steps.find(s => s.id === stepId);
    if (step) Object.assign(step, updates);
  }

  allPhasesComplete(): boolean {
    if (!this.plan) return false;
    return this.plan.phases.every(p => p.status === 'done');
  }

  clear(): void {
    this.plan = null;
  }
}

export const agentPlanner = new AgentPlanner();
