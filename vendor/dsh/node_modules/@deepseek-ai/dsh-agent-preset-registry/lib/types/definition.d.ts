/** Declarative preset configuration and YAML validation. */
import type { EntryOptions, JsExpr } from '@deepseek-ai/cordis-plugin-loader';
/** Identity, display fields and child Cordis plugins of one preset. */
export interface PresetDefinition {
    readonly id: string;
    readonly name?: string;
    readonly description?: string;
    readonly order?: number;
    readonly plugins: readonly (Omit<EntryOptions, 'id' | 'disabled'> & {
        id?: string;
        disabled?: EntryOptions['disabled'] | JsExpr;
    })[];
}
/** Validate a parsed Cordis entry list, including nested groups.
 * @param rows Parsed YAML value.
 * @param at Diagnostic prefix.
 * @returns The first invalid row, or undefined.
 */
export declare function entryListProblem(rows: unknown, at?: string): string | undefined;
//# sourceMappingURL=definition.d.ts.map