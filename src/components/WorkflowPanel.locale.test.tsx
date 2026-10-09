// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import WorkflowPanel from './WorkflowPanel';
import { LanguageToggle, LocaleProvider } from '../i18n';
import { listWorkflows, updateWorkflow } from '../features/workflows/api';
import type { Workflow } from '@/shared/workflow';

vi.mock('../features/workflows/api', async () => ({
  ...await vi.importActual('../features/workflows/api'),
  listWorkflows: vi.fn(), updateWorkflow: vi.fn(async () => ({})),
}));
afterEach(() => { cleanup(); window.localStorage.clear(); vi.clearAllMocks(); });
const workflow: Workflow = {
  id: 'encode-chipseq-tf', name: 'ENCODE 转录因子 ChIP-seq 分析与质控流程（中文版）', description: '只读检查，不修改任何数据；任一必需软件缺失时停止后续步骤，先补齐环境。',
  category: '转录组与表观调控', keywords: ['ChIP-seq', '转录因子'], source: 'builtin', createdAt: 0, updatedAt: 0,
  params: [{ name: 'THREADS', label: '线程数', defaultValue: '10', type: 'number', help: '每个计算步骤默认线程数' }],
  steps: [{ title: 'MACS2 窄峰调用', command: 'macs2 callpeak -g {{GENOME_SIZE}} # 中文脚本注释', notes: '使用 Input/IgG 文库估计背景；候选峰供后续 FRiP 与 IDR 评估。' }],
  manifest: { software: [], references: [], inputHint: 'FASTQ', qcGates: [{ afterStep: 1, metric: '链交叉相关性与文库复杂度', pass: 'NSC≥1.05、RSC≥0.8、NRF≥0.8', warn: '任一关键指标低于阈值时标记文库质控失败' }] },
};

describe('workflow display language', () => {
  it('translates built-in details and editor values but saves the original commands and metadata', async () => {
    vi.mocked(listWorkflows).mockResolvedValue([structuredClone(workflow)]);
    render(<LocaleProvider><LanguageToggle /><WorkflowPanel onUseWorkflow={vi.fn()} onOpenRunner={vi.fn()} aiProfile={{ provider: 'openai', model: 'test', apiKey: '' }} /></LocaleProvider>);
    await screen.findByText(workflow.name);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    fireEvent.click(await screen.findByText('ENCODE TF ChIP-seq Analysis and QC (Chinese template)'));
    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }));
    expect(screen.getByDisplayValue('Narrow-peak calling with MACS2')).toBeTruthy();
    expect(screen.getByDisplayValue('Threads')).toBeTruthy();
    expect(screen.getByDisplayValue('ChIP-seq, Transcription factor')).toBeTruthy();
    expect(screen.getByDisplayValue('NSC≥1.05, RSC≥0.8, NRF≥0.8')).toBeTruthy();
    expect(screen.getByDisplayValue(workflow.steps[0].command)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '切换到中文' }));
    expect(screen.getByDisplayValue('MACS2 窄峰调用')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save workflow' }));
    await waitFor(() => expect(updateWorkflow).toHaveBeenCalled());
    expect(vi.mocked(updateWorkflow).mock.calls[0][1]).toMatchObject({ name: workflow.name, description: workflow.description, params: workflow.params, steps: workflow.steps, keywords: workflow.keywords, manifest: workflow.manifest });
  });
});
