/** Provider failure or configured request/response limit rejection. */
export class TranslationError extends Error {
    code;
    name = 'TranslationError';
    /**
     * @param code - failure classification independent of localized UI wording.
     * @param message - diagnostic without source text or provider response content.
     */
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
//# sourceMappingURL=error.js.map