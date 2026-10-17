import type { SessionWorkspacePathApplication } from '@deepseek-ai/dsh-api-session-controller/types';
type Query = (target: string, signal: AbortSignal) => Promise<readonly SessionWorkspacePathApplication[] | null>;
interface Result {
    apps: readonly SessionWorkspacePathApplication[];
    loading: boolean;
    failed: boolean;
}
/**
 * Share associations and refreshes across mounted controls for the same file and reader.
 * @param target - path or authenticated route identifying the current file.
 * @param query - stable reader scoped to the serving Host; failures resolve to null.
 * @param enabled - whether a native desktop is available.
 * @returns metadata, initial loading state, failure state, and a shared refresh callback.
 */
export declare function useFileApplications(target: string, query: Query, enabled: boolean): Result & {
    refresh: () => void;
};
export {};
//# sourceMappingURL=file-applications.d.ts.map