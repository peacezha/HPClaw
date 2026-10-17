import { parentPort, workerData } from "node:worker_threads";
import { createHash } from "node:crypto";
import { closeSync, constants, fstatSync, mkdirSync, openSync, readSync, readdirSync, realpathSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { extname, isAbsolute, join, posix, win32 } from "node:path";
import { create } from "fontkit";
//#region lib/types/font-file-identity.js
/** Preserve 64-bit device and inode values without JavaScript integer rounding. */
function fontFileIdentity(status) {
	return {
		dev: status.dev.toString(),
		ino: status.ino.toString(),
		size: Number(status.size),
		mtimeMs: Number(status.mtimeNs) / 1e6,
		ctimeMs: Number(status.ctimeNs) / 1e6
	};
}
/** Compare a source descriptor's exact identity with its indexed font metadata. */
function matchesFontFile(status, expected) {
	const current = fontFileIdentity(status);
	return [
		"dev",
		"ino",
		"size",
		"mtimeMs",
		"ctimeMs"
	].every((key) => current[key] === expected[key]);
}
//#endregion
//#region lib/types/fonts.js
/** Host font metadata snapshots and conversion-local glyph matching over original files. */
const FONT_EXTENSIONS$1 = /* @__PURE__ */ new Set([
	".ttf",
	".otf",
	".ttc",
	".otc",
	".dfont"
]);
/**
* @param error - Thrown filesystem value.
* @returns whether it means the path is not a usable font source.
*/
function absent(error) {
	return error instanceof Error && "code" in error && [
		"ENOENT",
		"EACCES",
		"EPERM",
		"ENOTDIR"
	].includes(String(error.code));
}
/**
* Case- and separator-insensitive family key used to compare names across sources.
* @param value - Family, style, or postscript name as recorded by a document or font.
* @returns The normalized key.
*/
function normalize(value) {
	return value.normalize("NFKC").toLowerCase().replaceAll(/[\s_-]/g, "");
}
function fontPaths(directories, maxFiles) {
	const pending = [...directories].reverse();
	const visited = /* @__PURE__ */ new Set();
	const paths = [];
	for (let path = pending.pop(); path !== void 0; path = pending.pop()) {
		let canonical;
		let status;
		try {
			canonical = realpathSync(path);
			status = statSync(canonical);
		} catch (error) {
			if (absent(error)) continue;
			throw error;
		}
		if (visited.has(canonical)) continue;
		visited.add(canonical);
		if (status.isDirectory()) {
			let names;
			try {
				names = readdirSync(canonical);
			} catch (error) {
				if (absent(error)) continue;
				throw error;
			}
			pending.push(...names.sort().reverse().map((name) => join(canonical, name)));
		} else if (status.isFile() && FONT_EXTENSIONS$1.has(extname(canonical).toLowerCase())) {
			if (paths.length >= maxFiles) throw new Error("The system font catalog exceeds maxFontFiles.");
			paths.push(canonical);
		}
	}
	return paths;
}
/**
* VCL weight, width, and fixed-pitch values for one parsed face.
* @param font - The parsed physical face, whose `OS/2` and `post` tables may be absent.
* @returns the recorded classes, or the regular defaults for an absent table.
*/
function faceMetrics(font) {
	const os2 = font["OS/2"];
	return {
		weight: os2 === void 0 ? 400 : os2.usWeightClass,
		width: os2 === void 0 ? 5 : os2.usWidthClass,
		fixed: Boolean(font.post?.isFixedPitch)
	};
}
function inspect(path, maxBytes, observed) {
	let status;
	let bytes;
	try {
		const fd = openSync(path, constants.O_RDONLY | constants.O_NONBLOCK | constants.O_NOFOLLOW);
		try {
			status = fstatSync(fd, { bigint: true });
			if (!status.isFile() || status.size > maxBytes) return [];
			bytes = Buffer.alloc(Number(status.size));
			let offset = 0;
			while (offset < bytes.length) {
				const count = readSync(fd, bytes, offset, bytes.length - offset, offset);
				if (count === 0) throw new Error("A system font was truncated while indexing; reload the font service.");
				offset += count;
			}
			const after = fstatSync(fd, { bigint: true });
			if (after.size !== status.size || after.mtimeNs !== status.mtimeNs || after.ctimeNs !== status.ctimeNs) throw new Error("A system font changed while indexing; reload the font service.");
		} finally {
			closeSync(fd);
		}
	} catch (error) {
		if (absent(error)) return [];
		throw error;
	}
	let faces;
	try {
		const parsed = create(bytes);
		faces = ("fonts" in parsed ? parsed.fonts : [parsed]).map((font, faceIndex) => {
			const names = [
				"fontFamily",
				"preferredFamily",
				"fullName",
				"postscriptName"
			].flatMap((key) => Object.values(font.name?.records[key] ?? {})).filter((name) => typeof name === "string");
			const aliases = [...new Set([
				...names,
				font.familyName,
				font.fullName,
				font.postscriptName
			].filter((name) => Boolean(name)).map(normalize))];
			return {
				path,
				...fontFileIdentity(status),
				faceIndex,
				family: font.familyName,
				style: font.subfamilyName,
				aliases,
				...faceMetrics(font),
				italic: font.italicAngle !== 0,
				postscriptName: font.postscriptName
			};
		});
	} catch {
		faces = [];
	}
	observed?.set(path, {
		path,
		...fontFileIdentity(status),
		faces
	});
	return faces;
}
/**
* Snapshot eligible local font metadata without retaining font bytes or decoding glyph coverage.
* @param options - Host font roots and physical file limits.
* @param previous - Prior per-file records, reused only after opening and checking the current file.
* @param observed - Receives successfully read records for this scan, including damaged-font parse results.
* @returns metadata in discovery order for the current font inventory.
*/
function indexSystemFonts(options, previous = /* @__PURE__ */ new Map(), observed) {
	return fontPaths(options.directories, options.maxFiles).flatMap((path) => {
		const prior = observed?.get(path) ?? previous.get(path);
		if (prior !== void 0) try {
			const fd = openSync(path, constants.O_RDONLY | constants.O_NONBLOCK | constants.O_NOFOLLOW);
			try {
				const current = fstatSync(fd, { bigint: true });
				if (current.isFile() && current.size <= options.maxFileBytes && matchesFontFile(current, prior)) {
					observed?.set(path, prior);
					return prior.faces;
				}
				if (observed?.has(path)) throw new Error("A system font changed while indexing; reload the font service.");
			} finally {
				closeSync(fd);
			}
		} catch (error) {
			if (absent(error)) return [];
			throw error;
		}
		return inspect(path, options.maxFileBytes, observed);
	});
}
//#endregion
//#region lib/types/office-fonts.js
/** Curated fonts discovered from a user's Microsoft Office installation. */
const FONT_EXTENSIONS = /* @__PURE__ */ new Set([
	".ttf",
	".otf",
	".ttc",
	".otc",
	".dfont"
]);
const OFFICE_FONT_FILE = /^(?:aptos(?:[- ].*)?|arial(?:bd|bi|i)?|calibri(?:b|i|z|l|li)?|cambria(?:b|i|z)?|cour(?:bd|bi|i)?|deng(?:b|l)?|fangsong|kaiti|msjh(?:bd)?|msyh(?:bd|l)?|segoeui(?:b|i|z|l|li|sb|sbi|sl|sli)?|simhei|simsunb?|symbol|times(?:bd|bi|i)?|wingdings(?: [23])?|wingdng[23])\.(?:ttf|otf|ttc|otc)$/iu;
const FAMILIES = new Set([
	"aptos",
	"aptos display",
	"aptos narrow",
	"arial",
	"calibri",
	"calibri light",
	"cambria",
	"cambria math",
	"courier new",
	"dengxian",
	"fangsong",
	"kaiti",
	"microsoft jhenghei",
	"microsoft jhenghei ui",
	"microsoft yahei",
	"microsoft yahei ui",
	"nsimsun",
	"segoe ui",
	"simhei",
	"simsun",
	"symbol",
	"times new roman",
	"wingdings",
	"wingdings 2",
	"wingdings 3"
].map(normalize));
/** @returns whether parsed font names belong to the curated Office compatibility set. */
function officeFontFace(face) {
	return face.aliases.some((alias) => FAMILIES.has(alias));
}
function directory(path) {
	try {
		return statSync(path).isDirectory();
	} catch (error) {
		if (absent(error)) return false;
		throw error;
	}
}
function files(root, recursive, namesOnly = true) {
	const pending = [root], result = [];
	for (let current = pending.pop(); current !== void 0; current = pending.pop()) {
		let entries;
		try {
			entries = readdirSync(current, { withFileTypes: true });
		} catch (error) {
			/* v8 ignore next -- Optional Office cache disappearance is also covered by system-font absence handling. */
			if (absent(error)) continue;
			throw error;
		}
		for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, "en"))) if (entry.isDirectory()) {
			if (recursive && entry.name !== "PreviewFont") pending.push(join(current, entry.name));
		} else if (entry.isFile() && FONT_EXTENSIONS.has(extname(entry.name).toLowerCase()) && (!namesOnly || OFFICE_FONT_FILE.test(entry.name))) result.push(join(current, entry.name));
	}
	return result;
}
/** Find compatibility font files without exposing their paths outside the font Worker. */
function officeFontFiles(platform = process.platform, home = homedir(), env = process.env, applicationRoots = ["/Applications", posix.join(home, "Applications")]) {
	const bundled = platform === "darwin" ? [
		"Microsoft Word",
		"Microsoft Excel",
		"Microsoft PowerPoint"
	].flatMap((app) => applicationRoots.map((root) => posix.join(root, `${app}.app/Contents/Resources/DFonts`))).find(directory) : platform === "win32" ? [env.ProgramFiles, env["ProgramFiles(x86)"]].filter((root) => Boolean(root)).map((root) => win32.join(root, "Microsoft Office", "root", "vfs", "Fonts", "private")).find(directory) : void 0;
	const cloud = platform === "darwin" ? posix.join(home, "Library/Group Containers/UBF8T346G9.Office/FontCache") : platform === "win32" ? win32.join(env.LOCALAPPDATA ?? win32.join(home, "AppData", "Local"), "Microsoft", "FontCache") : void 0;
	const ordered = [...bundled === void 0 ? [] : files(bundled, false).sort(), ...cloud === void 0 ? [] : files(cloud, true, false).sort((a, b) => b.localeCompare(a, "en", { numeric: true }))];
	const unique = /* @__PURE__ */ new Map();
	for (const file of ordered) {
		const portable = file.replaceAll("\\", "/");
		const name = portable.slice(portable.lastIndexOf("/") + 1).toLowerCase();
		if (!unique.has(name)) unique.set(name, file);
	}
	return [...unique.values()];
}
//#endregion
//#region lib/types/font-metadata-cache.js
/** Optional, bounded disk storage for derived font metadata; source reads remain authoritative. */
const VERSION = {
	format: 1,
	extractor: 2,
	fontkit: "2.0.4"
};
const digest = (records) => createHash("sha256").update(JSON.stringify(records)).digest("hex");
function object(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
const finite = (value) => typeof value === "number" && Number.isFinite(value);
const text = (value) => typeof value === "string" && !value.includes("\0");
const IDENTITY = [
	"size",
	"mtimeMs",
	"ctimeMs",
	"dev",
	"ino"
];
function record(value) {
	if (!object(value) || !text(value.path) || !isAbsolute(value.path) || ![
		"size",
		"mtimeMs",
		"ctimeMs"
	].every((key) => finite(value[key])) || !["dev", "ino"].every((key) => typeof value[key] === "string" && /^\d+$/.test(value[key])) || !Number.isSafeInteger(value.size) || Number(value.size) < 0 || !Object.keys(value).every((key) => [
		"path",
		...IDENTITY,
		"faces"
	].includes(key)) || !Array.isArray(value.faces)) return false;
	return value.faces.every((face, index) => object(face) && face.path === value.path && IDENTITY.every((key) => face[key] === value[key]) && face.faceIndex === index && text(face.family) && text(face.style) && Array.isArray(face.aliases) && face.aliases.every(text) && finite(face.weight) && finite(face.width) && typeof face.italic === "boolean" && typeof face.fixed === "boolean" && (face.postscriptName === null || text(face.postscriptName)) && Object.keys(face).every((key) => [
		"path",
		...IDENTITY,
		"faceIndex",
		"family",
		"style",
		"aliases",
		"weight",
		"width",
		"italic",
		"fixed",
		"postscriptName"
	].includes(key)));
}
/** Read validated records within the configured byte limit; unusable derived data is a cache miss. */
function readFontMetadataCache(options) {
	return readCache(options) ?? [];
}
function readCache(options) {
	if (options.fontMetadataCacheDirectory === false) return void 0;
	try {
		const fd = openSync(join(options.fontMetadataCacheDirectory, "font-metadata.json"), constants.O_RDONLY | constants.O_NONBLOCK | constants.O_NOFOLLOW);
		let bytes;
		try {
			const before = fstatSync(fd);
			if (!before.isFile() || before.size > options.maxFontMetadataCacheBytes) return void 0;
			bytes = Buffer.alloc(before.size);
			for (let offset = 0; offset < bytes.length;) {
				const count = readSync(fd, bytes, offset, bytes.length - offset, offset);
				if (count === 0) return void 0;
				offset += count;
			}
			const after = fstatSync(fd);
			if (IDENTITY.some((key) => before[key] !== after[key])) return void 0;
		} finally {
			closeSync(fd);
		}
		const data = JSON.parse(bytes.toString("utf8"));
		if (!object(data) || data.format !== VERSION.format || data.extractor !== VERSION.extractor || data.fontkit !== VERSION.fontkit || !Object.keys(data).every((key) => [
			"format",
			"extractor",
			"fontkit",
			"digest",
			"records"
		].includes(key)) || !Array.isArray(data.records) || !data.records.every(record)) return void 0;
		const records = data.records;
		return data.digest === digest(records) && new Set(records.map((file) => file.path)).size === records.length ? records : void 0;
	} catch {
		return;
	}
}
/** Atomically publish a bounded snapshot through a caller-owned unique temporary path. */
function writeFontMetadataCache(options, records, temporaryPath) {
	if (options.fontMetadataCacheDirectory === false) return;
	let owned = false;
	try {
		const bytes = JSON.stringify({
			...VERSION,
			digest: digest(records),
			records
		});
		if (Buffer.byteLength(bytes) > options.maxFontMetadataCacheBytes) return;
		const existing = readCache(options);
		if (JSON.stringify(existing) === JSON.stringify(records)) return;
		mkdirSync(options.fontMetadataCacheDirectory, {
			recursive: true,
			mode: 448
		});
		const fd = openSync(temporaryPath, "wx", 384);
		owned = true;
		try {
			writeFileSync(fd, bytes);
		} finally {
			closeSync(fd);
		}
		renameSync(temporaryPath, join(options.fontMetadataCacheDirectory, "font-metadata.json"));
		owned = false;
	} catch {} finally {
		if (owned) try {
			unlinkSync(temporaryPath);
		} catch {}
	}
}
//#endregion
//#region lib/types/font-snapshot.js
/** Revalidate physical font records and assemble the current ordered catalog. */
/** Re-enumerate all configured sources; only unchanged physical files skip inspection. */
function scanFontSnapshot(options, previous = []) {
	const reusable = new Map([...readFontMetadataCache(options), ...previous].map((file) => [file.path, file]));
	const observed = /* @__PURE__ */ new Map();
	const primary = indexSystemFonts({
		directories: options.fontDirectories,
		maxFiles: options.maxFontFiles,
		maxFileBytes: options.maxFontFileBytes
	}, reusable, observed);
	let faces = primary;
	if (options.includeOfficeFonts) {
		const remaining = Math.max(0, options.maxFontFiles - new Set(primary.map((face) => face.path)).size);
		if (remaining > 0) {
			const supplemental = indexSystemFonts({
				directories: officeFontFiles().slice(0, remaining),
				maxFiles: remaining,
				maxFileBytes: options.maxFontFileBytes
			}, reusable, observed);
			const aliases = new Set(primary.flatMap((face) => face.aliases));
			faces = [...primary, ...supplemental.filter((face) => officeFontFace(face) && !face.aliases.some((alias) => aliases.has(alias)))];
		}
	}
	return {
		faces,
		records: [...observed.values()],
		generation: createHash("sha256").update(JSON.stringify(faces)).digest("hex")
	};
}
//#endregion
//#region lib/types/errors.js
/** Stable render failure categories shared across the Node worker and native helper transports. */
const CODES = /* @__PURE__ */ new Set([
	"input-too-large",
	"output-too-large",
	"invalid-document",
	"unsupported-format",
	"invalid-output",
	"timeout",
	"unavailable",
	"failed"
]);
/**
* Only published categories cross worker/helper messages; unknown errors use the generic failure category.
* @param error - The thrown value, which may be any type and may carry an unpublished `code`.
* @returns The published category, or `failed` when no published category is present.
*/
function failureCode(error) {
	const code = error?.code;
	return typeof code === "string" && CODES.has(code) ? code : "failed";
}
//#endregion
//#region lib/types/font-snapshot-worker.js
/** Short-lived, cancellable metadata scan; no document or font bytes survive Worker exit. */
try {
	const { options, previous, temporaryPath } = workerData;
	const snapshot = scanFontSnapshot(options, previous);
	if (temporaryPath !== void 0) writeFontMetadataCache(options, snapshot.records, temporaryPath);
	parentPort.postMessage({
		ok: true,
		snapshot
	});
} catch (error) {
	parentPort.postMessage({
		ok: false,
		code: failureCode(error),
		error: error instanceof Error ? error.message : String(error)
	});
}
//#endregion
export {};
