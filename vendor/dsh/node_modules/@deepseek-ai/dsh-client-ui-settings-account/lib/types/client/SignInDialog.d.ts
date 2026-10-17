import type { AccountSnapshot } from './AccountSection.tsx';
import type { SignInAttemptId } from '@deepseek-ai/dsh-deepseek-account/types';
import type { AccountKey } from './locales.ts';
/** @param props - safe account state, localized copy, and user actions. @returns login dialog. */
export declare function SignInDialog({ account, colorScheme, start, cancel, close, useApiKey, t }: {
    account: AccountSnapshot;
    /** Resolved scheme of the active application theme; the copied link carries it. */
    colorScheme: 'light' | 'dark';
    start: () => Promise<void>;
    cancel: (id: SignInAttemptId) => Promise<void>;
    close: () => void;
    useApiKey: () => void;
    t: (key: AccountKey) => string;
}): import("react").JSX.Element;
//# sourceMappingURL=SignInDialog.d.ts.map