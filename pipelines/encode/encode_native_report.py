#!/usr/bin/env python3
# HPClaw 染色质流程中英文确定性报告生成器
# 只依赖 Python 标准库：扫描 RUN 目录与输入目录里的真实产物（QC JSON/TSV、
# 峰文件、指纹图、IGV 快照、FastQC 结果、run.json 步骤记录），生成固定结构的
# 图文并茂报告（report.html 自包含 + report.md）。不允许编造：缺什么就写"无数据"。
import argparse
import base64
import datetime
import glob
import json
import os
import socket
import sys


def human_size(n):
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if n < 1024 or unit == 'TB':
            return f'{n:.1f} {unit}' if unit != 'B' else f'{n} B'
        n /= 1024


def read_json(path):
    try:
        with open(path, encoding='utf-8') as fh:
            return json.load(fh)
    except Exception:
        return None


def read_tsv_rows(path):
    rows = []
    try:
        with open(path, encoding='utf-8') as fh:
            for line in fh:
                parts = line.rstrip('\n').split('\t')
                if len(parts) >= 2:
                    rows.append(parts)
    except Exception:
        pass
    return rows


def b64_image(path, max_bytes=8_000_000):
    try:
        if not os.path.isfile(path) or os.path.getsize(path) > max_bytes:
            return None
        with open(path, 'rb') as fh:
            return 'data:image/png;base64,' + base64.b64encode(fh.read()).decode('ascii')
    except Exception:
        return None


def verdict(value, ok, warn, higher_better=True):
    """返回 (符号,  css类)。ok/warn 为阈值。"""
    if value is None:
        return ('—', 'na')
    try:
        v = float(value)
    except (TypeError, ValueError):
        return ('—', 'na')
    if higher_better:
        if v >= ok:
            return ('✅', 'pass')
        if v >= warn:
            return ('⚠️', 'warn')
        return ('❌', 'fail')
    if v <= ok:
        return ('✅', 'pass')
    if v <= warn:
        return ('⚠️', 'warn')
    return ('❌', 'fail')


def svg_bar_chart(items, title):
    """峰值数等简单柱状图：纯 SVG，无需 matplotlib。items=[(label, value)]"""
    if not items:
        return ''
    width, bar_h, gap, left = 640, 22, 8, 150
    vmax = max(v for _, v in items) or 1
    height = 40 + len(items) * (bar_h + gap)
    bars = []
    for i, (label, value) in enumerate(items):
        y = 30 + i * (bar_h + gap)
        w = max(2, int((width - left - 70) * value / vmax))
        short = label if len(label) <= 20 else label[:19] + '…'
        bars.append(
            f'<text x="{left - 8}" y="{y + 15}" text-anchor="end" font-size="12" fill="#334155">{short}</text>'
            f'<rect x="{left}" y="{y}" width="{w}" height="{bar_h}" rx="3" fill="#2563eb"/>'
            f'<text x="{left + w + 6}" y="{y + 15}" font-size="12" fill="#0f172a">{value:,}</text>'
        )
    return (f'<svg viewBox="0 0 {width} {height}" style="max-width:100%" role="img" aria-label="{title}">'
            f'<text x="{left}" y="18" font-size="13" font-weight="600" fill="#0f172a">{title}</text>'
            + ''.join(bars) + '</svg>')


def collect(run_dir, input_dir):
    data = {'qc': {}, 'figures': [], 'peaks': [], 'tracks': [], 'manifest': []}
    run = read_json(os.path.join(run_dir, 'run.json')) or {}
    config = read_json(os.path.join(run_dir, 'config.json')) or {}
    data['run'] = run
    data['config'] = config

    roots = [input_dir, run_dir, os.path.join(run_dir, 'results')]
    seen = set()

    def first(patterns):
        for root in roots:
            for pat in patterns:
                for hit in sorted(glob.glob(os.path.join(root, pat))):
                    if hit not in seen and os.path.isfile(hit):
                        seen.add(hit)
                        return hit
        return None

    def all_hits(patterns):
        out = []
        for root in roots:
            for pat in patterns:
                for hit in sorted(glob.glob(os.path.join(root, pat))):
                    if hit not in seen and os.path.isfile(hit):
                        seen.add(hit)
                        out.append(hit)
        return out

    # QC JSON 们
    for name, pats in {
        'libqc': ['qc/qc.json'],            # NSC/RSC/NRF
        'frip': ['qc/frip_qc.json'],
        'idr': ['qc/idr_qc.json'],
    }.items():
        hit = first(pats)
        if hit:
            data['qc'][name] = read_json(hit) or {}
    data['frip_tsv'] = read_tsv_rows(first(['qc/frip.tsv']) or '/nonexistent')
    data['spot_tsv'] = read_tsv_rows(first(['qc/spot.tsv']) or '/nonexistent')
    data['tss_tsv'] = read_tsv_rows(first(['qc/tss_enrichment.tsv']) or '/nonexistent')
    data['library_verdict'] = read_tsv_rows(first(['qc/library_verdict.tsv']) or '/nonexistent')
    data['dup_metrics'] = all_hits(['qc/*.dup_metrics.txt'])

    # 峰文件与峰数
    for bed in all_hits(['peaks/*.peaks.final.bed', 'peaks/*.peaks.narrowPeak', 'peaks/*.regionPeak', '*.peaks.final.bed']):
        try:
            count = sum(1 for line in open(bed, encoding='utf-8', errors='ignore') if line.strip() and not line.startswith('#'))
        except Exception:
            count = 0
        data['peaks'].append((os.path.basename(bed), count, bed))

    # bigWig 轨迹
    data['tracks'] = [os.path.basename(p) for p in all_hits(['qc/tracks/*.bw', 'qc/tracks/*.bigWig'])]

    # 图：指纹图、IGV 快照、IDR 图
    for fig in all_hits(['qc/fingerprint.png', 'qc/igv/*.png', 'idr/*.png', 'qc/*.png']):
        data['figures'].append(fig)

    # FastQC
    data['fastqc'] = [os.path.basename(p) for p in all_hits(['fastqc_results/*_fastqc.html', 'fastqc/*.html'])]

    # 结果文件清单（附录，限制 200 条）
    manifest = []
    for root in roots:
        for sub in ['qc', 'peaks', 'idr', 'fastqc_results', 'results', 'reports']:
            base = os.path.join(root, sub)
            if not os.path.isdir(base):
                continue
            for dp, _dn, fn in os.walk(base):
                for f in fn:
                    full = os.path.join(dp, f)
                    try:
                        manifest.append((full, os.path.getsize(full)))
                    except OSError:
                        continue
    data['manifest'] = sorted(set(manifest))[:200]
    return data


def build_qc_rows(data, language='zh', assay=''):
    """Return deterministic per-library QC rows using assay-aware thresholds."""
    rows = []
    libqc = data['qc'].get('libqc') or {}
    frip = data['qc'].get('frip') or {}
    idr = data['qc'].get('idr') or {}
    spot = {r[0]: r for r in data['spot_tsv']}
    tss = {r[0]: r for r in data['tss_tsv']}
    samples = sorted(set(list(libqc.keys()) + list(frip.keys()) + [s for s in spot if not s.startswith('_')] + [s for s in tss if not s.startswith('_')]))
    labels = {
        'zh': {
            'NSC': 'NSC（标准化链交叉相关）', 'RSC': 'RSC（相对链交叉相关）',
            'NRF': 'NRF（非重复片段比例）', 'FRiP': 'FRiP（峰区内片段比例）',
            'SPOT': 'SPOT（热点区域信号占比）', 'TSS': 'TSS 富集分数',
            'IDR': 'IDR 恢复比（≤2 为一致）', 'all': '全部重复',
        },
        'en': {
            'NSC': 'NSC (normalized strand cross-correlation)', 'RSC': 'RSC (relative strand cross-correlation)',
            'NRF': 'NRF (non-redundant fraction)', 'FRiP': 'FRiP (fraction of fragments in peaks)',
            'SPOT': 'SPOT (signal portion of tags)', 'TSS': 'TSS enrichment score',
            'IDR': 'IDR rescue ratio (≤2 is consistent)', 'all': 'All replicates',
        },
    }[language]
    frip_ok = 0.2 if assay == 'atac' else (0.05 if assay == 'dap' else 0.01)
    frip_warn = frip_ok / 2
    for s in samples:
        entry = libqc.get(s) or {}
        for key, label, ok, warn in [('NSC', labels['NSC'], 1.05, 1.0), ('RSC', labels['RSC'], 0.8, 0.5), ('NRF', labels['NRF'], 0.8, 0.6)]:
            if entry.get(key) is not None:
                sym, css = verdict(entry.get(key), ok, warn)
                rows.append((label, s, entry.get(key), sym, css))
        f = (frip.get(s) or {}).get('FRiP')
        if f is None:
            row = next((r for r in data['frip_tsv'] if r[0] == s), None)
            if row and int(row[1]):
                f = round(int(row[2]) / int(row[1]), 4)
        if f is not None:
            sym, css = verdict(f, frip_ok, frip_warn)
            rows.append((labels['FRiP'], s, f, sym, css))
        if s in spot:
            r = spot[s]
            if len(r) >= 2:
                v = round(int(r[2]) / int(r[1]), 4) if len(r) >= 3 and int(r[1]) else float(r[1])
                # SPOT is a Hotspot2 diagnostic here. A universal pass threshold is not
                # established for DAP-seq, ChIP-seq, or ATAC-seq, so display it neutrally.
                sym, css = ('●', 'na')
                rows.append((labels['SPOT'], s, v, sym, css))
        if s in tss and len(tss[s]) >= 2:
            v = round(float(tss[s][1]), 4)
            if assay == 'atac':
                sym, css = verdict(v, 6, 4)
            else:
                sym, css = ('●', 'na')
            rows.append((labels['TSS'], s, v, sym, css))
    repro = idr.get('_reproducibility') or idr.get('_idr') or {}
    if repro.get('rescue_ratio') is not None:
        sym, css = verdict(repro['rescue_ratio'], 2, 3, higher_better=False)
        rows.append((labels['IDR'], labels['all'], repro['rescue_ratio'], sym, css))
    return rows


def render(workflow_name, run_dir, input_dir, data, language='zh', assay=''):
    run = data['run']
    steps = run.get('steps') or []
    qc_rows = build_qc_rows(data, language, assay)
    today = datetime.date.today().isoformat()
    host = socket.gethostname()
    text = {
        'zh': {
            'report': '分析与质控报告', 'date': '生成日期', 'host': '主机', 'run_status': '运行状态', 'run_dir': '运行目录',
            'done': '完成', 'failed': '失败', 'running': '运行中', 'waiting_jobs': '后台作业中', 'unknown': '未知',
            'summary': '概要', 'libraries': '文库质控结论', 'sample': '文库', 'verdict': '结论', 'reason': '依据',
            'library_fail': '文库质控失败', 'library_pass': '文库质控通过', 'no_verdict': '未找到文库质控结论文件',
            'inputs': '样本与输入', 'item': '项目', 'content': '内容', 'input_dir': '输入目录', 'fastqc': 'FastQC 报告', 'tracks': '信号轨迹（bigWig）',
            'workflow': '分析流程与步骤状态', 'step': '步骤', 'status': '状态', 'step_summary': '摘要', 'qc': '质控指标', 'metric': '指标', 'result': '结果',
            'key_results': '关键结果', 'issues': '问题与建议', 'outputs': '附录：输出文件清单', 'file': '文件', 'size': '大小',
            'no_steps': '无步骤记录', 'no_figures': '未找到图片产物', 'no_failures': '无失败步骤',
            'step_failed': '步骤失败', 'skipped_steps': '跳过步骤',
        },
        'en': {
            'report': 'Analysis and QC Report', 'date': 'Generated', 'host': 'Host', 'run_status': 'Run status', 'run_dir': 'Run directory',
            'done': 'Completed', 'failed': 'Failed', 'running': 'Running', 'waiting_jobs': 'Cluster jobs running', 'unknown': 'Unknown',
            'summary': 'Summary', 'libraries': 'Library QC conclusions', 'sample': 'Library', 'verdict': 'Conclusion', 'reason': 'Evidence',
            'library_fail': 'Library QC failed', 'library_pass': 'Library QC passed', 'no_verdict': 'No library QC conclusion file was found',
            'inputs': 'Samples and inputs', 'item': 'Item', 'content': 'Content', 'input_dir': 'Input directory', 'fastqc': 'FastQC reports', 'tracks': 'Signal tracks (bigWig)',
            'workflow': 'Workflow and step status', 'step': 'Step', 'status': 'Status', 'step_summary': 'Summary', 'qc': 'Quality-control metrics', 'metric': 'Metric', 'result': 'Result',
            'key_results': 'Key results', 'issues': 'Issues and recommendations', 'outputs': 'Appendix: output files', 'file': 'File', 'size': 'Size',
            'no_steps': 'No step records', 'no_figures': 'No figure outputs found', 'no_failures': 'No failed steps',
            'step_failed': 'Step failed', 'skipped_steps': 'Skipped steps',
        },
    }[language]
    status_label = {key: text[key] for key in ('done', 'failed', 'running', 'waiting_jobs')}.get(run.get('status'), run.get('status') or text['unknown'])

    peak_items = [(name, count) for name, count, _ in data['peaks'] if count]
    peak_svg = svg_bar_chart(peak_items, '各文库最终峰数' if language == 'zh' else 'Final peak count per library')

    figures_html = []
    for fig in data['figures'][:8]:
        b64 = b64_image(fig)
        if b64:
            figures_html.append(f'<figure><img src="{b64}" alt="{os.path.basename(fig)}"/><figcaption>{os.path.basename(fig)}</figcaption></figure>')

    qc_table = ''.join(
        f'<tr><td>{m}</td><td>{s}</td><td>{v}</td><td class="{css}">{sym}</td></tr>'
        for m, s, v, sym, css in qc_rows
    ) or ('<tr><td colspan="4">未找到质控数据</td></tr>' if language == 'zh' else '<tr><td colspan="4">No QC data found</td></tr>')

    step_rows = ''.join(
        f'<tr><td>{s.get("n")}</td><td>{s.get("title")}</td><td>{s.get("status")}</td><td>{(s.get("summary") or "")[:120]}</td></tr>'
        for s in steps
    ) or f'<tr><td colspan="4">{text["no_steps"]}</td></tr>'

    manifest_rows = ''.join(f'<tr><td class="mono">{p}</td><td>{human_size(sz)}</td></tr>' for p, sz in data['manifest'])

    inputs = data['config'].get('inputs') or [input_dir]
    problems = [s for s in steps if s.get('status') in ('failed',)]
    skipped = [s for s in steps if s.get('status') == 'skipped']
    verdict_rows = [row for row in data['library_verdict'] if row and row[0].lower() != 'sample']
    failed_libraries = [row for row in verdict_rows if len(row) >= 2 and row[1].upper() == 'FAILED']
    reason_zh = {
        'FRiP below QC threshold': 'FRiP 低于质控阈值', 'SPOT unavailable': '未产出 SPOT 值',
        'SPOT below QC threshold': 'SPOT 低于质控阈值', 'TSS enrichment unavailable': '未产出 TSS 富集分数与曲线',
        'TSS enrichment below QC threshold': 'TSS 富集分数低于质控阈值', 'NSC below QC threshold': 'NSC 低于质控阈值',
        'RSC below QC threshold': 'RSC 低于质控阈值', 'NRF below QC threshold': 'NRF 低于质控阈值',
        'All required library QC checks passed': '所有必需文库质控指标均达标',
    }
    def localized_reason(row):
        reason = row[2] if len(row) > 2 else ''
        if language != 'zh':
            return reason
        return '；'.join(reason_zh.get(part.strip(), part.strip()) for part in reason.split(';'))
    library_table = ''.join(
        f'<tr><td>{row[0]}</td><td class="{"fail" if row[1].upper() == "FAILED" else "pass"}">'
        f'{text["library_fail"] if row[1].upper() == "FAILED" else text["library_pass"]}</td><td>{localized_reason(row)}</td></tr>'
        for row in verdict_rows
    ) or f'<tr><td colspan="3">{text["no_verdict"]}</td></tr>'
    failure_summary = (
        ''.join(f'{row[0]}：{text["library_fail"]}。' for row in failed_libraries)
        if language == 'zh' else
        ' '.join(f'{row[0]}: {text["library_fail"]}.' for row in failed_libraries)
    )
    figures_block = ''.join(figures_html) if figures_html else f'<p class="meta">{text["no_figures"]}</p>'
    issues_block = (
        '<ul>' + ''.join(
            f'<li>{text["step_failed"]} {s.get("n")} ({s.get("title")}): {(s.get("error") or s.get("summary") or "")[:150]}</li>'
            for s in problems
        ) + '</ul>' if problems else f'<p>{text["no_failures"]}</p>'
    )
    skipped_block = (
        f'<p>{text["skipped_steps"]}: ' + ', '.join(f'{s.get("n")}.{s.get("title")}' for s in skipped) + '</p>'
        if skipped else ''
    )

    threshold_note = (
        'ATAC-seq 采用检测限：TSS 富集分数≥6、FRiP≥0.2；SPOT 和 TSS 曲线必须完整产出。'
        if language == 'zh' and assay == 'atac' else
        'ChIP-seq/DAP-seq 中的 SPOT 和 TSS 富集曲线为 HPClaw 扩展质控；TSS 曲线形态受靶标类型影响，不使用统一 ENCODE 阈值。'
        if language == 'zh' else
        'ATAC-seq detection limits: TSS enrichment ≥6 and FRiP ≥0.2; both the SPOT value and TSS profile must be produced.'
        if assay == 'atac' else
        'SPOT and TSS-enrichment profiles are HPClaw extended QC for ChIP-seq/DAP-seq. TSS profile shape is target-dependent and is not assigned a universal ENCODE cutoff.'
    )

    html = f"""<!DOCTYPE html>
<html lang="{'zh-CN' if language == 'zh' else 'en'}"><head><meta charset="utf-8"><title>{workflow_name} - {text['report']}</title>
<style>
body{{font-family:-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;max-width:960px;margin:0 auto;padding:24px;color:#0f172a;line-height:1.6}}
h1{{font-size:22px;border-bottom:3px solid #2563eb;padding-bottom:8px}}
h2{{font-size:17px;margin-top:28px;border-left:4px solid #2563eb;padding-left:10px}}
table{{border-collapse:collapse;width:100%;font-size:13px;margin:8px 0}}
th,td{{border:1px solid #cbd5e1;padding:6px 10px;text-align:left}}
th{{background:#eff6ff}}
.pass{{color:#059669;font-weight:600}}.warn{{color:#d97706;font-weight:600}}.fail{{color:#dc2626;font-weight:600}}.na{{color:#94a3b8}}
.mono{{font-family:ui-monospace,Consolas,monospace;font-size:11px;word-break:break-all}}
figure{{margin:12px 0;text-align:center}}figure img{{max-width:100%;border:1px solid #e2e8f0;border-radius:6px}}
figcaption{{font-size:12px;color:#64748b;margin-top:4px}}
.meta{{color:#64748b;font-size:13px}}
</style></head><body>
<h1>{workflow_name} · {text['report']}</h1>
<p class="meta">{text['date']}：{today} ｜ {text['host']}：{host} ｜ {text['run_status']}：{status_label}<br/>
{text['run_dir']}：<span class="mono">{run_dir}</span></p>

<h2>1. {text['summary']}</h2>
<p>{(failure_summary if failed_libraries else (text['library_pass'] if verdict_rows else text['no_verdict']))}</p>
<p>{len(steps)} steps; {sum(1 for s in steps if s.get('status') == 'done')} completed, {len(problems)} failed, {len(skipped)} skipped.</p>

<h2>2. {text['libraries']}</h2>
<table><tr><th>{text['sample']}</th><th>{text['verdict']}</th><th>{text['reason']}</th></tr>{library_table}</table>

<h2>3. {text['inputs']}</h2>
<table><tr><th>{text['item']}</th><th>{text['content']}</th></tr>
<tr><td>{text['input_dir']}</td><td class="mono">{'<br/>'.join(str(i) for i in inputs)}</td></tr>
<tr><td>{text['fastqc']}</td><td>{', '.join(data['fastqc']) or '—'}</td></tr>
<tr><td>{text['tracks']}</td><td>{', '.join(data['tracks']) or '—'}</td></tr></table>

<h2>4. {text['workflow']}</h2>
<table><tr><th>#</th><th>{text['step']}</th><th>{text['status']}</th><th>{text['step_summary']}</th></tr>{step_rows}</table>

<h2>5. {text['qc']}</h2>
<table><tr><th>{text['metric']}</th><th>{text['sample']}</th><th>{text['result']}</th><th>{text['verdict']}</th></tr>{qc_table}</table>
<p class="meta">{threshold_note}</p>

<h2>6. {text['key_results']}</h2>
{peak_svg}
{figures_block}

<h2>7. {text['issues']}</h2>
{issues_block}
{skipped_block}

<h2>8. {text['outputs']}</h2>
<table><tr><th>{text['file']}</th><th>{text['size']}</th></tr>{manifest_rows or '<tr><td colspan="2">—</td></tr>'}</table>
<p class="meta">{'encode_native_report.py 确定性生成；所有数值均来自真实产物。' if language == 'zh' else 'Generated deterministically by encode_native_report.py; every value is read from a real output file.'}</p>
</body></html>"""

    md_lines = [
        f'# {workflow_name} · {text["report"]}', '',
        f'- {text["date"]}: {today} | {text["host"]}: {host} | {text["run_status"]}: {status_label}',
        f'- {text["run_dir"]}: `{run_dir}`', '',
        f'## {text["libraries"]}', '',
        *[f'- {row[0]}: **{text["library_fail"] if row[1].upper() == "FAILED" else text["library_pass"]}** — {localized_reason(row)}' for row in verdict_rows],
        '', f'## {text["qc"]}', '',
        f'| {text["metric"]} | {text["sample"]} | {text["result"]} | {text["verdict"]} |', '|---|---|---|---|',
        *[f'| {m} | {s} | {v} | {sym} |' for m, s, v, sym, _css in qc_rows],
        '', f'## {text["key_results"]}', '',
        *[f'- {n}: {c:,}' for n, c, _ in data['peaks']],
        '', f'## {text["outputs"]}', '',
        *[f'- `{p}` ({human_size(sz)})' for p, sz in data['manifest'][:50]],
    ]
    return html, '\n'.join(md_lines)


def main():
    ap = argparse.ArgumentParser(description='HPClaw deterministic bilingual chromatin-workflow report generator')
    ap.add_argument('--run-dir', required=True)
    ap.add_argument('--input-dir', default='')
    ap.add_argument('--workflow', default='', help='缺省读取 run.json 的 workflowName')
    ap.add_argument('--report-dir', required=True)
    ap.add_argument('--language', choices=['zh', 'en'], default='zh')
    ap.add_argument('--assay', choices=['dap', 'chip-tf', 'chip-histone', 'atac'], default='chip-tf')
    args = ap.parse_args()

    data = collect(args.run_dir, args.input_dir or args.run_dir)
    workflow_name = args.workflow or (data['run'].get('workflowName') if isinstance(data.get('run'), dict) else '') or ('ENCODE workflow' if args.language == 'en' else 'ENCODE 流程')
    html, md = render(workflow_name, args.run_dir, args.input_dir or args.run_dir, data, args.language, args.assay)
    os.makedirs(args.report_dir, exist_ok=True)
    with open(os.path.join(args.report_dir, 'report.html'), 'w', encoding='utf-8') as fh:
        fh.write(html)
    with open(os.path.join(args.report_dir, 'report.md'), 'w', encoding='utf-8') as fh:
        fh.write(md)
    summary = {
        'workflow': workflow_name,
        'report': os.path.join(args.report_dir, 'report.html'),
        'figures': [os.path.basename(f) for f in data['figures'][:8]],
        'peaks': {n: c for n, c, _ in data['peaks']},
        'qcRows': len(build_qc_rows(data, args.language, args.assay)),
        'failedLibraries': [row[0] for row in data['library_verdict'][1:] if len(row) >= 2 and row[1].upper() == 'FAILED'],
    }
    with open(os.path.join(args.report_dir, 'report_summary.json'), 'w', encoding='utf-8') as fh:
        json.dump(summary, fh, indent=2, ensure_ascii=False)
    print('REPORT_OK', summary['report'], 'qcRows=%d' % summary['qcRows'], 'figures=%d' % len(summary['figures']))


if __name__ == '__main__':
    sys.exit(main())
