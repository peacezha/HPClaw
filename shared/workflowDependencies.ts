import type { WorkflowStep } from './workflow';

/** Materialize stable IDs before editing/deleting; never retarget old edges. */
export function stableWorkflowStepIds(steps: WorkflowStep[], materializeSequential = false): WorkflowStep[] {
  const used = new Set(steps.flatMap(step => step.id ? [step.id] : []));
  const withIds = steps.map((step, i) => {
    if (step.id) return { ...step };
    const base = `step-${String(i + 1).padStart(2, '0')}`;
    let id = base, suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    return { ...step, id };
  });
  return materializeSequential
    ? withIds.map((step, i) => ({ ...step, dependsOn: step.dependsOn ?? (i ? [withIds[i - 1].id!] : []) }))
    : withIds;
}

export function validateOrderedDependencies(steps: WorkflowStep[]): void {
  const materialized = stableWorkflowStepIds(steps);
  const seen = new Set<string>();
  for (const step of materialized) {
    if (seen.has(step.id!)) throw new Error(`Duplicate step ID: ${step.id}`);
    for (const dep of step.dependsOn || []) if (!seen.has(dep)) {
      throw new Error(`Dependency must refer to an earlier, existing step: ${step.id} → ${dep}`);
    }
    seen.add(step.id!);
  }
}
