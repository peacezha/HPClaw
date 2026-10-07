import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('公共网页需要 Node.js 22 或更新版本');
process.env.HPCLAW_APP_ROOT = root;
const options = new Map([['--url', 'HPCLAW_WEB_ORIGIN'], ['--host', 'HPCLAW_HOST'], ['--port', 'PORT']]);
for (let index = 2; index < process.argv.length; index += 2) {
  const key = options.get(process.argv[index]);
  const value = process.argv[index + 1];
  if (!key || !value || value.startsWith('--')) throw new Error('用法：npm start -- --url https://你的域名 [--host 127.0.0.1] [--port 3003]');
  process.env[key] = value;
}
if (process.env.PORT && (!/^\d+$/.test(process.env.PORT) || Number(process.env.PORT) < 1 || Number(process.env.PORT) > 65535)) throw new Error('端口须为 1–65535');
await import(pathToFileURL(path.join(root, 'dist-electron/public-web.cjs')).href);
