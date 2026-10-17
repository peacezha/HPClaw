/** API-key configuration resolved together with one Messages endpoint generation. */
import type { Volatile } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { type CredentialRef } from '@deepseek-ai/dsh-credentials';
import type { LaunchEnvironmentSnapshot } from '@deepseek-ai/dsh-launch-environment';
import { type Config as ProtocolConfig } from '@deepseek-ai/dsh-llm-deepseek';
import type { Options as ProtocolOptions, DeepSeekConnectionOptions } from '@deepseek-ai/dsh-llm-deepseek';
/** Messages configuration with a per-request API-key reference. */
export interface Config extends ProtocolConfig {
    /** Credential reference resolved per request; defaults to DEEPSEEK_API_KEY. */
    apiKeyEnv: Volatile<string>;
}
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    apiKeyEnv: z<string, string, "volatile-defined">;
    baseURL: z<string, string, "volatile">;
    thinking: z<"enabled" | "disabled", "enabled" | "disabled", "volatile">;
    reasoningEffort: z<"low" | "off" | "high" | "max", "low" | "off" | "high" | "max", "volatile">;
    maxTokens: z<number, number, "volatile-defined">;
    defaultContextWindow: z<number, number, "volatile-defined">;
    models: z<NoInfer<import("@deepseek-ai/dsh-llm-deepseek").DeepSeekCatalogModel[]>, NoInfer<import("@deepseek-ai/dsh-llm-deepseek").DeepSeekCatalogModel[]>, "volatile-defined">;
    streamIdleTimeoutMs: z<number, number, "volatile-defined">;
    maxRequestFilesBytes: z<number, number, "volatile-defined">;
    maxInlineRequestImageBytes: z<number, number, "volatile-defined">;
    maxImagesPerRequest: z<number, number, "volatile-defined">;
    imageOffloadByteQuantum: z<number, number, "volatile-defined">;
    inlineImageOffloadByteQuantum: z<number, number, "volatile-defined">;
    imageOffloadCountQuantum: z<number, number, "volatile-defined">;
    filesApiTimeoutMs: z<number, number, "volatile-defined">;
    fileExpiresAfterSeconds: z<number, number, "volatile-defined">;
    fileRefreshMarginSeconds: z<number, number, "volatile-defined">;
    fileQuotaCleanupBatch: z<number, number, "volatile-defined">;
    retryPolicy: z<NoInfer<import("@deepseek-ai/dsh-llm").RetryPolicyConfig>, NoInfer<import("@deepseek-ai/dsh-llm").RetryPolicyConfig>, "volatile">;
}>>, Schemastery.ObjectT<NoInfer<{
    apiKeyEnv: z<string, string, "volatile-defined">;
    baseURL: z<string, string, "volatile">;
    thinking: z<"enabled" | "disabled", "enabled" | "disabled", "volatile">;
    reasoningEffort: z<"low" | "off" | "high" | "max", "low" | "off" | "high" | "max", "volatile">;
    maxTokens: z<number, number, "volatile-defined">;
    defaultContextWindow: z<number, number, "volatile-defined">;
    models: z<NoInfer<import("@deepseek-ai/dsh-llm-deepseek").DeepSeekCatalogModel[]>, NoInfer<import("@deepseek-ai/dsh-llm-deepseek").DeepSeekCatalogModel[]>, "volatile-defined">;
    streamIdleTimeoutMs: z<number, number, "volatile-defined">;
    maxRequestFilesBytes: z<number, number, "volatile-defined">;
    maxInlineRequestImageBytes: z<number, number, "volatile-defined">;
    maxImagesPerRequest: z<number, number, "volatile-defined">;
    imageOffloadByteQuantum: z<number, number, "volatile-defined">;
    inlineImageOffloadByteQuantum: z<number, number, "volatile-defined">;
    imageOffloadCountQuantum: z<number, number, "volatile-defined">;
    filesApiTimeoutMs: z<number, number, "volatile-defined">;
    fileExpiresAfterSeconds: z<number, number, "volatile-defined">;
    fileRefreshMarginSeconds: z<number, number, "volatile-defined">;
    fileQuotaCleanupBatch: z<number, number, "volatile-defined">;
    retryPolicy: z<NoInfer<import("@deepseek-ai/dsh-llm").RetryPolicyConfig>, NoInfer<import("@deepseek-ai/dsh-llm").RetryPolicyConfig>, "volatile">;
}>>, "plain">;
/** Plain deployment inputs for the API-key provider. */
export type Options = ProtocolOptions & {
    apiKeyEnv?: string;
};
/** Endpoint and credential reference captured from the same configuration generation. */
export interface ResolvedDeepSeekOptions extends DeepSeekConnectionOptions {
    /** Credential reference used only for this connection snapshot. */
    apiKeyEnv: CredentialRef;
}
/** Read one validated provider configuration.
 * @param config - live plugin configuration.
 * @returns detached resolver inputs.
 */
export declare function plainOptions(config: Config): Options;
/** Resolve API-key and protocol settings together.
 * @param config - raw deployment settings.
 * @param environment - application launch environment.
 * @returns validated endpoint facts and the matching credential reference.
 */
export declare function resolveAdapterOptions(config: Options, environment?: LaunchEnvironmentSnapshot): ResolvedDeepSeekOptions;
//# sourceMappingURL=config.d.ts.map