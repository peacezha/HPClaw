/** File-resource membership and invalidation for one document preview. */
import type { Resources } from '@deepseek-ai/dsh-client-resources/client';
/** Forwards member metadata changes to one document preview. */
export declare class ResourceGroup {
    private readonly resources;
    private readonly changed;
    private readonly members;
    /** @param resources - shared file sources. @param changed - marks the owning preview stale. */
    constructor(resources: Resources, changed: () => void);
    /**
     * Subscribe once; initial metadata establishes the baseline for later changes.
     * @param address - complete resource address.
     */
    add(address: string): void;
    /**
     * Release dependencies absent from the current document.
     * @param addresses - complete membership of the latest document load.
     */
    set(addresses: readonly string[]): void;
    /** Release every member when the preview tab ends. */
    close(): void;
}
//# sourceMappingURL=resource-group.d.ts.map