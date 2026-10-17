/**
 * Process facts the startup provider reads, kept out of the `./startup` entry
 * so substituting them in tests adds no public package API.
 * @module @deepseek-ai/dsh-headless/startup-internals
 */
/** Process facts the provider reads; tests substitute them. */
export declare const internals: {
    stdinIsTty: () => boolean;
    stdout: {
        write(chunk: string): unknown;
    };
};
//# sourceMappingURL=startup-internals.d.ts.map