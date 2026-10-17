/** Pure task-view derivation shared by the task board and the client projection. */
import type { TeamState } from './projection.ts';
import type { TeamTaskSnapshot, TeamTaskView } from './types.ts';
/**
 * Whether every current blocker of one task completed.
 * @param state - Team state supplying sibling tasks.
 * @param task - durable task snapshot to test.
 * @returns whether the task has no incomplete blockers.
 */
export declare function taskReady(state: TeamState, task: TeamTaskSnapshot): boolean;
/**
 * Derive one task view with owner name, readiness, and advisory write overlaps.
 * A committing caller may pass its pre-append state because `task` supplies the
 * new value explicitly; owner names, blocker readiness, and other task scopes
 * do not change when that snapshot is appended.
 * @param state - Team state supplying members and sibling tasks.
 * @param task - durable task snapshot to view.
 * @returns a detached task view.
 */
export declare function projectTaskView(state: TeamState, task: TeamTaskSnapshot): TeamTaskView;
//# sourceMappingURL=task-view.d.ts.map