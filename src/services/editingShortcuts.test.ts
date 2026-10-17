// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { editingScopeFor, installEditingFocusRouting } from './editingShortcuts';

afterEach(() => { delete window.traceDesktop; document.body.innerHTML = ''; document.getSelection()?.removeAllRanges(); });

describe('editing focus routing', () => {
  it('distinguishes file panes, normal editors and the xterm textarea', () => {
    document.body.innerHTML = '<div data-shortcut-scope="files"><button>file</button><input><div contenteditable="true"></div></div><div class="xterm"><textarea></textarea></div>';
    expect(editingScopeFor(document.querySelector('button'))).toBe('files');
    expect(editingScopeFor(document.querySelector('input'))).toBe('text');
    expect(editingScopeFor(document.querySelector('[contenteditable]'))).toBe('text');
    expect(editingScopeFor(document.querySelector('textarea'))).toBe('terminal');
  });
  it('restores text editing when moving from terminal to chat and unregisters listeners', () => {
    const setFocusScope = vi.fn();
    window.traceDesktop = { editing: { setFocusScope } } as any;
    document.body.innerHTML = '<div class="xterm"><textarea></textarea></div><input>';
    const dispose = installEditingFocusRouting();
    document.querySelector('textarea')!.focus();
    expect(setFocusScope).toHaveBeenLastCalledWith('terminal');
    document.querySelector('input')!.focus();
    expect(setFocusScope).toHaveBeenLastCalledWith('text');
    dispose(); setFocusScope.mockClear(); document.querySelector('textarea')!.focus();
    expect(setFocusScope).not.toHaveBeenCalled();
  });
});
