import type http from 'node:http';

// Disable request-level timeouts so long-running SSE streams never get killed.
//
// keepAliveTimeout = 0  disables the server-side keep-alive timeout entirely.
// When non-zero, Node.js calls socket.destroy() (RST) on idle sockets after
// that many ms — if the browser sends a new request on that socket at the
// same moment, the new request gets ECONNRESET.  Setting it to 0 avoids the
// race.  Active SSE streams are protected by heartbeats (every 15 s), and
// SSE responses carry Connection:close so they shut down cleanly (FIN, not
// RST).  For a single-user dev / small-scale deployment this is safe because
// the browser's own connection limit (~6) naturally bounds open sockets.
//
// headersTimeout only gates the *first* request on a connection; after the
// initial request, keep-alive sockets use keepAliveTimeout.  We set it to
// a generous value so slow clients over high-latency links can still connect.

export function configureHttpServerForSse(server: http.Server) {
  server.timeout = 0;
  server.requestTimeout = 0;
  server.keepAliveTimeout = 0;
  server.headersTimeout = 30_000;
}
