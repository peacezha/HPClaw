import type { Context as ClientContext } from '@deepseek-ai/cordis';
export type {} from './user-text-rules.ts';
import { type SkillKey } from './locales.ts';
declare module '@deepseek-ai/dsh-api-session-controller/client' {
    interface SessionReferenceSourceMap {
        /** A skill-catalog fetch waiting for initial history and its RPC result. */
        skillCatalog: unknown;
    }
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The dedicated skill tool row's copy. */
        skill: SkillKey;
    }
}
/** Required services: reference source faces plus the tool-row and locale registries. */
export declare const inject: string[];
/**
 * Client plugin body: register the '/' source, dictionaries, and keyed tool row.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map