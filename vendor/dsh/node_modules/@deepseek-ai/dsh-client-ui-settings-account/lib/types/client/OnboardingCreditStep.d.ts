/** Credit introduction retains the action ordering selected on first entry. */
import type { RefObject } from 'react';
import type { DesktopOnboardingProps } from './onboarding-contract.ts';
/** @param props - credit facts, localized content and recharge/navigation actions. @returns the credit step. */
export declare function OnboardingCreditStep({ t, locale, heading, busy, funded, canRecharge, onContinue, onRecharge, onLater }: Pick<DesktopOnboardingProps, 't' | 'locale'> & {
    heading: RefObject<HTMLHeadingElement>;
    busy: boolean;
    funded: boolean;
    canRecharge: boolean;
    onContinue: () => void;
    onRecharge: () => void;
    onLater: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=OnboardingCreditStep.d.ts.map