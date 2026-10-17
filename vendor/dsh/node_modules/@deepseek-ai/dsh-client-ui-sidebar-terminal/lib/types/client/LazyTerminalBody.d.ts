/** Load xterm only after a terminal body is mounted. */
import { type ReactNode } from 'react';
import type { TerminalBodyProps } from './terminal.tsx';
/**
 * Suspend while the package-local terminal chunk arrives.
 * @param props - Terminal body props supplied by the sidebar slot.
 * @returns the deferred terminal renderer.
 */
export declare function LazyTerminalBody(props: TerminalBodyProps): ReactNode;
//# sourceMappingURL=LazyTerminalBody.d.ts.map