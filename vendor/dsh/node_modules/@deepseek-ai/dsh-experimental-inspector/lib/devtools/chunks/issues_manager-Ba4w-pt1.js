import { B as e, C as t, D as n, H as r, K as i, Q as a, U as o, b as ee, i as te, v as ne } from "./common-DMSVbaSb.js";
import { $d as re, Bc as ie, Cl as ae, Dl as oe, El as se, Id as ce, Oc as le, Uc as ue, Vc as de, Vd as s, Xs as fe, Zs as pe, bp as me, bs as he, ef as c, ff as ge, hd as _e, jd as l, ys as ve } from "./legacy-dM_vujv7.js";
import { O as ye, i as be } from "./bindings-DyamxTH2.js";
import { t as xe } from "./ResolverBase-BwI5i_Uj.js";
import { n as Se } from "./marked-CGxJO_CC.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/issues_manager/Issue.ts
var u = {
	improvements: "Improvements",
	pageErrors: "Page Errors",
	breakingChanges: "Breaking Changes",
	pageErrorIssue: "A page error issue: the page is not working correctly",
	breakingChangeIssue: "A breaking change issue: the page may stop working in an upcoming version of Chrome",
	improvementIssue: "An improvement issue: there is an opportunity to improve the page"
}, Ce = i("models/issues_manager/Issue.ts", u), d = r.bind(void 0, Ce), f = /* @__PURE__ */ function(e) {
	return e.CROSS_ORIGIN_EMBEDDER_POLICY = "CrossOriginEmbedderPolicy", e.GENERIC = "Generic", e.MIXED_CONTENT = "MixedContent", e.COOKIE = "Cookie", e.HEAVY_AD = "HeavyAd", e.CONTENT_SECURITY_POLICY = "ContentSecurityPolicy", e.LOW_TEXT_CONTRAST = "LowTextContrast", e.CORS = "Cors", e.ATTRIBUTION_REPORTING = "AttributionReporting", e.QUIRKS_MODE = "QuirksMode", e.PERMISSION_ELEMENT = "PermissionElement", e.SELECTIVE_PERMISSIONS_INTERVENTION = "SelectivePermissionsIntervention", e.OTHER = "Other", e;
}({}), p = /* @__PURE__ */ function(e) {
	return e.PAGE_ERROR = "PageError", e.BREAKING_CHANGE = "BreakingChange", e.IMPROVEMENT = "Improvement", e;
}({});
function we(e) {
	switch (e) {
		case "BreakingChange": return d(u.breakingChanges);
		case "Improvement": return d(u.improvements);
		case "PageError": return d(u.pageErrors);
	}
}
function Te(e) {
	switch (e) {
		case "PageError": return d(u.pageErrorIssue);
		case "BreakingChange": return d(u.breakingChangeIssue);
		case "Improvement": return d(u.improvementIssue);
	}
}
function Ee(e, t) {
	return e === "PageError" || t === "PageError" ? "PageError" : e === "BreakingChange" || t === "BreakingChange" ? "BreakingChange" : "Improvement";
}
function De() {
	return te.instance().createSetting("show-third-party-issues", !0);
}
var m = class {
	#e;
	#t;
	issueId = void 0;
	#n;
	#r;
	constructor(e, t, n = null, r) {
		this.#e = typeof e == "object" ? e.code : e, this.#n = t, this.#t = n, this.issueId = r, ge.issueCreated(typeof e == "string" ? e : e.umaCode), this.#r = !1;
	}
	code() {
		return this.#e;
	}
	details() {
		return this.#n;
	}
	getBlockedByResponseDetails() {
		return [];
	}
	cookies() {
		return [];
	}
	rawCookieLines() {
		return [];
	}
	elements() {
		return [];
	}
	requests() {
		return [];
	}
	sources() {
		return [];
	}
	trackingSites() {
		return [];
	}
	isAssociatedWithRequestId(e) {
		for (let t of this.requests()) if (t.requestId === e) return !0;
		return !1;
	}
	model() {
		return this.#t;
	}
	isCausedByThirdParty() {
		return !1;
	}
	getIssueId() {
		return this.issueId;
	}
	isHidden() {
		return this.#r;
	}
	setHidden(e) {
		this.#r = e;
	}
	maybeCreateConsoleMessage() {}
};
function Oe(e) {
	if (e) return {
		url: e.url,
		scriptId: e.scriptId,
		lineNumber: e.lineNumber,
		columnNumber: e.columnNumber === 0 ? void 0 : e.columnNumber - 1
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/issues_manager/AttributionReportingIssue.ts
var ke = /* @__PURE__ */ function(e) {
	return e.PERMISSION_POLICY_DISABLED = "AttributionReportingIssue::PermissionPolicyDisabled", e.UNTRUSTWORTHY_REPORTING_ORIGIN = "AttributionReportingIssue::UntrustworthyReportingOrigin", e.INSECURE_CONTEXT = "AttributionReportingIssue::InsecureContext", e.INVALID_REGISTER_SOURCE_HEADER = "AttributionReportingIssue::InvalidRegisterSourceHeader", e.INVALID_REGISTER_TRIGGER_HEADER = "AttributionReportingIssue::InvalidRegisterTriggerHeader", e.SOURCE_AND_TRIGGER_HEADERS = "AttributionReportingIssue::SourceAndTriggerHeaders", e.SOURCE_IGNORED = "AttributionReportingIssue::SourceIgnored", e.TRIGGER_IGNORED = "AttributionReportingIssue::TriggerIgnored", e.OS_SOURCE_IGNORED = "AttributionReportingIssue::OsSourceIgnored", e.OS_TRIGGER_IGNORED = "AttributionReportingIssue::OsTriggerIgnored", e.INVALID_REGISTER_OS_SOURCE_HEADER = "AttributionReportingIssue::InvalidRegisterOsSourceHeader", e.INVALID_REGISTER_OS_TRIGGER_HEADER = "AttributionReportingIssue::InvalidRegisterOsTriggerHeader", e.WEB_AND_OS_HEADERS = "AttributionReportingIssue::WebAndOsHeaders", e.NO_WEB_OR_OS_SUPPORT = "AttributionReportingIssue::NoWebOrOsSupport", e.NAVIGATION_REGISTRATION_WITHOUT_TRANSIENT_USER_ACTIVATION = "AttributionReportingIssue::NavigationRegistrationWithoutTransientUserActivation", e.INVALID_INFO_HEADER = "AttributionReportingIssue::InvalidInfoHeader", e.NO_REGISTER_SOURCE_HEADER = "AttributionReportingIssue::NoRegisterSourceHeader", e.NO_REGISTER_TRIGGER_HEADER = "AttributionReportingIssue::NoRegisterTriggerHeader", e.NO_REGISTER_OS_SOURCE_HEADER = "AttributionReportingIssue::NoRegisterOsSourceHeader", e.NO_REGISTER_OS_TRIGGER_HEADER = "AttributionReportingIssue::NoRegisterOsTriggerHeader", e.NAVIGATION_REGISTRATION_UNIQUE_SCOPE_ALREADY_SET = "AttributionReportingIssue::NavigationRegistrationUniqueScopeAlreadySet", e.UNKNOWN = "AttributionReportingIssue::Unknown", e;
}({});
function Ae(e) {
	switch (e.violationType) {
		case s.AttributionReportingIssueType.PermissionPolicyDisabled: return "AttributionReportingIssue::PermissionPolicyDisabled";
		case s.AttributionReportingIssueType.UntrustworthyReportingOrigin: return "AttributionReportingIssue::UntrustworthyReportingOrigin";
		case s.AttributionReportingIssueType.InsecureContext: return "AttributionReportingIssue::InsecureContext";
		case s.AttributionReportingIssueType.InvalidHeader: return "AttributionReportingIssue::InvalidRegisterSourceHeader";
		case s.AttributionReportingIssueType.InvalidRegisterTriggerHeader: return "AttributionReportingIssue::InvalidRegisterTriggerHeader";
		case s.AttributionReportingIssueType.SourceAndTriggerHeaders: return "AttributionReportingIssue::SourceAndTriggerHeaders";
		case s.AttributionReportingIssueType.SourceIgnored: return "AttributionReportingIssue::SourceIgnored";
		case s.AttributionReportingIssueType.TriggerIgnored: return "AttributionReportingIssue::TriggerIgnored";
		case s.AttributionReportingIssueType.OsSourceIgnored: return "AttributionReportingIssue::OsSourceIgnored";
		case s.AttributionReportingIssueType.OsTriggerIgnored: return "AttributionReportingIssue::OsTriggerIgnored";
		case s.AttributionReportingIssueType.InvalidRegisterOsSourceHeader: return "AttributionReportingIssue::InvalidRegisterOsSourceHeader";
		case s.AttributionReportingIssueType.InvalidRegisterOsTriggerHeader: return "AttributionReportingIssue::InvalidRegisterOsTriggerHeader";
		case s.AttributionReportingIssueType.WebAndOsHeaders: return "AttributionReportingIssue::WebAndOsHeaders";
		case s.AttributionReportingIssueType.NoWebOrOsSupport: return "AttributionReportingIssue::NoWebOrOsSupport";
		case s.AttributionReportingIssueType.NavigationRegistrationWithoutTransientUserActivation: return "AttributionReportingIssue::NavigationRegistrationWithoutTransientUserActivation";
		case s.AttributionReportingIssueType.InvalidInfoHeader: return "AttributionReportingIssue::InvalidInfoHeader";
		case s.AttributionReportingIssueType.NoRegisterSourceHeader: return "AttributionReportingIssue::NoRegisterSourceHeader";
		case s.AttributionReportingIssueType.NoRegisterTriggerHeader: return "AttributionReportingIssue::NoRegisterTriggerHeader";
		case s.AttributionReportingIssueType.NoRegisterOsSourceHeader: return "AttributionReportingIssue::NoRegisterOsSourceHeader";
		case s.AttributionReportingIssueType.NoRegisterOsTriggerHeader: return "AttributionReportingIssue::NoRegisterOsTriggerHeader";
		case s.AttributionReportingIssueType.NavigationRegistrationUniqueScopeAlreadySet: return "AttributionReportingIssue::NavigationRegistrationUniqueScopeAlreadySet";
		default: return "AttributionReportingIssue::Unknown";
	}
}
var h = {
	link: "https://tools.ietf.org/id/draft-ietf-httpbis-header-structure-15.html#rfc.section.4.2.2",
	linkTitle: "Structured Headers RFC"
}, je = class e extends m {
	constructor(e, t) {
		super(Ae(e), e, t);
	}
	getCategory() {
		return f.ATTRIBUTION_REPORTING;
	}
	getHeaderValidatorLink(e) {
		let t = new URL("https://wicg.github.io/attribution-reporting-api/validate-headers");
		t.searchParams.set("header", e);
		let n = this.details();
		return n.invalidParameter && t.searchParams.set("json", n.invalidParameter), {
			link: t.toString(),
			linkTitle: "Header Validator"
		};
	}
	getDescription() {
		switch (this.code()) {
			case "AttributionReportingIssue::PermissionPolicyDisabled": return {
				file: "arPermissionPolicyDisabled.md",
				links: []
			};
			case "AttributionReportingIssue::UntrustworthyReportingOrigin": return {
				file: "arUntrustworthyReportingOrigin.md",
				links: []
			};
			case "AttributionReportingIssue::InsecureContext": return {
				file: "arInsecureContext.md",
				links: []
			};
			case "AttributionReportingIssue::InvalidRegisterSourceHeader": return {
				file: "arInvalidRegisterSourceHeader.md",
				links: [this.getHeaderValidatorLink("source")]
			};
			case "AttributionReportingIssue::InvalidRegisterTriggerHeader": return {
				file: "arInvalidRegisterTriggerHeader.md",
				links: [this.getHeaderValidatorLink("trigger")]
			};
			case "AttributionReportingIssue::InvalidRegisterOsSourceHeader": return {
				file: "arInvalidRegisterOsSourceHeader.md",
				links: [this.getHeaderValidatorLink("os-source")]
			};
			case "AttributionReportingIssue::InvalidRegisterOsTriggerHeader": return {
				file: "arInvalidRegisterOsTriggerHeader.md",
				links: [this.getHeaderValidatorLink("os-trigger")]
			};
			case "AttributionReportingIssue::SourceAndTriggerHeaders": return {
				file: "arSourceAndTriggerHeaders.md",
				links: []
			};
			case "AttributionReportingIssue::WebAndOsHeaders": return {
				file: "arWebAndOsHeaders.md",
				links: []
			};
			case "AttributionReportingIssue::SourceIgnored": return {
				file: "arSourceIgnored.md",
				links: [h]
			};
			case "AttributionReportingIssue::TriggerIgnored": return {
				file: "arTriggerIgnored.md",
				links: [h]
			};
			case "AttributionReportingIssue::OsSourceIgnored": return {
				file: "arOsSourceIgnored.md",
				links: [h]
			};
			case "AttributionReportingIssue::OsTriggerIgnored": return {
				file: "arOsTriggerIgnored.md",
				links: [h]
			};
			case "AttributionReportingIssue::NavigationRegistrationWithoutTransientUserActivation": return {
				file: "arNavigationRegistrationWithoutTransientUserActivation.md",
				links: []
			};
			case "AttributionReportingIssue::NoWebOrOsSupport": return {
				file: "arNoWebOrOsSupport.md",
				links: []
			};
			case "AttributionReportingIssue::InvalidInfoHeader": return {
				file: "arInvalidInfoHeader.md",
				links: []
			};
			case "AttributionReportingIssue::NoRegisterSourceHeader": return {
				file: "arNoRegisterSourceHeader.md",
				links: []
			};
			case "AttributionReportingIssue::NoRegisterTriggerHeader": return {
				file: "arNoRegisterTriggerHeader.md",
				links: []
			};
			case "AttributionReportingIssue::NoRegisterOsSourceHeader": return {
				file: "arNoRegisterOsSourceHeader.md",
				links: []
			};
			case "AttributionReportingIssue::NoRegisterOsTriggerHeader": return {
				file: "arNoRegisterOsTriggerHeader.md",
				links: []
			};
			case "AttributionReportingIssue::NavigationRegistrationUniqueScopeAlreadySet": return {
				file: "arNavigationRegistrationUniqueScopeAlreadySet.md",
				links: []
			};
			case "AttributionReportingIssue::Unknown": return null;
		}
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	static fromInspectorIssue(t, n) {
		let { attributionReportingIssueDetails: r } = n.details;
		return r ? [new e(r, t)] : (console.warn("Attribution Reporting issue without details received."), []);
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/issues_manager/MarkdownIssueDescription.ts
function g(e) {
	function t(e) {
		return {
			link: e.link,
			linkTitle: e.linkTitle()
		};
	}
	let n = /* @__PURE__ */ new Map();
	return e.substitutions?.forEach((e, t) => {
		n.set(t, e());
	}), {
		file: e.file,
		links: e.links.map(t),
		substitutions: n
	};
}
async function Me(e) {
	try {
		return await (await fetch(e.toString())).text();
	} catch {
		throw Error(`Markdown file ${e.toString()} not found. Make sure it is correctly listed in the relevant BUILD.gn files.`);
	}
}
async function Ne(e) {
	return await Me(new URL(`descriptions/${e}`, new URL("models/issues_manager/MarkdownIssueDescription.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href));
}
async function Pe(e) {
	return Fe(Re(await Ne(e.file), e.substitutions), e);
}
function Fe(e, t) {
	let n = Se(e), r = _(n);
	if (!r) throw Error("Markdown issue descriptions must start with a heading");
	return {
		title: r,
		markdown: n.slice(1),
		links: t.links
	};
}
var Ie = /\{(PLACEHOLDER_[a-zA-Z][a-zA-Z0-9]*)\}/g, Le = /PLACEHOLDER_[a-zA-Z][a-zA-Z0-9]*/;
function Re(e, t) {
	let n = new Set(t ? t.keys() : []);
	ze(n);
	let r = e.replace(Ie, (e, r) => {
		let i = t ? t.get(r) : void 0;
		if (i === void 0) throw Error(`No replacement provided for placeholder '${r}'.`);
		return n.delete(r), i;
	});
	if (n.size > 0) throw Error(`Unused replacements provided: ${[...n]}`);
	return r;
}
function ze(e) {
	let t = [...e].filter((e) => !Le.test(e));
	if (t.length > 0) throw Error(`Invalid placeholders provided in the substitutions map: ${t}`);
}
function _(e) {
	return e.length === 0 || e[0].type !== "heading" || e[0].depth !== 1 ? null : e[0].text;
}
async function v(e) {
	let t = await Ne(e.file);
	return _(Se(t));
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/issues_manager/ClientHintIssue.ts
var y = { clientHintsInfrastructure: "Client Hints Infrastructure" }, Be = i("models/issues_manager/ClientHintIssue.ts", y), Ve = e.bind(void 0, Be), He = class e extends m {
	constructor(e, t) {
		super({
			code: s.InspectorIssueCode.ClientHintIssue,
			umaCode: [s.InspectorIssueCode.ClientHintIssue, e.clientHintIssueReason].join("::")
		}, e, t);
	}
	getCategory() {
		return f.OTHER;
	}
	getDescription() {
		let e = Ue.get(this.details().clientHintIssueReason);
		return e ? g(e) : null;
	}
	sources() {
		return [this.details().sourceCodeLocation];
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getKind() {
		return p.BREAKING_CHANGE;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.clientHintIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Client Hint issue without details received."), []);
	}
}, Ue = /* @__PURE__ */ new Map([[s.ClientHintIssueReason.MetaTagAllowListInvalidOrigin, {
	file: "clientHintMetaTagAllowListInvalidOrigin.md",
	links: [{
		link: "https://wicg.github.io/client-hints-infrastructure/",
		linkTitle: Ve(y.clientHintsInfrastructure)
	}]
}], [s.ClientHintIssueReason.MetaTagModifiedHTML, {
	file: "clientHintMetaTagModifiedHTML.md",
	links: [{
		link: "https://wicg.github.io/client-hints-infrastructure/",
		linkTitle: Ve(y.clientHintsInfrastructure)
	}]
}]]), We = { connectionAllowlistHeader: "Connection-Allowlist specification" }, Ge = i("models/issues_manager/ConnectionAllowlistIssue.ts", We), Ke = e.bind(void 0, Ge), qe = class e extends m {
	constructor(e, t) {
		super({
			code: `${s.InspectorIssueCode.ConnectionAllowlistIssue}::${e.error}`,
			umaCode: `${s.InspectorIssueCode.ConnectionAllowlistIssue}::${e.error}`
		}, e, t);
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getDescription() {
		return g({
			file: `connectionAllowlist${this.details().error}.md`,
			links: [{
				link: "https://wicg.github.io/private-network-access/#connection-allowlist",
				linkTitle: Ke(We.connectionAllowlistHeader)
			}]
		});
	}
	getCategory() {
		return f.OTHER;
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	requests() {
		return this.details().request ? [this.details().request] : [];
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.connectionAllowlistIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Connection-Allowlist issue without details received."), []);
	}
}, b = {
	contentSecurityPolicySource: "Content Security Policy - Source Allowlists",
	contentSecurityPolicyInlineCode: "Content Security Policy - Inline Code",
	contentSecurityPolicyEval: "Content Security Policy - Eval",
	trustedTypesFixViolations: "Trusted Types - Fix violations",
	trustedTypesPolicyViolation: "Trusted Types - Policy violation"
}, Je = i("models/issues_manager/ContentSecurityPolicyIssue.ts", b), x = e.bind(void 0, Je), S = class e extends m {
	constructor(e, t, n) {
		let r = [s.InspectorIssueCode.ContentSecurityPolicyIssue, e.contentSecurityPolicyViolationType].join("::");
		super(r, e, t, n);
	}
	getCategory() {
		return f.CONTENT_SECURITY_POLICY;
	}
	primaryKey() {
		return JSON.stringify(this.details(), [
			"blockedURL",
			"contentSecurityPolicyViolationType",
			"violatedDirective",
			"isReportOnly",
			"sourceCodeLocation",
			"url",
			"lineNumber",
			"columnNumber",
			"violatingNodeId"
		]);
	}
	getDescription() {
		let e = at.get(this.details().contentSecurityPolicyViolationType);
		return e ? g(e) : null;
	}
	getKind() {
		return this.details().isReportOnly ? p.IMPROVEMENT : p.PAGE_ERROR;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.contentSecurityPolicyIssueDetails;
		return r ? [new e(r, t, n.issueId)] : (console.warn("Content security policy issue without details received."), []);
	}
}, Ye = {
	file: "cspURLViolation.md",
	links: [{
		link: "https://developers.google.com/web/fundamentals/security/csp#source_allowlists",
		linkTitle: x(b.contentSecurityPolicySource)
	}]
}, Xe = {
	file: "cspInlineViolation.md",
	links: [{
		link: "https://developers.google.com/web/fundamentals/security/csp#inline_code_is_considered_harmful",
		linkTitle: x(b.contentSecurityPolicyInlineCode)
	}]
}, Ze = {
	file: "cspEvalViolation.md",
	links: [{
		link: "https://developers.google.com/web/fundamentals/security/csp#eval_too",
		linkTitle: x(b.contentSecurityPolicyEval)
	}]
}, Qe = {
	file: "cspTrustedTypesSinkViolation.md",
	links: [{
		link: "https://web.dev/trusted-types/#fix-the-violations",
		linkTitle: x(b.trustedTypesFixViolations)
	}]
}, $e = {
	file: "cspTrustedTypesPolicyViolation.md",
	links: [{
		link: "https://web.dev/trusted-types/",
		linkTitle: x(b.trustedTypesPolicyViolation)
	}]
}, et = [s.InspectorIssueCode.ContentSecurityPolicyIssue, s.ContentSecurityPolicyViolationType.KURLViolation].join("::"), tt = [s.InspectorIssueCode.ContentSecurityPolicyIssue, s.ContentSecurityPolicyViolationType.KInlineViolation].join("::"), nt = [s.InspectorIssueCode.ContentSecurityPolicyIssue, s.ContentSecurityPolicyViolationType.KEvalViolation].join("::"), rt = [s.InspectorIssueCode.ContentSecurityPolicyIssue, s.ContentSecurityPolicyViolationType.KTrustedTypesSinkViolation].join("::"), it = [s.InspectorIssueCode.ContentSecurityPolicyIssue, s.ContentSecurityPolicyViolationType.KTrustedTypesPolicyViolation].join("::"), at = /* @__PURE__ */ new Map([
	[s.ContentSecurityPolicyViolationType.KURLViolation, Ye],
	[s.ContentSecurityPolicyViolationType.KInlineViolation, Xe],
	[s.ContentSecurityPolicyViolationType.KEvalViolation, Ze],
	[s.ContentSecurityPolicyViolationType.KTrustedTypesSinkViolation, Qe],
	[s.ContentSecurityPolicyViolationType.KTrustedTypesPolicyViolation, $e]
]), ot = { thirdPartyPhaseoutExplained: "Changes to Chrome's treatment of third-party cookies" }, st = i("models/issues_manager/CookieDeprecationMetadataIssue.ts", ot), ct = r.bind(void 0, st), lt = class e extends m {
	constructor(e, t) {
		let n = s.InspectorIssueCode.CookieDeprecationMetadataIssue + "_" + e.operation;
		super(n, e, t);
	}
	getCategory() {
		return f.OTHER;
	}
	getDescription() {
		let e = this.details().operation === "SetCookie" ? "cookieWarnMetadataGrantSet.md" : "cookieWarnMetadataGrantRead.md", t = "";
		return this.details().isOptOutTopLevel && (t = "\n\n (Top level site opt-out: " + this.details().optOutPercentage + "% - [learn more](gracePeriodStagedControlExplainer))"), {
			file: e,
			substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_topleveloptout", t]]),
			links: [{
				link: "https://goo.gle/changes-to-chrome-browsing",
				linkTitle: ct(ot.thirdPartyPhaseoutExplained)
			}]
		};
	}
	getKind() {
		return p.BREAKING_CHANGE;
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.cookieDeprecationMetadataIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Cookie deprecation metadata issue without details received."), []);
	}
}, C = {
	samesiteCookiesExplained: "SameSite cookies explained",
	howSchemefulSamesiteWorks: "How Schemeful Same-Site Works",
	fileCrosSiteRedirectBug: "File a bug",
	consoleTpcdErrorMessage: "Third-party cookie is blocked in Chrome either because of Chrome flags or browser configuration."
}, ut = i("models/issues_manager/CookieIssue.ts", C), w = e.bind(void 0, ut), T = class e extends m {
	cookieId() {
		let e = this.details();
		if (e.cookie) {
			let { domain: t, path: n, name: r } = e.cookie;
			return `${t};${n};${r}`;
		}
		return this.details().rawCookieLine ?? "no-cookie-info";
	}
	primaryKey() {
		let e = this.details(), t = e.request ? e.request.requestId : "no-request";
		return `${this.code()}-(${this.cookieId()})-(${t})`;
	}
	static createIssuesFromCookieIssueDetails(t, n, r) {
		let i = [];
		if (t.cookieExclusionReasons && t.cookieExclusionReasons.length > 0) {
			for (let a of t.cookieExclusionReasons) {
				let o = e.codeForCookieIssueDetails(a, t.cookieWarningReasons, t.operation, t.cookieUrl);
				o && i.push(new e(o, t, n, r));
			}
			return i;
		}
		if (t.cookieWarningReasons) for (let a of t.cookieWarningReasons) {
			let o = e.codeForCookieIssueDetails(a, [], t.operation, t.cookieUrl);
			o && i.push(new e(o, t, n, r));
		}
		return i;
	}
	static codeForCookieIssueDetails(e, t, n, r) {
		let i = r && (ee(r, "https:") || ee(r, "wss:")) ? "Secure" : "Insecure";
		if (e === s.CookieExclusionReason.ExcludeSameSiteStrict || e === s.CookieExclusionReason.ExcludeSameSiteLax || e === s.CookieExclusionReason.ExcludeSameSiteUnspecifiedTreatedAsLax) {
			if (t && t.length > 0) {
				if (t.includes(s.CookieWarningReason.WarnSameSiteStrictLaxDowngradeStrict)) return [
					s.InspectorIssueCode.CookieIssue,
					"ExcludeNavigationContextDowngrade",
					i
				].join("::");
				if (t.includes(s.CookieWarningReason.WarnSameSiteStrictCrossDowngradeStrict) || t.includes(s.CookieWarningReason.WarnSameSiteStrictCrossDowngradeLax) || t.includes(s.CookieWarningReason.WarnSameSiteLaxCrossDowngradeStrict) || t.includes(s.CookieWarningReason.WarnSameSiteLaxCrossDowngradeLax)) return [
					s.InspectorIssueCode.CookieIssue,
					"ExcludeContextDowngrade",
					n,
					i
				].join("::");
			}
			return t.includes(s.CookieWarningReason.WarnCrossSiteRedirectDowngradeChangesInclusion) ? [s.InspectorIssueCode.CookieIssue, "CrossSiteRedirectDowngradeChangesInclusion"].join("::") : e === s.CookieExclusionReason.ExcludeSameSiteUnspecifiedTreatedAsLax ? [
				s.InspectorIssueCode.CookieIssue,
				e,
				n
			].join("::") : null;
		}
		return e === s.CookieWarningReason.WarnSameSiteStrictLaxDowngradeStrict ? [
			s.InspectorIssueCode.CookieIssue,
			e,
			i
		].join("::") : e === s.CookieWarningReason.WarnSameSiteStrictCrossDowngradeStrict || e === s.CookieWarningReason.WarnSameSiteStrictCrossDowngradeLax || e === s.CookieWarningReason.WarnSameSiteLaxCrossDowngradeLax || e === s.CookieWarningReason.WarnSameSiteLaxCrossDowngradeStrict ? [
			s.InspectorIssueCode.CookieIssue,
			"WarnCrossDowngrade",
			n,
			i
		].join("::") : e === s.CookieExclusionReason.ExcludePortMismatch ? [s.InspectorIssueCode.CookieIssue, "ExcludePortMismatch"].join("::") : e === s.CookieExclusionReason.ExcludeSchemeMismatch ? [s.InspectorIssueCode.CookieIssue, "ExcludeSchemeMismatch"].join("::") : [
			s.InspectorIssueCode.CookieIssue,
			e,
			n
		].join("::");
	}
	cookies() {
		let e = this.details();
		return e.cookie ? [e.cookie] : [];
	}
	rawCookieLines() {
		let e = this.details();
		return e.rawCookieLine ? [e.rawCookieLine] : [];
	}
	requests() {
		let e = this.details();
		return e.request ? [e.request] : [];
	}
	getCategory() {
		return f.COOKIE;
	}
	getDescription() {
		let e = Mt.get(this.code());
		return e ? g(e) : null;
	}
	isCausedByThirdParty() {
		return dt(oe.instance().getOutermostFrame(), this.details().cookieUrl, this.details().siteForCookies);
	}
	getKind() {
		return this.details().cookieExclusionReasons?.length > 0 ? p.PAGE_ERROR : p.BREAKING_CHANGE;
	}
	static getCookieStatus(e) {
		if (e.cookieExclusionReasons.includes(s.CookieExclusionReason.ExcludeThirdPartyPhaseout)) return 0;
		if (e.cookieWarningReasons.includes(s.CookieWarningReason.WarnDeprecationTrialMetadata)) return 2;
		if (e.cookieWarningReasons.includes(s.CookieWarningReason.WarnThirdPartyCookieHeuristic)) return 3;
		if (e.cookieWarningReasons.includes(s.CookieWarningReason.WarnThirdPartyPhaseout)) return 1;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.cookieIssueDetails;
		return r ? e.createIssuesFromCookieIssueDetails(r, t, n.issueId) : (console.warn("Cookie issue without details received."), []);
	}
	static getSubCategory(e) {
		return e.includes("SameSite") || e.includes("Downgrade") ? "SameSiteCookie" : "GenericCookie";
	}
	static isThirdPartyCookiePhaseoutRelatedIssue(e) {
		return [
			s.CookieWarningReason.WarnThirdPartyCookieHeuristic,
			s.CookieWarningReason.WarnDeprecationTrialMetadata,
			s.CookieWarningReason.WarnThirdPartyPhaseout,
			s.CookieExclusionReason.ExcludeThirdPartyPhaseout
		].some((t) => e.code().includes(t));
	}
	maybeCreateConsoleMessage() {
		let e = this.model();
		if (e && this.code().includes(s.CookieExclusionReason.ExcludeThirdPartyPhaseout)) return new fe(e.target().model(ae), t.ISSUE_PANEL, re.LogEntryLevel.Warning, C.consoleTpcdErrorMessage, {
			url: this.details().request?.url,
			affectedResources: {
				requestId: this.details().request?.requestId,
				issueId: this.issueId
			}
		});
	}
};
function dt(e, t, n) {
	if (!e || !n) return !0;
	if (!t || e.domainAndRegistry() === "") return !1;
	let r = ne.fromString(t);
	return r ? !ft(r.domain(), e.domainAndRegistry()) : !1;
}
function ft(e, t) {
	return e.length <= t.length ? e === t : e.endsWith(t) ? e.substr(0, e.length - t.length).endsWith(".") : !1;
}
var pt = {
	file: "SameSiteUnspecifiedLaxAllowUnsafeRead.md",
	links: [{
		link: "https://web.dev/samesite-cookies-explained/",
		linkTitle: w(C.samesiteCookiesExplained)
	}]
}, mt = {
	file: "SameSiteUnspecifiedLaxAllowUnsafeSet.md",
	links: [{
		link: "https://web.dev/samesite-cookies-explained/",
		linkTitle: w(C.samesiteCookiesExplained)
	}]
}, ht = {
	file: "SameSiteNoneInsecureErrorRead.md",
	links: [{
		link: "https://web.dev/samesite-cookies-explained/",
		linkTitle: w(C.samesiteCookiesExplained)
	}]
}, gt = {
	file: "SameSiteNoneInsecureErrorSet.md",
	links: [{
		link: "https://web.dev/samesite-cookies-explained/",
		linkTitle: w(C.samesiteCookiesExplained)
	}]
}, _t = {
	file: "SameSiteNoneInsecureWarnRead.md",
	links: [{
		link: "https://web.dev/samesite-cookies-explained/",
		linkTitle: w(C.samesiteCookiesExplained)
	}]
}, vt = {
	file: "SameSiteNoneInsecureWarnSet.md",
	links: [{
		link: "https://web.dev/samesite-cookies-explained/",
		linkTitle: w(C.samesiteCookiesExplained)
	}]
}, E = [{
	link: "https://web.dev/schemeful-samesite/",
	linkTitle: w(C.howSchemefulSamesiteWorks)
}];
function D({ isDestinationSecure: e, isOriginSecure: t }) {
	return /* @__PURE__ */ new Map([["PLACEHOLDER_destination", () => e ? "a secure" : "an insecure"], ["PLACEHOLDER_origin", () => t ? "a secure" : "an insecure"]]);
}
function yt(e) {
	return {
		file: "SameSiteWarnStrictLaxDowngradeStrict.md",
		substitutions: D({
			isDestinationSecure: e,
			isOriginSecure: !e
		}),
		links: E
	};
}
function bt(e) {
	return {
		file: "SameSiteExcludeNavigationContextDowngrade.md",
		substitutions: D({
			isDestinationSecure: e,
			isOriginSecure: !e
		}),
		links: E
	};
}
function xt(e) {
	return {
		file: "SameSiteWarnCrossDowngradeRead.md",
		substitutions: D({
			isDestinationSecure: e,
			isOriginSecure: !e
		}),
		links: E
	};
}
function St(e) {
	return {
		file: "SameSiteExcludeContextDowngradeRead.md",
		substitutions: D({
			isDestinationSecure: e,
			isOriginSecure: !e
		}),
		links: E
	};
}
function Ct(e) {
	return {
		file: "SameSiteWarnCrossDowngradeSet.md",
		substitutions: D({
			isDestinationSecure: !e,
			isOriginSecure: e
		}),
		links: E
	};
}
function wt(e) {
	return {
		file: "SameSiteExcludeContextDowngradeSet.md",
		substitutions: D({
			isDestinationSecure: e,
			isOriginSecure: !e
		}),
		links: E
	};
}
var Tt = {
	file: "CookieAttributeValueExceedsMaxSize.md",
	links: []
}, Et = {
	file: "cookieWarnDomainNonAscii.md",
	links: []
}, Dt = {
	file: "cookieExcludeDomainNonAscii.md",
	links: []
}, Ot = {
	file: "cookieExcludeBlockedWithinRelatedWebsiteSet.md",
	links: []
}, kt = {
	file: "cookieCrossSiteRedirectDowngrade.md",
	links: [{
		link: "https://bugs.chromium.org/p/chromium/issues/entry?template=Defect%20report%20from%20user&summary=[Cross-Site Redirect Chain] <INSERT BUG SUMMARY HERE>&comment=Chrome Version: (copy from chrome://version)%0AChannel: (e.g. Canary, Dev, Beta, Stable)%0A%0AAffected URLs:%0A%0AWhat is the expected result?%0A%0AWhat happens instead?%0A%0AWhat is the purpose of the cross-site redirect?:%0A%0AWhat steps will reproduce the problem?:%0A(1)%0A(2)%0A(3)%0A%0APlease provide any additional information below.&components=Internals%3ENetwork%3ECookies",
		linkTitle: w(C.fileCrosSiteRedirectBug)
	}]
}, At = {
	file: "cookieExcludePortMismatch.md",
	links: []
}, jt = {
	file: "cookieExcludeSchemeMismatch.md",
	links: []
}, O = {
	file: "placeholderDescriptionForInvisibleIssues.md",
	links: []
}, Mt = /* @__PURE__ */ new Map([
	["CookieIssue::WarnSameSiteUnspecifiedLaxAllowUnsafe::ReadCookie", pt],
	["CookieIssue::WarnSameSiteUnspecifiedLaxAllowUnsafe::SetCookie", mt],
	["CookieIssue::WarnSameSiteUnspecifiedCrossSiteContext::ReadCookie", pt],
	["CookieIssue::WarnSameSiteUnspecifiedCrossSiteContext::SetCookie", mt],
	["CookieIssue::ExcludeSameSiteNoneInsecure::ReadCookie", ht],
	["CookieIssue::ExcludeSameSiteNoneInsecure::SetCookie", gt],
	["CookieIssue::WarnSameSiteNoneInsecure::ReadCookie", _t],
	["CookieIssue::WarnSameSiteNoneInsecure::SetCookie", vt],
	["CookieIssue::WarnSameSiteStrictLaxDowngradeStrict::Secure", yt(!0)],
	["CookieIssue::WarnSameSiteStrictLaxDowngradeStrict::Insecure", yt(!1)],
	["CookieIssue::WarnCrossDowngrade::ReadCookie::Secure", xt(!0)],
	["CookieIssue::WarnCrossDowngrade::ReadCookie::Insecure", xt(!1)],
	["CookieIssue::WarnCrossDowngrade::SetCookie::Secure", Ct(!0)],
	["CookieIssue::WarnCrossDowngrade::SetCookie::Insecure", Ct(!1)],
	["CookieIssue::ExcludeNavigationContextDowngrade::Secure", bt(!0)],
	["CookieIssue::ExcludeNavigationContextDowngrade::Insecure", bt(!1)],
	["CookieIssue::ExcludeContextDowngrade::ReadCookie::Secure", St(!0)],
	["CookieIssue::ExcludeContextDowngrade::ReadCookie::Insecure", St(!1)],
	["CookieIssue::ExcludeContextDowngrade::SetCookie::Secure", wt(!0)],
	["CookieIssue::ExcludeContextDowngrade::SetCookie::Insecure", wt(!1)],
	["CookieIssue::WarnAttributeValueExceedsMaxSize::ReadCookie", Tt],
	["CookieIssue::WarnAttributeValueExceedsMaxSize::SetCookie", Tt],
	["CookieIssue::WarnDomainNonASCII::ReadCookie", Et],
	["CookieIssue::WarnDomainNonASCII::SetCookie", Et],
	["CookieIssue::ExcludeDomainNonASCII::ReadCookie", Dt],
	["CookieIssue::ExcludeDomainNonASCII::SetCookie", Dt],
	["CookieIssue::ExcludeThirdPartyCookieBlockedInRelatedWebsiteSet::ReadCookie", Ot],
	["CookieIssue::ExcludeThirdPartyCookieBlockedInRelatedWebsiteSet::SetCookie", Ot],
	["CookieIssue::WarnThirdPartyPhaseout::ReadCookie", O],
	["CookieIssue::WarnThirdPartyPhaseout::SetCookie", O],
	["CookieIssue::WarnDeprecationTrialMetadata::ReadCookie", O],
	["CookieIssue::WarnDeprecationTrialMetadata::SetCookie", O],
	["CookieIssue::WarnThirdPartyCookieHeuristic::ReadCookie", O],
	["CookieIssue::WarnThirdPartyCookieHeuristic::SetCookie", O],
	["CookieIssue::ExcludeThirdPartyPhaseout::ReadCookie", O],
	["CookieIssue::ExcludeThirdPartyPhaseout::SetCookie", O],
	["CookieIssue::CrossSiteRedirectDowngradeChangesInclusion", kt],
	["CookieIssue::ExcludePortMismatch", At],
	["CookieIssue::ExcludeSchemeMismatch", jt]
]), k = {
	corsLocalNetworkAccess: "Local Network Access",
	CORS: "Cross-Origin Resource Sharing (`CORS`)"
}, Nt = i("models/issues_manager/CorsIssue.ts", k), A = r.bind(void 0, Nt), Pt = /* @__PURE__ */ function(e) {
	return e.INSECURE_LOCAL_NETWORK = "CorsIssue::InsecureLocalNetwork", e.INVALID_HEADER_VALUES = "CorsIssue::InvalidHeaders", e.WILDCARD_ORIGN_NOT_ALLOWED = "CorsIssue::WildcardOriginWithCredentials", e.PREFLIGHT_RESPONSE_INVALID = "CorsIssue::PreflightResponseInvalid", e.ORIGIN_MISMATCH = "CorsIssue::OriginMismatch", e.ALLOW_CREDENTIALS_REQUIRED = "CorsIssue::AllowCredentialsRequired", e.METHOD_DISALLOWED_BY_PREFLIGHT_RESPONSE = "CorsIssue::MethodDisallowedByPreflightResponse", e.HEADER_DISALLOWED_BY_PREFLIGHT_RESPONSE = "CorsIssue::HeaderDisallowedByPreflightResponse", e.REDIRECT_CONTAINS_CREDENTIALS = "CorsIssue::RedirectContainsCredentials", e.DISALLOWED_BY_MODE = "CorsIssue::DisallowedByMode", e.CORS_DISABLED_SCHEME = "CorsIssue::CorsDisabledScheme", e.PREFLIGHT_MISSING_ALLOW_EXTERNAL = "CorsIssue::PreflightMissingAllowExternal", e.PREFLIGHT_INVALID_ALLOW_EXTERNAL = "CorsIssue::PreflightInvalidAllowExternal", e.NO_CORS_REDIRECT_MODE_NOT_FOLLOW = "CorsIssue::NoCorsRedirectModeNotFollow", e.INVALID_LOCAL_NETWORK_ACCESS = "CorsIssue::InvalidLocalNetworkAccess", e.LOCAL_NETWORK_ACCESS_PERMISSION_DENIED = "CorsIssue::LocalNetworkAccessPermissionDenied", e;
}({});
function Ft(e) {
	switch (e.corsErrorStatus.corsError) {
		case c.CorsError.InvalidAllowMethodsPreflightResponse:
		case c.CorsError.InvalidAllowHeadersPreflightResponse:
		case c.CorsError.PreflightMissingAllowOriginHeader:
		case c.CorsError.PreflightMultipleAllowOriginValues:
		case c.CorsError.PreflightInvalidAllowOriginValue:
		case c.CorsError.MissingAllowOriginHeader:
		case c.CorsError.MultipleAllowOriginValues:
		case c.CorsError.InvalidAllowOriginValue: return "CorsIssue::InvalidHeaders";
		case c.CorsError.PreflightWildcardOriginNotAllowed:
		case c.CorsError.WildcardOriginNotAllowed: return "CorsIssue::WildcardOriginWithCredentials";
		case c.CorsError.PreflightInvalidStatus:
		case c.CorsError.PreflightDisallowedRedirect:
		case c.CorsError.InvalidResponse: return "CorsIssue::PreflightResponseInvalid";
		case c.CorsError.AllowOriginMismatch:
		case c.CorsError.PreflightAllowOriginMismatch: return "CorsIssue::OriginMismatch";
		case c.CorsError.InvalidAllowCredentials:
		case c.CorsError.PreflightInvalidAllowCredentials: return "CorsIssue::AllowCredentialsRequired";
		case c.CorsError.MethodDisallowedByPreflightResponse: return "CorsIssue::MethodDisallowedByPreflightResponse";
		case c.CorsError.HeaderDisallowedByPreflightResponse: return "CorsIssue::HeaderDisallowedByPreflightResponse";
		case c.CorsError.RedirectContainsCredentials: return "CorsIssue::RedirectContainsCredentials";
		case c.CorsError.DisallowedByMode: return "CorsIssue::DisallowedByMode";
		case c.CorsError.CorsDisabledScheme: return "CorsIssue::CorsDisabledScheme";
		case c.CorsError.PreflightMissingAllowExternal: return "CorsIssue::PreflightMissingAllowExternal";
		case c.CorsError.PreflightInvalidAllowExternal: return "CorsIssue::PreflightInvalidAllowExternal";
		case c.CorsError.InsecureLocalNetwork: return "CorsIssue::InsecureLocalNetwork";
		case c.CorsError.NoCorsRedirectModeNotFollow: return "CorsIssue::NoCorsRedirectModeNotFollow";
		case c.CorsError.InvalidLocalNetworkAccess: return "CorsIssue::InvalidLocalNetworkAccess";
		case c.CorsError.LocalNetworkAccessPermissionDenied: return "CorsIssue::LocalNetworkAccessPermissionDenied";
	}
}
var It = class e extends m {
	constructor(e, t, n) {
		super(Ft(e), e, t, n);
	}
	getCategory() {
		return f.CORS;
	}
	getDescription() {
		switch (Ft(this.details())) {
			case "CorsIssue::InvalidHeaders": return {
				file: "corsInvalidHeaderValues.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::WildcardOriginWithCredentials": return {
				file: "corsWildcardOriginNotAllowed.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::PreflightResponseInvalid": return {
				file: "corsPreflightResponseInvalid.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::OriginMismatch": return {
				file: "corsOriginMismatch.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::AllowCredentialsRequired": return {
				file: "corsAllowCredentialsRequired.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::MethodDisallowedByPreflightResponse": return {
				file: "corsMethodDisallowedByPreflightResponse.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::HeaderDisallowedByPreflightResponse": return {
				file: "corsHeaderDisallowedByPreflightResponse.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::RedirectContainsCredentials": return {
				file: "corsRedirectContainsCredentials.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::DisallowedByMode": return {
				file: "corsDisallowedByMode.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::CorsDisabledScheme": return {
				file: "corsDisabledScheme.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::NoCorsRedirectModeNotFollow": return {
				file: "corsNoCorsRedirectModeNotFollow.md",
				links: [{
					link: "https://web.dev/cross-origin-resource-sharing",
					linkTitle: A(k.CORS)
				}]
			};
			case "CorsIssue::InsecureLocalNetwork":
			case "CorsIssue::LocalNetworkAccessPermissionDenied": return {
				file: "corsLocalNetworkAccessPermissionDenied.md",
				links: [{
					link: "https://developer.chrome.com/blog/local-network-access",
					linkTitle: A(k.corsLocalNetworkAccess)
				}]
			};
			case "CorsIssue::PreflightMissingAllowExternal":
			case "CorsIssue::PreflightInvalidAllowExternal":
			case "CorsIssue::InvalidLocalNetworkAccess": return null;
		}
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getKind() {
		return this.details().isWarning && this.details().corsErrorStatus.corsError === c.CorsError.InsecureLocalNetwork ? p.BREAKING_CHANGE : p.PAGE_ERROR;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.corsIssueDetails;
		return r ? [new e(r, t, n.issueId)] : (console.warn("Cors issue without details received."), []);
	}
}, j = {
	coopAndCoep: "COOP and COEP",
	samesiteAndSameorigin: "Same-Site and Same-Origin"
}, Lt = i("models/issues_manager/CrossOriginEmbedderPolicyIssue.ts", j), M = e.bind(void 0, Lt);
function Rt(e) {
	switch (e) {
		case s.BlockedByResponseReason.CoepFrameResourceNeedsCoepHeader: return !0;
		case s.BlockedByResponseReason.CoopSandboxedIFrameCannotNavigateToCoopPage: return !0;
		case s.BlockedByResponseReason.CorpNotSameOrigin: return !0;
		case s.BlockedByResponseReason.CorpNotSameOriginAfterDefaultedToSameOriginByCoep: return !0;
		case s.BlockedByResponseReason.CorpNotSameSite: return !0;
	}
	return !1;
}
var zt = class extends m {
	constructor(e, t) {
		super(`CrossOriginEmbedderPolicyIssue::${e.reason}`, e, t);
	}
	primaryKey() {
		return `${this.code()}-(${this.details().request.requestId})`;
	}
	getBlockedByResponseDetails() {
		return [this.details()];
	}
	requests() {
		return [this.details().request];
	}
	getCategory() {
		return f.CROSS_ORIGIN_EMBEDDER_POLICY;
	}
	getDescription() {
		let e = Bt.get(this.code());
		return e ? g(e) : null;
	}
	getKind() {
		return p.PAGE_ERROR;
	}
}, Bt = /* @__PURE__ */ new Map([
	["CrossOriginEmbedderPolicyIssue::CorpNotSameOriginAfterDefaultedToSameOriginByCoep", {
		file: "CoepCorpNotSameOriginAfterDefaultedToSameOriginByCoep.md",
		links: [{
			link: "https://web.dev/coop-coep/",
			linkTitle: M(j.coopAndCoep)
		}, {
			link: "https://web.dev/same-site-same-origin/",
			linkTitle: M(j.samesiteAndSameorigin)
		}]
	}],
	["CrossOriginEmbedderPolicyIssue::CoepFrameResourceNeedsCoepHeader", {
		file: "CoepFrameResourceNeedsCoepHeader.md",
		links: [{
			link: "https://web.dev/coop-coep/",
			linkTitle: M(j.coopAndCoep)
		}]
	}],
	["CrossOriginEmbedderPolicyIssue::CoopSandboxedIframeCannotNavigateToCoopPage", {
		file: "CoepCoopSandboxedIframeCannotNavigateToCoopPage.md",
		links: [{
			link: "https://web.dev/coop-coep/",
			linkTitle: M(j.coopAndCoep)
		}]
	}],
	["CrossOriginEmbedderPolicyIssue::CorpNotSameSite", {
		file: "CoepCorpNotSameSite.md",
		links: [{
			link: "https://web.dev/coop-coep/",
			linkTitle: M(j.coopAndCoep)
		}, {
			link: "https://web.dev/same-site-same-origin/",
			linkTitle: M(j.samesiteAndSameorigin)
		}]
	}],
	["CrossOriginEmbedderPolicyIssue::CorpNotSameOrigin", {
		file: "CoepCorpNotSameOrigin.md",
		links: [{
			link: "https://web.dev/coop-coep/",
			linkTitle: M(j.coopAndCoep)
		}, {
			link: "https://web.dev/same-site-same-origin/",
			linkTitle: M(j.samesiteAndSameorigin)
		}]
	}]
]), N = {
	AttributionReporting: "Attribution Reporting is deprecated and will be removed. See https://goo.gle/ps-status for details.",
	AuthorizationCoveredByWildcard: "Authorization will not be covered by the wildcard symbol (*) in CORS `Access-Control-Allow-Headers` handling.",
	CanRequestURLHTTPContainingNewline: "Resource requests whose URLs contained both removed whitespace `\\(n|r|t)` characters and less-than characters (`<`) are blocked. Please remove newlines and encode less-than characters from places like element attribute values in order to load these resources.",
	ChromeLoadTimesConnectionInfo: "`chrome.loadTimes()` is deprecated, instead use standardized API: Navigation Timing 2.",
	ChromeLoadTimesFirstPaintAfterLoadTime: "`chrome.loadTimes()` is deprecated, instead use standardized API: Paint Timing.",
	ChromeLoadTimesWasAlternateProtocolAvailable: "`chrome.loadTimes()` is deprecated, instead use standardized API: `nextHopProtocol` in Navigation Timing 2.",
	CrossOriginAccessBasedOnDocumentDomain: "Relaxing the same-origin policy by setting `document.domain` is deprecated, and will be disabled by default. This deprecation warning is for a cross-origin access that was enabled by setting `document.domain`.",
	CrossOriginWindowAlert: "Triggering window.alert from cross origin iframes has been deprecated and will be removed in the future.",
	CrossOriginWindowConfirm: "Triggering window.confirm from cross origin iframes has been deprecated and will be removed in the future.",
	CSSSelectorInternalMediaControlsOverlayCastButton: "The `disableRemotePlayback` attribute should be used in order to disable the default Cast integration instead of using `-internal-media-controls-overlay-cast-button` selector.",
	CSSValueAppearanceSliderVertical: "CSS appearance value `slider-vertical` is not standardized and will be removed.",
	DataUrlInSvgUse: "Support for data: URLs in SVGUseElement is deprecated and it will be removed in the future.",
	DocumentCreateEventKeyboardEvents: "document.createEvent('KeyboardEvents') is deprecated and will be removed. Use `new KeyboardEvent()` instead.",
	DocumentCreateEventTransitionEvent: "document.createEvent('TransitionEvent') is deprecated and will be removed. Use `new TransitionEvent()` instead.",
	ExampleBrowserProcessDeprecation: "This is an example for showing the code required for a browser process reported deprecation.",
	Fledge: "The Protected Audience API is deprecated and will be removed in a future release.",
	GeolocationInsecureOrigin: "`getCurrentPosition()` and `watchPosition()` no longer work on insecure origins. To use this feature, you should consider switching your application to a secure origin, such as HTTPS. See https://www.chromium.org/Home/chromium-security/deprecating-powerful-features-on-insecure-origins/ for more details.",
	GeolocationInsecureOriginDeprecatedNotRemoved: "`getCurrentPosition()` and `watchPosition()` are deprecated on insecure origins. To use this feature, you should consider switching your application to a secure origin, such as HTTPS. See https://www.chromium.org/Home/chromium-security/deprecating-powerful-features-on-insecure-origins/ for more details.",
	GetUserMediaInsecureOrigin: "`getUserMedia()` no longer works on insecure origins. To use this feature, you should consider switching your application to a secure origin, such as HTTPS. See https://www.chromium.org/Home/chromium-security/deprecating-powerful-features-on-insecure-origins/ for more details.",
	HostCandidateAttributeGetter: "`RTCPeerConnectionIceErrorEvent.hostCandidate` is deprecated. Please use `RTCPeerConnectionIceErrorEvent.address` or `RTCPeerConnectionIceErrorEvent.port` instead.",
	IdentityInCanMakePaymentEvent: "The merchant origin and arbitrary data from the `canmakepayment` service worker event are deprecated and will be removed: `topOrigin`, `paymentRequestOrigin`, `methodData`, `modifiers`.",
	InsecurePrivateNetworkSubresourceRequest: "The website requested a subresource from a network that it could only access because of its users' privileged network position. These requests expose non-public devices and servers to the internet, increasing the risk of a cross-site request forgery (CSRF) attack, and/or information leakage. To mitigate these risks, Chrome deprecates requests to non-public subresources when initiated from non-secure contexts, and will start blocking them.",
	InterestGroupDailyUpdateUrl: "The `dailyUpdateUrl` field of `InterestGroups` passed to `joinAdInterestGroup()` has been renamed to `updateUrl`, to more accurately reflect its behavior.",
	IntlV8BreakIterator: "`Intl.v8BreakIterator` is deprecated. Please use `Intl.Segmenter` instead.",
	LanguageModel_InputQuota: "LanguageModel.inputQuota is deprecated. Please use LanguageModel.contextWindow instead. This alias is only available in extensions.",
	LanguageModel_InputUsage: "LanguageModel.inputUsage is deprecated. Please use LanguageModel.contextUsage instead. This alias is only available in extensions.",
	LanguageModel_MeasureInputUsage: "LanguageModel.measureInputUsage() is deprecated. Please use LanguageModel.measureContextUsage() instead. This alias is only available in extensions.",
	LanguageModel_OnQuotaOverflow: "LanguageModel.onquotaoverflow is deprecated. Please use LanguageModel.oncontextoverflow instead. The LanguageModel.onquotaoverflow alias is only available in extensions.",
	LanguageModelParams: "LanguageModel.params() is deprecated and now only available in extension contexts. The topK and temperature related fields within its result are also deprecated.",
	LanguageModelTemperature: "The 'temperature' parameter/attribute for LanguageModel is deprecated. It is only functional within extensions and may be removed in the future.",
	LanguageModelTopK: "The 'topK' parameter/attribute for LanguageModel is deprecated. It is only functional within extensions and may be removed in the future.",
	LocalCSSFileExtensionRejected: "CSS cannot be loaded from `file:` URLs unless they end in a `.css` file extension.",
	NoSysexWebMIDIWithoutPermission: "Web MIDI will ask a permission to use even if the sysex is not specified in the `MIDIOptions`.",
	NotificationInsecureOrigin: "The Notification API may no longer be used from insecure origins. You should consider switching your application to a secure origin, such as HTTPS. See https://www.chromium.org/Home/chromium-security/deprecating-powerful-features-on-insecure-origins/ for more details.",
	NotificationPermissionRequestedIframe: "Permission for the Notification API may no longer be requested from a cross-origin iframe. You should consider requesting permission from a top-level frame or opening a new window instead.",
	ObsoleteCreateImageBitmapImageOrientationNone: "Option `imageOrientation: 'none'` in createImageBitmap is deprecated. Please use createImageBitmap with option '{imageOrientation: 'from-image'}' instead.",
	ObsoleteWebRtcCipherSuite: "Your partner is negotiating an obsolete (D)TLS version. Please check with your partner to have this fixed.",
	OverflowVisibleOnReplacedElement: "Specifying `overflow: visible` on img, video and canvas tags may cause them to produce visual content outside of the element bounds. See https://github.com/WICG/shared-element-transitions/blob/main/debugging_overflow_on_images.md.",
	OverrideFlashEmbedwithHTML: "Legacy flash video embed has been rewritten to HTML iframe. Flash is long gone, this rewriting hack is deprecated and may be removed in the future.",
	PaymentInstruments: "`paymentManager.instruments` is deprecated. Please use just-in-time install for payment handlers instead.",
	PaymentRequestCSPViolation: "Your `PaymentRequest` call bypassed Content-Security-Policy (CSP) `connect-src` directive. This bypass is deprecated. Please add the payment method identifier from the `PaymentRequest` API (in `supportedMethods` field) to your CSP `connect-src` directive.",
	PersistentQuotaType: "`StorageType.persistent` is deprecated. Please use standardized `navigator.storage` instead.",
	PictureSourceSrc: "`<source src>` with a `<picture>` parent is invalid and therefore ignored. Please use `<source srcset>` instead.",
	PrefixedCancelAnimationFrame: "webkitCancelAnimationFrame is vendor-specific. Please use the standard cancelAnimationFrame instead.",
	PrefixedRequestAnimationFrame: "webkitRequestAnimationFrame is vendor-specific. Please use the standard requestAnimationFrame instead.",
	PrefixedVideoDisplayingFullscreen: "HTMLVideoElement.webkitDisplayingFullscreen is deprecated. Please use Document.fullscreenElement instead.",
	PrefixedVideoEnterFullScreen: "HTMLVideoElement.webkitEnterFullScreen() is deprecated. Please use Element.requestFullscreen() instead.",
	PrefixedVideoEnterFullscreen: "HTMLVideoElement.webkitEnterFullscreen() is deprecated. Please use Element.requestFullscreen() instead.",
	PrefixedVideoExitFullScreen: "HTMLVideoElement.webkitExitFullScreen() is deprecated. Please use Document.exitFullscreen() instead.",
	PrefixedVideoExitFullscreen: "HTMLVideoElement.webkitExitFullscreen() is deprecated. Please use Document.exitFullscreen() instead.",
	PrefixedVideoSupportsFullscreen: "HTMLVideoElement.webkitSupportsFullscreen is deprecated. Please use Document.fullscreenEnabled instead.",
	PreventSvgFilterPaint: "SVG filters cannot be applied to cross-origin iframes, restricted iframes (e.g., sandboxed), or plugins.",
	RangeExpand: "Range.expand() is deprecated. Please use Selection.modify() instead.",
	RelatedWebsiteSets: "`Related Website Sets` is deprecated and will be removed. See https://privacysandbox.com/news/update-on-plans-for-privacy-sandbox-technologies/ for more details.",
	RequestedSubresourceWithEmbeddedCredentials: "Subresource requests whose URLs contain embedded credentials (e.g. `https://user:pass@host/`) are blocked.",
	RTCConstraintEnableDtlsSrtpFalse: "The constraint `DtlsSrtpKeyAgreement` is removed. You have specified a `false` value for this constraint, which is interpreted as an attempt to use the removed `SDES key negotiation` method. This functionality is removed; use a service that supports `DTLS key negotiation` instead.",
	RTCConstraintEnableDtlsSrtpTrue: "The constraint `DtlsSrtpKeyAgreement` is removed. You have specified a `true` value for this constraint, which had no effect, but you can remove this constraint for tidiness.",
	RTCPeerConnectionGetStatsLegacyNonCompliant: "The callback-based getStats() is deprecated and will be removed. Use the spec-compliant getStats() instead.",
	RtcpMuxPolicyNegotiate: "The `rtcpMuxPolicy` option is deprecated and will be removed.",
	SharedArrayBufferConstructedWithoutIsolation: "`SharedArrayBuffer` will require cross-origin isolation. See https://developer.chrome.com/blog/enabling-shared-array-buffer/ for more details.",
	SharedStorage: "The Shared Storage API is deprecated and will be removed in a future release.",
	StorageAccessAPI_requestStorageAccessFor_Method: "`document.requestStorageAccessFor` is deprecated and will be removed. See https://privacysandbox.com/news/update-on-plans-for-privacy-sandbox-technologies/ for more details.",
	TextToSpeech_DisallowedByAutoplay: "`speechSynthesis.speak()` without user activation is deprecated and will be removed.",
	Topics: "The Topics API is deprecated and will be removed in a future release.",
	UnloadHandler: "Unload event listeners are deprecated and will be removed.",
	V8SharedArrayBufferConstructedInExtensionWithoutIsolation: "Extensions should opt into cross-origin isolation to continue using `SharedArrayBuffer`. See https://developer.chrome.com/docs/extensions/mv3/cross-origin-isolation/.",
	WebBluetoothRemoteCharacteristicWriteValue: "`BluetoothRemoteGATTCharacteristic.writeValue()` is deprecated. Use `writeValueWithResponse()` or `writeValueWithoutResponse()` instead.",
	XHRJSONEncodingDetection: "UTF-16 is not supported by response json in `XMLHttpRequest`",
	XMLHttpRequestSynchronousInNonWorkerOutsideBeforeUnload: "Synchronous `XMLHttpRequest` on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check https://xhr.spec.whatwg.org/.",
	XSLT: "XSLTProcessor and XSLT Processing Instructions have been deprecated by all browsers. These features will be removed from this browser soon."
}, Vt = {
	AttributionReporting: { chromeStatusFeature: 6320639375966208 },
	AuthorizationCoveredByWildcard: { milestone: 97 },
	CSSSelectorInternalMediaControlsOverlayCastButton: { chromeStatusFeature: 5714245488476160 },
	CSSValueAppearanceSliderVertical: { chromeStatusFeature: 6001359429566464 },
	CanRequestURLHTTPContainingNewline: { chromeStatusFeature: 5735596811091968 },
	ChromeLoadTimesConnectionInfo: { chromeStatusFeature: 5637885046816768 },
	ChromeLoadTimesFirstPaintAfterLoadTime: { chromeStatusFeature: 5637885046816768 },
	ChromeLoadTimesWasAlternateProtocolAvailable: { chromeStatusFeature: 5637885046816768 },
	CrossOriginAccessBasedOnDocumentDomain: { milestone: 115 },
	DataUrlInSvgUse: {
		chromeStatusFeature: 5128825141198848,
		milestone: 119
	},
	DocumentCreateEventKeyboardEvents: {
		chromeStatusFeature: 5095987863486464,
		milestone: 151
	},
	DocumentCreateEventTransitionEvent: {
		chromeStatusFeature: 5095987863486464,
		milestone: 151
	},
	IdentityInCanMakePaymentEvent: { chromeStatusFeature: 5190978431352832 },
	InsecurePrivateNetworkSubresourceRequest: {
		chromeStatusFeature: 5436853517811712,
		milestone: 92
	},
	LanguageModelParams: { chromeStatusFeature: 5134603979063296 },
	LanguageModelTemperature: { chromeStatusFeature: 5134603979063296 },
	LanguageModelTopK: { chromeStatusFeature: 5134603979063296 },
	LanguageModel_InputQuota: { chromeStatusFeature: 5134603979063296 },
	LanguageModel_InputUsage: { chromeStatusFeature: 5134603979063296 },
	LanguageModel_MeasureInputUsage: { chromeStatusFeature: 5134603979063296 },
	LanguageModel_OnQuotaOverflow: { chromeStatusFeature: 5134603979063296 },
	LocalCSSFileExtensionRejected: { milestone: 64 },
	NoSysexWebMIDIWithoutPermission: {
		chromeStatusFeature: 5138066234671104,
		milestone: 82
	},
	NotificationPermissionRequestedIframe: { chromeStatusFeature: 6451284559265792 },
	ObsoleteCreateImageBitmapImageOrientationNone: { milestone: 111 },
	ObsoleteWebRtcCipherSuite: { milestone: 81 },
	OverflowVisibleOnReplacedElement: {
		chromeStatusFeature: 5137515594383360,
		milestone: 108
	},
	OverrideFlashEmbedwithHTML: { milestone: 140 },
	PaymentInstruments: { chromeStatusFeature: 5099285054488576 },
	PaymentRequestCSPViolation: { chromeStatusFeature: 6286595631087616 },
	PersistentQuotaType: {
		chromeStatusFeature: 5176235376246784,
		milestone: 106
	},
	PreventSvgFilterPaint: { chromeStatusFeature: 5117170452398080 },
	RTCConstraintEnableDtlsSrtpFalse: { milestone: 97 },
	RTCConstraintEnableDtlsSrtpTrue: { milestone: 97 },
	RTCPeerConnectionGetStatsLegacyNonCompliant: {
		chromeStatusFeature: 4631626228695040,
		milestone: 117
	},
	RelatedWebsiteSets: { chromeStatusFeature: 5194473869017088 },
	RequestedSubresourceWithEmbeddedCredentials: { chromeStatusFeature: 5669008342777856 },
	RtcpMuxPolicyNegotiate: {
		chromeStatusFeature: 5654810086866944,
		milestone: 62
	},
	SharedArrayBufferConstructedWithoutIsolation: { milestone: 106 },
	SharedStorage: { chromeStatusFeature: 5076349064708096 },
	StorageAccessAPI_requestStorageAccessFor_Method: { chromeStatusFeature: 5162221567082496 },
	TextToSpeech_DisallowedByAutoplay: {
		chromeStatusFeature: 5687444770914304,
		milestone: 71
	},
	UnloadHandler: { chromeStatusFeature: 5579556305502208 },
	V8SharedArrayBufferConstructedInExtensionWithoutIsolation: { milestone: 96 },
	WebBluetoothRemoteCharacteristicWriteValue: { chromeStatusFeature: 5088568590598144 },
	XHRJSONEncodingDetection: { milestone: 93 },
	XSLT: {
		chromeStatusFeature: 4709671889534976,
		milestone: 143
	}
}, P = {
	feature: "Check the feature status page for more details.",
	milestone: "This change will go into effect with milestone {milestone}.",
	title: "Deprecated feature used"
}, Ht = i("models/issues_manager/DeprecationIssue.ts", P), F = e.bind(void 0, Ht), Ut = i("generated/Deprecation.ts", N), Wt = e.bind(void 0, Ut), Gt = class e extends m {
	constructor(e, t) {
		let n = [s.InspectorIssueCode.DeprecationIssue, e.type].join("::");
		super({
			code: n,
			umaCode: "DeprecationIssue"
		}, e, t);
	}
	getCategory() {
		return f.OTHER;
	}
	getDescription() {
		let e = () => "", t = N[this.details().type];
		t && (e = Wt(t));
		let n = [], r = Vt[this.details().type], i = r?.chromeStatusFeature ?? 0;
		i !== 0 && n.push({
			link: `https://chromestatus.com/feature/${i}`,
			linkTitle: F(P.feature)
		});
		let a = r?.milestone ?? 0;
		return a !== 0 && n.push({
			link: "https://chromiumdash.appspot.com/schedule",
			linkTitle: F(P.milestone, { milestone: a })
		}), g({
			file: "deprecation.md",
			substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_title", F(P.title)], ["PLACEHOLDER_message", e]]),
			links: n
		});
	}
	sources() {
		return this.details().sourceCodeLocation ? [this.details().sourceCodeLocation] : [];
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getKind() {
		return p.BREAKING_CHANGE;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.deprecationIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Deprecation issue without details received."), []);
	}
}, I = class e extends m {
	constructor(e, t, n) {
		let r = [s.InspectorIssueCode.ElementAccessibilityIssue, e.elementAccessibilityIssueReason].join("::");
		super(r, e, t, n);
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getDescription() {
		if (this.isInteractiveContentAttributesSelectDescendantIssue()) return {
			file: "selectElementAccessibilityInteractiveContentAttributesSelectDescendant.md",
			links: []
		};
		let e = Kt.get(this.details().elementAccessibilityIssueReason);
		return e ? g(e) : null;
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	getCategory() {
		return f.OTHER;
	}
	isInteractiveContentAttributesSelectDescendantIssue() {
		return this.details().hasDisallowedAttributes && this.details().elementAccessibilityIssueReason !== s.ElementAccessibilityIssueReason.InteractiveContentOptionChild && this.details().elementAccessibilityIssueReason !== s.ElementAccessibilityIssueReason.InteractiveContentSummaryDescendant;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.elementAccessibilityIssueDetails;
		return r ? [new e(r, t, n.issueId)] : (console.warn("Element Accessibility issue without details received."), []);
	}
}, Kt = /* @__PURE__ */ new Map([
	[s.ElementAccessibilityIssueReason.DisallowedSelectChild, {
		file: "selectElementAccessibilityDisallowedSelectChild.md",
		links: []
	}],
	[s.ElementAccessibilityIssueReason.DisallowedOptGroupChild, {
		file: "selectElementAccessibilityDisallowedOptGroupChild.md",
		links: []
	}],
	[s.ElementAccessibilityIssueReason.NonPhrasingContentOptionChild, {
		file: "selectElementAccessibilityNonPhrasingContentOptionChild.md",
		links: []
	}],
	[s.ElementAccessibilityIssueReason.InteractiveContentOptionChild, {
		file: "selectElementAccessibilityInteractiveContentOptionChild.md",
		links: []
	}],
	[s.ElementAccessibilityIssueReason.InteractiveContentLegendChild, {
		file: "selectElementAccessibilityInteractiveContentLegendChild.md",
		links: []
	}],
	[s.ElementAccessibilityIssueReason.InteractiveContentSummaryDescendant, {
		file: "summaryElementAccessibilityInteractiveContentSummaryDescendant.md",
		links: []
	}]
]), L = { emailVerification: "Email Verification Protocol" }, qt = i("models/issues_manager/EmailVerificationRequestIssue.ts", L), R = e.bind(void 0, qt), Jt = class e extends m {
	constructor(e, t) {
		super({
			code: s.InspectorIssueCode.EmailVerificationRequestIssue,
			umaCode: [s.InspectorIssueCode.EmailVerificationRequestIssue, e.emailVerificationRequestIssueReason].join("::")
		}, e, t);
	}
	getCategory() {
		return f.OTHER;
	}
	getDescription() {
		let e = Yt.get(this.details().emailVerificationRequestIssueReason);
		return e ? g(e) : null;
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.emailVerificationRequestIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Email verification request issue without details received."), []);
	}
}, Yt = /* @__PURE__ */ new Map([
	[s.EmailVerificationRequestIssueReason.InvalidEmail, {
		file: "emailVerificationRequestInvalidEmail.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.DnsFetchFailed, {
		file: "emailVerificationRequestDnsFetchFailed.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.DnsInvalidRecord, {
		file: "emailVerificationRequestDnsInvalidRecord.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.WellKnownHttpNotFound, {
		file: "emailVerificationRequestWellKnownHttpNotFound.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.WellKnownNoResponse, {
		file: "emailVerificationRequestWellKnownNoResponse.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.WellKnownInvalidResponse, {
		file: "emailVerificationRequestWellKnownInvalidResponse.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.WellKnownListEmpty, {
		file: "emailVerificationRequestWellKnownListEmpty.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.WellKnownInvalidContentType, {
		file: "emailVerificationRequestWellKnownInvalidContentType.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.WellKnownMissingIssuanceEndpoint, {
		file: "emailVerificationRequestWellKnownMissingIssuanceEndpoint.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.WellKnownIssuanceEndpointCrossOrigin, {
		file: "emailVerificationRequestWellKnownIssuanceEndpointCrossOrigin.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.WellKnownUnsupportedSigningAlgorithm, {
		file: "emailVerificationRequestWellKnownUnsupportedSigningAlgorithm.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.TokenHttpNotFound, {
		file: "emailVerificationRequestTokenHttpNotFound.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.TokenNoResponse, {
		file: "emailVerificationRequestTokenNoResponse.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.TokenInvalidResponse, {
		file: "emailVerificationRequestTokenInvalidResponse.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.TokenInvalidContentType, {
		file: "emailVerificationRequestTokenInvalidContentType.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.TokenMalformedSdJwt, {
		file: "emailVerificationRequestTokenMalformedSdJwt.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.TokenInvalidSdJwt, {
		file: "emailVerificationRequestTokenInvalidSdJwt.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.KeyBindingSigningFailed, {
		file: "emailVerificationRequestKeyBindingSigningFailed.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.RpOriginIsOpaque, {
		file: "emailVerificationRequestRpOriginIsOpaque.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.WellKnownMissingAccountsEndpoint, {
		file: "emailVerificationRequestWellKnownMissingAccountsEndpoint.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.UserLoggedOut, {
		file: "emailVerificationRequestUserLoggedOut.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}],
	[s.EmailVerificationRequestIssueReason.WellKnownAccountsEndpointCrossOrigin, {
		file: "emailVerificationRequestWellKnownAccountsEndpointCrossOrigin.md",
		links: [{
			link: "https://github.com/WICG/email-verification-protocol",
			linkTitle: R(L.emailVerification)
		}]
	}]
]), z = { fedCmUserInfo: "Federated Credential Management User Info API" }, Xt = i("models/issues_manager/FederatedAuthUserInfoRequestIssue.ts", z), B = e.bind(void 0, Xt);
s.FederatedAuthUserInfoRequestIssueReason.NotSameOrigin, B(z.fedCmUserInfo), s.FederatedAuthUserInfoRequestIssueReason.NotIframe, B(z.fedCmUserInfo), s.FederatedAuthUserInfoRequestIssueReason.NotPotentiallyTrustworthy, B(z.fedCmUserInfo), s.FederatedAuthUserInfoRequestIssueReason.NoAPIPermission, B(z.fedCmUserInfo), s.FederatedAuthUserInfoRequestIssueReason.NotSignedInWithIdp, B(z.fedCmUserInfo), s.FederatedAuthUserInfoRequestIssueReason.NoAccountSharingPermission, B(z.fedCmUserInfo), s.FederatedAuthUserInfoRequestIssueReason.InvalidConfigOrWellKnown, B(z.fedCmUserInfo), s.FederatedAuthUserInfoRequestIssueReason.InvalidAccountsResponse, B(z.fedCmUserInfo), s.FederatedAuthUserInfoRequestIssueReason.NoReturningUserFromFetchedAccounts, B(z.fedCmUserInfo);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/issues_manager/GenericIssue.ts
var V = {
	howDoesAutofillWorkPageTitle: "How does autofill work?",
	labelFormlementsPageTitle: "The label elements",
	inputFormElementPageTitle: "The form input element",
	autocompleteAttributePageTitle: "HTML attribute: autocomplete",
	corbExplainerPageTitle: "CORB explainer",
	historyManipulationInterventionPageTitle: "History manipulation intervention explainer",
	backToAdInterventionPageTitle: "Back-to-ad intervention explainer"
}, Zt = i("models/issues_manager/GenericIssue.ts", V), H = e.bind(void 0, Zt), U = class e extends m {
	constructor(e, t, n) {
		let r = [s.InspectorIssueCode.GenericIssue, e.errorType].join("::");
		super(r, e, t, n);
	}
	requests() {
		let e = this.details();
		return e.request ? [e.request] : [];
	}
	getCategory() {
		return f.GENERIC;
	}
	primaryKey() {
		let e = this.details(), t = e.request ? e.request.requestId : "no-request";
		return `${this.code()}-(${e.frameId})-(${e.violatingNodeId})-(${e.violatingNodeAttribute})-(${t})`;
	}
	getDescription() {
		let e = fn.get(this.details().errorType);
		return e ? g(e) : null;
	}
	getKind() {
		return pn.get(this.details().errorType) || p.IMPROVEMENT;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.genericIssueDetails;
		return r ? [new e(r, t, n.issueId)] : (console.warn("Generic issue without details received."), []);
	}
}, Qt = {
	file: "genericFormLabelForNameError.md",
	links: [{
		link: "https://html.spec.whatwg.org/multipage/forms.html#attr-label-for",
		linkTitle: o("HTML Standard")
	}]
}, $t = {
	file: "genericFormInputWithNoLabelError.md",
	links: []
}, en = {
	file: "genericFormAutocompleteAttributeEmptyError.md",
	links: []
}, tn = {
	file: "genericFormDuplicateIdForInputError.md",
	links: [{
		link: "https://web.dev/learn/forms/autofill/#how-does-autofill-work",
		linkTitle: H(V.howDoesAutofillWorkPageTitle)
	}]
}, nn = {
	file: "genericFormAriaLabelledByToNonExistingIdError.md",
	links: [{
		link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label",
		linkTitle: H(V.labelFormlementsPageTitle)
	}]
}, rn = {
	file: "genericFormEmptyIdAndNameAttributesForInputError.md",
	links: [{
		link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input",
		linkTitle: H(V.inputFormElementPageTitle)
	}]
}, an = {
	file: "genericFormInputAssignedAutocompleteValueToIdOrNameAttributeError.md",
	links: [{
		link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values",
		linkTitle: H(V.autocompleteAttributePageTitle)
	}]
}, on = {
	file: "genericFormInputHasWrongButWellIntendedAutocompleteValueError.md",
	links: [{
		link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values",
		linkTitle: H(V.autocompleteAttributePageTitle)
	}]
}, sn = {
	file: "genericFormLabelForMatchesNonExistingIdError.md",
	links: [{
		link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label",
		linkTitle: H(V.labelFormlementsPageTitle)
	}]
}, cn = {
	file: "genericFormLabelHasNeitherForNorNestedInputError.md",
	links: [{
		link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label",
		linkTitle: H(V.labelFormlementsPageTitle)
	}]
}, ln = {
	file: "genericResponseWasBlockedByORB.md",
	links: [{
		link: "https://www.chromium.org/Home/chromium-security/corb-for-developers/",
		linkTitle: H(V.corbExplainerPageTitle)
	}]
}, un = {
	file: "genericNavigationEntryMarkedSkippable.md",
	links: [{
		link: "https://chromium.googlesource.com/chromium/src/+/main/docs/history_manipulation_intervention.md",
		linkTitle: H(V.historyManipulationInterventionPageTitle)
	}]
}, dn = {
	file: "genericBackUINavigationWouldSkipAd.md",
	links: [{
		link: "https://chromium.googlesource.com/chromium/src/+/main/docs/history_manipulation_intervention.md",
		linkTitle: H(V.backToAdInterventionPageTitle)
	}]
}, fn = /* @__PURE__ */ new Map([
	[s.GenericIssueErrorType.FormLabelForNameError, Qt],
	[s.GenericIssueErrorType.FormInputWithNoLabelError, $t],
	[s.GenericIssueErrorType.FormAutocompleteAttributeEmptyError, en],
	[s.GenericIssueErrorType.FormDuplicateIdForInputError, tn],
	[s.GenericIssueErrorType.FormAriaLabelledByToNonExistingIdError, nn],
	[s.GenericIssueErrorType.FormEmptyIdAndNameAttributesForInputError, rn],
	[s.GenericIssueErrorType.FormInputAssignedAutocompleteValueToIdOrNameAttributeError, an],
	[s.GenericIssueErrorType.FormLabelForMatchesNonExistingIdError, sn],
	[s.GenericIssueErrorType.FormLabelHasNeitherForNorNestedInputError, cn],
	[s.GenericIssueErrorType.FormInputHasWrongButWellIntendedAutocompleteValueError, on],
	[s.GenericIssueErrorType.ResponseWasBlockedByORB, ln],
	[s.GenericIssueErrorType.NavigationEntryMarkedSkippable, un],
	[s.GenericIssueErrorType.BackUINavigationWouldSkipAd, dn],
	[s.GenericIssueErrorType.FormModelContextMissingToolName, {
		file: "genericFormModelContextMissingToolName.md",
		links: []
	}],
	[s.GenericIssueErrorType.FormModelContextMissingToolDescription, {
		file: "genericFormModelContextMissingToolDescription.md",
		links: []
	}],
	[s.GenericIssueErrorType.FormModelContextParameterMissingTitleAndDescription, {
		file: "genericFormModelContextParameterMissingTitleAndDescription.md",
		links: []
	}],
	[s.GenericIssueErrorType.FormModelContextRequiredParameterMissingName, {
		file: "genericFormModelContextRequiredParameterMissingName.md",
		links: []
	}],
	[s.GenericIssueErrorType.FormModelContextParameterMissingName, {
		file: "genericFormModelContextParameterMissingName.md",
		links: []
	}]
]), pn = /* @__PURE__ */ new Map([
	[s.GenericIssueErrorType.FormLabelForNameError, p.PAGE_ERROR],
	[s.GenericIssueErrorType.FormInputWithNoLabelError, p.IMPROVEMENT],
	[s.GenericIssueErrorType.FormAutocompleteAttributeEmptyError, p.PAGE_ERROR],
	[s.GenericIssueErrorType.FormDuplicateIdForInputError, p.PAGE_ERROR],
	[s.GenericIssueErrorType.FormAriaLabelledByToNonExistingIdError, p.IMPROVEMENT],
	[s.GenericIssueErrorType.FormEmptyIdAndNameAttributesForInputError, p.IMPROVEMENT],
	[s.GenericIssueErrorType.FormInputAssignedAutocompleteValueToIdOrNameAttributeError, p.IMPROVEMENT],
	[s.GenericIssueErrorType.FormLabelForMatchesNonExistingIdError, p.PAGE_ERROR],
	[s.GenericIssueErrorType.FormLabelHasNeitherForNorNestedInputError, p.IMPROVEMENT],
	[s.GenericIssueErrorType.FormInputHasWrongButWellIntendedAutocompleteValueError, p.IMPROVEMENT],
	[s.GenericIssueErrorType.FormModelContextMissingToolName, p.PAGE_ERROR],
	[s.GenericIssueErrorType.FormModelContextMissingToolDescription, p.PAGE_ERROR],
	[s.GenericIssueErrorType.FormModelContextParameterMissingTitleAndDescription, p.PAGE_ERROR],
	[s.GenericIssueErrorType.FormModelContextRequiredParameterMissingName, p.PAGE_ERROR],
	[s.GenericIssueErrorType.FormModelContextParameterMissingName, p.PAGE_ERROR]
]), mn = { handlingHeavyAdInterventions: "Handling Heavy Ad Interventions" }, hn = i("models/issues_manager/HeavyAdIssue.ts", mn), gn = r.bind(void 0, hn), _n = class e extends m {
	constructor(e, t) {
		let n = [s.InspectorIssueCode.HeavyAdIssue, e.reason].join("::");
		super({
			code: s.InspectorIssueCode.HeavyAdIssue,
			umaCode: n
		}, e, t);
	}
	primaryKey() {
		return `${s.InspectorIssueCode.HeavyAdIssue}-${JSON.stringify(this.details())}`;
	}
	getDescription() {
		return {
			file: "heavyAd.md",
			links: [{
				link: "https://developers.google.com/web/updates/2020/05/heavy-ad-interventions",
				linkTitle: gn(mn.handlingHeavyAdInterventions)
			}]
		};
	}
	getCategory() {
		return f.HEAVY_AD;
	}
	getKind() {
		switch (this.details().resolution) {
			case s.HeavyAdResolutionStatus.HeavyAdBlocked: return p.PAGE_ERROR;
			case s.HeavyAdResolutionStatus.HeavyAdWarning: return p.BREAKING_CHANGE;
		}
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.heavyAdIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Heavy Ad issue without details received."), []);
	}
}, W = /* @__PURE__ */ function(e) {
	return e.ISSUES_COUNT_UPDATED = "IssuesCountUpdated", e.ISSUE_ADDED = "IssueAdded", e.FULL_UPDATE_REQUIRED = "FullUpdateRequired", e.ISSUE_HIDDEN_STATUS_UPDATED = "IssueHiddenStatusUpdated", e;
}({}), vn = { preventingMixedContent: "Preventing mixed content" }, yn = i("models/issues_manager/MixedContentIssue.ts", vn), bn = r.bind(void 0, yn), xn = class e extends m {
	constructor(e, t) {
		super(s.InspectorIssueCode.MixedContentIssue, e, t);
	}
	requests() {
		let e = this.details();
		return e.request ? [e.request] : [];
	}
	getCategory() {
		return f.MIXED_CONTENT;
	}
	getDescription() {
		return {
			file: "mixedContent.md",
			links: [{
				link: "https://web.dev/what-is-mixed-content/",
				linkTitle: bn(vn.preventingMixedContent)
			}]
		};
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getKind() {
		switch (this.details().resolutionStatus) {
			case s.MixedContentResolutionStatus.MixedContentAutomaticallyUpgraded: return p.IMPROVEMENT;
			case s.MixedContentResolutionStatus.MixedContentBlocked: return p.PAGE_ERROR;
			case s.MixedContentResolutionStatus.MixedContentWarning: return p.IMPROVEMENT;
		}
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.mixedContentIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Mixed content issue without details received."), []);
	}
}, G = {
	partitioningBlobURL: "Partitioning BlobURL",
	chromeStatusEntry: "Chrome Status Entry"
}, Sn = i("models/issues_manager/PartitioningBlobURLIssue.ts", G), Cn = r.bind(void 0, Sn), wn = class e extends m {
	constructor(e, t) {
		super(s.InspectorIssueCode.PartitioningBlobURLIssue, e, t);
	}
	getCategory() {
		return f.OTHER;
	}
	getDescription() {
		return {
			file: this.details().partitioningBlobURLInfo === s.PartitioningBlobURLInfo.BlockedCrossPartitionFetching ? "fetchingPartitionedBlobURL.md" : "navigatingPartitionedBlobURL.md",
			links: [{
				link: "https://developers.google.com/privacy-sandbox/cookies/storage-partitioning",
				linkTitle: Cn(G.partitioningBlobURL)
			}, {
				link: "https://chromestatus.com/feature/5130361898795008",
				linkTitle: Cn(G.chromeStatusEntry)
			}]
		};
	}
	getKind() {
		return p.BREAKING_CHANGE;
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.partitioningBlobURLIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Partitioning BlobURL issue without details received."), []);
	}
}, Tn = class e extends m {
	#e;
	constructor(e, t) {
		let n = [s.InspectorIssueCode.PermissionElementIssue, e.issueType].join("::");
		super(n, e, t), this.#e = e;
	}
	getCategory() {
		return f.PERMISSION_ELEMENT;
	}
	getDescription() {
		let e = this.#e.issueType;
		switch (e) {
			case s.PermissionElementIssueType.InvalidType: return {
				file: "permissionElementInvalidType.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.FencedFrameDisallowed: return {
				file: "permissionElementFencedFrameDisallowed.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.CspFrameAncestorsMissing: return {
				file: "permissionElementCspFrameAncestorsMissing.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.PermissionsPolicyBlocked: return {
				file: "permissionElementPermissionsPolicyBlocked.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""], ["PLACEHOLDER_PermissionName", this.#e.permissionName || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.PaddingRightUnsupported: return {
				file: "permissionElementPaddingRightUnsupported.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.PaddingBottomUnsupported: return {
				file: "permissionElementPaddingBottomUnsupported.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.InsetBoxShadowUnsupported: return {
				file: "permissionElementInsetBoxShadowUnsupported.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.RequestInProgress: return {
				file: "permissionElementRequestInProgress.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.UntrustedEvent: return {
				file: "permissionElementUntrustedEvent.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.RegistrationFailed: return {
				file: "permissionElementRegistrationFailed.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.TypeNotSupported: return {
				file: "permissionElementTypeNotSupported.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.InvalidTypeActivation: return {
				file: "permissionElementInvalidTypeActivation.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.SecurityChecksFailed: return {
				file: "permissionElementSecurityChecksFailed.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.ActivationDisabled: return this.#e.occluderNodeInfo && this.#e.occluderParentNodeInfo ? {
				file: "permissionElementActivationDisabledWithOccluderParent.md",
				substitutions: /* @__PURE__ */ new Map([
					["PLACEHOLDER_DisableReason", this.#e.disableReason || ""],
					["PLACEHOLDER_OccluderInfo", this.#e.occluderNodeInfo || ""],
					["PLACEHOLDER_Type", this.#e.type || ""],
					["PLACEHOLDER_OccluderParentInfo", this.#e.occluderParentNodeInfo || ""]
				]),
				links: []
			} : this.#e.occluderNodeInfo ? {
				file: "permissionElementActivationDisabledWithOccluder.md",
				substitutions: /* @__PURE__ */ new Map([
					["PLACEHOLDER_DisableReason", this.#e.disableReason || ""],
					["PLACEHOLDER_OccluderInfo", this.#e.occluderNodeInfo || ""],
					["PLACEHOLDER_Type", this.#e.type || ""]
				]),
				links: []
			} : {
				file: "permissionElementActivationDisabled.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_DisableReason", this.#e.disableReason || ""], ["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.GeolocationDeprecated: return {
				file: "permissionElementGeolocationDeprecated.md",
				links: []
			};
			case s.PermissionElementIssueType.InvalidDisplayStyle: return {
				file: "permissionElementInvalidDisplayStyle.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.NonOpaqueColor: return {
				file: "permissionElementNonOpaqueColor.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.LowContrast: return {
				file: "permissionElementLowContrast.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.FontSizeTooSmall: return {
				file: "permissionElementFontSizeTooSmall.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.FontSizeTooLarge: return {
				file: "permissionElementFontSizeTooLarge.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			case s.PermissionElementIssueType.InvalidSizeValue: return {
				file: "permissionElementInvalidSizeValue.md",
				substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_Type", this.#e.type || ""]]),
				links: []
			};
			default: return console.warn("Unknown PermissionElementIssueType:", e), null;
		}
	}
	elements() {
		if (this.#e.nodeId) {
			let e = this.model()?.target();
			return [{
				backendNodeId: this.#e.nodeId,
				nodeName: this.#e.type || "Affected element",
				target: e || null
			}];
		}
		return [];
	}
	getKind() {
		return this.#e.isWarning ? p.IMPROVEMENT : p.PAGE_ERROR;
	}
	primaryKey() {
		return `${s.InspectorIssueCode.PermissionElementIssue}-${JSON.stringify(this.#e)}`;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.permissionElementIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Permission element issue without details received."), []);
	}
}, En = { documentCompatibilityMode: "Document compatibility mode" }, Dn = i("models/issues_manager/QuirksModeIssue.ts", En), On = r.bind(void 0, Dn), kn = class e extends m {
	constructor(e, t) {
		let n = e.isLimitedQuirksMode ? "LimitedQuirksMode" : "QuirksMode", r = [s.InspectorIssueCode.QuirksModeIssue, n].join("::");
		super({
			code: s.InspectorIssueCode.QuirksModeIssue,
			umaCode: r
		}, e, t);
	}
	primaryKey() {
		return `${this.code()}-(${this.details().documentNodeId})-(${this.details().url})`;
	}
	getCategory() {
		return f.QUIRKS_MODE;
	}
	getDescription() {
		return {
			file: "CompatibilityModeQuirks.md",
			links: [{
				link: "https://web.dev/doctype/",
				linkTitle: On(En.documentCompatibilityMode)
			}]
		};
	}
	getKind() {
		return p.IMPROVEMENT;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.quirksModeIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Quirks Mode issue without details received."), []);
	}
}, An = { selectivePermissionsIntervention: "Selective Permissions Intervention" }, jn = i("models/issues_manager/SelectivePermissionsInterventionIssue.ts", An), Mn = r.bind(void 0, jn), Nn = class e extends m {
	constructor(e, t) {
		super(s.InspectorIssueCode.SelectivePermissionsInterventionIssue, e, t);
	}
	primaryKey() {
		return `${s.InspectorIssueCode.SelectivePermissionsInterventionIssue}-${JSON.stringify(this.details())}`;
	}
	getDescription() {
		return {
			file: "selectivePermissionsIntervention.md",
			links: [{
				link: "https://crbug.com/435223477",
				linkTitle: Mn(An.selectivePermissionsIntervention)
			}]
		};
	}
	getCategory() {
		return f.SELECTIVE_PERMISSIONS_INTERVENTION;
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.selectivePermissionsInterventionIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Selective Permissions Intervention issue without details received."), []);
	}
}, Pn = { enablingSharedArrayBuffer: "Enabling `SharedArrayBuffer`" }, Fn = i("models/issues_manager/SharedArrayBufferIssue.ts", Pn), In = r.bind(void 0, Fn), Ln = class e extends m {
	constructor(e, t) {
		let n = [s.InspectorIssueCode.SharedArrayBufferIssue, e.type].join("::");
		super({
			code: s.InspectorIssueCode.SharedArrayBufferIssue,
			umaCode: n
		}, e, t);
	}
	getCategory() {
		return f.OTHER;
	}
	getDescription() {
		return {
			file: "sharedArrayBuffer.md",
			links: [{
				link: "https://developer.chrome.com/blog/enabling-shared-array-buffer/",
				linkTitle: In(Pn.enablingSharedArrayBuffer)
			}]
		};
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getKind() {
		return this.details().isWarning ? p.BREAKING_CHANGE : p.PAGE_ERROR;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.sharedArrayBufferIssueDetails;
		return r ? [new e(r, t)] : (console.warn("SAB transfer issue without details received."), []);
	}
}, Rn = class extends m {
	#e = /* @__PURE__ */ new Set();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = [];
	#i = /* @__PURE__ */ new Set();
	#a = /* @__PURE__ */ new Map();
	#o = /* @__PURE__ */ new Set();
	#s = /* @__PURE__ */ new Map();
	#c = /* @__PURE__ */ new Set();
	#l = /* @__PURE__ */ new Set();
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = p.IMPROVEMENT;
	#p = /* @__PURE__ */ new Set();
	#m = /* @__PURE__ */ new Set();
	#h = /* @__PURE__ */ new Set();
	#g = /* @__PURE__ */ new Set();
	#_ = /* @__PURE__ */ new Set();
	#v = /* @__PURE__ */ new Set();
	#y = /* @__PURE__ */ new Set();
	#b = /* @__PURE__ */ new Set();
	#x = /* @__PURE__ */ new Set();
	#S = /* @__PURE__ */ new Set();
	#C;
	#w = 0;
	#T;
	constructor(e, t) {
		super(e, null), this.#T = t;
	}
	primaryKey() {
		throw Error("This should never be called");
	}
	aggregationKey() {
		return this.#T;
	}
	getBlockedByResponseDetails() {
		return this.#s.values();
	}
	cookies() {
		return Array.from(this.#t.values()).map((e) => e.cookie);
	}
	getRawCookieLines() {
		return this.#n.values();
	}
	sources() {
		return this.#a.values();
	}
	getBounceTrackingSites() {
		return this.#c.values();
	}
	cookiesWithRequestIndicator() {
		return this.#t.values();
	}
	getHeavyAdIssues() {
		return this.#o;
	}
	getCookieDeprecationMetadataIssues() {
		return this.#p;
	}
	getMixedContentIssues() {
		return this.#m;
	}
	getCorsIssues() {
		return this.#l;
	}
	getCspIssues() {
		return this.#u;
	}
	getDeprecationIssues() {
		return this.#d;
	}
	requests() {
		return this.#r.values();
	}
	getSelectivePermissionsInterventionIssues() {
		return this.#_;
	}
	getSharedArrayBufferIssues() {
		return this.#v;
	}
	getQuirksModeIssues() {
		return this.#y;
	}
	getAttributionReportingIssues() {
		return this.#b;
	}
	getGenericIssues() {
		return this.#x;
	}
	getElementAccessibilityIssues() {
		return this.#S;
	}
	getDescription() {
		return this.#C ? this.#C.getDescription() : null;
	}
	getCategory() {
		return this.#C ? this.#C.getCategory() : f.OTHER;
	}
	getAggregatedIssuesCount() {
		return this.#w;
	}
	getPartitioningBlobURLIssues() {
		return this.#h;
	}
	getPermissionElementIssues() {
		return this.#g;
	}
	#E(e) {
		let { domain: t, path: n, name: r } = e;
		return `${t};${n};${r}`;
	}
	addInstance(e) {
		this.#w++, this.#C ||= e, this.#e.add(e), this.#f = Ee(this.#f, e.getKind());
		let t = !1;
		for (let n of e.requests()) {
			let { requestId: e } = n;
			t = !0, e === void 0 ? this.#r.push(n) : this.#i.has(e) || (this.#r.push(n), this.#i.add(e));
		}
		for (let n of e.cookies()) {
			let e = this.#E(n);
			this.#t.has(e) || this.#t.set(e, {
				cookie: n,
				hasRequest: t
			});
		}
		for (let n of e.rawCookieLines()) this.#n.has(n) || this.#n.set(n, {
			rawCookieLine: n,
			hasRequest: t
		});
		for (let t of e.trackingSites()) this.#c.has(t) || this.#c.add(t);
		for (let t of e.sources()) {
			let e = JSON.stringify(t);
			this.#a.has(e) || this.#a.set(e, t);
		}
		e instanceof lt && this.#p.add(e), e instanceof xn && this.#m.add(e), e instanceof _n && this.#o.add(e);
		for (let t of e.getBlockedByResponseDetails()) {
			let e = JSON.stringify(t, [
				"parentFrame",
				"blockedFrame",
				"requestId",
				"frameId",
				"reason",
				"request"
			]);
			this.#s.set(e, t);
		}
		e instanceof S && this.#u.add(e), e instanceof Gt && this.#d.add(e), e instanceof Ln && this.#v.add(e), e instanceof It && this.#l.add(e), e instanceof kn && this.#y.add(e), e instanceof je && this.#b.add(e), e instanceof U && this.#x.add(e), e instanceof I && this.#S.add(e), e instanceof wn && this.#h.add(e), e instanceof Tn && this.#g.add(e), e instanceof Nn && this.#_.add(e);
	}
	getKind() {
		return this.#f;
	}
	getAllIssues() {
		return Array.from(this.#e);
	}
	isHidden() {
		return this.#C?.isHidden() || !1;
	}
	setHidden(e) {
		throw Error("Should not call setHidden on aggregatedIssue");
	}
}, zn = class extends a {
	issuesManager;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	constructor(e) {
		super(), this.issuesManager = e, this.issuesManager.addEventListener(W.ISSUE_ADDED, this.#n, this), this.issuesManager.addEventListener(W.FULL_UPDATE_REQUIRED, this.#r, this);
		for (let e of this.issuesManager.issues()) this.#i(e);
	}
	#n(e) {
		this.#i(e.data.issue);
	}
	#r() {
		this.#e.clear(), this.#t.clear();
		for (let e of this.issuesManager.issues()) this.#i(e);
		this.dispatchEventToListeners("FullUpdateRequired");
	}
	#i(e) {
		if (T.isThirdPartyCookiePhaseoutRelatedIssue(e)) return;
		let t = e.isHidden() ? this.#t : this.#e, n = this.#a(t, e);
		return this.dispatchEventToListeners("AggregatedIssueUpdated", n), n;
	}
	#a(e, t) {
		let n = t.code(), r = e.get(n);
		return r || (r = new Rn(t.code(), n), e.set(n, r)), r.addInstance(t), r;
	}
	aggregatedIssues() {
		return [...this.#e.values(), ...this.#t.values()];
	}
	aggregatedIssueCodes() {
		return /* @__PURE__ */ new Set([...this.#e.keys(), ...this.#t.keys()]);
	}
	aggregatedIssueCategories() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.#e.values()) e.add(t.getCategory());
		return e;
	}
	aggregatedIssueKinds() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.#e.values()) e.add(t.getKind());
		return e;
	}
	numberOfAggregatedIssues() {
		return this.#e.size;
	}
	numberOfHiddenAggregatedIssues() {
		return this.#t.size;
	}
	keyForIssue(e) {
		return e.code();
	}
}, Bn = /* @__PURE__ */ function(e) {
	return e.AGGREGATED_ISSUE_UPDATED = "AggregatedIssueUpdated", e.FULL_UPDATE_REQUIRED = "FullUpdateRequired", e;
}({}), Vn = { bounceTrackingMitigations: "Bounce tracking mitigations" }, Hn = i("models/issues_manager/BounceTrackingIssue.ts", Vn), Un = r.bind(void 0, Hn), Wn = class e extends m {
	constructor(e, t) {
		super(s.InspectorIssueCode.BounceTrackingIssue, e, t);
	}
	getCategory() {
		return f.OTHER;
	}
	getDescription() {
		return {
			file: "bounceTrackingMitigations.md",
			links: [{
				link: "https://privacycg.github.io/nav-tracking-mitigations/#bounce-tracking-mitigations",
				linkTitle: Un(Vn.bounceTrackingMitigations)
			}]
		};
	}
	getKind() {
		return p.BREAKING_CHANGE;
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	trackingSites() {
		return this.details().trackingSites;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.bounceTrackingIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Bounce tracking issue without details received."), []);
	}
}, K = { fedCm: "Federated Credential Management API" }, Gn = i("models/issues_manager/FederatedAuthRequestIssue.ts", K), q = e.bind(void 0, Gn), Kn = class e extends m {
	constructor(e, t) {
		super({
			code: s.InspectorIssueCode.FederatedAuthRequestIssue,
			umaCode: [s.InspectorIssueCode.FederatedAuthRequestIssue, e.federatedAuthRequestIssueReason].join("::")
		}, e, t);
	}
	getCategory() {
		return f.OTHER;
	}
	getDescription() {
		let e = qn.get(this.details().federatedAuthRequestIssueReason);
		return e ? g(e) : null;
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.federatedAuthRequestIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Federated auth request issue without details received."), []);
	}
}, qn = /* @__PURE__ */ new Map([
	[s.FederatedAuthRequestIssueReason.TooManyRequests, {
		file: "federatedAuthRequestTooManyRequests.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.ConfigHttpNotFound, {
		file: "federatedAuthRequestManifestHttpNotFound.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.ConfigNoResponse, {
		file: "federatedAuthRequestManifestNoResponse.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.ConfigInvalidResponse, {
		file: "federatedAuthRequestManifestInvalidResponse.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.ErrorFetchingSignin, {
		file: "federatedAuthRequestErrorFetchingSignin.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.InvalidSigninResponse, {
		file: "federatedAuthRequestInvalidSigninResponse.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.AccountsHttpNotFound, {
		file: "federatedAuthRequestAccountsHttpNotFound.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.AccountsNoResponse, {
		file: "federatedAuthRequestAccountsNoResponse.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.AccountsInvalidResponse, {
		file: "federatedAuthRequestAccountsInvalidResponse.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.IdTokenHttpNotFound, {
		file: "federatedAuthRequestIdTokenHttpNotFound.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.IdTokenNoResponse, {
		file: "federatedAuthRequestIdTokenNoResponse.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.IdTokenInvalidResponse, {
		file: "federatedAuthRequestIdTokenInvalidResponse.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.IdTokenInvalidRequest, {
		file: "federatedAuthRequestIdTokenInvalidRequest.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.ErrorIdToken, {
		file: "federatedAuthRequestErrorIdToken.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}],
	[s.FederatedAuthRequestIssueReason.Canceled, {
		file: "federatedAuthRequestCanceled.md",
		links: [{
			link: "https://fedidcg.github.io/FedCM/",
			linkTitle: q(K.fedCm)
		}]
	}]
]), Jn = class e extends m {
	#e;
	constructor(e, t) {
		let n = JSON.stringify(e);
		super(n, e, t), this.#e = n;
	}
	sources() {
		return [this.details().sourceCodeLocation];
	}
	primaryKey() {
		return this.#e;
	}
	getPropertyName() {
		switch (this.details().propertyRuleIssueReason) {
			case s.PropertyRuleIssueReason.InvalidInherits: return "inherits";
			case s.PropertyRuleIssueReason.InvalidInitialValue: return "initial-value";
			case s.PropertyRuleIssueReason.InvalidSyntax: return "syntax";
		}
		return "";
	}
	getDescription() {
		if (this.details().propertyRuleIssueReason === s.PropertyRuleIssueReason.InvalidName) return {
			file: "propertyRuleInvalidNameIssue.md",
			links: []
		};
		let e = this.details().propertyValue ? `: ${this.details().propertyValue}` : "", t = `${this.getPropertyName()}${e}`;
		return {
			file: "propertyRuleIssue.md",
			substitutions: /* @__PURE__ */ new Map([["PLACEHOLDER_property", t]]),
			links: []
		};
	}
	getCategory() {
		return f.OTHER;
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.propertyRuleIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Property rule issue without details received"), []);
	}
}, Yn = { compressionDictionaryTransport: "Compression Dictionary Transport" }, Xn = i("models/issues_manager/SharedDictionaryIssue.ts", Yn), Zn = e.bind(void 0, Xn);
function Qn(e) {
	switch (e.sharedDictionaryError) {
		case s.SharedDictionaryError.UseErrorCrossOriginNoCorsRequest: return "SharedDictionaryIssue::UseErrorCrossOriginNoCorsRequest";
		case s.SharedDictionaryError.UseErrorDictionaryLoadFailure: return "SharedDictionaryIssue::UseErrorDictionaryLoadFailure";
		case s.SharedDictionaryError.UseErrorMatchingDictionaryNotUsed: return "SharedDictionaryIssue::UseErrorMatchingDictionaryNotUsed";
		case s.SharedDictionaryError.UseErrorUnexpectedContentDictionaryHeader: return "SharedDictionaryIssue::UseErrorUnexpectedContentDictionaryHeader";
		case s.SharedDictionaryError.WriteErrorCossOriginNoCorsRequest: return "SharedDictionaryIssue::WriteErrorCossOriginNoCorsRequest";
		case s.SharedDictionaryError.WriteErrorDisallowedBySettings: return "SharedDictionaryIssue::WriteErrorDisallowedBySettings";
		case s.SharedDictionaryError.WriteErrorExpiredResponse: return "SharedDictionaryIssue::WriteErrorExpiredResponse";
		case s.SharedDictionaryError.WriteErrorFeatureDisabled: return "SharedDictionaryIssue::WriteErrorFeatureDisabled";
		case s.SharedDictionaryError.WriteErrorInsufficientResources: return "SharedDictionaryIssue::WriteErrorInsufficientResources";
		case s.SharedDictionaryError.WriteErrorInvalidMatchField: return "SharedDictionaryIssue::WriteErrorInvalidMatchField";
		case s.SharedDictionaryError.WriteErrorInvalidStructuredHeader: return "SharedDictionaryIssue::WriteErrorInvalidStructuredHeader";
		case s.SharedDictionaryError.WriteErrorInvalidTTLField: return "SharedDictionaryIssue::WriteErrorInvalidTTLField";
		case s.SharedDictionaryError.WriteErrorNavigationRequest: return "SharedDictionaryIssue::WriteErrorNavigationRequest";
		case s.SharedDictionaryError.WriteErrorNoMatchField: return "SharedDictionaryIssue::WriteErrorNoMatchField";
		case s.SharedDictionaryError.WriteErrorNonIntegerTTLField: return "SharedDictionaryIssue::WriteErrorNonIntegerTTLField";
		case s.SharedDictionaryError.WriteErrorNonListMatchDestField: return "SharedDictionaryIssue::WriteErrorNonListMatchDestField";
		case s.SharedDictionaryError.WriteErrorNonSecureContext: return "SharedDictionaryIssue::WriteErrorNonSecureContext";
		case s.SharedDictionaryError.WriteErrorNonStringIdField: return "SharedDictionaryIssue::WriteErrorNonStringIdField";
		case s.SharedDictionaryError.WriteErrorNonStringInMatchDestList: return "SharedDictionaryIssue::WriteErrorNonStringInMatchDestList";
		case s.SharedDictionaryError.WriteErrorNonStringMatchField: return "SharedDictionaryIssue::WriteErrorNonStringMatchField";
		case s.SharedDictionaryError.WriteErrorNonTokenTypeField: return "SharedDictionaryIssue::WriteErrorNonTokenTypeField";
		case s.SharedDictionaryError.WriteErrorRequestAborted: return "SharedDictionaryIssue::WriteErrorRequestAborted";
		case s.SharedDictionaryError.WriteErrorShuttingDown: return "SharedDictionaryIssue::WriteErrorShuttingDown";
		case s.SharedDictionaryError.WriteErrorTooLongIdField: return "SharedDictionaryIssue::WriteErrorTooLongIdField";
		case s.SharedDictionaryError.WriteErrorUnsupportedType: return "SharedDictionaryIssue::WriteErrorUnsupportedType";
		default: return "SharedDictionaryIssue::WriteErrorUnknown";
	}
}
var $n = class e extends m {
	constructor(e, t) {
		super({
			code: Qn(e),
			umaCode: [s.InspectorIssueCode.SharedDictionaryIssue, e.sharedDictionaryError].join("::")
		}, e, t);
	}
	requests() {
		return this.details().request ? [this.details().request] : [];
	}
	getCategory() {
		return f.OTHER;
	}
	getDescription() {
		let e = er.get(this.details().sharedDictionaryError);
		return e ? g(e) : null;
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.sharedDictionaryIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Shared Dictionary issue without details received."), []);
	}
}, J = [{
	link: "https://datatracker.ietf.org/doc/draft-ietf-httpbis-compression-dictionary/",
	linkTitle: Zn(Yn.compressionDictionaryTransport)
}], er = /* @__PURE__ */ new Map([
	[s.SharedDictionaryError.UseErrorCrossOriginNoCorsRequest, {
		file: "sharedDictionaryUseErrorCrossOriginNoCorsRequest.md",
		links: J
	}],
	[s.SharedDictionaryError.UseErrorDictionaryLoadFailure, {
		file: "sharedDictionaryUseErrorDictionaryLoadFailure.md",
		links: J
	}],
	[s.SharedDictionaryError.UseErrorMatchingDictionaryNotUsed, {
		file: "sharedDictionaryUseErrorMatchingDictionaryNotUsed.md",
		links: J
	}],
	[s.SharedDictionaryError.UseErrorUnexpectedContentDictionaryHeader, {
		file: "sharedDictionaryUseErrorUnexpectedContentDictionaryHeader.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorCossOriginNoCorsRequest, {
		file: "sharedDictionaryWriteErrorCossOriginNoCorsRequest.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorDisallowedBySettings, {
		file: "sharedDictionaryWriteErrorDisallowedBySettings.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorExpiredResponse, {
		file: "sharedDictionaryWriteErrorExpiredResponse.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorFeatureDisabled, {
		file: "sharedDictionaryWriteErrorFeatureDisabled.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorInsufficientResources, {
		file: "sharedDictionaryWriteErrorInsufficientResources.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorInvalidMatchField, {
		file: "sharedDictionaryWriteErrorInvalidMatchField.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorInvalidStructuredHeader, {
		file: "sharedDictionaryWriteErrorInvalidStructuredHeader.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorInvalidTTLField, {
		file: "sharedDictionaryWriteErrorInvalidTTLField.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorNavigationRequest, {
		file: "sharedDictionaryWriteErrorNavigationRequest.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorNoMatchField, {
		file: "sharedDictionaryWriteErrorNoMatchField.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorNonIntegerTTLField, {
		file: "sharedDictionaryWriteErrorNonIntegerTTLField.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorNonListMatchDestField, {
		file: "sharedDictionaryWriteErrorNonListMatchDestField.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorNonSecureContext, {
		file: "sharedDictionaryWriteErrorNonSecureContext.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorNonStringIdField, {
		file: "sharedDictionaryWriteErrorNonStringIdField.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorNonStringInMatchDestList, {
		file: "sharedDictionaryWriteErrorNonStringInMatchDestList.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorNonStringMatchField, {
		file: "sharedDictionaryWriteErrorNonStringMatchField.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorNonTokenTypeField, {
		file: "sharedDictionaryWriteErrorNonTokenTypeField.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorRequestAborted, {
		file: "sharedDictionaryWriteErrorRequestAborted.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorShuttingDown, {
		file: "sharedDictionaryWriteErrorShuttingDown.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorTooLongIdField, {
		file: "sharedDictionaryWriteErrorTooLongIdField.md",
		links: J
	}],
	[s.SharedDictionaryError.WriteErrorUnsupportedType, {
		file: "sharedDictionaryWriteErrorUnsupportedType.md",
		links: J
	}]
]), tr = [s.InspectorIssueCode.StylesheetLoadingIssue, s.StyleSheetLoadingIssueReason.LateImportRule].join("::"), nr = class e extends m {
	constructor(e, t) {
		let n = `${s.InspectorIssueCode.StylesheetLoadingIssue}::${e.styleSheetLoadingIssueReason}`;
		super(n, e, t);
	}
	sources() {
		return [this.details().sourceCodeLocation];
	}
	requests() {
		let e = this.details();
		if (!e.failedRequestInfo) return [];
		let { url: t, requestId: n } = e.failedRequestInfo;
		return n ? [{
			url: t,
			requestId: n
		}] : [];
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getDescription() {
		switch (this.details().styleSheetLoadingIssueReason) {
			case s.StyleSheetLoadingIssueReason.LateImportRule: return {
				file: "stylesheetLateImport.md",
				links: []
			};
			case s.StyleSheetLoadingIssueReason.RequestFailed: return {
				file: "stylesheetRequestFailed.md",
				links: []
			};
		}
	}
	getCategory() {
		return f.OTHER;
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.stylesheetLoadingIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Stylesheet loading issue without details received"), []);
	}
}, rr = class {
	issuesManager;
	#e = new be();
	constructor(e) {
		this.issuesManager = e, this.issuesManager.addEventListener(W.ISSUE_ADDED, this.#t, this), this.issuesManager.addEventListener(W.FULL_UPDATE_REQUIRED, this.#r, this);
	}
	#t(e) {
		let { issue: t } = e.data;
		this.#n(t);
	}
	async #n(e) {
		if (!this.#i(e) && !this.#o(e) && !this.#a(e)) return;
		let t = e.model();
		if (!t) return;
		let r = Oe(e.details().sourceCodeLocation), i = e.getDescription();
		if (!i || !r) return;
		let a = await v(i);
		a && this.#e.addMessage(new ir(a, e.getKind(), () => {
			n(e);
		}), {
			line: r.lineNumber,
			column: r.columnNumber ?? -1,
			url: r.url,
			scriptId: r.scriptId
		}, t.target());
	}
	#r() {
		this.#s();
		let e = this.issuesManager.issues();
		for (let t of e) this.#n(t);
	}
	#i(e) {
		return e instanceof S && e.code() === rt || e.code() === it;
	}
	#a(e) {
		return e instanceof Jn;
	}
	#o(e) {
		return e.code() === tr;
	}
	#s() {
		this.#e.clear();
	}
}, ir = class extends ye {
	#e;
	constructor(e, t, n) {
		super(ye.Level.ISSUE, e, n), this.#e = t;
	}
	getIssueKind() {
		return this.#e;
	}
}, Y = {
	httpMessageSignatures: "HTTP Message Signatures (RFC9421)",
	signatureBasedIntegrity: "Signature-based Integrity"
}, ar = i("models/issues_manager/SRIMessageSignatureIssue.ts", Y), or = e.bind(void 0, ar);
function sr(e) {
	let t = `${s.InspectorIssueCode.SRIMessageSignatureIssue}::${e.error}`;
	return e.error === s.SRIMessageSignatureError.ValidationFailedSignatureMismatch ? t + e.signatureBase : e.error === s.SRIMessageSignatureError.ValidationFailedIntegrityMismatch ? t + e.integrityAssertions.join() : t;
}
var cr = class e extends m {
	constructor(e, t) {
		super({
			code: sr(e),
			umaCode: `${s.InspectorIssueCode.SRIMessageSignatureIssue}::${e.error}`
		}, e, t);
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getDescription() {
		let e = this.details(), t = {
			file: `sri${e.error}.md`,
			links: [{
				link: "https://www.rfc-editor.org/rfc/rfc9421.html",
				linkTitle: or(Y.httpMessageSignatures)
			}, {
				link: "https://wicg.github.io/signature-based-sri/",
				linkTitle: or(Y.signatureBasedIntegrity)
			}],
			substitutions: /* @__PURE__ */ new Map()
		};
		return e.error === s.SRIMessageSignatureError.ValidationFailedSignatureMismatch && t.substitutions?.set("PLACEHOLDER_signatureBase", () => e.signatureBase), e.error === s.SRIMessageSignatureError.ValidationFailedIntegrityMismatch && t.substitutions?.set("PLACEHOLDER_integrityAssertions", () => "\n* " + this.details().integrityAssertions.join("\n* ")), g(t);
	}
	getCategory() {
		return f.OTHER;
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	requests() {
		return this.details().request ? [this.details().request] : [];
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.sriMessageSignatureIssueDetails;
		return r ? [new e(r, t)] : (console.warn("SRI Message Signature issue without details received."), []);
	}
}, X = {
	unencodedDigestHeader: "HTTP Unencoded Digest specification",
	integrityIntegration: "Server-Initiated Integrity Checks"
}, lr = i("models/issues_manager/UnencodedDigestIssue.ts", X), ur = e.bind(void 0, lr), dr = class e extends m {
	constructor(e, t) {
		super({
			code: `${s.InspectorIssueCode.UnencodedDigestIssue}::${e.error}`,
			umaCode: `${s.InspectorIssueCode.UnencodedDigestIssue}::${e.error}`
		}, e, t);
	}
	primaryKey() {
		return JSON.stringify(this.details());
	}
	getDescription() {
		return g({
			file: `unencodedDigest${this.details().error}.md`,
			links: [{
				link: "https://www.ietf.org/archive/id/draft-ietf-httpbis-unencoded-digest-01.html",
				linkTitle: ur(X.unencodedDigestHeader)
			}, {
				link: "https://wicg.github.io/signature-based-sri/#unencoded-digest-validation",
				linkTitle: ur(X.integrityIntegration)
			}]
		});
	}
	getCategory() {
		return f.OTHER;
	}
	getKind() {
		return p.PAGE_ERROR;
	}
	requests() {
		return this.details().request ? [this.details().request] : [];
	}
	static fromInspectorIssue(t, n) {
		let r = n.details.unencodedDigestIssueDetails;
		return r ? [new e(r, t)] : (console.warn("Unencoded-Digest issue without details received."), []);
	}
}, Z = null;
function fr(e, t) {
	let n = t.details.blockedByResponseIssueDetails;
	return n ? Rt(n.reason) ? [new zt(n, e)] : [] : (console.warn("BlockedByResponse issue without details received."), []);
}
var pr = /* @__PURE__ */ new Map([
	[s.InspectorIssueCode.CookieIssue, T.fromInspectorIssue],
	[s.InspectorIssueCode.MixedContentIssue, xn.fromInspectorIssue],
	[s.InspectorIssueCode.HeavyAdIssue, _n.fromInspectorIssue],
	[s.InspectorIssueCode.ContentSecurityPolicyIssue, S.fromInspectorIssue],
	[s.InspectorIssueCode.BlockedByResponseIssue, fr],
	[s.InspectorIssueCode.SharedArrayBufferIssue, Ln.fromInspectorIssue],
	[s.InspectorIssueCode.SharedDictionaryIssue, $n.fromInspectorIssue],
	[s.InspectorIssueCode.CorsIssue, It.fromInspectorIssue],
	[s.InspectorIssueCode.QuirksModeIssue, kn.fromInspectorIssue],
	[s.InspectorIssueCode.AttributionReportingIssue, je.fromInspectorIssue],
	[s.InspectorIssueCode.GenericIssue, U.fromInspectorIssue],
	[s.InspectorIssueCode.DeprecationIssue, Gt.fromInspectorIssue],
	[s.InspectorIssueCode.ClientHintIssue, He.fromInspectorIssue],
	[s.InspectorIssueCode.EmailVerificationRequestIssue, Jt.fromInspectorIssue],
	[s.InspectorIssueCode.FederatedAuthRequestIssue, Kn.fromInspectorIssue],
	[s.InspectorIssueCode.BounceTrackingIssue, Wn.fromInspectorIssue],
	[s.InspectorIssueCode.StylesheetLoadingIssue, nr.fromInspectorIssue],
	[s.InspectorIssueCode.PartitioningBlobURLIssue, wn.fromInspectorIssue],
	[s.InspectorIssueCode.PropertyRuleIssue, Jn.fromInspectorIssue],
	[s.InspectorIssueCode.CookieDeprecationMetadataIssue, lt.fromInspectorIssue],
	[s.InspectorIssueCode.ElementAccessibilityIssue, I.fromInspectorIssue],
	[s.InspectorIssueCode.SRIMessageSignatureIssue, cr.fromInspectorIssue],
	[s.InspectorIssueCode.UnencodedDigestIssue, dr.fromInspectorIssue],
	[s.InspectorIssueCode.ConnectionAllowlistIssue, qe.fromInspectorIssue],
	[s.InspectorIssueCode.PermissionElementIssue, Tn.fromInspectorIssue],
	[s.InspectorIssueCode.SelectivePermissionsInterventionIssue, Nn.fromInspectorIssue]
]);
function mr(e, t) {
	let n = pr.get(t.code);
	return n ? n(e, t) : (console.warn(`No handler registered for issue code ${t.code}`), []);
}
var hr = /* @__PURE__ */ function(e) {
	return e.HIDDEN = "Hidden", e.UNHIDDEN = "Unhidden", e;
}({});
function gr() {
	return {};
}
function _r() {
	return te.instance().createSetting("hide-issue-by-code-setting-experiment-2021", gr());
}
var Q = class e extends a {
	showThirdPartyIssuesSetting;
	hideIssueSetting;
	#e = /* @__PURE__ */ new WeakMap();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Map();
	#i = /* @__PURE__ */ new Map();
	#a = /* @__PURE__ */ new Map();
	#o = /* @__PURE__ */ new Map();
	#s = /* @__PURE__ */ new Map();
	constructor(e, t) {
		super(), this.showThirdPartyIssuesSetting = e, this.hideIssueSetting = t, new rr(this), l.instance().observeModels(he, this), l.instance().addModelListener(ue, ie.PrimaryPageChanged, this.#c, this), oe.instance().addEventListener(se.FRAME_ADDED_TO_TARGET, this.#l, this), this.showThirdPartyIssuesSetting?.addChangeListener(() => this.#p()), this.hideIssueSetting?.addChangeListener(() => this.#p()), l.instance().observeTargets({
			targetAdded: (e) => {
				e.outermostTarget() === e && this.#p();
			},
			targetRemoved: (e) => {}
		}, { scoped: !0 });
	}
	static instance(t = {
		forceNew: !1,
		ensureFirst: !1
	}) {
		if (Z && t.ensureFirst) throw Error("IssuesManager was already created. Either set \"ensureFirst\" to false or make sure that this invocation is really the first one.");
		return (!Z || t.forceNew) && (Z = new e(t.showThirdPartyIssuesSetting, t.hideIssueSetting)), Z;
	}
	static removeInstance() {
		Z = null;
	}
	#c(e) {
		let { frame: t, type: n } = e.data, r = /* @__PURE__ */ new Map();
		for (let [e, i] of this.#t.entries()) (i.isAssociatedWithRequestId(t.loaderId) || n === de.ACTIVATION && t.resourceTreeModel().target() === i.model()?.target() || (i.code() === s.InspectorIssueCode.BounceTrackingIssue || i.code() === s.InspectorIssueCode.CookieIssue) && t.resourceTreeModel().target().model(_e)?.requestForLoaderId(t.loaderId)?.hasUserGesture() === !1) && r.set(e, i);
		this.#t = r, this.#p();
	}
	#l(e) {
		let { frame: t } = e.data;
		t.isOutermostFrame() && l.instance().isInScope(t.resourceTreeModel()) && this.#p();
	}
	modelAdded(e) {
		let t = e.addEventListener(ve.ISSUE_ADDED, this.#u, this);
		this.#e.set(e, t);
	}
	modelRemoved(e) {
		let t = this.#e.get(e);
		t && me([t]);
	}
	#u(e) {
		let { issuesModel: t, inspectorIssue: n } = e.data, r = mr(t, n);
		for (let e of r) {
			this.addIssue(t, e);
			let n = e.maybeCreateConsoleMessage();
			n && t.target().model(pe)?.addMessage(n);
		}
	}
	addIssue(e, t) {
		if (!t.getDescription()) return;
		let n = t.primaryKey();
		if (this.#t.has(n)) return;
		this.#t.set(n, t);
		let r = e.target().outermostTarget();
		if (r) {
			let e = this.#s.get(r);
			e || (e = /* @__PURE__ */ new Set(), this.#s.set(r, e)), e.add(t);
		}
		if (this.#d(t)) {
			this.#n.set(n, t), this.#r.set(t.getKind(), 1 + (this.#r.get(t.getKind()) || 0));
			let r = t.getIssueId();
			r && this.#o.set(r, t);
			let i = this.hideIssueSetting?.get();
			this.#f(t, i), T.isThirdPartyCookiePhaseoutRelatedIssue(t) ? this.#a.set(t.getKind(), 1 + (this.#a.get(t.getKind()) || 0)) : t.isHidden() && this.#i.set(t.getKind(), 1 + (this.#i.get(t.getKind()) || 0)), this.dispatchEventToListeners(W.ISSUE_ADDED, {
				issuesModel: e,
				issue: t
			});
		}
		this.dispatchEventToListeners(W.ISSUES_COUNT_UPDATED);
	}
	issues() {
		return this.#n.values();
	}
	numberOfIssues(e) {
		return e ? (this.#r.get(e) ?? 0) - this.numberOfHiddenIssues(e) - this.numberOfThirdPartyCookiePhaseoutIssues(e) : this.#n.size - this.numberOfHiddenIssues() - this.numberOfThirdPartyCookiePhaseoutIssues();
	}
	numberOfHiddenIssues(e) {
		if (e) return this.#i.get(e) ?? 0;
		let t = 0;
		for (let e of this.#i.values()) t += e;
		return t;
	}
	numberOfThirdPartyCookiePhaseoutIssues(e) {
		if (e) return this.#a.get(e) ?? 0;
		let t = 0;
		for (let e of this.#a.values()) t += e;
		return t;
	}
	numberOfAllStoredIssues() {
		return this.#t.size;
	}
	#d(e) {
		let t = l.instance().scopeTarget();
		return !t || !this.#s.get(t)?.has(e) ? !1 : this.showThirdPartyIssuesSetting?.get() || !e.isCausedByThirdParty();
	}
	#f(e, t) {
		let n = e.code();
		if (t?.[n]) {
			let r = t[n] === "Hidden";
			e.isHidden() !== r && (e.setHidden(r), this.dispatchEventToListeners(W.ISSUE_HIDDEN_STATUS_UPDATED, { issue: e }));
		}
	}
	#p() {
		this.#n.clear(), this.#r.clear(), this.#o.clear(), this.#i.clear(), this.#a.clear();
		let e = this.hideIssueSetting?.get();
		for (let [t, n] of this.#t) if (this.#d(n)) {
			this.#f(n, e), this.#n.set(t, n), this.#r.set(n.getKind(), 1 + (this.#r.get(n.getKind()) ?? 0)), n.isHidden() && this.#i.set(n.getKind(), 1 + (this.#i.get(n.getKind()) || 0));
			let r = n.getIssueId();
			r && this.#o.set(r, n);
		}
		this.dispatchEventToListeners(W.FULL_UPDATE_REQUIRED), this.dispatchEventToListeners(W.ISSUES_COUNT_UPDATED);
	}
	unhideAllIssues() {
		for (let e of this.#t.values()) e.isHidden() && (e.setHidden(!1), this.dispatchEventToListeners(W.ISSUE_HIDDEN_STATUS_UPDATED, { issue: e }));
		this.hideIssueSetting?.set(gr());
	}
	getIssueById(e) {
		return this.#o.get(e);
	}
};
globalThis.addIssueForTest = (e) => {
	(l.instance().primaryPageTarget()?.model(he))?.issueAdded({ issue: e });
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/issues_manager/IssueResolver.ts
var vr = class extends xe {
	#e = null;
	#t;
	constructor(e = Q.instance()) {
		super(), this.#t = e;
	}
	getForId(e) {
		return this.#t.getIssueById(e) || null;
	}
	#n(e) {
		let { issue: t } = e.data, n = t.getIssueId();
		n && this.onResolve(n, t);
	}
	startListening() {
		this.#e ||= this.#t.addEventListener(W.ISSUE_ADDED, this.#n, this);
	}
	stopListening() {
		this.#e &&= (me([this.#e]), null);
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/issues_manager/RelatedIssue.ts
function yr(e, t) {
	return e.filter((e) => {
		for (let n of e.requests()) if (n.requestId === t.requestId()) return !0;
		return !1;
	});
}
function br(e, t, n, r) {
	return e.filter((e) => {
		for (let i of e.cookies()) if (i.domain === t && i.name === n && i.path === r) return !0;
		return !1;
	});
}
function $(e, t) {
	if (t instanceof le) return yr(e, t);
	if (t instanceof ce) return br(e, t.domain(), t.name(), t.path());
	throw Error(`issues can not be associated with ${JSON.stringify(t)}`);
}
function xr(e) {
	return $(Array.from(Q.instance().issues()), e).length > 0;
}
function Sr(e, t) {
	return $(Array.from(Q.instance().issues()), e).some((e) => e.getCategory() === t);
}
async function Cr(e, t) {
	if (typeof e == "string") {
		let t = Q.instance().getIssueById(e);
		if (t) return await n(t);
	}
	let r = $(Array.from(Q.instance().issues()), e).filter((e) => !t || e.getCategory() === t);
	if (r.length > 0) return await n(r[0]);
}
//#endregion
export { Oe as A, ke as C, Te as D, p as E, we as O, v as S, f as T, tt as _, hr as a, et as b, ir as c, W as d, U as f, nt as g, T as h, vr as i, De as k, Bn as l, Pt as m, xr as n, Q as o, I as p, Cr as r, _r as s, Sr as t, zn as u, it as v, m as w, Pe as x, rt as y };
