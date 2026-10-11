import type { Workflow, WorkflowLifecycle } from './workflow';

export const PENDING_DISPOSAL_CATEGORY = '待弃置';
export const WORKFLOW_CATALOG_CHANGED = 'hpclaw:workflows-changed';
export const isPendingDisposal = (workflow: Pick<Workflow, 'lifecycle'>): boolean => workflow.lifecycle?.state === 'pending_disposal';

export function workflowDisposalReason(workflow: Pick<Workflow, 'lifecycle'>): string {
  const reasons: Record<NonNullable<WorkflowLifecycle['reasonCode']>, string> = {
    language_duplicate: '独立语言版本与主流程重复；主流程已支持中英文切换。',
    exact_duplicate: '步骤命令、参数和依赖与另一流程完全相同。',
    incomplete_paper: '文献审计为不足：缺少可复现证据或执行细节。',
    placeholder_steps: '存在仅注释的必需步骤，尚不能完成全流程。',
    unverified_dag: '实验性 DAG 与线性版重叠，伪重复实现尚未验证。',
    retired_seed: '旧版系统流程已停止维护；保留定义供核对。',
    manual: '用户移入待弃置。',
  };
  return workflow.lifecycle?.reason || reasons[workflow.lifecycle?.reasonCode || 'manual'];
}

const LANGUAGE_ALIASES: Record<string, string> = {
  'builtin-dapseq-tf-en': 'builtin-dapseq-tf',
  'encode-chipseq-tf-en': 'encode-chipseq-tf',
  'encode-chipseq-histone-en': 'encode-chipseq-histone',
  'encode-atacseq-en': 'encode-atacseq',
};

function executionFingerprint(workflow: Workflow): string {
  // Keep every executable byte, parameter value, gate and resource. Similar names
  // or different analysis methods are never enough to claim duplication.
  return JSON.stringify({
    params: workflow.params.map(({ label: _label, help: _help, placeholder: _placeholder, ...rest }) => rest),
    steps: workflow.steps.map(({ title: _title, notes: _notes, phase: _phase, ...rest }) => rest),
    manifest: workflow.manifest, assets: workflow.assets,
  });
}

/** Conservative, reversible migration. Explicit user decisions always win. */
export function classifyWorkflowCatalog(workflows: Workflow[], now = Date.now()): number {
  let changed = 0;
  const archive = (workflow: Workflow, reasonCode: WorkflowLifecycle['reasonCode'], replacementId?: string) => {
    if (workflow.lifecycle) return;
    workflow.lifecycle = { state: 'pending_disposal', origin: 'automatic', reasonCode, ...(replacementId ? { replacementId } : {}), updatedAt: now };
    changed++;
  };
  for (const workflow of workflows) {
    // Restore only our previous automatic quarantine after the corrected seed
    // has actually replaced its scripts. Manual archive/delete decisions win.
    if (workflow.id === 'encode-chipseq-tf-dag' && workflow.source === 'builtin'
      && !workflow.provenance?.customized && workflow.provenance?.importerVersion === 'chipseq-dag-v2'
      && workflow.lifecycle?.state === 'pending_disposal' && workflow.lifecycle.origin === 'automatic'
      && workflow.lifecycle.reasonCode === 'unverified_dag') {
      workflow.lifecycle = { state: 'active', origin: 'automatic', updatedAt: now };
      changed++;
    }
    if (workflow.lifecycle) continue;
    const replacement = LANGUAGE_ALIASES[workflow.id];
    if (workflow.source === 'builtin' && !workflow.provenance?.customized && replacement
      && workflows.some(item => item.id === replacement && !isPendingDisposal(item))) {
      archive(workflow, 'language_duplicate', replacement);
    } else if (workflow.id === 'encode-chipseq-tf-dag' && workflow.source === 'builtin'
      && !workflow.provenance?.customized
      && workflow.steps.some(step => step.command.includes('--subsample-seed 11') && step.command.includes('--subsample-seed 23'))) {
      archive(workflow, 'unverified_dag', 'encode-chipseq-tf');
    } else if (workflow.paperImport?.quality.readiness === 'insufficient') {
      archive(workflow, 'incomplete_paper');
    } else if (workflow.steps.some(step => !step.optional && /REVIEW_REQUIRED/.test(step.command)
      && step.command.split(/\r?\n/).every(line => !line.trim() || line.trim().startsWith('#')))) {
      archive(workflow, 'placeholder_steps');
    } else if (workflow.id === 'encode-chipseq-tf-official' && workflow.source === 'builtin' && !workflow.provenance?.customized) {
      archive(workflow, 'retired_seed', 'encode-chipseq-tf');
    }
  }
  const seen = new Map<string, Workflow>();
  // A customized definition or explicit restoration takes precedence over an
  // untouched seed. Do not reorder the original catalogue.
  const priority = (w: Workflow) => w.lifecycle?.state === 'active' ? 0 : w.provenance?.customized ? 1 : w.source === 'builtin' ? 2 : 3;
  for (const workflow of [...workflows].sort((a, b) => priority(a) - priority(b) || a.createdAt - b.createdAt || a.id.localeCompare(b.id))) {
    if (isPendingDisposal(workflow) || !workflow.steps.length) continue;
    const key = executionFingerprint(workflow);
    const canonical = seen.get(key);
    if (canonical) archive(workflow, 'exact_duplicate', canonical.id);
    else seen.set(key, workflow);
  }
  return changed;
}
