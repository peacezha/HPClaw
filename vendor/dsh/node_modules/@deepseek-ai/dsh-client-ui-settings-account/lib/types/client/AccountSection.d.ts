import type { AccountDetails, AccountView, SignInAttemptId } from '@deepseek-ai/dsh-deepseek-account/types';
import type { PropsRuntime, PropsLocale, InjectFace, HostObservable } from '@deepseek-ai/dsh-client-ui-slots';
import type { ThemeSnapshot } from '@deepseek-ai/dsh-client-ui-theme/client';
import type { PlatformPages } from './platform-pages.ts';
import type { AccountAvatarSnapshot } from './account-avatar.ts';
import type { BonusNotice } from './bonus-notices.ts';
/** Safe account snapshot shared by the settings page and launcher. */
export interface AccountSnapshot {
    /** Server-authored notices in front-to-back order, absent when none are available. */
    notices?: readonly BonusNotice[];
    /** Latest Host state, absent until the stream responds. */
    view: AccountView | undefined;
    /** Sanitized profile and balance query outcomes, absent while loading. */
    details: Partial<AccountDetails> | undefined;
    /** Shared picture load; absent until a profile supplies a picture or after sign-out. */
    avatar: AccountAvatarSnapshot | undefined;
    /** Whether the state stream failed. */
    failed: boolean;
    /** Explicitly opened account dialog outside onboarding. */
    loginVisible?: boolean;
    /** Latest explicit start request failed before a Host state was available. */
    loginFailed?: boolean;
    /** Model credential onboarding owns the login dialog and delays bonus notices while mounted. */
    onboarding?: boolean;
    /** Desktop introduction covers the workspace during loading, saving, and exit animation.
     * True on Desktop until shell.overlay reports visibility, false in browsers; Desktop layouts must render that slot.
     */
    desktopOnboardingVisible?: boolean;
}
/** Host operations injected into the Cordis-free account component. */
export interface AccountSectionInjected {
    /** @param snapshot - picture attempt whose rendered image failed; superseded attempts are ignored. */
    avatarFailed: (snapshot: AccountAvatarSnapshot) => void;
    /** Subscribe to live credential-expiry notifications.
     * @param listener - callback after the current credential is removed.
     * @returns listener cleanup.
     */
    subscribeSessionExpired?: (listener: () => void) => () => void;
    /** Subscribe to live model sign-in guidance; the returned function removes the listener.
     * @param listener - callback for one rejected account-model request.
     * @returns listener cleanup.
     */
    subscribeModelSignInRequired?: (listener: () => void) => () => void;
    /** Desktop-only: show one page in the account feature's shared native host; absent in ordinary browsers. */
    openPlatformPage?: PlatformPages['open'];
    /** Account stream owned by the Host and theme snapshots published by the renderer, observed through framework hooks. */
    hooks: {
        account: HostObservable<AccountSnapshot>;
        /** Palette the Platform login pages follow. */
        theme: HostObservable<ThemeSnapshot>;
    };
    /**
     * Retry a failed avatar and read the profile, balance, bonus wallets and unnotified bonus once. The Settings launcher
     * calls it on each entry, and a page opener on return from top-up.
     * @returns after the account queries settle; image loading completes independently.
     */
    refreshAccount: () => Promise<void>;
    /** Open the external support questionnaire with the account, build and environment sampled by this click. */
    contactUs: () => void;
    /** Open or dismiss the login dialog. */
    showLogin: (visible: boolean) => void;
    /** Claim dialog ownership for the onboarding step. */
    setOnboarding: (active: boolean) => void;
    /** @param orderId - notice whose card finished a presented frame while visible. */
    bonusNoticeShown: (orderId: BonusNotice['orderId']) => void;
    /** @param orderId - notice the user closed. */
    bonusNoticeDismissed: (orderId: BonusNotice['orderId']) => void;
    /** @returns after the login attempt is created. */
    start: () => Promise<void>;
    /** @param id - attempt to cancel. @returns after cancellation or an already-admitted commit. */
    cancel: (id: SignInAttemptId) => Promise<void>;
    /** @returns whether a running task currently uses the account token. */
    hasRunningAccountTasks: () => Promise<boolean>;
    /** @returns after local account credentials are removed. */
    signOut: () => Promise<void>;
}
/** Composed account section props. */
export type AccountSectionProps = PropsRuntime<'settings.section'> & PropsLocale<'settings.account'> & InjectFace<AccountSectionInjected>;
/** @param props - localized actions, account subscription, and the shared Platform page channel. @returns account settings UI. */
export declare function AccountSection({ t, useAccount, useTheme, start, cancel, openPlatformPage, avatarFailed }: AccountSectionProps): import("react").JSX.Element;
//# sourceMappingURL=AccountSection.d.ts.map