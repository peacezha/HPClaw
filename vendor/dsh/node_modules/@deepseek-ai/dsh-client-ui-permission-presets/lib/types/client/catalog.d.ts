/** Identity-stable process permission catalog shared by both selection surfaces. */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { PermissionCatalog } from '@deepseek-ai/dsh-permission-presets/client';
/** Observable complete catalog for the current Host generation. */
export interface PermissionCatalogState {
    /** Last complete catalog for this generation, or null before one succeeds. */
    value: PermissionCatalog | null;
}
/** One latest-result-wins catalog reader for the whole browser process. */
export declare class PermissionCatalogDirectory {
    private readonly ctx;
    /** Complete snapshot consumed by both the slash popup and composer seat. */
    readonly store: SnapshotStore<PermissionCatalogState>;
    /**
     * One tick per invalidation (a catalog notification or a connection-generation
     * change), published before the replacement read starts. Consumers that must
     * drop displayed options subscribe here instead of to {@link store}, whose
     * publications also settle a read a displayed surface is waiting for.
     */
    readonly invalidations: SnapshotStore<{
        count: number;
    }>;
    private readonly connection;
    private readonly stopCatalog;
    private readonly stopGeneration;
    private generationId;
    private initialized;
    private epoch;
    private pending;
    private failure;
    private disposed;
    /**
     * Subscribe to both invalidation sources before the first read, closing the
     * install/read race.
     * @param ctx - root Client context carrying Remote and Connection.
     */
    constructor(ctx: ClientContext);
    /**
     * Publish one invalidation tick for consumers holding displayed options.
     * Neither caller can run after disposal: `dispose()` unsubscribes the
     * catalog-changed listener, and `syncGeneration()` returns early when the
     * directory is disposed.
     */
    private invalidate;
    /** Force a fresh complete read for the active connection generation. */
    refresh(): void;
    /**
     * Resolve a complete current-generation catalog for an imperative popup
     * open. An active refresh settles before a retained value can be reused.
     * @returns The active Host generation's complete permission catalog.
     */
    load(): Promise<PermissionCatalog>;
    /** Stop subscriptions and revoke every late settlement's write access. */
    dispose(): void;
    /** Observe generation loss/replacement and hard-clear the old Host value. */
    private syncGeneration;
    /** Start one independent read; the newest epoch in the same generation wins. */
    private startRead;
    /** Fence by disposal, refresh epoch, and the actual Connection generation. */
    private accepts;
}
//# sourceMappingURL=catalog.d.ts.map