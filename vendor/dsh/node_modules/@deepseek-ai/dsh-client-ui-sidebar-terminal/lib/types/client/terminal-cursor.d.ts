/** Contrast-aware styling for xterm's DOM cursor, independent of its ANSI palette. */
import type { IDisposable, Terminal } from '@xterm/xterm';
/**
 * Keep the cursor visible on default, indexed, true-color and inverse cell backgrounds.
 * @param terminal - opened DOM-rendered emulator.
 * @param node - screen root containing the emulator and scoped cursor CSS variables.
 * @param preferredCursor - current DSH or application cursor color.
 * @returns listener disposer; no terminal input or palette changes are emitted.
 */
export declare function observeTerminalCursor(terminal: Terminal, node: HTMLElement, preferredCursor: () => string): IDisposable;
//# sourceMappingURL=terminal-cursor.d.ts.map