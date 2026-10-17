/**
 * Process streams the runner reads and writes, kept out of the package entry so
 * substituting them in tests adds no public package API. The shape matches the
 * runner's own IO carrier structurally.
 * @module @deepseek-ai/dsh-headless/runner-internals
 */
/** The process streams the runner reads and writes; tests substitute captures. */
export declare const internals: {
    stdout: {
        write(chunk: string): unknown;
    };
    stderr: {
        write(chunk: string): unknown;
    };
    readStdin: () => Promise<string>;
};
//# sourceMappingURL=runner-internals.d.ts.map