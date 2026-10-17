import { t as boundJsonLine } from "./json-stream-BA-F3lfb.js";
import { Command, CommanderError } from "commander";
import { parseCmdline } from "@deepseek-ai/dsh-cmdline";
//#region lib/types/startup-internals.js
/**
* Process facts the startup provider reads, kept out of the `./startup` entry
* so substituting them in tests adds no public package API.
* @module @deepseek-ai/dsh-headless/startup-internals
*/
/** Process facts the provider reads; tests substitute them. */
const internals = {
	stdinIsTty: () => process.stdin.isTTY,
	stdout: process.stdout
};
//#endregion
//#region lib/types/startup.js
/**
* The one-shot app's command-line provider: it parses the task positional,
* `--session-id`, `--json`, and `--help`, then publishes
* {@link HEADLESS_STARTUP_SERVICE}. The runner is an ordinary consumer whose
* lazy config waits for that service.
* @module @deepseek-ai/dsh-headless/startup
*/
/** Stable Cordis plugin name. */
const name = "headless-startup";
/** Services required before the task can be resolved. */
const inject = ["cmdlineArgs"];
/** Service provided by this plugin and injected by the one-shot runner. */
const HEADLESS_STARTUP_SERVICE = "headlessStartup";
/**
* This app's command: the task positional, its options, and its help text.
* @returns a fresh program, so one process can parse more than once (tests).
*/
function headlessCommand() {
	return new Command().name("dsh --profile headless").description("Answer one task and exit; the answer goes to stdout and diagnostics to stderr.").helpOption("-h, --help", "show this help").option("--json", "write newline-delimited run events to stdout instead of the final message").option("--session-id <id>", "adopt the persisted Session with this id; an unknown id is an error").argument("[task...]", "the task text; multiple words are joined by spaces, and `-` reads stdin").addHelpText("after", `
Examples:
  dsh --profile headless "run the tests"          answer one task and exit
  echo "run the tests" | dsh --profile headless   read the task from stdin
  dsh --profile headless --json "run the tests"   emit machine-readable run events
  dsh --profile headless --session-id session-… "continue"   resume an existing Session
`);
}
/**
* Whether the raw invocation asks for the machine-readable stream. The scan
* stops at `--` and skips a `--session-id` value, so a literal `--json` used as
* an option value or a positional never installs the JSON error override.
* @param argv - the invocation's raw arguments.
* @returns whether `--json` is a real flag of this invocation.
*/
function jsonRequested(argv) {
	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === "--") return false;
		if (argument === "--json") return true;
		if (argument === "--session-id") index += 1;
	}
	return false;
}
/**
* Parse and provide the one-shot task as an ordinary Cordis service. The
* command's action publishes the task; a missing task on an interactive stdin
* is a usage error, so on rejection (and on `--help`) nothing is provided.
* @param ctx - plugin context carrying the command line.
*/
function apply(ctx) {
	const program = headlessCommand();
	if (jsonRequested(ctx.get("cmdlineArgs")?.get() ?? [])) program.error = (message, errorOptions) => {
		const payload = boundJsonLine({
			type: "error",
			message: message.replace(/^error: /, "")
		});
		internals.stdout.write(`${payload}\n`);
		throw new CommanderError(1, errorOptions?.code ?? "commander.error", message);
	};
	program.action(() => {
		if (program.args.length > 1 && program.args.includes("-")) program.error("error: `-` must be the only task argument");
		const joined = program.args.join(" ");
		if (program.args.length > 0 && joined.trim() === "") program.error("error: a task is required, for example: dsh --profile headless \"run the tests\"");
		const task = program.args.length === 0 ? void 0 : joined;
		if (task === void 0 && internals.stdinIsTty()) program.error("error: a task is required, for example: dsh --profile headless \"run the tests\"");
		const options = program.opts();
		const sessionId = options.sessionId;
		if (sessionId !== void 0 && sessionId.trim() === "") program.error("error: --session-id requires a non-empty session id");
		ctx.provide(HEADLESS_STARTUP_SERVICE, {
			task,
			sessionId,
			json: options.json === true
		});
	});
	parseCmdline(ctx, program);
}
//#endregion
export { HEADLESS_STARTUP_SERVICE, apply, inject, name };
