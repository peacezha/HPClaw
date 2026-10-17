import { randomUUID } from "node:crypto";
import z from "@deepseek-ai/schemastery";
import { AnonymousEntries, ScopedLayers, scopeOf } from "@deepseek-ai/dsh-scope";
import { deadline, timeoutOf } from "@deepseek-ai/dsh-timeout";
import { JobId, JobRegistry } from "@deepseek-ai/dsh-jobs";
//#region lib/types/events.js
/**
* Event routing for the local registry: subscriptions file by filter, and
* every commit dispatches once to each matching listener with containment.
* @module @deepseek-ai/dsh-jobs-local/events
*/
/**
* One scope's contributions: the job controllers attached from it and the
* `{ owners: 'scope' }` subscriptions registered there. Both tables are
* anonymous because a contribution is identified by its own disposer, never
* by a name a second registrant could shadow.
*/
var JobLayer = class {
	/** Tokens of the job controllers attached from this scope. */
	controllers = new AnonymousEntries();
	/** The `{ owners: 'scope' }` subscriptions registered from this scope. */
	scoped = new AnonymousEntries();
	isEmpty() {
		return this.controllers.isEmpty() && this.scoped.isEmpty();
	}
};
/**
* Routes events to subscriptions. `{ owner }` and `{ owners: 'all' }`
* subscriptions are evaluated against every event regardless of where they
* were registered; `{ owners: 'scope' }` subscriptions file into the
* registering context's scope layer and receive the owners composed under it
* — the global layer, reached from an unscoped context, receives every owner.
*/
var JobEventHub = class {
	layers;
	warn;
	unscoped = /* @__PURE__ */ new Set();
	/**
	* @param layers - the scope-layer table shared with the controller handshake.
	* @param warn - sink for a listener's contained failure.
	*/
	constructor(layers, warn) {
		this.layers = layers;
		this.warn = warn;
	}
	/**
	* Register one listener as an effect of `ctx`.
	* @param ctx - the subscribing context; owns the effect and, for `'scope'`, names the scope.
	* @param filter - which owners' events to deliver.
	* @param listener - receives each matching event.
	* @returns disposer that unregisters the listener.
	*/
	subscribe(ctx, filter, listener) {
		const subscription = {
			filter,
			listener
		};
		if ("owners" in filter && filter.owners === "scope") return this.layers.effect(ctx, (layer) => layer.scoped.append(subscription), { label: "jobs.events.subscribe()" });
		return ctx.effect(() => {
			this.unscoped.add(subscription);
			return () => {
				this.unscoped.delete(subscription);
			};
		}, "jobs.events.subscribe()");
	}
	/**
	* Deliver one event to every matching subscription, containing each
	* listener so an observer cannot break the commit already made.
	* @param event - the event to deliver.
	* @param owner - the job's exact owner, or undefined for unowned work.
	*/
	emit(event, owner) {
		const ownerId = owner?.id;
		for (const subscription of this.unscoped) {
			const { filter } = subscription;
			if ("owner" in filter && ownerId !== void 0 && ownerId !== filter.owner) continue;
			this.deliver(subscription, event);
		}
		for (const subscription of this.layers.global.scoped.values()) this.deliver(subscription, event);
		const scope = owner === void 0 ? void 0 : scopeOf(owner.ctx);
		for (const layer of this.layers.chainLayers(scope)) for (const subscription of layer.scoped.values()) this.deliver(subscription, event);
	}
	deliver(subscription, event) {
		try {
			subscription.listener(event);
		} catch (error) {
			this.warn(`jobs: event listener threw on ${event.type}: ${String(error)}`);
		}
	}
};
//#endregion
//#region lib/types/pump.js
/**
* The registry-owned pull pump: copies a job's {@link JobOutputSource}s into
* its ring at a bounded cadence and drains them once more after the
* producer settles, so the ring holds every byte before settlement trims and
* closes it. A lossy source read lands as a gap chunk; the spill file a source
* keeps is reported to the sink on every read, because that reference
* outlives any chunk. Pure utility — no cordis, no timers retained past
* settlement.
* @module @deepseek-ai/dsh-jobs-local/pump
*/
/**
* Drain every source in array order, sleep `pollMs` or until `until`
* settles, repeat, then drain one final time. A lossy source read appends
* its surviving tail with `gapBefore`, so the discontinuity stays visible to
* observers. Sources drain in array order each round, so bytes two sources
* produced inside one poll window land in that order, not in the order they
* were written: the ring is a best-effort live view whose cross-source
* reordering is bounded by `pollMs`.
*
* The wait holds constant resources however long the job runs: one
* subscription on `until` for the whole run and one pending timer at a time.
* @param sources - producer streams, each pumped at its own offset.
* @param sink - receives each copied chunk and each source's current spill file.
* @param pollMs - poll interval in milliseconds; a positive finite number.
* @param until - settles (or rejects, which counts as settlement) when the producer finished; only its `then` is used.
* @returns the handle whose `done` resolves after the final drain.
*/
function startPump(sources, sink, pollMs, until) {
	if (!Number.isFinite(pollMs) || pollMs <= 0) throw new Error(`invalid pump pollMs: expected a positive finite number of milliseconds, got ${JSON.stringify(pollMs)}`);
	const states = sources.map((source) => ({
		source,
		cursor: 0
	}));
	const drain = () => {
		for (const [index, state] of states.entries()) {
			const { source } = state;
			const read = source.read(state.cursor);
			state.cursor = read.nextOffset;
			sink.spill(index, read.spillPath);
			if (read.text.length === 0) continue;
			if (source.channel === void 0 && !read.lossy) sink.append(read.text);
			else sink.append(read.text, {
				...source.channel !== void 0 ? { channel: source.channel } : {},
				...read.lossy ? { gapBefore: true } : {}
			});
		}
	};
	return { done: (async () => {
		let settled = false;
		let timer;
		let wake;
		const finish = () => {
			settled = true;
			clearTimeout(timer);
			wake?.();
		};
		until.then(finish, finish);
		while (!settled) {
			drain();
			await new Promise((resolve) => {
				wake = resolve;
				timer = setTimeout(resolve, pollMs);
			});
			wake = void 0;
			timer = void 0;
		}
		drain();
	})() };
}
//#endregion
//#region lib/types/ring.js
/**
* The bounded output ring behind one job: chunks at absolute byte offsets,
* head eviction that never moves an assigned offset, and non-consuming reads
* from any offset.
* @module @deepseek-ai/dsh-jobs-local/ring
*/
/**
* The UTF-8-safe tail of `text` no longer than `maxBytes`: the byte cut
* advances past continuation bytes so the surviving text never starts inside
* a code point.
* @param text - the oversized chunk text.
* @param maxBytes - positive byte budget for the surviving tail.
* @returns the surviving tail and its exact byte length.
*/
function utf8Tail(text, maxBytes) {
	const raw = Buffer.from(text, "utf8");
	let start = raw.length - maxBytes;
	while (start < raw.length && (raw[start] & 192) === 128) start += 1;
	const tail = raw.subarray(start);
	return {
		text: tail.toString("utf8"),
		bytes: tail.length
	};
}
/** Offsets stay absolute across eviction: `earliest` only ever advances. */
var OutputRing = class {
	/** Retained chunks in offset order. */
	chunks = [];
	/** Sum of the retained chunks' byte lengths. */
	retainedBytes = 0;
	/** Total UTF-8 bytes ever appended — the offset the next chunk starts at. */
	total = 0;
	/** Offset of the oldest retained byte (equals {@link total} when nothing is retained). */
	earliest = 0;
	/**
	* Append one chunk and trim the head to `cap`.
	* @param text - the chunk text, exactly as produced.
	* @param options - stream label and gap marker.
	* @param cap - retention cap in UTF-8 bytes after this append.
	* @returns false when the chunk was empty and nothing changed.
	*/
	append(text, options, cap) {
		if (text.length === 0) return false;
		const bytes = Buffer.byteLength(text, "utf8");
		this.chunks.push({
			at: this.total,
			text,
			bytes,
			...options?.channel !== void 0 ? { channel: options.channel } : {},
			...options?.gapBefore !== void 0 ? { gapBefore: options.gapBefore } : {}
		});
		this.total += bytes;
		this.retainedBytes += bytes;
		this.trim(cap);
		return true;
	}
	/**
	* Drop retained head chunks until the ring fits `cap`; a single oversized
	* chunk keeps only its UTF-8-safe tail with a `gapBefore` marker.
	* @param cap - retention cap in UTF-8 bytes.
	*/
	trim(cap) {
		while (this.retainedBytes > cap && this.chunks.length > 1) {
			const dropped = this.chunks.shift();
			/* v8 ignore next -- the length guard proves shift() returns a chunk; the check only satisfies noUncheckedIndexedAccess. */
			if (dropped === void 0) break;
			this.retainedBytes -= dropped.bytes;
		}
		const single = this.chunks.length === 1 ? this.chunks[0] : void 0;
		if (single !== void 0 && single.bytes > cap) {
			const tail = utf8Tail(single.text, cap);
			single.at += single.bytes - tail.bytes;
			single.text = tail.text;
			single.bytes = tail.bytes;
			single.gapBefore = true;
			this.retainedBytes = tail.bytes;
		}
		this.earliest = this.chunks[0]?.at ?? this.total;
	}
	/**
	* Retained chunks overlapping `[from, total)` as fresh wire chunks.
	* @param from - absolute byte offset to read from.
	* @returns the chunks, the resume offset, and whether bytes before them were evicted.
	*/
	readFrom(from) {
		const chunks = [];
		for (const chunk of this.chunks) {
			if (chunk.at + chunk.bytes <= from) continue;
			chunks.push({
				at: chunk.at,
				text: chunk.text,
				...chunk.channel !== void 0 ? { channel: chunk.channel } : {},
				...chunk.gapBefore !== void 0 ? { gapBefore: chunk.gapBefore } : {}
			});
		}
		return {
			chunks,
			next: this.total,
			lossy: from < this.earliest
		};
	}
};
//#endregion
//#region lib/types/index.js
/**
* Process-local provider for the background-job capability seam
* (`ctx.jobs`). It keeps every job — lifecycle state, the bounded output
* ring, and the model cursor — in memory and hands out fresh projections and
* chunk copies, never live state.
*
* Registrations outlive producer and controller fibers. Agent or service
* disposal cancels live work and awaits compliant producers; a throwing
* teardown cancel force-fails only the record and reports a possible orphan.
* @module @deepseek-ai/dsh-jobs-local
*/
var __addDisposableResource = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
/** Timeout code that distinguishes a bounded wait from caller cancellation. */
const TASK_WAIT_TIMEOUT = "TASK_WAIT_TIMEOUT";
/** Default maximum number of active jobs in one exact-owner bucket. */
const DEFAULT_MAX_CONCURRENT_JOBS_PER_OWNER = 10;
/** Default live ring retention per job, in UTF-8 bytes. */
const DEFAULT_RETAIN_BYTES = 256 * 1024;
/** Default ring retention kept after settlement, in UTF-8 bytes. */
const DEFAULT_SETTLED_RETAIN_BYTES = 16 * 1024;
/** Default poll interval for pull sources, in milliseconds. */
const DEFAULT_PUMP_POLL_MS = 150;
/** True for the three terminal {@link JobStatus} values. */
function isTerminal(status) {
	return status === "completed" || status === "killed" || status === "failed";
}
/**
* The in-memory `jobs` registry. See the Service Definition contract in
* `@deepseek-ai/dsh-jobs` for the ownership, isolation, and lifecycle
* semantics this implementation honors.
*/
var LocalJobRegistry = class extends JobRegistry {
	static Config = z.object({
		maxConcurrentJobsPerOwner: z.number().step(1).min(1).max(Number.MAX_SAFE_INTEGER).default(DEFAULT_MAX_CONCURRENT_JOBS_PER_OWNER),
		retainBytes: z.number().step(1).min(1).max(Number.MAX_SAFE_INTEGER).default(DEFAULT_RETAIN_BYTES),
		settledRetainBytes: z.number().step(1).min(1).max(Number.MAX_SAFE_INTEGER).default(DEFAULT_SETTLED_RETAIN_BYTES),
		pumpPollMs: z.number().step(1).min(1).max(Number.MAX_SAFE_INTEGER).default(DEFAULT_PUMP_POLL_MS)
	});
	/** Schemastery-defaulted active-job limit. */
	maxConcurrentJobsPerOwner;
	/** Schemastery-defaulted live ring retention cap. */
	retainBytes;
	/** Schemastery-defaulted settled ring retention cap. */
	settledRetainBytes;
	/** Schemastery-defaulted pull-source poll interval. */
	pumpPollMs;
	store = /* @__PURE__ */ new Map();
	/**
	* Controllers and scoped subscriptions layered by the scope that registered
	* them, in the tools-registry shape: a contribution files into its
	* registering context's scope, and a read unions the global layer with the
	* owner's scope chain.
	*
	* The registry is one process-wide instance serving every composition, so a
	* flat table would answer a per-owner question process-wide: one preset's
	* job controls would hold `start()` open for an agent whose own composition
	* loads none, and one settlement would reach every preset's notice listener.
	* Layers make both reads owner-relative. Nothing derives a cache from a
	* layer, so change notification is a no-op.
	*/
	layers = new ScopedLayers(() => new JobLayer(), () => {});
	hub;
	/** Owner agents with attached scope cleanup, mapped to the exact disposer. */
	ownerCleanups = /* @__PURE__ */ new Map();
	/** Service context used by detached settlement continuations and teardown. */
	selfCtx;
	constructor(ctx, config) {
		super(ctx);
		const resolved = config;
		this.maxConcurrentJobsPerOwner = resolved.maxConcurrentJobsPerOwner;
		this.retainBytes = resolved.retainBytes;
		this.settledRetainBytes = resolved.settledRetainBytes;
		this.pumpPollMs = resolved.pumpPollMs;
		this.selfCtx = ctx;
		this.hub = new JobEventHub(this.layers, (message) => {
			ctx.logger.warn(message);
		});
		ctx.effect(() => () => this.disposeAll(), "jobs teardown");
	}
	/**
	* The event stream bound to the accessing context: a subscription is an
	* effect of that context, and `{ owners: 'scope' }` names its scope.
	*/
	get events() {
		const registrar = this.ctx;
		return { subscribe: (filter, listener) => this.hub.subscribe(registrar, filter, listener) };
	}
	start(spec) {
		const owner = this.resolveOwner(spec.owner);
		if (!this.servesOwner(owner)) throw new Error("background jobs unavailable: no job controller serves this agent (load @deepseek-ai/dsh-tool-jobs in its composition)");
		if (spec.kind.length === 0) throw new Error("invalid job kind: expected a non-empty string");
		if (spec.label.length === 0) throw new Error("invalid job label: expected a non-empty string");
		if (spec.outputLimitBytes !== void 0 && (!Number.isSafeInteger(spec.outputLimitBytes) || spec.outputLimitBytes <= 0)) throw new Error(`invalid outputLimitBytes: expected a positive safe integer, got ${JSON.stringify(spec.outputLimitBytes)}`);
		if (owner !== void 0) this.ensureOwnerCleanup(owner);
		if (this.activeJobCount(owner) >= this.maxConcurrentJobsPerOwner) throw new Error(`background job limit reached for this owner (limit: ${this.maxConcurrentJobsPerOwner}); use job_kill to stop an unneeded job, wait for it to finish, then retry`);
		let id;
		do
			id = JobId(`${spec.kind}-${randomUUID().replaceAll("-", "").slice(0, 16)}`);
		while (this.store.has(id));
		const toolCall = spec.toolCall === void 0 ? void 0 : { ...spec.toolCall };
		const ring = new OutputRing();
		const state = {
			progress: void 0,
			job: void 0
		};
		const handle = {
			id,
			append: (text, options) => {
				this.appendRing(state, ring, text, options, "producer");
			},
			updateProgress: (line) => {
				this.updateProgress(state, line);
			}
		};
		const hooks = spec.run(handle);
		let markSettled;
		const settled = new Promise((resolve) => {
			markSettled = resolve;
		});
		const job = {
			id,
			toolCall,
			kind: spec.kind,
			label: spec.label,
			outputLimitBytes: spec.outputLimitBytes,
			owner,
			cancel: hooks.cancel.bind(hooks),
			status: "running",
			ring,
			modelCursor: 0,
			resultDelivered: false,
			state,
			detail: void 0,
			result: void 0,
			startedAt: Date.now(),
			finishedAt: void 0,
			killReason: void 0,
			settleCause: void 0,
			settled,
			markSettled,
			waitResolvers: /* @__PURE__ */ new Set(),
			pump: void 0,
			spillPaths: []
		};
		state.job = job;
		this.store.set(id, job);
		this.recordSessionEvent(job);
		this.emit({
			type: "registered",
			job: this.view(job)
		}, owner);
		const producerDone = hooks.done.then((outcome) => ({
			outcome,
			producerReported: true
		}), (error) => {
			this.selfCtx.logger.warn(`jobs: job ${job.id} producer done promise rejected (producer contract violation): ${String(error)}`);
			return {
				outcome: {
					status: "failed",
					detail: String(error)
				},
				producerReported: false
			};
		});
		if (spec.output !== void 0 && spec.output.length > 0) job.pump = startPump(spec.output.map((source) => this.guardSource(job, source)), {
			append: (text, options) => {
				this.appendRing(state, ring, text, options, "pump");
			},
			spill: (index, path) => {
				job.spillPaths[index] = path;
			}
		}, this.pumpPollMs, Promise.race([producerDone, settled]));
		producerDone.then(async ({ outcome, producerReported }) => {
			if (job.pump !== void 0) await job.pump.done;
			this.settle(job, outcome, job.settleCause ?? "producer", producerReported);
		});
		return id;
	}
	list(caller) {
		return [...this.store.values()].filter((job) => job.owner === void 0 || job.owner.id === caller).map((job) => this.view(job));
	}
	get(id, caller) {
		return this.view(this.expect(id, caller));
	}
	read(id, caller) {
		return this.readJob(this.expect(id, caller));
	}
	readAt(id, from, caller) {
		const job = this.expect(id, caller);
		if (!Number.isSafeInteger(from) || from < 0) throw new Error(`invalid output read offset: expected a non-negative safe integer, got ${JSON.stringify(from)}`);
		return job.ring.readFrom(from);
	}
	kill(id, caller, reason) {
		return this.killJob(this.expect(id, caller), reason);
	}
	async wait(id, timeoutMs, caller, signal) {
		return this.waitJob(this.expect(id, caller), timeoutMs, signal);
	}
	remove(id, caller) {
		const job = this.expect(id, caller);
		if (!isTerminal(job.status)) throw new Error(`job ${id} is still ${job.status}; kill it and wait for settlement before removing it`);
		this.drop([job]);
	}
	attachController(name) {
		const token = Symbol(name);
		return this.layers.effect(this.ctx, (layer) => layer.controllers.append(token), { label: "jobs.attachController()" });
	}
	/**
	* Resolve a spec's owner session to its live Agent. An owned registration
	* needs the agent registry, and the session must currently have a live
	* instance: that instance's disposal is what cancels and drops the job.
	*/
	resolveOwner(session) {
		if (session === void 0) return void 0;
		const agents = this.selfCtx.get("agents");
		if (agents === void 0) throw new Error("background job ownership requires the agent registry (load @deepseek-ai/dsh-agent)");
		const owner = agents.get(session);
		if (owner === void 0) throw new Error(`session "${session}" has no live agent (background job owner must be live)`);
		return owner;
	}
	/**
	* Whether an attached job controller can collect and stop work owned by
	* `owner`. The global layer holds every controller attached from an unscoped
	* context — a host composition's own controls — and therefore serves every
	* owner; a scoped controller serves exactly the agents composed under it.
	* @param owner - the job's owner, or undefined for unowned work.
	* @returns whether some reachable controller serves the owner.
	*/
	servesOwner(owner) {
		if (!this.layers.global.controllers.isEmpty()) return true;
		return this.layers.chainLayers(owner === void 0 ? void 0 : scopeOf(owner.ctx)).some((layer) => !layer.controllers.isEmpty());
	}
	/** Count authoritative active records for one exact owner or the shared unowned bucket. */
	activeJobCount(owner) {
		let count = 0;
		for (const job of this.store.values()) if (job.owner === owner && (job.status === "running" || job.status === "stopping")) count += 1;
		return count;
	}
	/** Look up a job and enforce caller access. */
	expect(id, caller) {
		const job = this.store.get(id);
		if (job === void 0) throw new Error(`unknown job ${id}`);
		this.assertAccess(job, caller);
		return job;
	}
	/**
	* The isolation fence: a job with an owner is reachable only by callers
	* whose session id matches (`!== undefined` semantics — an unowned job is
	* open, and a caller-less view can never match an owned one).
	*/
	assertAccess(job, caller) {
		if (job.owner !== void 0 && job.owner.id !== caller) throw new Error(`job ${job.id} belongs to another session`);
	}
	/** Project a fresh read-only view from the mutable record. */
	view(job) {
		const owner = job.owner?.id;
		const spillPaths = [...new Set(job.spillPaths.filter((path) => path !== void 0))];
		return {
			id: job.id,
			kind: job.kind,
			label: job.label,
			...owner !== void 0 ? { owner } : {},
			...job.outputLimitBytes !== void 0 ? { outputLimitBytes: job.outputLimitBytes } : {},
			status: job.status,
			...job.state.progress !== void 0 ? { progress: job.state.progress } : {},
			...job.detail !== void 0 ? { detail: job.detail } : {},
			startedAt: job.startedAt,
			...job.finishedAt !== void 0 ? { finishedAt: job.finishedAt } : {},
			output: {
				total: job.ring.total,
				earliest: job.ring.earliest,
				...spillPaths.length > 0 ? { spillPaths } : {}
			}
		};
	}
	emit(event, owner) {
		this.hub.emit(event, owner);
	}
	/** Publish committed facts before live subscribers or completion waiters react. */
	recordSessionEvent(job, settlement) {
		const owner = job.owner;
		if (owner === void 0) return;
		const session = owner.session;
		const data = {
			jobId: job.id,
			owner: owner.id,
			kind: job.kind,
			label: job.label,
			startedAt: job.startedAt,
			...job.toolCall !== void 0 ? { toolCall: job.toolCall } : {}
		};
		try {
			if (settlement === void 0) session.append("job/registered", data);
			else session.append("job/settled", {
				...data,
				...settlement
			});
		} catch (error) {
			this.selfCtx.logger.warn(`jobs: failed to record lifecycle for ${job.id}: ${String(error)}`);
		}
	}
	/**
	* Consume the ring from the model cursor; the result rides the first read
	* after settlement. A terminal read is the point the settled stream drops
	* to the settled cap: settlement kept every unconsumed byte for it.
	*/
	readJob(job) {
		const read = job.ring.readFrom(job.modelCursor);
		job.modelCursor = job.ring.total;
		const result = isTerminal(job.status) && !job.resultDelivered ? job.result : void 0;
		if (result !== void 0) job.resultDelivered = true;
		if (isTerminal(job.status)) job.ring.trim(this.settledRetainBytes);
		return {
			chunks: read.chunks,
			lossy: read.lossy,
			...result !== void 0 ? { result } : {},
			job: this.view(job)
		};
	}
	killJob(job, reason) {
		if (isTerminal(job.status)) return "already-finished";
		job.cancel(reason);
		job.status = "stopping";
		if (reason !== void 0) job.killReason = reason;
		job.settleCause = "kill";
		this.emit({
			type: "stopping",
			job: this.view(job)
		}, job.owner);
		return "requested";
	}
	async waitJob(job, timeoutMs, signal) {
		if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error(`invalid wait timeout: expected a positive number of milliseconds, got ${JSON.stringify(timeoutMs)}`);
		if (!isTerminal(job.status)) {
			const env_1 = {
				stack: [],
				error: void 0,
				hasError: false
			};
			try {
				if (signal?.aborted) throw new Error("wait aborted");
				const d = __addDisposableResource(env_1, deadline(signal, timeoutMs, TASK_WAIT_TIMEOUT), false);
				await new Promise((resolve, reject) => {
					const onSettled = () => {
						job.waitResolvers.delete(onSettled);
						d.signal.removeEventListener("abort", onAbort);
						resolve();
					};
					const onAbort = () => {
						job.waitResolvers.delete(onSettled);
						if (timeoutOf(d.signal, "TASK_WAIT_TIMEOUT") !== void 0) resolve();
						else reject(/* @__PURE__ */ new Error("wait aborted"));
					};
					job.waitResolvers.add(onSettled);
					d.signal.addEventListener("abort", onAbort, { once: true });
				});
			} catch (e_1) {
				env_1.error = e_1;
				env_1.hasError = true;
			} finally {
				__disposeResources(env_1);
			}
		}
		return this.view(job);
	}
	/**
	* Append one chunk to the ring. A producer chunk against a settled job is
	* logged and dropped; the registry's own pump drains silently after
	* settlement (a forced settlement may precede the producer's). A chunk
	* staged inside the starter call is retained and signals no observer — the
	* registration commit publishes it.
	*/
	appendRing(state, ring, text, options, writer) {
		const job = state.job;
		if (job !== void 0 && isTerminal(job.status)) {
			if (writer === "producer") this.selfCtx.logger.warn(`jobs: append to settled job ${job.id} dropped`);
			return;
		}
		if (!ring.append(text, options, this.retainBytes)) return;
		if (job !== void 0) this.emitOutput(job);
	}
	/**
	* Contain a failing pull source: the first throw is logged, and the source
	* reads as exhausted from then on, so the job runs to its own settlement
	* with whatever the ring holds instead of freezing on a pump failure.
	*/
	guardSource(job, source) {
		let failed = false;
		return {
			...source.channel !== void 0 ? { channel: source.channel } : {},
			read: (fromByte) => {
				if (failed) return {
					text: "",
					nextOffset: fromByte,
					lossy: false
				};
				try {
					return source.read(fromByte);
				} catch (error) {
					failed = true;
					this.selfCtx.logger.warn(`jobs: output source for ${job.id} failed; its stream stops here: ${String(error)}`);
					return {
						text: "",
						nextOffset: fromByte,
						lossy: false
					};
				}
			}
		};
	}
	/** Announce that one job's ring advanced (append or settlement). */
	emitOutput(job) {
		const owner = job.owner?.id;
		this.emit({
			type: "output",
			id: job.id,
			...owner !== void 0 ? { owner } : {},
			total: job.ring.total
		}, job.owner);
	}
	/**
	* Replace the live progress line through a producer face; a write against a
	* settled job is logged and dropped. A write staged inside the starter call
	* seeds the registered projection and signals no observer.
	*/
	updateProgress(state, line) {
		const job = state.job;
		if (job !== void 0 && isTerminal(job.status)) {
			this.selfCtx.logger.warn(`jobs: progress update on settled job ${job.id} dropped`);
			return;
		}
		state.progress = line;
		if (job !== void 0) this.emit({
			type: "progress",
			job: this.view(job)
		}, job.owner);
	}
	/**
	* Record the first terminal outcome, release waiters, then announce the
	* settlement. First-wins preserves a teardown force-failure against late
	* producer settlement. The settled event follows every released waiter and
	* reports whether it released one: a timed-out or aborted wait has already
	* left the set, so only a wait still owed the projection counts.
	*/
	settle(job, outcome, cause, producerReported) {
		if (isTerminal(job.status)) return;
		job.status = outcome.status;
		if (outcome.status === "killed" && job.killReason !== void 0) job.detail = outcome.detail !== void 0 ? `${outcome.detail}; ${job.killReason}` : job.killReason;
		else if (outcome.detail !== void 0) job.detail = outcome.detail;
		job.state.progress = void 0;
		job.result = outcome.result;
		job.finishedAt = Date.now();
		this.recordSessionEvent(job, {
			finishedAt: job.finishedAt,
			status: outcome.status,
			cause,
			producerReported,
			...job.detail !== void 0 ? { detail: job.detail } : {}
		});
		job.ring.trim(Math.max(this.settledRetainBytes, job.ring.total - job.modelCursor));
		const waitResolvers = [...job.waitResolvers];
		job.waitResolvers.clear();
		for (const resolveWait of waitResolvers) resolveWait();
		job.markSettled();
		this.emit({
			type: "settled",
			job: this.view(job),
			cause,
			awaited: waitResolvers.length > 0
		}, job.owner);
		this.emitOutput(job);
	}
	/**
	* Attach one awaited cleanup through the exact owner's scope. This survives
	* producer reloads and joins agent quiescence; the retained disposer lets
	* service teardown detach the cross-fiber effect.
	*/
	ensureOwnerCleanup(owner) {
		if (this.ownerCleanups.has(owner)) return;
		const detach = owner.ctx.effect(() => async () => {
			this.ownerCleanups.delete(owner);
			await this.disposeOwned(owner);
		}, "jobs.ownerCleanup()");
		this.ownerCleanups.set(owner, detach);
	}
	/** Cancel, await terminal records, and drop every job owned by one exact agent lifecycle. */
	async disposeOwned(owner) {
		const owned = [...this.store.values()].filter((job) => job.owner === owner);
		this.cancelForTeardown(owned, "owner disposed");
		await Promise.all(owned.map((job) => job.settled));
		this.drop(owned);
	}
	/** Drop settled records and announce each removal, the one visible-set change no per-job record carries. */
	drop(jobs) {
		for (const job of jobs) {
			this.store.delete(job.id);
			this.emit({
				type: "removed",
				job: this.view(job)
			}, job.owner);
		}
	}
	/**
	* Cancel live jobs, await settlement, drop every record, and detach owner
	* effects. Throwing cancels are force-failed to avoid teardown deadlock.
	*/
	async disposeAll() {
		const all = [...this.store.values()];
		this.cancelForTeardown(all, "jobs service disposed");
		await Promise.all(all.map((job) => job.settled));
		this.drop(all);
		const ownerCleanups = [...this.ownerCleanups.values()];
		this.ownerCleanups.clear();
		await Promise.all(ownerCleanups.map((cleanup) => Promise.resolve(cleanup())));
	}
	/**
	* Cancel jobs during teardown with per-job containment. A throwing cancel
	* force-fails the record and reports a possible orphan; a cancel that returns
	* without settling remains indistinguishable from a slow stop and may stall.
	*/
	cancelForTeardown(jobs, reason) {
		for (const job of jobs) {
			if (isTerminal(job.status)) continue;
			job.settleCause = "teardown";
			try {
				job.cancel(reason);
				job.status = "stopping";
				this.emit({
					type: "stopping",
					job: this.view(job)
				}, job.owner);
			} catch (error) {
				const detail = `cancel threw during teardown; work may be orphaned: ${String(error)}`;
				this.selfCtx.logger.warn(`jobs: cancel of ${job.id} threw during teardown; job record forced failed and work may be orphaned: ${String(error)}`);
				this.settle(job, {
					status: "failed",
					detail
				}, "teardown", false);
			}
		}
	}
};
//#endregion
export { LocalJobRegistry, LocalJobRegistry as default, TASK_WAIT_TIMEOUT };
