/** Browser-local recently selected IANA time zones. */
/**
 * Load up to five recent zones, or the system-zone/UTC first-run seed.
 * @param system - the host's current IANA zone.
 * @returns recent IANA zones in most-recent-first order.
 */
export declare function loadRecentTimeZones(system: string): readonly string[];
/**
 * Promote one exact IANA id and persist the bounded list when storage is available.
 * @param recent - current most-recent-first IANA zones.
 * @param zone - exact IANA zone to promote.
 * @returns the updated bounded most-recent-first list.
 */
export declare function rememberTimeZone(recent: readonly string[], zone: string): readonly string[];
//# sourceMappingURL=recent-time-zones.d.ts.map