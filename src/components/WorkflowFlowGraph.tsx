import React, { useMemo, useState } from 'react';
import type { WorkflowRunStep } from '../features/workflows/api';

// 双主题配色：文字走 scholar 语义变量（明暗主题自动切换），
// 边框/圆点/连线取在中间明度，白底与深底上都清晰
const STATUS_COLORS: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  done: { border: '#059669', bg: 'rgba(5,150,105,0.16)', text: 'var(--color-scholar-50)', dot: '#10b981' },
  running: { border: 'var(--color-accent)', bg: 'rgb(var(--accent-rgb) / 0.16)', text: 'var(--color-scholar-50)', dot: 'var(--color-accent)' },
  failed: { border: '#dc2626', bg: 'rgba(220,38,38,0.14)', text: 'var(--color-scholar-50)', dot: '#ef4444' },
  skipped: { border: '#64748b', bg: 'rgba(100,116,139,0.14)', text: 'var(--color-scholar-500)', dot: '#94a3b8' },
  pending: { border: '#64748b', bg: 'rgba(100,116,139,0.12)', text: 'var(--color-scholar-50)', dot: '#94a3b8' },
};

// 阶段徽标配色（按 phase 名哈希取色；中间明度，白底/深底双可读）
const PHASE_PALETTE = ['#0284c7', '#7c3aed', '#be185d', '#b45309', '#059669', '#65a30d', '#0f766e', '#e11d48'];

const EDGE_NEUTRAL = '#64748b';

const NODE_W = 232;
const NODE_H = 62;
const END_W = 104;
const END_H = 38;
const DUMMY_W = 14;
const GAP_X = 30;
const GAP_Y = 72;
const PAD = 24;

interface LayoutNode {
  key: string;
  stepId: string;
  n: number;
  title: string;
  status: string;
  phase?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface LayoutEdge {
  from: string;
  to: string;
  path: string;
  dashed: boolean;
  highlight: boolean;
}

// 布局单元：真实步骤 / 起止节点 / 虚拟走廊节点（跨层边的占位，不渲染）
interface Unit {
  id: string;
  kind: 'step' | 'start' | 'end' | 'dummy';
  level: number;
  w: number;
  x: number;
  y: number;
}

type FlowStep = Pick<WorkflowRunStep, 'n' | 'stepId' | 'title' | 'status' | 'dependsOn' | 'phase'>;

function phaseColor(phase?: string): string {
  if (!phase) return '#9aa3b0';
  let hash = 0;
  for (let i = 0; i < phase.length; i += 1) hash = (hash * 31 + phase.charCodeAt(i)) >>> 0;
  return PHASE_PALETTE[hash % PHASE_PALETTE.length];
}

/** 标题按词折行：尽量两行内放下，第二行过长才省略 */
function wrapLabel(label: string, maxChars: number): [string, string | null] {
  if (label.length <= maxChars) return [label, null];
  const cut = label.lastIndexOf(' ', maxChars);
  const head = cut > 8 ? label.slice(0, cut) : label.slice(0, maxChars);
  let tail = label.slice(head.length).trim();
  const tailMax = maxChars + 4;
  if (tail.length > tailMax) tail = `${tail.slice(0, tailMax - 1)}…`;
  return [head, tail];
}

/**
 * 按 dependsOn 绘制真实 DAG：
 * - Kahn 拓扑排序 + 最长路径分层，与输入数组顺序无关；
 * - 跨层边插入虚拟走廊节点：水平移动只发生在层间空白带，垂直移动只走预留走廊，
 *   连线不穿过任何步骤框；
 * - 层内按父/子节点重心迭代排序，连线交叉大幅减少；
 * - 宽图不再整体缩小：内置缩放控件（100% / 适应宽度 / ±），小字保持清晰。
 */
export default function WorkflowFlowChart({ steps, currentStep, onSelectStep }: {
  steps: FlowStep[];
  currentStep?: number;
  onSelectStep?: (n: number) => void;
}) {
  const [zoom, setZoom] = useState<'fit' | number>('fit');

  const layout = useMemo(() => {
    const fallbackId = (step: FlowStep, index: number) =>
      step.stepId || `step-${String(step.n || index + 1).padStart(2, '0')}`;
    const normalized = steps.map((step, index) => ({ ...step, stepId: fallbackId(step, index) }));
    const knownIds = new Set(normalized.map(step => step.stepId));
    const depsOf = normalized.map((step, index) => (step.dependsOn === undefined
      ? (index > 0 ? [fallbackId(steps[index - 1], index - 1)] : [])
      : step.dependsOn
    ).filter(id => knownIds.has(id) && id !== step.stepId));
    // 传递冗余边消除（只影响绘图，不改存储的 dependsOn）：
    // 依赖 u 若已经是另一个依赖的祖先（u→…→u′→v 已连通），直连边 u→v 就是
    // 用户眼里“没有必要、像和旧线混在一起”的那根线，予以隐藏。
    const ancestorsOf = (id: string): Set<string> => {
      const out = new Set<string>();
      const stack = [...(depsOf[normalized.findIndex(step => step.stepId === id)] || [])];
      while (stack.length) {
        const cur = stack.pop()!;
        if (out.has(cur)) continue;
        out.add(cur);
        const idx = normalized.findIndex(step => step.stepId === cur);
        if (idx >= 0) stack.push(...depsOf[idx]);
      }
      return out;
    };
    const ancestorCache = new Map<string, Set<string>>();
    const ancestorsCached = (id: string) => {
      if (!ancestorCache.has(id)) ancestorCache.set(id, ancestorsOf(id));
      return ancestorCache.get(id)!;
    };
    const reducedDepsOf = normalized.map((step, i) => {
      const deps = depsOf[i];
      if (deps.length < 2) return deps;
      return deps.filter(dep => !deps.some(other => other !== dep && ancestorsCached(other).has(dep)));
    });

    // Kahn 拓扑排序（稳定：同级保持原数组顺序）
    const indegree = new Map<string, number>();
    const childrenOf = new Map<string, string[]>();
    normalized.forEach((step, i) => {
      indegree.set(step.stepId, reducedDepsOf[i].length);
      for (const dep of reducedDepsOf[i]) childrenOf.set(dep, [...(childrenOf.get(dep) || []), step.stepId]);
    });
    const queue = normalized.filter(step => (indegree.get(step.stepId) || 0) === 0).map(step => step.stepId);
    const topo: string[] = [];
    while (queue.length) {
      const id = queue.shift()!;
      topo.push(id);
      for (const child of childrenOf.get(id) || []) {
        const rest = (indegree.get(child) || 0) - 1;
        indegree.set(child, rest);
        if (rest === 0) queue.push(child);
      }
    }
    if (topo.length < normalized.length) {
      for (const step of normalized) if (!topo.includes(step.stepId)) topo.push(step.stepId);
    }

    // 最长路径分层（拓扑序保证依赖先算）
    const levels = new Map<string, number>();
    for (const id of topo) {
      const index = normalized.findIndex(step => step.stepId === id);
      const deps = reducedDepsOf[index];
      levels.set(id, deps.length ? Math.max(...deps.map(d => levels.get(d) || 1)) + 1 : 1);
    }
    const maxLevel = Math.max(1, ...levels.values());
    const levelOf = (id: string) => (id === '__start' ? 0 : id === '__end' ? maxLevel + 1 : levels.get(id) || 1);

    // 逻辑边：无依赖的从开始节点连入；无下游的末端节点连到结束节点
    const currentN = currentStep ?? normalized.find(step => step.status === 'running')?.n;
    const logicalEdges: Array<{ from: string; to: string; dashed: boolean; highlight: boolean }> = [];
    normalized.forEach((step, i) => {
      const dependencies = reducedDepsOf[i].length ? reducedDepsOf[i] : ['__start'];
      const highlight = step.n === currentN || step.status === 'running';
      dependencies.forEach(dep => logicalEdges.push({ from: dep, to: step.stepId, dashed: step.status === 'skipped', highlight }));
    });
    const downstream = new Set(normalized.flatMap((step, i) => reducedDepsOf[i]));
    normalized.filter(step => !downstream.has(step.stepId))
      .forEach(step => logicalEdges.push({ from: step.stepId, to: '__end', dashed: step.status === 'skipped', highlight: false }));

    // 跨层边拆成逐层链：中间插入虚拟走廊节点
    const units = new Map<string, Unit>();
    units.set('__start', { id: '__start', kind: 'start', level: 0, w: END_W, x: 0, y: 0 });
    units.set('__end', { id: '__end', kind: 'end', level: maxLevel + 1, w: END_W, x: 0, y: 0 });
    for (const step of normalized) {
      units.set(step.stepId, { id: step.stepId, kind: 'step', level: levelOf(step.stepId), w: NODE_W, x: 0, y: 0 });
    }
    const unitEdges: Array<{ from: string; to: string }> = [];
    const chains = new Map<number, string[]>();
    logicalEdges.forEach((edge, edgeIndex) => {
      const span = levelOf(edge.to) - levelOf(edge.from);
      if (span <= 1) {
        unitEdges.push({ from: edge.from, to: edge.to });
        return;
      }
      const chain: string[] = [];
      for (let level = levelOf(edge.from) + 1; level < levelOf(edge.to); level += 1) {
        const dummyId = `__dummy_${edgeIndex}_${level}`;
        units.set(dummyId, { id: dummyId, kind: 'dummy', level, w: DUMMY_W, x: 0, y: 0 });
        chain.push(dummyId);
      }
      chains.set(edgeIndex, chain);
      unitEdges.push({ from: edge.from, to: chain[0] });
      for (let i = 0; i + 1 < chain.length; i += 1) unitEdges.push({ from: chain[i], to: chain[i + 1] });
      unitEdges.push({ from: chain[chain.length - 1], to: edge.to });
    });

    // 分行（初始顺序：拓扑序；虚拟节点按创建序排在同行真实节点之后）
    const rows = new Map<number, string[]>();
    const pushRow = (id: string, level: number) => rows.set(level, [...(rows.get(level) || []), id]);
    pushRow('__start', 0);
    for (const id of topo) pushRow(id, levelOf(id));
    pushRow('__end', maxLevel + 1);
    for (const [, chain] of [...chains.entries()].sort((a, b) => a[0] - b[0])) {
      for (const dummyId of chain) pushRow(dummyId, levelOf(dummyId));
    }

    // 单元图邻接关系（重心排序用）
    const parentsOf = new Map<string, string[]>();
    const childrenOfUnit = new Map<string, string[]>();
    for (const { from, to } of unitEdges) {
      parentsOf.set(to, [...(parentsOf.get(to) || []), from]);
      childrenOfUnit.set(from, [...(childrenOfUnit.get(from) || []), to]);
    }

    const rowWidth = (row: string[]) => row.reduce((sum, id) => sum + units.get(id)!.w, 0) + Math.max(0, row.length - 1) * GAP_X;
    let width = Math.max(340, PAD * 2 + Math.max(...[...rows.values()].map(rowWidth)));
    const assignX = () => {
      width = Math.max(340, PAD * 2 + Math.max(...[...rows.values()].map(rowWidth)));
      for (const row of rows.values()) {
        let cursor = (width - rowWidth(row)) / 2;
        for (const id of row) {
          const unit = units.get(id)!;
          unit.x = cursor;
          cursor += unit.w + GAP_X;
        }
      }
    };
    assignX();

    const centerX = (id: string) => {
      const unit = units.get(id)!;
      return unit.x + unit.w / 2;
    };
    const sortByBarycenter = (level: number, neighbors: (id: string) => string[]) => {
      const row = rows.get(level);
      if (!row || row.length < 2) return;
      const original = new Map(row.map((id, index) => [id, index]));
      const scored = row.map(id => {
        const xs = neighbors(id).map(centerX);
        return { id, score: xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null };
      });
      scored.sort((a, b) => {
        if (a.score === null && b.score === null) return (original.get(a.id) || 0) - (original.get(b.id) || 0);
        if (a.score === null) return 1;
        if (b.score === null) return -1;
        return a.score - b.score || (original.get(a.id) || 0) - (original.get(b.id) || 0);
      });
      rows.set(level, scored.map(item => item.id));
      assignX();
    };
    for (let pass = 0; pass < 4; pass += 1) {
      for (let level = 1; level <= maxLevel + 1; level += 1) {
        sortByBarycenter(level, id => parentsOf.get(id) || []);
      }
      for (let level = maxLevel; level >= 1; level -= 1) {
        sortByBarycenter(level, id => childrenOfUnit.get(id) || []);
      }
    }

    // 纵向坐标
    const rowY = (level: number) => (level === 0
      ? PAD
      : PAD + END_H + GAP_Y + (level - 1) * (NODE_H + GAP_Y));
    const rowH = (level: number) => (level === 0 || level === maxLevel + 1 ? END_H : NODE_H);
    for (const unit of units.values()) {
      unit.y = unit.kind === 'dummy' ? rowY(unit.level) + NODE_H / 2 : rowY(unit.level);
    }
    const gapCenterY = (upperLevel: number) => rowY(upperLevel) + rowH(upperLevel) + GAP_Y / 2;

    // 连线：相邻层用平滑贝塞尔；跨层链用正交折线（圆角接头）
    const edges: LayoutEdge[] = [];
    logicalEdges.forEach((edge, edgeIndex) => {
      const fromUnit = units.get(edge.from)!;
      const toUnit = units.get(edge.to)!;
      const x1 = fromUnit.x + fromUnit.w / 2;
      const y1 = fromUnit.y + rowH(fromUnit.level);
      const x2 = toUnit.x + toUnit.w / 2;
      const y2 = toUnit.y;
      const chain = chains.get(edgeIndex);
      let path: string;
      if (!chain) {
        const midY = y1 + (y2 - y1) / 2;
        path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
      } else {
        const points: Array<[number, number]> = [[x1, y1]];
        let prevLevel = fromUnit.level;
        for (const dummyId of chain) {
          const dummy = units.get(dummyId)!;
          const dx = dummy.x + dummy.w / 2;
          const gy = gapCenterY(prevLevel);
          points.push([points[points.length - 1][0], gy]);
          if (points[points.length - 1][0] !== dx) points.push([dx, gy]);
          points.push([dx, dummy.y]);
          prevLevel = dummy.level;
        }
        const gy = gapCenterY(prevLevel);
        points.push([points[points.length - 1][0], gy]);
        if (points[points.length - 1][0] !== x2) points.push([x2, gy]);
        points.push([x2, y2]);
        const deduped = points.filter((point, index) => index === 0
          || Math.abs(point[0] - points[index - 1][0]) > 0.01 || Math.abs(point[1] - points[index - 1][1]) > 0.01);
        path = deduped.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' ');
      }
      edges.push({ from: edge.from, to: edge.to, path, dashed: edge.dashed, highlight: edge.highlight });
    });

    const stepById = new Map(normalized.map(step => [step.stepId, step]));
    const allDone = normalized.every(step => step.status === 'done' || step.status === 'skipped');
    const nodes: LayoutNode[] = [...units.values()]
      .filter(unit => unit.kind !== 'dummy')
      .map(unit => unit.kind === 'step'
        ? {
          key: unit.id, stepId: unit.id, n: stepById.get(unit.id)!.n, title: stepById.get(unit.id)!.title,
          status: stepById.get(unit.id)!.status, phase: stepById.get(unit.id)!.phase,
          x: unit.x, y: unit.y, w: unit.w, h: NODE_H,
        }
        : {
          key: unit.id, stepId: unit.id, n: unit.kind === 'start' ? 0 : -1,
          title: unit.kind === 'start' ? 'Start' : 'End', status: unit.kind === 'start' || allDone ? 'done' : 'pending',
          x: unit.x, y: unit.y, w: unit.w, h: END_H,
        });
    const endNode = nodes.find(node => node.stepId === '__end')!;
    return { nodes, edges, width, height: endNode.y + END_H + PAD };
  }, [steps, currentStep]);

  if (!steps.length) return null;

  const scale = zoom === 'fit' ? null : zoom;
  const svgWidth = scale === null ? '100%' : Math.round(layout.width * scale);
  const svgHeight = scale === null ? layout.height : Math.round(layout.height * scale);

  return (
    <div className="rounded-lg border border-scholar-700/60 bg-scholar-950/70" data-testid="workflow-flow-chart" role="img" aria-label="流程依赖图">
      <div className="flex items-center gap-1 px-2 pt-1.5">
        <button
          type="button"
          className="px-1.5 py-0.5 rounded text-[10px] text-scholar-300 hover:text-scholar-100 bg-scholar-800/70 border border-scholar-700/60"
          onClick={() => setZoom(z => (z === 'fit' ? 0.8 : Math.max(0.5, +(z - 0.2).toFixed(2))))}
          title="缩小"
        >−</button>
        <button
          type="button"
          className="px-1.5 py-0.5 rounded text-[10px] text-scholar-300 hover:text-scholar-100 bg-scholar-800/70 border border-scholar-700/60"
          onClick={() => setZoom(z => (z === 'fit' ? 1.2 : Math.min(2, +(z + 0.2).toFixed(2))))}
          title="放大"
        >+</button>
        <button
          type="button"
          className={`px-1.5 py-0.5 rounded text-[10px] border ${zoom === 'fit' ? 'text-accent border-accent/40 bg-accent/10' : 'text-scholar-300 hover:text-scholar-100 bg-scholar-800/70 border-scholar-700/60'}`}
          onClick={() => setZoom('fit')}
          title="适应宽度"
        >适应</button>
        <button
          type="button"
          className={`px-1.5 py-0.5 rounded text-[10px] border ${zoom === 1 ? 'text-accent border-accent/40 bg-accent/10' : 'text-scholar-300 hover:text-scholar-100 bg-scholar-800/70 border-scholar-700/60'}`}
          onClick={() => setZoom(1)}
          title="实际大小（文字最清晰）"
        >100%</button>
      </div>
      <div className="overflow-x-auto overflow-y-hidden px-2 pb-2 [scrollbar-width:thin]">
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${layout.width} ${layout.height}`} className="min-w-[320px]" style={scale === null ? { maxWidth: layout.width } : undefined}>
        <defs>
          <marker id="flow-arrow-neutral" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3.5 L0,7 Z" fill={EDGE_NEUTRAL} />
          </marker>
          <marker id="flow-arrow-active" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3.5 L0,7 Z" fill="var(--color-accent)" />
          </marker>
        </defs>
        {layout.edges.map((edge, index) => (
          <path
            key={`${edge.from}-${edge.to}-${index}`}
            d={edge.path}
            fill="none"
            stroke={edge.highlight ? 'var(--color-accent)' : EDGE_NEUTRAL}
            strokeWidth={edge.highlight ? 2 : 1.3}
            strokeOpacity={edge.highlight ? 0.95 : 0.6}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={edge.dashed ? '4 3' : undefined}
            markerEnd={edge.highlight ? 'url(#flow-arrow-active)' : 'url(#flow-arrow-neutral)'}
            data-from={edge.from}
            data-to={edge.to}
            style={{ transition: 'stroke .3s' }}
          />
        ))}
        {layout.nodes.map(node => {
          const style = STATUS_COLORS[node.status] || STATUS_COLORS.pending;
          const isCurrent = node.n === currentStep || node.status === 'running';
          const isEndpoint = node.n <= 0;
          const label = node.n > 0 ? `${node.n}. ${node.title}` : node.title;
          const title = node.n > 0
            ? `步骤 ${node.n}：${node.title}${node.phase ? ` · ${node.phase}` : ''}（${node.status}）`
            : node.title;
          const [line1, line2] = isEndpoint ? [label, null] : wrapLabel(label, 26);
          const shape = (
            <g style={{ transition: 'opacity .3s' }} className={isCurrent ? 'animate-pulse' : undefined}>
              <rect
                x={node.x} y={node.y} width={node.w} height={node.h} rx={isEndpoint ? node.h / 2 : 10}
                fill={style.bg} stroke={style.border} strokeWidth={isCurrent ? 2 : 1.3}
                strokeDasharray={node.status === 'skipped' ? '4 3' : undefined}
              />
              {isEndpoint ? (
                <text
                  x={node.x + node.w / 2} y={node.y + node.h / 2 + 0.5}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={13} fontWeight={600} fill={style.text}
                  style={{ userSelect: 'none', letterSpacing: 1 }}
                >
                  {label}
                </text>
              ) : (
                <>
                  <circle cx={node.x + 15} cy={node.y + node.h / 2} r={3.6} fill={style.dot} />
                  <text
                    x={node.x + node.w / 2 + 6} y={line2 ? node.y + 16 : node.y + 24}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={12.5} fontWeight={600} fill={style.text}
                    style={{ userSelect: 'none' }}
                  >
                    {line1}
                  </text>
                  {line2 && (
                    <text
                      x={node.x + node.w / 2 + 6} y={node.y + 31}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={12.5} fontWeight={600} fill={style.text}
                      style={{ userSelect: 'none' }}
                    >
                      {line2}
                    </text>
                  )}
                  <text
                    x={node.x + node.w / 2 + 6} y={node.y + (line2 ? 49 : 44)}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={10.5} fill={phaseColor(node.phase)}
                    style={{ userSelect: 'none', letterSpacing: 0.4 }}
                  >
                    {node.phase || ''}
                  </text>
                </>
              )}
            </g>
          );
          return onSelectStep && node.n > 0 ? (
            <g key={node.key} onClick={() => onSelectStep(node.n)} style={{ cursor: 'pointer' }} role="button" aria-label={title}>
              <title>{title}</title>
              {shape}
            </g>
          ) : (
            <g key={node.key}><title>{title}</title>{shape}</g>
          );
        })}
        </svg>
      </div>
    </div>
  );
}
