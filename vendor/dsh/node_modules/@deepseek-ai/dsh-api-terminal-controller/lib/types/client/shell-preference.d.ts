/**
 * Read the browser preference.
 * @returns the last selected shell path, or null when storage is unavailable.
 */
export declare function preferredShell(): string | null;
/**
 * Remember the selected shell without making storage a startup dependency.
 * @param path - verified executable path offered by the Host.
 */
export declare function rememberShell(path: string): void;
//# sourceMappingURL=shell-preference.d.ts.map