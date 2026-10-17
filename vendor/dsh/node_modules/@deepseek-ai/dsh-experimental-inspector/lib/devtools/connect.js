//#region packages/experimental/inspector/assets/devtools/connect.js
var e = new URL(window.location.href);
if (e.searchParams.get("disableLocaleInfoBar") === "true" && window.localStorage.setItem("disable-locale-info-bar", "true"), !e.searchParams.has("ws") && !e.searchParams.has("wss")) {
	let t = new URL("cdp", e);
	for (let n of e.searchParams.getAll("clientSourceId")) t.searchParams.append("clientSourceId", n);
	e.searchParams.set(e.protocol === "https:" ? "wss" : "ws", t.host + t.pathname + t.search);
}
e.searchParams.has("panel") || e.searchParams.set("panel", "console"), window.history.replaceState(window.history.state, "", e);
//#endregion
