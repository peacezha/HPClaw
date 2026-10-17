/** Fixed reasons exposed instead of command output or raw errors. */
export type MissingReason = 'unavailable' | 'invalid-value' | 'query-failed' | 'timeout' | 'output-limit' | 'unsupported';
/** Successful stdout or an isolated query failure. */
export type QueryResult = {
    kind: 'value';
    stdout: string;
} | {
    kind: 'missing';
    reason: MissingReason;
};
/** Deployment limits and the owning analytics lifetime. */
export interface QueryOptions {
    /** Maximum execution time of each query, in milliseconds. */
    timeoutMillis: number;
    /** Maximum bytes captured from either output stream. */
    maxOutputBytes: number;
    /** Disposal aborts the command and waits for its close event. */
    signal: AbortSignal;
}
/**
 * Execute fixed argv without a shell; failures omit only dependent metadata.
 * @param command - operating-system executable, never event-supplied text.
 * @param args - fixed metadata query arguments.
 * @param options - output/time limits and owner lifetime.
 * @returns stdout or a fixed failure reason, after the child closes.
 */
export declare function queryEnvironment(command: string, args: readonly string[], options: QueryOptions): Promise<QueryResult>;
//# sourceMappingURL=environment-query.d.ts.map