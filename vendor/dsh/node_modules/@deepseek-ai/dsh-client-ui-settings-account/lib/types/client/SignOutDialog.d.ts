import type { AccountKey } from './locales.ts';
/** @param props - task impact at opening, localized copy, and account actions. @returns sign-out confirmation. */
export declare function SignOutDialog({ running, signOut, close, t }: {
    running: boolean | 'unknown';
    signOut: () => Promise<void>;
    close: () => void;
    t: (key: AccountKey) => string;
}): import("react").JSX.Element;
//# sourceMappingURL=SignOutDialog.d.ts.map