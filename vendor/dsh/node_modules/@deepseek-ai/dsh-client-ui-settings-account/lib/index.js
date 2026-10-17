import z from "@deepseek-ai/schemastery";
//#region lib/types/contact-config.js
/** Public contact and bonus notice options shared by Host and Client. */
/** Validate public questionnaire options. */
const ContactConfigFields = {
	contactFormUrl: z.string().pattern(/^https:\/\/[^/\s]+\//).default("https://trtgsjkv6r.feishu.cn/share/base/form/shrcnlCoGElW7MQznGy9r3YYXcg?hide_uid=1&hide_device_info=1&hide_harness_version=1"),
	contactSource: z.string().default(""),
	bonusAckRetryDelayMs: z.number().min(1).default(1e3),
	bonusAckRetryMaxDelayMs: z.number().min(1).default(6e4)
};
z.object(ContactConfigFields);
/** Bootstrap key containing no account credentials. */
const CONTACT_CONFIG_GLOBAL = "__DSH_CONTACT_CONFIG__";
//#endregion
//#region lib/types/onboarding-settings.js
/** Device-local onboarding progress stored in the Host settings document. */
/** Validated defaults for a fresh installation. */
const OnboardingSettingsFields = {
	version: z.const(1).default(1),
	step: z.union([
		"welcome",
		"credit",
		"purpose",
		"process",
		"done"
	]).default("welcome"),
	purpose: z.union([
		"office",
		"development",
		"both",
		z.const(null)
	]),
	process: z.union([
		"compact",
		"standard",
		"detailed",
		z.const(null)
	]),
	completion: z.union([
		"completed",
		"skipped",
		"api-key",
		z.const(null)
	]),
	usage: z.union(["compact", "detailed"]).default("compact"),
	developerTools: z.boolean().default(false)
};
z.object(OnboardingSettingsFields);
//#endregion
//#region lib/types/index.js
/** Configuration projected through the account plugin's shared form. */
const Config = z.object({
	contactFormUrl: ContactConfigFields.contactFormUrl,
	contactSource: ContactConfigFields.contactSource,
	bonusAckRetryDelayMs: ContactConfigFields.bonusAckRetryDelayMs,
	bonusAckRetryMaxDelayMs: ContactConfigFields.bonusAckRetryMaxDelayMs,
	version: OnboardingSettingsFields.version.volatile(),
	step: OnboardingSettingsFields.step.volatile(),
	purpose: OnboardingSettingsFields.purpose.volatile(),
	process: OnboardingSettingsFields.process.volatile(),
	completion: OnboardingSettingsFields.completion.volatile(),
	usage: OnboardingSettingsFields.usage.volatile(),
	developerTools: OnboardingSettingsFields.developerTools.volatile()
});
/**
* Publish public questionnaire options before browser plugins activate.
* @param ctx - Host context collecting page initialization data.
* @param config - validated deployment options.
*/
function apply(ctx, config) {
	ctx.inject(["settings"], (scope) => {
		scope.effect(() => scope.settings.configure({ auto: false }, ctx.fiber));
	});
	ctx.on("webserver/index-inject", (table) => {
		table.push({
			kind: "global",
			name: CONTACT_CONFIG_GLOBAL,
			value: {
				contactFormUrl: config.contactFormUrl,
				contactSource: config.contactSource,
				bonusAckRetryDelayMs: config.bonusAckRetryDelayMs,
				bonusAckRetryMaxDelayMs: config.bonusAckRetryMaxDelayMs
			}
		});
	});
}
//#endregion
export { Config, apply };
