/** Native V4 fork-result identity and not-started error validation. */
/**
 * Validate fork-generated not-started results without changing their identity or text.
 * Append results carry their own sequence; replacement results retain an earlier identity.
 * @param row - logical event or physical event row.
 */
export declare function assertV4ForkResult(row: unknown): void;
//# sourceMappingURL=fork-result.d.ts.map