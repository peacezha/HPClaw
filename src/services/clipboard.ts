/** Desktop IPC does not require the renderer to be focused or HTTPS. */
export async function writeClipboardText(text: string): Promise<void> {
  const desktop = window.traceDesktop?.clipboard;
  if (desktop?.writeText) {
    await desktop.writeText(text);
    return;
  }
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(text); return; } catch { /* Legacy HTTP/permission fallback. */ }
  }
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const caret = focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement
    ? { start: focused.selectionStart, end: focused.selectionEnd, direction: focused.selectionDirection } : null;
  const selection = document.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : [];
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.readOnly = true;
  textarea.style.cssText = 'position:fixed;left:-10000px;top:0;opacity:0';
  document.body.append(textarea);
  try {
    textarea.focus({ preventScroll: true });
    textarea.select();
    if (!document.execCommand?.('copy')) throw new Error('Clipboard copy failed');
  } finally {
    textarea.remove();
    focused?.focus({ preventScroll: true });
    if (caret && (focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement) && caret.start !== null && caret.end !== null) {
      focused.setSelectionRange(caret.start, caret.end, caret.direction || undefined);
    }
    if (selection) { selection.removeAllRanges(); for (const range of ranges) selection.addRange(range); }
  }
}

export async function readClipboardText(): Promise<string> {
  if (window.traceDesktop?.clipboard?.readText) return window.traceDesktop.clipboard.readText();
  if (navigator.clipboard?.readText) return navigator.clipboard.readText();
  throw new Error('Clipboard read is unavailable; use the native paste shortcut');
}
