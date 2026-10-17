import type { NativeCommandRunner } from './runner.ts';
/**
 * Execute the Windows Shell adapter in a Unicode STA PowerShell process; the adapter
 * source is a private temporary script file, removed once the call settles.
 * @param path - Windows file path, translated by the caller for WSL.
 * @param application - registered handler to invoke; null requests the application list.
 * @param signal - caller cancellation.
 * @param run - native command runner.
 * @returns adapter output; query mode emits a JSON array.
 */
export declare function windowsFileApplications(path: string, application: string | null, signal: AbortSignal, run: NativeCommandRunner): Promise<string>;
//# sourceMappingURL=file-applications-windows.d.ts.map