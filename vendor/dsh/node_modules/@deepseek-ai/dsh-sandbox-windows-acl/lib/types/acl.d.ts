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
import type { NativePtr, Win32Bindings } from './ffi.ts';
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
export declare function buildExplicitAccess(sidPtr: NativePtr, mode: number, permissions: number, inheritance?: number): Buffer;
/**
 * One lock file per protected path: `<GetTempPathW()>\dsh-acl-locks\<first 16
 * hex of sha256(lowercased path)>.lock`. The lock root derives from
 * GetTempPathW (never from runner argv or DSH_HOME), and the lowercasing
 * maps Windows's case-insensitive path spellings onto one lock.
 * @param api - the binding table.
 * @param path - the protected directory (absolute).
 * @returns the lock file path for that directory.
 */
export declare function lockFilePath(api: Win32Bindings, path: string): string;
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
export declare function withPathLock<T>(api: Win32Bindings, path: string, action: () => T): T;
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
export declare function buildLowLabelAcl(api: Win32Bindings, lowLabelSidPtr: NativePtr): NativePtr;
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
export declare function grantWrite(api: Win32Bindings, path: string, sidPtr: NativePtr, lowLabelSidPtr: NativePtr, worldSidPtr: NativePtr): void;
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
export declare function revokeWrite(api: Win32Bindings, path: string, sidPtr: NativePtr): boolean;
//# sourceMappingURL=acl.d.ts.map