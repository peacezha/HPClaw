/** Bind parent-specific child evidence into the static first-party migration inventory. */
import type { SessionFormatCatalog, SessionFormatJsonValue } from '@deepseek-ai/dsh-session-format';
/**
 * Assemble a catalog whose V3→V4 edge knows one parent's historical children.
 * @param children - complete child evidence retained unchanged for the catalog's lifetime; an empty array declares no children.
 * @returns a catalog with independent restore state per artifact and unchanged current-format readers.
 */
export declare function createSessionFormatCatalogWithChildren(children: readonly SessionFormatJsonValue[]): SessionFormatCatalog;
//# sourceMappingURL=children.d.ts.map