import type { InputTriggerCandidate } from '@deepseek-ai/dsh-client-ui-input-trigger/client';
import type { TranslateNS } from '@deepseek-ai/dsh-client-locale/client';
import type { CommandDescriptor } from '@deepseek-ai/dsh-commands/types';
/** The menu's two sections. */
export type MenuSection = 'add' | 'commands';
/**
 * The localized menu face of a catalog row.
 * @param descriptor - effective Host command descriptor.
 * @param t - the `command` namespace translator.
 * @returns title, description, and glyph for a built-in command; undefined
 * for any other row, which keeps its catalog description.
 */
export declare function builtinRowFace(descriptor: CommandDescriptor, t: TranslateNS<'command'>): Pick<InputTriggerCandidate, 'label' | 'description' | 'icon'> | undefined;
/**
 * Arrange the empty-query menu: the Add section, then the Commands section,
 * each in usage order, with unlisted rows closing Commands in their input
 * order; each row carries its section heading.
 * @param rows - the visible candidates in catalog-then-contribution order.
 * @param t - the `command` namespace translator.
 * @returns the sectioned rows.
 */
export declare function sectionRows(rows: readonly InputTriggerCandidate[], t: TranslateNS<'command'>): readonly InputTriggerCandidate[];
//# sourceMappingURL=presentation.d.ts.map