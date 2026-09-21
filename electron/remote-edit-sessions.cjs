const path = require('node:path');
const crypto = require('node:crypto');

function publicSession(session) {
  return { ...session };
}

function safeFileName(value) {
  const name = path.win32.basename(String(value || '')).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim();
  return name && name !== '.' && name !== '..' ? name : 'remote-file';
}

function sessionKey(metadata) {
  return `${metadata.profileId}\0${metadata.remotePath}`;
}

function createRemoteEditSessionManager({
  root,
  files,
  watchFile,
  hashFile,
  launch,
  onEvent = () => {},
  debounceMs = 800,
}) {
  if (!root) throw new Error('remote edit session root is required');
  const sessions = new Map();
  const sessionIdsByKey = new Map();
  const watchers = new Map();
  const timers = new Map();
  const sessionsRoot = path.resolve(root, 'remote-edit-sessions');
  const statePath = path.join(sessionsRoot, 'sessions.json');

  async function persist() {
    await files.mkdir(sessionsRoot, { recursive: true });
    const temporaryPath = `${statePath}.tmp`;
    await files.writeFile(temporaryPath, JSON.stringify([...sessions.values()], null, 2), 'utf8');
    await files.rename(temporaryPath, statePath);
  }

  function requireSession(id) {
    const session = sessions.get(id);
    if (!session) throw new Error(`Unknown remote edit session: ${id}`);
    return session;
  }

  async function update(id, patch, event = 'changed') {
    const next = { ...requireSession(id), ...patch, updatedAt: Date.now() };
    sessions.set(id, next);
    await persist();
    onEvent(event, publicSession(next));
    return publicSession(next);
  }

  async function prepare(metadata) {
    if (!metadata?.profileId || !metadata?.sshSessionId || !metadata?.remotePath) {
      throw new Error('profileId, sshSessionId, and remotePath are required');
    }
    const key = sessionKey(metadata);
    const existingId = sessionIdsByKey.get(key);
    if (existingId && sessions.has(existingId)) {
      const existing = sessions.get(existingId);
      if (existing.sshSessionId !== metadata.sshSessionId) {
        return update(existingId, { sshSessionId: metadata.sshSessionId });
      }
      return publicSession(existing);
    }

    const id = crypto.randomUUID();
    const directory = path.join(sessionsRoot, id);
    const localPath = path.resolve(directory, safeFileName(metadata.fileName));
    const relative = path.relative(directory, localPath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('unsafe remote edit cache path');
    await files.mkdir(directory, { recursive: true });

    const now = Date.now();
    const session = {
      id,
      profileId: metadata.profileId,
      sshSessionId: metadata.sshSessionId,
      remotePath: metadata.remotePath,
      localPath,
      state: 'downloading',
      dirty: false,
      createdAt: now,
      updatedAt: now,
    };
    sessions.set(id, session);
    sessionIdsByKey.set(key, id);
    await persist();
    onEvent('changed', publicSession(session));
    return publicSession(session);
  }

  function stopWatching(id) {
    const timer = timers.get(id);
    if (timer) clearTimeout(timer);
    timers.delete(id);
    watchers.get(id)?.close();
    watchers.delete(id);
  }

  async function publishDirty(id) {
    const session = requireSession(id);
    const fingerprint = await hashFile(session.localPath);
    if (fingerprint === session.lastLocalFingerprint || fingerprint === session.lastUploadedFingerprint) return;
    await update(id, {
      dirty: true,
      state: session.state === 'uploading' ? 'uploading' : 'editing',
      lastLocalFingerprint: fingerprint,
      error: undefined,
    }, 'dirty');
  }

  function scheduleDirty(id) {
    const current = timers.get(id);
    if (current) clearTimeout(current);
    timers.set(id, setTimeout(async () => {
      timers.delete(id);
      try {
        await publishDirty(id);
      } catch (error) {
        await update(id, { state: 'failed', dirty: true, error: error.message }, 'error');
      }
    }, debounceMs));
  }

  async function open(id) {
    // Keep the UI in "opening" until the operating system confirms that the
    // associated application accepted the request. This prevents a failed or
    // stuck launcher from being shown as an active editing session.
    const session = await update(id, { state: 'opening', error: undefined });
    if (!watchers.has(id)) {
      watchers.set(id, watchFile(session.localPath, () => scheduleDirty(id)));
    }
    let opened = false;
    let resolveOpened;
    const openedPromise = new Promise(resolve => { resolveOpened = resolve; });
    const markOpened = async () => {
      if (opened) return publicSession(requireSession(id));
      opened = true;
      const editing = await update(id, { state: 'editing', error: undefined });
      resolveOpened(editing);
      return editing;
    };
    const launchPromise = Promise.resolve()
      .then(() => launch(session.localPath, markOpened));

    // New launchers explicitly confirm that the OS accepted the request.
    // Falling back to launcher resolution keeps injected/legacy launchers
    // compatible while still preventing a pending launcher from looking open.
    try {
      await Promise.race([
        openedPromise,
        launchPromise.then(() => markOpened()),
      ]);
    } catch (error) {
      stopWatching(id);
      const current = requireSession(id);
      return update(id, {
        state: 'failed',
        dirty: current.dirty,
        error: error?.message || String(error),
      }, 'error');
    }

    launchPromise
      .then(async () => {
        const timer = timers.get(id);
        if (timer) {
          clearTimeout(timer);
          timers.delete(id);
        }
        // fs.watch is only a fast path. Always compare the final on-disk
        // contents when the associated application closes so a missed or
        // coalesced Windows file event cannot lose the user's last save.
        await publishDirty(id);
        onEvent('closed', publicSession(requireSession(id)));
      })
      .catch(error => {
        stopWatching(id);
        const current = requireSession(id);
        void update(id, {
          state: 'failed',
          dirty: current.dirty,
          error: error?.message || String(error),
        }, 'error');
      });
    return publicSession(requireSession(id));
  }

  async function markDownloaded(id) {
    const session = requireSession(id);
    const fingerprint = await hashFile(session.localPath);
    return update(id, {
      state: 'opening',
      dirty: false,
      lastLocalFingerprint: fingerprint,
      lastUploadedFingerprint: fingerprint,
      error: undefined,
    });
  }

  async function restore() {
    let serialized;
    try {
      serialized = await files.readFile(statePath, 'utf8');
    } catch (error) {
      if (error?.code === 'ENOENT') return [];
      throw error;
    }
    const restored = JSON.parse(serialized);
    if (!Array.isArray(restored)) throw new Error('remote edit session state must be an array');
    for (const candidate of restored) {
      if (!candidate?.id || !candidate?.profileId || !candidate?.remotePath || !candidate?.localPath) continue;
      // 已同步且无未上传修改的会话无需恢复——避免历史会话无限堆积
      if (candidate.state === 'synced' && !candidate.dirty) continue;
      const resolvedLocalPath = path.resolve(candidate.localPath);
      const relative = path.relative(sessionsRoot, resolvedLocalPath);
      if (relative.startsWith('..') || path.isAbsolute(relative)) continue;
      try {
        await files.stat(resolvedLocalPath);
      } catch {
        continue;
      }
      const wasInterrupted = ['downloading', 'opening', 'editing', 'uploading'].includes(candidate.state);
      let recoveredFingerprint = candidate.lastLocalFingerprint;
      if (!recoveredFingerprint && ['editing', 'uploading'].includes(candidate.state)) {
        recoveredFingerprint = await hashFile(resolvedLocalPath);
      }
      const session = {
        ...candidate,
        localPath: resolvedLocalPath,
        ...(recoveredFingerprint ? { lastLocalFingerprint: recoveredFingerprint } : {}),
        ...(wasInterrupted ? {
          state: 'failed',
          dirty: candidate.state === 'editing' || candidate.state === 'uploading' || Boolean(candidate.dirty),
          error: candidate.state === 'uploading' || candidate.state === 'editing'
            ? '上次编辑或同步被中断，请重试上传'
            : '上次下载或打开被中断，请重新打开远程文件',
        } : {}),
      };
      sessions.set(session.id, session);
      sessionIdsByKey.set(sessionKey(session), session.id);
    }
    return [...sessions.values()].map(publicSession);
  }

  return {
    prepare,
    open,
    restore,
    list: () => [...sessions.values()].map(publicSession),
    hasUnsynced: () => [...sessions.values()].some(session =>
      session.dirty || session.state === 'uploading' || session.state === 'failed'
        || Boolean(session.lastLocalFingerprint && session.lastLocalFingerprint !== session.lastUploadedFingerprint)),
    markDownloaded,
    markUploading: (id, fingerprint) => update(id, {
      state: 'uploading',
      dirty: true,
      lastLocalFingerprint: fingerprint,
      error: undefined,
    }),
    markSynced: (id, fingerprint) => {
      const current = requireSession(id);
      const hasNewerSave = Boolean(
        current.lastLocalFingerprint
        && current.lastLocalFingerprint !== fingerprint,
      );
      return update(id, {
        state: hasNewerSave ? 'editing' : 'synced',
        dirty: hasNewerSave,
        lastLocalFingerprint: current.lastLocalFingerprint || fingerprint,
        lastUploadedFingerprint: fingerprint,
        error: undefined,
      });
    },
    markFailed: (id, error) => update(id, {
      state: 'failed',
      dirty: true,
      error: error?.message || String(error),
    }, 'error'),
    retry: id => {
      const current = requireSession(id);
      return update(id, {
        state: current.lastLocalFingerprint ? 'editing' : 'downloading',
        error: undefined,
      });
    },
    async discard(id) {
      const session = requireSession(id);
      stopWatching(id);
      sessions.delete(id);
      for (const [key, value] of sessionIdsByKey) {
        if (value === id) sessionIdsByKey.delete(key);
      }
      await persist();
      // 本地缓存文件保留在磁盘上，用户仍可从恢复目录找回
      onEvent('discarded', publicSession(session));
      return { ok: true };
    },
    dispose() {
      for (const id of watchers.keys()) stopWatching(id);
    },
  };
}

module.exports = { createRemoteEditSessionManager, safeFileName };
