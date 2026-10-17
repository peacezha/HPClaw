/** Waiting for one package run's process tree to disappear before its caller touches the profile. */
/** How long a terminated tree may take to disappear before the caller stops waiting. */
const TREE_WAIT_MS = 5_000;
/** Poll cadence while waiting for a terminated tree to disappear. */
const TREE_POLL_MS = 15;
/**
 * Whether one run leads its own process group, which is the target a POSIX
 * liveness probe addresses for the whole tree. A run that captures output is
 * spawned as its own group leader, because its tree is terminated as a unit; a
 * run that inherits the caller's descriptors keeps the caller's group, so an
 * interrupt still reaches it.
 * @param execution Whether the run captures output or inherits the caller's descriptors.
 * @param platform Host platform deciding how a tree is addressed.
 * @returns True when the run leads its own process group.
 */
export function leadsOwnGroup(execution, platform = process.platform) {
    return execution === 'service' && platform !== 'win32';
}
/** The target a tree probe addresses: a POSIX group when the run leads one, else the process itself. */
function targetOf(pid, grouped, platform) {
    return platform !== 'win32' && grouped ? -pid : pid;
}
/**
 * Whether any member of a run's tree is still alive.
 * @param tree The run's process id and whether it leads its own group.
 * @param internals Injectable process operations.
 * @returns True while the probe finds the process or a group member.
 */
export function treeAlive(tree, internals = {}) {
    const pid = tree.pid;
    if (pid === undefined)
        return false;
    const platform = internals.platform ?? process.platform;
    const alive = internals.alive ?? ((target) => { process.kill(target, 0); return true; });
    try {
        return alive(targetOf(pid, tree.grouped, platform));
    }
    catch {
        return false;
    }
}
/**
 * Wait until a terminated run's tree is gone, so the caller restores and
 * unlocks the profile only after the scripts it started stopped writing.
 * @param tree The run's process id and whether it leads its own group.
 * @param internals Injectable process operations.
 * @returns Fulfillment once no member remains, or the wait bound elapsed.
 */
export async function awaitTreeGone(tree, internals = {}) {
    const deadline = Date.now() + (internals.waitMs ?? TREE_WAIT_MS);
    while (treeAlive(tree, internals)) {
        if (Date.now() >= deadline)
            return;
        await new Promise(resolve => setTimeout(resolve, TREE_POLL_MS));
    }
}
//# sourceMappingURL=run-tree.js.map