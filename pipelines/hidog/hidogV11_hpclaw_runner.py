#!/usr/bin/env python3
"""Deterministic HPClaw launcher for the two HiDOG V11 workflows."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import sys


EMPTY = {"", "NONE", "AUTO"}
CONTROLLED_EXTRA_FLAGS = {
    "-t", "--type", "-r", "--reference", "-g", "--guide-seq",
    "-i", "--read1", "-I", "--read2", "-b", "--barcode",
    "-T", "--threads", "-o", "--outdir", "--hitom-sequence-xls",
    "--editing-tool", "--nuclease", "--umi-mode", "--target-gene",
    "--prime_editing_pegRNA_spacer_seq",
    "--prime_editing_pegRNA_extension_seq",
    "--prime_editing_pegRNA_scaffold_seq",
    "--prime_editing_nicking_guide_seq",
}


def present(value: str | None) -> bool:
    return str(value or "").strip().upper() not in EMPTY


def enabled(value: str | bool | None) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "on"}


def require_file(value: str, label: str) -> str:
    if not present(value):
        raise ValueError(f"缺少{label}")
    path = Path(value).expanduser()
    if not path.is_file() or path.stat().st_size == 0:
        raise ValueError(f"{label}不存在或为空: {value}")
    return str(path)


def add_value(command: list[str], flag: str, value: str | None) -> None:
    if present(value):
        command.extend([flag, str(value).strip()])


def vector_command(args: argparse.Namespace, hidog: str) -> list[str]:
    anchor = args.anchor.strip().upper()
    if not anchor:
        raise ValueError("缺少载体锚定序列 ANCHOR")
    if not re.fullmatch(r"[ACGTN]+", anchor):
        raise ValueError("ANCHOR 只能包含 A/C/G/T/N")
    command = [
        sys.executable, hidog, "vector-trace",
        "--read1", require_file(args.read1, "R1 FASTQ"),
        "--read2", require_file(args.read2, "R2 FASTQ"),
        "--barcode", require_file(args.barcode, "barcode 文件"),
        "--anchor", anchor,
        "--anchor-read", args.anchor_read,
        "--anchor-max-mismatches", str(args.anchor_max_mismatches),
        "--spacer-side", args.spacer_side,
        "--spacer-length", str(args.spacer_length),
        "--barcode-spacer-length", str(args.barcode_spacer_length),
        "--barcode-length", str(args.barcode_length),
        "--barcode-q30", str(args.barcode_q30),
        "--min-guide-fraction", str(args.min_guide_fraction),
        "--min-sample-anchor-reads", str(args.min_sample_anchor_reads),
        "--output", str(Path(args.run_dir) / "results" / "vt_results"),
    ]
    has_ref = present(args.spacer_ref)
    has_manifest = present(args.guide_manifest)
    if has_ref == has_manifest:
        raise ValueError("SPACER_REF 与 GUIDE_MANIFEST 必须且只能填写一个")
    if has_ref:
        command.extend(["--spacer-ref", require_file(args.spacer_ref, "spacer 参考")])
    else:
        command.extend(["--guide-manifest", require_file(args.guide_manifest, "guide manifest")])
    if enabled(args.allow_reverse_complement):
        command.append("--allow-reverse-complement")
    if not enabled(args.allow_unique_1mm):
        command.append("--no-unique-1mm")
    return command


def amplicon_command(args: argparse.Namespace, hidog: str) -> list[str]:
    reference = Path(args.reference).expanduser()
    if not reference.exists():
        raise ValueError(f"参考序列不存在: {args.reference}")
    command = [
        sys.executable, hidog,
        "--type", args.analysis_type,
        "--reference", str(reference),
        "--editing-tool", args.editing_tool,
        "--threads", str(args.threads),
        "--umi-mode", args.umi_mode,
        "--q30", str(args.q30),
        "--min-genotype-depth", str(args.min_genotype_depth),
        "--low-depth-warning-threshold", str(args.low_depth_warning_threshold),
        "--sample-ratio", str(args.sample_ratio),
        "--sample-seed", str(args.sample_seed),
        "--spacer-length", str(args.spacer_length),
        "--barcode-length", str(args.barcode_length),
        "--bridge-length", str(args.bridge_length),
        "--post-barcode-spacer-length", str(args.post_barcode_spacer_length),
        "--umi-length-r1", str(args.umi_length_r1),
        "--umi-length-r2", str(args.umi_length_r2),
        "--min-umi-base-quality", str(args.min_umi_base_quality),
        "--amplicon-primer-max-mismatches", str(args.amplicon_primer_max_mismatches),
        "--umi-consensus-min-family-size", str(args.umi_consensus_min_family_size),
        "--umi-consensus-min-fraction", str(args.umi_consensus_min_fraction),
        "--min-umi-family-genotype-depth", str(args.min_umi_family_genotype_depth),
        "--min-umi-variant-family-support", str(args.min_umi_variant_family_support),
        "--outdir", str(Path(args.run_dir) / "results" / "hidog_run"),
    ]
    if args.input_mode == "fastq":
        command.extend([
            "--read1", require_file(args.read1, "R1 FASTQ"),
            "--read2", require_file(args.read2, "R2 FASTQ"),
            "--barcode", require_file(args.barcode, "barcode 文件"),
        ])
    else:
        if args.umi_mode != "off":
            raise ValueError("Hi-TOM 输入不支持 dual-primer UMI")
        command.extend(["--hitom-sequence-xls", require_file(args.hitom_xls, "Hi-TOM Sequence.xls")])

    if args.editing_tool == "prime_editor":
        required = {
            "pegRNA spacer": args.pegrna_spacer_seq,
            "pegRNA extension": args.pegrna_extension_seq,
            "pegRNA scaffold": args.pegrna_scaffold_seq,
        }
        missing = [name for name, value in required.items() if not present(value)]
        if missing:
            raise ValueError("Prime Editing 缺少: " + ", ".join(missing))
        command.extend([
            "--prime_editing_pegRNA_spacer_seq", args.pegrna_spacer_seq,
            "--prime_editing_pegRNA_extension_seq", args.pegrna_extension_seq,
            "--prime_editing_pegRNA_scaffold_seq", args.pegrna_scaffold_seq,
        ])
        add_value(command, "--prime_editing_nicking_guide_seq", args.nicking_guide_seq)
    else:
        if not present(args.guide_seq):
            raise ValueError(f"{args.editing_tool} 模式必须填写 GUIDE_SEQ")
        guides = [item for item in re.split(r"[\s,]+", args.guide_seq.strip()) if item]
        command.extend(["--guide-seq", *guides])

    add_value(command, "--target-gene", args.target_gene)
    if args.bwa_profile != "auto":
        command.extend(["--bwa-profile", args.bwa_profile])
    add_value(command, "--min-ratio", args.min_ratio)
    add_value(command, "--quantification-window-size", args.quant_window_size)
    add_value(command, "--quantification-window-center", args.quant_window_center)
    add_value(command, "--quantification-window-coordinates", args.quant_window_coordinates)
    add_value(command, "--cleavage-offset", args.cleavage_offset)
    if present(args.amplicon_primer_tsv):
        if args.umi_mode != "dual-primer":
            raise ValueError("amplicon primer TSV 仅用于 dual-primer UMI")
        command.extend(["--amplicon-primer-tsv", require_file(args.amplicon_primer_tsv, "amplicon primer TSV")])
    if args.umi_mode == "dual-primer" and float(args.sample_ratio) != 1.0:
        raise ValueError("dual-primer UMI 禁止抽样，SAMPLE_RATIO 必须为 1.0")
    if enabled(args.enable_umi_family_analysis):
        if args.umi_mode != "dual-primer":
            raise ValueError("UMI family 分析要求 UMI_MODE=dual-primer")
        command.append("--enable-umi-family-analysis")
    for value, flag in (
        (args.fast_bwa, "--fast-bwa"),
        (args.enable_cas9_nw_rescue, "--enable-cas9-large-indel-nw-rescue"),
        (args.disable_homoeolog_analysis, "--disable-homoeolog-analysis"),
        (args.allow_multiple_guides, "--allow-multiple-guides-per-reference"),
        (args.force_rerun, "--no-resume"),
    ):
        if enabled(value):
            command.append(flag)
    if present(args.extra_args):
        extra = shlex.split(args.extra_args)
        blocked = sorted({item for item in extra if item in CONTROLLED_EXTRA_FLAGS})
        if blocked:
            raise ValueError("EXTRA_ARGS 不能覆盖界面已管理的参数: " + ", ".join(blocked))
        command.extend(extra)
    return command


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="HPClaw launcher for HiDOG V11")
    parser.add_argument("--hidog", required=True)
    parser.add_argument("--run-dir", required=True)
    parser.add_argument("--dry-run", action="store_true")
    sub = parser.add_subparsers(dest="mode", required=True)

    vector = sub.add_parser("vector-trace")
    for name in ("read1", "read2", "barcode", "anchor", "spacer_ref", "guide_manifest"):
        vector.add_argument(f"--{name.replace('_', '-')}", default="NONE")
    vector.add_argument("--anchor-read", choices=("r1", "r2"), default="r1")
    vector.add_argument("--anchor-max-mismatches", type=int, default=0)
    vector.add_argument("--spacer-side", choices=("before", "after"), default="after")
    vector.add_argument("--spacer-length", type=int, default=20)
    vector.add_argument("--barcode-spacer-length", type=int, default=4)
    vector.add_argument("--barcode-length", type=int, default=4)
    vector.add_argument("--barcode-q30", type=int, default=30)
    vector.add_argument("--min-guide-fraction", type=float, default=0.05)
    vector.add_argument("--min-sample-anchor-reads", type=int, default=4000)
    vector.add_argument("--allow-reverse-complement", default="false")
    vector.add_argument("--allow-unique-1mm", default="true")

    amp = sub.add_parser("amplicon")
    amp.add_argument("--input-mode", choices=("fastq", "hitom"), default="fastq")
    for name in (
        "read1", "read2", "barcode", "hitom_xls", "guide_seq", "target_gene",
        "amplicon_primer_tsv", "pegrna_spacer_seq", "pegrna_extension_seq",
        "pegrna_scaffold_seq", "nicking_guide_seq", "extra_args",
    ):
        amp.add_argument(f"--{name.replace('_', '-')}", default="NONE")
    amp.add_argument("--reference", required=True)
    amp.add_argument("--analysis-type", choices=("disjoint", "overlap"), default="disjoint")
    amp.add_argument("--editing-tool", choices=("cas9", "cpf1", "base_editor", "prime_editor", "custom"), default="cas9")
    amp.add_argument("--umi-mode", choices=("off", "dual-primer"), default="off")
    amp.add_argument("--threads", type=int, default=8)
    amp.add_argument("--bwa-profile", choices=("auto", "default", "cas9-sensitive"), default="auto")
    amp.add_argument("--min-ratio", default="AUTO")
    amp.add_argument("--min-genotype-depth", type=int, default=50)
    amp.add_argument("--low-depth-warning-threshold", type=int, default=100)
    amp.add_argument("--q30", type=int, default=30)
    amp.add_argument("--sample-ratio", type=float, default=1.0)
    amp.add_argument("--sample-seed", type=int, default=12345)
    amp.add_argument("--quant-window-size", default="AUTO")
    amp.add_argument("--quant-window-center", default="AUTO")
    amp.add_argument("--quant-window-coordinates", default="AUTO")
    amp.add_argument("--cleavage-offset", default="AUTO")
    amp.add_argument("--spacer-length", type=int, default=4)
    amp.add_argument("--barcode-length", type=int, default=4)
    amp.add_argument("--bridge-length", type=int, default=18)
    amp.add_argument("--post-barcode-spacer-length", type=int, default=1)
    amp.add_argument("--umi-length-r1", type=int, default=8)
    amp.add_argument("--umi-length-r2", type=int, default=8)
    amp.add_argument("--min-umi-base-quality", type=int, default=30)
    amp.add_argument("--amplicon-primer-max-mismatches", type=int, default=1)
    amp.add_argument("--umi-consensus-min-family-size", type=int, default=2)
    amp.add_argument("--umi-consensus-min-fraction", type=float, default=0.8)
    amp.add_argument("--min-umi-family-genotype-depth", type=int, default=50)
    amp.add_argument("--min-umi-variant-family-support", type=int, default=2)
    for flag in (
        "enable_umi_family_analysis", "fast_bwa", "enable_cas9_nw_rescue",
        "disable_homoeolog_analysis", "allow_multiple_guides", "force_rerun",
    ):
        amp.add_argument(f"--{flag.replace('_', '-')}", default="false")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    hidog = str(Path(args.hidog).expanduser().resolve())
    if not Path(hidog).is_file():
        parser.error(f"HiDOG V11 主程序不存在: {hidog}")
    try:
        command = vector_command(args, hidog) if args.mode == "vector-trace" else amplicon_command(args, hidog)
    except ValueError as exc:
        parser.error(str(exc))
    print("$ " + shlex.join(command), flush=True)
    if args.dry_run:
        print(json.dumps(command, ensure_ascii=False))
        return 0
    if args.mode == "vector-trace":
        output = Path(args.run_dir) / "results" / "vt_results"
        expected = (
            output / "spacer_detection.tsv",
            output / "vector_trace_summary.xlsx",
            output / "run_parameters.json",
        )
        if all(path.is_file() and path.stat().st_size > 0 for path in expected):
            print("[resume] 已存在完整 vector-trace 结果，跳过重复计算。", flush=True)
            return 0
    Path(args.run_dir, "results").mkdir(parents=True, exist_ok=True)
    env = dict(os.environ)
    env.update({"PYTHONUNBUFFERED": "1", "MPLBACKEND": "Agg"})
    if args.mode == "amplicon":
        env["HIDOG_SUMMARY_WORKERS"] = str(max(1, args.threads))
    return subprocess.run(command, env=env, check=False).returncode


if __name__ == "__main__":
    raise SystemExit(main())
