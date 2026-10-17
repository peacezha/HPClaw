/** Original-text skill candidates restricted to caller-confirmed names. */
import type { UserTextRule } from '@deepseek-ai/dsh-client-ui-conversation/client';
declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
    interface UserTextDataMap {
        /** A skill name confirmed for this message, without the leading slash. */
        skill: {
            readonly name: string;
        };
    }
    interface UserTextFacts {
        /** Resolved skill names; absence supplies no skill references. */
        readonly skillNames: readonly string[];
    }
}
/** Return one nearest confirmed slash token, retaining its original word boundaries. */
export declare const skillReferenceRule: UserTextRule<'skill'>;
//# sourceMappingURL=user-text-rules.d.ts.map