import { isJsExpr } from '@deepseek-ai/cordis-plugin-loader';
import { entryListProblem } from "./definition.js";
/** Read active module references without exposing Loader entries.
 * @param tree - the retained revision's tree.
 * @returns detached module references in Loader order.
 */
export function activeCompositionModules(tree) {
    const modules = [];
    for (const entry of tree.entries()) {
        if (entry.options.group || entry.disabled || entry.fiber?.state !== 2 /* FiberState.ACTIVE */)
            continue;
        const ownerTree = entry.parent.tree;
        const baseUrl = ownerTree.ctx.baseUrl;
        modules.push({
            moduleName: entry.options.name,
            ...baseUrl === undefined ? {} : { baseUrl },
            useHostBase: ownerTree === tree,
        });
    }
    return modules;
}
/**
 * One `disabled` node's contribution to effective enablement, mirroring the
 * Loader's own reading: a `!!js` expression is asked of the evaluator — a
 * refusal (throw) leaves the decision to a mount — and anything else disables
 * exactly when `Boolean(value)` does.
 * @param value - the raw `disabled` node of one composition row.
 * @param evaluateExpression - the Loader-context evaluator for `!!js` nodes.
 * @returns true (disabled), false (enabled), or `'conditional'`.
 */
function disabledContribution(value, evaluateExpression) {
    if (isJsExpr(value)) {
        try {
            return Boolean(evaluateExpression(value.__jsExpr));
        }
        catch {
            // The evaluator refused (a malformed or context-dependent expression);
            // only a real mount decision can answer, so the row stays conditional.
            return 'conditional';
        }
    }
    return Boolean(value);
}
/**
 * Combine an ancestor group's disabled state with a row's own, the way the
 * Loader walks owning groups: any literal true disables, otherwise any
 * expression leaves the decision to a mount.
 * @param outer - the combined ancestor contribution.
 * @param own - this row's contribution.
 * @returns the row's effective disabled state.
 */
function combineDisabled(outer, own) {
    if (outer === true || own === true)
        return true;
    if (outer === 'conditional' || own === 'conditional')
        return 'conditional';
    return false;
}
/**
 * Flatten one parsed row list into plugin rows. Group rows are structural —
 * the Loader reports a group entry as always enabled and lets children
 * inherit its `disabled` — so only their children are emitted.
 * @param rows - the parsed rows, shape-checked by the caller.
 * @param outerDisabled - the combined ancestor-group disabled state.
 * @param evaluateExpression - the Loader-context evaluator for `!!js` nodes.
 * @param found - the accumulator receiving flattened rows.
 */
function flattenRows(rows, outerDisabled, evaluateExpression, found) {
    for (const value of rows) {
        const row = value;
        const disabled = combineDisabled(outerDisabled, disabledContribution(row.disabled, evaluateExpression));
        if (row.group === true) {
            flattenRows(row.config, disabled, evaluateExpression, found);
            continue;
        }
        found.push({
            entryId: typeof row.id === 'string' && row.id !== '' ? row.id : null,
            moduleName: row.name,
            enabled: disabled === true ? false : disabled === 'conditional' ? 'conditional' : true,
            ...isJsExpr(row.disabled) ? { condition: row.disabled.__jsExpr } : {},
        });
    }
}
/** Flatten declared child plugins for diagnostics before a successful activation.
 * @param rows Parsed child entries.
 * @param evaluateExpression Loader-context evaluator for disabled expressions.
 * @returns Flattened entries or a configuration diagnostic.
 */
export function definitionComposition(rows, evaluateExpression) {
    const problem = entryListProblem(rows);
    if (problem !== undefined)
        return { broken: problem };
    const found = [];
    flattenRows(rows, false, evaluateExpression, found);
    return { rows: found };
}
/**
 * Plugin rows of one live standing composition, in Loader-entry order.
 * @param tree - the standing mount's entry tree.
 * @returns rows with the Loader's evaluated enablement and root-fiber states.
 */
export function mountedCompositionRows(tree) {
    const found = [];
    const owner = tree.ctx.fiber.entry;
    const prefix = owner === undefined ? '' : `${owner.id}:`;
    for (const entry of tree.entries()) {
        if (entry.options.group)
            continue;
        found.push({
            entryId: entry.id.slice(prefix.length),
            moduleName: entry.options.name,
            enabled: !entry.disabled,
            ...isJsExpr(entry.options.disabled) ? { condition: entry.options.disabled.__jsExpr } : {},
            ...entry.fiber === undefined ? {} : { fiberState: entry.fiber.state },
        });
    }
    return found;
}
//# sourceMappingURL=composition-inventory.js.map