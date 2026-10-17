/** Same-origin Inspector key delivery through the parent window's command adapter. */
import type { ShortcutCatalogEntry } from '@deepseek-ai/dsh-client-shortcuts/client';
/**
 * Forward the Inspector's current binding without replacing parent command arbitration.
 * @param frame - Owned DevTools iframe.
 * @param readBinding - Current effective Inspector binding, including user overrides.
 * @returns Release load and document listeners.
 */
export declare function bindInspectorKeyboard(frame: HTMLIFrameElement, readBinding: () => ShortcutCatalogEntry['binding'] | undefined): () => void;
//# sourceMappingURL=keyboard.d.ts.map