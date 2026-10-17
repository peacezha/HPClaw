import z from "@deepseek-ai/schemastery";
import { createUserMessage, resolveImageAttachmentAccess } from "@deepseek-ai/dsh-llm";
import { estimateContent } from "@deepseek-ai/dsh-token-meter/estimate";
import { describeOmitted } from "@deepseek-ai/dsh-output-retention";
//#region lib/types/notice.js
/** Browser-safe formatting and recognition of persisted spill-policy notices. */
const OPEN = "(";
const CLOSE = ")";
const LOCATION = " Full formatted result stored at: ";
const GUIDANCE_SEPARATOR = ". ";
const EXACT_OMISSION = describeOmitted({
	kind: "exact",
	count: 0
}, "bytes");
const COUNT_OFFSET = EXACT_OMISSION.indexOf("0");
EXACT_OMISSION.slice(COUNT_OFFSET + 1);
/**
* Format the notice appended to a retained preview, preserving its persisted spelling.
* @param omitted - bytes omitted by the retention policy.
* @param ref - saved text locator and retrieval guidance.
* @param images - number of whole images omitted alongside text.
* @returns the complete notice without a leading preview separator.
*/
function formatSpillNotice(omitted, ref, images = 0) {
	const imageNotice = images > 0 ? ` Omitted ${images} images.` : "";
	return `${OPEN}${describeOmitted(omitted, "bytes")}${imageNotice}${LOCATION}${ref.locator}${GUIDANCE_SEPARATOR}${ref.retrievalHint}${CLOSE}`;
}
//#endregion
//#region lib/types/retention.js
/** Preserve a UTF-16 code point when a text budget cuts between its surrogates. */
function textSlice(text, length, tail) {
	let cut = tail ? text.length - length : length;
	const previous = text.charCodeAt(cut - 1);
	const current = text.charCodeAt(cut);
	if (previous >= 55296 && previous <= 56319 && current >= 56320 && current <= 57343) cut += tail ? 1 : -1;
	return tail ? text.slice(cut) : text.slice(0, cut);
}
/** Largest contiguous text end fitting a monotonic token estimate. */
function fitText(text, budget, tail, price) {
	let low = 0;
	let high = text.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		const candidate = textSlice(text, middle, tail);
		if (candidate.length === 0 || price({
			type: "text",
			text: candidate
		}) <= budget) low = middle;
		else high = middle - 1;
	}
	return textSlice(text, low, tail);
}
/**
* Retain contiguous ends without moving or partially retaining an image.
* Each end receives half the content budget; unused space at an indivisible
* image stays unused. Text pricing must be monotonic in retained length.
* @param content - ordered text and image blocks whose total price exceeds budget.
* @param budget - non-negative integer token budget after reserving notices.
* @param price - model-route cost of one retained block, including its framing.
* @returns retained ends and omitted UTF-8 text bytes and whole images.
*/
function retainContent(content, budget, price) {
	const head = [];
	const tail = [];
	let first = 0;
	let last = content.length - 1;
	let headCharacters = 0;
	let remaining = Math.ceil(budget / 2);
	while (first <= last) {
		const block = content[first];
		const cost = price(block);
		if (cost <= remaining) {
			head.push(block);
			remaining -= cost;
			first++;
			continue;
		}
		if (block.type === "text") {
			const text = fitText(block.text, remaining, false, price);
			headCharacters = text.length;
			if (text.length > 0) head.push({
				type: "text",
				text
			});
		}
		break;
	}
	remaining = Math.floor(budget / 2);
	while (last >= first) {
		const original = content[last];
		const block = last === first && original.type === "text" ? {
			type: "text",
			text: original.text.slice(headCharacters)
		} : original;
		const cost = price(block);
		if (cost <= remaining) {
			tail.push(block);
			remaining -= cost;
			last--;
			continue;
		}
		if (block.type === "text") {
			const text = fitText(block.text, remaining, true, price);
			if (text.length > 0) tail.push({
				type: "text",
				text
			});
		}
		break;
	}
	tail.reverse();
	const bytes = (blocks) => blocks.reduce((total, block) => total + (block.type === "text" ? Buffer.byteLength(block.text, "utf8") : 0), 0);
	const images = (blocks) => blocks.filter((block) => block.type === "image").length;
	return {
		head,
		tail,
		omittedBytes: bytes(content) - bytes(head) - bytes(tail),
		omittedImages: images(content) - images(head) - images(tail)
	};
}
//#endregion
//#region lib/types/index.js
/** Cordis plugin identity. */
const name = "spill-policy";
/** Tools own both model-facing results and PTC dispatch logs. */
const inject = ["tools"];
const Config = z.object({ maxInlineTokens: z.number() });
/** Narrow the model's ordered content without rewriting unsupported blocks. */
function retainable(content) {
	return content.every((block) => block.type === "text" || block.type === "image");
}
const GAP = {
	type: "text",
	text: "\n\n[...]\n\n"
};
/**
* Mount token retention for accepted tool results and PTC log copies.
* @param ctx - tool registry and optional pricing, filesystem, attachment, and spill services.
* @param config - maximum estimated result tokens; omission disables the plugin.
*/
function apply(ctx, config) {
	const cap = config.maxInlineTokens;
	if (cap === void 0) return;
	if (!Number.isSafeInteger(cap) || cap < 0) throw new Error(`spill-policy: maxInlineTokens must be a non-negative integer (got ${cap})`);
	const maxTokens = cap;
	/** Price actual request images and their accompanying descriptor text. */
	function pricing(exec, images) {
		const costs = /* @__PURE__ */ new Map();
		if (images.length > 0) {
			const routed = exec.agent?.session.requestHeader()?.config;
			const provider = routed?.provider ?? exec.agent?.options.provider;
			const model = routed?.model ?? exec.agent?.options.model;
			const calculator = provider === void 0 || model === void 0 ? void 0 : ctx.get("llm")?.imageRequestPricing(provider, model);
			if (calculator === void 0) throw new Error("the current model has no image token calculator");
			const prices = calculator.priceImages(images);
			if (prices.length !== images.length) throw new Error("image token calculator returned an inconsistent occurrence count");
			for (const [index, image] of images.entries()) {
				const cost = prices[index];
				costs.set(image, cost.visualTokens + estimateContent([{
					type: "text",
					text: cost.text
				}]));
			}
		}
		return (block) => block.type === "image" ? costs.get(block) : estimateContent([block]);
	}
	/** Full ordered text with an execution-readable attachment path at each image position. */
	function fullText(content) {
		return content.map((block) => {
			if (block.type === "text") return block.text;
			const attachments = ctx.get("attachments");
			const fs = ctx.get("fs");
			const access = attachments === void 0 || fs === void 0 ? void 0 : resolveImageAttachmentAccess(attachments, (path) => fs.processPathFromHostPath(path), block.attachment);
			if (access === void 0) throw new Error(`image ${block.attachment.attachmentId} has no readable attachment path`);
			return `\n[Image: ${JSON.stringify(access.readonlyPath)}; ${block.attachment.mediaType}; ${block.attachment.width}x${block.attachment.height}. Use read_image to view it.]\n`;
		}).join("");
	}
	/** Recoverably bound one display copy; failures leave successful tool content visible. */
	async function bound(exec, content, toolName, callId, label) {
		if (!retainable(content)) return void 0;
		try {
			const images = content.filter((block) => block.type === "image");
			const price = pricing(exec, images);
			if (content.reduce((total, block) => total + price(block), 0) <= maxTokens) return void 0;
			const owner = exec.agent?.session.header.id;
			if (owner === void 0) throw new Error(`no session owner for ${toolName} ${label}`);
			const spillStore = ctx.get("spillStore");
			if (spillStore === void 0) throw new Error("no ctx.spillStore backend loaded");
			const ref = await spillStore.saveText({
				owner: { sessionId: owner },
				source: {
					kind: "tool",
					toolName,
					callId,
					label
				},
				suggestedName: `${toolName}.txt`,
				content: fullText(content)
			});
			const totalBytes = content.reduce((total, block) => total + (block.type === "text" ? Buffer.byteLength(block.text, "utf8") : 0), 0);
			const notice = (bytes, count) => ({
				type: "text",
				text: formatSpillNotice({
					kind: "exact",
					count: bytes
				}, ref, count)
			});
			const worstNotice = notice(totalBytes, images.length);
			const reserved = price(GAP) + price({
				type: "text",
				text: `\n\n${worstNotice.text}`
			});
			if (price(worstNotice) > maxTokens) throw new Error(`spill notice for ${toolName} exceeds maxInlineTokens`);
			const retained = retainContent(content, Math.max(0, maxTokens - reserved), price);
			const footer = notice(retained.omittedBytes, retained.omittedImages);
			const result = retained.head.length + retained.tail.length === 0 ? [footer] : [
				...retained.head,
				GAP,
				...retained.tail,
				{
					type: "text",
					text: `\n\n${footer.text}`
				}
			];
			const merged = [];
			for (const block of result) {
				const previous = merged.at(-1);
				if (block.type === "text" && previous?.type === "text") previous.text += block.text;
				else merged.push(block.type === "text" ? { ...block } : block);
			}
			return merged;
		} catch (error) {
			ctx.logger.warn(`spill-policy: ${String(error)}; keeping the inline content`);
			return;
		}
	}
	ctx.on("tools/post-execute", async (exec, result, next) => {
		const decision = await next();
		if (decision.kind !== "accept" || Object.hasOwn(decision, "value") || exec.name === "read") return decision;
		const content = decision.content ?? result.content;
		const hasImages = content.some((block) => block.type === "image");
		if (exec.parent !== void 0 && !hasImages) return decision;
		const retained = await bound(exec, content, exec.name, exec.callId, exec.parent === void 0 ? "result" : "dispatch");
		if (retained === void 0) return decision;
		const additionalContexts = [...decision.additionalContexts ?? []];
		if (exec.parent !== void 0 && !result.isError && hasImages && !retained.some((block) => block.type === "image")) additionalContexts.push(createUserMessage({
			content: retained,
			source: { kind: "ptc-mode" }
		}));
		return {
			kind: "accept",
			content: retained,
			...additionalContexts.length > 0 ? { additionalContexts } : {}
		};
	}, { prepend: true });
	ctx.on("tools/ptc-dispatch-log", async (dispatch, next) => {
		const content = await next();
		return await bound(dispatch.exec, content, dispatch.name, dispatch.subCallId, "dispatch") ?? content;
	}, { prepend: true });
}
//#endregion
export { Config, apply, inject, name };
