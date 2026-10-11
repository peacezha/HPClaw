export const AGENT_PLAN_CHECKPOINT = '[HPCLAW_AGENT_PLAN]';

export function serializeAgentPlanCheckpoint(plan: unknown): string {
  return `${AGENT_PLAN_CHECKPOINT} ${JSON.stringify(plan)}`;
}

export function findLatestAgentPlanCheckpoint(messages: Array<{ content: string }>): unknown | null {
  for (let index = messages.length - 1; index >= 0; index--) {
    const content = messages[index].content.trim();
    if (!content.startsWith(`${AGENT_PLAN_CHECKPOINT} `)) continue;
    const raw = content.slice(AGENT_PLAN_CHECKPOINT.length).trim();
    if (!raw || raw.length > 50_000) return null;
    try {
      const plan = JSON.parse(raw);
      return plan && typeof plan === 'object' && String(plan.goal || '').trim() && Array.isArray(plan.steps) ? plan : null;
    } catch { return null; }
  }
  return null;
}
