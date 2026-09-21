import { resolveRequestSessionId } from './cluster/sessionRequest';

export function resolveSocketSessionId(
  cookieSessionId: unknown,
  headerSessionId: unknown,
  authSessionId: unknown,
  hasSession: (id: string) => boolean,
): string | undefined {
  return resolveRequestSessionId({
    cookie: cookieSessionId,
    header: headerSessionId,
    auth: authSessionId,
  }, hasSession);
}
