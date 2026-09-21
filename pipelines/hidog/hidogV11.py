#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HiDOG V11 主入口脚本。V10.4 基线 + dual-primer UMI family analysis Phase 3-5，
以及独立的 pooled-vector sgRNA tracing。

这份文件只负责做三件事：
1. 解析命令行参数；
2. 检查输入是否合法；
3. 按固定的 8 个步骤串联整个分析流程。

真正的业务逻辑（拆样、窗口计算、同源分型、编辑统计、报表输出）
都放在 hidogV11_packages.py 中。
"""

import argparse
import hashlib
import json
import os
import sys

from hidogV11_packages import (
    derive_library_name,
    prepare_run_root,
    prepare_reference_records,
    prepare_analysis_context,
    load_analysis_context,
    parse_hitom_sequence_table,
    read_fasta_records,
    sanitize_name,
    split_and_qc_by_barcode,
    split_extract_umi_and_qc_by_barcode,
    trim_split_reads_strict,
    prepare_group_combined_references,
    bwa_samtools_pipeline_per_group,
    backfill_umi_families_from_bwa,
    generate_umi_family_consensus,
    bwa_mem_profile_args,
    resolve_bwa_profile,
    cas9_large_indel_nw_rescue_params_from_args,
    summarize_all_references,
    apply_umi_family_variant_support_filter,
    summarize_hitom_table,
    export_results_per_reference,
    export_umi_family_results,
    export_library_reference_qc_report,
    export_hitom_import_qc_report,
    export_html_reports,
    load_barcodes,
)


RESUME_STATE_VERSION = 6
RESUME_STATE_FILENAME = "resume_state.json"


def editing_tool_window_warning(editing_tool):
    return (
        f"WARNING: --editing-tool {editing_tool} determines the default cleavage offset "
        "and quantification window. Choosing the wrong nuclease can misclassify true "
        "editing events as outside-window variation; use explicit window coordinates "
        "when the assay geometry differs from the built-in defaults."
    )


def resolve_read_layout(args):
    """Resolve fixed raw-read coordinates without searching for bridge sequence."""
    if args.umi_mode == "off":
        trim_prefix = (
            args.spacer_length + args.barcode_length + args.bridge_length
            if args.trim_prefix is None
            else args.trim_prefix
        )
        return {
            "barcode_start": args.spacer_length,
            "post_barcode_spacer_start": args.spacer_length + args.barcode_length,
            "bridge_start": args.spacer_length + args.barcode_length,
            "umi_start": None,
            "umi_end_r1": None,
            "umi_end_r2": None,
            "trim_prefix_r1": trim_prefix,
            "trim_prefix_r2": trim_prefix,
        }

    bridge_start = (
        args.spacer_length
        + args.barcode_length
        + args.post_barcode_spacer_length
    )
    umi_start = bridge_start + args.bridge_length
    umi_end_r1 = umi_start + args.umi_length_r1
    umi_end_r2 = umi_start + args.umi_length_r2
    return {
        "barcode_start": args.spacer_length,
        "post_barcode_spacer_start": args.spacer_length + args.barcode_length,
        "bridge_start": bridge_start,
        "umi_start": umi_start,
        "umi_end_r1": umi_end_r1,
        "umi_end_r2": umi_end_r2,
        "trim_prefix_r1": umi_end_r1,
        "trim_prefix_r2": umi_end_r2,
    }


def validate_umi_configuration(args):
    """Validate options whose semantics differ from the V10.4 read-level path."""
    if args.umi_mode == "off":
        if getattr(args, "enable_umi_family_analysis", False):
            raise ValueError("--enable-umi-family-analysis requires --umi-mode dual-primer")
        return
    if args.hitom_sequence_xls:
        raise ValueError("dual-primer UMI mode requires raw paired FASTQ input")
    if args.trim_prefix is not None:
        raise ValueError(
            "--trim-prefix is not accepted in dual-primer UMI mode; V11 derives "
            "UMI and clean-read coordinates from the explicit layout"
        )
    if args.umi_length_r1 <= 0 or args.umi_length_r2 <= 0:
        raise ValueError("R1/R2 UMI lengths must be positive integers")
    if args.barcode_length <= 0 or args.bridge_length <= 0:
        raise ValueError("barcode and bridge lengths must be positive integers")
    if args.bridge_length != 18:
        raise ValueError(
            "V11 Phase 1 supports the validated 18 bp bridge layout only"
        )
    if args.spacer_length < 0 or args.post_barcode_spacer_length < 0:
        raise ValueError("spacer lengths cannot be negative")
    if not 0 <= args.min_umi_base_quality <= 93:
        raise ValueError("--min-umi-base-quality must be between 0 and 93")
    if args.sample_ratio != 1.0:
        raise ValueError(
            "dual-primer UMI mode requires --sample-ratio 1.0 because read-level "
            "subsampling would split UMI families"
        )
    if getattr(args, "amplicon_primer_max_mismatches", 1) < 0:
        raise ValueError("--amplicon-primer-max-mismatches cannot be negative")
    if getattr(args, "enable_umi_family_analysis", False):
        min_family_size = getattr(args, "umi_consensus_min_family_size", 2)
        min_fraction = getattr(args, "umi_consensus_min_fraction", 0.80)
        max_family_reads = getattr(args, "umi_consensus_max_family_reads", 100)
        genotype_depth = getattr(args, "min_umi_family_genotype_depth", 50)
        variant_family_support = getattr(
            args, "min_umi_variant_family_support", 2
        )
        if min_family_size < 2:
            raise ValueError("--umi-consensus-min-family-size must be at least 2")
        if not 0.5 < min_fraction <= 1.0:
            raise ValueError(
                "--umi-consensus-min-fraction must be greater than 0.5 and at most 1.0"
            )
        if max_family_reads < min_family_size:
            raise ValueError(
                "--umi-consensus-max-family-reads must be at least the minimum family size"
            )
        if genotype_depth <= 0:
            raise ValueError("--min-umi-family-genotype-depth must be positive")
        if variant_family_support < 1:
            raise ValueError("--min-umi-variant-family-support must be at least 1")


def run_barcode_split_step(args, run_root, trim_prefix):
    """Dispatch the raw FASTQ split step without changing the V10.4 off path."""
    if args.umi_mode == "dual-primer":
        return split_extract_umi_and_qc_by_barcode(
            read1=args.read1,
            read2=args.read2,
            barcode_file=args.barcode,
            run_root=run_root,
            spacer_len=args.spacer_length,
            barcode_len=args.barcode_length,
            post_barcode_spacer_len=args.post_barcode_spacer_length,
            bridge_len=args.bridge_length,
            umi_len_r1=args.umi_length_r1,
            umi_len_r2=args.umi_length_r2,
            q30_threshold=args.q30,
            min_umi_base_quality=args.min_umi_base_quality,
            amplicon_primer_file=getattr(args, "amplicon_primer_tsv", None),
            amplicon_primer_max_mismatches=getattr(
                args,
                "amplicon_primer_max_mismatches",
                1,
            ),
        )
    return split_and_qc_by_barcode(
        read1=args.read1,
        read2=args.read2,
        barcode_file=args.barcode,
        run_root=run_root,
        spacer_len=args.spacer_length,
        barcode_len=args.barcode_length,
        trim_prefix=trim_prefix,
        q30_threshold=args.q30,
        sample_ratio=args.sample_ratio,
        sample_seed=args.sample_seed,
    )


def parse_args():
    """定义 HiDOG V11 所有命令行参数。"""
    parser = argparse.ArgumentParser(
        description=(
            "HiDOG V11: V10.4 assignment/editing baseline with optional "
            "dual-primer UMI extraction and read-ledger QC"
        )
    )

    parser.add_argument(
        "-t", "--type",
        required=True,
        choices=["disjoint", "overlap"],
        help="Analysis mode: disjoint or overlap"
    )
    parser.add_argument(
        "-r", "--reference",
        required=True,
        nargs="+",
        help="Reference input: one or more FASTA files, or a directory containing FASTA files"
    )
    parser.add_argument(
        "-g", "--guide-seq",
        required=False,
        nargs="+",
        help="sgRNA sequence(s) without PAM, or FASTA file(s) containing guide sequence(s)"
    )
    parser.add_argument(
        "--target-gene",
        default=None,
        help=(
            "Optional gene key such as MKO13_GW2. When supplied, HiDOG extracts "
            "<gene>_A/<gene>_B/<gene>_D from the reference FASTA and <gene> from the guide FASTA."
        )
    )
    parser.add_argument(
        "--editing-tool", "--nuclease",
        dest="editing_tool",
        default="cas9",
        choices=["cas9", "cpf1", "base_editor", "prime_editor", "custom"],
        # 这里的 editing-tool 决定默认切点、默认窗口和后续分类逻辑。
        help=(
            "Editing tool used to infer cleavage offset and quantification-window defaults. "
            "An incorrect nuclease can move real edits outside the window [default: cas9]"
        )
    )
    parser.add_argument(
        "--bwa-profile",
        choices=["default", "cas9-sensitive"],
        default=None,
        help=(
            "BWA-MEM profile. If omitted, Cas9 uses cas9-sensitive and other editing tools use default. "
            "Use --bwa-profile default to keep the V10.2 Cas9 BWA behavior."
        )
    )
    parser.add_argument(
        "--enable-cas9-large-indel-nw-rescue",
        action="store_true",
        default=False,
        help="Enable opt-in Cas9 same-read NW rescue for large in-window DEL/INS evidence [default: disabled]"
    )
    parser.add_argument(
        "--cas9-nw-min-indel-size",
        type=int,
        default=20,
        help="Minimum DEL/INS size for Cas9 NW rescue [default: 20]"
    )
    parser.add_argument(
        "--cas9-nw-max-indel-size",
        type=int,
        default=120,
        help="Maximum DEL/INS size for Cas9 NW rescue [default: 120]"
    )
    parser.add_argument(
        "--cas9-nw-flank-size",
        type=int,
        default=80,
        help="Reference flank size around the editing window for Cas9 NW rescue [default: 80]"
    )
    parser.add_argument(
        "--cas9-nw-min-anchor-length",
        type=int,
        default=15,
        help="Minimum left and right anchor length for Cas9 NW rescue [default: 15]"
    )
    parser.add_argument(
        "--cas9-nw-min-anchor-identity",
        type=float,
        default=0.90,
        help="Minimum combined left/right anchor identity for Cas9 NW rescue [default: 0.90]"
    )
    parser.add_argument(
        "--cas9-nw-min-total-anchor-bases",
        type=int,
        default=35,
        help="Minimum total left+right anchor bases for Cas9 NW rescue [default: 35]"
    )
    parser.add_argument(
        "--cas9-nw-max-mismatches-in-anchors",
        type=int,
        default=3,
        help="Maximum mismatches allowed across Cas9 NW rescue anchors [default: 3]"
    )
    parser.add_argument(
        "--quantification-window-size", "--quantification_window_size",
        default=None,
        help=(
            "Quantification window radius in CRISPResso2 style. The automatic Cpf1 radius "
            "is 10 (about 20 reference positions total); a single value applies to all "
            "references and comma-separated values may be supplied per reference."
        )
    )
    parser.add_argument(
        "--quantification-window-center", "--quantification_window_center",
        default=None,
        help=(
            "Quantification window center / cleavage offset in CRISPResso2 style. "
            "Single value applies to all references; comma-separated values may be supplied per reference."
        )
    )
    parser.add_argument(
        "--quantification-window-coordinates",
        default=None,
        help=(
            "Explicit 0-based quantification window coordinates such as 44-45 or 44-45_70-72. "
            "This overrides automatic tool-based windows."
        )
    )
    parser.add_argument(
        "--cleavage-offset",
        default=None,
        help=(
            "Optional cleavage offset relative to the aligned guide. Single value applies to all references; "
            "comma-separated values may be supplied per reference."
        )
    )
    parser.add_argument(
        "--prime_editing_pegRNA_spacer_seq",
        default=None,
        help="Prime editing pegRNA spacer sequence(s), or FASTA file(s) containing the spacer sequence(s)"
    )
    parser.add_argument(
        "--prime_editing_pegRNA_extension_seq",
        default=None,
        help=(
            "Prime editing pegRNA 3' extension sequence(s) in pegRNA 5'->3' orientation "
            "(RTT+PBS), or FASTA file(s). HiDOG automatically detects whether each reference "
            "is in the pegRNA/NGG orientation or the opposite orientation and constructs the "
            "prime-edited reference in a strand-aware manner. Do not manually reverse-complement "
            "this sequence."
        )
    )
    parser.add_argument(
        "--prime_editing_nicking_guide_seq",
        default=None,
        help="Prime editing nicking guide sequence(s), or FASTA file(s) containing the nicking guide sequence(s)"
    )
    parser.add_argument(
        "--prime_editing_pegRNA_scaffold_seq",
        default=None,
        help=(
            "Prime editing pegRNA scaffold sequence(s) in pegRNA 5'->3' orientation, or FASTA "
            "file(s). HiDOG strand-normalizes scaffold incorporation detection internally."
        )
    )
    parser.add_argument(
        "--prime_editing_pegRNA_scaffold_min_match_length",
        type=int,
        default=8,
        help=(
            "Minimum pegRNA scaffold prefix length required for PE scaffold-incorporation detection "
            "[default: 8]"
        )
    )
    parser.add_argument(
        "--prime_editing_pegRNA_extension_quantification_window_size",
        default="8",
        help=(
            "Prime editing RTT+PBS extension quantification window flank size. "
            "The reverse-complemented RTT+PBS reference span plus this many bp on both sides "
            "defines the PE editing window; single value applies to all references; "
            "comma-separated values may be supplied per reference [default: 8]."
        )
    )
    parser.add_argument(
        "--prime_editing_override_prime_edited_ref_seq",
        default=None,
        help=(
            "Optional complete prime-edited amplicon sequence(s), or FASTA file(s), in the same "
            "orientation as the input reference sequence(s). HiDOG will not rebuild the PE "
            "reference when this is provided, but still uses strand-aware PE context for windows, "
            "scaffold detection, and display coordinates."
        )
    )
    parser.add_argument(
        "--min-identity-score",
        type=float,
        default=85.0,
        help="Minimum outside-window identity score for keeping a read [default: 85.0]. Applied to outside_window_identity; raw identity is stats-only."
    )
    parser.add_argument(
        "--min-aligned-fraction",
        type=float,
        default=90.0,
        help="Aligned fraction threshold for QC stats only — does not filter reads [default: 90.0]"
    )
    parser.add_argument(
        "--exclude-bp-from-left",
        type=int,
        default=15,
        help="Ignore outside-window events within this many bases from the amplicon left edge [default: 15]"
    )
    parser.add_argument(
        "--exclude-bp-from-right",
        type=int,
        default=15,
        help="Ignore outside-window events within this many bases from the amplicon right edge [default: 15]"
    )
    parser.add_argument(
        "--tag-exclusion-radius",
        type=int,
        default=10,
        help="Bases around cut site excluded from variant-tag hard assignment [default: 10]"
    )
    parser.add_argument(
        "--allow-multiple-guides-per-reference",
        action="store_true",
        default=False,
        help=(
            "Allow one reference to use multiple sgRNA records from a FASTA file. "
            "Headers should use <gene>_<sgRNA_name>; Summary exports one in-window "
            "variation column per sgRNA [default: disabled]."
        )
    )
    parser.add_argument(
        "-i", "--read1",
        required=False,
        help="Read1 file, e.g. xxx_R1.fq.gz"
    )
    parser.add_argument(
        "-I", "--read2",
        required=False,
        help="Read2 file, e.g. xxx_R2.fq.gz"
    )
    parser.add_argument(
        "-b", "--barcode",
        required=False,
        help="Barcode file: sample_name barcode_R1 barcode_R2"
    )
    parser.add_argument(
        "--hitom-sequence-xls",
        default=None,
        help=(
            "Hi-TOM Sequence.xls export to import directly. When provided, HiDOG skips "
            "barcode splitting, trimming and BWA, and reuses V7_5 homoeolog/window/genotype output logic."
        )
    )
    parser.add_argument(
        "-T", "--threads",
        type=int,
        default=4,
        help="Threads [default: 4]"
    )
    parser.add_argument(
        "-p", "--min-ratio",
        type=float,
        default=None,
        help=(
            "Minimum allele display frequency threshold in percent of assigned reads. "
            "Defaults to 0.0 with --enable-umi-family-analysis and 5.0 otherwise."
        )
    )
    parser.add_argument(
        "--min-genotype-depth",
        type=int,
        default=50,
        help="Minimum assigned reads required to quantify editing frequency and genotype [default: 50]"
    )
    parser.add_argument(
        "--low-depth-warning-threshold",
        type=int,
        default=100,
        help="Assigned reads below this value are still quantified but marked as low-depth warning [default: 100]"
    )
    parser.add_argument(
        "-o", "--outdir",
        default="results",
        help="Top output directory; target-gene runs write to <outdir>/<library>/<gene> [default: results]"
    )
    parser.add_argument(
        "--spacer-length",
        type=int,
        default=4,
        help="Spacer length before barcode [default: 4]"
    )
    parser.add_argument(
        "--barcode-length",
        type=int,
        default=4,
        help="Barcode length on each read [default: 4]"
    )
    parser.add_argument(
        "--bridge-length",
        type=int,
        default=18,
        help="Bridge length after the optional post-barcode spacer [default: 18]"
    )
    parser.add_argument(
        "--post-barcode-spacer-length",
        type=int,
        default=1,
        help="Spacer length between sample barcode and bridge in dual-primer UMI mode [default: 1]"
    )
    parser.add_argument(
        "--umi-mode",
        choices=["off", "dual-primer"],
        default="off",
        help="UMI processing mode; off preserves the V10.4 read-level path [default: off]"
    )
    parser.add_argument(
        "--umi-length-r1",
        type=int,
        default=8,
        help="R1 UMI length in dual-primer mode [default: 8]"
    )
    parser.add_argument(
        "--umi-length-r2",
        type=int,
        default=8,
        help="R2 UMI length in dual-primer mode [default: 8]"
    )
    parser.add_argument(
        "--min-umi-base-quality",
        type=int,
        default=30,
        help="Minimum Phred quality for every UMI base [default: 30]"
    )
    parser.add_argument(
        "--amplicon-primer-tsv",
        default=None,
        help=(
            "Optional TSV with Amplicon_ID, Forward_Primer and Reverse_Primer; "
            "enables coarse locus assignment and exact terminal-UMI family grouping"
        ),
    )
    parser.add_argument(
        "--amplicon-primer-max-mismatches",
        type=int,
        default=1,
        help="Maximum mismatches allowed independently in each primer anchor [default: 1]",
    )
    parser.add_argument(
        "--enable-umi-family-analysis",
        action="store_true",
        help=(
            "Opt in to high-confidence terminal-UMI-family consensus, separate "
            "family-level editing frequency, and family-level genotype outputs"
        ),
    )
    parser.add_argument(
        "--umi-consensus-min-family-size",
        type=int,
        default=2,
        help="Minimum clean read pairs required for a consensus family [default: 2]",
    )
    parser.add_argument(
        "--umi-consensus-min-fraction",
        type=float,
        default=0.80,
        help="Minimum dominant exact paired haplotype fraction [default: 0.80]",
    )
    parser.add_argument(
        "--umi-consensus-max-family-reads",
        type=int,
        default=100,
        help="Maximum dominant read pairs used to combine consensus quality [default: 100]",
    )
    parser.add_argument(
        "--min-umi-family-genotype-depth",
        type=int,
        default=50,
        help="Minimum assigned consensus families for family genotype calling [default: 50]",
    )
    parser.add_argument(
        "--min-umi-variant-family-support",
        type=int,
        default=2,
        help=(
            "Minimum independent consensus families required for one variant signature; "
            "lower-support variants are excluded from family frequency/genotype but "
            "retained in an audit TSV [default: 2]"
        ),
    )
    parser.add_argument(
        "--trim-prefix",
        type=int,
        default=None,
        help=(
            "Optional manual trim length for --umi-mode off; dual-primer mode "
            "derives coordinates and rejects this option"
        )
    )
    parser.add_argument(
        "--q30",
        type=int,
        default=30,
        help="Barcode region minimum Q score [default: 30]"
    )
    parser.add_argument(
        "--sample-ratio",
        type=float,
        default=1.0,
        # V7.1 新增：用于大数据快速试跑，只对“已经匹配到样本”的 reads 做随机抽样。
        help=(
            "Randomly keep this fraction of matched reads for accelerated exploratory runs; "
            "dual-primer UMI mode requires 1.0 [default: 1.0]"
        )
    )
    parser.add_argument(
        "--sample-seed",
        type=int,
        default=12345,
        # 为了保证抽样结果可复现，固定随机种子。
        help="Random seed used for reproducible read subsampling [default: 12345]"
    )
    parser.add_argument(
        "--fast-bwa",
        action="store_true",
        # V7.1 新增：走轻量比对路径，减少中间 BAM 处理步骤，适合先快速摸底。
        help="Use a lightweight, faster BWA->samtools pipeline that skips extra BAM processing steps"
    )
    parser.add_argument(
        "--disable-homoeolog-analysis",
        action="store_true",
        help="Treat each reference independently and skip homoeolog-aware A/B/D assignment"
    )
    parser.add_argument(
        "--resume",
        dest="resume",
        action="store_true",
        default=True,
        help="Resume from previously completed steps when possible [default: enabled]"
    )
    parser.add_argument(
        "--no-resume",
        dest="resume",
        action="store_false",
        help="Force re-run all steps and ignore existing intermediate outputs"
    )
    parser.add_argument(
        "-v", "--version",
        action="version",
        version="hidogV11 11.0.0-phase5.1"
    )

    args = parser.parse_args()
    if args.min_ratio is None:
        args.min_ratio = 0.0 if args.enable_umi_family_analysis else 5.0
    return args


def normalize_resume_config(args, run_root, read_layout):
    resolved_bwa_profile = resolve_bwa_profile(args.bwa_profile, args.editing_tool)
    cas9_nw_rescue_params = cas9_large_indel_nw_rescue_params_from_args(args)
    return {
        "alignment_pipeline": "group_bwa_v10_3_pair_candidate",
        "summary_pipeline": (
            "qname_ledger_group_bam_v11_umi_phase5_1_variant_support_filter"
            if args.umi_mode == "dual-primer"
            else "qname_ledger_group_bam_v10_4_pe_strand_aware"
        ),
        "prime_editing_strand_aware_reference": True,
        "type": args.type,
        "reference": [os.path.abspath(x) for x in args.reference],
        "guide_seq": list(args.guide_seq or []),
        "target_gene": args.target_gene,
        "editing_tool": args.editing_tool,
        "bwa_profile": resolved_bwa_profile,
        "bwa_mem_profile_args": bwa_mem_profile_args(resolved_bwa_profile),
        "enable_cas9_large_indel_nw_rescue": cas9_nw_rescue_params["enabled"],
        "cas9_nw_min_indel_size": cas9_nw_rescue_params["min_indel_size"],
        "cas9_nw_max_indel_size": cas9_nw_rescue_params["max_indel_size"],
        "cas9_nw_flank_size": cas9_nw_rescue_params["flank_size"],
        "cas9_nw_min_anchor_length": cas9_nw_rescue_params["min_anchor_length"],
        "cas9_nw_min_anchor_identity": cas9_nw_rescue_params["min_anchor_identity"],
        "cas9_nw_min_total_anchor_bases": cas9_nw_rescue_params["min_total_anchor_bases"],
        "cas9_nw_max_mismatches_in_anchors": cas9_nw_rescue_params["max_mismatches_in_anchors"],
        "quantification_window_size": args.quantification_window_size,
        "quantification_window_center": args.quantification_window_center,
        "quantification_window_coordinates": args.quantification_window_coordinates,
        "cleavage_offset": args.cleavage_offset,
        "prime_editing_pegRNA_spacer_seq": args.prime_editing_pegRNA_spacer_seq,
        "prime_editing_pegRNA_extension_seq": args.prime_editing_pegRNA_extension_seq,
        "prime_editing_nicking_guide_seq": args.prime_editing_nicking_guide_seq,
        "prime_editing_pegRNA_scaffold_seq": args.prime_editing_pegRNA_scaffold_seq,
        "prime_editing_pegRNA_scaffold_min_match_length": args.prime_editing_pegRNA_scaffold_min_match_length,
        "prime_editing_pegRNA_extension_quantification_window_size": (
            args.prime_editing_pegRNA_extension_quantification_window_size
            if args.prime_editing_pegRNA_extension_quantification_window_size not in (None, "")
            else "8"
        ),
        "prime_editing_override_prime_edited_ref_seq": args.prime_editing_override_prime_edited_ref_seq,
        "min_identity_score": args.min_identity_score,
        "min_aligned_fraction": args.min_aligned_fraction,
        "exclude_bp_from_left": args.exclude_bp_from_left,
        "exclude_bp_from_right": args.exclude_bp_from_right,
        "tag_exclusion_radius": args.tag_exclusion_radius,
        "allow_multiple_guides_per_reference": args.allow_multiple_guides_per_reference,
        "read1": os.path.abspath(args.read1) if args.read1 else None,
        "read2": os.path.abspath(args.read2) if args.read2 else None,
        "barcode": os.path.abspath(args.barcode) if args.barcode else None,
        "hitom_sequence_xls": os.path.abspath(args.hitom_sequence_xls) if args.hitom_sequence_xls else None,
        "outdir": os.path.abspath(args.outdir),
        "run_root": os.path.abspath(run_root),
        "spacer_length": args.spacer_length,
        "barcode_length": args.barcode_length,
        "post_barcode_spacer_length": args.post_barcode_spacer_length,
        "bridge_length": args.bridge_length,
        "umi_mode": args.umi_mode,
        "umi_length_r1": args.umi_length_r1,
        "umi_length_r2": args.umi_length_r2,
        "min_umi_base_quality": args.min_umi_base_quality,
        "amplicon_primer_tsv": (
            os.path.abspath(args.amplicon_primer_tsv)
            if args.amplicon_primer_tsv
            else None
        ),
        "amplicon_primer_max_mismatches": args.amplicon_primer_max_mismatches,
        "enable_umi_family_analysis": args.enable_umi_family_analysis,
        "umi_consensus_min_family_size": args.umi_consensus_min_family_size,
        "umi_consensus_min_fraction": args.umi_consensus_min_fraction,
        "umi_consensus_max_family_reads": args.umi_consensus_max_family_reads,
        "min_umi_family_genotype_depth": args.min_umi_family_genotype_depth,
        "min_umi_variant_family_support": args.min_umi_variant_family_support,
        "read_layout": dict(read_layout),
        "trim_prefix": read_layout["trim_prefix_r1"],
        "q30": args.q30,
        "sample_ratio": args.sample_ratio,
        "sample_seed": args.sample_seed,
        "fast_bwa": args.fast_bwa,
        "disable_homoeolog_analysis": args.disable_homoeolog_analysis,
        "min_ratio": args.min_ratio,
        "min_genotype_depth": args.min_genotype_depth,
        "low_depth_warning_threshold": args.low_depth_warning_threshold,
    }


def compute_resume_signature(config):
    payload = json.dumps(config, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def resume_state_path(run_root):
    return os.path.join(run_root, RESUME_STATE_FILENAME)


def load_resume_state(run_root):
    path = resume_state_path(run_root)
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def save_resume_state(run_root, state):
    path = resume_state_path(run_root)
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(state, handle, ensure_ascii=False, indent=2)


def build_resume_state(config, signature):
    return {
        "version": RESUME_STATE_VERSION,
        "signature": signature,
        "config": config,
        "completed_steps": {},
    }


def mark_step_completed(state, step_name):
    state.setdefault("completed_steps", {})[step_name] = True


def is_step_completed(state, step_name):
    return bool((state or {}).get("completed_steps", {}).get(step_name))


def split_step_outputs_complete(
    sample_names,
    run_root,
    umi_mode="off",
    amplicon_grouping=False,
):
    qc_report = os.path.join(run_root, "qc_reports", "barcode_qc_report.tsv")
    if not os.path.exists(qc_report):
        return False
    if umi_mode == "dual-primer":
        required_umi_outputs = (
            os.path.join(run_root, "qc_reports", "umi_read_ledger.tsv.gz"),
            os.path.join(run_root, "qc_reports", "umi_extraction_qc.tsv"),
        )
        if not all(os.path.exists(path) for path in required_umi_outputs):
            return False
        if amplicon_grouping:
            family_outputs = (
                os.path.join(run_root, "qc_reports", "umi_family_summary.tsv.gz"),
                os.path.join(run_root, "qc_reports", "umi_family_members.tsv.gz"),
            )
            if not all(os.path.exists(path) for path in family_outputs):
                return False
    split_dir = os.path.join(run_root, "split_raw")
    for sample in sample_names:
        for suffix in ("_1.fq", "_2.fq"):
            if not os.path.exists(os.path.join(split_dir, f"{sample}{suffix}")):
                return False
    return True


def umi_family_analysis_outputs_complete(run_root):
    family_root = os.path.join(run_root, "umi_family_analysis")
    required = (
        os.path.join(family_root, "qc_reports", "umi_consensus_ledger.tsv.gz"),
        os.path.join(family_root, "qc_reports", "umi_consensus_qc.tsv"),
        os.path.join(family_root, "umi_family_results", "umi_family_stats.tsv"),
        os.path.join(family_root, "umi_family_results", "umi_family_genotypes.tsv"),
    )
    return all(os.path.isfile(path) and os.path.getsize(path) > 0 for path in required)


def check_inputs(args):
    """检查输入文件和编辑工具相关参数是否完整。"""
    try:
        validate_umi_configuration(args)
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(2)

    if args.hitom_sequence_xls:
        if not os.path.exists(args.hitom_sequence_xls):
            print(f"Error: file not found: {args.hitom_sequence_xls}", file=sys.stderr)
            sys.exit(2)
    else:
        missing_raw = [name for name in ("read1", "read2", "barcode") if not getattr(args, name)]
        if missing_raw:
            print(
                "Error: raw FASTQ mode requires: " + ", ".join(f"--{name}" for name in missing_raw),
                file=sys.stderr,
            )
            sys.exit(2)

    for path in [args.read1, args.read2, args.barcode]:
        if not path:
            continue
        if not os.path.exists(path):
            print(f"Error: file not found: {path}", file=sys.stderr)
            sys.exit(2)
    if args.amplicon_primer_tsv:
        if args.umi_mode != "dual-primer":
            print(
                "Error: --amplicon-primer-tsv requires --umi-mode dual-primer",
                file=sys.stderr,
            )
            sys.exit(2)
        if not os.path.exists(args.amplicon_primer_tsv):
            print(
                f"Error: file not found: {args.amplicon_primer_tsv}",
                file=sys.stderr,
            )
            sys.exit(2)

    if args.editing_tool == "prime_editor":
        if args.allow_multiple_guides_per_reference:
            print(
                "Error: --allow-multiple-guides-per-reference is not supported for prime_editor mode",
                file=sys.stderr,
            )
            sys.exit(2)
        required_prime = [
            "prime_editing_pegRNA_spacer_seq",
            "prime_editing_pegRNA_extension_seq",
            "prime_editing_pegRNA_scaffold_seq",
        ]
        missing = [name for name in required_prime if not getattr(args, name)]
        if missing:
            print(
                "Error: prime_editor requires: " + ", ".join(f"--{name}" for name in missing),
                file=sys.stderr,
            )
            sys.exit(2)
    elif not args.guide_seq:
        print("Error: --guide-seq is required for this editing tool", file=sys.stderr)
        sys.exit(2)

    extra_inputs = []
    for attr in (
        "prime_editing_pegRNA_spacer_seq",
        "prime_editing_pegRNA_extension_seq",
        "prime_editing_nicking_guide_seq",
        "prime_editing_pegRNA_scaffold_seq",
        "prime_editing_override_prime_edited_ref_seq",
    ):
        value = getattr(args, attr)
        if value:
            extra_inputs.append(value)

    guide_inputs = args.guide_seq or []
    for item in args.reference + guide_inputs + extra_inputs:
        if os.path.exists(item):
            continue
        if set(item.upper()) <= set("ACGTUN,"):
            continue
        print(f"Error: reference/guide input not found: {item}", file=sys.stderr)
        sys.exit(2)


def iter_fasta_input_paths(inputs):
    paths = []
    for item in inputs:
        if os.path.isdir(item):
            for name in sorted(os.listdir(item)):
                if name.lower().endswith((".fa", ".fasta", ".fna")):
                    paths.append(os.path.join(item, name))
        else:
            paths.append(item)
    return paths


def resolve_target_gene_inputs(args, run_root):
    if not args.target_gene:
        return args.reference, args.guide_seq

    gene = args.target_gene.strip().replace("-", "_")
    wanted_refs = [f"{gene}_A", f"{gene}_B", f"{gene}_D"]
    ref_by_name = {}
    for path in iter_fasta_input_paths(args.reference):
        if os.path.exists(path):
            for name, seq in read_fasta_records(path):
                ref_by_name[name] = seq
    missing_refs = [name for name in wanted_refs if name not in ref_by_name]
    if missing_refs:
        raise SystemExit("Error: target gene references not found: " + ", ".join(missing_refs))

    guide_inputs = args.guide_seq or []
    guide_records = []
    guide_seq = None
    guide_name = None
    for item in guide_inputs:
        if os.path.exists(item):
            for name, seq in read_fasta_records(item):
                guide_gene = name.split("_", 1)[0]
                if args.allow_multiple_guides_per_reference and guide_gene == gene:
                    guide_records.append((name, seq))
                elif name == gene or guide_gene == gene:
                    guide_seq = seq
                    guide_name = name
                    break
        elif set(item.upper()) <= set("ACGTUN,"):
            guide_seq = item
        if guide_seq:
            break
    if args.allow_multiple_guides_per_reference and guide_records:
        guide_seq = None
    if not guide_seq and not guide_records:
        raise SystemExit(f"Error: target gene guide not found: {gene}")

    target_dir = os.path.join(run_root, "target_gene_inputs")
    os.makedirs(target_dir, exist_ok=True)
    safe_gene = sanitize_name(gene)
    ref_path = os.path.join(target_dir, f"ref_{safe_gene}.fa")
    guide_path = os.path.join(target_dir, f"sgRNA_{safe_gene}.fa")

    with open(ref_path, "w", encoding="utf-8") as handle:
        for name in wanted_refs:
            handle.write(f">{name}\n")
            seq = ref_by_name[name]
            for idx in range(0, len(seq), 80):
                handle.write(seq[idx:idx + 80] + "\n")

    with open(guide_path, "w", encoding="utf-8") as handle:
        if guide_records:
            for name, seq in guide_records:
                handle.write(f">{name}\n{seq}\n")
        else:
            handle.write(f">{guide_name or gene}\n{guide_seq}\n")

    return [ref_path], [guide_path]


def run_umi_family_analysis(
    args,
    run_root,
    sample_names,
    reference_records,
    group_combined_references,
    analysis_context,
    bwa_profile,
    cas9_nw_rescue_params,
):
    """Run the opt-in high-confidence terminal-UMI-family analysis branch."""
    generated = generate_umi_family_consensus(
        run_root=run_root,
        sample_names=sample_names,
        min_family_size=args.umi_consensus_min_family_size,
        min_consensus_fraction=args.umi_consensus_min_fraction,
        max_family_reads=args.umi_consensus_max_family_reads,
    )
    if generated.get("consensus_power_status") == "LOW_CONSENSUS_YIELD":
        print(
            "WARNING: " + generated.get("consensus_power_warning", "Low consensus yield"),
            file=sys.stderr,
        )
    family_run_root = generated["family_run_root"]
    eligible_samples = generated["eligible_samples"]
    if eligible_samples:
        bwa_samtools_pipeline_per_group(
            mode=args.type,
            group_combined_references=group_combined_references,
            sample_names=eligible_samples,
            threads=args.threads,
            run_root=family_run_root,
            resume=False,
            bwa_profile=bwa_profile,
        )
        family_results = summarize_all_references(
            reference_records=reference_records,
            sample_names=eligible_samples,
            run_root=family_run_root,
            min_ratio=args.min_ratio,
            mode=args.type,
            analysis_context=analysis_context,
            min_identity_score=args.min_identity_score,
            min_aligned_fraction=args.min_aligned_fraction,
            min_genotype_depth=args.min_umi_family_genotype_depth,
            low_depth_warning_threshold=args.low_depth_warning_threshold,
            cas9_nw_rescue_params=cas9_nw_rescue_params,
        )
    else:
        family_results = {
            "references": {
                ref["name"]: {
                    "reference": ref,
                    "group_model": analysis_context["group_models"][
                        analysis_context["ref_contexts"][ref["name"]]["group_name"]
                    ],
                    "samples": {},
                }
                for ref in reference_records
            },
            "sample_names": [],
            "analysis_context": analysis_context,
        }
    apply_umi_family_variant_support_filter(
        family_results,
        min_variant_families=args.min_umi_variant_family_support,
        min_ratio=args.min_ratio,
    )
    output_dir = export_umi_family_results(
        results_bundle=family_results,
        family_run_root=family_run_root,
    )
    generated["results_bundle"] = family_results
    generated["output_dir"] = output_dir
    return generated


def main():
    """分派载体追踪子命令，或按固定流程执行一次完整基因型分析。"""
    if len(sys.argv) > 1 and sys.argv[1] == "vector-trace":
        from hidogV11_vector_trace import vector_trace_main

        return vector_trace_main(sys.argv[2:])
    args = parse_args()
    check_inputs(args)

    run_input = args.hitom_sequence_xls if args.hitom_sequence_xls else args.read1
    library_name = derive_library_name(run_input)
    target_gene_name = sanitize_name(args.target_gene.strip().replace("-", "_")) if args.target_gene else None
    run_root = prepare_run_root(run_input, args.outdir, target_gene=args.target_gene)
    os.makedirs(run_root, exist_ok=True)
    resolved_reference, resolved_guide_seq = resolve_target_gene_inputs(args, run_root)

    read_layout = resolve_read_layout(args)
    trim_prefix = read_layout["trim_prefix_r1"]

    config = normalize_resume_config(args, run_root, read_layout)
    effective_bwa_profile = config["bwa_profile"]
    cas9_nw_rescue_params = cas9_large_indel_nw_rescue_params_from_args(args)
    signature = compute_resume_signature(config)
    state = load_resume_state(run_root)
    resume_enabled = args.resume
    if resume_enabled:
        if state is None:
            state = build_resume_state(config, signature)
        elif state.get("version") != RESUME_STATE_VERSION or state.get("signature") != signature:
            print("\n[resume] Existing resume state does not match current parameters; re-running from scratch.")
            state = build_resume_state(config, signature)
            resume_enabled = False
        else:
            print("\n[resume] Matching resume state detected; completed steps will be reused when possible.")
    else:
        state = build_resume_state(config, signature)
        print("\n[resume] Disabled by --no-resume; all steps will be re-run.")
    save_resume_state(run_root, state)

    print(f"\nRun root: {os.path.abspath(run_root)}")
    print(f"Spacer length : {args.spacer_length}")
    print(f"Barcode length: {args.barcode_length}")
    print(f"Post-barcode spacer length: {args.post_barcode_spacer_length}")
    print(f"Bridge length : {args.bridge_length}")
    print(f"UMI mode      : {args.umi_mode}")
    if args.umi_mode == "dual-primer":
        print(f"UMI interval R1: [{read_layout['umi_start']}, {read_layout['umi_end_r1']})")
        print(f"UMI interval R2: [{read_layout['umi_start']}, {read_layout['umi_end_r2']})")
        print(f"Clean read R1 starts at: {read_layout['trim_prefix_r1']}")
        print(f"Clean read R2 starts at: {read_layout['trim_prefix_r2']}")
        print(f"Amplicon primer TSV: {args.amplicon_primer_tsv or 'not requested'}")
        if args.amplicon_primer_tsv:
            print(
                "UMI grouping unit: terminal UMI family "
                "(not an original DNA molecule)"
            )
    else:
        print(f"Trim prefix   : {trim_prefix}")
    print(f"Editing tool  : {args.editing_tool}")
    print(editing_tool_window_warning(args.editing_tool), file=sys.stderr)
    print(f"Min allele display ratio: {args.min_ratio}%")
    print(f"Min genotype depth: {args.min_genotype_depth}")
    if args.enable_umi_family_analysis:
        print(
            "Min independent UMI families per variant: "
            f"{args.min_umi_variant_family_support}"
        )
    print(f"Low-depth warning: <{args.low_depth_warning_threshold} assigned reads")
    print(f"Sample ratio  : {args.sample_ratio}")
    print(f"Fast BWA mode : {args.fast_bwa}")
    print(f"BWA profile   : {effective_bwa_profile}")
    print(f"Cas9 NW rescue: {'enabled' if cas9_nw_rescue_params['enabled'] else 'disabled'}")
    print(f"Homoeolog mode: {'disabled' if args.disable_homoeolog_analysis else 'enabled'}")
    print(f"Resume mode   : {resume_enabled}")

    # 下面 8 步分别对应：参考整理 -> 编辑上下文构建 -> 拆样 -> trim ->
    # 比对 -> 编辑统计 -> 结果导出 -> QC/HTML 导出。
    print("\n[1/8] Preparing reference records ...")
    reference_records = prepare_reference_records(resolved_reference, run_root)
    print(f"Detected reference count: {len(reference_records)}")
    mark_step_completed(state, "prepare_reference_records")
    save_resume_state(run_root, state)

    print("\n[2/8] Building guide, cut-site and homoeolog context ...")
    analysis_context_path = os.path.join(run_root, "analysis_context.json")
    if resume_enabled and is_step_completed(state, "prepare_analysis_context") and os.path.exists(analysis_context_path):
        print("[resume] Reusing existing analysis_context.json")
        analysis_context = load_analysis_context(run_root, reference_records=reference_records)
    else:
        analysis_context = prepare_analysis_context(
            reference_records=reference_records,
            guide_inputs=resolved_guide_seq,
            editing_tool=args.editing_tool,
            quant_window_size=args.quantification_window_size,
            quant_window_center=args.quantification_window_center,
            quant_window_coordinates=args.quantification_window_coordinates,
            cleavage_offset=args.cleavage_offset,
            prime_peg_spacer_inputs=args.prime_editing_pegRNA_spacer_seq,
            prime_peg_extension_inputs=args.prime_editing_pegRNA_extension_seq,
            prime_nicking_guide_inputs=args.prime_editing_nicking_guide_seq,
            prime_scaffold_inputs=args.prime_editing_pegRNA_scaffold_seq,
            prime_scaffold_min_match_length=args.prime_editing_pegRNA_scaffold_min_match_length,
            prime_extension_window_size=args.prime_editing_pegRNA_extension_quantification_window_size,
            prime_override_ref_inputs=args.prime_editing_override_prime_edited_ref_seq,
            exclude_left=args.exclude_bp_from_left,
            exclude_right=args.exclude_bp_from_right,
            disable_homoeolog_analysis=args.disable_homoeolog_analysis,
            tag_exclusion_radius=args.tag_exclusion_radius,
            allow_multiple_guides_per_reference=args.allow_multiple_guides_per_reference,
            run_root=run_root,
        )
        mark_step_completed(state, "prepare_analysis_context")
        save_resume_state(run_root, state)

    group_combined_references = prepare_group_combined_references(
        reference_records=reference_records,
        group_models=analysis_context["group_models"],
        run_root=run_root,
    )

    if args.hitom_sequence_xls:
        print("\n[3/6] Importing Hi-TOM Sequence.xls rows ...")
        hitom_rows_by_sample = parse_hitom_sequence_table(args.hitom_sequence_xls)
        sample_names = sorted(hitom_rows_by_sample)
        print(f"Detected sample count: {len(sample_names)}")
        print(f"Input allele rows: {sum(len(rows) for rows in hitom_rows_by_sample.values())}")

        print("\n[4/6] Summarizing imported Hi-TOM alleles with HiDOG V10.4 logic ...")
        results_bundle = summarize_hitom_table(
            reference_records=reference_records,
            hitom_rows_by_sample=hitom_rows_by_sample,
            run_root=run_root,
            min_ratio=args.min_ratio,
            analysis_context=analysis_context,
            min_identity_score=args.min_identity_score,
            min_aligned_fraction=args.min_aligned_fraction,
            min_genotype_depth=args.min_genotype_depth,
            low_depth_warning_threshold=args.low_depth_warning_threshold,
        )
        results_bundle["library_name"] = library_name
        results_bundle["target_gene"] = target_gene_name

        print("\n[5/6] Exporting Excel/TSV and allele details ...")
        export_results_per_reference(
            results_bundle=results_bundle,
            run_root=run_root
        )

        print("\n[6/6] Exporting Hi-TOM import QC, plots and HTML reports ...")
        export_hitom_import_qc_report(
            results_bundle=results_bundle,
            run_root=run_root
        )
        export_html_reports(
            results_bundle=results_bundle,
            run_root=run_root
        )

        print("\nAll done.")
        print(f"Main output folder: {os.path.abspath(run_root)}")
        print(f"Per-reference Excel files are under: {os.path.abspath(os.path.join(run_root, f'{sanitize_name(library_name)}_summary_by_reference'))}")
        print(f"Allele detail files are under: {os.path.abspath(os.path.join(run_root, 'allele_details'))}")
        print(f"HTML reports are under: {os.path.abspath(os.path.join(run_root, 'html_reports'))}")
        return

    print("\n[3/8] Barcode split + QC ...")
    _, sample_names = load_barcodes(args.barcode)
    if (
        resume_enabled
        and is_step_completed(state, "split_and_qc_by_barcode")
        and split_step_outputs_complete(
            sample_names,
            run_root,
            umi_mode=args.umi_mode,
            amplicon_grouping=bool(args.amplicon_primer_tsv),
        )
    ):
        print("[resume] Reusing existing split_raw/ and barcode/UMI QC outputs")
    else:
        _, sample_names = run_barcode_split_step(args, run_root, trim_prefix)
        mark_step_completed(state, "split_and_qc_by_barcode")
        save_resume_state(run_root, state)
    print(f"Detected sample count: {len(sample_names)}")

    print("\n[4/8] Strict trimming on split reads ...")
    trim_split_reads_strict(
        sample_names=sample_names,
        run_root=run_root,
        threads=args.threads,
        resume=resume_enabled,
    )
    mark_step_completed(state, "trim_split_reads_strict")
    save_resume_state(run_root, state)

    print("\n[5/8] BWA-MEM + SAMtools group-level pipeline ...")
    bwa_samtools_pipeline_per_group(
        mode=args.type,
        group_combined_references=group_combined_references,
        sample_names=sample_names,
        threads=args.threads,
        run_root=run_root,
        resume=resume_enabled,
        bwa_profile=effective_bwa_profile,
    )
    mark_step_completed(state, "bwa_samtools_pipeline_per_group_v10_3")
    save_resume_state(run_root, state)

    if args.umi_mode == "dual-primer":
        print("\n[5b/8] Backfilling terminal UMI families from BWA target groups ...")
        family_ledger_paths = (
            os.path.join(run_root, "qc_reports", "umi_family_summary.tsv.gz"),
            os.path.join(run_root, "qc_reports", "umi_family_members.tsv.gz"),
        )
        if (
            resume_enabled
            and is_step_completed(state, "backfill_umi_families_from_bwa_v11_phase2_1")
            and all(os.path.isfile(path) and os.path.getsize(path) > 0 for path in family_ledger_paths)
        ):
            print("[resume] Reusing existing BWA target-group UMI family ledgers")
        else:
            backfill_stats = backfill_umi_families_from_bwa(
                run_root=run_root,
                sample_names=sample_names,
                group_names=group_combined_references.keys(),
            )
            print(
                "BWA group backfill: "
                f"assigned={backfill_stats['assigned_bwa_group']}, "
                f"ambiguous={backfill_stats['ambiguous_bwa_group']}, "
                f"terminal families={backfill_stats['terminal_umi_families']}"
            )
            mark_step_completed(state, "backfill_umi_families_from_bwa_v11_phase2_1")
            save_resume_state(run_root, state)

    print("\n[6/8] Summarizing edits with CRISPResso-like logic ...")
    results_bundle = summarize_all_references(
        reference_records=reference_records,
        sample_names=sample_names,
        run_root=run_root,
        min_ratio=args.min_ratio,
        mode=args.type,
        analysis_context=analysis_context,
        min_identity_score=args.min_identity_score,
        min_aligned_fraction=args.min_aligned_fraction,
        min_genotype_depth=args.min_genotype_depth,
        low_depth_warning_threshold=args.low_depth_warning_threshold,
        cas9_nw_rescue_params=cas9_nw_rescue_params,
    )
    results_bundle["library_name"] = library_name
    results_bundle["target_gene"] = target_gene_name
    mark_step_completed(state, "summarize_all_references")
    save_resume_state(run_root, state)

    print("\n[7/8] Exporting Excel/TSV and allele details ...")
    export_results_per_reference(
        results_bundle=results_bundle,
        run_root=run_root
    )
    mark_step_completed(state, "export_results_per_reference")
    save_resume_state(run_root, state)

    print("\n[8/8] Exporting QC, plots and HTML reports ...")
    export_library_reference_qc_report(
        reference_records=reference_records,
        sample_names=sample_names,
        run_root=run_root
    )
    export_html_reports(
        results_bundle=results_bundle,
        run_root=run_root
    )
    mark_step_completed(state, "export_reports")
    save_resume_state(run_root, state)

    if args.enable_umi_family_analysis:
        if (
            resume_enabled
            and is_step_completed(state, "umi_family_analysis_v11_phase5")
            and umi_family_analysis_outputs_complete(run_root)
        ):
            print("\n[9-11/11] [resume] Reusing completed UMI-family analysis outputs")
        else:
            print("\n[9/11] Calling high-confidence terminal-UMI-family consensus ...")
            family_analysis = run_umi_family_analysis(
                args=args,
                run_root=run_root,
                sample_names=sample_names,
                reference_records=reference_records,
                group_combined_references=group_combined_references,
                analysis_context=analysis_context,
                bwa_profile=effective_bwa_profile,
                cas9_nw_rescue_params=cas9_nw_rescue_params,
            )
            print(
                "[10/11] Consensus-family BWA and assignment completed for "
                f"{len(family_analysis['eligible_samples'])} sample(s)."
            )
            print(f"[11/11] UMI-family results: {family_analysis['output_dir']}")
            mark_step_completed(state, "umi_family_analysis_v11_phase5")
            save_resume_state(run_root, state)

    print("\nAll done.")
    print(f"Main output folder: {os.path.abspath(run_root)}")
    print(f"Per-reference Excel files are under: {os.path.abspath(os.path.join(run_root, f'{sanitize_name(library_name)}_summary_by_reference'))}")
    print(f"Allele detail files are under: {os.path.abspath(os.path.join(run_root, 'allele_details'))}")
    print(f"HTML reports are under: {os.path.abspath(os.path.join(run_root, 'html_reports'))}")


if __name__ == "__main__":
    main()
