// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import WorkflowStepDependencies from './WorkflowStepDependencies';
import type { WorkflowStep } from '@/shared/workflow';
afterEach(cleanup);
const steps = [{ title: 'A', command: 'echo a' }, { title: 'B', command: 'echo b' }, { title: 'C', command: 'echo c' }];
describe('dependency selection', () => {
  it('materializes stable IDs and adds a join without rewriting commands', () => {
    const change = vi.fn();
    render(<WorkflowStepDependencies steps={steps} index={2} onChange={change} />);
    fireEvent.click(screen.getByText(/上游依赖/));
    fireEvent.click(screen.getByLabelText('1. A'));
    const edited = change.mock.calls[0][0] as WorkflowStep[];
    expect(edited[2].dependsOn).toEqual(['step-02', 'step-01']);
    expect(edited.map(s => s.command)).toEqual(steps.map(s => s.command));
    expect(steps[0]).not.toHaveProperty('id');
  });
  it('can explicitly remove an invalid dependency after deleting a step', () => {
    const change = vi.fn();
    render(<WorkflowStepDependencies steps={[{ ...steps[0], id: 'a' }, { ...steps[2], id: 'c', dependsOn: ['removed'] }]} index={1} onChange={change}/>);
    fireEvent.click(screen.getByText(/上游依赖/));
    fireEvent.click(screen.getByText(/移除无效依赖/));
    expect(change.mock.calls[0][0][1].dependsOn).toEqual([]);
  });
});
