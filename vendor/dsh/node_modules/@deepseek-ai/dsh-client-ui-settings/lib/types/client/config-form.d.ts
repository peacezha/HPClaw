/** Shared entry values and ordered writes over the Host configuration mirror. */
import { DeveloperToolsPreference } from './developer-tools.ts';
import { Service } from '@deepseek-ai/cordis';
import type { Context } from '@deepseek-ai/cordis';
import type { SettingsPathOpView } from '@deepseek-ai/dsh-api-remotes/client';
import type { SettingsSchemaService } from './schema.ts';
import type { ConfigForm, ConfigFormSnapshot } from './config-form-types.ts';
import { SettingsDescribeMirror, type SettingsDescribeFace } from './settings-mirror.ts';
/** Domain-owned description of one settings namespace consumed by a browser plugin. */
interface ConfigFormSpec<T> {
    /** Settings namespace registered by the owning Host plugin. */
    namespace: string;
    /**
     * Narrow one wire section; undefined keeps the last accepted value. The
     * default validates the section against the namespace's own serialized wire
     * schema, so domains add a decoder only to narrow beyond that schema.
     */
    decode?: (section: unknown) => T | undefined;
}
/**
 * One namespace's derived view over the shared describe mirror, plus that
 * namespace's serialized Host writes. Writes carry the latest known namespace
 * revision, fold their answers back into the mirror, and teardown waits for
 * the operation already crossing the wire.
 */
export declare class ConfigFormController<T> implements ConfigForm<T> {
    private readonly ctx;
    private readonly spec;
    private readonly mirror;
    private readonly schema;
    private readonly store;
    private tail;
    private writeGeneration;
    private disposed;
    private readonly unsubscribe;
    /**
     * Revision answered by a superseded write still ahead of the mirror: the
     * mirror only folds the LATEST settlement in, so a queued successor takes
     * its fence from here first.
     */
    private pendingRevision;
    /**
     * @param ctx - the providing plugin's context, whose `remote.settings`
     * namespace carries this form's writes (reads ride the mirror).
     * @param spec - namespace identity and optional narrowing decoder.
     * @param mirror - the shared describe mirror this form derives from.
     * @param schema - settings-owned schema operations.
     */
    constructor(ctx: Context, spec: ConfigFormSpec<T>, mirror: SettingsDescribeMirror, schema: SettingsSchemaService);
    /** @returns the current sync snapshot (stable reference until the next change). */
    getSnapshot(): ConfigFormSnapshot<T>;
    /**
     * Observe snapshot replacements.
     * @param listener - invoked after each snapshot change.
     * @returns the disposer removing this listener.
     */
    subscribe(listener: () => void): () => void;
    /**
     * Queue one field write; see {@link ConfigForm.set} for the ordering,
     * revision, and recovery contract.
     * @param field - scalar field inside the namespace section.
     * @param value - JSON-shaped value selected by the user.
     * @returns whether the Host accepted the write, after any recovery read.
     */
    set(field: string, value: unknown): Promise<boolean>;
    /**
     * Queue one field clear; see {@link ConfigForm.unset} for the ordering,
     * revision, and recovery contract.
     * @param field - scalar field inside the namespace section.
     * @returns whether the Host accepted the clear, after any recovery read.
     */
    unset(field: string): Promise<boolean>;
    /**
     * Queue one atomic namespace mutation; see {@link ConfigForm.mutate}.
     * @param ops - ordered field operations copied when queued.
     * @param expectedRevision - optional fixed revision read by the domain editor.
     * @returns whether the Host accepted the mutation, after any recovery read.
     */
    mutate(ops: readonly SettingsPathOpView[], expectedRevision?: number): Promise<boolean>;
    /** Reload Host state for the latest failed write; superseded failures leave recovery to it. */
    private recover;
    /**
     * Stop queued operations, stop deriving, and wait for the current wire call
     * to settle.
     * @returns settlement after the controller reaches quiescence.
     */
    dispose(): Promise<void>;
    private enqueue;
    private derive;
    private decode;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        configForms: ConfigForms;
    }
}
/**
 * The settings domain's base service. Features that own a preference reach the
 * settings transport through this service rather than a shared function: the
 * client bundle purity gate forbids cross-plugin value imports and directs
 * cross-plugin collaboration through cordis services
 * (`packages/client/tsdown.client.ts`).
 */
export declare class ConfigForms extends Service {
    private readonly forms;
    /** Shared developer-tool preference owned by this settings provider. */
    readonly developerTools: DeveloperToolsPreference;
    private readonly mirror;
    private readonly schema;
    /**
     * The PROVIDING fiber, kept because a Service reads `ctx` as its *consumer's*
     * fiber: letting a shared form write through the caller's context would make
     * every caller declare `remote.settings` in its own `inject`.
     */
    private readonly owner;
    /**
     * @param ctx - the providing plugin's context.
     * @param config - the shared describe mirror every shared form derives from
     * and the settings-owned schema operations.
     */
    constructor(ctx: Context, config: {
        mirror: SettingsDescribeMirror;
        schema: SettingsSchemaService;
    });
    /**
     * The shared mirror's read/fold face for cross-namespace surfaces (schema
     * introspection, the served-namespace directory). Per-namespace consumers
     * use {@link get}; both derive from the same snapshot, so they can never
     * disagree about the document.
     * @returns the describe face over the shared mirror.
     */
    describe(): SettingsDescribeFace;
    /** Get the shared form values and write queue for one Host plugin entry.
     * @param entryId Unique Host plugin entry id.
     * @returns The entry's form, owned by this provider.
     */
    get<T>(entryId: string): ConfigForm<T>;
    /**
     * Keep a registration alive while the Host serves any of some namespaces:
     * `register` runs once one of them is in the describe mirror, and its
     * disposer runs when none is or when the returned disposer runs. A plugin
     * whose page edits a namespace another plugin owns registers the page
     * through this, so a deployment that never composed the owner shows no
     * trace of the page. The caller owns the returned disposer and wraps it in
     * `ctx.effect`; unlike {@link bind}, nothing is registered on the caller's
     * context here.
     * @param namespaces - the settings namespaces the registration follows.
     * @param register - registers the contribution, given every namespace the Host serves; returns its disposer.
     * @returns the disposer ending the watch and any live registration.
     */
    whileServed(namespaces: readonly string[], register: (served: ReadonlySet<string>) => () => void): () => void;
}
export {};
//# sourceMappingURL=config-form.d.ts.map