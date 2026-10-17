/** Pure Discover query and display helpers over market search results. */
import type { LocalizedText } from '@deepseek-ai/dsh-package-manifest';
import type { MarketIndexSummary, MarketListingEntry, MarketListingVersion, MarketSort } from '@deepseek-ai/dsh-api-remotes/client';
import type { MarketIndexMetadata } from '@deepseek-ai/dsh-plugin-market-index';
/** The Discover query: text, filters, and order, without paging. */
export interface DiscoverQuery {
    readonly text: string;
    readonly category: string | null;
    readonly labels: readonly string[];
    readonly sort: MarketSort;
}
/** The query a newly selected index starts with. */
export declare const INITIAL_QUERY: DiscoverQuery;
/**
 * Replace the query text. Index order becomes relevance order when blank text gains words, and returns when the text
 * becomes blank; an order chosen while text is present stays.
 * @param query - the current query.
 * @param text - the new text.
 * @returns the query with the text and its order.
 */
export declare function withText(query: DiscoverQuery, text: string): DiscoverQuery;
/**
 * Drop filters and the sort key the index no longer declares, so every active choice stays visible in the toolbar.
 * @param query - the current query.
 * @param metadata - the declarations of the index that answered it.
 * @returns the query itself when every id is declared, otherwise a reduced copy.
 */
export declare function declaredQuery(query: DiscoverQuery, metadata: MarketIndexMetadata): DiscoverQuery;
/** A declaration with its id and its title in the current language. */
export interface DisplayDeclaration<T> {
    readonly id: string;
    readonly title: string;
    readonly declaration: T;
}
/**
 * Order declarations by their localized title, then by id code points.
 * @param declarations - id → declaration with a `title`.
 * @param resolveText - current-language text resolution.
 * @param language - current UI language for collation.
 * @returns declarations in display order.
 */
export declare function displayDeclarations<T extends {
    readonly title: LocalizedText;
}>(declarations: Readonly<Record<string, T>>, resolveText: (text: LocalizedText) => string, language: string): DisplayDeclaration<T>[];
/**
 * The version an entry presents and installs by default: its default version, or its highest version when none is compatible.
 * @param entry - the market entry.
 * @returns the presented version.
 */
export declare function presentedVersion(entry: MarketListingEntry): MarketListingVersion;
/** One fact about where an entry installs from, keyed for its localized label. */
export interface SourceFact {
    readonly kind: 'package' | 'registry' | 'repository' | 'commit' | 'directory';
    readonly value: string;
}
/**
 * List where a version installs from, so users can check its origin before installing.
 * @param name - the entry's package name.
 * @param version - the version to install.
 * @returns the npm package and registry, or the repository, full commit, and package directory.
 */
export declare function sourceFacts(name: string, version: MarketListingVersion): SourceFact[];
/**
 * Name an index source: its market title once read, otherwise its host.
 * @param index - the configured source.
 * @param resolveText - current-language text resolution.
 * @returns the display name; a URL the browser cannot parse is shown as written.
 */
export declare function indexLabel(index: MarketIndexSummary, resolveText: (text: LocalizedText) => string): string;
//# sourceMappingURL=presentation.d.ts.map