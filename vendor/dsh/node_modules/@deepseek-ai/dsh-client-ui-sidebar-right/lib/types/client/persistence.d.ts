import type { SurfaceState } from './stores.ts';
/** Persistence namespace shared by scoped stores and startup discovery. */
export declare const sidebarPersistence = "dsh.sidebar-right.v1";
/**
 * Restore one validated Session layout with a fresh in-window undo history.
 * @param sessionId - storage scope.
 * @returns the saved surface, or undefined when absent, inaccessible or invalid.
 */
export declare function readSidebarLayout(sessionId: string): SurfaceState | undefined;
/**
 * Persist current layout and identity allocation without retaining undo entries.
 * @param sessionId - storage scope.
 * @param surface - current in-memory surface.
 */
export declare function writeSidebarLayout(sessionId: string, surface: SurfaceState): void;
/**
 * Remove only one Session's persisted layout.
 * @param sessionId - storage scope to discard.
 */
export declare function clearSidebarLayout(sessionId: string): void;
//# sourceMappingURL=persistence.d.ts.map