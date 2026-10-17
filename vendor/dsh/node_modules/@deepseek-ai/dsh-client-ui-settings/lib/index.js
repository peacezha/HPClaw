import z from "@deepseek-ai/schemastery";
//#region lib/types/developer-tools-settings.js
/** Shared Web and desktop developer-tool preference stored by the Host. */
/** New installations and missing values enable the full interface. */
const DeveloperToolsSettingsFields = { enabled: z.boolean().default(true) };
z.object(DeveloperToolsSettingsFields);
//#endregion
//#region lib/types/index.js
/** Live preferences projected to the browser. */
const Config = z.object({ enabled: DeveloperToolsSettingsFields["enabled"].volatile() });
/** Host preferences are consumed through the configuration form projection.
* @param ctx Plugin context used for optional settings presentation.
*/
function apply(ctx) {
	ctx.inject(["settings"], (child) => {
		child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
	});
}
//#endregion
export { Config, apply };
