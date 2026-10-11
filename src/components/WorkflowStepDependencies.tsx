import type { WorkflowStep } from '@/shared/workflow';
import { stableWorkflowStepIds } from '@/shared/workflowDependencies';
import { useWorkflowText } from '../i18n';

export default function WorkflowStepDependencies({ steps, index, onChange }: {
  steps: WorkflowStep[]; index: number; onChange: (steps: WorkflowStep[]) => void;
}) {
  const text = useWorkflowText();
  const materialized = stableWorkflowStepIds(steps);
  const selected = steps[index].dependsOn ?? (index ? [materialized[index - 1].id!] : []);
  const choices = materialized.slice(0, index);
  const invalid = selected.filter(id => !choices.some(step => step.id === id));
  const update = (dependsOn: string[]) => onChange(materialized.map((step, i) => i === index ? { ...step, dependsOn } : step));
  return <details className="rounded border border-scholar-700/80 px-2 py-1.5">
    <summary className="cursor-pointer text-xs text-scholar-300">{text('上游依赖')} · {selected.length || text('无上游依赖')}
      {steps[index].dependsOn === undefined ? ` · ${text('默认顺序')}` : ''}</summary>
    <p className="my-2 text-xs text-scholar-400">{text('选择本步骤需要的上游产物；多选表示汇合，无依赖表示起点。执行仍按步骤顺序推进。')}</p>
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {choices.map((step, i) => <label key={step.id} className="flex items-center gap-1.5 text-xs text-scholar-200">
        <input type="checkbox" checked={selected.includes(step.id!)} onChange={event => update(event.target.checked ? [...selected, step.id!] : selected.filter(id => id !== step.id))} />
        {i + 1}. {text(step.title) || text('未命名步骤')}
      </label>)}
      {!choices.length && <span className="text-xs text-scholar-400">{text('无上游依赖')}</span>}
    </div>
    {invalid.map(id => <button key={id} type="button" onClick={() => update(selected.filter(dep => dep !== id))} className="mt-2 text-xs text-red-400">
      {text('移除无效依赖')}：{id} ×
    </button>)}
    <button type="button" className="mt-2 text-xs text-accent" onClick={() => onChange(materialized.map((step, i) => {
      if (i !== index) return step;
      const { dependsOn: _dependsOn, ...rest } = step; return rest;
    }))}>{text('恢复默认顺序依赖')}</button>
  </details>;
}
