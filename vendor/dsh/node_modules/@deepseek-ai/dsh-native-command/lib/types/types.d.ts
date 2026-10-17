/** Browser-safe metadata for native file associations. */
/** One OS-registered application capable of opening the requested file. */
export interface NativeFileApplication {
    /** OS application identifier; callers must revalidate it against the file's current handlers before opening. */
    readonly id: string;
    readonly name: string;
    readonly default: boolean;
    /** PNG or SVG data URL, or null when the desktop supplies no icon. */
    readonly icon: string | null;
}
/**
 * Validate file association metadata received from a native process or authenticated Host.
 * @param value - decoded application list.
 * @returns validated application metadata.
 * @throws Error for malformed entries or unsupported icon URLs.
 */
export declare function parseNativeFileApplications(value: unknown): readonly NativeFileApplication[];
//# sourceMappingURL=types.d.ts.map