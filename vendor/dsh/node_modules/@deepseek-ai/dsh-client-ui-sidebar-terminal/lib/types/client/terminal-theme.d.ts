/** DSH defaults and application OSC colors for one xterm screen. */
import type { IDisposable, Terminal } from '@xterm/xterm';
/** Keep program color overrides separate from the DSH defaults used by OSC resets. */
export declare class TerminalTheme implements IDisposable {
    private readonly terminal;
    private defaults;
    private readonly indexed;
    private readonly special;
    private readonly subscriptions;
    /**
     * Observe complete OSC commands without consuming xterm's queries or color handling.
     * @param terminal - opened emulator owned by the mounted screen.
     */
    constructor(terminal: Terminal);
    /**
     * Apply changed DSH colors without replacing application-defined palette entries.
     * @param background - resolved opaque DSH background.
     * @param foreground - resolved DSH text color.
     */
    update(background: string, foreground: string): void;
    /** Preferred cursor color after the initial DSH update, including OSC 12 overrides. */
    get cursor(): string;
    /** Remove parser observers before the emulator is disposed. */
    dispose(): void;
    private apply;
}
//# sourceMappingURL=terminal-theme.d.ts.map