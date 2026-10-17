/** Parsing of `git diff-tree --numstat -z` output. */
/**
 * Parse NUL-terminated numstat records. A rename record carries an empty path
 * followed by the old and new paths.
 * @param output - complete stdout of `git diff-tree -r -M -z --numstat`.
 * @returns records in git's output order.
 * @throws when a record is malformed, which indicates truncated output.
 */
export function parseNumstat(output) {
    const queue = output.split('\0');
    if (queue.at(-1) !== '')
        throw new Error('numstat output is not NUL-terminated');
    queue.pop();
    const entries = [];
    while (queue.length > 0) {
        const record = queue.shift();
        // Only the first two tabs separate fields; a file name keeps its own tabs.
        const first = record.indexOf('\t');
        const second = first < 0 ? -1 : record.indexOf('\t', first + 1);
        if (second < 0)
            throw new Error(`malformed numstat record: ${record}`);
        const added = record.slice(0, first);
        const deleted = record.slice(first + 1, second);
        const path = record.slice(second + 1);
        let target = path;
        let oldPath;
        if (target === '') {
            oldPath = queue.shift();
            const renamed = queue.shift();
            if (oldPath === undefined || renamed === undefined)
                throw new Error('malformed numstat rename record');
            target = renamed;
        }
        const binary = added === '-';
        entries.push({
            path: target,
            ...oldPath === undefined ? {} : { oldPath },
            added: binary ? 0 : Number(added),
            deleted: binary ? 0 : Number(deleted),
            binary,
        });
    }
    return entries;
}
//# sourceMappingURL=numstat.js.map