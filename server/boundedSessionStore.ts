import session, { type SessionData } from 'express-session';

interface BoundedSessionStoreOptions {
  maxSessions?: number;
  ttlMs?: number;
  now?: () => number;
}

interface StoredSession {
  value: SessionData;
  expiresAt: number;
  touchedAt: number;
}

/**
 * A small in-process session store for the desktop server.
 *
 * HPClaw only needs a cookie-to-SSH-session mapping, so an external database
 * would be unnecessary. Unlike express-session's development MemoryStore,
 * this store prunes expired entries and enforces a hard LRU-style capacity.
 */
export class BoundedSessionStore extends session.Store {
  private readonly entries = new Map<string, StoredSession>();
  private readonly maxSessions: number;
  private readonly ttlMs: number;
  private readonly now: () => number;

  constructor(options: BoundedSessionStoreOptions = {}) {
    super();
    this.maxSessions = Math.max(1, Math.floor(options.maxSessions ?? 256));
    this.ttlMs = Math.max(1_000, Math.floor(options.ttlMs ?? 7 * 24 * 60 * 60 * 1_000));
    this.now = options.now ?? Date.now;
  }

  private expiresAt(value: SessionData, currentTime: number): number {
    const cookieExpiry = value.cookie?.expires;
    const parsed = cookieExpiry ? new Date(cookieExpiry).getTime() : Number.NaN;
    return Number.isFinite(parsed) && parsed > currentTime ? parsed : currentTime + this.ttlMs;
  }

  private prune(currentTime = this.now()): void {
    for (const [sid, entry] of this.entries) {
      if (entry.expiresAt <= currentTime) this.entries.delete(sid);
    }

    if (this.entries.size <= this.maxSessions) return;
    const oldest = [...this.entries.entries()]
      .sort((left, right) => left[1].touchedAt - right[1].touchedAt)
      .slice(0, this.entries.size - this.maxSessions);
    for (const [sid] of oldest) this.entries.delete(sid);
  }

  get(sid: string, callback: (err: unknown, session?: SessionData | null) => void): void {
    const currentTime = this.now();
    this.prune(currentTime);
    const entry = this.entries.get(sid);
    if (!entry) {
      callback(null, null);
      return;
    }
    entry.touchedAt = currentTime;
    callback(null, entry.value);
  }

  set(sid: string, value: SessionData, callback?: (err?: unknown) => void): void {
    const currentTime = this.now();
    this.entries.set(sid, {
      value,
      expiresAt: this.expiresAt(value, currentTime),
      touchedAt: currentTime,
    });
    this.prune(currentTime);
    callback?.();
  }

  touch(sid: string, value: SessionData, callback?: () => void): void {
    const currentTime = this.now();
    const entry = this.entries.get(sid);
    if (entry) {
      entry.value = value;
      entry.expiresAt = this.expiresAt(value, currentTime);
      entry.touchedAt = currentTime;
    }
    this.prune(currentTime);
    callback?.();
  }

  destroy(sid: string, callback?: (err?: unknown) => void): void {
    this.entries.delete(sid);
    callback?.();
  }

  clear(callback?: (err?: unknown) => void): void {
    this.entries.clear();
    callback?.();
  }

  length(callback: (err: unknown, length?: number) => void): void {
    this.prune();
    callback(null, this.entries.size);
  }
}
