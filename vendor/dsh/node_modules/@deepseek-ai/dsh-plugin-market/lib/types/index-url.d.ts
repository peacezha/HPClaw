/**
 * Validate and normalize one index source URL.
 * @param text - URL as configured or entered.
 * @returns the URL's serialization.
 * @throws {RemoteError} `plugin-market/invalid-index-url` for anything but an http(s) URL without credentials or
 * fragment.
 */
export declare function normalizeIndexUrl(text: string): string;
//# sourceMappingURL=index-url.d.ts.map