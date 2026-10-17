import { Remote, TypertRemoteService, principalOf } from "@deepseek-ai/dsh-typert-protocol";
//#region lib/types/snapshot.js
/**
* The index global carrying a page's first access snapshot, shared by the
* Host row that writes it and the Client mount that reads it.
* @module @deepseek-ai/dsh-api-remote-access/src/snapshot
*/
/** `globalThis` property an index injection row assigns to the page's opening baseline. */
const REMOTE_ACCESS_SNAPSHOT_KEY = "__DSH_REMOTE_ACCESS__";
//#endregion
//#region lib/types/index.js
/**
* Host method-level access control. The Gateway asks `decide()` before it
* dispatches a non-owner call or forwards an event to a non-owner Peer; list
* methods filter items through `allows()`; every Peer reads its own access
* snapshot, first from the index and then from `follow()`. Business packages
* register one policy per non-owner principal kind.
* @module @deepseek-ai/dsh-api-remote-access
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
/** The snapshot endpoint every Peer may read for itself. */
const FOLLOW_ACTION = "remoteAccess/follow";
const ALLOW = Object.freeze({ kind: "allow" });
const NO_ALLOW = Object.freeze({
	kind: "deny",
	reason: "no-allow"
});
const POLICY_FAILED = Object.freeze({
	kind: "deny",
	reason: "policy-failed"
});
const OWNER = Object.freeze({ kind: "owner" });
const OWNER_BASELINE = Object.freeze({
	type: "baseline",
	owner: true
});
const ALLOWED = Object.freeze({ kind: "allow" });
const FAILED = Object.freeze({ kind: "failed" });
/** One open non-owner snapshot generation; changes coalesce until its reader wakes. */
var AccessFollower = class {
	principal;
	dirty = false;
	wake;
	/** @param principal - the generation's caller identity; never the owner. */
	constructor(principal) {
		this.principal = principal;
	}
	/** Mark the generation stale and wake its reader. */
	touch() {
		this.dirty = true;
		this.wake?.();
	}
	/**
	* Wait until the generation is stale or cancelled.
	* @param signal - generation cancellation.
	* @returns true when stale; false once cancelled.
	*/
	async changed(signal) {
		const abort = () => {
			this.wake?.();
		};
		signal.addEventListener("abort", abort, { once: true });
		try {
			while (!this.dirty && !signal.aborted) {
				await new Promise((resolve) => {
					this.wake = resolve;
				});
				this.wake = void 0;
			}
		} finally {
			signal.removeEventListener("abort", abort);
		}
		this.dirty = false;
		return !signal.aborted;
	}
};
/**
* Registry of access policies, the Gateway's access decisions, list
* filtering, and the per-Peer access snapshot. Every composition that mounts
* the Gateway mounts this service too.
*/
let RemoteAccessService = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _follow_decorators;
	return class RemoteAccessService extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_follow_decorators = [Remote({ mode: "stream" })];
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
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		policies = (__runInitializers(this, _instanceExtraInitializers), /* @__PURE__ */ new Map());
		/** Policies whose failure was logged since the last `invalidate()`; their later failures stay silent. */
		reported = /* @__PURE__ */ new Set();
		followers = /* @__PURE__ */ new Set();
		/** Aborted when this instance unloads; every open snapshot generation ends with it. */
		lifetime = new AbortController();
		/** @param ctx - owning Host plugin Context. */
		constructor(ctx) {
			super(ctx, "remoteAccess");
			ctx.effect(() => () => {
				this.lifetime.abort();
			}, "remoteAccess: snapshot generations");
			ctx.inject(["webServer"], (webCtx) => {
				webCtx.on("webserver/index-inject", (table) => {
					table.push({
						kind: "global",
						name: REMOTE_ACCESS_SNAPSHOT_KEY,
						value: OWNER_BASELINE
					});
				});
			});
		}
		/**
		* Register the policy of one non-owner principal kind in the caller's
		* fiber; open snapshots are recomputed on registration and removal.
		* @param kind - the principal kind the policy serves; never `owner`.
		* @param policy - business-owned bindings and refusal reasons for principals of `kind`.
		* @returns disposer removing this policy.
		* @throws Error when `kind` already has a policy.
		*/
		registerPolicy(kind, policy) {
			const policies = this.policies;
			if (policies.has(kind)) throw new Error(`remote access: principal kind ${JSON.stringify(kind)} already has a policy`);
			const entry = {
				kind,
				policy
			};
			const dispose = this.ctx.effect(() => {
				policies.set(kind, entry);
				this.invalidate();
				return () => {
					policies.delete(kind);
					this.invalidate();
				};
			}, `remoteAccess.registerPolicy(${JSON.stringify(kind)})`);
			return () => {
				dispose();
			};
		}
		/**
		* Report that the bindings or condition answers for `principal` may have
		* changed. Business packages call this on every grant, revocation, mode
		* change, and expiry; open snapshots re-push, and the next failure of each
		* policy is logged again.
		* @param principal - affected principal; omitted for every principal.
		*/
		invalidate(principal) {
			this.reported.clear();
			const key = principal === void 0 ? void 0 : canonicalJson(principal);
			for (const follower of this.followers) if (key === void 0 || canonicalJson(follower.principal) === key) follower.touch();
		}
		/**
		* Gateway-only: decide one request whose resources the Gateway resolved.
		* The owner is allowed, and so is `remoteAccess/follow`: every Peer reads
		* its own snapshot. Otherwise the action is allowed only when, on every
		* listed resource, some binding of the principal's policy names that
		* resource, has a role listing the action, and has no condition or a
		* condition that allows. `bindings()` is called once per decision.
		* @param request - the caller or recipient, the action, the resources it
		*   touches, and a call's arguments.
		* @returns `allow`; or `deny` with `no-allow` when the principal kind has
		*   no policy, the first refusing condition's reason on the first resource
		*   no binding allows, else `explain()`'s reason, else `no-allow`;
		*   `policy-failed` when `bindings()`, a condition, or `explain()` throws,
		*   logged once per policy until the next `invalidate()`. The Gateway
		*   throws `remote-access/denied` for a denied call and drops a denied event.
		*/
		decide(request) {
			const { principal, action } = request;
			if (principal.kind === "owner" || action === FOLLOW_ACTION) return ALLOW;
			const entry = this.policies.get(principal.kind);
			if (entry === void 0) return NO_ALLOW;
			const bindings = this.bindingsOf(entry, principal, action);
			if (bindings === void 0) return POLICY_FAILED;
			for (const resource of request.resources) {
				const evaluation = this.evaluate(entry, bindings, action, resource, request.args);
				switch (evaluation.kind) {
					case "allow": continue;
					case "failed": return POLICY_FAILED;
					case "refuse": return evaluation.refusal ?? this.explain(entry, request);
					/* v8 ignore next -- closed union. */
					default: return assertNever(evaluation);
				}
			}
			return ALLOW;
		}
		/**
		* Filter items inside a Remote method. The invocation is read from the
		* Context that accessed this service, so call it as
		* `this.ctx.remoteAccess.allows(resource)` from the Remote method. Each
		* check reads the policy's bindings again, so a long-running stream sees
		* binding changes from the next check on.
		* @param resource - resource of one result item.
		* @returns true for the owner and outside a Remote call; otherwise whether
		*   the invocation's endpoint action is allowed on `resource` without call
		*   arguments, false when the policy is absent or fails.
		*/
		allows(resource) {
			const invocation = this.ctx.invocation;
			const principal = principalOf(invocation);
			if (invocation === void 0 || principal === void 0) return true;
			const action = `${invocation.request.namespace}/${invocation.request.method}`;
			const entry = this.policies.get(principal.kind);
			if (entry === void 0) return false;
			const bindings = this.bindingsOf(entry, principal, action);
			return bindings !== void 0 && this.evaluate(entry, bindings, action, resource, void 0).kind === "allow";
		}
		/**
		* The baseline a page opens with before its snapshot stream connects. A
		* business package rendering a non-owner page assigns this value to
		* {@link REMOTE_ACCESS_SNAPSHOT_KEY} after every index injection row,
		* replacing the owner baseline the webServer index carries.
		* @param principal - the page's caller identity.
		* @returns the owner baseline for the owner; otherwise the principal's current grants.
		*/
		snapshotFor(principal) {
			if (principal.kind === "owner") return OWNER_BASELINE;
			return {
				type: "baseline",
				owner: false,
				grants: this.grantsFor(principal)
			};
		}
		/**
		* Stream the calling Peer's access snapshot: one baseline, then `upsert`
		* and `remove` frames after each `invalidate()` and each policy
		* registration or removal that changes a grant. The owner receives only
		* `{ owner: true }`. The generation ends when `signal` aborts or this
		* service unloads, so a reloaded service starts every reader from a fresh
		* baseline.
		* @param signal - generation cancellation.
		* @returns the access frames of one generation.
		*/
		async *follow(signal) {
			signal.throwIfAborted();
			const generation = AbortSignal.any([signal, this.lifetime.signal]);
			const principal = principalOf(this.ctx.invocation);
			if (principal === void 0) {
				yield this.snapshotFor(OWNER);
				await abortion(generation);
				return;
			}
			const follower = new AccessFollower(principal);
			this.followers.add(follower);
			try {
				let sent = this.grantsFor(principal);
				yield {
					type: "baseline",
					owner: false,
					grants: sent
				};
				while (await follower.changed(generation)) {
					const next = this.grantsFor(principal);
					const previous = sent;
					sent = next;
					for (const grant of next) {
						const before = previous.find((other) => sameResource(other.resource, grant.resource));
						if (before === void 0 || !sameActions(before.actions, grant.actions)) yield {
							type: "upsert",
							grant
						};
					}
					for (const grant of previous) if (!next.some((other) => sameResource(other.resource, grant.resource))) yield {
						type: "remove",
						resource: grant.resource
					};
				}
			} finally {
				this.followers.delete(follower);
			}
		}
		/** One `bindings()` call; `undefined` after a logged failure. */
		bindingsOf(entry, principal, purpose) {
			try {
				return entry.policy.bindings(principal);
			} catch (error) {
				this.report(entry, `list bindings for ${purpose}`, error);
				return;
			}
		}
		/** Find a binding on `resource` whose role lists `action` and whose condition, if any, allows. */
		evaluate(entry, bindings, action, resource, args) {
			let refusal;
			for (const binding of bindings) {
				if (!sameResource(binding.resource, resource) || !binding.role.actions.includes(action)) continue;
				if (binding.condition === void 0) return ALLOWED;
				let decision;
				try {
					decision = binding.condition(args === void 0 ? {
						action,
						resource
					} : {
						action,
						resource,
						args
					});
				} catch (error) {
					this.report(entry, `evaluate a condition for ${action}`, error);
					return FAILED;
				}
				if (decision.kind === "allow") return ALLOWED;
				refusal ??= decision;
			}
			return {
				kind: "refuse",
				refusal
			};
		}
		/** The refusal reason `explain()` names, else `no-allow`; `policy-failed` when it throws. */
		explain(entry, request) {
			let reason;
			try {
				reason = entry.policy.explain?.(request);
			} catch (error) {
				this.report(entry, `explain a refusal of ${request.action}`, error);
				return POLICY_FAILED;
			}
			return reason === void 0 ? NO_ALLOW : {
				kind: "deny",
				reason
			};
		}
		/**
		* One grant per bound resource, in first-binding order: the endpoint
		* actions of the resource's bindings that `decide()` would allow there
		* without call arguments. A resource with no such action gets no grant;
		* event actions stay out of the snapshot.
		*/
		grantsFor(principal) {
			const entry = this.policies.get(principal.kind);
			if (entry === void 0) return [];
			const bindings = this.bindingsOf(entry, principal, "a snapshot");
			if (bindings === void 0) return [];
			const grants = [];
			const seen = [];
			for (const { resource } of bindings) {
				if (seen.some((other) => sameResource(other, resource))) continue;
				seen.push(resource);
				const candidates = /* @__PURE__ */ new Set();
				for (const binding of bindings) {
					if (!sameResource(binding.resource, resource)) continue;
					for (const action of binding.role.actions) if (!action.startsWith("event:")) candidates.add(action);
				}
				const actions = [...candidates].filter((action) => this.evaluate(entry, bindings, action, resource, void 0).kind === "allow").sort();
				if (actions.length > 0) grants.push(Object.freeze({
					resource,
					actions: Object.freeze(actions)
				}));
			}
			return grants;
		}
		/** Log a policy failure once per policy until the next `invalidate()`; snapshots and lists ask many times per change. */
		report(entry, action, error) {
			if (this.reported.has(entry)) return;
			this.reported.add(entry);
			this.ctx.logger.warn(`remote access: the ${JSON.stringify(entry.kind)} policy failed to ${action}; its further failures are not logged until access state changes`);
			this.ctx.logger.warn(error);
		}
	};
})();
/* v8 ignore next 3 -- closed-union backstop. */
function assertNever(value) {
	throw new Error(`remote access: unreachable value ${JSON.stringify(value)}`);
}
/** Key-order-independent JSON text identifying one principal. */
function canonicalJson(value) {
	if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
	if (typeof value === "object" && value !== null) return `{${Object.entries(value).sort(([left], [right]) => left < right ? -1 : 1).map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
	return JSON.stringify(value);
}
/** Resources are equal when their kinds and ids are; `global` carries no id. */
function sameResource(left, right) {
	return left.kind === right.kind && left.id === right.id;
}
function sameActions(left, right) {
	return left.length === right.length && left.every((action, index) => action === right[index]);
}
function abortion(signal) {
	return new Promise((resolve) => {
		if (signal.aborted) resolve();
		else signal.addEventListener("abort", () => {
			resolve();
		}, { once: true });
	});
}
//#endregion
export { REMOTE_ACCESS_SNAPSHOT_KEY, RemoteAccessService, RemoteAccessService as default };
