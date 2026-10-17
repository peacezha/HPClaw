var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
import { appendPluginRecord, pluginRecordOf, SessionSeq } from '@deepseek-ai/dsh-session';
import { SessionPersistenceNotFoundError } from '@deepseek-ai/dsh-session-persistence';
import { deepEqualJson, deepFreeze } from '@deepseek-ai/dsh-util-values';
import { TranslationError } from "./error.js";
function required() {
    return new TranslationError('TRANSLATION_SESSION_REQUIRED', 'Translation requires an existing durable Session');
}
function invalid() {
    return new TranslationError('TRANSLATION_STORAGE_ERROR', 'Stored translation records are invalid or unavailable');
}
function failure(error, signal) {
    signal.throwIfAborted();
    if (error instanceof SessionPersistenceNotFoundError)
        throw required();
    if (error instanceof TranslationError)
        throw error;
    throw invalid();
}
function object(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function requestData(value) {
    if (!object(value) || !['provider', 'text', 'sourceLanguage', 'targetLanguage', 'recipe'].every(key => typeof value[key] === 'string')
        || (value.metadata !== undefined && !object(value.metadata)))
        throw invalid();
    return { provider: String(value.provider), text: String(value.text), sourceLanguage: String(value.sourceLanguage),
        targetLanguage: String(value.targetLanguage), recipe: String(value.recipe),
        ...value.metadata === undefined ? {} : { metadata: value.metadata } };
}
function identityKey(identity) {
    return JSON.stringify([identity.provider, identity.text, identity.sourceLanguage, identity.targetLanguage, identity.recipe]);
}
/** Saved results need no live Session; uncached translations use its existing writer. */
export class TranslationStorage {
    ctx;
    translations = new Map();
    /** @param ctx - translator context with optional live Sessions and durable persistence. */
    constructor(ctx) {
        this.ctx = ctx;
        ctx.effect(() => async () => { await Promise.all(this.translations.values()); });
    }
    /**
     * Reuse a saved result, or retain a new translation through the live Session writer.
     * @param id - existing Session; a cache miss without a live Session rejects with
     * `TRANSLATION_SESSION_INACTIVE` before invoking `operation`.
     * @param identity - provider, exact source, languages, and recipe; identical concurrent attempts share cache admission.
     * @param signal - operation cancellation, also observed after every storage await.
     * @param operation - uncached translation using the pinned live Session.
     * @returns saved or newly translated text, durably retained. Operation rejection returns without
     * waiting for accepted writes; identical retries and storage disposal wait for those writes to settle.
     */
    run(id, identity, signal, operation) {
        const persistence = this.ctx.get('sessionPersistence');
        const key = JSON.stringify([id, identityKey(identity)]);
        const writes = [];
        const task = (this.translations.get(key) ?? Promise.resolve()).then(async () => {
            signal.throwIfAborted();
            if (persistence === undefined)
                throw required();
            const current = () => {
                signal.throwIfAborted();
                if (this.ctx.get('sessionPersistence')?.identity !== persistence.identity)
                    throw required();
            };
            try {
                current();
                if (await persistence.stat(id, { signal }) === undefined)
                    throw required();
                current();
                const cached = await this.lookup(id, identity, persistence, signal, current);
                current();
                if (cached !== undefined)
                    return cached;
                const sessions = this.ctx.get('sessions'), session = sessions?.get(id);
                if (sessions === undefined || session === undefined) {
                    throw new TranslationError('TRANSLATION_SESSION_INACTIVE', 'Uncached translation requires an active Session');
                }
                const live = () => {
                    current();
                    if (this.ctx.get('sessions')?.get(id) !== session)
                        throw required();
                };
                const append = (type, data) => {
                    const writing = (async () => {
                        try {
                            live();
                            const snapshot = deepFreeze(structuredClone(data));
                            const seq = appendPluginRecord(session, type, snapshot);
                            await sessions.flush(session);
                            live();
                            const stored = (await this.read(id, persistence, signal, live, seq, 1))[0];
                            live();
                            if (stored === undefined || pluginRecordOf(stored)?.type !== type || !deepEqualJson(stored.data, snapshot))
                                throw invalid();
                            return seq;
                        }
                        catch (error) {
                            failure(error, signal);
                        }
                    })();
                    writes.push(writing.then(() => { }, () => { }));
                    return writing;
                };
                return await operation({
                    request: data => append('plugin:translator/request', data),
                    async result(requestSeq, text) { await append('plugin:translator/result', { requestSeq, text }); },
                });
            }
            catch (error) {
                failure(error, signal);
            }
        });
        const settled = task.then(() => { }, () => { });
        const tail = settled.then(async () => {
            await Promise.all(writes);
            if (this.translations.get(key) === tail)
                this.translations.delete(key);
        });
        this.translations.set(key, tail);
        return task;
    }
    async read(id, persistence, signal, current, start = 0, count) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            current();
            const handle = __addDisposableResource(env_1, await persistence.open(id, 'read', { signal }), true);
            current();
            const stored = await handle.read(start, count, { signal });
            current();
            return stored.events;
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            const result_1 = __disposeResources(env_1);
            if (result_1)
                await result_1;
        }
    }
    async lookup(id, identity, persistence, signal, current) {
        const requests = new Map();
        const results = new Map();
        for (const event of await this.read(id, persistence, signal, current)) {
            const record = pluginRecordOf(event);
            if (record?.type === 'plugin:translator/request')
                requests.set(record.seq, requestData(record.data));
            if (record?.type !== 'plugin:translator/result')
                continue;
            const data = record.data;
            if (!object(data) || typeof data.requestSeq !== 'number' || !Number.isSafeInteger(data.requestSeq)
                || data.requestSeq < 0 || Object.is(data.requestSeq, -0) || typeof data.text !== 'string')
                throw invalid();
            const request = requests.get(SessionSeq(data.requestSeq));
            if (request === undefined)
                throw invalid();
            results.set(identityKey(request), data.text);
        }
        return results.get(identityKey(identity));
    }
}
//# sourceMappingURL=storage.js.map