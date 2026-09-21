import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, Settings, Send, Brain, Loader2, ChevronDown, ChevronRight, Save, Check, FolderOpen, Folder, FolderTree,
  AlertCircle, Wifi, WifiOff, RefreshCw, Search, BookOpen, Library, FileText, X, MessageSquarePlus,
  Cpu, GitBranch, Paperclip, ShieldCheck
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import WorkflowPanel from './WorkflowPanel';
import FlowRunnerDrawer from './FlowRunnerDrawer';
import WorkflowConfigCard from './WorkflowConfigCard';
import WorkflowRunCard from './WorkflowRunCard';
import ExecutionTrace, { type ExecutionTraceItem } from './ExecutionTrace';
import DetectedFilesStrip from './DetectedFilesStrip';
import WebEmbedList from './WebEmbedList';
import { matchWorkflows as matchWorkflowsApi } from '../features/workflows/api';
import type { Workflow } from '@/shared/workflow';
import type { PickPathKind } from '@/shared/fileTransfer';
import { RichContentMessage, extractDshUiSpecs, DshUiSpecCard } from './rich-content';
import MarkdownMessage from './MarkdownMessage';
import type { WebPanelRequest } from './WebPanelDrawer';
import { motion, AnimatePresence } from 'motion/react';
import { Socket } from 'socket.io-client';
import { useObservationLogger } from '../hooks/useObservationLogger';
import { PROVIDER_MODELS, AIProvider, loadAIProfile, saveAIProfile } from '../services/aiProfile';
import { shouldSubmitOnKey } from '../services/chatInputKeys';
import {
  buildOutgoingMessages,
  findLatestAgentPlanCheckpoint,
  isAgentDoneCancelled,
  isCurrentAiRun,
  latestUserMessage,
  prepareMessagesForAiTransport,
  resolveAgentDoneText,
  shouldDisableChatInput,
  shouldRenderSystemMessage,
  upsertAgentPlanCheckpoint,
} from '../services/chatFlow';
import {
  findLatestWorkflowExecutionContext,
  formatWorkflowConfigureDirective,
  parseWorkflowConfigureDirective,
  parseWorkflowExecutionContext,
  stripWorkflowConfigureDirectives,
} from '@/shared/workflowExecution';
import { closeSseReader, type SseReaderCloseReason } from '../services/sseReaderLifecycle';
import { prepareAiRequestBody } from '../services/aiRequestBody';
import {
  appendAttachmentRefs,
  baseName,
  joinLocalPath,
  CLUSTER_ATTACHMENT_DIR,
  type ChatAttachment,
} from '../services/chatAttachments';
import { enqueueTransfer, mkdirRemote } from '../features/file-transfer/api';
import { resolveTransferProfileId } from '../features/file-transfer/sessionIdentity';
import { makeTemporaryTransferName } from '@/shared/fileTransfer';
import {
  loadAgentSettings,
  saveAgentSettings,
  type AgentEnginePreference,
  type AgentConfirmationPolicy,
  type AgentPlanningPolicy,
} from '../services/agentSettings';
import {
  loadAgentWorkspace,
  saveAgentWorkspace,
  clearAgentWorkspace,
  needsAgentWorkspaceHint,
} from '../services/agentWorkspace';

import { NCPGR_SYSTEM_PROMPT_CN } from '@/shared/ncpgrRules';
import { useI18n } from '../i18n';
import {
  MAX_AGENT_COMMANDS,
  MAX_AGENT_STEPS,
  MIN_AGENT_COMMANDS,
  MIN_AGENT_STEPS,
} from '@/shared/agentLimits';
import {
  ensureUserChoiceOptions,
  isManualInputChoice,
  isPathPickerChoice,
} from '@/shared/askOptions';
import { IS_COMPETITION_EDITION } from '../edition';

//  Types 
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  thoughtSteps?: { step: number; content: string }[];
}

interface Skill {
  filename: string;
  content?: string;
  size?: number;
  isSystem?: boolean;
  name?: string;
  description?: string;
  category?: string;
  source?: string;
}

interface AIChatProps {
  isOpen: boolean;
  executeCommand: (cmd: string, waitAndCapture?: boolean) => Promise<string>;
  socket: Socket | null;
  /** 当前标签页的集群会话 ID：AI 请求通过 X-SSH-Session-Id 路由到对应集群 */
  sessionId?: string | null;
  onSkillsChange: () => void;
  messages: Message[];
  onMessagesChange: (msgs: Message[]) => void;
  onNewChat?: () => void;
  triggerAI?: { tabId: string; count: number }; // external trigger: increments → auto-respond to last user msg (agent mode)
  activeConversationId?: string | null; // changes → abort any running AI request
  /** Stable per-conversation key; unlike sessionId it changes for every new chat. */
  conversationContextId?: string;
  loadingConversationId?: string | null; // non-null while a conversation is being loaded
  onSaveToCluster?: () => void | Promise<void>;
  aiClusterControl?: boolean;
  /** 当前会话的历史摘要（来自会话存储），随请求注入供模型参考 */
  conversationSummary?: string;
  /** 打开集群文件树/传输工作区选择集群文件或目录（流程参数选路径、ask_user 选路径），取消时 resolve null */
  onPickRemoteFolder?: (kind?: PickPathKind) => Promise<string | null>;
  /** 直接在文件传输工作区定位到指定集群目录。 */
  onOpenRemoteFolder?: (path: string, sessionId?: string | null) => void;
  /** Codex 风格主工作区布局：对话居中，流程入口由左侧导航承载。 */
  workspaceLayout?: boolean;
  /** 当前后台计算目标，仅用于工作台标题栏展示。 */
  workspaceTargetLabel?: string;
  workspaceTargetConnected?: boolean;
  onOpenComputeBackend?: () => void;
  /** 打开右侧网页栏：http(s) 链接或集群远程 HTML（report.html 等） */
  onOpenWebPanel?: (request: WebPanelRequest) => void;
  /** 启动流程运行：交给 App 开该次运行专属的对话执行（避免串对话）；缺省时回退为当前对话内执行 */
  onStartWorkflowRun?: (message: string) => void;
}

//  Provider defaults 
const PROVIDERS: Record<string, string[]> = {
  ...PROVIDER_MODELS,
  kimi: PROVIDER_MODELS.moonshot,
};

//  Text similarity for dedup detection 
function textSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const wordsA = new Set(a.slice(0, 500).split(/\s+/));
  const wordsB = new Set(b.slice(0, 500).split(/\s+/));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  for (const w of wordsA) { if (wordsB.has(w)) intersection++; }
  return intersection / Math.max(wordsA.size, wordsB.size);
}

//  Extract file paths for result detection 
function extractOutputFiles(text: string): string[] {
  const patterns = [
    /(?:\/[\w.-]+)+\.(?:png|jpg|jpeg|gif|svg|bmp|webp|csv|tsv|pdf|html)/gi,
    /~(?:\/[\w.-]+)+\.(?:png|jpg|jpeg|gif|svg|bmp|webp|csv|tsv|pdf|html)/gi,
  ];
  const paths = new Set<string>();
  for (const p of patterns) {
    const matches = text.match(p) || [];
    matches.forEach(m => paths.add(m));
  }
  return Array.from(paths);
}

const MAX_RENDERED_MESSAGES = 500;

export type ConversationTimelineItem =
  | { type: 'message'; message: Message; absoluteIndex: number }
  | { type: 'execution'; items: ExecutionTraceItem[]; key: string };

function isExecutionTraceMessage(message: Message): boolean {
  if (message.role !== 'system') return false;
  return /^\[(?:AI 执行命令|命令输出|命令执行结果|命令输出已隐藏|Agent step|Agent 计划|计划进度|📋|技能搜索|搜索技能|技能结果|工具|监控作业|已保存技能)/.test(message.content.trim());
}

export function buildConversationTimeline(messages: Message[], absoluteStart: number): ConversationTimelineItem[] {
  const timeline: ConversationTimelineItem[] = [];
  let executionItems: ExecutionTraceItem[] = [];
  // 同一轮（两条用户消息之间）的执行内容合并为一张"执行过程"大卡，
  // 插到该轮首个执行项的位置，保持"解说→过程→结果"的阅读顺序
  let insertAt = -1;
  const flushExecution = () => {
    if (executionItems.length === 0) return;
    timeline.splice(insertAt < 0 ? timeline.length : insertAt, 0, {
      type: 'execution',
      key: `execution-${executionItems[0].absoluteIndex}`,
      items: executionItems,
    });
    executionItems = [];
    insertAt = -1;
  };
  messages.forEach((message, relativeIndex) => {
    const absoluteIndex = absoluteStart + relativeIndex;
    if (isExecutionTraceMessage(message)) {
      if (executionItems.length === 0) insertAt = timeline.length;
      executionItems.push({ message, absoluteIndex });
      return;
    }
    if (message.role === 'user') flushExecution();
    timeline.push({ type: 'message', message, absoluteIndex });
  });
  flushExecution();
  return timeline;
}

function buildFollowUpSuggestions(content: string, isEnglish: boolean, contextText = ''): string[] {
  const text = content.toLowerCase();
  const context = `${contextText}\n${text}`.toLowerCase();

  // 上下文感知：根据流程/对话当前状态给方向，而不是固定三条
  if (/blocked_env|环境缺失|环境未就绪|缺少环境/.test(context)) {
    return isEnglish
      ? ['Deploy the missing environment first', 'Show the missing items', 'Continue the workflow after deploy']
      : ['一键部署缺失环境', '查看缺失清单', '环境装好后继续流程'];
  }
  if (/死循环|没有新进展|安全上限|已明确暂停|waiting_user|等待用户/.test(context)) {
    return isEnglish
      ? ['Continue the workflow from this step', 'Show the current step details', 'Try a different approach for this step']
      : ['继续执行流程', '查看当前步骤详情', '换个思路处理当前步骤'];
  }
  if (/waiting_jobs|已提交.*作业|job .* submitted|作业完成后/.test(context)) {
    return isEnglish
      ? ['Check the job status', 'Continue when the job finishes']
      : ['查看作业运行状态', '作业完成后继续流程'];
  }
  if (/失败|错误|异常|error|failed|exception/.test(text)) {
    return isEnglish
      ? ['Recommended: diagnose the root cause', 'Show a safe fix', 'Tell me what information is missing']
      : ['推荐：继续定位根因', '给出安全修复方案', '告诉我还需补充什么信息'];
  }
  if (/完成|成功|已生成|done|completed|success/.test(text)) {
    return isEnglish
      ? ['Recommended: verify the result', 'Show the key output files', 'Turn this into a reusable workflow']
      : ['推荐：验证结果是否完整', '查看关键输出文件', '整理成可复用流程'];
  }
  if (/确认|选择|是否|which|choose|confirm/.test(text)) {
    return isEnglish
      ? ['Recommended: continue with your recommendation', 'Compare the options first', 'Let me add more details']
      : ['推荐：按你的建议继续', '先比较各选项差异', '我再补充一些信息'];
  }
  if (/流程|workflow/.test(context) && /running|运行中|执行中/.test(context)) {
    return isEnglish
      ? ['Continue the workflow', 'Show current progress']
      : ['继续执行流程', '查看当前进度'];
  }
  return isEnglish
    ? ['Recommended: give executable next steps', 'Explain the key reasoning', 'Suggest the best option']
    : ['推荐：给出可执行的下一步', '解释关键依据', '推荐最合适的方案'];
}

//  Message Bubble 
// React.memo：流式期间每个 token 都触发 AIChat 整体重渲染；消息列表不可变追加、msg 引用稳定，
// memo 后历史气泡跳过渲染体内的 thought 正则、extractOutputFiles 与逐行 split 等重计算
const MessageBubble = React.memo(function MessageBubble({ msg, index, sessionId, workspace, workflowRunDir, onOpenWebPanel }: { msg: Message; index: number; sessionId?: string | null; workspace?: string; workflowRunDir?: string | null; onOpenWebPanel?: (request: WebPanelRequest) => void }) {
  const [thoughtExpanded, setThoughtExpanded] = useState(false);

  // Parse thought steps
  const thoughtRegex = /<thought>([\s\S]*?)<\/thought>/g;
  const thoughts: string[] = [];
  let match;
  while ((match = thoughtRegex.exec(msg.content)) !== null) {
    thoughts.push(match[1].trim());
  }
  for (const step of msg.thoughtSteps || []) {
    if (step.content.trim() && !thoughts.includes(step.content.trim())) thoughts.push(step.content.trim());
  }
  const cleanContent = msg.content.replace(/<thought>[\s\S]*?<\/thought>/g, '').trim();
  const outputFiles = extractOutputFiles(msg.content);
  // validate_dsh_ui 的 UI spec JSON：从正文剥离改渲染为卡片（仅 assistant 答复），
  // 剥离后的文本也喂给路径卡片，避免 spec 内嵌路径被重复渲染
  const dshUi = msg.role === 'assistant' ? extractDshUiSpecs(cleanContent) : { specs: [] as const, strippedText: cleanContent };
  const markdownContent = dshUi.strippedText.trim();
  const isRemoteSession = !!sessionId && sessionId !== 'local-workbench';

  if (msg.role === 'system') {
    // Filter noisy system messages
    const text = msg.content || '';
    if (!shouldRenderSystemMessage(text)) {
      return null; // Don't render noisy progress messages
    }
    return (
      <div className="flex items-start mb-1.5">
        <div className="text-scholar-400 text-xs italic px-2 py-0.5 opacity-80 max-w-[95%]">
          {text}
          {/* system 通知里的图片路径同样内联出图（其余类型保持路径 + 下载） */}
          <DetectedFilesStrip files={outputFiles} role="system" sessionId={sessionId} workspace={workspace} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col mb-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
      <div data-message-bubble={msg.role} className={`p-2.5 rounded-lg max-w-[95%] ${
        msg.role === 'user'
          ? 'bg-accent/10 text-scholar-100 border border-accent/20'
          : 'bg-scholar-800 text-scholar-100 border border-scholar-700/60'
      }`}>
        {/* Thought chain visualization */}
        {thoughts.length > 0 && (
          <div className="mb-2 rounded-lg border border-scholar-700/70 bg-scholar-950/30 px-2.5 py-2">
            <button
              onClick={() => setThoughtExpanded(!thoughtExpanded)}
              className="flex w-full items-center gap-1.5 text-left text-[11px] text-scholar-400 hover:text-scholar-200"
            >
              {thoughtExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span>思考过程</span>
              <span className="text-scholar-500">· {thoughts.length} 步</span>
            </button>
            <AnimatePresence>
              {thoughtExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {thoughts.map((t, i) => (
                    <div key={i} className="mt-2 bg-scholar-900/60 border border-scholar-600/50 rounded p-2 text-[11px] text-scholar-300">
                      <div className="text-[10px] text-accent-dark/70 mb-0.5 font-medium">Step {i + 1}</div>
                      <div data-user-content="true" className="whitespace-pre-wrap break-words">{t.length > 500 ? t.slice(0, 500) + '...' : t}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Clean content */}
        {markdownContent && <div data-user-content="true"><MarkdownMessage content={markdownContent} onOpenWebPanel={onOpenWebPanel} sessionId={sessionId} workspace={workspace} /></div>}

        {/* validate_dsh_ui 的 UI spec 卡片 */}
        {dshUi.specs.length > 0 && (
          <div data-user-content="true">
            {dshUi.specs.map((spec, i) => (
              <DshUiSpecCard key={i} spec={spec} sessionId={isRemoteSession ? sessionId : undefined} local={!isRemoteSession} workspace={workspace} />
            ))}
          </div>
        )}

            {/* RichContent cards: auto-detect and display file outputs */}
            {msg.role === 'assistant' && (
              <div data-user-content="true">
                <RichContentMessage className="mt-2" sessionId={sessionId} workspace={workspace} pathBase={workflowRunDir} onOpenWebPanel={onOpenWebPanel}>
                  {dshUi.strippedText}
                </RichContentMessage>
              </div>
            )}

            {/* 网页内嵌预览：答复中的 http(s) 链接出可折叠预览卡（默认收起，不自动加载外网） */}
            {msg.role === 'assistant' && (
              <WebEmbedList text={dshUi.strippedText} onOpenWebPanel={onOpenWebPanel} />
            )}

        {/* Detected files：图片路径内联出图，其余路径文本 + 下载 */}
        <DetectedFilesStrip files={outputFiles} role={msg.role} sessionId={sessionId} workspace={workspace} />
      </div>
    </div>
  );
});

//  AI 配置表单字段（设置面板与首次配置共用，消除重复）
function AIProfileFields({
  datalistId, aiProvider, aiApiKey, aiModel, aiBaseUrl,
  onProviderChange, onApiKeyChange, onModelChange, onBaseUrlChange,
  apiKeyRequired = false,
}: {
  datalistId: string;
  aiProvider: AIProvider;
  aiApiKey: string;
  aiModel: string;
  aiBaseUrl: string;
  onProviderChange: (p: AIProvider) => void;
  onApiKeyChange: (v: string) => void;
  onModelChange: (v: string) => void;
  onBaseUrlChange: (v: string) => void;
  apiKeyRequired?: boolean;
}) {
  const fieldClass = "w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent";
  return (
    <>
      <div>
        <label className="block text-xs text-scholar-300 mb-1">AI 服务商</label>
        <select
          value={aiProvider}
          onChange={e => onProviderChange(e.target.value as AIProvider)}
          className={fieldClass}
        >
          <option value="deepseek">DeepSeek</option>
          <option value="openai">ChatGPT (OpenAI)</option>
          <option value="gemini">Gemini (Google)</option>
          <option value="grok">Grok (xAI)</option>
          <option value="moonshot">Moonshot/Kimi</option>
          <option value="custom-openai">Custom OpenAI-compatible</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-scholar-300 mb-1">API Key</label>
        <input
          type="password" required={apiKeyRequired} value={aiApiKey}
          onChange={e => onApiKeyChange(e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label className="block text-xs text-scholar-300 mb-1">模型</label>
        <input
          list={datalistId}
          value={aiModel}
          onChange={e => onModelChange(e.target.value)}
          className={fieldClass}
        />
        <datalist id={datalistId}>
          {(PROVIDERS[aiProvider] || []).map(m => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </div>
      {(aiProvider === 'custom-openai' || aiBaseUrl) && (
        <div>
          <label className="block text-xs text-scholar-300 mb-1">Base URL</label>
          <input
            value={aiBaseUrl}
            onChange={e => onBaseUrlChange(e.target.value)}
            placeholder="https://api.example.com/v1"
            className={fieldClass}
          />
        </div>
      )}
    </>
  );
}

function AgentSettingsFields({
  engine,
  onEngineChange,
  planningPolicy,
  confirmationPolicy,
  maxCommands,
  maxSteps,
  onPlanningPolicyChange,
  onConfirmationPolicyChange,
  onMaxCommandsChange,
  onMaxStepsChange,
}: {
  engine: AgentEnginePreference;
  onEngineChange: (value: AgentEnginePreference) => void;
  planningPolicy: AgentPlanningPolicy;
  confirmationPolicy: AgentConfirmationPolicy;
  maxCommands: number;
  maxSteps: number;
  onPlanningPolicyChange: (value: AgentPlanningPolicy) => void;
  onConfirmationPolicyChange: (value: AgentConfirmationPolicy) => void;
  onMaxCommandsChange: (value: number) => void;
  onMaxStepsChange: (value: number) => void;
}) {
  const fieldClass = 'w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent';
  return (
    <div className="space-y-3 border-t border-scholar-700 pt-3">
      <div className="text-xs font-medium text-scholar-200">Agent 执行策略</div>
      <div>
        <label className="block text-xs text-scholar-300 mb-1">智能体引擎</label>
        {IS_COMPETITION_EDITION ? (
          <div className={`${fieldClass} text-scholar-300`}>原生智能体（竞赛版固定）</div>
        ) : (
          <select value={engine} onChange={e => onEngineChange(e.target.value as AgentEnginePreference)} className={fieldClass}>
            <option value="auto">智能选择（推荐）</option>
            <option value="native">HPClaw 原生智能体</option>
            <option value="dsh">DSH 智能体</option>
          </select>
        )}
        <p className="mt-1 text-[10px] text-scholar-500">
          {IS_COMPETITION_EDITION
            ? '竞赛版仅移除 DSH，固定使用 HPClaw 原生智能体；流程功能完整保留。'
            : 'DSH 当前用于 DeepSeek 普通 Agent 任务；正式流程自动使用原生引擎，以保留断点、证据和作业监控。'}
        </p>
      </div>
      <div>
        <label className="block text-xs text-scholar-300 mb-1">规划方式</label>
        <select value={planningPolicy} onChange={e => onPlanningPolicyChange(e.target.value as AgentPlanningPolicy)} className={fieldClass}>
          <option value="auto">智能判断（推荐）</option>
          <option value="always">所有任务先规划</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-scholar-300 mb-1">执行前确认</label>
        <select value={confirmationPolicy} onChange={e => onConfirmationPolicyChange(e.target.value as AgentConfirmationPolicy)} className={fieldClass}>
          <option value="dangerous">高风险与联网操作（推荐）</option>
          <option value="state_changes">写入、联网、提交作业都确认</option>
          <option value="every_command">每条命令都确认</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-scholar-300 mb-1">单次最多命令数（{MIN_AGENT_COMMANDS}–{MAX_AGENT_COMMANDS}）</label>
        <input type="number" min={MIN_AGENT_COMMANDS} max={MAX_AGENT_COMMANDS} value={maxCommands} onChange={e => onMaxCommandsChange(Number(e.target.value))} className={fieldClass} />
      </div>
      <div>
        <label className="block text-xs text-scholar-300 mb-1">单次最多 Agent 步骤（{MIN_AGENT_STEPS}–{MAX_AGENT_STEPS}）</label>
        <input type="number" min={MIN_AGENT_STEPS} max={MAX_AGENT_STEPS} value={maxSteps} onChange={e => onMaxStepsChange(Number(e.target.value))} className={fieldClass} />
        <p className="mt-1 text-[10px] text-scholar-500">达到上限时会暂停当前任务，不会删除对话；已保存流程会自动使用 200 步执行档，通常可一轮跑完整个流程。</p>
      </div>
    </div>
  );
}

// 
// AIChat Component
// 
export default function AIChat({ isOpen, executeCommand, socket, sessionId, onSkillsChange, messages, onMessagesChange, onNewChat, triggerAI, activeConversationId, conversationContextId, loadingConversationId, onSaveToCluster, aiClusterControl, conversationSummary, onPickRemoteFolder, onOpenRemoteFolder, workspaceLayout = false, workspaceTargetLabel, workspaceTargetConnected = false, onOpenComputeBackend, onOpenWebPanel, onStartWorkflowRun }: AIChatProps) {
  const { locale, isEnglish, t } = useI18n();
  // AI Config
  // 惰性初始化：localStorage 同步读取 + JSON.parse 仅在挂载时执行一次；
  // 此前每次渲染（含流式每个 token）都重复解析，且 isOpen=false 提前返回在 hooks 之后，所有标签页实例都承担这份开销
  const [initialProfile] = useState(() => loadAIProfile());
  const [aiProvider, setAiProvider] = useState(initialProfile.provider);
  const [aiApiKey, setAiApiKey] = useState(initialProfile.apiKey);
  const [aiModel, setAiModel] = useState(initialProfile.model);
  const [aiBaseUrl, setAiBaseUrl] = useState(initialProfile.baseUrl || '');
  const [initialAgentSettings] = useState(() => loadAgentSettings());
  const [agentEngine, setAgentEngine] = useState<AgentEnginePreference>(
    IS_COMPETITION_EDITION ? 'native' : initialAgentSettings.engine,
  );
  const [agentPlanningPolicy, setAgentPlanningPolicy] = useState<AgentPlanningPolicy>(initialAgentSettings.planningPolicy);
  const [agentConfirmationPolicy, setAgentConfirmationPolicy] = useState<AgentConfirmationPolicy>(initialAgentSettings.confirmationPolicy);
  const [agentMaxCommands, setAgentMaxCommands] = useState(initialAgentSettings.maxCommands);
  const [agentMaxSteps, setAgentMaxSteps] = useState(initialAgentSettings.maxSteps);
  const [isAiSetup, setIsAiSetup] = useState(!!initialProfile.apiKey);
  const [showSettings, setShowSettings] = useState(false);

  const [inputValue, setInputValue] = useState('');

  // Ref to track latest messages for use in async closures
  const messagesRef = useRef(messages);
  messagesRef.current = messages; // Immediate sync (not useEffect - too slow for rapid updates)

  const addMessage = useCallback((msg: Message) => {
    messagesRef.current = [...messagesRef.current, msg];
    onMessagesChange(messagesRef.current);
  }, [onMessagesChange]);

  const addMessages = useCallback((msgs: Message[]) => {
    messagesRef.current = [...messagesRef.current, ...msgs];
    onMessagesChange(messagesRef.current);
  }, [onMessagesChange]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Agent 本地工作区：dsh 引擎本地工具的落点目录（随 agent 请求体发给服务端）
  const [agentWorkspace, setAgentWorkspace] = useState(() => loadAgentWorkspace());
  const [workspaceError, setWorkspaceError] = useState('');

  const handlePickAgentWorkspace = useCallback(async () => {
    const desktop = window.hpclawDesktop;
    if (!desktop?.dialog || !desktop.localFiles) return;
    try {
      const picked = await desktop.dialog.pickDirectory();
      if (!picked) return; // 用户取消
      const stat = await desktop.localFiles.stat(picked);
      if (stat.kind !== 'directory') throw new Error('not a directory');
      setWorkspaceError('');
      setAgentWorkspace(saveAgentWorkspace(picked));
    } catch {
      setWorkspaceError(t('所选路径不是有效文件夹'));
    }
  }, [t]);

  const handleClearAgentWorkspace = useCallback(() => {
    clearAgentWorkspace();
    setAgentWorkspace('');
    setWorkspaceError('');
  }, []);

  // 纯 Web 开发环境没有桌面目录选择器，也无法校验路径，blur 时原样保存
  const handleWorkspaceInputBlur = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed) {
      setAgentWorkspace(saveAgentWorkspace(trimmed));
    } else {
      clearAgentWorkspace();
      setAgentWorkspace('');
    }
    setWorkspaceError('');
  }, []);

  //  对话附件：仅保存路径引用，发送时把路径追加进消息文本 
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [attachmentError, setAttachmentError] = useState('');
  const [attachmentBusy, setAttachmentBusy] = useState(false);
  const isClusterChat = !!sessionId && sessionId !== 'local-workbench';

  const handleAttachClick = useCallback(() => {
    setAttachmentError('');
    if (!window.hpclawDesktop?.getPathForFile || !window.hpclawDesktop.localFiles) {
      setAttachmentError(t('附件功能需要桌面端支持，浏览器模式无法获取文件路径'));
      return;
    }
    if (!isClusterChat && !agentWorkspace.trim()) {
      setAttachmentError(t('请先选择工作文件夹，再添加附件'));
      return;
    }
    attachmentInputRef.current?.click();
  }, [t, isClusterChat, agentWorkspace]);

  const handleAttachmentFiles = useCallback(async (files: FileList | null) => {
    const desktop = window.hpclawDesktop;
    if (!files || files.length === 0 || !desktop?.getPathForFile || !desktop.localFiles) return;
    setAttachmentBusy(true);
    setAttachmentError('');
    try {
      for (const file of Array.from(files)) {
        const localPath = desktop.getPathForFile(file);
        if (!localPath) throw new Error('empty file path');
        const name = file.name || baseName(localPath) || 'attachment';
        if (isClusterChat && sessionId) {
          // 集群模式：固定上传到 ~/hpclaw_uploads/（SFTP 相对路径即家目录），走传输队列可见进度
          try { await mkdirRemote(sessionId, CLUSTER_ATTACHMENT_DIR); } catch { /* 已存在则忽略 */ }
          const remotePath = `${CLUSTER_ATTACHMENT_DIR}/${name}`;
          await enqueueTransfer(sessionId, {
            profileId: resolveTransferProfileId({ sessionId }),
            sessionId,
            direction: 'upload' as const,
            localPath,
            remotePath,
            temporaryPath: makeTemporaryTransferName(remotePath, uuidv4(), 'remote'),
            totalBytes: file.size,
            transferredBytes: 0,
            conflictPolicy: 'overwrite' as const,
            verificationMode: 'size' as const,
            retryCount: 0,
          });
          setAttachments(prev => [...prev, { id: uuidv4(), name, refPath: `~/${remotePath}` }]);
        } else {
          // 本地模式：复制进工作区 attachments/ 子目录（copy 内部重名自动加序号，不覆盖）
          const workspace = agentWorkspace.trim();
          const attachDir = joinLocalPath(workspace, 'attachments');
          await desktop.localFiles.mkdir(attachDir);
          const copied = await desktop.localFiles.copy([localPath], attachDir);
          const destName = baseName(copied.paths[0] || '') || name;
          setAttachments(prev => [...prev, { id: uuidv4(), name: destName, refPath: `attachments/${destName}` }]);
        }
      }
    } catch (error: any) {
      setAttachmentError(`${t('附件添加失败')}：${error?.message || String(error)}`);
    } finally {
      setAttachmentBusy(false);
    }
  }, [t, isClusterChat, sessionId, agentWorkspace]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(item => item.id !== id));
  }, []);
  const { log } = useObservationLogger();
  // 把本地 AI 配置同步到服务端共享（QQ 机器人等服务端功能直接复用同一份配置）
  const pushAiProfileToServer = useCallback((profile: { provider: string; model: string; apiKey: string; baseUrl?: string }) => {
    if (!profile.apiKey) return;
    void fetch('/api/ai-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    }).catch(() => {});
  }, []);
  const persistAiProfile = useCallback(() => {
    const saved = saveAIProfile({
      provider: aiProvider,
      model: aiModel,
      apiKey: aiApiKey,
      baseUrl: aiBaseUrl,
    });
    setAiProvider(saved.provider);
    setAiModel(saved.model);
    setAiApiKey(saved.apiKey);
    setAiBaseUrl(saved.baseUrl || '');
    setIsAiSetup(!!saved.apiKey);
    const agentSettings = saveAgentSettings({
      engine: IS_COMPETITION_EDITION ? 'native' : agentEngine,
      planningPolicy: agentPlanningPolicy,
      confirmationPolicy: agentConfirmationPolicy,
      maxCommands: agentMaxCommands,
      maxSteps: agentMaxSteps,
    });
    setAgentEngine(agentSettings.engine);
    setAgentPlanningPolicy(agentSettings.planningPolicy);
    setAgentConfirmationPolicy(agentSettings.confirmationPolicy);
    setAgentMaxCommands(agentSettings.maxCommands);
    setAgentMaxSteps(agentSettings.maxSteps);
    pushAiProfileToServer(saved);
  }, [aiProvider, aiModel, aiApiKey, aiBaseUrl, agentEngine, agentPlanningPolicy, agentConfirmationPolicy, agentMaxCommands, agentMaxSteps, pushAiProfileToServer]);

  // 启动时同步一次已有配置，保证服务端（QQ 机器人）开箱即用
  useEffect(() => {
    const p = loadAIProfile();
    if (p.apiKey) pushAiProfileToServer(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Streaming state
  const [streamingReasoning, setStreamingReasoning] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiStatus, setAiStatus] = useState('AI 正在准备…');
  const abortRef = useRef<AbortController | null>(null);
  const agentReaderRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const aiRunIdRef = useRef(0);
  const aiRunningRef = useRef(false); // ref guard — avoids stale isAiLoading races
  const stoppedByUserRef = useRef(false); // distinguish user stop from timeout abort
  const lastUserTextRef = useRef(''); // 最近一次提交的用户输入，断流重试用
  const agentPlanRef = useRef<any>(null); // ask_user/断线后的跨轮结构化计划
  const agentPlanConversationRef = useRef<string | null | undefined>(activeConversationId);
  const persistAgentPlan = useCallback((plan: any | null) => {
    agentPlanRef.current = plan || null;
    messagesRef.current = upsertAgentPlanCheckpoint(messagesRef.current, plan || null) as Message[];
    onMessagesChange(messagesRef.current);
  }, [onMessagesChange]);
  const lastTriggerRef = useRef({
    agent: triggerAI && sessionId && triggerAI.tabId === sessionId ? triggerAI.count : 0,
  });

  // Skills
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'skills' | 'workflows'>('chat');
  // 流程可视化运行面板当前打开的流程
  const [runnerWorkflow, setRunnerWorkflow] = useState<Workflow | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  // 聊天输入关键词匹配到的流程
  const [wfMatches, setWfMatches] = useState<(Workflow & { score: number })[]>([]);

  //  Command Confirmation Gates 
  type ConfirmMode = 'ask' | 'trust_all';
  // 信任状态跨轮次、跨重启保留：用户点一次"信任全部"后不再逐条弹确认，
  // 直到在输入区上方主动取消（此前每轮开头强制重置为 ask，信任等于无效）。
  const CONFIRM_MODE_KEY = 'hpclaw-confirm-mode';
  const [confirmMode, setConfirmMode] = useState<ConfirmMode>(() => {
    try { return localStorage.getItem(CONFIRM_MODE_KEY) === 'trust_all' ? 'trust_all' : 'ask'; }
    catch { return 'ask'; }
  });
  // SSE 事件循环读 ref 而不是 state：React 闭包在流式循环运行期间不会更新，
  // 点"信任全部"必须当轮立即生效（旧实现读 state 快照，信任从来不生效）。
  const confirmModeRef = useRef<ConfirmMode>(confirmMode);
  const applyConfirmMode = useCallback((mode: ConfirmMode) => {
    confirmModeRef.current = mode;
    setConfirmMode(mode);
    try { localStorage.setItem(CONFIRM_MODE_KEY, mode); } catch { /* 隐私模式下忽略 */ }
  }, []);
  const [currentCwd, setCurrentCwd] = useState<string>('');
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [pendingCommandDirWarning, setPendingDirWarning] = useState(false);
  const [pendingMode, setPendingMode] = useState<'command' | 'monitor'>('command');
  const confirmResolveRef = useRef<((action: 'execute' | 'reject' | 'trust') => void) | null>(null);
  const currentPwdRef = useRef<string>('');
  // AI 反问（agent ask_user）：问题 + 可点选候选答案，固定显示在底部输入框上方
  const [pendingAsk, setPendingAsk] = useState<{
    question: string;
    options: string[];
    /** dsh 在原流中等答案时的服务端挂起 id；内置 Agent 反问无此字段。 */
    id?: string;
  } | null>(null);

  function checkDirBoundary(cmd: string): boolean {
    // Check if command accesses paths outside common safe locations
    const paths = cmd.match(/[\s'"](\/(?!tmp|share|dev|proc|sys)[\w.-]+(?:\/[\w.-]*)*)/g) || [];
    const pwd = currentPwdRef.current;
    if (!pwd) return false;
    for (const p of paths) {
      const clean = p.trim().replace(/^['"]|['"]$/g, '');
      if (clean.startsWith(pwd)) continue;
      if (clean.startsWith('/tmp') || clean.startsWith('/share') || clean.startsWith('/dev')) continue;
      return true;
    }
    return false;
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // 用户是否贴在底部附近（阈值 80px）：上翻阅读时置 false，流式追加不再打断阅读
  const stickToBottomRef = useRef(true);
  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };
  // behavior 用 auto：流式每个 token 触发一次滚动，smooth 动画叠加重渲染会掉帧
  const scrollToBottom = () => {
    if (stickToBottomRef.current) messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };
  useEffect(() => { scrollToBottom(); }, [messages, streamingContent, isStreaming, activeTab]);

  // 切换/新建对话后清掉未回答的反问卡片
  useEffect(() => {
    setPendingAsk(null);
    // 切换会话后恢复贴底，保证加载完会话自动滚动到最新消息
    stickToBottomRef.current = true;
    const previous = agentPlanConversationRef.current;
    // 新对话首次保存会从 null 获得 id，此时保留正在运行的计划；真正切换会话时清理。
    if ((previous && previous !== activeConversationId) || (previous !== undefined && activeConversationId === null)) {
      agentPlanRef.current = null;
    }
    agentPlanConversationRef.current = activeConversationId;
    const savedPlan = findLatestAgentPlanCheckpoint(messages);
    if (savedPlan) agentPlanRef.current = savedPlan;
    else if (!aiRunningRef.current) agentPlanRef.current = null;
  }, [activeConversationId, messages]);

  // 组件卸载（切换集群标签页触发重挂载）时中止在途的 AI 流式请求
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (agentReaderRef.current) {
        void closeSseReader(agentReaderRef.current, 'stale-run');
        agentReaderRef.current = null;
      }
    };
  }, []);

  // Manual save-to-cluster button handler
  const handleSaveToClusterClick = async () => {
    if (!onSaveToCluster) return;
    setSaveState('saving');
    try {
      await onSaveToCluster();
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    } catch {
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  // Load skills
  const loadSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills', {
        headers: sessionId ? { 'X-SSH-Session-Id': sessionId } : {},
      });
      const data = await res.json();
      if (data.success) setSkills(data.skills);
    } catch (e) { console.error(e); }
  }, [sessionId]);

  useEffect(() => { loadSkills(); }, [loadSkills]);
  useEffect(() => { onSkillsChange(); }, [skills, onSkillsChange]);

  // Monitoring
  const [isMonitoring, setIsMonitoring] = useState(false);
  const monitoringRef = useRef<{ active: boolean; timer: NodeJS.Timeout | null }>({
    active: false, timer: null
  });

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    monitoringRef.current.active = false;
    if (monitoringRef.current.timer) clearTimeout(monitoringRef.current.timer);
    if (socket) socket.emit('data', '\x03');
    addMessage({ role: 'system', content: '【已中断】' });
  }, [socket]);

  const handleSaveSkill = async (filename: string, content: string) => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content }),
      });
      const data = await res.json();
      if (data.success) {
        setSkills(prev => {
          const filtered = prev.filter(s => s.filename !== filename);
          return [...filtered, { filename, content }];
        });
        return true;
      }
      return false;
    } catch { return false; }
  };

  //  Intelligent Job Monitor 
  async function monitorJob(
    jobId: string,
    contextMsgs: { role: string; content: string }[],
    loopCount: { value: number },
    isTaskDone: { value: boolean },
  ): Promise<string | null> {
    addMessage({ role: 'system', content: `[ ${jobId}10]` });
    let lastStatus = '';
    const maxPolls = 48; // 10min × 48 = 8 hours max

    for (let poll = 0; poll < maxPolls; poll++) {
      // Check for abort
      if (abortRef.current?.signal.aborted) {
        addMessage({ role: 'system', content: `[ ${jobId} ]` });
        return null;
      }

      await new Promise(r => setTimeout(r, 600000)); // 10 min interval

      try {
        const statusOutput = await executeCommand(
          `bjobs -l ${jobId} 2>/dev/null | head -20; echo "---STAT---"; bjobs -noheader ${jobId} 2>/dev/null`,
          true,
        );

        // Parse status from bjobs output
        const statusMatch = statusOutput.match(/Status\s+:\s+(\w+)/i) ||
                           statusOutput.match(/^(\w+)\s+\d+/m);
        const currentStatus = statusMatch?.[1]?.trim() || 'UNKNOWN';

        if (currentStatus !== lastStatus) {
          lastStatus = currentStatus;
          addMessage({ role: 'system', content: `[ ${jobId} : ${currentStatus}]` });

          if (currentStatus === 'DONE') {
            addMessage({ role: 'system', content: `[ ${jobId} ...]` });
            // Get output
            const outLog = await executeCommand(`ls *${jobId}*.log 2>/dev/null && cat *${jobId}*.log 2>/dev/null | tail -30 || cat *.out 2>/dev/null | tail -30`, true);
            contextMsgs.push({ role: 'user', content: `<job_result jobId="${jobId}" status="DONE">\n${outLog}\n</job_result>\n` });
            return outLog;
          }

          if (currentStatus === 'EXIT') {
            const errLog = await executeCommand(`cat *${jobId}*.err 2>/dev/null | tail -20 || echo ""`, true);
            contextMsgs.push({ role: 'user', content: `<job_result jobId="${jobId}" status="EXIT">\n${errLog}\n</job_result>\n` });
            return errLog;
          }
        }
      } catch {
        // best-effort monitoring
      }
    }

    addMessage({ role: 'system', content: `[ ${jobId} 8]` });
    return null;
  }

  //  Agent Mode
  const handleAgentMode = async (userText: string, requestMessages: Message[], runId: number, signal: AbortSignal) => {
    // 必须在聊天传输裁剪前从完整消息恢复正式流程。
    const workflowRunContext = findLatestWorkflowExecutionContext(requestMessages);
    stoppedByUserRef.current = false;
    setIsStreaming(true);
    setStreamingReasoning('');
    setStreamingContent('');
    setAiStatus(workflowRunContext ? '正在恢复流程进度…' : '正在连接 HPClaw Agent…');

    let fullText = '';
    let fullReasoning = '';
    let lastPreviewUpdateAt = 0;
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    let readerCloseReason: SseReaderCloseReason = 'completed';

    let fetchTimedOut = false;
    const FETCH_TIMEOUT_MS = 930_000;
    // 与服务端 Agent 的 15 分钟硬上限对齐，多步骤任务不再被前端提前中止。
    const STREAM_IDLE_MS = 90_000; // 90s 无任何数据判定断流（服务端 15s 心跳，90s 无消息即异常）

    try {
      console.log('[AI] Agent fetch start, runId=%d, msgCount=%d', runId, requestMessages.length);
      // 正式流程上下文单独传输，不依赖最近 18 条窗口；长流程仍可读取 RUN/run.json 续跑。
      // Compress only large multi-turn conversations; small JSON bodies are
      // safer uncompressed through Apache/Baota reverse proxies.
      const reqPayload = {
        profile: { provider: aiProvider, model: aiModel, apiKey: aiApiKey, baseUrl: aiBaseUrl || undefined },
        messages: prepareMessagesForAiTransport(requestMessages).map(m => ({ role: m.role, content: m.content })),
        mode: 'agent' as const,
        showInTerminal: !!aiClusterControl,
        summary: conversationSummary || undefined,
        agentConfig: {
          engine: IS_COMPETITION_EDITION ? 'native' : agentEngine,
          planningPolicy: agentPlanningPolicy,
          confirmationPolicy: agentConfirmationPolicy,
          maxCommands: agentMaxCommands,
          maxSteps: agentMaxSteps,
        },
        resumePlan: agentPlanRef.current || undefined,
        workflowRunContext: workflowRunContext || undefined,
        locale,
        workspace: agentWorkspace || undefined,
        conversationId: activeConversationId || undefined,
        conversationContextId: conversationContextId || undefined,
      };
      const { body: reqBody, headers } = await prepareAiRequestBody(reqPayload);
      // 多集群标签页：显式指定本会话，避免被 cookie 里的其他会话劫持
      const reqHeaders = sessionId ? { ...headers, 'X-SSH-Session-Id': sessionId } : headers;

      // Retryable fetch — handles transient ECONNRESET due to TCP race conditions
      // between the browser's connection pool and the server's socket lifecycle.
      let response: Response | undefined;
      let lastFetchErr: any;
      for (let attempt = 0; attempt < 3; attempt++) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        try {
          response = await fetch('/api/ai/stream', {
            method: 'POST',
            headers: reqHeaders,
            body: reqBody,
            signal,
          });
          break; // success
        } catch (err: any) {
          lastFetchErr = err;
          // Only retry on network errors (TypeError), not on AbortError or HTTP errors
          if (attempt < 2 && err.name === 'TypeError' && !signal.aborted) {
            console.log('[AI] Fetch attempt %d failed with %s, retrying…', attempt + 1, err.message || err.name);
            await new Promise(r => setTimeout(r, (attempt + 1) * 400));
            continue;
          }
          throw err;
        }
      }
      if (!response) throw lastFetchErr;

      if (!response.ok) {
        let errMsg = `HTTP ${response.status}`;
        try { const err = await response.json(); errMsg = err.error || errMsg; } catch {}
        throw new Error(errMsg);
      }

      reader = response.body!.getReader();
      agentReaderRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = '';
      const fetchStart = Date.now();

      while (true) {
        // Check user-initiated stop (handleStop increments aiRunIdRef)
        if (!isCurrentAiRun(aiRunIdRef.current, runId)) {
          readerCloseReason = 'stale-run';
          break;
        }
        // 总时长上限
        if (Date.now() - fetchStart > FETCH_TIMEOUT_MS) {
          fetchTimedOut = true;
          readerCloseReason = 'timeout';
          break;
        }
        // 流空闲检测：服务端静默时 read() 会永久阻塞，90s 无数据判定断流
        let readResult: ReadableStreamReadResult<Uint8Array>;
        try {
          readResult = await Promise.race([
            reader.read(),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('__stream_idle__')), STREAM_IDLE_MS)),
          ]);
        } catch (idleErr: any) {
          if (idleErr?.message === '__stream_idle__') {
            fetchTimedOut = true;
            readerCloseReason = 'timeout';
            break;
          }
          throw idleErr;
        }
        const { done, value } = readResult;
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const event = JSON.parse(trimmed.slice(6));

            switch (event.type) {
              case 'status':
                if (event.message) setAiStatus(String(event.message));
                break;
              case 'content':
                fullText += event.content;
                if (Date.now() - lastPreviewUpdateAt >= 50) {
                  lastPreviewUpdateAt = Date.now();
                  setStreamingContent(fullText);
                }
                setAiStatus('AI 正在组织结果…');
                break;
              case 'reasoning':
                fullReasoning += event.content || '';
                if (Date.now() - lastPreviewUpdateAt >= 50) {
                  lastPreviewUpdateAt = Date.now();
                  setStreamingReasoning(fullReasoning);
                }
                setAiStatus(workflowRunContext ? '流程执行器正在核对当前步骤…' : 'AI 正在推理和规划…');
                break;
              case 'tool_call':
                setAiStatus(event.name === 'run_command' ? 'AI 正在执行计算资源命令…' : `AI 正在使用 ${event.name || '工具'}…`);
                // 保留“显示 AI 正在运行什么代码”的能力：run_command 在聊天中显示命令
                if (event.name === 'run_command') {
                  const args = typeof event.args === 'string' ? event.args : JSON.stringify(event.args);
                  const command = (event.args as { command?: string })?.command || args;
                  addMessage({ role: 'system', content: `[AI 执行命令] ${command}` });
                } else {
                  addMessage({
                    role: 'system',
                    content: `[🔧 ${event.name}] ${typeof event.args === 'string' ? event.args : JSON.stringify(event.args)}`,
                  });
                }
                break;
              case 'tool_result':
                // 命令类工具的输出保留在上下文但不在 UI 中直接展示
                if (event.name === 'run_command') {
                  addMessage({
                    role: 'system',
                    content: `[命令输出已隐藏]\n${(event.result || '').slice(0, 500)}`,
                  });
                } else {
                  // validate_dsh_ui 的 UI spec JSON 需要完整可解析才能渲染成卡片，放宽截断
                  const toolResultLimit = event.name === 'validate_dsh_ui' ? 4000 : 500;
                  addMessage({
                    role: 'system',
                    content: `[📋 ${event.name}] ${(event.result || '').slice(0, toolResultLimit)}`,
                  });
                }
                break;
              case 'step':
                // Step indicator: show for first few steps only
                if (event.step && event.step <= 3) {
                  addMessage({ role: 'system', content: `[Agent step ${event.step}]` });
                }
                break;
              case 'plan': {
                const plan = event.plan;
                persistAgentPlan(plan || null);
                const steps = Array.isArray(plan?.steps)
                  ? plan.steps.map((step: any) => `${step.id}. ${step.title}（验证：${step.verification}）`).join('\n')
                  : '';
                addMessage({ role: 'system', content: `[Agent 计划]\n目标：${plan?.goal || userText}\n${steps}` });
                break;
              }
              case 'plan_update': {
                const previousStep = Array.isArray(agentPlanRef.current?.steps)
                  ? agentPlanRef.current.steps.find((item: any) => String(item.id) === String(event.stepId))
                  : null;
                if (event.plan) persistAgentPlan(event.plan);
                const step = Array.isArray(event.plan?.steps)
                  ? event.plan.steps.find((item: any) => String(item.id) === String(event.stepId))
                  : null;
                if (step && (previousStep?.status !== step.status || step.summary !== previousStep?.summary)) {
                  const detail = step.summary ? `：${step.summary}` : '';
                  addMessage({ role: 'system', content: `[计划进度] ${step.id}. ${step.title} → ${step.status}${detail}` });
                }
                break;
              }
              case 'ask': {
                const question = String(event.question || (isEnglish ? 'Please confirm the next step.' : '请确认下一步。'));
                setPendingAsk({
                  question,
                  options: ensureUserChoiceOptions(question, event.options, locale),
                  id: typeof event.id === 'string' && event.id ? event.id : undefined,
                });
                addMessage({ role: 'assistant', content: `❓ ${question}` });
                break;
              }
              case 'confirm': {
                const confirmId = String(event.id || '');
                const command = String(event.command || '');
                const reply = (approved: boolean) => fetch('/api/ai/confirm', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: confirmId, approved }),
                }).catch(() => {});
                if (confirmModeRef.current === 'trust_all') {
                  void reply(true);
                  break;
                }
                setPendingMode('command');
                setPendingCommand(command);
                setPendingDirWarning(checkDirBoundary(command));
                confirmResolveRef.current = (action) => {
                  if (action === 'trust') applyConfirmMode('trust_all');
                  void reply(action !== 'reject');
                  setPendingCommand(null);
                  setPendingDirWarning(false);
                  confirmResolveRef.current = null;
                };
                break;
              }
              case 'ask_done':
                // Agent finished after asking. Clear streaming preview first
                // so the final message doesn't visually duplicate.
                aiRunningRef.current = false;
                if (isCurrentAiRun(aiRunIdRef.current, runId)) setIsAiLoading(false);
                setStreamingContent('');
                setAiStatus('AI 已等待你回答');
                if (fullText.trim()) {
                  addMessage({ role: 'assistant', content: fullText.trim() });
                }
                fullText = '';
                break;
              case 'done':
                aiRunningRef.current = false;
                if (isCurrentAiRun(aiRunIdRef.current, runId)) setIsAiLoading(false);
                setStreamingContent('');
                setAiStatus('AI 已完成');
                const finalText = resolveAgentDoneText(fullText, event.content);
                if (finalText) {
                  addMessage({ role: 'assistant', content: finalText });
                } else if (isAgentDoneCancelled(fullText, event.content)) {
                  addMessage({ role: 'system', content: '[🛑 Agent cancelled]' });
                }
                if (Array.isArray(agentPlanRef.current?.steps) && agentPlanRef.current.steps.every((step: any) => step.status === 'done' || step.status === 'skipped')) {
                  persistAgentPlan(null);
                }
                fullText = '';
                break;
              case 'ssh_dead':
                addMessage({ role: 'system', content: '⚠️ SSH 会话已断开，请重新连接（对话已保留）' });
                setErrorMessage(event.error || 'SSH disconnected');
                aiRunningRef.current = false;
                if (isCurrentAiRun(aiRunIdRef.current, runId)) setIsAiLoading(false);
                setIsStreaming(false);
                setAiStatus('SSH 主连接已断开');
                break;
              case 'error':
                addMessage({ role: 'system', content: `[❌ Error] ${event.error}` });
                setErrorMessage(String(event.error || 'AI 请求出错'));
                // 错误事件本身就是本轮的终止状态。不等待供应商/服务端
                // 再额外关闭连接，避免界面继续显示“生成中”。
                aiRunningRef.current = false;
                if (isCurrentAiRun(aiRunIdRef.current, runId)) setIsAiLoading(false);
                setIsStreaming(false);
                setStreamingContent('');
                setStreamingReasoning('');
                setAiStatus('AI 本轮已结束');
                break;
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }

      // If we got here and haven't added the final text yet
      if (fullText && fullText !== '__ASK__' && fullText !== '__CANCELLED__') {
        // Content was already streamed via setStreamingContent;
        // the final assistant message was added on 'done' event.
      }
      // Release reader lock so the browser can reuse the TCP connection.
      // Do not cancel on normal EOF: that can turn a clean SSE finish into a
      // client-side abort and poison the next POST behind nginx.
      await closeSseReader(reader, readerCloseReason);
      if (fetchTimedOut && !stoppedByUserRef.current) {
        addMessage({ role: 'system', content: '[⏱️ AI request timeout or connection lost, please retry]' });
        setErrorMessage('AI 请求超时或连接中断，可点击重试');
      }
    } catch (err: any) {
      await closeSseReader(reader, 'error');
      if (fetchTimedOut) {
        if (!stoppedByUserRef.current) {
          addMessage({ role: 'system', content: '[⏱️ AI request timeout or connection lost, please retry]' });
          setErrorMessage('AI 请求超时或连接中断，可点击重试');
        }
      } else if (err.name !== 'AbortError') {
        // Only show non-abort errors (AbortError is from user stop, no need to show)
        addMessage({ role: 'system', content: `[✗ Agent error] ${err.message || String(err)}` });
        setErrorMessage(err.message || String(err));
      }
      stoppedByUserRef.current = false;
    } finally {
      agentReaderRef.current = null;
      if (isCurrentAiRun(aiRunIdRef.current, runId)) {
        setIsStreaming(false);
        setStreamingContent('');
        setStreamingReasoning('');
      }
    }
  };

  // Clear stream on new submit

  const submitToAI = async (
    userText: string,
    options: { appendUserMessage: boolean } = { appendUserMessage: true },
  ) => {
    const trimmed = userText.trim();
    if (!trimmed) return;
    lastUserTextRef.current = trimmed; // 供断流后的"重试"使用
    setPendingAsk(null); // 用户作答（或发起新任务）后关闭反问卡片
    if (aiRunningRef.current) {
      // Cleanly tear down the in-flight request BEFORE starting a new one.
      // Must await reader.cancel() so the TCP RST is fully processed by the
      // browser before the next fetch opens a new connection; otherwise the
      // browser's connection pool can get confused and ECONNRESET the new POST.
      aiRunningRef.current = false;
      aiRunIdRef.current += 1;
      const prevReader = agentReaderRef.current;
      agentReaderRef.current = null;
      if (prevReader) {
        await closeSseReader(prevReader, 'stale-run');
      }
      abortRef.current?.abort();
      setErrorMessage('');
      // Let the browser's TCP stack process the connection teardown.
      await new Promise(r => setTimeout(r, 80));
    }

    aiRunningRef.current = true;
    const runId = ++aiRunIdRef.current;
    setIsAiLoading(true);
    setAiStatus('AI 正在准备…');
    setErrorMessage('');
    // Fresh AbortController per request — never reuse a stale one.
    const controller = new AbortController();
    abortRef.current = controller;

    const requestMessages = buildOutgoingMessages(
      messagesRef.current,
      trimmed,
      options.appendUserMessage,
    );

    if (options.appendUserMessage) {
      addMessage({ role: 'user', content: trimmed });
    }

    try {
      await handleAgentMode(trimmed, requestMessages, runId, controller.signal);
    } catch (err: any) {
      console.error('[AIChat] Submit error:', err);
      const msg = err.message || String(err);
      setErrorMessage(msg);
      addMessage({ role: 'system', content: `Error: ${msg}` });
    } finally {
      if (isCurrentAiRun(aiRunIdRef.current, runId)) {
        aiRunningRef.current = false;
        setIsAiLoading(false);
        setIsStreaming(false);
      }
    }
  };

  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  /**
   * dsh 的 ask_user_question 不是新一轮对话：必须保持当前 SSE，只把答案
   * 回给服务端挂起项。否则会取消原流，并把答案错送成新 prompt。
   */
  const answerLiveQuestion = async (answer: string): Promise<boolean> => {
    const pending = pendingAsk;
    if (!pending?.id) return false;
    const trimmed = answer.trim();
    if (!trimmed) return true;
    setPendingAsk(null);
    addMessage({ role: 'user', content: trimmed });
    try {
      const response = await fetch('/api/ai/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pending.id, answer: trimmed }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${response.status}`);
      }
      setAiStatus(isEnglish ? 'Answer received. The agent is continuing…' : '已收到回答，Agent 正在继续…');
    } catch (error) {
      setPendingAsk(pending);
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
      addMessage({ role: 'system', content: `[反问回复失败] ${message}` });
    }
    return true;
  };

  const dismissPendingAsk = () => {
    const pending = pendingAsk;
    setPendingAsk(null);
    if (pending?.id) {
      void fetch('/api/ai/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pending.id, cancelled: true }),
      }).catch(() => {});
    }
  };

  const handlePendingAskOption = async (option: string) => {
    if (isPathPickerChoice(option)) {
      if (onPickRemoteFolder) {
        const pickedPath = await onPickRemoteFolder();
        if (pickedPath) {
          if (!await answerLiveQuestion(pickedPath)) {
            setPendingAsk(null);
            await submitToAI(pickedPath, { appendUserMessage: true });
          }
        }
      } else {
        chatInputRef.current?.focus();
      }
      return;
    }

    if (isManualInputChoice(option)) {
      chatInputRef.current?.focus();
      return;
    }

    if (!await answerLiveQuestion(option)) {
      setPendingAsk(null);
      await submitToAI(option, { appendUserMessage: true });
    }
  };

  const resetChatInputHeight = () => {
    const el = chatInputRef.current;
    if (el) el.style.height = 'auto';
  };

  // 自动增高：上限 192px（约 8 行），超出后内部滚动
  const autoResizeChatInput = () => {
    const el = chatInputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
  };

  const submitChatInput = async () => {
    const baseText = inputValue.trim();
    if ((!baseText && attachments.length === 0) || isChatInputDisabled) return;
    // 附件路径随消息文本一起发给 AI（只发路径引用，不发文件内容）
    const userText = appendAttachmentRefs(baseText, attachments, isEnglish);
    resetChatInputHeight();
    setInputValue('');
    if (attachments.length > 0) setAttachments([]);
    if (!await answerLiveQuestion(userText)) {
      await submitToAI(userText, { appendUserMessage: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitChatInput();
  };

  // 使用流程：组合执行指令并直接发送给 AI（用户可在聊天里看到完整指令）；
  // 启动/恢复正式运行（dedicatedConversation）则交给 App 开专属对话，避免串进当前聊天
  const handleUseWorkflow = useCallback((message: string, options?: { dedicatedConversation?: boolean }) => {
    if (options?.dedicatedConversation && onStartWorkflowRun) {
      onStartWorkflowRun(message);
      return;
    }
    setActiveTab('chat');
    setWfMatches([]);
    void submitToAI(message, { appendUserMessage: true });
  }, [submitToAI, onStartWorkflowRun]);

  // 输入关键词自动匹配流程（400ms 防抖）
  useEffect(() => {
    const text = inputValue.trim();
    if (text.length < 2 || activeTab !== 'chat') {
      setWfMatches([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const matches = await matchWorkflowsApi(text);
        setWfMatches(matches.filter(m => m.score >= 8).slice(0, 2));
      } catch { /* ignore */ }
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, activeTab]);

  useEffect(() => {
    // 只有属于本标签（本集群）的触发才响应；切换标签时其他标签的触发互不干扰
    if (!triggerAI || triggerAI.tabId !== sessionId) return;
    if (triggerAI.count !== lastTriggerRef.current.agent) {
      lastTriggerRef.current.agent = triggerAI.count;
      const msg = latestUserMessage(messagesRef.current);
      if (msg) void submitToAI(msg.content, { appendUserMessage: false });
    }
  }, [triggerAI]);

  // 作业完成唤醒：服务端向对话追加 user/assistant 两条消息后广播 ai:resumed。
  // 事件指向当前激活对话时，重新拉取该对话并回写消息；不匹配则交给系统通知通道提示。
  const lastAiResumedKeyRef = useRef(''); // 防重复：同一 jobId+conversationId 只处理一次
  useEffect(() => {
    if (!socket) return;
    const handler = async (payload: { type?: string; conversationId?: string; jobId?: string; preview?: string }) => {
      const convId = payload?.conversationId;
      if (!convId || !activeConversationId || convId !== activeConversationId) return;
      const dedupKey = `${payload.jobId || ''}:${convId}`;
      if (lastAiResumedKeyRef.current === dedupKey) return;
      lastAiResumedKeyRef.current = dedupKey;
      try {
        const res = await fetch(`/api/conversations/${convId}`, {
          credentials: 'include' as RequestCredentials,
          headers: sessionId ? { 'X-SSH-Session-Id': sessionId } : {},
        });
        const data = await res.json();
        if (!data?.success || !Array.isArray(data.conversation?.messages)) return;
        // 服务端存档就是客户端保存时的 {role, content, thoughtSteps?} 形状（同 App.tsx 加载对话），
        // 这里只做防御性过滤，保证不破坏当前渲染
        const loaded: Message[] = data.conversation.messages.filter(
          (m: any) => m && (m.role === 'system' || m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
        );
        stickToBottomRef.current = true; // 新消息落地后滚动到底
        onMessagesChange(loaded);
      } catch (e) {
        console.error('[ai:resumed] 刷新对话失败', e);
      }
    };
    socket.on('ai:resumed', handler);
    return () => { socket.off('ai:resumed', handler); };
  }, [socket, activeConversationId, sessionId, onMessagesChange]);

  const handleStop = () => {
    aiRunningRef.current = false;
    aiRunIdRef.current += 1;
    abortRef.current?.abort();
    void closeSseReader(agentReaderRef.current, 'stale-run');
    agentReaderRef.current = null;
    stoppedByUserRef.current = true;
    if (confirmResolveRef.current) {
      confirmResolveRef.current('reject');
      confirmResolveRef.current = null;
    }
    setPendingCommand(null);
    setPendingAsk(null);
    setIsAiLoading(false);
    setIsStreaming(false);
    setAiStatus('AI 已停止');
    stopMonitoring();
    addMessage({ role: 'system', content: '[Agent stopped]' });
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    autoResizeChatInput();
  };

  const isChatInputDisabled = shouldDisableChatInput(isAiLoading, loadingConversationId);
  // 流程卡片用的真实集群会话：本地工作台（App 传入 'local-workbench'）视为未连接集群
  const clusterSessionId = sessionId && sessionId !== 'local-workbench' ? sessionId : null;
  // 稳定引用：MessageBubble/memo 子树共享，避免每次渲染击穿 memo
  const handleOpenWebPanel = useCallback((request: WebPanelRequest) => {
    onOpenWebPanel?.(request);
  }, [onOpenWebPanel]);
  // 流程配置卡"确认运行"（dedicatedConversation → App 开专属对话）与运行卡"续跑/补齐"
  // （留在当前对话）共用的提交通路：追加用户消息并触发 AI
  const sendWorkflowMessage = (text: string, options?: { dedicatedConversation?: boolean }) => {
    if (options?.dedicatedConversation && onStartWorkflowRun) {
      onStartWorkflowRun(text);
      return;
    }
    void submitToAI(text, { appendUserMessage: true });
  };
  const renderedMessageStart = Math.max(0, messages.length - MAX_RENDERED_MESSAGES);
  const renderedMessages = messages.slice(renderedMessageStart);
  const conversationTimeline = buildConversationTimeline(renderedMessages, renderedMessageStart);
  // 流程上下文：裸相对路径(results/x.png)的解析基准 + 建议选项的状态感知来源
  const workflowRunDir = findLatestWorkflowExecutionContext(renderedMessages)?.runDir ?? null;
  const lastConversationalMessage = [...messages].reverse().find(message => message.role !== 'system' && message.content.trim());
  const suggestionContextText = renderedMessages.slice(-8).map(m => m.content).join('\n');
  const followUpSuggestions = !isAiLoading && !isStreaming && !pendingAsk && lastConversationalMessage?.role === 'assistant'
    ? buildFollowUpSuggestions(lastConversationalMessage.content, isEnglish, suggestionContextText)
    : [];

  //  Render 
  if (!isOpen) return null;

  return (
    <div className={`relative h-full flex flex-col bg-scholar-900 ${workspaceLayout ? 'hpclaw-chat-workspace' : 'border-r border-scholar-700'}`}>
      {/* 主工作台使用轻量标题栏；旧侧栏模式仍保留原标签导航。 */}
      <div className={`border-b border-scholar-700 bg-scholar-900 flex items-center justify-between gap-2 shrink-0 ${workspaceLayout ? 'h-14 px-5' : 'px-2 py-2'}`}>
        {workspaceLayout ? (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {activeTab !== 'chat' && (
                <button type="button" onClick={() => setActiveTab('chat')} className="text-xs text-accent hover:underline">返回对话</button>
              )}
              <h1 className="truncate text-sm font-semibold text-scholar-50">{activeTab === 'skills' ? '技能库' : 'AI 工作台'}</h1>
            </div>
            {activeTab === 'chat' && <p className="mt-0.5 text-[10px] text-scholar-500">对话、文件与流程保持在同一个任务上下文中</p>}
          </div>
        ) : (
        <div className="flex bg-scholar-800 rounded-lg p-0.5 gap-0.5 min-w-0 overflow-x-auto shrink">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'chat' ? 'bg-scholar-900 text-scholar-50 shadow-sm' : 'text-scholar-400 hover:text-scholar-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 shrink-0" /> AI 助理
          </button>
          <button
            onClick={() => { setActiveTab('skills'); loadSkills(); }}
            className={`px-2 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'skills' ? 'bg-scholar-900 text-scholar-50 shadow-sm' : 'text-scholar-400 hover:text-scholar-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5 shrink-0" /> 技能库 ({skills.length})
          </button>
          {!workspaceLayout && (
            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-2 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'workflows' ? 'bg-scholar-900 text-scholar-50 shadow-sm' : 'text-scholar-400 hover:text-scholar-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 shrink-0" /> 流程
            </button>
          )}
        </div>
        )}
        <div className="flex items-center gap-0.5 shrink-0">
          {workspaceLayout && onOpenComputeBackend && (
            <button
              type="button"
              onClick={onOpenComputeBackend}
              className="mr-2 flex max-w-[250px] items-center gap-2 rounded-full border border-scholar-700 bg-scholar-950/55 px-3 py-1.5 text-[11px] text-scholar-300 transition-colors hover:border-accent/35 hover:text-scholar-100"
              title="打开计算资源"
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${workspaceTargetConnected ? 'bg-emerald-500' : 'bg-scholar-500'}`} />
              <Cpu className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="truncate">{workspaceTargetLabel || '本地 AI'}</span>
            </button>
          )}
          {workspaceLayout && activeTab === 'chat' && (
            <button onClick={() => { setActiveTab('skills'); loadSkills(); }} className="btn-ghost !px-2 !py-1.5 text-xs" aria-label="技能库" title="技能库">
              <Brain className="w-4 h-4" /> <span className="max-md:hidden">技能库 ({skills.length})</span>
            </button>
          )}
          {isAiSetup && activeTab === 'chat' && (
            <>
              {onNewChat && (
                <button onClick={() => { agentPlanRef.current = null; onNewChat(); }} className="btn-ghost !px-2 !py-1.5 text-xs" aria-label="新对话" title="新对话">
                  <MessageSquarePlus className="w-4 h-4" /> <span className="max-md:hidden">新对话</span>
                </button>
              )}
              {onSaveToCluster && (
                <button
                  onClick={handleSaveToClusterClick}
                  disabled={saveState === 'saving'}
                  className={`btn-ghost !px-2 !py-1.5 text-xs ${
                    saveState === 'saved' ? '!text-emerald-600' :
                    saveState === 'error' ? '!text-red-600' :
                    saveState === 'saving' ? '!text-accent animate-pulse' : ''
                  }`}
                  aria-label="保存对话到计算资源"
                  title={saveState === 'saved' ? '已保存' : saveState === 'error' ? '保存失败，点击重试' : '保存对话到计算资源'}
                >
                  {saveState === 'saved' ? <Check className="w-4 h-4" /> :
                   saveState === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                   <Save className="w-4 h-4" />}
                  <span className="max-md:hidden">保存</span>
                </button>
              )}
              <button onClick={() => setShowSettings(!showSettings)} className="btn-ghost !px-2 !py-1.5 text-xs" data-active={showSettings} aria-label="AI 设置" title="AI 设置">
                <Settings className="w-4 h-4" /> <span className="max-md:hidden">设置</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* AI 设置作为独立浮层，不再挤压主对话。 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex justify-end bg-black/20 backdrop-blur-[1px]"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ x: 28, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 28, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex h-full w-[min(440px,92vw)] flex-col border-l border-scholar-700 bg-scholar-900 shadow-lg"
              onClick={event => event.stopPropagation()}
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-scholar-700 px-4">
                <div>
                  <p className="text-sm font-semibold text-scholar-50">AI 与执行设置</p>
                  <p className="mt-0.5 text-[10px] text-scholar-500">模型、规划和命令确认策略</p>
                </div>
                <button type="button" onClick={() => setShowSettings(false)} className="btn-icon" aria-label="关闭 AI 设置">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                <AIProfileFields
                  datalistId="ai-model-options-settings"
                  aiProvider={aiProvider}
                  aiApiKey={aiApiKey}
                  aiModel={aiModel}
                  aiBaseUrl={aiBaseUrl}
                  onProviderChange={p => { setAiProvider(p); setAiModel(PROVIDERS[p]?.[0] || ''); }}
                  onApiKeyChange={setAiApiKey}
                  onModelChange={setAiModel}
                  onBaseUrlChange={setAiBaseUrl}
                />
                <AgentSettingsFields
                  engine={agentEngine}
                  onEngineChange={setAgentEngine}
                  planningPolicy={agentPlanningPolicy}
                  confirmationPolicy={agentConfirmationPolicy}
                  maxCommands={agentMaxCommands}
                  maxSteps={agentMaxSteps}
                  onPlanningPolicyChange={setAgentPlanningPolicy}
                  onConfirmationPolicyChange={setAgentConfirmationPolicy}
                  onMaxCommandsChange={setAgentMaxCommands}
                  onMaxStepsChange={setAgentMaxSteps}
                />
              </div>
              <div className="shrink-0 border-t border-scholar-700 p-4">
                <button
                  onClick={() => {
                    persistAiProfile();
                    setShowSettings(false);
                  }}
                  className="btn-primary w-full justify-center"
                >
                  保存设置
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills panel */}
      {activeTab === 'skills' ? (
        <SkillsPanelInline
          skills={skills}
          onSkillsChange={loadSkills}
          onSaveSkill={handleSaveSkill}
          sessionId={sessionId}
        />
      ) : activeTab === 'workflows' ? (
        /* Workflow panel */
        <WorkflowPanel
          onUseWorkflow={handleUseWorkflow}
          onOpenRunner={setRunnerWorkflow}
          aiProfile={{ provider: aiProvider, model: aiModel, apiKey: aiApiKey }}
          sessionId={sessionId}
          socket={socket}
        />
      ) : !isAiSetup ? (
        /* AI Setup */
        <div className="flex-1 overflow-y-auto px-6 py-10">
          <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Bot className="h-6 w-6" />
            </span>
            <h2 className="text-xl font-semibold text-scholar-50">配置你的 AI 工作台</h2>
            <p className="mt-2 text-sm text-scholar-400">完成一次配置后，就可以直接从对话开始科研计算任务。</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              persistAiProfile();
            }}
            className="space-y-4 rounded-lg border border-scholar-700 bg-scholar-950/45 p-5 shadow-sm"
          >
            <AIProfileFields
              datalistId="ai-model-options-setup"
              aiProvider={aiProvider}
              aiApiKey={aiApiKey}
              aiModel={aiModel}
              aiBaseUrl={aiBaseUrl}
              onProviderChange={p => { setAiProvider(p); setAiModel(PROVIDERS[p]?.[0] || ''); }}
              onApiKeyChange={setAiApiKey}
              onModelChange={setAiModel}
              onBaseUrlChange={setAiBaseUrl}
              apiKeyRequired
            />
            <AgentSettingsFields
              engine={agentEngine}
              onEngineChange={setAgentEngine}
              planningPolicy={agentPlanningPolicy}
              confirmationPolicy={agentConfirmationPolicy}
              maxCommands={agentMaxCommands}
              maxSteps={agentMaxSteps}
              onPlanningPolicyChange={setAgentPlanningPolicy}
              onConfirmationPolicyChange={setAgentConfirmationPolicy}
              onMaxCommandsChange={setAgentMaxCommands}
              onMaxStepsChange={setAgentMaxSteps}
            />
            <button type="submit" className="btn-primary w-full">保存设置</button>
          </form>
          </div>
        </div>
      ) : (
        /* Chat area */
        <div className="flex-1 flex flex-col min-h-0">
          {/* Error banner */}
          {errorMessage && (
            <div className="mx-3 mt-2 p-2 bg-[rgb(var(--danger-rgb)/0.08)] border border-[rgb(var(--danger-rgb)/0.3)] rounded-lg flex items-start gap-2 text-[var(--color-danger)] text-xs shrink-0">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
              {lastUserTextRef.current && !isAiLoading && (
                <button
                  onClick={() => {
                    setErrorMessage('');
                    void submitToAI(lastUserTextRef.current, { appendUserMessage: false });
                  }}
                  className="text-xs text-accent hover:underline shrink-0 font-medium"
                  title="从已保存的流程或 Agent 进度继续"
                >
                  继续
                </button>
              )}
              <button onClick={() => setErrorMessage('')} className="text-red-500 hover:text-red-700 shrink-0" aria-label="关闭"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          {/* Messages */}
          <div ref={messagesContainerRef} onScroll={handleMessagesScroll} data-chat-messages className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 space-y-1">
            {loadingConversationId && (
              <div className="flex flex-col items-center justify-center h-full text-scholar-400 text-xs gap-3 px-4">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="text-scholar-300 font-medium">加载对话中...</p>
              </div>
            )}
            {!loadingConversationId && messages.length === 0 && !isAiLoading && (
              <div className="flex flex-col items-center justify-center h-full text-scholar-400 text-xs gap-3 px-4 pb-10">
                <span className="mb-1 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent"><Bot className="w-6 h-6" /></span>
                <p className="text-lg text-scholar-100 font-semibold">今天想完成什么任务？</p>
                <p className="text-center max-w-lg text-sm leading-6">可以先讨论方案，也可以选择左侧文件或流程；需要计算时，HPClaw 会调用后台计算资源。</p>
                <div className="grid grid-cols-2 gap-2 w-full max-w-2xl mt-3">
                  {['对当前目录的 FASTQ 文件做质控分析',
                    '查看计算资源作业状态并分析资源使用',
                    '用 BLAST 搜索同源序列',
                    'GO/KEGG 通路富集分析',
                    '查看队列和节点资源'].map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                            setInputValue(t(s));
                            requestAnimationFrame(() => autoResizeChatInput());
                          }}
                      className="text-left px-3.5 py-3 bg-scholar-950/45 hover:bg-scholar-800 border border-scholar-700 rounded-lg text-scholar-300 hover:text-scholar-100 transition-colors"
                    >{t(s)}</button>
                  ))}
                </div>
              </div>
            )}
            {renderedMessageStart > 0 && (
              <div className="mx-auto mb-2 rounded-full border border-scholar-700 bg-scholar-800 px-3 py-1 text-xs text-scholar-400 w-fit">
                已收起较早的 {renderedMessageStart} 条消息，可在对话存档中完整查看
              </div>
            )}
            {conversationTimeline.map(item => {
              if (item.type === 'execution') return <ExecutionTrace key={item.key} items={item.items} sessionId={sessionId} workspace={agentWorkspace || undefined} />;
              const { message, absoluteIndex } = item;
              // 正式流程运行标记：不显示原始协议文本，渲染对话内嵌运行卡
              if (message.role === 'user') {
                const runContext = parseWorkflowExecutionContext(message.content);
                if (runContext) {
                  return (
                    <div key={absoluteIndex} className="mx-1 mb-3 max-w-[95%]">
                      <WorkflowRunCard
                        context={runContext}
                        sessionId={clusterSessionId}
                        socket={socket}
                        onOpenRemoteFolder={path => onOpenRemoteFolder?.(path, clusterSessionId)}
                        onSendMessage={sendWorkflowMessage}
                        onOpenReport={clusterSessionId && onOpenWebPanel
                          ? path => handleOpenWebPanel({ remotePath: path, sessionId: clusterSessionId, title: '分析报告' })
                          : undefined}
                      />
                    </div>
                  );
                }
              }
              // 流程配置标记：AI 或匹配 chips 插入，渲染点点点配置卡
              if (message.role !== 'system') {
                const directive = parseWorkflowConfigureDirective(message.content);
                if (directive) {
                  const remainder = stripWorkflowConfigureDirectives(message.content);
                  return (
                    <div key={absoluteIndex} className="mx-1 mb-3 max-w-[95%] space-y-1.5">
                      {remainder && <MessageBubble msg={{ ...message, content: remainder }} index={absoluteIndex} sessionId={sessionId} workspace={agentWorkspace || undefined} workflowRunDir={workflowRunDir} onOpenWebPanel={handleOpenWebPanel} />}
                      <WorkflowConfigCard
                        workflowId={directive.workflowId}
                        sessionId={clusterSessionId}
                        onPickRemoteFolder={onPickRemoteFolder}
                        onSendMessage={sendWorkflowMessage}
                        onOpenRunner={setRunnerWorkflow}
                      />
                    </div>
                  );
                }
              }
              return <MessageBubble key={absoluteIndex} msg={message} index={absoluteIndex} sessionId={sessionId} workspace={agentWorkspace || undefined} workflowRunDir={workflowRunDir} onOpenWebPanel={handleOpenWebPanel} />;
            })}

            {/* Streaming preview */}
            {(isStreaming) && (
              <div className="flex flex-col items-start mb-3">
                <div className="p-2.5 rounded-lg max-w-[95%] bg-scholar-800 text-scholar-100 border border-scholar-700/60">
                  {streamingReasoning && (
                    <details className="mb-2">
                      <summary className="flex items-center gap-1.5 text-[11px] text-accent mb-1 cursor-pointer select-none">
                        <Brain className="w-3 h-3" /> 思考过程（点击展开）
                      </summary>
                      <div data-user-content="true" className="bg-scholar-900/60 border border-scholar-600/50 rounded p-2 text-[11px] text-scholar-300 max-h-60 overflow-y-auto whitespace-pre-wrap break-words">
                        {streamingReasoning}
                      </div>
                    </details>
                  )}
                  {streamingContent && (
                    <div data-user-content="true"><MarkdownMessage content={streamingContent} onOpenWebPanel={handleOpenWebPanel} sessionId={sessionId} workspace={agentWorkspace || undefined} /></div>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-scholar-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">{aiStatus}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Loading indicator (non-streaming) */}
            {isAiLoading && !isStreaming && (
              <div className="flex items-start mb-3">
                <div className="p-2.5 rounded-lg bg-scholar-800 border border-scholar-700/60 text-scholar-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> {aiStatus}
                </div>
              </div>
            )}

            {followUpSuggestions.length > 0 && (
              <div className="ml-1 mb-3 max-w-[95%]">
                <p className="text-xs text-scholar-400 mb-1.5">
                  {isEnglish ? 'You can choose a next step:' : '你可以选择下一步：'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {followUpSuggestions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => void submitToAI(option, { appendUserMessage: true })}
                      className="px-2.5 py-1.5 text-xs rounded-full border border-accent/25 bg-accent/5 text-accent hover:bg-accent/15 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 信任全部激活时的常驻提示（无待确认命令时也可一键取消） */}
          {confirmMode === 'trust_all' && !pendingCommand && (
            <div className="mx-3 mb-1 flex items-center gap-1.5 text-[10px] text-scholar-400 shrink-0">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span>已信任全部命令：AI 的命令不再逐条确认（硬性安全拦截仍生效）</span>
              <button type="button" onClick={() => applyConfirmMode('ask')} className="text-accent hover:underline">取消信任</button>
            </div>
          )}

          {/*  Confirmation Dialog  */}
          {pendingCommand && pendingMode === 'command' && (
            <div className="mx-3 p-3 bg-accent/5 border border-accent/15 rounded-lg shrink-0 overflow-hidden">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-xs text-accent font-medium">命令确认</p>
                  {pendingCommandDirWarning && (
                    <p className="text-[10px] text-red-600 mt-1">⚠ 命令可能访问工作目录以外的路径</p>
                  )}
                  <pre className="mt-1.5 p-2 bg-scholar-950 border border-scholar-700 rounded-md text-xs font-mono text-scholar-200 overflow-x-auto max-h-28 overflow-y-auto whitespace-pre-wrap break-all">
                    {pendingCommand}
                  </pre>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => confirmResolveRef.current?.('reject')}
                  className="px-3 py-1.5 text-xs bg-[rgb(var(--danger-rgb)/0.15)] text-[var(--color-danger)] border border-[rgb(var(--danger-rgb)/0.3)] rounded-lg hover:bg-[rgb(var(--danger-rgb)/0.25)] transition-colors">
                  拒绝
                </button>
                <button onClick={() => confirmResolveRef.current?.('trust')}
                  title="执行本条，且此后所有命令都不再询问（硬性安全拦截仍生效；可随时在输入区上方取消信任）"
                  className="px-3 py-1.5 text-xs bg-scholar-900 text-scholar-200 border border-scholar-600 rounded-lg hover:bg-scholar-800 transition-colors">
                  信任全部
                </button>
                <button onClick={() => confirmResolveRef.current?.('execute')}
                  className="px-3 py-1.5 text-xs bg-accent/15 text-accent border border-accent/30 rounded-lg hover:bg-accent/25 font-medium transition-colors">
                  执行
                </button>
              </div>
            </div>
          )}

          {pendingCommand && pendingMode === 'monitor' && (
            <div className="mx-3 p-3 bg-accent/5 border border-accent/20 rounded-lg shrink-0">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-accent font-medium">作业监控中</p>
                  <p className="text-xs text-scholar-200 mt-1">{pendingCommand}</p>
                  <p className="text-[10px] text-scholar-400 mt-1">等待超时：10 分钟</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => confirmResolveRef.current?.('reject')}
                  className="px-3 py-1.5 text-xs bg-scholar-900 text-scholar-200 border border-scholar-600 rounded-lg hover:bg-scholar-800 transition-colors">
                  停止
                </button>
                <button onClick={() => confirmResolveRef.current?.('execute')}
                  className="px-3 py-1.5 text-xs bg-accent/15 text-accent border border-accent/30 rounded-lg hover:bg-accent/25 font-medium transition-colors">
                  继续
                </button>
              </div>
            </div>
          )}

          {/*  AI 反问：问题固定在最底部，候选答案做成可点选按钮  */}
          {pendingAsk && (
            <div className="mx-3 mb-1 p-3 bg-accent/5 border border-accent/20 rounded-lg shrink-0">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-accent font-medium">AI 需要你确认</p>
                  <p data-user-content="true" className="text-sm text-scholar-100 mt-1 whitespace-pre-wrap break-words">{pendingAsk.question}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {pendingAsk.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => void handlePendingAskOption(opt)}
                        className="px-2.5 py-1.5 text-xs bg-accent/10 text-accent border border-accent/30 rounded-lg hover:bg-accent/25 font-medium transition-colors"
                      >
                        <span data-user-content="true">{opt}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-scholar-500 mt-2">{isEnglish ? 'Choose an option, or type your answer below.' : '点击选项直接回答，也可以在下方输入框补充。'}</p>
                </div>
                <button onClick={dismissPendingAsk} className="text-scholar-500 hover:text-scholar-300 shrink-0" aria-label="关闭">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div data-chat-composer className="px-3 pt-2 pb-4 shrink-0 bg-gradient-to-t from-scholar-900 via-scholar-900 to-scholar-900/80">
            {/* 关键词匹配到的流程 */}
            {wfMatches.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-[10px] text-scholar-400">匹配流程:</span>
                {wfMatches.map(w => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      // 点击不再发送文本协议，改为向对话插入一张流程配置卡（与 AI 输出标记同一条渲染通路）
                      setWfMatches([]);
                      const directive = formatWorkflowConfigureDirective({ workflowId: w.id });
                      addMessage({
                        role: 'assistant',
                        content: isEnglish
                          ? `Matched workflow "${w.name}"${w.description ? `: ${w.description}` : ''}. Confirm parameters and inputs in the card below, then click "Confirm and run".\n${directive}`
                          : `匹配到流程「${w.name}」${w.description ? `：${w.description}` : ''}。请在下方卡片中确认参数与输入，点"确认运行"即可开始。\n${directive}`,
                      });
                    }}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/25 hover:bg-accent/20 transition-colors"
                    title={w.description}
                  >
                    <GitBranch className="w-3 h-3" /> {w.name}
                  </button>
                ))}
              </div>
            )}
            {/* Agent 本地工作区：dsh 引擎本地工具的落点目录 */}
            {!IS_COMPETITION_EDITION && (
              <div className="mb-2">
                {needsAgentWorkspaceHint(sessionId, agentWorkspace) && (
                  <div className="mb-1 text-[10px] text-amber-400">
                    {t('本地文件分析需要指定工作区目录')}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                {window.hpclawDesktop?.dialog ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void handlePickAgentWorkspace()}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-scholar-800 text-scholar-300 border border-scholar-700 hover:text-scholar-100 hover:border-scholar-500 transition-colors shrink-0"
                      title={t('工作区（dsh 引擎本地工具的落点目录）')}
                    >
                      <FolderOpen className="w-3 h-3" /> {t('选择工作文件夹')}
                    </button>
                    <span
                      className="text-[10px] text-scholar-400 truncate max-w-[200px]"
                      title={agentWorkspace || t('未设置工作区（默认数据目录）')}
                    >
                      {agentWorkspace
                        ? (agentWorkspace.length > 30 ? '…' + agentWorkspace.slice(-29) : agentWorkspace)
                        : t('未设置工作区（默认数据目录）')}
                    </span>
                    {agentWorkspace && (
                      <button
                        type="button"
                        onClick={handleClearAgentWorkspace}
                        className="text-scholar-500 hover:text-scholar-300 shrink-0"
                        title={t('清除')}
                        aria-label={t('清除')}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </>
                ) : (
                  <input
                    key={agentWorkspace}
                    type="text"
                    defaultValue={agentWorkspace}
                    onBlur={e => handleWorkspaceInputBlur(e.target.value)}
                    placeholder={t('本地工作区路径（本地分析必填）')}
                    title={t('工作区（dsh 引擎本地工具的落点目录）')}
                    className="flex-1 min-w-0 bg-scholar-950 border border-scholar-700 rounded-md px-2 py-1 text-[11px] text-scholar-300 placeholder-scholar-500 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent"
                  />
                )}
                {workspaceError && (
                  <span className="text-[10px] text-red-500 shrink-0">{workspaceError}</span>
                )}
                </div>
              </div>
            )}
            {/* 附件 chips：quiet pill（细发丝边框 + 低饱和底、× 悬停才显现）——参照 OpenMAIC composer-pill 的登记法 */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-2" data-testid="chat-attachments">
                {attachments.map(item => (
                  <span
                    key={item.id}
                    className="group inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border border-scholar-700/60 bg-scholar-800/45 text-scholar-300"
                    title={item.refPath}
                  >
                    <Paperclip className="w-3 h-3 text-accent shrink-0" />
                    <span className="max-w-[180px] truncate">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(item.id)}
                      aria-label={`${t('移除附件')}: ${item.name}`}
                      className="opacity-0 group-hover:opacity-100 text-scholar-500 hover:text-scholar-100 shrink-0 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {attachmentError && (
              <div className="mb-1 text-[10px] text-amber-400" data-testid="chat-attachment-error">{attachmentError}</div>
            )}
            {/* 输入区：参照 OpenMAIC composer 的处理——聚焦时给一条 accent 描边 + 轻微上浮 + 分层投影，
                让"当前唯一该被注意的控件"有明确的 focused state */}
            <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-xl border border-scholar-600/70 bg-scholar-950/70 p-2 shadow-[0_1px_2px_rgb(var(--scrim-rgb)/0.18)] transition-all duration-150 focus-within:-translate-y-px focus-within:border-accent/70 focus-within:shadow-[0_0_0_1px_rgb(var(--accent-rgb)/0.45),0_1px_2px_rgb(var(--scrim-rgb)/0.18),0_10px_30px_-12px_rgb(var(--accent-rgb)/0.30)]">
              <input
                ref={attachmentInputRef}
                type="file"
                multiple
                className="hidden"
                data-testid="chat-attachment-input"
                onChange={e => {
                  void handleAttachmentFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={handleAttachClick}
                disabled={isChatInputDisabled || attachmentBusy}
                className="p-2 rounded-lg text-scholar-400 hover:text-scholar-100 hover:bg-scholar-800 transition-colors disabled:opacity-40"
                title={t('添加附件')}
                aria-label={t('添加附件')}
              >
                {attachmentBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
              </button>
              <textarea
                ref={chatInputRef}
                rows={1}
                value={inputValue}
                onChange={e => handleInputChange(e.target.value)}
                onKeyDown={e => {
                  if (shouldSubmitOnKey({ key: e.key, shiftKey: e.shiftKey, isComposing: e.nativeEvent.isComposing })) {
                    e.preventDefault();
                    void submitChatInput();
                  }
                }}
                placeholder="输入任务描述..."
                className="flex-1 bg-transparent border-0 rounded-md px-2 py-2 text-sm leading-5 resize-none overflow-y-auto max-h-48 focus:outline-none"
                disabled={isChatInputDisabled}
              />
              {isAiLoading ? (
                <button type="button" onClick={handleStop} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors" title="停止">
                  <AlertCircle className="w-4 h-4" />
                </button>
              ) : null}
              <button
                type="submit"
                disabled={(!inputValue.trim() && attachments.length === 0) || isChatInputDisabled}
                className="bg-accent text-white p-2.5 rounded-md disabled:opacity-40 hover:bg-accent-dark transition-colors"
                title="发送"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {isAiLoading && (
              <p className="text-xs text-scholar-400 mt-1 text-center">
                {aiStatus}，可随时停止；AI 超时不会断开计算资源
              </p>
            )}
          </div>
        </div>
      )}

      {/* 流程可视化运行面板（抽屉）：从流程页签打开，运行后保持监控 */}
      {runnerWorkflow && (
        <FlowRunnerDrawer
          workflow={runnerWorkflow}
          sessionId={sessionId}
          socket={socket}
          onClose={() => setRunnerWorkflow(null)}
          onRun={handleUseWorkflow}
          onPickFolder={onPickRemoteFolder}
          onOpenRunFolder={path => onOpenRemoteFolder?.(path, sessionId)}
        />
      )}
    </div>
  );
}

//  Inline Skills Panel 
function SkillsPanelInline({
  skills, onSkillsChange, onSaveSkill, sessionId
}: {
  skills: Skill[];
  onSkillsChange: () => void;
  onSaveSkill: (filename: string, content: string) => Promise<boolean>;
  sessionId?: string | null;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillContent, setNewSkillContent] = useState('');
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [skillContents, setSkillContents] = useState<Record<string, string>>({});
  const [loadingSkill, setLoadingSkill] = useState<string | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch('/api/skills/search?q=' + encodeURIComponent(searchQuery), {
        headers: sessionId ? { 'X-SSH-Session-Id': sessionId } : {},
      });
      const data = await res.json();
      setSearchResults(data.success ? data.results : []);
    } catch { /* ignore */ }
  };

  // Group: category -> sub-category -> skills
  const grouped = React.useMemo(() => {
    const map = new Map<string, Map<string, Skill[]>>();
    for (const s of skills) {
      const cat = (s as any).category || 'other';
      const parts = s.filename.split('/').filter(Boolean);
      const sub = parts.length >= 2 && parts[0] === cat ? parts[1] : (parts[0] || '__root__');
      if (!map.has(cat)) map.set(cat, new Map());
      const subs = map.get(cat)!;
      if (!subs.has(sub)) subs.set(sub, []);
      subs.get(sub)!.push(s);
    }
    const order = ['system', 'lsf', 'cluster', 'hpc', 'bio', 'ai', 'nature', 'imported', 'user'];
    return [...map.entries()].sort((a, b) => {
      const ai = order.indexOf(a[0]), bi = order.indexOf(b[0]);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai >= 0) return -1; if (bi >= 0) return 1;
      return a[0].localeCompare(b[0]);
    });
  }, [skills]);

  // Auto-expand first category
  React.useEffect(() => {
    if (grouped.length > 0 && expandedCats.size === 0) {
      setExpandedCats(new Set([grouped[0][0]]));
    }
  }, [grouped]);

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => { const n = new Set(prev); if (n.has(cat)) n.delete(cat); else n.add(cat); return n; });
  };
  const toggleSub = (key: string) => {
    setExpandedSubs(prev => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  };

  const toggleSkill = async (skill: Skill) => {
    if (expandedSkill === skill.filename) {
      setExpandedSkill(null);
      return;
    }
    setExpandedSkill(skill.filename);
    if (skill.content || skillContents[skill.filename] !== undefined) return;
    setLoadingSkill(skill.filename);
    try {
      const res = await fetch('/api/skills/content?filename=' + encodeURIComponent(skill.filename), {
        headers: sessionId ? { 'X-SSH-Session-Id': sessionId } : {},
      });
      const data = await res.json();
      setSkillContents(prev => ({
        ...prev,
        [skill.filename]: data.success ? String(data.content || '') : `读取失败：${data.error || `HTTP ${res.status}`}`,
      }));
    } catch (error: any) {
      setSkillContents(prev => ({ ...prev, [skill.filename]: `读取失败：${error?.message || String(error)}` }));
    } finally {
      setLoadingSkill(current => current === skill.filename ? null : current);
    }
  };

  const CAT_LABELS: Record<string, string> = {
    system: 'System', user: 'User', imported: 'Imported',
    bio: 'Bio', nature: 'Nature', lsf: 'LSF', cluster: 'Cluster',
    hpc: 'HPC', ai: 'AI',
  };


  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Search */}
      <div className="shrink-0 p-3 pb-1 flex gap-1">
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search skills..."
          className="flex-1 bg-scholar-950 border border-scholar-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
        <button onClick={handleSearch} className="p-1.5 bg-scholar-700 text-scholar-200 hover:bg-scholar-600 rounded-lg">
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="mx-3 p-2 bg-scholar-950 border border-scholar-700 rounded-lg max-h-40 overflow-y-auto">
          {searchResults.map((r, i) => (<pre key={i} className="text-xs text-scholar-300 whitespace-pre-wrap mb-2 last:mb-0">{r}</pre>))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex justify-between items-center shrink-0 px-3 py-2">
        <span className="text-[10px] text-scholar-500">{skills.length} skills</span>
        <button onClick={() => setIsAddingSkill(!isAddingSkill)}
          className="p-1 bg-scholar-700 text-scholar-200 hover:bg-scholar-600 rounded text-[10px] flex items-center gap-1">
          + New
        </button>
      </div>

      {isAddingSkill && (
        <form onSubmit={async (e) => { e.preventDefault(); await onSaveSkill(newSkillName, newSkillContent); setIsAddingSkill(false); setNewSkillName(''); setNewSkillContent(''); onSkillsChange(); }}
          className="mx-3 bg-scholar-950 p-3 rounded-lg border border-scholar-700 space-y-2 shrink-0 mb-2">
          <input type="text" required value={newSkillName} onChange={e => setNewSkillName(e.target.value)}
            placeholder="Skill name" className="w-full bg-scholar-900 border border-scholar-600 rounded p-2 text-xs focus:outline-none" />
          <textarea required value={newSkillContent} onChange={e => setNewSkillContent(e.target.value)}
            placeholder="Content (Markdown)" className="w-full bg-scholar-900 border border-scholar-600 rounded p-2 text-xs h-24 focus:outline-none" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsAddingSkill(false)} className="px-3 py-1 text-xs text-scholar-300">Cancel</button>
            <button type="submit" className="px-3 py-1.5 text-xs bg-accent text-white rounded hover:bg-accent-dark transition-colors">Add</button>
          </div>
        </form>
      )}

      {/* Category tree */}
      <div className="flex-1 px-1 space-y-0.5 overflow-y-auto">
        {grouped.map(([cat, subMap]) => {
          const isOpen = expandedCats.has(cat);
          
          const label = CAT_LABELS[cat] || cat;
          const subEntries = [...subMap.entries()].sort(([a], [b]) => a === '__root__' ? 1 : b === '__root__' ? -1 : a.localeCompare(b));
          const totalCount = subEntries.reduce((sum, [, ss]) => sum + ss.length, 0);
          return (
            <div key={cat}>
              <button onClick={() => toggleCat(cat)}
                className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-scholar-800/40 transition-colors text-left rounded-lg group">
                {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-accent shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-scholar-500 shrink-0" />}
                
                {isOpen ? <FolderOpen className="w-3.5 h-3.5 text-accent/70 shrink-0" /> : <Folder className="w-3.5 h-3.5 text-scholar-500 shrink-0" />}
                <span className="text-xs font-medium text-scholar-200 truncate">{label}</span>
                <span className="text-[10px] text-scholar-400 ml-auto shrink-0 bg-scholar-800/50 px-1.5 py-0.5 rounded-full">{totalCount}</span>
              </button>
              {isOpen && (
                <div className="ml-5 border-l border-scholar-700/40 pl-2">
                  {subEntries.map(([sub, subSkills]) => {
                    const subKey = cat + '/' + sub;
                    const hasSubs = sub !== '__root__' && subMap.size > 1;
                    const subOpen = !hasSubs || expandedSubs.has(subKey);
                    return (
                      <div key={sub}>
                        {hasSubs && (
                          <button onClick={() => toggleSub(subKey)}
                            className="w-full flex items-center gap-1.5 px-2 py-1.5 hover:bg-scholar-800/30 transition-colors text-left rounded">
                            {subOpen ? <ChevronDown className="w-3 h-3 text-scholar-400 shrink-0" /> : <ChevronRight className="w-3 h-3 text-scholar-500 shrink-0" />}
                            <FolderTree className="w-3 h-3 text-scholar-500 shrink-0" />
                            <span className="text-[11px] text-scholar-300 truncate">{sub}</span>
                            <span className="text-[9px] text-scholar-400 ml-auto">{subSkills.length}</span>
                          </button>
                        )}
                        {subOpen && subSkills.map(s => {
                          const name = (s as any).name || s.filename.replace(/^.*[\\/]/, '').replace(/\.(md|txt)$/i, '');
                          const isExpanded = expandedSkill === s.filename;
                          return (
                            <div key={s.filename} className={hasSubs ? 'ml-4' : ''}>
                               <button onClick={() => { void toggleSkill(s); }}
                                className="w-full flex items-start gap-1.5 px-2 py-1.5 hover:bg-scholar-800/30 transition-colors text-left group rounded">
                                <FileText className="w-3 h-3 text-scholar-400 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] text-scholar-300 truncate group-hover:text-scholar-100">{name}</span>
                                    {(s as any).source === 'cluster' && <span className="text-[8px] px-1 rounded bg-accent/10 text-accent shrink-0">remote</span>}
                                  </div>
                                  {(s as any).description && <p className="text-[10px] text-scholar-500 truncate mt-0.5">{(s as any).description}</p>}
                                </div>
                              </button>
                               {isExpanded && (
                                 <pre className="mx-2 mb-1 mt-0.5 text-[10px] text-scholar-300 whitespace-pre-wrap max-h-60 overflow-y-auto bg-scholar-950/80 p-2.5 rounded border border-scholar-800/50 leading-relaxed">
                                   {loadingSkill === s.filename
                                     ? '正在读取技能正文…'
                                     : (skillContents[s.filename] ?? s.content ?? s.filename).slice(0, 3000)}
                                   {(skillContents[s.filename] ?? s.content ?? '').length > 3000 && '\n\n... (truncated)'}
                                 </pre>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {skills.length === 0 && <p className="text-center text-scholar-400 text-xs mt-8">No skills loaded</p>}
      </div>
    </div>
  );
}
