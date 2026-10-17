/** Menu reservations contributed by the product's shortcut reference integration. */
import type { ShortcutFixedCommand } from '@deepseek-ai/dsh-client-shortcuts/client';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
/**
 * Describe shared menu actions for display and conflict checking.
 * @param t - shortcut dictionary.
 * @returns read-only actions and each physical combination they occupy.
 */
export declare function fixedCommands(t: PropsLocale<'shortcuts'>['t']): readonly ShortcutFixedCommand[];
//# sourceMappingURL=fixed.d.ts.map