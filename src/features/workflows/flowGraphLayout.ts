import type { ElkNode, ElkPoint } from 'elkjs/lib/elk-api';

export interface FlowStep { n: number; stepId?: string; title: string; status: string; dependsOn?: string[]; phase?: string }
export type GraphStep = FlowStep & { stepId: string; dependsOn: string[] };
export interface GraphNode { id: string; x: number; y: number; width: number; height: number }
export interface GraphEdge { from: string; to: string; points: ElkPoint[]; path: string }
export interface GraphLayout { nodes: GraphNode[]; edges: GraphEdge[]; width: number; height: number }

export function normalizeGraphSteps(steps: FlowStep[]): GraphStep[] {
  const normalized = steps.map((step, i) => ({ ...step, stepId: step.stepId || `step-${String(step.n || i + 1).padStart(2, '0')}`, dependsOn: [] as string[] }));
  const ids = new Set(normalized.map(step => step.stepId));
  if (ids.size !== steps.length || ids.has('__start') || ids.has('__end')) throw new Error('Duplicate or reserved step ID');
  normalized.forEach((step, i) => {
    step.dependsOn = [...new Set(steps[i].dependsOn === undefined ? i ? [normalized[i - 1].stepId] : [] : steps[i].dependsOn)];
    for (const dependency of step.dependsOn) if (!ids.has(dependency) || dependency === step.stepId) throw new Error(`Invalid dependency: ${step.stepId} → ${dependency}`);
  });
  const visiting = new Set<string>(), visited = new Set<string>();
  const byId = new Map(normalized.map(step => [step.stepId, step]));
  const visit = (id: string) => {
    if (visiting.has(id)) throw new Error('Cyclic workflow dependencies');
    if (visited.has(id)) return;
    visiting.add(id); byId.get(id)!.dependsOn.forEach(visit);
    visiting.delete(id); visited.add(id);
  };
  normalized.forEach(step => visit(step.stepId));
  return normalized;
}

export function graphAncestors(steps: GraphStep[], id: string): Set<string> {
  const byId = new Map(steps.map(step => [step.stepId, step]));
  const found = new Set<string>();
  const walk = (key: string) => { for (const dep of byId.get(key)?.dependsOn || []) if (!found.has(dep)) { found.add(dep); walk(dep); } };
  walk(id); return found;
}

export function graphDescendants(steps: GraphStep[], id: string): Set<string> {
  const found = new Set<string>();
  const walk = (key: string) => { for (const step of steps) if (step.dependsOn.includes(key) && !found.has(step.stepId)) { found.add(step.stepId); walk(step.stepId); } };
  walk(id); return found;
}

/** Round orthogonal bends, without moving any segment into a node rectangle. */
export function roundedEdgePath(points: ElkPoint[], radius = 7): string {
  if (!points.length) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1], b = points[i], c = points[i + 1];
    const ab = Math.hypot(b.x - a.x, b.y - a.y), bc = Math.hypot(c.x - b.x, c.y - b.y);
    if (!ab || !bc) continue;
    const r = Math.min(radius, ab / 2, bc / 2);
    const entry = { x: b.x + (a.x - b.x) * r / ab, y: b.y + (a.y - b.y) * r / ab };
    const exit = { x: b.x + (c.x - b.x) * r / bc, y: b.y + (c.y - b.y) * r / bc };
    path += ` L ${entry.x} ${entry.y} Q ${b.x} ${b.y} ${exit.x} ${exit.y}`;
  }
  const end = points[points.length - 1];
  return `${path} L ${end.x} ${end.y}`;
}

const cache = new Map<string, Promise<GraphLayout>>();
let engine: Promise<InstanceType<typeof import('elkjs/lib/elk.bundled.js').default>> | undefined;

/** Never infer scientific dependencies from titles or status polling. */
export function layoutWorkflowGraph(steps: GraphStep[], direction: 'DOWN' | 'RIGHT', allEdges = false): Promise<GraphLayout> {
  const definitions = steps.map(({ stepId, n, title, phase, dependsOn }) => ({ stepId, n, title, phase, dependsOn }));
  const key = JSON.stringify([definitions, direction, allEdges]);
  if (cache.has(key)) return cache.get(key)!;
  const pending = (async () => {
    engine ||= import('elkjs/lib/elk.bundled.js').then(module => new module.default({ algorithms: ['layered'] }));
    const elk = await engine;
    const reduced = steps.map(step => ({ ...step, dependsOn: allEdges ? step.dependsOn : step.dependsOn.filter(dep => !step.dependsOn.some(other => other !== dep && graphAncestors(steps, other).has(dep))) }));
    const downstream = new Set(reduced.flatMap(step => step.dependsOn));
    const logical: Array<{ from: string; to: string }> = reduced.flatMap(step => (step.dependsOn.length ? step.dependsOn : ['__start']).map(from => ({ from, to: step.stepId })));
    reduced.filter(step => !downstream.has(step.stepId)).forEach(step => logical.push({ from: step.stepId, to: '__end' }));
    const graph: ElkNode = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered', 'elk.direction': direction, 'elk.edgeRouting': 'ORTHOGONAL',
        'elk.padding': '[top=24,left=24,bottom=24,right=24]', 'elk.spacing.nodeNode': '42',
        'elk.layered.spacing.nodeNodeBetweenLayers': '58', 'elk.layered.spacing.edgeNodeBetweenLayers': '22',
        'elk.spacing.edgeEdge': '14', 'elk.layered.spacing.edgeEdgeBetweenLayers': '14',
        'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
        'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF', 'elk.randomSeed': '41',
      },
      children: ['__start', ...steps.map(step => step.stepId), '__end'].map(id => ({
        id, width: ['__start', '__end'].includes(id) ? 100 : 260, height: ['__start', '__end'].includes(id) ? 36 : 76,
        layoutOptions: { 'elk.portConstraints': 'FIXED_SIDE' },
        ports: [{ id: `${id}:in`, width: 0, height: 0, layoutOptions: { 'elk.port.side': direction === 'DOWN' ? 'NORTH' : 'WEST' } },
          { id: `${id}:out`, width: 0, height: 0, layoutOptions: { 'elk.port.side': direction === 'DOWN' ? 'SOUTH' : 'EAST' } }],
      })),
      edges: logical.map((edge, i) => ({ id: `edge-${i}`, sources: [`${edge.from}:out`], targets: [`${edge.to}:in`] })),
    };
    const result = await elk.layout(graph);
    return {
      width: result.width!, height: result.height!,
      nodes: result.children!.map(node => ({ id: node.id, x: node.x!, y: node.y!, width: node.width!, height: node.height! })),
      edges: result.edges!.map(edge => {
        const section = edge.sections?.[0];
        if (!section) throw new Error('No route for dependency edge');
        const points = [section.startPoint, ...(section.bendPoints || []), section.endPoint];
        return { ...logical[Number(edge.id.slice(5))], points, path: roundedEdgePath(points) };
      }),
    };
  })();
  cache.set(key, pending);
  if (cache.size > 40) cache.delete(cache.keys().next().value!);
  pending.catch(() => { cache.delete(key); });
  return pending;
}
