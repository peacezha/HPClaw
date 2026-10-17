/** Decoded application icon bytes suitable for an image response or data URL. */
export interface DesktopIcon {
    readonly bytes: Buffer;
    readonly contentType: 'image/png' | 'image/svg+xml';
}
/**
 * Read the main desktop-entry section without interpreting executable commands.
 * @param text - installed desktop-entry text.
 * @returns its literal field values; action sections are excluded.
 */
export declare function desktopEntryFields(text: string): Readonly<Record<string, string>>;
/**
 * Resolve XDG application and icon roots in desktop precedence order.
 * @param home - user's home directory.
 * @param env - desktop environment values.
 * @returns data-home followed by system data directories.
 */
export declare function desktopDataDirectories(home: string, env: Readonly<Record<string, string | undefined>>): readonly string[];
/**
 * Resolve an absolute icon path or an installed hicolor/pixmaps icon name.
 * @param name - desktop-entry Icon field.
 * @param directories - XDG data roots in precedence order.
 * @returns image bytes and media type, or null when artwork is unavailable.
 */
export declare function desktopApplicationIcon(name: string, directories: readonly string[]): Promise<DesktopIcon | null>;
//# sourceMappingURL=desktop-entry.d.ts.map