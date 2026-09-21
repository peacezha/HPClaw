import type { ComponentType } from 'react';

// ── Types ────────────────────────────────────────────────────────
export type RendererType = 'image' | 'table' | 'code' | 'pdf' | 'fasta' | 'vcf' | 'log' | 'generic';

export interface FileMetadata {
  size: number;
  mime: string;
  dimensions?: { width: number; height: number };
  rows?: number;
}

export interface CardContent {
  type: RendererType;
  filePath: string;
  fileName: string;
  content: string; // base64 for binary, text for text files
  metadata: FileMetadata;
  /** 集群会话：拼进 /api/files/view|download 的 ?sessionId=（<img>/<a> 无法带请求头） */
  sessionId?: string | null;
  /** 本地模式（无集群会话）：走 /api/local/files/*，按 DATA_ROOT + workspace 解析 */
  local?: boolean;
  /** 本地模式下的工作区（服务端允许根之一），拼进 /api/local/files/* 请求 */
  workspace?: string;
}

export interface CardProps {
  content: CardContent;
  onExpand?: () => void;
}

export interface RendererEntry {
  type: RendererType;
  component: ComponentType<CardProps>;
  label: string;
  extensions: string[];
  priority: number;
}

// ── Registry ─────────────────────────────────────────────────────
class RendererRegistryImpl {
  private entries = new Map<RendererType, RendererEntry>();

  register(entry: RendererEntry): void {
    if (this.entries.has(entry.type)) {
      console.warn(`RendererRegistry: overwriting existing entry for type "${entry.type}"`);
    }
    this.entries.set(entry.type, entry);
  }

  get(type: RendererType): RendererEntry | undefined {
    return this.entries.get(type);
  }

  has(type: RendererType): boolean {
    return this.entries.has(type);
  }

  findByExtension(ext: string): RendererEntry | null {
    if (!ext) return null;
    const lower = ext.toLowerCase();
    for (const [, entry] of this.entries) {
      if (entry.extensions.includes(lower)) return entry;
    }
    return null;
  }

  getAll(): RendererEntry[] {
    return Array.from(this.entries.values()).sort((a, b) => b.priority - a.priority);
  }
}

export const RendererRegistry = new RendererRegistryImpl();
