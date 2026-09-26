// Publish HPClaw release to GitHub (peacezha/HPClaw).
// Token is read from the local git credential manager (never printed, never on argv).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OWNER = 'peacezha';
const REPO = 'HPClaw';
const TAG = process.env.HPCLAW_RELEASE_TAG || `v${JSON.parse(fs.readFileSync('package.json', 'utf8')).version}`;
const NAME = `HPClaw ${TAG}`;
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const UPLOAD = `https://uploads.github.com/repos/${OWNER}/${REPO}`;

const releaseDir = process.argv[2];
if (!releaseDir) throw new Error('usage: node publish-github-release.mjs <releaseDir>');
const artifacts = [
  { file: `HPClaw-Setup-${TAG.slice(1)}-x64.exe`, type: 'application/octet-stream' },
  { file: 'latest.yml', type: 'text/yaml' },
  { file: `HPClaw-Setup-${TAG.slice(1)}-x64.exe.blockmap`, type: 'application/octet-stream' },
];

function readToken() {
  const res = spawnSync('git', ['credential', 'fill'], {
    input: 'protocol=https\nhost=github.com\n\n',
    encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });
  const token = (res.stdout || '').split('\n').find(l => l.startsWith('password='))?.slice(9).trim();
  if (!token) throw new Error(`git credential fill 未返回 token: ${(res.stderr || '').slice(0, 200)}`);
  return token;
}

const TOKEN = readToken();
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'hpclaw-release-script',
};

async function apiJson(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* keep raw */ }
  return { status: res.status, json, text };
}

async function main() {
  const notesFile = process.env.HPCLAW_RELEASE_NOTES
    || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', `v${TAG.slice(1)}_更新说明.md`);
  let body = `HPClaw ${TAG} 更新。`;
    try { body = fs.readFileSync(notesFile, 'utf8').split('## 验证')[0].trim(); } catch { /* 无说明文件时用占位 */ }

  // 1) create or reuse release by tag
  let release;
  const existing = await apiJson(`${API}/releases/tags/${TAG}`);
  if (existing.status === 200) {
    release = existing.json;
    console.log('release exists:', release.html_url);
    // 复用时同步更新标题与正文（产物随后逐个替换）
    const patched = await apiJson(`${API}/releases/${release.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: NAME, body }),
    });
    if (patched.status !== 200) console.warn('warn: 更新 Release 正文失败', patched.status);
  } else {
    const created = await apiJson(`${API}/releases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag_name: TAG, target_commitish: 'main', name: NAME, body, draft: false, prerelease: false }),
    });
    if (created.status !== 201) throw new Error(`create release failed: ${created.status} ${created.text.slice(0, 400)}`);
    release = created.json;
    console.log('release created:', release.html_url);
  }

  // 2) upload artifacts (replace same-named assets)
  const existingAssets = new Map((release.assets || []).map(a => [a.name, a.id]));
  const uploadOne = async ({ file, type }) => {
    const full = path.join(releaseDir, file);
    const size = fs.statSync(full).size;
    const doUpload = async () => {
      const res = await fetch(`${UPLOAD}/releases/${release.id}/assets?name=${encodeURIComponent(file)}`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': type, 'Content-Length': String(size) },
        body: fs.createReadStream(full),
        duplex: 'half',
      });
      return { status: res.status, text: await res.text() };
    };
    let up = await doUpload();
    if (up.status === 422 && up.text.includes('already_exists')) {
      // 旧资产删除未生效（或刚被并发重建）：重新取资产列表再删一次后重试
      const fresh = await apiJson(`${API}/releases/${release.id}/assets?per_page=100`);
      const stale = (fresh.json || []).find(a => a.name === file);
      if (stale) {
        const del = await apiJson(`${API}/releases/assets/${stale.id}`, { method: 'DELETE' });
        console.log('delete stale asset retry:', file, del.status);
      }
      up = await doUpload();
    }
    if (up.status !== 201) throw new Error(`upload ${file} failed: ${up.status} ${up.text.slice(0, 400)}`);
    const asset = JSON.parse(up.text);
    console.log(`uploaded: ${asset.name} ${(asset.size / 1024 / 1024).toFixed(1)} MB state=${asset.state}`);
  };
  for (const artifact of artifacts) {
    const { file } = artifact;
    if (!fs.existsSync(path.join(releaseDir, file))) { console.log('skip missing:', file); continue; }
    const oldId = existingAssets.get(file);
    if (oldId) {
      const del = await apiJson(`${API}/releases/assets/${oldId}`, { method: 'DELETE' });
      console.log('delete old asset:', file, del.status);
    }
    await uploadOne(artifact);
  }

  // 3) verify release assets are publicly reachable
  const finalRel = await apiJson(`${API}/releases/tags/${TAG}`);
  const names = (finalRel.json?.assets || []).map(a => a.name);
  console.log('final assets:', names.join(', '));
  if (!names.includes('latest.yml')) throw new Error('latest.yml missing from release assets!');
  console.log('DONE', finalRel.json.html_url);
}

main().catch(err => { console.error('FAILED:', err.message); process.exit(1); });
