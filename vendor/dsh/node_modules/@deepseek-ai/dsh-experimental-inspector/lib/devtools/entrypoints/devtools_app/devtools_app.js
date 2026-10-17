import "../../chunks/dom_extension-BLny9Waw.js";
import { B as e, E as t, H as ee, K as n, T as r, U as i, V as te, X as ne, c as a, d as re, f as o, n as ie, r as s, s as c, x as ae, z as oe } from "../../chunks/common-DMSVbaSb.js";
import { Af as se, Bi as ce, Br as l, Cr as le, E as ue, Er as de, Fr as u, Hc as fe, Hl as pe, Hn as me, Mr as he, Nr as ge, Oc as _e, Or as ve, Pi as ye, Pr as d, Qc as be, Ri as xe, Rr as Se, Sp as Ce, Tr as we, Ul as Te, Wl as Ee, Xc as De, Xl as Oe, Yf as ke, _c as Ae, al as je, ca as f, cc as Me, da as p, fr as m, gl as Ne, ia as h, jr as Pe, ld as Fe, nl as Ie, nr as g, oa as _, oc as Le, pa as Re, pl as ze, pu as Be, sa as v, sc as Ve, ta as He, ua as Ue, wr as y, xr as b, zr as We } from "../../chunks/legacy-dM_vujv7.js";
import { a as Ge, c as Ke, d as qe, o as Je, p as Ye, t as Xe } from "../../chunks/root-DdvV-xPu.js";
import { A as Ze, F as Qe, j as $e, k as et } from "../../chunks/bindings-DyamxTH2.js";
import { On as tt, h as nt, x as rt, y as it } from "../../chunks/common-Bs7hSOUj.js";
import { u as at } from "../../chunks/elements-CiWscFTo.js";
import { a as ot, r as st } from "../../chunks/Runnable-Mz0aa-Zm.js";
import { d as ct } from "../../chunks/object_ui-Dj5WXMwl.js";
import { c as lt } from "../../chunks/quick_open-thOwmkpR.js";
import { f as ut } from "../../chunks/console-DyEFGxFI.js";
import { w as dt } from "../../chunks/issues_manager-Ba4w-pt1.js";
import { i as ft } from "../../chunks/UIFilter-CIzBruM3.js";
import { n as pt } from "../../chunks/UIRequestLocation-CtGcVN3I.js";
import { n as mt } from "../../chunks/main-BR5KnvrD.js";
import { n as ht, t as gt } from "../../chunks/helper-Cjm7Cg8b.js";
import { t as _t } from "../../chunks/lighthouse-B1qM_zXC.js";
import { t as vt } from "../../chunks/recorder-actions-S2RfLX4H.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/sources/sources-meta.ts
var x = {
	showSources: "Show Sources",
	sources: "Sources",
	showWorkspace: "Show Workspace",
	workspace: "Workspace",
	showSnippets: "Show Snippets",
	snippets: "Snippets",
	showSearch: "Show Search",
	search: "Search",
	showQuickSource: "Show Quick source",
	quickSource: "Quick source",
	showThreads: "Show Threads",
	threads: "Threads",
	showScope: "Show Scope",
	scope: "Scope",
	showWatch: "Show Watch",
	watch: "Watch",
	showBreakpoints: "Show Breakpoints",
	breakpoints: "Breakpoints",
	pauseScriptExecution: "Pause script execution",
	resumeScriptExecution: "Resume script execution",
	stepOverNextFunctionCall: "Step over next function call",
	stepIntoNextFunctionCall: "Step into next function call",
	step: "Step",
	stepOutOfCurrentFunction: "Step out of current function",
	runSnippet: "Run snippet",
	deactivateBreakpoints: "Deactivate breakpoints",
	activateBreakpoints: "Activate breakpoints",
	addSelectedTextToWatches: "Add selected text to watches",
	evaluateSelectedTextInConsole: "Evaluate selected text in console",
	switchFile: "Switch file",
	rename: "Rename",
	closeAll: "Close all",
	jumpToPreviousEditingLocation: "Jump to previous editing location",
	jumpToNextEditingLocation: "Jump to next editing location",
	closeTheActiveTab: "Close the active tab",
	goToLine: "Go to line",
	goToAFunctionDeclarationruleSet: "Go to a function declaration/rule set",
	toggleBreakpoint: "Toggle breakpoint",
	toggleBreakpointEnabled: "Toggle breakpoint enabled",
	toggleBreakpointInputWindow: "Toggle breakpoint input window",
	save: "Save",
	saveAll: "Save all",
	createNewSnippet: "Create new snippet",
	addFolderManually: "Add folder manually",
	addFolderToWorkspace: "Add folder to workspace",
	previousCallFrame: "Previous call frame",
	nextCallFrame: "Next call frame",
	incrementCssUnitBy: "Increment CSS unit by {PH1}",
	decrementCssUnitBy: "Decrement CSS unit by {PH1}",
	searchInAnonymousAndContent: "Search in anonymous and content scripts",
	doNotSearchInAnonymousAndContent: "Do not search in anonymous and content scripts",
	automaticallyRevealFilesIn: "Automatically reveal files in sidebar",
	doNotAutomaticallyRevealFilesIn: "Do not automatically reveal files in sidebar",
	tabMovesFocus: "Tab moves focus",
	enableTabMovesFocus: "Enable tab moves focus",
	disableTabMovesFocus: "Disable tab moves focus",
	detectIndentation: "Detect indentation",
	doNotDetectIndentation: "Do not detect indentation",
	automaticallyPrettyPrintMinifiedSources: "Automatically pretty print minified sources",
	doNotAutomaticallyPrettyPrintMinifiedSources: "Do not automatically pretty print minified sources",
	autocompletion: "Autocompletion",
	enableAutocompletion: "Enable autocompletion",
	disableAutocompletion: "Disable autocompletion",
	bracketClosing: "Auto closing brackets",
	enableBracketClosing: "Enable auto closing brackets",
	disableBracketClosing: "Disable auto closing brackets",
	bracketMatching: "Bracket matching",
	enableBracketMatching: "Enable bracket matching",
	disableBracketMatching: "Disable bracket matching",
	codeFolding: "Code folding",
	enableCodeFolding: "Enable code folding",
	disableCodeFolding: "Disable code folding",
	showWhitespaceCharacters: "Show whitespace characters:",
	doNotShowWhitespaceCharacters: "Do not show whitespace characters",
	none: "None",
	showAllWhitespaceCharacters: "Show all whitespace characters",
	all: "All",
	showTrailingWhitespaceCharacters: "Show trailing whitespace characters",
	trailing: "Trailing",
	variableValuesInlineWhile: "Variable values inline",
	displayVariableValuesInlineWhile: "Display variable values inline while debugging",
	doNotDisplayVariableValuesInline: "Don't show variable values inline",
	allowScrollingPastEndOfFile: "Allow scrolling past end of file",
	disallowScrollingPastEndOfFile: "Disallow scrolling past end of file",
	wasmAutoStepping: "Wasm auto-stepping bytecode",
	wasmAutoSteppingInfo: "When debugging Wasm with debug information, try to skip wasm bytecode",
	enableWasmAutoStepping: "Enable Wasm auto-stepping",
	disableWasmAutoStepping: "Disable Wasm auto-stepping",
	goTo: "Go to",
	line: "Line",
	symbol: "Symbol",
	goToSymbol: "Go to symbol",
	open: "Open",
	file: "File",
	openFile: "Open file",
	disableAutoFocusOnDebuggerPaused: "Do not focus Sources panel when triggering a breakpoint",
	enableAutoFocusOnDebuggerPaused: "Focus Sources panel when triggering a breakpoint",
	revealActiveFileInSidebar: "Reveal active file in navigator sidebar",
	toggleNavigatorSidebar: "Toggle navigator sidebar",
	toggleDebuggerSidebar: "Toggle debugger sidebar",
	nextEditorTab: "Next editor",
	previousEditorTab: "Previous editor",
	wordWrap: "Word wrap",
	toggleWordWrap: "Toggle word wrap"
}, yt = n("panels/sources/sources-meta.ts", x), S = e.bind(void 0, yt), bt;
async function C() {
	return bt ||= await import("../../chunks/sources-TPBBLKKV.js"), bt;
}
function w(e) {
	return bt === void 0 ? [] : e(bt);
}
l({
	location: d.PANEL,
	id: "sources",
	commandPrompt: S(x.showSources),
	title: S(x.sources),
	order: 30,
	async loadView() {
		return (await C()).SourcesPanel.SourcesPanel.instance();
	}
}), l({
	location: d.NAVIGATOR_VIEW,
	id: "navigator-files",
	commandPrompt: S(x.showWorkspace),
	title: S(x.workspace),
	order: 3,
	persistence: u.PERMANENT,
	condition: () => !Je.isTraceApp(),
	async loadView() {
		return new (await (C())).SourcesNavigator.FilesNavigatorView();
	}
}), l({
	location: d.NAVIGATOR_VIEW,
	id: "navigator-snippets",
	commandPrompt: S(x.showSnippets),
	title: S(x.snippets),
	order: 6,
	persistence: u.PERMANENT,
	condition: () => !Je.isTraceApp(),
	async loadView() {
		return new (await (C())).SourcesNavigator.SnippetsNavigatorView();
	}
}), l({
	location: d.DRAWER_VIEW,
	id: "sources.search-sources-tab",
	commandPrompt: S(x.showSearch),
	title: S(x.search),
	order: 7,
	persistence: u.CLOSEABLE,
	async loadView() {
		return new (await (C())).SearchSourcesView.SearchSourcesView();
	}
}), l({
	location: d.DRAWER_VIEW,
	id: "sources.quick",
	commandPrompt: S(x.showQuickSource),
	title: S(x.quickSource),
	persistence: u.CLOSEABLE,
	order: 1e3,
	async loadView() {
		return new (await (C())).SourcesPanel.QuickSourceView();
	}
}), l({
	id: "sources.threads",
	commandPrompt: S(x.showThreads),
	title: S(x.threads),
	persistence: u.PERMANENT,
	async loadView() {
		return new (await (C())).ThreadsSidebarPane.ThreadsSidebarPane();
	}
}), l({
	id: "sources.scope-chain",
	commandPrompt: S(x.showScope),
	title: S(x.scope),
	persistence: u.PERMANENT,
	async loadView() {
		return (await C()).ScopeChainSidebarPane.ScopeChainSidebarPane.instance();
	}
}), l({
	id: "sources.watch",
	commandPrompt: S(x.showWatch),
	title: S(x.watch),
	persistence: u.PERMANENT,
	async loadView() {
		return (await C()).WatchExpressionsSidebarPane.WatchExpressionsSidebarPane.instance();
	},
	hasToolbar: !0
}), l({
	id: "sources.js-breakpoints",
	commandPrompt: S(x.showBreakpoints),
	title: S(x.breakpoints),
	persistence: u.PERMANENT,
	async loadView() {
		return (await C()).BreakpointsView.BreakpointsView.instance();
	}
}), p({
	category: h.DEBUGGER,
	actionId: "debugger.toggle-pause",
	iconClass: _.LARGEICON_PAUSE,
	toggleable: !0,
	toggledIconClass: _.LARGEICON_RESUME,
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.RevealingActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView, ce]);
	},
	options: [{
		value: !0,
		title: S(x.pauseScriptExecution)
	}, {
		value: !1,
		title: S(x.resumeScriptExecution)
	}],
	bindings: [
		{
			shortcut: "F8",
			keybindSets: [v.DEVTOOLS_DEFAULT]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+\\"
		},
		{
			shortcut: "F5",
			keybindSets: [v.VS_CODE]
		},
		{
			shortcut: "Shift+F5",
			keybindSets: [v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+\\"
		}
	]
}), p({
	category: h.DEBUGGER,
	actionId: "debugger.step-over",
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	title: S(x.stepOverNextFunctionCall),
	iconClass: _.LARGEICON_STEP_OVER,
	contextTypes() {
		return [ze];
	},
	bindings: [
		{
			shortcut: "F10",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+'"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+'"
		}
	]
}), p({
	category: h.DEBUGGER,
	actionId: "debugger.step-into",
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	title: S(x.stepIntoNextFunctionCall),
	iconClass: _.LARGE_ICON_STEP_INTO,
	contextTypes() {
		return [ze];
	},
	bindings: [
		{
			shortcut: "F11",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+;"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+;"
		}
	]
}), p({
	category: h.DEBUGGER,
	actionId: "debugger.step",
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	title: S(x.step),
	iconClass: _.LARGE_ICON_STEP,
	contextTypes() {
		return [ze];
	},
	bindings: [{
		shortcut: "F9",
		keybindSets: [v.DEVTOOLS_DEFAULT]
	}]
}), p({
	category: h.DEBUGGER,
	actionId: "debugger.step-out",
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	title: S(x.stepOutOfCurrentFunction),
	iconClass: _.LARGE_ICON_STEP_OUT,
	contextTypes() {
		return [ze];
	},
	bindings: [
		{
			shortcut: "Shift+F11",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Shift+Ctrl+;"
		},
		{
			platform: f.MAC,
			shortcut: "Shift+Meta+;"
		}
	]
}), p({
	actionId: "debugger.run-snippet",
	category: h.DEBUGGER,
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	title: S(x.runSnippet),
	iconClass: _.PLAY,
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+Enter"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Enter"
	}]
}), p({
	category: h.DEBUGGER,
	actionId: "debugger.toggle-breakpoints-active",
	iconClass: _.BREAKPOINT_CROSSED,
	toggledIconClass: _.BREAKPOINT_CROSSED_FILLED,
	toggleable: !0,
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	options: [{
		value: !0,
		title: S(x.deactivateBreakpoints)
	}, {
		value: !1,
		title: S(x.activateBreakpoints)
	}],
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+F8"
	}, {
		platform: f.MAC,
		shortcut: "Meta+F8"
	}]
}), p({
	actionId: "sources.add-to-watch",
	async loadActionDelegate() {
		return (await C()).WatchExpressionsSidebarPane.WatchExpressionsSidebarPane.instance();
	},
	category: h.DEBUGGER,
	title: S(x.addSelectedTextToWatches),
	contextTypes() {
		return w((e) => [e.UISourceCodeFrame.UISourceCodeFrame]);
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+Shift+A"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Shift+A"
	}]
}), p({
	actionId: "debugger.evaluate-selection",
	category: h.DEBUGGER,
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	title: S(x.evaluateSelectedTextInConsole),
	contextTypes() {
		return w((e) => [e.UISourceCodeFrame.UISourceCodeFrame]);
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+Shift+E"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Shift+E"
	}]
}), p({
	actionId: "sources.switch-file",
	category: h.SOURCES,
	title: S(x.switchFile),
	async loadActionDelegate() {
		return new (await (C())).SourcesView.SwitchFileActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [{ shortcut: "Alt+O" }]
}), p({
	actionId: "sources.rename",
	category: h.SOURCES,
	title: S(x.rename),
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "F2"
	}, {
		platform: f.MAC,
		shortcut: "Enter"
	}]
}), p({
	category: h.SOURCES,
	actionId: "sources.close-all",
	async loadActionDelegate() {
		return new (await (C())).SourcesView.ActionDelegate();
	},
	title: S(x.closeAll),
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+K W",
		keybindSets: [v.VS_CODE]
	}, {
		platform: f.MAC,
		shortcut: "Meta+K W",
		keybindSets: [v.VS_CODE]
	}]
}), p({
	actionId: "sources.jump-to-previous-location",
	category: h.SOURCES,
	title: S(x.jumpToPreviousEditingLocation),
	async loadActionDelegate() {
		return new (await (C())).SourcesView.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [{ shortcut: "Alt+Minus" }]
}), p({
	actionId: "sources.jump-to-next-location",
	category: h.SOURCES,
	title: S(x.jumpToNextEditingLocation),
	async loadActionDelegate() {
		return new (await (C())).SourcesView.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [{ shortcut: "Alt+Plus" }]
}), p({
	actionId: "sources.close-editor-tab",
	category: h.SOURCES,
	title: S(x.closeTheActiveTab),
	async loadActionDelegate() {
		return new (await (C())).SourcesView.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [
		{ shortcut: "Alt+w" },
		{
			shortcut: "Ctrl+W",
			keybindSets: [v.VS_CODE]
		},
		{
			platform: f.WINDOWS,
			shortcut: "Ctrl+F4",
			keybindSets: [v.VS_CODE]
		}
	]
}), p({
	actionId: "sources.next-editor-tab",
	category: h.SOURCES,
	title: S(x.nextEditorTab),
	async loadActionDelegate() {
		return new (await (C())).SourcesView.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+PageDown",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}, {
		platform: f.MAC,
		shortcut: "Meta+PageDown",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}]
}), p({
	actionId: "sources.previous-editor-tab",
	category: h.SOURCES,
	title: S(x.previousEditorTab),
	async loadActionDelegate() {
		return new (await (C())).SourcesView.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+PageUp",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}, {
		platform: f.MAC,
		shortcut: "Meta+PageUp",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}]
}), p({
	actionId: "sources.go-to-line",
	category: h.SOURCES,
	title: S(x.goToLine),
	async loadActionDelegate() {
		return new (await (C())).SourcesView.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [{
		shortcut: "Ctrl+g",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}, {
		shortcut: "Alt+g",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}]
}), p({
	actionId: "sources.go-to-member",
	category: h.SOURCES,
	title: S(x.goToAFunctionDeclarationruleSet),
	async loadActionDelegate() {
		return new (await (C())).SourcesView.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+o",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Shift+o",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+T",
			keybindSets: [v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+T",
			keybindSets: [v.VS_CODE]
		},
		{
			shortcut: "F12",
			keybindSets: [v.VS_CODE]
		}
	]
}), p({
	actionId: "debugger.toggle-breakpoint",
	category: h.DEBUGGER,
	title: S(x.toggleBreakpoint),
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+b",
			keybindSets: [v.DEVTOOLS_DEFAULT]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+b",
			keybindSets: [v.DEVTOOLS_DEFAULT]
		},
		{
			shortcut: "F9",
			keybindSets: [v.VS_CODE]
		}
	]
}), p({
	actionId: "debugger.toggle-breakpoint-enabled",
	category: h.DEBUGGER,
	title: S(x.toggleBreakpointEnabled),
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+Shift+b"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Shift+b"
	}]
}), p({
	actionId: "debugger.breakpoint-input-window",
	category: h.DEBUGGER,
	title: S(x.toggleBreakpointInputWindow),
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+Alt+b"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Alt+b"
	}]
}), p({
	actionId: "sources.save",
	category: h.SOURCES,
	title: S(x.save),
	async loadActionDelegate() {
		return new (await (C())).SourcesView.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+s",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}, {
		platform: f.MAC,
		shortcut: "Meta+s",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}]
}), p({
	actionId: "sources.save-all",
	category: h.SOURCES,
	title: S(x.saveAll),
	async loadActionDelegate() {
		return new (await (C())).SourcesView.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+s"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Alt+s"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+K S",
			keybindSets: [v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Alt+S",
			keybindSets: [v.VS_CODE]
		}
	]
}), p({
	category: h.SOURCES,
	actionId: "sources.create-snippet",
	async loadActionDelegate() {
		return new (await (C())).SourcesNavigator.ActionDelegate();
	},
	title: S(x.createNewSnippet)
}), p({
	category: h.SOURCES,
	actionId: "sources.add-folder-to-workspace",
	condition: () => !ke.isHostedMode(),
	async loadActionDelegate() {
		return new (await (C())).SourcesNavigator.ActionDelegate();
	},
	iconClass: _.PLUS,
	title: S(x.addFolderToWorkspace)
}), p({
	category: h.DEBUGGER,
	actionId: "debugger.previous-call-frame",
	async loadActionDelegate() {
		return new (await (C())).CallStackSidebarPane.ActionDelegate();
	},
	title: S(x.previousCallFrame),
	contextTypes() {
		return [ze];
	},
	bindings: [{ shortcut: "Ctrl+," }]
}), p({
	category: h.DEBUGGER,
	actionId: "debugger.next-call-frame",
	async loadActionDelegate() {
		return new (await (C())).CallStackSidebarPane.ActionDelegate();
	},
	title: S(x.nextCallFrame),
	contextTypes() {
		return [ze];
	},
	bindings: [{ shortcut: "Ctrl+." }]
}), p({
	actionId: "sources.search",
	title: S(x.search),
	async loadActionDelegate() {
		return new (await (C())).SearchSourcesView.ActionDelegate();
	},
	category: h.SOURCES,
	bindings: [
		{
			platform: f.MAC,
			shortcut: "Meta+Alt+F",
			keybindSets: [v.DEVTOOLS_DEFAULT]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+F",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+J",
			keybindSets: [v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Shift+F",
			keybindSets: [v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Shift+J",
			keybindSets: [v.VS_CODE]
		}
	]
}), p({
	actionId: "sources.increment-css",
	category: h.SOURCES,
	title: S(x.incrementCssUnitBy, { PH1: 1 }),
	bindings: [{ shortcut: "Alt+Up" }]
}), p({
	actionId: "sources.increment-css-by-ten",
	title: S(x.incrementCssUnitBy, { PH1: 10 }),
	category: h.SOURCES,
	bindings: [{ shortcut: "Alt+PageUp" }]
}), p({
	actionId: "sources.decrement-css",
	category: h.SOURCES,
	title: S(x.decrementCssUnitBy, { PH1: 1 }),
	bindings: [{ shortcut: "Alt+Down" }]
}), p({
	actionId: "sources.decrement-css-by-ten",
	category: h.SOURCES,
	title: S(x.decrementCssUnitBy, { PH1: 10 }),
	bindings: [{ shortcut: "Alt+PageDown" }]
}), p({
	actionId: "sources.reveal-in-navigator-sidebar",
	category: h.SOURCES,
	title: S(x.revealActiveFileInSidebar),
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	}
}), p({
	actionId: "sources.toggle-navigator-sidebar",
	category: h.SOURCES,
	title: S(x.toggleNavigatorSidebar),
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+y",
			keybindSets: [v.DEVTOOLS_DEFAULT]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Shift+y",
			keybindSets: [v.DEVTOOLS_DEFAULT]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+b",
			keybindSets: [v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Meta+b",
			keybindSets: [v.VS_CODE]
		}
	]
}), p({
	actionId: "sources.toggle-debugger-sidebar",
	category: h.SOURCES,
	title: S(x.toggleDebuggerSidebar),
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+Shift+h"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Shift+h"
	}]
}), o({
	settingName: "navigator-group-by-folder",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), o({
	settingName: "navigator-group-by-authored",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	settingName: "navigator-just-my-code",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.searchInAnonymousAndContent),
	settingName: "search-in-anonymous-and-content-scripts",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	options: [{
		value: !0,
		title: S(x.searchInAnonymousAndContent)
	}, {
		value: !1,
		title: S(x.doNotSearchInAnonymousAndContent)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.automaticallyRevealFilesIn),
	settingName: "auto-reveal-in-navigator",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.automaticallyRevealFilesIn)
	}, {
		value: !1,
		title: S(x.doNotAutomaticallyRevealFilesIn)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.tabMovesFocus),
	settingName: "text-editor-tab-moves-focus",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	options: [{
		value: !0,
		title: S(x.enableTabMovesFocus)
	}, {
		value: !1,
		title: S(x.disableTabMovesFocus)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.detectIndentation),
	settingName: "text-editor-auto-detect-indent",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.detectIndentation)
	}, {
		value: !1,
		title: S(x.doNotDetectIndentation)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.autocompletion),
	settingName: "text-editor-autocompletion",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.enableAutocompletion)
	}, {
		value: !1,
		title: S(x.disableAutocompletion)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.bracketClosing),
	settingName: "text-editor-bracket-closing",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.enableBracketClosing)
	}, {
		value: !1,
		title: S(x.disableBracketClosing)
	}]
}), o({
	category: c.SOURCES,
	title: S(x.bracketMatching),
	settingName: "text-editor-bracket-matching",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.enableBracketMatching)
	}, {
		value: !1,
		title: S(x.disableBracketMatching)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.codeFolding),
	settingName: "text-editor-code-folding",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.enableCodeFolding)
	}, {
		value: !1,
		title: S(x.disableCodeFolding)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.showWhitespaceCharacters),
	settingName: "show-whitespaces-in-editor",
	settingType: a.ENUM,
	defaultValue: "original",
	options: [
		{
			title: S(x.doNotShowWhitespaceCharacters),
			text: S(x.none),
			value: "none"
		},
		{
			title: S(x.showAllWhitespaceCharacters),
			text: S(x.all),
			value: "all"
		},
		{
			title: S(x.showTrailingWhitespaceCharacters),
			text: S(x.trailing),
			value: "trailing"
		}
	]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.wordWrap),
	settingName: "sources.word-wrap",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), p({
	category: h.SOURCES,
	actionId: "sources.toggle-word-wrap",
	async loadActionDelegate() {
		return new (await (C())).SourcesPanel.ActionDelegate();
	},
	title: S(x.toggleWordWrap),
	contextTypes() {
		return w((e) => [e.SourcesView.SourcesView]);
	},
	bindings: [{
		shortcut: "Alt+Z",
		keybindSets: [v.VS_CODE]
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.variableValuesInlineWhile),
	settingName: "inline-variable-values",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.displayVariableValuesInlineWhile)
	}, {
		value: !1,
		title: S(x.doNotDisplayVariableValuesInline)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.enableAutoFocusOnDebuggerPaused),
	settingName: "auto-focus-on-debugger-paused-enabled",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.enableAutoFocusOnDebuggerPaused)
	}, {
		value: !1,
		title: S(x.disableAutoFocusOnDebuggerPaused)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.automaticallyPrettyPrintMinifiedSources),
	settingName: "auto-pretty-print-minified",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.automaticallyPrettyPrintMinifiedSources)
	}, {
		value: !1,
		title: S(x.doNotAutomaticallyPrettyPrintMinifiedSources)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: S(x.allowScrollingPastEndOfFile),
	settingName: "allow-scroll-past-eof",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.allowScrollingPastEndOfFile)
	}, {
		value: !1,
		title: S(x.disallowScrollingPastEndOfFile)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.LOCAL,
	title: S(x.wasmAutoStepping),
	settingName: "wasm-auto-stepping",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: S(x.enableWasmAutoStepping)
	}, {
		value: !1,
		title: S(x.disableWasmAutoStepping)
	}],
	learnMore: { tooltip: S(x.wasmAutoSteppingInfo) }
}), We({
	name: d.NAVIGATOR_VIEW,
	category: ge.SOURCES,
	async loadResolver() {
		return (await C()).SourcesPanel.SourcesPanel.instance();
	}
}), We({
	name: d.SOURCES_SIDEBAR_TOP,
	category: ge.SOURCES,
	async loadResolver() {
		return (await C()).SourcesPanel.SourcesPanel.instance();
	}
}), We({
	name: d.SOURCES_SIDEBAR_BOTTOM,
	category: ge.SOURCES,
	async loadResolver() {
		return (await C()).SourcesPanel.SourcesPanel.instance();
	}
}), We({
	name: d.SOURCES_SIDEBAR_TABS,
	category: ge.SOURCES,
	async loadResolver() {
		return (await C()).SourcesPanel.SourcesPanel.instance();
	}
}), we({
	contextTypes() {
		return [
			$e,
			et,
			Oe,
			_e,
			...w((e) => [e.UISourceCodeFrame.UISourceCodeFrame])
		];
	},
	async loadProvider() {
		return (await C()).SourcesPanel.SourcesPanel.instance();
	}
}), we({
	async loadProvider() {
		return (await C()).WatchExpressionsSidebarPane.WatchExpressionsSidebarPane.instance();
	},
	contextTypes() {
		return [ct, ...w((e) => [e.UISourceCodeFrame.UISourceCodeFrame])];
	}
}), t({
	contextTypes() {
		return [et];
	},
	destination: r.SOURCES_PANEL,
	async loadRevealer() {
		return new (await (C())).SourcesPanel.UILocationRevealer();
	}
}), t({
	contextTypes() {
		return [Ze];
	},
	destination: r.SOURCES_PANEL,
	async loadRevealer() {
		return new (await (C())).SourcesPanel.UILocationRangeRevealer();
	}
}), t({
	contextTypes() {
		return [Ne];
	},
	destination: r.SOURCES_PANEL,
	async loadRevealer() {
		return new (await (C())).SourcesPanel.DebuggerLocationRevealer();
	}
}), t({
	contextTypes() {
		return [$e];
	},
	destination: r.SOURCES_PANEL,
	async loadRevealer() {
		return new (await (C())).SourcesPanel.UISourceCodeRevealer();
	}
}), t({
	contextTypes() {
		return [ze];
	},
	destination: r.SOURCES_PANEL,
	async loadRevealer() {
		return new (await (C())).SourcesPanel.DebuggerPausedDetailsRevealer();
	}
}), t({
	contextTypes() {
		return [tt];
	},
	destination: r.SOURCES_PANEL,
	async loadRevealer() {
		return new (await (C())).DebuggerPlugin.BreakpointLocationRevealer();
	}
}), t({
	contextTypes() {
		return w((e) => [e.SearchSourcesView.SearchSources]);
	},
	async loadRevealer() {
		return new (await (C())).SearchSourcesView.Revealer();
	}
}), m({
	actionId: "sources.add-folder-to-workspace",
	location: g.FILES_NAVIGATION_TOOLBAR,
	label: S(x.addFolderManually)
}), Re({
	contextTypes() {
		return [ze];
	},
	async loadListener() {
		return (await C()).BreakpointsView.BreakpointsSidebarController.instance();
	}
}), Re({
	contextTypes() {
		return [ze];
	},
	async loadListener() {
		return (await C()).CallStackSidebarPane.CallStackSidebarPane.instance();
	}
}), Re({
	contextTypes() {
		return [Qe];
	},
	async loadListener() {
		return (await C()).ScopeChainSidebarPane.ScopeChainSidebarPane.instance();
	}
}), y({
	location: b.NAVIGATOR_MENU_DEFAULT,
	actionId: "quick-open.show"
}), y({
	location: b.MAIN_MENU_DEFAULT,
	actionId: "sources.search"
}), lt({
	prefix: "@",
	iconName: "symbol",
	async provider() {
		return new (await (C())).OutlineQuickOpen.OutlineQuickOpen();
	},
	helpTitle: S(x.goToSymbol),
	titlePrefix: S(x.goTo),
	titleSuggestion: S(x.symbol),
	jslogContext: "source-symbol"
}), lt({
	prefix: ":",
	iconName: "colon",
	async provider() {
		return new (await (C())).GoToLineQuickOpen.GoToLineQuickOpen();
	},
	helpTitle: S(x.goToLine),
	titlePrefix: S(x.goTo),
	titleSuggestion: S(x.line),
	jslogContext: "source-line"
}), lt({
	prefix: "",
	iconName: "document",
	async provider() {
		return new (await (C())).OpenFileQuickOpen.OpenFileQuickOpen();
	},
	helpTitle: S(x.openFile),
	titlePrefix: S(x.open),
	titleSuggestion: S(x.file),
	jslogContext: "source-file"
}), we({
	contextTypes() {
		return [
			$e,
			De,
			_e
		];
	},
	async loadProvider() {
		return new (await (C())).PersistenceActions.ContextMenuProvider();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/profiler/profiler-meta.ts
var xt, St = {
	memory: "Memory",
	startStopRecording: "Start/stop recording",
	showMemory: "Show Memory",
	clearAllProfiles: "Clear all profiles",
	saveProfile: "Save profile…",
	loadProfile: "Load profile…",
	deleteProfile: "Delete profile"
}, Ct = n("panels/profiler/profiler-meta.ts", St), wt = e.bind(void 0, Ct);
async function Tt() {
	return xt ||= await import("../../chunks/profiler-UQy7Xmba.js"), xt;
}
function Et(e) {
	return xt === void 0 ? [] : e(xt);
}
l({
	location: d.PANEL,
	id: "heap-profiler",
	commandPrompt: wt(St.showMemory),
	title: wt(St.memory),
	order: 60,
	async loadView() {
		return (await Tt()).HeapProfilerPanel.HeapProfilerPanel.instance();
	}
}), p({
	actionId: "profiler.heap-toggle-recording",
	category: h.MEMORY,
	iconClass: _.START_RECORDING,
	title: wt(St.startStopRecording),
	toggleable: !0,
	toggledIconClass: _.STOP_RECORDING,
	toggleWithRedColor: !0,
	contextTypes() {
		return Et((e) => [e.HeapProfilerPanel.HeapProfilerPanel]);
	},
	async loadActionDelegate() {
		return (await Tt()).HeapProfilerPanel.HeapProfilerPanel.instance();
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+E"
	}, {
		platform: f.MAC,
		shortcut: "Meta+E"
	}]
}), p({
	actionId: "profiler.clear-all",
	category: h.MEMORY,
	iconClass: _.CLEAR,
	contextTypes() {
		return Et((e) => [e.ProfilesPanel.ProfilesPanel]);
	},
	async loadActionDelegate() {
		return new (await (Tt())).ProfilesPanel.ActionDelegate();
	},
	title: wt(St.clearAllProfiles)
}), p({
	actionId: "profiler.load-from-file",
	category: h.MEMORY,
	iconClass: _.IMPORT,
	contextTypes() {
		return Et((e) => [e.ProfilesPanel.ProfilesPanel]);
	},
	async loadActionDelegate() {
		return new (await (Tt())).ProfilesPanel.ActionDelegate();
	},
	title: wt(St.loadProfile),
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+O"
	}, {
		platform: f.MAC,
		shortcut: "Meta+O"
	}]
}), p({
	actionId: "profiler.save-to-file",
	category: h.MEMORY,
	iconClass: _.DOWNLOAD,
	contextTypes() {
		return Et((e) => [e.ProfileHeader.ProfileHeader]);
	},
	async loadActionDelegate() {
		return new (await (Tt())).ProfilesPanel.ActionDelegate();
	},
	title: wt(St.saveProfile),
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+S"
	}, {
		platform: f.MAC,
		shortcut: "Meta+S"
	}]
}), p({
	actionId: "profiler.delete-profile",
	category: h.MEMORY,
	iconClass: _.DOWNLOAD,
	contextTypes() {
		return Et((e) => [e.ProfileHeader.ProfileHeader]);
	},
	async loadActionDelegate() {
		return new (await (Tt())).ProfilesPanel.ActionDelegate();
	},
	title: wt(St.deleteProfile)
}), we({
	contextTypes() {
		return [Oe];
	},
	async loadProvider() {
		return (await Tt()).HeapProfilerPanel.HeapProfilerPanel.instance();
	}
}), y({
	location: b.PROFILER_MENU_DEFAULT,
	actionId: "profiler.save-to-file",
	order: 10
}), y({
	location: b.PROFILER_MENU_DEFAULT,
	actionId: "profiler.delete-profile",
	order: 11
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/console/console-meta.ts
var T = {
	console: "Console",
	showConsole: "Show Console",
	toggleConsole: "Toggle Console",
	clearConsole: "Clear console",
	clearConsoleHistory: "Clear console history",
	createLiveExpression: "Create live expression",
	networkMessages: "Network messages",
	hideNetworkMessages: "Hide network messages",
	showNetworkMessages: "Show network messages",
	selectedContextOnly: "Selected context only",
	onlyShowMessagesFromTheCurrent: "Only show messages from the current context (`top`, `iframe`, `worker`, extension)",
	showMessagesFromAllContexts: "Show messages from all contexts",
	timestamps: "Timestamps",
	showTimestamps: "Show timestamps",
	hideTimestamps: "Hide timestamps",
	autocompleteFromHistory: "Autocomplete from history",
	doNotAutocompleteFromHistory: "Do not autocomplete from history",
	autocompleteOnEnter: "Accept autocomplete suggestion on Enter",
	doNotAutocompleteOnEnter: "Do not accept autocomplete suggestion on Enter",
	groupSimilarMessages: "Group similar messages",
	doNotGroupSimilarMessages: "Don't group similar messages",
	corsErrorsInConsole: "CORS errors in console",
	showCorsErrorsInConsole: "Show CORS errors in console",
	doNotShowCorsErrorsIn: "Don't show CORS errors in console",
	eagerEvaluation: "Eager evaluation",
	eagerlyEvaluateConsolePromptText: "Eagerly evaluate console prompt text",
	doNotEagerlyEvaluateConsole: "Do not eagerly evaluate console prompt text",
	evaluateTriggersUserActivation: "Treat code evaluation as user action",
	treatEvaluationAsUserActivation: "Treat evaluation as user activation",
	doNotTreatEvaluationAsUser: "Do not treat evaluation as user activation",
	expandConsoleTraceMessagesByDefault: "Automatically expand `console.trace()` messages",
	collapseConsoleTraceMessagesByDefault: "Do not automatically expand `console.trace()` messages",
	consoleInsightTeasers: "AI summaries for console messages"
}, Dt = n("panels/console/console-meta.ts", T), E = e.bind(void 0, Dt), Ot;
async function kt() {
	return Ot ||= await import("../../chunks/console-CtRRpTLN.js"), Ot;
}
function At(e) {
	return Ot === void 0 ? [] : e(Ot);
}
l({
	location: d.PANEL,
	id: "console",
	title: E(T.console),
	commandPrompt: E(T.showConsole),
	order: 20,
	async loadView() {
		return (await kt()).ConsolePanel.ConsolePanel.instance();
	}
}), l({
	location: d.DRAWER_VIEW,
	id: "console-view",
	title: E(T.console),
	commandPrompt: E(T.showConsole),
	persistence: u.PERMANENT,
	order: 0,
	async loadView() {
		return (await kt()).ConsolePanel.WrapperView.instance();
	}
}), p({
	actionId: "console.toggle",
	category: h.CONSOLE,
	title: E(T.toggleConsole),
	async loadActionDelegate() {
		return new (await (kt())).ConsoleView.ActionDelegate();
	},
	bindings: [{
		shortcut: "Ctrl+`",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}]
}), p({
	actionId: "console.clear",
	category: h.CONSOLE,
	title: E(T.clearConsole),
	iconClass: _.CLEAR,
	async loadActionDelegate() {
		return new (await (kt())).ConsoleView.ActionDelegate();
	},
	contextTypes() {
		return At((e) => [e.ConsoleView.ConsoleView]);
	},
	bindings: [{ shortcut: "Ctrl+L" }, {
		shortcut: "Meta+K",
		platform: f.MAC
	}]
}), p({
	actionId: "console.clear.history",
	category: h.CONSOLE,
	title: E(T.clearConsoleHistory),
	async loadActionDelegate() {
		return new (await (kt())).ConsoleView.ActionDelegate();
	}
}), p({
	actionId: "console.create-pin",
	category: h.CONSOLE,
	title: E(T.createLiveExpression),
	iconClass: _.EYE,
	async loadActionDelegate() {
		return new (await (kt())).ConsoleView.ActionDelegate();
	}
}), o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: E(T.networkMessages),
	settingName: "network-messages",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: E(T.showNetworkMessages)
	}, {
		value: !1,
		title: E(T.hideNetworkMessages)
	}]
}), o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: E(T.selectedContextOnly),
	settingName: "selected-context-filter-enabled",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	options: [{
		value: !0,
		title: E(T.onlyShowMessagesFromTheCurrent)
	}, {
		value: !1,
		title: E(T.showMessagesFromAllContexts)
	}]
}), o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: E(T.timestamps),
	settingName: "console-timestamps-enabled",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	options: [{
		value: !0,
		title: E(T.showTimestamps)
	}, {
		value: !1,
		title: E(T.hideTimestamps)
	}]
}), o({
	category: c.CONSOLE,
	title: E(T.autocompleteFromHistory),
	settingName: "console-history-autocomplete",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: E(T.autocompleteFromHistory)
	}, {
		value: !1,
		title: E(T.doNotAutocompleteFromHistory)
	}]
}), o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: E(T.autocompleteOnEnter),
	settingName: "console-autocomplete-on-enter",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	options: [{
		value: !0,
		title: E(T.autocompleteOnEnter)
	}, {
		value: !1,
		title: E(T.doNotAutocompleteOnEnter)
	}]
}), o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: E(T.groupSimilarMessages),
	settingName: "console-group-similar",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: E(T.groupSimilarMessages)
	}, {
		value: !1,
		title: E(T.doNotGroupSimilarMessages)
	}]
}), o({
	category: c.CONSOLE,
	title: E(T.corsErrorsInConsole),
	settingName: "console-shows-cors-errors",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: E(T.showCorsErrorsInConsole)
	}, {
		value: !1,
		title: E(T.doNotShowCorsErrorsIn)
	}]
}), o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: E(T.eagerEvaluation),
	settingName: "console-eager-eval",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: E(T.eagerlyEvaluateConsolePromptText)
	}, {
		value: !1,
		title: E(T.doNotEagerlyEvaluateConsole)
	}]
}), o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: E(T.evaluateTriggersUserActivation),
	settingName: "console-user-activation-eval",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: E(T.treatEvaluationAsUserActivation)
	}, {
		value: !1,
		title: E(T.doNotTreatEvaluationAsUser)
	}]
}), o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: E(T.expandConsoleTraceMessagesByDefault),
	settingName: "console-trace-expand",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: E(T.expandConsoleTraceMessagesByDefault)
	}, {
		value: !1,
		title: E(T.collapseConsoleTraceMessagesByDefault)
	}]
}), o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: E(T.consoleInsightTeasers),
	settingName: "console-insight-teasers-enabled",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), t({
	contextTypes() {
		return [ae];
	},
	destination: void 0,
	async loadRevealer() {
		return new (await (kt())).ConsolePanel.ConsoleRevealer();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/coverage/coverage-meta.ts
var jt = {
	coverage: "Coverage",
	showCoverage: "Show Coverage",
	instrumentCoverage: "Instrument coverage",
	stopInstrumentingCoverageAndShow: "Stop instrumenting coverage and show results",
	startInstrumentingCoverageAnd: "Start instrumenting coverage and reload page",
	clearCoverage: "Clear coverage",
	exportCoverage: "Export coverage"
}, Mt = n("panels/coverage/coverage-meta.ts", jt), Nt = e.bind(void 0, Mt), Pt;
async function Ft() {
	return Pt ||= await import("../../chunks/coverage-CqLu6rH2.js"), Pt;
}
function It(e) {
	return Pt === void 0 ? [] : e(Pt);
}
l({
	location: d.DRAWER_VIEW,
	id: "coverage",
	title: Nt(jt.coverage),
	commandPrompt: Nt(jt.showCoverage),
	persistence: u.CLOSEABLE,
	order: 100,
	async loadView() {
		return (await Ft()).CoverageView.CoverageView.instance();
	}
}), p({
	actionId: "coverage.toggle-recording",
	iconClass: _.START_RECORDING,
	toggleable: !0,
	toggledIconClass: _.STOP_RECORDING,
	toggleWithRedColor: !0,
	async loadActionDelegate() {
		return new (await (Ft())).CoverageView.ActionDelegate();
	},
	category: h.PERFORMANCE,
	options: [{
		value: !0,
		title: Nt(jt.instrumentCoverage)
	}, {
		value: !1,
		title: Nt(jt.stopInstrumentingCoverageAndShow)
	}]
}), p({
	actionId: "coverage.start-with-reload",
	iconClass: _.REFRESH,
	async loadActionDelegate() {
		return new (await (Ft())).CoverageView.ActionDelegate();
	},
	category: h.PERFORMANCE,
	title: Nt(jt.startInstrumentingCoverageAnd)
}), p({
	actionId: "coverage.clear",
	iconClass: _.CLEAR,
	category: h.PERFORMANCE,
	title: Nt(jt.clearCoverage),
	async loadActionDelegate() {
		return new (await (Ft())).CoverageView.ActionDelegate();
	},
	contextTypes() {
		return It((e) => [e.CoverageView.CoverageView]);
	}
}), p({
	actionId: "coverage.export",
	iconClass: _.DOWNLOAD,
	category: h.PERFORMANCE,
	title: Nt(jt.exportCoverage),
	async loadActionDelegate() {
		return new (await (Ft())).CoverageView.ActionDelegate();
	},
	contextTypes() {
		return It((e) => [e.CoverageView.CoverageView]);
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/changes/changes-meta.ts
var Lt, Rt = {
	changes: "Changes",
	showChanges: "Show Changes"
}, zt = n("panels/changes/changes-meta.ts", Rt), Bt = e.bind(void 0, zt);
async function Vt() {
	return Lt ||= await import("../../chunks/changes-DjZCqvtP.js"), Lt;
}
l({
	location: d.DRAWER_VIEW,
	id: "changes.changes",
	title: Bt(Rt.changes),
	commandPrompt: Bt(Rt.showChanges),
	persistence: u.CLOSEABLE,
	async loadView() {
		return new (await (Vt())).ChangesView.ChangesView();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/linear_memory_inspector/linear_memory_inspector-meta.ts
var Ht = {
	memoryInspector: "Memory inspector",
	showMemoryInspector: "Show Memory inspector"
}, Ut = n("panels/linear_memory_inspector/linear_memory_inspector-meta.ts", Ht), Wt = e.bind(void 0, Ut), Gt;
async function Kt() {
	return Gt ||= await import("../../chunks/linear_memory_inspector-Dh5tCAly.js"), Gt;
}
l({
	location: d.DRAWER_VIEW,
	id: "linear-memory-inspector",
	title: Wt(Ht.memoryInspector),
	commandPrompt: Wt(Ht.showMemoryInspector),
	order: 100,
	persistence: u.CLOSEABLE,
	async loadView() {
		return (await Kt()).LinearMemoryInspectorPane.LinearMemoryInspectorPane.instance();
	}
}), we({
	async loadProvider() {
		return (await Kt()).LinearMemoryInspectorController.LinearMemoryInspectorController.instance();
	},
	contextTypes() {
		return [ct];
	}
}), t({
	contextTypes() {
		return [Ee];
	},
	destination: r.MEMORY_INSPECTOR_PANEL,
	async loadRevealer() {
		return (await Kt()).LinearMemoryInspectorController.LinearMemoryInspectorController.instance();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/settings/emulation/emulation-meta.ts
var qt = {
	devices: "Devices",
	showDevices: "Show Devices"
}, Jt = n("panels/settings/emulation/emulation-meta.ts", qt), Yt = e.bind(void 0, Jt), Xt;
async function Zt() {
	return Xt ||= await import("../../chunks/emulation-DZzLxQFD.js"), Xt;
}
l({
	location: d.SETTINGS_VIEW,
	commandPrompt: Yt(qt.showDevices),
	title: Yt(qt.devices),
	order: 30,
	async loadView() {
		return new (await (Zt())).DevicesSettingsTab.DevicesSettingsTab();
	},
	id: "devices",
	settings: ["standard-emulated-device-list", "custom-emulated-device-list"],
	iconName: "devices"
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/settings/settings-meta.ts
var D = {
	shortcuts: "Shortcuts",
	preferences: "Preferences",
	experiments: "Experiments",
	greenDevProtoTypes: "GreenDev",
	showGreenDev: "Show GreenDev",
	ignoreList: "Ignore list",
	showShortcuts: "Show Shortcuts",
	showPreferences: "Show Preferences",
	showExperiments: "Show Experiments",
	showIgnoreList: "Show Ignore list",
	settings: "Settings",
	documentation: "Documentation",
	aiInnovations: "AI innovations",
	showAiInnovations: "Show AI innovations",
	workspace: "Workspace",
	showWorkspace: "Show Workspace settings"
}, Qt = n("panels/settings/settings-meta.ts", D), O = e.bind(void 0, Qt), $t;
async function en() {
	return $t ||= await import("../../chunks/settings-C_IwrLR-.js"), $t;
}
l({
	location: d.SETTINGS_VIEW,
	id: "preferences",
	title: O(D.preferences),
	commandPrompt: O(D.showPreferences),
	order: 0,
	async loadView() {
		return new (await (en())).SettingsScreen.GenericSettingsTab();
	},
	iconName: "gear"
}), l({
	location: d.SETTINGS_VIEW,
	id: "workspace",
	title: O(D.workspace),
	commandPrompt: O(D.showWorkspace),
	order: 1,
	async loadView() {
		return new (await (en())).WorkspaceSettingsTab.WorkspaceSettingsTab();
	},
	iconName: "folder"
}), l({
	location: d.SETTINGS_VIEW,
	id: "chrome-ai",
	title: O(D.aiInnovations),
	commandPrompt: O(D.showAiInnovations),
	order: 2,
	async loadView() {
		return new (await (en())).AISettingsTab.AISettingsTab();
	},
	iconName: "button-magic",
	settings: ["console-insights-enabled"],
	condition: (e) => (e?.aidaAvailability?.enabled && (e?.devToolsConsoleInsights?.enabled || e?.devToolsFreestyler?.enabled)) ?? !1
}), l({
	location: d.SETTINGS_VIEW,
	id: "experiments",
	title: O(D.experiments),
	commandPrompt: O(D.showExperiments),
	order: 3,
	experiment: Ce.ALL,
	async loadView() {
		return new (await (en())).SettingsScreen.ExperimentsSettingsTab();
	},
	iconName: "experiment"
}), l({
	location: d.SETTINGS_VIEW,
	id: "blackbox",
	title: O(D.ignoreList),
	commandPrompt: O(D.showIgnoreList),
	order: 4,
	async loadView() {
		return new (await (en())).FrameworkIgnoreListSettingsTab.FrameworkIgnoreListSettingsTab();
	},
	iconName: "clear-list"
}), l({
	location: d.SETTINGS_VIEW,
	id: "greendev-prototypes",
	title: O(D.greenDevProtoTypes),
	commandPrompt: O(D.showGreenDev),
	order: 101,
	async loadView() {
		return new (await (en())).SettingsScreen.GreenDevSettingsTab();
	},
	iconName: "experiment",
	condition: (e) => !!e?.devToolsGreenDevUi?.enabled
}), l({
	location: d.SETTINGS_VIEW,
	id: "keybinds",
	title: O(D.shortcuts),
	commandPrompt: O(D.showShortcuts),
	order: 100,
	async loadView() {
		return new (await (en())).KeybindsSettingsTab.KeybindsSettingsTab();
	},
	iconName: "keyboard"
}), p({
	category: h.SETTINGS,
	actionId: "settings.show",
	title: O(D.settings),
	async loadActionDelegate() {
		return new (await (en())).SettingsScreen.ActionDelegate();
	},
	iconClass: _.LARGEICON_SETTINGS_GEAR,
	bindings: [
		{
			shortcut: "F1",
			keybindSets: [v.DEVTOOLS_DEFAULT]
		},
		{ shortcut: "Shift+?" },
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+,",
			keybindSets: [v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+,",
			keybindSets: [v.VS_CODE]
		}
	]
}), p({
	category: h.SETTINGS,
	actionId: "settings.documentation",
	title: O(D.documentation),
	async loadActionDelegate() {
		return new (await (en())).SettingsScreen.ActionDelegate();
	}
}), p({
	category: h.SETTINGS,
	actionId: "settings.shortcuts",
	title: O(D.showShortcuts),
	async loadActionDelegate() {
		return new (await (en())).SettingsScreen.ActionDelegate();
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+K Ctrl+S",
		keybindSets: [v.VS_CODE]
	}, {
		platform: f.MAC,
		shortcut: "Meta+K Meta+S",
		keybindSets: [v.VS_CODE]
	}]
}), We({
	name: d.SETTINGS_VIEW,
	category: ge.SETTINGS,
	async loadResolver() {
		return (await en()).SettingsScreen.SettingsScreen.instance();
	}
}), t({
	contextTypes() {
		return [
			ie,
			Xe,
			Ge
		];
	},
	async loadRevealer() {
		return new (await (en())).SettingsScreen.Revealer();
	}
}), y({
	location: b.MAIN_MENU_FOOTER,
	actionId: "settings.shortcuts"
}), y({
	location: b.MAIN_MENU_HELP_DEFAULT,
	actionId: "settings.documentation"
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/protocol_monitor/protocol_monitor-meta.ts
var tn = {
	protocolMonitor: "Protocol monitor",
	showProtocolMonitor: "Show Protocol monitor"
}, nn = n("panels/protocol_monitor/protocol_monitor-meta.ts", tn), rn = e.bind(void 0, nn), an;
async function on() {
	return an ||= await import("../../chunks/protocol_monitor-BzX6rcsq.js"), an;
}
l({
	location: d.DRAWER_VIEW,
	id: "protocol-monitor",
	title: rn(tn.protocolMonitor),
	commandPrompt: rn(tn.showProtocolMonitor),
	order: 100,
	persistence: u.CLOSEABLE,
	async loadView() {
		return new (await (on())).ProtocolMonitor.ProtocolMonitorImpl();
	},
	experiment: Ce.PROTOCOL_MONITOR
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/persistence/persistence-meta.ts
var sn = {
	localOverrides: "Local overrides",
	interception: "interception",
	override: "override",
	network: "network",
	rewrite: "rewrite",
	request: "request",
	enableOverrideNetworkRequests: "Enable override network requests",
	disableOverrideNetworkRequests: "Disable override network requests"
}, cn = n("models/persistence/persistence-meta.ts", sn), ln = e.bind(void 0, cn);
o({
	category: c.PERSISTENCE,
	title: ln(sn.localOverrides),
	settingName: "persistence-network-overrides-enabled",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	tags: [
		ln(sn.interception),
		ln(sn.override),
		ln(sn.network),
		ln(sn.rewrite),
		ln(sn.request)
	],
	options: [{
		value: !0,
		title: ln(sn.enableOverrideNetworkRequests)
	}, {
		value: !1,
		title: ln(sn.disableOverrideNetworkRequests)
	}]
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/logs/logs-meta.ts
var un = {
	preserveLog: "Preserve log",
	preserve: "preserve",
	clear: "clear",
	reset: "reset",
	preserveLogOnPageReload: "Preserve log on page reload / navigation",
	doNotPreserveLogOnPageReload: "Do not preserve log on page reload / navigation",
	recordNetworkLog: "Record network log"
}, dn = n("models/logs/logs-meta.ts", un), fn = e.bind(void 0, dn);
o({
	category: c.NETWORK,
	title: fn(un.preserveLog),
	settingName: "network-log.preserve-log",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	tags: [
		fn(un.preserve),
		fn(un.clear),
		fn(un.reset)
	],
	options: [{
		value: !0,
		title: fn(un.preserveLogOnPageReload)
	}, {
		value: !1,
		title: fn(un.doNotPreserveLogOnPageReload)
	}]
}), o({
	category: c.NETWORK,
	title: fn(un.recordNetworkLog),
	settingName: "network-log.record-log",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	storageType: s.SESSION
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/main/main-meta.ts
var k = {
	focusDebuggee: "Focus page",
	toggleDrawer: "Toggle drawer",
	nextPanel: "Next panel",
	previousPanel: "Previous panel",
	reloadDevtools: "Reload DevTools",
	restoreLastDockPosition: "Restore last dock position",
	zoomIn: "Zoom in",
	zoomOut: "Zoom out",
	resetZoomLevel: "Reset zoom level",
	searchInPanel: "Search in panel",
	cancelSearch: "Cancel search",
	findNextResult: "Find next result",
	findPreviousResult: "Find previous result",
	theme: "Theme:",
	switchToBrowserPreferredTheme: "Switch to browser's preferred theme",
	autoTheme: "Auto",
	switchToLightTheme: "Switch to light theme",
	lightCapital: "Light",
	switchToDarkTheme: "Switch to dark theme",
	darkCapital: "Dark",
	darkLower: "dark",
	lightLower: "light",
	panelLayout: "Panel layout:",
	useHorizontalPanelLayout: "Use horizontal panel layout",
	horizontal: "horizontal",
	useVerticalPanelLayout: "Use vertical panel layout",
	vertical: "vertical",
	useAutomaticPanelLayout: "Use automatic panel layout",
	auto: "auto",
	enableCtrlShortcutToSwitchPanels: "Use Ctrl + 1-9 to switch panels",
	enableShortcutToSwitchPanels: "Use ⌘ + 1-9 to switch panels",
	right: "Right",
	dockToRight: "Dock to right",
	bottom: "Bottom",
	dockToBottom: "Dock to bottom",
	left: "Left",
	dockToLeft: "Dock to left",
	undocked: "Undocked",
	undockIntoSeparateWindow: "Undock into separate window",
	devtoolsDefault: "DevTools (Default)",
	language: "Language:",
	browserLanguage: "Browser UI language",
	saveSettings: "Save `DevTools` settings to your `Google` account",
	earnBadges: "Earn badges",
	searchAsYouTypeSetting: "Search as you type",
	searchAsYouTypeCommand: "Enable search as you type",
	searchOnEnterCommand: "Disable search as you type (press Enter to search)",
	matchChromeColorScheme: "Match Chrome color scheme",
	matchChromeColorSchemeDocumentation: "Match DevTools colors to your customized Chrome theme (when enabled)",
	matchChromeColorSchemeCommand: "Match Chrome color scheme",
	dontMatchChromeColorSchemeCommand: "Don't match Chrome color scheme",
	toggleDrawerOrientation: "Toggle drawer orientation"
}, pn = n("entrypoints/main/main-meta.ts", k), A = e.bind(void 0, pn), mn, hn;
async function gn() {
	return mn ||= await import("../../chunks/main-CbxrZ9aG.js"), mn;
}
async function _n() {
	return hn ||= await import("../../chunks/inspector_main-BFYGyw-S.js"), hn;
}
p({
	category: h.DRAWER,
	actionId: "inspector-main.focus-debuggee",
	async loadActionDelegate() {
		return new (await (_n())).InspectorMain.FocusDebuggeeActionDelegate();
	},
	order: 100,
	title: A(k.focusDebuggee)
}), p({
	category: h.DRAWER,
	actionId: "main.toggle-drawer",
	async loadActionDelegate() {
		return new de();
	},
	order: 101,
	title: A(k.toggleDrawer),
	bindings: [{ shortcut: "Esc" }]
}), p({
	category: h.DRAWER,
	actionId: "main.toggle-drawer-orientation",
	async loadActionDelegate() {
		return new de();
	},
	title: A(k.toggleDrawerOrientation),
	bindings: [{ shortcut: "Shift+Esc" }],
	condition: (e) => !!e?.devToolsFlexibleLayout?.verticalDrawerEnabled
}), p({
	actionId: "main.next-tab",
	category: h.GLOBAL,
	title: A(k.nextPanel),
	async loadActionDelegate() {
		return new de();
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+]"
	}, {
		platform: f.MAC,
		shortcut: "Meta+]"
	}]
}), p({
	actionId: "main.previous-tab",
	category: h.GLOBAL,
	title: A(k.previousPanel),
	async loadActionDelegate() {
		return new de();
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+["
	}, {
		platform: f.MAC,
		shortcut: "Meta+["
	}]
}), p({
	actionId: "main.debug-reload",
	category: h.GLOBAL,
	title: A(k.reloadDevtools),
	async loadActionDelegate() {
		return new (await (gn())).MainImpl.ReloadActionDelegate();
	},
	bindings: [{ shortcut: "Alt+R" }]
}), p({
	category: h.GLOBAL,
	title: A(k.restoreLastDockPosition),
	actionId: "main.toggle-dock",
	async loadActionDelegate() {
		return new xe();
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+Shift+D"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Shift+D"
	}]
}), p({
	actionId: "main.zoom-in",
	category: h.GLOBAL,
	title: A(k.zoomIn),
	async loadActionDelegate() {
		return new (await (gn())).MainImpl.ZoomActionDelegate();
	},
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Plus",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+Plus"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+NumpadPlus"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+NumpadPlus"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Plus",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Shift+Plus"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+NumpadPlus"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Shift+NumpadPlus"
		}
	]
}), p({
	actionId: "main.zoom-out",
	category: h.GLOBAL,
	title: A(k.zoomOut),
	async loadActionDelegate() {
		return new (await (gn())).MainImpl.ZoomActionDelegate();
	},
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Minus",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+Minus"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+NumpadMinus"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+NumpadMinus"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Minus",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Shift+Minus"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+NumpadMinus"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Shift+NumpadMinus"
		}
	]
}), p({
	actionId: "main.zoom-reset",
	category: h.GLOBAL,
	title: A(k.resetZoomLevel),
	async loadActionDelegate() {
		return new (await (gn())).MainImpl.ZoomActionDelegate();
	},
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+0"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Numpad0"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Numpad0"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+0"
		}
	]
}), p({
	actionId: "main.search-in-panel.find",
	category: h.GLOBAL,
	title: A(k.searchInPanel),
	async loadActionDelegate() {
		return new (await (gn())).MainImpl.SearchActionDelegate();
	},
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+F",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+F",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "F3"
		}
	]
}), p({
	actionId: "main.search-in-panel.cancel",
	category: h.GLOBAL,
	title: A(k.cancelSearch),
	async loadActionDelegate() {
		return new (await (gn())).MainImpl.SearchActionDelegate();
	},
	order: 10,
	bindings: [{ shortcut: "Esc" }]
}), p({
	actionId: "main.search-in-panel.find-next",
	category: h.GLOBAL,
	title: A(k.findNextResult),
	async loadActionDelegate() {
		return new (await (gn())).MainImpl.SearchActionDelegate();
	},
	bindings: [
		{
			platform: f.MAC,
			shortcut: "Meta+G",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+G"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "F3",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		}
	]
}), p({
	actionId: "main.search-in-panel.find-previous",
	category: h.GLOBAL,
	title: A(k.findPreviousResult),
	async loadActionDelegate() {
		return new (await (gn())).MainImpl.SearchActionDelegate();
	},
	bindings: [
		{
			platform: f.MAC,
			shortcut: "Meta+Shift+G",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+G"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Shift+F3",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		}
	]
}), o({
	category: c.APPEARANCE,
	storageType: s.SYNCED,
	title: A(k.theme),
	settingName: "ui-theme",
	settingType: a.ENUM,
	defaultValue: "systemPreferred",
	reloadRequired: !1,
	options: [
		{
			title: A(k.switchToBrowserPreferredTheme),
			text: A(k.autoTheme),
			value: "systemPreferred"
		},
		{
			title: A(k.switchToLightTheme),
			text: A(k.lightCapital),
			value: "default"
		},
		{
			title: A(k.switchToDarkTheme),
			text: A(k.darkCapital),
			value: "dark"
		}
	],
	tags: [A(k.darkLower), A(k.lightLower)]
}), o({
	category: c.APPEARANCE,
	storageType: s.SYNCED,
	title: A(k.matchChromeColorScheme),
	settingName: "chrome-theme-colors",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: A(k.matchChromeColorSchemeCommand)
	}, {
		value: !1,
		title: A(k.dontMatchChromeColorSchemeCommand)
	}],
	reloadRequired: !0,
	learnMore: {
		url: "https://goo.gle/devtools-customize-theme",
		tooltip: A(k.matchChromeColorSchemeDocumentation)
	}
}), o({
	category: c.APPEARANCE,
	storageType: s.SYNCED,
	title: A(k.panelLayout),
	settingName: "sidebar-position",
	settingType: a.ENUM,
	defaultValue: "auto",
	options: [
		{
			title: A(k.useHorizontalPanelLayout),
			text: A(k.horizontal),
			value: "bottom"
		},
		{
			title: A(k.useVerticalPanelLayout),
			text: A(k.vertical),
			value: "right"
		},
		{
			title: A(k.useAutomaticPanelLayout),
			text: A(k.auto),
			value: "auto"
		}
	]
}), o({
	category: c.APPEARANCE,
	storageType: s.SYNCED,
	settingName: "language",
	settingType: a.ENUM,
	title: A(k.language),
	defaultValue: "en-US",
	options: [{
		value: "browserLanguage",
		title: A(k.browserLanguage),
		text: A(k.browserLanguage)
	}, ...oe().sort().map((e) => yn(e))],
	reloadRequired: !0
}), o({
	category: c.APPEARANCE,
	storageType: s.SYNCED,
	title: se() === "mac" ? A(k.enableShortcutToSwitchPanels) : A(k.enableCtrlShortcutToSwitchPanels),
	settingName: "shortcut-panel-switch",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	category: c.GLOBAL,
	settingName: "currentDockState",
	settingType: a.ENUM,
	defaultValue: "right",
	options: [
		{
			value: "right",
			text: A(k.right),
			title: A(k.dockToRight)
		},
		{
			value: "bottom",
			text: A(k.bottom),
			title: A(k.dockToBottom)
		},
		{
			value: "left",
			text: A(k.left),
			title: A(k.dockToLeft)
		},
		{
			value: "undocked",
			text: A(k.undocked),
			title: A(k.undockIntoSeparateWindow)
		}
	]
}), o({
	storageType: s.SYNCED,
	settingName: "active-keybind-set",
	settingType: a.ENUM,
	defaultValue: "devToolsDefault",
	options: [{
		value: "devToolsDefault",
		title: A(k.devtoolsDefault),
		text: A(k.devtoolsDefault)
	}, {
		value: "vsCode",
		title: i("Visual Studio Code"),
		text: i("Visual Studio Code")
	}]
});
function vn(e) {
	return () => te(e, ne.instance());
}
function yn(e) {
	return {
		value: e,
		title: vn(e),
		text: vn(e)
	};
}
o({
	category: c.ACCOUNT,
	settingName: "sync-preferences",
	settingType: a.BOOLEAN,
	title: A(k.saveSettings),
	defaultValue: !1,
	reloadRequired: !0
}), o({
	category: c.ACCOUNT,
	settingName: "receive-gdp-badges",
	settingType: a.BOOLEAN,
	storageType: s.SYNCED,
	title: A(k.earnBadges),
	defaultValue: !1,
	reloadRequired: !0
}), o({
	storageType: s.SYNCED,
	settingName: "user-shortcuts",
	settingType: a.ARRAY,
	defaultValue: []
}), o({
	category: c.GLOBAL,
	storageType: s.LOCAL,
	title: A(k.searchAsYouTypeSetting),
	settingName: "search-as-you-type",
	settingType: a.BOOLEAN,
	order: 3,
	defaultValue: !0,
	options: [{
		value: !0,
		title: A(k.searchAsYouTypeCommand)
	}, {
		value: !1,
		title: A(k.searchOnEnterCommand)
	}]
}), We({
	name: d.DRAWER_VIEW,
	category: ge.DRAWER,
	async loadResolver() {
		return ve.instance();
	}
}), We({
	name: d.DRAWER_SIDEBAR,
	category: ge.DRAWER_SIDEBAR,
	async loadResolver() {
		return ve.instance();
	}
}), We({
	name: d.PANEL,
	category: ge.PANEL,
	async loadResolver() {
		return ve.instance();
	}
}), we({
	contextTypes() {
		return [
			$e,
			De,
			_e
		];
	},
	async loadProvider() {
		return new it();
	}
}), we({
	contextTypes() {
		return [Node];
	},
	async loadProvider() {
		return new ue();
	}
}), we({
	contextTypes() {
		return [Node];
	},
	async loadProvider() {
		return new rt();
	}
}), m({
	separator: !0,
	location: g.MAIN_TOOLBAR_LEFT,
	order: 100
}), m({
	separator: !0,
	order: 96,
	location: g.MAIN_TOOLBAR_RIGHT
}), m({
	condition(e) {
		let t = e?.devToolsGlobalAiButton?.enabled, ee = e?.aidaAvailability?.blockedByGeo === !0, n = e?.aidaAvailability?.blockedByEnterprisePolicy === !0;
		return !(!t || ee || n);
	},
	async loadItem() {
		return (await gn()).GlobalAiButton.GlobalAiButtonToolbarProvider.instance();
	},
	order: 98,
	location: g.MAIN_TOOLBAR_RIGHT
}), m({
	async loadItem() {
		return (await gn()).MainImpl.SettingsButtonProvider.instance();
	},
	order: 99,
	location: g.MAIN_TOOLBAR_RIGHT
}), m({
	condition: () => !Je.isTraceApp(),
	async loadItem() {
		return (await gn()).MainImpl.MainMenuItem.instance();
	},
	order: 100,
	location: g.MAIN_TOOLBAR_RIGHT
}), m({
	async loadItem() {
		return ye.instance();
	},
	order: 101,
	location: g.MAIN_TOOLBAR_RIGHT
}), He({
	async loadAppProvider() {
		return (await gn()).SimpleApp.SimpleAppProvider.instance();
	},
	order: 10
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/perf_ui/perf_ui-meta.ts
var bn = {
	flamechartSelectedNavigation: "Flamechart navigation:",
	modern: "Modern",
	classic: "Classic",
	collectGarbage: "Collect garbage"
}, xn = n("ui/legacy/components/perf_ui/perf_ui-meta.ts", bn), Sn = e.bind(void 0, xn), Cn;
async function wn() {
	return Cn ||= await import("../../chunks/perf_ui-Ch09Shon.js"), Cn;
}
p({
	actionId: "components.collect-garbage",
	category: h.PERFORMANCE,
	title: Sn(bn.collectGarbage),
	iconClass: _.MOP,
	async loadActionDelegate() {
		return new (await (wn())).GCActionDelegate.GCActionDelegate();
	}
}), o({
	category: c.PERFORMANCE,
	storageType: s.SYNCED,
	title: Sn(bn.flamechartSelectedNavigation),
	settingName: "flamechart-selected-navigation",
	settingType: a.ENUM,
	defaultValue: "classic",
	options: [{
		title: Sn(bn.modern),
		text: Sn(bn.modern),
		value: "modern"
	}, {
		title: Sn(bn.classic),
		text: Sn(bn.classic),
		value: "classic"
	}]
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/quick_open/quick_open-meta.ts
var Tn = {
	openFile: "Open file",
	runCommand: "Run command"
}, En = n("ui/legacy/components/quick_open/quick_open-meta.ts", Tn), Dn = e.bind(void 0, En), On;
async function kn() {
	return On ||= await import("../../chunks/quick_open-Elz6wiNU.js"), On;
}
p({
	actionId: "quick-open.show-command-menu",
	category: h.GLOBAL,
	title: Dn(Tn.runCommand),
	async loadActionDelegate() {
		return new (await (kn())).CommandMenu.ShowActionDelegate();
	},
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+P",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+Shift+P",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			shortcut: "F1",
			keybindSets: [v.VS_CODE]
		}
	]
}), p({
	actionId: "quick-open.show",
	category: h.GLOBAL,
	title: Dn(Tn.openFile),
	async loadActionDelegate() {
		return new (await (kn())).QuickOpen.ShowActionDelegate();
	},
	order: 100,
	bindings: [
		{
			platform: f.MAC,
			shortcut: "Meta+P",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.MAC,
			shortcut: "Meta+O",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+P",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+O",
			keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
		}
	]
}), y({
	location: b.MAIN_MENU_DEFAULT,
	actionId: "quick-open.show-command-menu"
}), y({
	location: b.MAIN_MENU_DEFAULT,
	actionId: "quick-open.show"
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/sdk/sdk-meta.ts
var j = {
	preserveLogUponNavigation: "Preserve log upon navigation",
	doNotPreserveLogUponNavigation: "Do not preserve log upon navigation",
	pauseOnExceptions: "Pause on exceptions",
	doNotPauseOnExceptions: "Do not pause on exceptions",
	disableJavascript: "Disable JavaScript",
	enableJavascript: "Enable JavaScript",
	disableAsyncStackTraces: "Disable async stack traces",
	doNotCaptureAsyncStackTraces: "Do not capture async stack traces",
	captureAsyncStackTraces: "Capture async stack traces",
	rulersOnHover: "Rulers on hover",
	showRulersOnHover: "Show rulers on hover",
	doNotShowRulersOnHover: "Don't show rulers on hover",
	showAreaNames: "Show area names",
	showGridNamedAreas: "Show grid named areas",
	doNotShowGridNamedAreas: "Do not show grid named areas",
	showTrackSizes: "Show track sizes",
	showGridTrackSizes: "Show grid track sizes",
	doNotShowGridTrackSizes: "Do not show grid track sizes",
	extendGridLines: "Extend grid lines",
	doNotExtendGridLines: "Do not extend grid lines",
	showLineLabels: "Show line labels",
	hideLineLabels: "Hide line labels",
	showLineNumbers: "Show line numbers",
	showLineNames: "Show line names",
	showPaintFlashingRectangles: "Show paint flashing rectangles",
	hidePaintFlashingRectangles: "Hide paint flashing rectangles",
	showLayoutShiftRegions: "Show layout shift regions",
	hideLayoutShiftRegions: "Hide layout shift regions",
	highlightAdFrames: "Highlight ad frames",
	doNotHighlightAdFrames: "Do not highlight ad frames",
	showLayerBorders: "Show layer borders",
	hideLayerBorders: "Hide layer borders",
	showFramesPerSecondFpsMeter: "Show frames per second (FPS) meter",
	hideFramesPerSecondFpsMeter: "Hide frames per second (FPS) meter",
	showScrollPerformanceBottlenecks: "Show scroll performance bottlenecks",
	hideScrollPerformanceBottlenecks: "Hide scroll performance bottlenecks",
	emulateAFocusedPage: "Emulate a focused page",
	doNotEmulateAFocusedPage: "Do not emulate a focused page",
	doNotEmulateCssMediaType: "Do not emulate CSS media type",
	noEmulation: "No emulation",
	emulateCssPrintMediaType: "Emulate CSS print media type",
	print: "print",
	emulateCssScreenMediaType: "Emulate CSS screen media type",
	screen: "screen",
	query: "query",
	emulateCssMediaType: "Emulate CSS media type",
	doNotEmulateCss: "Do not emulate CSS {PH1}",
	emulateCss: "Emulate CSS {PH1}",
	emulateCssMediaFeature: "Emulate CSS media feature {PH1}",
	doNotEmulateAnyVisionDeficiency: "Do not emulate any vision deficiency",
	emulateBlurredVision: "Emulate blurred vision",
	emulateReducedContrast: "Emulate reduced contrast",
	blurredVision: "Blurred vision",
	reducedContrast: "Reduced contrast",
	emulateProtanopia: "Emulate protanopia (no red)",
	protanopia: "Protanopia (no red)",
	emulateDeuteranopia: "Emulate deuteranopia (no green)",
	deuteranopia: "Deuteranopia (no green)",
	emulateTritanopia: "Emulate tritanopia (no blue)",
	tritanopia: "Tritanopia (no blue)",
	emulateAchromatopsia: "Emulate achromatopsia (no color)",
	achromatopsia: "Achromatopsia (no color)",
	emulateVisionDeficiencies: "Emulate vision deficiencies",
	emulateOsTextScale: "Emulate OS text scale",
	doNotEmulateOsTextScale: "Do not emulate OS text scale",
	osTextScaleEmulationNone: "No emulation",
	osTextScaleEmulation85: "85%",
	osTextScaleEmulation100: "100% (default)",
	osTextScaleEmulation115: "115%",
	osTextScaleEmulation130: "130%",
	osTextScaleEmulation150: "150%",
	osTextScaleEmulation180: "180%",
	osTextScaleEmulation200: "200%",
	disableLocalFonts: "Disable local fonts",
	enableLocalFonts: "Enable local fonts",
	disableAvifFormat: "Disable `AVIF` format",
	enableAvifFormat: "Enable `AVIF` format",
	disableJpegXlFormat: "Disable `JPEG XL` format",
	enableJpegXlFormat: "Enable `JPEG XL` format",
	disableWebpFormat: "Disable `WebP` format",
	enableWebpFormat: "Enable `WebP` format",
	customFormatters: "Custom formatters",
	networkRequestBlocking: "Network request blocking",
	enableNetworkRequestBlocking: "Enable network request blocking",
	disableNetworkRequestBlocking: "Disable network request blocking",
	enableCache: "Enable cache",
	disableCache: "Disable cache while DevTools is open",
	emulateAutoDarkMode: "Emulate auto dark mode",
	enableRemoteFileLoading: "Allow loading remote file path resources in DevTools",
	remoteFileLoadingInfo: "Example resource are source maps. Disabled by default for security reasons.",
	networkCacheExplanation: "Disabling the network cache will simulate a network experience similar to a first time visitor.",
	javaScriptSourceMaps: "JavaScript source maps",
	enableJavaScriptSourceMaps: "Enable JavaScript source maps",
	disableJavaScriptSourceMaps: "Disable JavaScript source maps",
	cssSourceMaps: "CSS source maps",
	enableCssSourceMaps: "Enable CSS source maps",
	disableCssSourceMaps: "Disable CSS source maps",
	logXmlhttprequests: "Log XMLHttpRequests",
	apca: "Advanced Perceptual Contrast Algorithm (APCA) replacing previous contrast ratio and AA/AAA guidelines"
}, An = n("core/sdk/sdk-meta.ts", j), M = e.bind(void 0, An);
o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: M(j.preserveLogUponNavigation),
	settingName: "preserve-console-log",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	options: [{
		value: !0,
		title: M(j.preserveLogUponNavigation)
	}, {
		value: !1,
		title: M(j.doNotPreserveLogUponNavigation)
	}]
}), o({
	category: c.DEBUGGER,
	settingName: "pause-on-exception-enabled",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	options: [{
		value: !0,
		title: M(j.pauseOnExceptions)
	}, {
		value: !1,
		title: M(j.doNotPauseOnExceptions)
	}]
}), o({
	settingName: "pause-on-caught-exception",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	settingName: "pause-on-uncaught-exception",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	category: c.DEBUGGER,
	title: M(j.disableJavascript),
	settingName: "java-script-disabled",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	order: 1,
	defaultValue: !1,
	options: [{
		value: !0,
		title: M(j.disableJavascript)
	}, {
		value: !1,
		title: M(j.enableJavascript)
	}]
}), o({
	category: c.DEBUGGER,
	title: M(j.disableAsyncStackTraces),
	settingName: "disable-async-stack-traces",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	order: 2,
	options: [{
		value: !0,
		title: M(j.doNotCaptureAsyncStackTraces)
	}, {
		value: !1,
		title: M(j.captureAsyncStackTraces)
	}]
}), o({
	category: c.DEBUGGER,
	settingName: "breakpoints-active",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	defaultValue: !0
}), o({
	category: c.ELEMENTS,
	storageType: s.SYNCED,
	title: M(j.rulersOnHover),
	settingName: "show-metrics-rulers",
	settingType: a.BOOLEAN,
	options: [{
		value: !0,
		title: M(j.showRulersOnHover)
	}, {
		value: !1,
		title: M(j.doNotShowRulersOnHover)
	}],
	defaultValue: !1
}), o({
	category: c.ELEMENTS,
	storageType: s.SYNCED,
	title: M(j.apca),
	settingName: "apca",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	category: c.GRID,
	storageType: s.SYNCED,
	title: M(j.showAreaNames),
	settingName: "show-grid-areas",
	settingType: a.BOOLEAN,
	options: [{
		value: !0,
		title: M(j.showGridNamedAreas)
	}, {
		value: !1,
		title: M(j.doNotShowGridNamedAreas)
	}],
	defaultValue: !1
}), o({
	category: c.GRID,
	storageType: s.SYNCED,
	title: M(j.showTrackSizes),
	settingName: "show-grid-track-sizes",
	settingType: a.BOOLEAN,
	options: [{
		value: !0,
		title: M(j.showGridTrackSizes)
	}, {
		value: !1,
		title: M(j.doNotShowGridTrackSizes)
	}],
	defaultValue: !1
}), o({
	category: c.GRID,
	storageType: s.SYNCED,
	title: M(j.extendGridLines),
	settingName: "extend-grid-lines",
	settingType: a.BOOLEAN,
	options: [{
		value: !0,
		title: M(j.extendGridLines)
	}, {
		value: !1,
		title: M(j.doNotExtendGridLines)
	}],
	defaultValue: !1
}), o({
	category: c.GRID,
	storageType: s.SYNCED,
	title: M(j.showLineLabels),
	settingName: "show-grid-line-labels",
	settingType: a.ENUM,
	options: [
		{
			title: M(j.hideLineLabels),
			text: M(j.hideLineLabels),
			value: "none"
		},
		{
			title: M(j.showLineNumbers),
			text: M(j.showLineNumbers),
			value: "lineNumbers"
		},
		{
			title: M(j.showLineNames),
			text: M(j.showLineNames),
			value: "lineNames"
		}
	],
	defaultValue: "lineNumbers"
}), o({
	category: c.RENDERING,
	settingName: "show-paint-rects",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	options: [{
		value: !0,
		title: M(j.showPaintFlashingRectangles)
	}, {
		value: !1,
		title: M(j.hidePaintFlashingRectangles)
	}],
	defaultValue: !1
}), o({
	category: c.RENDERING,
	settingName: "show-layout-shift-regions",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	options: [{
		value: !0,
		title: M(j.showLayoutShiftRegions)
	}, {
		value: !1,
		title: M(j.hideLayoutShiftRegions)
	}],
	defaultValue: !1
}), o({
	category: c.RENDERING,
	settingName: "show-ad-highlights",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	options: [{
		value: !0,
		title: M(j.highlightAdFrames)
	}, {
		value: !1,
		title: M(j.doNotHighlightAdFrames)
	}],
	defaultValue: !1
}), o({
	category: c.RENDERING,
	settingName: "show-debug-borders",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	options: [{
		value: !0,
		title: M(j.showLayerBorders)
	}, {
		value: !1,
		title: M(j.hideLayerBorders)
	}],
	defaultValue: !1
}), o({
	category: c.RENDERING,
	settingName: "show-fps-counter",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	options: [{
		value: !0,
		title: M(j.showFramesPerSecondFpsMeter)
	}, {
		value: !1,
		title: M(j.hideFramesPerSecondFpsMeter)
	}],
	defaultValue: !1
}), o({
	category: c.RENDERING,
	settingName: "show-scroll-bottleneck-rects",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	options: [{
		value: !0,
		title: M(j.showScrollPerformanceBottlenecks)
	}, {
		value: !1,
		title: M(j.hideScrollPerformanceBottlenecks)
	}],
	defaultValue: !1
}), o({
	category: c.RENDERING,
	title: M(j.emulateAFocusedPage),
	settingName: "emulate-page-focus",
	settingType: a.BOOLEAN,
	storageType: s.LOCAL,
	defaultValue: !1,
	options: [{
		value: !0,
		title: M(j.emulateAFocusedPage)
	}, {
		value: !1,
		title: M(j.doNotEmulateAFocusedPage)
	}]
}), o({
	category: c.RENDERING,
	settingName: "emulated-css-media",
	settingType: a.ENUM,
	storageType: s.SESSION,
	defaultValue: "",
	options: [
		{
			title: M(j.doNotEmulateCssMediaType),
			text: M(j.noEmulation),
			value: ""
		},
		{
			title: M(j.emulateCssPrintMediaType),
			text: M(j.print),
			value: "print"
		},
		{
			title: M(j.emulateCssScreenMediaType),
			text: M(j.screen),
			value: "screen"
		}
	],
	tags: [M(j.query)],
	title: M(j.emulateCssMediaType)
}), o({
	category: c.RENDERING,
	settingName: "emulated-css-media-feature-prefers-color-scheme",
	settingType: a.ENUM,
	storageType: s.SESSION,
	defaultValue: "",
	options: [
		{
			title: M(j.doNotEmulateCss, { PH1: "prefers-color-scheme" }),
			text: M(j.noEmulation),
			value: ""
		},
		{
			title: M(j.emulateCss, { PH1: "prefers-color-scheme: light" }),
			text: i("prefers-color-scheme: light"),
			value: "light"
		},
		{
			title: M(j.emulateCss, { PH1: "prefers-color-scheme: dark" }),
			text: i("prefers-color-scheme: dark"),
			value: "dark"
		}
	],
	tags: [M(j.query)],
	title: M(j.emulateCssMediaFeature, { PH1: "prefers-color-scheme" })
}), o({
	category: c.RENDERING,
	settingName: "emulated-css-media-feature-forced-colors",
	settingType: a.ENUM,
	storageType: s.SESSION,
	defaultValue: "",
	options: [
		{
			title: M(j.doNotEmulateCss, { PH1: "forced-colors" }),
			text: M(j.noEmulation),
			value: ""
		},
		{
			title: M(j.emulateCss, { PH1: "forced-colors: active" }),
			text: i("forced-colors: active"),
			value: "active"
		},
		{
			title: M(j.emulateCss, { PH1: "forced-colors: none" }),
			text: i("forced-colors: none"),
			value: "none"
		}
	],
	tags: [M(j.query)],
	title: M(j.emulateCssMediaFeature, { PH1: "forced-colors" })
}), o({
	category: c.RENDERING,
	settingName: "emulated-css-media-feature-prefers-reduced-motion",
	settingType: a.ENUM,
	storageType: s.SESSION,
	defaultValue: "",
	options: [{
		title: M(j.doNotEmulateCss, { PH1: "prefers-reduced-motion" }),
		text: M(j.noEmulation),
		value: ""
	}, {
		title: M(j.emulateCss, { PH1: "prefers-reduced-motion: reduce" }),
		text: i("prefers-reduced-motion: reduce"),
		value: "reduce"
	}],
	tags: [M(j.query)],
	title: M(j.emulateCssMediaFeature, { PH1: "prefers-reduced-motion" })
}), o({
	settingName: "emulated-css-media-feature-prefers-contrast",
	settingType: a.ENUM,
	storageType: s.SESSION,
	defaultValue: "",
	options: [
		{
			title: M(j.doNotEmulateCss, { PH1: "prefers-contrast" }),
			text: M(j.noEmulation),
			value: ""
		},
		{
			title: M(j.emulateCss, { PH1: "prefers-contrast: more" }),
			text: i("prefers-contrast: more"),
			value: "more"
		},
		{
			title: M(j.emulateCss, { PH1: "prefers-contrast: less" }),
			text: i("prefers-contrast: less"),
			value: "less"
		},
		{
			title: M(j.emulateCss, { PH1: "prefers-contrast: custom" }),
			text: i("prefers-contrast: custom"),
			value: "custom"
		}
	],
	tags: [M(j.query)],
	title: M(j.emulateCssMediaFeature, { PH1: "prefers-contrast" })
}), o({
	settingName: "emulated-css-media-feature-prefers-reduced-data",
	settingType: a.ENUM,
	storageType: s.SESSION,
	defaultValue: "",
	options: [{
		title: M(j.doNotEmulateCss, { PH1: "prefers-reduced-data" }),
		text: M(j.noEmulation),
		value: ""
	}, {
		title: M(j.emulateCss, { PH1: "prefers-reduced-data: reduce" }),
		text: i("prefers-reduced-data: reduce"),
		value: "reduce"
	}],
	title: M(j.emulateCssMediaFeature, { PH1: "prefers-reduced-data" })
}), o({
	settingName: "emulated-css-media-feature-prefers-reduced-transparency",
	settingType: a.ENUM,
	storageType: s.SESSION,
	defaultValue: "",
	options: [{
		title: M(j.doNotEmulateCss, { PH1: "prefers-reduced-transparency" }),
		text: M(j.noEmulation),
		value: ""
	}, {
		title: M(j.emulateCss, { PH1: "prefers-reduced-transparency: reduce" }),
		text: i("prefers-reduced-transparency: reduce"),
		value: "reduce"
	}],
	title: M(j.emulateCssMediaFeature, { PH1: "prefers-reduced-transparency" })
}), o({
	settingName: "emulated-css-media-feature-color-gamut",
	settingType: a.ENUM,
	storageType: s.SESSION,
	defaultValue: "",
	options: [
		{
			title: M(j.doNotEmulateCss, { PH1: "color-gamut" }),
			text: M(j.noEmulation),
			value: ""
		},
		{
			title: M(j.emulateCss, { PH1: "color-gamut: srgb" }),
			text: i("color-gamut: srgb"),
			value: "srgb"
		},
		{
			title: M(j.emulateCss, { PH1: "color-gamut: p3" }),
			text: i("color-gamut: p3"),
			value: "p3"
		},
		{
			title: M(j.emulateCss, { PH1: "color-gamut: rec2020" }),
			text: i("color-gamut: rec2020"),
			value: "rec2020"
		}
	],
	title: M(j.emulateCssMediaFeature, { PH1: "color-gamut" })
}), o({
	category: c.RENDERING,
	settingName: "emulated-vision-deficiency",
	settingType: a.ENUM,
	storageType: s.SESSION,
	defaultValue: "none",
	options: [
		{
			title: M(j.doNotEmulateAnyVisionDeficiency),
			text: M(j.noEmulation),
			value: "none"
		},
		{
			title: M(j.emulateBlurredVision),
			text: M(j.blurredVision),
			value: "blurredVision"
		},
		{
			title: M(j.emulateReducedContrast),
			text: M(j.reducedContrast),
			value: "reducedContrast"
		},
		{
			title: M(j.emulateProtanopia),
			text: M(j.protanopia),
			value: "protanopia"
		},
		{
			title: M(j.emulateDeuteranopia),
			text: M(j.deuteranopia),
			value: "deuteranopia"
		},
		{
			title: M(j.emulateTritanopia),
			text: M(j.tritanopia),
			value: "tritanopia"
		},
		{
			title: M(j.emulateAchromatopsia),
			text: M(j.achromatopsia),
			value: "achromatopsia"
		}
	],
	tags: [M(j.query)],
	title: M(j.emulateVisionDeficiencies)
}), o({
	category: c.RENDERING,
	settingName: "emulated-os-text-scale",
	settingType: a.ENUM,
	storageType: s.SESSION,
	defaultValue: "",
	options: [
		{
			title: M(j.doNotEmulateOsTextScale),
			text: M(j.osTextScaleEmulationNone),
			value: ""
		},
		{
			title: M(j.osTextScaleEmulation85),
			text: M(j.osTextScaleEmulation85),
			value: "0.85"
		},
		{
			title: M(j.osTextScaleEmulation100),
			text: M(j.osTextScaleEmulation100),
			value: "1"
		},
		{
			title: M(j.osTextScaleEmulation115),
			text: M(j.osTextScaleEmulation115),
			value: "1.15"
		},
		{
			title: M(j.osTextScaleEmulation130),
			text: M(j.osTextScaleEmulation130),
			value: "1.3"
		},
		{
			title: M(j.osTextScaleEmulation150),
			text: M(j.osTextScaleEmulation150),
			value: "1.5"
		},
		{
			title: M(j.osTextScaleEmulation180),
			text: M(j.osTextScaleEmulation180),
			value: "1.8"
		},
		{
			title: M(j.osTextScaleEmulation200),
			text: M(j.osTextScaleEmulation200),
			value: "2"
		}
	],
	tags: [M(j.query)],
	title: M(j.emulateOsTextScale)
}), o({
	category: c.RENDERING,
	settingName: "local-fonts-disabled",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	options: [{
		value: !0,
		title: M(j.disableLocalFonts)
	}, {
		value: !1,
		title: M(j.enableLocalFonts)
	}],
	defaultValue: !1
}), o({
	category: c.RENDERING,
	settingName: "avif-format-disabled",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	options: [{
		value: !0,
		title: M(j.disableAvifFormat)
	}, {
		value: !1,
		title: M(j.enableAvifFormat)
	}],
	defaultValue: !1
}), o({
	category: c.RENDERING,
	settingName: "jpeg-xl-format-disabled",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	options: [{
		value: !0,
		title: M(j.disableJpegXlFormat)
	}, {
		value: !1,
		title: M(j.enableJpegXlFormat)
	}],
	defaultValue: !1
}), o({
	category: c.RENDERING,
	settingName: "webp-format-disabled",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	options: [{
		value: !0,
		title: M(j.disableWebpFormat)
	}, {
		value: !1,
		title: M(j.enableWebpFormat)
	}],
	defaultValue: !1
}), o({
	category: c.CONSOLE,
	title: M(j.customFormatters),
	settingName: "custom-formatters",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	category: c.NETWORK,
	title: M(j.networkRequestBlocking),
	settingName: "request-blocking-enabled",
	settingType: a.BOOLEAN,
	storageType: s.LOCAL,
	defaultValue: !1,
	options: [{
		value: !0,
		title: M(j.enableNetworkRequestBlocking)
	}, {
		value: !1,
		title: M(j.disableNetworkRequestBlocking)
	}]
}), o({
	category: c.NETWORK,
	title: M(j.disableCache),
	settingName: "cache-disabled",
	settingType: a.BOOLEAN,
	order: 0,
	defaultValue: !1,
	userActionCondition: "hasOtherClients",
	options: [{
		value: !0,
		title: M(j.disableCache)
	}, {
		value: !1,
		title: M(j.enableCache)
	}],
	learnMore: { tooltip: M(j.networkCacheExplanation) }
}), o({
	category: c.RENDERING,
	title: M(j.emulateAutoDarkMode),
	settingName: "emulate-auto-dark-mode",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	defaultValue: !1
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: M(j.enableRemoteFileLoading),
	settingName: "network.enable-remote-file-loading",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	learnMore: { tooltip: M(j.remoteFileLoadingInfo) }
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: M(j.javaScriptSourceMaps),
	settingName: "js-source-maps-enabled",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: M(j.enableJavaScriptSourceMaps)
	}, {
		value: !1,
		title: M(j.disableJavaScriptSourceMaps)
	}]
}), o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: M(j.cssSourceMaps),
	settingName: "css-source-maps-enabled",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: M(j.enableCssSourceMaps)
	}, {
		value: !1,
		title: M(j.disableCssSourceMaps)
	}]
}), o({
	category: c.CONSOLE,
	storageType: s.SYNCED,
	title: M(j.logXmlhttprequests),
	settingName: "monitoring-xhr-enabled",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	storageType: s.SYNCED,
	settingName: "skip-stack-frames-pattern",
	settingType: a.REGEX,
	defaultValue: "/node_modules/|^node:"
}), o({
	storageType: s.SYNCED,
	settingName: "skip-content-scripts",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), o({
	storageType: s.SYNCED,
	settingName: "automatically-ignore-list-known-third-party-scripts",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), o({
	storageType: s.SYNCED,
	settingName: "skip-anonymous-scripts",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	storageType: s.SYNCED,
	settingName: "enable-ignore-listing",
	settingType: a.BOOLEAN,
	defaultValue: !0
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/source_frame/source_frame-meta.ts
var jn = {
	defaultIndentation: "Default indentation:",
	setIndentationToSpaces: "Set indentation to 2 spaces",
	Spaces: "2 spaces",
	setIndentationToFSpaces: "Set indentation to 4 spaces",
	fSpaces: "4 spaces",
	setIndentationToESpaces: "Set indentation to 8 spaces",
	eSpaces: "8 spaces",
	setIndentationToTabCharacter: "Set indentation to tab character",
	tabCharacter: "Tab character"
}, Mn = n("ui/legacy/components/source_frame/source_frame-meta.ts", jn), Nn = e.bind(void 0, Mn);
o({
	category: c.SOURCES,
	storageType: s.SYNCED,
	title: Nn(jn.defaultIndentation),
	settingName: "text-editor-indent",
	settingType: a.ENUM,
	defaultValue: "    ",
	options: [
		{
			title: Nn(jn.setIndentationToSpaces),
			text: Nn(jn.Spaces),
			value: "  "
		},
		{
			title: Nn(jn.setIndentationToFSpaces),
			text: Nn(jn.fSpaces),
			value: "    "
		},
		{
			title: Nn(jn.setIndentationToESpaces),
			text: Nn(jn.eSpaces),
			value: "        "
		},
		{
			title: Nn(jn.setIndentationToTabCharacter),
			text: Nn(jn.tabCharacter),
			value: "	"
		}
	]
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/console_counters/console_counters-meta.ts
var Pn;
async function Fn() {
	return Pn ||= await import("../../chunks/console_counters-BNvk7SJs.js"), Pn;
}
m({
	async loadItem() {
		return (await Fn()).WarningErrorCounter.WarningErrorCounter.instance();
	},
	order: 1,
	location: g.MAIN_TOOLBAR_RIGHT
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/object_ui/object_ui-meta.ts
var In;
async function Ln() {
	return In ||= await import("../../chunks/object_ui-DABOq_QK.js"), In;
}
me({
	contextTypes() {
		return [Oe];
	},
	async loadRenderer() {
		return (await Ln()).ObjectPropertiesSection.Renderer.instance();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/network/forward/NetworkRequestId.ts
var Rn = class {
	requestId;
	manager;
	constructor(e, t) {
		this.requestId = e, this.manager = t;
	}
}, zn = {
	explainThisError: "Understand this error",
	explainThisWarning: "Understand this warning",
	explainThisMessage: "Understand this message",
	enableConsoleInsights: "Understand console messages with AI",
	wrongLocale: "To use this feature, set your language preference to English in DevTools settings.",
	geoRestricted: "This feature is unavailable in your region.",
	policyRestricted: "This setting is managed by your administrator."
}, Bn = n("panels/explain/explain-meta.ts", zn), Vn = e.bind(void 0, Bn), Hn = ee.bind(void 0, Bn), Un = "console-insights-enabled", Wn = [
	{
		actionId: "explain.console-message.hover",
		title: Vn(zn.explainThisMessage),
		configurableBindings: !1,
		contextTypes() {
			return [ut];
		}
	},
	{
		actionId: "explain.console-message.teaser",
		title: Vn(zn.explainThisMessage),
		configurableBindings: !1,
		contextTypes() {
			return [];
		}
	},
	{
		actionId: "explain.console-message.context.error",
		title: Vn(zn.explainThisError),
		configurableBindings: !1,
		contextTypes() {
			return [];
		}
	},
	{
		actionId: "explain.console-message.context.warning",
		title: Vn(zn.explainThisWarning),
		configurableBindings: !1,
		contextTypes() {
			return [];
		}
	},
	{
		actionId: "explain.console-message.context.other",
		title: Vn(zn.explainThisMessage),
		configurableBindings: !1,
		contextTypes() {
			return [];
		}
	}
];
function Gn() {
	return !ne.instance().locale.startsWith("en-");
}
function Kn(e) {
	return e?.aidaAvailability?.blockedByGeo === !0;
}
function qn(e) {
	return e?.aidaAvailability?.blockedByEnterprisePolicy === !0;
}
function Jn(e) {
	return (e?.aidaAvailability?.enabled && e?.devToolsConsoleInsights?.enabled) === !0;
}
o({
	category: c.AI,
	settingName: Un,
	settingType: a.BOOLEAN,
	title: Vn(zn.enableConsoleInsights),
	defaultValue: !1,
	reloadRequired: !1,
	condition: (e) => Jn(e),
	disabledCondition: (e) => {
		let t = [];
		return Kn(e) && t.push(Hn(zn.geoRestricted)), qn(e) && t.push(Hn(zn.policyRestricted)), Gn() && t.push(Hn(zn.wrongLocale)), t.length > 0 ? {
			disabled: !0,
			reasons: t
		} : { disabled: !1 };
	}
});
for (let e of Wn) p({
	...e,
	category: h.CONSOLE,
	async loadActionDelegate() {
		return new (await (import("../../chunks/explain-BThUhJV7.js"))).ActionDelegate();
	},
	condition: (e) => Jn(e) && !qn(e) && !Kn(e)
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/ai_assistance/ai_assistance-meta.ts
var N = {
	aiAssistance: "AI assistance",
	showAiAssistance: "Show AI assistance",
	enableAiAssistance: "Enable AI assistance",
	debugWithAi: "Debug with AI",
	gemini: "Gemini",
	showGemini: "Show Gemini",
	enableGemini: "Enable Gemini",
	debugWithGemini: "Debug with Gemini",
	wrongLocale: "To use this feature, set your language preference to English in DevTools settings.",
	geoRestricted: "This feature is unavailable in your region.",
	policyRestricted: "This setting is managed by your administrator."
}, Yn = n("panels/ai_assistance/ai_assistance-meta.ts", N), Xn = ee.bind(void 0, Yn);
function Zn(e, t) {
	return () => Ye.devToolsGeminiRebranding?.enabled ? Xn(e) : Xn(t);
}
var Qn = "ai-assistance-enabled";
function $n() {
	return !ne.instance().locale.startsWith("en-");
}
function er(e) {
	return e?.aidaAvailability?.blockedByGeo === !0;
}
function tr(e) {
	return e?.aidaAvailability?.blockedByEnterprisePolicy === !0;
}
var nr;
async function rr() {
	return nr ||= await import("../../chunks/ai_assistance-Dzdtg9s8.js"), nr;
}
function ir(e) {
	return (e?.aidaAvailability?.enabled && e?.devToolsFreestyler?.enabled) === !0;
}
function ar(e) {
	return (e?.aidaAvailability?.enabled && e?.devToolsAiAssistanceNetworkAgent?.enabled) === !0;
}
function or(e) {
	return (e?.aidaAvailability?.enabled && e?.devToolsAiAssistancePerformanceAgent?.enabled) === !0;
}
function sr(e) {
	return (e?.aidaAvailability?.enabled && e?.devToolsAiAssistanceFileAgent?.enabled) === !0;
}
function cr(e) {
	return (e?.aidaAvailability?.enabled && e?.devToolsAiAssistanceStorageAgent?.enabled) === !0;
}
function lr(e) {
	return ir(e) || ar(e) || or(e) || sr(e) || cr(e);
}
l({
	location: d.DRAWER_VIEW,
	id: "freestyler",
	commandPrompt: Zn(N.showGemini, N.showAiAssistance),
	title: Zn(N.gemini, N.aiAssistance),
	order: 10,
	persistence: u.CLOSEABLE,
	hasToolbar: !1,
	condition: (e) => lr(e) && !tr(e),
	async loadView() {
		return await (await rr()).AiAssistancePanel.instance();
	}
}), o({
	category: c.AI,
	settingName: Qn,
	settingType: a.BOOLEAN,
	title: Zn(N.enableGemini, N.enableAiAssistance),
	defaultValue: !1,
	reloadRequired: !1,
	condition: lr,
	disabledCondition: (e) => {
		let t = [];
		return er(e) && t.push(Xn(N.geoRestricted)), tr(e) && t.push(Xn(N.policyRestricted)), $n() && t.push(Xn(N.wrongLocale)), t.length > 0 ? {
			disabled: !0,
			reasons: t
		} : { disabled: !1 };
	}
}), o({
	category: c.AI,
	settingName: "ai-assistance-v2-opt-in-change-dialog-seen",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), p({
	actionId: "freestyler.main-menu",
	contextTypes() {
		return [];
	},
	category: h.GLOBAL,
	title: Zn(N.debugWithGemini, N.debugWithAi),
	configurableBindings: !1,
	async loadActionDelegate() {
		return new (await (rr())).ActionDelegate();
	},
	condition: (e) => lr(e) && !tr(e) && !er(e)
}), p({
	actionId: "freestyler.elements-floating-button",
	contextTypes() {
		return [];
	},
	category: h.GLOBAL,
	title: Zn(N.debugWithGemini, N.debugWithAi),
	configurableBindings: !1,
	async loadActionDelegate() {
		return new (await (rr())).ActionDelegate();
	},
	condition: (e) => ir(e) && !tr(e) && !er(e)
}), p({
	actionId: "freestyler.element-panel-context",
	contextTypes() {
		return [];
	},
	category: h.GLOBAL,
	title: Zn(N.debugWithGemini, N.debugWithAi),
	configurableBindings: !1,
	async loadActionDelegate() {
		return new (await (rr())).ActionDelegate();
	},
	condition: (e) => ir(e) && !tr(e) && !er(e)
}), p({
	actionId: "drjones.network-floating-button",
	contextTypes() {
		return [];
	},
	category: h.GLOBAL,
	title: Zn(N.debugWithGemini, N.debugWithAi),
	configurableBindings: !1,
	async loadActionDelegate() {
		return new (await (rr())).ActionDelegate();
	},
	condition: (e) => ar(e) && !tr(e) && !er(e)
}), p({
	actionId: "drjones.network-panel-context",
	contextTypes() {
		return [];
	},
	category: h.GLOBAL,
	title: Zn(N.debugWithGemini, N.debugWithAi),
	configurableBindings: !1,
	async loadActionDelegate() {
		return new (await (rr())).ActionDelegate();
	},
	condition: (e) => ar(e) && !tr(e) && !er(e)
}), p({
	actionId: "drjones.performance-panel-context",
	contextTypes() {
		return [];
	},
	category: h.GLOBAL,
	title: Zn(N.debugWithGemini, N.debugWithAi),
	configurableBindings: !1,
	async loadActionDelegate() {
		return new (await (rr())).ActionDelegate();
	},
	condition: (e) => or(e) && !tr(e) && !er(e)
}), p({
	actionId: "drjones.sources-floating-button",
	contextTypes() {
		return [];
	},
	category: h.GLOBAL,
	title: Zn(N.debugWithGemini, N.debugWithAi),
	configurableBindings: !1,
	async loadActionDelegate() {
		return new (await (rr())).ActionDelegate();
	},
	condition: (e) => sr(e) && !tr(e) && !er(e)
}), p({
	actionId: "drjones.sources-panel-context",
	contextTypes() {
		return [];
	},
	category: h.GLOBAL,
	title: Zn(N.debugWithGemini, N.debugWithAi),
	configurableBindings: !1,
	async loadActionDelegate() {
		return new (await (rr())).ActionDelegate();
	},
	condition: (e) => sr(e) && !tr(e) && !er(e)
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/css_overview/css_overview-meta.ts
var ur = {
	cssOverview: "CSS overview",
	showCssOverview: "Show CSS overview"
}, dr = n("panels/css_overview/css_overview-meta.ts", ur), fr = e.bind(void 0, dr), pr;
async function mr() {
	return pr ||= await import("../../chunks/css_overview-UA7lEwB3.js"), pr;
}
l({
	location: d.PANEL,
	id: "cssoverview",
	commandPrompt: fr(ur.showCssOverview),
	title: fr(ur.cssOverview),
	order: 95,
	persistence: u.CLOSEABLE,
	async loadView() {
		return new (await (mr())).CSSOverviewPanel.CSSOverviewPanel();
	},
	isPreviewFeature: !0
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/elements-meta.ts
var P = {
	showElements: "Show Elements",
	elements: "Elements",
	showEventListeners: "Show Event Listeners",
	eventListeners: "Event Listeners",
	showProperties: "Show Properties",
	properties: "Properties",
	showLayout: "Show Layout",
	layout: "Layout",
	hideElement: "Hide element",
	editAsHtml: "Edit as HTML",
	duplicateElement: "Duplicate element",
	undo: "Undo",
	redo: "Redo",
	captureAreaScreenshot: "Capture area screenshot",
	selectAnElementInThePageTo: "Select an element in the page to inspect it",
	newStyleRule: "New Style Rule",
	refreshEventListeners: "Refresh event listeners",
	wordWrap: "Word wrap",
	toggleWordWrap: "Toggle word wrap",
	htmlComments: "HTML comments",
	showHtmlComments: "Show `HTML` comments",
	hideHtmlComments: "Hide `HTML` comments",
	revealDomNodeOnHover: "Reveal `DOM` node on hover",
	detailedInspectTooltip: "Detailed inspect tooltip",
	CSSDocumentationTooltip: "CSS documentation tooltip",
	copyStyles: "Copy styles",
	toggleA11yTree: "Toggle accessibility tree",
	userAgentShadowDOM: "User agent shadow `DOM`",
	showComputedStyles: "Show Computed Styles",
	showStyles: "Show Styles",
	toggleEyeDropper: "Toggle eye dropper",
	cssAnimationsOnlyWhenAnimationsTabOpen: "Show animation styles only when the Animations tab is open",
	collapseNonContributingCSSRules: "Collapse non-contributing CSS rules"
}, hr = n("panels/elements/elements-meta.ts", P), F = e.bind(void 0, hr), gr;
async function I() {
	return gr ||= await import("../../chunks/elements-BcCLQjkY.js"), gr;
}
function _r(e) {
	return gr === void 0 ? [] : e(gr);
}
l({
	location: d.PANEL,
	id: "elements",
	commandPrompt: F(P.showElements),
	title: F(P.elements),
	order: 10,
	persistence: u.PERMANENT,
	hasToolbar: !1,
	async loadView() {
		return (await I()).ElementsPanel.ElementsPanel.instance();
	}
}), p({
	actionId: "elements.show-styles",
	category: h.ELEMENTS,
	title: F(P.showStyles),
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	}
}), p({
	actionId: "elements.show-computed",
	category: h.ELEMENTS,
	title: F(P.showComputedStyles),
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	}
}), l({
	location: d.ELEMENTS_SIDEBAR,
	id: "elements.event-listeners",
	commandPrompt: F(P.showEventListeners),
	title: F(P.eventListeners),
	order: 5,
	persistence: u.PERMANENT,
	async loadView() {
		return (await I()).EventListenersWidget.EventListenersWidget.instance();
	}
}), l({
	location: d.ELEMENTS_SIDEBAR,
	id: "elements.dom-properties",
	commandPrompt: F(P.showProperties),
	title: F(P.properties),
	order: 7,
	persistence: u.PERMANENT,
	async loadView() {
		return new (await (I())).PropertiesWidget.PropertiesWidget();
	}
}), l({
	location: d.ELEMENTS_SIDEBAR,
	id: "elements.layout",
	commandPrompt: F(P.showLayout),
	title: F(P.layout),
	order: 4,
	persistence: u.PERMANENT,
	async loadView() {
		return (await I()).LayoutPane.LayoutPane.instance();
	}
}), p({
	actionId: "elements.hide-element",
	category: h.ELEMENTS,
	title: F(P.hideElement),
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	},
	contextTypes() {
		return _r((e) => [e.ElementsPanel.ElementsPanel]);
	},
	bindings: [{ shortcut: "H" }]
}), p({
	actionId: "elements.toggle-eye-dropper",
	category: h.ELEMENTS,
	title: F(P.toggleEyeDropper),
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	},
	contextTypes() {
		return _r((e) => [e.ColorSwatchPopoverIcon.ColorSwatchPopoverIcon]);
	},
	bindings: [{ shortcut: "c" }]
}), p({
	actionId: "elements.edit-as-html",
	category: h.ELEMENTS,
	title: F(P.editAsHtml),
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	},
	contextTypes() {
		return _r((e) => [e.ElementsPanel.ElementsPanel]);
	},
	bindings: [{ shortcut: "F2" }]
}), p({
	actionId: "elements.duplicate-element",
	category: h.ELEMENTS,
	title: F(P.duplicateElement),
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	},
	contextTypes() {
		return _r((e) => [e.ElementsPanel.ElementsPanel]);
	},
	bindings: [{ shortcut: "Shift+Alt+Down" }]
}), p({
	actionId: "elements.copy-styles",
	category: h.ELEMENTS,
	title: F(P.copyStyles),
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	},
	contextTypes() {
		return _r((e) => [e.ElementsPanel.ElementsPanel]);
	},
	bindings: [{
		shortcut: "Ctrl+Alt+C",
		platform: f.WINDOWS_LINUX
	}, {
		shortcut: "Meta+Alt+C",
		platform: f.MAC
	}]
}), p({
	actionId: "elements.toggle-a11y-tree",
	category: h.ELEMENTS,
	title: F(P.toggleA11yTree),
	toggleable: !0,
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	},
	contextTypes() {
		return _r((e) => [e.ElementsPanel.ElementsPanel]);
	},
	bindings: [{ shortcut: "A" }]
}), p({
	actionId: "elements.undo",
	category: h.ELEMENTS,
	title: F(P.undo),
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	},
	contextTypes() {
		return _r((e) => [e.ElementsPanel.ElementsPanel]);
	},
	bindings: [{
		shortcut: "Ctrl+Z",
		platform: f.WINDOWS_LINUX
	}, {
		shortcut: "Meta+Z",
		platform: f.MAC
	}]
}), p({
	actionId: "elements.redo",
	category: h.ELEMENTS,
	title: F(P.redo),
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	},
	contextTypes() {
		return _r((e) => [e.ElementsPanel.ElementsPanel]);
	},
	bindings: [{
		shortcut: "Ctrl+Y",
		platform: f.WINDOWS_LINUX
	}, {
		shortcut: "Meta+Shift+Z",
		platform: f.MAC
	}]
}), p({
	actionId: "elements.capture-area-screenshot",
	async loadActionDelegate() {
		return new (await (I())).InspectElementModeController.ToggleSearchActionDelegate();
	},
	condition: Ke.canDock,
	title: F(P.captureAreaScreenshot),
	category: h.SCREENSHOT
}), p({
	category: h.ELEMENTS,
	actionId: "elements.toggle-element-search",
	toggleable: !0,
	async loadActionDelegate() {
		return new (await (I())).InspectElementModeController.ToggleSearchActionDelegate();
	},
	title: F(P.selectAnElementInThePageTo),
	iconClass: _.LARGEICON_NODE_SEARCH,
	bindings: [{
		shortcut: "Ctrl+Shift+C",
		platform: f.WINDOWS_LINUX
	}, {
		shortcut: "Meta+Shift+C",
		platform: f.MAC
	}],
	configurableBindings: !1
}), p({
	category: h.ELEMENTS,
	actionId: "elements.new-style-rule",
	title: F(P.newStyleRule),
	iconClass: _.PLUS,
	async loadActionDelegate() {
		return new (await (I())).StylesSidebarPane.ActionDelegate();
	},
	contextTypes() {
		return _r((e) => [e.StylesSidebarPane.StylesSidebarPane]);
	}
}), p({
	category: h.ELEMENTS,
	actionId: "elements.refresh-event-listeners",
	title: F(P.refreshEventListeners),
	iconClass: _.REFRESH,
	async loadActionDelegate() {
		return new (await (I())).EventListenersWidget.ActionDelegate();
	},
	contextTypes() {
		return _r((e) => [e.EventListenersWidget.EventListenersWidget]);
	}
}), o({
	category: c.ELEMENTS,
	storageType: s.SYNCED,
	order: 1,
	title: F(P.userAgentShadowDOM),
	settingName: "show-ua-shadow-dom",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	category: c.ELEMENTS,
	storageType: s.SYNCED,
	order: 2,
	title: F(P.wordWrap),
	settingName: "dom-word-wrap",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), p({
	category: h.ELEMENTS,
	actionId: "elements.toggle-word-wrap",
	async loadActionDelegate() {
		return new (await (I())).ElementsPanel.ElementsActionDelegate();
	},
	title: F(P.toggleWordWrap),
	contextTypes() {
		return _r((e) => [e.ElementsPanel.ElementsPanel]);
	},
	bindings: [{
		shortcut: "Alt+Z",
		keybindSets: [v.VS_CODE]
	}]
}), o({
	category: c.ELEMENTS,
	storageType: s.SYNCED,
	order: 3,
	title: F(P.htmlComments),
	settingName: "show-html-comments",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: F(P.showHtmlComments)
	}, {
		value: !1,
		title: F(P.hideHtmlComments)
	}]
}), o({
	category: c.ELEMENTS,
	storageType: s.SYNCED,
	order: 4,
	title: F(P.revealDomNodeOnHover),
	settingName: "highlight-node-on-hover-in-overlay",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), o({
	category: c.ELEMENTS,
	storageType: s.SYNCED,
	order: 5,
	title: F(P.detailedInspectTooltip),
	settingName: "show-detailed-inspect-tooltip",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), o({
	category: c.ELEMENTS,
	storageType: s.SYNCED,
	order: 6,
	title: F(P.cssAnimationsOnlyWhenAnimationsTabOpen),
	settingName: "css-animations-only-when-animations-tab-open",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), o({
	category: c.ELEMENTS,
	storageType: s.SYNCED,
	order: 7,
	title: F(P.collapseNonContributingCSSRules),
	settingName: "collapse-non-contributing-css-rules",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	settingName: "show-event-listeners-for-ancestors",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), o({
	category: c.ADORNER,
	storageType: s.SYNCED,
	settingName: "adorner-settings",
	settingType: a.ARRAY,
	defaultValue: []
}), o({
	category: c.ELEMENTS,
	storageType: s.SYNCED,
	title: F(P.CSSDocumentationTooltip),
	settingName: "show-css-property-documentation-on-hover",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), we({
	contextTypes() {
		return [
			Oe,
			Ie,
			je
		];
	},
	async loadProvider() {
		return new (await (I())).ElementsPanel.ContextMenuProvider();
	},
	experiment: void 0
}), We({
	name: d.ELEMENTS_SIDEBAR,
	category: ge.ELEMENTS,
	async loadResolver() {
		return (await I()).ElementsPanel.ElementsPanel.instance();
	}
}), t({
	contextTypes() {
		return [
			Ie,
			je,
			Oe,
			be,
			at
		];
	},
	destination: r.ELEMENTS_PANEL,
	async loadRevealer() {
		return new (await (I())).ElementsPanel.DOMNodeRevealer();
	}
}), t({
	contextTypes() {
		return [Be];
	},
	destination: r.STYLES_SIDEBAR,
	async loadRevealer() {
		return new (await (I())).ElementsPanel.CSSPropertyRevealer();
	}
}), m({
	async loadItem() {
		return (await I()).LayersWidget.ButtonProvider.instance();
	},
	order: 1,
	location: g.STYLES_SIDEBARPANE_TOOLBAR
}), m({
	async loadItem() {
		return (await I()).ElementStatePaneWidget.ButtonProvider.instance();
	},
	order: 2,
	location: g.STYLES_SIDEBARPANE_TOOLBAR
}), m({
	async loadItem() {
		return (await I()).ClassesPaneWidget.ButtonProvider.instance();
	},
	order: 3,
	location: g.STYLES_SIDEBARPANE_TOOLBAR
}), m({
	async loadItem() {
		return (await I()).StylesSidebarPane.ButtonProvider.instance();
	},
	order: 100,
	location: g.STYLES_SIDEBARPANE_TOOLBAR
}), m({
	actionId: "elements.toggle-element-search",
	location: g.MAIN_TOOLBAR_LEFT,
	order: 0
}), me({
	contextTypes() {
		return [Ie, je];
	},
	async loadRenderer() {
		return (await I()).ElementsTreeOutlineRenderer.Renderer.instance();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/browser_debugger/browser_debugger-meta.ts
var L = {
	showEventListenerBreakpoints: "Show Event Listener Breakpoints",
	eventListenerBreakpoints: "Event Listener Breakpoints",
	showCspViolationBreakpoints: "Show CSP Violation Breakpoints",
	cspViolationBreakpoints: "CSP Violation Breakpoints",
	showXhrfetchBreakpoints: "Show XHR/fetch Breakpoints",
	xhrfetchBreakpoints: "XHR/fetch Breakpoints",
	showDomBreakpoints: "Show DOM Breakpoints",
	domBreakpoints: "DOM Breakpoints",
	showGlobalListeners: "Show Global Listeners",
	globalListeners: "Global Listeners",
	page: "Page",
	showPage: "Show Page",
	overrides: "Overrides",
	showOverrides: "Show Overrides",
	contentScripts: "Content scripts",
	showContentScripts: "Show Content scripts",
	refreshGlobalListeners: "Refresh global listeners"
}, vr = n("panels/browser_debugger/browser_debugger-meta.ts", L), R = e.bind(void 0, vr), yr;
async function br() {
	return yr ||= await import("../../chunks/browser_debugger-D1rAg54B.js"), yr;
}
function xr(e) {
	return yr === void 0 ? [] : e(yr);
}
var Sr;
async function Cr() {
	return Sr ||= await import("../../chunks/sources-TPBBLKKV.js"), Sr;
}
l({
	async loadView() {
		return (await br()).EventListenerBreakpointsSidebarPane.EventListenerBreakpointsSidebarPane.instance();
	},
	id: "sources.event-listener-breakpoints",
	location: d.SOURCES_SIDEBAR_BOTTOM,
	commandPrompt: R(L.showEventListenerBreakpoints),
	title: R(L.eventListenerBreakpoints),
	order: 9,
	persistence: u.PERMANENT
}), l({
	async loadView() {
		return new (await (br())).CSPViolationBreakpointsSidebarPane.CSPViolationBreakpointsSidebarPane();
	},
	id: "sources.csp-violation-breakpoints",
	location: d.SOURCES_SIDEBAR_BOTTOM,
	commandPrompt: R(L.showCspViolationBreakpoints),
	title: R(L.cspViolationBreakpoints),
	order: 10,
	persistence: u.PERMANENT
}), l({
	async loadView() {
		return (await br()).XHRBreakpointsSidebarPane.XHRBreakpointsSidebarPane.instance();
	},
	id: "sources.xhr-breakpoints",
	location: d.SOURCES_SIDEBAR_BOTTOM,
	commandPrompt: R(L.showXhrfetchBreakpoints),
	title: R(L.xhrfetchBreakpoints),
	order: 5,
	persistence: u.PERMANENT,
	hasToolbar: !0
}), l({
	async loadView() {
		return (await br()).DOMBreakpointsSidebarPane.DOMBreakpointsSidebarPane.instance();
	},
	id: "sources.dom-breakpoints",
	location: d.SOURCES_SIDEBAR_BOTTOM,
	commandPrompt: R(L.showDomBreakpoints),
	title: R(L.domBreakpoints),
	order: 7,
	persistence: u.PERMANENT
}), l({
	async loadView() {
		return new (await (br())).ObjectEventListenersSidebarPane.ObjectEventListenersSidebarPane();
	},
	id: "sources.global-listeners",
	location: d.SOURCES_SIDEBAR_BOTTOM,
	commandPrompt: R(L.showGlobalListeners),
	title: R(L.globalListeners),
	order: 8,
	persistence: u.PERMANENT,
	hasToolbar: !0
}), l({
	async loadView() {
		return (await br()).DOMBreakpointsSidebarPane.DOMBreakpointsSidebarPane.instance();
	},
	id: "elements.dom-breakpoints",
	location: d.ELEMENTS_SIDEBAR,
	commandPrompt: R(L.showDomBreakpoints),
	title: R(L.domBreakpoints),
	order: 6,
	persistence: u.PERMANENT
}), l({
	location: d.NAVIGATOR_VIEW,
	id: "navigator-network",
	title: R(L.page),
	commandPrompt: R(L.showPage),
	order: 2,
	persistence: u.PERMANENT,
	async loadView() {
		return (await Cr()).SourcesNavigator.NetworkNavigatorView.instance();
	}
}), l({
	location: d.NAVIGATOR_VIEW,
	id: "navigator-overrides",
	title: R(L.overrides),
	commandPrompt: R(L.showOverrides),
	order: 4,
	persistence: u.PERMANENT,
	condition: () => !Je.isTraceApp(),
	async loadView() {
		return (await Cr()).SourcesNavigator.OverridesNavigatorView.instance();
	}
}), l({
	location: d.NAVIGATOR_VIEW,
	id: "navigator-content-scripts",
	title: R(L.contentScripts),
	commandPrompt: R(L.showContentScripts),
	order: 5,
	persistence: u.PERMANENT,
	condition: () => qe() !== "/bundled/worker_app.html" && !Je.isTraceApp(),
	async loadView() {
		return new (await (Cr())).SourcesNavigator.ContentScriptsNavigatorView();
	}
}), p({
	category: h.DEBUGGER,
	actionId: "browser-debugger.refresh-global-event-listeners",
	async loadActionDelegate() {
		return new (await (br())).ObjectEventListenersSidebarPane.ActionDelegate();
	},
	title: R(L.refreshGlobalListeners),
	iconClass: _.REFRESH,
	contextTypes() {
		return xr((e) => [e.ObjectEventListenersSidebarPane.ObjectEventListenersSidebarPane]);
	}
}), we({
	contextTypes() {
		return [Ie];
	},
	async loadProvider() {
		return new (await (br())).DOMBreakpointsSidebarPane.ContextMenuProvider();
	},
	experiment: void 0
}), Re({
	contextTypes() {
		return [ze];
	},
	async loadListener() {
		return (await br()).XHRBreakpointsSidebarPane.XHRBreakpointsSidebarPane.instance();
	}
}), Re({
	contextTypes() {
		return [ze];
	},
	async loadListener() {
		return (await br()).DOMBreakpointsSidebarPane.DOMBreakpointsSidebarPane.instance();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/greendev/greendev-meta.ts
var wr;
async function Tr() {
	return wr ||= await import("../../chunks/greendev-Ce4kKfHb.js"), wr;
}
l({
	location: d.PANEL,
	id: "greendev",
	title: i("GreenDev"),
	commandPrompt: i("Show GreenDev"),
	persistence: u.CLOSEABLE,
	order: 100,
	async loadView() {
		return (await Tr()).GreenDevPanel.GreenDevPanel.instance();
	},
	condition: (e) => !!e?.devToolsGreenDevUi?.enabled
});
var Er = new BroadcastChannel("green-dev-sync");
Er.postMessage({ type: "main-window-alive" }), Er.onmessage = (e) => {
	e.data.type === "activate-panel" && (console.error("[GreenDev] Meta: Received activate-panel broadcast"), Pe.instance().showView("greendev").then(() => {
		console.error("[GreenDev] Meta: View shown, broadcasting select-tab");
		let t = new BroadcastChannel("green-dev-sync");
		t.postMessage({
			type: "select-tab",
			sessionId: e.data.sessionId
		}), t.close();
	}));
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/network/network-meta.ts
var z = {
	showNetwork: "Show Network",
	network: "Network",
	showRequestConditions: "Show Request conditions",
	networkRequestConditions: "Request conditions",
	showNetworkConditions: "Show Network conditions",
	networkConditions: "Network conditions",
	diskCache: "disk cache",
	networkThrottling: "network throttling",
	showSearch: "Show Search",
	search: "Search",
	recordNetworkLog: "Record network log",
	stopRecordingNetworkLog: "Stop recording network log",
	hideRequestDetails: "Hide request details",
	colorcodeResourceTypes: "Color-code resource types",
	colorCode: "color code",
	resourceType: "resource type",
	colorCodeByResourceType: "Color code by resource type",
	useDefaultColors: "Use default colors",
	groupNetworkLogByFrame: "Group network log by frame",
	netWork: "network",
	frame: "frame",
	group: "group",
	groupNetworkLogItemsByFrame: "Group network log items by frame",
	dontGroupNetworkLogItemsByFrame: "Don't group network log items by frame",
	clear: "Clear network log",
	addNetworkRequestBlockingOrThrottlingPattern: "Add network request blocking or throttling pattern",
	removeAllNetworkRequestBlockingOrThrottlingPatterns: "Remove all network request blocking or throttling patterns",
	allowToGenerateHarWithSensitiveData: "Allow to generate `HAR` with sensitive data",
	dontAllowToGenerateHarWithSensitiveData: "Don't allow to generate `HAR` with sensitive data",
	allowToGenerateHarWithSensitiveDataDocumentation: "By default generated HAR logs are sanitized and don't include `Cookie`, `Set-Cookie`, or `Authorization` HTTP headers. When this setting is enabled, options to export/copy HAR with sensitive data are provided."
}, Dr = n("panels/network/network-meta.ts", z), B = e.bind(void 0, Dr), Or = ee.bind(void 0, Dr), kr, Ar = Je.isNode();
async function V() {
	return kr ||= await import("../../chunks/network-JFnyzJOB.js"), kr;
}
function jr(e) {
	return kr === void 0 ? [] : e(kr);
}
l({
	location: d.PANEL,
	id: "network",
	commandPrompt: B(z.showNetwork),
	title: B(z.network),
	order: 40,
	isPreviewFeature: Ar,
	async loadView() {
		return (await V()).NetworkPanel.NetworkPanel.instance();
	}
}), l({
	location: d.DRAWER_VIEW,
	id: "network.blocked-urls",
	commandPrompt: () => Or(z.showRequestConditions),
	title: () => Or(z.networkRequestConditions),
	persistence: u.CLOSEABLE,
	order: 60,
	async loadView() {
		return new (await (V())).RequestConditionsDrawer.RequestConditionsDrawer();
	}
}), l({
	location: d.DRAWER_VIEW,
	id: "network.config",
	commandPrompt: B(z.showNetworkConditions),
	title: B(z.networkConditions),
	persistence: u.CLOSEABLE,
	order: 40,
	tags: [
		B(z.diskCache),
		B(z.networkThrottling),
		i("useragent"),
		i("user agent"),
		i("user-agent")
	],
	async loadView() {
		return (await V()).NetworkConfigView.NetworkConfigView.instance();
	}
}), l({
	location: d.NETWORK_SIDEBAR,
	id: "network.search-network-tab",
	commandPrompt: B(z.showSearch),
	title: B(z.search),
	persistence: u.PERMANENT,
	async loadView() {
		return (await V()).NetworkPanel.SearchNetworkView.instance();
	}
}), p({
	actionId: "network.toggle-recording",
	category: h.NETWORK,
	iconClass: _.START_RECORDING,
	toggleable: !0,
	toggledIconClass: _.STOP_RECORDING,
	toggleWithRedColor: !0,
	contextTypes() {
		return jr((e) => [e.NetworkPanel.NetworkPanel]);
	},
	async loadActionDelegate() {
		return new (await (V())).NetworkPanel.ActionDelegate();
	},
	options: [{
		value: !0,
		title: B(z.recordNetworkLog)
	}, {
		value: !1,
		title: B(z.stopRecordingNetworkLog)
	}],
	bindings: [{
		shortcut: "Ctrl+E",
		platform: f.WINDOWS_LINUX
	}, {
		shortcut: "Meta+E",
		platform: f.MAC
	}]
}), p({
	actionId: "network.clear",
	category: h.NETWORK,
	title: B(z.clear),
	iconClass: _.CLEAR,
	async loadActionDelegate() {
		return new (await (V())).NetworkPanel.ActionDelegate();
	},
	contextTypes() {
		return jr((e) => [e.NetworkPanel.NetworkPanel]);
	},
	bindings: [{ shortcut: "Ctrl+L" }, {
		shortcut: "Meta+K",
		platform: f.MAC
	}]
}), p({
	actionId: "network.hide-request-details",
	category: h.NETWORK,
	title: B(z.hideRequestDetails),
	contextTypes() {
		return jr((e) => [e.NetworkPanel.NetworkPanel]);
	},
	async loadActionDelegate() {
		return new (await (V())).NetworkPanel.ActionDelegate();
	},
	bindings: [{ shortcut: "Esc" }]
}), p({
	actionId: "network.search",
	category: h.NETWORK,
	title: B(z.search),
	contextTypes() {
		return jr((e) => [e.NetworkPanel.NetworkPanel]);
	},
	async loadActionDelegate() {
		return new (await (V())).NetworkPanel.ActionDelegate();
	},
	bindings: [{
		platform: f.MAC,
		shortcut: "Meta+F",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}, {
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+F",
		keybindSets: [v.DEVTOOLS_DEFAULT, v.VS_CODE]
	}]
}), p({
	actionId: "network.add-network-request-blocking-pattern",
	category: h.NETWORK,
	title: () => Or(z.addNetworkRequestBlockingOrThrottlingPattern),
	iconClass: _.PLUS,
	contextTypes() {
		return jr((e) => [e.RequestConditionsDrawer.RequestConditionsDrawer]);
	},
	async loadActionDelegate() {
		return new (await (V())).RequestConditionsDrawer.ActionDelegate();
	}
}), p({
	actionId: "network.remove-all-network-request-blocking-patterns",
	category: h.NETWORK,
	title: () => Or(z.removeAllNetworkRequestBlockingOrThrottlingPatterns),
	iconClass: _.CLEAR,
	contextTypes() {
		return jr((e) => [e.RequestConditionsDrawer.RequestConditionsDrawer]);
	},
	async loadActionDelegate() {
		return new (await (V())).RequestConditionsDrawer.ActionDelegate();
	}
}), o({
	category: c.NETWORK,
	storageType: s.SYNCED,
	title: B(z.allowToGenerateHarWithSensitiveData),
	settingName: "network.show-options-to-generate-har-with-sensitive-data",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	tags: [i("HAR")],
	options: [{
		value: !0,
		title: B(z.allowToGenerateHarWithSensitiveData)
	}, {
		value: !1,
		title: B(z.dontAllowToGenerateHarWithSensitiveData)
	}],
	learnMore: {
		url: "https://goo.gle/devtools-export-hars",
		tooltip: B(z.allowToGenerateHarWithSensitiveDataDocumentation)
	}
}), o({
	category: c.NETWORK,
	storageType: s.SYNCED,
	title: B(z.colorcodeResourceTypes),
	settingName: "network-color-code-resource-types",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	tags: [B(z.colorCode), B(z.resourceType)],
	options: [{
		value: !0,
		title: B(z.colorCodeByResourceType)
	}, {
		value: !1,
		title: B(z.useDefaultColors)
	}]
}), o({
	category: c.NETWORK,
	storageType: s.SYNCED,
	title: B(z.groupNetworkLogByFrame),
	settingName: "network.group-by-frame",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	tags: [
		B(z.netWork),
		B(z.frame),
		B(z.group)
	],
	options: [{
		value: !0,
		title: B(z.groupNetworkLogItemsByFrame)
	}, {
		value: !1,
		title: B(z.dontGroupNetworkLogItemsByFrame)
	}]
}), We({
	name: d.NETWORK_SIDEBAR,
	category: ge.NETWORK,
	async loadResolver() {
		return (await V()).NetworkPanel.NetworkPanel.instance();
	}
}), we({
	contextTypes() {
		return [
			_e,
			De,
			$e,
			Ve
		];
	},
	async loadProvider() {
		return (await V()).NetworkPanel.NetworkPanel.instance();
	}
}), t({
	contextTypes() {
		return [_e];
	},
	destination: r.NETWORK_PANEL,
	async loadRevealer() {
		return new (await (V())).NetworkPanel.RequestRevealer();
	}
}), t({
	contextTypes() {
		return [pt];
	},
	async loadRevealer() {
		return new (await (V())).NetworkPanel.RequestLocationRevealer();
	}
}), t({
	contextTypes() {
		return [Rn];
	},
	destination: r.NETWORK_PANEL,
	async loadRevealer() {
		return new (await (V())).NetworkPanel.RequestIdRevealer();
	}
}), t({
	contextTypes() {
		return [ft, nt];
	},
	destination: r.NETWORK_PANEL,
	async loadRevealer() {
		return new (await (V())).NetworkPanel.NetworkLogWithFilterRevealer();
	}
}), t({
	contextTypes() {
		return [Fe];
	},
	destination: r.NETWORK_PANEL,
	async loadRevealer() {
		return new (await (V())).RequestConditionsDrawer.AppliedConditionsRevealer();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/security/security-meta.ts
var Mr = {
	security: "Security",
	showSecurity: "Show Security"
}, Nr = n("panels/security/security-meta.ts", Mr), Pr = e.bind(void 0, Nr), Fr;
async function Ir() {
	return Fr ||= await import("../../chunks/security-Cc3n87Ux.js"), Fr;
}
l({
	location: d.PANEL,
	id: "security",
	title: () => Pr(Mr.security)(),
	commandPrompt: () => Pr(Mr.showSecurity)(),
	order: 80,
	persistence: u.CLOSEABLE,
	async loadView() {
		return (await Ir()).SecurityPanel.SecurityPanel.instance();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/emulation/emulation-meta.ts
var H = {
	toggleDeviceToolbar: "Toggle device toolbar",
	captureScreenshot: "Capture screenshot",
	captureFullSizeScreenshot: "Capture full size screenshot",
	captureNodeScreenshot: "Capture node screenshot",
	showMediaQueries: "Show media queries",
	device: "device",
	hideMediaQueries: "Hide media queries",
	showRulers: "Show rulers in the Device Mode toolbar",
	hideRulers: "Hide rulers in the Device Mode toolbar",
	showDeviceFrame: "Show device frame",
	hideDeviceFrame: "Hide device frame"
}, Lr = n("panels/emulation/emulation-meta.ts", H), U = e.bind(void 0, Lr), Rr;
async function zr() {
	return Rr ||= await import("../../chunks/emulation-XHyfGdIJ.js"), Rr;
}
p({
	category: h.MOBILE,
	actionId: "emulation.toggle-device-mode",
	toggleable: !0,
	async loadActionDelegate() {
		return new (await (zr())).DeviceModeWrapper.ActionDelegate();
	},
	condition: Ke.canDock,
	title: U(H.toggleDeviceToolbar),
	iconClass: _.LARGEICON_PHONE,
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Shift+Ctrl+M"
	}, {
		platform: f.MAC,
		shortcut: "Shift+Meta+M"
	}]
}), p({
	actionId: "emulation.capture-screenshot",
	category: h.SCREENSHOT,
	async loadActionDelegate() {
		return new (await (zr())).DeviceModeWrapper.ActionDelegate();
	},
	condition: Ke.canDock,
	title: U(H.captureScreenshot)
}), p({
	actionId: "emulation.capture-full-height-screenshot",
	category: h.SCREENSHOT,
	async loadActionDelegate() {
		return new (await (zr())).DeviceModeWrapper.ActionDelegate();
	},
	condition: Ke.canDock,
	title: U(H.captureFullSizeScreenshot)
}), p({
	actionId: "emulation.capture-node-screenshot",
	category: h.SCREENSHOT,
	async loadActionDelegate() {
		return new (await (zr())).DeviceModeWrapper.ActionDelegate();
	},
	condition: Ke.canDock,
	title: U(H.captureNodeScreenshot)
}), o({
	category: c.MOBILE,
	settingName: "show-media-query-inspector",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	options: [{
		value: !0,
		title: U(H.showMediaQueries)
	}, {
		value: !1,
		title: U(H.hideMediaQueries)
	}],
	tags: [U(H.device)]
}), o({
	category: c.MOBILE,
	settingName: "emulation.show-rulers",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	options: [{
		value: !0,
		title: U(H.showRulers)
	}, {
		value: !1,
		title: U(H.hideRulers)
	}],
	tags: [U(H.device)]
}), o({
	category: c.MOBILE,
	settingName: "emulation.show-device-outline",
	settingType: a.BOOLEAN,
	defaultValue: !1,
	options: [{
		value: !0,
		title: U(H.showDeviceFrame)
	}, {
		value: !1,
		title: U(H.hideDeviceFrame)
	}],
	tags: [U(H.device)]
}), m({
	actionId: "emulation.toggle-device-mode",
	condition: Ke.canDock,
	location: g.MAIN_TOOLBAR_LEFT,
	order: 1
}), He({
	async loadAppProvider() {
		return (await zr()).AdvancedApp.AdvancedAppProvider.instance();
	},
	condition: Ke.canDock,
	order: 0
}), y({
	location: b.DEVICE_MODE_MENU_SAVE,
	order: 12,
	actionId: "emulation.capture-screenshot"
}), y({
	location: b.DEVICE_MODE_MENU_SAVE,
	order: 13,
	actionId: "emulation.capture-full-height-screenshot"
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/sensors/sensors-meta.ts
var W = {
	sensors: "Sensors",
	geolocation: "geolocation",
	timezones: "timezones",
	locale: "locale",
	locales: "locales",
	accelerometer: "accelerometer",
	deviceOrientation: "device orientation",
	locations: "Locations",
	touch: "Touch",
	devicebased: "Device-based",
	forceEnabled: "Force enabled",
	emulateIdleDetectorState: "Emulate Idle Detector state",
	noIdleEmulation: "No idle emulation",
	userActiveScreenUnlocked: "User active, screen unlocked",
	userActiveScreenLocked: "User active, screen locked",
	userIdleScreenUnlocked: "User idle, screen unlocked",
	userIdleScreenLocked: "User idle, screen locked",
	showSensors: "Show Sensors",
	showLocations: "Show Locations",
	cpuPressure: "CPU Pressure",
	noPressureEmulation: "No override",
	nominal: "Nominal",
	fair: "Fair",
	serious: "Serious",
	critical: "Critical"
}, Br = n("panels/sensors/sensors-meta.ts", W), G = e.bind(void 0, Br), Vr;
async function Hr() {
	return Vr ||= await import("../../chunks/sensors-D7jtF6tx.js"), Vr;
}
l({
	location: d.DRAWER_VIEW,
	commandPrompt: G(W.showSensors),
	title: G(W.sensors),
	id: "sensors",
	persistence: u.CLOSEABLE,
	order: 100,
	async loadView() {
		return new (await (Hr())).SensorsView.SensorsView();
	},
	tags: [
		G(W.geolocation),
		G(W.timezones),
		G(W.locale),
		G(W.locales),
		G(W.accelerometer),
		G(W.deviceOrientation)
	]
}), l({
	location: d.SETTINGS_VIEW,
	id: "emulation-locations",
	commandPrompt: G(W.showLocations),
	title: G(W.locations),
	order: 40,
	async loadView() {
		return new (await (Hr())).LocationsSettingsTab.LocationsSettingsTab();
	},
	settings: ["emulation.locations"],
	iconName: "location-on"
}), o({
	storageType: s.SYNCED,
	settingName: "emulation.locations",
	settingType: a.ARRAY,
	defaultValue: [
		{
			title: "Berlin",
			lat: 52.520007,
			long: 13.404954,
			timezoneId: "Europe/Berlin",
			locale: "de-DE",
			accuracy: 150
		},
		{
			title: "London",
			lat: 51.507351,
			long: -.127758,
			timezoneId: "Europe/London",
			locale: "en-GB",
			accuracy: 150
		},
		{
			title: "Moscow",
			lat: 55.755826,
			long: 37.6173,
			timezoneId: "Europe/Moscow",
			locale: "ru-RU",
			accuracy: 150
		},
		{
			title: "Mountain View",
			lat: 37.386052,
			long: -122.083851,
			timezoneId: "America/Los_Angeles",
			locale: "en-US",
			accuracy: 150
		},
		{
			title: "Mumbai",
			lat: 19.075984,
			long: 72.877656,
			timezoneId: "Asia/Kolkata",
			locale: "mr-IN",
			accuracy: 150
		},
		{
			title: "San Francisco",
			lat: 37.774929,
			long: -122.419416,
			timezoneId: "America/Los_Angeles",
			locale: "en-US",
			accuracy: 150
		},
		{
			title: "Shanghai",
			lat: 31.230416,
			long: 121.473701,
			timezoneId: "Asia/Shanghai",
			locale: "zh-Hans-CN",
			accuracy: 150
		},
		{
			title: "São Paulo",
			lat: -23.55052,
			long: -46.633309,
			timezoneId: "America/Sao_Paulo",
			locale: "pt-BR",
			accuracy: 150
		},
		{
			title: "Tokyo",
			lat: 35.689487,
			long: 139.691706,
			timezoneId: "Asia/Tokyo",
			locale: "ja-JP",
			accuracy: 150
		}
	]
}), o({
	title: G(W.cpuPressure),
	reloadRequired: !0,
	settingName: "emulation.cpu-pressure",
	settingType: a.ENUM,
	defaultValue: "none",
	options: [
		{
			value: "none",
			title: G(W.noPressureEmulation),
			text: G(W.noPressureEmulation)
		},
		{
			value: "nominal",
			title: G(W.nominal),
			text: G(W.nominal)
		},
		{
			value: "fair",
			title: G(W.fair),
			text: G(W.fair)
		},
		{
			value: "serious",
			title: G(W.serious),
			text: G(W.serious)
		},
		{
			value: "critical",
			title: G(W.critical),
			text: G(W.critical)
		}
	]
}), o({
	title: G(W.touch),
	reloadRequired: !0,
	settingName: "emulation.touch",
	settingType: a.ENUM,
	defaultValue: "none",
	options: [{
		value: "none",
		title: G(W.devicebased),
		text: G(W.devicebased)
	}, {
		value: "force",
		title: G(W.forceEnabled),
		text: G(W.forceEnabled)
	}]
}), o({
	title: G(W.emulateIdleDetectorState),
	settingName: "emulation.idle-detection",
	settingType: a.ENUM,
	defaultValue: "none",
	options: [
		{
			value: "none",
			title: G(W.noIdleEmulation),
			text: G(W.noIdleEmulation)
		},
		{
			value: "{\"isUserActive\":true,\"isScreenUnlocked\":true}",
			title: G(W.userActiveScreenUnlocked),
			text: G(W.userActiveScreenUnlocked)
		},
		{
			value: "{\"isUserActive\":true,\"isScreenUnlocked\":false}",
			title: G(W.userActiveScreenLocked),
			text: G(W.userActiveScreenLocked)
		},
		{
			value: "{\"isUserActive\":false,\"isScreenUnlocked\":true}",
			title: G(W.userIdleScreenUnlocked),
			text: G(W.userIdleScreenUnlocked)
		},
		{
			value: "{\"isUserActive\":false,\"isScreenUnlocked\":false}",
			title: G(W.userIdleScreenLocked),
			text: G(W.userIdleScreenLocked)
		}
	]
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/accessibility/accessibility-meta.ts
var Ur, Wr = {
	accessibility: "Accessibility",
	shoAccessibility: "Show Accessibility"
}, Gr = n("panels/accessibility/accessibility-meta.ts", Wr), Kr = e.bind(void 0, Gr);
async function qr() {
	return Ur ||= await import("../../chunks/accessibility-CriFXarh.js"), Ur;
}
l({
	location: d.ELEMENTS_SIDEBAR,
	id: "accessibility.view",
	title: Kr(Wr.accessibility),
	commandPrompt: Kr(Wr.shoAccessibility),
	order: 10,
	persistence: u.PERMANENT,
	async loadView() {
		return (await qr()).AccessibilitySidebarView.AccessibilitySidebarView.instance();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/animation/animation-meta.ts
var Jr, Yr = {
	animations: "Animations",
	showAnimations: "Show Animations"
}, Xr = n("panels/animation/animation-meta.ts", Yr), Zr = e.bind(void 0, Xr);
async function Qr() {
	return Jr ||= await import("../../chunks/animation-eDKXX3j-.js"), Jr;
}
l({
	location: d.DRAWER_VIEW,
	id: "animations",
	title: Zr(Yr.animations),
	commandPrompt: Zr(Yr.showAnimations),
	persistence: u.CLOSEABLE,
	order: 0,
	async loadView() {
		return (await Qr()).AnimationTimeline.AnimationTimeline.instance();
	}
}), t({
	contextTypes() {
		return [Ae];
	},
	destination: r.SOURCES_PANEL,
	async loadRevealer() {
		return new (await (Qr())).AnimationTimeline.AnimationGroupRevealer();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/developer_resources/developer_resources-meta.ts
var $r = {
	developerResources: "Developer resources",
	showDeveloperResources: "Show Developer resources"
}, ei = n("panels/developer_resources/developer_resources-meta.ts", $r), ti = e.bind(void 0, ei), ni;
async function ri() {
	return ni ||= await import("../../chunks/developer_resources-DZK4LTht.js"), ni;
}
l({
	location: d.DRAWER_VIEW,
	id: "developer-resources",
	title: ti($r.developerResources),
	commandPrompt: ti($r.showDeveloperResources),
	order: 100,
	persistence: u.CLOSEABLE,
	async loadView() {
		return new (await (ri())).DeveloperResourcesView.DeveloperResourcesView();
	}
}), t({
	contextTypes() {
		return [Te];
	},
	destination: r.DEVELOPER_RESOURCES_PANEL,
	async loadRevealer() {
		return new (await (ri())).DeveloperResourcesView.DeveloperResourcesRevealer();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/autofill/autofill-meta.ts
var ii = {
	autofill: "Autofill",
	showAutofill: "Show Autofill"
}, ai = n("panels/autofill/autofill-meta.ts", ii), oi = e.bind(void 0, ai), si;
async function ci() {
	return si ||= await import("../../chunks/autofill-DfPSF3rt.js"), si;
}
l({
	location: d.DRAWER_VIEW,
	id: "autofill-view",
	title: oi(ii.autofill),
	commandPrompt: oi(ii.showAutofill),
	order: 100,
	persistence: u.CLOSEABLE,
	async loadView() {
		return new (await (ci())).AutofillView.AutofillView();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/inspector_main/inspector_main-meta.ts
var K = {
	rendering: "Rendering",
	showRendering: "Show Rendering",
	paint: "paint",
	layout: "layout",
	fps: "fps",
	cssMediaType: "CSS media type",
	cssMediaFeature: "CSS media feature",
	visionDeficiency: "vision deficiency",
	colorVisionDeficiency: "color vision deficiency",
	reloadPage: "Reload page",
	hardReloadPage: "Hard reload page",
	forceAdBlocking: "Force ad blocking on this site",
	blockAds: "Block ads on this site",
	showAds: "Show ads on this site, if allowed",
	autoOpenDevTools: "Auto-open DevTools for popups",
	doNotAutoOpen: "Do not auto-open DevTools for popups",
	disablePaused: "Disable paused state overlay",
	toggleCssPrefersColorSchemeMedia: "Toggle CSS media feature prefers-color-scheme"
}, li = n("entrypoints/inspector_main/inspector_main-meta.ts", K), q = e.bind(void 0, li), ui;
async function di() {
	return ui ||= await import("../../chunks/inspector_main-BFYGyw-S.js"), ui;
}
l({
	location: d.DRAWER_VIEW,
	id: "rendering",
	title: q(K.rendering),
	commandPrompt: q(K.showRendering),
	persistence: u.CLOSEABLE,
	order: 50,
	async loadView() {
		return new (await (di())).RenderingOptions.RenderingOptionsView();
	},
	tags: [
		q(K.paint),
		q(K.layout),
		q(K.fps),
		q(K.cssMediaType),
		q(K.cssMediaFeature),
		q(K.visionDeficiency),
		q(K.colorVisionDeficiency)
	]
}), p({
	category: h.NAVIGATION,
	actionId: "inspector-main.reload",
	async loadActionDelegate() {
		return new (await (di())).InspectorMain.ReloadActionDelegate();
	},
	iconClass: _.REFRESH,
	title: q(K.reloadPage),
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+R"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "F5"
		},
		{
			platform: f.MAC,
			shortcut: "Meta+R"
		}
	]
}), p({
	category: h.NAVIGATION,
	actionId: "inspector-main.hard-reload",
	async loadActionDelegate() {
		return new (await (di())).InspectorMain.ReloadActionDelegate();
	},
	title: q(K.hardReloadPage),
	bindings: [
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Shift+Ctrl+R"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Shift+F5"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+F5"
		},
		{
			platform: f.WINDOWS_LINUX,
			shortcut: "Ctrl+Shift+F5"
		},
		{
			platform: f.MAC,
			shortcut: "Shift+Meta+R"
		}
	]
}), p({
	actionId: "rendering.toggle-prefers-color-scheme",
	category: h.RENDERING,
	title: q(K.toggleCssPrefersColorSchemeMedia),
	async loadActionDelegate() {
		return new (await (di())).RenderingOptions.ReloadActionDelegate();
	}
}), o({
	category: c.NETWORK,
	title: q(K.forceAdBlocking),
	settingName: "network.ad-blocking-enabled",
	settingType: a.BOOLEAN,
	storageType: s.SESSION,
	defaultValue: !1,
	options: [{
		value: !0,
		title: q(K.blockAds)
	}, {
		value: !1,
		title: q(K.showAds)
	}]
}), o({
	category: c.GLOBAL,
	storageType: s.SYNCED,
	title: q(K.autoOpenDevTools),
	settingName: "auto-attach-to-created-pages",
	settingType: a.BOOLEAN,
	order: 2,
	defaultValue: !1,
	options: [{
		value: !0,
		title: q(K.autoOpenDevTools)
	}, {
		value: !1,
		title: q(K.doNotAutoOpen)
	}]
}), o({
	category: c.APPEARANCE,
	storageType: s.SYNCED,
	title: q(K.disablePaused),
	settingName: "disable-paused-state-overlay",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), m({
	async loadItem() {
		return (await di()).InspectorMain.NodeIndicatorProvider.instance();
	},
	order: 2,
	location: g.MAIN_TOOLBAR_LEFT
}), m({
	async loadItem() {
		return (await di()).OutermostTargetSelector.OutermostTargetSelector.instance();
	},
	order: 97,
	location: g.MAIN_TOOLBAR_RIGHT
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/application-meta.ts
var fi = {
	application: "Application",
	showApplication: "Show Application",
	pwa: "pwa",
	clearSiteData: "Clear site data",
	clearSiteDataIncludingThirdparty: "Clear site data (including third-party cookies)",
	startRecordingEvents: "Start recording events",
	stopRecordingEvents: "Stop recording events"
}, pi = n("panels/application/application-meta.ts", fi), mi = e.bind(void 0, pi), hi;
async function gi() {
	return hi ||= await import("../../chunks/application-DG2H8fsc.js"), hi;
}
function _i(e) {
	return hi === void 0 ? [] : e(hi);
}
l({
	location: d.PANEL,
	id: "resources",
	title: mi(fi.application),
	commandPrompt: mi(fi.showApplication),
	order: 70,
	async loadView() {
		return (await gi()).ResourcesPanel.ResourcesPanel.instance();
	},
	tags: [mi(fi.pwa)]
}), p({
	category: h.RESOURCES,
	actionId: "resources.clear",
	title: mi(fi.clearSiteData),
	async loadActionDelegate() {
		return new (await (gi())).StorageView.ActionDelegate();
	}
}), p({
	category: h.RESOURCES,
	actionId: "resources.clear-incl-third-party-cookies",
	title: mi(fi.clearSiteDataIncludingThirdparty),
	async loadActionDelegate() {
		return new (await (gi())).StorageView.ActionDelegate();
	}
}), p({
	actionId: "background-service.toggle-recording",
	iconClass: _.START_RECORDING,
	toggleable: !0,
	toggledIconClass: _.STOP_RECORDING,
	toggleWithRedColor: !0,
	contextTypes() {
		return _i((e) => [e.BackgroundServiceView.BackgroundServiceView]);
	},
	async loadActionDelegate() {
		return new (await (gi())).BackgroundServiceView.ActionDelegate();
	},
	category: h.BACKGROUND_SERVICES,
	options: [{
		value: !0,
		title: mi(fi.startRecordingEvents)
	}, {
		value: !1,
		title: mi(fi.stopRecordingEvents)
	}],
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+E"
	}, {
		platform: f.MAC,
		shortcut: "Meta+E"
	}]
}), t({
	contextTypes() {
		return [De];
	},
	destination: r.APPLICATION_PANEL,
	async loadRevealer() {
		return new (await (gi())).ResourcesPanel.ResourceRevealer();
	}
}), t({
	contextTypes() {
		return [fe];
	},
	destination: r.APPLICATION_PANEL,
	async loadRevealer() {
		return new (await (gi())).ResourcesPanel.FrameDetailsRevealer();
	}
}), t({
	contextTypes() {
		return [ht];
	},
	destination: r.APPLICATION_PANEL,
	async loadRevealer() {
		return new (await (gi())).ResourcesPanel.RuleSetViewRevealer();
	}
}), t({
	contextTypes() {
		return [gt];
	},
	destination: r.APPLICATION_PANEL,
	async loadRevealer() {
		return new (await (gi())).ResourcesPanel.AttemptViewWithFilterRevealer();
	}
}), t({
	contextTypes() {
		return _i((e) => [e.Components.StorageMetadataView.StorageBucketRevealInfo]);
	},
	destination: r.APPLICATION_PANEL,
	async loadRevealer() {
		return new (await (gi())).ResourcesPanel.StorageBucketRevealer();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/issues/issues-meta.ts
var vi = {
	issues: "Issues",
	showIssues: "Show Issues"
}, yi = n("panels/issues/issues-meta.ts", vi), bi = e.bind(void 0, yi), xi;
async function Si() {
	return xi ||= await import("../../chunks/issues-CfCXyqwr.js"), xi;
}
l({
	location: d.DRAWER_VIEW,
	id: "issues-pane",
	title: bi(vi.issues),
	commandPrompt: bi(vi.showIssues),
	order: 100,
	persistence: u.CLOSEABLE,
	async loadView() {
		return new (await (Si())).IssuesPane.IssuesPane();
	}
}), t({
	contextTypes() {
		return [dt];
	},
	destination: r.ISSUES_VIEW,
	async loadRevealer() {
		return new (await (Si())).IssueRevealer.IssueRevealer();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/layers/layers-meta.ts
var Ci = {
	layers: "Layers",
	showLayers: "Show Layers"
}, wi = n("panels/layers/layers-meta.ts", Ci), Ti = e.bind(void 0, wi), Ei;
async function Di() {
	return Ei ||= await import("../../chunks/layers-6D_9Q2Y1.js"), Ei;
}
l({
	location: d.PANEL,
	id: "layers",
	title: Ti(Ci.layers),
	commandPrompt: Ti(Ci.showLayers),
	order: 100,
	persistence: u.CLOSEABLE,
	async loadView() {
		return (await Di()).LayersPanel.LayersPanel.instance();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/lighthouse/lighthouse-meta.ts
var Oi = { showLighthouse: "Show `Lighthouse`" }, ki = n("panels/lighthouse/lighthouse-meta.ts", Oi), Ai = e.bind(void 0, ki), ji;
async function Mi() {
	return ji ||= await import("../../chunks/lighthouse-DJcRfd0b.js"), ji;
}
l({
	location: d.PANEL,
	id: "lighthouse",
	title: i("Lighthouse"),
	commandPrompt: Ai(Oi.showLighthouse),
	order: 90,
	async loadView() {
		return (await Mi()).LighthousePanel.LighthousePanel.instance();
	},
	tags: [i("lighthouse"), i("pwa")]
}), t({
	contextTypes() {
		return [_t];
	},
	destination: r.LIGHTHOUSE_PANEL,
	async loadRevealer() {
		return new (await (Mi())).LighthousePanel.ReportRevealer();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/media/media-meta.ts
var Ni = {
	media: "Media",
	video: "video",
	showMedia: "Show Media"
}, Pi = n("panels/media/media-meta.ts", Ni), Fi = e.bind(void 0, Pi), Ii;
async function Li() {
	return Ii ||= await import("../../chunks/media-lWOgExWb.js"), Ii;
}
l({
	location: d.PANEL,
	id: "medias",
	title: Fi(Ni.media),
	commandPrompt: Fi(Ni.showMedia),
	persistence: u.CLOSEABLE,
	order: 100,
	async loadView() {
		return new (await (Li())).MainView.MainView();
	},
	tags: [Fi(Ni.media), Fi(Ni.video)]
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/mobile_throttling/mobile_throttling-meta.ts
var J = {
	throttling: "Throttling",
	showThrottling: "Show Throttling",
	goOffline: "Go offline",
	device: "device",
	throttlingTag: "throttling",
	enableSlowGThrottling: "Enable slow `3G` throttling",
	enableFastGThrottling: "Enable fast `3G` throttling",
	goOnline: "Go online"
}, Ri = n("panels/mobile_throttling/mobile_throttling-meta.ts", J), Y = e.bind(void 0, Ri), zi;
async function Bi() {
	return zi ||= await import("../../chunks/mobile_throttling-DPEmQ593.js"), zi;
}
l({
	location: d.SETTINGS_VIEW,
	id: "throttling-conditions",
	title: Y(J.throttling),
	commandPrompt: Y(J.showThrottling),
	order: 35,
	async loadView() {
		return new (await (Bi())).ThrottlingSettingsTab.ThrottlingSettingsTab();
	},
	settings: ["custom-network-conditions", "calibrated-cpu-throttling"],
	iconName: "performance"
}), p({
	actionId: "network-conditions.network-offline",
	category: h.NETWORK,
	title: Y(J.goOffline),
	async loadActionDelegate() {
		return new (await (Bi())).ThrottlingManager.ActionDelegate();
	},
	tags: [Y(J.device), Y(J.throttlingTag)]
}), p({
	actionId: "network-conditions.network-low-end-mobile",
	category: h.NETWORK,
	title: Y(J.enableSlowGThrottling),
	async loadActionDelegate() {
		return new (await (Bi())).ThrottlingManager.ActionDelegate();
	},
	tags: [Y(J.device), Y(J.throttlingTag)]
}), p({
	actionId: "network-conditions.network-mid-tier-mobile",
	category: h.NETWORK,
	title: Y(J.enableFastGThrottling),
	async loadActionDelegate() {
		return new (await (Bi())).ThrottlingManager.ActionDelegate();
	},
	tags: [Y(J.device), Y(J.throttlingTag)]
}), p({
	actionId: "network-conditions.network-online",
	category: h.NETWORK,
	title: Y(J.goOnline),
	async loadActionDelegate() {
		return new (await (Bi())).ThrottlingManager.ActionDelegate();
	},
	tags: [Y(J.device), Y(J.throttlingTag)]
}), o({
	storageType: s.SYNCED,
	settingName: "custom-network-conditions",
	settingType: a.ARRAY,
	defaultValue: []
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/performance_monitor/performance_monitor-meta.ts
var Vi = {
	performanceMonitor: "Performance monitor",
	performance: "performance",
	systemMonitor: "system monitor",
	monitor: "monitor",
	activity: "activity",
	metrics: "metrics",
	showPerformanceMonitor: "Show Performance monitor"
}, Hi = n("panels/performance_monitor/performance_monitor-meta.ts", Vi), Ui = e.bind(void 0, Hi), Wi;
async function Gi() {
	return Wi ||= await import("../../chunks/performance_monitor-DCfknRat.js"), Wi;
}
l({
	location: d.DRAWER_VIEW,
	id: "performance.monitor",
	title: Ui(Vi.performanceMonitor),
	commandPrompt: Ui(Vi.showPerformanceMonitor),
	persistence: u.CLOSEABLE,
	order: 100,
	async loadView() {
		return new (await (Gi())).PerformanceMonitor.PerformanceMonitorImpl();
	},
	tags: [
		Ui(Vi.performance),
		Ui(Vi.systemMonitor),
		Ui(Vi.monitor),
		Ui(Vi.activity),
		Ui(Vi.metrics)
	]
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/timeline/timeline-meta.ts
var X = {
	performance: "Performance",
	showPerformance: "Show Performance",
	record: "Record",
	stop: "Stop",
	recordAndReload: "Record and reload",
	saveProfile: "Save profile…",
	loadProfile: "Load profile…",
	previousFrame: "Previous frame",
	nextFrame: "Next frame",
	showRecentTimelineSessions: "Show recent timeline sessions",
	previousRecording: "Previous recording",
	nextRecording: "Next recording",
	chromeFrameInLayersView: "Chrome frame in Layers view",
	timelineShowAllEvents: "Show all events",
	timelineDebugMode: "Timeline debug mode (trace event details, etc.)",
	timelineInvalidationTracking: "Invalidation tracking"
}, Ki = n("panels/timeline/timeline-meta.ts", X), Z = e.bind(void 0, Ki), qi;
async function Q() {
	return qi ||= await import("../../chunks/timeline-DCzpZ1Y0.js"), qi;
}
function $(e) {
	return qi === void 0 ? [] : e(qi);
}
l({
	location: d.PANEL,
	id: "timeline",
	title: Z(X.performance),
	commandPrompt: Z(X.showPerformance),
	order: 50,
	async loadView(e) {
		let t = await Q(), ee = e.context.get(pe);
		return t.TimelinePanel.TimelinePanel.instance({
			forceNew: !0,
			resourceLoader: ee
		});
	}
}), p({
	actionId: "timeline.toggle-recording",
	category: h.PERFORMANCE,
	iconClass: _.START_RECORDING,
	toggleable: !0,
	toggledIconClass: _.STOP_RECORDING,
	toggleWithRedColor: !0,
	contextTypes() {
		return $((e) => [e.TimelinePanel.TimelinePanel]);
	},
	async loadActionDelegate() {
		return new (await (Q())).TimelinePanel.ActionDelegate();
	},
	options: [{
		value: !0,
		title: Z(X.record)
	}, {
		value: !1,
		title: Z(X.stop)
	}],
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+E"
	}, {
		platform: f.MAC,
		shortcut: "Meta+E"
	}]
}), p({
	actionId: "timeline.record-reload",
	iconClass: _.REFRESH,
	contextTypes() {
		return $((e) => [e.TimelinePanel.TimelinePanel]);
	},
	category: h.PERFORMANCE,
	title: Z(X.recordAndReload),
	async loadActionDelegate() {
		return new (await (Q())).TimelinePanel.ActionDelegate();
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+Shift+E"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Shift+E"
	}]
}), p({
	category: h.PERFORMANCE,
	actionId: "timeline.save-to-file",
	contextTypes() {
		return $((e) => [e.TimelinePanel.TimelinePanel]);
	},
	async loadActionDelegate() {
		return new (await (Q())).TimelinePanel.ActionDelegate();
	},
	title: Z(X.saveProfile),
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+S"
	}, {
		platform: f.MAC,
		shortcut: "Meta+S"
	}]
}), p({
	category: h.PERFORMANCE,
	actionId: "timeline.load-from-file",
	contextTypes() {
		return $((e) => [e.TimelinePanel.TimelinePanel]);
	},
	async loadActionDelegate() {
		return new (await (Q())).TimelinePanel.ActionDelegate();
	},
	title: Z(X.loadProfile),
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+O"
	}, {
		platform: f.MAC,
		shortcut: "Meta+O"
	}]
}), p({
	actionId: "timeline.jump-to-previous-frame",
	category: h.PERFORMANCE,
	title: Z(X.previousFrame),
	contextTypes() {
		return $((e) => [e.TimelinePanel.TimelinePanel]);
	},
	async loadActionDelegate() {
		return new (await (Q())).TimelinePanel.ActionDelegate();
	},
	bindings: [{ shortcut: "[" }]
}), p({
	actionId: "timeline.jump-to-next-frame",
	category: h.PERFORMANCE,
	title: Z(X.nextFrame),
	contextTypes() {
		return $((e) => [e.TimelinePanel.TimelinePanel]);
	},
	async loadActionDelegate() {
		return new (await (Q())).TimelinePanel.ActionDelegate();
	},
	bindings: [{ shortcut: "]" }]
}), p({
	actionId: "timeline.show-history",
	async loadActionDelegate() {
		return new (await (Q())).TimelinePanel.ActionDelegate();
	},
	category: h.PERFORMANCE,
	title: Z(X.showRecentTimelineSessions),
	contextTypes() {
		return $((e) => [e.TimelinePanel.TimelinePanel]);
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Ctrl+H"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Y"
	}]
}), p({
	actionId: "timeline.previous-recording",
	category: h.PERFORMANCE,
	async loadActionDelegate() {
		return new (await (Q())).TimelinePanel.ActionDelegate();
	},
	title: Z(X.previousRecording),
	contextTypes() {
		return $((e) => [e.TimelinePanel.TimelinePanel]);
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Alt+Left"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Left"
	}]
}), p({
	actionId: "timeline.next-recording",
	category: h.PERFORMANCE,
	async loadActionDelegate() {
		return new (await (Q())).TimelinePanel.ActionDelegate();
	},
	title: Z(X.nextRecording),
	contextTypes() {
		return $((e) => [e.TimelinePanel.TimelinePanel]);
	},
	bindings: [{
		platform: f.WINDOWS_LINUX,
		shortcut: "Alt+Right"
	}, {
		platform: f.MAC,
		shortcut: "Meta+Right"
	}]
}), o({
	category: c.PERFORMANCE,
	storageType: s.SYNCED,
	title: Z(X.chromeFrameInLayersView),
	settingName: "frame-viewer-chrome-window",
	settingType: a.BOOLEAN,
	defaultValue: !0
}), o({
	category: c.PERFORMANCE,
	storageType: s.SYNCED,
	title: Z(X.timelineInvalidationTracking),
	settingName: "timeline-invalidation-tracking",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	category: c.PERFORMANCE,
	storageType: s.SYNCED,
	title: Z(X.timelineShowAllEvents),
	settingName: "timeline-show-all-events",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	category: c.PERFORMANCE,
	storageType: s.SYNCED,
	title: Z(X.timelineDebugMode),
	settingName: "timeline-debug-mode",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), o({
	category: c.PERFORMANCE,
	storageType: s.SYNCED,
	settingName: "annotations-hidden",
	settingType: a.BOOLEAN,
	defaultValue: !1
}), y({
	location: b.TIMELINE_MENU_OPEN,
	actionId: "timeline.load-from-file",
	order: 10
}), y({
	location: b.TIMELINE_MENU_OPEN,
	actionId: "timeline.save-to-file",
	order: 15
}), t({
	contextTypes() {
		return [Me];
	},
	destination: r.TIMELINE_PANEL,
	async loadRevealer() {
		return new (await (Q())).TimelinePanel.TraceRevealer();
	}
}), t({
	contextTypes() {
		return $((e) => [e.TimelinePanel.ParsedTraceRevealable]);
	},
	destination: r.TIMELINE_PANEL,
	async loadRevealer() {
		return new (await (Q())).TimelinePanel.ParsedTraceRevealer();
	}
}), t({
	contextTypes() {
		return [Le];
	},
	destination: r.TIMELINE_PANEL,
	async loadRevealer() {
		return new (await (Q())).TimelinePanel.EventRevealer();
	}
}), t({
	contextTypes() {
		return $((e) => [e.Utils.Helpers.RevealableInsight]);
	},
	destination: r.TIMELINE_PANEL,
	async loadRevealer() {
		return new (await (Q())).TimelinePanel.InsightRevealer();
	}
}), t({
	contextTypes() {
		return $((e) => [e.Utils.Helpers.RevealableCoreVitals]);
	},
	destination: r.TIMELINE_PANEL,
	async loadRevealer() {
		return new (await (Q())).TimelinePanel.CoreVitalsRevealer();
	}
}), t({
	contextTypes() {
		return $((e) => [e.Utils.Helpers.RevealableTimeRange]);
	},
	destination: r.TIMELINE_PANEL,
	async loadRevealer() {
		return new (await (Q())).TimelinePanel.TimeRangeRevealer();
	}
}), t({
	contextTypes() {
		return $((e) => [e.Utils.Helpers.RevealableBottomUpProfile]);
	},
	destination: r.TIMELINE_PANEL,
	async loadRevealer() {
		return new (await (Q())).TimelinePanel.BottomUpProfileRevealer();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/web_audio/web_audio-meta.ts
var Ji = {
	webaudio: "WebAudio",
	audio: "audio",
	showWebaudio: "Show WebAudio"
}, Yi = n("panels/web_audio/web_audio-meta.ts", Ji), Xi = e.bind(void 0, Yi), Zi;
async function Qi() {
	return Zi ||= await import("../../chunks/web_audio-BxUFAfxi.js"), Zi;
}
l({
	location: d.DRAWER_VIEW,
	id: "web-audio",
	title: Xi(Ji.webaudio),
	commandPrompt: Xi(Ji.showWebaudio),
	persistence: u.CLOSEABLE,
	order: 100,
	async loadView() {
		return new (await (Qi())).WebAudioView.WebAudioView();
	},
	tags: [Xi(Ji.audio)]
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/webauthn/webauthn-meta.ts
var $i = {
	webauthn: "WebAuthn",
	showWebauthn: "Show WebAuthn"
}, ea = n("panels/webauthn/webauthn-meta.ts", $i), ta = e.bind(void 0, ea), na;
async function ra() {
	return na ||= await import("../../chunks/webauthn-CSv6nAmN.js"), na;
}
l({
	location: d.DRAWER_VIEW,
	id: "webauthn-pane",
	title: ta($i.webauthn),
	commandPrompt: ta($i.showWebauthn),
	order: 100,
	persistence: u.CLOSEABLE,
	async loadView() {
		return new (await (ra())).WebauthnPane.WebauthnPaneImpl();
	}
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/layer_viewer/layer_viewer-meta.ts
var ia = {
	resetView: "Reset view",
	switchToPanMode: "Switch to pan mode",
	switchToRotateMode: "Switch to rotate mode",
	zoomIn: "Zoom in",
	zoomOut: "Zoom out",
	panOrRotateUp: "Pan or rotate up",
	panOrRotateDown: "Pan or rotate down",
	panOrRotateLeft: "Pan or rotate left",
	panOrRotateRight: "Pan or rotate right"
}, aa = n("panels/layer_viewer/layer_viewer-meta.ts", ia), oa = e.bind(void 0, aa);
p({
	actionId: "layers.reset-view",
	category: h.LAYERS,
	title: oa(ia.resetView),
	bindings: [{ shortcut: "0" }]
}), p({
	actionId: "layers.pan-mode",
	category: h.LAYERS,
	title: oa(ia.switchToPanMode),
	bindings: [{ shortcut: "x" }]
}), p({
	actionId: "layers.rotate-mode",
	category: h.LAYERS,
	title: oa(ia.switchToRotateMode),
	bindings: [{ shortcut: "v" }]
}), p({
	actionId: "layers.zoom-in",
	category: h.LAYERS,
	title: oa(ia.zoomIn),
	bindings: [{ shortcut: "Shift+Plus" }, { shortcut: "NumpadPlus" }]
}), p({
	actionId: "layers.zoom-out",
	category: h.LAYERS,
	title: oa(ia.zoomOut),
	bindings: [{ shortcut: "Shift+Minus" }, { shortcut: "NumpadMinus" }]
}), p({
	actionId: "layers.up",
	category: h.LAYERS,
	title: oa(ia.panOrRotateUp),
	bindings: [{ shortcut: "Up" }, { shortcut: "w" }]
}), p({
	actionId: "layers.down",
	category: h.LAYERS,
	title: oa(ia.panOrRotateDown),
	bindings: [{ shortcut: "Down" }, { shortcut: "s" }]
}), p({
	actionId: "layers.left",
	category: h.LAYERS,
	title: oa(ia.panOrRotateLeft),
	bindings: [{ shortcut: "Left" }, { shortcut: "a" }]
}), p({
	actionId: "layers.right",
	category: h.LAYERS,
	title: oa(ia.panOrRotateRight),
	bindings: [{ shortcut: "Right" }, { shortcut: "d" }]
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/recorder-meta.ts
var sa = {
	recorder: "Recorder",
	showRecorder: "Show Recorder",
	startStopRecording: "Start/Stop recording",
	createRecording: "Create a new recording",
	replayRecording: "Replay recording",
	toggleCode: "Toggle code view"
}, ca = n("panels/recorder/recorder-meta.ts", sa), la = e.bind(void 0, ca), ua;
async function da() {
	return ua ||= await import("../../chunks/recorder-DkmPS_WQ.js"), ua;
}
function fa(e, t) {
	return ua === void 0 ? [] : t && ua.RecorderPanel.RecorderPanel.instance().isActionPossible(t) ? e(ua) : [];
}
var pa = "chrome-recorder";
he[pa] = !0, l({
	location: d.PANEL,
	id: pa,
	commandPrompt: la(sa.showRecorder),
	title: la(sa.recorder),
	order: 90,
	persistence: u.CLOSEABLE,
	async loadView() {
		return (await da()).RecorderPanel.RecorderPanel.instance();
	}
}), p({
	category: h.RECORDER,
	actionId: vt.CREATE_RECORDING,
	title: la(sa.createRecording),
	async loadActionDelegate() {
		return new (await (da())).RecorderPanel.ActionDelegate();
	}
}), p({
	category: h.RECORDER,
	actionId: vt.START_RECORDING,
	title: la(sa.startStopRecording),
	contextTypes() {
		return fa((e) => [e.RecorderPanel.RecorderPanel], vt.START_RECORDING);
	},
	async loadActionDelegate() {
		return new (await (da())).RecorderPanel.ActionDelegate();
	},
	bindings: [{
		shortcut: "Ctrl+E",
		platform: f.WINDOWS_LINUX
	}, {
		shortcut: "Meta+E",
		platform: f.MAC
	}]
}), p({
	category: h.RECORDER,
	actionId: vt.REPLAY_RECORDING,
	title: la(sa.replayRecording),
	contextTypes() {
		return fa((e) => [e.RecorderPanel.RecorderPanel], vt.REPLAY_RECORDING);
	},
	async loadActionDelegate() {
		return new (await (da())).RecorderPanel.ActionDelegate();
	},
	bindings: [{
		shortcut: "Ctrl+Enter",
		platform: f.WINDOWS_LINUX
	}, {
		shortcut: "Meta+Enter",
		platform: f.MAC
	}]
}), p({
	category: h.RECORDER,
	actionId: vt.TOGGLE_CODE_VIEW,
	title: la(sa.toggleCode),
	contextTypes() {
		return fa((e) => [e.RecorderPanel.RecorderPanel], vt.TOGGLE_CODE_VIEW);
	},
	async loadActionDelegate() {
		return new (await (da())).RecorderPanel.ActionDelegate();
	},
	bindings: [{
		shortcut: "Ctrl+B",
		platform: f.WINDOWS_LINUX
	}, {
		shortcut: "Meta+B",
		platform: f.MAC
	}]
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/whats_new/whats_new-meta.ts
var ma = {
	whatsNew: "What's new",
	showWhatsNew: "Show what's new",
	releaseNotes: "Release notes",
	reportADevtoolsIssue: "Report a DevTools issue",
	bug: "bug",
	showWhatsNewAfterEachUpdate: "Show what's new after each update",
	doNotShowWhatsNewAfterEachUpdate: "Don't show what's new after each update"
}, ha = n("panels/whats_new/whats_new-meta.ts", ma), ga = e.bind(void 0, ha), _a;
async function va() {
	return _a ||= await import("../../chunks/whats_new-21V-YX7t.js"), _a;
}
Se("release-note"), Ue("help.release-notes"), Ue("help.report-issue"), re("help.show-release-note"), le({
	location: b.MAIN_MENU_HELP_DEFAULT,
	actionId: "help.release-notes"
}), le({
	location: b.MAIN_MENU_HELP_DEFAULT,
	actionId: "help.report-issue"
}), st("whats-new"), l({
	location: d.DRAWER_VIEW,
	id: "release-note",
	title: ga(ma.whatsNew),
	commandPrompt: ga(ma.showWhatsNew),
	persistence: u.CLOSEABLE,
	order: 1,
	async loadView() {
		return new (await (va())).ReleaseNoteView.ReleaseNoteView();
	}
}), p({
	category: h.HELP,
	actionId: "help.release-notes",
	title: ga(ma.releaseNotes),
	async loadActionDelegate() {
		return (await va()).WhatsNew.ReleaseNotesActionDelegate.instance();
	}
}), p({
	category: h.HELP,
	actionId: "help.report-issue",
	title: ga(ma.reportADevtoolsIssue),
	async loadActionDelegate() {
		return (await va()).WhatsNew.ReportIssueActionDelegate.instance();
	},
	tags: [ga(ma.bug)]
}), o({
	category: c.APPEARANCE,
	title: ga(ma.showWhatsNewAfterEachUpdate),
	settingName: "help.show-release-note",
	settingType: a.BOOLEAN,
	defaultValue: !0,
	options: [{
		value: !0,
		title: ga(ma.showWhatsNewAfterEachUpdate)
	}, {
		value: !1,
		title: ga(ma.doNotShowWhatsNewAfterEachUpdate)
	}]
}), y({
	location: b.MAIN_MENU_HELP_DEFAULT,
	actionId: "help.release-notes",
	order: 10
}), y({
	location: b.MAIN_MENU_HELP_DEFAULT,
	actionId: "help.report-issue",
	order: 11
}), ot({
	id: "whats-new",
	async loadRunnable() {
		return (await va()).WhatsNew.HelpLateInitialization.instance();
	}
}), self.runtime = Je.instance({ forceNew: !0 }), new mt();
//#endregion
