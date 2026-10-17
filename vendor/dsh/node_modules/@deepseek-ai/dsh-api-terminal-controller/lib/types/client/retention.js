import { RemoteError } from '@deepseek-ai/dsh-typert-protocol';
/** A stream acknowledgement gates output attachment for each physical connection. */
export class TerminalWindowHold {
    stream;
    waiters = new Set();
    generation;
    failure;
    /**
     * @param gateway - reconnecting stream owner.
     * @param remote - typed terminal namespace.
     * @param sessionId - saved layout's Session, without Agent activation.
     * @param id - existing Host terminal.
     */
    constructor(gateway, remote, sessionId, id) {
        this.stream = gateway.$stream({
            name: 'Browser terminal window hold',
            open: signal => remote.retain(sessionId, id, signal),
            ended: () => new RemoteError('terminal/unavailable', 'Terminal hold ended', {}),
        });
        void this.consume();
    }
    /** Whether a terminal-domain failure ended this hold, allowing an explicit retry. */
    get failed() { return this.failure !== undefined; }
    /**
     * Wait for an acknowledged current physical hold before following its screen.
     * @param signal - output request or view lifetime.
     * @returns after acknowledgement, or rejects on cancellation/unavailability.
     */
    async ready(signal) {
        signal.throwIfAborted();
        if (this.failure !== undefined)
            throw this.failure;
        if (this.generation !== undefined && !this.generation.aborted)
            return;
        const waiting = Promise.withResolvers();
        const abort = () => { waiting.reject(signal.reason); };
        this.waiters.add(waiting);
        signal.addEventListener('abort', abort, { once: true });
        try {
            await waiting.promise;
        }
        finally {
            this.waiters.delete(waiting);
            signal.removeEventListener('abort', abort);
        }
    }
    /**
     * Release this window's stream and all acknowledgement waiters.
     * @returns after the stream consumer closes.
     */
    dispose() {
        this.reject(new Error('Terminal window hold released'));
        return this.stream.dispose();
    }
    async consume() {
        try {
            for await (const item of this.stream) {
                item.accept();
                this.generation = item.signal;
                for (const waiter of this.waiters)
                    waiter.resolve();
                this.waiters.clear();
            }
        }
        catch (error) {
            this.reject(error);
        }
    }
    reject(error) {
        this.failure = error instanceof Error ? error : new Error('Terminal window hold failed', { cause: error });
        this.generation = undefined;
        for (const waiter of this.waiters)
            waiter.reject(error);
        this.waiters.clear();
    }
}
//# sourceMappingURL=retention.js.map