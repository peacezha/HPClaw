/** Caller-relative lazy loading for CommonJS-compatible Host dependencies. */
/**
 * Create a successful-result cache around Node's caller-relative `require`.
 * A failed load is not cached, so a corrected installation can be retried.
 * @param specifier - Literal dependency specifier declared by the caller package.
 * @param parentURL - Caller's `import.meta.url`, which owns package resolution.
 * @returns a zero-argument loader that resolves the dependency on first use.
 */
export declare function createLazyRequire<T>(specifier: string, parentURL: string | URL): () => T;
//# sourceMappingURL=index.d.ts.map