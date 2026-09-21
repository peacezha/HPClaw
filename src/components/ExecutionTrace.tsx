// 对话时间线里的"执行过程"卡片：命令/计划/工具调用记录汇总展示（默认展开，可折叠）。
// 工具结果等条目里的图片/表格路径渲染成紧凑卡片（复用 RichContentMessage，
// 仅限 image/table 类型，避免输出里的 .py/.log 路径刷屏）。
// 性能：折叠时条目不挂载（受控 details），展开（默认）才渲染内容与卡片。
import React, { useState } from 'react';
import { ChevronRight, TerminalSquare } from 'lucide-react';
import { RichContentMessage, parseDshUiSpecText, DshUiSpecCard } from './rich-content';

export interface ExecutionTraceItem {
  message: { content: string };
  absoluteIndex: number;
}

/** trace 条目只出图片/表格卡（模块级常量，保证 prop 引用稳定不触发重复拉取） */
const TRACE_CARD_TYPES: Array<'image' | 'table'> = ['image', 'table'];

function executionTraceLabel(content: string): string {
  const match = content.match(/^\[([^\]]+)\]\s*/);
  return match?.[1] || '执行记录';
}

function executionTraceBody(content: string): string {
  return content.replace(/^\[[^\]]+\]\s*/, '').trim();
}

export const ExecutionTrace = React.memo(function ExecutionTrace({ items, sessionId, workspace }: { items: ExecutionTraceItem[]; sessionId?: string | null; workspace?: string }) {
  const [open, setOpen] = useState(false);
  const commandCount = items.filter(item => /^\[AI 执行命令\]/.test(item.message.content)).length;
  const planCount = items.filter(item => /^\[(?:Agent step|Agent 计划|计划进度)/.test(item.message.content)).length;
  const toolCount = items.filter(item => /^\[(?:📋|技能搜索|搜索技能|技能结果|工具|已保存技能)/.test(item.message.content)).length;
  const details = [
    planCount > 0 ? `${planCount} 个步骤` : '',
    commandCount > 0 ? `${commandCount} 条命令` : '',
    toolCount > 0 ? `${toolCount} 次工具调用` : '',
  ].filter(Boolean).join(' · ') || `${items.length} 条记录`;
  const isRemote = !!sessionId && sessionId !== 'local-workbench';

  return (
    // 受控 details：open 由 React 管理，折叠时条目不挂载（展开才渲染富内容卡片）
    <details open={open} className="group mx-1 mb-3 max-w-[95%] rounded-lg border border-scholar-700/80 bg-scholar-950/35 text-xs">
      <summary
        className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-scholar-300 transition-colors hover:text-scholar-100 [&::-webkit-details-marker]:hidden"
        onClick={event => {
          event.preventDefault();
          setOpen(value => !value);
        }}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-scholar-800 text-accent">
          <TerminalSquare className="h-3.5 w-3.5" />
        </span>
        <span className="font-medium">执行过程</span>
        <span className="truncate text-[11px] text-scholar-500">{details}</span>
        <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-scholar-500 transition-transform group-open:rotate-90" />
      </summary>
      {open && (
        <div className="space-y-2 border-t border-scholar-700/70 px-3 py-3">
          {items.map(item => {
            const label = executionTraceLabel(item.message.content);
            const body = executionTraceBody(item.message.content);
            const isCommand = label === 'AI 执行命令';
            const isOutput = /输出|结果/.test(label);
            // validate_dsh_ui 等工具的 spec JSON：解析成功就渲染成卡片，否则维持原文
            const dshUiSpec = parseDshUiSpecText(body);
            return (
              <div key={item.absoluteIndex} className="grid grid-cols-[88px_minmax(0,1fr)] gap-2">
                <span className="pt-1 text-[10px] font-medium text-scholar-500">{label}</span>
                <div className="min-w-0">
                  {dshUiSpec ? (
                    <DshUiSpecCard spec={dshUiSpec} sessionId={isRemote ? sessionId : undefined} local={!isRemote} workspace={workspace} />
                  ) : isCommand || isOutput ? (
                    <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-scholar-600 bg-scholar-900 px-2.5 py-2 font-mono text-[11px] leading-5 text-scholar-100">{body || '（无输出）'}</pre>
                  ) : (
                    <div className="whitespace-pre-wrap break-words rounded-lg bg-scholar-800/55 px-2.5 py-2 text-[11px] leading-5 text-scholar-100">{body}</div>
                  )}
                  {/* 工具结果里的图片/表格路径出紧凑卡片（无路径时不渲染，上限 5 张；
                      spec JSON 条目已由 DshUiSpecCard 呈现，不重复提取） */}
                  {!dshUiSpec && (
                    <RichContentMessage onlyTypes={TRACE_CARD_TYPES} sessionId={sessionId} workspace={workspace}>
                      {body}
                    </RichContentMessage>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </details>
  );
});

export default ExecutionTrace;
