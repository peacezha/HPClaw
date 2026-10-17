//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/text_editor/AutocompleteHistory.ts
var e = class e {
	static #e = 300;
	#t;
	#n = [];
	#r = 1;
	#i = !1;
	#a = /* @__PURE__ */ new Map();
	#o = "";
	#s = [];
	constructor(e) {
		this.#t = e, this.#n = this.#t.get();
	}
	clear() {
		this.#n = [], this.#t.set([]), this.#r = 1, this.#a.clear(), this.#o = "", this.#s = [];
	}
	length() {
		return this.#n.length;
	}
	pushHistoryItem(e) {
		this.#i &&= (this.#n.pop(), !1), this.#r = 1, this.#a.clear(), this.#o = "", this.#s = [], e !== this.#d() && this.#n.push(e), this.#f();
	}
	#c(e) {
		this.#i && this.#n.pop(), this.#i = !0, this.#n.push(e);
	}
	previous(e) {
		if (this.#r > this.#n.length) return;
		if (e ??= "", this.#r === 1 ? (this.#c(e), this.#s = [], this.#o = e) : this.#u(e), this.#o.length === 0) return ++this.#r, this.#d();
		let t = this.#l();
		return t ? (this.#s.push(t.index), this.#r = this.#n.length - t.index, t.value) : this.#r === 1 ? (this.#o = "", ++this.#r, this.#d()) : void 0;
	}
	#l() {
		let e = this.#n.length - this.#r - 1;
		for (let t = e; t >= 0; --t) {
			let e = this.#n[t];
			if (e.startsWith(this.#o)) {
				let n = this.#a.get(t) ?? e;
				return {
					index: t,
					value: n
				};
			}
		}
	}
	#u(e) {
		let t = this.#n.length - this.#r;
		e !== this.#d() && (e !== this.#n[t] && e.length > 0 ? this.#a.set(t, e) : this.#a.delete(t));
	}
	next(e) {
		if (this.#r === 1) return;
		if (e = e ?? this.#d() ?? "", this.#u(e), this.#o.length === 0) return --this.#r, this.#d();
		if (this.#s.pop(), this.#s.length === 0) return this.#r = 1, this.#d();
		let t = this.#s[this.#s.length - 1];
		return this.#r = this.#n.length - t, this.#d();
	}
	matchingEntries(e, t = 50) {
		let n = /* @__PURE__ */ new Set();
		for (let r = this.#n.length - 1; r >= 0 && n.size < t; --r) {
			let t = this.#n[r];
			t.startsWith(e) && n.add(t);
		}
		return n;
	}
	#d() {
		let e = this.#n.length - this.#r;
		return this.#a.get(e) ?? this.#n[e];
	}
	#f() {
		this.#t.set(this.#n.slice(-e.#e));
	}
};
//#endregion
export { e as t };
