// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LanguageToggle, LocaleProvider, getStoredLocale, translateUiText } from './index';

afterEach(cleanup);

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
});
