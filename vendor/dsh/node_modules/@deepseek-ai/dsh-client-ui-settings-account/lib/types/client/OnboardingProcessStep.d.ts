/** Work-detail choices with radio-group keyboard navigation. */
import type { RefObject } from 'react';
import type { OnboardingProcess } from '../onboarding-settings.ts';
import type { DesktopOnboardingProps } from './onboarding-contract.ts';
/** @param props - selected detail, localized copy and persistence callbacks. @returns the process step. */
export declare function OnboardingProcessStep({ t, heading, busy, process, onSelect, onComplete }: Pick<DesktopOnboardingProps, 't'> & {
    heading: RefObject<HTMLHeadingElement>;
    busy: boolean;
    process: OnboardingProcess | null;
    onSelect: (value: OnboardingProcess) => void;
    onComplete: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=OnboardingProcessStep.d.ts.map