import { Socket } from "node:net";
//#region lib/types/control.js
/** Inherited byte-channel protocol shared by subprocess launchers and Node children. */
/** Child descriptor reserved for the optional subprocess control channel. */
const SUBPROCESS_CONTROL_FD = 7;
/** Private launch marker consumed before a Node child executes application code. */
const SUBPROCESS_CONTROL_ENV = "DSH_SUBPROCESS_CONTROL";
/**
* Consume the launch marker and open the inherited control pipe at fd 7.
* The returned stream owns the descriptor. Call once before executing untrusted code;
* messages remain untrusted even though the endpoint was inherited.
* @returns a connected byte-mode duplex stream owned by the caller.
* @throws when the marker is missing/invalid or the inherited descriptor cannot be opened.
*/
function openInheritedControlChannel() {
	const marker = process.env[SUBPROCESS_CONTROL_ENV];
	Reflect.deleteProperty(process.env, SUBPROCESS_CONTROL_ENV);
	if (marker !== "pipe") throw new Error("subprocess control channel was not inherited");
	return new Socket({
		fd: 7,
		readable: true,
		writable: true,
		allowHalfOpen: true
	});
}
//#endregion
export { SUBPROCESS_CONTROL_ENV, SUBPROCESS_CONTROL_FD, openInheritedControlChannel };
