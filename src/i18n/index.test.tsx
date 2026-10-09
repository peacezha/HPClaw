// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LanguageToggle, LocaleProvider, getStoredLocale, hydrateDesktopLocale, translateUiText } from './index';
import { BIOINFORMATICS_PHRASES } from './bioinformatics';

afterEach(() => { cleanup(); delete window.hpclawDesktop; });

describe('global bilingual UI', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = '';
    document.documentElement.removeAttribute('data-language');
  });

  it('uses Chinese by default and translates existing English interface copy', () => {
    render(
      <LocaleProvider>
        <LanguageToggle />
        <div>
          <span>Login</span>
          <label>Compute Resource IP</label>
          <input placeholder="Search skills..." />
        </div>
      </LocaleProvider>,
    );

    expect(screen.getByText('登录')).toBeTruthy();
    expect(screen.getByText('计算资源 IP')).toBeTruthy();
    expect(screen.getByPlaceholderText('搜索技能...')).toBeTruthy();
    expect(getStoredLocale()).toBe('zh-CN');
    expect(document.documentElement.lang).toBe('zh-CN');
  });

  it('switches the complete interface to English and remembers the choice', async () => {
    render(
      <LocaleProvider>
        <LanguageToggle />
        <div title="打开文件传输工作区">
          <span>文件传输</span>
          <input aria-label="搜索文件" placeholder="输入搜索关键词..." />
        </div>
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));

    await waitFor(() => expect(screen.getByText('File Transfer')).toBeTruthy());
    expect(screen.getByTitle('Open File Transfer Workspace')).toBeTruthy();
    expect(screen.getByLabelText('Search files')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter search terms…')).toBeTruthy();
    expect(window.localStorage.getItem('hpclaw_language')).toBe('en-US');
    expect(document.documentElement.lang).toBe('en-US');
    expect(screen.getByRole('button', { name: '切换到中文' })).toBeTruthy();
  });

  it('keeps commands, paths, filenames and user content unchanged', async () => {
    render(
      <LocaleProvider>
        <LanguageToggle />
        <div data-user-content="true">文件传输 /data/样本_01.fastq.gz module load fastqc</div>
        <code>echo 中文原始内容</code>
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));

    await waitFor(() => expect(document.documentElement.lang).toBe('en-US'));
    expect(screen.getByText('文件传输 /data/样本_01.fastq.gz module load fastqc')).toBeTruthy();
    expect(screen.getByText('echo 中文原始内容')).toBeTruthy();
  });

  it('translates dynamic UI fragments in both directions', () => {
    expect(translateUiText('确定要删除 3 个项目吗？', 'en-US')).toBe('Delete 3 item(s)?');
    expect(translateUiText('AI request timed out or was interrupted. Click retry.', 'zh-CN'))
      .toBe('AI 请求超时或连接中断，可点击重试');
  });

  it('never translates substrings in brands, domain terms or arbitrary prose', () => {
    for (const source of ['ChatGPT (OpenAI)', 'OpenAI-compatible API', 'ChIP-seq / DAP-seq / ATAC-seq', 'TSS enrichment, SPOT, FRiP, IDR, bigWig, deepTools', 'Open report_sample.html', '用户的文件传输流程 /data/样本.bw']) {
      expect(translateUiText(source, 'zh-CN')).toBe(source);
      expect(translateUiText(source, 'en-US')).toBe(source);
    }
  });

  it('preserves user titles even when they match a UI phrase', async () => {
    render(<LocaleProvider><LanguageToggle /><p data-user-content="true">文件传输</p><span>保存设置</span></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    await waitFor(() => expect(screen.getByText('Save settings')).toBeTruthy());
    expect(screen.getByText('文件传输')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '切换到中文' }));
    await waitFor(() => expect(screen.getByText('保存设置')).toBeTruthy());
  });

  it('hydrates the Windows installer choice and persists an explicit in-app switch', async () => {
    const set = vi.fn(async () => 'zh-CN' as const);
    window.hpclawDesktop = { locale: { get: async () => 'en-US', set } } as any;
    await hydrateDesktopLocale();
    render(<LocaleProvider><LanguageToggle /><span>正式流程</span></LocaleProvider>);
    expect(screen.getByText('Saved workflows')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '切换到中文' }));
    expect(set).toHaveBeenCalledWith('zh-CN');
    await waitFor(() => expect(screen.getByText('正式流程')).toBeTruthy());
  });

  it('uses professional scientific terms without rewriting metric names or evidence', () => {
    for (const [zh, en] of BIOINFORMATICS_PHRASES) expect(translateUiText(zh, 'en-US')).toBe(en);
    expect(translateUiText('基序富集', 'en-US')).toBe('Motif enrichment');
    expect(translateUiText('有效基因组大小', 'en-US')).toBe('Effective genome size');
    expect(translateUiText('3 个步骤 · 12 条命令 · 3 次工具调用', 'en-US')).toBe('3 steps · 12 commands · 3 tool calls');
    expect(translateUiText('转录组与表观调控（27）', 'en-US')).toBe('Transcriptomics & Epigenomic Regulation (27)');
  });

  it('round-trips interface copy from its original source, not an ambiguous reverse lookup', async () => {
    render(<LocaleProvider><LanguageToggle /><span>必填</span><span>必需</span></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    await waitFor(() => expect(screen.getAllByText('Required')).toHaveLength(2));
    fireEvent.click(screen.getByRole('button', { name: '切换到中文' }));
    await waitFor(() => expect(screen.getByText('必填')).toBeTruthy());
    expect(screen.getByText('必需')).toBeTruthy();
  });

  it('translates textarea interface labels while keeping the user-entered value verbatim', async () => {
    render(<LocaleProvider><LanguageToggle /><textarea placeholder="输入任务描述..." defaultValue="质控 /data/样本.fq.gz" /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    await waitFor(() => expect(screen.getByPlaceholderText('Describe a task…')).toBeTruthy());
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('质控 /data/样本.fq.gz');
  });
});
