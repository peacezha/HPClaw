import type { AIMessage, StructuredMemory } from './types';

const COMPRESSION_SYSTEM_PROMPT = `You are a conversation summarizer. Analyze the conversation and output a JSON object in this EXACT format (no markdown, no extra text):

{
  "task": "brief one-line task description",
  "progress": {
    "phase": 1,
    "description": "current phase description",
    "completed": 0,
    "total": 100
  },
  "keyFacts": [
    { "category": "environment|data|method|result|preference", "fact": "fact description" }
  ],
  "decisions": [
    { "what": "what was decided", "why": "reason" }
  ],
  "skillsUsed": ["skill1", "skill2"],
  "errors": [
    { "error": "error description", "resolution": "how it was fixed" }
  ]
}

Rules:
- task: One sentence describing the user's goal
- progress: Current phase number (1-based), description, completed count and total
- keyFacts: Important facts the AI must remember (max 10). Category must be one of: environment, data, method, result, preference
- decisions: Key decisions made and their reasons (max 5)
- skillsUsed: Skill filenames that were relevant
- errors: Errors encountered and their resolutions (max 3)
- Omit empty arrays, don't fabricate facts
- Output ONLY the JSON object`;

export function shouldCompress(
  messages: AIMessage[],
  currentTokens: number,
  totalBudget: number,
): boolean {
  const nonSystem = messages.filter(m => m.role !== 'system');
  if (nonSystem.length > 15) return true;
  if (currentTokens / totalBudget > 0.4) return true;
  return false;
}

export class MemoryCompressor {
  buildCompressionPrompt(messages: AIMessage[]): string {
    const nonSystem = messages
      .filter(m => m.role !== 'system')
      .slice(-15);

    const conversation = nonSystem
      .map(m => `${m.role}: ${(m.content || '').slice(0, 300)}`)
      .join('\n');

    return `Summarize this HPC bioinformatics conversation in structured JSON format:\n\n${conversation}`;
  }

  buildCompressionRequest(
    messages: AIMessage[],
    model: string = 'deepseek-chat',
  ) {
    return {
      model,
      messages: [
        { role: 'system', content: COMPRESSION_SYSTEM_PROMPT },
        { role: 'user', content: this.buildCompressionPrompt(messages) },
      ],
      temperature: 0,
      maxTokens: 800,
    };
  }

  parseCompressionResult(raw: string): StructuredMemory | null {
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      const parsed = JSON.parse(jsonMatch[0]);

      return {
        task: String(parsed.task || ''),
        progress: {
          phase: Number(parsed.progress?.phase) || 1,
          description: String(parsed.progress?.description || ''),
          completed: Number(parsed.progress?.completed) || 0,
          total: parsed.progress?.total ? Number(parsed.progress.total) : undefined,
        },
        keyFacts: Array.isArray(parsed.keyFacts) ? parsed.keyFacts.map((f: any) => ({
          category: String(f.category || 'data'),
          fact: String(f.fact || ''),
          timestamp: Date.now(),
        })) : [],
        decisions: Array.isArray(parsed.decisions) ? parsed.decisions.map((d: any) => ({
          what: String(d.what || ''),
          why: String(d.why || ''),
        })) : [],
        skillsUsed: Array.isArray(parsed.skillsUsed) ? parsed.skillsUsed.map(String) : [],
        errors: Array.isArray(parsed.errors) ? parsed.errors.map((e: any) => ({
          error: String(e.error || ''),
          resolution: String(e.resolution || ''),
        })) : [],
        generatedAt: Date.now(),
      };
    } catch {
      return null;
    }
  }

  mergeMemories(existing: StructuredMemory | null, incoming: StructuredMemory): StructuredMemory {
    if (!existing) return incoming;

    const factSet = new Set(existing.keyFacts.map(f => f.fact));
    const newFacts = incoming.keyFacts.filter(f => !factSet.has(f.fact));

    const decisionSet = new Set(existing.decisions.map(d => d.what));
    const newDecisions = incoming.decisions.filter(d => !decisionSet.has(d.what));

    const errorSet = new Set(existing.errors.map(e => e.error));
    const newErrors = incoming.errors.filter(e => !errorSet.has(e.error));

    const skillSet = new Set([...existing.skillsUsed, ...incoming.skillsUsed]);

    return {
      task: incoming.task || existing.task,
      progress: incoming.progress.description ? incoming.progress : existing.progress,
      keyFacts: [...existing.keyFacts, ...newFacts].slice(-20),
      decisions: [...existing.decisions, ...newDecisions].slice(-10),
      skillsUsed: [...skillSet],
      errors: [...existing.errors, ...newErrors].slice(-5),
      generatedAt: Date.now(),
    };
  }
}
