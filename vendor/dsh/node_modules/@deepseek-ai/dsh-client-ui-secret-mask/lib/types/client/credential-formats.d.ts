/**
 * The credential formats the matcher recognizes, as data: the literal each
 * format begins with, how its candidate is validated, and the ASCII character
 * classes those checks use. [format-tables.ts](./format-tables.ts) derives
 * lookup tables from this list on first use.
 */
/** `[A-Za-z0-9_-]` */
export declare const KEY = 1;
/** `[A-Za-z0-9]` */
export declare const ALNUM = 2;
/** `\w` */
export declare const WORD = 4;
/** `[A-Za-z0-9-]` */
export declare const ALNUM_DASH = 8;
/** `[A-Z0-9]` */
export declare const UPPER_ALNUM = 16;
/** `[A-Z0-9 ]` */
export declare const LABEL = 32;
/** `[a-z0-9+.-]` */
export declare const SCHEME = 64;
/** `[a-z]` */
export declare const LOWER = 128;
/** `[^\s/:@?#]` */
export declare const USER = 256;
/** `[^\s/@?#]` */
export declare const PASSWORD = 512;
/** A private key block from its `-----BEGIN` line. */
export declare const KEY_BLOCK = 0;
/** The password of an address that carries credentials. */
export declare const ADDRESS = 1;
/** A provider key or token after its fixed prefix. */
export declare const PREFIXED = 2;
/** The whole run, at least `min`. */
export declare const RUN = 0;
/** `min` to `max`, then `\b`. */
export declare const BOUNDED = 1;
/** At least `min`, with a digit among the first 256. */
export declare const SK = 2;
/** Exactly `min`. */
export declare const GOOGLE = 3;
/** Three runs joined by `.eyJ` and `.`. */
export declare const JWT = 4;
/** One recognized format. */
export interface CredentialFormat {
    /** ASCII literal the candidate begins with; no literal occurs inside another. */
    readonly literal: string;
    readonly kind: typeof KEY_BLOCK | typeof ADDRESS | typeof PREFIXED;
    /** Prefixed formats only: how the run after the literal is validated. */
    readonly shape: number;
    /** Prefixed formats only: the class bit of the run after the literal. */
    readonly run: number;
    readonly min: number;
    readonly max: number;
}
/** Every prefixed format matches more than the 8 characters a mask leaves readable. */
export declare const CREDENTIAL_FORMATS: readonly CredentialFormat[];
//# sourceMappingURL=credential-formats.d.ts.map