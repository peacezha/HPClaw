/** One account picture load shared by the sidebar and Settings for this plugin lifetime. */
/** Browser image outcome for the latest profile picture URL. */
export interface AccountAvatarSnapshot {
    /** Profile picture whose browser load produced this state. */
    url: string;
    /** Both account surfaces show the picture only after its shared load succeeds. */
    status: 'loading' | 'ready' | 'failed';
}
/** Owns the browser image and discards callbacks after URL replacement or plugin unload. */
export declare class AccountAvatarLoader {
    private readonly publish;
    private snapshot;
    private image;
    private disposed;
    /** @param publish - publishes picture changes through the account snapshot. */
    constructor(publish: (snapshot: AccountAvatarSnapshot | undefined) => void);
    /**
     * Load a changed URL once; an absent or empty URL clears the picture.
     * @param url - latest successful profile's picture, absent when no picture is available.
     */
    setUrl(url: string | null | undefined): void;
    /** Retry a failed picture once; successful and pending loads remain shared. */
    retry(): void;
    /**
     * Return both surfaces to fallback when a rendered picture fails.
     * @param snapshot - picture attempt rendered by the failing element; superseded attempts are ignored.
     */
    failed(snapshot: AccountAvatarSnapshot): void;
    /** Release the picture without publishing; the owner publishes an empty avatar with the replacement account frame. */
    reset(): void;
    /** Release the browser image and prevent further loads or publications. */
    dispose(): void;
    private load;
    private update;
    private detach;
}
//# sourceMappingURL=account-avatar.d.ts.map