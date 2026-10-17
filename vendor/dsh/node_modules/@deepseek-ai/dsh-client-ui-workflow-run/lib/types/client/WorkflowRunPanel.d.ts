import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { SessionTarget } from '@deepseek-ai/dsh-api-session-controller/client';
/** Navigation action injected from the plugin's own Session Controller access. */
export interface WorkflowRunInjected {
    readonly openSession: (target: SessionTarget) => void;
}
/** Complete keyed Chat renderer props. */
export type WorkflowRunPanelProps = PropsRuntime<'conversation.chat.node', 'workflow-run'> & PropsLocale<'workflowRun'> & WorkflowRunInjected;
/** Render one durable workflow run with status-driven run and phase disclosure. */
export declare function WorkflowRunPanel({ node, sessionId, useSessions, useSessionStatus, openSession, t }: WorkflowRunPanelProps): import("react").JSX.Element;
//# sourceMappingURL=WorkflowRunPanel.d.ts.map