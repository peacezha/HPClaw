import z from "@deepseek-ai/schemastery";
//#region lib/types/index.js
/** Live welcome preference. */
const Config = z.object({ welcomeNoticeVersion: z.string().volatile() });
/** The browser consumes the configuration form projection.
* @param ctx Plugin context used for optional settings presentation.
*/
function apply(ctx) {
	ctx.inject(["settings"], (child) => {
		child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
	});
}
//#endregion
export { Config, apply };
