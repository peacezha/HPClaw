/** Authenticated browser bootstrap route; the debugging URL stays on the Host. */
import { type InspectorSourceId } from './bridge/ids.ts';
/** Read the current browser-source connection parameters. */
export declare const INSPECTOR_BOOTSTRAP_PATH = "/api/experimental-inspector/bootstrap";
/** Document-relative browser route for the authenticated source bootstrap. */
export declare const INSPECTOR_BOOTSTRAP_ROUTE: string;
/** Query parameter selecting the Client visible beside Host in one DevTools connection. */
export declare const INSPECTOR_CLIENT_QUERY = "clientSourceId";
/**
 * Read an optional Client selection from a DevTools WebSocket URL.
 * @param url - Untrusted upgrade URL.
 * @returns The selected logical Client id, or undefined for all Clients.
 * @throws If the selection is repeated or is not a valid source id.
 */
export declare function readInspectorClientSelection(url: URL): InspectorSourceId | undefined;
//# sourceMappingURL=web.d.ts.map