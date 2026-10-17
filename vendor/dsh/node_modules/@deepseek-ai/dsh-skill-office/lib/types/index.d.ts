/** Bundled Office workflows and filesystem resources for document authoring and operations. */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
/** Office skill resource location. */
export interface Config {
    /** Absolute assets directory containing skill folders; defaults to packaged assets. */
    assetRoot?: string;
    /** Standalone Node executable; defaults to the current executable outside Electron and SEA. */
    node?: string;
    /** Absolute LibreOffice Kit CLI entry; false explicitly disables CLI access. */
    cli?: string | false;
}
/** Validated resource configuration. */
export declare const Config: z<Config>;
/** Cordis plugin identity. */
export declare const name = "skill-office";
/** Registry used by the bundled provider. */
export declare const inject: string[];
/**
 * Register Office skills with resources readable by the script interpreter.
 * @param ctx - Context carrying the skill registry.
 * @param config - Optional external assets directory for packaged applications.
 */
export declare function apply(ctx: Context, config?: Config): void;
//# sourceMappingURL=index.d.ts.map