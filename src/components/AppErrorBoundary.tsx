import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AppErrorBoundaryState {
  error: Error | null;
}

export default class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ui] React render failure:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="min-h-screen bg-scholar-950 text-scholar-50 flex items-center justify-center p-6 font-sans">
        <section className="w-full max-w-xl rounded-lg border border-scholar-700 bg-scholar-900 p-6 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[var(--color-warn)] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h1 className="text-lg font-semibold">界面遇到异常，但后台任务仍在运行</h1>
              <p className="mt-2 text-sm text-scholar-300">
                点击“重新加载界面”即可恢复。已经提交到计算资源的作业不会因此停止。
              </p>
              <pre className="mt-3 max-h-32 overflow-auto rounded-lg bg-scholar-950 p-3 text-xs text-scholar-300 whitespace-pre-wrap break-words">
                {this.state.error.message || String(this.state.error)}
              </pre>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-primary mt-4"
              >
                <RefreshCw className="w-4 h-4" /> 重新加载界面
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }
}
