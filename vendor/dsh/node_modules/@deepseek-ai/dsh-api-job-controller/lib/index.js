import z from "@deepseek-ai/schemastery";
import { Remote, RemoteError, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
//#region lib/types/wake.js
/**
* Wake bookkeeping shared by the two observation generators: a wake-flag
* waiter that never loses a wake between waits, and an abortable sleep that
* coalesces bursts into bounded frames.
* @module @deepseek-ai/dsh-api-job-controller/wake
*/
/** Wake-flag waiter: a wake between waits is never lost. */
var OutputWaiter = class {
	dirty = false;
	resolve;
	/** Record one wake; releases a pending wait or arms the next one. */
	wake() {
		this.dirty = true;
		this.resolve?.();
	}
	/**
	* Resolve on the next wake, immediately when one already arrived, or on abort.
	* @param signal - generation cancellation.
	* @returns settles when woken or aborted.
	*/
	wait(signal) {
		if (this.dirty || signal.aborted) {
			this.dirty = false;
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			const finish = () => {
				signal.removeEventListener("abort", finish);
				/* v8 ignore next -- one wait owns the sole installed resolver. */
				if (this.resolve === finish) this.resolve = void 0;
				this.dirty = false;
				resolve();
			};
			this.resolve = finish;
			signal.addEventListener("abort", finish, { once: true });
		});
	}
};
/**
* Sleep for the coalescing window, or return at once when aborted.
* @param ms - window in milliseconds.
* @param signal - generation cancellation.
* @returns settles after the window or on abort.
*/
function sleep(ms, signal) {
	if (signal.aborted) return Promise.resolve();
	return new Promise((resolve) => {
		const timer = setTimeout(done, ms);
		function done() {
			clearTimeout(timer);
			signal.removeEventListener("abort", done);
			resolve();
		}
		signal.addEventListener("abort", done, { once: true });
	});
}
//#endregion
//#region lib/types/observe.js
/** Per-job observation generations: anchor, coalesced output, terminal status. */
function isTerminal(status) {
	return status !== "running" && status !== "stopping";
}
/**
* Stream one job's retained output from an absolute offset: one `opened`
* anchor, coalesced `output` frames as the ring advances, then one terminal
* `status` after the settled job is drained, after which the generation
* closes normally. A removal announced mid-generation (the owner's teardown)
* closes it with the removed job's terminal projection instead of a failed
* read. Reads are non-consuming — the model-facing cursor and
* notice state never observe them; reconnecting callers resume by passing
* the last frame's `next` as `from`. The request's session is the fenced
* read's caller: the registry rejects a job the session cannot see and an
* unknown job.
* @param registry - the live job registry.
* @param request - target job, owning session, and optional resume offset.
* @param options - cadence and framing bounds.
* @param signal - generation cancellation owned by the Remote stream carrier.
* @returns the observation frame sequence for one generation.
*/
async function* observeJobOutput(registry, request, options, signal) {
	if (request.from !== void 0 && (!Number.isSafeInteger(request.from) || request.from < 0)) throw new Error(`invalid observe offset: expected a non-negative safe integer, got ${JSON.stringify(request.from)}`);
	signal.throwIfAborted();
	const id = String(request.jobId);
	const waiter = new OutputWaiter();
	let removed;
	const unsubscribe = registry.events.subscribe({ owners: "all" }, (event) => {
		if ((event.type === "output" ? event.id : event.job.id) !== id) return;
		if (event.type === "removed") removed = event.job;
		waiter.wake();
	});
	try {
		let job = registry.get(id, request.sessionId);
		let cursor = request.from ?? job.output.earliest;
		yield {
			type: "opened",
			job,
			from: cursor
		};
		while (!signal.aborted) {
			if (removed !== void 0) {
				yield {
					type: "status",
					job: removed
				};
				return;
			}
			const read = registry.readAt(id, cursor, request.sessionId);
			if (read.chunks.length > 0 || read.lossy) yield* outputFrames(read.chunks, read.next, read.lossy, options.maxFrameBytes);
			cursor = read.next;
			job = registry.get(id, request.sessionId);
			if (isTerminal(job.status) && cursor >= job.output.total) {
				yield {
					type: "status",
					job
				};
				return;
			}
			await waiter.wait(signal);
			await sleep(options.flushMs, signal);
		}
	} finally {
		unsubscribe();
	}
}
/** Split one read into frames along the soft per-frame byte budget. */
function* outputFrames(chunks, next, lossy, maxFrameBytes) {
	let batch = [];
	let batchBytes = 0;
	let flaggedLossy = lossy;
	for (const chunk of chunks) {
		batch.push(chunk);
		batchBytes += Buffer.byteLength(chunk.text, "utf8");
		if (batchBytes >= maxFrameBytes) {
			const last = batch[batch.length - 1];
			/* v8 ignore start -- a non-empty batch always has a last chunk; the arm only discharges noUncheckedIndexedAccess. */
			const end = last === void 0 ? next : last.at + Buffer.byteLength(last.text, "utf8");
			/* v8 ignore stop */
			yield {
				type: "output",
				chunks: batch,
				next: end,
				...flaggedLossy ? { lossy: true } : {}
			};
			flaggedLossy = false;
			batch = [];
			batchBytes = 0;
		}
	}
	if (batch.length > 0 || flaggedLossy) yield {
		type: "output",
		chunks: batch,
		next,
		...flaggedLossy ? { lossy: true } : {}
	};
}
//#endregion
//#region lib/types/rows.js
/** Per-session roster generations: the caller-visible job set, replaced whole after every lifecycle change. */
/**
* Stream the jobs one session can see: one frame on open, then one after
* every lifecycle commit that touches a visible job (registration, progress,
* stopping, settlement, removal), coalesced over `flushMs`. Output appends
* never refresh the roster — a settled projection already carries the final
* byte count — so the stream is quiet while a job merely writes. Reads are
* projections; the model's cursor and notice state never observe them.
* @param registry - the live job registry.
* @param request - the session whose visible set to mirror.
* @param options - the coalescing window.
* @param signal - generation cancellation owned by the Remote stream carrier.
* @returns the roster frame sequence for one generation.
*/
async function* streamJobRows(registry, request, options, signal) {
	signal.throwIfAborted();
	const waiter = new OutputWaiter();
	const unsubscribe = registry.events.subscribe({ owners: "all" }, (event) => {
		if (event.type === "output") return;
		const owner = event.job.owner;
		if (owner === void 0 || owner === request.sessionId) waiter.wake();
	});
	try {
		yield {
			type: "rows",
			jobs: registry.list(request.sessionId)
		};
		while (true) {
			await waiter.wait(signal);
			await sleep(options.flushMs, signal);
			if (signal.aborted) return;
			yield {
				type: "rows",
				jobs: registry.list(request.sessionId)
			};
		}
	} finally {
		unsubscribe();
	}
}
//#endregion
//#region lib/types/index.js
/**
* Host job Remote owner: streams the background-job roster one session can
* see and one job's retained output to browsers over the generated `job`
* namespace, and stops a job on a human's behalf. The streams are
* projections of `ctx.jobs`; the model's consuming cursor and notice state
* never observe them, and a human kill is not the model's own, so the
* completion notice still reaches the owning agent.
* @module @deepseek-ai/dsh-api-job-controller
*/
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
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
			_list_decorators = [Remote({ mode: "stream" })];
			_follow_decorators = [Remote({ mode: "stream" })];
			_kill_decorators = [Remote("kill")];
			__esDecorate(this, null, _list_decorators, {
				kind: "method",
				name: "list",
				static: false,
				private: false,
				access: {
					has: (obj) => "list" in obj,
					get: (obj) => obj.list
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _follow_decorators, {
				kind: "method",
				name: "follow",
				static: false,
				private: false,
				access: {
					has: (obj) => "follow" in obj,
					get: (obj) => obj.follow
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _kill_decorators, {
				kind: "method",
				name: "kill",
				static: false,
				private: false,
				access: {
					has: (obj) => "kill" in obj,
					get: (obj) => obj.kill
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = ["jobs", "typert"];
		static Config = z.object({
			observeFlushMs: z.natural().min(1).default(DEFAULT_OBSERVE_FLUSH_MS),
			observeMaxFrameBytes: z.natural().min(1).default(DEFAULT_OBSERVE_MAX_FRAME_BYTES)
		});
		observeFlushMs = __runInitializers(this, _instanceExtraInitializers);
		observeMaxFrameBytes;
		/**
		* @param ctx - Host context carrying the live Agent registry and the job registry.
		* @param config - observation cadence and framing policy.
		*/
		constructor(ctx, config) {
			super(ctx, "jobController", { namespace: "job" });
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
				maxFrameBytes: this.observeMaxFrameBytes
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
			} catch (error) {
				throw new RemoteError("job/not-found", String(error), {
					sessionId: request.sessionId,
					jobId: request.jobId
				});
			}
			return { outcome: jobs.kill(request.jobId, request.sessionId, "cancelled by the user") };
		}
	};
})();
//#endregion
export { JobController, JobController as default };
