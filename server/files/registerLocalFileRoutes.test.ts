import http from 'node:http';
import express from 'express';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { registerLocalFileRoutes } from './registerLocalFileRoutes';

const servers: http.Server[] = [];
const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve()))));
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

async function startRoutes(dataRoot: string) {
  const app = express();
  app.use(express.json());
  registerLocalFileRoutes(app, { dataRoot });
  const server = http.createServer(app);
  servers.push(server);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not bind');
  return `http://127.0.0.1:${address.port}`;
}

function post(baseUrl: string, urlPath: string, body: unknown) {
  return fetch(`${baseUrl}${urlPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** 在 DATA_ROOT 下布置 vision toolkit 的产物文件，返回文件绝对路径 */
function seedVisionArtifact(dataRoot: string, name = 'R16_D_view.png', bytes = Buffer.from('png-bytes')) {
  const absolute = path.join(dataRoot, '.dsh-vision-toolkit', 'artifacts', name);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, bytes);
  return absolute;
}

describe('local file routes', () => {
  it('reads a dot-relative dsh artifact path (form 1)', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    seedVisionArtifact(dataRoot);
    const baseUrl = await startRoutes(dataRoot);

    const response = await post(baseUrl, '/api/local/files/read', {
      path: '.dsh-vision-toolkit/artifacts/R16_D_view.png',
    });

    expect(response.status).toBe(200);
    const body = await response.json() as { filePath: string; content: string; metadata: { size: number; mime: string } };
    expect(body.filePath).toBe('.dsh-vision-toolkit/artifacts/R16_D_view.png');
    expect(Buffer.from(body.content, 'base64').toString()).toBe('png-bytes');
    expect(body.metadata).toEqual({ size: 9, mime: 'image/png' });
  });

  it('reads a unix-ized cwd-relative path via the stripped and suffix fallbacks (form 2)', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    seedVisionArtifact(dataRoot);
    const baseUrl = await startRoutes(dataRoot);

    // 模型把 .dsh-vision-toolkit/artifacts/x.png 写成 /artifacts/x.png：剥 / 探测 + 后缀搜索
    const response = await post(baseUrl, '/api/local/files/read', { path: '/artifacts/R16_D_view.png' });
    expect(response.status).toBe(200);
    const body = await response.json() as { metadata: { mime: string } };
    expect(body.metadata.mime).toBe('image/png');

    // 剥 / 后直接命中的形态也应可读
    const direct = path.join(dataRoot, 'artifacts', 'plain.png');
    fs.mkdirSync(path.dirname(direct), { recursive: true });
    fs.writeFileSync(direct, 'plain');
    const directResponse = await post(baseUrl, '/api/local/files/read', { path: '/artifacts/plain.png' });
    expect(directResponse.status).toBe(200);
  });

  it('reads an absolute path under DATA_ROOT (form 3) and forbids paths outside the roots', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    const absolute = seedVisionArtifact(dataRoot);
    const baseUrl = await startRoutes(dataRoot);

    const response = await post(baseUrl, '/api/local/files/read', { path: absolute });
    expect(response.status).toBe(200);

    const outsideDir = makeTempDir('hpclaw-local-outside-');
    const outsideFile = path.join(outsideDir, 'secret.png');
    fs.writeFileSync(outsideFile, 'secret');
    const forbidden = await post(baseUrl, '/api/local/files/read', { path: outsideFile });
    expect(forbidden.status).toBe(403);
    await expect(forbidden.json()).resolves.toMatchObject({ error: { code: 'LOCAL_FILE_OUTSIDE_ROOTS' } });
  });

  it('treats the workspace as an additional allowed root only when provided', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    const workspace = makeTempDir('hpclaw-local-workspace-');
    const workspaceFile = path.join(workspace, 'out', 'result.csv');
    fs.mkdirSync(path.dirname(workspaceFile), { recursive: true });
    fs.writeFileSync(workspaceFile, 'a,b\n1,2');
    const baseUrl = await startRoutes(dataRoot);

    const withoutWorkspace = await post(baseUrl, '/api/local/files/read', { path: workspaceFile });
    expect(withoutWorkspace.status).toBe(403);

    const withWorkspace = await post(baseUrl, '/api/local/files/read', { path: workspaceFile, workspace });
    expect(withWorkspace.status).toBe(200);
    const body = await withWorkspace.json() as { content: string; metadata: { mime: string } };
    expect(body.content).toBe('a,b\n1,2');
    expect(body.metadata.mime).toBe('text/csv');

    // 相对路径也会在工作区内探测
    const relative = await post(baseUrl, '/api/local/files/read', { path: 'out/result.csv', workspace });
    expect(relative.status).toBe(200);
  });

  it('rejects symlink/junction escapes from inside a root', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    const outsideDir = makeTempDir('hpclaw-local-outside-');
    const outsideFile = path.join(outsideDir, 'secret.txt');
    fs.writeFileSync(outsideFile, 'secret');
    const linkPath = path.join(dataRoot, 'escape-link');
    fs.symlinkSync(outsideDir, linkPath, process.platform === 'win32' ? 'junction' : 'dir');
    const baseUrl = await startRoutes(dataRoot);

    const response = await post(baseUrl, '/api/local/files/read', { path: path.join(linkPath, 'secret.txt') });
    expect(response.status).toBe(403);
  });

  it('returns 400 for directories and missing path fields', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    fs.mkdirSync(path.join(dataRoot, 'adir'));
    const baseUrl = await startRoutes(dataRoot);

    const directory = await post(baseUrl, '/api/local/files/read', { path: 'adir' });
    expect(directory.status).toBe(400);
    await expect(directory.json()).resolves.toMatchObject({ error: { code: 'LOCAL_FILE_IS_DIRECTORY' } });

    const missing = await post(baseUrl, '/api/local/files/read', {});
    expect(missing.status).toBe(400);
  });

  it('returns 404 for files that do not exist inside any allowed root', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    const baseUrl = await startRoutes(dataRoot);

    const response = await post(baseUrl, '/api/local/files/read', { path: '.dsh-vision-toolkit/artifacts/missing.png' });
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({ error: { code: 'LOCAL_FILE_NOT_FOUND' } });
  });

  it('returns 413 for oversized files and 415 for unsupported formats', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    fs.writeFileSync(path.join(dataRoot, 'big.csv'), Buffer.alloc(10 * 1024 * 1024 + 1, 65));
    fs.writeFileSync(path.join(dataRoot, 'pack.zip'), 'zip');
    const baseUrl = await startRoutes(dataRoot);

    const oversized = await post(baseUrl, '/api/local/files/read', { path: 'big.csv' });
    expect(oversized.status).toBe(413);

    const unsupported = await post(baseUrl, '/api/local/files/read', { path: 'pack.zip' });
    expect(unsupported.status).toBe(415);
  });

  it('omits per-file failures from /api/local/files/read/batch results', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    fs.writeFileSync(path.join(dataRoot, 'ok.txt'), 'ok');
    const baseUrl = await startRoutes(dataRoot);

    const response = await post(baseUrl, '/api/local/files/read/batch', {
      paths: ['ok.txt', 'missing.txt', path.join(os.tmpdir(), 'outside.txt')],
    });
    expect(response.status).toBe(200);
    const body = await response.json() as { filePath: string }[];
    expect(body).toHaveLength(1);
    expect(body[0].filePath).toBe('ok.txt');

    const malformed = await post(baseUrl, '/api/local/files/read/batch', { paths: [] });
    expect(malformed.status).toBe(400);
  });

  it('streams /api/local/files/view with detected Content-Type and cache header', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    seedVisionArtifact(dataRoot);
    fs.writeFileSync(path.join(dataRoot, 'notes.txt'), 'hello');
    const baseUrl = await startRoutes(dataRoot);

    const image = await fetch(`${baseUrl}/api/local/files/view?path=${encodeURIComponent('.dsh-vision-toolkit/artifacts/R16_D_view.png')}`);
    expect(image.status).toBe(200);
    expect(image.headers.get('content-type')).toBe('image/png');
    expect(image.headers.get('cache-control')).toBe('private, max-age=30');
    expect(await image.text()).toBe('png-bytes');

    const text = await fetch(`${baseUrl}/api/local/files/view?path=notes.txt`);
    expect(text.status).toBe(200);
    expect(text.headers.get('content-type')).toBe('text/plain; charset=utf-8');

    const outsideDir = makeTempDir('hpclaw-local-outside-');
    const outsideFile = path.join(outsideDir, 'secret.png');
    fs.writeFileSync(outsideFile, 'secret');
    const forbidden = await fetch(`${baseUrl}/api/local/files/view?path=${encodeURIComponent(outsideFile)}`);
    expect(forbidden.status).toBe(403);

    const oversized = path.join(dataRoot, 'big.png');
    fs.writeFileSync(oversized, Buffer.alloc(25 * 1024 * 1024 + 1, 66));
    const tooLarge = await fetch(`${baseUrl}/api/local/files/view?path=big.png`);
    expect(tooLarge.status).toBe(413);
  });

  it('passes the workspace through /api/local/files/view for root probing', async () => {
    const dataRoot = makeTempDir('hpclaw-local-root-');
    const workspace = makeTempDir('hpclaw-local-workspace-');
    fs.writeFileSync(path.join(workspace, 'plot.png'), 'plot-bytes');
    const baseUrl = await startRoutes(dataRoot);

    const url = `${baseUrl}/api/local/files/view?path=${encodeURIComponent(path.join(workspace, 'plot.png'))}`;
    const forbidden = await fetch(url);
    expect(forbidden.status).toBe(403);

    const allowed = await fetch(`${url}&workspace=${encodeURIComponent(workspace)}`);
    expect(allowed.status).toBe(200);
    expect(await allowed.text()).toBe('plot-bytes');
  });
});
