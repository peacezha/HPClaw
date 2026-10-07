import { build } from 'esbuild';
import { rm } from 'fs/promises';

const arguments_ = process.argv.slice(2);
if (arguments_.some(argument => argument !== '--public-web')) throw new Error('Unknown build option');
// Only the public npm build lowers the target; desktop/private packages stay unchanged.
const target = arguments_.includes('--public-web') ? 'node20.19' : 'node22';
await rm('dist-electron', { recursive: true, force: true });

await build({
  entryPoints: ['server.ts'],
  outfile: 'dist-electron/server.cjs',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target,
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

await build({
  entryPoints: ['server/publicWeb/main.ts'], outfile: 'dist-electron/public-web.cjs',
  bundle: true, platform: 'node', format: 'cjs', target,
  external: ['ssh2', 'cpu-features', '*.node'],
  define: { 'process.env.NODE_ENV': '"production"' },
});
