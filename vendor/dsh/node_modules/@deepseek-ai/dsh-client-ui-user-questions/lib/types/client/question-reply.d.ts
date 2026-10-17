import type { ConversationNodeDefinition } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
/** One asked question as echoed in the reply payload. */
export interface QuestionReplyQuestion {
    readonly id: string;
    readonly question: string;
    readonly detail?: string;
    readonly header?: string;
    readonly options?: readonly {
        readonly label: string;
        readonly description?: string;
    }[];
    readonly multiSelect?: boolean;
}
/** One structured answer as echoed in the reply payload. */
export interface QuestionReplyAnswer {
    readonly id: string;
    readonly selected: readonly string[];
    readonly custom?: string;
}
/** Presentation data of one late reply. */
export interface QuestionReplyData {
    readonly callId: string;
    /** A late answer to the pending questions. */
    readonly outcome: 'answered';
    readonly questions: readonly QuestionReplyQuestion[];
    readonly answers: readonly QuestionReplyAnswer[];
    /** Model-facing text, shown when the payload is unreadable. */
    readonly text: string;
    readonly time: number;
}
declare module '@deepseek-ai/dsh-client-ui-chat/client' {
    interface ChatNodeDataMap {
        /** Late answer to a continued question. */
        'question-reply': QuestionReplyData;
    }
}
interface QuestionReplyState extends QuestionReplyData {
    readonly seq: number;
}
/**
 * Read the question and answer pairs out of the reply text at the conversation boundary.
 * @param text - Model-facing JSON payload of the steered message.
 * @returns The pairs, or empty lists when the payload is unreadable.
 */
export declare function replyPairsOf(text: string): Pick<QuestionReplyData, 'questions' | 'answers'>;
/**
 * Answer values of one question in display order: the selected option labels
 * followed by a non-blank custom answer.
 * @param data - Projected reply holding the recorded answers.
 * @param id - Question id to read.
 * @returns The values, empty when the user skipped that question.
 */
export declare function replyAnswerValues(data: QuestionReplyData, id: string): string[];
/**
 * Clipboard text of one late reply: every question with the answer the user
 * gave, in the layout the open bubble shows, without the options nobody chose.
 * The text does not depend on whether the bubble is open.
 * @param data - Projected reply to copy.
 * @param t - Bound `question` namespace translator owning the answer labels.
 * @returns One block per question, or the model-facing text when the payload was unreadable.
 */
export declare function replyClipboardText(data: QuestionReplyData, t: PropsLocale<'question'>['t']): string;
/**
 * Late-reply projection owned by the questions UI. It claims the reply message
 * on the Chat target, so the generic message Definition never presents it.
 */
export declare const questionReplyDefinition: ConversationNodeDefinition<QuestionReplyState>;
export {};
//# sourceMappingURL=question-reply.d.ts.map