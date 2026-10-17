import { createRequire } from "node:module";
import { parentPort, workerData } from "node:worker_threads";
import { closeSync, constants, fstatSync, mkdirSync, openSync, readFileSync, readSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { strFromU8, unzipSync, zlibSync } from "fflate";
import { SaxesParser } from "saxes";
import { create } from "fontkit";
import { createHash } from "node:crypto";
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
/** An actionable converter failure; operating-system errors and caller abort reasons remain unchanged. */
var ConversionError = class extends Error {
	/** Published failure category carried across worker and helper transports. */
	code;
	/**
	* @param code - Published failure category.
	* @param message - Consumer-facing failure description.
	* @param options - Standard error options; a cause is preserved for diagnostics.
	*/
	constructor(code, message, options) {
		super(message, options);
		this.name = "ConversionError";
		this.code = code;
	}
};
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
const VCL_WEIGHTS = [
	400,
	100,
	200,
	300,
	350,
	400,
	500,
	600,
	700,
	800,
	900
];
const GENERIC_FAMILIES = /* @__PURE__ */ new Set([
	"serif",
	"sansserif",
	"monospace",
	"cursive",
	"fantasy",
	"systemui",
	"symbol"
]);
/**
* Case- and separator-insensitive family key used to compare names across sources.
* @param value - Family, style, or postscript name as recorded by a document or font.
* @returns The normalized key.
*/
function normalize(value) {
	return value.normalize("NFKC").toLowerCase().replaceAll(/[\s_-]/g, "");
}
/**
* Order named substitutions and their generic text family without excluding unlisted fonts.
* @param requested - Original family names, in document order.
* @param groups - Ordered family groups shared with Fontconfig aliases.
* @param pitch - VCL pitch; one requests a monospaced fallback.
* @param symbols - Whether symbol alternatives precede the generic fallback.
* @returns distinct family names, with original requests first.
*/
function fontFamilyPriority(requested, groups, pitch = 0, symbols = false) {
	const original = requested.map(normalize);
	const matched = groups.filter((group) => group.some((family) => original.includes(normalize(family))));
	const generic = original.includes("monospace") || pitch === 1 ? "monospace" : original.includes("serif") ? "serif" : matched.flat().map(normalize).find((family) => family === "serif" || family === "sansserif" || family === "monospace") ?? "sansserif";
	const families = [...requested, ...matched.flat()];
	for (const kind of symbols ? ["symbol", generic] : [generic]) for (const group of groups) if (group.some((family) => normalize(family) === kind)) families.push(...group);
	const priority = /* @__PURE__ */ new Map();
	for (const family of families) {
		const name = normalize(family);
		if (!priority.has(name)) priority.set(name, family);
	}
	return [...priority.values()];
}
function ranges(font) {
	const points = font.characterSet.filter((point) => font.hasGlyphForCodePoint(point)).sort((left, right) => left - right);
	const result = [];
	for (const point of points) {
		const last = result.at(-1);
		if (last !== void 0 && point <= last[1] + 1) last[1] = Math.max(last[1], point);
		else result.push([point, point]);
	}
	return result;
}
/**
* Decode glyph coverage for one parsed face.
* @param font - The parsed physical face.
* @returns the inclusive ranges the face renders, or none when its glyph tables reject decoding.
*/
function faceCoverage(font) {
	try {
		return ranges(font);
	} catch {
		return [];
	}
}
/**
* @param parsed - Parsed font file: one face, or a collection of faces.
* @param face - Indexed metadata naming the face inside that file.
* @returns the physical face the index names.
* @throws when the file no longer provides the indexed face.
*/
function indexedFace(parsed, face) {
	const font = "fonts" in parsed ? parsed.fonts[face.faceIndex] : parsed;
	if (font === void 0 || font.postscriptName !== face.postscriptName) throw new Error("The indexed font face is no longer available; recreate the converter.");
	return font;
}
function covers(face, points) {
	if (points.length === 0) return [];
	if (face.coverage === void 0) face.coverage = faceCoverage(indexedFace(create(readFont(face)), face));
	const coverage = face.coverage;
	return points.filter((point) => coverage.some(([first, last]) => point >= first && point <= last));
}
function regionalPriority(face, language) {
	const locale = language.toLowerCase();
	const preferred = locale.startsWith("ja") ? ["jp"] : locale.startsWith("ko") ? ["kr"] : locale.startsWith("zh") ? /hant|tw|hk|mo/.test(locale) ? ["tc", "hk"] : ["sc"] : [];
	if (preferred.length === 0) return 0;
	const region = `${face.family} ${face.postscriptName} ${basename(face.path)}`.toLowerCase().match(/(?:cjk|[\s_-])(sc|tc|jp|kr|hk)(?=[\s_.-]|$)/)?.[1];
	return region === void 0 ? 1 : preferred.includes(region) ? 0 : 2;
}
/** Conversion-local glyph coverage over one operation's metadata snapshot. */
var SystemFontCatalog = class {
	options;
	faces;
	/**
	* @param options - Host metadata snapshot and fallback families.
	*/
	constructor(options) {
		this.options = options;
		this.faces = options.faces.map((face) => ({ ...face }));
	}
	/**
	* Find installed faces covering the requested family or missing characters.
	* Exact families precede configured alternatives, symbol families for missing symbols,
	* generic families, then other glyph-covering faces.
	* @param request - VCL family/style attributes and Unicode scalars missing from its current font.
	* @param signal - cancellation checked between synchronous font reads.
	* @returns selected physical files, deduplicated across collection faces; absent glyphs remain unresolved.
	* @throws if an indexed font changes or cannot be read during glyph matching.
	*/
	match(request, signal) {
		signal.throwIfAborted();
		const requested = request.family.split(";").map((family) => family.trim()).filter(Boolean);
		const primary = requested[0];
		let missingFamily;
		if (primary !== void 0 && !GENERIC_FAMILIES.has(normalize(primary)) && !this.faces.some((face) => face.aliases.includes(normalize(primary)))) missingFamily = primary;
		const priority = fontFamilyPriority(requested, this.options.fallbackFamilies, request.pitch, request.codePoints.some((point) => /\p{Symbol}/u.test(String.fromCodePoint(point)))).map(normalize);
		const missing = new Set(request.codePoints);
		const ranked = this.faces.map((face) => {
			const rank = priority.findIndex((family) => face.aliases.includes(family));
			const region = regionalPriority(face, request.language);
			const style = (request.style && normalize(request.style) === normalize(face.style) ? -1 : 0) + (request.italic === 3 || request.italic !== 0 === face.italic ? 0 : 100) + (request.pitch === 0 || request.pitch === 1 === face.fixed ? 0 : 50) + Math.abs((VCL_WEIGHTS[request.weight] ?? 400) - face.weight) / 100 + (request.width === 0 ? 0 : Math.abs(request.width - face.width));
			return {
				face,
				rank: rank < 0 ? priority.length : rank,
				region,
				style
			};
		}).sort((left, right) => left.rank - right.rank || left.region - right.region || left.style - right.style || left.face.path.localeCompare(right.face.path, "en") || left.face.faceIndex - right.face.faceIndex);
		const selected = [];
		const files = /* @__PURE__ */ new Set();
		for (const { face } of ranked) {
			signal.throwIfAborted();
			const covered = covers(face, [...missing]);
			if (missing.size > 0 && covered.length === 0) continue;
			if (!files.has(face.path)) {
				selected.push(face);
				files.add(face.path);
			}
			for (const point of covered) missing.delete(point);
			if (missing.size === 0) break;
		}
		return {
			fonts: selected,
			...missingFamily === void 0 ? {} : { missingFamily },
			...missing.size === 0 ? {} : { unresolvedCodePoints: [...missing] }
		};
	}
};
/**
* Read the unchanged indexed regular file; reject concurrent replacement or truncation.
* @param face - Indexed face metadata whose identity and timestamps must still match the file.
* @returns the complete original font bytes.
* @throws when the file changed, was replaced, or was truncated since indexing.
*/
function readFont(face) {
	const fd = openSync(face.path, constants.O_RDONLY | constants.O_NONBLOCK | constants.O_NOFOLLOW);
	try {
		const before = fstatSync(fd, { bigint: true });
		if (!before.isFile() || !matchesFontFile(before, face)) throw new Error("An indexed font changed; recreate the converter.");
		const bytes = Buffer.alloc(face.size);
		for (let offset = 0; offset < bytes.length;) {
			const count = readSync(fd, bytes, offset, bytes.length - offset, offset);
			if (!count) throw new Error("An indexed font was truncated.");
			offset += count;
		}
		if (!matchesFontFile(fstatSync(fd, { bigint: true }), face)) throw new Error("An indexed font changed while reading.");
		return bytes;
	} finally {
		closeSync(fd);
	}
}
//#endregion
//#region lib/types/ooxml.js
/** Bounded OOXML inspection and declared font diagnostics, using maintained ZIP/XML parsers. */
const MAIN_PARTS = {
	odt: ["content.xml", "application/vnd.oasis.opendocument.text"],
	ods: ["content.xml", "application/vnd.oasis.opendocument.spreadsheet"],
	odp: ["content.xml", "application/vnd.oasis.opendocument.presentation"],
	docx: ["word/document.xml", "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"],
	xlsx: ["xl/workbook.xml", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"],
	pptx: ["ppt/presentation.xml", "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"]
};
/**
* @param character - One code point as yielded by iteration over a string.
* @returns the Unicode scalar the character encodes; iteration never yields an empty string.
*/
function codePointOf(character) {
	return character.codePointAt(0);
}
/**
* Validate ZIP size and membership before decoding selected document XML.
* @param bytes - Complete source document bytes.
* @param extension - Input extension, which selects the main document part.
* @param limits - Archive entry and declared uncompressed byte limits.
* @returns declared font families and the scalar values readable document XML declares.
* @throws ConversionError when the extension is unsupported or the archive violates its limits.
*/
function inspectDocument$1(bytes, extension, limits) {
	const main = MAIN_PARTS[extension];
	if (!main) throw new ConversionError("unsupported-format", "Input extension must be docx, xlsx, or pptx.");
	const odf = [
		"odt",
		"ods",
		"odp"
	].includes(extension);
	const names = /* @__PURE__ */ new Set();
	let total = 0;
	let files;
	try {
		files = unzipSync(bytes, { filter(entry) {
			total += entry.originalSize;
			if (names.has(entry.name) || names.size >= limits.maxArchiveEntries || !Number.isSafeInteger(total) || total > limits.maxUncompressedBytes) throw new Error("OOXML archive exceeds its limits or repeats an entry.");
			names.add(entry.name);
			if (odf) return [
				"mimetype",
				"content.xml",
				"styles.xml",
				"META-INF/manifest.xml"
			].includes(entry.name);
			return entry.name === "[Content_Types].xml" || /^(word|xl|ppt)\/.*\.xml$/.test(entry.name) && !entry.name.endsWith("/fontTable.xml") && !entry.name.includes("/theme/");
		} });
	} catch (cause) {
		throw new ConversionError("invalid-document", "Input is not a supported, bounded OOXML archive.", { cause });
	}
	const contentTypes = files["[Content_Types].xml"];
	if (odf ? !names.has("content.xml") || !names.has("META-INF/manifest.xml") || strFromU8(files.mimetype ?? /* @__PURE__ */ new Uint8Array()) !== main[1] : !names.has("_rels/.rels") || !names.has(main[0]) || contentTypes === void 0 || !strFromU8(contentTypes).includes(main[1])) throw new ConversionError("invalid-document", `Input does not contain a ${extension} document.`);
	const families = /* @__PURE__ */ new Map();
	const codePoints = /* @__PURE__ */ new Set();
	for (const [name, data] of Object.entries(files)) {
		if (name === "[Content_Types].xml" || name === "mimetype" || name === "META-INF/manifest.xml") continue;
		const partFamilies = [];
		const partPoints = /* @__PURE__ */ new Set();
		const parser = new SaxesParser({ xmlns: true });
		parser.on("opentag", (tag) => {
			const word = /wordprocessingml\/(?:2006\/)?main$/.test(tag.uri) && tag.local === "rFonts";
			const drawing = /drawingml\/(?:2006\/)?main$/.test(tag.uri);
			const sheet = /spreadsheetml\/(?:2006\/)?main$/.test(tag.uri) && tag.local === "name";
			for (const attribute of Object.values(tag.attributes)) {
				if (odf && attribute.local === "font-family") partFamilies.push(attribute.value.replace(/^['"]|['"]$/g, ""));
				if (word && [
					"ascii",
					"hAnsi",
					"eastAsia",
					"cs"
				].includes(attribute.local) || drawing && attribute.local === "typeface" || sheet && attribute.local === "val") partFamilies.push(attribute.value);
			}
		});
		parser.on("text", (text) => {
			for (const char of text) if (!/\s/u.test(char)) partPoints.add(codePointOf(char));
		});
		const encoding = data[0] === 255 && data[1] === 254 ? "utf-16le" : data[0] === 254 && data[1] === 255 ? "utf-16be" : "utf-8";
		try {
			parser.write(new TextDecoder(encoding).decode(data)).close();
		} catch {
			continue;
		}
		for (const declared of partFamilies) for (const family of declared.split(";").map((value) => value.trim()).filter((value) => value && !/^\+(?:mj|mn)-(?:lt|ea|cs)$/.test(value))) families.set(normalize(family), family);
		for (const point of partPoints) codePoints.add(point);
	}
	return {
		families,
		codePoints: [...codePoints]
	};
}
//#endregion
//#region lib/types/document.js
/** Select bounded OOXML inspection or a legacy Office compound-file import. */
/** Input suffixes accepted by the public converter. */
const DOCUMENT_EXTENSIONS = [
	"doc",
	"docx",
	"odt",
	"xls",
	"xlsx",
	"ods",
	"ppt",
	"pptx",
	"odp"
];
const COMPOUND_SIGNATURE = [
	208,
	207,
	17,
	224,
	161,
	177,
	26,
	225
];
/**
* Inspect the input container before invoking LibreOffice's document importer.
* Compound-file streams and legacy font tables are interpreted by LibreOffice;
* they do not supply the API's OOXML font diagnostics.
* @param bytes - Source bytes already bounded by maxInputBytes.
* @param extension - Lowercase source suffix.
* @param limits - Limits applied to ZIP-based document contents.
* @returns OOXML font metadata, or empty diagnostics for a binary document.
*/
function inspectDocument(bytes, extension, limits) {
	if (!DOCUMENT_EXTENSIONS.includes(extension)) throw new ConversionError("unsupported-format", `Input extension must be ${DOCUMENT_EXTENSIONS.join(", ")}.`);
	if ([
		"docx",
		"xlsx",
		"pptx",
		"odt",
		"ods",
		"odp"
	].includes(extension)) return inspectDocument$1(bytes, extension, limits);
	if (bytes.length < 512 || !COMPOUND_SIGNATURE.every((value, index) => bytes[index] === value)) throw new ConversionError("invalid-document", "Legacy Office input must contain an OLE compound document.");
	const header = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const version = header.getUint16(26, true);
	const sectorShift = header.getUint16(30, true);
	if (header.getUint16(28, true) !== 65534 || header.getUint16(32, true) !== 6 || !(version === 3 && sectorShift === 9 || version === 4 && sectorShift === 12) || bytes.length < 2 ** sectorShift * 2 || bytes.length % 2 ** sectorShift !== 0) throw new ConversionError("invalid-document", "Legacy Office input has an invalid or truncated compound-file header.");
	return {
		families: /* @__PURE__ */ new Map(),
		codePoints: []
	};
}
//#endregion
//#region lib/types/font-loader.js
/** Conversion-local font imports backed by a factory-lifetime match cache. */
const faceKey = (face) => `${face.path}\0${face.faceIndex}`;
const requestKey = ({ codePoints: _codePoints, ...request }) => JSON.stringify(request);
/** Build one operation's loader over a factory-owned immutable font snapshot. */
function createFontLoader(options, document, install, faces, cache = []) {
	const catalog = new SystemFontCatalog({
		faces,
		fallbackFamilies: options.fontFallbacks
	});
	const byFace = new Map(faces.map((face) => [faceKey(face), face]));
	const matches = /* @__PURE__ */ new Map();
	for (const entry of cache.slice(-options.maxFontResolutionEntries)) matches.set(entry.key, {
		...entry,
		codePoints: [...entry.codePoints],
		faces: entry.faces.map((face) => ({ ...face }))
	});
	const loaded = /* @__PURE__ */ new Map();
	const resolved = /* @__PURE__ */ new Map();
	const missing = /* @__PURE__ */ new Map();
	const substitutions = /* @__PURE__ */ new Map();
	const signal = new AbortController().signal;
	let bytes = 0;
	function retain(entry) {
		matches.delete(entry.key);
		matches.set(entry.key, entry);
		while (matches.size > options.maxFontResolutionEntries) matches.delete(matches.keys().next().value);
	}
	function cachedMatch(request) {
		const key = requestKey(request);
		const points = [...new Set(request.codePoints)].sort((left, right) => left - right);
		const prior = matches.get(key);
		if (prior && (points.length === 0 && prior.emptyRequest || points.every((point) => prior.codePoints.includes(point)))) {
			retain(prior);
			return {
				fonts: prior.faces.map((reference) => byFace.get(faceKey(reference))).filter((face) => face !== void 0),
				...prior.missingFamily === void 0 ? {} : { missingFamily: prior.missingFamily }
			};
		}
		const unknown = prior === void 0 ? points : points.filter((point) => !prior.codePoints.includes(point));
		const current = catalog.match({
			...request,
			codePoints: points.length === 0 ? [] : unknown
		}, signal);
		const references = new Map((prior?.faces ?? []).map((face) => [faceKey(face), face]));
		for (const face of current.fonts) references.set(faceKey(face), {
			path: face.path,
			faceIndex: face.faceIndex
		});
		const missingFamily = prior?.missingFamily ?? current.missingFamily;
		const entry = {
			key,
			codePoints: [.../* @__PURE__ */ new Set([...prior?.codePoints ?? [], ...points])].sort((left, right) => left - right),
			emptyRequest: prior?.emptyRequest === true || points.length === 0,
			faces: [...references.values()],
			...missingFamily === void 0 ? {} : { missingFamily }
		};
		retain(entry);
		return {
			fonts: entry.faces.map((reference) => byFace.get(faceKey(reference))).filter((face) => face !== void 0),
			...entry.missingFamily === void 0 ? {} : { missingFamily: entry.missingFamily }
		};
	}
	return {
		get missingFonts() {
			return [...missing.values()];
		},
		get substitutions() {
			return [...substitutions.values()];
		},
		get files() {
			return [...loaded.values()];
		},
		get cacheEntries() {
			return [...matches.values()];
		},
		resolve(request) {
			const key = JSON.stringify(request);
			const cached = resolved.get(key);
			if (cached) return cached;
			const match = cachedMatch(request);
			if (match.missingFamily && document.families.has(normalize(match.missingFamily))) {
				const family = normalize(match.missingFamily);
				missing.set(family, match.missingFamily);
				if (match.fonts[0]) substitutions.set(family, {
					family: match.missingFamily,
					substitute: match.fonts[0].family
				});
			}
			const paths = match.fonts.map((face) => {
				const installed = loaded.get(face.path);
				if (installed !== void 0) return installed;
				if (bytes + face.size > options.maxLoadedFontBytes) throw new Error("Imported fonts exceed maxLoadedFontBytes.");
				const path = install(`${loaded.size}${extname(face.path)}`, readFont(face));
				bytes += face.size;
				loaded.set(face.path, path);
				return path;
			});
			resolved.set(key, paths);
			return paths;
		}
	};
}
/** Supply native imports and seed WASM's first usable default font. */
function preloadFonts(loader, options, document, native = false) {
	const families = [
		...options.initialFontFamilies,
		...native ? [...document.families.values()] : [],
		"sans-serif"
	];
	for (const family of families) loader.resolve({
		family,
		style: "",
		weight: 5,
		italic: 0,
		width: 5,
		pitch: 0,
		language: "",
		codePoints: native ? document.codePoints : []
	});
}
/** Fontconfig XML restricts WASM discovery to imported originals in MEMFS. */
function memoryFontConfig(families, requested = []) {
	const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
	return `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>/dsh-fonts</dir><cachedir>/dsh/font-cache</cachedir>${[...new Map([...families.flatMap((group) => group.slice(0, 1)), ...requested].map((name) => [normalize(name), name])).values()].map((name) => {
		const alternatives = fontFamilyPriority([name], families).filter((family) => normalize(family) !== normalize(name));
		return `<alias><family>${escape(name)}</family><accept>${alternatives.map((family) => `<family>${escape(family)}</family>`).join("")}</accept></alias>`;
	}).join("")}</fontconfig>`;
}
//#endregion
//#region lib/types/font-full.js
/** Whole fonts for engines such as PDFium that perform their own glyph mapping. */
function fontFileFormat(bytes) {
	const magic = new TextDecoder().decode(bytes.subarray(0, 4));
	if (magic === "ttcf") return "ttc";
	if (magic === "OTTO") return "otf";
	if (magic === "true" || bytes[0] === 0 && bytes[1] === 1 && bytes[2] === 0 && bytes[3] === 0) return "ttf";
	throw new Error("The full font asset is not an sfnt font or collection.");
}
/** Keep full names, encoding tables and glyphs. Apple dfont containers expose one complete sfnt resource. */
function fullFontFile(face) {
	const original = readFont(face);
	const sourceHash = createHash("sha256").update(original).digest("hex");
	let bytes = original;
	/* v8 ignore next -- Apple dfont resource extraction is exercised by matching-host font qualification. */
	if (extname(face.path).toLowerCase() === ".dfont") bytes = indexedFace(create(original), face).stream.buffer;
	return {
		bytes,
		sourceHash,
		format: fontFileFormat(bytes)
	};
}
/** Mount a fixed bounded set before PDFium performs its first installed-font enumeration. */
function preloadPdfFonts(options, faces, install) {
	const catalog = new SystemFontCatalog({
		faces,
		fallbackFamilies: options.fontFallbacks
	});
	const files = /* @__PURE__ */ new Set();
	const assets = /* @__PURE__ */ new Set();
	let total = 0;
	const families = [.../* @__PURE__ */ new Set([
		...options.initialFontFamilies,
		...options.fontFallbacks.flat(),
		"sans-serif",
		"serif",
		"monospace"
	])];
	for (const family of families) {
		const result = catalog.match({
			family,
			style: "",
			weight: 5,
			italic: 0,
			width: 5,
			pitch: 0,
			language: "",
			codePoints: []
		}, new AbortController().signal);
		for (const face of result.fonts) {
			/* v8 ignore next -- Apple dfont face identity is covered by matching-host font qualification. */
			const physical = `${face.path}#${extname(face.path).toLowerCase() === ".dfont" ? face.faceIndex : ""}`;
			if (files.has(physical)) continue;
			files.add(physical);
			const { bytes, format } = fullFontFile(face);
			const id = createHash("sha256").update(bytes).digest("hex");
			if (assets.has(id)) continue;
			if (total + bytes.length > options.maxLoadedFontBytes) throw new Error("PDF full-font preload exceeds maxLoadedFontBytes.");
			install(`${id}.${format}`, bytes);
			total += bytes.length;
			assets.add(id);
		}
	}
}
//#endregion
//#region lib/types/profile.js
/** Private headless profile used by both native and WASM conversions. */
/**
* CSV selection is checked by the engine wrapper before saving; suppress the interactive warning.
* @param fontNodes - Escaped VCL font-substitution nodes, or an empty string for WASM.
* @returns The per-operation registry XML; macro execution is independently disabled at load.
*/
function profileXml(fontNodes = "") {
	return `<?xml version="1.0" encoding="UTF-8"?><oor:items xmlns:oor="http://openoffice.org/2001/registry"><item oor:path="/org.openoffice.Office.Calc/Input"><prop oor:name="WarnActiveSheet" oor:op="fuse"><value>false</value></prop></item><item oor:path="/org.openoffice.VCL/FontSubstitutions/en">${fontNodes}</item></oor:items>\n`;
}
//#endregion
//#region lib/types/operations.js
/**
* Reject an engine output with an incorrect container signature.
* @param bytes - Complete bounded output.
* @param format - Requested output suffix.
*/
function validateOutput(bytes, format) {
	if (format === "pdf" && new TextDecoder().decode(bytes.subarray(0, 5)) !== "%PDF-") throw new ConversionError("invalid-output", "LibreOffice did not produce a PDF.");
	if ([
		"docx",
		"xlsx",
		"pptx",
		"odt",
		"ods",
		"odp"
	].includes(format) && (bytes[0] !== 80 || bytes[1] !== 75 || bytes[2] !== 3 || bytes[3] !== 4)) throw new ConversionError("invalid-output", `LibreOffice did not produce a ${format} archive.`);
}
//#endregion
//#region lib/types/wasm.js
/** Node-only LibreOffice module execution; the owner terminates this worker on cancellation. */
const require = createRequire(import.meta.url);
function engineError(module, office) {
	const pointer = module.ccall("dsh_lok_error", "number", ["number"], [office]);
	if (!pointer) return /* @__PURE__ */ new Error("LibreOffice WASM could not convert the document.");
	try {
		return new Error(module.UTF8ToString(pointer));
	} finally {
		module.ccall("free", null, ["number"], [pointer]);
	}
}
/**
* @param loader - Loader the module's pre-run hook installs.
* @returns the initialized font loader.
* @throws when the module resolved without running its pre-run hook.
*/
function requiredFontLoader(loader) {
	if (loader === void 0) throw new Error("LibreOffice initialized without its font loader.");
	return loader;
}
/** A single module loader and owned session lifecycle for export and direct raster operations. */
async function withWasmSession(request, use) {
	const { engine, bytes, extension, options, document: metadata, faces } = request;
	const pdf = extension === "pdf";
	let idleReady = false;
	const factory = require(engine.loader);
	const raw = readFileSync(engine.data);
	const data = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
	let module;
	let office = 0;
	let document = 0;
	let fontLoader;
	let fatal = false;
	let failure;
	try {
		module = await factory({
			dshOnCallback(type, payload) {
				if (type !== 16) return;
				try {
					const result = JSON.parse(payload);
					if (result.commandName === ".uno:ReportWhenIdle" && result.idleID === "node-raster") idleReady = true;
				} catch {}
			},
			noInitialRun: true,
			mainScriptUrlOrBlob: engine.loader,
			locateFile(name) {
				const file = basename(name);
				if (file === "soffice.wasm") return engine.wasm;
				for (const asset of [
					engine.loader,
					engine.data,
					engine.wasm,
					engine.metadata
				]) if (basename(asset) === file) return asset;
				throw new Error(`LibreOffice requested an unlisted asset: ${file}`);
			},
			getPreloadedPackage: () => data,
			dshResolveSystemFonts(request) {
				if (!fontLoader) throw new Error("LibreOffice requested fonts before initializing MEMFS.");
				return fontLoader.resolve(request);
			},
			preRun: [(loadedModule) => {
				for (const path of [
					"/dsh/profile/user",
					"/dsh/font-cache",
					"/dsh-fonts"
				]) loadedModule.FS.mkdirTree(path);
				loadedModule.FS.writeFile("/dsh/profile/user/registrymodifications.xcu", new TextEncoder().encode(profileXml()));
				loadedModule.FS.writeFile("/dsh/fonts.conf", new TextEncoder().encode(memoryFontConfig(options.fontFallbacks, metadata.families.values())));
				Object.assign(loadedModule.ENV, {
					HOME: "/dsh/profile",
					TMPDIR: "/tmp",
					FONTCONFIG_FILE: "/dsh/fonts.conf",
					LOK_HOST_ALLOWLIST: "^$"
				});
				fontLoader = createFontLoader(options, metadata, (name, bytes) => {
					const path = `/dsh-fonts/${name}`;
					loadedModule.FS.writeFile(path, bytes);
					return path;
				}, faces, request.fontCache);
				if (pdf) {
					loadedModule.FS.mkdirTree("/usr/share/fonts/dsh-pdfium");
					preloadPdfFonts(options, faces, (name, bytes) => loadedModule.FS.writeFile(`/usr/share/fonts/dsh-pdfium/${name}`, bytes));
				} else preloadFonts(fontLoader, options, metadata);
			}],
			onAbort() {
				fatal = true;
			},
			print() {},
			printErr() {}
		});
		const instance = module;
		const input = `/dsh/document.${extension}`;
		if (!pdf) instance.FS.writeFile(input, bytes);
		if (pdf) {
			const pointer = instance.ccall("malloc", "number", ["number"], [bytes.length]);
			if (!pointer) throw engineError(instance, 0);
			try {
				new Uint8Array(instance.HEAPU32.buffer).set(bytes, pointer);
				document = instance.ccall("dsh_pdf_open", "number", [
					"number",
					"number",
					"string"
				], [
					pointer,
					bytes.length,
					""
				]);
			} finally {
				instance.ccall("free", null, ["number"], [pointer]);
			}
			if (!document) throw engineError(instance, 0);
		} else {
			office = instance.ccall("dsh_lok_initialize", "number", ["string", "string"], [engine.programDirectory, "file:///dsh/profile"]);
			if (!office) throw engineError(instance, 0);
			document = instance.ccall("dsh_lok_document_load", "number", [
				"number",
				"string",
				"string"
			], [
				office,
				`file://${input}`,
				"Batch=true,EnableMacrosExecution=false"
			]);
			if (!document) throw engineError(instance, office);
		}
		const result = await use({
			module: instance,
			office,
			document,
			pdf,
			get missingFonts() {
				return requiredFontLoader(fontLoader).missingFonts;
			},
			async idle() {
				if (pdf) return;
				idleReady = false;
				if (!instance.ccall("dsh_lok_document_command", "number", [
					"number",
					"string",
					"string"
				], [
					document,
					".uno:ReportWhenIdle",
					"{\"idleID\":{\"type\":\"string\",\"value\":\"node-raster\"}}"
				])) throw engineError(instance, office);
				const deadline = performance.now() + options.timeoutMs;
				while (!idleReady) {
					for (let i = 0; i < 8 && !idleReady; i++) {
						const pending = instance.ccall("dsh_lok_pump", "number", [], []);
						if (pending < 0) throw engineError(instance, office);
						if (!pending) break;
					}
					if (performance.now() > deadline) throw new ConversionError("timeout", "LibreOffice did not reach its raster idle barrier.");
					if (!idleReady) await new Promise((resolve) => setTimeout(resolve, 0));
				}
			}
		});
		request.onFontCache?.(requiredFontLoader(fontLoader).cacheEntries);
		return result;
	} catch (error) {
		fatal ||= error instanceof WebAssembly.RuntimeError;
		failure = error;
		throw error;
	} finally {
		const errors = [];
		if (module && !fatal) {
			if (document) try {
				if (!module.ccall(pdf ? "dsh_pdf_destroy" : "dsh_lok_document_destroy", "number", ["number"], [document])) throw engineError(module, office);
			} catch (error) {
				errors.push(error);
				fatal ||= error instanceof WebAssembly.RuntimeError;
			}
			if (office && !fatal) try {
				if (!module.ccall("dsh_lok_destroy", "number", ["number"], [office])) throw engineError(module, 0);
			} catch (error) {
				errors.push(error);
			}
		}
		if (module) try {
			module.PThread.terminateAllThreads();
		} catch (error) {
			errors.push(error);
		}
		if (errors.length) throw new AggregateError(failure ? [failure, ...errors] : errors, "LibreOffice WASM cleanup failed.");
	}
}
/** Convert bounded source bytes; return owned bytes only after engine teardown. */
async function convertWithWasm(request) {
	return withWasmSession(request, (session) => {
		const { module, office, document } = session;
		const { options } = request;
		const operation = request.operation ?? {
			format: "pdf",
			recalculate: false
		};
		const output = `/dsh/output.${operation.format}`;
		const filterOptions = operation.format === "pdf" ? JSON.stringify({
			ExportBookmarks: {
				type: "boolean",
				value: "true"
			},
			ReduceImageResolution: {
				type: "boolean",
				value: "true"
			},
			MaxImageResolution: {
				type: "long",
				value: String(options.maxImageResolution)
			}
		}) : operation.format === "txt" ? "UTF8,LF" : "";
		if (!module.ccall("dsh_lok_document_export", "number", [
			"number",
			"number",
			"string",
			"string",
			"string",
			"number",
			"string"
		], [
			office,
			document,
			`file://${output}`,
			operation.format,
			filterOptions,
			Number(operation.recalculate),
			operation.sheet ?? ""
		])) throw engineError(module, office);
		if (!module.FS.analyzePath(output).exists) throw new ConversionError("invalid-output", "LibreOffice did not create its output.");
		const status = module.FS.stat(output);
		if (!module.FS.isFile(status.mode)) throw new ConversionError("invalid-output", "Generated output is not a regular file.");
		if (status.size > options.maxOutputBytes) throw new ConversionError("output-too-large", "Generated output exceeds its output byte limit.");
		const result = module.FS.readFile(output);
		validateOutput(result, operation.format);
		return {
			output: result,
			missingFonts: session.missingFonts
		};
	});
}
/** Undo Calc's RTL transport mirroring so saved pixels contain readable text and right-to-left columns. */
function unmirrorRtlTile({ width, height, rgba }) {
	for (let y = 0; y < height; y++) for (let x = 0; x < Math.floor(width / 2); x++) {
		const left = (y * width + x) * 4, right = (y * width + width - 1 - x) * 4;
		for (let channel = 0; channel < 4; channel++) {
			const value = rgba[left + channel];
			rgba[left + channel] = rgba[right + channel];
			rgba[right + channel] = value;
		}
	}
}
/** Split a region on its output-pixel grid, bounding the plan before allocating it. */
function splitRasterRectangle(rectangle, scale, limits) {
	const { x, y, width, height } = rectangle;
	const { maxPixels, maxDimension, maxTiles } = limits;
	if (![
		x,
		y,
		width,
		height,
		scale
	].every(Number.isFinite) || x < 0 || y < 0 || width <= 0 || height <= 0 || scale <= 0 || !Number.isSafeInteger(maxPixels) || maxPixels < 1 || maxPixels > 16777216 || !Number.isSafeInteger(maxDimension) || maxDimension < 1 || maxDimension > 16777216 || !Number.isSafeInteger(maxTiles) || maxTiles < 0) throw new TypeError("Invalid raster splitting limits or rectangle.");
	const pixelWidth = Math.ceil(width * scale - 1e-9), pixelHeight = Math.ceil(height * scale - 1e-9);
	if (![pixelWidth, pixelHeight].every((value) => Number.isSafeInteger(value) && value > 0)) throw new RangeError("Raster dimensions exceed the coordinate range.");
	let tileWidth = Math.min(pixelWidth, maxDimension), tileHeight = Math.min(pixelHeight, maxDimension);
	if (tileWidth * tileHeight > maxPixels) {
		const side = Math.floor(Math.sqrt(maxPixels));
		if (tileWidth <= side) tileHeight = Math.floor(maxPixels / tileWidth);
		else if (tileHeight <= side) tileWidth = Math.floor(maxPixels / tileHeight);
		else {
			tileWidth = side;
			tileHeight = Math.min(tileHeight, Math.floor(maxPixels / tileWidth));
		}
	}
	const columns = Math.ceil(pixelWidth / tileWidth), rows = Math.ceil(pixelHeight / tileHeight);
	if (columns * rows > maxTiles) throw new RangeError("Raster batch exceeds maxPages after worksheet splitting.");
	const result = [];
	for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
		const left = column * tileWidth / scale, top = row * tileHeight / scale;
		result.push({
			x: x + left,
			y: y + top,
			width: Math.min(tileWidth / scale, width - left),
			height: Math.min(tileHeight / scale, height - top)
		});
	}
	return result;
}
/** Writer's zero-area parity placeholders have no visible page. Offsets stay in twips. */
function writerPages(rectangles) {
	const pages = rectangles.split(";").filter((value) => value.trim()).flatMap((rectangle) => {
		const fields = rectangle.split(",").map((value) => Number(value.trim()));
		const [x, y, width, height] = fields;
		if (fields.length !== 4 || x === void 0 || y === void 0 || width === void 0 || height === void 0 || fields.some((value) => !Number.isSafeInteger(value) || value < 0 || value > 2147483647) || width === 0 !== (height === 0) || x + width > 2147483647 || y + height > 2147483647) throw new Error("LibreOffice returned invalid page rectangles.");
		return width === 0 ? [] : [{
			x,
			y,
			width: width / 15,
			height: height / 15,
			part: -1
		}];
	});
	if (pages.length === 0) throw new Error("LibreOffice returned no document pages.");
	return pages;
}
/** Validate coordinates before allocation or wasm32 integer conversion. */
function tileDimensions(request, pages) {
	const page = pages[request.pageIndex];
	if (!Number.isSafeInteger(request.pageIndex) || !page || ![
		request.x,
		request.y,
		request.width,
		request.height,
		request.scale
	].every(Number.isFinite) || request.x < 0 || request.y < 0 || request.width <= 0 || request.height <= 0 || request.scale <= 0 || request.x + request.width > page.width + .001 || request.y + request.height > page.height + .001) throw new Error("Tile rectangle lies outside its page.");
	const width = Math.ceil(request.width * request.scale - 1e-9);
	const height = Math.ceil(request.height * request.scale - 1e-9);
	if (width <= 0 || height <= 0 || !Number.isSafeInteger(width * height) || width * height > 16777216) throw new Error("Tile exceeds the 16 megapixel allocation limit.");
	const twips = [
		page.x + Math.round(request.x * 15),
		page.y + Math.round(request.y * 15),
		Math.round(request.width * 15),
		Math.round(request.height * 15)
	];
	if (twips.some((value) => !Number.isSafeInteger(value) || value < 0 || value > 2147483647) || twips[0] + twips[2] > 2147483647 || twips[1] + twips[3] > 2147483647) throw new Error("Tile coordinates exceed the wasm32 range.");
	return {
		page,
		width,
		height
	};
}
/** Cairo/LO channels are premultiplied; PNG and ImageData require straight RGBA. */
function rgbaPixels(source, tileMode) {
	if (tileMode !== 0 && tileMode !== 1 || source.length % 4 !== 0) throw new Error("LibreOffice returned an unsupported tile pixel format.");
	const result = new Uint8ClampedArray(source.length);
	for (let index = 0; index < source.length; index += 4) {
		const alpha = source[index + 3];
		const multiplier = alpha === 0 ? 0 : 255 / alpha;
		result[index] = source[index + (tileMode === 1 ? 2 : 0)] * multiplier;
		result[index + 1] = source[index + 1] * multiplier;
		result[index + 2] = source[index + (tileMode === 1 ? 0 : 2)] * multiplier;
		result[index + 3] = alpha;
	}
	return result;
}
//#endregion
//#region lib/types/engine-rendering.js
/** Shared bounded raster allocations for browser and Node engine owners. */
function numericCall(module, name, args) {
	return module.ccall(name, "number", args.map(() => "number"), args);
}
/** Copy/free one engine-owned UTF-8 return value. */
function engineString(module, name, types, args, failure) {
	const pointer = module.ccall(name, "number", types, args);
	if (!pointer) throw failure();
	try {
		return module.UTF8ToString(pointer);
	} finally {
		numericCall(module, "free", [pointer]);
	}
}
/** Paint into a temporary allocation; copy pixels before free or another engine call. */
function renderRegion(module, document, request, pages, failure, pdf = false) {
	const call = (name, args) => numericCall(module, name, args);
	const { page, width, height } = tileDimensions(request, pages);
	const size = width * height * 4;
	const pointer = call("malloc", [size]);
	if (!pointer) throw failure();
	try {
		new Uint8Array(module.HEAPU32.buffer, pointer, size).fill(0);
		const position = [
			page.x + Math.round(request.x * 15),
			page.y + Math.round(request.y * 15),
			Math.max(1, Math.round(request.width * 15)),
			Math.max(1, Math.round(request.height * 15))
		];
		if (!call(pdf ? "dsh_pdf_paint" : "dsh_lok_document_paint", [
			document,
			pointer,
			page.part,
			width,
			height,
			...position
		])) throw failure();
		const source = new Uint8Array(module.HEAPU32.buffer, pointer, size);
		return {
			width,
			height,
			rgba: pdf ? new Uint8ClampedArray(source) : rgbaPixels(source, call("dsh_lok_document_tile_mode", [document]))
		};
	} finally {
		call("free", [pointer]);
	}
}
/** PDF page dimensions use the same twips ABI, with an immutable PDF page index as part. */
function pdfPages(module, pdf, failure) {
	const count = numericCall(module, "dsh_pdf_page_count", [pdf]);
	if (!Number.isSafeInteger(count) || count < 1 || count > 1e5) throw failure();
	const pointer = numericCall(module, "malloc", [8]);
	if (!pointer) throw failure();
	try {
		return Array.from({ length: count }, (_, part) => {
			if (!numericCall(module, "dsh_pdf_page_size", [
				pdf,
				part,
				pointer,
				pointer + 4
			])) throw failure();
			const width = module.HEAPU32[pointer / 4];
			const height = module.HEAPU32[pointer / 4 + 1];
			if (width < 1 || height < 1 || width > 2147483647 || height > 2147483647) throw failure();
			return {
				part,
				x: 0,
				y: 0,
				width: width / 15,
				height: height / 15
			};
		});
	} finally {
		numericCall(module, "free", [pointer]);
	}
}
//#endregion
//#region lib/types/sheet-geometry.js
const MAX_COLUMN = 16383;
const MAX_ROW = 1048575;
function column(index) {
	let name = "";
	for (let value = index + 1; value > 0; value = Math.floor((value - 1) / 26)) name = String.fromCharCode(65 + (value - 1) % 26) + name;
	return name;
}
function rangeName(range) {
	return `${column(range.firstColumn)}${range.firstRow + 1}:${column(range.lastColumn)}${range.lastRow + 1}`;
}
function parseCellRange(value) {
	const match = /^\$?([A-Z]{1,3})\$?([1-9]\d{0,6})(?::\$?([A-Z]{1,3})\$?([1-9]\d{0,6}))?$/i.exec(value);
	if (!match) throw new TypeError("range must be an A1 cell or rectangle without a sheet prefix.");
	const col = (name) => [...name.toUpperCase()].reduce((sum, c) => sum * 26 + c.charCodeAt(0) - 64, 0) - 1;
	const firstColumn = col(match[1]);
	const firstRow = Number(match[2]) - 1;
	const lastColumn = col(match[3] ?? match[1]);
	const lastRow = Number(match[4] ?? match[2]) - 1;
	if (lastColumn < firstColumn || lastRow < firstRow || lastColumn > MAX_COLUMN || lastRow > MAX_ROW) throw new TypeError("range exceeds Calc worksheet bounds or has reversed endpoints.");
	return {
		firstColumn,
		firstRow,
		lastColumn,
		lastRow
	};
}
function sheetPartInfo(value) {
	const info = JSON.parse(value);
	if (!info || typeof info.name !== "string" || ![0, 1].includes(info.visible) || ![0, 1].includes(info.rtllayout) || !Number.isInteger(info.lastcolumn) || !Number.isInteger(info.lastrow) || info.lastcolumn < 0 || info.lastrow < 0 || info.lastcolumn > MAX_COLUMN || info.lastrow > MAX_ROW) throw new Error("LibreOffice returned invalid worksheet data-area metadata.");
	return info;
}
/** Formatting-only cells and standalone drawings do not enlarge LibreOffice's data area. */
function dataArea(info) {
	return {
		firstColumn: 0,
		firstRow: 0,
		lastColumn: info.lastcolumn,
		lastRow: info.lastrow
	};
}
function spans(encoded, flags, maximum) {
	if (typeof encoded !== "string" || encoded.length > 33554432) throw new Error("Invalid worksheet geometry span encoding.");
	const tokens = encoded.trim().split(/\s+/);
	let previous = -1;
	let flag = 0;
	const result = tokens.map((token, i) => {
		const fields = token.split(":");
		let value;
		let end;
		if (flags && i > 0) {
			value = flag = 1 - flag;
			end = Number(fields[0]);
			if (fields.length !== 1) throw new Error("Invalid worksheet flag span.");
		} else {
			value = Number(fields[0]);
			end = Number(fields[1]);
			flag = value;
			if (fields.length !== 2) throw new Error("Invalid worksheet size span.");
		}
		if (!Number.isSafeInteger(value) || value < 0 || (flags ? value > 1 : value > 65535) || !Number.isSafeInteger(end) || end <= previous || end > maximum) throw new Error("Invalid worksheet geometry span.");
		previous = end;
		return {
			end,
			value
		};
	});
	if (previous !== maximum) throw new Error("Worksheet geometry does not cover the complete dimension.");
	return result;
}
function dimension(data, first, last, maximum, scale) {
	const sizes = spans(data?.sizes, false, maximum);
	const hidden = spans(data?.hidden, true, maximum);
	const filtered = spans(data?.filtered, true, maximum);
	let position = 0, start = 0, index = 0, si = 0, hi = 0, fi = 0;
	while (index <= last) {
		const size = sizes[si], hide = hidden[hi], filter = filtered[fi];
		const end = Math.min(size.end, hide.end, filter.end, last, index < first ? first - 1 : last);
		const pixels = hide.value || filter.value || size.value === 0 ? 0 : Math.max(1, Math.floor(size.value * scale / 15));
		if (index === first) start = position;
		position += (end - index + 1) * pixels;
		index = end + 1;
		if (index > size.end) si++;
		if (index > hide.end) hi++;
		if (index > filter.end) fi++;
	}
	return [start / scale, (position - start) / scale];
}
/** Logical columns advance from A; RTL uses the same coordinates and mirrored transport pixels. */
function sheetRangeRectangle(geometry, range, scale) {
	if (!Number.isFinite(scale) || scale <= 0 || scale > 16) throw new TypeError("Invalid worksheet raster scale.");
	const [x, width] = dimension(geometry.columns, range.firstColumn, range.lastColumn, MAX_COLUMN, scale);
	const [y, height] = dimension(geometry.rows, range.firstRow, range.lastRow, MAX_ROW, scale);
	if (width <= 0 || height <= 0) throw new Error("The selected worksheet range is entirely hidden or filtered.");
	if ([
		x,
		y,
		width,
		height,
		x + width,
		y + height
	].some((value) => !Number.isFinite(value) || value * 15 > 2147483647)) throw new Error("The selected worksheet range exceeds the supported coordinate range.");
	return {
		x,
		y,
		width,
		height
	};
}
//#endregion
//#region lib/types/image-operations.js
function selectedPages(pages, count, limit) {
	if (!Number.isSafeInteger(count) || count < 1) throw new ConversionError("invalid-document", "The document contains no renderable pages.");
	const result = pages === void 0 || pages === "all" ? Array.from({ length: Math.min(count, limit + 1) }, (_, i) => i + 1) : [...pages];
	if (result.length > limit) throw new ConversionError("output-too-large", "Selected page count exceeds maxPages; select pages or raise the limit.");
	if (result.some((page) => page > count)) throw new TypeError(`Selected page lies outside the ${count}-page document.`);
	return result;
}
//#endregion
//#region lib/types/png.js
/** Portable PNG encoding over straight RGBA; browser and Node need no native image dependency. */
const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
	for (let bit = 0; bit < 8; bit++) value = value & 1 ? 3988292384 ^ value >>> 1 : value >>> 1;
	return value >>> 0;
});
function chunk(type, bytes) {
	const output = new Uint8Array(bytes.length + 12);
	const view = new DataView(output.buffer);
	view.setUint32(0, bytes.length);
	output.set(new TextEncoder().encode(type), 4);
	output.set(bytes, 8);
	let crc = 4294967295;
	for (let i = 4; i < output.length - 4; i++) crc = crcTable[(crc ^ output[i]) & 255] ^ crc >>> 8;
	view.setUint32(output.length - 4, (crc ^ 4294967295) >>> 0);
	return output;
}
function encodePng(width, height, rgba) {
	if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1 || width * height > 16777216 || rgba.byteLength !== width * height * 4) throw new TypeError("Invalid PNG raster dimensions.");
	const header = /* @__PURE__ */ new Uint8Array(13);
	const view = new DataView(header.buffer);
	view.setUint32(0, width);
	view.setUint32(4, height);
	header[8] = 8;
	header[9] = 6;
	const scanlines = new Uint8Array(height * (width * 4 + 1));
	for (let y = 0; y < height; y++) {
		const source = y * width * 4;
		const target = y * (width * 4 + 1);
		scanlines[target] = 1;
		for (let x = 0; x < width * 4; x++) scanlines[target + 1 + x] = rgba[source + x] - (x < 4 ? 0 : rgba[source + x - 4]);
	}
	const chunks = [
		new Uint8Array([
			137,
			80,
			78,
			71,
			13,
			10,
			26,
			10
		]),
		chunk("IHDR", header),
		chunk("IDAT", zlibSync(scanlines, { level: 6 })),
		chunk("IEND", /* @__PURE__ */ new Uint8Array())
	];
	const result = new Uint8Array(chunks.reduce((sum, value) => sum + value.length, 0));
	let offset = 0;
	for (const value of chunks) {
		result.set(value, offset);
		offset += value.length;
	}
	return result;
}
//#endregion
//#region lib/types/image-renderer.js
/** One saved-file model and one bounded direct PNG batch; no Office-to-PDF intermediate. */
async function regions(session, request) {
	const { module, document, office, pdf } = session;
	const call = (name, args) => numericCall(module, name, args);
	const failure = () => engineError(module, office);
	const text = (name, args) => engineString(module, name, args.map(() => "number"), args, failure);
	const values = (command) => engineString(module, "dsh_lok_document_command_values", ["number", "string"], [document, command], failure);
	const select = (pages) => ({
		count: pages.length,
		regions: selectedPages(request.pages, pages.length, request.maxPages).map((number) => {
			const page = pages[number - 1];
			return {
				page,
				number,
				rectangle: {
					x: 0,
					y: 0,
					width: page.width,
					height: page.height
				}
			};
		})
	});
	if (pdf) return select(pdfPages(module, document, failure));
	if (!call("dsh_lok_document_initialize_rendering", [document]) || !call("dsh_lok_document_listen", [document])) throw failure();
	await session.idle();
	const type = call("dsh_lok_document_type", [document]);
	if (type !== ([
		"xls",
		"xlsx",
		"ods"
	].includes(request.extension) ? 1 : [
		"ppt",
		"pptx",
		"odp"
	].includes(request.extension) ? 2 : 0)) throw new ConversionError("invalid-document", "LibreOffice imported the input as an unexpected document type.");
	if (type === 0) return select(writerPages(text("dsh_lok_document_page_rectangles", [document])));
	const parts = call("dsh_lok_document_parts", [document]);
	if (!Number.isSafeInteger(parts) || parts < 1 || parts > 1e5) throw new ConversionError("invalid-document", "Invalid document part count.");
	if (type === 2) {
		const sizes = JSON.parse(values(".uno:AllPageSize"));
		if (!Array.isArray(sizes.parts) || sizes.parts.length !== parts) throw new ConversionError("invalid-document", "Impress returned inconsistent slide dimensions.");
		return select(sizes.parts.map(({ width, height }, part) => {
			if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1 || width > 2147483647 || height > 2147483647) throw new ConversionError("invalid-document", "Impress returned invalid slide dimensions.");
			return {
				part,
				x: 0,
				y: 0,
				width: width / 15,
				height: height / 15
			};
		}));
	}
	const sheets = Array.from({ length: parts }, (_, part) => ({
		part,
		info: sheetPartInfo(text("dsh_lok_document_part_info", [document, part]))
	}));
	const count = sheets.filter(({ info }) => info.visible).length;
	const selected = request.sheet === void 0 ? sheets.filter(({ info }) => info.visible) : sheets.filter(({ info }) => info.name === request.sheet);
	if (!selected.length) throw new ConversionError("invalid-document", "The exact worksheet name does not exist or the workbook has no visible sheets.");
	if (selected.length > request.maxPages) throw new ConversionError("output-too-large", "Selected worksheet count exceeds maxPages; select a sheet or raise the limit.");
	const result = [];
	const scale = request.dpi / 96;
	for (const { part, info } of selected) {
		if (!call("dsh_lok_document_part", [document, part])) throw failure();
		await session.idle();
		const range = request.range === void 0 ? dataArea(info) : parseCellRange(request.range);
		const rectangle = sheetRangeRectangle(JSON.parse(values(".uno:SheetGeometryData")), range, scale);
		const page = {
			x: 0,
			y: 0,
			width: rectangle.x + rectangle.width,
			height: rectangle.y + rectangle.height,
			part
		};
		result.push({
			page,
			rectangle,
			sheet: info.name,
			range: rangeName(range),
			rtl: Boolean(info.rtllayout)
		});
	}
	return {
		count,
		regions: result
	};
}
async function renderImagesWithWasm(request) {
	return withWasmSession(request, async (session) => {
		const { operation, options } = request;
		const { count, regions: sourceRegions } = await regions(session, operation);
		const scale = operation.dpi / 96;
		const selected = [];
		for (const region of sourceRegions) {
			if (region.sheet === void 0) {
				selected.push(region);
				continue;
			}
			let rectangles;
			try {
				rectangles = splitRasterRectangle(region.rectangle, scale, {
					maxPixels: operation.maxPixels,
					maxDimension: operation.maxDimension,
					maxTiles: operation.maxPages - selected.length
				});
			} catch (cause) {
				throw new ConversionError("output-too-large", String(cause), { cause });
			}
			selected.push(...rectangles.map((rectangle) => ({
				...region,
				rectangle
			})));
		}
		for (const { page, rectangle } of selected) {
			const pixelWidth = Math.ceil(rectangle.width * scale - 1e-9), pixelHeight = Math.ceil(rectangle.height * scale - 1e-9);
			if (pixelWidth > operation.maxDimension || pixelHeight > operation.maxDimension || pixelWidth * pixelHeight > operation.maxPixels) throw new ConversionError("output-too-large", "Selected page exceeds maxPixels or maxDimension; reduce DPI or raise the image limits.");
			tileDimensions({
				pageIndex: 0,
				...rectangle,
				scale
			}, [page]);
		}
		const images = [];
		let total = 0;
		for (const region of selected) {
			if (region.sheet !== void 0) {
				const call = (name, args) => numericCall(session.module, name, args);
				if (!call("dsh_lok_document_part", [session.document, region.page.part])) throw engineError(session.module, session.office);
				const { x, y, width, height } = region.rectangle;
				const command = `.uno:ViewRowColumnHeaders?x=${Math.round(x * 15)}&y=${Math.round(y * 15)}&width=${Math.round(width * 15)}&height=${Math.round(height * 15)}`;
				if (!call("dsh_lok_document_viewport", [
					session.document,
					Math.round(scale * 1440),
					21600,
					Math.round(x * 15),
					Math.round(y * 15),
					Math.round(width * 15),
					Math.round(height * 15)
				])) throw engineError(session.module, session.office);
				engineString(session.module, "dsh_lok_document_command_values", ["number", "string"], [session.document, command], () => engineError(session.module, session.office));
				await session.idle();
			}
			const tile = renderRegion(session.module, session.document, {
				pageIndex: 0,
				...region.rectangle,
				scale
			}, [region.page], () => engineError(session.module, session.office), session.pdf);
			if (region.rtl) unmirrorRtlTile(tile);
			const png = encodePng(tile.width, tile.height, tile.rgba);
			total += png.length;
			if (total > options.maxOutputBytes) throw new ConversionError("output-too-large", "PNG batch exceeds maxOutputBytes.");
			const index = images.length + 1;
			const path = join(operation.outputDir, `page-${String(index).padStart(4, "0")}.png`);
			writeFileSync(path, png, {
				flag: "wx",
				mode: 384
			});
			images.push({
				index,
				...region.number === void 0 ? {} : { page: region.number },
				...region.sheet === void 0 ? {} : {
					sheet: region.sheet,
					range: region.range,
					rtl: region.rtl
				},
				path,
				width: tile.width,
				height: tile.height,
				rectangle: region.rectangle,
				byteLength: png.length
			});
		}
		return {
			schemaVersion: 1,
			backend: "wasm",
			rasterEngine: session.pdf ? "pdfium" : "libreoffice",
			source: "saved",
			inputPath: operation.inputPath,
			sourceSha256: createHash("sha256").update(request.bytes).digest("hex"),
			dpi: operation.dpi,
			pageCount: count,
			images,
			missingFonts: session.missingFonts
		};
	});
}
//#endregion
//#region lib/types/worker.js
/** Cancellable CPU work and WASM conversion run outside the Node event loop. */
/**
* @param port - The parent port, present inside a Worker thread.
* @returns the connected parent port.
* @throws when this entry is loaded outside a Worker.
*/
function requireParentPort(port) {
	if (port === null) throw new Error("The LibreOffice conversion worker requires a parent port.");
	return port;
}
const port = requireParentPort(parentPort);
try {
	const { inputPath, extension, operation, options, engine, scratch, fontFaces, fontCache } = workerData;
	const bytes = readFileSync(inputPath);
	const images = "kind" in operation && operation.kind === "images";
	if (images && extension === "pdf" && new TextDecoder().decode(bytes.subarray(0, 5)) !== "%PDF-") throw new ConversionError("invalid-document", "Input does not contain a PDF header.");
	const document = images && extension === "pdf" ? {
		families: /* @__PURE__ */ new Map(),
		codePoints: []
	} : inspectDocument(bytes, extension, options);
	if (engine.backend === "wasm") {
		if (fontFaces.length === 0 && extension !== "pdf") throw new ConversionError("unavailable", "No usable fonts were found. Install fonts or configure fontDirectories before converting documents.");
		if (images) {
			let cacheEntries = [];
			const result = await renderImagesWithWasm({
				engine,
				bytes,
				extension,
				operation,
				options,
				document,
				faces: fontFaces,
				...fontCache === void 0 ? {} : { fontCache },
				onFontCache: (entries) => {
					cacheEntries = entries;
				}
			});
			port.postMessage({
				kind: "font-cache",
				entries: cacheEntries
			});
			port.postMessage({
				ok: true,
				images: result
			});
		} else {
			const result = await convertWithWasm({
				engine,
				bytes,
				extension,
				operation,
				options,
				document,
				faces: fontFaces,
				...fontCache === void 0 ? {} : { fontCache },
				onFontCache: (entries) => port.postMessage({
					kind: "font-cache",
					entries
				})
			});
			port.postMessage({
				ok: true,
				...result
			}, [result.output.buffer]);
		}
	} else {
		const directory = join(scratch, "fonts");
		mkdirSync(directory, { mode: 448 });
		const fonts = createFontLoader(options, document, (name, data) => {
			const path = join(directory, name);
			writeFileSync(path, data, {
				flag: "wx",
				mode: 384
			});
			return path;
		}, fontFaces, fontCache);
		preloadFonts(fonts, options, document, true);
		port.postMessage({
			kind: "font-cache",
			entries: fonts.cacheEntries
		});
		port.postMessage({
			ok: true,
			fonts: fonts.files,
			substitutions: fonts.substitutions,
			missingFonts: fonts.missingFonts
		});
	}
} catch (error) {
	port.postMessage({
		ok: false,
		code: failureCode(error),
		error: error instanceof Error ? error.message : String(error),
		stack: error instanceof Error ? error.stack : void 0
	});
}
//#endregion
export {};
