import { describe, expect, it } from 'vitest';
import { AgentPlanner, buildPlanningPrompt, parsePlanFromResponse } from './agentPlanner';

describe('buildPlanningPrompt', () => {
  it('generates a planning prompt with user goal and cluster context', () => {
    const prompt = buildPlanningPrompt(
      '100个RNA-seq样本做差异表达分析',
      '当前目录有100个FASTQ文件，参考基因组hg38已建索引',
      ['qc', 'alignment', 'transcriptome'],
    );
    expect(prompt).toContain('RNA-seq');
    expect(prompt).toContain('FASTQ');
    expect(prompt).toContain('phase');
  });
});

describe('parsePlanFromResponse', () => {
  it('parses a JSON plan from AI response', () => {
    const response = JSON.stringify({
      goal: 'RNA-seq analysis',
      phases: [
        {
          id: 1,
          name: '质控',
          status: 'pending',
          steps: [{ id: '1.1', description: 'fastp质控', status: 'pending', linkedSkills: ['qc'] }],
          linkedSkills: ['qc'],
          entryConditions: [],
        },
        {
          id: 2,
          name: '比对',
          status: 'pending',
          steps: [{ id: '2.1', description: 'STAR比对', status: 'pending', linkedSkills: ['alignment'] }],
          linkedSkills: ['alignment'],
          entryConditions: ['质控完成'],
        },
      ],
    });

    const plan = parsePlanFromResponse(response);
    expect(plan).not.toBeNull();
    expect(plan!.goal).toBe('RNA-seq analysis');
    expect(plan!.phases.length).toBe(2);
    expect(plan!.currentPhase).toBe(0);
  });

  it('returns null for invalid JSON', () => {
    expect(parsePlanFromResponse('not json')).toBeNull();
  });
});

describe('AgentPlanner', () => {
  it('sets and navigates a plan', () => {
    const planner = new AgentPlanner();
    const plan = {
      goal: 'Test task',
      phases: [
        {
          id: 1,
          name: 'Phase 1',
          status: 'pending' as const,
          steps: [{ id: '1.1', description: 'Step 1', status: 'pending' as const, linkedSkills: [] }],
          linkedSkills: ['skill1'],
          entryConditions: [],
        },
        {
          id: 2,
          name: 'Phase 2',
          status: 'pending' as const,
          steps: [],
          linkedSkills: ['skill2'],
          entryConditions: ['Phase 1 done'],
        },
      ],
      currentPhase: 0,
      createdAt: Date.now(),
    };

    planner.setPlan(plan);
    expect(planner.currentPlan()).toEqual(plan);

    const phase = planner.activatePhase(1);
    expect(phase).not.toBeNull();
    expect(phase!.status).toBe('active');

    planner.completePhase(1);
    const completed = planner.currentPlan()!.phases[0];
    expect(completed.status).toBe('done');
  });

  it('checks if all phases are complete', () => {
    const planner = new AgentPlanner();
    planner.setPlan({
      goal: 'Test',
      phases: [{
        id: 1, name: 'P1', status: 'done',
        steps: [], linkedSkills: [], entryConditions: [],
      }],
      currentPhase: 1,
      createdAt: Date.now(),
    });
    expect(planner.allPhasesComplete()).toBe(true);
  });
});
