const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('traceDesktop', {
  editing: {
    setFocusScope: scope => ipcRenderer.send('trace:editing-focus', scope),
  },
  locale: {
    get: () => ipcRenderer.invoke('trace:locale:get'),
    set: locale => ipcRenderer.invoke('trace:locale:set', locale),
  },
  // 从 <input type="file"> 的 File 对象取回磁盘绝对路径
  // （Electron 32 起移除了 File.path，官方替代即 webUtils.getPathForFile）
  getPathForFile: (file) => webUtils.getPathForFile(file),
  clipboard: {
    readText: () => ipcRenderer.invoke('trace:clipboard:readText'),
    writeText: (text) => ipcRenderer.invoke('trace:clipboard:writeText', text),
  },
  profiles: {
    list: () => ipcRenderer.invoke('trace:profiles:list'),
    save: (profile) => ipcRenderer.invoke('trace:profiles:save', profile),
    remove: (id) => ipcRenderer.invoke('trace:profiles:remove', id),
    getCredentials: (id) => ipcRenderer.invoke('trace:profiles:getCredentials', id),
    trustFingerprint: (id, fingerprint) =>
      ipcRenderer.invoke('trace:profiles:trustFingerprint', id, fingerprint),
    connect: (id) => ipcRenderer.invoke('trace:profiles:connect', id),
  },
  // 通用密钥存储（safeStorage 加密落盘）：AI 配置、TOTP 种子、集群记住密码
  secrets: {
    get: (key) => ipcRenderer.invoke('trace:secrets:get', key),
    set: (key, value) => ipcRenderer.invoke('trace:secrets:set', key, value),
    delete: (key) => ipcRenderer.invoke('trace:secrets:delete', key),
  },
  localFiles: {
    listDrives: () => ipcRenderer.invoke('trace:localFiles:listDrives'),
    list: (dirPath) => ipcRenderer.invoke('trace:localFiles:list', dirPath),
    stat: (targetPath) => ipcRenderer.invoke('trace:localFiles:stat', targetPath),
    mkdir: (dirPath) => ipcRenderer.invoke('trace:localFiles:mkdir', dirPath),
    createFile: (targetPath) => ipcRenderer.invoke('trace:localFiles:createFile', targetPath),
    writeFile: (targetPath, content) => ipcRenderer.invoke('trace:localFiles:writeFile', targetPath, content),
    walk: (dirPath) => ipcRenderer.invoke('trace:localFiles:walk', dirPath),
    rename: (from, to) => ipcRenderer.invoke('trace:localFiles:rename', from, to),
    copy: (sourcePaths, targetDirectory) =>
      ipcRenderer.invoke('trace:localFiles:copy', sourcePaths, targetDirectory),
    trash: (targetPath) => ipcRenderer.invoke('trace:localFiles:trash', targetPath),
    open: (targetPath) => ipcRenderer.invoke('trace:localFiles:open', targetPath),
    preview: (targetPath, maxBytes) =>
      ipcRenderer.invoke('trace:localFiles:preview', targetPath, maxBytes),
    search: (root, query) => ipcRenderer.invoke('trace:localFiles:search', root, query),
    cancelSearch: (requestId) =>
      ipcRenderer.send('trace:localFiles:cancelSearch', requestId),
  },
  dialog: {
    pickDirectory: () => ipcRenderer.invoke('trace:dialog:pickDirectory'),
  },
  remoteEdits: {
    prepare: (metadata) => ipcRenderer.invoke('trace:remoteEdits:prepare', metadata),
    markDownloaded: (id) => ipcRenderer.invoke('trace:remoteEdits:markDownloaded', id),
    open: (id) => ipcRenderer.invoke('trace:remoteEdits:open', id),
    markUploading: (id, fingerprint) =>
      ipcRenderer.invoke('trace:remoteEdits:markUploading', id, fingerprint),
    markSynced: (id, fingerprint) =>
      ipcRenderer.invoke('trace:remoteEdits:markSynced', id, fingerprint),
    markFailed: (id, error) => ipcRenderer.invoke('trace:remoteEdits:markFailed', id, error),
    retry: (id) => ipcRenderer.invoke('trace:remoteEdits:retry', id),
    discard: (id) => ipcRenderer.invoke('trace:remoteEdits:discard', id),
    list: () => ipcRenderer.invoke('trace:remoteEdits:list'),
    onEvent: (callback) => {
      const handler = (_event, change) => callback(change);
      ipcRenderer.on('trace:remoteEdits:event', handler);
      return () => ipcRenderer.removeListener('trace:remoteEdits:event', handler);
    },
  },
  updates: {
    getState: () => ipcRenderer.invoke('trace:update:getState'),
    getSettings: () => ipcRenderer.invoke('trace:update:getSettings'),
    saveSettings: (settings) => ipcRenderer.invoke('trace:update:saveSettings', settings),
    check: () => ipcRenderer.invoke('trace:update:check'),
    download: () => ipcRenderer.invoke('trace:update:download'),
    install: () => ipcRenderer.invoke('trace:update:install'),
    pickAndInstall: () => ipcRenderer.invoke('trace:update:pickAndInstall'),
    onStatus: (callback) => {
      const handler = (_event, state) => callback(state);
      ipcRenderer.on('trace:update:status', handler);
      return () => ipcRenderer.removeListener('trace:update:status', handler);
    },
  },
  app: {
    edition: process.env.TRACE_EDITION === 'competition' ? 'competition' : 'full',
    onBeforeCloseDecision: (callback) => {
      const handler = (_event, decision) => callback(decision);
      ipcRenderer.on('trace:beforeCloseDecision', handler);
      return () => ipcRenderer.removeListener('trace:beforeCloseDecision', handler);
    },
  },
});
