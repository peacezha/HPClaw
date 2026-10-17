/** Runtime plugin trees shared by Agents selecting one preset revision. */
import { Context } from '@deepseek-ai/cordis';
import { EntryTree } from '@deepseek-ai/cordis-plugin-loader';
import { prepareProfileEntries } from '@deepseek-ai/dsh-app-boot';
import { scopeOf } from '@deepseek-ai/dsh-scope';
/** In-memory Loader tree; only the profile configuration editor persists definitions. */
class PresetTree extends EntryTree {
    constructor(ctx) {
        const owner = ctx.fiber.entry;
        const subtree = owner?.subtree;
        const subgroup = owner?.subgroup;
        super(ctx);
        if (owner !== undefined) {
            if (subtree === undefined)
                delete owner.subtree;
            else
                owner.subtree = subtree;
            if (subgroup === undefined)
                delete owner.subgroup;
            else
                owner.subgroup = subgroup;
        }
    }
    write() { }
}
/**
 * Whether `fiber` is `root` itself or is mounted anywhere inside its subtree.
 *
 * Membership is object identity. `uid` looks like a cheaper key but is a
 * per-registry counter, so fibers in two different roots collide on it and a
 * subtree in one runtime would be blamed for a service published in another.
 * @param fiber - the fiber to locate.
 * @param root - the subtree root to test membership against.
 * @returns true when `fiber` belongs to `root`'s subtree.
 */
function withinFiber(fiber, root) {
    let current = fiber;
    while (true) {
        if (current === root)
            return true;
        const parent = current.parent.fiber;
        if (parent === current)
            return false;
        current = parent;
    }
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
export function leakedServices(ctx, mount) {
    const store = ctx.reflect.store;
    const rootIsolate = ctx.root[Context.isolate];
    const leaked = [];
    for (const key of Object.getOwnPropertySymbols(store)) {
        const impl = store[key];
        /* v8 ignore next -- cordis deletes a store slot on disposal rather than
           clearing it, so an own symbol always resolves; the guard exists only
           because the store's index signature is optional. */
        if (impl === undefined)
            continue;
        if (!withinFiber(impl.fiber, mount))
            continue;
        if (rootIsolate[impl.name] === key)
            leaked.push(impl.name);
    }
    return leaked.sort((left, right) => left.localeCompare(right));
}
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
export function serviceForMount(ctx, mount, name) {
    const store = ctx.reflect.store;
    for (const key of Object.getOwnPropertySymbols(store)) {
        const impl = store[key];
        /* v8 ignore next -- cordis deletes a store slot on disposal rather than clearing it */
        if (impl === undefined)
            continue;
        if (impl.name !== name)
            continue;
        if (withinFiber(impl.fiber, mount.fiber))
            return impl.value;
    }
    return undefined;
}
/**
 * Audit the rows of a mounted subtree.
 *
 * Wait for the subtree, then report import failures, activation failures, and
 * rows waiting for services the composition does not supply.
 * @param tree - the mounted subtree.
 * @returns failed and pending rows, both empty when every enabled row is usable.
 */
export async function auditRows(tree) {
    await tree.await();
    const failed = [];
    const pending = [];
    for (const entry of tree.entries()) {
        if (entry.disabled)
            continue;
        const fiber = entry.fiber;
        if (fiber === undefined) {
            failed.push(`${entry.options.id} (${entry.options.name}): never started`);
            continue;
        }
        try {
            await fiber.await();
        }
        catch (error) {
            const detail = mountDetail(error);
            failed.push(`${entry.options.id} (${entry.options.name}): ${detail}`);
            continue;
        }
        const missing = Object.keys(fiber.inject).filter(name => fiber.ctx.get(name) === undefined);
        if (missing.length > 0) {
            pending.push(`${entry.options.id} (${entry.options.name}): waiting for ${missing.join(', ')}`);
        }
    }
    return { failed, pending };
}
/**
 * The causes of `error` whose detail its own message does not already carry.
 *
 * Aggregate errors carry separate member messages. A wrapper can preserve the
 * aggregate as its cause without including those messages in its own text.
 * @param error - the failure to read branches from.
 * @returns the branches to render beneath `error.message`, possibly empty.
 */
function detailBranches(error) {
    if (error instanceof AggregateError)
        return error.errors;
    return error.cause instanceof AggregateError ? error.cause.errors : [];
}
/**
 * The reportable text of a mount failure.
 *
 * A plugin may reject with an aggregate or wrap one as its cause. Include its
 * member messages beneath the row diagnostic so each failure is visible.
 * @param error - the value the mount rejected with.
 * @returns a single-line-per-cause description.
 */
function mountDetail(error) {
    if (!(error instanceof Error))
        return String(error);
    const branches = detailBranches(error);
    if (branches.length === 0)
        return error.message;
    return [
        error.message,
        ...branches.map(branch => `- ${mountDetail(branch).replaceAll('\n', '\n  ')}`),
    ].join('\n');
}
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
export async function mountPreset(ctx, id, plugins) {
    if (scopeOf(ctx) === undefined)
        throw new Error('agent-preset: mounting requires a scope');
    await ctx.fiber.await();
    const tree = new PresetTree(ctx);
    ctx.effect(() => () => { tree.root.stop(); }, 'agent-preset.tree');
    await tree.root.update(prepareProfileEntries(ctx, plugins, ctx.baseUrl));
    const audit = await auditRows(tree);
    const leaked = leakedServices(ctx, ctx.fiber);
    if (audit.failed.length > 0)
        throw new Error(audit.failed.join('\n'));
    if (leaked.length > 0)
        throw new Error(`Preset services require isolate realms: ${leaked.join(', ')}`);
    const mount = { presetId: id, fiber: ctx.fiber, tree, key: scopeOf(ctx) };
    return mount;
}
//# sourceMappingURL=mount.js.map