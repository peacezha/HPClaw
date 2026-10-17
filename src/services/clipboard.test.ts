// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readClipboardText, writeClipboardText } from './clipboard';

afterEach(() => {
  delete window.traceDesktop;
  document.body.innerHTML = '';
  document.getSelection()?.removeAllRanges();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('clipboard', () => {
  it('uses desktop IPC rather than the browser permission API', async () => {
    const writeText = vi.fn(async () => {});
    const readText = vi.fn(async () => 'native');
    window.traceDesktop = { clipboard: { writeText, readText } } as any;
    await writeClipboardText('a\tb\n/public/home/中文样本');
    expect(writeText).toHaveBeenCalledWith('a\tb\n/public/home/中文样本');
    expect(await readClipboardText()).toBe('native');
  });
  it('copies the exact text on HTTP while preserving the input focus and caret', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('permission')) } });
    const input = document.createElement('input');
    input.value = 'original'; document.body.append(input); input.focus(); input.setSelectionRange(1, 4);
    const exec = vi.fn(() => {
      expect((document.activeElement as HTMLTextAreaElement).value).toBe('a\tb\n');
      return true;
    });
    Object.defineProperty(document, 'execCommand', { configurable: true, value: exec });
    await writeClipboardText('a\tb\n');
    expect(exec).toHaveBeenCalledWith('copy');
    expect(document.activeElement).toBe(input);
    expect([input.selectionStart, input.selectionEnd]).toEqual([1, 4]);
    expect(document.querySelector('textarea')).toBeNull();
  });
  it('does not report success when all copying methods fail', async () => {
    vi.stubGlobal('navigator', {});
    Object.defineProperty(document, 'execCommand', { configurable: true, value: () => false });
    await expect(writeClipboardText('text')).rejects.toThrow('Clipboard copy failed');
    expect(document.querySelector('textarea')).toBeNull();
    await expect(readClipboardText()).rejects.toThrow('native paste');
  });
  it('preserves selected chat text after fallback copying', async () => {
    vi.stubGlobal('navigator', {});
    const p = document.createElement('p'); p.textContent = 'selected chat'; document.body.append(p);
    const range = document.createRange(); range.selectNodeContents(p);
    document.getSelection()?.addRange(range);
    Object.defineProperty(document, 'execCommand', { configurable: true, value: () => true });
    await writeClipboardText('template');
    expect(document.getSelection()?.toString()).toBe('selected chat');
  });
});
