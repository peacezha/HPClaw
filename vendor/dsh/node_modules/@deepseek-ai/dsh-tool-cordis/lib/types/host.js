import { hostInspectProviders } from "./providers.js";
export const name = 'cordis-inspect-providers';
/** Required services: the Host inspect registry and the Tool registry the `Tool` provider reads. */
export const inject = ['cordisInspect', 'tools'];
/**
 * Register the Host inspect providers once per process. The registry keys
 * providers by id and rejects a duplicate, so this row belongs to the host
 * composition beside `cordis-host-runner`; every per-session `tool-cordis`
 * row reads the shared set through its tools.
 * @param ctx Host composition context.
 */
export function apply(ctx) {
    for (const provider of hostInspectProviders(ctx)) {
        ctx.effect(() => ctx.cordisInspect.register(provider), `cordis-inspect-providers: ${provider.manifest.id}`);
    }
}
//# sourceMappingURL=host.js.map