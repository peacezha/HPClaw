import type { ReactNode } from 'react';
/**
 * Transient failure banner owned by the control that initiated the gesture,
 * so one failed request announces once, from the control the user pressed.
 * @returns `toast` owned by the control and `show` to announce one
 * failure with resolved copy; announcing again replays the banner.
 */
export declare function useOpenFailureToast(): {
    toast: ReactNode;
    show: (text: string) => void;
};
//# sourceMappingURL=open-failure-toast.d.ts.map