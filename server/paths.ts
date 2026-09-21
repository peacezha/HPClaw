import fs from 'fs';
import path from 'path';

function resolveRoot(value: string | undefined, fallback: string): string {
  return path.resolve(value || fallback);
}

export const APP_ROOT = resolveRoot(process.env.HPCLAW_APP_ROOT, process.cwd());
export const STATIC_ROOT = resolveRoot(process.env.HPCLAW_STATIC_ROOT, APP_ROOT);
export const DATA_ROOT = resolveRoot(process.env.HPCLAW_DATA_ROOT, APP_ROOT);

export function appPath(...segments: string[]): string {
  return path.join(APP_ROOT, ...segments);
}

export function staticPath(...segments: string[]): string {
  return path.join(STATIC_ROOT, ...segments);
}

export function dataPath(...segments: string[]): string {
  return path.join(DATA_ROOT, ...segments);
}

export function ensureDir(dir: string): string {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
