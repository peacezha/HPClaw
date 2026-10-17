import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Business actions injected by the browser plugin. */
export interface TeamActionInjected {
    /** Open a roster Session from the current conversation. */
    openTeammate: (sessionId: SessionId, childSessionId: SessionId) => void;
}
/** Full props of the Team conversation-header action. */
export type TeamActionProps = PropsRuntime<'conversation.session.header.actions'> & TeamActionInjected & PropsLocale<typeof NS>;
/** Render the Team roster and read-only task board. */
export declare function TeamAction({ sessionId, useSession, useSessions, useSessionStatus, openTeammate, t, }: TeamActionProps): import("react").JSX.Element;
//# sourceMappingURL=TeamAction.d.ts.map