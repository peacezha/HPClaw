// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import WorkflowPanel from './WorkflowPanel';
import { LanguageToggle, LocaleProvider } from '../i18n';
import { deleteWorkflow, listWorkflows, setWorkflowLifecycle } from '../features/workflows/api';
import type { Workflow } from '@/shared/workflow';

vi.mock('../features/workflows/api', async () => ({ ...await vi.importActual('../features/workflows/api'), listWorkflows: vi.fn(), deleteWorkflow: vi.fn(async () => {}), setWorkflowLifecycle: vi.fn(async () => ({})) }));
afterEach(() => { cleanup(); vi.resetAllMocks(); window.localStorage.clear(); });
const wf = (id: string, rest: Partial<Workflow> = {}): Workflow => ({ id, name: id, description: '', keywords: [], params: [], steps: [{ title: 'step', command: 'echo hi' }], source: 'builtin', createdAt: 1, updatedAt: 1, ...rest });
const rows = [wf('keep'), wf('discard', { lifecycle: { state: 'pending_disposal', origin: 'automatic', reasonCode: 'incomplete_paper', updatedAt: 1 } })];
const setup = () => render(<LocaleProvider><LanguageToggle /><WorkflowPanel onUseWorkflow={vi.fn()} onOpenRunner={vi.fn()} aiProfile={{ provider: 'test', model: 'test', apiKey: '' }} /></LocaleProvider>);
describe('workflow catalogue sections', () => {
  it('separates active and pending workflows and provides reasons and restoration', async () => {
    vi.mocked(listWorkflows).mockResolvedValue(rows); setup();
    await screen.findByText('keep'); expect(screen.queryByText('discard')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /待弃置 \(1\)/ }));
    await screen.findByText('discard'); expect(screen.queryByText('keep')).toBeNull();
    expect(screen.getByText(/文献审计为不足/)).toBeTruthy();
    expect(screen.getByRole('button', { name: '运行' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: '恢复到正式流程' }));
    await waitFor(() => expect(setWorkflowLifecycle).toHaveBeenCalledWith('discard', 'active'));
  });
  it('allows deletion of built-ins without native window.confirm', async () => {
    const native = vi.spyOn(window, 'confirm');
    vi.mocked(listWorkflows).mockResolvedValue(rows); setup(); await screen.findByText('keep');
    fireEvent.click(screen.getByRole('button', { name: '删除' }));
    expect(screen.getByRole('dialog')).toBeTruthy(); expect(deleteWorkflow).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: '确认删除定义' }));
    await waitFor(() => expect(deleteWorkflow).toHaveBeenCalledWith('keep'));
    expect(native).not.toHaveBeenCalled(); native.mockRestore();
  });
  it('translates sections and automatic reasons in English', async () => {
    vi.mocked(listWorkflows).mockResolvedValue(rows); setup(); await screen.findByText('keep');
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    fireEvent.click(screen.getByRole('button', { name: /Pending disposal \(1\)/ }));
    await screen.findByText('discard');
    expect(screen.getByText(/The literature audit is insufficient/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Restore to saved workflows' })).toBeTruthy();
  });
});
