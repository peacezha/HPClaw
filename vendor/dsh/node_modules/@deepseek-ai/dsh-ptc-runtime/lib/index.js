import { Service } from "@deepseek-ai/cordis";
//#region lib/types/index.js
/**
* Service Definition for the PTC execution capability seam that runs one model-written program against host async bindings.
* Runtimes know nothing about tools or sessions; consumers own those concerns.
* @module @deepseek-ai/dsh-ptc-runtime
*/
/**
* Binding globals EVERY backend refuses because SOME backend owns the slot in
* the program's namespace: `console` (Node's log capture), and
* `__dsh_main__`/`__builtins__`/`__name__` (the Python backend's bootstrap
* wrapper and seeded module globals),
* and `__debug__`. One shared set — rather than each backend refusing only its
* own slots — keeps the portability promise real: a namespace list valid on
* one backend is valid on all, so a caller cannot pick a name that works on
* Node and collides on Python (or vice versa). `__name__` et al. ARE
* valid portable identifiers, so the identifier rule on
* `PtcBindingNamespace.global` never rejects them — hence this explicit set.
* (Error members differ: {@link DUNDER_MEMBER} refuses every dunder form
* wholesale; binding globals refuse only the names listed here.) `__debug__`
* is listed for a different reason than a collision: CPython compiles a bare
* `__debug__` reference to the constant `True` and rejects any assignment to
* the name at COMPILE time, so an injected global under that name is
* unreachable from the program — accepted by validation, unusable on the
* Python backend, which is exactly the split the shared set exists to prevent.
*/
const RESERVED_BINDING_GLOBALS = new Set([
	"console",
	"__dsh_main__",
	"__builtins__",
	"__name__",
	"__debug__"
]);
/**
* `PtcBindingErrorClass.memberNameProperty` names EVERY backend refuses, as
* one shared contract so a request valid on one backend is valid on all. The
* JS `Error` exclusions (`name`, `message`, `stack`) and Python's
* exception-protocol members (`args`, `with_traceback`, `add_note`) are
* listed by name; dunder-form names (`__x__`, non-empty middle) are refused
* wholesale — several are constrained CPython descriptors whose `setattr`
* raises while constructing the rejection, and the exact set is an interpreter
* version detail. Any other non-empty own property name is accepted everywhere.
*/
const RESERVED_ERROR_MEMBERS = new Set([
	"name",
	"message",
	"stack",
	"args",
	"with_traceback",
	"add_note"
]);
/**
* Dunder form (`__x__`, non-empty middle): object-protocol slots in Python,
* refused as {@link RESERVED_ERROR_MEMBERS | error members} on every backend.
*/
const DUNDER_MEMBER = /^__.+__$/;
/**
* Reserved words of every portable target language (ECMAScript ∪ Python),
* refused as {@link PtcBindingNamespace.global} / error-class names by all
* backends, one per language: the released TypeScript Node process and the
* experimental, private CPython subprocess. The portable-identifier contract
* promises a namespace list valid on one backend is valid on every backend; a
* per-language check would let `lambda` pass the TypeScript backend and fail
* the Python one. Extending the seam with a new language means widening this
* union (a breaking review of existing binding names, by design).
*/
const PORTABLE_RESERVED_WORDS = new Set([
	"await",
	"break",
	"case",
	"catch",
	"class",
	"const",
	"continue",
	"debugger",
	"default",
	"delete",
	"do",
	"else",
	"enum",
	"export",
	"extends",
	"false",
	"finally",
	"for",
	"function",
	"if",
	"import",
	"in",
	"instanceof",
	"new",
	"null",
	"return",
	"super",
	"switch",
	"this",
	"throw",
	"true",
	"try",
	"typeof",
	"var",
	"void",
	"while",
	"with",
	"yield",
	"let",
	"static",
	"implements",
	"interface",
	"package",
	"private",
	"protected",
	"public",
	"arguments",
	"eval",
	"False",
	"None",
	"True",
	"and",
	"as",
	"assert",
	"async",
	"def",
	"del",
	"elif",
	"except",
	"from",
	"global",
	"is",
	"lambda",
	"nonlocal",
	"not",
	"or",
	"pass",
	"raise",
	"match",
	"type",
	"_"
]);
/**
* Registers one `ctx.ptcRuntime` implementation. Program, budget, abort, and substrate
* failures resolve in {@link PtcRunResult}; only Service Definition contract misuse rejects. Implementations bridge
* structured-cloneable bindings, materialize each declared namespace rejection
* class, treat programs as hostile peers, isolate distinct state owners, and
* terminate and await in-flight runs during disposal.
*/
var PtcRuntime = class extends Service {
	/** Source evaluation form, independent of whether the provider retains state for an owner. */
	get programFormat() {
		return "function-body";
	}
	/**
	* Release an owner's retained environment and await its execution resources.
	* Stateless providers have no retained resources to release.
	* @param owner - The exact object supplied as the request's state owner.
	* @returns Completion after all owned execution resources have been released.
	* @throws When managed resource cleanup fails.
	*/
	release(owner) {
		return Promise.resolve();
	}
	/** Provider-owned program usage guidance for consumers to present alongside the source language. */
	get executionInstructions() {
		return "";
	}
	/** Deployment file-policy mode, or undefined for a provider without confinement support. */
	get sandboxMode() {}
	/** Configured numeric elapsed-time defaults and cap, or undefined when per-call overrides are unsupported. */
	get timeout() {}
	constructor(ctx) {
		super(ctx, "ptcRuntime");
	}
};
//#endregion
export { DUNDER_MEMBER, PORTABLE_RESERVED_WORDS, PtcRuntime, PtcRuntime as default, RESERVED_BINDING_GLOBALS, RESERVED_ERROR_MEMBERS };
