import { AlertTriangle } from 'lucide-react';
import type { WorkflowRun } from '../features/workflows/api';
import { useWorkflowText } from '../i18n';
import { QC_WARNING_MESSAGE, unresolvedQcFailures } from '@/shared/workflowQc';

/** Always visible, including inside folded run cards and protected chat content. */
export default function WorkflowQcNotice({ run }: { run: WorkflowRun }) {
  const t = useWorkflowText();
  const issues = (run.steps || []).filter(step => step.qc?.status === 'fail' || step.qc?.status === 'warn');
  if (!issues.length) return null;
  const failed = issues.some(step => step.qc?.status === 'fail');
  const paused = unresolvedQcFailures(run).length > 0;
  return <section role="alert" className={`mx-2 mb-2 rounded-lg border p-3 text-sm text-scholar-100 ${failed ? 'border-red-500/40 bg-red-500/10' : 'border-amber-500/40 bg-amber-500/10'}`} data-testid="workflow-qc-notice">
    <p className="flex items-start gap-2 font-medium" style={{ color: failed ? 'var(--color-danger)' : 'var(--color-warn)' }}><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{t(failed ? '质控未通过：质量不佳，不建议继续下游分析' : '质控警告：请谨慎继续分析')}</span></p>
    <p className="mt-1 leading-relaxed">{t(failed
      ? paused ? '自动推进已暂停。建议先检查质控报告和原始数据，处理未达标项目。' : '已确认继续，但质控仍未通过；下游结果需要谨慎解释。'
      : QC_WARNING_MESSAGE)}</p>
    <div className="mt-2 space-y-2">
      {issues.map(step => <div key={step.n}>
        <p className="font-medium">{t('步骤')} {step.n} · {t(step.title)} · QC {step.qc!.status}</p>
        {Object.keys(step.qc!.metrics || {}).length > 0 && <dl className="mt-1 grid gap-1 sm:grid-cols-2">
          {Object.entries(step.qc!.metrics || {}).slice(0, 20).map(([key, value]) => <div key={key} className="flex flex-wrap gap-x-2 break-all" data-user-content="true"><dt>{key}:</dt><dd>{value}</dd></div>)}
        </dl>}
        {Object.keys(step.qc!.metrics || {}).length > 20 && <p>{t('其余指标请查看质控日志。')}</p>}
        {(step.qcCriteria || []).map((criterion, index) => <p key={index} className="mt-1 break-words">{t('通过标准')} · {t(criterion.metric)}: {t(criterion.pass)}</p>)}
        {step.summary && <p className="mt-1 break-words leading-relaxed" data-user-content="true">{step.summary}</p>}
        {step.qc?.status === 'fail' && step.qcOverride && <p className="mt-1">{t('用户已确认风险；这不代表质控通过。')}</p>}
      </div>)}
    </div>
  </section>;
}
