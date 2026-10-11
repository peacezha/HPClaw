// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import WorkflowCatalogActionDialog from './WorkflowCatalogActionDialog';
import { LanguageToggle, LocaleProvider } from '../i18n';
import { deleteWorkflow, setWorkflowLifecycle } from '../features/workflows/api';
import type { Workflow } from '@/shared/workflow';

vi.mock('../features/workflows/api', () => ({ deleteWorkflow: vi.fn(async () => {}), setWorkflowLifecycle: vi.fn(async () => ({})) }));
afterEach(() => { cleanup(); vi.resetAllMocks(); window.localStorage.clear(); });
const workflow: Workflow = { id: 'builtin', name: 'Scientific/path', description: '', keywords: [], params: [], steps: [], source: 'builtin', createdAt: 1, updatedAt: 1 };
describe('workflow definition confirmation', () => {
  it('requires an explicit app-owned confirmation; cancellation never deletes', () => {
    const close = vi.fn();
    render(<WorkflowCatalogActionDialog action={{ workflow, kind: 'delete' }} onClose={close} onDone={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('button', { name: '取消' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(close).toHaveBeenCalledOnce(); expect(deleteWorkflow).not.toHaveBeenCalled();
  });
  it('keeps failures visible and prevents double-click deletion', async () => {
    let reject!: (error: Error) => void;
    vi.mocked(deleteWorkflow).mockImplementationOnce(() => new Promise((_resolve, fail) => { reject = fail; }));
    const done = vi.fn();
    render(<WorkflowCatalogActionDialog action={{ workflow, kind: 'delete' }} onClose={vi.fn()} onDone={done} />);
    const confirm = screen.getByRole('button', { name: '确认删除定义' });
    fireEvent.click(confirm); fireEvent.click(confirm);
    expect(deleteWorkflow).toHaveBeenCalledTimes(1);
    reject(new Error('Cannot save definition backup'));
    await screen.findByRole('alert'); expect(done).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '确认删除定义' })).not.toBeDisabled();
  });
  it('changes UI language without rewriting scientific name or reason', async () => {
    render(<LocaleProvider><LanguageToggle /><WorkflowCatalogActionDialog action={{ workflow, kind: 'archive' }} onClose={vi.fn()} onDone={vi.fn()} /></LocaleProvider>);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'JmJ21 /public/data' } });
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(screen.getByRole('heading', { name: 'Move to pending disposal' })).toBeTruthy();
    expect(screen.getByDisplayValue('JmJ21 /public/data')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm move' }));
    await waitFor(() => expect(setWorkflowLifecycle).toHaveBeenCalledWith('builtin', 'pending_disposal', 'JmJ21 /public/data'));
  });
});
