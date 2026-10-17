import type { ReactNode } from 'react';
import type { ShortcutCatalogEntry } from '@deepseek-ai/dsh-client-shortcuts/client';
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots';
import type { OpenInAppPathFailure } from './open-path.ts';
import type { NS } from './locales.ts';
/** Application metadata supplied by either the directory catalog or a file association query. */
export interface OpenTargetApplication {
    readonly id: string;
    readonly name: string;
    readonly icon: string | null;
}
/** Opening intent; default selection remains owned by the target's adapter. */
export type OpenTargetOperation = {
    readonly kind: 'default';
} | {
    readonly kind: 'application';
    readonly id: string;
} | {
    readonly kind: 'reveal';
};
/** Inputs shared by both target adapters and the file empty-state action. */
export interface OpenTargetButtonProps {
    readonly shortcut?: Pick<ShortcutCatalogEntry, 'keys' | 'aria'> | undefined;
    readonly kind: 'file' | 'directory';
    readonly applications: readonly OpenTargetApplication[];
    readonly defaultId: string | undefined;
    readonly failed: boolean;
    readonly busy?: boolean;
    readonly loading?: boolean;
    readonly prominent?: boolean;
    readonly t: TranslateNS<typeof NS>;
    readonly execute: (operation: OpenTargetOperation) => Promise<OpenInAppPathFailure | null>;
    readonly refresh?: () => void;
}
/**
 * Serialize gestures and announce their failures through the initiating control's toast.
 * @param execute - target adapter that returns the failure to announce, or null.
 * @param t - localized control copy.
 * @returns the pending state, feedback, and guarded action callback.
 */
export declare function useOpenTargetGesture(execute: OpenTargetButtonProps['execute'], t: TranslateNS<typeof NS>): {
    pending: boolean;
    toast: ReactNode;
    act: (operation: OpenTargetOperation) => void;
};
/**
 * Render identical split buttons for files and directories. File reveal always
 * stays last; it is the default only when no application is registered.
 * @param props - target applications, default selection, and operations.
 * @returns the control and its transient failure feedback.
 */
export declare function OpenTargetButton(props: OpenTargetButtonProps): ReactNode;
//# sourceMappingURL=OpenTargetButton.d.ts.map