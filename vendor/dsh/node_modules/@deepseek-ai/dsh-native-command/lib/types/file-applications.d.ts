import type { PathOpenerInternals } from './path-opener.ts';
import { type NativeFileApplication } from './types.ts';
/**
 * List registered handlers in OS preference order, including the current default and application icons.
 * @param path - verified absolute local file path.
 * @param signal - caller lifetime, propagated to the OS query.
 * @param internals - platform and command adapter for deterministic tests.
 * @returns current file handlers; on macOS, copies sharing a bundle identifier and display name collapse
 * to one entry; an empty list when the platform has no association query.
 */
export declare function nativeFileApplications(path: string, signal: AbortSignal, internals?: PathOpenerInternals): Promise<readonly NativeFileApplication[]>;
/**
 * Open a file in a currently registered handler; stale or arbitrary application identifiers are rejected.
 * Validation checks the complete registered list, so macOS copies collapsed out of the display list stay openable.
 * @param path - verified absolute local file path.
 * @param application - identifier returned by the file association query.
 * @param signal - caller lifetime, propagated to query and launch.
 * @param internals - platform and command adapter for deterministic tests.
 * @returns after the system launcher accepts the file.
 */
export declare function openNativeFileApplication(path: string, application: string, signal: AbortSignal, internals?: PathOpenerInternals): Promise<void>;
//# sourceMappingURL=file-applications.d.ts.map