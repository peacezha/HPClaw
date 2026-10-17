import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { QuestionReplyData } from './question-reply.ts';
type QuestionReplyViewProps = PropsRuntime<'conversation.chat.node', 'question-reply'> & PropsLocale<'question'>;
/**
 * Right-aligned late-reply bubble: a label naming the earlier pending
 * questions, then one question and answer pair per question. A payload the
 * Client cannot read falls back to the model-facing text.
 */
export declare const QuestionReplyView: import("react").MemoExoticComponent<({ node, t }: QuestionReplyViewProps) => import("react").JSX.Element>;
/**
 * Render one settled question reply as a compact transcript bubble.
 * @param props - Reply data and the question locale translator.
 * @returns The expandable reply bubble.
 */
export declare function QuestionReplyBubble({ data, t }: {
    data: QuestionReplyData;
    t: PropsLocale<'question'>['t'];
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=QuestionReplyView.d.ts.map