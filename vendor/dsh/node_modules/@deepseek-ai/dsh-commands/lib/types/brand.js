/**
 * Command definition identities and execution ids for discovery and lifecycle pairing.
 *
 * The `Branded<B>` primitive lives in `@deepseek-ai/dsh-brand`; this module
 * is a pure type/constructor outlet (no cordis imports, no module
 * augmentation) so wire and client programs can name the brand without
 * loading the host plugin's Context merges — the `dsh-llm/brand` shape.
 *
 * @module @deepseek-ai/dsh-commands/brand
 */
/**
 * Brand a plugin-namespaced command definition identity.
 * @param id - stable identity chosen by the registering plugin.
 * @returns the same string, branded; no validation is performed.
 */
export function CommandDefinitionId(id) {
    return id;
}
/**
 * Brand a string as a {@link CommandId}.
 * @param id - the executor-minted pairing id.
 * @returns the same string, branded; no validation is performed.
 */
export function CommandId(id) {
    return id;
}
//# sourceMappingURL=brand.js.map