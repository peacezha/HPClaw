/** Localized failures shared by direct removal and inline shortcut editing. */
import type { ShortcutConfigSnapshot, ShortcutRuntime, ShortcutSaveResult } from '@deepseek-ai/dsh-client-shortcuts/protocol';
import type { ShortcutCatalogEntry } from '@deepseek-ai/dsh-client-shortcuts/client';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
/**
 * Identify the unreadable preferences, their recovery path, and the bindings still in use.
 * @param config - failed read and last accepted preferences.
 * @param runtime - storage owner whose location and reload action to show.
 * @param t - shortcut dictionary.
 * @returns localized recovery guidance without replacing the stored document.
 */
export declare function shortcutReadFailure(config: ShortcutConfigSnapshot, runtime: ShortcutRuntime, t: PropsLocale<'shortcuts'>['t']): string;
/**
 * Describe an unsuccessful preference write without losing command names.
 * @param result - rejected operation result.
 * @param catalog - current command labels.
 * @param t - shortcut dictionary.
 * @param runtime - storage owner for unreadable-document recovery guidance.
 * @returns localized diagnosis for a system toast and accessible field description.
 */
export declare function shortcutFailure(result: ShortcutSaveResult, catalog: readonly Pick<ShortcutCatalogEntry, 'id' | 'label'>[], t: PropsLocale<'shortcuts'>['t'], runtime: ShortcutRuntime): string;
//# sourceMappingURL=feedback.d.ts.map