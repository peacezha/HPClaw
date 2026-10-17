/** Remap released V3 local event references after interrupted-turn insertion. */
import type { SessionFormatEvent } from '@deepseek-ai/dsh-session-format';
/**
 * Remap first-party local references, retaining generation-qualified captures and numeric payloads.
 * @param event - first-party source event before envelope renumbering.
 * @param seq - target event position.
 * @param mapping - target positions of all earlier source events.
 * @returns the event with target coordinates; unchanged events retain their identity.
 */
export declare function remapV3References(event: SessionFormatEvent, seq: number, mapping: readonly number[]): SessionFormatEvent;
//# sourceMappingURL=references.d.ts.map