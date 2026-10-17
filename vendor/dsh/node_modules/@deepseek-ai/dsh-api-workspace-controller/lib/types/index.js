/** Host Workspace Remote owner: explicit commands and reconnect-safe state. */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import z from '@deepseek-ai/schemastery';
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { WorkspaceCommands } from "./commands.js";
import { DirectoryPickerController } from "./directory-picker.js";
import { WorkspaceFeed, workspaceView } from "./feed.js";
import { defaultWorkspaceDirectory, validateDocumentsDirectory } from "./default-directory.js";
export { DirectoryPickerController } from "./directory-picker.js";
/** Host service backing the generated `ctx.remote.workspace` namespace. */
let WorkspaceController = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _initializeDefault_decorators;
    let _rename_decorators;
    let _delete_decorators;
    let _insertBefore_decorators;
    let _insertSessionBefore_decorators;
    let _archiveSession_decorators;
    let _unarchiveSession_decorators;
    let _pinSession_decorators;
    let _unpinSession_decorators;
    let _follow_decorators;
    return class WorkspaceController extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _create_decorators = [Remote('create')];
            _initializeDefault_decorators = [Remote('initializeDefault')];
            _rename_decorators = [Remote('rename')];
            _delete_decorators = [Remote('delete')];
            _insertBefore_decorators = [Remote('insertBefore')];
            _insertSessionBefore_decorators = [Remote('insertSessionBefore')];
            _archiveSession_decorators = [Remote('archiveSession')];
            _unarchiveSession_decorators = [Remote('unarchiveSession')];
            _pinSession_decorators = [Remote('pinSession')];
            _unpinSession_decorators = [Remote('unpinSession')];
            _follow_decorators = [Remote({ mode: 'stream' })];
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _initializeDefault_decorators, { kind: "method", name: "initializeDefault", static: false, private: false, access: { has: obj => "initializeDefault" in obj, get: obj => obj.initializeDefault }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _rename_decorators, { kind: "method", name: "rename", static: false, private: false, access: { has: obj => "rename" in obj, get: obj => obj.rename }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: obj => "delete" in obj, get: obj => obj.delete }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _insertBefore_decorators, { kind: "method", name: "insertBefore", static: false, private: false, access: { has: obj => "insertBefore" in obj, get: obj => obj.insertBefore }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _insertSessionBefore_decorators, { kind: "method", name: "insertSessionBefore", static: false, private: false, access: { has: obj => "insertSessionBefore" in obj, get: obj => obj.insertSessionBefore }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _archiveSession_decorators, { kind: "method", name: "archiveSession", static: false, private: false, access: { has: obj => "archiveSession" in obj, get: obj => obj.archiveSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _unarchiveSession_decorators, { kind: "method", name: "unarchiveSession", static: false, private: false, access: { has: obj => "unarchiveSession" in obj, get: obj => obj.unarchiveSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _pinSession_decorators, { kind: "method", name: "pinSession", static: false, private: false, access: { has: obj => "pinSession" in obj, get: obj => obj.pinSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _unpinSession_decorators, { kind: "method", name: "unpinSession", static: false, private: false, access: { has: obj => "unpinSession" in obj, get: obj => obj.unpinSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _follow_decorators, { kind: "method", name: "follow", static: false, private: false, access: { has: obj => "follow" in obj, get: obj => obj.follow }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static inject = ['remoteAccess', 'typert', 'workspaceRegistry'];
        static Config = z.object({
            documentsDirectory: z.string(),
            documentsLookupTimeoutMs: z.natural().min(1).default(10_000),
        });
        config = __runInitializers(this, _instanceExtraInitializers);
        commands;
        feed;
        /**
         * @param ctx - Host context containing the Workspace registry.
         * @param config - first-use directory policy.
         */
        constructor(ctx, config = {}) {
            super(ctx, 'workspaceController', { namespace: 'workspace' });
            ctx.typert.resources.register('workspace', { field: 'workspaceId' });
            this.config = WorkspaceController.Config(config);
            if (this.config.documentsDirectory !== undefined)
                validateDocumentsDirectory(this.config.documentsDirectory);
            this.commands = new WorkspaceCommands(ctx);
            this.feed = new WorkspaceFeed(ctx);
            // This package is the Loader entry for both Remote owners it hosts: the
            // directory-picking seam is abstract and never an entry itself. The child
            // stays pending until a picking backend is composed, so a host without one
            // registers no picking namespace instead of answering an unservable verb.
            ctx.plugin(DirectoryPickerController);
        }
        /**
         * Create or idempotently resolve one Workspace over an existing directory.
         * @param request - directory path to register.
         * @returns the Workspace and whether this call created it.
         */
        create(request) {
            return this.commands.create(request);
        }
        /**
         * Initialize or reuse the default Workspace during first-use startup. The
         * directory name is fixed, so the Host never renames or relocates an
         * existing default; its initial title is that same name, which browser
         * consumers label in the reader's language.
         * @param signal - caller lifetime; cancels native directory lookup.
         * @returns the durable Workspace, or undefined when first-use initialization is ineligible; creates no Session or message.
         */
        async initializeDefault(signal) {
            const workspace = await this.ctx.workspaceRegistry.initializeDefault(async () => {
                const timeout = AbortSignal.timeout(this.config.documentsLookupTimeoutMs);
                return await defaultWorkspaceDirectory(this.config.documentsDirectory, AbortSignal.any([signal, timeout]));
            });
            return workspace === undefined ? undefined : { workspace: workspaceView(workspace) };
        }
        /**
         * Rename one Workspace to a unique non-blank title.
         * @param request - Workspace identity and proposed title.
         * @returns the updated Workspace projection.
         */
        rename(request) {
            return this.commands.rename(request);
        }
        /**
         * Remove one Workspace registration while retaining files and Sessions.
         * @param request - Workspace identity to remove.
         * @returns deletion confirmation.
         */
        delete(request) {
            return this.commands.delete(request);
        }
        /**
         * Move one Workspace within the registry display order.
         * @param request - moved Workspace and optional anchor.
         * @returns the complete resulting Workspace order.
         */
        insertBefore(request) {
            return this.commands.insertBefore(request);
        }
        /**
         * Move one accounted Session within a Workspace.
         * @param request - Workspace, Session, and optional anchor identities.
         * @returns the updated Workspace projection.
         */
        insertSessionBefore(request) {
            return this.commands.insertSessionBefore(request);
        }
        /**
         * Hide one known Session from Workspace grouping surfaces.
         * @param request - Session identity to archive.
         * @returns the complete resulting archive set.
         */
        archiveSession(request) {
            return this.commands.archiveSession(request);
        }
        /**
         * Restore one archived Session to Workspace grouping surfaces.
         * @param request - Session identity to unarchive.
         * @returns the complete resulting archive set.
         */
        unarchiveSession(request) {
            return this.commands.unarchiveSession(request);
        }
        /**
         * Surface one known unarchived Session ahead of unpinned Sessions.
         * @param request - Session identity to pin.
         * @returns the complete resulting pin set, most recently pinned first.
         */
        pinSession(request) {
            return this.commands.pinSession(request);
        }
        /**
         * Remove one Session's pin without changing its saved Session order.
         * @param request - Session identity to unpin.
         * @returns the complete resulting pin set, most recently pinned first.
         */
        unpinSession(request) {
            return this.commands.unpinSession(request);
        }
        /**
         * Stream a complete Workspace baseline followed by ordered increments. A
         * non-owner receives only the Workspaces and Sessions `allows()` admits.
         * When a delivered Workspace is no longer admitted at its next change or
         * the next order change, the stream sends a `replace` frame with the
         * complete filtered state instead of a `remove`, because a Client never
         * resurrects a removed Workspace; a `remove` frame reports a deletion and
         * reaches only a Client that received that Workspace.
         * @param signal - generation cancellation.
         * @returns baseline followed by ordered Workspace increments.
         */
        async *follow(signal) {
            const access = this.ctx.remoteAccess;
            const visible = (workspaceId) => access.allows({ kind: 'workspace', id: workspaceId });
            const sessions = (sessionIds) => sessionIds.filter(sessionId => access.allows({ kind: 'session', id: sessionId }));
            /** Workspaces this generation has delivered and not yet removed. */
            const delivered = new Set();
            /** The admitted part of `value`; it becomes the delivered set. */
            const filtered = (value) => {
                const items = value.items.filter(item => visible(item.workspaceId));
                delivered.clear();
                for (const item of items)
                    delivered.add(item.workspaceId);
                return {
                    items: items.map(item => ({ ...item, sessionIds: sessions(item.sessionIds) })),
                    archivedSessionIds: sessions(value.archivedSessionIds),
                    pinnedSessionIds: sessions(value.pinnedSessionIds),
                };
            };
            for await (const frame of this.feed.follow(signal)) {
                switch (frame.type) {
                    case 'baseline':
                        yield { type: 'baseline', value: filtered(frame.value) };
                        break;
                    case 'upsert': {
                        const workspaceId = frame.workspace.workspaceId;
                        if (visible(workspaceId)) {
                            delivered.add(workspaceId);
                            yield { type: 'upsert', workspace: { ...frame.workspace, sessionIds: sessions(frame.workspace.sessionIds) } };
                        }
                        else if (delivered.has(workspaceId)) {
                            yield { type: 'replace', value: filtered(this.feed.baseline()) };
                        }
                        break;
                    }
                    case 'remove':
                        if (delivered.delete(frame.workspaceId))
                            yield frame;
                        break;
                    case 'order':
                        if (frame.workspaceIds.some(workspaceId => delivered.has(workspaceId) && !visible(workspaceId))) {
                            yield { type: 'replace', value: filtered(this.feed.baseline()) };
                        }
                        else {
                            yield { type: 'order', workspaceIds: frame.workspaceIds.filter(visible) };
                        }
                        break;
                    case 'archived':
                        yield { type: 'archived', archivedSessionIds: sessions(frame.archivedSessionIds) };
                        break;
                    case 'pinned':
                        yield { type: 'pinned', pinnedSessionIds: sessions(frame.pinnedSessionIds) };
                        break;
                    /* v8 ignore next -- closed follow-frame union. */
                    default:
                        assertNever(frame);
                }
            }
        }
    };
})();
export { WorkspaceController };
/* v8 ignore next 3 -- closed-union backstop. */
function assertNever(value) {
    throw new Error(`unreachable Workspace follow frame: ${JSON.stringify(value)}`);
}
export default WorkspaceController;
//# sourceMappingURL=index.js.map