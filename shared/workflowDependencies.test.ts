import { describe, expect, it } from 'vitest';
import { stableWorkflowStepIds, validateOrderedDependencies } from './workflowDependencies';
describe('workflow dependency editing', () => {
  const step = (id?: string, dependsOn?: string[]) => ({ id, dependsOn, title: 'step', command: 'echo ok' });
  it('avoids collisions without rewriting existing IDs or definitions', () => {
    const source = [step(), step('step-01')];
    expect(stableWorkflowStepIds(source).map(s => s.id)).toEqual(['step-01-2', 'step-01']);
    expect(source[0].id).toBeUndefined();
  });
  it('retains IDs across deletion so an edge never changes its meaning', () => {
    const rows = stableWorkflowStepIds([step(), step(), step('report', ['step-02'])]);
    const remaining = rows.filter((_, i) => i !== 1);
    expect(remaining[1].dependsOn).toEqual(['step-02']);
    expect(() => validateOrderedDependencies(remaining)).toThrow('existing step');
  });
  it('also preserves formerly implicit sequential edges before deleting a legacy step', () => {
    const rows = stableWorkflowStepIds([step(), step(), step()], true).filter((_, i) => i !== 1);
    expect(rows[1].dependsOn).toEqual(['step-02']);
    expect(() => validateOrderedDependencies(rows)).toThrow();
  });
  it('accepts roots, forks, joins and legacy sequential dependencies', () => {
    expect(() => validateOrderedDependencies([step('a', []), step('b', ['a']), step('c', ['a']), step('d', ['b', 'c']), step()])).not.toThrow();
  });
  it('rejects duplicate IDs, missing nodes, future nodes and cycles', () => {
    for (const rows of [[step('a'), step('a')], [step('a', ['z'])], [step('a', ['b']), step('b')], [step('a', ['a'])]]) {
      expect(() => validateOrderedDependencies(rows)).toThrow();
    }
  });
});
