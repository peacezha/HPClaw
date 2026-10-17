/** Executes one workflow VM inside the mounted PTC runtime's Node process. */
import type { WorkflowResult } from '@deepseek-ai/dsh-workflow';
import type { WorkflowGuestHost } from './guest-types.ts';
/**
 * Run a workflow with one progress batch in flight. Drain progress before child
 * disposal and the terminal result; PTC and the host own cancellation and cleanup.
 * @param host - JSON callbacks owned by this workflow run.
 * @returns The script result after progress delivery; initialization failures reject.
 */
export declare function runWorkflowGuest(host: WorkflowGuestHost): Promise<WorkflowResult>;
//# sourceMappingURL=guest.d.ts.map