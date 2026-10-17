/** Anchored type-filter editor with asynchronous suggestions and explicit confirmation. */
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
/** Current confirmed query and an asynchronous candidate source. */
export type InspectorTypeFilterProps = PropsLocale<'session-inspector'> & {
    readonly value: string;
    readonly suggest: (query: string) => Promise<readonly string[]>;
    readonly apply: (query: string) => void;
};
/**
 * Edit a type fragment without filtering until Enter, Apply, or a candidate is selected.
 * @param props - Confirmed query, candidate resolver, commit callback, and localized copy.
 * @returns A header button and its portaled editor; stale responses cannot replace newer suggestions.
 */
export declare function TypeFilter({ value, suggest, apply, t }: InspectorTypeFilterProps): import("react").JSX.Element;
//# sourceMappingURL=TypeFilter.d.ts.map