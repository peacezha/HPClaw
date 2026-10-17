/** Shortcut reference plugin; commands and entry points share one declared store. */
import type { Context } from '@deepseek-ai/cordis';
import { zh } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Shortcut reference and settings entry copy. */
        shortcuts: keyof typeof zh;
    }
}
/** Required command, locale, and slot services. */
export declare const inject: string[];
/**
 * Register the reference command, settings row, and single shell overlay.
 * @param ctx - plugin-owned client context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map