//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/platform/TypescriptUtilities.ts
function e(e, t) {
	if (e == null) throw Error(`Expected given value to not be null/undefined but it was: ${e}${t ? `\n${t}` : ""}`);
}
function t(e, t) {
	throw Error(t);
}
function n(e) {
	return e;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/formatter_worker/FormatterActions.ts
var r = /* @__PURE__ */ function(e) {
	return e.FORMAT = "format", e.PARSE_CSS = "parseCSS", e.JAVASCRIPT_SUBSTITUTE = "javaScriptSubstitute", e.JAVASCRIPT_SCOPE_TREE = "javaScriptScopeTree", e;
}({}), i = /* @__PURE__ */ function(e) {
	return e.APPLICATION_JAVASCRIPT = "application/javascript", e.APPLICATION_JSON = "application/json", e.APPLICATION_MANIFEST_JSON = "application/manifest+json", e.TEXT_CSS = "text/css", e.TEXT_HTML = "text/html", e.TEXT_JAVASCRIPT = "text/javascript", e;
}({}), a = [
	"application/javascript",
	"application/json",
	"application/manifest+json",
	"text/css",
	"text/html",
	"text/javascript"
], o = /* @__PURE__ */ function(e) {
	return e[e.NONE = 0] = "NONE", e[e.LET = 1] = "LET", e[e.VAR = 2] = "VAR", e[e.FIXED = 3] = "FIXED", e;
}({}), s = /* @__PURE__ */ function(e) {
	return e[e.BLOCK = 1] = "BLOCK", e[e.FUNCTION = 2] = "FUNCTION", e[e.GLOBAL = 3] = "GLOBAL", e[e.ARROW_FUNCTION = 4] = "ARROW_FUNCTION", e;
}({});
//#endregion
export { s as a, n as c, r as i, a as n, t as o, i as r, e as s, o as t };
