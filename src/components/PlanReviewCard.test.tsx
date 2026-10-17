// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import PlanReviewCard from './PlanReviewCard';
import type { PendingPlanReview } from '../services/usePlanReviews';

afterEach(cleanup);

const review: PendingPlanReview = {
  id: 'pr-1',
  goal: '质控并比对',
  steps: [
    { title: '运行 FastQC', verification: '生成 fastqc.html' },
    { title: '提交 bwa 比对作业', verification: '调度器返回 Job ID' },
  ],
};

function renderCard(onDecide = vi.fn(async () => {})) {
  render(<PlanReviewCard review={review} english={false} busy={false} error="" onDecide={onDecide} />);
  return onDecide;
}

describe('PlanReviewCard', () => {
  it('renders the goal and every step with editable text', () => {
    renderCard();
    expect(screen.getByTestId('plan-review-card')).toBeTruthy();
    expect(screen.getByText(/目标：质控并比对/)).toBeTruthy();
    expect(screen.getByLabelText('步骤 1 标题')).toHaveProperty('value', '运行 FastQC');
    expect(screen.getByLabelText('步骤 2 验证方法')).toHaveProperty('value', '调度器返回 Job ID');
  });

  it('approves without edits as plain approve', async () => {
    const onDecide = renderCard();
    fireEvent.click(screen.getByRole('button', { name: '批准计划' }));
    expect(onDecide).toHaveBeenCalledWith('pr-1', 'approve');
  });

  it('sends edited steps as an edit approval', async () => {
    const onDecide = renderCard();
    fireEvent.change(screen.getByLabelText('步骤 2 标题'), { target: { value: '改用 bowtie2 提交作业' } });
    fireEvent.click(screen.getByRole('button', { name: '批准修改后的计划' }));
    expect(onDecide).toHaveBeenCalledWith('pr-1', 'edit', [
      { title: '运行 FastQC', verification: '生成 fastqc.html' },
      { title: '改用 bowtie2 提交作业', verification: '调度器返回 Job ID' },
    ]);
  });

  it('cancels the plan and blocks approval when a step is emptied', async () => {
    const onDecide = renderCard();
    fireEvent.change(screen.getByLabelText('步骤 1 标题'), { target: { value: ' ' } });
    expect(screen.getByRole('button', { name: '批准修改后的计划' })).toHaveProperty('disabled', true);
    fireEvent.click(screen.getByRole('button', { name: '取消计划' }));
    expect(onDecide).toHaveBeenCalledWith('pr-1', 'cancel');
  });
});
