/** Stable grouping shared by popup filtering and rendering. */
import type { SelectOption, SelectOptionGroup } from './contract.ts';
interface OptionGroup {
    readonly group: SelectOptionGroup | undefined;
    readonly rows: readonly SelectOption[];
}
/**
 * Group rows by their caller-owned group name, without sorting groups or rows.
 * Ungrouped rows occupy one block at their first occurrence.
 * @param options - Options in display order.
 * @returns groups in first-occurrence order, with original option objects.
 */
export declare function groupOptions(options: readonly SelectOption[]): OptionGroup[];
export {};
//# sourceMappingURL=option-groups.d.ts.map