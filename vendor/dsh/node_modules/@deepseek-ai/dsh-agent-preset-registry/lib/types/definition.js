/** Validate a parsed Cordis entry list, including nested groups.
 * @param rows Parsed YAML value.
 * @param at Diagnostic prefix.
 * @returns The first invalid row, or undefined.
 */
export function entryListProblem(rows, at = '') {
    if (!Array.isArray(rows)) {
        return at === ''
            ? 'the composition must be a top-level list of plugin rows'
            : `group ${at} must hold a list of plugin rows`;
    }
    for (const [index, row] of rows.entries()) {
        const label = at === '' ? `row ${String(index + 1)}` : `${at} row ${String(index + 1)}`;
        if (typeof row !== 'object' || row === null || Array.isArray(row)) {
            return `${label} is not a plugin row (expected a map with a "name")`;
        }
        const { name, group, config } = row;
        if (typeof name !== 'string' || name === '') {
            return `${label} names no plugin (a "name" string is required)`;
        }
        if (group === true) {
            const nested = entryListProblem(config, label);
            if (nested !== undefined)
                return nested;
        }
    }
    return undefined;
}
//# sourceMappingURL=definition.js.map