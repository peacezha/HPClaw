import { createRequire } from "node:module";
//#region lib/types/index.js
/** Caller-relative lazy loading for CommonJS-compatible Host dependencies. */
/**
* Create a successful-result cache around Node's caller-relative `require`.
* A failed load is not cached, so a corrected installation can be retried.
* @param specifier - Literal dependency specifier declared by the caller package.
* @param parentURL - Caller's `import.meta.url`, which owns package resolution.
* @returns a zero-argument loader that resolves the dependency on first use.
*/
function createLazyRequire(specifier, parentURL) {
	const require = createRequire(parentURL);
	let loaded = false;
	let value;
	return () => {
		if (!loaded) {
			value = require(specifier);
			loaded = true;
		}
		return value;
	};
}
//#endregion
export { createLazyRequire };
