const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('hpclawDesktop', {
  // 从 <input type="file"> 的 File 对象取回磁盘绝对路径
  // （Electron 32 起移除了 File.path，官方替代即 webUtils.getPathForFile）
  getPathForFile: (file) => webUtils.getPathForFile(file),
  clipboard: {
    readText: () => ipcRenderer.invoke('hpclaw:clipboard:readText'),
    writeText: (text) => ipcRenderer.invoke('hpclaw:clipboard:writeText', text),
  },
  profiles: {
    list: () => ipcRenderer.invoke('hpclaw:profiles:list'),
    save: (profile) => ipcRenderer.invoke('hpclaw:profiles:save', profile),
    remove: (id) => ipcRenderer.invoke('hpclaw:profiles:remove', id),
    getCredentials: (id) => ipcRenderer.invoke('hpclaw:profiles:getCredentials', id),
    trustFingerprint: (id, fingerprint) =>
      ipcRenderer.invoke('hpclaw:profiles:trustFingerprint', id, fingerprint),
    connect: (id) => ipcRenderer.invoke('hpclaw:profiles:connect', id),
  },
  // 通用密钥存储（safeStorage 加密落盘）：AI 配置、TOTP 种子、集群记住密码
  secrets: {
    get: (key) => ipcRenderer.invoke('hpclaw:secrets:get', key),
    set: (key, value) => ipcRenderer.invoke('hpclaw:secrets:set', key, value),
    delete: (key) => ipcRenderer.invoke('hpclaw:secrets:delete', key),
  },
  localFiles: {
    listDrives: () => ipcRenderer.invoke('hpclaw:localFiles:listDrives'),
    list: (dirPath) => ipcRenderer.invoke('hpclaw:localFiles:list', dirPath),
    stat: (targetPath) => ipcRenderer.invoke('hpclaw:localFiles:stat', targetPath),
    mkdir: (dirPath) => ipcRenderer.invoke('hpclaw:localFiles:mkdir', dirPath),
    createFile: (targetPath) => ipcRenderer.invoke('hpclaw:localFiles:createFile', targetPath),
    writeFile: (targetPath, content) => ipcRenderer.invoke('hpclaw:localFiles:writeFile', targetPath, content),
    walk: (dirPath) => ipcRenderer.invoke('hpclaw:localFiles:walk', dirPath),
    rename: (from, to) => ipcRenderer.invoke('hpclaw:localFiles:rename', from, to),
    copy: (sourcePaths, targetDirectory) =>
      ipcRenderer.invoke('hpclaw:localFiles:copy', sourcePaths, targetDirectory),
    trash: (targetPath) => ipcRenderer.invoke('hpclaw:localFiles:trash', targetPath),
    open: (targetPath) => ipcRenderer.invoke('hpclaw:localFiles:open', targetPath),
    preview: (targetPath, maxBytes) =>
      ipcRenderer.invoke('hpclaw:localFiles:preview', targetPath, maxBytes),
    search: (root, query) => ipcRenderer.invoke('hpclaw:localFiles:search', root, query),
    cancelSearch: (requestId) =>
      ipcRenderer.send('hpclaw:localFiles:cancelSearch', requestId),
  },
  dialog: {
    pickDirectory: () => ipcRenderer.invoke('hpclaw:dialog:pickDirectory'),
  },
  remoteEdits: {
    prepare: (metadata) => ipcRenderer.invoke('hpclaw:remoteEdits:prepare', metadata),
    markDownloaded: (id) => ipcRenderer.invoke('hpclaw:remoteEdits:markDownloaded', id),
    open: (id) => ipcRenderer.invoke('hpclaw:remoteEdits:open', id),
    markUploading: (id, fingerprint) =>
      ipcRenderer.invoke('hpclaw:remoteEdits:markUploading', id, fingerprint),
    markSynced: (id, fingerprint) =>
      ipcRenderer.invoke('hpclaw:remoteEdits:markSynced', id, fingerprint),
    markFailed: (id, error) => ipcRenderer.invoke('hpclaw:remoteEdits:markFailed', id, error),
    retry: (id) => ipcRenderer.invoke('hpclaw:remoteEdits:retry', id),
    discard: (id) => ipcRenderer.invoke('hpclaw:remoteEdits:discard', id),
    list: () => ipcRenderer.invoke('hpclaw:remoteEdits:list'),
    onEvent: (callback) => {
      const handler = (_event, change) => callback(change);
      ipcRenderer.on('hpclaw:remoteEdits:event', handler);
      return () => ipcRenderer.removeListener('hpclaw:remoteEdits:event', handler);
    },
  },
  updates: {
    getState: () => ipcRenderer.invoke('hpclaw:update:getState'),
    getSettings: () => ipcRenderer.invoke('hpclaw:update:getSettings'),
    saveSettings: (settings) => ipcRenderer.invoke('hpclaw:update:saveSettings', settings),
    check: () => ipcRenderer.invoke('hpclaw:update:check'),
    download: () => ipcRenderer.invoke('hpclaw:update:download'),
    install: () => ipcRenderer.invoke('hpclaw:update:install'),
    pickAndInstall: () => ipcRenderer.invoke('hpclaw:update:pickAndInstall'),
    onStatus: (callback) => {
      const handler = (_event, state) => callback(state);
      ipcRenderer.on('hpclaw:update:status', handler);
      return () => ipcRenderer.removeListener('hpclaw:update:status', handler);
    },
  },
  app: {
    edition: process.env.HPCLAW_EDITION === 'competition' ? 'competition' : 'full',
    onBeforeCloseDecision: (callback) => {
      const handler = (_event, decision) => callback(decision);
      ipcRenderer.on('hpclaw:beforeCloseDecision', handler);
      return () => ipcRenderer.removeListener('hpclaw:beforeCloseDecision', handler);
    },
  },
});
