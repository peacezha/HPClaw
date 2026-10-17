/** Append historical child facts after converting V3 source events to V4. */
import type { SessionFormatJsonValue, SessionFormatMigration } from '@deepseek-ai/dsh-session-format';
/** Header-only migration declaration; body restoration requires explicit child evidence. */
export declare const sessionFormatV3ToV4: SessionFormatMigration;
/**
 * Bind one parent's historical child evidence to its V3→V4 migration.
 * @param children - complete child evidence retained unchanged for the lifetime of this declaration; an empty array declares no children.
 * @returns an adjacent migration that creates independent stages with the supplied evidence.
 */
export declare function createSessionFormatV3ToV4(children: readonly SessionFormatJsonValue[]): SessionFormatMigration;
//# sourceMappingURL=migration.d.ts.map