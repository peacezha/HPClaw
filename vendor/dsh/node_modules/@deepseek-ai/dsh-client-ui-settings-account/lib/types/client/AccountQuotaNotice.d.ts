import type { InjectFace, HostObservable, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { QuotaNoticeOwnerProps } from '@deepseek-ai/dsh-client-ui-chat/client';
import type { AccountSnapshot } from './AccountSection.tsx';
import type { PlatformPageClaim, PlatformPages } from './platform-pages.ts';
/** Injected share of the account route's frame-wide quota notice entry. */
export interface AccountQuotaNoticeInjected {
    /** Desktop-only: show one page in the account feature's shared native host; absent in ordinary browsers. */
    openPlatformPage?: PlatformPages['open'];
    hooks: {
        account: HostObservable<AccountSnapshot>;
        /** The page the shared host is showing, or null while it is closed. */
        platformPage: HostObservable<PlatformPageClaim | null>;
    };
}
type AccountQuotaNoticeProps = PropsRuntime<'shell.quota-notice'> & {
    matched: QuotaNoticeOwnerProps;
} & PropsLocale<'settings.account'> & InjectFace<AccountQuotaNoticeInjected>;
/**
 * @param props - the claimed notice, account state, and the shared Platform page channel.
 * @returns the balance Modal, nothing while awaiting account state or a Platform page's return, or the fallback Toast.
 */
export declare function AccountQuotaNotice({ matched, openPlatformPage, useAccount, usePlatformPage, t }: AccountQuotaNoticeProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=AccountQuotaNotice.d.ts.map