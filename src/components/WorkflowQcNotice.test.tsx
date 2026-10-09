// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import WorkflowQcNotice from './WorkflowQcNotice';
import { RunItem } from './FlowRunnerDrawer';
import { LanguageToggle, LocaleProvider } from '../i18n';
import type { WorkflowRun } from '../features/workflows/api';

afterEach(() => { cleanup(); window.localStorage.clear(); });
function run(qc: 'pass' | 'warn' | 'fail' = 'fail'): WorkflowRun {
  return {
    runId: 'qc-run', workflowId: 'qc', runDir: '/home/qc/hpclaw_flows/qc/03_workspace/runs/qc-run',
    revision: 4, status: 'waiting_user', currentStep: 1, totalSteps: 2,
    steps: [
      { n: 1, title: '质控', status: 'done', qc: { status: qc, metrics: { FRiP: '0.005', sample: '样本_01' } },
        qcCriteria: [{ afterStep: 1, metric: 'FRiP', pass: '>=0.01' }], summary: '原始日志：FRiP=0.005' },
      { n: 2, title: '下游分析', status: 'pending' },
    ],
  };
}
const callbacks = () => ({ onToggle: vi.fn(), onShowLog: vi.fn(), onShowReport: vi.fn(), onShowCode: vi.fn(),
  onOpenFolder: vi.fn(), onResume: vi.fn(), resuming: false });

describe('QC warnings are visible and accurate', () => {
  it('shows failure, measured metrics and declared criteria even in a folded run card', () => {
    const actions = callbacks();
    render(<RunItem run={run()} expanded={false} {...actions} />);
    expect(screen.getByRole('alert')).toHaveTextContent('质量不佳，不建议继续下游分析');
    expect(screen.getByText('0.005')).toBeInTheDocument();
    expect(screen.getByText('通过标准 · FRiP: >=0.01')).toBeInTheDocument();
    expect(screen.queryByText('从断点继续')).not.toBeInTheDocument();
    expect(screen.getByTestId('workflow-qc-notice')).toHaveClass('border-red-500/40');
  });
  it('shows amber warnings without implying QC failure; passed/missing QC has no alarm', () => {
    const view = render(<WorkflowQcNotice run={run('warn')} />);
    expect(screen.getByRole('alert')).toHaveTextContent('质控警告');
    expect(screen.queryByText(/自动推进已暂停/)).not.toBeInTheDocument();
    expect(screen.getByTestId('workflow-qc-notice')).toHaveClass('border-amber-500/40');
    view.rerender(<WorkflowQcNotice run={run('pass')} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    view.rerender(<WorkflowQcNotice run={{ ...run(), steps: [] }} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('requires two explicit clicks and keeps reviewing logs/cancelling non-mutating', () => {
    const actions = callbacks();
    render(<RunItem run={run()} expanded={false} {...actions} />);
    fireEvent.click(screen.getByText('先检查质控日志'));
    expect(actions.onShowLog).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('仍要继续（不推荐）'));
    expect(actions.onResume).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('取消'));
    expect(actions.onResume).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('仍要继续（不推荐）'));
    fireEvent.click(screen.getByText('确认风险并继续'));
    expect(actions.onResume).toHaveBeenCalledExactlyOnceWith(true);
  });
  it('invalidates an open confirmation if the backend revision changed', () => {
    const actions = callbacks();
    const view = render(<RunItem run={run()} expanded={false} {...actions} />);
    fireEvent.click(screen.getByText('仍要继续（不推荐）'));
    expect(screen.getByText('确认风险并继续')).toBeInTheDocument();
    view.rerender(<RunItem run={{ ...run(), revision: 5 }} expanded={false} {...actions} />);
    expect(screen.queryByText('确认风险并继续')).not.toBeInTheDocument();
    expect(actions.onResume).not.toHaveBeenCalled();
  });
  it('retains the failed verdict and recommendation after a risk acknowledgement', () => {
    const acknowledged = run();
    acknowledged.steps![0].qcOverride = { approvedAt: 1000, revision: 4 };
    render(<RunItem run={acknowledged} expanded={false} {...callbacks()} />);
    expect(screen.getByRole('alert')).toHaveTextContent('QC fail');
    expect(screen.getByRole('alert')).toHaveTextContent('这不代表质控通过');
    expect(screen.getByRole('alert')).toHaveTextContent('质控仍未通过');
    expect(screen.queryByText('仍要继续（不推荐）')).not.toBeInTheDocument();
  });
  it('translates interface copy inside protected chat content, not original scientific data', () => {
    render(<LocaleProvider><LanguageToggle /><div data-user-content="true"><RunItem run={run()} expanded={false} {...callbacks()} /></div></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(screen.getByRole('alert')).toHaveTextContent('QC failed: poor quality; downstream analysis is not recommended');
    expect(screen.getByText('Review the QC log first')).toBeInTheDocument();
    expect(screen.getByText('Continue anyway (not recommended)')).toBeInTheDocument();
    expect(screen.getByText('Acceptance criterion · FRiP: >=0.01')).toBeInTheDocument();
    expect(screen.getByText('样本_01')).toBeInTheDocument();
    expect(screen.getByText('原始日志：FRiP=0.005')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '切换到中文' }));
    expect(screen.getByRole('alert')).toHaveTextContent('质量不佳，不建议继续下游分析');
  });
});
