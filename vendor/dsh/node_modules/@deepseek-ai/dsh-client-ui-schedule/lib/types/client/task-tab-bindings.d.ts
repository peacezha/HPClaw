/**
 * Durable recovery for a restored task tab.
 *
 * The Sidebar persists a tab's layout record — its own id, kind, contentId, and
 * title — but not the opener's navigation parameters, so a task tab restored by
 * a reload carries no task identity and its body can only report feedback. This
 * page type therefore keeps what it last showed, keyed by the Session and the
 * layout record's id: the persisted layout restores both, and its minted counter
 * never reuses an id for as long as that layout lives, so the association
 * outlives the reload that dropped the parameters. The contentId cannot serve as
 * this key because every tab of one page kind records the same one.
 *
 * One storage key per Session holds one entry per tab id. A write keeps only
 * entries whose tab a non-empty list of committed ids contains; a read reports a
 * target only when the entry's kind and contentId match the record reading it,
 * and leaves the document untouched, so the drop of a mismatched entry is a
 * separate call a render effect makes. A body removes an entry a read that
 * succeeded after the tab appeared cannot resolve. Only the task's Session and id are stored; its name, instruction, and
 * deliveries are not.
 */
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { ScheduleId } from '@deepseek-ai/dsh-schedule/client';
/** The Sidebar fields that identify one task tab page across a reload. */
export interface TaskTabPage {
    /** The persisted layout record's own id. */
    readonly id: string;
    /** That record's registered page kind. */
    readonly kind: string;
    /** That record's content identity, shared by every tab of this page kind. */
    readonly contentId: string;
}
/** The task one tab page last showed. */
export interface TaskTabTarget {
    /** The Session that owns the task. */
    readonly sessionId: SessionId;
    /** The task's own identity. */
    readonly id: ScheduleId;
}
/**
 * The committed tab ids of one Session, read when an entry is stored so a closed
 * tab leaves none behind. `undefined` and an empty list both skip that removal:
 * `ctx.sidebarRight.tabsIn` returns the empty list for a Session whose layout is
 * not adopted as well as for one whose adopted layout holds no tabs, and pruning
 * against that answer would drop entries a restored tab still resolves through.
 */
export type TaskTabLiveIds = (sessionId: SessionId) => readonly string[] | undefined;
/**
 * Last shown task per task tab page, kept in this window and in browser storage.
 *
 * The window copy is authoritative for this window's reads: it keeps the value
 * usable when storage is absent or rejects writes, and it avoids reparsing the
 * stored document on every render.
 */
export declare class TaskTabBindings {
    private readonly liveTabIds?;
    private readonly memory;
    /**
     * @param liveTabIds - the committed layout's tab ids for one Session, read when an entry is stored.
     */
    constructor(liveTabIds?: TaskTabLiveIds | undefined);
    /**
     * Read the task one page last showed.
     *
     * An entry whose kind or contentId differs from the page reading it belongs to
     * a layout id that has since been reused; the read reports no task and leaves
     * the document untouched, and `dropMismatched` removes it after the render.
     * @param sessionId - the Session holding the tab.
     * @param page - the restored layout record.
     * @returns the task to show, or undefined when the page has no applicable entry.
     */
    read(sessionId: SessionId, page: TaskTabPage): TaskTabTarget | undefined;
    /**
     * Drop one page's entry when it recorded another kind or contentId.
     *
     * A read reports the mismatch without writing, so the page resolves its target
     * in a render and drops the entry from an effect; a render React discards must
     * not rewrite what it read.
     * @param sessionId - the Session holding the tab.
     * @param page - the layout record the stored entry has to match.
     */
    dropMismatched(sessionId: SessionId, page: TaskTabPage): void;
    /**
     * Record the task one page now shows.
     * @param sessionId - the Session holding the tab.
     * @param page - the navigated layout record.
     * @param target - the task the navigation named.
     */
    write(sessionId: SessionId, page: TaskTabPage, target: TaskTabTarget): void;
    /**
     * Drop one page's entry once a read that succeeded after the tab appeared shows
     * its task is gone.
     * @param sessionId - the Session holding the tab.
     * @param page - the layout record whose entry is removed.
     */
    forget(sessionId: SessionId, page: TaskTabPage): void;
    /** Release this window's cached documents. */
    clear(): void;
    /**
     * One Session's entries, from this window or from storage.
     * @param sessionId - the Session holding the tabs.
     * @returns its entries, empty when nothing is saved or storage is unreachable.
     */
    private document;
    /**
     * Replace one Session's entries, dropping those of tabs a non-empty list of
     * committed ids does not hold, and publish them to this window and to storage.
     * An empty result removes the Session's key rather than storing an empty
     * document.
     * @param sessionId - the Session holding the tabs.
     * @param entries - the complete replacement set.
     */
    private store;
}
//# sourceMappingURL=task-tab-bindings.d.ts.map