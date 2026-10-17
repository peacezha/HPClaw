/** Right-Sidebar presentation of an existing subagent Conversation. */
import type { Context } from '@deepseek-ai/cordis';
import type { SessionReference } from '@deepseek-ai/dsh-api-session-controller/client';
import type { ConversationViewsProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { PropsRenderFactories, PropsRenderSlots, PropsRuntime, TranslateNS } from '@deepseek-ai/dsh-client-ui-slots';
import type { SubagentAddress } from '@deepseek-ai/dsh-subagent/client';
import type { NS } from '../locales.ts';
/** Stable implementation identity for the Sidebar tab body. */
export declare const SUBAGENT_CHAT_ID = "@deepseek-ai/dsh-client-ui-subagent";
/** Resource-address prefix for an embedded Session chat. */
export declare const SUBAGENT_CHAT_ADDRESS = "dsh-resource://subagentchat/session/";
/** Value retained by one live chat resource occurrence. */
export interface SubagentChatResource {
    readonly address: SubagentAddress;
    readonly reference: SessionReference;
}
declare module '@deepseek-ai/dsh-api-session-controller/client' {
    interface SessionReferenceSourceMap {
        sidebarChat: unknown;
    }
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface ResourceProtocolMap {
        subagentchat: SubagentChatResource;
    }
    interface SlotMap {
        /** Session-scoped Conversation occurrence hosted by one Sidebar chat tab. */
        'sidebar.chat.conversation': {
            kind: 'single';
            scope: 'session';
        };
    }
}
/**
 * Address one subagent Session together with the routing facts needed to restore it.
 * @param address - durable direct-parent subagent address.
 * @returns canonical Sidebar resource address.
 */
export declare function subagentChatAddress(address: SubagentAddress): string;
/**
 * Parse one canonical Sidebar chat resource address.
 * @param value - possible chat resource address.
 * @returns the encoded direct-parent address, or undefined for another or malformed resource.
 */
export declare function parseSubagentChatAddress(value: string): SubagentAddress | undefined;
/** Fixed Chat selection used by an embedded Conversation occurrence. */
export declare function FixedChatConversationView(props: ConversationViewsProps): import("react").JSX.Element;
/** Props supplied to the child-Session Conversation host. */
export type ConversationSlotPanelProps = PropsRuntime<'sidebar.chat.conversation'> & PropsRenderFactories;
/** Render the shared Conversation content for one explicitly provided child Session. */
export declare function ConversationSlotPanel({ sessionId, useSession, useConversation, useSessions, renderFactorySlot, }: ConversationSlotPanelProps): import("react").ReactNode;
/** Props supplied to the parent-Session Sidebar tab body. */
export type SidebarChatTabProps = PropsRuntime<'sidebar.right.pane.tab'> & PropsRenderSlots<'sidebar.chat.conversation'>;
/** Bind a chat resource's child reference around its Conversation slot. */
export declare function SidebarChatTab({ useResource, useTabInfo, SessionProvider, renderSlot }: SidebarChatTabProps): import("react").JSX.Element;
/**
 * Register the chat resource owner and its right-Sidebar presentation.
 * @param ctx - Client root carrying Sessions, resources, Slots, and Sidebar registries.
 * @param t - Chat namespace translator used for fallback tab titles.
 */
export declare function registerSidebarChat(ctx: Context, t: TranslateNS<typeof NS>): void;
//# sourceMappingURL=index.d.ts.map