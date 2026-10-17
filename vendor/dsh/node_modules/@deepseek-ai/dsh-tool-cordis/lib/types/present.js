/**
 * Render provider-directory inspection.
 * @returns replay-safe generic call presentation.
 */
export function presentInspectListCall() {
    return { card: 'generic', kind: 'read', title: 'List Cordis Inspect Providers' };
}
/**
 * Render one provider query.
 * @param args - target platform, provider, and method.
 * @returns replay-safe generic call presentation.
 */
export function presentInspectQueryCall(args) {
    return { card: 'generic', kind: 'read', title: `Query Cordis ${args.platform} ${args.provider}.${args.method}` };
}
//# sourceMappingURL=present.js.map