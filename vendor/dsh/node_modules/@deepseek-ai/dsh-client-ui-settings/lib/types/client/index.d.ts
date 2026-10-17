/** Shared configuration forms and their Host describe mirror. */
import type { Context } from '@deepseek-ai/cordis';
export type { SettingsLauncherOwnerProps, SettingsGeneralItemOwnerProps, SettingsHeaderOwnerProps, SettingsOnboardingOwnerProps, SettingsPluginsTabOwnerProps, SettingsSectionOwnerProps, SettingsTriggerOwnerProps, } from './contract/slots.ts';
export type { ConfigForms } from './config-form.ts';
export type { ConfigForm, ConfigFormSnapshot } from './config-form-types.ts';
export type { SettingsSchemaService } from './schema.ts';
export type { SchemaNode } from './schema.ts';
export type { SettingsDescribeFace, SettingsDescribeView, SettingsMirrorSnapshot, } from './settings-mirror.ts';
/**
 * Required services: the Remote namespace the mirror reads through and the
 * forwarded settings invalidation it refreshes on.
 */
export declare const inject: string[];
/** Provide shared forms and refresh them on document changes and reconnects.
 * @param ctx Client provider context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map