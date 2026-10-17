import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type PlanKey } from './locales.ts';
export type { PlanKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The composer plan chip's copy. */
        plan: PlanKey;
    }
}
/** Injected business face of the composer plan seat. */
export interface PlanChipInjected {
    /**
     * Leave plan mode by executing /plan off.
     * @returns null on admitted execution; a user-visible failure line otherwise.
     */
    exitPlanMode: () => Promise<string | null>;
}
/** Services for plan controls, Conversation projection, and resource navigation. */
export declare const inject: string[];
/**
 * Register plan controls, permanent Chat cards, and sidebar document reading.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map