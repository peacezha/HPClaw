import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ mode }) => {
  const pageTitle = mode === 'competition' ? 'HPClaw 竞赛版' : 'HPClaw';
  return {
    plugins: [
      {
        name: 'hpclaw-edition-title',
        transformIndexHtml(html) {
          return html.replace('<title>HPClaw</title>', `<title>${pageTitle}</title>`);
        },
      },
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    test: {
      setupFiles: ['./src/test-setup.ts'],
      // Packaged releases contain a copy of the source tree. Never execute the
      // same tests twice from release/resources/app/electron.
      exclude: ['**/node_modules/**', '**/dist/**', '**/dist-electron/**', '**/release/**'],
    },
    server: {
      // Disable HMR for remote Linux deployment; reconnect/reload can abort AI streams.
      hmr: false,
      allowedHosts: ['yan-lab.hzau.edu.cn', 'localhost', '127.0.0.1'],
      port: 3003,
    },
  };
});
