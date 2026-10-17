/**
 * The browser twin of the tool-cordis context facade: a whitelist of
 * lifecycle-safe verbs plus optional `ctx.get()` lookup and declared-service
 * property access, with
 * framework internals withheld and Context-valued returns denied. Two seats
 * carry extra machinery: `slots`, where the registration proxy assigns any
 * shadowing priority and ledgers ordinary entries or Factory definitions — invoking the service with
 * the traced receiver so the effect lands on the CALLING plugin's fiber
 * (SlotRegistry.register must stay a prototype method for exactly that
 * reason) — and `theme`, whose override source is pinned to the package id.
 *
 * This is API discipline, not a security boundary: a dynamic package's code is
 * as trusted as the host process that accepted its definition.
 */
import { Context } from '@deepseek-ai/cordis';
import type { DynamicCordisPackage } from '@deepseek-ai/dsh-api-remotes/client';
/** One package's Slot or Factory registration ledger row (contribution projection source). */
export interface DynamicCordisSlotLedgerRow {
    /** Target Slot name, or `factory:<name>` for a Factory definition. */
    slot: string;
    /** The assigned shadowing priority (globally unique — how winners are matched back to packages). */
    priority: number | undefined;
}
/** What the facade needs beyond the real ctx to govern one package. */
export interface DynamicCordisGuardEnv {
    /** The dispatched Package row. */
    pkg: DynamicCordisPackage;
    /** Ledger sink: every Slot or Factory registration this package makes. */
    ledger: DynamicCordisSlotLedgerRow[];
    /**
     * Ownership index sink: the component object seated in a slot, so a later
     * render crash reported against the stored entry can be attributed back to
     * this package. Identity is the key — the registry stores the component
     * verbatim — which is why nothing else has to be remembered about the entry.
     * @param component - whatever the package passed as its component.
     */
    claim(component: unknown): void;
    /** Allocate one page-local shadowing rank; later registrations sort first. */
    allocatePriority(): number;
    /** Report one post-activation guard rejection to the owning Agent. */
    reportFailure(error: Error): void;
}
/**
 * Build the facade one dynamic plugin's `apply` receives (host sandboxContext
 * twin, browser seats). `ctx.get(name)` performs optional lookup; direct
 * `ctx.serviceName` access is gated by the fiber's `inject` declaration.
 * @param ctx - the plugin's real fiber ctx (loader-created).
 * @param env - package row + ledger sink.
 * @returns the whitelisting proxy standing in for ctx.
 */
export declare function dynamicCordisContext(ctx: Context, env: DynamicCordisGuardEnv): Context;
//# sourceMappingURL=guard.d.ts.map