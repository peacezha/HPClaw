//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/network/forward/UIFilter.ts
var e = /* @__PURE__ */ function(e) {
	return e.Domain = "domain", e.HasResponseHeader = "has-response-header", e.HasRequestHeader = "has-request-header", e.HasOverrides = "has-overrides", e.ResponseHeaderValueSetCookie = "response-header-set-cookie", e.Is = "is", e.LargerThan = "larger-than", e.Method = "method", e.MimeType = "mime-type", e.MixedContent = "mixed-content", e.Priority = "priority", e.Scheme = "scheme", e.SetCookieDomain = "set-cookie-domain", e.SetCookieName = "set-cookie-name", e.SetCookieValue = "set-cookie-value", e.ResourceType = "resource-type", e.CookieDomain = "cookie-domain", e.CookieName = "cookie-name", e.CookiePath = "cookie-path", e.CookieValue = "cookie-value", e.StatusCode = "status-code", e.Url = "url", e;
}({}), t = /* @__PURE__ */ function(e) {
	return e.RUNNING = "running", e.FROM_CACHE = "from-cache", e.SERVICE_WORKER_INTERCEPTED = "service-worker-intercepted", e.SERVICE_WORKER_INITIATED = "service-worker-initiated", e;
}({}), n = /* @__PURE__ */ function(e) {
	return e.ALL = "all", e.DISPLAYED = "displayed", e.BLOCKED = "blocked", e.BLOCK_OVERRIDDEN = "block-overridden", e;
}({}), r = class e {
	filters;
	constructor(e) {
		this.filters = e;
	}
	static filters(t) {
		return new e(t);
	}
};
//#endregion
export { r as i, t as n, n as r, e as t };
