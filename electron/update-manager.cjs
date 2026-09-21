const fs = require('node:fs');
const path = require('node:path');

const AUTO_CHECK_DELAY_MS = 20_000;
const AUTO_CHECK_INTERVAL_MS = 6 * 60 * 60_000;

function normalizeUpdateUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.length > 2048) throw new Error('更新地址过长');

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('更新地址格式不正确');
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('更新地址必须使用 http:// 或 https://');
  }
  if (parsed.username || parsed.password) throw new Error('更新地址不能包含账号或密码');
  parsed.search = '';
  parsed.hash = '';
  if (!parsed.pathname.endsWith('/')) parsed.pathname += '/';
  return parsed.toString();
}

function normalizeSettings(value) {
  const raw = value && typeof value === 'object' ? value : {};
  return {
    updateUrl: normalizeUpdateUrl(raw.updateUrl),
    autoCheck: raw.autoCheck !== false,
  };
}

function safeMessage(error) {
  const message = error instanceof Error ? error.message : String(error || '未知错误');
  return message.replace(/\s+/g, ' ').trim().slice(0, 600);
}

function createUpdateManager(options) {
  const {
    app,
    autoUpdater,
    dialog,
    shell,
    getWindow = () => null,
    broadcast,
    fsImpl = fs,
    settingsFile = path.join(app.getPath('userData'), 'update-settings.json'),
    platform = process.platform,
    setTimeoutImpl = setTimeout,
    setIntervalImpl = setInterval,
    clearTimeoutImpl = clearTimeout,
    clearIntervalImpl = clearInterval,
  } = options;

  let settings = { updateUrl: '', autoCheck: true };
  try {
    settings = normalizeSettings(JSON.parse(fsImpl.readFileSync(settingsFile, 'utf8')));
  } catch {
    // First launch or a damaged optional settings file: use safe defaults.
  }

  const supported = platform === 'win32' && app.isPackaged === true;
  let state = {
    phase: 'idle',
    currentVersion: app.getVersion(),
    availableVersion: '',
    percent: 0,
    bytesPerSecond: 0,
    transferred: 0,
    total: 0,
    message: supported ? '可以检查更新' : '在线更新仅在 Windows 安装版中可用',
    updateUrl: settings.updateUrl,
    autoCheck: settings.autoCheck,
    configured: Boolean(settings.updateUrl),
    supported,
  };
  let checkPromise = null;
  let downloadPromise = null;
  let initialTimer = null;
  let intervalTimer = null;
  let autoCheckStarted = false;

  const emit = () => {
    const snapshot = { ...state };
    try {
      if (broadcast) broadcast(snapshot);
      else {
        const window = getWindow();
        if (window && !window.isDestroyed()) window.webContents.send('hpclaw:update:status', snapshot);
      }
    } catch {
      // Renderer may be reloading; state remains available through getState().
    }
    return snapshot;
  };

  const setState = patch => {
    state = { ...state, ...patch };
    return emit();
  };

  const configureFeed = () => {
    if (!settings.updateUrl) throw new Error('请先填写并保存更新服务器地址');
    autoUpdater.setFeedURL({
      provider: 'generic',
      url: settings.updateUrl,
      useMultipleRangeRequest: false,
    });
  };

  const listeners = {
    checking: () => setState({ phase: 'checking', message: '正在检查更新…', percent: 0 }),
    available: info => setState({
      phase: 'available',
      availableVersion: String(info?.version || ''),
      message: `发现新版本 ${String(info?.version || '')}`.trim(),
      percent: 0,
    }),
    notAvailable: info => setState({
      phase: 'not-available',
      availableVersion: String(info?.version || ''),
      message: '当前已经是最新版本',
      percent: 100,
    }),
    progress: progress => setState({
      phase: 'downloading',
      percent: Math.max(0, Math.min(100, Number(progress?.percent) || 0)),
      bytesPerSecond: Number(progress?.bytesPerSecond) || 0,
      transferred: Number(progress?.transferred) || 0,
      total: Number(progress?.total) || 0,
      message: `正在下载更新 ${Math.round(Number(progress?.percent) || 0)}%`,
    }),
    downloaded: info => setState({
      phase: 'downloaded',
      availableVersion: String(info?.version || state.availableVersion || ''),
      percent: 100,
      message: '更新已下载，可以安装并重启',
    }),
    error: error => setState({ phase: 'error', message: `更新失败：${safeMessage(error)}` }),
  };

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowDowngrade = false;
  autoUpdater.allowPrerelease = false;
  autoUpdater.on('checking-for-update', listeners.checking);
  autoUpdater.on('update-available', listeners.available);
  autoUpdater.on('update-not-available', listeners.notAvailable);
  autoUpdater.on('download-progress', listeners.progress);
  autoUpdater.on('update-downloaded', listeners.downloaded);
  autoUpdater.on('error', listeners.error);

  const getState = () => ({ ...state });
  const getSettings = () => ({ ...settings });

  const saveSettings = value => {
    const next = normalizeSettings(value);
    fsImpl.mkdirSync(path.dirname(settingsFile), { recursive: true });
    const temporary = `${settingsFile}.tmp`;
    fsImpl.writeFileSync(temporary, JSON.stringify(next, null, 2), 'utf8');
    fsImpl.renameSync(temporary, settingsFile);
    settings = next;
    setState({
      updateUrl: settings.updateUrl,
      autoCheck: settings.autoCheck,
      configured: Boolean(settings.updateUrl),
      phase: 'idle',
      message: settings.updateUrl ? '更新设置已保存' : '已关闭在线更新源，可继续使用本地安装包更新',
      percent: 0,
    });
    if (autoCheckStarted) startAutoCheck();
    return getSettings();
  };

  const check = async () => {
    if (!supported) return setState({ phase: 'error', message: '在线更新仅在 Windows 安装版中可用' });
    if (checkPromise) return checkPromise;
    try {
      configureFeed();
    } catch (error) {
      return setState({ phase: 'error', message: safeMessage(error) });
    }
    setState({ phase: 'checking', message: '正在检查更新…', percent: 0 });
    checkPromise = Promise.resolve(autoUpdater.checkForUpdates())
      .then(() => getState())
      .catch(error => setState({ phase: 'error', message: `检查更新失败：${safeMessage(error)}` }))
      .finally(() => { checkPromise = null; });
    return checkPromise;
  };

  const download = async () => {
    if (!supported) return setState({ phase: 'error', message: '在线更新仅在 Windows 安装版中可用' });
    if (downloadPromise) return downloadPromise;
    try {
      configureFeed();
    } catch (error) {
      return setState({ phase: 'error', message: safeMessage(error) });
    }
    setState({ phase: 'downloading', message: '正在准备下载更新…', percent: 0 });
    downloadPromise = Promise.resolve(autoUpdater.downloadUpdate())
      .then(() => getState())
      .catch(error => setState({ phase: 'error', message: `下载更新失败：${safeMessage(error)}` }))
      .finally(() => { downloadPromise = null; });
    return downloadPromise;
  };

  const installDownloaded = async () => {
    if (state.phase !== 'downloaded') return setState({ phase: 'error', message: '尚未下载可安装的更新' });
    const window = getWindow();
    const options = {
      type: 'question',
      buttons: ['安装并重启', '取消'],
      defaultId: 1,
      cancelId: 1,
      title: '安装 HPClaw 更新',
      message: 'HPClaw 将关闭并安装更新。请先确认没有正在传输的文件或未保存的工作。',
    };
    const result = window && !window.isDestroyed()
      ? await dialog.showMessageBox(window, options)
      : await dialog.showMessageBox(options);
    if (result.response !== 0) return getState();
    setState({ phase: 'installing', message: '正在退出并安装更新…' });
    setTimeoutImpl(() => autoUpdater.quitAndInstall(false, true), 150);
    return getState();
  };

  const pickAndInstall = async () => {
    if (platform !== 'win32') return setState({ phase: 'error', message: '本地安装包更新仅支持 Windows' });
    const window = getWindow();
    const picker = {
      title: '选择 HPClaw 安装包',
      properties: ['openFile'],
      filters: [{ name: 'HPClaw Windows 安装包', extensions: ['exe'] }],
    };
    const selection = window && !window.isDestroyed()
      ? await dialog.showOpenDialog(window, picker)
      : await dialog.showOpenDialog(picker);
    if (selection.canceled || !selection.filePaths?.[0]) return getState();
    const installerPath = path.resolve(selection.filePaths[0]);
    if (path.extname(installerPath).toLowerCase() !== '.exe') {
      return setState({ phase: 'error', message: '请选择 .exe 格式的 HPClaw 安装包' });
    }
    const confirmation = window && !window.isDestroyed()
      ? await dialog.showMessageBox(window, {
        type: 'question', buttons: ['运行安装包', '取消'], defaultId: 1, cancelId: 1,
        title: '本地更新', message: `将运行安装包：${path.basename(installerPath)}\n请确认安装包来自可信来源。`,
      })
      : await dialog.showMessageBox({
        type: 'question', buttons: ['运行安装包', '取消'], defaultId: 1, cancelId: 1,
        title: '本地更新', message: `将运行安装包：${path.basename(installerPath)}\n请确认安装包来自可信来源。`,
      });
    if (confirmation.response !== 0) return getState();
    const openError = await shell.openPath(installerPath);
    if (openError) return setState({ phase: 'error', message: `无法运行安装包：${openError}` });
    setState({ phase: 'installing', message: '安装包已启动，HPClaw 即将退出…' });
    setTimeoutImpl(() => app.quit(), 800);
    return getState();
  };

  function stopAutoCheck() {
    if (initialTimer) clearTimeoutImpl(initialTimer);
    if (intervalTimer) clearIntervalImpl(intervalTimer);
    initialTimer = null;
    intervalTimer = null;
  }

  function startAutoCheck() {
    autoCheckStarted = true;
    stopAutoCheck();
    if (!supported || !settings.autoCheck || !settings.updateUrl) return;
    initialTimer = setTimeoutImpl(() => void check(), AUTO_CHECK_DELAY_MS);
    initialTimer.unref?.();
    intervalTimer = setIntervalImpl(() => void check(), AUTO_CHECK_INTERVAL_MS);
    intervalTimer.unref?.();
  }

  const dispose = () => {
    stopAutoCheck();
    autoUpdater.removeListener('checking-for-update', listeners.checking);
    autoUpdater.removeListener('update-available', listeners.available);
    autoUpdater.removeListener('update-not-available', listeners.notAvailable);
    autoUpdater.removeListener('download-progress', listeners.progress);
    autoUpdater.removeListener('update-downloaded', listeners.downloaded);
    autoUpdater.removeListener('error', listeners.error);
  };

  return {
    getState,
    getSettings,
    saveSettings,
    check,
    download,
    installDownloaded,
    pickAndInstall,
    startAutoCheck,
    dispose,
  };
}

module.exports = { createUpdateManager, normalizeSettings, normalizeUpdateUrl };
