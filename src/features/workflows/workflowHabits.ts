export interface WorkflowHabitSample {
  params: Record<string, string>;
  stepParams: Record<number, Record<string, string>>;
  skippedSteps: number[];
}

export interface WorkflowHabitSuggestion extends WorkflowHabitSample {
  sampleCount: number;
}

interface StoredHabits {
  version: 1;
  samples: WorkflowHabitSample[];
}

const PREFIX = 'hpclaw_workflow_habits_v1:';
const MAX_SAMPLES = 12;

function safeScalar(value: unknown): string {
  const text = typeof value === 'string' ? value.trim().slice(0, 500) : '';
  // 不学习文件路径、环境变量式路径或可能是密钥的长令牌。
  if (!text || /^(?:[A-Za-z]:[\\/]|[/~]|\$\{?\w+)/.test(text)) return '';
  if (text.length >= 80 && /^[A-Za-z0-9+/_=-]+$/.test(text)) return '';
  return text;
}

function sanitizeRecord(value: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(value)
    .map(([key, item]) => [key.slice(0, 100), safeScalar(item)] as const)
    .filter(([, item]) => Boolean(item))
    .slice(0, 100));
}

function sanitizeSample(sample: WorkflowHabitSample): WorkflowHabitSample {
  return {
    params: sanitizeRecord(sample.params || {}),
    stepParams: Object.fromEntries(Object.entries(sample.stepParams || {})
      .map(([step, values]) => [Number(step), sanitizeRecord(values)])
      .filter(([step]) => Number.isInteger(step) && Number(step) > 0)
      .slice(0, 100)),
    skippedSteps: [...new Set((sample.skippedSteps || [])
      .filter(step => Number.isInteger(step) && step > 0)
      .slice(0, 100))],
  };
}

function read(workflowId: string): StoredHabits {
  try {
    const parsed = JSON.parse(localStorage.getItem(`${PREFIX}${workflowId}`) || '{}') as Partial<StoredHabits>;
    return {
      version: 1,
      samples: Array.isArray(parsed.samples) ? parsed.samples.map(sanitizeSample).slice(-MAX_SAMPLES) : [],
    };
  } catch {
    return { version: 1, samples: [] };
  }
}

export function recordWorkflowHabit(workflowId: string, sample: WorkflowHabitSample): number {
  const stored = read(workflowId);
  const samples = [...stored.samples, sanitizeSample(sample)].slice(-MAX_SAMPLES);
  localStorage.setItem(`${PREFIX}${workflowId}`, JSON.stringify({ version: 1, samples }));
  return samples.length;
}

function mostFrequent(values: string[]): string | undefined {
  const counts = new Map<string, number>();
  for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) || 0) + 1);
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return ranked[0]?.[1] >= 2 ? ranked[0][0] : undefined;
}

export function getWorkflowHabitSuggestion(workflowId: string): WorkflowHabitSuggestion | null {
  const samples = read(workflowId).samples;
  if (samples.length < 2) return null;
  const paramNames = new Set(samples.flatMap(sample => Object.keys(sample.params)));
  const params = Object.fromEntries([...paramNames]
    .map(name => [name, mostFrequent(samples.map(sample => sample.params[name] || ''))] as const)
    .filter((entry): entry is [string, string] => Boolean(entry[1])));

  const stepNumbers = new Set(samples.flatMap(sample => Object.keys(sample.stepParams).map(Number)));
  const stepParams: Record<number, Record<string, string>> = {};
  for (const step of stepNumbers) {
    const names = new Set(samples.flatMap(sample => Object.keys(sample.stepParams[step] || {})));
    const values = Object.fromEntries([...names]
      .map(name => [name, mostFrequent(samples.map(sample => sample.stepParams[step]?.[name] || ''))] as const)
      .filter((entry): entry is [string, string] => Boolean(entry[1])));
    if (Object.keys(values).length > 0) stepParams[step] = values;
  }

  const skippedSteps = [...new Set(samples.flatMap(sample => sample.skippedSteps))]
    .filter(step => samples.filter(sample => sample.skippedSteps.includes(step)).length > samples.length / 2);
  return { params, stepParams, skippedSteps, sampleCount: samples.length };
}

export function clearWorkflowHabits(workflowId: string): void {
  localStorage.removeItem(`${PREFIX}${workflowId}`);
}
