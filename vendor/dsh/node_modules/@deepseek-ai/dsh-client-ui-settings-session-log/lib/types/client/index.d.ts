/** General settings companion for the Host Session-log upload configuration. */
import type { Context } from '@deepseek-ai/cordis';
import { en } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** API Session-log preference copy. */
        'settings.sessionLog': keyof typeof en;
    }
}
/** Services used by the browser companion. */
export declare const inject: string[];
/**
 * Register the preference while its Host configuration is available.
 * @param ctx - browser plugin context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map