/** Node child execution over an inherited control channel; no Harness services run here. */
import type { Duplex } from 'node:stream';
import type { PatchableStream } from './bootstrap.ts';
/** Process-owned environment and output streams consumed by the child bootstrap. */
export interface ProgramProcess {
    env: NodeJS.ProcessEnv;
    stdout: PatchableStream;
    stderr: PatchableStream;
    exitCode: string | number | null | undefined;
}
/**
 * Run one host-supplied program after the control handshake.
 * @param stream - Inherited, already-adopted control endpoint.
 * @param maxMessageBytes - Host-validated maximum frame and queued-write bytes.
 * @param processState - Environment, output streams and exit status of this Node child.
 * @returns After control output flushes and host shutdown is observed, or transport failure closes the channel.
 */
export declare function runNodeMain(stream: Duplex, maxMessageBytes: number, processState: ProgramProcess): Promise<void>;
//# sourceMappingURL=process.d.ts.map