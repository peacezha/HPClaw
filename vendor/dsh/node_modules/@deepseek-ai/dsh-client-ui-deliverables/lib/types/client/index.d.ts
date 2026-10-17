/**
 * Deliverables plugin, browser half: registers the changed-files card and
 * delivery cards into the chat view's turn-tail list, the `changes-review`
 * right-Sidebar tab type that reviews one turn's changed files one comparison
 * at a time, and provides the `chatFileMentions` service that links
 * inline-code mentions of produced or delivered files in the closing prose.
 * All policy lives here — the supported mutation calls, mention matching, row
 * cap, and copy — so composing this plugin out of cordis.yml removes every
 * surface; the owning view renders an empty list and inert prose at zero cost.
 */
import './file-actions.ts';
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type DeliverablesKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Changed-files card, review tab, delivery card, and file-mention copy. */
        'deliverables': DeliverablesKey;
    }
}
/** Required services for the tail-slot and tab-type registrations and their dictionaries. */
export declare const inject: string[];
/**
 * Client plugin body: register the dictionaries, the turn-tail entry, and the comparison tab type.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map