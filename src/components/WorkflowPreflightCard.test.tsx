// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import WorkflowPreflightCard, { type WorkflowPreflightCardProps } from './WorkflowPreflightCard';
import type { Workflow } from '@/shared/workflow';
import type { PreflightRunIssue, PreflightRunReport } from '@/shared/flowManifest';

afterEach(cleanup);

function makeWorkflow(): Workflow {
  return {
    id: 'wf-test',
    name: '测试流程',
    description: '',
    keywords: [],
    params: [{ name: 'KALLISTO_INDEX', label: 'Kallisto 索引' }],
    steps: [
      { title: '质控', command: 'fastqc {{INPUT_DIR}}' },
      { title: '定量', command: 'kallisto quant -i {{KALLISTO_INDEX}}', params: [{ name: 'BOOTSTRAP', label: 'bootstrap 次数' }] },
    ],
    manifest: {
      software: [{ name: 'FastQC', module: 'FastQC/0.11.9', required: true }],
      references: [{ name: '索引', path: '{{KALLISTO_INDEX}}', type: 'index', required: true }],
      qcGates: [],
    },
    source: 'user',
    createdAt: 0,
    updatedAt: 0,
  };
}

function makeReport(issues: PreflightRunIssue[]): PreflightRunReport {
  return { ok: issues.every(i => i.severity !== 'blocker'), issues, preflight: null };
}

function renderCard(report: PreflightRunReport, overrides: Partial<WorkflowPreflightCardProps> = {}) {
  const props: WorkflowPreflightCardProps = {
    workflow: makeWorkflow(),
    report,
    paramValues: {},
    stepValues: {},
    refOverrides: {},
    inputs: [],
    onParamChange: vi.fn(),
    onStepParamChange: vi.fn(),
    onReferenceChange: vi.fn(),
    onInputChange: vi.fn(),
    onProvision: vi.fn(),
    onRecheck: vi.fn(),
    onRunAnyway: vi.fn(),
    onCancel: vi.fn(),
    busy: false,
    ...overrides,
  };
  render(<WorkflowPreflightCard {...props} />);
  return props;
}

describe('WorkflowPreflightCard 分组渲染', () => {
  it('按"必须解决/建议处理"分组并显示计数', () => {
    renderCard(makeReport([
      { kind: 'software', name: 'FastQC', label: 'FastQC', message: 'module 不可用', severity: 'blocker' },
      { kind: 'reference', name: '可选库', label: '可选库', message: '待用户指定路径', severity: 'warn' },
    ]));
    expect(screen.getByText('启动前整体检查')).toBeInTheDocument();
    expect(screen.getByText('必须解决')).toBeInTheDocument();
    expect(screen.getByText('建议处理')).toBeInTheDocument();
    expect(screen.getByText('1 必须解决')).toBeInTheDocument();
    expect(screen.getByText('1 建议处理')).toBeInTheDocument();
    expect(screen.getByText('FastQC')).toBeInTheDocument();
    expect(screen.getByText(/module 不可用/)).toBeInTheDocument();
  });

  it('有 blocker 时"仍然开始运行"禁用；只有警告时可用', () => {
    const withBlocker = renderCard(makeReport([
      { kind: 'input', name: '/data/missing', label: '/data/missing', message: '输入数据路径在集群上不存在', severity: 'blocker' },
    ]));
    expect(screen.getByText('仍然开始运行').closest('button')).toBeDisabled();
    expect(withBlocker.onRunAnyway).not.toHaveBeenCalled();
    cleanup();

    const onlyWarn = renderCard(makeReport([
      { kind: 'placeholder', step: 2, name: 'UNDECLARED', label: '定量', message: '步骤脚本有未解析占位符', severity: 'warn' },
    ]));
    const runAnyway = screen.getByText('仍然开始运行').closest('button')!;
    expect(runAnyway).not.toBeDisabled();
    fireEvent.click(runAnyway);
    expect(onlyWarn.onRunAnyway).toHaveBeenCalledTimes(1);
  });

  it('步骤级问题显示步骤序号', () => {
    renderCard(makeReport([
      { kind: 'param', step: 2, name: 'BOOTSTRAP', label: 'bootstrap 次数', message: '必填参数未填写', severity: 'blocker' },
    ]));
    expect(screen.getByText('步骤 2')).toBeInTheDocument();
  });
});

describe('WorkflowPreflightCard 内联解答', () => {
  it('参数问题内联输入写回 paramValues（全局）与 stepValues（步骤级）', () => {
    const props = renderCard(makeReport([
      { kind: 'param', name: 'KALLISTO_INDEX', label: 'Kallisto 索引', message: '必填参数未填写', severity: 'blocker' },
      { kind: 'param', step: 2, name: 'BOOTSTRAP', label: 'bootstrap 次数', message: '必填参数未填写', severity: 'blocker' },
    ]));
    fireEvent.change(screen.getByLabelText('参数:Kallisto 索引'), { target: { value: '/refs/k.idx' } });
    expect(props.onParamChange).toHaveBeenCalledWith('KALLISTO_INDEX', '/refs/k.idx');
    fireEvent.change(screen.getByLabelText('参数:bootstrap 次数'), { target: { value: '100' } });
    expect(props.onStepParamChange).toHaveBeenCalledWith(2, 'BOOTSTRAP', '100');
  });

  it('路径类问题（参考数据/输入数据）给路径输入', () => {
    const props = renderCard(makeReport([
      { kind: 'reference', name: '索引', label: '索引', message: '待用户指定路径（KALLISTO_INDEX 未提供）', severity: 'blocker' },
      { kind: 'input', name: '/data/missing', label: '/data/missing', message: '输入数据路径在集群上不存在', severity: 'blocker' },
    ]), { inputs: ['/data/missing'] });
    fireEvent.change(screen.getByLabelText('参考数据:索引'), { target: { value: '/refs/custom' } });
    expect(props.onReferenceChange).toHaveBeenCalledWith('索引', '/refs/custom');
    fireEvent.change(screen.getByLabelText('输入数据:1'), { target: { value: '/data/fixed' } });
    expect(props.onInputChange).toHaveBeenCalledWith(0, '/data/fixed');
  });

  it('占位符问题命中全局参数/步骤参数时给对应输入框', () => {
    const props = renderCard(makeReport([
      { kind: 'placeholder', step: 2, name: 'KALLISTO_INDEX', label: '定量', message: '步骤脚本有未解析占位符：KALLISTO_INDEX', severity: 'warn' },
    ]));
    fireEvent.change(screen.getByLabelText('占位符:KALLISTO_INDEX'), { target: { value: '/refs/k.idx' } });
    expect(props.onParamChange).toHaveBeenCalledWith('KALLISTO_INDEX', '/refs/k.idx');
    cleanup();

    const stepProps = renderCard(makeReport([
      { kind: 'placeholder', step: 2, name: 'BOOTSTRAP', label: '定量', message: '步骤脚本有未解析占位符：BOOTSTRAP', severity: 'warn' },
    ]));
    fireEvent.change(screen.getByLabelText('占位符:BOOTSTRAP'), { target: { value: '50' } });
    expect(stepProps.onStepParamChange).toHaveBeenCalledWith(2, 'BOOTSTRAP', '50');
  });

  it('软件问题提供"让 AI 补齐"入口，走 provision 通道', () => {
    const props = renderCard(makeReport([
      { kind: 'software', name: 'FastQC', label: 'FastQC', message: 'module 不可用', severity: 'blocker' },
    ]));
    fireEvent.click(screen.getByText('让 AI 补齐'));
    expect(props.onProvision).toHaveBeenCalledWith('software', 'FastQC', 'module 不可用');
  });
});

describe('WorkflowPreflightCard 操作', () => {
  it('"全部解决后重新检查"触发重检，"取消"退出', () => {
    const props = renderCard(makeReport([
      { kind: 'placeholder', step: 2, name: 'BOOTSTRAP', label: '定量', message: '未解析', severity: 'warn' },
    ]));
    fireEvent.click(screen.getByText('全部解决后重新检查'));
    expect(props.onRecheck).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('取消'));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('busy 时重检按钮禁用', () => {
    renderCard(makeReport([
      { kind: 'placeholder', step: 2, name: 'BOOTSTRAP', label: '定量', message: '未解析', severity: 'warn' },
    ]), { busy: true });
    expect(screen.getByText('全部解决后重新检查').closest('button')).toBeDisabled();
  });
});
