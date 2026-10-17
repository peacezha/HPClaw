/** V4 framing with native tool-role admission and released physical rows. */
import type { SessionFormatHeader, SessionFormatEvent } from '@deepseek-ai/dsh-session-format';
/**
 * V4 physical encoder and decoder retain the released row framing while
 * validating the native tool-role message directly.
 */
export declare const releasedV4SessionFormatCodec: Readonly<{
    version: number;
    decodeHeader(value: unknown): {
        version: number;
        id: string;
        createdAt: number;
        cwd?: string;
        parentSession?: string;
        isSeeded: boolean;
        origin?: "subagent";
        delegationDepth: number;
        agentPreset?: string;
    };
    createDecoder(value: unknown, recovery: import("@deepseek-ai/dsh-session-format").SessionFormatRecovery): {
        header: {
            version: number;
            id: string;
            createdAt: number;
            cwd?: string;
            parentSession?: string;
            isSeeded: boolean;
            origin?: "subagent";
            delegationDepth: number;
            agentPreset?: string;
        };
        decodeRow(row: unknown, context: import("@deepseek-ai/dsh-session-format").SessionFormatMigrationContext): void;
        headerInheritedEventCount?: number;
        finish(context: import("@deepseek-ai/dsh-session-format").SessionFormatMigrationContext): number;
    };
    encodeHeader(header: SessionFormatHeader, inheritedEventCount: number): {
        version: number;
    };
    encodeEvent(event: SessionFormatEvent): import("@deepseek-ai/dsh-session-format").SessionFormatJsonObject;
}>;
/**
 * Apply native V4 admission before a scanner discards a recoverable suffix.
 * Ignorable developer payloads require reader vocabulary; physical decoding defers them.
 * @param row - parsed physical row before framing and source-event range decoding.
 * @param knownEventTypes - installed event types, supplied by native readers before tail recovery.
 */
export declare function assertV4RowAdmission(row: unknown, knownEventTypes?: ReadonlySet<string>): void;
//# sourceMappingURL=codec.d.ts.map