import type { Volatile } from '@deepseek-ai/cordis';
import { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { Session } from '@deepseek-ai/dsh-session';
import type { SandboxMode } from '@deepseek-ai/dsh-sandbox';
import type { ApprovalPolicy } from '@deepseek-ai/dsh-user-approval';
import type { PermissionCatalog, PresetOption } from './types.ts';
export type * from './types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        permissionPresets: PermissionPresetService;
    }
}
declare module '@deepseek-ai/dsh-session-projection/types' {
    interface SessionProjectionStateMap {
        /** Latest logged permission overrides and constructor-seed status. */
        permissions: PermissionProjectionState;
    }
}
declare module '@deepseek-ai/dsh-session/types' {
    interface SessionEventMap {
        /**
         * Records the selected preset as durable, log-only user intent. The knob
         * events follow in the same turn and control execution; this event stays
         * out of the model transcript and lets the permission projection unit
         * preserve a selection when bundles match.
         */
        'permission/preset': {
            preset: string;
        };
    }
}
/** One preset's sandbox/approval bundle and optional client presentation. */
export interface PresetSpec {
    /** The `sandbox/mode` value the preset writes through. */
    sandbox: SandboxMode;
    /** The `approval/policy` value the preset writes through. */
    approval: ApprovalPolicy;
    /** The display label a client shows for this preset; the raw table key when omitted. */
    name?: string;
    /** One user-facing sentence on what the preset means; omitted when not configured. */
    description?: string;
}
/**
 * Returned when effective knob values match no available preset. Clients may
 * show it as the current value, but it is never a switch target or event payload.
 */
export declare const CUSTOM_PRESET = "custom";
/** Canonical identity of the experimental per-call review preset. */
export declare const AUTO_PRESET = "auto";
/**
 * The projection unit's knob state: the last seen value of each knob event,
 * null before an override (composition defaults apply at view time).
 */
export interface KnobState {
    /** Last `permission/preset` payload, or null. */
    preset: string | null;
    /** Last `sandbox/mode` payload, or null. */
    sandbox: SandboxMode | null;
    /** Last `approval/policy` payload, or null. */
    approval: ApprovalPolicy | null;
}
/** Projection state for permission overrides and constructor-seed status. */
interface PermissionProjectionState extends KnobState {
    /** Whether the log contains a constructor-seed boundary. */
    seeded: boolean;
}
/** User setting resolved when a new session receives its initial permission. */
export interface PermissionSettings {
    /** Preset pinned into a newly created session. */
    defaultPreset: string;
}
/** The {@link PermissionPresetService} config: preset table and composition default. */
export interface Config {
    /**
     * The preset table: name → knob bundle. Defaults to `workspace-write`
     * (workspace-write + ask) and `danger-full-access` (danger-full-access +
     * never). The names `custom` and `auto` are reserved for derived state and
     * the Auto review integration respectively.
     */
    presets: Record<string, PresetSpec>;
    /**
     * Default for new sessions. When omitted, the preset matching the composed
     * sandbox and approval defaults is used.
     */
    defaultPreset: Volatile<string | undefined>;
}
/**
 * Owns the deployment's configured permission presets, the fixed Auto
 * integration hook, and their write path. Requires a confining `ctx.shell` executor and
 * `ctx.approval`; unmatched knob values are reported as
 * {@link CUSTOM_PRESET}, not an error.
 */
export declare class PermissionPresetService extends TypertRemoteService {
    static Config: z<Schemastery.ObjectS<NoInfer<{
        presets: z<import("@deepseek-ai/cosmokit").Dict<{
            sandbox?: "read-only" | "workspace-write" | "danger-full-access" | null;
            approval?: "ask" | "never" | null;
            name?: string | null;
            description?: string | null;
        } & import("@deepseek-ai/cosmokit").Dict, string>, import("@deepseek-ai/cosmokit").Dict<Schemastery.ObjectT<NoInfer<{
            sandbox: z<"read-only" | "workspace-write" | "danger-full-access", "read-only" | "workspace-write" | "danger-full-access", "defined">;
            approval: z<"ask" | "never", "ask" | "never", "defined">;
            name: z<string, string, "plain">;
            description: z<string, string, "plain">;
        }>>, string>, "defined">;
        defaultPreset: z<string, string, "volatile">;
    }>>, Schemastery.ObjectT<NoInfer<{
        presets: z<import("@deepseek-ai/cosmokit").Dict<{
            sandbox?: "read-only" | "workspace-write" | "danger-full-access" | null;
            approval?: "ask" | "never" | null;
            name?: string | null;
            description?: string | null;
        } & import("@deepseek-ai/cosmokit").Dict, string>, import("@deepseek-ai/cosmokit").Dict<Schemastery.ObjectT<NoInfer<{
            sandbox: z<"read-only" | "workspace-write" | "danger-full-access", "read-only" | "workspace-write" | "danger-full-access", "defined">;
            approval: z<"ask" | "never", "ask" | "never", "defined">;
            name: z<string, string, "plain">;
            description: z<string, string, "plain">;
        }>>, string>, "defined">;
        defaultPreset: z<string, string, "volatile">;
    }>>, "plain">;
    static inject: string[];
    private readonly presets;
    private autoAdmit;
    private defaultSettings;
    constructor(ctx: Context, config: Config);
    /**
     * The advertised preset names: configured entries in declaration order,
     * followed by Auto while its integration is live.
     * @returns every switchable preset name.
     */
    get names(): readonly string[];
    /**
     * Read the complete process-level catalog exposed to current-session UI.
     * @returns every currently selectable preset in contribution order.
     */
    catalog(): PermissionCatalog;
    /**
     * Publish the fixed current-session Auto preset for the calling
     * integration's effect lifetime.
     * @param admit - synchronous gate run before live Auto selection or restore.
     * @returns the async effect disposer that removes Auto.
     */
    registerAuto(admit: () => void): () => Promise<void>;
    /**
     * The preset currently selected as the default for future sessions.
     * @returns the resolved settings value, or the composition default without
     * a mounted settings provider.
     */
    get defaultPreset(): string;
    private permissionState;
    /**
     * Resolve the preset matching the effective knob values. A still-matching
     * last selection wins shared-bundle ties, and a still-selected Auto also
     * matches the `never` approval policy; otherwise the first configured
     * match wins. Returns
     * {@link CUSTOM_PRESET} when no available preset matches.
     * @param session - the session whose knob state is read.
     * @returns the effective preset name, or `custom` when nothing matches.
     */
    current(session: Session): string;
    /** Resolve the preset for one folded knob state (the shared mathematics of `current` and the projection unit). */
    private derive;
    /**
     * Resolve an available preset's knob bundle.
     * @param name - the preset name to resolve.
     * @returns the configured bundle.
     * @throws when `name` is neither configured nor the currently live Auto preset.
     */
    resolve(name: string): PresetSpec;
    /**
     * Build the client option for an available preset or {@link CUSTOM_PRESET}.
     * A missing label falls back to the preset key.
     * @param name - a configured preset key, live `auto`, or `custom`.
     * @returns the option a client renders.
     * @throws when `name` is neither a configured preset, live `auto`, nor `custom`.
     */
    optionOf(name: string): PresetOption;
    /**
     * Record a changed preset, then update each changed knob through its own
     * setter. Selecting the effective preset again appends nothing.
     * @param session - the session the switch belongs to.
     * @param name - the preset to switch to; unknown names throw.
     */
    set(session: Session, name: string): void;
    /** Apply one preset through its durable identity and canonical knob setters. */
    private apply;
    /**
     * Fill every missing permission fact before a session is published. A
     * genuinely fresh session uses the current user default; seeded or partially
     * initialized sessions preserve their effective knob values and only gain
     * the missing durable facts. A stored Auto identity requires its live
     * integration and passes its admission check before
     * publication.
     */
    private pinInitialPermission;
    /** Publish a non-vetoing payload-free catalog invalidation. */
    private emitCatalogChanged;
    /** Resolve one configured or currently live fixed preset without throwing. */
    private specOf;
}
export default PermissionPresetService;
//# sourceMappingURL=index.d.ts.map