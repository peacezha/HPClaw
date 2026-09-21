// HPClaw v2 live transfer test — drives the real app via CDP against the real cluster.
// Usage: node scripts/cdp-transfer-test.cjs [port]
const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const port = process.argv[2] || '9222';

const LOCAL_DIR = 'E:\\0612hpclaw\\hpclaw_v2\\tmp-live-test';
const REMOTE_DIR = '/public/home/hpzhang';
const results = [];
const ok = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
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

  const evalJs = async (expression) => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true,
    });
    if (exceptionDetails) throw new Error('renderer exception: ' + JSON.stringify(exceptionDetails.exception?.description || exceptionDetails.text));
    return result.value;
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ── Step 0: wait for main UI and a live SSH session ──────────────────────
  let uiReady = false;
  for (let i = 0; i < 90; i++) {
    try {
      uiReady = await evalJs(`!!document.querySelector('button[aria-label="打开 AI 助手"], button[aria-label="关闭 AI 助手"]')`);
      if (uiReady) break;
    } catch { /* renderer not ready */ }
    await sleep(1000);
  }
  if (!uiReady) { ok('应用主界面就绪', false, '90s 超时'); process.exit(1); }

  // 打开传输工作区，从会话条文本提取真实 SSH sessionId（任务体里必须带它）
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
  if (!sessionId) { ok('获取 SSH sessionId', false, '30s 超时'); process.exit(1); }
  ok('SSH 会话就绪', true, 'session:' + sessionId.slice(0, 8) + '…');
  const authHeader = { 'X-SSH-Session-Id': sessionId };

  // 在 renderer 里执行 API 调用的辅助函数（带 session 头）
  const api = async (method, path, body) => {
    const expr = `(async () => {
      const r = await fetch('${path}', {
        method: '${method}',
        headers: { 'Content-Type': 'application/json', ...${JSON.stringify(authHeader)} },
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
      await sleep(500);
    }
    return null;
  };

  // ── 1. 上传小文件 ────────────────────────────────────────────────────────
  const smallLocal = `${LOCAL_DIR}\\upload-small.txt`;
  const smallSize = fs.statSync(LOCAL_DIR + '\\upload-small.txt').size;
  const up1 = await api('POST', '/api/transfers', {
    profileId: 'live-test', sessionId, direction: 'upload',
    localPath: smallLocal,
    remotePath: `${REMOTE_DIR}/hpclaw-test-small.txt`,
    temporaryPath: `${REMOTE_DIR}/.hpclaw-test-small.txt.lt1.part`,
    totalBytes: smallSize, transferredBytes: 0,
    conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
  });
  const upTask = up1.data?.transfer;
  if (up1.status !== 201 || !upTask) {
    ok('上传：创建任务', false, JSON.stringify(up1.data).slice(0, 200));
  } else {
    const done = await waitTask(upTask.id, ['completed', 'failed'], 20000);
    ok('上传：小文件 → 集群', done?.state === 'completed', done ? `state=${done.state}${done.error ? ' err=' + done.error : ''}` : '超时未完成');
    // 远端校验
    const stat = await api('GET', '/api/remote/files?path=' + encodeURIComponent(REMOTE_DIR));
    const found = (stat.data.entries || []).find(e => e.name === 'hpclaw-test-small.txt');
    ok('上传：远端文件存在且大小一致', !!found && found.size === smallSize, found ? `remote size=${found.size} local=${smallSize}` : '远端未找到');
  }

  // ── 2. 预览远端文件 ──────────────────────────────────────────────────────
  const prev = await api('GET', '/api/remote/preview?path=' + encodeURIComponent(`${REMOTE_DIR}/hpclaw-test-small.txt`));
  const prevPayload = prev.data;
  let previewText = '';
  if (prevPayload && prevPayload.content) {
    previewText = prevPayload.encoding === 'base64'
      ? Buffer.from(prevPayload.content, 'base64').toString('utf8')
      : String(prevPayload.content);
  }
  const localText = fs.readFileSync(LOCAL_DIR + '\\upload-small.txt', 'utf8');
  ok('预览：远端内容可读取且与本地一致', prev.status === 200 && previewText.replace(/\r\n/g, '\n').trim() === localText.replace(/\r\n/g, '\n').trim(),
    prev.status !== 200 ? JSON.stringify(prev.data).slice(0, 150) : `preview ${previewText.length}B vs local ${localText.length}B`);

  // ── 3. 下载回来并比对 ────────────────────────────────────────────────────
  const dlLocal = `${LOCAL_DIR}\\download-back.txt`;
  try { fs.unlinkSync(LOCAL_DIR + '\\download-back.txt'); } catch {}
  const dl1 = await api('POST', '/api/transfers', {
    profileId: 'live-test', sessionId, direction: 'download',
    localPath: dlLocal,
    remotePath: `${REMOTE_DIR}/hpclaw-test-small.txt`,
    temporaryPath: dlLocal + '.lt2.part',
    totalBytes: smallSize, transferredBytes: 0,
    conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
  });
  const dlTask = dl1.data?.transfer;
  const dlDone = dlTask && await waitTask(dlTask.id, ['completed', 'failed'], 20000);
  let dlContentMatch = false;
  try { dlContentMatch = fs.readFileSync(LOCAL_DIR + '\\download-back.txt', 'utf8').replace(/\r\n/g, '\n').trim() === localText.replace(/\r\n/g, '\n').trim(); } catch {}
  ok('下载：集群 → 本地，内容一致', dlDone?.state === 'completed' && dlContentMatch,
    dlDone ? `state=${dlDone.state} contentMatch=${dlContentMatch}` : '超时未完成');

  // ── 4. 大文件：暂停 → 继续 → 完成 ────────────────────────────────────────
  const bigLocal = `${LOCAL_DIR}\\upload-big.bin`;
  const bigSize = fs.statSync(LOCAL_DIR + '\\upload-big.bin').size;
  const up2 = await api('POST', '/api/transfers', {
    profileId: 'live-test', sessionId, direction: 'upload',
    localPath: bigLocal,
    remotePath: `${REMOTE_DIR}/hpclaw-test-big.bin`,
    temporaryPath: `${REMOTE_DIR}/.hpclaw-test-big.bin.lt3.part`,
    totalBytes: bigSize, transferredBytes: 0,
    conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
  });
  const bigTask = up2.data?.transfer;
  let pauseOk = false, resumeOk = false;
  if (bigTask) {
    // 等它进入 running 后暂停
    const running = await waitTask(bigTask.id, ['running', 'completed'], 8000);
    if (running?.state === 'running') {
      await api('POST', `/api/transfers/${bigTask.id}/pause`);
      const paused = await waitTask(bigTask.id, ['paused', 'completed'], 5000);
      pauseOk = paused?.state === 'paused';
      if (pauseOk) {
        await api('POST', `/api/transfers/${bigTask.id}/resume`);
      }
    } else if (running?.state === 'completed') {
      pauseOk = null; // 太快，无法暂停（小集群带宽好）
    }
    const bigDone = await waitTask(bigTask.id, ['completed', 'failed'], 120000);
    resumeOk = bigDone?.state === 'completed';
  }
  ok('大文件：暂停生效', pauseOk !== false, pauseOk === null ? '传输太快跳过（64MB 秒传）' : '');
  ok('大文件：续传完成', resumeOk, `64MB`);

  // ── 5. 取消任务 + 服务器端状态一致 ───────────────────────────────────────
  const up3 = await api('POST', '/api/transfers', {
    profileId: 'live-test', sessionId, direction: 'upload',
    localPath: bigLocal,
    remotePath: `${REMOTE_DIR}/hpclaw-test-cancel.bin`,
    temporaryPath: `${REMOTE_DIR}/.hpclaw-test-cancel.bin.lt4.part`,
    totalBytes: bigSize, transferredBytes: 0,
    conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
  });
  const cancelTask = up3.data?.transfer;
  let cancelOk = false;
  if (cancelTask) {
    await sleep(300);
    await api('POST', `/api/transfers/${cancelTask.id}/cancel`);
    const cancelled = await waitTask(cancelTask.id, ['cancelled'], 5000);
    cancelOk = cancelled?.state === 'cancelled';
  }
  ok('取消：任务进入 cancelled（服务器端）', cancelOk);

  // ── 6. 清除已完成（服务器端真正删除）─────────────────────────────────────
  const clr = await api('DELETE', '/api/transfers/completed');
  const afterClr = await api('GET', '/api/transfers');
  const remaining = (afterClr.data.transfers || []).filter(t => t.state === 'completed');
  ok('清除已完成：服务器端不再返回', clr.status === 200 && remaining.length === 0,
    `removed=${(clr.data.removed || []).length} remainingCompleted=${remaining.length}`);

  // ── 7. 编辑会话全流程：prepare → 下载 → 改本地 → 上传 → 远端校验 ──────────
  // 先在远端造一个文件
  await api('POST', '/api/transfers', {
    profileId: 'live-test', sessionId, direction: 'upload',
    localPath: smallLocal,
    remotePath: `${REMOTE_DIR}/hpclaw-test-edit.txt`,
    temporaryPath: `${REMOTE_DIR}/.hpclaw-test-edit.txt.lt5.part`,
    totalBytes: smallSize, transferredBytes: 0,
    conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
  }).then(r => waitTask(r.data.transfer.id, ['completed', 'failed'], 20000));

  const editPrep = await evalJs(`window.hpclawDesktop.remoteEdits.prepare({
    profileId: 'live-test', sshSessionId: '${sessionId}',
    remotePath: '${REMOTE_DIR}/hpclaw-test-edit.txt', fileName: 'hpclaw-test-edit.txt',
  })`);
  let editOk = false, editDetail = '';
  if (editPrep?.id) {
    // 模拟下载阶段：走引擎下载到编辑缓存
    const dlEdit = await api('POST', '/api/transfers', {
      profileId: 'live-test', sessionId, direction: 'download',
      localPath: editPrep.localPath,
      remotePath: `${REMOTE_DIR}/hpclaw-test-edit.txt`,
      temporaryPath: editPrep.localPath + '.lt6.part',
      totalBytes: smallSize, transferredBytes: 0,
      conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
    });
    const dlEditDone = dlEdit.data?.transfer && await waitTask(dlEdit.data.transfer.id, ['completed', 'failed'], 20000);
    if (dlEditDone?.state !== 'completed') {
      editDetail = '编辑下载失败: ' + (dlEditDone?.error || 'timeout');
    } else {
      await evalJs(`window.hpclawDesktop.remoteEdits.markDownloaded('${editPrep.id}')`);
      // 模拟用户编辑：直接改写本地缓存文件
      const newContent = localText + '\n[edited by live test ' + Date.now() + ']\n';
      fs.writeFileSync(editPrep.localPath.replace(/\//g, '\\'), newContent);
      const fingerprint = crypto.createHash('sha256').update(fs.readFileSync(editPrep.localPath.replace(/\//g, '\\'))).digest('hex');
      // 上传阶段（与 queueEditUpload 同路径）
      await evalJs(`window.hpclawDesktop.remoteEdits.markUploading('${editPrep.id}', '${fingerprint}')`);
      const newSize = fs.statSync(editPrep.localPath.replace(/\//g, '\\')).size;
      const upEdit = await api('POST', '/api/transfers', {
        profileId: 'live-test', sessionId, direction: 'upload',
        localPath: editPrep.localPath,
        remotePath: `${REMOTE_DIR}/hpclaw-test-edit.txt`,
        temporaryPath: `${REMOTE_DIR}/.hpclaw-test-edit.txt.lt7.part`,
        totalBytes: newSize, transferredBytes: 0,
        conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
      });
      const upEditDone = upEdit.data?.transfer && await waitTask(upEdit.data.transfer.id, ['completed', 'failed'], 30000);
      if (upEditDone?.state !== 'completed') {
        editDetail = '编辑上传失败: ' + (upEditDone?.error || JSON.stringify(upEdit.data).slice(0, 150) || 'timeout');
      } else {
        await evalJs(`window.hpclawDesktop.remoteEdits.markSynced('${editPrep.id}', '${fingerprint}')`);
        // 远端内容校验
        const chk = await api('GET', '/api/remote/preview?path=' + encodeURIComponent(`${REMOTE_DIR}/hpclaw-test-edit.txt`));
        const remoteText = chk.data?.content
          ? (chk.data.encoding === 'base64' ? Buffer.from(chk.data.content, 'base64').toString('utf8') : String(chk.data.content))
          : '';
        editOk = remoteText.replace(/\r\n/g, '\n').trim() === newContent.replace(/\r\n/g, '\n').trim();
        editDetail = editOk ? '远端内容=编辑后内容' : `远端内容不匹配 (remote ${remoteText.length}B vs expect ${newContent.length}B)`;
      }
    }
    // 清理编辑会话
    await evalJs(`window.hpclawDesktop.remoteEdits.discard('${editPrep.id}')`);
  } else {
    editDetail = 'prepare 失败: ' + JSON.stringify(editPrep).slice(0, 150);
  }
  ok('编辑会话：下载→编辑→上传→远端内容正确', editOk, editDetail);

  // ── 8. discard 后会话列表为空 ────────────────────────────────────────────
  const editList = await evalJs(`window.hpclawDesktop.remoteEdits.list()`);
  const liveTestSessions = (editList || []).filter(s => s.remotePath?.includes('hpclaw-test-'));
  ok('编辑会话：discard 生效', liveTestSessions.length === 0, `剩余=${liveTestSessions.length}`);

  // ── 清理远端测试文件 ─────────────────────────────────────────────────────
  for (const f of ['hpclaw-test-small.txt', 'hpclaw-test-big.bin', 'hpclaw-test-cancel.bin', 'hpclaw-test-edit.txt']) {
    await api('POST', '/api/remote/remove', { path: `${REMOTE_DIR}/${f}`, recursive: false });
  }
  console.log('---');
  const failed = results.filter(r => !r.pass);
  console.log(`结果: ${results.length - failed.length}/${results.length} 通过`);
  ws.close();
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('ABORTED:', e.message); process.exit(2); });
