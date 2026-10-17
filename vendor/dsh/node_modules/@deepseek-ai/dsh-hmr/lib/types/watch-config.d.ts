import { type ChokidarOptions } from 'chokidar';
import type { Context } from '@deepseek-ai/cordis';
/**
 * Watch one patch path and its parent chain without subscribing to sibling files or directories.
 * Missing parents are observed as they appear; refresh callbacks run serially.
 * @param ctx Context that owns watcher disposal and receives refresh failures.
 * @param filename Absolute patch-file path.
 * @param options Deployment watcher options; configuration watches enable write stabilization by default.
 * @param refresh Callback for additions, changes, and removals.
 * @param inTransaction Whether disposal is running inside the refresh being removed.
 * @returns A disposer that closes the watcher and drains its current refresh.
 * @throws When path resolution, watcher startup, or effect registration fails.
 */
export declare function watchConfig(ctx: Context, filename: string, options: ChokidarOptions, refresh: () => Promise<void> | void, inTransaction?: () => boolean): Promise<() => Promise<void>>;
//# sourceMappingURL=watch-config.d.ts.map