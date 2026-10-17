import type { Context } from '@deepseek-ai/cordis';
import { type AccountKey } from './locales.ts';
export type { AccountSectionInjected, AccountSectionProps } from './AccountSection.tsx';
export type { AccountMenuProps } from './AccountMenu.tsx';
export type { AccountSnapshot } from './AccountSection.tsx';
export type { AccountKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'settings.account': AccountKey;
    }
}
/** Services required by account settings. */
export declare const inject: string[];
/** Register account UI in Desktop and plain Web clients. @param ctx - client plugin context. */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map