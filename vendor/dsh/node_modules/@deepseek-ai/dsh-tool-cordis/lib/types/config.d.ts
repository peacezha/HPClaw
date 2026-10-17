/** Live plugin Config discovery projected from the running Loader tree. */
import type { Context } from '@deepseek-ai/cordis';
import type { JsonValue } from '@deepseek-ai/dsh-util-values';
/**
 * Answer the `Config.listConfigs` inspect query from the live Loader tree.
 * Without `entry`, return one page of the directory: each entry's Loader id, patch id, plugin name, and Config
 * status, optionally filtered to one exact plugin `name`, with `total` and `nextOffset` (null on the last page).
 * With `entry`, return that entry with its resolved `packageDir` (the directory holding the package README and
 * built `lib/`, when the profile package lookup resolves it) and project its native Config into one self-contained
 * JSON Schema 2020-12 document whose `$defs` carry the shared and `loaderExpression` definitions, plus omission
 * acceptance and projection limitations.
 * Validators and transform callbacks are not executed; runtime-created Agent preset trees are outside the Loader.
 * @param ctx - Host context; its `loader`, when the profile was mounted by one, owns the entry tree.
 * @param input - model-supplied query: `entry` (Loader entry id), or `name`, `offset` (default 0), and `limit` (1 to 100, default 25).
 * @returns one directory page, or one entry's status and projected schema.
 * @throws when no Loader mounted this Host, when a query field is malformed, or when the entry id matches no live entry.
 */
export declare function queryLiveConfig(ctx: Context, input: JsonValue | undefined): Promise<JsonValue>;
//# sourceMappingURL=config.d.ts.map