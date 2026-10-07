import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { configureWebRuntime } from './web-runtime-config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('HPClaw web requires Node.js 22 or newer');
const { credentialsFile } = configureWebRuntime(root);
console.log('[HPClaw web] Single-user server workspace. Access credentials:', credentialsFile);
console.log('[HPClaw web] Keep the data directory backed up; it contains encryption keys and conversations.');
await import(pathToFileURL(path.join(root, 'dist-electron', 'server.cjs')).href);
