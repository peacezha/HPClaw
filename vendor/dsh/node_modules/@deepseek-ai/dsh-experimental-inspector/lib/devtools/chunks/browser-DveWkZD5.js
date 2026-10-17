import { n as e } from "./rolldown-runtime-DF993M8W.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/platform/browser/HostRuntime.ts
var t = /* @__PURE__ */ e({ HOST_RUNTIME: () => i }), n = class {
	postMessage(e, t) {
		self.postMessage(e, t);
	}
	set onmessage(e) {
		self.addEventListener("message", e);
	}
}, r = class {
	#e;
	#t;
	#n;
	constructor(e) {
		this.#e = new Promise((t, n) => {
			this.#n = n;
			let r = new Worker(new URL(e), { type: "module" });
			r.onerror = (t) => {
				console.error(`Failed to load worker for ${e}:`, t);
			}, r.onmessage = (e) => {
				console.assert(e.data === "workerReady"), r.onmessage = null, t(r);
			};
		});
	}
	postMessage(e, t) {
		this.#e.then((n) => {
			this.#t || n.postMessage(e, t ?? []);
		});
	}
	dispose() {
		this.#t = !0, this.#e.then((e) => e.terminate());
	}
	terminate(e = !1) {
		e && this.#n?.(/* @__PURE__ */ Error("Worker terminated")), this.dispose();
	}
	set onmessage(e) {
		this.#e.then((t) => {
			t.onmessage = e;
		});
	}
	set onerror(e) {
		this.#e.then((t) => {
			t.onerror = e;
		});
	}
}, i = {
	createWorker(e) {
		return new r(e);
	},
	workerScope: new n(),
	getOnLine() {
		return navigator.onLine;
	},
	getUserAgent() {
		return navigator.userAgent;
	},
	getLocalStorage() {
		return "localStorage" in globalThis ? globalThis.localStorage : void 0;
	}
};
//#endregion
export { t as HostRuntime };
