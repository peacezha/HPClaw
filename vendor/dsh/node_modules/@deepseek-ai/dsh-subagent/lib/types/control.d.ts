/**
 * Browser-facing subagent prompt and interrupt request validation plus the
 * stable prompt failure codes returned by the Remote surface.
 *
 * @module @deepseek-ai/dsh-subagent
 */
import type { SessionId } from '@deepseek-ai/dsh-session';
import { z } from 'zod';
declare const CONTROL_ID_SCHEMAS: {
    readonly 'subagent.prompt': z.ZodObject<{
        parentSessionId: z.ZodString;
        childSessionId: z.ZodString;
        mode: z.ZodLiteral<"continuable">;
        delivery: z.ZodEnum<{
            queue: "queue";
            steer: "steer";
        }>;
    }, z.core.$strip>;
    readonly 'subagent.interrupt': z.ZodObject<{
        parentSessionId: z.ZodString;
        childSessionId: z.ZodString;
        mode: z.ZodLiteral<"continuable">;
    }, z.core.$strip>;
};
/**
 * Apply the subagent payload checks that are stricter than generated
 * branded-string codecs.
 * @param method - method name carried in the failure message.
 * @param payload - decoded control fields to validate.
 * @throws {RemoteError} `gateway/bad-request` with the original Zod issues.
 */
export declare function validateControlRequest(method: keyof typeof CONTROL_ID_SCHEMAS, payload: unknown): void;
/**
 * Refuse one continuation prompt without exposing provider detail: admission
 * failures the caller can act on keep their own code, everything else is
 * internal.
 * @param error - the thrown value.
 * @param childSessionId - the addressed child.
 * @param signal - the caller's cancellation.
 * @returns Never — the refusal is thrown.
 * @throws {RemoteError} always.
 */
export declare function rejectPrompt(error: unknown, childSessionId: SessionId, signal: AbortSignal): never;
export {};
//# sourceMappingURL=control.d.ts.map