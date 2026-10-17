//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/network/forward/UIRequestLocation.ts
var e = /* @__PURE__ */ function(e) {
	return e.GENERAL = "General", e.REQUEST = "Request", e.RESPONSE = "Response", e.EARLY_HINTS = "EarlyHints", e;
}({}), t = /* @__PURE__ */ function(e) {
	return e.COOKIES = "cookies", e.DEVICE_BOUND_SESSIONS = "device-bound-sessions", e.EVENT_SOURCE = "eventSource", e.HEADERS_COMPONENT = "headers-component", e.PAYLOAD = "payload", e.INITIATOR = "initiator", e.PREVIEW = "preview", e.RESPONSE = "response", e.TIMING = "timing", e.TRUST_TOKENS = "trust-tokens", e.WS_FRAMES = "web-socket-frames", e.DIRECT_SOCKET_CONNECTION = "direct-socket-connection", e.DIRECT_SOCKET_CHUNKS = "direct-socket-chunks", e;
}({}), n = class e {
	request;
	header;
	searchMatch;
	isUrlMatch;
	tab;
	filterOptions;
	constructor(e, t, n, r, i, a) {
		this.request = e, this.header = t, this.searchMatch = n, this.isUrlMatch = r, this.tab = i, this.filterOptions = a;
	}
	static requestHeaderMatch(t, n) {
		return new e(t, {
			section: "Request",
			header: n
		}, null, !1, void 0, void 0);
	}
	static responseHeaderMatch(t, n) {
		return new e(t, {
			section: "Response",
			header: n
		}, null, !1, void 0, void 0);
	}
	static bodyMatch(t, n) {
		return new e(t, null, n, !1, void 0, void 0);
	}
	static urlMatch(t) {
		return new e(t, null, null, !0, void 0, void 0);
	}
	static header(t, n, r) {
		return new e(t, {
			section: n,
			header: {
				name: r,
				value: ""
			}
		}, null, !1, void 0, void 0);
	}
	static tab(t, n, r) {
		return new e(t, null, null, !1, n, r);
	}
};
//#endregion
export { n, t as r, e as t };
