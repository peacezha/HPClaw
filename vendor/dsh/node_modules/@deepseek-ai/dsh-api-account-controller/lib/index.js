import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { isRunningAccountTask } from "@deepseek-ai/dsh-deepseek-account";
//#region lib/types/index.js
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
/** Account commands and reconnect-safe state stream. */
let AccountController = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _getState_decorators;
	let _getProfile_decorators;
	let _getBalance_decorators;
	let _getUnnotifiedBonuses_decorators;
	let _ackBonusNotified_decorators;
	let _startSignIn_decorators;
	let _cancelSignIn_decorators;
	let _hasRunningAccountTasks_decorators;
	let _signOut_decorators;
	let _watchExpiry_decorators;
	let _watch_decorators;
	return class AccountController extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_getState_decorators = [Remote];
			_getProfile_decorators = [Remote];
			_getBalance_decorators = [Remote];
			_getUnnotifiedBonuses_decorators = [Remote];
			_ackBonusNotified_decorators = [Remote];
			_startSignIn_decorators = [Remote];
			_cancelSignIn_decorators = [Remote];
			_hasRunningAccountTasks_decorators = [Remote];
			_signOut_decorators = [Remote];
			_watchExpiry_decorators = [Remote({ mode: "stream" })];
			_watch_decorators = [Remote({ mode: "stream" })];
			__esDecorate(this, null, _getState_decorators, {
				kind: "method",
				name: "getState",
				static: false,
				private: false,
				access: {
					has: (obj) => "getState" in obj,
					get: (obj) => obj.getState
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _getProfile_decorators, {
				kind: "method",
				name: "getProfile",
				static: false,
				private: false,
				access: {
					has: (obj) => "getProfile" in obj,
					get: (obj) => obj.getProfile
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _getBalance_decorators, {
				kind: "method",
				name: "getBalance",
				static: false,
				private: false,
				access: {
					has: (obj) => "getBalance" in obj,
					get: (obj) => obj.getBalance
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _getUnnotifiedBonuses_decorators, {
				kind: "method",
				name: "getUnnotifiedBonuses",
				static: false,
				private: false,
				access: {
					has: (obj) => "getUnnotifiedBonuses" in obj,
					get: (obj) => obj.getUnnotifiedBonuses
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _ackBonusNotified_decorators, {
				kind: "method",
				name: "ackBonusNotified",
				static: false,
				private: false,
				access: {
					has: (obj) => "ackBonusNotified" in obj,
					get: (obj) => obj.ackBonusNotified
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _startSignIn_decorators, {
				kind: "method",
				name: "startSignIn",
				static: false,
				private: false,
				access: {
					has: (obj) => "startSignIn" in obj,
					get: (obj) => obj.startSignIn
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _cancelSignIn_decorators, {
				kind: "method",
				name: "cancelSignIn",
				static: false,
				private: false,
				access: {
					has: (obj) => "cancelSignIn" in obj,
					get: (obj) => obj.cancelSignIn
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _hasRunningAccountTasks_decorators, {
				kind: "method",
				name: "hasRunningAccountTasks",
				static: false,
				private: false,
				access: {
					has: (obj) => "hasRunningAccountTasks" in obj,
					get: (obj) => obj.hasRunningAccountTasks
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _signOut_decorators, {
				kind: "method",
				name: "signOut",
				static: false,
				private: false,
				access: {
					has: (obj) => "signOut" in obj,
					get: (obj) => obj.signOut
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _watchExpiry_decorators, {
				kind: "method",
				name: "watchExpiry",
				static: false,
				private: false,
				access: {
					has: (obj) => "watchExpiry" in obj,
					get: (obj) => obj.watchExpiry
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _watch_decorators, {
				kind: "method",
				name: "watch",
				static: false,
				private: false,
				access: {
					has: (obj) => "watch" in obj,
					get: (obj) => obj.watch
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
		static inject = ["deepseekAccount", "agents"];
		/** @param ctx - Host with the account provider mounted. */
		constructor(ctx) {
			super(ctx, "accountController", { namespace: "account" });
			__runInitializers(this, _instanceExtraInitializers);
		}
		/**
		* Read the safe account projection.
		* @returns current account and attempt state.
		*/
		getState() {
			return this.ctx.deepseekAccount.getState();
		}
		/**
		* Query display-safe Platform profile data.
		* @param client - identity of the requesting UI; the Host derives Platform request headers from it.
		* @returns profile outcome, or null when the account grant is absent or changed.
		*/
		getProfile(client) {
			return this.ctx.deepseekAccount.getProfile(client);
		}
		/**
		* Query Platform recharge-wallet balances.
		* @param client - identity of the requesting UI; the Host derives Platform request headers from it.
		* @returns balance outcome, or null when the account grant is absent or changed.
		*/
		getBalance(client) {
			return this.ctx.deepseekAccount.getBalance(client);
		}
		/**
		* Query the granted bonuses Platform has not yet recorded as displayed.
		* @param client - identity of the requesting UI; its language selects the server-authored message.
		* @returns bonuses with their account, or null when the account grant is absent or changed.
		*/
		getUnnotifiedBonuses(client) {
			return this.ctx.deepseekAccount.getUnnotifiedBonuses(client);
		}
		/**
		* Record one displayed bonus as notified for the account it belongs to.
		* @param accountId - account the notification was read for.
		* @param orderId - granted bonus order the user saw.
		* @param client - identity of the requesting UI; the Host derives Platform request headers from it.
		* @returns true once Platform records the acknowledgement; false when the account is absent or changed.
		*/
		ackBonusNotified(accountId, orderId, client) {
			return this.ctx.deepseekAccount.ackBonusNotified(accountId, orderId, client);
		}
		/**
		* Begin browser sign-in.
		* @param client - identity of the requesting UI, captured by a new attempt.
		* @param callbackOrigin - browser-accessible loopback HTTP origin.
		* @param loginSource - initiating UI, used to return from a failed exchange.
		* @returns a new or already-active login attempt.
		*/
		startSignIn(client, callbackOrigin, loginSource) {
			return this.ctx.deepseekAccount.startSignIn(client, callbackOrigin, loginSource);
		}
		/**
		* Cancel the named local attempt.
		* @param attemptId - attempt to cancel.
		* @returns settled cancellation or commit state.
		*/
		cancelSignIn(attemptId) {
			return this.ctx.deepseekAccount.cancelSignIn(attemptId);
		}
		/**
		* Inspect the latest logged request providers of running tasks, including tools and retries.
		* @returns whether running work has a latest request context on the account route.
		*/
		hasRunningAccountTasks() {
			return this.ctx.agents.list().some(isRunningAccountTask);
		}
		/**
		* Remove the local account grant and revoke it through Platform in the background, without deleting API keys.
		* @param client - identity of the requesting UI, captured for the background revocation retries.
		* @returns state after removing the local account grant.
		*/
		signOut(client) {
			return this.ctx.deepseekAccount.signOut(client);
		}
		/**
		* Subscribe to credential expiry without replaying prior notifications.
		* @param signal - stream lifetime.
		* @returns notifications emitted while subscribed.
		*/
		async *watchExpiry(signal) {
			let pending = 0;
			let wake;
			const stop = this.ctx.on("deepseek-account/session-expired", () => {
				pending++;
				wake?.();
			});
			const abort = () => {
				wake?.();
			};
			signal.addEventListener("abort", abort, { once: true });
			try {
				while (!signal.aborted) {
					if (pending > 0) {
						pending--;
						yield "session-expired";
						continue;
					}
					await new Promise((resolve) => {
						wake = resolve;
					});
				}
			} finally {
				stop();
				signal.removeEventListener("abort", abort);
			}
		}
		/**
		* Stream the safe account projection.
		* @param signal - stream lifetime.
		* @returns initial snapshot and subsequent changes.
		*/
		watch(signal) {
			return this.ctx.deepseekAccount.watch(signal);
		}
	};
})();
//#endregion
export { AccountController, AccountController as default };
