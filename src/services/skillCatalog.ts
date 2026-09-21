export type SkillSource = 'system' | 'imported' | 'user' | 'lsf' | 'cluster';

export interface Skill {
  filename: string;
  content?: string;
  size?: number;
  isSystem?: boolean;
  name?: string;
  description?: string;
  tags?: string[];
  category?: string;
  source?: SkillSource;
  score?: number;
}

export type SkillInstallRequest =
  | { type: 'local'; filename: string; content: string }
  | { type: 'local'; path: string }
  | { type: 'url'; url: string }
  | { type: 'git'; url: string; ref?: string; subdir?: string };

export async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch('/api/skills', { credentials: 'include' });
  const data = await res.json();
  return data.success ? data.skills : [];
}

export async function searchSkills(query: string): Promise<{ results: string[]; skills: Skill[] }> {
  const res = await fetch(`/api/skills/search?q=${encodeURIComponent(query)}`, { credentials: 'include' });
  const data = await res.json();
  return data.success ? { results: data.results || [], skills: data.skills || [] } : { results: [], skills: [] };
}

export async function saveSkill(filename: string, content: string): Promise<boolean> {
  const res = await fetch('/api/skills', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, content }),
  });
  const data = await res.json().catch(() => ({}));
  return !!data.success;
}

export async function installSkill(request: SkillInstallRequest): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/skills/install', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const data = await res.json().catch(() => ({}));
  return data.success ? { success: true } : { success: false, error: data.error || `HTTP ${res.status}` };
}

export async function deleteSkill(filename: string): Promise<boolean> {
  const res = await fetch(`/api/skills/${encodeURIComponent(filename)}`, { method: 'DELETE', credentials: 'include' });
  const data = await res.json().catch(() => ({}));
  return !!data.success;
}
