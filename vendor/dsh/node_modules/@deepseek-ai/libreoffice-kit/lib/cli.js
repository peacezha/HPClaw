#!/usr/bin/env node
import { createRequire } from "node:module";
import { parseArgs } from "node:util";
import { dirname, extname, isAbsolute, join, posix, relative, resolve, sep, win32 } from "node:path";
import { closeSync, constants, createWriteStream, lstatSync, readSync, readdirSync } from "node:fs";
import { copyFile, lstat, mkdir, mkdtemp, open, readFile, rm, stat, symlink, unlink, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { Worker } from "node:worker_threads";
import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import { createHash, randomUUID } from "node:crypto";
import { createInterface } from "node:readline";
import { zlibSync } from "fflate";
import "fontkit";
import { fileURLToPath } from "node:url";
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
//#region lib/types/image-operations.js
/** Public direct-raster request and immutable saved-file manifest. */
const IMAGE_FORMATS = [
	"doc",
	"docx",
	"odt",
	"xls",
	"xlsx",
	"ods",
	"ppt",
	"pptx",
	"odp",
	"pdf"
];
function resolveImageRender(request) {
	if (!request || typeof request.inputPath !== "string" || typeof request.outputDir !== "string" || !isAbsolute(request.inputPath) || !isAbsolute(request.outputDir) || request.inputPath.includes("\0") || request.outputDir.includes("\0")) throw new TypeError("inputPath and outputDir must be absolute filesystem paths.");
	const inputPath = resolve(request.inputPath), outputDir = resolve(request.outputDir);
	const within = relative(outputDir, inputPath);
	if (!within || !within.startsWith("..") && !isAbsolute(within)) throw new TypeError("Input cannot be inside the newly owned output directory.");
	const extension = extname(inputPath).slice(1).toLowerCase();
	if (!IMAGE_FORMATS.includes(extension)) throw new ConversionError("unsupported-format", `Unsupported image input: ${extension}.`);
	const calc = [
		"xls",
		"xlsx",
		"ods"
	].includes(extension);
	if (calc && request.pages !== void 0) throw new TypeError("Worksheets use sheet and A1 range, not printed page numbers.");
	if (!calc && (request.sheet !== void 0 || request.range !== void 0)) throw new TypeError("sheet and range apply only to worksheets.");
	if (request.sheet !== void 0 && (typeof request.sheet !== "string" || !request.sheet.trim() || request.sheet.includes("\0"))) throw new TypeError("sheet must be a nonempty exact worksheet name.");
	if (request.range !== void 0 && request.sheet === void 0) throw new TypeError("range requires an exact sheet name.");
	const range = request.range === void 0 ? void 0 : rangeName(parseCellRange(request.range));
	const pages = request.pages ?? "all";
	if (pages !== "all" && (!Array.isArray(pages) || pages.length === 0 || pages.some((page) => !Number.isSafeInteger(page) || page < 1) || new Set(pages).size !== pages.length)) throw new TypeError("pages must be all or distinct positive one-based page numbers.");
	const dpi = request.dpi ?? 144;
	const maxPages = request.maxPages ?? 100;
	const maxPixels = request.maxPixels ?? 16777216;
	const maxDimension = request.maxDimension ?? 8192;
	if (!Number.isFinite(dpi) || dpi < 24 || dpi > 600) throw new TypeError("dpi must be between 24 and 600.");
	if (!Number.isSafeInteger(maxPages) || maxPages < 1 || maxPages > 1e4) throw new TypeError("maxPages must be an integer between 1 and 10000.");
	if (!Number.isSafeInteger(maxPixels) || maxPixels < 1 || maxPixels > 16777216) throw new TypeError("maxPixels must be between 1 and 16777216.");
	if (!Number.isSafeInteger(maxDimension) || maxDimension < 1 || maxDimension > 16777216) throw new TypeError("maxDimension must be between 1 and 16777216.");
	if (pages !== "all" && pages.length > maxPages) throw new ConversionError("output-too-large", "Selected page count exceeds maxPages.");
	return {
		kind: "images",
		inputPath,
		outputDir,
		extension,
		dpi,
		maxPages,
		maxPixels,
		maxDimension,
		...calc ? {} : { pages: pages === "all" ? "all" : [...pages] },
		...request.sheet === void 0 ? {} : { sheet: request.sheet },
		...range === void 0 ? {} : { range }
	};
}
function selectedPages(pages, count, limit) {
	if (!Number.isSafeInteger(count) || count < 1) throw new ConversionError("invalid-document", "The document contains no renderable pages.");
	const result = pages === void 0 || pages === "all" ? Array.from({ length: Math.min(count, limit + 1) }, (_, i) => i + 1) : [...pages];
	if (result.length > limit) throw new ConversionError("output-too-large", "Selected page count exceeds maxPages; select pages or raise the limit.");
	if (result.some((page) => page > count)) throw new TypeError(`Selected page lies outside the ${count}-page document.`);
	return result;
}
//#endregion
//#region lib/types/native-process.js
/** Native helper stdio; Windows pipe handles permit read/write access under restricted tokens. */
let pipeAttributes;
function windowsPipes() {
	const koffi = createRequire(import.meta.url)("koffi");
	const kernel = koffi.load("kernel32.dll"), advapi = koffi.load("advapi32.dll"), node = koffi.load(null);
	const attributes = pipeAttributes ??= koffi.struct("KIT_SECURITY_ATTRIBUTES", {
		nLength: "uint32",
		lpSecurityDescriptor: "void *",
		bInheritHandle: "int"
	});
	const createPipe = kernel.func("int __stdcall CreatePipe(_Out_ void **read, _Out_ void **write, KIT_SECURITY_ATTRIBUTES *attributes, uint32 size)");
	const closeHandle = kernel.func("int __stdcall CloseHandle(void *handle)");
	const localFree = kernel.func("void * __stdcall LocalFree(void *memory)");
	const peek = kernel.func("int __stdcall PeekNamedPipe(void *pipe, void *buffer, uint32 size, void *read, _Out_ uint32 *available, void *remaining)");
	const lastError = kernel.func("uint32 __stdcall GetLastError()");
	const convertSecurityDescriptor = advapi.func("int __stdcall ConvertStringSecurityDescriptorToSecurityDescriptorW(void *sddl, uint32 revision, _Out_ void **descriptor, void *size)");
	const openFd = node.func("int uv_open_osfhandle(void *handle)");
	function pipe() {
		const reads = [null], writes = [null];
		const descriptor = [null];
		if (!convertSecurityDescriptor(Buffer.from("D:(A;;GRGW;;;WD)\0", "utf16le"), 1, descriptor, null)) throw new Error(`Pipe security descriptor failed: ${lastError()}`);
		try {
			if (!createPipe(reads, writes, {
				nLength: attributes.size,
				lpSecurityDescriptor: descriptor[0],
				bInheritHandle: 0
			}, 0)) throw new Error(`CreatePipe failed: ${lastError()}`);
		} finally {
			localFree(descriptor[0]);
		}
		const read = openFd(reads[0]);
		if (read < 0) {
			closeHandle(reads[0]);
			closeHandle(writes[0]);
			throw new Error("Cannot open anonymous input descriptor");
		}
		const write = openFd(writes[0]);
		if (write < 0) {
			closeSync(read);
			closeHandle(writes[0]);
			throw new Error("Cannot open anonymous output descriptor");
		}
		let timer;
		let ended = false;
		const readable = new Readable({
			read() {
				if (timer === void 0 && !ended) poll();
			},
			destroy(error, callback) {
				ended = true;
				clearTimeout(timer);
				try {
					closeSync(read);
					callback(error);
				} catch (cause) {
					callback(error ?? cause);
				}
			}
		});
		function poll() {
			timer = void 0;
			try {
				const available = [0];
				if (!peek(reads[0], null, 0, null, available, null)) {
					const code = lastError();
					if (code !== 109) throw new Error(`PeekNamedPipe failed: ${code}`);
					ended = true;
					readable.push(null);
					return;
				}
				if (available[0] > 0) {
					const buffer = Buffer.allocUnsafe(Math.min(available[0], 65536));
					const count = readSync(read, buffer, 0, buffer.length, null);
					if (!readable.push(buffer.subarray(0, count))) return;
				}
				timer = setTimeout(poll, 5);
			} catch (error) {
				readable.destroy(error);
			}
		}
		return {
			read,
			write,
			readable
		};
	}
	return { pipe };
}
/**
* Spawn with inherited token and Job restrictions; pipe creation never requests a new sandbox policy.
* @param executable - Verified native helper executable.
* @param args - Helper protocol arguments.
* @param env - Filtered operation environment.
* @returns Helper streams and process lifetime, with output drained before close.
*/
function spawnNative(executable, args, env) {
	if (process.platform !== "win32") return spawn(executable, args, {
		stdio: "pipe",
		windowsHide: true,
		env
	});
	const { pipe } = windowsPipes();
	const owned = [];
	let child;
	try {
		const input = pipe();
		owned.push(input);
		const output = pipe();
		owned.push(output);
		const error = pipe();
		owned.push(error);
		child = spawn(executable, args, {
			stdio: [
				input.read,
				output.write,
				error.write
			],
			windowsHide: true,
			env
		});
	} catch (error) {
		for (const entry of owned) {
			entry.readable.destroy();
			closeSync(entry.write);
		}
		throw error;
	}
	const [input, output, error] = owned;
	input.readable.destroy();
	closeSync(output.write);
	closeSync(error.write);
	const stdin = createWriteStream("", {
		fd: input.write,
		autoClose: true
	});
	const helper = new class extends EventEmitter {
		stdin = stdin;
		stdout = output.readable;
		stderr = error.readable;
		get exitCode() {
			return child.exitCode;
		}
		get signalCode() {
			return child.signalCode;
		}
		kill(signal) {
			return child.kill(signal);
		}
	}();
	let failure;
	const fail = (cause) => {
		failure ??= cause;
		child.kill("SIGKILL");
	};
	stdin.on("error", fail);
	output.readable.on("error", fail);
	error.readable.on("error", fail);
	const drained = Promise.allSettled([
		finished(stdin),
		finished(output.readable),
		finished(error.readable)
	]);
	child.once("error", (cause) => {
		failure ??= cause;
	});
	child.once("close", (code, signal) => {
		stdin.destroy();
		output.readable.resume();
		error.readable.resume();
		drained.then(() => {
			if (failure !== void 0) helper.emit("error", failure);
			helper.emit("close", code, signal);
		});
	});
	return helper;
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
//#region lib/types/native-font-names.js
/** Localized search names from LibreOffice Core's fixed font-name dictionary. */
const LOCALIZED_FONT_SEARCH_NAMES = /* @__PURE__ */ new Map([
	["바탕", "batang"],
	["바탕체", "batangche"],
	["궁서", "gungshu"],
	["궁서체", "gungshuche"],
	["굴림", "gulim"],
	["굴림체", "gulimche"],
	["돋움", "dotum"],
	["돋움체", "dotumche"],
	["宋体", "simsun"],
	["新宋体", "nsimsun"],
	["黑体", "simhei"],
	["楷体", "simkai"],
	["中易宋体", "zycjksun"],
	["中易黑体", "zycjkhei"],
	["中易楷体", "zycjkkai"],
	["方正黑体", "fzhei"],
	["方正楷体", "fzkai"],
	["方正宋一", "fzsong"],
	["方正书宋", "fzshusong"],
	["方正仿宋", "fzfangsong"],
	["m简黑", "mhei"],
	["m潠窪", "mhei"],
	["m简楷噬", "mkai"],
	["m潠翱抎", "mkai"],
	["m简宋", "msong"],
	["m潠冼", "msong"],
	["m简夫宋", "cfangsong"],
	["m潠溘冼", "cfangsong"],
	["細明體", "mingliu"],
	["新細明體", "pmingliu"],
	["桥", "hei"],
	["歡", "kai"],
	["浩湧", "ming"],
	["msゴシック", "msgothic"],
	["mspゴシック", "mspgothic"],
	["ms明朝", "msmincho"],
	["msp明朝", "mspmincho"],
	["微軟正黑體", "microsoftjhenghei"],
	["微软雅黑", "microsoftyahei"],
	["メイリオ", "meiryo"],
	["hg明朝l", "hgminchol"],
	["hgゴシックb", "hggothicb"],
	["hgp明朝l", "hgpminchol"],
	["hgpゴシックb", "hgpgothicb"],
	["hg明朝lsun", "hgmincholsun"],
	["hgゴシックbsun", "hggothicbsun"],
	["hgp明朝lsun", "hgpmincholsun"],
	["hgpゴシックbsun", "hgpgothicbsun"],
	["hg平成明朝体", "hgheiseimin"],
	["hg平成明朝体w3x12", "hgheiseimin"],
	["ipa明朝", "ipamincho"],
	["ipap明朝", "ipapmincho"],
	["ipaゴシック", "ipagothic"],
	["ipapゴシック", "ipapgothic"],
	["ipauiゴシック", "ipauigothic"],
	["takao明朝", "takaomincho"],
	["takaop明朝", "takaopmincho"],
	["takaoゴシック", "takaogothic"],
	["takaopゴシック", "takaopgothic"],
	["さざなみ明朝", "sazanamimincho"],
	["さざなみゴシック", "sazanamigothic"],
	["東風明朝", "kochimincho"],
	["東風ゴシック", "kochigothic"],
	["썬돋움", "sundotum"],
	["썬굴림", "sungulim"],
	["썬바탕", "sunbatang"],
	["백묵돋움", "baekmukdotum"],
	["백묵굴림", "baekmukgulim"],
	["백묵바탕", "baekmukbatang"],
	["方正黑體", "fzheiti"],
	["方正楷體", "fzkaitib"],
	["方正明體", "fzmingtib"],
	["方正宋体", "fzsongti"],
	["hy견명조", "hymyeongjoextra"],
	["hy신명조", "hysinmyeongjomedium"],
	["hy중고딕", "hygothicmedium"],
	["hy그래픽m", "hygraphicmedium"],
	["hy그래픽", "hygraphic"],
	["새굴림", "newgulim"],
	["썬궁서", "sungungseo"],
	["hy궁서b", "hygungsobold"],
	["hy궁서", "hygungso"],
	["썬헤드라인", "sunheadline"],
	["hy헤드라인m", "hyheadlinemedium"],
	["hy헤드라인", "hyheadline"],
	["휴먼옛체", "yetr"],
	["hy견고딕", "hygothicextra"],
	["썬목판", "sunmokpan"],
	["썬엽서", "sunyeopseo"],
	["썬백송", "sunbaeksong"],
	["hy엽서l", "hypostlight"],
	["hy엽서", "hypost"],
	["휴먼매직체", "magicr"],
	["썬크리스탈", "suncrystal"],
	["썬샘물", "sunsaemmul"],
	["hy얕은샘물m", "hyshortsamulmedium"],
	["hy얕은샘물", "hyshortsamul"],
	["한컴바탕", "haansoftbatang"],
	["한컴돋움", "haansoftdotum"],
	["한양해서", "hyhaeseo"],
	["md솔체", "mdsol"],
	["md개성체", "mdgaesung"],
	["md아트체", "mdart"],
	["md아롱체", "mdalong"],
	["md이솝체", "mdeasop"],
	["hgｺﾞｼｯｸe", "hggothice"],
	["hgpｺﾞｼｯｸe", "hgpgothice"],
	["hgsｺﾞｼｯｸe", "hgsgothice"],
	["hgｺﾞｼｯｸm", "hggothicm"],
	["hgpｺﾞｼｯｸm", "hgpgothicm"],
	["hgsｺﾞｼｯｸm", "hgsgothicm"],
	["hg行書体", "hggyoshotai"],
	["hgp行書体", "hgpgyoshotai"],
	["hgs行書体", "hgsgyoshotai"],
	["hg教科書体", "hgkyokashotai"],
	["hgp教科書体", "hgpkyokashotai"],
	["hgs教科書体", "hgskyokashotai"],
	["hg明朝b", "hgminchob"],
	["hgp明朝b", "hgpminchob"],
	["hgs明朝b", "hgsminchob"],
	["hg明朝e", "hgminchoe"],
	["hgp明朝e", "hgpminchoe"],
	["hgs明朝e", "hgsminchoe"],
	["hg創英角ﾎﾟｯﾌﾟ体", "hgsoeikakupoptai"],
	["hgp創英角ﾎﾟｯﾌﾟ体", "hgpsoeikakupopta"],
	["hgs創英角ﾎﾟｯﾌﾟ体", "hgssoeikakupopta"],
	["hg創英ﾌﾟﾚｾﾞﾝｽeb", "hgsoeipresenceeb"],
	["hgp創英ﾌﾟﾚｾﾞﾝｽeb", "hgpsoeipresenceeb"],
	["hgs創英ﾌﾟﾚｾﾞﾝｽeb", "hgssoeipresenceeb"],
	["hg創英角ｺﾞｼｯｸub", "hgsoeikakugothicub"],
	["hgp創英角ｺﾞｼｯｸub", "hgpsoeikakugothicub"],
	["hgs創英角ｺﾞｼｯｸub", "hgssoeikakugothicub"],
	["hg正楷書体-pro", "hgseikaishotaipro"],
	["hg丸ｺﾞｼｯｸ-pro", "hgmarugothicmpro"],
	["ヒラギノ明朝pro", "hiraginominchopro"],
	["ヒラギノ明朝pron", "hiraginominchopron"],
	["ヒラギノ角ゴシック", "hiraginosans"],
	["ヒラギノ角ゴpro", "hiraginokakugothicpro"],
	["ヒラギノ角ゴpron", "hiraginokakugothicpron"],
	["ヒラギノ丸ゴpro", "hiraginomarugothicpro"],
	["ヒラギノ丸ゴpron", "hiraginomarugothicpron"],
	["游ゴシック", "yugothic"],
	["游ゴシック体", "yugothictai"],
	["游明朝", "yumincho"],
	["游明朝体", "yuminchotai"],
	["源ノ角ゴシック", "sourcehansans"],
	["源ノ角ゴシックjp", "sourcehansansjp"],
	["源ノ角ゴシックhw", "sourcehansanshw"],
	["源ノ明朝", "sourcehanserif"],
	["源ノ明朝jp", "sourcehanserifjp"],
	["ipamj明朝", "ipamjmincho"],
	["ipaexゴシック", "ipaexgothic"],
	["ipaex明朝", "ipaexmimcho"]
]);
//#endregion
//#region lib/types/native.js
/** Per-render native helper process ownership and bounded result transport. */
const METRIC_SEARCH_NAMES = /* @__PURE__ */ new Map([
	["timesnewroman", "liberationserif"],
	["arial", "liberationsans"],
	["arialnarrow", "liberationsansnarrow"],
	["couriernew", "liberationmono"],
	["cambria", "caladea"],
	["calibri", "carlito"],
	["bundessans", "calibri"],
	["bundessansoffice", "calibri"],
	["bundessansregular", "calibri"],
	["bundesserif", "cambria"],
	["bundesserifoffice", "cambria"],
	["bundesserifregular", "cambria"]
]);
/** Environment variables the helper inherits from the embedding process. */
const NATIVE_ENVIRONMENT_KEYS = [
	"PATH",
	"SystemRoot",
	"SYSTEMROOT",
	"WINDIR",
	"COMSPEC",
	"PATHEXT",
	"LANG",
	"LC_ALL",
	"TZ"
];
function fontSearchName(value) {
	const name = value.replaceAll(/[\uff00-\uff5e]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 65248)).replaceAll(/[A-Z]/g, (character) => character.toLowerCase()).replaceAll(/[^a-z0-9;()\u0080-\uffff]/g, "");
	return LOCALIZED_FONT_SEARCH_NAMES.get(name) ?? name;
}
/**
* Write missing-family choices into the private profile's VCL substitution table.
* Installed originals and metric-compatible fonts are resolved before this table by LibreOffice.
* @param profile - Existing, conversion-owned profile directory.
* @param substitutions - Missing document families and the selected installed family.
* @returns Resolves after the exclusive profile file is written; empty choices still disable the interactive CSV warning.
*/
async function prepareNativeFontProfile(profile, substitutions) {
	const families = new Map(substitutions.map(({ family, substitute }) => [fontSearchName(family), substitute]));
	for (const [family, substitute] of [...families]) for (let alias = METRIC_SEARCH_NAMES.get(family); alias; alias = METRIC_SEARCH_NAMES.get(alias)) if (!families.has(alias)) families.set(alias, substitute);
	const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
	const xml = profileXml([...families].map(([family, substitute]) => `<node oor:name="${escape(family)}" oor:op="replace"><prop oor:name="SubstFonts" oor:op="fuse"><value>${escape(substitute)}</value></prop></node>`).join(""));
	const user = join(profile, "user");
	await mkdir(user, { mode: 448 });
	await writeFile(join(user, "registrymodifications.xcu"), xml, {
		flag: "wx",
		mode: 384
	});
}
/**
* Native conversion and rendering disable printer discovery to avoid driver UI and network waits.
* Linux searches the verified program directory; ambient loader overrides and credentials are excluded.
* @param profile - Conversion-owned profile directory the helper treats as home.
* @param programDirectory - Verified engine program directory.
* @param source - Embedding process environment.
* @param platform - Host operating system.
* @returns the environment the helper starts with.
*/
function nativeEnvironment(profile, programDirectory, source = process.env, platform = process.platform) {
	const env = {};
	for (const key of NATIVE_ENVIRONMENT_KEYS) {
		const value = source[key];
		if (value !== void 0) env[key] = value;
	}
	if (platform === "linux") env.LD_LIBRARY_PATH = programDirectory;
	return Object.assign(env, {
		HOME: profile,
		USERPROFILE: profile,
		TMPDIR: profile,
		TMP: profile,
		TEMP: profile,
		SAL_DISABLE_PRINTERLIST: "1",
		SAL_DISABLE_DEFAULTPRINTER: "1"
	});
}
/**
* Keep Windows engine resources reachable through a short profile-owned path until the helper exits.
* @param engine - Verified engine installation; its resources remain in place.
* @param profile - Private operation directory that owns the temporary executable and junction.
* @param run - Operation that settles only after its helper closes.
* @returns The operation result after removing the resource junction.
*/
async function withNativeEngine(engine, profile, run) {
	if (process.platform !== "win32" || engine.executable.length < 260 && engine.programDirectory.length < 260) return run(engine);
	const root = join(profile, "engine");
	await symlink(engine.root, root, "junction");
	try {
		const executable = join(profile, "libreoffice-kit.exe");
		await copyFile(engine.executable, executable, constants.COPYFILE_EXCL);
		return await run({
			...engine,
			root,
			executable,
			programDirectory: join(root, relative(engine.root, engine.programDirectory))
		});
	} finally {
		await unlink(root);
	}
}
/**
* Run one native conversion and await bounded result transport.
* @param engine - Resolved native engine installation.
* @param options - Validated conversion limits.
* @param input - Private source path inside the conversion scratch directory.
* @param output - Private PDF path inside the conversion scratch directory.
* @param profile - Conversion-owned profile directory.
* @param fonts - Installed font files the helper may load.
* @param substitutions - Missing families and their selected installed substitutes.
* @param signal - Cancellation; it kills the helper and awaits its exit.
* @param operation - Validated output format, recalculation, and worksheet selection.
* @throws ConversionError for a reported conversion failure, and the abort reason for cancellation.
*/
async function runNative(engine, options, input, output, profile, fonts, substitutions, signal, operation = {
	format: "pdf",
	recalculate: false
}) {
	signal.throwIfAborted();
	await prepareNativeFontProfile(profile, substitutions);
	signal.throwIfAborted();
	return withNativeEngine(engine, profile, async (engine) => {
		signal.throwIfAborted();
		const env = nativeEnvironment(profile, engine.programDirectory);
		const child = spawnNative(engine.executable, [
			"--program-directory",
			engine.programDirectory,
			"--input-path",
			input,
			"--output-path",
			output,
			"--profile-directory",
			profile,
			"--max-output-bytes",
			String(options.maxOutputBytes),
			"--max-image-resolution",
			String(options.maxImageResolution),
			"--format",
			operation.format,
			"--recalculate",
			String(operation.recalculate),
			...operation.sheet === void 0 ? [] : ["--sheet", operation.sheet],
			...fonts.flatMap((path) => ["--font-file", path])
		], env);
		child.stdin.end();
		let stdout = "";
		let stderr = "";
		let failure;
		const abort = () => {
			failure ??= signal.reason;
			child.kill("SIGKILL");
		};
		signal.addEventListener("abort", abort, { once: true });
		child.stdout.setEncoding("utf8");
		child.stderr.setEncoding("utf8");
		child.stdout.on("data", (chunk) => {
			stdout += chunk;
			if (stdout.length > 65536) {
				failure ??= /* @__PURE__ */ new Error("LibreOffice helper exceeded its response limit.");
				child.kill("SIGKILL");
			}
		});
		child.stderr.on("data", (chunk) => {
			stderr = (stderr + chunk).slice(-65536);
		});
		try {
			const code = await new Promise((resolve, reject) => {
				child.once("error", (error) => {
					failure ??= error;
				});
				child.once("close", (code, signal) => {
					if (signal === "SIGXFSZ") failure ??= new ConversionError("output-too-large", "LibreOffice exceeded its output file-size limit.");
					if (failure) reject(failure);
					else resolve(code);
				});
			});
			signal.throwIfAborted();
			let result;
			try {
				result = JSON.parse(stdout);
			} catch (cause) {
				throw new Error(`LibreOffice helper returned an invalid response (exit ${code}). ${stderr}`, { cause });
			}
			if (code !== 0 || result.ok !== true) throw new ConversionError(failureCode(result), `LibreOffice native conversion failed: ${result.error ?? stderr}`);
		} finally {
			signal.removeEventListener("abort", abort);
		}
	});
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
//#region lib/types/native-image-renderer.js
/** Direct native LibreOfficeKit/PDFium rasterization through one operation-owned helper. */
function failure(value, stderr) {
	const result = value;
	return new ConversionError(failureCode(result), `LibreOffice native rendering failed: ${result.error ?? stderr}`);
}
function plan(ready, request) {
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
	if (ready.documentType === "pdf" || ready.documentType === "presentation") {
		const pages = ready.pages;
		if (!Array.isArray(pages)) throw new ConversionError("invalid-document", "LibreOffice returned no page dimensions.");
		return select(pages.map(({ width, height }, part) => {
			if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1) throw new ConversionError("invalid-document", "LibreOffice returned invalid page dimensions.");
			return {
				part,
				x: 0,
				y: 0,
				width: width / 15,
				height: height / 15
			};
		}));
	}
	if (ready.documentType === "text") {
		if (typeof ready.writerRectangles !== "string") throw new ConversionError("invalid-document", "LibreOffice returned no Writer page rectangles.");
		return select(writerPages(ready.writerRectangles));
	}
	const sheets = (ready.sheets ?? []).map(({ part, info, geometry }) => ({
		part,
		info: sheetPartInfo(info),
		geometry: JSON.parse(geometry)
	}));
	const count = sheets.filter((sheet) => sheet.info.visible).length;
	const chosen = request.sheet === void 0 ? sheets.filter((sheet) => sheet.info.visible) : sheets.filter((sheet) => sheet.info.name === request.sheet);
	if (chosen.length === 0) throw new ConversionError("invalid-document", "The exact worksheet name does not exist or the workbook has no visible sheets.");
	if (chosen.length > request.maxPages) throw new ConversionError("output-too-large", "Selected worksheet count exceeds maxPages; select a sheet or raise the limit.");
	const scale = request.dpi / 96;
	return {
		count,
		regions: chosen.map(({ part, info, geometry }) => {
			const range = request.range === void 0 ? dataArea(info) : parseCellRange(request.range);
			const rectangle = sheetRangeRectangle(geometry, range, scale);
			return {
				page: {
					x: 0,
					y: 0,
					width: rectangle.x + rectangle.width,
					height: rectangle.y + rectangle.height,
					part
				},
				rectangle,
				sheet: info.name,
				range: rangeName(range),
				rtl: Boolean(info.rtllayout)
			};
		})
	};
}
/** Run one native image batch and write final PNGs only after each bounded paint succeeds. */
async function renderImagesWithNative(request) {
	const { engine, options, inputPath, source, scratch, profile, fonts, substitutions, missingFonts, operation, signal } = request;
	signal.throwIfAborted();
	await mkdir(profile, { mode: 448 });
	await prepareNativeFontProfile(profile, substitutions);
	return withNativeEngine(engine, profile, async (engine) => {
		signal.throwIfAborted();
		const child = spawnNative(engine.executable, [
			"--operation",
			"render-images",
			"--program-directory",
			engine.programDirectory,
			"--input-path",
			inputPath,
			"--scratch-directory",
			scratch,
			"--profile-directory",
			profile,
			"--max-output-bytes",
			String(options.maxOutputBytes),
			"--max-image-resolution",
			String(options.maxImageResolution),
			...fonts.flatMap((path) => ["--font-file", path])
		], nativeEnvironment(profile, engine.programDirectory));
		const lines = [];
		const waiters = [];
		const output = createInterface({ input: child.stdout });
		output.on("line", (line) => {
			const waiter = waiters.shift();
			if (waiter) waiter(line);
			else lines.push(line);
		});
		let stderr = "";
		let stopped;
		child.stderr.setEncoding("utf8");
		child.stderr.on("data", (chunk) => {
			stderr = (stderr + chunk).slice(-65536);
		});
		const closed = new Promise((resolve, reject) => {
			let failure;
			child.once("error", (error) => {
				failure = error;
			});
			child.once("close", (code) => {
				if (failure) reject(failure);
				else resolve(code);
			});
		});
		const abort = () => {
			stopped ??= signal.reason;
			child.kill("SIGKILL");
		};
		signal.addEventListener("abort", abort, { once: true });
		const next = async () => {
			signal.throwIfAborted();
			if (lines.length > 0) return lines.shift();
			return new Promise((resolve, reject) => {
				const done = (line) => {
					signal.removeEventListener("abort", cancel);
					resolve(line);
				};
				const fail = (error) => {
					const index = waiters.indexOf(done);
					if (index >= 0) waiters.splice(index, 1);
					signal.removeEventListener("abort", cancel);
					reject(error);
				};
				const cancel = () => {
					fail(signal.reason);
				};
				signal.addEventListener("abort", cancel, { once: true });
				waiters.push(done);
				closed.then((code) => {
					fail(/* @__PURE__ */ new Error(`LibreOffice native renderer exited ${code ?? child.signalCode} before responding. ${stderr}`));
				}, fail);
			});
		};
		const response = async () => {
			const line = await next();
			let value;
			try {
				value = JSON.parse(line);
			} catch (cause) {
				throw new Error(`LibreOffice native renderer returned invalid JSON. ${stderr}`, { cause });
			}
			if (!value.ok) throw failure(value, stderr);
			return value;
		};
		try {
			const ready = await response();
			if (ready.kind !== "ready") throw new Error("LibreOffice native renderer did not initialize.");
			const planned = plan(ready, operation);
			const scale = operation.dpi / 96;
			const selected = [];
			for (const region of planned.regions) if (region.sheet === void 0) selected.push(region);
			else {
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
				const { width, height } = tileDimensions({
					pageIndex: 0,
					...rectangle,
					scale
				}, [page]);
				if (width > operation.maxDimension || height > operation.maxDimension || width * height > operation.maxPixels) throw new ConversionError("output-too-large", "Selected page exceeds maxPixels or maxDimension; reduce DPI or raise the image limits.");
			}
			const images = [];
			let total = 0;
			for (const region of selected) {
				signal.throwIfAborted();
				const { width, height } = tileDimensions({
					pageIndex: 0,
					...region.rectangle,
					scale
				}, [region.page]);
				const x = region.page.x + Math.round(region.rectangle.x * 15);
				const y = region.page.y + Math.round(region.rectangle.y * 15);
				const twipsWidth = Math.max(1, Math.round(region.rectangle.width * 15));
				const twipsHeight = Math.max(1, Math.round(region.rectangle.height * 15));
				const index = images.length + 1;
				child.stdin.write(`P ${index} ${region.page.part} ${width} ${height} ${x} ${y} ${twipsWidth} ${twipsHeight}\n`);
				const painted = await response();
				if (painted.kind !== "paint" || painted.index !== index || painted.width !== width || painted.height !== height) throw new Error("LibreOffice native renderer returned inconsistent tile metadata.");
				if (resolve(painted.path) !== resolve(scratch, `tile-${index}.rgba`)) throw new Error("LibreOffice native renderer returned a tile outside its scratch directory.");
				const raw = await readFile(painted.path);
				if (raw.byteLength !== width * height * 4) throw new Error("LibreOffice native renderer returned incomplete pixels.");
				const rgba = ready.documentType === "pdf" ? new Uint8ClampedArray(raw) : rgbaPixels(raw, ready.tileMode);
				if (region.rtl) unmirrorRtlTile({
					width,
					height,
					rgba
				});
				const png = encodePng(width, height, rgba);
				total += png.byteLength;
				if (total > options.maxOutputBytes) throw new ConversionError("output-too-large", "PNG batch exceeds maxOutputBytes.");
				const path = join(operation.outputDir, `page-${String(index).padStart(4, "0")}.png`);
				await writeFile(path, png, {
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
					width,
					height,
					rectangle: region.rectangle,
					byteLength: png.byteLength
				});
			}
			child.stdin.end("DONE\n");
			if ((await response()).kind !== "done") throw new Error("LibreOffice native renderer did not finish.");
			const code = await closed;
			if (code !== 0) throw new Error(`LibreOffice native renderer exited ${code}. ${stderr}`);
			return {
				schemaVersion: 1,
				backend: "native",
				rasterEngine: ready.documentType === "pdf" ? "pdfium" : "libreoffice",
				source: "saved",
				inputPath: operation.inputPath,
				sourceSha256: createHash("sha256").update(source).digest("hex"),
				dpi: operation.dpi,
				pageCount: planned.count,
				images,
				missingFonts: [...missingFonts]
			};
		} finally {
			signal.removeEventListener("abort", abort);
			output.close();
			if (child.exitCode === null) child.kill("SIGKILL");
			await closed.catch(() => {});
			if (stopped !== void 0) throw stopped;
		}
	});
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
* Discover system and per-user font roots using the selected platform's path separators.
* @param platform - Host operating system.
* @param home - Host user home used to locate per-user font directories.
* @param env - Host environment containing Windows and XDG directory overrides.
* @returns candidate directories; missing platform directories are ignored during indexing.
*/
function systemFontDirectories(platform = process.platform, home = homedir(), env = process.env) {
	if (platform === "win32") return [win32.join(env.SystemRoot ?? "C:\\Windows", "Fonts"), win32.join(env.LOCALAPPDATA ?? win32.join(home, "AppData", "Local"), "Microsoft", "Windows", "Fonts")];
	if (platform === "darwin") return [
		"/System/Library/Fonts",
		"/Library/Fonts",
		posix.join(home, "Library/Fonts"),
		...mobileAssetFontDirectories("/System/Library/AssetsV2")
	];
	const shared = (env.XDG_DATA_DIRS ?? "/usr/local/share:/usr/share").split(":").filter(Boolean);
	return [.../* @__PURE__ */ new Set([
		...shared.map((path) => posix.join(path, "fonts")),
		posix.join(home, ".fonts"),
		posix.join(env.XDG_DATA_HOME ?? posix.join(home, ".local/share"), "fonts")
	])];
}
/**
* Font asset directories macOS publishes under its MobileAsset root.
* @param assets - Absolute MobileAsset font directory root.
* @returns matching asset directories, sorted by name.
* @throws when the root exists but cannot be read for a reason other than its absence or protection.
*/
function mobileAssetFontDirectories(assets) {
	let entries = [];
	try {
		entries = readdirSync(assets);
	} catch (error) {
		if (!absent(error)) throw error;
	}
	return entries.filter((name) => /^com_apple_MobileAsset_Font\d*$/.test(name)).sort().map((name) => join(assets, name));
}
//#endregion
//#region lib/types/font-metadata-cache.js
/** Resolve the platform's user-local cache, independently of font discovery. */
function defaultFontMetadataCacheDirectory(platform = process.platform, home = homedir(), env = process.env) {
	if (platform === "darwin") return posix.join(home, "Library/Caches/libreoffice-kit");
	if (platform === "win32") return win32.join(env.LOCALAPPDATA ?? win32.join(home, "AppData/Local"), "libreoffice-kit/Cache");
	return posix.join(env.XDG_CACHE_HOME && posix.isAbsolute(env.XDG_CACHE_HOME) ? env.XDG_CACHE_HOME : posix.join(home, ".cache"), "libreoffice-kit");
}
//#endregion
//#region lib/types/options.js
const SANS_CJK_FAMILIES = [
	"Microsoft YaHei",
	"Microsoft YaHei UI",
	"微软雅黑",
	"PingFang SC",
	"Noto Sans CJK SC",
	"Noto Sans SC",
	"Source Han Sans SC",
	"SimHei",
	"黑体",
	"Heiti SC",
	"STHeiti"
];
/** Ordered family groups used when the caller supplies none. */
const FONT_FALLBACKS = [
	["Calibri", "Carlito"],
	[
		"Calibri Light",
		"Carlito",
		"Calibri"
	],
	["Cambria", "Caladea"],
	[
		"宋体",
		"SimSun",
		"NSimSun",
		"Songti SC",
		"STSong",
		"Noto Serif CJK SC",
		"Noto Serif SC",
		"Source Han Serif SC"
	],
	[
		"黑体",
		"SimHei",
		"Heiti SC",
		"STHeiti",
		"Noto Sans CJK SC",
		"Noto Sans SC",
		"Source Han Sans SC"
	],
	[
		"微软雅黑",
		"Microsoft YaHei",
		"Microsoft YaHei UI",
		"PingFang SC",
		"Noto Sans CJK SC",
		"Noto Sans SC"
	],
	[
		"楷体",
		"KaiTi",
		"Kaiti SC",
		"STKaiti",
		"LXGW WenKai"
	],
	[
		"仿宋",
		"FangSong",
		"STFangsong",
		"Songti SC",
		"Noto Serif CJK SC"
	],
	[
		"sans-serif",
		"Arial",
		"Liberation Sans",
		"Helvetica",
		"DejaVu Sans",
		"Calibri",
		"Calibri Light",
		"Carlito",
		...SANS_CJK_FAMILIES
	],
	[
		"serif",
		"Times New Roman",
		"Liberation Serif",
		"Times",
		"DejaVu Serif",
		"Cambria",
		"Caladea",
		"SimSun",
		"NSimSun",
		"宋体",
		"Songti SC",
		"STSong",
		"Noto Serif CJK SC",
		"Noto Serif SC",
		"Source Han Serif SC"
	],
	[
		"monospace",
		"Courier New",
		"Liberation Mono",
		"DejaVu Sans Mono",
		"Menlo",
		"Monaco",
		"Courier",
		"NSimSun",
		"Noto Sans Mono CJK SC",
		...SANS_CJK_FAMILIES
	],
	[
		"Symbol",
		"Standard Symbols PS",
		"Symbola",
		"Segoe UI Symbol",
		"Apple Symbols",
		"FreeSerif",
		"DejaVu Sans"
	]
];
const DEFAULT_LIMITS = {
	timeoutMs: 12e4,
	maxInputBytes: 67108864,
	maxOutputBytes: 134217728,
	maxImageResolution: 144,
	maxArchiveEntries: 2e4,
	maxUncompressedBytes: 536870912,
	maxFontFiles: 2e4,
	maxFontFileBytes: 268435456,
	maxLoadedFontBytes: 536870912,
	maxFontResolutionEntries: 4096,
	maxFontMetadataCacheBytes: 33554432
};
const FONT_COLLECTION_NAMES = ["fontDirectories", "initialFontFamilies"];
function positiveSafeInteger(value, name) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw new RangeError(`${name} must be a positive safe integer.`);
	if (name.endsWith("Ms") && value > 2147483647) throw new RangeError(`${name} exceeds the Node timer range.`);
	return value;
}
function fontNames(value, name) {
	if (!Array.isArray(value)) throw new TypeError(`${name} must contain nonempty strings.`);
	const names = [];
	for (const entry of value) {
		if (typeof entry !== "string" || entry.length === 0 || entry.includes("\0")) throw new TypeError(`${name} must contain nonempty strings.`);
		names.push(entry);
	}
	return names;
}
function fontGroups(value) {
	if (!Array.isArray(value) || value.some((group) => !Array.isArray(group) || group.length < 2 || group.some((entry) => typeof entry !== "string" || !entry.trim()))) throw new TypeError("fontFallbacks must contain groups of at least two nonblank font names.");
	return value.map((group) => [...group]);
}
/**
* Resolve defaults once; reject misspelled options and malformed font settings.
* @param input - Caller options; absent fields keep their documented default.
* @returns The validated limits and font settings, with caller arrays copied.
* @throws TypeError for a non-object argument or an unknown option name.
* @throws RangeError for a limit outside the positive safe-integer timer range.
*/
function resolveOptions(input = {}) {
	const callerOptions = input;
	if (callerOptions === null || typeof callerOptions !== "object" || Array.isArray(callerOptions)) throw new TypeError("Converter options must be an object.");
	const merged = {
		...DEFAULT_LIMITS,
		fontDirectories: systemFontDirectories(),
		fontFallbacks: FONT_FALLBACKS,
		initialFontFamilies: [],
		...input
	};
	for (const key of Object.keys(input)) if (!(key in DEFAULT_LIMITS) && !FONT_COLLECTION_NAMES.includes(key) && key !== "fontFallbacks" && key !== "fontMetadataCacheDirectory") throw new TypeError(`Unknown converter option: ${key}`);
	const cacheDirectory = input.fontMetadataCacheDirectory === void 0 ? defaultFontMetadataCacheDirectory() : input.fontMetadataCacheDirectory;
	if (cacheDirectory !== false && (typeof cacheDirectory !== "string" || !isAbsolute(cacheDirectory) || cacheDirectory.includes("\0"))) throw new TypeError("fontMetadataCacheDirectory must be an absolute path or false.");
	return {
		fontMetadataCacheDirectory: cacheDirectory,
		maxFontMetadataCacheBytes: positiveSafeInteger(merged.maxFontMetadataCacheBytes, "maxFontMetadataCacheBytes"),
		timeoutMs: positiveSafeInteger(merged.timeoutMs, "timeoutMs"),
		maxInputBytes: positiveSafeInteger(merged.maxInputBytes, "maxInputBytes"),
		maxOutputBytes: positiveSafeInteger(merged.maxOutputBytes, "maxOutputBytes"),
		maxImageResolution: positiveSafeInteger(merged.maxImageResolution, "maxImageResolution"),
		maxArchiveEntries: positiveSafeInteger(merged.maxArchiveEntries, "maxArchiveEntries"),
		maxUncompressedBytes: positiveSafeInteger(merged.maxUncompressedBytes, "maxUncompressedBytes"),
		maxFontFiles: positiveSafeInteger(merged.maxFontFiles, "maxFontFiles"),
		maxFontFileBytes: positiveSafeInteger(merged.maxFontFileBytes, "maxFontFileBytes"),
		maxLoadedFontBytes: positiveSafeInteger(merged.maxLoadedFontBytes, "maxLoadedFontBytes"),
		maxFontResolutionEntries: positiveSafeInteger(merged.maxFontResolutionEntries, "maxFontResolutionEntries"),
		fontDirectories: fontNames(merged.fontDirectories, "fontDirectories"),
		includeOfficeFonts: input.fontDirectories === void 0,
		initialFontFamilies: fontNames(merged.initialFontFamilies, "initialFontFamilies"),
		fontFallbacks: fontGroups(merged.fontFallbacks)
	};
}
//#endregion
//#region lib/types/engine.js
/** Resolve installed, version-matched engine packages without downloads or compilation. */
const require = createRequire(import.meta.url);
/** Node API release version returned by runtime discovery. */
const ENGINE_VERSION = "0.1.5";
/** Exact compatible engine versions; unchanged platforms retain their published packages. */
const ENGINE_VERSIONS = Object.freeze({
	"darwin-arm64": "0.1.5",
	"darwin-x64": "0.1.5",
	"linux-arm64-glibc": "0.1.1",
	"linux-x64-glibc": "0.1.1",
	"win32-arm64": "0.1.5",
	"win32-x64": "0.1.5",
	wasm: "0.1.5"
});
/** npm scope and name prefix shared by the engine packages this adapter installs. */
const ENGINE_PREFIX = "@deepseek-ai/libreoffice-kit";
/**
* Whether an installed engine package directory is present on the resolution path.
* @param name - Engine package name.
* @returns true when at least one resolution directory holds the package.
*/
function installedPackageExists(name) {
	return (require.resolve.paths(name) ?? []).some((directory) => lstatSync(join(directory, name), { throwIfNoEntry: false }) !== void 0);
}
/**
* Return the optional package target for the current process ABI.
* @param platform - Host operating system.
* @param arch - Host CPU architecture.
* @param report - Host diagnostic report used to identify glibc.
* @returns the declared platform target, or undefined for an unsupported host.
*/
function platformTarget(platform = process.platform, arch = process.arch, report = hostReport) {
	if (!["arm64", "x64"].includes(arch)) return void 0;
	if (platform === "darwin" || platform === "win32") return `${platform}-${arch}`;
	if (platform !== "linux") return void 0;
	return report().header?.glibcVersionRuntime ? `linux-${arch}-glibc` : void 0;
}
/** @returns the host diagnostic report as the engine resolver reads it. */
function hostReport() {
	return process.report.getReport();
}
function asset(root, value) {
	if (typeof value !== "string" || !value || isAbsolute(value)) throw new Error("Engine manifest contains an invalid asset path.");
	const path = resolve(root, value);
	if (relative(root, path).startsWith(`..${sep}`) || relative(root, path) === "..") throw new Error("Engine asset escapes its installed package.");
	return path;
}
function glibcVersion(value) {
	return typeof value === "string" && /^(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?$/.test(value) && value.split(".").every((part) => Number.isSafeInteger(Number(part))) ? value.split(".").map(Number) : void 0;
}
/**
* macOS and Windows require their native engine. Linux uses WASM when no compatible development native engine is installed.
* @param resolvePackage - Package manifest resolver; injectable for selection tests.
* @param packageExists - Installed-package probe; injectable for selection tests.
* @param host - Process identification and diagnostic report.
* @returns the installed native engine, or the installed WASM engine.
*/
async function resolveEngine(resolvePackage = (name) => require.resolve(`${name}/package.json`), packageExists = installedPackageExists, { platform = process.platform, arch = process.arch, report = hostReport } = {}) {
	const details = platform === "linux" ? report() : {};
	const target = platformTarget(platform, arch, () => details);
	if (target !== void 0) {
		const name = `${ENGINE_PREFIX}-${target}`;
		let packageFile;
		try {
			packageFile = resolvePackage(name);
		} catch (error) {
			const failure = error;
			if (!(failure?.code === "MODULE_NOT_FOUND" && typeof failure.message === "string" && failure.message.includes(`${name}/package.json`))) throw error;
			if (packageExists(name)) throw new Error(`Installed LibreOfficeKit package is incomplete: ${name}`, { cause: error });
			if (platform !== "linux") throw new Error(`Required LibreOfficeKit native package is missing: ${name}`, { cause: error });
		}
		if (packageFile !== void 0) {
			const engine = await readEngine(packageFile, "native", target);
			const minimum = glibcVersion(engine.glibcMinimum);
			const host = glibcVersion(details.header?.glibcVersionRuntime);
			if (!(minimum && host && minimum.some((part, index) => part > (host[index] ?? 0) && minimum.slice(0, index).every((prior, priorIndex) => prior === host[priorIndex])))) return engine;
		}
	}
	if (platform !== "linux") throw new Error(`Unsupported LibreOfficeKit host: ${platform}-${arch}`);
	return readEngine(resolvePackage(`${ENGINE_PREFIX}-wasm`), "wasm", "wasm");
}
async function engineAsset(root, value, name, kind) {
	const path = asset(root, value);
	const status = await stat(path);
	if (kind === "directory" ? !status.isDirectory() : !status.isFile()) throw new Error(`Installed LibreOfficeKit ${name} is not a ${kind}.`);
	if (name === "executable" && process.platform !== "win32" && !(status.mode & 73)) throw new Error("Installed LibreOfficeKit executable is not executable.");
	return path;
}
async function readEngine(packageFile, backend, target) {
	const root = dirname(packageFile);
	const [pkg, manifest] = await Promise.all([readFile(packageFile, "utf8").then((text) => JSON.parse(text)), readFile(resolve(root, "prebuilds.json"), "utf8").then((text) => JSON.parse(text))]);
	const engine = manifest.engine;
	if (pkg.name !== `${ENGINE_PREFIX}-${target}` || pkg.version !== ENGINE_VERSIONS[target] || manifest.version !== pkg.version || manifest.schemaVersion !== 1 || manifest.status !== "built" || engine === void 0 || engine.kind !== backend || manifest.platform !== target) throw new Error(`Installed LibreOfficeKit ${backend} package has an incompatible or incomplete manifest.`);
	const minimum = engine.glibcMinimum;
	if (minimum !== void 0 && (!target.endsWith("-glibc") || !glibcVersion(minimum))) throw new Error("Installed LibreOfficeKit engine has an invalid glibcMinimum.");
	const glibcFloor = minimum === void 0 ? {} : { glibcMinimum: minimum };
	if (backend === "native") {
		const executable = await engineAsset(root, engine.executable, "executable", "file");
		return {
			backend,
			root,
			programDirectory: await engineAsset(root, engine.programDirectory, "programDirectory", "directory"),
			executable,
			...glibcFloor
		};
	}
	return {
		backend,
		root,
		programDirectory: String(engine.programDirectory),
		loader: await engineAsset(root, engine.loader, "loader", "file"),
		wasm: await engineAsset(root, engine.wasm, "wasm", "file"),
		data: await engineAsset(root, engine.data, "data", "file"),
		metadata: await engineAsset(root, engine.metadata, "metadata", "file"),
		...glibcFloor
	};
}
//#endregion
//#region lib/types/operations.js
/** Validated document operations shared by the public API, workers, and CLI. */
/** Conversions supported by the bundled Writer, Calc, and Impress components. */
const CONVERSION_FORMATS = [
	{
		inputs: [
			"doc",
			"docx",
			"odt"
		],
		outputs: [
			"pdf",
			"docx",
			"odt",
			"txt"
		]
	},
	{
		inputs: [
			"xls",
			"xlsx",
			"ods"
		],
		outputs: [
			"pdf",
			"xlsx",
			"ods",
			"csv"
		]
	},
	{
		inputs: [
			"ppt",
			"pptx",
			"odp"
		],
		outputs: [
			"pdf",
			"pptx",
			"odp"
		]
	}
];
/**
* Validate paths and the format matrix before file access or queue admission.
* @param request - Public conversion parameters.
* @param operation - PDF compatibility entry, general conversion, or workbook recalculation.
* @returns The explicit engine operation.
*/
function resolveConversion(request, operation) {
	if (!request || typeof request.inputPath !== "string" || typeof request.outputPath !== "string" || !isAbsolute(request.inputPath) || !isAbsolute(request.outputPath) || request.inputPath.includes("\0") || request.outputPath.includes("\0")) throw new TypeError("inputPath and outputPath must be absolute filesystem paths.");
	if (resolve(request.inputPath) === resolve(request.outputPath)) throw new TypeError("Input and output paths must differ.");
	const extension = extname(request.inputPath).slice(1).toLowerCase();
	const format = operation === "render" ? "pdf" : extname(request.outputPath).slice(1).toLowerCase();
	const family = CONVERSION_FORMATS.find((group) => group.inputs.includes(extension));
	if (!family || !family.outputs.includes(format)) throw new ConversionError("unsupported-format", `Unsupported conversion: ${extension || "(no input extension)"} → ${format || "(no output extension)"}.`);
	if (operation === "recalculate" && (![
		"xls",
		"xlsx",
		"ods"
	].includes(extension) || !["xlsx", "ods"].includes(format))) throw new ConversionError("unsupported-format", "Recalculation requires XLS, XLSX, or ODS input and XLSX or ODS output.");
	if (request.sheet !== void 0 && (format !== "csv" || typeof request.sheet !== "string" || !request.sheet.trim() || request.sheet.includes("\0"))) throw new TypeError("sheet must be a nonempty exact worksheet name and is supported only for CSV output.");
	return {
		inputPath: request.inputPath,
		outputPath: request.outputPath,
		extension,
		format,
		recalculate: operation === "recalculate",
		...request.sheet === void 0 ? {} : { sheet: request.sheet }
	};
}
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
//#region lib/types/runtime.js
/** Offline discovery of the installed engine and public entry points. */
/**
* Inspect installed engine metadata without starting, downloading, or building an engine.
* @returns Public entry paths, Node API version, and selected backend.
* @throws ConversionError when the installed engine is unavailable or invalid.
*/
async function discoverRuntime() {
	try {
		const engine = await resolveEngine();
		return {
			version: ENGINE_VERSION,
			backend: engine.backend,
			cliPath: fileURLToPath(new URL("./cli.js", import.meta.url)),
			nodeApiPath: fileURLToPath(new URL("./index.js", import.meta.url))
		};
	} catch (cause) {
		throw new ConversionError("unavailable", cause.message, { cause });
	}
}
//#endregion
//#region lib/types/font-snapshot-state.js
/** Shared in-flight metadata work with independent cancellation and joined Worker cleanup. */
/** Run one scan outside the event loop and join it before returning or cleaning its temporary file. */
async function runFontSnapshot(options, previous, signal) {
	signal.throwIfAborted();
	const temporaryPath = options.fontMetadataCacheDirectory === false ? void 0 : join(options.fontMetadataCacheDirectory, `.font-metadata-${randomUUID()}.tmp`);
	const data = {
		options,
		previous,
		...temporaryPath === void 0 ? {} : { temporaryPath }
	};
	const worker = new Worker(new URL("./font-snapshot-worker.js", import.meta.url), {
		workerData: data,
		execArgv: [],
		name: "libreoffice-font-metadata",
		stdout: true,
		stderr: true
	});
	worker.stdout.resume();
	worker.stderr.resume();
	const result = Promise.withResolvers();
	const abort = () => result.reject(signal.reason);
	signal.addEventListener("abort", abort, { once: true });
	worker.once("error", result.reject);
	worker.once("exit", (code) => result.reject(new ConversionError("failed", `Font metadata worker exited before returning a snapshot (${code}).`)));
	worker.once("message", (message) => {
		if (message.ok) result.resolve(message.snapshot);
		else result.reject(new ConversionError(failureCode(message), message.error));
	});
	try {
		return await result.promise;
	} finally {
		signal.removeEventListener("abort", abort);
		await worker.terminate();
		if (temporaryPath !== void 0) try {
			await rm(temporaryPath, { force: true });
		} catch {}
	}
}
/** Each acquisition refreshes inventory; overlapping acquisitions share only the active scan. */
var FontSnapshotState = class {
	previous = [];
	scan;
	/** Revalidate files for an operation without coupling its cancellation to other waiters. */
	async acquire(options, signal) {
		signal.throwIfAborted();
		while (this.scan?.controller.signal.aborted) {
			await this.scan.promise.catch(() => {});
			signal.throwIfAborted();
		}
		if (this.scan === void 0) {
			const controller = new AbortController();
			const promise = runFontSnapshot(options, this.previous, controller.signal).then((snapshot) => {
				this.previous = Buffer.byteLength(JSON.stringify(snapshot.records)) <= options.maxFontMetadataCacheBytes ? snapshot.records : [];
				return snapshot;
			}).finally(() => {
				this.scan = void 0;
			});
			this.scan = {
				controller,
				promise,
				waiters: 0
			};
		}
		const scan = this.scan;
		scan.waiters++;
		const cancelled = Promise.withResolvers();
		const abort = () => cancelled.reject(signal.reason);
		signal.addEventListener("abort", abort, { once: true });
		try {
			return await Promise.race([scan.promise, cancelled.promise]);
		} finally {
			signal.removeEventListener("abort", abort);
			scan.waiters--;
			if (scan.waiters === 0 && this.scan === scan) {
				scan.controller.abort(/* @__PURE__ */ new Error("All font scan waiters stopped."));
				await scan.promise.catch(() => {});
			}
		}
	}
	/** Release completed metadata after the owning factory has joined its operations. */
	clear() {
		this.previous = [];
	}
};
//#endregion
//#region lib/types/font-snapshot-validation.js
/** Verify the operation's source versions before publishing its output. */
/** Reject changed, removed, or replaced sources without exposing local font paths. */
async function validateFontSnapshot(snapshot) {
	await Promise.all(snapshot.records.map(async (record) => {
		try {
			const current = await lstat(record.path, { bigint: true });
			if (current.isFile() && matchesFontFile(current, record)) return;
		} catch {}
		throw new ConversionError("failed", "A system font changed during conversion; retry the operation.");
	}));
}
//#endregion
//#region lib/types/index.js
/** Convert caller-authorized disk documents with installed native or Node WASM engines. */
/** File identity that must match across a bounded read. */
const CHANGED_KEYS = [
	"size",
	"mtimeMs",
	"ctimeMs"
];
async function readBounded(path, limit, signal, role) {
	const file = await open(path, constants.O_RDONLY | constants.O_NONBLOCK | constants.O_NOFOLLOW);
	try {
		const before = await file.stat();
		const invalid = role === "input" ? "invalid-document" : "invalid-output";
		if (!before.isFile() || role === "input" && before.size < 1) throw new ConversionError(invalid, "Document must be a nonempty regular file.");
		if (before.size > limit) throw new ConversionError(`${role}-too-large`, `Document exceeds its ${role} byte limit.`);
		const bytes = Buffer.alloc(before.size);
		for (let offset = 0; offset < bytes.length;) {
			signal.throwIfAborted();
			const { bytesRead } = await file.read(bytes, offset, bytes.length - offset, offset);
			if (!bytesRead) throw new ConversionError(invalid, "Document was truncated while reading.");
			offset += bytesRead;
		}
		const after = await file.stat();
		if (CHANGED_KEYS.some((key) => before[key] !== after[key])) throw new ConversionError(invalid, "Document changed while reading.");
		signal.throwIfAborted();
		return bytes;
	} finally {
		await file.close();
	}
}
async function runWorker(data, signal, onFontCache) {
	signal.throwIfAborted();
	const worker = new Worker(new URL("./worker.js", import.meta.url), {
		workerData: data,
		name: "libreoffice-conversion",
		execArgv: [],
		stdout: true,
		stderr: true
	});
	worker.stdout.resume();
	worker.stderr.resume();
	const settled = Promise.withResolvers();
	const abort = () => {
		settled.reject(signal.reason);
	};
	signal.addEventListener("abort", abort, { once: true });
	worker.once("error", settled.reject);
	worker.once("exit", (code) => {
		settled.reject(new ConversionError("failed", `LibreOffice worker exited before returning a result (${code}).`));
	});
	worker.on("message", (message) => {
		if (message.kind === "font-cache") onFontCache(message.entries);
		else if (message.ok) settled.resolve(message);
		else settled.reject(new ConversionError(failureCode(message), message.error));
	});
	try {
		return await settled.promise;
	} finally {
		signal.removeEventListener("abort", abort);
		await worker.terminate();
	}
}
const DEFAULT_SHARED_STATE_LIMIT = 16;
const defaultSharedStates = /* @__PURE__ */ new Map();
function sharedStateKey(options, engine) {
	return JSON.stringify({
		engine,
		fontDirectories: options.fontDirectories,
		includeOfficeFonts: options.includeOfficeFonts,
		fontFallbacks: options.fontFallbacks,
		initialFontFamilies: options.initialFontFamilies,
		maxFontFiles: options.maxFontFiles,
		maxFontFileBytes: options.maxFontFileBytes,
		maxLoadedFontBytes: options.maxLoadedFontBytes,
		maxFontResolutionEntries: options.maxFontResolutionEntries,
		fontMetadataCacheDirectory: options.fontMetadataCacheDirectory,
		maxFontMetadataCacheBytes: options.maxFontMetadataCacheBytes
	});
}
function defaultSharedState(options, engine) {
	const key = sharedStateKey(options, engine);
	const existing = defaultSharedStates.get(key);
	if (existing !== void 0) {
		defaultSharedStates.delete(key);
		defaultSharedStates.set(key, existing);
		return existing;
	}
	const state = {
		snapshots: new FontSnapshotState(),
		generation: void 0,
		fontCache: /* @__PURE__ */ new Map()
	};
	defaultSharedStates.set(key, state);
	while (defaultSharedStates.size > DEFAULT_SHARED_STATE_LIMIT) defaultSharedStates.delete(defaultSharedStates.keys().next().value);
	return state;
}
async function resolveConverter(options) {
	const resolvedOptions = resolveOptions(options);
	let engine;
	try {
		engine = await resolveEngine();
	} catch (cause) {
		throw new ConversionError("unavailable", cause.message, { cause });
	}
	return {
		options: resolvedOptions,
		engine
	};
}
function createConverterWith(resolvedOptions, engine, shared, onDispose) {
	const lifetime = new AbortController();
	const active = /* @__PURE__ */ new Set();
	const waiting = /* @__PURE__ */ new Set();
	let running = false;
	let disposal;
	const mergeCache = (generation, entries) => {
		if (shared.generation !== generation) return;
		for (const entry of entries) {
			const prior = shared.fontCache.get(entry.key);
			const faces = new Map((prior?.faces ?? []).map((face) => [`${face.path}\0${face.faceIndex}`, face]));
			for (const face of entry.faces) faces.set(`${face.path}\0${face.faceIndex}`, face);
			const merged = {
				...entry,
				codePoints: [.../* @__PURE__ */ new Set([...prior?.codePoints ?? [], ...entry.codePoints])].sort((left, right) => left - right),
				emptyRequest: prior?.emptyRequest === true || entry.emptyRequest,
				faces: [...faces.values()],
				...(prior?.missingFamily ?? entry.missingFamily) === void 0 ? {} : { missingFamily: prior?.missingFamily ?? entry.missingFamily }
			};
			shared.fontCache.delete(entry.key);
			shared.fontCache.set(entry.key, merged);
		}
		while (shared.fontCache.size > resolvedOptions.maxFontResolutionEntries) shared.fontCache.delete(shared.fontCache.keys().next().value);
	};
	async function snapshot(signal) {
		const current = await shared.snapshots.acquire(resolvedOptions, signal);
		if (shared.generation !== current.generation) {
			shared.generation = current.generation;
			shared.fontCache.clear();
		}
		return current;
	}
	async function acquire(signal) {
		while (running) {
			signal.throwIfAborted();
			await new Promise((resolve, reject) => {
				const cleanup = () => {
					waiting.delete(wake);
					signal.removeEventListener("abort", abort);
				};
				const wake = () => {
					cleanup();
					resolve();
				};
				const abort = () => {
					cleanup();
					reject(signal.reason);
				};
				waiting.add(wake);
				signal.addEventListener("abort", abort, { once: true });
			});
		}
		signal.throwIfAborted();
		running = true;
	}
	async function execute(request, signal) {
		const { extension, format } = request;
		await acquire(signal);
		const deadline = new AbortController();
		const stopped = AbortSignal.any([signal, deadline.signal]);
		const timer = setTimeout(() => {
			deadline.abort(new ConversionError("timeout", "LibreOffice conversion timed out."));
		}, resolvedOptions.timeoutMs);
		let scratch;
		let output;
		let succeeded = false;
		let failure;
		try {
			stopped.throwIfAborted();
			output = await open(request.outputPath, "wx", 384);
			const sourceBytes = await readBounded(request.inputPath, resolvedOptions.maxInputBytes, stopped, "input");
			scratch = await mkdtemp(join(tmpdir(), "libreoffice-kit-"));
			const inputPath = join(scratch, `document.${extension}`);
			const input = await open(inputPath, "wx", 384);
			try {
				await input.writeFile(sourceBytes);
			} finally {
				await input.close();
			}
			const fonts = await snapshot(stopped);
			const result = await runWorker({
				inputPath,
				extension,
				operation: request,
				options: resolvedOptions,
				engine,
				scratch,
				fontFaces: fonts.faces,
				fontCache: [...shared.fontCache.values()]
			}, stopped, (entries) => mergeCache(fonts.generation, entries));
			if ("images" in result) throw new ConversionError("failed", "Conversion worker returned an image batch for an export request.");
			let bytes;
			if ("output" in result) bytes = result.output;
			else {
				const native = engine;
				const profile = join(scratch, "profile");
				await mkdir(profile, { mode: 448 });
				const path = join(scratch, `output.${format}`);
				await runNative(native, resolvedOptions, inputPath, path, profile, result.fonts, result.substitutions, stopped, request);
				bytes = await readBounded(path, resolvedOptions.maxOutputBytes, stopped, "output");
			}
			validateOutput(bytes, format);
			await validateFontSnapshot(fonts);
			stopped.throwIfAborted();
			await output.writeFile(bytes);
			stopped.throwIfAborted();
			succeeded = true;
			return {
				backend: engine.backend,
				missingFonts: result.missingFonts
			};
		} catch (error) {
			failure = error;
			throw error;
		} finally {
			clearTimeout(timer);
			try {
				const errors = [];
				try {
					await output?.close();
				} catch (error) {
					errors.push(error);
				}
				const cleanup = await Promise.allSettled([...output && !succeeded ? [unlink(request.outputPath)] : [], ...scratch ? [rm(scratch, {
					recursive: true,
					force: true
				})] : []]);
				for (const result of cleanup) if (result.status === "rejected") errors.push(result.reason);
				if (errors.length) throw new AggregateError(failure ? [failure, ...errors] : errors, "LibreOffice conversion cleanup failed.");
			} finally {
				running = false;
				for (const wake of [...waiting]) wake();
			}
		}
	}
	async function executeImages(request, signal) {
		await acquire(signal);
		const deadline = new AbortController();
		const stopped = AbortSignal.any([signal, deadline.signal]);
		const timer = setTimeout(() => deadline.abort(new ConversionError("timeout", "LibreOffice image rendering timed out.")), resolvedOptions.timeoutMs);
		let scratch;
		let owned = false;
		let succeeded = false;
		try {
			stopped.throwIfAborted();
			await mkdir(request.outputDir, { mode: 448 });
			owned = true;
			const source = await readBounded(request.inputPath, resolvedOptions.maxInputBytes, stopped, "input");
			scratch = await mkdtemp(join(tmpdir(), "libreoffice-kit-images-"));
			const inputPath = join(scratch, `document.${request.extension}`);
			await writeFile(inputPath, source, {
				flag: "wx",
				mode: 384
			});
			const fonts = await snapshot(stopped);
			const result = await runWorker({
				inputPath,
				extension: request.extension,
				operation: request,
				options: resolvedOptions,
				engine,
				scratch,
				fontFaces: fonts.faces,
				fontCache: [...shared.fontCache.values()]
			}, stopped, (entries) => mergeCache(fonts.generation, entries));
			let images;
			if ("images" in result) images = result.images;
			else if ("fonts" in result) {
				const profile = join(scratch, "profile");
				images = await renderImagesWithNative({
					engine,
					options: resolvedOptions,
					inputPath,
					source,
					scratch,
					profile,
					fonts: result.fonts,
					substitutions: result.substitutions,
					missingFonts: result.missingFonts,
					operation: request,
					signal: stopped
				});
			} else throw new ConversionError("failed", "Image worker did not return its manifest.");
			await validateFontSnapshot(fonts);
			stopped.throwIfAborted();
			await writeFile(join(request.outputDir, "manifest.json"), `${JSON.stringify(images, null, 2)}\n`, {
				flag: "wx",
				mode: 384
			});
			stopped.throwIfAborted();
			succeeded = true;
			return images;
		} finally {
			clearTimeout(timer);
			try {
				const failures = (await Promise.allSettled([...scratch ? [rm(scratch, {
					recursive: true,
					force: true
				})] : [], ...owned && !succeeded ? [rm(request.outputDir, {
					recursive: true,
					force: true
				})] : []])).filter((result) => result.status === "rejected");
				if (failures.length) throw new AggregateError(failures.map((result) => result.reason), "Image batch cleanup failed.");
			} finally {
				running = false;
				for (const wake of [...waiting]) wake();
			}
		}
	}
	async function submit(request, operation, signal) {
		const task = execute(resolveConversion(request, operation), signal ? AbortSignal.any([signal, lifetime.signal]) : lifetime.signal);
		active.add(task);
		task.finally(() => {
			active.delete(task);
		}).catch((_error) => {});
		return task;
	}
	const converter = {
		backend: engine.backend,
		render: (request, signal) => submit(request, "render", signal),
		async renderImages(request, signal) {
			const task = executeImages(resolveImageRender(request), signal ? AbortSignal.any([signal, lifetime.signal]) : lifetime.signal);
			active.add(task);
			task.finally(() => active.delete(task)).catch(() => {});
			return task;
		},
		convert: (request, signal) => submit(request, "convert", signal),
		recalculate: (request, signal) => submit(request, "recalculate", signal),
		dispose() {
			disposal ??= (async () => {
				lifetime.abort(/* @__PURE__ */ new Error("LibreOffice converter is disposed."));
				await Promise.allSettled(active);
				onDispose?.(converter);
			})();
			return disposal;
		}
	};
	return converter;
}
/** Create one converter with process-shared, configuration-isolated bounded font metadata. */
async function createConverter(options) {
	const { options: resolvedOptions, engine } = await resolveConverter(options);
	return createConverterWith(resolvedOptions, engine, defaultSharedState(resolvedOptions, engine));
}
//#endregion
//#region lib/types/cli.js
/** Offline CLI over the public converter; stdout contains one JSON result. */
const numericOptions = {
	"timeout-ms": "timeoutMs",
	"max-input-bytes": "maxInputBytes",
	"max-output-bytes": "maxOutputBytes",
	"max-image-resolution": "maxImageResolution",
	"max-archive-entries": "maxArchiveEntries",
	"max-uncompressed-bytes": "maxUncompressedBytes",
	"max-font-files": "maxFontFiles",
	"max-font-file-bytes": "maxFontFileBytes",
	"max-loaded-font-bytes": "maxLoadedFontBytes"
};
async function main() {
	const { values, positionals } = parseArgs({
		allowPositionals: true,
		strict: true,
		options: {
			json: { type: "boolean" },
			input: { type: "string" },
			output: { type: "string" },
			sheet: { type: "string" },
			"font-directory": {
				type: "string",
				multiple: true
			},
			"initial-font-family": {
				type: "string",
				multiple: true
			},
			"font-fallbacks": { type: "string" },
			"output-dir": { type: "string" },
			pages: { type: "string" },
			range: { type: "string" },
			dpi: { type: "string" },
			"max-pages": { type: "string" },
			"max-pixels": { type: "string" },
			"max-dimension": { type: "string" },
			...Object.fromEntries(Object.keys(numericOptions).map((key) => [key, { type: "string" }]))
		}
	});
	const command = positionals[0] ?? "";
	if (positionals.length !== 1 || ![
		"capabilities",
		"convert",
		"recalculate",
		"render"
	].includes(command)) throw new TypeError("Usage: dsoffice capabilities --json | render --input <file> --output-dir <fresh-directory> [--pages all|1,3] [--sheet <name> --range A1:D20] [--dpi 144] | convert --input <file> --output <file> [--sheet <name>] | recalculate --input <workbook> --output <xlsx|ods>");
	if (command === "capabilities") {
		if (Object.keys(values).some((key) => key !== "json")) throw new TypeError("capabilities accepts only --json.");
		process.stdout.write(`${JSON.stringify({
			runtime: await discoverRuntime(),
			conversions: CONVERSION_FORMATS,
			imageRendering: {
				inputs: IMAGE_FORMATS,
				output: "png",
				officeBackend: "libreoffice",
				pdfBackend: "pdfium",
				pages: "one-based physical pages or slides; all by default",
				worksheets: "exact sheet plus optional A1 range; all visible data areas by default",
				maxPages: 100,
				maxPixels: 16777216,
				maxDimension: 8192
			},
			csv: {
				sheet: "exact name; required when the input has multiple worksheets",
				encoding: "UTF-8",
				delimiter: ","
			},
			recalculation: {
				inputs: [
					"xls",
					"xlsx",
					"ods"
				],
				outputs: ["xlsx", "ods"],
				preservesFormulas: true
			},
			options: {
				limits: Object.keys(numericOptions),
				fonts: [
					"font-directory",
					"initial-font-family",
					"font-fallbacks"
				]
			}
		})}\n`);
		return;
	}
	if (typeof values.input !== "string") throw new TypeError("--input is required.");
	if (command === "render") {
		if (typeof values["output-dir"] !== "string" || values.output !== void 0) throw new TypeError("render requires --output-dir and does not accept --output.");
	} else {
		if (typeof values.output !== "string") throw new TypeError("--input and --output are required.");
		if ([
			"output-dir",
			"pages",
			"range",
			"dpi",
			"max-pages",
			"max-pixels",
			"max-dimension"
		].some((key) => key in values)) throw new TypeError("Image selection options require the render command.");
	}
	const options = {};
	for (const [flag, key] of Object.entries(numericOptions)) {
		const value = values[flag];
		if (value !== void 0) {
			if (typeof value !== "string" || !/^\d+$/.test(value)) throw new TypeError(`--${flag} must be a positive integer.`);
			options[key] = Number(value);
		}
	}
	if (values["font-directory"]) options.fontDirectories = values["font-directory"].map((path) => resolve(path));
	if (values["initial-font-family"]) options.initialFontFamilies = values["initial-font-family"];
	if (values["font-fallbacks"]) options.fontFallbacks = JSON.parse(values["font-fallbacks"]);
	const request = {
		inputPath: resolve(values.input),
		outputPath: typeof values.output === "string" ? resolve(values.output) : "",
		...values.sheet === void 0 ? {} : { sheet: values.sheet }
	};
	if (command === "recalculate" && request.sheet !== void 0) throw new TypeError("--sheet is supported only for CSV conversion.");
	const converter = await createConverter(options);
	const controller = new AbortController();
	const cancel = () => {
		controller.abort(/* @__PURE__ */ new Error("LibreOffice CLI was cancelled."));
	};
	process.once("SIGINT", cancel);
	process.once("SIGTERM", cancel);
	try {
		if (command === "render") {
			const pageText = values.pages;
			if (pageText !== void 0 && pageText !== "all" && !/^[1-9]\d*(?:,[1-9]\d*)*$/.test(pageText)) throw new TypeError("--pages must be all or comma-separated one-based page numbers.");
			const result = await converter.renderImages({
				inputPath: request.inputPath,
				outputDir: resolve(values["output-dir"]),
				...pageText === void 0 ? {} : { pages: pageText === "all" ? "all" : pageText.split(",").map(Number) },
				...request.sheet === void 0 ? {} : { sheet: request.sheet },
				...values.range === void 0 ? {} : { range: values.range },
				...values.dpi === void 0 ? {} : { dpi: Number(values.dpi) },
				...values["max-pages"] === void 0 ? {} : { maxPages: Number(values["max-pages"]) },
				...values["max-pixels"] === void 0 ? {} : { maxPixels: Number(values["max-pixels"]) },
				...values["max-dimension"] === void 0 ? {} : { maxDimension: Number(values["max-dimension"]) }
			}, controller.signal);
			process.stdout.write(`${JSON.stringify(result)}\n`);
			return;
		}
		const result = command === "recalculate" ? await converter.recalculate(request, controller.signal) : await converter.convert(request, controller.signal);
		process.stdout.write(`${JSON.stringify({
			...result,
			outputPath: request.outputPath
		})}\n`);
	} finally {
		process.removeListener("SIGINT", cancel);
		process.removeListener("SIGTERM", cancel);
		await converter.dispose();
	}
}
try {
	await main();
} catch (error) {
	process.stderr.write(`${JSON.stringify({
		code: failureCode(error),
		error: error instanceof Error ? error.message : String(error)
	})}\n`);
	process.exitCode = 1;
}
//#endregion
export {};
