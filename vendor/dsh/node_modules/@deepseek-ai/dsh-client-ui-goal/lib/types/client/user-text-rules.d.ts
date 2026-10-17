/** Original-text command candidates restricted to confirmed execution ranges. */
import type { UserTextRule } from '@deepseek-ai/dsh-client-ui-conversation/client';
declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
    interface UserTextDataMap {
        /** The executed command name, without the leading slash. */
        command: {
            readonly name: string;
        };
    }
    interface UserTextFacts {
        /** Confirmed command ranges; repeated command spelling outside them stays plain text. */
        readonly commands: readonly {
            readonly start: number;
            readonly end: number;
            readonly name: string;
        }[];
    }
}
/** Return the nearest exact confirmed command, checking boundaries against the original string. */
export declare const goalCommandReferenceRule: UserTextRule<'command'>;
//# sourceMappingURL=user-text-rules.d.ts.map