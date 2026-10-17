/** One Session's cached list, retained failures and in-flight mutation reconciliation. */
export class TerminalInventory {
    load;
    state = { kind: 'unloaded' };
    items = new Map();
    pending = new Set();
    /** @param load - fetch the Session's retained Host terminals. */
    constructor(load) {
        this.load = load;
    }
    /**
     * Read the cached list or join its single in-flight request.
     * @param refresh - explicitly replace a settled result or failure; overlapping refreshes share one request.
     * @returns current terminal metadata; failures remain cached until refresh or reset.
     */
    read(refresh = false) {
        if (this.state.kind === 'disposed')
            return Promise.reject(new Error('Terminal inventory disposed'));
        if (this.state.kind === 'loading')
            return this.state.promise;
        if (!refresh && this.state.kind === 'ready')
            return Promise.resolve(this.items);
        if (!refresh && this.state.kind === 'failed')
            return Promise.reject(this.state.error);
        const completed = Promise.withResolvers();
        const request = { kind: 'loading', promise: completed.promise, updates: new Map() };
        this.state = request;
        this.pending.add(completed.promise);
        void this.loadRequest(request).then(completed.resolve, completed.reject);
        void completed.promise.then(() => { this.pending.delete(completed.promise); }, () => { this.pending.delete(completed.promise); });
        return completed.promise;
    }
    async loadRequest(request) {
        try {
            const result = await this.load();
            if (this.state !== request)
                return await this.read();
            if (!result.ok)
                throw result.error;
            const items = new Map(result.value.map(info => [info.id, info]));
            for (const [id, info] of request.updates) {
                if (info === undefined)
                    items.delete(id);
                else
                    items.set(id, info);
            }
            this.items = items;
            this.state = { kind: 'ready' };
            return items;
        }
        catch (error) {
            if (this.state !== request)
                return this.read();
            const failure = error instanceof Error ? error : new Error('Terminal discovery failed', { cause: error });
            this.state = { kind: 'failed', error: failure };
            throw failure;
        }
    }
    /**
     * Preserve acknowledged mutations and attachment metadata across a pending list response.
     * @param info - latest confirmed terminal metadata.
     */
    update(info) {
        if (this.state.kind === 'disposed')
            return;
        this.items.set(info.id, info);
        if (this.state.kind === 'loading')
            this.state.updates.set(info.id, info);
    }
    /**
     * Remove a terminal after confirmed closure or unavailability.
     * @param id - terminal identity.
     */
    remove(id) {
        if (this.state.kind === 'disposed')
            return;
        this.items.delete(id);
        if (this.state.kind === 'loading')
            this.state.updates.set(id, undefined);
    }
    /**
     * Replace discovery after a connection change; never discover a Session that has not needed a list.
     * @returns the replacement lookup, or undefined for an unused or disposed inventory.
     */
    reset() {
        if (this.state.kind === 'unloaded' || this.state.kind === 'disposed')
            return undefined;
        this.state = { kind: 'unloaded' };
        return this.read();
    }
    /**
     * Discard metadata and prevent late responses from publishing.
     * @returns after all owned list requests settle.
     */
    async dispose() {
        this.state = { kind: 'disposed' };
        this.items.clear();
        await Promise.allSettled(this.pending);
    }
}
//# sourceMappingURL=inventory.js.map