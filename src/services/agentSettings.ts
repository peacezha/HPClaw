import {
  DEFAULT_AGENT_COMMANDS,
  DEFAULT_AGENT_STEPS,
  MAX_AGENT_COMMANDS,
  MAX_AGENT_STEPS,
  MIN_AGENT_COMMANDS,
  MIN_AGENT_STEPS,
} from '../../shared/agentLimits';

export type AgentPlanningPolicy = 'auto' | 'always';
export type AgentConfirmationPolicy = 'dangerous' | 'state_changes' | 'every_command';
export type AgentEnginePreference = 'auto' | 'native' | 'dsh';

export interface AgentSettings {
  engine: AgentEnginePreference;
  planningPolicy: AgentPlanningPolicy;
  confirmationPolicy: AgentConfirmationPolicy;
  maxCommands: number;
  maxSteps: number;
}

const STORAGE_KEY = 'hpclaw_agent_settings';
const STORAGE_VERSION = 3;
const LEGACY_DEFAULT_MAX_STEPS = 50;

export function normalizeAgentSettings(value: unknown): AgentSettings {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return {
    engine: raw.engine === 'native' || raw.engine === 'dsh' ? raw.engine : 'auto',
    planningPolicy: raw.planningPolicy === 'always' ? 'always' : 'auto',
    confirmationPolicy: raw.confirmationPolicy === 'state_changes' || raw.confirmationPolicy === 'every_command'
      ? raw.confirmationPolicy
      : 'dangerous',
    maxCommands: Math.max(MIN_AGENT_COMMANDS, Math.min(MAX_AGENT_COMMANDS, Number(raw.maxCommands) || DEFAULT_AGENT_COMMANDS)),
    maxSteps: Math.max(MIN_AGENT_STEPS, Math.min(MAX_AGENT_STEPS, Number(raw.maxSteps) || DEFAULT_AGENT_STEPS)),
  };
}

export function loadAgentSettings(): AgentSettings {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    // 旧版没有暴露 maxSteps 设置，并会把默认值 50 写进 localStorage。
    // 只迁移这个不可配置的旧默认值；新版中用户主动选择的 50 会保留。
    if (stored && typeof stored === 'object'
      && stored.version !== STORAGE_VERSION
      && Number(stored.maxSteps) === LEGACY_DEFAULT_MAX_STEPS) {
      return normalizeAgentSettings({ ...stored, maxSteps: DEFAULT_AGENT_STEPS });
    }
    return normalizeAgentSettings(stored);
  } catch {
    return normalizeAgentSettings({});
  }
}

export function saveAgentSettings(value: unknown): AgentSettings {
  const normalized = normalizeAgentSettings(value);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, ...normalized }));
  return normalized;
}
