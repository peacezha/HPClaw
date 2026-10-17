/** Command identity and localized input spelling over the effective Host catalog. */
import type { CommandDescriptor } from '@deepseek-ai/dsh-commands/types';
import type { TranslateNS } from '@deepseek-ai/dsh-client-locale/client';
declare const BUILTINS: {
    readonly goal: "@deepseek-ai/dsh-command-goal";
    readonly plan: "@deepseek-ai/dsh-plan-mode";
    readonly feedback: "@deepseek-ai/dsh-command-feedback";
    readonly compact: "@deepseek-ai/dsh-command-compact";
    readonly permission: "@deepseek-ai/dsh-permission-presets";
    readonly export: "@deepseek-ai/dsh-session-log-export";
};
/** Names whose first-party definitions have localized client presentation. */
export type BuiltinCommandName = keyof typeof BUILTINS;
/**
 * Identify a first-party definition without interpreting its display copy.
 * @param descriptor - effective Host descriptor after scoped shadowing.
 * @returns its first-party name, or undefined for another definition.
 */
export declare function builtinCommandName(descriptor: CommandDescriptor): BuiltinCommandName | undefined;
/**
 * Select the input spelling for a menu-picked command.
 * @param descriptor - effective Host descriptor.
 * @param t - command-namespace translator.
 * @returns localized spelling for a known definition, otherwise its registered name.
 */
export declare function claimToken(descriptor: CommandDescriptor, t: TranslateNS<'command'>): string;
/**
 * Resolve typed spelling against the current Session's effective definitions.
 * @param token - typed name without its leading slash.
 * @param descriptors - effective descriptors in the Session's ready catalog.
 * @returns the matching descriptor; aliases never select an unrelated scoped override.
 */
export declare function resolveCommand(token: string, descriptors: readonly CommandDescriptor[]): CommandDescriptor | undefined;
export {};
//# sourceMappingURL=resolution.d.ts.map