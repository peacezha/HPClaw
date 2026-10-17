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
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { discoverShells, resolveShell } from "./shells.js";
import { BrowserTerminal } from "./terminal.js";
import { TerminalRetention } from "./retention.js";
/** Typed Remote control of transient Session-owned terminal processes. */
let TerminalController = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _environment_decorators;
    let _shells_decorators;
    let _list_decorators;
    let _create_decorators;
    let _retain_decorators;
    let _attach_decorators;
    let _rename_decorators;
    let _close_decorators;
    return class TerminalController extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _environment_decorators = [Remote];
            _shells_decorators = [Remote];
            _list_decorators = [Remote];
            _create_decorators = [Remote];
            _retain_decorators = [Remote({ mode: 'stream' })];
            _attach_decorators = [Remote({ mode: 'stream' })];
            _rename_decorators = [Remote];
            _close_decorators = [Remote];
            __esDecorate(this, null, _environment_decorators, { kind: "method", name: "environment", static: false, private: false, access: { has: obj => "environment" in obj, get: obj => obj.environment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _shells_decorators, { kind: "method", name: "shells", static: false, private: false, access: { has: obj => "shells" in obj, get: obj => obj.shells }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: obj => "list" in obj, get: obj => obj.list }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _retain_decorators, { kind: "method", name: "retain", static: false, private: false, access: { has: obj => "retain" in obj, get: obj => obj.retain }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _attach_decorators, { kind: "method", name: "attach", static: false, private: false, access: { has: obj => "attach" in obj, get: obj => obj.attach }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _rename_decorators, { kind: "method", name: "rename", static: false, private: false, access: { has: obj => "rename" in obj, get: obj => obj.rename }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _close_decorators, { kind: "method", name: "close", static: false, private: false, access: { has: obj => "close" in obj, get: obj => obj.close }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        config = __runInitializers(this, _instanceExtraInitializers);
        static inject = ['subprocess', 'sandboxPolicy', 'workingDirectory', 'typert'];
        static Config = z.object({
            shell: z.union([z.object({
                    path: z.string().required(), name: z.string().required(), args: z.array(z.string()).default([]),
                }), z.const(undefined)]),
            shellCandidates: z.array(z.string().min(1)).default(['zsh', 'bash', 'fish', 'pwsh', 'powershell', 'cmd']),
            maxTerminals: z.number().step(1).min(1).default(8),
            maxCols: z.number().step(1).min(2).default(500),
            maxRows: z.number().step(1).min(1).default(200),
            scrollback: z.number().step(1).min(0).default(1000),
            maxBufferedBytes: z.number().step(1).min(1024).default(2 * 1024 * 1024),
            maxInputBytes: z.number().step(1).min(1).default(64 * 1024),
            disposeGraceMs: z.number().step(1).min(1).default(1000),
            unattendedTimeoutMs: z.number().step(1).min(0).max(Number.MAX_SAFE_INTEGER).default(7_200_000),
            activityPollIntervalMs: z.number().step(1).min(1).max(Number.MAX_SAFE_INTEGER).default(30_000),
            cleanupRetryMs: z.number().step(1).min(1).max(Number.MAX_SAFE_INTEGER).default(60_000),
        });
        owners = new Map();
        lifetime = new AbortController();
        /**
         * @param ctx - Host context carrying typed Remote and execution providers.
         * @param config - validated terminal limits and optional shell profile.
         */
        constructor(ctx, config) {
            super(ctx, 'terminalController', { namespace: 'terminal' });
            this.config = config;
            ctx.effect(() => async () => {
                this.lifetime.abort(new Error('Terminal controller disposed'));
                const results = await Promise.allSettled([...this.owners].map(([id, owner]) => this.disposeOwner(id, owner)));
                const errors = results.filter(result => result.status === 'rejected').map(result => result.reason);
                if (errors.length > 0)
                    throw new AggregateError(errors, 'Browser terminal cleanup failed');
            }, 'terminal-controller.processes');
        }
        /**
         * Read the Session's current directory and terminal limits without filesystem validation or shell lookup.
         * @param agent - Session owner supplied by the Gateway.
         * @param signal - request cancellation.
         * @returns the logged current directory and terminal limits; retained terminals keep their own process directories.
         */
        environment(agent, signal) {
            signal.throwIfAborted();
            const { workingDirectory } = this.execution(agent);
            return { cwd: workingDirectory.get(agent.session),
                maxInputBytes: this.config.maxInputBytes, maxBufferedBytes: this.config.maxBufferedBytes, maxCols: this.config.maxCols,
                maxRows: this.config.maxRows, scrollback: this.config.scrollback };
        }
        /**
         * Discover installed shells in the Session's execution environment.
         * @param agent - Session owner supplied by the Gateway.
         * @param signal - request cancellation.
         * @returns verified profiles, with the configured or system default first.
         */
        shells(agent, signal) {
            signal.throwIfAborted();
            return discoverShells(this.execution(agent).subprocess, this.config.shell, this.config.shellCandidates, signal);
        }
        /**
         * List retained terminals without resolving or activating an Agent.
         * @param sessionId - displayed Session identity, including offline history.
         * @returns terminals retained for this Host lifetime.
         */
        list(sessionId) {
            const owner = this.owners.get(sessionId);
            if (owner === undefined)
                return [];
            return [...owner.terminals.values(), ...owner.allocations.values()].map(terminal => terminal.info);
        }
        /**
         * Allocate a user shell once for a caller-generated identity, without Agent sandbox or approval restrictions.
         * @param agent - Session owner supplied by the Gateway.
         * @param request - initial dimensions and idempotency identity.
         * @param signal - allocation cancellation; committed terminals survive disconnection.
         * @returns the existing or newly committed terminal.
         */
        async create(agent, request, signal) {
            this.lifetime.signal.throwIfAborted();
            if (!/^[\w-]{1,128}$/u.test(request.id))
                throw new Error('Invalid terminal identity');
            this.dimensions(request.cols, request.rows);
            const owner = this.owner(agent);
            owner.lifetime.signal.throwIfAborted();
            this.requireOpen(owner, request.id);
            const existing = owner.terminals.get(request.id);
            if (existing !== undefined)
                return existing.info;
            const pending = owner.pending.get(request.id);
            if (pending !== undefined) {
                const terminal = await pending;
                this.requireOpen(owner, request.id);
                return terminal.info;
            }
            if (new Set([...owner.terminals.keys(), ...owner.pending.keys(), ...owner.allocations.keys()]).size >= this.config.maxTerminals)
                throw new RemoteError('terminal/limit-reached', 'Session terminal limit reached', { limit: this.config.maxTerminals });
            const allocation = this.spawn(agent, owner, request, AbortSignal.any([signal, this.lifetime.signal, owner.lifetime.signal]));
            owner.pending.set(request.id, allocation);
            try {
                const terminal = await allocation;
                owner.terminals.set(request.id, terminal);
                owner.allocations.delete(request.id);
                terminal.monitor(this.config, () => { owner.closedIds.add(request.id); }, () => {
                    owner.terminals.delete(request.id);
                }, (error) => { this.ctx.logger.error('Browser terminal cleanup failed', error); });
                this.requireOpen(owner, request.id);
                return terminal.info;
            }
            finally {
                owner.pending.delete(request.id);
            }
        }
        /**
         * Retain an existing terminal for a window without activating its Agent or taking input control.
         * @param sessionId - owning Session identity, including an inactive saved layout.
         * @param id - retained Host terminal identity.
         * @param signal - physical Remote stream cancellation.
         * @returns a hold acknowledgement followed by an open lifetime stream.
         */
        retain(sessionId, id, signal) {
            const owner = this.owners.get(sessionId);
            const terminal = owner?.terminals.get(id);
            if (terminal === undefined || owner?.closedIds.has(id) === true || owner?.lifetime.signal.aborted === true) {
                throw new RemoteError('terminal/unavailable', 'Terminal is closing or unavailable', {});
            }
            return terminal.retain(signal);
        }
        /**
         * Attach terminal input and output to one physical Remote stream.
         * @param agent - Session owner supplied by the Gateway.
         * @param id - terminal identity.
         * @param signal - attachment cancellation; the process remains alive and input is never replayed.
         * @returns screen recovery, output, writable state and provider-acceptance acknowledgements.
         */
        attach(agent, id, signal) {
            const invocation = this.ctx.invocation;
            if (invocation === undefined)
                throw new Error('Terminal attachment requires a Remote invocation');
            return this.terminal(agent, id).attach(invocation.uplink(), this.config, signal, invocation.uplinkWindow);
        }
        /**
         * Rename a terminal without changing its shell.
         * @param agent - Session owner supplied by the Gateway.
         * @param id - terminal identity.
         * @param title - nonempty display title, at most 120 characters.
         */
        rename(agent, id, title) {
            if (title.trim().length === 0 || title.length > 120)
                throw new Error('Terminal title must contain 1–120 characters');
            this.terminal(agent, id).rename(title.trim());
        }
        /**
         * Close an identity to future creation and kill its process range; repeated closes succeed.
         * @param agent - Session owner supplied by the Gateway.
         * @param id - terminal identity.
         * @returns after provider cleanup succeeds. A failure retains the terminal for retry.
         */
        async close(agent, id) {
            const owner = this.owner(agent);
            owner.closedIds.add(id);
            // create publishes the allocation before this wait settles; close owns it even if create then rejects.
            await owner.pending.get(id)?.catch(() => { });
            const terminal = owner.terminals.get(id);
            if (terminal !== undefined) {
                await terminal.close();
                owner.terminals.delete(id);
            }
            else {
                const allocation = owner.allocations.get(id);
                if (allocation === undefined)
                    return;
                await allocation.cleanup.close();
                owner.allocations.delete(id);
            }
        }
        owner(agent) {
            let owner = this.owners.get(agent.id);
            if (owner === undefined) {
                owner = { terminals: new Map(), pending: new Map(), allocations: new Map(), closedIds: new Set(), lifetime: new AbortController() };
                this.owners.set(agent.id, owner);
                const owned = owner;
                agent.ctx.effect(() => async () => { await this.disposeOwner(agent.id, owned); }, 'terminal-controller.owner');
            }
            return owner;
        }
        disposeOwner(id, owner) {
            if (owner.cleanup !== undefined)
                return owner.cleanup;
            owner.lifetime.abort(new Error('Terminal Session owner disposed'));
            owner.cleanup = (async () => {
                await Promise.allSettled(owner.pending.values());
                const results = await Promise.allSettled([
                    ...[...owner.terminals.values()].map(terminal => terminal.dispose()),
                    ...[...owner.allocations.values()].map(allocation => allocation.cleanup.dispose()),
                ]);
                const errors = results.filter(result => result.status === 'rejected').map(result => result.reason);
                if (errors.length > 0)
                    throw new AggregateError(errors, 'Session terminal cleanup failed');
                owner.terminals.clear();
                owner.allocations.clear();
                this.owners.delete(id);
            })().catch((error) => { delete owner.cleanup; throw error; });
            return owner.cleanup;
        }
        terminal(agent, id) {
            const terminal = this.owners.get(agent.id)?.terminals.get(id);
            if (terminal === undefined)
                throw new RemoteError('terminal/unavailable', 'Terminal no longer exists in this Session', {});
            this.requireOpen(this.owners.get(agent.id), id);
            return terminal;
        }
        requireOpen(owner, id) {
            if (owner.closedIds.has(id))
                throw new RemoteError('terminal/unavailable', 'Terminal was closed in this Session', {});
        }
        dimensions(cols, rows) {
            if (!Number.isSafeInteger(cols) || cols < 2 || cols > this.config.maxCols
                || !Number.isSafeInteger(rows) || rows < 1 || rows > this.config.maxRows)
                throw new Error('Terminal dimensions exceed the configured limits');
        }
        execution(agent) {
            // The Agent context selects execution providers but does not inject consumer services.
            const subprocess = agent.ctx.get('subprocess');
            const sandboxPolicy = agent.ctx.get('sandboxPolicy');
            if (subprocess === undefined || sandboxPolicy === undefined)
                throw new Error('The Session execution environment requires subprocess and sandbox policy providers');
            const workingDirectory = agent.ctx.get('workingDirectory');
            if (workingDirectory === undefined)
                throw new Error('The Session execution environment requires a working-directory provider');
            return { subprocess, sandboxPolicy, workingDirectory };
        }
        async spawn(agent, owner, request, signal) {
            const { subprocess, workingDirectory } = this.execution(agent);
            const cwd = await workingDirectory.ensure(agent, signal);
            const shell = request.shellPath === undefined
                ? await resolveShell(subprocess, this.config.shell, signal)
                : (await this.shells(agent, signal)).find(candidate => candidate.path === request.shellPath);
            if (shell === undefined)
                throw new Error('Selected shell is not available in this execution environment');
            const handle = await subprocess.spawnTerminal({
                argv: [shell.path, ...shell.args], cwd, cols: request.cols, rows: request.rows,
                terminalType: 'xterm-256color', env: { DSH_SESSION_ID: agent.id },
                shellActivity: true,
                graceMs: this.config.disposeGraceMs, signal,
            });
            const info = {
                id: request.id, shell, title: shell.name, cwd,
                cols: request.cols, rows: request.rows, state: 'running', exitCode: null,
            };
            try {
                signal.throwIfAborted();
                return new BrowserTerminal(handle, info, this.config.scrollback, this.config.maxBufferedBytes);
            }
            catch (error) {
                const cleanup = new TerminalRetention(this.config, handle.inspectActivity.bind(handle), async () => {
                    owner.closedIds.add(request.id);
                    await handle.terminate();
                    owner.allocations.delete(request.id);
                }, (cleanupError) => { this.ctx.logger.error('Browser terminal allocation cleanup failed', cleanupError); });
                owner.allocations.set(request.id, {
                    info: { ...info, state: 'failed', error: error instanceof Error ? error.message : String(error) }, cleanup,
                });
                try {
                    await cleanup.close();
                }
                catch (cleanupError) {
                    throw new AggregateError([error, cleanupError], 'Terminal allocation cleanup failed');
                }
                throw error;
            }
        }
    };
})();
export { TerminalController };
/** Browser terminal service plugin. */
export default TerminalController;
//# sourceMappingURL=index.js.map