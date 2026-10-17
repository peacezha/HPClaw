/**
 * Web question plugin, browser half: QuestionComposer registered as a
 * selector-routed entry of the conversation-declared composer chain, plus the
 * `question` dictionaries. The selector narrows the owner's currency to the
 * question carrier (matched prop), and the whole behavior surface rides the
 * carrier (domain encoding in contract/slots.ts PendingQuestion); copy rides
 * the standard locale seat. Export discipline: packages/client/AGENTS.md.
 *
 * One entry, two presentations: the composer renders a request with a
 * `plan-review` intent as the plan decision card and every other request as
 * the generic question flow. Both use the same carrier and composer seat.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type QuestionKey } from './locales.ts';
export type { PendingQuestion, PlanReview, QuestionAnswer, QuestionComposerProps, QuestionWait, } from './contract/slots.ts';
export type { QuestionKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The question composer's copy. */
        question: QuestionKey;
    }
}
/** Required services: Agent scopes, Remote Events, Session UI, Slot registry, conversation nodes, and copy. */
export declare const inject: string[];
/**
 * Client plugin body: register the `question` dictionaries, the question
 * composer into the composer chain, and the late-reply conversation node.
 * Zero business face — data and verbs live on the matched carrier; t rides
 * the standard locale seat.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map