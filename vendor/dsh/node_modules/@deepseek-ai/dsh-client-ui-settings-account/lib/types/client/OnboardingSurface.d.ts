import type { ReactNode } from 'react';
/**
 * Render a body-portaled onboarding stage and keep the application root inert
 * while mounted. Completion reveals the root beneath a fading stage;
 * native titlebar controls, dialogs, and account pages remain above the stage.
 * @param props.children - the step's page content, centered on the stage.
 * @param props.exiting - reveal the application while the owner retains the stage for its 180ms exit.
 * @returns the body-portaled overlay tree.
 */
export declare function OnboardingSurface({ children, exiting }: {
    children: ReactNode;
    exiting?: boolean;
}): import("react").ReactPortal;
//# sourceMappingURL=OnboardingSurface.d.ts.map