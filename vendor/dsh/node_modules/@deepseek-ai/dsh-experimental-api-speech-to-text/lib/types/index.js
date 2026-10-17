var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import z from '@deepseek-ai/schemastery';
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { validateWave } from '@deepseek-ai/dsh-experimental-speech-to-text/wave';
let SpeechController = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _catalog_decorators;
    let _follow_decorators;
    let _configure_decorators;
    let _prepare_decorators;
    let _cancelPreparation_decorators;
    let _transcribe_decorators;
    return class SpeechController extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _catalog_decorators = [Remote];
            _follow_decorators = [Remote({ mode: 'stream' })];
            _configure_decorators = [Remote];
            _prepare_decorators = [Remote];
            _cancelPreparation_decorators = [Remote];
            _transcribe_decorators = [Remote];
            __esDecorate(this, null, _catalog_decorators, { kind: "method", name: "catalog", static: false, private: false, access: { has: obj => "catalog" in obj, get: obj => obj.catalog }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _follow_decorators, { kind: "method", name: "follow", static: false, private: false, access: { has: obj => "follow" in obj, get: obj => obj.follow }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _configure_decorators, { kind: "method", name: "configure", static: false, private: false, access: { has: obj => "configure" in obj, get: obj => obj.configure }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _prepare_decorators, { kind: "method", name: "prepare", static: false, private: false, access: { has: obj => "prepare" in obj, get: obj => obj.prepare }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelPreparation_decorators, { kind: "method", name: "cancelPreparation", static: false, private: false, access: { has: obj => "cancelPreparation" in obj, get: obj => obj.cancelPreparation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _transcribe_decorators, { kind: "method", name: "transcribe", static: false, private: false, access: { has: obj => "transcribe" in obj, get: obj => obj.transcribe }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        config = __runInitializers(this, _instanceExtraInitializers);
        static inject = ['speechToText', 'typert'];
        static Config = z.object({
            maxAudioBytes: z.natural().min(46).default(4 * 1024 * 1024),
            maxDurationSeconds: z.number().min(1).default(120),
        });
        constructor(ctx, config) {
            super(ctx, 'speechController', { namespace: 'speech' });
            this.config = config;
        }
        /**
         * Read provider choices without preparing a recognizer.
         * @returns available providers, resolved default, and recording limits.
         */
        catalog() {
            return { ...this.ctx.speechToText.snapshot(), ...this.config };
        }
        /**
         * Follow provider readiness independently of Session and preparation lifetimes.
         * @param signal - Client observation lifetime.
         * @returns initial and subsequent complete readiness snapshots.
         */
        async *follow(signal) {
            for await (const snapshot of this.ctx.speechToText.follow(signal))
                yield { ...snapshot, ...this.config };
        }
        /**
         * Persist the user's recognition preferences.
         * @param patch - changed preference fields.
         * @returns after preferences are saved.
         */
        configure(patch) { return this.ctx.speechToText.configure(patch); }
        /**
         * Start or join one Host-owned preparation task.
         * @param providerId - selected recognizer.
         * @param options - task-local source selection validated by the provider.
         */
        prepare(providerId, options) { this.ctx.speechToText.prepare(providerId, options); }
        /**
         * Explicitly cancel resource preparation.
         * @param providerId - selected recognizer.
         * @returns after the preparation task settles.
         */
        cancelPreparation(providerId) { return this.ctx.speechToText.cancelPreparation(providerId); }
        /**
         * Validate and transcribe one recording through the explicit provider selection.
         * @param request - canonical WAV encoded as base64, provider id and language hint.
         * @param signal - Client cancellation or Remote contribution disposal.
         * @returns final transcript without adding a Session event.
         */
        async transcribe(request, signal) {
            signal.throwIfAborted();
            const encoded = request.audioBase64;
            if (encoded.length > Math.ceil(this.config.maxAudioBytes / 3) * 4) {
                throw new RemoteError('speech/invalid-audio', 'Audio is invalid or exceeds the configured byte limit', { reason: 'encoding-or-size' });
            }
            const audio = Buffer.from(encoded, 'base64');
            try {
                if (audio.toString('base64') !== encoded)
                    throw new Error('Audio must use canonical base64 encoding');
                if (audio.length > this.config.maxAudioBytes)
                    throw new Error('Audio exceeds the configured byte limit');
                validateWave(audio, this.config.maxDurationSeconds);
                const spec = this.ctx.speechToText.resolve({ audio,
                    ...request.providerId === undefined ? {} : { providerId: request.providerId },
                    ...request.language === undefined ? {} : { language: request.language },
                });
                return await this.ctx.speechToText.transcribe(spec, signal);
            }
            catch (error) {
                signal.throwIfAborted();
                const reason = error instanceof Error ? error.message : String(error);
                throw new RemoteError('speech/transcription-failed', reason, { reason });
            }
        }
    };
})();
/** Speech calls never activate or submit to an Agent. */
export default SpeechController;
//# sourceMappingURL=index.js.map