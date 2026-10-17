//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/Runnable.ts
var e = /* @__PURE__ */ new Map();
function t(t) {
	let { id: n, loadRunnable: r } = t;
	if (e.has(n)) throw Error(`Duplicate late Initializable runnable id '${n}'`);
	e.set(n, r);
}
function n(t) {
	return e.delete(t);
}
function r() {
	return [...e.values()];
}
var i = [];
function a(e) {
	i.push(e);
}
function o() {
	return i;
}
//#endregion
export { t as a, a as i, r as n, n as r, o as t };
