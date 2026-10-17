/** Host-plane registration of the first-party Cordis inspect providers. */
import type { Context } from '@deepseek-ai/cordis';
export declare const name = "cordis-inspect-providers";
/** Required services: the Host inspect registry and the Tool registry the `Tool` provider reads. */
export declare const inject: string[];
/**
 * Register the Host inspect providers once per process. The registry keys
 * providers by id and rejects a duplicate, so this row belongs to the host
 * composition beside `cordis-host-runner`; every per-session `tool-cordis`
 * row reads the shared set through its tools.
 * @param ctx Host composition context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=host.d.ts.map