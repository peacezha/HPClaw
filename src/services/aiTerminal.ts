import { searchCommands, suggestByContext } from './commandIndex';
import { getRecentCommands, searchHistory } from './commandHistory';
import { isAIProfileConfigured, loadAIProfile } from './aiProfile';
import { analyzeOutputWithGateway, requestGatewayAutocomplete } from './aiGateway';

export interface Suggestion {
  completion: string;
  explanation: string;
}

interface CacheEntry {
  suggestions: Suggestion[];
  timestamp: number;
}

const CACHE_TTL = 60000;
const cache = new Map<string, CacheEntry>();

let autocompleteController: AbortController | null = null;
let autocompleteTimer: ReturnType<typeof setTimeout> | null = null;

export function requestAutocomplete(
  command: string,
  onSuggestions: (suggestions: Suggestion[]) => void,
  onClear: () => void,
): void {
  if (autocompleteTimer) clearTimeout(autocompleteTimer);
  if (autocompleteController) autocompleteController.abort();

  if (command.trim().length < 2) {
    onClear();
    return;
  }

  // 1) 历史命令优先（最强预测信号，即时）
  const historyHits = searchHistory(command, 3);
  // 2) 静态语法/命令库（即时）
  const contextResults = suggestByContext(command, 6);
  const local = contextResults.length > 0 ? contextResults : searchCommands(command, 6);
  const seen = new Set(historyHits.map(s => s.completion));
  const instant = [...historyHits];
  for (const s of local) {
    if (!seen.has(s.completion)) {
      instant.push(s);
      seen.add(s.completion);
    }
  }
  if (instant.length > 0) onSuggestions(instant.slice(0, 6));

  const cached = cache.get(command);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    if (cached.suggestions.length > 0) onSuggestions(cached.suggestions);
    return;
  }

  const profile = loadAIProfile();
  if (!isAIProfileConfigured(profile)) return;

  autocompleteTimer = setTimeout(async () => {
    autocompleteController = new AbortController();
    try {
      const suggestions = await requestGatewayAutocomplete(command, profile, autocompleteController.signal, {
        history: getRecentCommands(8),
      });
      if (suggestions.length === 0) return;

      cache.set(command, { suggestions, timestamp: Date.now() });
      const merged = [...instant];
      const mergedSeen = new Set(instant.map(s => s.completion));
      for (const s of suggestions) {
        if (!mergedSeen.has(s.completion)) {
          merged.push(s);
          mergedSeen.add(s.completion);
        }
      }
      onSuggestions(merged.slice(0, 6));
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.log('[AITerminal] Autocomplete failed:', err.message);
      }
    }
  }, 150);
}

export function cancelAutocomplete(): void {
  if (autocompleteTimer) clearTimeout(autocompleteTimer);
  if (autocompleteController) autocompleteController.abort();
  autocompleteController = null;
}

export async function analyzeTerminalOutput(selectedText: string): Promise<string> {
  const profile = loadAIProfile();
  if (!isAIProfileConfigured(profile)) return '请先在 AI 助手中配置 API Key';

  const text = selectedText.length > 5000
    ? `${selectedText.slice(0, 5000)}\n...[truncated]`
    : selectedText;

  return analyzeOutputWithGateway(text, profile);
}
