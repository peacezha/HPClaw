/**
 * Background-job plugin, browser half: contributes one session-header action
 * that renders this session's jobs. Job rows, per-row observation streams,
 * and the human kill all go through the `jobs` client service; this plugin
 * holds no transport state of its own.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type JobKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Background-job list copy. */
        'job': JobKey;
    }
}
export type { JobListActionProps, JobListInjected } from './JobListAction.tsx';
/** Required services: the jobs rosters, observations, and kill, the slot registry, and dictionaries. */
export declare const inject: string[];
/**
 * Client plugin body: register the dictionaries and the header action.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map