import type { MarketIndex, MarketPlugin } from '@deepseek-ai/dsh-plugin-market-index';
import type { MarketQuery } from './types.ts';
/** The search order and filters of a query, without paging. */
type MarketSelection = Pick<MarketQuery, 'text' | 'category' | 'labels' | 'sort'>;
/** Matches queries against one index; the text index is built on the first query with text, yielding between chunks. */
export declare class MarketSearch {
    private readonly index;
    private engine;
    /** @param index - the validated index to search. */
    constructor(index: MarketIndex);
    /**
     * Select and order the plugins matching a query.
     * @param selection - text, filters, and order.
     * @returns every matching plugin in result order.
     */
    select(selection: MarketSelection): Promise<MarketPlugin[]>;
    private search;
    private build;
    private order;
}
export {};
//# sourceMappingURL=search.d.ts.map