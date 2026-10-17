/** Config-schema projection and form edits over Cordis profile patches. */
import { existsSync } from 'node:fs';
import { readFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { Service, resolveConfig } from '@deepseek-ai/cordis';
import { interpolate } from '@deepseek-ai/cordis-plugin-loader';
import { redactSecrets } from "./redact.js";
import { isVolatilePath, plainConfig, projectForm, volatileForm } from "./schema.js";
export { redactSecrets } from "./redact.js";
/** Refusal to overwrite configuration changed since the form was read. */
export class SettingsConflictError extends Error {
    /** Stable machine code for wire layers mapping this to their own taxonomy. */
    code = 'SETTINGS_CONFLICT';
    /** The revision the write expected. */
    expected;
    /** The revision the namespace actually stands at. */
    actual;
    /**
     * @param ns - the namespace whose write was refused.
     * @param expected - the revision the caller sent.
     * @param actual - the revision now stored.
     */
    constructor(ns, expected, actual) {
        super(`settings namespace "${ns}" changed since it was read (expected revision ${String(expected)}, now ${String(actual)})`);
        this.name = 'SettingsConflictError';
        this.expected = expected;
        this.actual = actual;
    }
}
/** Whether a value is a plain data object (not an array, null, or class instance). */
function isPlainObject(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value))
        return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
/** Apply one path op to a detached section, returning the next section. */
function applyPathOp(section, op, schema) {
    const edit = (input, path, node) => {
        const [head, ...rest] = path;
        if (head === undefined)
            return op.op === 'set' ? op.value : undefined;
        const value = input === undefined ? node?.meta.default : input;
        if (Array.isArray(value)) {
            if (!/^(0|[1-9][0-9]*)$/.test(head) || (Number(head) > value.length || Number(head) === value.length && (rest.length > 0 || op.op === 'unset'))) {
                throw new TypeError(`Config array index "${head}" is out of range`);
            }
            const result = [...value];
            const index = Number(head);
            if (rest.length === 0 && op.op === 'unset')
                result.splice(index, 1);
            else
                result[index] = edit(value[index], rest, node?.inner);
            return result;
        }
        const result = isPlainObject(value) ? { ...value } : {};
        const child = edit(Object.hasOwn(result, head) ? result[head] : undefined, rest, node?.dict?.[head] ?? node?.inner);
        if (child === undefined)
            Reflect.deleteProperty(result, head);
        else
            Object.defineProperty(result, head, { value: child, enumerable: true, writable: true, configurable: true });
        return result;
    };
    const result = edit(section, op.path, schema);
    if (!isPlainObject(result))
        throw new TypeError('Config root must be a plain object');
    return result;
}
/** Human label for a value that lossless JSON cannot represent (numbers reject inline). */
function describeRejected(value) {
    if (value === undefined)
        return 'undefined';
    if (typeof value === 'object' && value !== null) {
        const proto = Object.getPrototypeOf(value);
        const name = proto?.constructor?.name;
        return name === undefined || name === 'Object' ? 'a non-plain object' : `a ${name}`;
    }
    return `a ${typeof value}`;
}
/**
 * Detach and validate one write input in a single walk before persistence:
 * only JSON data (plain objects, arrays, strings, finite numbers,
 * booleans, `null`) may reach a provider document. `structuredClone` alone
 * would admit Dates, Maps, BigInts, and cycles that YAML/JSON storage then
 * silently distorts on the reload round-trip. `undefined` entries in objects
 * are skipped — the same sparse-patch semantics as {@link mergeLayers} — while
 * an `undefined` array entry is rejected rather than coerced.
 * @param root - write input to validate before merging.
 * @returns the detached JSON-compatible clone.
 */
function cloneJsonShaped(root) {
    const reject = (label, path) => new TypeError(`Config ${path} contains ${label}`);
    if (!isPlainObject(root))
        throw reject('a non-plain root', '$');
    const visiting = new WeakSet();
    const clone = (value, path) => {
        if (value === null || typeof value === 'string' || typeof value === 'boolean')
            return value;
        if (typeof value === 'number') {
            if (!Number.isFinite(value))
                throw reject('a non-finite number', path);
            return value;
        }
        if (Array.isArray(value)) {
            if (visiting.has(value))
                throw reject('a circular reference', path);
            visiting.add(value);
            const entries = value.map((entry, index) => clone(entry, `${path}[${index}]`));
            // Un-mark on exit so one object referenced twice without a cycle passes.
            visiting.delete(value);
            return entries;
        }
        if (isPlainObject(value)) {
            if (visiting.has(value))
                throw reject('a circular reference', path);
            visiting.add(value);
            const out = {};
            for (const [key, entry] of Object.entries(value)) {
                if (entry === undefined)
                    continue;
                Object.defineProperty(out, key, { value: clone(entry, `${path}.${key}`), enumerable: true, configurable: true, writable: true });
            }
            visiting.delete(value);
            return out;
        }
        throw reject(describeRejected(value), path);
    };
    return clone(root, '$');
}
/**
 * Layer `over` onto `under`: plain objects merge recursively, every other
 * value (arrays included) replaces the lower layer wholesale. `over` never
 * carries `undefined` entries — sections come from parsed documents and write
 * snapshots pass {@link cloneJsonShaped}, which strips them so a sparse patch
 * cannot erase lower keys.
 */
function mergeLayers(under, over) {
    if (!isPlainObject(under) || !isPlainObject(over))
        return over;
    const merged = { ...under };
    for (const [key, value] of Object.entries(over)) {
        Object.defineProperty(merged, key, {
            value: Object.hasOwn(merged, key) ? mergeLayers(merged[key], value) : value,
            enumerable: true, configurable: true, writable: true,
        });
    }
    return merged;
}
/** Read one member of a plain object or array; `own` limits the read to own properties.
 * @param node Candidate container.
 * @param key Member name.
 * @param own Whether inherited members count as absent.
 * @returns The member, or undefined when the node is not a container or lacks the member.
 */
function member(node, key, own = false) {
    if (!(isPlainObject(node) || Array.isArray(node)) || (own && !Object.hasOwn(node, key)))
        return undefined;
    const value = Reflect.get(node, key);
    return value;
}
/** Entry ids of the removed `settings.yaml` sections whose owning entry carries another id. */
const LEGACY_SECTION_ENTRIES = {
    'ui-developer-tools': 'ui-settings',
    'ui-onboarding': 'ui-settings-general',
    /* v8 ignore next -- the base bundle composes one shell executor per platform */
    shell: process.platform === 'win32' ? 'pwsh-sandbox' : 'bash-sandbox',
};
/** Resolve the inherited layers alone, or keep their raw values when required fields arrive only through the profile.
 * @param runtime Plugin runtime owning the Config schema.
 * @param inherited Interpolated config beneath the profile override.
 * @returns Values the profile override sits on.
 */
function inheritedConfig(runtime, inherited) {
    try {
        return resolveConfig(runtime, inherited);
    }
    catch (_error) {
        // The profile override supplies fields the inherited layers lack; the form shows their raw values as the base.
        return inherited;
    }
}
/** Project Config schemas into forms and own optional instance-level UI policy. */
export class SettingsForms extends Service {
    ownerContext;
    static inject = ['configEditor', 'profileContext'];
    revisions = new Map();
    closed = false;
    scheduled = false;
    presentations = new Map();
    constructor(ownerContext) {
        super(ownerContext, 'settings');
        this.ownerContext = ownerContext;
        const ctx = ownerContext;
        ctx.effect(() => () => { this.closed = true; });
        ctx.on('app-boot/config-reload', () => { this.invalidate(); });
        void ctx.root.loader.await().then(() => this.importLegacyDocument()).catch((error) => { ctx.logger.error(error); });
    }
    /** Move the sections of the removed `settings.yaml` into the active profile once the Loader has settled every entry.
     * The document is renamed before the first write, so a partial import never repeats; a section the running
     * composition rejects is logged and remains only in the renamed file. */
    async importLegacyDocument() {
        const profile = this.ownerContext.profileContext;
        const path = join(profile.home, 'settings.yaml');
        if (!existsSync(path))
            return;
        const imported = `${path}.imported`;
        await rename(path, imported);
        const sections = parse(await readFile(imported, 'utf8'));
        for (const [section, values] of Object.entries(sections ?? {})) {
            const ns = LEGACY_SECTION_ENTRIES[section] ?? section;
            try {
                await this.update(ns, values);
            }
            catch (error) {
                this.ownerContext.logger.warn('settings: section %s of %s was not imported into entry %s', section, imported, ns);
                this.ownerContext.logger.warn(error);
            }
        }
        this.ownerContext.logger.info('settings: imported %s into profile %s', imported, profile.name);
    }
    /** Register the calling plugin instance's page policy without changing its Config.
     * @param presentation Automatic-page policy for this instance; `auto` defaults to true.
     * @param owner Plugin instance the policy belongs to; defaults to the calling fiber.
     * @returns Disposer; register it with the calling plugin's effects.
     * @throws If this instance already has a registered policy.
     */
    configure(presentation, owner = this.ctx.fiber) {
        const fiber = owner;
        if (this.presentations.has(fiber))
            throw new Error('Settings presentation is already configured for this plugin instance');
        const policy = { ...presentation };
        this.presentations.set(fiber, policy);
        this.invalidate();
        return () => {
            if (this.presentations.get(fiber) !== policy)
                return;
            this.presentations.delete(fiber);
            this.invalidate();
        };
    }
    invalidate() {
        if (this.scheduled || this.closed)
            return;
        this.scheduled = true;
        queueMicrotask(() => {
            this.scheduled = false;
            if (this.closed || this.ownerContext.fiber.state !== 2 /* FiberState.ACTIVE */)
                return;
            try {
                this.describe();
            }
            catch (error) {
                this.ownerContext.logger.error(error);
            }
        });
    }
    /** Whether the active profile accepts form edits. */
    get writable() { return true; }
    /** Current profile patch shown by the native configuration editor. */
    get documentPath() { return this.ownerContext.configEditor.documentPath; }
    /** Locate the profile patch for native editing.
     * @returns The existing profile patch path.
     */
    prepareDocument() { return Promise.resolve(this.documentPath); }
    /** Read active plugin schemas and their live values.
     * @param options Redaction required for remote callers.
     * @returns Forms keyed by unique profile entry ids.
     */
    describe(options) {
        const active = new Set();
        const descriptors = this.ownerContext.configEditor.configuration().flatMap(({ entry, inherited, override }) => {
            const schema = this.schema(entry);
            if (schema === undefined || entry.fiber === undefined
                || entry.fiber.runtime === null || entry.fiber.state !== 2 /* FiberState.ACTIVE */)
                return [];
            const form = volatileForm(schema);
            if (form === undefined)
                return [];
            active.add(entry.id);
            const raw = JSON.stringify([entry.fiber.uid, schema.toJSON(), entry.options.config ?? {}]);
            const autoGenerate = this.presentations.get(entry.fiber)?.auto ?? true;
            const previous = this.revisions.get(entry.id);
            const revision = previous === undefined ? 0 : previous.revision + Number(previous.raw !== raw);
            this.revisions.set(entry.id, { raw, revision, ns: entry.options.id, autoGenerate });
            if (previous?.raw !== raw || previous.autoGenerate !== autoGenerate) {
                this.ownerContext.emit('settings/document-updated', entry.options.id, revision);
            }
            const value = projectForm(form, plainConfig(entry.fiber.config));
            const resolved = interpolate(entry.fiber.ctx, inherited);
            const base = projectForm(form, plainConfig(inheritedConfig(entry.fiber.runtime, resolved)));
            const user = projectForm(form, override);
            const redacted = redactSecrets(form, value);
            return [{
                    autoGenerate,
                    ns: entry.options.id, schema: form.toJSON(), revision, applies: 'live',
                    value: options?.redactSecrets ? redacted.value : value,
                    base: options?.redactSecrets ? redactSecrets(form, base).value : base,
                    user: options?.redactSecrets ? redactSecrets(form, user).value : user,
                    ...options?.redactSecrets ? { secrets: redacted.secrets } : {},
                }];
        });
        for (const [id, previous] of this.revisions) {
            if (active.has(id) || previous.raw === undefined)
                continue;
            const revision = previous.revision + 1;
            this.revisions.set(id, { ...previous, raw: undefined, revision });
            this.ownerContext.emit('settings/document-updated', previous.ns, revision);
        }
        return descriptors;
    }
    /** Merge editable fields into an entry's config.
     * @param ns Profile entry id.
     * @param patch Fields to merge.
     * @param expectedRevision Revision returned by describe.
     */
    async update(ns, patch, expectedRevision) {
        const input = cloneJsonShaped(patch);
        await this.write(ns, current => mergeLayers(current, input), expectedRevision);
    }
    /** Reset all live fields, then set the supplied fields; ordinary config is preserved.
     * @param ns Profile entry id.
     * @param section Complete form values.
     * @param expectedRevision Revision returned by describe.
     */
    async replace(ns, section, expectedRevision) {
        const input = cloneJsonShaped(section);
        await this.write(ns, (_current, base) => mergeLayers(base, input), expectedRevision);
    }
    /** Apply field edits without restating redacted secrets; unsetting an array index removes its element.
     * @param ns Profile entry id.
     * @param ops Ordered form edits.
     * @param expectedRevision Revision returned by describe.
     */
    async mutate(ns, ops, expectedRevision) {
        await this.write(ns, (current, base, schema) => ops.reduce((value, op) => {
            if (op.op === 'set')
                return applyPathOp(value, op, schema);
            const parent = op.path.slice(0, -1).reduce((node, key) => member(node, key), value);
            if (Array.isArray(parent))
                return applyPathOp(value, op, schema);
            const inherited = op.path.reduce((node, key) => member(node, key, true), base);
            return applyPathOp(value, inherited === undefined ? op : { op: 'set', path: op.path, value: inherited }, schema);
        }, current), expectedRevision, ops.map(op => op.path));
    }
    async write(ns, change, expected, paths = []) {
        const entry = this.ownerContext.configEditor.entries().find(row => row.options.id === ns);
        const schema = entry === undefined ? undefined : this.schema(entry);
        if (entry === undefined || schema === undefined)
            throw new Error(`No configurable plugin entry "${ns}"`);
        const form = volatileForm(schema);
        if (form === undefined)
            throw new Error(`Plugin entry "${ns}" has no volatile fields`);
        for (const path of paths) {
            if (path.length && !isVolatilePath(schema, path))
                throw new Error(`Config field "${path.join('.')}" is not volatile`);
        }
        await this.ownerContext.configEditor.edit(entry, (raw, inherited) => {
            const descriptor = this.describe().find(row => row.ns === ns);
            if (descriptor === undefined)
                throw new Error(`Plugin entry "${ns}" is no longer configurable`);
            if (expected !== undefined && descriptor.revision !== expected) {
                throw new SettingsConflictError(ns, expected, descriptor.revision);
            }
            const current = projectForm(form, raw);
            const base = projectForm(form, inherited);
            const next = cloneJsonShaped(change(current, base, schema));
            const validatePaths = (value, node, path = []) => {
                for (const [key, child] of Object.entries(value)) {
                    const target = [...path, key];
                    if (isVolatilePath(schema, target))
                        continue;
                    const fields = node.dict;
                    const field = Object.hasOwn(fields, key) ? fields[key] : undefined;
                    if (isPlainObject(child) && field !== undefined)
                        validatePaths(child, field, target);
                    else
                        throw new Error(`Config field "${target.join('.')}" is not volatile`);
                }
            };
            validatePaths(next, form);
            const strip = (value, node, path = []) => {
                if (isVolatilePath(schema, path))
                    return {};
                const result = { ...value };
                for (const [key, field] of Object.entries(node.dict)) {
                    const target = [...path, key];
                    if (isVolatilePath(schema, target))
                        Reflect.deleteProperty(result, key);
                    else if (isPlainObject(result[key]))
                        result[key] = strip(result[key], field, target);
                }
                return result;
            };
            return mergeLayers(strip(raw, form), next);
        });
        this.describe();
    }
    schema(entry) {
        const schema = entry.fiber?.runtime?.Config;
        return schema !== undefined && 'toJSON' in schema ? schema : undefined;
    }
}
export default SettingsForms;
//# sourceMappingURL=index.js.map