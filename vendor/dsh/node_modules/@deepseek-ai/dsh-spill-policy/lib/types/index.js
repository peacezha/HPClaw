import z from '@deepseek-ai/schemastery';
import { createUserMessage, resolveImageAttachmentAccess } from '@deepseek-ai/dsh-llm';
import { estimateContent } from '@deepseek-ai/dsh-token-meter/estimate';
import { formatSpillNotice } from "./notice.js";
import { retainContent } from "./retention.js";
/** Cordis plugin identity. */
export const name = 'spill-policy';
/** Tools own both model-facing results and PTC dispatch logs. */
export const inject = ['tools'];
export const Config = z.object({ maxInlineTokens: z.number() });
/** Narrow the model's ordered content without rewriting unsupported blocks. */
function retainable(content) {
    return content.every(block => block.type === 'text' || block.type === 'image');
}
const GAP = { type: 'text', text: '\n\n[...]\n\n' };
/**
 * Mount token retention for accepted tool results and PTC log copies.
 * @param ctx - tool registry and optional pricing, filesystem, attachment, and spill services.
 * @param config - maximum estimated result tokens; omission disables the plugin.
 */
export function apply(ctx, config) {
    const cap = config.maxInlineTokens;
    if (cap === undefined)
        return;
    if (!Number.isSafeInteger(cap) || cap < 0) {
        throw new Error(`spill-policy: maxInlineTokens must be a non-negative integer (got ${cap})`);
    }
    const maxTokens = cap;
    /** Price actual request images and their accompanying descriptor text. */
    function pricing(exec, images) {
        const costs = new Map();
        if (images.length > 0) {
            const routed = exec.agent?.session.requestHeader()?.config;
            const provider = routed?.provider ?? exec.agent?.options.provider;
            const model = routed?.model ?? exec.agent?.options.model;
            const calculator = provider === undefined || model === undefined
                ? undefined
                : ctx.get('llm')?.imageRequestPricing(provider, model);
            if (calculator === undefined)
                throw new Error('the current model has no image token calculator');
            const prices = calculator.priceImages(images);
            if (prices.length !== images.length)
                throw new Error('image token calculator returned an inconsistent occurrence count');
            for (const [index, image] of images.entries()) {
                const cost = prices[index];
                costs.set(image, cost.visualTokens + estimateContent([{ type: 'text', text: cost.text }]));
            }
        }
        return block => block.type === 'image' ? costs.get(block) : estimateContent([block]);
    }
    /** Full ordered text with an execution-readable attachment path at each image position. */
    function fullText(content) {
        return content.map((block) => {
            if (block.type === 'text')
                return block.text;
            const attachments = ctx.get('attachments');
            const fs = ctx.get('fs');
            const access = attachments === undefined || fs === undefined ? undefined : resolveImageAttachmentAccess(attachments, path => fs.processPathFromHostPath(path), block.attachment);
            if (access === undefined)
                throw new Error(`image ${block.attachment.attachmentId} has no readable attachment path`);
            return `\n[Image: ${JSON.stringify(access.readonlyPath)}; ${block.attachment.mediaType}; ${block.attachment.width}x${block.attachment.height}. Use read_image to view it.]\n`;
        }).join('');
    }
    /** Recoverably bound one display copy; failures leave successful tool content visible. */
    async function bound(exec, content, toolName, callId, label) {
        if (!retainable(content))
            return undefined;
        try {
            const images = content.filter((block) => block.type === 'image');
            const price = pricing(exec, images);
            if (content.reduce((total, block) => total + price(block), 0) <= maxTokens)
                return undefined;
            const owner = exec.agent?.session.header.id;
            if (owner === undefined)
                throw new Error(`no session owner for ${toolName} ${label}`);
            const spillStore = ctx.get('spillStore');
            if (spillStore === undefined)
                throw new Error('no ctx.spillStore backend loaded');
            const ref = await spillStore.saveText({
                owner: { sessionId: owner }, source: { kind: 'tool', toolName, callId, label },
                suggestedName: `${toolName}.txt`, content: fullText(content),
            });
            const totalBytes = content.reduce((total, block) => total + (block.type === 'text' ? Buffer.byteLength(block.text, 'utf8') : 0), 0);
            const notice = (bytes, count) => ({
                type: 'text', text: formatSpillNotice({ kind: 'exact', count: bytes }, ref, count),
            });
            const worstNotice = notice(totalBytes, images.length);
            const reserved = price(GAP) + price({ type: 'text', text: `\n\n${worstNotice.text}` });
            if (price(worstNotice) > maxTokens)
                throw new Error(`spill notice for ${toolName} exceeds maxInlineTokens`);
            const retained = retainContent(content, Math.max(0, maxTokens - reserved), price);
            const footer = notice(retained.omittedBytes, retained.omittedImages);
            const result = retained.head.length + retained.tail.length === 0
                ? [footer]
                : [...retained.head, GAP, ...retained.tail, { type: 'text', text: `\n\n${footer.text}` }];
            // Adjacent text has one framing cost on the wire and in the spill preview.
            const merged = [];
            for (const block of result) {
                const previous = merged.at(-1);
                if (block.type === 'text' && previous?.type === 'text')
                    previous.text += block.text;
                else
                    merged.push(block.type === 'text' ? { ...block } : block);
            }
            return merged;
        }
        catch (error) {
            ctx.logger.warn(`spill-policy: ${String(error)}; keeping the inline content`);
            return undefined;
        }
    }
    ctx.on('tools/post-execute', async (exec, result, next) => {
        const decision = await next();
        if (decision.kind !== 'accept' || Object.hasOwn(decision, 'value') || exec.name === 'read')
            return decision;
        const content = decision.content ?? result.content;
        const hasImages = content.some(block => block.type === 'image');
        // Text-only PTC bindings retain their asynchronous log-only spill path.
        if (exec.parent !== undefined && !hasImages)
            return decision;
        const retained = await bound(exec, content, exec.name, exec.callId, exec.parent === undefined ? 'result' : 'dispatch');
        if (retained === undefined)
            return decision;
        const additionalContexts = [...decision.additionalContexts ?? []];
        if (exec.parent !== undefined && !result.isError && hasImages && !retained.some(block => block.type === 'image')) {
            additionalContexts.push(createUserMessage({ content: retained, source: { kind: 'ptc-mode' } }));
        }
        return {
            kind: 'accept', content: retained,
            ...additionalContexts.length > 0 ? { additionalContexts } : {},
        };
    }, { prepend: true });
    ctx.on('tools/ptc-dispatch-log', async (dispatch, next) => {
        const content = await next();
        return await bound(dispatch.exec, content, dispatch.name, dispatch.subCallId, 'dispatch') ?? content;
    }, { prepend: true });
}
//# sourceMappingURL=index.js.map