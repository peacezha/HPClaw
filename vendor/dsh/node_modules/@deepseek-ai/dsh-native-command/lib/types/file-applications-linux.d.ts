import type { NativeCommandRunner } from './runner.ts';
import type { NativeFileApplication } from './types.ts';
/**
 * Query all registered file handlers from GIO without executing desktop-entry command text.
 * @param path - verified local file path.
 * @param signal - caller cancellation.
 * @param run - native command runner.
 * @param env - XDG and locale settings.
 * @returns registered applications with the desktop's default marked.
 */
export declare function linuxFileApplications(path: string, signal: AbortSignal, run: NativeCommandRunner, env: NodeJS.ProcessEnv): Promise<readonly NativeFileApplication[]>;
//# sourceMappingURL=file-applications-linux.d.ts.map