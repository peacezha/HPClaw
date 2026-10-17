/** Display-only command references; command execution stays with the original command input. */
import type { UserTextNodeProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
/**
 * Render one confirmed command token without adding an activation action.
 * @param props - resolved command node and its original spelling.
 * @returns a noninteractive inline command chip.
 */
export declare function GoalCommandReference({ node, raw }: UserTextNodeProps<'command'>): import("react").JSX.Element;
//# sourceMappingURL=GoalCommandReference.d.ts.map