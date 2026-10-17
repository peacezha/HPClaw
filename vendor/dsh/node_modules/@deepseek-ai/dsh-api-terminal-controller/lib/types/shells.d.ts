/** Shell selection and executable verification use the target execution provider. */
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess';
import type { TerminalShell } from './types.ts';
/**
 * Resolve the configured shell or the execution environment's default shell.
 * @param subprocess - target execution provider.
 * @param configured - optional profile overriding the environment's default shell.
 * @param signal - resolution cancellation.
 * @returns one verified shell; a declared default that cannot resolve rejects.
 */
export declare function resolveShell(subprocess: SubprocessRuntime, configured: TerminalShell | undefined, signal: AbortSignal): Promise<TerminalShell>;
/**
 * List verified candidates after the configured or environment-default shell, one per executable name ignoring case and `.exe`.
 * PATH lookup can reach the default through another directory, such as `/usr/bin/bash` for `/bin/bash` on merged-`/usr` systems.
 * @param subprocess - target execution provider.
 * @param configured - optional default profile.
 * @param candidates - executable names or paths permitted for shell selection.
 * @param signal - discovery cancellation.
 * @returns installed shells with the default first, keeping the earliest entry per name; transport failures reject.
 */
export declare function discoverShells(subprocess: SubprocessRuntime, configured: TerminalShell | undefined, candidates: readonly string[], signal: AbortSignal): Promise<TerminalShell[]>;
//# sourceMappingURL=shells.d.ts.map