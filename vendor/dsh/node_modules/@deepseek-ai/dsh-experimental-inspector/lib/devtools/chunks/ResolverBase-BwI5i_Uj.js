//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/ResolverBase.ts
var e = class {
	#e = /* @__PURE__ */ new Map();
	async waitFor(e) {
		return this.getForId(e) || await this.getOrCreatePromise(e);
	}
	tryGet(e, t) {
		return this.getForId(e) || (this.getOrCreatePromise(e).catch(() => {}).then((e) => {
			e && t(e);
		}), null);
	}
	clear() {
		this.stopListening();
		for (let [e, { reject: t }] of this.#e.entries()) t(/* @__PURE__ */ Error(`Object with ${e} never resolved.`));
		this.#e.clear();
	}
	getOrCreatePromise(e) {
		let t = this.#e.get(e);
		if (t) return t.promise;
		let { resolve: n, reject: r, promise: i } = Promise.withResolvers();
		return this.#e.set(e, {
			promise: i,
			resolve: n,
			reject: r
		}), this.startListening(), i;
	}
	onResolve(e, t) {
		let n = this.#e.get(e);
		this.#e.delete(e), this.#e.size === 0 && this.stopListening(), n?.resolve(t);
	}
};
//#endregion
export { e as t };
