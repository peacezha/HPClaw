/** Native system-message fields checked before physical recovery can discard a row. */
/**
 * Validate system fields independently of historical message representations; preserve additional JSON fields.
 * @param row - complete logical event or parsed physical row before corruption recovery.
 */
export declare function assertV4SystemMessageFields(row: unknown): void;
//# sourceMappingURL=system-message.d.ts.map