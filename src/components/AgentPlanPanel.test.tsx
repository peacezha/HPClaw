// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AgentPlanPanel from './AgentPlanPanel';

afterEach(cleanup);

const plan = {
  goal: '质控并比对',
  steps: [
    { id: '1', title: '运行 FastQC', status: 'done' as const, summary: '已生成报告' },
    { id: '2', title: '提交 bwa 比对', status: 'running' as const },
    { id: '3', title: '汇总结果', status: 'pending' as const },
  ],
};

describe('AgentPlanPanel', () => {
  it('stays hidden without a plan', () => {
    const { container } = render(<AgentPlanPanel plan={null} english={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows progress and the running step title in the collapsed bar', () => {
    render(<AgentPlanPanel plan={plan} english={false} />);
    const bar = screen.getByTestId('agent-plan-panel');
    expect(bar.textContent).toContain('步骤 1/3');
    expect(bar.textContent).toContain('当前: 提交 bwa 比对');
    // 折叠时不渲染完整列表
    expect(bar.textContent).not.toContain('汇总结果');
  });

  it('expands to the full step list with per-step statuses', () => {
    render(<AgentPlanPanel plan={plan} english={false} />);
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    expect(screen.getByText(/3\. 汇总结果/)).toBeTruthy();
    expect(document.querySelector('[data-step-status="done"]')).toBeTruthy();
    expect(document.querySelector('[data-step-status="running"]')).toBeTruthy();
    expect(document.querySelector('[data-step-status="pending"]')).toBeTruthy();
    expect(screen.getByText('完成')).toBeTruthy();
    expect(screen.getByText('进行中')).toBeTruthy();
    expect(screen.getByText('待办')).toBeTruthy();
  });

  it('renders a cancelled plan with the cancelled marker', () => {
    render(<AgentPlanPanel plan={{ ...plan, status: 'cancelled' }} english={false} />);
    expect(screen.getByTestId('agent-plan-panel').textContent).toContain('计划已取消');
  });

  it('renders English labels when english=true', () => {
    render(<AgentPlanPanel plan={plan} english />);
    const bar = screen.getByTestId('agent-plan-panel');
    expect(bar.textContent).toContain('Task list');
    expect(bar.textContent).toContain('Step 1/3');
  });
});
