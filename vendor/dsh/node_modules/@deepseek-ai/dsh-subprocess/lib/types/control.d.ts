/** Inherited byte-channel protocol shared by subprocess launchers and Node children. */
import type { Duplex } from 'node:stream';
/** Child descriptor reserved for the optional subprocess control channel. */
export declare const SUBPROCESS_CONTROL_FD = 7;
/** Private launch marker consumed before a Node child executes application code. */
export declare const SUBPROCESS_CONTROL_ENV: "DSH_SUBPROCESS_CONTROL";
/**
 * Consume the launch marker and open the inherited control pipe at fd 7.
 * The returned stream owns the descriptor. Call once before executing untrusted code;
 * messages remain untrusted even though the endpoint was inherited.
 * @returns a connected byte-mode duplex stream owned by the caller.
 * @throws when the marker is missing/invalid or the inherited descriptor cannot be opened.
 */
export declare function openInheritedControlChannel(): Duplex;
//# sourceMappingURL=control.d.ts.map