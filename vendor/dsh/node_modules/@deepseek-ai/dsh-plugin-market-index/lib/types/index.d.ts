/**
 * Plugin market index format 1: JSON validation, relative icon resolution, and install arguments.
 * The format is defined by the plugin market index format Agent Note; readers and generators share this validator.
 * @module @deepseek-ai/dsh-plugin-market-index
 */
import type { MarketIndex, MarketInstallTarget, MarketVersion } from './types.ts';
export type * from './types.ts';
/** An index that violates format 1; `path` is the JSON path of the offending value, such as `$.plugins[0].versions[1].version`. */
export declare class MarketIndexError extends Error {
    readonly path: string;
    readonly reason: string;
    /**
     * @param path - JSON path of the offending value.
     * @param reason - the violated rule.
     */
    constructor(path: string, reason: string);
}
/** Largest decoded payload of an inline `data:` icon, in bytes. */
export declare const MAX_INLINE_ICON_BYTES: number;
/**
 * Validate a parsed format-1 index. Members the format does not define are ignored and dropped.
 * @param value - the parsed JSON document.
 * @param indexUrl - absolute URL the index was read from; relative icon references resolve against it.
 * @returns the validated index with absent metadata groups and lists filled with empty values, and each plugin's
 *   versions in descending SemVer precedence.
 * @throws {MarketIndexError} for the first violated rule.
 */
export declare function parseMarketIndex(value: unknown, indexUrl: string): MarketIndex;
/**
 * Build the arguments that install one exact version: `name@version` for npm, and a `git+https` URL pinned to the
 * commit, with pnpm's `path:` parameter for a package directory, for Git.
 * @param name - the plugin's package name.
 * @param version - a validated version of that plugin.
 * @returns the install spec and the registry to ask first, when the version names one.
 */
export declare function marketInstallTarget(name: string, version: Pick<MarketVersion, 'version' | 'source'>): MarketInstallTarget;
//# sourceMappingURL=index.d.ts.map