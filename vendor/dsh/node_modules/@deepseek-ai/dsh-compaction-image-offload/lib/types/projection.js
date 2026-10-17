/** Browser-safe durable image selection declaration and pure replay definition. */
import { offloadMessageImages } from "./project-message.js";
/** Whether a durable value is a JSON object. */
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/** Whether a durable occurrence index or sequence is canonical. */
function isIndex(value) {
    return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && !Object.is(value, -0);
}
/** Atomic validation and reconstruction shared by live sessions and detached replay. */
export const imageOffloadProjection = {
    type: 'image/offload',
    project(event, context) {
        const data = event.data;
        if (!isRecord(data) || Object.keys(data).length !== 1 || !Array.isArray(data['targets']) || data['targets'].length === 0) {
            throw new Error('image/offload: data must contain a nonempty targets array');
        }
        const messages = new Map();
        const nodes = new Set(context.nodes);
        for (const target of data['targets']) {
            if (!isRecord(target) || Object.keys(target).length !== 2 || !isIndex(target['seq'])
                || !Array.isArray(target['imageIndexes']) || target['imageIndexes'].length === 0) {
                throw new Error('image/offload: each target must contain a seq and nonempty imageIndexes');
            }
            const seq = target['seq'];
            if (messages.has(seq))
                throw new Error(`image/offload: duplicate target seq ${seq}`);
            if (!nodes.has(seq))
                throw new Error(`image/offload: target seq ${seq} is not a current surface node`);
            const source = context.events[seq - context.baseSeq];
            if (source?.type !== 'user/message' && source?.type !== 'tool/result') {
                throw new Error(`image/offload: target seq ${seq} must be user/message or tool/result`);
            }
            let previous = -1;
            for (const index of target['imageIndexes']) {
                if (!isIndex(index) || index <= previous) {
                    throw new Error('image/offload: imageIndexes must be strictly increasing non-negative safe integers');
                }
                previous = index;
            }
            const message = context.messages.get(seq)
                ?? (source.type === 'user/message' ? source.data : source.data.message);
            messages.set(seq, offloadMessageImages(message, target['imageIndexes']));
        }
        return messages;
    },
};
//# sourceMappingURL=projection.js.map