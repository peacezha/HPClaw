import { build } from 'esbuild';
import { rm } from 'fs/promises';

await rm('dist-electron', { recursive: true, force: true });

await build({
  entryPoints: ['server.ts'],
  outfile: 'dist-electron/server.cjs',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  sourcemap: false,
  external: [
    'ssh2',
    'cpu-features',
    '*.node',
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});
