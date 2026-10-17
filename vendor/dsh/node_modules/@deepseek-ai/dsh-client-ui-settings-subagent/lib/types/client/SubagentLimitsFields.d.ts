/** Delegation-limit fields inside the shared Subagent settings card. */
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { SubagentLimitsCardFace, SubagentLimitsCardState } from './subagent-limits-card-controller.ts';
/** Plain state and edit callbacks supplied by the owning card. */
export type SubagentLimitsFieldsProps = PropsLocale<'settings.subagent'> & Pick<SubagentLimitsCardFace, 'edit' | 'resetField'> & {
    state: SubagentLimitsCardState;
};
/**
 * Render the depth and capacity fields with their original validation and reset behavior.
 * @param props - Locale, staged fields, and edit callbacks.
 * @returns Two responsive fields and their application rules.
 */
export declare function SubagentLimitsFields(props: SubagentLimitsFieldsProps): import("react").JSX.Element;
//# sourceMappingURL=SubagentLimitsFields.d.ts.map