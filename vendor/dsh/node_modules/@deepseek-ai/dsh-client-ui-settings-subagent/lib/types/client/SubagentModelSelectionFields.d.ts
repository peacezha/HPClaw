/** User control for model-selectable subagent delegation in new sessions. */
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { SubagentModelSelectionCardFace, SubagentModelSelectionCardState } from './subagent-model-selection-card-controller.ts';
/** Plain model state and callbacks supplied by the owning Subagent card. */
export type SubagentModelSelectionFieldsProps = PropsLocale<'settings.subagent'> & Pick<SubagentModelSelectionCardFace, 'toggleEnabled' | 'toggleModel' | 'retryCatalog'> & {
    state: SubagentModelSelectionCardState;
};
/**
 * Render the default-off preference and its exact adapter-route choices.
 * @param props - locale copy, the card snapshot, and its toggle action.
 * @returns the model permission and route choices inside the shared card.
 */
export declare function SubagentModelSelectionFields(props: SubagentModelSelectionFieldsProps): import("react").JSX.Element;
//# sourceMappingURL=SubagentModelSelectionFields.d.ts.map