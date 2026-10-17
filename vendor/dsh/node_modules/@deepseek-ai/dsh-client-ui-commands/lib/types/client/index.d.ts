/**
 * Command UI plugin, browser half: CommandUiRuntime (`ctx.commandUi`) owning the
 * capability-keyed directory cache, the '/' command source, the client
 * contribution registry, and the per-session popupSelect controllers; the
 * popupSelect shell self-registers into conversation.input.overlay with
 * per-session resolution.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { CommandUiRuntime } from './service.ts';
import { type CommandKey } from './locales.ts';
export { CommandUiRuntime } from './service.ts';
export { CommandDirectory } from './directory.ts';
export type { CommandDescriptor, DirectoryStatus } from './directory.ts';
export { filterOptions, PopupSelectController } from './popup.ts';
export type { PopupSelectDeps, PopupSpec, PopupState, TokenSegment } from './popup.ts';
export type { PopupSelectInjected, PopupSelectViewProps } from './PopupSelectView.tsx';
export type { ActionSpec, CommandContribution, CommandDecoration, CommandUiContract, CommandUiSpec, PopupSearchLabels, PopupSelectSpec, SelectConfirmation, SelectOption, SelectOptionGroup, PopupSearchMode, } from './contract.ts';
export type { CommandKey } from './locales.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        commandUi: CommandUiRuntime;
    }
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The menu rows' and the popupSelect shell's copy. */
        command: CommandKey;
    }
}
/** Required services: the '/' source registry, session scopes, commands Remote, and locale registry. */
export declare const inject: string[];
/**
 * Mount the command service and its per-session popupSelect overlay.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map