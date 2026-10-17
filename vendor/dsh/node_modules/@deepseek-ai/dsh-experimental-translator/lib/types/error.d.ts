/** Safe translation diagnostics that never include submitted text or response bodies. */
import type { TranslationErrorCode } from './types.ts';
/** Provider failure or configured request/response limit rejection. */
export declare class TranslationError extends Error {
    readonly code: TranslationErrorCode;
    name: string;
    /**
     * @param code - failure classification independent of localized UI wording.
     * @param message - diagnostic without source text or provider response content.
     */
    constructor(code: TranslationErrorCode, message: string);
}
//# sourceMappingURL=error.d.ts.map