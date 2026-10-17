//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/platform/MapUtilities.ts
var e = class {
	map = /* @__PURE__ */ new Map();
	set(e, t) {
		let n = this.map.get(e);
		n || (n = /* @__PURE__ */ new Set(), this.map.set(e, n)), n.add(t);
	}
	get(e) {
		return this.map.get(e) || /* @__PURE__ */ new Set();
	}
	has(e) {
		return this.map.has(e);
	}
	hasValue(e, t) {
		let n = this.map.get(e);
		return n ? n.has(t) : !1;
	}
	get size() {
		return this.map.size;
	}
	delete(e, t) {
		let n = this.get(e);
		if (!n) return !1;
		let r = n.delete(t);
		return n.size || this.map.delete(e), r;
	}
	deleteAll(e) {
		this.map.delete(e);
	}
	keysArray() {
		return [...this.map.keys()];
	}
	keys() {
		return this.map.keys();
	}
	valuesArray() {
		let e = [];
		for (let t of this.map.values()) e.push(...t.values());
		return e;
	}
	clear() {
		this.map.clear();
	}
};
function t(e, t, n) {
	let r = e.get(t);
	return r ?? (r = n(t), e.set(t, r)), r;
}
//#endregion
export { t as n, e as t };
