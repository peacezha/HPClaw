import type { RefObject } from 'react';
import type { OnboardingPurpose } from '../onboarding-settings.ts';
import type { DesktopOnboardingProps } from './onboarding-contract.ts';
/** @param props - selected purposes, localized copy and persistence callbacks. @returns the purpose step. */
export declare function OnboardingPurposeStep({ t, heading, busy, purpose, onSelect, onContinue }: Pick<DesktopOnboardingProps, 't'> & {
    heading: RefObject<HTMLHeadingElement>;
    busy: boolean;
    purpose: OnboardingPurpose | null;
    onSelect: (value: OnboardingPurpose | null) => void;
    onContinue: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=OnboardingPurposeStep.d.ts.map