/** Sequential paragraph translation for one expanded reasoning disclosure. */
import type { TranslationRequest } from '@deepseek-ai/dsh-experimental-translator/types';
/** One source fragment and its untranslated separator. */
interface Fragment {
    text: string;
    suffix: string;
    complete: boolean;
}
/** Display-only result retained while this reasoning disclosure is mounted. */
export interface TranslationState {
    text: string;
    pending: boolean;
    failed: boolean;
}
/** Cancellation-aware callback supplied by the Remote consumer. */
export type TranslateText = (request: TranslationRequest, signal: AbortSignal) => Promise<string>;
/**
 * Split reasoning into completed paragraphs and request-sized fragments.
 * @param text - original reasoning, including its exact whitespace.
 * @param running - whether the final paragraph may still grow.
 * @param maxTextChars - translator's configured UTF-16 request limit.
 * @returns whitespace-preserving fragments with completion flags for translation eligibility.
 */
export declare function reasoningFragments(text: string, running: boolean, maxTextChars: number): Fragment[];
/** One lifecycle controller owns cancellation, request ordering, and stale-result exclusion. */
export declare class ReasoningTranslation {
    private readonly selection;
    private readonly maxTextChars;
    private readonly translate;
    private readonly publish;
    private readonly controller;
    private readonly cache;
    private fragments;
    private pending;
    private failed;
    /**
     * @param selection - explicit provider and resolved target language.
     * @param maxTextChars - configured translator request limit.
     * @param translate - one cancellation-aware Remote request.
     * @param publish - component-local display state update.
     */
    constructor(selection: Pick<TranslationRequest, 'provider' | 'targetLanguage'>, maxTextChars: number, translate: TranslateText, publish: (state: TranslationState) => void);
    /**
     * Adopt the current source and enqueue newly completed fragments.
     * @param text - current original reasoning.
     * @param running - whether its tail is still streaming.
     */
    update(text: string, running: boolean): void;
    /** Retry untranslated fragments after a failed request. */
    retry(): void;
    /** Abort the disclosure's requests and suppress all later publications. */
    dispose(): void;
    private isDisposed;
    private emit;
    private run;
}
export {};
//# sourceMappingURL=translation.d.ts.map