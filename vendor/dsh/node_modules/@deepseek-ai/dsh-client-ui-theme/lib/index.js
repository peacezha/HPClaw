import z from "@deepseek-ai/schemastery";
//#region lib/types/theme-settings.js
/** Theme preferences stored in the Host user-settings document. */
/** Built-in preferences accepted at the registry and settings boundaries. */
const THEME_PREFERENCES = [
	"light",
	"dark",
	"system"
];
/** Settings namespace owned by the theme plugin. */
const THEME_SETTINGS_NAMESPACE = "ui-theme";
/** Field carrying the selected built-in theme preference. */
const THEME_PREFERENCE_FIELD = "preference";
/** Field carrying the conversation content font size. */
const FONT_SIZE_FIELD = "fontSize";
/** Default preference when the user-settings document has no override. */
const DEFAULT_PREFERENCE = "system";
/** Smallest accepted content font size (px). */
const FONT_SIZE_MIN = 10;
/** Largest accepted content font size (px). */
const FONT_SIZE_MAX = 22;
/** Content font size when the user-settings document has no override (px). */
const DEFAULT_FONT_SIZE = 14;
/** Independently configurable font roles. */
const FONT_ROLES = [
	"text",
	"code",
	"terminal"
];
/**
* Font sizes by role. `text` is the conversation content size; `code` is the
* code-block size (inline code stays 1px larger); `terminal` is the sidebar
* terminal cell font size.
*/
const FONT_SIZE_SPECS = {
	text: {
		field: FONT_SIZE_FIELD,
		variable: "--dsh-content-font-size",
		min: 10,
		max: 22,
		default: 14
	},
	code: {
		field: "codeFontSize",
		variable: "--dsh-code-font-size",
		min: 10,
		max: 16,
		default: 11
	},
	terminal: {
		field: "terminalFontSize",
		variable: "--dsh-terminal-font-size",
		min: 10,
		max: 20,
		default: 13
	}
};
/** Default font sizes by role. */
const DEFAULT_FONT_SIZES = Object.freeze({
	text: FONT_SIZE_SPECS.text.default,
	code: FONT_SIZE_SPECS.code.default,
	terminal: FONT_SIZE_SPECS.terminal.default
});
/** Settings field carrying each role's font-family list. */
const FONT_FAMILY_FIELDS = {
	text: "textFontFamily",
	code: "codeFontFamily",
	terminal: "terminalFontFamily"
};
/**
* Body variable carrying one role's normalized font list; the token sheet
* places it ahead of that role's built-in stack.
* @param kind - font role.
* @returns the CSS custom property name.
*/
function fontFamilyVariable(kind) {
	return `--dsh-font-family-${kind}`;
}
/**
* Integer px schema for one role's font size.
* @param spec - the role's range and default.
* @returns the validated number schema.
*/
function fontSizeSchema(spec) {
	return z.number().step(1).min(spec.min).max(spec.max).default(spec.default);
}
z.object({
	[THEME_PREFERENCE_FIELD]: z.union([...THEME_PREFERENCES]).default(DEFAULT_PREFERENCE),
	[FONT_SIZE_FIELD]: fontSizeSchema(FONT_SIZE_SPECS.text),
	[FONT_SIZE_SPECS.code.field]: fontSizeSchema(FONT_SIZE_SPECS.code),
	[FONT_SIZE_SPECS.terminal.field]: fontSizeSchema(FONT_SIZE_SPECS.terminal),
	[FONT_FAMILY_FIELDS.text]: z.string().default(""),
	[FONT_FAMILY_FIELDS.code]: z.string().default(""),
	[FONT_FAMILY_FIELDS.terminal]: z.string().default("")
});
/** CSS Fonts generic and system family keywords, which must stay unquoted. */
const GENERIC_FAMILIES = new Set([
	"serif",
	"sans-serif",
	"monospace",
	"cursive",
	"fantasy",
	"system-ui",
	"ui-serif",
	"ui-sans-serif",
	"ui-monospace",
	"ui-rounded",
	"emoji",
	"math",
	"fangsong",
	"-apple-system",
	"blinkmacsystemfont"
]);
/**
* Normalize user input into a CSS font-family list. Names are comma separated;
* quotes, backslashes, angle brackets, and control characters are dropped, and
* every non-generic name is double-quoted, so the result is always a valid list
* safe to embed in inline CSS and boot scripts. Normalizing a result returns it unchanged.
* @param value - user-entered or stored font list.
* @returns the normalized list, or `''` when no family name remains.
*/
function normalizeFontFamily(value) {
	return value.split(",").map((name) => name.replace(/["'\\<>\u0000-\u001f\u007f]/gu, "").replace(/\s+/gu, " ").trim()).filter((name) => name !== "").map((name) => GENERIC_FAMILIES.has(name.toLowerCase()) ? name : `"${name}"`).join(", ");
}
//#endregion
//#region lib/types/boot-theme.js
/**
* Theme bootstrap row for the browser's pre-plugin interval. Each index
* render embeds the current durable built-in preference, font sizes, and
* font-family lists. Head CSS colors the document canvas before script
* execution; the body script installs the palette selector and font variables
* that the client presenters adopt.
*/
const LIGHT_BACKGROUND = "#fff";
const DARK_BACKGROUND = "#151517";
/** CSS that colors the document canvas before any script executes. */
function bootThemeStyle(preference) {
	const light = `:root{color-scheme:light}body{background-color:${LIGHT_BACKGROUND};--dsh-boot-bg:${LIGHT_BACKGROUND}}`;
	const dark = `:root{color-scheme:dark}body{background-color:${DARK_BACKGROUND};--dsh-boot-bg:${DARK_BACKGROUND}}`;
	if (preference === "light") return light;
	if (preference === "dark") return dark;
	return `${light}@media(prefers-color-scheme:dark){${dark}}`;
}
/** Build the body script that installs the palette selector and font variables. */
function bootThemeBodyScript(preference, fontSizes, fontFamilies) {
	const sizes = FONT_ROLES.map((role) => `\n  document.body.style.setProperty(${JSON.stringify(FONT_SIZE_SPECS[role].variable)}, ${JSON.stringify(`${fontSizes[role]}px`)})`).join("");
	const families = FONT_ROLES.flatMap((kind) => {
		const list = normalizeFontFamily(fontFamilies[kind]);
		return list === "" ? [] : [`\n  document.body.style.setProperty(${JSON.stringify(fontFamilyVariable(kind))}, ${JSON.stringify(list)})`];
	}).join("");
	return `(() => {
  const preference = ${JSON.stringify(preference)}
  const systemDark = preference === 'system'
    && typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-color-scheme: dark)').matches
  const dark = preference === 'dark' || systemDark
  document.documentElement.dataset.dsThemeSource = preference
  document.body.toggleAttribute('data-ds-dark-theme', dark)${sizes}${families}
})()`;
}
/**
* Theme bootstrap rows: head CSS colors the document canvas before
* first paint, then the body script installs the palette selector and font
* size and font families before the shell mount and module script.
* @param preference - Current Host-backed built-in preference.
* @param fontSizes - Current Host-backed font sizes in px by role.
* @param fontFamilies - Current Host-backed font lists; each is normalized before embedding.
* @returns head and body script rows in execution order.
*/
function bootThemeInjections(preference = DEFAULT_PREFERENCE, fontSizes = DEFAULT_FONT_SIZES, fontFamilies = {
	text: "",
	code: "",
	terminal: ""
}) {
	return [{
		kind: "style",
		text: bootThemeStyle(preference)
	}, {
		kind: "script",
		placement: "body",
		text: bootThemeBodyScript(preference, fontSizes, fontFamilies)
	}];
}
//#endregion
//#region lib/types/index.js
/** Live theme and typography preferences. */
const Config = z.object({
	preference: z.union([...THEME_PREFERENCES]).default(DEFAULT_PREFERENCE).volatile(),
	fontSize: fontSizeSchema(FONT_SIZE_SPECS.text).volatile(),
	codeFontSize: fontSizeSchema(FONT_SIZE_SPECS.code).volatile(),
	terminalFontSize: fontSizeSchema(FONT_SIZE_SPECS.terminal).volatile(),
	textFontFamily: z.string().default("").volatile(),
	codeFontFamily: z.string().default("").volatile(),
	terminalFontFamily: z.string().default("").volatile()
});
/** Supply the current palette before browser plugins start.
* @param ctx Host plugin context.
* @param config Validated live theme preferences.
*/
function apply(ctx, config) {
	ctx.inject(["settings"], (child) => {
		child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
	});
	ctx.on("webserver/index-inject", (table) => {
		table.push(...bootThemeInjections(config.preference.get(), {
			text: config.fontSize.get(),
			code: config.codeFontSize.get(),
			terminal: config.terminalFontSize.get()
		}, {
			text: config.textFontFamily.get(),
			code: config.codeFontFamily.get(),
			terminal: config.terminalFontFamily.get()
		}));
	}, { prepend: true });
}
//#endregion
export { Config, DEFAULT_FONT_SIZE, DEFAULT_PREFERENCE, FONT_SIZE_FIELD, FONT_SIZE_MAX, FONT_SIZE_MIN, THEME_PREFERENCES, THEME_PREFERENCE_FIELD, THEME_SETTINGS_NAMESPACE, apply };
