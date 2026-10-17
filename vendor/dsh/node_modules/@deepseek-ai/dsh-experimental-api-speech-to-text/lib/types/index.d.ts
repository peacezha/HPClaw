/** Authenticated, cancellation-aware Client access to the speech capability. */
import { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { SpeechPreparationOptions, SpeechProviderId, SpeechSelectionPatch, Transcript } from '@deepseek-ai/dsh-experimental-speech-to-text/types';
import type { SpeechCatalog, TranscriptionRequest } from './types.ts';
export type * from './types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Experimental speech Remote controller. */
        speechController: SpeechController;
    }
}
/** Limits applied before decoding or calling a provider. */
export interface Config {
    /** Maximum decoded WAV bytes per request. */
    maxAudioBytes: number;
    /** Maximum PCM recording duration in seconds. */
    maxDurationSeconds: number;
}
/** Speech calls never activate or submit to an Agent. */
export default class SpeechController extends TypertRemoteService {
    private readonly config;
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    /**
     * Read provider choices without preparing a recognizer.
     * @returns available providers, resolved default, and recording limits.
     */
    catalog(): SpeechCatalog;
    /**
     * Follow provider readiness independently of Session and preparation lifetimes.
     * @param signal - Client observation lifetime.
     * @returns initial and subsequent complete readiness snapshots.
     */
    follow(signal: AbortSignal): AsyncIterable<SpeechCatalog>;
    /**
     * Persist the user's recognition preferences.
     * @param patch - changed preference fields.
     * @returns after preferences are saved.
     */
    configure(patch: SpeechSelectionPatch): Promise<void>;
    /**
     * Start or join one Host-owned preparation task.
     * @param providerId - selected recognizer.
     * @param options - task-local source selection validated by the provider.
     */
    prepare(providerId: SpeechProviderId, options?: SpeechPreparationOptions): void;
    /**
     * Explicitly cancel resource preparation.
     * @param providerId - selected recognizer.
     * @returns after the preparation task settles.
     */
    cancelPreparation(providerId: SpeechProviderId): Promise<void>;
    /**
     * Validate and transcribe one recording through the explicit provider selection.
     * @param request - canonical WAV encoded as base64, provider id and language hint.
     * @param signal - Client cancellation or Remote contribution disposal.
     * @returns final transcript without adding a Session event.
     */
    transcribe(request: TranscriptionRequest, signal: AbortSignal): Promise<Transcript>;
}
//# sourceMappingURL=index.d.ts.map