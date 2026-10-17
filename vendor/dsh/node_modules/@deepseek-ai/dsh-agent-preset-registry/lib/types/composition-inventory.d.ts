/** Plugin inventory from declared configuration or an activated revision. */
import { FiberState } from '@deepseek-ai/cordis';
import { type EntryTree } from '@deepseek-ai/cordis-plugin-loader';
/**
 * Effective enablement of one composition row: a literal or evaluated
 * boolean, or `'conditional'` when a `!!js` disabled expression could not be
 * evaluated outside a mount.
 */
export type CompositionRowEnablement = boolean | 'conditional';
/**
 * Evaluate one `!!js` disabled expression the way the Loader would at a mount
 * decision. Throwing refuses the answer: the row is reported `'conditional'`
 * rather than guessed.
 */
export type DisabledExpressionEvaluator = (expression: string) => unknown;
/** One plugin row a preset composition names. */
export interface AgentPresetCompositionRow {
    /**
     * Entry id relative to the preset's Loader tree, or the declared id before
     * activation; null when an unmounted row declares none.
     */
    readonly entryId: string | null;
    /** Module specifier the row names. */
    readonly moduleName: string;
    /** Effective enablement, including disabled ancestor groups. */
    readonly enabled: CompositionRowEnablement;
    /** The row's own `!!js` disabled expression, when it carries one. */
    readonly condition?: string;
    /** Root-fiber state, present only when read from a live mount. */
    readonly fiberState?: FiberState;
}
/** One preset's roster identity beside its composition rows. */
export interface AgentPresetComposition {
    /** Stable preset id. */
    readonly id: string;
    /** Display name the preset published. */
    readonly name?: string;
    /** Whether a session naming no preset composes this one. */
    readonly isDefault: boolean;
    /** Why this preset's rows cannot be read; absent when {@link rows} answers. */
    readonly broken?: string;
    /** Composition rows in composition order; empty when the preset is broken. */
    readonly rows: readonly AgentPresetCompositionRow[];
}
/** Active module references and isolation diagnostics for one retained preset revision. */
export interface AgentPresetInspection {
    /** Preset identity; different retained revisions can share it. */
    readonly id: string;
    /** Active modules, with the bases needed to resolve their package identities. */
    readonly modules: readonly {
        /** Configured module specifier. */
        readonly moduleName: string;
        /** Declaring configuration's URL, when available. */
        readonly baseUrl?: string;
        /** Whether bare specifiers use the application's module base. */
        readonly useHostBase: boolean;
    }[];
    /** Services this revision published outside its isolated realm. */
    readonly leakedServices: readonly string[];
}
/** Read active module references without exposing Loader entries.
 * @param tree - the retained revision's tree.
 * @returns detached module references in Loader order.
 */
export declare function activeCompositionModules(tree: EntryTree): AgentPresetInspection['modules'];
/** Flatten declared child plugins for diagnostics before a successful activation.
 * @param rows Parsed child entries.
 * @param evaluateExpression Loader-context evaluator for disabled expressions.
 * @returns Flattened entries or a configuration diagnostic.
 */
export declare function definitionComposition(rows: unknown, evaluateExpression: DisabledExpressionEvaluator): {
    rows: AgentPresetCompositionRow[];
} | {
    broken: string;
};
/**
 * Plugin rows of one live standing composition, in Loader-entry order.
 * @param tree - the standing mount's entry tree.
 * @returns rows with the Loader's evaluated enablement and root-fiber states.
 */
export declare function mountedCompositionRows(tree: EntryTree): AgentPresetCompositionRow[];
//# sourceMappingURL=composition-inventory.d.ts.map