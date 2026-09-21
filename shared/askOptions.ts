export type AskLocale = 'zh-CN' | 'en-US';

const LABELS = {
  'zh-CN': {
    pickPath: '选择文件或目录',
    manualPath: '手动输入路径',
    recommended: '按推荐方案继续',
    decline: '暂不执行',
    fix: '按建议修复并继续',
    manual: '我来补充信息',
    pause: '先暂停任务',
    yes: '是，继续',
    no: '否，先不做',
    customInput: '自定义输入',
  },
  'en-US': {
    pickPath: 'Choose file or folder',
    manualPath: 'Enter path manually',
    recommended: 'Use recommended option',
    decline: 'Do not run it',
    fix: 'Apply suggested fix',
    manual: 'Add details manually',
    pause: 'Pause this task',
    yes: 'Yes, continue',
    no: 'No, skip for now',
    customInput: 'Enter a custom value',
  },
} as const;

function cleanOptions(options: unknown): string[] {
  if (!Array.isArray(options)) return [];
  return [...new Set(options
    .filter(item => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean))]
    .slice(0, 6);
}

// 候选项词元：短词，不含空白、引号、句读或斜杠（队列名、样本名、版本号、数字等）。
const CHOICE_TOKEN = "[^\\s、，。；：？?！!\"“”‘’'`()（）<>《》/]{1,30}";
// 紧邻斜杠或单词字符说明它是路径/长词片段，而不是候选项。
const CHOICE_LEFT_GUARD = '(?<![/\\w])';
const CHOICE_RIGHT_GUARD = '(?![/\\w])';
// 强分隔符并列：A、B 或 C / A 还是 B / A or B / A and B。
const STRONG_ENUM_RE = new RegExp(
  `${CHOICE_LEFT_GUARD}(${CHOICE_TOKEN}(?:\\s*(?:、|还是|或者|或|\\bor\\b|\\band\\b)\\s*${CHOICE_TOKEN})+)${CHOICE_RIGHT_GUARD}`,
  'g',
);
const STRONG_ENUM_SPLIT_RE = /\s*(?:、|还是|或者|或|\bor\b|\band\b)\s*/;
// 斜杠并列：A/B/C（路径因斜杠边界守卫不会命中）。
const SLASH_ENUM_RE = new RegExp(
  `${CHOICE_LEFT_GUARD}(${CHOICE_TOKEN}(?:/${CHOICE_TOKEN})+)${CHOICE_RIGHT_GUARD}`,
  'g',
);
// 引号候选：`normal`、"q2680v2"、“hg38”、‘smp’、'gpu'。
const QUOTED_RE = /`([^`]+)`|"([^"]+)"|“([^”]+)”|‘([^’]+)’|'([^']+)'/g;

const ASKS_YES_NO_ZH = /是否|要不要|能否|能不能|可不可以|可以吗|行不行|好不好|对不对|对吗|对吧|是不是|吗\s*[？?]\s*$|嘛\s*[？?]\s*$|(?<!什)是[^\s？?]{0,24}[？?]\s*$/;
const ASKS_YES_NO_EN = /^(?:do|does|did|is|are|was|were|can|could|should|shall|will|would|have|has|may|might)\b[\s\S]*\?\s*$/i;
const ASKS_NUMBER = /多少|几个|核|线程|内存|天数|\b(?:memory|cores?|threads?|days?|nodes?|cpu)\b|how (?:many|much)|\d+\s*(?:GB|GiB|TB)/i;
const ASKS_PATH = /路径|目录|文件|数据位置|输入数据|参考数据|path|directory|folder|file|input data|reference data/;
const REPORTS_FAILURE = /失败|报错|错误|缺少|不可用|无法|超时|failed|error|missing|unavailable|timeout/;
const ASKS_CONFIRMATION = /是否|要不要|确认|同意|继续|执行|提交|安装|下载|confirm|proceed|continue|execute|submit|install|download/;
// 数量候选：左侧不能紧跟字母/数字/小数点（排除 hg38、v2.0 等），右侧截断多余小数。
const NUMBER_RE = /(?<![\w.])(\d+(?:\.\d+)?)(?!\.\d)/g;

function cleanCandidates(items: string[]): string[] {
  return [...new Set(items
    .map(item => item.trim())
    .filter(item => item.length > 0 && item.length <= 30 && !/[。！？!?；;]/.test(item)))]
    .slice(0, 5);
}

/** 从问题文本抽取被引号包裹或并列列举的候选项（2-5 个），抽不到返回空数组。 */
function extractEnumeratedChoices(text: string): string[] {
  const quoted = cleanCandidates(
    [...text.matchAll(QUOTED_RE)].map(match => match.slice(1).find(group => group !== undefined) || ''),
  );
  if (quoted.length >= 2) return quoted;

  const spans: string[][] = [];
  for (const match of text.matchAll(STRONG_ENUM_RE)) {
    spans.push(cleanCandidates(match[1].split(STRONG_ENUM_SPLIT_RE)));
  }
  for (const match of text.matchAll(SLASH_ENUM_RE)) {
    spans.push(cleanCandidates(match[1].split('/')));
  }
  return spans.filter(span => span.length >= 2).sort((a, b) => b.length - a.length)[0] || [];
}

/** 抽取问题里已经出现的数量候选（排除 hg38、作业号等噪声），抽不到返回空数组。 */
function extractNumberChoices(text: string): string[] {
  const numbers = [...text.matchAll(NUMBER_RE)]
    .map(match => match[1])
    .filter(raw => !/^0\d/.test(raw))
    .map(Number)
    .filter(value => value > 0 && value <= 4096);
  return [...new Set(numbers.map(String))].slice(0, 4);
}

/** 模型漏传 options 时，按问题类型补齐可直接点击的安全选择。 */
export function ensureUserChoiceOptions(
  question: string,
  options: unknown,
  locale: AskLocale = 'zh-CN',
): string[] {
  const existing = cleanOptions(options);
  if (existing.length >= 2) return existing;

  const labels = LABELS[locale];
  const raw = String(question || '');
  const text = raw.toLowerCase();
  const enumerated = extractEnumeratedChoices(raw);
  const numbers = extractNumberChoices(raw);

  const fallback = enumerated.length >= 2
    // 列举抽取优先：候选项直接来自问题文本，再补一个自由补充入口。
    ? [...enumerated, labels.manual]
    : ASKS_YES_NO_ZH.test(raw) || ASKS_YES_NO_EN.test(raw.trim())
      ? [labels.yes, labels.no, labels.pause]
      : ASKS_NUMBER.test(raw)
        ? [...(numbers.length > 0 ? numbers : ['1', '4', '8', '16']), labels.customInput]
        : ASKS_PATH.test(text)
          ? [labels.pickPath, labels.manualPath, labels.pause]
          : REPORTS_FAILURE.test(text)
            ? [labels.fix, labels.manual, labels.pause]
            : ASKS_CONFIRMATION.test(text)
              ? [labels.recommended, labels.decline, labels.pause]
              : [labels.recommended, labels.manual, labels.pause];

  return [...new Set([...existing, ...fallback])].slice(0, 6);
}

export function isPathPickerChoice(value: string): boolean {
  return value === LABELS['zh-CN'].pickPath || value === LABELS['en-US'].pickPath;
}

export function isManualInputChoice(value: string): boolean {
  return value === LABELS['zh-CN'].manualPath
    || value === LABELS['en-US'].manualPath
    || value === LABELS['zh-CN'].manual
    || value === LABELS['en-US'].manual
    || value === LABELS['zh-CN'].customInput
    || value === LABELS['en-US'].customInput;
}
