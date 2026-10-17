import { describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';
import { EventEmitter } from 'node:events';
const { createEditingController } = createRequire(import.meta.url)('./editing.cjs');

function fixture() {
  const ipcMain = new EventEmitter();
  const contents = Object.assign(new EventEmitter(), {
    setIgnoreMenuShortcuts: vi.fn(), isDestroyed: () => false,
    cut: vi.fn(), copy: vi.fn(), paste: vi.fn(), selectAll: vi.fn(),
  });
  const Menu = { buildFromTemplate: vi.fn(() => ({ popup: vi.fn() })), setApplicationMenu: vi.fn() };
  const controller = createEditingController({ Menu, BrowserWindow: { fromWebContents: () => undefined }, ipcMain, text: (_zh: string, en: string) => en });
  controller.attach(contents, {});
  return { controller, contents, Menu, ipcMain };
}

describe('native editing', () => {
  it('registers all normal editing accelerators', () => {
    const { controller, Menu } = fixture();
    controller.refreshMenu();
    const items = (Menu.buildFromTemplate.mock.calls[0] as any)[0][0].submenu;
    expect(items.filter((i: any) => i.role).map((i: any) => i.role)).toEqual(['undo', 'redo', 'cut', 'copy', 'paste', 'selectAll']);
    expect(items.find((i: any) => i.role === 'paste').accelerator).toBe('CommandOrControl+V');
    expect(Menu.setApplicationMenu).toHaveBeenCalledTimes(1);
  });
  it('disables menu accelerators in terminal/files and restores them in text', () => {
    const { contents, ipcMain } = fixture();
    for (const scope of ['terminal', 'files', 'text']) {
      ipcMain.emit('trace:editing-focus', { sender: contents }, scope);
      contents.emit('before-input-event');
      expect(contents.setIgnoreMenuShortcuts).toHaveBeenLastCalledWith(scope !== 'text');
    }
    ipcMain.emit('trace:editing-focus', { sender: contents }, 'unknown');
    expect(contents.setIgnoreMenuShortcuts).toHaveBeenLastCalledWith(false);
  });
  it('targets the clicked webContents for context-menu copy/paste, not another pane', () => {
    const { contents, Menu } = fixture();
    contents.emit('context-menu', {}, { isEditable: true, editFlags: { canCut: true, canCopy: true, canPaste: true } });
    const items = (Menu.buildFromTemplate.mock.calls[0] as any)[0];
    items.find((i: any) => i.label === 'Copy').click();
    items.find((i: any) => i.label === 'Paste').click();
    expect(contents.copy).toHaveBeenCalledTimes(1);
    expect(contents.paste).toHaveBeenCalledTimes(1);
  });
});
