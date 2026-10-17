/** Address parsing for the Sidebar browser's HTTP(S) allowlist. */
/** Maximum accepted address length; this bounds persisted navigation state. */
export declare const MAX_BROWSER_URL_LENGTH: number;
/** A normalized Browser navigation target. */
export type BrowserTarget = {
    readonly kind: 'https';
    readonly url: string;
    readonly title: string;
} | {
    readonly kind: 'http';
    readonly url: string;
    readonly title: string;
};
/** Why an address was refused before navigation. */
export type BrowserAddressFailure = 'empty' | 'invalid' | 'protocol' | 'credentials' | 'application-origin';
/** Result of parsing an address-bar value. */
export type BrowserAddressResult = {
    readonly ok: true;
    readonly target: BrowserTarget;
} | {
    readonly ok: false;
    readonly reason: BrowserAddressFailure;
};
/**
 * Parse one address-bar value into the fixed protocol allowlist.
 * @param input - user or typed-open input.
 * @param applicationOrigin - current DSH document origin, blocked for HTTPS.
 * @returns a canonical target or the refusal reason.
 */
export declare function parseBrowserAddress(input: string, applicationOrigin?: string): BrowserAddressResult;
//# sourceMappingURL=url.d.ts.map