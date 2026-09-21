// HPClaw v2 live test — 右键菜单位置 / 新建文件 / 整文件夹传输
const http = require('http');
const fs = require('fs');
const port = process.argv[2] || '9222';

const LOCAL_BASE = 'E:\\0612hpclaw\\hpclaw_v2\\tmp-folder-test';
const REMOTE_DIR = '/public/home/hpzhang';
const results = [];
const ok = (name, pass, detail = '') => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path }, res => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

(async () => {
  const list = await getJson('/json');
  const target = list.find(t => t.type === 'page' && !t.url.startsWith('devtools'));
  if (!target) throw new Error('no page target');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const i = ++id;
    pending.set(i, { resolve, reject });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    }
  };
  await new Promise(r => (ws.onopen = r));
  await send('Page.enable');
  const evalJs = async (expression) => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true,
    });
    if (exceptionDetails) throw new Error('renderer exception: ' + JSON.stringify(exceptionDetails.exception?.description || exceptionDetails.text));
    return result.value;
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const shot = async name => {
    const s = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(name, Buffer.from(s.data, 'base64'));
    console.log('saved:', name);
  };

  // ── 就绪 + 打开工作区 + 提取 sessionId ──────────────────────────────────
  for (let i = 0; i < 90; i++) {
    const ready = await evalJs(`!!document.querySelector('button[aria-label="打开 AI 助手"], button[aria-label="关闭 AI 助手"]')`).catch(() => false);
    if (ready) break;
    await sleep(1000);
  }
  await evalJs(`(() => { const b = document.querySelector('button[aria-label="文件传输"]'); if (b) b.click(); })()`);
  let sessionId = null;
  for (let i = 0; i < 30; i++) {
    sessionId = await evalJs(`(() => {
      const el = [...document.querySelectorAll('*')].find(e => /session:[0-9a-f-]{20,}/.test(e.textContent || '') && e.children.length === 0);
      const m = el && el.textContent.match(/session:([0-9a-f-]+)/);
      return m ? m[1] : null;
    })()`);
    if (sessionId) break;
    await sleep(1000);
  }
  if (!sessionId) { ok('获取 sessionId', false); process.exit(1); }
  console.log('session:', sessionId.slice(0, 8) + '…');

  const api = async (method, path, body) => {
    const expr = `(async () => {
      const r = await fetch('${path}', {
        method: '${method}',
        headers: { 'Content-Type': 'application/json', 'X-SSH-Session-Id': '${sessionId}' },
        ${body !== undefined ? `body: JSON.stringify(${JSON.stringify(body)}),` : ''}
      });
      const text = await r.text();
      let data; try { data = JSON.parse(text); } catch { data = text; }
      return { status: r.status, data };
    })()`;
    return evalJs(expr);
  };
  const waitTask = async (taskId, wantStates, timeoutMs = 30000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const { data } = await api('GET', '/api/transfers');
      const t = (data.transfers || []).find(t => t.id === taskId);
      if (t && wantStates.includes(t.state)) return t;
      await sleep(400);
    }
    return null;
  };

  // ── 1. 右键菜单位置（应在鼠标处）────────────────────────────────────────
  // 等远程 pane 列表加载，找第一行文件/目录触发 contextmenu，比对菜单坐标与点击点
  await sleep(3000);
  const menuCheck = await evalJs(`(async () => {
    const rows = document.querySelectorAll('[data-testid^="file-row-"]');
    if (!rows.length) return { error: 'no file rows' };
    const row = rows[0];
    const rect = row.getBoundingClientRect();
    const x = Math.round(rect.left + 60), y = Math.round(rect.top + rect.height / 2);
    row.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    await new Promise(r => setTimeout(r, 300));
    const menu = document.querySelector('[data-testid="context-menu"]');
    if (!menu) return { error: 'menu not found' };
    const mr = menu.getBoundingClientRect();
    return { clickX: x, clickY: y, menuX: Math.round(mr.left), menuY: Math.round(mr.top), inBody: menu.parentElement === document.body };
  })()`);
  const menuOk = menuCheck && !menuCheck.error
    && Math.abs(menuCheck.menuX - menuCheck.clickX) <= 4
    && Math.abs(menuCheck.menuY - menuCheck.clickY) <= 4
    && menuCheck.inBody;
  ok('右键菜单出现在鼠标位置', menuOk, JSON.stringify(menuCheck));
  await shot('E:/0612hpclaw/hpclaw_v2/smoke-contextmenu.png');
  await evalJs(`document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))`);

  // 菜单内容包含"新建文件"
  const menuHasNewFile = await evalJs(`(async () => {
    const rows = document.querySelectorAll('[data-testid^="file-row-"]');
    const row = rows[0];
    const rect = row.getBoundingClientRect();
    row.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: rect.left + 60, clientY: rect.top + 5 }));
    await new Promise(r => setTimeout(r, 300));
    const menu = document.querySelector('[data-testid="context-menu"]');
    const has = menu ? [...menu.querySelectorAll('.context-menu-item')].some(b => b.textContent.includes('新建文件')) : false;
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    return has;
  })()`);
  ok('右键菜单包含"新建文件"入口', menuHasNewFile);

  // ── 2. 新建文件 ──────────────────────────────────────────────────────────
  // 远端
  const touch = await api('POST', '/api/remote/touch', { path: `${REMOTE_DIR}/hpclaw-newfile.txt` });
  const remoteList = await api('GET', '/api/remote/files?path=' + encodeURIComponent(REMOTE_DIR));
  const remoteFileExists = (remoteList.data.entries || []).some(e => e.name === 'hpclaw-newfile.txt');
  ok('新建文件：远端 touch 成功且可见', touch.status === 201 && remoteFileExists, `touch=${touch.status}`);
  const touchDup = await api('POST', '/api/remote/touch', { path: `${REMOTE_DIR}/hpclaw-newfile.txt` });
  ok('新建文件：同名重复被拒绝（不覆盖）', touchDup.status >= 400, `dup status=${touchDup.status}`);
  // 本地
  const localNew = `${LOCAL_BASE}\\hpclaw-newfile-local.txt`;
  try { fs.unlinkSync(localNew); } catch {}
  await evalJs(`window.hpclawDesktop.localFiles.createFile('${localNew.replace(/\\/g, '\\\\')}')`);
  ok('新建文件：本地创建成功', fs.existsSync(localNew));

  // ── 3. 整文件夹上传 ─────────────────────────────────────────────────────
  const walkLocal = await evalJs(`window.hpclawDesktop.localFiles.walk('${(LOCAL_BASE + '\\folder-upload').replace(/\\/g, '\\\\')}')`);
  ok('本地 walk：递归列出全部文件和目录',
    walkLocal.files.length === 3 && walkLocal.dirs.length === 3,
    `files=${walkLocal.files.length} dirs=${walkLocal.dirs.length}`);

  // 模拟 handleDropOnRemote 的展开逻辑：建目录 → 逐文件上传
  const folderName = 'folder-upload';
  const remoteRoot = `${REMOTE_DIR}/${folderName}`;
  const upDirs = [remoteRoot, `${remoteRoot}/sub1`, `${remoteRoot}/sub2`, `${remoteRoot}/sub2/deep`];
  for (const d of upDirs) { await api('POST', '/api/remote/mkdir', { path: d }); }
  const relFiles = [
    { rel: 'root.txt' }, { rel: 'sub1/a.txt' }, { rel: 'sub2/deep/b.txt' },
  ];
  let uploadsOk = true;
  for (const f of walkLocal.files) {
    const rel = f.path.split('folder-upload\\').pop().replace(/\\/g, '/');
    const up = await api('POST', '/api/transfers', {
      profileId: 'live-test', sessionId, direction: 'upload',
      localPath: f.path,
      remotePath: `${remoteRoot}/${rel}`,
      temporaryPath: `${remoteRoot}/.${rel.replace(/\//g, '_')}.ft.part`,
      totalBytes: f.size, transferredBytes: 0,
      conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
    });
    const task = up.data?.transfer;
    const done = task && await waitTask(task.id, ['completed', 'failed'], 20000);
    if (done?.state !== 'completed') { uploadsOk = false; console.log('  upload failed:', rel, done?.error || up.data?.error?.message || 'timeout'); }
  }
  ok('整文件夹上传：3 个文件全部完成', uploadsOk);
  const remoteWalk = await api('GET', '/api/remote/walk?path=' + encodeURIComponent(remoteRoot));
  const remoteTreeOk = remoteWalk.status === 200
    && remoteWalk.data.files.length === 3
    && remoteWalk.data.dirs.length === 3;
  ok('远端 walk：目录结构一致（3 文件 3 目录）', remoteTreeOk,
    `files=${remoteWalk.data?.files?.length} dirs=${remoteWalk.data?.dirs?.length}`);
  // 抽查远端内容
  const chk = await api('GET', '/api/remote/preview?path=' + encodeURIComponent(`${remoteRoot}/sub2/deep/b.txt`));
  const remoteContent = chk.data?.content ? (chk.data.encoding === 'base64' ? Buffer.from(chk.data.content, 'base64').toString('utf8') : String(chk.data.content)) : '';
  ok('抽查：远端深层文件内容一致', remoteContent.trim() === 'deep b.txt content', remoteContent.trim().slice(0, 40));

  // ── 4. 整文件夹下载 ─────────────────────────────────────────────────────
  const dlBase = `${LOCAL_BASE}\\folder-download`;
  try { fs.rmSync(dlBase, { recursive: true }); } catch {}
  const dlDirs = [dlBase, `${dlBase}\\sub1`, `${dlBase}\\sub2`, `${dlBase}\\sub2\\deep`];
  for (const d of dlDirs) { await evalJs(`window.hpclawDesktop.localFiles.mkdir('${d.replace(/\\/g, '\\\\')}')`); }
  let downloadsOk = true;
  for (const f of remoteWalk.data.files) {
    const rel = f.path.split('folder-upload/').pop();
    const localPath = `${dlBase}\\${rel.replace(/\//g, '\\')}`;
    const dl = await api('POST', '/api/transfers', {
      profileId: 'live-test', sessionId, direction: 'download',
      localPath,
      remotePath: f.path,
      temporaryPath: localPath + '.ft.part',
      totalBytes: f.size, transferredBytes: 0,
      conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
    });
    const task = dl.data?.transfer;
    const done = task && await waitTask(task.id, ['completed', 'failed'], 20000);
    if (done?.state !== 'completed') { downloadsOk = false; console.log('  download failed:', rel, done?.error || 'timeout'); }
  }
  ok('整文件夹下载：3 个文件全部完成', downloadsOk);
  const dlContentOk = ['root.txt', 'sub1\\a.txt', 'sub2\\deep\\b.txt'].every(rel => {
    try { return fs.readFileSync(`${dlBase}\\${rel}`, 'utf8').trim().length > 0; } catch { return false; }
  });
  ok('本地下载目录结构和内容正确', dlContentOk);

  // ── 清理 ────────────────────────────────────────────────────────────────
  await api('POST', '/api/remote/remove', { path: remoteRoot, recursive: true });
  await api('POST', '/api/remote/remove', { path: `${REMOTE_DIR}/hpclaw-newfile.txt`, recursive: false });
  await api('DELETE', '/api/transfers/completed');
  console.log('---');
  const failed = results.filter(r => !r.pass);
  console.log(`结果: ${results.length - failed.length}/${results.length} 通过`);
  ws.close();
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('ABORTED:', e.message); process.exit(2); });
