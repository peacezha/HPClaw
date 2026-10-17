import { type Duplex } from 'node:stream';
import type { PatchableStream } from './bootstrap.ts';
/** Process state owned by the REPL child; tests supply instance-local streams and environment. */
export interface PersistentProcess {
    env: NodeJS.ProcessEnv;
    stdout: PatchableStream;
    stderr: PatchableStream;
    chdir(directory: string): void;
}
/**
 * Serve sequential evaluations until the owning host closes the control channel.
 * @param stream - Inherited private control endpoint.
 * @param maxMessageBytes - Maximum control frame and queued output bytes.
 * @param processState - Child environment, output and directory control, bound only in the REPL context.
 * @returns After the channel closes and the REPL releases its streams.
 */
export declare function runPersistentMain(stream: Duplex, maxMessageBytes: number, processState: PersistentProcess): Promise<void>;
//# sourceMappingURL=persistent-process.d.ts.map