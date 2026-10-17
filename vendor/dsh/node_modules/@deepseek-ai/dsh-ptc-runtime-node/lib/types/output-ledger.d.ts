/** Combined byte accounting for retained program output. */
import type { PtcJsonValue, PtcRunFailure, PtcRunResult } from '@deepseek-ai/dsh-ptc-runtime';
/** One run's combined outer-output ledger; binding values never enter it. */
export declare class OutputLedger {
    private readonly maxBytes;
    private readonly overflowMessage?;
    private bytes;
    private entries;
    constructor(maxBytes: number, overflowMessage?: string | undefined);
    /** Admit one exact log entry, or report that the hard cap was crossed. */
    admit(text: string, sink: string[]): boolean;
    /** Finalize a successful absent-or-JSON completion against the combined cap. */
    success(logs: string[], value?: PtcJsonValue): PtcRunResult;
    /** Finalize a failure diagnostic, with output-limit taking precedence when combined bytes exceed the cap. */
    failure(logs: string[], error: PtcRunFailure): PtcRunResult;
    /** Build the explicit output-limit failure while retaining a fitting prefix of the final log. */
    limit(logs: string[]): PtcRunResult;
}
//# sourceMappingURL=output-ledger.d.ts.map