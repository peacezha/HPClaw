/** Restore normal Chromium editing without double-pasting into xterm. */
function createEditingController({ Menu, BrowserWindow, ipcMain, text }) {
  const scopes = new WeakMap();
  function attach(contents, owner) {
    contents.on('before-input-event', () => {
      contents.setIgnoreMenuShortcuts((scopes.get(contents) || 'text') !== 'text');
    });
    contents.on('context-menu', (_event, params) => {
      const items = [];
      const action = (label, method, enabled = true) => ({ label, enabled, click: () => contents[method]() });
      if (params.isEditable) {
        items.push(action(text('剪切', 'Cut'), 'cut', params.editFlags.canCut),
          action(text('复制', 'Copy'), 'copy', params.editFlags.canCopy),
          action(text('粘贴', 'Paste'), 'paste', params.editFlags.canPaste), { type: 'separator' });
      } else if (params.selectionText) items.push(action(text('复制', 'Copy'), 'copy'));
      items.push(action(text('全选', 'Select All'), 'selectAll'));
      Menu.buildFromTemplate(items).popup({ window: BrowserWindow.fromWebContents(contents) || owner });
    });
  }
  ipcMain.on('trace:editing-focus', (event, scope) => {
    if (!['text', 'terminal', 'files'].includes(scope) || event.sender.isDestroyed()) return;
    scopes.set(event.sender, scope);
    event.sender.setIgnoreMenuShortcuts(scope !== 'text');
  });
  function refreshMenu() {
    Menu.setApplicationMenu(Menu.buildFromTemplate([{
      label: text('编辑', 'Edit'), submenu: [
        { label: text('撤销', 'Undo'), role: 'undo', accelerator: 'CommandOrControl+Z' },
        { label: text('重做', 'Redo'), role: 'redo', accelerator: 'CommandOrControl+Shift+Z' },
        { type: 'separator' },
        { label: text('剪切', 'Cut'), role: 'cut', accelerator: 'CommandOrControl+X' },
        { label: text('复制', 'Copy'), role: 'copy', accelerator: 'CommandOrControl+C' },
        { label: text('粘贴', 'Paste'), role: 'paste', accelerator: 'CommandOrControl+V' },
        { label: text('全选', 'Select All'), role: 'selectAll', accelerator: 'CommandOrControl+A' },
      ],
    }]));
  }
  return { attach, refreshMenu };
}
module.exports = { createEditingController };
