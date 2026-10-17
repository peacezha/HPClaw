//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/platform/HostRuntime.ts
var e = typeof process < "u" && process.versions?.node !== null, t = typeof window < "u" || typeof self < "u" && typeof self.postMessage == "function", n = await (async () => {
	if (t || e) return (await import("./browser-DveWkZD5.js")).HostRuntime.HOST_RUNTIME;
	throw Error("Unknown runtime!");
})();
//#endregion
export { n as t };
