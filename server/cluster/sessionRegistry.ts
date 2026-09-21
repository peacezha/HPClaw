import { randomUUID } from 'node:crypto';
import type { ClusterSession } from './clusterSession';

export class SessionRegistry {
  private readonly sessions = new Map<string, ClusterSession>();

  createId(): string {
    return randomUUID();
  }

  register(id: string, session: ClusterSession): void {
    for (const [existingId, existingSession] of this.sessions) {
      if (existingSession !== session) existingSession.close();
      this.sessions.delete(existingId);
    }
    this.sessions.set(id, session);
  }

  get(id: string | undefined): ClusterSession | undefined {
    return id ? this.sessions.get(id) : undefined;
  }

  has(id: string): boolean {
    return this.sessions.has(id);
  }

  remove(id: string): void {
    const session = this.sessions.get(id);
    if (!session) return;
    this.sessions.delete(id);
    session.close();
  }
}
