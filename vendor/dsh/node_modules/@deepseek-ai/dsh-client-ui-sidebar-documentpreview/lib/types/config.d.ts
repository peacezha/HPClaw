/** Cache limits shared by the Host configuration and browser document previews. */
import z from '@deepseek-ai/schemastery';
/** Transient Office conversion reuse within one Client connection. */
export interface Config {
    /** Retained PDF limits; pending conversions share cancellation by reader lifetime. */
    office: {
        /** Maximum retained completed PDFs. */
        maxCachedEntries: number;
        /** Maximum retained PDF bytes, counted by each binary buffer's byteLength. */
        maxCachedBytes: number;
        /** Maximum unsettled Host conversion RPCs, including cancellation teardown. */
        maxPending: number;
        /** Maximum readers including source and renderer metadata lookups. */
        maxReaders: number;
    };
    /** Browser spreadsheet parser and dense cell allocation limits. */
    excel: {
        /** Maximum source file bytes. */
        maxBytes: number;
        /** Maximum combined rectangular cell area across worksheets. */
        maxCells: number;
        /** Maximum parser Worker lifetime in milliseconds. */
        timeoutMs: number;
    };
}
/** Deployment limits applied before Office preview registration. */
export declare const Config: z<{
    office?: Partial<Config['office']>;
    excel?: Partial<Config['excel']>;
}, Config>;
//# sourceMappingURL=config.d.ts.map