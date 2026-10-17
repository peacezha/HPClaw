import type { SubagentAddress } from '@deepseek-ai/dsh-subagent/client';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Business actions supplied by the slot registration. */
export interface SubagentCatalogInjected {
    openChild: (address: SubagentAddress) => void;
    openChildAside: (address: SubagentAddress) => void;
    refreshProjection: (parentSessionId: SessionId) => void;
}
/** Full props for the session-header lineage renderer. */
export type SubagentHeaderLineageProps = PropsRuntime<'conversation.session.header.lineage'> & SubagentCatalogInjected & PropsLocale<typeof NS>;
/** Full props for the root-session catalog entry in the header actions band. */
export type SubagentCatalogActionProps = PropsRuntime<'conversation.session.header.actions'> & SubagentCatalogInjected & PropsLocale<typeof NS>;
/**
 * Session-header catalog action for root sessions: the descendant count and
 * its dropdown after the preset label in the header actions band. Child sessions render nothing
 * here — their breadcrumb switcher in the lineage slot owns the same
 * navigation.
 * @param props - Session standard props plus the catalog actions and translator.
 * @returns The count dropdown, or null on a child session.
 */
export declare function SubagentCatalogAction({ sessionId, useSessions, useSessionStatus, openChild, openChildAside, refreshProjection, t, }: SubagentCatalogActionProps): import("react").JSX.Element | null;
/**
 * Render one breadcrumb title together with its subagent navigation.
 * @param props - Breadcrumb title, session standard props, and catalog actions.
 * @returns A title-and-chevron sibling switcher, or nothing on a root session.
 */
export declare function SubagentHeaderLineage({ lineageSessionId, displayTitle, openTitle, useSessions, useSession, useSessionStatus, openChild, openChildAside, refreshProjection, t, }: SubagentHeaderLineageProps): import("react").JSX.Element | null;
//# sourceMappingURL=SubagentHeaderLineage.d.ts.map