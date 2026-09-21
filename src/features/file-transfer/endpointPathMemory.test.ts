import { describe, expect, it } from 'vitest';
import { endpointPathOrDefault, rememberEndpointPath, rememberResolvedEndpointPath } from './endpointPathMemory';

describe('file-transfer endpoint path memory', () => {
  it('restores cluster A after switching A -> B -> A', () => {
    const memory = new Map<string, string>();
    rememberEndpointPath(memory, 'cluster-A', '/public/home/alice/project-a');
    expect(endpointPathOrDefault(memory, 'cluster-B', '/home/bob')).toBe('/home/bob');
    rememberEndpointPath(memory, 'cluster-B', '/share/results');
    expect(endpointPathOrDefault(memory, 'cluster-A', '/home/alice')).toBe('/public/home/alice/project-a');
  });

  it('does not overwrite a remembered path with an empty transient state', () => {
    const memory = new Map([['cluster-A', '/data/kept']]);
    rememberEndpointPath(memory, 'cluster-A', '');
    expect(endpointPathOrDefault(memory, 'cluster-A', '/home/alice')).toBe('/data/kept');
  });

  it('does not assign the previous pane path to a newly selected cluster while loading', () => {
    const memory = new Map([['cluster-A', '/home/alice/project']]);

    rememberResolvedEndpointPath(memory, 'cluster-B', '/home/alice/project', true);
    expect(endpointPathOrDefault(memory, 'cluster-B', '/home/bob')).toBe('/home/bob');

    rememberResolvedEndpointPath(memory, 'cluster-B', '/home/bob/results', false);
    expect(endpointPathOrDefault(memory, 'cluster-B', '/home/bob')).toBe('/home/bob/results');
    expect(endpointPathOrDefault(memory, 'cluster-A', '/home/alice')).toBe('/home/alice/project');
  });
});
