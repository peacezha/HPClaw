/**
 * Model-facing `schedule_create`, `schedule_list`, `schedule_update`, and
 * `schedule_delete` tools over the Host `ctx.schedule` service. Mounting the
 * plugin registers them in the mounting scope, so a preset decides which
 * agents receive them; every call acts on the calling Agent's Session.
 * @module @deepseek-ai/dsh-tool-schedule
 */
import type { Context } from '@deepseek-ai/cordis';
/** Plugin name registered with the Loader. */
export declare const name = "tool-schedule";
/** Host services this plugin consumes. The Schedule service is resolved per
 * scope, so a preset that declares this plugin stays inert while the shipped
 * composition keeps that service off. */
export declare const inject: string[];
/**
 * Register the four Schedule tools in the mounting scope.
 *
 * Each call mutates the Session of the Agent that dispatched it, so a mount
 * outside an agent scope still registers the tools but every call without a
 * caller Agent is refused as an internal failure.
 * @param ctx - Context owning the `tools` registry and the Host `schedule` service.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map