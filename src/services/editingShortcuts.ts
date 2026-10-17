export type EditingScope = 'text' | 'terminal' | 'files';

export function isTextEditingTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('input, textarea, [contenteditable]:not([contenteditable="false"])'));
}

export function editingScopeFor(target: EventTarget | null): EditingScope {
  if (!(target instanceof Element)) return 'text';
  // xterm's hidden textarea is a terminal input, not a normal text field.
  if (target.closest('.xterm')) return 'terminal';
  if (isTextEditingTarget(target)) return 'text';
  return target.closest('[data-shortcut-scope="files"]') ? 'files' : 'text';
}

/** Native Edit-menu accelerators are disabled only in panes with custom keys. */
export function installEditingFocusRouting(): () => void {
  const editing = window.traceDesktop?.editing;
  if (!editing) return () => {};
  let current: EditingScope | undefined;
  const send = (scope: EditingScope) => {
    if (current !== scope) { current = scope; editing.setFocusScope(scope); }
  };
  const focus = (event: Event) => send(editingScopeFor(event.target));
  const selection = () => {
    const selected = document.getSelection();
    if (selected?.toString() && selected.anchorNode?.parentElement && !selected.anchorNode.parentElement.closest('.xterm')) send('text');
    else send(editingScopeFor(document.activeElement));
  };
  document.addEventListener('focusin', focus, true);
  document.addEventListener('pointerdown', focus, true);
  document.addEventListener('selectionchange', selection);
  send(editingScopeFor(document.activeElement));
  return () => {
    document.removeEventListener('focusin', focus, true);
    document.removeEventListener('pointerdown', focus, true);
    document.removeEventListener('selectionchange', selection);
  };
}
