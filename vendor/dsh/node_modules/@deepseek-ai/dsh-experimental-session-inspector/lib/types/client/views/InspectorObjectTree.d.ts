/** Shared value rendering for JSON details and lazy runtime objects with identity links. */
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { InspectorObjects, InspectorObjectReference } from './objects.ts';
/** Original value and Session-local reference navigation. */
export type InspectorObjectTreeProps = PropsLocale<'session-inspector'> & {
    readonly value: unknown;
    readonly objects: InspectorObjects;
    readonly navigate: (reference: InspectorObjectReference) => void;
};
/**
 * Display serialized Inspector JSON with every container initially expanded and no reference navigation.
 * @param props - Successful inspectorJson output and localized tree labels; empty text represents undefined.
 * @returns The same value tree as Chat details, without collection paging or runtime-object links.
 */
export declare function InspectorJsonTree({ text, t }: PropsLocale<'session-inspector'> & {
    readonly text: string;
}): import("react").JSX.Element;
/**
 * Inspect the root and nested Node Data inline; other registered objects remain navigation links.
 * Node Data titles also navigate, while repeated ancestors never expand recursively.
 * Expanded fields are cached until their value or Conversation publication changes.
 * @param props - Original object, weak identity lookup, locale, and reference activation.
 * @returns A lazily expanded, typed tree that retains Map keys and collection identities.
 */
export declare function InspectorObjectTree(props: InspectorObjectTreeProps): import("react").JSX.Element;
//# sourceMappingURL=InspectorObjectTree.d.ts.map