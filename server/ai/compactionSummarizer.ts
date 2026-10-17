import { generateText } from 'ai';
import { buildModel } from './agentRunner';
import { MemoryCompressor } from './memoryCompressor';
import type { CompactionSummarizer } from './contextCompactor';
import type { AIProfile } from './types';

/** 压缩模型调用的兜底超时（独立于对话热路径的等待上限，允许后台完成写缓存）。 */
const COMPACTION_MODEL_TIMEOUT_MS = 30_000;
/** 全量压缩时送入摘要模型的最大消息数（逐条截断 300 字符，控制压缩调用体量）。 */
const COMPACTION_MAX_SOURCE_MESSAGES = 60;

/**
 * 生产环境压缩执行器：复用当前请求的 AI 配置（同一供应商/模型），
 * 经 MemoryCompressor 的结构化提示词产出 StructuredMemory。
 * 解析失败或调用失败都返回 null，由调用方回退到旧的截断行为。
 */
export function createAiCompactionSummarizer(profile: AIProfile): CompactionSummarizer {
  const compressor = new MemoryCompressor();
  return async ({ messages }) => {
    try {
      const request = compressor.buildCompressionRequest(messages, profile.model, COMPACTION_MAX_SOURCE_MESSAGES);
      const result = await generateText({
        model: buildModel(profile),
        system: String(request.messages[0]?.content || ''),
        prompt: String(request.messages[1]?.content || ''),
        temperature: request.temperature,
        maxOutputTokens: request.maxTokens,
        abortSignal: AbortSignal.timeout(COMPACTION_MODEL_TIMEOUT_MS),
      });
      return compressor.parseCompressionResult(result.text);
    } catch (error) {
      console.warn('[context-compaction] summarize failed: %s', error instanceof Error ? error.message : String(error));
      return null;
    }
  };
}
