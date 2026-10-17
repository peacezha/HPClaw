import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { ERROR_INSUFFICIENT_BUFFER, Win32Error, allocPtrSlot, allocUint32, decodePtr, decodeUint32, drainPipe, extendWin32ProcessBindings, isNullPtr, isNullPtr as isNullPtr$1, spawnInheritedJobProcess, spawnPipedProcess, throwLastError, throwLastError as throwLastError$1, throwWin32, waitForProcessExit } from "@deepseek-ai/dsh-win32-process";
import { createHash } from "node:crypto";
import { createLazyRequire } from "@deepseek-ai/dsh-lazy-require";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { BUNDLED_SKILL_RANK } from "@deepseek-ai/dsh-skill";
import { parse } from "yaml";
//#region lib/types/win32-abi.js
/** ACL/token-specific Win32 constants. */
/** OpenProcess access required to query the current process token. */
const PROCESS_QUERY_INFORMATION = 1024;
/** Group attribute identifying the token logon SID. */
const SE_GROUP_LOGON_ID = 3221225472;
/**
* Capability-SID access mask granting write, delete, and child deletion.
* WRITE_DAC and WRITE_OWNER stay excluded so a confined child cannot rewrite
* DACLs or take ownership to escape the allowlist.
*/
const GRANT_MASK = 1114454;
/** Full access used in the restricted token default DACL. */
const FILE_ALL_ACCESS = 2032127;
//#endregion
//#region lib/types/ffi.js
/** ACL/token bindings layered on the shared Win32 process owner. */
const requireKoffi = createLazyRequire("koffi", import.meta.url);
let cachedTypes;
function ffiTypes() {
	if (cachedTypes !== void 0) return cachedTypes;
	const koffi = requireKoffi();
	const PVOID = koffi.pointer("void");
	return cachedTypes = {
		PVOID,
		PPVOID: koffi.pointer(PVOID)
	};
}
/**
* Return whether CreateFileW produced INVALID_HANDLE_VALUE.
* @param handle - handle returned by CreateFileW.
* @returns true for null, zero, or the all-bits-one sentinel.
*/
function isInvalidHandle(handle) {
	if (isNullPtr(handle)) return true;
	return handle === 18446744073709551615n || handle === -1n;
}
/**
* Encode a uint32 into an allocated slot.
* @param slot - slot allocated by allocUint32.
* @param value - unsigned value to store.
*/
function encodeUint32(slot, value) {
	requireKoffi().encode(slot, "uint32", value);
}
/**
* Return a Koffi pointer's numeric address for struct packing.
* @param ptr - native pointer.
* @returns pointer address.
*/
function ptrAddress(ptr) {
	return requireKoffi().address(ptr);
}
/**
* Allocate a raw byte block.
* @param length - byte count.
* @returns allocated pointer.
*/
function allocBytes(length) {
	return requireKoffi().alloc("uint8", length);
}
/**
* Allocate one zeroed x64 OVERLAPPED record.
* @returns allocated pointer.
* @remarks Koffi 3.1.1 crashes when LockFileEx or UnlockFileEx receives NULL;
* a zeroed OVERLAPPED is equivalent for the synchronous lock-file handle.
*/
function allocOverlapped() {
	return allocBytes(32);
}
/**
* Decode a pointer value from a Buffer field.
* @param buffer - encoded native record.
* @param offset - pointer field byte offset.
* @returns decoded pointer, or null for address zero.
*/
function decodePtrAt(buffer, offset) {
	const value = requireKoffi().decode(buffer, offset, ffiTypes().PVOID);
	return isNullPtr(value) ? null : value;
}
/**
* Decode a uint8 field at a native pointer offset.
* @param ptr - native record pointer.
* @param offset - field byte offset.
* @returns decoded value.
*/
function decodeUint8At(ptr, offset) {
	return requireKoffi().decode(ptr, offset, "uint8");
}
/**
* Decode a uint16 field at a native pointer offset.
* @param ptr - native record pointer.
* @param offset - field byte offset.
* @returns decoded value.
*/
function decodeUint16At(ptr, offset) {
	return requireKoffi().decode(ptr, offset, "uint16");
}
/**
* Decode a uint32 field at a native pointer offset.
* @param ptr - native record pointer.
* @param offset - field byte offset.
* @returns decoded value.
*/
function decodeUint32At(ptr, offset) {
	return requireKoffi().decode(ptr, offset, "uint32");
}
/**
* Compare two in-memory SID records without allocating strings.
* @param left - first native buffer.
* @param leftOffset - first SID byte offset.
* @param right - second native buffer.
* @param rightOffset - second SID byte offset.
* @returns true when revision, authority, and every sub-authority match.
*/
function sameSidAt(left, leftOffset, right, rightOffset) {
	if (decodeUint8At(left, leftOffset) !== decodeUint8At(right, rightOffset)) return false;
	const leftCount = decodeUint8At(left, leftOffset + 1);
	if (leftCount !== decodeUint8At(right, rightOffset + 1) || leftCount > 15) return false;
	for (let index = 0; index < 6; index += 1) if (decodeUint8At(left, leftOffset + 2 + index) !== decodeUint8At(right, rightOffset + 2 + index)) return false;
	for (let index = 0; index < leftCount; index += 1) if (decodeUint32At(left, leftOffset + 8 + index * 4) !== decodeUint32At(right, rightOffset + 8 + index * 4)) return false;
	return true;
}
let cached;
function bindings() {
	if (cached !== void 0) return cached;
	const koffi = requireKoffi();
	const { PVOID, PPVOID } = ffiTypes();
	cached = extendWin32ProcessBindings(({ kernel32, advapi32, bind }) => ({
		openProcess: bind(kernel32, "OpenProcess", PVOID, [
			"uint32",
			"int",
			"uint32"
		]),
		openProcessToken: bind(advapi32, "OpenProcessToken", "int", [
			PVOID,
			"uint32",
			PPVOID
		]),
		localAlloc: bind(kernel32, "LocalAlloc", PVOID, ["uint32", "size_t"]),
		localFree: bind(kernel32, "LocalFree", PVOID, [PVOID]),
		convertStringSidToSidW: bind(advapi32, "ConvertStringSidToSidW", "int", ["str16", PPVOID]),
		createWellKnownSid: bind(advapi32, "CreateWellKnownSid", "int", [
			"int",
			PVOID,
			PVOID,
			koffi.pointer("uint32")
		]),
		isValidSid: bind(advapi32, "IsValidSid", "int", [PVOID]),
		getLengthSid: bind(advapi32, "GetLengthSid", "uint32", [PVOID]),
		copySid: bind(advapi32, "CopySid", "int", [
			"uint32",
			PVOID,
			PVOID
		]),
		getTokenInformation: bind(advapi32, "GetTokenInformation", "int", [
			PVOID,
			"int",
			PVOID,
			"uint32",
			koffi.pointer("uint32")
		]),
		setTokenInformation: bind(advapi32, "SetTokenInformation", "int", [
			PVOID,
			"int",
			PVOID,
			"uint32"
		]),
		createRestrictedToken: bind(advapi32, "CreateRestrictedToken", "int", [
			PVOID,
			"uint32",
			"uint32",
			PVOID,
			"uint32",
			PVOID,
			"uint32",
			PVOID,
			PPVOID
		]),
		setEntriesInAclW: bind(advapi32, "SetEntriesInAclW", "uint32", [
			"uint32",
			PVOID,
			PVOID,
			PPVOID
		]),
		initializeAcl: bind(advapi32, "InitializeAcl", "int", [
			PVOID,
			"uint32",
			"uint32"
		]),
		addMandatoryAce: bind(advapi32, "AddMandatoryAce", "int", [
			PVOID,
			"uint32",
			"uint32",
			"uint32",
			PVOID
		]),
		setNamedSecurityInfoW: bind(advapi32, "SetNamedSecurityInfoW", "uint32", [
			"str16",
			"int",
			"uint32",
			PVOID,
			PVOID,
			PVOID,
			PVOID
		]),
		getNamedSecurityInfoW: bind(advapi32, "GetNamedSecurityInfoW", "uint32", [
			"str16",
			"int",
			"uint32",
			PPVOID,
			PPVOID,
			PPVOID,
			PPVOID,
			PPVOID
		]),
		getTempPathW: bind(kernel32, "GetTempPathW", "uint32", ["uint32", PVOID]),
		setEnvironmentVariableW: bind(kernel32, "SetEnvironmentVariableW", "int", ["str16", "str16"]),
		setConsoleCtrlHandler: bind(kernel32, "SetConsoleCtrlHandler", "int", [PVOID, "int"]),
		createFileW: bind(kernel32, "CreateFileW", PVOID, [
			"str16",
			"uint32",
			"uint32",
			PVOID,
			"uint32",
			"uint32",
			PVOID
		]),
		lockFileEx: bind(kernel32, "LockFileEx", "int", [
			PVOID,
			"uint32",
			"uint32",
			"uint32",
			"uint32",
			PVOID
		]),
		unlockFileEx: bind(kernel32, "UnlockFileEx", "int", [
			PVOID,
			"uint32",
			"uint32",
			"uint32",
			PVOID
		])
	}));
	return cached;
}
/**
* Resolve the cached ACL/token binding table asynchronously.
* @returns generic process plus ACL/token bindings.
*/
function win32() {
	return Promise.resolve(bindings());
}
/**
* Resolve the cached ACL/token binding table synchronously.
* @returns generic process plus ACL/token bindings.
*/
function win32Sync() {
	return bindings();
}
/**
* Resolve the current Windows temporary directory.
* @param api - active ACL/token binding table.
* @returns UTF-16 path reported by GetTempPathW.
*/
function getTempPath(api) {
	const buffer = Buffer.alloc(261 * 2);
	const length = api.getTempPathW(buffer.length / 2, buffer);
	if (length === 0) throwLastError(api, "GetTempPathW");
	if (length > buffer.length / 2) throw new Win32Error("GetTempPathW", ERROR_INSUFFICIENT_BUFFER, `required ${length} chars exceed the ${buffer.length / 2}-char buffer; nothing was written`);
	return buffer.subarray(0, length * 2).toString("utf16le");
}
//#endregion
//#region lib/types/acl.js
/**
* ACL editing helpers: grant/revoke a capability SID on a directory via
* SetEntriesInAclW + SetNamedSecurityInfoW (the same calls the POC uses, with
* the failure handling the POC lacks). Every API call is checked and every
* failure is reported with the API name, the exact Win32 code, the formatted
* system text, and the affected path.
*
* Each grant applies three edits in ONE SetNamedSecurityInfoW call: the
* capability-SID allow ACE, a Deny ACE that removes the ambient
* `FILE_DELETE_CHILD` right from the world SID, and a Low no-write-up
* mandatory label ({@link buildLowLabelAcl}). The deny is what keeps one
* granted root out of another's reach: Windows also authorizes a delete from
* the parent directory's `FILE_DELETE_CHILD` right, which the token's
* write-restricted intersection does not reach, and every granted root carries
* the Low label that clears the integrity check.
*
* Concurrency: grants are read-merge-write against the directory's CURRENT
* DACL, and the whole get-merge-set sequence runs under a per-path exclusive
* LockFileEx lock (see {@link withPathLock}) so concurrent sandbox instances
* cannot clobber each other's ACEs.
* @module @deepseek-ai/dsh-sandbox-windows-acl/acl
*/
/**
* Pack one EXPLICIT_ACCESS_W (48 bytes, layout verified by abi-probe.cpp):
* perms@0, mode@4, inheritance@8, Trustee@16 { pMultipleTrustee@16,
* MultipleTrusteeOperation@24, TrusteeForm@28, TrusteeType@32, ptstrName@40 }.
* `permissions` is the access mask; the POC passes 0 for REVOKE_ACCESS, which
* removes every ACE for the trustee. `inheritance` defaults to children of
* both kinds; the ambient-delete deny narrows it to containers because
* FILE_DELETE_CHILD is meaningless on a file and its bit would otherwise
* spread through the file's inherited mask.
* @param sidPtr - the trustee SID the entry names.
* @param mode - the access mode (GRANT_ACCESS, DENY_ACCESS, or REVOKE_ACCESS).
* @param permissions - the access mask to grant or deny (0 for REVOKE_ACCESS).
* @param inheritance - the ACE inheritance flags.
* @returns the packed entry buffer.
*/
function buildExplicitAccess(sidPtr, mode, permissions, inheritance = 3) {
	const entry = Buffer.alloc(48);
	entry.writeUInt32LE(permissions, 0);
	entry.writeUInt32LE(mode, 4);
	entry.writeUInt32LE(inheritance, 8);
	entry.writeUInt32LE(0, 24);
	entry.writeUInt32LE(0, 28);
	entry.writeUInt32LE(0, 32);
	entry.writeBigUInt64LE(ptrAddress(sidPtr), 40);
	return entry;
}
/**
* One lock file per protected path: `<GetTempPathW()>\dsh-acl-locks\<first 16
* hex of sha256(lowercased path)>.lock`. The lock root derives from
* GetTempPathW (never from runner argv or DSH_HOME), and the lowercasing
* maps Windows's case-insensitive path spellings onto one lock.
* @param api - the binding table.
* @param path - the protected directory (absolute).
* @returns the lock file path for that directory.
*/
function lockFilePath(api, path) {
	const digest = createHash("sha256").update(path.toLowerCase()).digest("hex").slice(0, 16);
	return join(getTempPath(api), "dsh-acl-locks", `${digest}.lock`);
}
/**
* Run `action` holding the per-path exclusive lock: CreateFileW
* (OPEN_ALWAYS, shared read/write but NOT delete — a deletable lock file
* could be removed and recreated under the holder, letting two processes
* hold "the same" lock), then a one-byte LockFileEx
* (LOCKFILE_EXCLUSIVE_LOCK, zeroed OVERLAPPED = lock from offset 0 on the
* synchronous handle — see allocOverlapped for why not NULL), then
* UnlockFileEx + CloseHandle. Fail-closed: open/lock/unlock/close failures
* throw like every other Win32 call in this package; an `action` failure
* still unlocks (best-effort) and rethrows the original error.
* @param api - the binding table.
* @param path - the protected directory (absolute).
* @param action - the get-merge-set sequence to serialize.
* @returns the action's result.
*/
function withPathLock(api, path, action) {
	const lockPath = lockFilePath(api, path);
	mkdirSync(dirname(lockPath), { recursive: true });
	const handle = api.createFileW(lockPath, -1073741824, 3, null, 4, 0, null);
	if (isInvalidHandle(handle)) throwLastError$1(api, "CreateFileW", lockPath);
	const overlapped = allocOverlapped();
	if (api.lockFileEx(handle, 2, 0, 1, 0, overlapped) === 0) {
		const win32Code = api.getLastError();
		api.closeHandle(handle);
		throwWin32(api, "LockFileEx", win32Code, lockPath);
	}
	let result;
	try {
		result = action();
	} catch (error) {
		api.unlockFileEx(handle, 0, 1, 0, overlapped);
		api.closeHandle(handle);
		throw error;
	}
	if (api.unlockFileEx(handle, 0, 1, 0, overlapped) === 0) {
		const win32Code = api.getLastError();
		api.closeHandle(handle);
		throwWin32(api, "UnlockFileEx", win32Code, lockPath);
	}
	if (api.closeHandle(handle) === 0) throwLastError$1(api, "CloseHandle", `lock file ${lockPath}`);
	return result;
}
/**
* Read the directory's current explicit DACL and mandatory label via
* GetNamedSecurityInfoW.
* Allocation contract (the POC's RevokeAccess, minus its missing checks): the
* returned ACL pointer sits INSIDE the security descriptor allocation — only
* the descriptor may be LocalFree'd, and it must not be freed before
* SetEntriesInAclW has consumed the ACL. Freeing the ACL pointer itself
* corrupts the heap (verified the hard way).
* @param api - the binding table.
* @param path - the directory whose DACL and label are read.
* @returns the current explicit DACL and label ACL (null when the directory carries none) plus their owning descriptor.
*/
function readCurrentSecurity(api, path) {
	const ownerSlot = allocPtrSlot();
	const groupSlot = allocPtrSlot();
	const daclSlot = allocPtrSlot();
	const saclSlot = allocPtrSlot();
	const descriptorSlot = allocPtrSlot();
	const readResult = api.getNamedSecurityInfoW(path, 1, 20, ownerSlot, groupSlot, daclSlot, saclSlot, descriptorSlot);
	if (readResult !== 0) throwWin32(api, "GetNamedSecurityInfoW", readResult, path);
	return {
		oldAcl: decodePtr(daclSlot),
		labelAcl: decodePtr(saclSlot),
		descriptor: decodePtr(descriptorSlot)
	};
}
/**
* Build the Low mandatory label applied with every write grant: one
* SYSTEM_MANDATORY_LABEL_ACE naming `lowLabelSidPtr` with the no-write-up
* policy, inheriting to subcontainers and objects so later children carry the
* same label. The caller frees the returned ACL with LocalFree
* (SetNamedSecurityInfoW copies it); every Win32 call is checked and a
* half-built ACL is released before the error is thrown.
* @param api - the binding table.
* @param lowLabelSidPtr - the Low integrity SID (S-1-16-4096) the label names.
* @returns the ACL carrying the single inheritable label ACE.
*/
function buildLowLabelAcl(api, lowLabelSidPtr) {
	const sidLength = api.getLengthSid(lowLabelSidPtr);
	if (sidLength === 0) throwLastError$1(api, "GetLengthSid", "Low mandatory label SID");
	const aclLength = 16 + sidLength;
	const acl = api.localAlloc(64, aclLength);
	if (isNullPtr$1(acl)) throwLastError$1(api, "LocalAlloc", "Low mandatory label ACL");
	if (api.initializeAcl(acl, aclLength, 2) === 0) {
		const win32Code = api.getLastError();
		api.localFree(acl);
		throwWin32(api, "InitializeAcl", win32Code, "Low mandatory label ACL");
	}
	if (api.addMandatoryAce(acl, 2, 3, 1, lowLabelSidPtr) === 0) {
		const win32Code = api.getLastError();
		api.localFree(acl);
		throwWin32(api, "AddMandatoryAce", win32Code, "Low mandatory label ACL");
	}
	return acl;
}
/**
* True when the label ACL already carries the EXACT label this module would
* add (mandatory-label ACE, OI|CI inheritance, no-write-up policy, the Low
* SID), so a re-grant can skip the eager full-tree propagation.
* @param labelAcl - the current label ACL pointer (from {@link readCurrentSecurity}).
* @param lowLabelSidPtr - the Low integrity SID to match.
* @returns whether the exact label ACE is already present.
*/
function hasExactLabel(labelAcl, lowLabelSidPtr) {
	return hasExactEntry(labelAcl, 17, 3, 1, lowLabelSidPtr);
}
/**
* Shared tail of grantWrite and revokeWrite: merge `entries` into `oldAcl`
* (null = no explicit DACL yet; SetEntriesInAclW builds one from scratch),
* free the descriptor before applying the merged ACL, apply the merged DACL
* together with the label edit in one SetNamedSecurityInfoW call, then free
* every ACL this call owns — checking each call and reporting with the
* caller's label. The entry count derives from the buffer, so a grant can
* carry its capability ACE and its ambient-delete deny in one merge.
* @param api - the binding table.
* @param path - the directory the DACL and label edits apply to.
* @param entries - packed EXPLICIT_ACCESS_W records to merge (grant, deny, or revoke).
* @param oldAcl - the current explicit DACL (from {@link readCurrentSecurity}).
* @param labelEdit - the label change to apply alongside the DACL.
* @param descriptor - the descriptor allocation owning `oldAcl`.
* @param label - the caller's name for error details.
*/
function mergeAndApply(api, path, entries, oldAcl, labelEdit, descriptor, label) {
	const newAclSlot = allocPtrSlot();
	const mergeResult = api.setEntriesInAclW(entries.length / 48, entries, oldAcl, newAclSlot);
	if (mergeResult !== 0) {
		if (descriptor !== null) api.localFree(descriptor);
		if (labelEdit.kind === "apply") api.localFree(labelEdit.acl);
		throwWin32(api, "SetEntriesInAclW", mergeResult, `${label}(${path})`);
	}
	const newAcl = decodePtr(newAclSlot);
	if (newAcl === null) {
		if (descriptor !== null) api.localFree(descriptor);
		if (labelEdit.kind === "apply") api.localFree(labelEdit.acl);
		throwWin32(api, "SetEntriesInAclW", api.getLastError(), `${label}(${path}): null new ACL`);
	}
	const freedDescriptor = descriptor !== null ? api.localFree(descriptor) : null;
	const applyResult = api.setNamedSecurityInfoW(path, 1, labelEdit.kind === "keep" ? 4 : 20, null, null, newAcl, labelEdit.kind === "apply" ? labelEdit.acl : null);
	const freedNew = api.localFree(newAcl);
	const freedLabel = labelEdit.kind === "apply" ? api.localFree(labelEdit.acl) : null;
	if (applyResult !== 0) throwWin32(api, "SetNamedSecurityInfoW", applyResult, `${label}(${path})`);
	if (freedDescriptor !== null && !isNullPtr$1(freedDescriptor)) throwLastError$1(api, "LocalFree", `${label}(${path}) descriptor`);
	if (!isNullPtr$1(freedNew)) throwLastError$1(api, "LocalFree", `${label}(${path}) new ACL`);
	if (freedLabel !== null && !isNullPtr$1(freedLabel)) throwLastError$1(api, "LocalFree", `${label}(${path}) label ACL`);
}
/**
* True when the explicit DACL already carries the EXACT entry
* `(aceType, inheritance, mask, trustee SID)`. Every field is read through
* koffi.decode at pointer offsets — no memcpy, no pointer arithmetic. The
* ACE's SID is INLINE (embedded in the ACE after the 4-byte mask — there is
* no pointer to read; reading one yields garbage addresses and crashed
* EqualSid, verified by gdb), so it is compared field-by-field against the
* trustee SID through bounded offset reads ({@link sameSidAt}). Allowed and
* denied ACEs share the Mask@4/SID@8 layout. A malformed header reads as "no
* exact entry" so the caller falls back to the merge-apply path, which owns
* the robust failure handling.
* @param acl - the current explicit DACL pointer (from {@link readCurrentSecurity}).
* @param aceType - the ACE type to match.
* @param inheritance - the ACE inheritance flags to match.
* @param mask - the access mask to match.
* @param sidPtr - the trustee SID to match.
* @returns whether the exact entry is already present.
*/
function hasExactEntry(acl, aceType, inheritance, mask, sidPtr) {
	const aclSize = decodeUint16At(acl, 2);
	const aceCount = decodeUint16At(acl, 4);
	if (aclSize < 8 || aclSize > 1048576) return false;
	let offset = 8;
	for (let index = 0; index < aceCount; index++) {
		const aceSize = decodeUint16At(acl, offset + 2);
		if (aceSize < 8 || offset + aceSize > aclSize) return false;
		if (decodeUint8At(acl, offset) === aceType && decodeUint8At(acl, offset + 1) === inheritance && decodeUint32At(acl, offset + 4) === mask && sameSidAt(acl, offset + 8, sidPtr, 0)) return true;
		offset += aceSize;
	}
	return false;
}
/**
* True when the explicit DACL already carries the EXACT write grant this
* module would add: the Allow ACE for {@link abi.GRANT_MASK} naming the
* capability SID.
* @param oldAcl - the current explicit DACL pointer (from {@link readCurrentSecurity}).
* @param sidPtr - the capability SID to match.
* @returns whether the exact grant ACE is already present.
*/
function hasExactGrant(oldAcl, sidPtr) {
	return hasExactEntry(oldAcl, 0, 3, GRANT_MASK, sidPtr);
}
/**
* True when the explicit DACL already carries the EXACT ambient-delete deny:
* the container-inherited Deny ACE for {@link abi.FILE_DELETE_CHILD} naming
* the world SID. It is part of the idempotent skip, so a root granted by an
* earlier build receives the deny on its next provision.
* @param oldAcl - the current explicit DACL pointer (from {@link readCurrentSecurity}).
* @param worldSidPtr - the Everyone SID the deny names.
* @returns whether the exact deny ACE is already present.
*/
function hasExactDeny(oldAcl, worldSidPtr) {
	return hasExactEntry(oldAcl, 1, 2, 64, worldSidPtr);
}
/**
* True when a capability grant for a SID OTHER than `sidPtr` stands on this
* DACL — the condition under which a revoke must leave the shared Low label in
* place, or the remaining grant's child would lose its write authority.
* @param oldAcl - the current explicit DACL pointer (from {@link readCurrentSecurity}).
* @param sidPtr - the capability SID being revoked.
* @returns whether another capability grant remains.
*/
function hasForeignGrant(oldAcl, sidPtr) {
	const aclSize = decodeUint16At(oldAcl, 2);
	const aceCount = decodeUint16At(oldAcl, 4);
	if (aclSize < 8 || aclSize > 1048576) return false;
	let offset = 8;
	for (let index = 0; index < aceCount; index++) {
		const aceSize = decodeUint16At(oldAcl, offset + 2);
		if (aceSize < 8 || offset + aceSize > aclSize) return false;
		if (decodeUint8At(oldAcl, offset) === 0 && decodeUint32At(oldAcl, offset + 4) === 1114454 && !sameSidAt(oldAcl, offset + 8, sidPtr, 0)) return true;
		offset += aceSize;
	}
	return false;
}
/**
* Grant `GRANT_MASK` (Write+Delete, displays as "Modify") to the capability SID
* on `path`, deny the world SID the ambient `FILE_DELETE_CHILD` right, and
* apply the Low mandatory label — one merge. The deny inherits to containers
* only: the right is evaluated on directories, and inheriting its bit onto
* files would deny every `FILE_ALL_ACCESS`/`GENERIC_ALL` open inside the root
* (0x40 is a member of that mask). The capability ACE's DELETE bit is then the
* only delete authority inside the root, so a file whose own DACL grants no
* DELETE is no longer deletable through its parent's rights.
*
* Idempotent: the exact ACE, deny, and label together SKIP the
* SetNamedSecurityInfoW apply, which would otherwise re-propagate the
* identical descriptor across the whole tree (eager inheritance; minutes on
* large workspaces). Otherwise read-merge-write, so pre-existing explicit ACEs
* survive (same shape as {@link revokeWrite}). Runs under the per-path lock.
* The directory must be owned by the caller AND grant WRITE_OWNER (the label
* lives in the SACL; owner-implicit rights cover only READ_CONTROL and
* WRITE_DAC) — a Full-control workspace satisfies both.
* @param api - the binding table.
* @param path - the directory whose DACL and label gain the grant (the workspace or temp root).
* @param sidPtr - the capability SID the ACE names.
* @param lowLabelSidPtr - the Low integrity SID the mandatory label names.
* @param worldSidPtr - the Everyone SID the ambient-delete deny names.
*/
function grantWrite(api, path, sidPtr, lowLabelSidPtr, worldSidPtr) {
	withPathLock(api, path, () => {
		const { oldAcl, labelAcl, descriptor } = readCurrentSecurity(api, path);
		if (oldAcl !== null && labelAcl !== null && hasExactGrant(oldAcl, sidPtr) && hasExactDeny(oldAcl, worldSidPtr) && hasExactLabel(labelAcl, lowLabelSidPtr)) {
			if (descriptor !== null) {
				if (!isNullPtr$1(api.localFree(descriptor))) throwLastError$1(api, "LocalFree", `grantWrite(${path}) descriptor`);
			}
			return;
		}
		let label;
		try {
			label = buildLowLabelAcl(api, lowLabelSidPtr);
		} catch (error) {
			if (descriptor !== null) api.localFree(descriptor);
			throw error;
		}
		mergeAndApply(api, path, Buffer.concat([buildExplicitAccess(worldSidPtr, 3, 64, 2), buildExplicitAccess(sidPtr, 1, GRANT_MASK)]), oldAcl, {
			kind: "apply",
			acl: label
		}, descriptor, "grantWrite");
	});
}
/**
* Remove every ACE for the capability SID from the directory DACL (REVOKE_ACCESS
* merge — other entries are preserved). The shared Low label is cleared only
* when no other capability grant remains on the directory: two grants may
* target one directory, and the surviving one still needs the label for its
* child's writes. Returns whether an ACE removal was attempted (false when the
* directory carries no DACL at all).
*
* Runs under the per-path lock (the whole get-merge-set sequence); the
* descriptor/ACL allocation contract lives on {@link readCurrentSecurity}.
* @param api - the binding table.
* @param path - the directory whose DACL loses the capability-SID ACEs.
* @param sidPtr - the capability SID whose ACEs are removed.
* @returns whether an ACE removal was attempted (false when the directory carries no DACL at all).
*/
function revokeWrite(api, path, sidPtr) {
	return withPathLock(api, path, () => {
		const { oldAcl, descriptor } = readCurrentSecurity(api, path);
		if (oldAcl === null) {
			if (descriptor !== null) {
				if (!isNullPtr$1(api.localFree(descriptor))) throwLastError$1(api, "LocalFree", `revokeWrite(${path}) descriptor`);
			}
			return false;
		}
		mergeAndApply(api, path, buildExplicitAccess(sidPtr, 4, 0), oldAcl, hasForeignGrant(oldAcl, sidPtr) ? { kind: "keep" } : { kind: "clear" }, descriptor, "revokeWrite");
		return true;
	});
}
//#endregion
//#region lib/types/path-boundary.js
/**
* Canonical directory-boundary checks for the Windows ACL workspace and
* private-temp capabilities.
* @module @deepseek-ai/dsh-sandbox-windows-acl/path-boundary
*/
/** Whether `root` is the same canonical directory as `candidate` or contains it. */
function containsDirectory(root, candidate) {
	const relation = relative(realpathSync.native(root), realpathSync.native(candidate));
	return relation === "" || !isAbsolute(relation) && relation !== ".." && !relation.startsWith(`..${sep}`);
}
/**
* Reject a temp parent that is inside the workspace: every child created
* below it would inherit the standing workspace capability.
* @param workspaceRoot - the canonical workspace root that receives the standing ACE.
* @param tempRoot - the existing parent beneath which a private temp child would be created.
*/
function assertTempRootOutsideWorkspace(workspaceRoot, tempRoot) {
	if (containsDirectory(workspaceRoot, tempRoot)) throw new Error(`Windows ACL temp root must be outside the workspace: workspace=${workspaceRoot}; temp=${tempRoot}`);
}
/**
* Reject overlap between an actual private temp directory and any writable
* directory: either inheritance direction would merge the two capabilities.
* @param writableDirs - directories carrying the standing workspace capability.
* @param tempDir - the existing directory carrying the revocable temp capability.
*/
function assertPrivateTempDisjoint(writableDirs, tempDir) {
	for (const writableDir of writableDirs) if (containsDirectory(writableDir, tempDir) || containsDirectory(tempDir, writableDir)) throw new Error(`AclSandbox private temp directory must be disjoint from writable directories: writable=${writableDir}; temp=${tempDir}`);
}
//#endregion
//#region lib/types/spawn.js
/** Restricted-token adapters over the shared Win32 process owner. */
/**
* Spawn a restricted-token child with piped stdout/stderr.
* @param api - ACL/token binding table.
* @param token - restricted primary token.
* @param options - command, args, and working directory.
* @returns process and caller-owned pipe handles.
*/
function spawnSandboxed(api, token, options) {
	return spawnPipedProcess(api, {
		...options,
		token
	});
}
/**
* Spawn a restricted-token child in a kill-on-close Job with inherited stdio.
* @param api - ACL/token binding table.
* @param token - restricted primary token.
* @param options - command, args, and working directory.
* @returns process and Job handles after assignment and resume.
*/
function spawnSandboxedInherited(api, token, options) {
	return spawnInheritedJobProcess(api, {
		...options,
		token
	});
}
/**
* Wait for a restricted child and close its process handle.
* @param api - ACL/token binding table.
* @param process - caller-owned process handle.
* @returns direct process exit code.
*/
function waitForExit(api, process) {
	return waitForProcessExit(api, process);
}
//#endregion
//#region lib/types/token.js
/**
* Restricted-token construction: open the current process token, extract its
* logon SID, build the well-known SIDs, and call CreateRestrictedToken with
* the POC's restricting-SID allowlist. Every API call is checked; any failure
* throws with the API name and the exact Win32 code — the original POC ignored
* all of these and silently ran children with the FULL, unrestricted token.
* @module @deepseek-ai/dsh-sandbox-windows-acl/token
*/
/**
* Open the current process's access token with the rights
* CreateRestrictedToken requires (the POC's OpenProcessToken call; the token
* handle is obtained through a real OpenProcess handle because the
* GetCurrentProcess() pseudo-handle is not addressable through koffi).
* @param api - the binding table.
* @returns the opened token handle.
*/
function openCurrentProcessToken(api) {
	const processHandle = api.openProcess(PROCESS_QUERY_INFORMATION, 0, process.pid);
	if (isNullPtr$1(processHandle)) throwLastError$1(api, "OpenProcess", `pid ${process.pid}`);
	const tokenSlot = allocPtrSlot();
	if (api.openProcessToken(processHandle, 139, tokenSlot) === 0) {
		const win32Code = api.getLastError();
		api.closeHandle(processHandle);
		throwWin32(api, "OpenProcessToken", win32Code, `pid ${process.pid}`);
	}
	if (api.closeHandle(processHandle) === 0) throwLastError$1(api, "CloseHandle", "OpenProcess process handle");
	const token = decodePtr(tokenSlot);
	if (token === null) throwWin32(api, "OpenProcessToken", api.getLastError(), "null token handle");
	return token;
}
/**
* Find and copy the token's logon session SID (S-1-5-5-x-y, attribute
* SE_GROUP_LOGON_ID). The restricted token needs it for WinSta0/desktop and
* other per-logon objects; the POC extracts it the same way.
* @param api - the binding table.
* @param token - the token whose groups are scanned.
* @returns a copied logon SID (thrown when the token carries none).
*/
function findLogonSid(api, token) {
	const neededSlot = allocUint32();
	api.getTokenInformation(token, 2, null, 0, neededSlot);
	const needed = decodeUint32(neededSlot);
	if (needed === 0) throwLastError$1(api, "GetTokenInformation", "TokenGroups size query");
	if (needed < 8) throwWin32(api, "GetTokenInformation", api.getLastError(), `implausible TokenGroups size ${needed}`);
	const groups = Buffer.alloc(needed);
	if (api.getTokenInformation(token, 2, groups, groups.length, neededSlot) === 0) throwLastError$1(api, "GetTokenInformation", "TokenGroups");
	const groupCount = groups.readUInt32LE(0);
	for (let index = 0; index < groupCount; index++) {
		const sidPtr = decodePtrAt(groups, 8 + index * 16);
		const isLogonId = (groups.readUInt32LE(8 + index * 16 + 8) & SE_GROUP_LOGON_ID) >>> 0 === SE_GROUP_LOGON_ID >>> 0;
		if (sidPtr === null || !isLogonId) continue;
		const sidLength = api.getLengthSid(sidPtr);
		if (sidLength === 0) throwLastError$1(api, "GetLengthSid", `logon SID group ${index}`);
		const copy = allocBytes(sidLength);
		if (api.copySid(sidLength, copy, sidPtr) === 0) throwLastError$1(api, "CopySid", `logon SID group ${index}`);
		return copy;
	}
	throw new Error(`CreateRestrictedToken prerequisite failed: no logon SID found among ${groupCount} token groups`);
}
/**
* Create one well-known SID (68-byte buffer) and assert its validity.
* @param api - the binding table.
* @param type - the WELL_KNOWN_SID_TYPE to create.
* @returns the created SID pointer.
*/
function makeWellKnownSid(api, type) {
	const sid = allocBytes(68);
	const sizeSlot = allocUint32();
	encodeUint32(sizeSlot, 68);
	if (api.createWellKnownSid(type, null, sid, sizeSlot) === 0) throwLastError$1(api, "CreateWellKnownSid", `type ${type}`);
	if (api.isValidSid(sid) === 0) throwLastError$1(api, "IsValidSid", `CreateWellKnownSid type ${type}`);
	return sid;
}
/**
* Merge one full-access allow ACE for `sidPtr` into the token's DEFAULT DACL
* — the DACL every NEW object the token holder creates (without an explicit
* security descriptor) takes. The restricted token inherits the user's
* default DACL verbatim, which names no restricting SID: a new anonymous pipe
* (child stdio) therefore fails the write pass-2 check at creation
* (ERROR_ACCESS_DENIED; Node surfaces it as spawn EPERM), breaking every
* piped-stdio grandchild spawn. The merged ACE names a RESTRICTING SID (the
* write SID under workspace-write, Everyone under read-only), so each new
* object's own DACL passes pass-2 while object creation itself stays gated by
* the parent container's DACL (files outside the granted trees remain
* uncreatable). Fails closed: any Win32 failure throws before the spawn.
* @param api - the binding table.
* @param token - the restricted token to adjust (requires TOKEN_ADJUST_DEFAULT).
* @param sidPtr - the restricting SID whose full-access ACE joins the default DACL.
*/
function setTokenDefaultDaclGrant(api, token, sidPtr) {
	const neededSlot = allocUint32();
	api.getTokenInformation(token, 6, null, 0, neededSlot);
	const needed = decodeUint32(neededSlot);
	if (needed === 0) throwLastError$1(api, "GetTokenInformation", "TokenDefaultDacl size query");
	const buffer = Buffer.alloc(needed);
	if (api.getTokenInformation(token, 6, buffer, buffer.length, neededSlot) === 0) throwLastError$1(api, "GetTokenInformation", "TokenDefaultDacl");
	const currentDacl = decodePtrAt(buffer, 0);
	if (currentDacl === null) throw new Error("setTokenDefaultDaclGrant: the token carries no default DACL to extend");
	const newDaclSlot = allocPtrSlot();
	const result = api.setEntriesInAclW(1, buildExplicitAccess(sidPtr, 1, FILE_ALL_ACCESS), currentDacl, newDaclSlot);
	if (result !== 0) throwWin32(api, "SetEntriesInAclW", result, "default DACL merge");
	const newDacl = decodePtr(newDaclSlot);
	if (newDacl === null) throwWin32(api, "SetEntriesInAclW", result, "null merged default DACL");
	const info = Buffer.alloc(8);
	info.writeBigUInt64LE(newDacl, 0);
	if (api.setTokenInformation(token, 6, info, info.length) === 0) {
		const win32Code = api.getLastError();
		api.localFree(newDacl);
		throwWin32(api, "SetTokenInformation", win32Code, "TokenDefaultDacl");
	}
	api.localFree(newDacl);
}
/**
* Lower the restricted token's integrity level to Low (S-1-16-4096), the level
* the mandatory labels `grantWrite` applies are matched against; a token left
* at Medium would ignore them. Requires TOKEN_ADJUST_DEFAULT on the token;
* fails closed before any child is spawned.
* @param api - the binding table.
* @param token - the restricted token to lower.
* @param lowLabelSidPtr - the Low integrity SID (S-1-16-4096).
*/
function restrictTokenIntegrity(api, token, lowLabelSidPtr) {
	const sidLength = api.getLengthSid(lowLabelSidPtr);
	if (sidLength === 0) throwLastError$1(api, "GetLengthSid", "Low integrity label SID");
	const info = Buffer.alloc(16 + sidLength);
	info.writeBigUInt64LE(ptrAddress(lowLabelSidPtr), 0);
	info.writeUInt32LE(32, 8);
	if (api.setTokenInformation(token, 25, info, info.length) === 0) throwLastError$1(api, "SetTokenInformation", "TokenIntegrityLevel (Low)");
}
/** Pack `SID_AND_ATTRIBUTES[count]` (16-byte stride; Attributes stay 0). */
function buildRestrictingSids(sids) {
	const buffer = Buffer.alloc(16 * sids.length);
	sids.forEach((sid, index) => {
		buffer.writeBigUInt64LE(ptrAddress(sid), 16 * index);
	});
	return buffer;
}
/**
* Create the write-restricted token with the mode-selected restricting list
* (verified on Win11 26200, see the POC-worktree restrict-variant harness):
*  - read-only:       [logon SID, EVERYONE]
*  - workspace-write: [logon SID, EVERYONE, workspace SID, optional temp SID]
*
* The logon SID + EVERYONE keep-alive group is shared by both modes: early
* DLL init dies with 0xC0000142 and CNG (`\Device\CNG` write trustee —
* pwsh crashes 0xE0434352) fails without them. The write SIDs join ONLY
* workspace-write — read-only carries no write SID, so a standing grant ACE
* from an earlier workspace-write period (a `/permission` mode downgrade, or
* a crash-resumed session) stays INERT under read-only: the WRITE_RESTRICTED
* pass-2 check grants only what the restricting list carries, keeping that
* workspace grant inert under read-only while the unrevoked ACE keeps the
* re-upgrade free (the grant's exact-ACE skip — no re-propagation).
* Everyone's own ambient grants remain the documented partial boundary.
* Authenticated Users is absent from BOTH lists: the WMI
* namespace security check fails (0x80041003), so CIM is unavailable in
* every confined mode, and the C:\-root tree-creation escape (standing
* `AU:(AD)` + `AU:(OI)(CI)(IO)(M)` ACEs) is closed in both — documented in
* README. INTERACTIVE/LOCAL are absent from BOTH lists too — the host's
* Public tree grants write to INTERACTIVE, so removing it closes that
* escape. S-1-2-1 (console logon) is intentionally absent: the package
* README's "Console isolation is unavailable" entry records the verified
* failure modes. FAILS CLOSED: any failure throws — never
* spawn unrestricted.
* @param api - the binding table.
* @param currentToken - the process token to restrict.
* @param logonSid - the copied logon session SID.
* @param writeSids - the distinct write SIDs forming the workspace and
* optional temp allowlists (workspace-write only; empty under read-only).
* @param known - the well-known SIDs entering the restricting list.
* @param mode - selects the restricting list (workspace-write adds the capability SIDs).
* @returns the restricted token handle.
*/
function createRestrictedToken(api, currentToken, logonSid, writeSids, known, mode) {
	const restrictingSids = buildRestrictingSids(mode === "read-only" ? [logonSid, known.world] : writeSids.length === 0 ? (() => {
		throw new Error("createRestrictedToken: workspace-write restricting list requires at least one write SID");
	})() : [
		logonSid,
		known.world,
		...writeSids
	]);
	const tokenSlot = allocPtrSlot();
	if (api.createRestrictedToken(currentToken, 13, 0, null, 0, null, restrictingSids.length / 16, restrictingSids, tokenSlot) === 0) throwLastError$1(api, "CreateRestrictedToken", `restricting SIDs: ${restrictingSids.length / 16}`);
	const token = decodePtr(tokenSlot);
	if (token === null) throwWin32(api, "CreateRestrictedToken", api.getLastError(), "null token handle");
	return token;
}
//#endregion
//#region lib/types/grant.js
/**
* Server-side write-grant materialization. The sandbox seam holds one
* standing workspace grant per workspace and one revocable temp grant per
* live session/workspace pair. Workspace identities survive by deterministic
* derivation and their standing ACE; temp identities derive from random
* private paths and are deliberately new after a restart.
*
* Fail-closed: `add` throws on any grant failure and the caller disposes the
* instance (revoking every path granted so far); `dispose` revokes every
* revocable grant, leaves the standing workspace edits in place, and reports
* every cleanup failure.
* @module @deepseek-ai/dsh-sandbox-windows-acl/grant
*/
/**
* One write SID's provider-lifetime grant materialization: the parsed SID
* pointer plus every directory whose DACL currently carries its ACE and whose
* label ACL carries the Low mandatory label. Workspace paths are added
* STANDING (their security descriptor edits are the cross-session reuse cache
* and outlive the grant — dispose() skips revoking them, or the next
* provision would re-propagate the whole tree); temp paths are revocable
* (dispose() revokes them — an inheritable ACE must not outlive its
* session's temp directory). Create with {@link AclWriteGrant.create};
* dispose revokes the revocable paths and frees every SID.
*/
var AclWriteGrant = class AclWriteGrant {
	/** The write SID in SDDL string form. */
	writeSid;
	api;
	sidPtr;
	lowLabelSidPtr;
	worldSidPtr;
	revocablePaths = [];
	standingPaths = [];
	constructor(api, sidPtr, lowLabelSidPtr, worldSidPtr, writeSid) {
		this.api = api;
		this.sidPtr = sidPtr;
		this.lowLabelSidPtr = lowLabelSidPtr;
		this.worldSidPtr = worldSidPtr;
		this.writeSid = writeSid;
	}
	/**
	* Parse the SID string, create the Low integrity SID the grants label with
	* and the world SID their ambient-delete deny names, and open the binding
	* table (lazily, once per server). Fail-closed: any failure throws — nothing
	* is granted yet.
	* @param writeSid - the workspace (`S-1-4-x-y`) or temp (`S-1-4-x-y-1`) capability SID string.
	* @param api - optional already-resolved bindings (tests).
	* @returns the ready grant (no ACEs yet).
	*/
	static create(writeSid, api) {
		const bindings = api ?? win32Sync();
		const sidSlot = allocPtrSlot();
		if (bindings.convertStringSidToSidW(writeSid, sidSlot) === 0) throwLastError$1(bindings, "ConvertStringSidToSidW", writeSid);
		const sidPtr = decodePtr(sidSlot);
		if (sidPtr === null) throwLastError$1(bindings, "ConvertStringSidToSidW", `null SID for ${writeSid}`);
		try {
			const lowLabelSidPtr = makeWellKnownSid(bindings, 66);
			try {
				return new AclWriteGrant(bindings, sidPtr, lowLabelSidPtr, makeWellKnownSid(bindings, 1), writeSid);
			} catch (error) {
				bindings.localFree(lowLabelSidPtr);
				throw error;
			}
		} catch (error) {
			bindings.localFree(sidPtr);
			throw error;
		}
	}
	/**
	* Grant the write ACE, the ambient-delete deny, and the Low mandatory label
	* on one directory (idempotent: an already-standing exact ACE, deny, and
	* label skip the eager full-tree re-propagation — see {@link grantWrite})
	* and record the path for {@link dispose} unless it is standing. The path is
	* recorded BEFORE the grant: a post-apply throw (a LocalFree failure after
	* SetNamedSecurityInfoW succeeded) must still revoke it, and revoking an
	* ungranted path is a no-op merge. Callers treat a throw as a failed
	* materialization and dispose the instance to revoke the paths granted so
	* far.
	* @param path - the directory whose DACL and label gain the grant.
	* @param standing - the edits outlive this grant (the workspace reuse
	*   cache; dispose() skips revoking it). Default false (revoked on
	*   dispose — the temp-directory lifecycle).
	*/
	add(path, standing = false) {
		(standing ? this.standingPaths : this.revocablePaths).push(path);
		grantWrite(this.api, path, this.sidPtr, this.lowLabelSidPtr, this.worldSidPtr);
	}
	/** Every directory currently carrying the grant, in grant order. */
	get paths() {
		return [...this.standingPaths, ...this.revocablePaths];
	}
	/** Revoke every revocable grant (standing security descriptor edits stay) and free the SIDs; reports every cleanup failure. */
	dispose() {
		const failures = [];
		for (const path of this.revocablePaths) try {
			revokeWrite(this.api, path, this.sidPtr);
		} catch (error) {
			failures.push(error);
		}
		for (const [label, sidPtr] of [
			["write SID", this.sidPtr],
			["Low label SID", this.lowLabelSidPtr],
			["world SID", this.worldSidPtr]
		]) try {
			if (!isNullPtr$1(this.api.localFree(sidPtr))) throwLastError$1(this.api, "LocalFree", label);
		} catch (error) {
			failures.push(error);
		}
		if (failures.length > 0) throw new AggregateError(failures, `AclWriteGrant dispose completed with ${failures.length} cleanup failure(s)`);
	}
};
//#endregion
//#region lib/types/workspace-sid.js
/**
* The per-workspace write identity: a deterministic `S-1-4-x-y` SID derived
* from the canonical workspace path, whose ACEs form that workspace's write
* allowlist. Every confined execution of the same workspace — across
* sessions, server restarts, and calls — carries the SAME write SID, so the
* workspace-root ACE materializes once per workspace per machine (the
* grant's exact-ACE skip then makes every later provision O(1)) instead of
* once per session. The SID's power is defined solely by the ACEs that name
* it (which exist only on the workspace tree and the session's private temp
* directory), and only tokens minted for that workspace carry it — the SID
* string itself is not a secret. Temporary directories use a separate,
* per-directory identity from {@link tempWriteSid}; sharing the workspace
* identity with temp would let sibling sessions write one another's temp
* trees.
*
* The input MUST be the canonical workspace path (`realpathSync.native` on
* Windows — the sandbox-policy `resolveWorkspaceRoot` already applies it):
* canonicalization converges case/alias spellings, so two spellings of one
* workspace derive one SID; an as-spelled fallback path would mint a second
* identity for the same directory (self-healing, at the cost of one extra
* tree propagation). Renaming the workspace directory derives a new SID —
* the old standing ACEs are inert residue, and the next session re-propagates
* once.
* @module @deepseek-ai/dsh-sandbox-windows-acl/workspace-sid
*/
/**
* Derive the workspace's write SID (`S-1-4-x-y`; subauthorities 30-bit,
* matching the workspace-capability shape the token and ACE layers carry).
* @param workspaceRoot - the canonical workspace path.
* @returns the SDDL string form.
*/
function workspaceWriteSid(workspaceRoot) {
	const digest = createHash("sha256").update(workspaceRoot, "utf8").digest();
	return `S-1-4-${digest.readUInt32LE(0) % (2 ** 30 - 1) + 1}-${digest.readUInt32LE(4) % (2 ** 30 - 1) + 1}`;
}
/**
* Derive one private temp directory's write SID. The random directory path
* is the capability identity; a fixed third subauthority domain-separates
* the result from every two-subauthority workspace SID.
* @param tempDir - the private temp directory's absolute path.
* @returns the SDDL string form.
*/
function tempWriteSid(tempDir) {
	const digest = createHash("sha256").update("temp\0", "utf8").update(tempDir, "utf8").digest();
	return `S-1-4-${digest.readUInt32LE(0) % (2 ** 30 - 1) + 1}-${digest.readUInt32LE(4) % (2 ** 30 - 1) + 1}-1`;
}
//#endregion
//#region lib/types/acl-skill.js
/**
* Registers the bundled Windows sandbox ACL diagnosis skill.
*
* The provider owns a private filesystem copy of its resources so external
* PowerShell can execute them even when the package lives inside ASAR or SEA.
* Disposing the registration removes both the provider and its resource copy.
*
* @module @deepseek-ai/dsh-sandbox-windows-acl
*/
/** Bundled skill that diagnoses Windows sandbox ACL failures. */
const ACL_DIAGNOSIS_SKILL = "diagnose-windows-sandbox-acl";
/** Provider name this module registers the skill under. */
const PROVIDER = "dsh-windows-acl";
function parseSkill(raw, path) {
	const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw);
	if (frontmatter?.[1] === void 0) throw new Error(`dsh-sandbox-windows-acl: ${path} has no YAML frontmatter`);
	const metadata = parse(frontmatter[1]);
	const description = typeof metadata === "object" && metadata !== null && "description" in metadata ? metadata.description : void 0;
	if (typeof description !== "string" || description.length === 0) throw new Error(`dsh-sandbox-windows-acl: ${path} has no description`);
	return {
		description,
		content: raw.slice(frontmatter[0].length).trim()
	};
}
/**
* Register the bundled diagnosis skill with a private resource directory owned by this fiber.
* Missing or invalid packaged assets fail registration; disposal removes the directory.
* @param ctx - Context carrying the skill registry.
*/
function registerAclDiagnosisSkill(ctx) {
	const packaged = fileURLToPath(new URL(`../assets/${ACL_DIAGNOSIS_SKILL}/`, import.meta.url));
	ctx.effect(function* () {
		const directory = mkdtempSync(join(tmpdir(), "dsh-acl-skill-"));
		yield async () => {
			await rm(directory, {
				recursive: true,
				force: true
			});
		};
		mkdirSync(join(directory, "scripts"));
		for (const path of ["SKILL.md", "scripts/diagnose-windows-sandbox-acl.ps1"]) writeFileSync(join(directory, path), readFileSync(join(packaged, path)), {
			flag: "wx",
			mode: 384
		});
		const locator = join(directory, "SKILL.md");
		const { description } = parseSkill(readFileSync(locator, "utf8"), locator);
		const candidate = {
			name: ACL_DIAGNOSIS_SKILL,
			description,
			invocation: {
				modelInvocable: true,
				userInvocable: true
			},
			provider: PROVIDER,
			source: "bundled",
			rank: BUNDLED_SKILL_RANK,
			resourceBase: {
				kind: "directory",
				path: directory
			},
			locator
		};
		const provider = {
			name: PROVIDER,
			list: () => Promise.resolve([candidate]),
			async get(entry, options) {
				const { rank: _rank, locator: entryPath, ...summary } = entry;
				const raw = await readFile(entryPath, {
					encoding: "utf8",
					signal: options.signal
				});
				return {
					...summary,
					content: parseSkill(raw, entryPath).content
				};
			}
		};
		yield ctx.skills.registerProvider(() => provider);
	}, "Windows ACL diagnosis skill resources");
}
//#endregion
//#region lib/types/index.js
/**
* Windows ACL write-restriction sandbox backend for the DeepSeek Harness
* sandbox seam. Mirrors the mechanism of github.com/huoyaoyuan/
* windows-acl-restrict-poc @ 10e4dfb (the fixed revision): a WRITE_RESTRICTED
* token whose restricting SIDs include distinct workspace and temp write
* SIDs that this sandbox adds to their owning directories' DACLs — the
* intersection check then allows writes exactly where either capability has
* a Write ACE, and nowhere else those SIDs are concerned (the check ALSO
* inherits the ambient write ACEs of the other restricting SIDs — the
* keep-alive group logon SID + Everyone; Authenticated Users, INTERACTIVE,
* and LOCAL are absent from both lists — see the seam's dual-list contract
* in `packages/sandbox/sandbox-local` and the package README's Modes section
* for the complete boundary). The intersection covers only the object's own
* access check, so the token is also lowered to Low integrity and every
* granted directory carries a Low no-write-up label and the ambient-delete
* deny the `acl` module documents. The write SID is the per-WORKSPACE identity
* ({@link workspaceWriteSid}): deterministic from the canonical workspace
* path, so the workspace-root ACE materializes once per workspace per
* machine and every later provision hits the exact-ACE skip — the
* grant-reuse story the per-session random SID paid a full tree propagation
* per session for. Each private temp directory instead receives its own SID,
* so sibling sessions sharing a workspace cannot enter one another's temp
* trees. Unlike the POC, every API failure throws with the API
* name and exact Win32 code; a child is NEVER spawned unrestricted.
*
* Known boundaries (inherent to restricted tokens, not this port):
*  - writes are restricted; reads, network, and process visibility are NOT
*    (WRITE_RESTRICTED intersects only write accesses);
*  - console isolation is unavailable — children share the host console
*    (CREATE_NO_WINDOW / CREATE_NEW_CONSOLE children die with
*    STATUS_DLL_INIT_FAILED under the restriction);
*  - the private temp directory and every writable directory must be owned by the
*    caller (owner-implicit WRITE_DAC);
*  - grants are standing ACE mutations on real directories. WORKSPACE grants
*    are deliberately never revoked — the ACE is the cross-session reuse
*    cache (revoking would force the next session to re-propagate the whole
*    tree). TEMP grants are revocable: dispose() removes them so a standing
*    inheritable ACE never outlives its session's temp directory. The
*    ambient temp root is never granted implicitly. With `manageDacls: false`
*    the CALLER owns the DACLs (the sandbox seam's grant reuse):
*    init()/dispose() skip grant/revoke entirely and the caller must not
*    revoke under live children.
* @module @deepseek-ai/dsh-sandbox-windows-acl
*/
/** Free one optional SID while retaining a failure for best-effort sibling cleanup. */
function freeSidBestEffort(api, sidPtr, label, failures) {
	if (sidPtr === void 0) return;
	try {
		if (!isNullPtr$1(api.localFree(sidPtr))) throwLastError$1(api, "LocalFree", label);
	} catch (error) {
		failures.push(error);
	}
}
/**
* One write-restricted sandbox instance: token + write-SID grants + spawn.
* `init()` is fail-closed — any Win32 failure revokes the revocable (temp)
* grants and throws; `dispose()` revokes the temp grants, leaves the
* standing workspace ACEs in place (the cross-instance reuse cache), frees
* every allocation, and reports every cleanup failure. With
* `manageDacls: false` the caller owns the grants (the sandbox seam's grant
* reuse): init() applies none and dispose() revokes none.
*/
var AclSandbox = class {
	/** Absolute writable directories (constructor-validated). */
	writableDirs;
	/** The workspace SID string whose ACEs form the workspace allowlist. */
	writeSid;
	/** The private temp directory's write SID (workspace-write with temp only). */
	tempWriteSid;
	/** The file-effect mode — the restricted token's restricting-SID list selection. */
	mode;
	tempDirOption;
	manageDacls;
	tempDirResolved;
	api;
	token;
	writeSidPtr;
	tempWriteSidPtr;
	/** The well-known/logon SID allocations init() makes; freed by dispose() alongside the write SIDs. */
	sidAllocations = [];
	grantedPaths = [];
	constructor(options) {
		this.mode = options.mode;
		this.manageDacls = options.manageDacls ?? true;
		this.writableDirs = options.writableDirs.map((directory) => {
			const absolute = resolve(directory);
			if (!existsSync(absolute) || !statSync(absolute).isDirectory()) throw new Error(`AclSandbox writable dir does not exist or is not a directory: ${absolute}`);
			return absolute;
		});
		this.tempDirOption = options.tempDir;
		this.writeSid = options.writeSid;
		this.tempWriteSid = options.tempWriteSid;
		if (this.mode === "workspace-write" && this.writeSid === void 0) throw new Error("AclSandbox workspace-write requires a write SID — derive it from the workspace via workspaceWriteSid()");
		if (this.mode === "workspace-write" && this.tempDirOption === void 0) throw new Error("AclSandbox workspace-write requires an explicit private temp directory or null");
		if (this.mode === "read-only" && this.tempDirOption !== void 0 && this.tempDirOption !== null) throw new Error("AclSandbox read-only does not accept a temp directory");
		if (this.mode === "read-only" && (this.writeSid !== void 0 || this.tempWriteSid !== void 0)) throw new Error("AclSandbox read-only does not accept write SIDs");
		if (this.mode === "workspace-write" && this.tempDirOption !== null && this.tempWriteSid === void 0) throw new Error("AclSandbox workspace-write with temp requires a temp write SID — derive it via tempWriteSid()");
		if (this.tempDirOption === null && this.tempWriteSid !== void 0) throw new Error("AclSandbox temp write SID requires a temp directory");
		if (this.writeSid !== void 0 && this.tempWriteSid === this.writeSid) throw new Error("AclSandbox workspace and temp write SIDs must be distinct");
	}
	/** Resolved temp directory (available after init; null when temp grants are disabled). */
	get tempDir() {
		return this.tempDirResolved;
	}
	/** Create the restricted token and apply the capability-SID grants. Idempotent-unsafe: once per instance. */
	async init() {
		if (this.api !== void 0) throw new Error("AclSandbox is already initialized");
		const api = await win32();
		const currentToken = openCurrentProcessToken(api);
		let currentTokenOpen = true;
		let restrictedToken;
		try {
			const parseSid = (sid) => {
				const sidSlot = allocPtrSlot();
				if (api.convertStringSidToSidW(sid, sidSlot) === 0) throwLastError$1(api, "ConvertStringSidToSidW", sid);
				const parsedSid = decodePtr(sidSlot);
				if (parsedSid === null) throw new Win32Error("ConvertStringSidToSidW", api.getLastError(), sid);
				return parsedSid;
			};
			this.writeSidPtr = this.writeSid === void 0 ? void 0 : parseSid(this.writeSid);
			this.tempWriteSidPtr = this.tempWriteSid === void 0 ? void 0 : parseSid(this.tempWriteSid);
			const tempDir = this.mode === "read-only" || this.tempDirOption === null ? null : this.tempDirOption;
			/* v8 ignore next -- constructor validation requires workspace-write to supply
			an explicit temp directory or null; the other branches normalize to null. */
			if (tempDir === void 0) throw new Error("AclSandbox workspace-write temp directory was not resolved");
			if (tempDir !== null) {
				if (!existsSync(tempDir) || !statSync(tempDir).isDirectory()) throw new Error(`AclSandbox temp dir does not exist or is not a directory: ${tempDir}`);
				assertPrivateTempDisjoint(this.writableDirs, tempDir);
			}
			this.tempDirResolved = tempDir;
			const lowLabelSid = makeWellKnownSid(api, 66);
			const worldSid = makeWellKnownSid(api, 1);
			this.sidAllocations.push(lowLabelSid, worldSid);
			if (this.manageDacls) {
				if (this.writeSidPtr !== void 0) {
					for (const path of this.writableDirs) grantWrite(api, path, this.writeSidPtr, lowLabelSid, worldSid);
					if (tempDir !== null && this.tempWriteSidPtr !== void 0) {
						this.grantedPaths.push({
							path: tempDir,
							sidPtr: this.tempWriteSidPtr
						});
						grantWrite(api, tempDir, this.tempWriteSidPtr, lowLabelSid, worldSid);
					}
				}
			}
			const logonSid = findLogonSid(api, currentToken);
			this.sidAllocations.push(logonSid);
			restrictedToken = createRestrictedToken(api, currentToken, logonSid, [this.writeSidPtr, this.tempWriteSidPtr].filter((sid) => sid !== void 0), { world: worldSid }, this.mode);
			restrictTokenIntegrity(api, restrictedToken, lowLabelSid);
			this.token = restrictedToken;
			setTokenDefaultDaclGrant(api, restrictedToken, this.tempWriteSidPtr ?? this.writeSidPtr ?? worldSid);
			if (api.closeHandle(currentToken) === 0) throwLastError$1(api, "CloseHandle", "current process token");
			currentTokenOpen = false;
			this.api = api;
		} catch (error) {
			const cleanupFailures = [];
			if (currentTokenOpen && api.closeHandle(currentToken) === 0) cleanupFailures.push(new Win32Error("CloseHandle", api.getLastError(), "current process token after init failure"));
			if (restrictedToken !== void 0 && api.closeHandle(restrictedToken) === 0) cleanupFailures.push(new Win32Error("CloseHandle", api.getLastError(), "restricted token after init failure"));
			for (const grant of this.grantedPaths) try {
				revokeWrite(api, grant.path, grant.sidPtr);
			} catch (cleanupError) {
				cleanupFailures.push(cleanupError);
			}
			for (const [label, sidPtr] of [["workspace write SID", this.writeSidPtr], ["temp write SID", this.tempWriteSidPtr]]) freeSidBestEffort(api, sidPtr, label, cleanupFailures);
			for (const sidPtr of this.sidAllocations.splice(0)) freeSidBestEffort(api, sidPtr, "init SID allocation", cleanupFailures);
			this.token = void 0;
			this.writeSidPtr = void 0;
			this.tempWriteSidPtr = void 0;
			this.tempDirResolved = void 0;
			this.grantedPaths = [];
			if (cleanupFailures.length > 0) throw new AggregateError([error, ...cleanupFailures], `AclSandbox init failed and ${cleanupFailures.length} cleanup operation(s) also failed`);
			throw error;
		}
	}
	/**
	* Spawn a process under the restricted token. Fails closed: throws on every
	* Win32 failure; the child is never created unrestricted. With
	* `stdio: 'inherit'` the child shares the caller's stdio directly and is
	* placed in a kill-on-close job (dies with the caller). Call dispose() only
	* after all children have exited — revoking grants under a live child
	* removes its remaining write allowance.
	* @param options - the program, argv/cwd, and stdio shape.
	* @returns the running child.
	*/
	spawn(options) {
		const api = this.api;
		const token = this.token;
		if (api === void 0 || token === void 0) throw new Error("AclSandbox is not initialized: call init() first");
		if (options.controlFileDescriptor !== void 0 && options.stdio !== "inherit") throw new Error("control pipe requires inherited stdio");
		const args = options.args ?? [];
		const cwd = options.cwd ?? process.cwd();
		if (options.stdio === "inherit") {
			const native = spawnSandboxedInherited(api, token, {
				command: options.command,
				args,
				cwd,
				...options.controlFileDescriptor === void 0 ? {} : { controlFileDescriptor: options.controlFileDescriptor }
			});
			let exitCodePromise;
			return {
				pid: native.pid,
				wait: async () => {
					exitCodePromise ??= Promise.resolve(waitForExit(api, native.process));
					const exitCode = await exitCodePromise;
					if (api.closeHandle(native.job) === 0) throwLastError$1(api, "CloseHandle", "kill-on-close job");
					return {
						stdout: Buffer.alloc(0),
						stderr: Buffer.alloc(0),
						exitCode
					};
				}
			};
		}
		const native = spawnSandboxed(api, token, {
			command: options.command,
			args,
			cwd
		});
		const stdout = drainPipe(api, native.stdoutRead);
		const stderr = drainPipe(api, native.stderrRead);
		let exitCodePromise;
		return {
			pid: native.pid,
			wait: async () => {
				const stdoutBuffer = await stdout;
				const stderrBuffer = await stderr;
				exitCodePromise ??= Promise.resolve(waitForExit(api, native.process));
				return {
					stdout: stdoutBuffer,
					stderr: stderrBuffer,
					exitCode: await exitCodePromise
				};
			}
		};
	}
	/**
	* Revoke the revocable (temp) grants, free the SID, close the token; the
	* standing workspace ACEs stay (the reuse cache). Reports every cleanup
	* failure.
	*/
	dispose() {
		const api = this.api;
		if (api === void 0) return;
		const failures = [];
		if (this.manageDacls) for (const grant of this.grantedPaths) try {
			revokeWrite(api, grant.path, grant.sidPtr);
		} catch (error) {
			failures.push(error);
		}
		for (const [label, sidPtr] of [["workspace write SID", this.writeSidPtr], ["temp write SID", this.tempWriteSidPtr]]) freeSidBestEffort(api, sidPtr, label, failures);
		const token = this.token;
		/* v8 ignore next -- init assigns this.api only after this.token, so an initialized instance always
		has its token; the guard mirrors the write-SID guard. */
		if (token !== void 0) try {
			if (api.closeHandle(token) === 0) throwLastError$1(api, "CloseHandle", "restricted token");
		} catch (error) {
			failures.push(error);
		}
		for (const sidPtr of this.sidAllocations.splice(0)) freeSidBestEffort(api, sidPtr, "init SID allocation", failures);
		this.api = void 0;
		this.token = void 0;
		this.writeSidPtr = void 0;
		this.tempWriteSidPtr = void 0;
		this.grantedPaths = [];
		if (failures.length > 0) throw new AggregateError(failures, `AclSandbox dispose completed with ${failures.length} cleanup failure(s)`);
	}
};
//#endregion
export { workspaceWriteSid as a, win32 as c, tempWriteSid as i, ACL_DIAGNOSIS_SKILL as n, AclWriteGrant as o, registerAclDiagnosisSkill as r, assertTempRootOutsideWorkspace as s, AclSandbox as t };
