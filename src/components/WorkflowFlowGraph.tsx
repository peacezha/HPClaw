import React, { useMemo } from 'react';
import type { WorkflowRunStep } from '../features/workflows/api';

/** 节点状态 → 颜色（边框/文字/连线） */
const STATUS_COLORS: Record<string, { border: string; bg: string; text: string; line: string }> = {
  done: { border: '#34d399', bg: 'rgba(52,211,153,0.10)', text: '#6ee7b7', line: '#34d399' },
  running: { border: 'var(--color-accent)', bg: 'rgb(var(--accent-rgb) / 0.12)', text: 'var(--color-accent-light)', line: 'var(--color-accent)' },
  failed: { border: '#f87171', bg: 'rgba(248,113,113,0.10)', text: '#fca5a5', line: '#f87171' },
  skipped: { border: '#5d6673', bg: 'rgba(93,102,115,0.08)', text: '#8a94a6', line: '#5d6673' },
  pending: { border: '#3f4550', bg: 'rgba(63,69,80,0.25)', text: '#9aa3b0', line: '#4a5160' },
};

const NODE_H = 40;
const GAP = 26;
const PAD_X = 12;
const MAIN_W = 220;      // 主链节点宽
const BRANCH_W = 180;    // 分支节点宽
const BRANCH_DX = 260;   // 分支节点相对主链的水平偏移

interface LayoutNode {
  key: string;
  n: number;
  title: string;
  status: string;
  x: number;
  y: number;
  w: number;
  branch: boolean;
}

/**
 * 流程图（正常流程图样式）：开始 → 步骤链 → 结束，竖向主链 + 可选/跳过步骤右侧虚线分支，
 * 箭头连接，状态着色并随状态变化平滑过渡；运行中步骤脉冲高亮。
 */
export default function WorkflowFlowChart({ steps, currentStep, onSelectStep }: {
  steps: Pick<WorkflowRunStep, 'n' | 'title' | 'status'>[];
  currentStep?: number;
  onSelectStep?: (n: number) => void;
}) {
  const { nodes, edges, height, width } = useMemo(() => {
    // 分支（跳过/可选）步骤排到主链右侧，其余按序竖排
    const main = steps.filter(s => s.status !== 'skipped');
    const branch = steps.filter(s => s.status === 'skipped');
    const nodes: LayoutNode[] = [];
    const edges: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean; status: string }[] = [];

    const centerX = PAD_X + MAIN_W / 2;
    // 开始节点
    nodes.push({ key: '__start', n: 0, title: '开始', status: 'done', x: centerX - 40, y: 8, w: 80, branch: false });
    let y = 8 + NODE_H + GAP;
    let prev = nodes[0];
    for (const step of main) {
      const node: LayoutNode = { key: `s${step.n}`, n: step.n, title: step.title, status: step.status, x: PAD_X, y, w: MAIN_W, branch: false };
      nodes.push(node);
      edges.push({ x1: prev.x + prev.w / 2, y1: prev.y + NODE_H, x2: node.x + node.w / 2, y2: node.y, status: step.status });
      prev = node;
      y += NODE_H + GAP;
    }
    // 结束节点
    const endNode: LayoutNode = { key: '__end', n: -1, title: '结束', status: main.every(s => s.status === 'done') ? 'done' : 'pending', x: centerX - 40, y, w: 80, branch: false };
    nodes.push(endNode);
    edges.push({ x1: prev.x + prev.w / 2, y1: prev.y + NODE_H, x2: endNode.x + endNode.w / 2, y2: endNode.y, status: endNode.status });

    // 分支节点：挂在与其序号最接近的主链节点右侧
    for (const step of branch) {
      const anchor = [...main].reverse().find(s => s.n < step.n) ?? main[0];
      const anchorNode = nodes.find(n => n.key === `s${anchor?.n}`) ?? nodes[1];
      const node: LayoutNode = {
        key: `s${step.n}`, n: step.n, title: step.title, status: 'skipped',
        x: PAD_X + BRANCH_DX, y: anchorNode ? anchorNode.y : 8 + NODE_H + GAP, w: BRANCH_W, branch: true,
      };
      nodes.push(node);
      if (anchorNode) {
        edges.push({ x1: anchorNode.x + anchorNode.w, y1: anchorNode.y + NODE_H / 2, x2: node.x, y2: node.y + NODE_H / 2, dashed: true, status: 'skipped' });
      }
    }

    return { nodes, edges, height: y + NODE_H + 8, width: PAD_X * 2 + (branch.length ? BRANCH_DX + BRANCH_W : MAIN_W) };
  }, [steps]);

  if (!steps.length) return null;

  return (
    <div className="overflow-x-auto py-1 [scrollbar-width:thin]" data-testid="workflow-flow-chart" role="img" aria-label="流程图">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="min-w-[260px]" style={{ maxWidth: width }}>
        <defs>
          <marker id="flow-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,4 L0,8 Z" fill="currentColor" />
          </marker>
        </defs>
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={STATUS_COLORS[e.status]?.line || STATUS_COLORS.pending.line}
            strokeWidth={1.5}
            strokeDasharray={e.dashed ? '4 3' : undefined}
            markerEnd="url(#flow-arrow)"
            style={{ color: STATUS_COLORS[e.status]?.line, transition: 'stroke .3s' }}
          />
        ))}
        {nodes.map(node => {
          const style = STATUS_COLORS[node.status] || STATUS_COLORS.pending;
          const isCurrent = node.n === currentStep || node.status === 'running';
          const label = node.n > 0 ? `${node.n}. ${node.title}` : node.title;
          const title = node.n > 0 ? `步骤 ${node.n}：${node.title}（${node.status}）` : node.title;
          const shape = (
            <g
              style={{ transition: 'opacity .3s' }}
              className={isCurrent ? 'animate-pulse' : undefined}
            >
              <rect
                x={node.x} y={node.y} width={node.w} height={NODE_H} rx={node.n <= 0 ? NODE_H / 2 : 8}
                fill={style.bg} stroke={style.border} strokeWidth={isCurrent ? 2 : 1.2}
                strokeDasharray={node.branch ? '4 3' : undefined}
              />
              <text
                x={node.x + node.w / 2} y={node.y + NODE_H / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={11} fill={style.text}
                style={{ userSelect: 'none' }}
              >
                {label.length > 18 ? `${label.slice(0, 17)}…` : label}
              </text>
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
  );
}
