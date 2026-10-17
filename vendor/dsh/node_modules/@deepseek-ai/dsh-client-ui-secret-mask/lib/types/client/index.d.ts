/**
 * Credential display masking for sent Web user text: one UserText matcher and
 * its keyed `secret` node renderer. Masking changes only the drawn text; the
 * message text, copy actions, and model input keep the original characters.
 *
 * @module @deepseek-ai/dsh-client-ui-secret-mask/client
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
export type {} from './secret-rule.ts';
/** Required services: the copy, the node renderer registry, and the UserText rule registry. */
export declare const inject: string[];
/**
 * Register the dictionaries, the credential matcher, and its node renderer.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map