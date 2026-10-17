/**
 * Host job Remote owner: streams the background-job roster one session can
 * see and one job's retained output to browsers over the generated `job`
 * namespace, and stops a job on a human's behalf. The streams are
 * projections of `ctx.jobs`; the model's consuming cursor and notice state
 * never observe them, and a human kill is not the model's own, so the
 * completion notice still reaches the owning agent.
 * @module @deepseek-ai/dsh-api-job-controller
 */
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
import { observeJobOutput } from "./observe.js";
import { streamJobRows } from "./rows.js";
/** Default coalescing window between reads, in milliseconds. */
const DEFAULT_OBSERVE_FLUSH_MS = 100;
/** Default soft byte budget per output frame. */
const DEFAULT_OBSERVE_MAX_FRAME_BYTES = 64 * 1024;
/** Host service backing the generated `ctx.remote.job` namespace. */
let JobController = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _list_decorators;
    let _follow_decorators;
    let _kill_decorators;
    return class JobController extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _list_decorators = [Remote({ mode: 'stream' })];
            _follow_decorators = [Remote({ mode: 'stream' })];
            _kill_decorators = [Remote('kill')];
            __esDecorate(this, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: obj => "list" in obj, get: obj => obj.list }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _follow_decorators, { kind: "method", name: "follow", static: false, private: false, access: { has: obj => "follow" in obj, get: obj => obj.follow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _kill_decorators, { kind: "method", name: "kill", static: false, private: false, access: { has: obj => "kill" in obj, get: obj => obj.kill }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static inject = ['jobs', 'typert'];
        static Config = z.object({
            observeFlushMs: z.natural().min(1).default(DEFAULT_OBSERVE_FLUSH_MS),
            observeMaxFrameBytes: z.natural().min(1).default(DEFAULT_OBSERVE_MAX_FRAME_BYTES),
        });
        observeFlushMs = __runInitializers(this, _instanceExtraInitializers);
        observeMaxFrameBytes;
        /**
         * @param ctx - Host context carrying the live Agent registry and the job registry.
         * @param config - observation cadence and framing policy.
         */
        constructor(ctx, config) {
            super(ctx, 'jobController', { namespace: 'job' });
            // schemastery (the exported Config schema) has already filled the defaulted
            // fields; the assertion records that resolution, not a hidden fallback.
            const resolved = config;
            this.observeFlushMs = resolved.observeFlushMs;
            this.observeMaxFrameBytes = resolved.observeMaxFrameBytes;
        }
        /**
         * Stream the jobs one session can see — its own plus every unowned job —
         * as whole-set frames: one on open, then one after each coalesced burst of
         * lifecycle commits. The stream has no natural end; the carrier closes it.
         * @param request - the session whose visible set to mirror.
         * @param signal - cancellation owned by the Remote stream carrier.
         * @returns the roster frames.
         */
        list(request, signal) {
            return streamJobRows(this.ctx.jobs, request, { flushMs: this.observeFlushMs }, signal);
        }
        /**
         * Stream one job's retained output from an absolute byte offset, then its
         * terminal projection once settled and drained. Non-consuming: the
         * model-facing cursor and notice state never observe these reads. The
         * request's session is the fenced read's caller; the registry rejects a
         * job the session cannot see and an unknown job.
         * @param request - target job, owning session, and optional resume offset.
         * @param signal - cancellation owned by the Remote stream carrier.
         * @returns anchor, coalesced output frames, and the terminal status.
         */
        follow(request, signal) {
            return observeJobOutput(this.ctx.jobs, request, {
                flushMs: this.observeFlushMs,
                maxFrameBytes: this.observeMaxFrameBytes,
            }, signal);
        }
        /**
         * Kill one background job on a human's behalf. The request's session is
         * the fenced read's caller, so the job must be one that session can see:
         * the registry's owner fence is the only access rule, and a child session's
         * own jobs are killable from its list like any other. The kill records
         * `cancelled by the user` as its reason; it is not one the model requested,
         * so the owning agent still receives the completion notice, and a shell
         * tool waiting on that job reads the reason in its own result.
         * @param request - Session whose job list carries the job, and the job id.
         * @returns the registry's admission of the kill request.
         */
        kill(request) {
            const jobs = this.ctx.jobs;
            try {
                jobs.get(request.jobId, request.sessionId);
            }
            catch (error) {
                // `unknown job` and `belongs to another session` both mean this session's
                // list no longer carries a killable row; the client renders one story.
                throw new RemoteError('job/not-found', String(error), {
                    sessionId: request.sessionId,
                    jobId: request.jobId,
                });
            }
            // Same synchronous span as the lookup, so nothing can remove the job in
            // between — and a producer-cancel throw propagates per the registry
            // contract (job state unchanged) instead of masquerading as job-not-found.
            const outcome = jobs.kill(request.jobId, request.sessionId, 'cancelled by the user');
            return { outcome };
        }
    };
})();
export { JobController };
export default JobController;
//# sourceMappingURL=index.js.map