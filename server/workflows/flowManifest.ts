// 流程资源清单（Flow Manifest）服务端校验与清洗。
// 类型定义见 shared/flowManifest.ts（前后端共用）。
import type {
  FlowManifest,
  QcGate,
  ReferenceItem,
  ReferenceType,
  SoftwareItem,
} from '../../shared/flowManifest';

export type { FlowManifest, QcGate, ReferenceItem, SoftwareItem } from '../../shared/flowManifest';

const REF_TYPES: ReferenceType[] = ['genome', 'index', 'annotation', 'database', 'other'];

function str(value: unknown, max = 500): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function sanitizeSoftware(value: unknown): SoftwareItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(s => s && typeof s === 'object')
    .map((s: any): SoftwareItem => {
      const item: SoftwareItem = {
        name: str(s.name, 100),
        required: s.required !== false,
      };
      const moduleName = str(s.module, 200);
      if (moduleName) item.module = moduleName;
      if (Array.isArray(s.prerequisiteModules)) {
        const prerequisites = s.prerequisiteModules
          .map((value: unknown) => str(value, 200))
          .filter(Boolean)
          .slice(0, 10);
        if (prerequisites.length > 0) item.prerequisiteModules = prerequisites;
      }
      const checkCmd = str(s.checkCmd, 500);
      if (checkCmd) item.checkCmd = checkCmd;
      const versionCmd = str(s.versionCmd, 300);
      if (versionCmd) item.versionCmd = versionCmd;
      return item;
    })
    .filter(s => s.name)
    .slice(0, 50);
}

function sanitizeReferences(value: unknown): ReferenceItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(r => r && typeof r === 'object')
    .map((r: any): ReferenceItem => {
      const item: ReferenceItem = {
        name: str(r.name, 100),
        path: str(r.path, 500),
        type: REF_TYPES.includes(r.type) ? r.type : 'other',
        required: r.required !== false,
      };
      const checkCmd = str(r.checkCmd, 500);
      if (checkCmd) item.checkCmd = checkCmd;
      const source = str(r.source, 500);
      if (source) item.source = source;
      return item;
    })
    .filter(r => r.name && r.path)
    .slice(0, 50);
}

function sanitizeQcGates(value: unknown): QcGate[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(g => g && typeof g === 'object')
    .map((g: any): QcGate | null => {
      const afterStep = Number(g.afterStep);
      const metric = str(g.metric, 200);
      const pass = str(g.pass, 200);
      if (!Number.isInteger(afterStep) || afterStep < 1 || !metric || !pass) return null;
      const gate: QcGate = { afterStep, metric, pass };
      const warn = str(g.warn, 200);
      if (warn) gate.warn = warn;
      return gate;
    })
    .filter((g): g is QcGate => g !== null)
    .slice(0, 50);
}

/**
 * 清洗外部输入的 manifest；输入不含任何有效内容时返回 undefined（不挂空 manifest）。
 */
export function sanitizeManifest(value: unknown): FlowManifest | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const v = value as Record<string, unknown>;
  const manifest: FlowManifest = {
    software: sanitizeSoftware(v.software),
    references: sanitizeReferences(v.references),
    qcGates: sanitizeQcGates(v.qcGates),
  };
  const inputHint = str(v.inputHint, 500);
  if (inputHint) manifest.inputHint = inputHint;
  if (manifest.software.length === 0 && manifest.references.length === 0 && manifest.qcGates.length === 0 && !manifest.inputHint) {
    return undefined;
  }
  return manifest;
}
