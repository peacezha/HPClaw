// validate_dsh_ui 工具产出的 UI spec：宽容解析（能 JSON.parse 且含 items 对象数组即认），
// 识别后把 spec JSON 从正文剥离，交给 DshUiSpecCard 渲染成卡片。

export interface DshUiSpec {
  title?: string;
  gap?: number;
  items: Record<string, unknown>[];
}

const MAX_SPECS_PER_MESSAGE = 5;
const MAX_CANDIDATE_LENGTH = 200_000;

/** 宽容的 spec 形状校验：对象 + 非空 items 数组（元素都是对象），title/gap 可选 */
export function parseDshUiSpec(value: unknown): DshUiSpec | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const candidate = value as { title?: unknown; gap?: unknown; items?: unknown };
  if (!Array.isArray(candidate.items) || candidate.items.length === 0) return null;
  if (!candidate.items.every(item => item !== null && typeof item === 'object' && !Array.isArray(item))) return null;
  const spec: DshUiSpec = { items: candidate.items as Record<string, unknown>[] };
  if (typeof candidate.title === 'string' && candidate.title.trim()) spec.title = candidate.title;
  if (typeof candidate.gap === 'number' && Number.isFinite(candidate.gap) && candidate.gap >= 0) spec.gap = candidate.gap;
  return spec;
}

/** 解析"整段文本就是一个 spec JSON"的场景（如 [📋 validate_dsh_ui] 工具结果消息体） */
export function parseDshUiSpecText(text: string): DshUiSpec | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith('{')) return null;
  try {
    return parseDshUiSpec(JSON.parse(trimmed));
  } catch {
    return null;
  }
}

/** 从 start 处的 { 找匹配的 }（感知字符串与转义）；超长或不平衡返回 -1 */
function findMatchingBrace(text: string, start: number): number {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    if (i - start > MAX_CANDIDATE_LENGTH) return -1;
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * 扫描 assistant 消息文本，识别其中的 spec JSON 块：
 * 返回解析出的 spec 列表与剥离了这些 JSON 块后的正文
 * （spec 独占一个 ``` 围栏代码块时连同围栏一起剥离，避免留下空代码块）。
 */
export function extractDshUiSpecs(text: string): { specs: DshUiSpec[]; strippedText: string } {
  const spans: { start: number; end: number; spec: DshUiSpec }[] = [];
  let i = 0;
  while (i < text.length && spans.length < MAX_SPECS_PER_MESSAGE) {
    if (text[i] === '{') {
      // 便宜预检：候选窗口内必须出现 "items" 键，避免对每个 { 都做括号匹配
      const itemsKey = text.indexOf('"items"', i);
      if (itemsKey !== -1 && itemsKey - i < MAX_CANDIDATE_LENGTH) {
        const end = findMatchingBrace(text, i);
        if (end > i) {
          let spec: DshUiSpec | null = null;
          try {
            spec = parseDshUiSpec(JSON.parse(text.slice(i, end + 1)));
          } catch { /* 不是合法 JSON：当普通文本处理 */ }
          if (spec) {
            spans.push({ start: i, end: end + 1, spec });
            i = end + 1;
            continue;
          }
        }
      }
    }
    i++;
  }

  if (spans.length === 0) return { specs: [], strippedText: text };

  let strippedText = '';
  let cursor = 0;
  for (const span of spans) {
    let { start, end } = span;
    // spec JSON 独占一个围栏代码块时，把围栏本身也剥掉
    const fenceOpen = /```[^\n`]*\n?$/.exec(text.slice(Math.max(cursor, start - 100), start));
    const fenceClose = /^[ \t]*\n?[ \t]*```/.exec(text.slice(end));
    if (fenceOpen && fenceClose) {
      start -= fenceOpen[0].length;
      end += fenceClose[0].length;
    }
    strippedText += text.slice(cursor, start);
    cursor = end;
  }
  strippedText += text.slice(cursor);

  return { specs: spans.map(span => span.spec), strippedText };
}
