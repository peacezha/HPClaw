/** Resolve CWD-keyed Electron storage after the authoritative Workspace list has arrived. */
import type { WorkspaceSource } from '@deepseek-ai/dsh-api-workspace-controller/client';
/**
 * Use the Workspace's canonical CWD, not its record id; ungrouped Sessions remain isolated.
 * @param source - authoritative Workspace membership.
 * @param sessionId - owning DSH Session.
 * @param signal - guest initialization lifetime.
 * @returns the storage account for this occurrence.
 */
export declare function browserWorkspace(source: WorkspaceSource, sessionId: string, signal: AbortSignal): Promise<string>;
//# sourceMappingURL=workspace.d.ts.map