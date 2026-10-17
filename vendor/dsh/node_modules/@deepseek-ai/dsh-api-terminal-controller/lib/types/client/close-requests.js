const PREFIX = 'dsh.terminal.close.v1.';
/** Each request has its own storage key, so other browser windows cannot overwrite its cleanup. */
export class TerminalCloseRequests {
    requests = new Map();
    constructor() {
        try {
            if (typeof localStorage === 'undefined')
                return;
            for (let index = 0; index < localStorage.length; index++) {
                const key = localStorage.key(index);
                if (key?.startsWith(PREFIX))
                    this.load(key);
            }
        }
        catch (error) {
            console.error('Terminal cleanup recovery failed:', error);
        }
    }
    /**
     * Read cleanup work still awaiting Host confirmation.
     * @returns unfinished requests owned by this browser instance.
     */
    pending() { return [...this.requests.values()]; }
    /**
     * Retain cleanup across reload before removing a tab.
     * @param request - close intent to save before removing its tab.
     */
    save(request) {
        this.requests.set(request.id, request);
        try {
            if (typeof localStorage !== 'undefined')
                localStorage.setItem(PREFIX + request.id, JSON.stringify(request));
        }
        catch (error) {
            console.error('Terminal cleanup persistence failed:', error);
        }
    }
    /**
     * Forget confirmed cleanup in memory and browser storage.
     * @param id - terminal whose Host cleanup succeeded.
     */
    remove(id) {
        this.requests.delete(id);
        try {
            if (typeof localStorage !== 'undefined')
                localStorage.removeItem(PREFIX + id);
        }
        catch (error) {
            console.error('Terminal cleanup persistence failed:', error);
        }
    }
    load(key) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null)
                return;
            const parsed = JSON.parse(raw);
            if (!isRequest(parsed) || key !== PREFIX + parsed.id)
                throw new Error('Invalid terminal cleanup request');
            this.requests.set(parsed.id, parsed);
        }
        catch (error) {
            console.error('Terminal cleanup recovery failed:', error);
        }
    }
}
function isRequest(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const request = value;
    return typeof request.sessionId === 'string' && request.sessionId.length > 0
        && typeof request.id === 'string' && /^[\w-]{1,128}$/u.test(request.id)
        && typeof request.title === 'string';
}
//# sourceMappingURL=close-requests.js.map