import { EventEmitter } from 'node:events';
import { Readable, Writable } from 'node:stream';
/** The helper owner observes closure only after both output pipes finish. */
export interface NativeChild extends EventEmitter {
    stdin: Writable;
    stdout: Readable;
    stderr: Readable;
    readonly exitCode: number | null;
    readonly signalCode: NodeJS.Signals | null;
    kill(signal: NodeJS.Signals): boolean;
}
/**
 * Spawn with inherited token and Job restrictions; pipe creation never requests a new sandbox policy.
 * @param executable - Verified native helper executable.
 * @param args - Helper protocol arguments.
 * @param env - Filtered operation environment.
 * @returns Helper streams and process lifetime, with output drained before close.
 */
export declare function spawnNative(executable: string, args: string[], env: NodeJS.ProcessEnv): NativeChild;
//# sourceMappingURL=native-process.d.ts.map