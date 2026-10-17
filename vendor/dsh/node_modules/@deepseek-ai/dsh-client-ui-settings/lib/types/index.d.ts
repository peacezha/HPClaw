import type { Volatile, Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
/** Runtime preferences projected to the browser. */
export interface Config {
    /** Whether developer tools are enabled. */
    enabled: Volatile<boolean>;
}
/** Live preferences projected to the browser. */
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    enabled: z<boolean, boolean, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    enabled: z<boolean, boolean, "volatile-defined">;
}>>, "plain">;
/** Host preferences are consumed through the configuration form projection.
 * @param ctx Plugin context used for optional settings presentation.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map