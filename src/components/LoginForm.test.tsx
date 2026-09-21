// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { LocaleProvider } from '../i18n';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function renderForm(onLogin = vi.fn(async () => null as string | null)) {
  const utils = render(
    <LocaleProvider>
      <LoginForm onLogin={onLogin} isLoggingIn={false} loginError="" embedded onCancel={() => {}} />
    </LocaleProvider>,
  );
  return { onLogin, ...utils };
}

describe('LoginForm 验证码选填', () => {
  it('验证码明确标注选填，占位提示可留空', () => {
    renderForm();
    expect(screen.getByText('连接计算资源')).toBeInTheDocument();
    expect(screen.getByText('（选填）')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('服务器无二次验证可留空')).toBeInTheDocument();
  });

  it('验证码留空也能正常提交', async () => {
    const { onLogin, container } = renderForm();
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => expect(onLogin).toHaveBeenCalled());
    expect(onLogin).toHaveBeenCalledWith(expect.objectContaining({ verificationCode: '' }));
  });
});
