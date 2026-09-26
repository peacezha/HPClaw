#!/usr/bin/env python3
# HPClaw ENCODE 原生流程确定性报告生成器（v0.4.27）
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


def build_qc_rows(data):
    """汇总 QC 指标表：[(指标, 样本, 数值, 判定符号, css)]，阈值取 ENCODE 常规。"""
    rows = []
    libqc = data['qc'].get('libqc') or {}
    frip = data['qc'].get('frip') or {}
    idr = data['qc'].get('idr') or {}
    spot = {r[0]: r for r in data['spot_tsv']}
    samples = sorted(set(list(libqc.keys()) + list(frip.keys()) + [s for s in spot if not s.startswith('_')]))
    for s in samples:
        entry = libqc.get(s) or {}
        for key, label, ok, warn in [('NSC', 'NSC（链相关）', 1.05, 1.0), ('RSC', 'RSC（链相关）', 0.8, 0.5), ('NRF', 'NRF（库复杂度）', 0.8, 0.6)]:
            if entry.get(key) is not None:
                sym, css = verdict(entry.get(key), ok, warn)
                rows.append((label, s, entry.get(key), sym, css))
        f = (frip.get(s) or {}).get('FRiP')
        if f is None:
            row = next((r for r in data['frip_tsv'] if r[0] == s), None)
            if row and int(row[1]):
                f = round(int(row[2]) / int(row[1]), 4)
        if f is not None:
            sym, css = verdict(f, 0.01, 0.005)
            rows.append(('FRiP（峰内 reads 比例）', s, f, sym, css))
        if s in spot:
            r = spot[s]
            if len(r) >= 3 and int(r[1]):
                v = round(int(r[2]) / int(r[1]), 4)
                sym, css = verdict(v, 0.3, 0.2)
                rows.append(('SPOT（热点内比例）', s, v, sym, css))
    repro = idr.get('_reproducibility') or idr.get('_idr') or {}
    if repro.get('rescue_ratio') is not None:
        sym, css = verdict(repro['rescue_ratio'], 2, 3, higher_better=False)
        rows.append(('IDR rescue ratio（≤2 一致）', '全部重复', repro['rescue_ratio'], sym, css))
    return rows


def render(workflow_name, run_dir, input_dir, data):
    run = data['run']
    steps = run.get('steps') or []
    qc_rows = build_qc_rows(data)
    today = datetime.date.today().isoformat()
    host = socket.gethostname()
    status_label = {'done': '完成', 'failed': '失败', 'running': '运行中', 'waiting_jobs': '后台作业中'}.get(run.get('status'), run.get('status') or '未知')

    peak_items = [(name, count) for name, count, _ in data['peaks'] if count]
    peak_svg = svg_bar_chart(peak_items, '各样本最终峰数')

    figures_html = []
    for fig in data['figures'][:8]:
        b64 = b64_image(fig)
        if b64:
            figures_html.append(f'<figure><img src="{b64}" alt="{os.path.basename(fig)}"/><figcaption>{os.path.basename(fig)}</figcaption></figure>')

    qc_table = ''.join(
        f'<tr><td>{m}</td><td>{s}</td><td>{v}</td><td class="{css}">{sym}</td></tr>'
        for m, s, v, sym, css in qc_rows
    ) or '<tr><td colspan="4">无 QC 数据（qc/*.json 未找到）</td></tr>'

    step_rows = ''.join(
        f'<tr><td>{s.get("n")}</td><td>{s.get("title")}</td><td>{s.get("status")}</td><td>{(s.get("summary") or "")[:120]}</td></tr>'
        for s in steps
    ) or '<tr><td colspan="4">无步骤记录</td></tr>'

    manifest_rows = ''.join(f'<tr><td class="mono">{p}</td><td>{human_size(sz)}</td></tr>' for p, sz in data['manifest'])

    inputs = data['config'].get('inputs') or [input_dir]
    problems = [s for s in steps if s.get('status') in ('failed',)]
    skipped = [s for s in steps if s.get('status') == 'skipped']

    html = f"""<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>{workflow_name} - 分析报告</title>
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
<h1>{workflow_name} · 分析报告</h1>
<p class="meta">生成日期：{today} ｜ 主机：{host} ｜ 运行状态：{status_label}<br/>
运行目录：<span class="mono">{run_dir}</span></p>

<h2>1. 概要</h2>
<p>对输入数据按「{workflow_name}」流程完成分析；共 {len(steps)} 个步骤，
{sum(1 for s in steps if s.get('status') == 'done')} 个完成、{len(problems)} 个失败、{len(skipped)} 个跳过。
{f'检出峰数：' + '、'.join(f'{n}（{c:,}）' for n, c, _ in data['peaks'][:6]) if data['peaks'] else '未找到峰文件。'}</p>

<h2>2. 样本与输入</h2>
<table><tr><th>项目</th><th>内容</th></tr>
<tr><td>输入目录</td><td class="mono">{'<br/>'.join(str(i) for i in inputs)}</td></tr>
<tr><td>FastQC 报告</td><td>{'、'.join(data['fastqc']) if data['fastqc'] else '未找到'}</td></tr>
<tr><td>信号轨迹（bigWig）</td><td>{'、'.join(data['tracks']) if data['tracks'] else '未生成'}</td></tr></table>

<h2>3. 分析流程与步骤状态</h2>
<table><tr><th>#</th><th>步骤</th><th>状态</th><th>摘要</th></tr>{step_rows}</table>

<h2>4. 质控指标</h2>
<table><tr><th>指标</th><th>样本</th><th>结果</th><th>判定</th></tr>{qc_table}</table>
<p class="meta">阈值依据 ENCODE 常规标准：NSC≥1.05 / RSC≥0.8 / NRF≥0.8 / FRiP≥1% / SPOT≥0.3 / IDR rescue ratio≤2。</p>

<h2>5. 关键结果</h2>
{peak_svg}
{''.join(figures_html) if figures_html else '<p class="meta">无图片产物（指纹图/IGV 快照/IDR 图未找到）。</p>'}

<h2>6. 问题与建议</h2>
{('<ul>' + ''.join(f'<li>步骤 {s.get("n")}（{s.get("title")}）失败：{(s.get("error") or s.get("summary") or "")[:150]}</li>' for s in problems) + '</ul>') if problems else '<p>无失败步骤。</p>'}
{('<p>跳过步骤：' + '、'.join(f'{s.get("n")}.{s.get("title")}' for s in skipped) + '</p>') if skipped else ''}

<h2>7. 附录：输出文件清单</h2>
<table><tr><th>文件</th><th>大小</th></tr>{manifest_rows or '<tr><td colspan="2">无</td></tr>'}</table>
<p class="meta">由 encode_native_report.py 确定性生成；数值均来自上述真实文件。</p>
</body></html>"""

    md_lines = [
        f'# {workflow_name} · 分析报告', '',
        f'- 生成日期：{today} ｜ 主机：{host} ｜ 运行状态：{status_label}',
        f'- 运行目录：`{run_dir}`', '',
        '## 质控指标', '',
        '| 指标 | 样本 | 结果 | 判定 |', '|---|---|---|---|',
        *[f'| {m} | {s} | {v} | {sym} |' for m, s, v, sym, _css in qc_rows],
        '', '## 峰数', '',
        *[f'- {n}：{c:,}' for n, c, _ in data['peaks']],
        '', '## 输出文件', '',
        *[f'- `{p}`（{human_size(sz)}）' for p, sz in data['manifest'][:50]],
    ]
    return html, '\n'.join(md_lines)


def main():
    ap = argparse.ArgumentParser(description='HPClaw ENCODE 原生流程确定性报告生成器')
    ap.add_argument('--run-dir', required=True)
    ap.add_argument('--input-dir', default='')
    ap.add_argument('--workflow', default='', help='缺省读取 run.json 的 workflowName')
    ap.add_argument('--report-dir', required=True)
    args = ap.parse_args()

    data = collect(args.run_dir, args.input_dir or args.run_dir)
    workflow_name = args.workflow or (data['run'].get('workflowName') if isinstance(data.get('run'), dict) else '') or 'ENCODE 流程'
    html, md = render(workflow_name, args.run_dir, args.input_dir or args.run_dir, data)
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
        'qcRows': len(build_qc_rows(data)),
    }
    with open(os.path.join(args.report_dir, 'report_summary.json'), 'w', encoding='utf-8') as fh:
        json.dump(summary, fh, indent=2, ensure_ascii=False)
    print('REPORT_OK', summary['report'], 'qcRows=%d' % summary['qcRows'], 'figures=%d' % len(summary['figures']))


if __name__ == '__main__':
    sys.exit(main())
