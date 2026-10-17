/**
 * Compaction vocabulary: the result type and the `compaction/*` session events.
 * Those declaration-merged events record the lock and summary inputs without entering the surface, so they are not
 * surface events; a separate replacement `user/message` carries the summary.
 * Backend packages own configuration and retention policy; see the
 * [compaction reference](../README.md#understand-the-implementation).
 * @module @deepseek-ai/dsh-compaction/types
 */
export {};
//# sourceMappingURL=types.js.map