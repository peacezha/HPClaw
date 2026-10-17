import type { DesktopOnboardingProps } from './onboarding-contract.ts';
/** The action requiring confirmation, including skipping directly from the credit page. */
export type OnboardingConfirmationKind = 'credit' | 'credit-skip' | 'skip';
/** @param props - confirmation action, localized copy and navigation callbacks. @returns a focus-contained dialog. */
export declare function OnboardingConfirmation({ kind, t, busy, canRecharge, onClose, onContinueSetup, onContinue, onRecharge, onSkip }: Pick<DesktopOnboardingProps, 't'> & {
    kind: OnboardingConfirmationKind;
    busy: boolean;
    canRecharge: boolean;
    onClose: () => void;
    onContinueSetup: () => void;
    onContinue: () => void;
    onRecharge: () => void;
    onSkip: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=OnboardingConfirmation.d.ts.map