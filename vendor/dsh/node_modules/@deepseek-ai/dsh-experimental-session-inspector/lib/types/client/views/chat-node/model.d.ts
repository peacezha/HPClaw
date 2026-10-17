/** Chat table order follows root references and group membership, independently of row data. */
import type { ConversationBinding } from '@deepseek-ai/dsh-client-ui-conversation/client';
import { type ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import { type InspectorRecord, type InspectorRow } from '../table-model.ts';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { InspectorObjects } from '../objects.ts';
import { type InspectorPickTarget } from './pick-match.ts';
/** Observes structural Chat changes while visible rows observe their own Node or Group. */
export declare class ChatNodeModel implements ObservableSnapshot<readonly InspectorRow[]> {
    private readonly binding;
    private readonly rows;
    private readonly sources;
    private readonly groups;
    private entries;
    private order;
    private keys;
    private anchors;
    private nodeStore;
    private grouped;
    private subscribers;
    private disconnect;
    private queued;
    private readonly targets;
    private readonly objectIndex;
    /** @param binding - Existing target-neutral Conversation binding for the inspected Session. */
    constructor(binding: ConversationBinding);
    /**
     * Bind object references and publication updates to the inspected Session.
     * @param sessionId - Session displayed by this model.
     * @returns Weak object lookup and row navigation for its details.
     */
    objects(sessionId: SessionId): InspectorObjects;
    /** @returns Stable flattened group/node order. */
    getSnapshot: () => readonly InspectorRow[];
    /**
     * Match a picked Chat object against the current table, including folded children.
     * @param target - Picked Chat identities.
     * @returns Closest current Node or Group row, or undefined without a match.
     */
    pick(target: InspectorPickTarget): string | undefined;
    /** @param listener - Structural invalidation callback. @returns Its disposer. */
    subscribe: (listener: () => void) => (() => void);
    /**
     * Read a loaded row without adding a subscription.
     * @param key - Stable table position.
     * @returns Cached Node or Group metadata source, or undefined outside the loaded rows.
     */
    row: (key: string) => ObservableSnapshot<InspectorRecord | undefined> | undefined;
    private refresh;
    private schedule;
}
//# sourceMappingURL=model.d.ts.map