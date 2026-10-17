/** Welcome page with a required explicit start. */
import type { RefObject } from 'react';
import type { DesktopOnboardingProps } from './onboarding-contract.ts';
/** @param props - localized content, focus target and navigation. @returns the welcome step. */
export declare function OnboardingWelcomeStep({ t, locale, heading, busy, onStart }: Pick<DesktopOnboardingProps, 't' | 'locale'> & {
    heading: RefObject<HTMLHeadingElement>;
    busy: boolean;
    onStart: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=OnboardingWelcomeStep.d.ts.map