import type { TurnTailOwnerProps } from '@deepseek-ai/dsh-client-ui-chat/client';
import type { ConversationNodeDefinition } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { MarkdownFileMentions } from '@deepseek-ai/dsh-client-ui-primitives';
import type { PresentedFile } from '@deepseek-ai/dsh-tool-present/types';
/** A declared file with its authorized open coordinates. */
export interface PresentedPath extends PresentedFile {
    readonly seq: number;
    readonly index: number;
}
interface ProducedPath {
    readonly seq: number;
    readonly path: string;
    readonly argumentPath?: string;
}
/** The latest `workspace/changes` announcement of one Turn; the Host serves its summary by this sequence. */
export interface ChangesTurnData {
    readonly seq: number;
}
/** Immutable produced-file facts published against one Turn. */
export interface DeliverablesTurnData {
    readonly produced: readonly ProducedPath[];
    readonly presented?: readonly PresentedPath[];
    readonly changes?: ChangesTurnData;
}
declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
    interface ConversationTurnDataMap {
        /** Successful mutation paths, recorded changed files, and deliveries accumulated in this Turn. */
        deliverables: DeliverablesTurnData;
    }
}
interface DeliverablesState extends DeliverablesTurnData {
    readonly turn: number;
    readonly calls: ReadonlyMap<string, string | null>;
}
/**
 * Files produced by one Turn data value.
 *
 * The source is successful `write`, `edit`, and mutating `str_replace_editor`
 * calls and their recorded absolute targets; legacy results use arguments. A produced file must be
 * listed whether or not the model remembered to name it. Reads, unsupported
 * tools, malformed calls, and failed results contribute nothing. Paths keep
 * first-seen order and appear once, so a file written and then edited in the
 * same turn is one entry.
 *
 * The Conversation Location index owns turn membership before this function
 * runs, so paths cannot spill across turns and this derivation does not infer
 * boundaries from neighboring presentation Nodes.
 * @param data - engine-published Deliverables data for one Turn.
 * @param seq - closing Assistant seq; later Tool settlements are excluded.
 * @returns Produced paths in first-seen order; empty when the turn wrote nothing.
 */
export declare function producedForClosing(data: Readonly<DeliverablesTurnData> | undefined, seq?: number): readonly string[];
/**
 * Claim the turn-tail chain only when its closing turn produced files.
 * @param owner - Turn-tail owner currency for the closing assistant.
 * @returns Produced paths as the component's match, or null to decline before mount.
 */
export declare function selectProducedFiles(owner: TurnTailOwnerProps): readonly string[] | null;
/** Turn-local successful mutation accumulator; it publishes no view Node. */
export declare const deliverablesDefinition: ConversationNodeDefinition<DeliverablesState>;
/**
 * The turn's latest change announcement.
 * @param owner - closing turn.
 * @returns the announcement, or null when the Host recorded none.
 */
export declare function changesForClosing(owner: TurnTailOwnerProps): ChangesTurnData | null;
/**
 * Select the latest declaration of each path before the closing reply.
 * @param owner - closing turn and sequence.
 * @returns replayable deliveries in first-seen path order.
 */
export declare function presentedForClosing(owner: TurnTailOwnerProps): PresentedPath[];
export { basename } from '../presented.ts';
/**
 * Resolves inline-code references against one turn's produced or delivered
 * paths and explicit mutation arguments. A reference resolves only when every
 * exact or basename match identifies one target. Ambiguous and unknown tokens stay inert.
 * @param paths - The turn's produced or delivered paths, already deduplicated.
 * @param openFile - The chat view's file opener.
 * @param label - Localizes the accessible open-label for a resolved path.
 * @param operations - successful mutations whose literal arguments may name the same canonical targets.
 * @returns The resolver MarkdownText consumes; the full path rides `title`,
 * the same disambiguator the row's chips carry.
 */
export declare function producedFileMentions(paths: readonly string[], openFile: (path: string) => void, label: (path: string) => string, operations?: readonly Pick<ProducedPath, 'path' | 'argumentPath'>[]): MarkdownFileMentions;
//# sourceMappingURL=turn-deliverables.d.ts.map