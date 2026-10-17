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
import type { Win32Bindings } from './ffi.ts';
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
export declare class AclWriteGrant {
    /** The write SID in SDDL string form. */
    readonly writeSid: string;
    private readonly api;
    private readonly sidPtr;
    private readonly lowLabelSidPtr;
    private readonly worldSidPtr;
    private readonly revocablePaths;
    private readonly standingPaths;
    private constructor();
    /**
     * Parse the SID string, create the Low integrity SID the grants label with
     * and the world SID their ambient-delete deny names, and open the binding
     * table (lazily, once per server). Fail-closed: any failure throws — nothing
     * is granted yet.
     * @param writeSid - the workspace (`S-1-4-x-y`) or temp (`S-1-4-x-y-1`) capability SID string.
     * @param api - optional already-resolved bindings (tests).
     * @returns the ready grant (no ACEs yet).
     */
    static create(writeSid: string, api?: Win32Bindings): AclWriteGrant;
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
    add(path: string, standing?: boolean): void;
    /** Every directory currently carrying the grant, in grant order. */
    get paths(): readonly string[];
    /** Revoke every revocable grant (standing security descriptor edits stay) and free the SIDs; reports every cleanup failure. */
    dispose(): void;
}
//# sourceMappingURL=grant.d.ts.map