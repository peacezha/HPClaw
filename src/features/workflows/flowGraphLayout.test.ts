import { describe, expect, it } from 'vitest';
import { layoutWorkflowGraph, normalizeGraphSteps } from './flowGraphLayout';
const make = (id: string, dependsOn: string[], n: number) => ({ n, stepId: id, dependsOn, title: id, status: 'pending' });
const dag = normalizeGraphSteps([make('p', [], 1), make('a', ['p'], 2), make('b', ['p'], 3), make('c', ['p'], 4),
  make('d', ['a', 'c'], 5), make('e', ['a', 'b'], 6), make('f', ['b', 'c'], 7), make('r', ['d', 'e', 'f', 'p'], 8)]);
describe('orthogonal dependency layout', () => {
  it.each(['DOWN', 'RIGHT'] as const)('%s routes forks, joins and long edges outside node interiors', async direction => {
    const layout = await layoutWorkflowGraph(dag, direction, true);
    expect(layout.nodes).toHaveLength(10);
    expect(layout.edges).toHaveLength(15);
    for (const edge of layout.edges) {
      expect(edge.path).toMatch(/^M /);
      for (let i = 1; i < edge.points.length; i++) {
        const a = edge.points[i - 1], b = edge.points[i];
        expect(a.x === b.x || a.y === b.y).toBe(true);
        for (const node of layout.nodes) {
          const intersects = a.x === b.x
            ? a.x > node.x + .01 && a.x < node.x + node.width - .01 && Math.max(a.y, b.y) > node.y + .01 && Math.min(a.y, b.y) < node.y + node.height - .01
            : a.y > node.y + .01 && a.y < node.y + node.height - .01 && Math.max(a.x, b.x) > node.x + .01 && Math.min(a.x, b.x) < node.x + node.width - .01;
          expect(intersects, `${edge.from}→${edge.to} through ${node.id}`).toBe(false);
        }
      }
    }
  });
  it('hides only transitive display edges and can show every declared dependency', async () => {
    expect((await layoutWorkflowGraph(dag, 'DOWN')).edges.some(e => e.from === 'p' && e.to === 'r')).toBe(false);
    expect((await layoutWorkflowGraph(dag, 'DOWN', true)).edges.some(e => e.from === 'p' && e.to === 'r')).toBe(true);
  });
  it('is stable across status polling', async () => {
    expect(await layoutWorkflowGraph(dag, 'DOWN')).toBe(await layoutWorkflowGraph(dag.map(s => ({ ...s, status: 'done' })), 'DOWN'));
  });
  it('rejects invalid graphs instead of silently hiding the offending edges', () => {
    expect(() => normalizeGraphSteps([make('a', ['b'], 1), make('b', ['a'], 2)])).toThrow('Cyclic');
    expect(() => normalizeGraphSteps([make('a', ['missing'], 1)])).toThrow('Invalid');
  });
});
