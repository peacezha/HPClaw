/** What one store makes of its reads. */
export interface HostReadPolicy<T> {
    /** The state published while a request runs. */
    loading: T;
    /** The state a transport failure publishes. */
    failed: T;
    /**
     * Whether a later request replaces a standing state with a new read.
     * @param state - the standing state.
     * @returns true to read again.
     */
    retryable(state: T): boolean;
    /**
     * Turn a settled response into a state.
     * @param response - the Host's answer.
     * @returns the state to publish.
     */
    decode(response: Response): Promise<T>;
}
/** One browser plugin's reads of one record kind. */
export declare class HostReadStore<T> {
    private readonly policy;
    /** Record URLs key the state across Sessions and turns. */
    readonly state: import("@deepseek-ai/dsh-client-store").SnapshotStore<Record<string, T | undefined>>;
    private readonly lifetime;
    /** The connection generation the current states belong to; a reset aborts it so no older read publishes. */
    private generation;
    private readonly pending;
    constructor(policy: HostReadPolicy<T>);
    /**
     * Read one URL unless a state the policy keeps already stands for it.
     * @param url - the record's authenticated URL.
     * @returns after the state is published.
     */
    protected loadUrl(url: string): Promise<void>;
    /** Forget every state and abandon in-flight reads; a replaced connection may reach a Host that no longer serves them. */
    reset(): void;
    /** Cancel outstanding reads and wait until none can publish state. */
    dispose(): Promise<void>;
    private read;
}
//# sourceMappingURL=host-read-store.d.ts.map