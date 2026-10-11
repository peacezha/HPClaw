import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useWorkflowText } from '../i18n';
import { graphAncestors, graphDescendants, layoutWorkflowGraph, normalizeGraphSteps, type FlowStep, type GraphLayout } from '../features/workflows/flowGraphLayout';

const COLORS: Record<string, string> = { done: '#10b981', running: 'var(--color-accent)', failed: '#ef4444', skipped: '#94a3b8', pending: '#94a3b8' };
const PHASES = ['#0284c7', '#7c3aed', '#be185d', '#b45309', '#059669', '#0f766e'];
function phaseColor(phase: string) { let hash = 0; for (const c of phase) hash = (hash * 31 + c.charCodeAt(0)) >>> 0; return PHASES[hash % PHASES.length]; }
function phaseLabel(phase: string) { return ({ Prepare: '准备', 'Peak Calling': '峰调用', Pseudoreplicates: '伪重复' } as Record<string, string>)[phase] || phase; }

/** Account for CJK's visual width; fixed character counts overflowed nodes. */
export function wrapGraphLabel(label: string): [string, string?] {
  const lines: string[] = []; let line = '', width = 0;
  const visualWidth = (value: string) => [...value].reduce((sum, char) => sum + (/[\u2e80-\u9fff\uff00-\uffef]/.test(char) ? 1 : .56), 0);
  const tokens = label.match(/\(?[A-Za-z0-9_]+(?:[-/.][A-Za-z0-9_]+)*[),;:]?|\s+|[^\s]/gu) || [];
  for (const token of tokens) {
    // Preserve English word boundaries; long identifiers still wrap safely.
    for (const part of visualWidth(token) > 17 ? [...token] : [token]) {
      const unit = visualWidth(part);
      if (width + unit > 17 && line) { lines.push(line.trim()); line = ''; width = 0; }
      if (!line && !part.trim()) continue;
      line += part; width += unit;
    }
  }
  if (line) lines.push(line.trim());
  return [lines[0] || '', lines.length > 1 ? lines[1] + (lines.length > 2 ? '…' : '') : undefined];
}

export default function WorkflowFlowGraph({ steps, currentStep, onSelectStep }: {
  steps: FlowStep[]; currentStep?: number; onSelectStep?: (n: number) => void;
}) {
  const text = useWorkflowText();
  const markers = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [direction, setDirection] = useState<'DOWN' | 'RIGHT'>('DOWN');
  const [allEdges, setAllEdges] = useState(false);
  const [zoom, setZoom] = useState<'fit' | number>('fit');
  const [width, setWidth] = useState(900);
  const viewport = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [result, setResult] = useState<{ key: string; layout?: GraphLayout; error?: string }>();
  const structuralKey = JSON.stringify(steps.map(({ n, stepId, title, dependsOn, phase }) => ({ n, stepId, title, dependsOn, phase })));
  const graph = useMemo(() => {
    try { return { steps: normalizeGraphSteps(steps) }; }
    catch (cause) { return { error: cause instanceof Error ? cause.message : String(cause) }; }
  // Status polling must not re-layout or lose focus/scroll.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structuralKey]);
  const layoutKey = `${structuralKey}:${direction}:${allEdges}`;
  useEffect(() => {
    if (!graph.steps?.length) return;
    let live = true;
    layoutWorkflowGraph(graph.steps, direction, allEdges).then(layout => { if (live) setResult({ key: layoutKey, layout }); }, cause => { if (live) setResult({ key: layoutKey, error: String(cause) }); });
    return () => { live = false; };
  }, [graph, direction, allEdges, layoutKey]);
  useEffect(() => {
    const element = viewport.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(entries => { const measured = entries[0]?.contentRect.width; if (measured > 0) setWidth(measured); });
    observer.observe(element); return () => observer.disconnect();
  }, [steps.length]);
  if (!steps.length) return null;
  const error = graph.error || (result?.key === layoutKey ? result.error : undefined);
  const layout = result?.key === layoutKey ? result.layout : undefined;
  const stepById = new Map((graph.steps || []).map((step, i) => [step.stepId, { ...step, status: steps[i].status }]));
  const related = focus && graph.steps ? new Set([focus, ...graphAncestors(graph.steps, focus), ...graphDescendants(graph.steps, focus)]) : null;
  // Fit width and height together. Keep text >=80%; scroll wider graphs.
  const scale = zoom === 'fit' ? Math.max(0.8, Math.min(1, width / (layout?.width || width))) : zoom;
  const controls = 'rounded-md border border-scholar-700 px-2 py-1 text-xs text-scholar-300 hover:text-scholar-50 focus-visible:outline-accent';
  return <div data-testid="workflow-flow-chart" className="rounded-xl border border-scholar-700 bg-scholar-950" aria-label={text('流程依赖图')}>
    <div className="flex flex-wrap items-center gap-1.5 border-b border-scholar-700/60 px-3 py-2">
      <button type="button" className={controls} title={text('缩小')} onClick={() => setZoom(Math.max(0.5, +(scale - 0.1).toFixed(2)))}>−</button>
      <button type="button" className={controls} title={text('放大')} onClick={() => setZoom(Math.min(2, +(scale + 0.1).toFixed(2)))}>+</button>
      <button type="button" aria-pressed={zoom === 'fit'} className={controls} title={text('适应宽度')} onClick={() => setZoom('fit')}>{text('适应宽度')}</button>
      <button type="button" aria-pressed={zoom === 1} className={controls} onClick={() => setZoom(1)}>100%</button>
      <span className="mx-1 h-4 border-l border-scholar-700" />
      <button type="button" aria-pressed={direction === 'DOWN'} className={controls} onClick={() => setDirection('DOWN')}>{text('纵向')}</button>
      <button type="button" aria-pressed={direction === 'RIGHT'} className={controls} onClick={() => setDirection('RIGHT')}>{text('横向')}</button>
      <button type="button" aria-pressed={allEdges} className={controls} onClick={() => setAllEdges(value => !value)}>{text(allEdges ? '简化连线' : '显示全部依赖')}</button>
      <span className="ml-auto text-xs text-scholar-400">{text(steps.some(step => step.dependsOn !== undefined) ? '悬停节点查看上下游依赖' : '未声明依赖，按步骤顺序展示')}</span>
    </div>
    {error ? <p role="alert" className="p-4 text-sm text-red-400">{text('流程依赖配置有误')}：{error}</p> : !layout ? <p role="status" className="p-4 text-sm text-scholar-400">{text('正在整理依赖布局…')}</p> : null}
    <div ref={viewport} className="overflow-auto p-3 [scrollbar-width:thin]">
      {layout && <svg width={layout.width * scale} height={layout.height * scale} viewBox={`0 0 ${layout.width} ${layout.height}`} className="mx-auto block" role="group" aria-label={text('流程依赖图')}>
        <defs><marker id={`${markers}-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="context-stroke" /></marker></defs>
        {layout.edges.map(edge => {
          const target = stepById.get(edge.to);
          const highlighted = related ? related.has(edge.from) && related.has(edge.to) : currentStep !== undefined && target?.n === currentStep || target?.status === 'running';
          const muted = related && !highlighted;
          return <g key={`${edge.from}-${edge.to}`} opacity={muted ? 0.18 : 1} style={{ transition: 'opacity .15s' }}>
            {/* A background bridge disambiguates unavoidable non-planar crossings. */}
            <path d={edge.path} fill="none" stroke="var(--color-scholar-950)" strokeWidth="7" strokeLinecap="round" />
            <path data-from={edge.from} data-to={edge.to} d={edge.path} fill="none" stroke={highlighted ? 'var(--color-accent)' : '#64748b'} strokeWidth={highlighted ? 2 : 1.5} strokeLinejoin="round" strokeDasharray={target?.status === 'skipped' ? '4 3' : undefined} markerEnd={`url(#${markers}-arrow)`} />
          </g>;
        })}
        {layout.nodes.map(node => {
          const step = stepById.get(node.id), endpoint = !step;
          const status = step?.status || (node.id === '__start' || steps.every(item => ['done', 'skipped'].includes(item.status)) ? 'done' : 'pending');
          const current = !!step && step.n === currentStep || status === 'running';
          const label = step ? `${step.n}. ${text(step.title)}` : node.id === '__start' ? 'Start' : 'End';
          const [line1, line2] = wrapGraphLabel(label);
          const select = () => { if (step) onSelectStep?.(step.n); };
          return <g key={node.id} data-step-id={node.id} role={step ? 'button' : undefined} tabIndex={step ? 0 : undefined} aria-label={label}
            onClick={select} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); } }}
            onMouseEnter={() => setFocus(step?.stepId || null)} onMouseLeave={() => setFocus(null)} onFocus={() => setFocus(step?.stepId || null)} onBlur={() => setFocus(null)}
            opacity={related && !related.has(node.id) && !endpoint ? 0.35 : 1} style={{ cursor: step && onSelectStep ? 'pointer' : 'default', transition: 'opacity .15s' }}>
            <title>{label}{step?.phase ? ` · ${text(phaseLabel(step.phase))}` : ''} ({status})</title>
            <rect x={node.x} y={node.y} width={node.width} height={node.height} rx={endpoint ? 18 : 12} fill={current ? 'rgb(var(--accent-rgb) / .12)' : 'var(--color-scholar-900)'} stroke={focus === node.id || current ? 'var(--color-accent)' : status === 'done' ? '#059669' : '#64748b'} strokeWidth={current ? 2 : 1.2} strokeDasharray={status === 'skipped' ? '4 3' : undefined} />
            {!endpoint && <circle cx={node.x + 16} cy={node.y + node.height / 2} r="3.6" fill={COLORS[status] || COLORS.pending} className={current ? 'animate-pulse' : undefined} />}
            <text x={node.x + node.width / 2 + (endpoint ? 0 : 5)} y={node.y + (endpoint ? 22 : line2 ? 25 : 31)} textAnchor="middle" fontSize={endpoint ? 13 : 12.5} fontWeight="600" fill="var(--color-scholar-50)">{line1}</text>
            {line2 && <text x={node.x + node.width / 2 + 5} y={node.y + 42} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="var(--color-scholar-50)">{line2}</text>}
            {step?.phase && <text x={node.x + node.width / 2 + 5} y={node.y + 63} textAnchor="middle" fontSize="11" fill={phaseColor(step.phase)}>{text(phaseLabel(step.phase))}</text>}
          </g>;
        })}
      </svg>}
    </div>
  </div>;
}
