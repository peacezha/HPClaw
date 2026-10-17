/** One Sidebar Inspector with locally selected Chat and Session-log presentations. */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { InspectorInjected } from './InspectorTable.tsx';
import type { InspectorObjects, InspectorChatTarget } from './objects.ts';
import type { InspectorPickTarget } from './chat-node/pick-match.ts';
/** Local Inspector presentations; these are not separate Conversation View registrations. */
export type InspectorPresentation = 'chat-node' | 'session-log';
/** Both sources remain lazy: only the selected table subscribes. */
export interface SessionInspectorInjected {
    /** @returns This Session's displayed main Chat column, or undefined without one. */
    readonly chatRoot: () => HTMLElement | undefined;
    /**
     * @param owner - Visible picker button.
     * @param picked - True accepts the target; false keeps picking.
     * @param cancelled - Clear panel state when the gesture is cancelled or replaced.
     * @returns Silent cleanup, or undefined if the plugin is disposed or Chat is unavailable.
     */
    readonly pickChat: (owner: HTMLElement, picked: (target: InspectorPickTarget) => boolean, cancelled: () => void) => (() => void) | undefined;
    /** @param target - Log or object coordinates. @returns Exact and nearby loaded Chat identities. */
    readonly resolveChatTargets: (target: InspectorChatTarget) => readonly InspectorChatTarget[];
    readonly hooks: {
        readonly chatRows: InspectorInjected['hooks']['rows'];
        readonly logRows: InspectorInjected['hooks']['rows'];
    };
    readonly keyedHooks: {
        readonly chatRecord: InspectorInjected['keyedHooks']['record'];
        readonly logRecord: InspectorInjected['keyedHooks']['record'];
    };
    readonly loadOlder: InspectorInjected['loadOlder'];
    readonly objects: InspectorObjects;
    /** @param key - Row identity. @param mode - Current table. @returns Current raw type for filtering. */
    readonly recordType: (key: string, mode: InspectorPresentation) => string | undefined;
    /** @param key - Selected log row. @returns Its exact or approximate placement in the main Chat. */
    readonly logChatTarget: (key: string) => InspectorChatTarget | undefined;
    /** @param target - Picked Chat identity. @param mode - Current table. @returns Its closest loaded row, when available. */
    readonly pickRow: (target: InspectorPickTarget, mode: InspectorPresentation) => string | undefined;
}
/** Sidebar Session source and Inspector-owned actions and data. */
export type SessionInspectorProps = Pick<PropsRuntime<'sidebar.right.pane.tab'>, 'useSession'> & InjectFace<SessionInspectorInjected> & PropsLocale<'session-inspector'>;
/** @param props - Session-bound sources. @returns One Inspector with an in-toolbar presentation selector. */
export declare function SessionInspectorView(props: SessionInspectorProps): import("react").JSX.Element;
//# sourceMappingURL=View.d.ts.map