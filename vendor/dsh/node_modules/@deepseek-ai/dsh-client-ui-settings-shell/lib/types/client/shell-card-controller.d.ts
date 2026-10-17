/** The shell page's staged form over the composed shell executor entry. */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import { type SettingsFieldState, type SettingsFormActions, type SettingsFormScope, type SettingsFormShell } from '@deepseek-ai/dsh-client-ui-primitives';
/** Profile entry id of the POSIX shell executor; the base bundle composes it off Windows. */
export declare const BASH_NS = "bash-sandbox";
/** Profile entry id of the PowerShell executor; the base bundle composes it on Windows. */
export declare const PWSH_NS = "pwsh-sandbox";
/** The shell fields this page edits — a subset of the served schema by design. */
export interface ShellSettings {
    /** Foreground command timeout in milliseconds. */
    timeoutMs?: number;
    /** Per-stream in-memory output cap in bytes. */
    maxOutputBytes?: number;
}
/** What the shell page renders. */
export interface ShellCardState extends SettingsFormShell {
    /** Command timeout in milliseconds. */
    timeoutMs: SettingsFieldState;
    /** Per-stream output cap in bytes. */
    maxOutputBytes: SettingsFieldState;
}
/** The registration-side face the shell page's slot entry injects. */
export interface ShellCardFace extends SettingsFormActions {
    hooks: {
        /** Page snapshot bound by the renderer as useShellCard. */
        shellCard: SnapshotStore<ShellCardState>;
    };
}
/** Bridges one shell executor entry's form onto the page's staged form. */
export declare class ShellCardController {
    private readonly form;
    private readonly store;
    /** @param scope - the shared configuration form of the composed shell executor entry. */
    constructor(scope: SettingsFormScope<ShellSettings>);
    private projection;
    /**
     * Build the face the page's slot registration injects.
     * @returns the page's snapshot and its form actions.
     */
    inject(): ShellCardFace;
    /** Release the form subscription. */
    dispose(): void;
}
//# sourceMappingURL=shell-card-controller.d.ts.map