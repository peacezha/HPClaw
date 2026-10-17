/** Privacy-safe installation input classification shared by click and result events. */
/**
 * Keep registry package names and plain versions; classify other installer inputs without their contents.
 * @param spec - user-entered installation spec.
 * @returns an identifier safe to send without URL credentials, tokens, or local paths.
 */
export declare function sanitizeInstallInput(spec: string): string;
//# sourceMappingURL=sanitize-install-input.d.ts.map