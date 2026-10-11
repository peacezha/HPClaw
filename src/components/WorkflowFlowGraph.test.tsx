// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import WorkflowFlowGraph, { wrapGraphLabel } from './WorkflowFlowGraph';

afterEach(cleanup);

describe('WorkflowFlowGraph（依赖流程图）', () => {
  it('keeps English words and attached parentheses/punctuation together', () => {
    const lines = wrapGraphLabel('2. Raw-read quality control (FastQC)');
    expect(lines[0]).toBe('2. Raw-read quality control');
    expect(lines[1]).toBe('(FastQC)');
    expect(wrapGraphLabel('1. Preflight: software, inputs, and reference data')[1]).not.toMatch(/^[,;:)]/);
  });
  const steps = [
    { n: 1, title: '质控', status: 'done' as const },
    { n: 2, title: '比对', status: 'running' as const },
    { n: 3, title: '定量', status: 'pending' as const },
    { n: 4, title: '人工圈门', status: 'skipped' as const },
    { n: 5, title: '汇总', status: 'failed' as const },
  ];

  it('renders a start→steps→end flowchart with every step title', async () => {
    const { container } = render(<WorkflowFlowGraph steps={steps} currentStep={2} />);
    expect(screen.getByTestId('workflow-flow-chart')).toBeTruthy();
    await waitFor(() => expect(container.querySelector('svg')).toBeTruthy());
    expect(container.querySelector('svg')).toBeTruthy();
    expect(screen.getAllByText('Start').length).toBeGreaterThan(0);
    expect(screen.getAllByText('End').length).toBeGreaterThan(0);
    for (const s of steps) expect(screen.getByText(`${s.n}. ${s.title}`)).toBeTruthy();
  });

  it('marks the current step with pulse and shows dashed branch edges for skipped steps', async () => {
    const { container } = render(<WorkflowFlowGraph steps={steps} currentStep={2} />);
    await waitFor(() => expect(container.querySelector('circle.animate-pulse')).toBeTruthy());
    const dashed = container.querySelectorAll('path[stroke-dasharray="4 3"], rect[stroke-dasharray="4 3"]');
    expect(dashed.length).toBeGreaterThan(0);
  });

  it('clicking a step node fires onSelectStep with its number', async () => {
    const onSelect = vi.fn();
    render(<WorkflowFlowGraph steps={steps} onSelectStep={onSelect} />);
    fireEvent.click(await screen.findByText('3. 定量'));
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  it('renders nothing for an empty step list', () => {
    const { container } = render(<WorkflowFlowGraph steps={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders explicit parallel branches and a gather node from dependsOn', async () => {
    const dag = [
      { n: 1, stepId: 'prepare', title: '准备', status: 'done' as const, dependsOn: [] },
      { n: 2, stepId: 'star', title: 'STAR', status: 'done' as const, dependsOn: ['prepare'] },
      { n: 3, stepId: 'kallisto', title: 'Kallisto', status: 'done' as const, dependsOn: ['prepare'] },
      { n: 4, stepId: 'report', title: '汇总', status: 'pending' as const, dependsOn: ['star', 'kallisto'] },
    ];
    const { container } = render(<WorkflowFlowGraph steps={dag} />);
    await waitFor(() => expect(container.querySelector('svg')).toBeTruthy());
    expect(container.querySelector('path[data-from="prepare"][data-to="star"]')).toBeTruthy();
    expect(container.querySelector('path[data-from="prepare"][data-to="kallisto"]')).toBeTruthy();
    expect(container.querySelector('path[data-from="star"][data-to="report"]')).toBeTruthy();
    expect(container.querySelector('path[data-from="kallisto"][data-to="report"]')).toBeTruthy();
  });

  it('hides transitively redundant edges (u→x→v already connected)', async () => {
    const dag = [
      { n: 1, stepId: 'prep', title: '准备', status: 'done' as const, dependsOn: [] },
      { n: 2, stepId: 'align', title: '比对', status: 'done' as const, dependsOn: ['prep'] },
      { n: 3, stepId: 'qc', title: '质控', status: 'pending' as const, dependsOn: ['prep', 'align'] },
    ];
    const { container } = render(<WorkflowFlowGraph steps={dag} />);
    await waitFor(() => expect(container.querySelector('svg')).toBeTruthy());
    // prep→align→qc 已连通，直连边 prep→qc 是冗余线，不再绘制
    expect(container.querySelector('path[data-from="prep"][data-to="qc"]')).toBeNull();
    expect(container.querySelector('path[data-from="prep"][data-to="align"]')).toBeTruthy();
    expect(container.querySelector('path[data-from="align"][data-to="qc"]')).toBeTruthy();
    fireEvent.click(screen.getByText('显示全部依赖'));
    await waitFor(() => expect(container.querySelector('path[data-from="prep"][data-to="qc"]')).toBeTruthy());
  });
});
