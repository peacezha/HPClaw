#!/usr/bin/env python3
"""Create deterministic HPClaw QC summaries from HiDOG V11 outputs.

The workflow runner executes this helper after the V11 CLI.  It deliberately
uses only the Python standard library so report generation does not add another
cluster dependency.
"""

from __future__ import annotations

import argparse
import csv
import html
import json
import os
from pathlib import Path
from typing import Any


def read_tsv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8", errors="replace", newline="") as handle:
        return list(csv.DictReader(handle, delimiter="\t"))


def as_int(value: Any) -> int:
    try:
        return int(float(str(value).strip()))
    except (TypeError, ValueError):
        return 0


def as_float(value: Any) -> float | None:
    try:
        return float(str(value).strip().rstrip("%"))
    except (TypeError, ValueError):
        return None


def load_json(path: Path) -> dict[str, Any]:
    try:
        with path.open("r", encoding="utf-8") as handle:
            value = json.load(handle)
        return value if isinstance(value, dict) else {}
    except (OSError, json.JSONDecodeError):
        return {}


def file_manifest(root: Path) -> list[dict[str, Any]]:
    files: list[dict[str, Any]] = []
    for path in sorted(root.rglob("*")):
        if path.is_file():
            files.append({"path": path.relative_to(root).as_posix(), "size": path.stat().st_size})
    return files


def vector_summary(input_dir: Path) -> dict[str, Any]:
    detection = input_dir / "spacer_detection.tsv"
    workbook = input_dir / "vector_trace_summary.xlsx"
    if not detection.is_file() or not workbook.is_file():
        missing = [str(path.name) for path in (detection, workbook) if not path.is_file()]
        raise RuntimeError("vector-trace 缺少必需结果: " + ", ".join(missing))

    rows = read_tsv(detection)
    by_sample: dict[str, dict[str, Any]] = {}
    for row in rows:
        sample = str(row.get("sample_id", "")).strip()
        if not sample:
            continue
        entry = by_sample.setdefault(sample, {
            "sample_id": sample,
            "sample_status": row.get("sample_status", ""),
            "anchor_matched_pairs": as_int(row.get("anchor_matched_pairs")),
            "extracted_spacer_reads": as_int(row.get("extracted_spacer_reads")),
            "no_sgrna_reason": row.get("no_sgrna_reason", ""),
            "positive_spacers": [],
        })
        if row.get("call") == "PRESENT":
            fraction = as_float(row.get("spacer_fraction"))
            entry["positive_spacers"].append({
                "id": row.get("spacer_id", ""),
                "fraction": fraction,
                "exact_reads": as_int(row.get("exact_reads")),
            })

    samples = [by_sample[key] for key in sorted(by_sample)]
    if not samples:
        raise RuntimeError("spacer_detection.tsv 中没有可识别的样本")
    detected = sum(1 for row in samples if row["sample_status"] == "SGRNA_DETECTED")
    low_anchor = sum(1 for row in samples if row["no_sgrna_reason"] == "LOW_ANCHOR_READS")
    no_target = sum(
        1 for row in samples
        if row["no_sgrna_reason"] == "NO_SPACER_ABOVE_THRESHOLD"
    )
    status = "pass" if detected == len(samples) else "warn"
    run_parameters = load_json(input_dir / "run_parameters.json")
    return {
        "mode": "vector-trace",
        "status": status,
        "metrics": {
            "sample_count": len(samples),
            "sgrna_detected_samples": detected,
            "low_anchor_samples": low_anchor,
            "no_target_samples": no_target,
            **(run_parameters.get("run_metrics") or {}),
        },
        "samples": samples,
        "parameters": run_parameters.get("parameters") or {},
        "files": file_manifest(input_dir),
    }


def find_summary_dir(input_dir: Path) -> Path | None:
    candidates = sorted(
        path for path in input_dir.rglob("*_summary_by_reference") if path.is_dir()
    )
    return candidates[0] if candidates else None


def amplicon_summary(input_dir: Path) -> dict[str, Any]:
    summary_dir = find_summary_dir(input_dir)
    if summary_dir is None:
        raise RuntimeError("未找到 HiDOG 的 *_summary_by_reference 结果目录")

    resume = load_json(input_dir / "resume_state.json")
    config = resume.get("config") if isinstance(resume.get("config"), dict) else {}
    min_depth = as_int(config.get("min_genotype_depth") or 50)
    warning_depth = as_int(config.get("low_depth_warning_threshold") or 100)
    result_rows: list[dict[str, Any]] = []
    for stats_path in sorted(summary_dir.glob("*.stats.tsv")):
        if stats_path.name.endswith(".hard_plus_rescued.stats.tsv"):
            continue
        reference = stats_path.name[: -len(".stats.tsv")]
        for row in read_tsv(stats_path):
            assigned = as_int(row.get("Assigned reads"))
            frequency = as_float(row.get("Editing frequency"))
            result_rows.append({
                "reference": reference,
                "sample": row.get("Sample", ""),
                "assigned_reads": assigned,
                "editing_frequency": frequency,
                "frequency_support": row.get("Editing frequency support", ""),
                "modified_reads": as_int(row.get("Modified reads")),
                "wildtype_reads": as_int(row.get("Wildtype reads")),
                "depth_status": "fail" if assigned < min_depth else ("warn" if assigned < warning_depth else "pass"),
            })
    if not result_rows:
        raise RuntimeError("HiDOG stats 结果为空")

    failed = sum(1 for row in result_rows if row["depth_status"] == "fail" or row["editing_frequency"] is None)
    warned = sum(1 for row in result_rows if row["depth_status"] == "warn")
    status = "fail" if failed else ("warn" if warned else "pass")
    return {
        "mode": "amplicon",
        "status": status,
        "metrics": {
            "result_rows": len(result_rows),
            "references": len({row["reference"] for row in result_rows}),
            "samples": len({row["sample"] for row in result_rows}),
            "failed_or_unquantified_rows": failed,
            "low_depth_warning_rows": warned,
            "min_genotype_depth": min_depth,
            "low_depth_warning_threshold": warning_depth,
        },
        "results": result_rows,
        "files": file_manifest(input_dir),
    }


def markdown_report(summary: dict[str, Any], input_dir: Path) -> str:
    lines = [
        "# HiDOG V11 分析报告",
        "",
        f"- 模式：`{summary['mode']}`",
        f"- QC：`{summary['status'].upper()}`",
        f"- 结果目录：`{input_dir}`",
        "",
        "## 关键指标",
        "",
        "| 指标 | 值 |",
        "|---|---:|",
    ]
    for key, value in summary["metrics"].items():
        lines.append(f"| {key} | {value} |")
    lines.extend(["", "## 样本结果", ""])
    if summary["mode"] == "vector-trace":
        lines.extend([
            "| 样本 | 状态 | 锚定 reads | spacer reads | 检出 sgRNA | 原因 |",
            "|---|---|---:|---:|---|---|",
        ])
        for row in summary["samples"]:
            guides = ", ".join(item["id"] for item in row["positive_spacers"]) or "-"
            lines.append(
                f"| {row['sample_id']} | {row['sample_status']} | {row['anchor_matched_pairs']} | "
                f"{row['extracted_spacer_reads']} | {guides} | {row['no_sgrna_reason'] or '-'} |"
            )
    else:
        lines.extend([
            "| 参考 | 样本 | Assigned reads | 编辑频率 (%) | 深度 QC |",
            "|---|---|---:|---:|---|",
        ])
        for row in summary["results"]:
            frequency = "NA" if row["editing_frequency"] is None else f"{row['editing_frequency']:.2f}"
            lines.append(
                f"| {row['reference']} | {row['sample']} | {row['assigned_reads']} | "
                f"{frequency} | {row['depth_status']} |"
            )
    lines.extend(["", "## 产物", ""])
    for item in summary["files"]:
        lines.append(f"- `{item['path']}` ({item['size']} bytes)")
    return "\n".join(lines) + "\n"


def write_outputs(summary: dict[str, Any], input_dir: Path, report_dir: Path) -> None:
    report_dir.mkdir(parents=True, exist_ok=True)
    markdown = markdown_report(summary, input_dir)
    (report_dir / "report.md").write_text(markdown, encoding="utf-8")
    (report_dir / "qc_summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (report_dir / "report.html").write_text(
        "<!doctype html><html><head><meta charset='utf-8'><title>HiDOG V11 report</title>"
        "<style>body{font-family:system-ui,sans-serif;max-width:1200px;margin:32px auto;padding:0 24px;}"
        "pre{white-space:pre-wrap;line-height:1.55;background:#f6f8fa;padding:20px;border-radius:8px;}</style>"
        f"</head><body><pre>{html.escape(markdown)}</pre></body></html>",
        encoding="utf-8",
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Summarize HiDOG V11 outputs for HPClaw")
    parser.add_argument("--mode", choices=("vector-trace", "amplicon"), required=True)
    parser.add_argument("--input-dir", required=True)
    parser.add_argument("--report-dir", required=True)
    args = parser.parse_args()
    input_dir = Path(args.input_dir).expanduser().resolve()
    if not input_dir.is_dir():
        parser.error(f"结果目录不存在: {input_dir}")
    summary = vector_summary(input_dir) if args.mode == "vector-trace" else amplicon_summary(input_dir)
    write_outputs(summary, input_dir, Path(args.report_dir).expanduser().resolve())
    print(json.dumps({"status": summary["status"], "report_dir": args.report_dir}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
