/**
 * Browser-trust fence for every /api request. Defends the two confused-deputy
 * paths a browser opens against a local HTTP API — DNS rebinding (Host names
 * the attacker's domain while the socket reaches this server) and cross-site
 * requests fired from a malicious page. The Host fence binds every request,
 * browser-looking or not: over plain HTTP a browser attaches neither Origin
 * nor Fetch-Metadata to reads (images and navigations — those headers go only
 * to trustworthy destinations), so an unmarked request may still be a rebound
 * browser read and Host is the one header rebinding cannot forge. Non-browser
 * and remote clients pass the same fence via loopback, the listener's bind IP
 * literal, or a declared `trustedHosts` authority. Binding policy belongs to
 * the webserver config; this fence never establishes identity.
 */
import type { ConnectionTrustRequest } from './rpc.ts';
/**
 * Assert one configured `trustedHosts` entry is a bare authority (`host` or
 * `host:port`) in canonical form: it must survive WHATWG parsing unchanged
 * (case aside). Anything parsing would silently rewrite is refused as a typo
 * that must fail the load loudly instead of being ignored until requests 403
 * or quietly changing the grant: URL parts beyond the authority
 * (`harness.internal/path`, `user@harness.internal` — which would authorize
 * the embedded hostname), stripped whitespace, a dangling colon or
 * zero-padded port (which would broaden an intended exact-port grant to every
 * port), and non-canonical host spellings (`0x7f.0.0.1`, percent-encoding,
 * unbracketed IPv6; IDN hosts are declared in punycode, the form the wire
 * carries).
 * @param entry - the configured value, verbatim.
 */
export declare function assertTrustedAuthority(entry: string): void;
/**
 * Classify an authority already accepted by {@link assertTrustedAuthority}.
 * @param entry - the configured authority, verbatim.
 * @returns true unless the entry parses as a loopback hostname.
 */
export declare function isRemoteAuthority(entry: string): boolean;
/**
 * Decide whether one /api request may reach the RPC bridge.
 * @param request - Node HTTP or Fetch request facts (headers).
 * @param trustedHosts - non-loopback authorities this deployment serves: exact `host:port`, or port-less `host` matching any port.
 * @param bindHost - the listener's own bind IP literal, accepted on any port independently of `trustedHosts`.
 * @param protocol - listener protocol for default Host ports; HTTP when no Web carrier is mounted.
 * @returns true when the Host is ours (loopback, the bind address, or trusted) and any attached browser markers are same-origin.
 */
export declare function isTrustedApiRequest(request: ConnectionTrustRequest, trustedHosts: readonly string[], bindHost?: string, protocol?: 'http:' | 'https:'): boolean;
//# sourceMappingURL=api-request-trust.d.ts.map