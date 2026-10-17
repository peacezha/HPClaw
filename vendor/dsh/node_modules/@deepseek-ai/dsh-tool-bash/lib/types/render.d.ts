/**
 * Model-facing result rendering for the bash tool.
 *
 * @module @deepseek-ai/dsh-tool-bash/render
 */
import type { ShellRunResult, ShellSandboxInfo } from '@deepseek-ai/dsh-shell';
import type { SandboxMode } from '@deepseek-ai/dsh-sandbox';
/**
 * Shape one finished run into the text the model sees: stdout, then a marked
 * stderr section, then exit-status markers. Non-zero exits are reported, not
 * errored — the model decides how to react; only infrastructure failures
 * (spawn errors, aborts) surface as isError results.
 * @param result - the completed foreground run from the executor.
 * @param escalationModes - the escalation targets this composition advertises;
 *   non-empty adds the same-turn escalation hint after a denial marker
 *   (default `[]`: no hint).
 * @returns the model-facing text: output body (or `(no output)`), then any timeout/stopped/signal/exit markers, each on its own line.
 */
export declare function renderResult(result: ShellRunResult & {
    stopped?: string;
}, escalationModes?: readonly SandboxMode[]): string;
/**
 * Shape a foreground call that stopped waiting into the text the model sees:
 * the output captured so far (one consuming registry read taken at that
 * point, so `job_output` continues exactly after it), then the still-running
 * marker and the job hand-off guidance.
 * @param promoted - the promoted result value: the job id, the wait that
 *   expired, and the output so far.
 * @returns the model-facing text for a promoted call.
 */
export declare function renderPromoted(promoted: {
    jobId: string;
    timeoutMs: number;
    output: string;
}): string;
/**
 * Shape the one consuming registry read a foreground call embeds in its
 * result when it stops waiting: the output produced so far, plus the
 * dropped-output notice (naming the job's spill files) when the model cursor
 * fell behind the ring, and the sandbox notices. Later `job_output` reads
 * render the same ring through the job tools.
 * @param delta - the read's chunks as rendered text.
 * @param lossy - whether bytes before the delta were evicted unread.
 * @param spillPaths - the complete-stream files the job currently advertises.
 * @param sandbox - settled sandbox facts, when this was a confined process.
 * @param escalationModes - escalation targets advertised by this composition.
 * @returns the delta text with any loss or sandbox notice appended.
 */
export declare function renderJobRead(delta: string, lossy: boolean, spillPaths: readonly string[], sandbox?: ShellSandboxInfo, escalationModes?: readonly SandboxMode[]): string;
/**
 * The exit-status parse is the shared marker-contract half of the shell-tool
 * rendering story, owned by `@deepseek-ai/dsh-shell` so `dsh-tool-pwsh` reuses
 * it (its renderer emits the same markers). Re-exported here to keep
 * `../src/render.ts` a single import root for bash-tool consumers.
 */
export { parseExitStatus, type ParsedExitStatus } from '@deepseek-ai/dsh-shell';
//# sourceMappingURL=render.d.ts.map