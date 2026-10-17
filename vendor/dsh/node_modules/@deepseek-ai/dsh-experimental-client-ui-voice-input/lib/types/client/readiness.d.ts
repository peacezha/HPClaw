/** One reconnecting Host readiness mirror shared by every voice UI occurrence. */
import type { Context } from '@deepseek-ai/cordis';
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { SpeechCatalog } from '@deepseek-ai/dsh-experimental-api-speech-to-text/types';
/** Complete provider state, with a separate transport failure that never rewrites Host readiness. */
export interface SpeechReadiness {
    readonly catalog: SpeechCatalog | null;
    readonly connected: boolean;
    readonly error: string | null;
}
/**
 * Subscribe once per Client plugin, independent of rendered pages and Sessions.
 * @param ctx - mounted speech Remote owner.
 * @returns shared readiness snapshot and joined observation cleanup.
 */
export declare function observeReadiness(ctx: Context): {
    state: SnapshotStore<SpeechReadiness>;
    dispose: () => Promise<void>;
};
//# sourceMappingURL=readiness.d.ts.map