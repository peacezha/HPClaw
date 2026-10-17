/** JSON inspection of live objects, including cyclic Location stores. */
/**
 * Serialize raw details without allowing a formatting failure to retire the View.
 * @param value - Original record; Maps/Sets become objects/arrays and bigint becomes an n-suffixed string.
 * @returns JSON with circular references marked, or an error message for the detail panel.
 */
export declare function inspectorJson(value: unknown): {
    readonly text: string;
    readonly failed: boolean;
};
//# sourceMappingURL=raw-json.d.ts.map