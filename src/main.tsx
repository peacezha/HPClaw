import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AppErrorBoundary from './components/AppErrorBoundary';
import { LocaleProvider } from './i18n';
import { hydrateAIProfile } from './services/aiProfile';
import { hydrateTotpStorage } from './services/totpStorage';
import './index.css';

// 启动时先应用保存的主题，避免闪烁
document.documentElement.dataset.theme = localStorage.getItem('hpclaw_theme') === 'light' ? '' : 'dark';

function renderApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppErrorBoundary>
        <LocaleProvider>
          <App />
        </LocaleProvider>
      </AppErrorBoundary>
    </StrictMode>,
  );
}

window.addEventListener('error', event => {
  console.error('[ui] uncaught window error:', event.error || event.message);
});
window.addEventListener('unhandledrejection', event => {
  console.error('[ui] unhandled rejection:', event.reason);
});

// 首帧渲染前从桌面端加密存储水合密钥缓存。桌面 IPC 偶发无响应时
// 最多等待 4 秒，保证主界面始终能够出现，而不是无限停在空白页面。
const hydration = Promise.allSettled([hydrateAIProfile(), hydrateTotpStorage()]);
const hydrationTimeout = new Promise<'timeout'>(resolve => {
  window.setTimeout(() => resolve('timeout'), 4_000);
});

Promise.race([hydration, hydrationTimeout]).then(result => {
  if (result === 'timeout') console.warn('[ui] secure storage hydration timed out; rendering with safe defaults');
  renderApp();
});
