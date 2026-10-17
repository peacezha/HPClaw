/**
 * Model-facing read, read_image, write, and edit tools over `ctx.fs`. This package owns schemas, validation,
 * read windows, formatting, and observation events, never a concrete provider. An optional
 * event policy supplies mutation guards; without one the tools use unconditional provider calls.
 * @module @deepseek-ai/dsh-tool-fs
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
/** Cordis plugin name used by loader diagnostics. */
export declare const name = "tool-fs";
/** Services required by the filesystem tool suite. */
export declare const inject: string[];
/** Plugin config (all optional — `Config` supplies the defaults). */
export interface Config {
    /** Register `read` and its guidance. Defaults to true. */
    read?: boolean;
    /** Register `read_image` while an attachment store is mounted. Defaults to true. */
    readImage?: boolean;
    /** Register `write` and its guidance. Defaults to true. */
    write?: boolean;
    /** Register `edit` and its guidance. Defaults to true. */
    edit?: boolean;
    /** Default and maximum number of lines returned by one `read` call. */
    readLimit?: number;
    /** Maximum characters returned for a single line before truncation. */
    readMaxLineLength?: number;
    /** Maximum bytes returned for the selected lines of one `read` call. */
    readMaxBytes?: number;
    /** Files at or above this size stream instead of loading whole into memory. */
    readStreamMinSize?: number;
}
export declare const Config: z<Config>;
/** Register the selected filesystem tools; `read_image` additionally requires a mounted attachment store. */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map