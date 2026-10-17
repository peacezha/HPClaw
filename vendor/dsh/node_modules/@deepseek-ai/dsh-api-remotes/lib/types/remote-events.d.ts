/**
 * The one home of this application's forwarded-Host-event allowlist. Both
 * compiler faces list this file, so the Host forwarding loop and the consumer
 * `ctx.remote.$on` key face read one declaration instead of two copies that
 * could drift; `./types.ts` derives the type projection from it and stays
 * type-only.
 */
import type { SessionId } from '@deepseek-ai/dsh-session/types';
/**
 * Host events this application forwards without renaming. The explicit mode is
 * both the Host dispatch strategy and the legal key set of `ctx.remote.$on`.
 * An `emit` entry declares readers of the resources its payload carries, or
 * none to touch the built-in `global` resource; it reaches a non-owner Peer
 * only when access control allows it. Each notification names one resource
 * identity or none, and collection changes travel on follow streams instead.
 */
export declare const API_REMOTE_FORWARDED_EVENTS: readonly [{
    readonly event: "agent-preset/selected";
    readonly mode: "emit";
}, {
    readonly event: "approval/request";
    readonly mode: "waterfall";
}, {
    readonly event: "api-session/activity";
    readonly mode: "emit";
    readonly resources: {
        readonly session: (sessionId: SessionId) => SessionId;
    };
}, {
    readonly event: "api-session/added";
    readonly mode: "emit";
    readonly resources: {
        readonly session: (summary: import("@deepseek-ai/dsh-api-session-controller/types").SessionSummary) => SessionId;
    };
}, {
    readonly event: "api-session/error";
    readonly mode: "emit";
    readonly resources: {
        readonly session: (sessionId: SessionId) => SessionId;
    };
}, {
    readonly event: "api-session/removed";
    readonly mode: "emit";
    readonly resources: {
        readonly session: (sessionId: SessionId) => SessionId;
    };
}, {
    readonly event: "api-session/status";
    readonly mode: "emit";
    readonly resources: {
        readonly session: (sessionId: SessionId) => SessionId;
    };
}, {
    readonly event: "commands/change";
    readonly mode: "emit";
}, {
    readonly event: "deepseek-account/session-expired";
    readonly mode: "emit";
}, {
    readonly event: "deepseek-account/model-sign-in-required";
    readonly mode: "emit";
}, {
    readonly event: "credentials/record-updated";
    readonly mode: "emit";
}, {
    readonly event: "credentials/reference-updated";
    readonly mode: "emit";
}, {
    readonly event: "goal/activation-changed";
    readonly mode: "emit";
}, {
    readonly event: "cordis/request-run";
    readonly mode: "emit";
}, {
    readonly event: "cordis/request-run-resolved";
    readonly mode: "emit";
}, {
    readonly event: "cordis/dynamic-package";
    readonly mode: "emit";
}, {
    readonly event: "cordis/dynamic-retract";
    readonly mode: "emit";
}, {
    readonly event: "cordis/inspect-query";
    readonly mode: "emit";
}, {
    readonly event: "cordis/inspect-query-resolved";
    readonly mode: "emit";
}, {
    readonly event: "llm/adapters-updated";
    readonly mode: "emit";
}, {
    readonly event: "permission-presets/catalog-changed";
    readonly mode: "emit";
}, {
    readonly event: "plugin-manager/changed";
    readonly mode: "emit";
}, {
    readonly event: "plugin-manager/install-log";
    readonly mode: "emit";
}, {
    readonly event: "plugin-manager/install-state";
    readonly mode: "emit";
}, {
    readonly event: "plugin-market/changed";
    readonly mode: "emit";
}, {
    readonly event: "settings/document-updated";
    readonly mode: "emit";
}, {
    readonly event: "schedule/changed";
    readonly mode: "emit";
}, {
    readonly event: "user-questions/request";
    readonly mode: "waterfall";
}];
//# sourceMappingURL=remote-events.d.ts.map