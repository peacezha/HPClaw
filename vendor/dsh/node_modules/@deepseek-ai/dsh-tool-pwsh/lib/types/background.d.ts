/**
 * Generic-job adaptation for pwsh process handles — the shell-agnostic twin
 * of `dsh-tool-bash`'s background adaptation: the terminal
 * outcome the registry records and the pull sources it pumps.
 *
 * @module @deepseek-ai/dsh-tool-pwsh/background
 */
import type { SandboxMode } from '@deepseek-ai/dsh-sandbox';
import type { ShellProcess } from '@deepseek-ai/dsh-shell';
import type { JobChunk, JobHooks, JobOutcome, JobOutputSource } from '@deepseek-ai/dsh-jobs';
/**
 * Map a settled background process onto the generic job-outcome vocabulary:
 * `killed` stays `killed` (detail: the signal when one is known), everything
 * else is `completed` with the exit code as detail. A nonzero command exit is
 * reported, not failed, exactly like the foreground rendering. Sandbox facts
 * join the detail, since a job's terminal reason is the one line every
 * reader — the model's status line, the roster row — shows.
 * @param proc - the settled process handle.
 * @param escalationModes - escalation targets advertised by this composition.
 * @returns the outcome for the `ctx.jobs` registration.
 */
export declare function processOutcome(proc: ShellProcess, escalationModes?: readonly SandboxMode[]): JobOutcome;
/**
 * The process's non-consuming stream readers as registry pull sources. They
 * bind lazily because the process is spawned inside the starter, after the
 * registry admitted the job; a read before the spawn yields nothing, and the
 * pump keeps the model's consuming cursor untouched. A rejected spawn's
 * stderr reader carries the provider's `subprocess failed before reporting an
 * outcome: …` note.
 * @param proc - the started process's observed streams, once the starter has spawned it.
 * @returns one source per stream, stdout first.
 */
export declare function processSources(proc: () => Pick<ShellProcess, 'observed'> | undefined): JobOutputSource[];
/**
 * The ring chunks of one consuming registry read as the shell tools render a
 * process read: stdout chunks in order, then every stderr chunk in one
 * `[stderr]` section, so the output a foreground call hands over when it
 * stops waiting reads exactly like the `job_output` reads that follow it.
 * @param chunks - the chunks since the model cursor, in offset order.
 * @returns the delta text, possibly empty.
 */
export declare function ringDelta(chunks: readonly JobChunk[]): string;
/**
 * Adapt asynchronous shell preparation after job admission without exposing a partial process.
 * @param start - starts the process with job-owned cancellation.
 * @param outcome - projects the settled process into the job outcome.
 * @returns synchronous job hooks whose completion includes preparation and process settlement.
 */
export declare function processJob(start: (signal: AbortSignal) => Promise<ShellProcess>, outcome: (process: ShellProcess) => JobOutcome): JobHooks;
//# sourceMappingURL=background.d.ts.map