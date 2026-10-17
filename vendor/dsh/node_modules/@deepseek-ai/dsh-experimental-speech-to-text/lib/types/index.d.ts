/** Named transcription providers with disposable registration and explicit routing. */
import { Context, Service, type Volatile } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { SpeechPreparationOptions, SpeechProvider, SpeechProviderId, SpeechProviderInfo, SpeechSnapshot, SpeechSelectionPatch, SpeechRequest, SpeechSpec, Transcript } from './types.ts';
export type * from './types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Experimental speech recognition provider registry. */
        speechToText: SpeechToText;
    }
}
/** Live selection read before a transcription starts; `configure()` writes it through the profile. */
export interface Config {
    /** Registered provider selected when the caller omits an id. */
    defaultProvider: Volatile<string>;
    /** Provider language hint selected when the caller omits one. */
    language: Volatile<string>;
}
/** Registry shared by all transcription consumers in one Host composition. */
export default class SpeechToText extends Service {
    private readonly config;
    static Config: z<Schemastery.ObjectS<NoInfer<{
        defaultProvider: z<string, string, "volatile-defined">;
        language: z<string, string, "volatile-defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        defaultProvider: z<string, string, "volatile-defined">;
        language: z<string, string, "volatile-defined">;
    }>>, "plain">;
    private readonly providers;
    private readonly listeners;
    private readonly lifetime;
    /** Profile-local entry id used by Settings; absent when the plugin was mounted without Loader. */
    private readonly entryId;
    constructor(ctx: Context, config: Config);
    /**
     * Register one recognizer; duplicate ids fail without replacing the original.
     * @param provider - recognizer owned by the contributing fiber.
     * @returns idempotent disposer which rejects admission, cancels, and joins accepted work.
     */
    register(provider: SpeechProvider): () => Promise<void>;
    private remove;
    /**
     * Read the current recognizer roster.
     * @returns available provider facts in registration order.
     */
    listProviders(): readonly SpeechProviderInfo[];
    private changed;
    /**
     * Observe complete readiness snapshots; a slow reader coalesces intermediate progress.
     * @param caller - observer lifetime, independent of any preparation task.
     * @returns an initial snapshot followed by the latest provider states.
     */
    follow(caller: AbortSignal): AsyncIterable<SpeechSnapshot>;
    /**
     * Read provider readiness and current user preferences together.
     * @returns one detached complete observation.
     */
    snapshot(): SpeechSnapshot;
    /**
     * Persist changed selection fields into this plugin's profile entry; the resulting language must be accepted by the selected provider.
     * @param patch - explicit provider or language changes.
     * @returns after the profile write and the live update it applies.
     */
    configure(patch: SpeechSelectionPatch): Promise<void>;
    private selectedProvider;
    /**
     * Start or join provider-owned preparation.
     * @param id - exact registered provider identity.
     * @param options - task-local source selection validated by the provider.
     */
    prepare(id: SpeechProviderId, options?: SpeechPreparationOptions): void;
    /**
     * Explicitly cancel provider preparation without tying it to a browser connection.
     * @param id - exact registered provider identity.
     * @returns after the preparation task settles.
     */
    cancelPreparation(id: SpeechProviderId): Promise<void>;
    /**
     * Apply composition defaults and capture the selected provider. Missing providers and unsupported languages fail explicitly.
     * @param request - complete recording and optional selection.
     * @returns provider-pinned input for transcribe().
     */
    resolve(request: SpeechRequest): SpeechSpec;
    /**
     * Execute exactly the resolved provider; no fallback sends audio elsewhere.
     * @param spec - resolved input; a withdrawn or replaced registration is rejected.
     * @param signal - caller cancellation.
     * @returns final transcript after provider settlement.
     */
    transcribe(spec: SpeechSpec, signal: AbortSignal): Promise<Transcript>;
}
//# sourceMappingURL=index.d.ts.map