// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import WorkflowFlowGraph from './WorkflowFlowGraph';

afterEach(cleanup);

describe('WorkflowFlowGraph（竖向流程图）', () => {
  const steps = [
    { n: 1, title: '质控', status: 'done' as const },
    { n: 2, title: '比对', status: 'running' as const },
    { n: 3, title: '定量', status: 'pending' as const },
    { n: 4, title: '人工圈门', status: 'skipped' as const },
    { n: 5, title: '汇总', status: 'failed' as const },
  ];

  it('renders a start→steps→end vertical flowchart with every step title', () => {
    const { container } = render(<WorkflowFlowGraph steps={steps} currentStep={2} />);
    expect(screen.getByTestId('workflow-flow-chart')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
    expect(screen.getAllByText('开始').length).toBeGreaterThan(0);
    expect(screen.getAllByText('结束').length).toBeGreaterThan(0);
    for (const s of steps) expect(screen.getByText(`${s.n}. ${s.title}`)).toBeTruthy();
  });

  it('marks the current step with pulse and shows dashed branch edges for skipped steps', () => {
    const { container } = render(<WorkflowFlowGraph steps={steps} currentStep={2} />);
    expect(container.querySelector('g.animate-pulse')).toBeTruthy();
    // 跳过步骤走虚线分支
    const dashed = container.querySelectorAll('line[stroke-dasharray="4 3"], rect[stroke-dasharray="4 3"]');
    expect(dashed.length).toBeGreaterThan(0);
  });

  it('clicking a step node fires onSelectStep with its number', () => {
    const onSelect = vi.fn();
    render(<WorkflowFlowGraph steps={steps} onSelectStep={onSelect} />);
    fireEvent.click(screen.getByText('3. 定量'));
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  it('renders nothing for an empty step list', () => {
    const { container } = render(<WorkflowFlowGraph steps={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
