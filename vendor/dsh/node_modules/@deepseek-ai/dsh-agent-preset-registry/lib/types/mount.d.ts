/** Runtime plugin trees shared by Agents selecting one preset revision. */
import { Context, type Fiber } from '@deepseek-ai/cordis';
import { EntryTree } from '@deepseek-ai/cordis-plugin-loader';
import type { PresetDefinition } from './definition.ts';
import { type ScopeKey } from '@deepseek-ai/dsh-scope';
/** One live revision shared by Agents and scoped readers. */
export interface PresetMount {
    /** The preset the subtree was composed from. */
    readonly presetId: string;
    /** The mounted subtree's fiber. */
    readonly fiber: Fiber;
    /** Loader entry tree whose active rows form this standing composition. */
    readonly tree: EntryTree;
    /** The standing scope key agents are parented to (undefined only in torn-down records). */
    readonly key: ScopeKey | undefined;
}
/**
 * Service names the mounted subtree published into the root realm.
 *
 * A provider without an `isolate` realm stores its implementation under the
 * root's symbol for that name, which is exactly the comparison below; a
 * provider inside an `isolate` realm stores under a realm-private symbol and
 * is correctly absent here.
 * @param ctx - any context of the runtime whose service store is inspected.
 * @param mount - the mounted subtree's fiber.
 * @returns the leaked service names in lexical order.
 */
export declare function leakedServices(ctx: Context, mount: Fiber): string[];
/**
 * Read a service implementation owned by one retained preset, including isolated realms.
 *
 * Ownership is the same relation {@link leakedServices} reads, inverted: there
 * it names implementations a subtree published into the ROOT realm, here it
 * names the one this subtree published anywhere. Fiber membership is object
 * identity for the reason stated on {@link withinFiber}.
 *
 * @param ctx - any context of the runtime whose service store is inspected.
 * @param mount - the retained revision whose subtree owns the service.
 * @param name - the service name as the preset's rows resolve it.
 * @returns the implementation, or undefined when the mount provides none.
 */
export declare function serviceForMount<K extends string & keyof Context>(ctx: Context, mount: PresetMount, name: K): Context[K] | undefined;
/** Rows that did not reach a usable state, each rendered as one diagnostic line. */
export interface RowAudit {
    /** Rows that never started or whose import or activation rejected. */
    readonly failed: string[];
    /**
     * Rows waiting for a service the composition does not supply. A Host
     * provider still activating completes such a row later; only a settled Host
     * tree tells that case from a genuinely missing service.
     */
    readonly pending: string[];
}
/**
 * Audit the rows of a mounted subtree.
 *
 * Wait for the subtree, then report import failures, activation failures, and
 * rows waiting for services the composition does not supply.
 * @param tree - the mounted subtree.
 * @returns failed and pending rows, both empty when every enabled row is usable.
 */
export declare function auditRows(tree: EntryTree): Promise<RowAudit>;
/** Load and audit one revision under its registry-owned scope.
 *
 * Failed rows and root-realm service leaks reject the mount. Rows waiting for
 * a Host service stay mounted: they activate by themselves once the provider
 * finishes, and the registry re-audits them after the Host tree settles.
 * Inside a profile, compatibility policy decides admission first: a row whose
 * plugin the profile denies mounts disabled, so the audit reads it as
 * intentionally inactive instead of reporting a failed import.
 * @param ctx Scope context inheriting the declaring Loader's resolution base.
 * @param id Preset identity.
 * @param plugins Declared Cordis entry list.
 * @returns The live tree; scope disposal owns its teardown.
 */
export declare function mountPreset(ctx: Context, id: string, plugins: PresetDefinition['plugins']): Promise<PresetMount>;
//# sourceMappingURL=mount.d.ts.map