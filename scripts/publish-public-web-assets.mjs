import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';
const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error('Missing GitHub token');
const directory = path.resolve(process.argv[2] || 'public-web-artifacts');
const names = ['HPClaw-0.4.41-public-web-linux-x64-node20.tar.gz', 'HPClaw-0.4.41-public-web-linux-x64-node20.tar.gz.sha256'];
const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'hpclaw-public-web-release', 'X-GitHub-Api-Version': '2022-11-28' };
const base = 'https://api.github.com/repos/peacezha/HPClaw/releases';
const response = await fetch(base + '/tags/v0.4.41', { headers });
if (!response.ok) throw new Error('Existing release unavailable: ' + response.status);
const release = await response.json();
for (const name of names) {
  const file = path.join(directory, name);
  const size = fs.statSync(file).size;
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const existing = release.assets.find(asset => asset.name === name);
  if (existing) {
    if (existing.size === size && existing.digest === `sha256:${hash}`) continue;
    throw new Error('Refusing to replace an existing different asset: ' + name);
  }
  const upload = await fetch(release.upload_url.replace(/\{.*$/, '') + '?name=' + encodeURIComponent(name), {
    method: 'POST', headers: { ...headers, 'Content-Type': 'application/octet-stream', 'Content-Length': String(size) },
    body: Readable.toWeb(fs.createReadStream(file)), duplex: 'half',
  });
  if (!upload.ok) throw new Error('Upload failed: ' + upload.status);
  const asset = await upload.json();
  if (asset.state !== 'uploaded' || asset.size !== size || asset.digest !== `sha256:${hash}`) throw new Error('Uploaded checksum mismatch');
  console.log('Uploaded and checksum verified:', name, size);
}
const heading = '## 公共网页 Node.js 20 兼容更新';
if (!release.body?.includes(heading)) {
  const body = (release.body || '') + '\n\n' + heading + '\n\n'
    + '- 新包：HPClaw-0.4.41-public-web-linux-x64-node20.tar.gz。最低 Node.js 20.19.5，仍支持 Node.js 22。原公共包要求 Node.js 22，已保留，请选带 node20 的新包。\n'
    + '- 解压后运行 `npm ci --omit=dev --ignore-scripts`，再 `npm start -- --url https://你的域名`。公网须配置 HTTPS 反向代理。\n'
    + '- [公共网页部署说明](https://github.com/peacezha/HPClaw/blob/main/docs/PUBLIC_WEB_DEPLOYMENT.md)。旧 web-linux-x64 包是单用户版，不能移除口令后直接公开。\n'
    + '- 保留经典 v0.4.41 界面、多用户隔离与集群数据存储；Windows/Mac 安装包、旧网页包和更新索引均不替换。Node.js 20 已结束官方维护，长期公网部署建议使用受支持的 LTS。\n';
  const updated = await fetch(base + '/' + release.id, { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ body }) });
  if (!updated.ok) throw new Error('Release notes update failed: ' + updated.status);
}
console.log('Public web assets published:', release.html_url);
