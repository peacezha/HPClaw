/** Bounded drainage for raw process output after managed execution ends. */
import type { Readable } from 'node:stream';
import type { SubprocessHandle } from '@deepseek-ai/dsh-subprocess';
/**
 * Wait for queued bytes without letting an inherited descriptor retain a run forever.
 * @param stream - Caller-owned raw process output, when provided.
 * @param graceMs - Maximum wait after managed process termination.
 * @returns Whether the complete stream ended without a transport error.
 */
export declare function drainOutput(stream: Readable | undefined, graceMs: number): Promise<boolean>;
/**
 * Terminate a managed process and drain its pipes, including failures before output listeners attach.
 * @param handle - Process and streams owned by the runtime.
 * @param graceMs - Maximum pipe-drain wait after managed exit.
 * @returns Whether both output streams ended cleanly.
 */
export declare function terminateProcess(handle: SubprocessHandle, graceMs: number): Promise<boolean>;
//# sourceMappingURL=output-stream.d.ts.map