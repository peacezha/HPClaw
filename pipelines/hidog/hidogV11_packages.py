#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HiDOG V11 核心功能库。V10.4 基线 + dual-primer UMI family Phase 3-5。

Key V11 Phase 2 changes:
- fixed-layout dual 8 bp UMI extraction before prefix trimming
- raw read -> UMI evidence ledger and extraction QC
- UMI removal before the inherited V10.4 read-level BWA/assignment path
- optional primer-pair amplicon pre-assignment before A/B/D assignment
- unique paired BWA target-group backfill for primer-unassigned reads
- exact sample + amplicon + terminal UMI pair family grouping
- opt-in exact paired-haplotype consensus for terminal UMI families
- separate UMI-family editing-frequency and genotype outputs

Key V10.4 changes:
- Candidate-reference intersection with contextual SNP outlier validation.
- Safe DEL/INS evidence participates only behind conservative assignment gates.

Inherited V10.3 changes:
- Cas9 defaults to a sensitive BWA-MEM profile for large indels near windows.
- Optional Cas9 NW rescue can convert same-read closed large DEL/INS evidence
  into standard in-window events after qname-ledger assignment.

Key V10.2 changes:
- group-level BWA keeps low-MAPQ/secondary evidence, but Summary/Flat require
  paired R1/R2 candidates for the final reference
- pair-incomplete qnames are tracked in assignment_rescue_qc.tsv and do not
  enter assigned-read or allele rows

Inherited V10 changes:
- CRISPResso2-style Prime-edited reference construction
- read-vs-reference global scoring for prime-edited allele classification
- expected-position scaffold incorporation detection
- PE efficiency / precision / scaffold residual metrics in Stats

Inherited V8.6 changes:
- outside_window_identity replaces raw identity as hard filter
- aligned_fraction is stats-only (no longer a hard filter)
- full_aligned / relaxed_aligned two-tier homoeolog assignment
- Soft clip exclusion pipeline -> insertion_candidate
- window_insertion_candidate contributes to edited reads
"""

import gzip
import csv
import hashlib
import heapq
import json
import os
import random
import re
import sqlite3
import subprocess
import concurrent.futures
import multiprocessing
import tempfile
from copy import deepcopy
from collections import defaultdict, Counter

try:
    import pysam
except ImportError:
    pysam = None

try:
    from openpyxl import Workbook, load_workbook
    OPENPYXL_AVAILABLE = True
except ImportError:
    OPENPYXL_AVAILABLE = False

try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False

MIN_GENOTYPE_DEPTH = 50
LOW_DEPTH_WARNING_THRESHOLD = 100
DNA_BASES = set("ACGT")
HOMOEOLOG_KMER_SIZE = 21

# V8.6: soft-clip exclusion pipeline constants
KNOWN_ADAPTERS = [
    "CTGTCTCTTATACACATCTGACGCTGCCGACGA",   # Trans1_rc, 33 bp
    "CTGTCTCTTATACACATCTCCGAGCCCACGAGAC",  # Trans2_rc, 34 bp
]

KNOWN_BRIDGE = [
    "GGAGTGAGTACGGTGTGC",  # P5 end, 18 bp
    "CCATCCAGCATCCAACTC",  # P7 end, 18 bp
]

# V11 dual-primer UMI extraction uses the bridge sequences as they are read in
# raw R1/R2 FASTQ, before alignment-orientation normalization.
UMI_RAW_BRIDGE_R1 = "GGAGTGAGTACGGTGTGC"
UMI_RAW_BRIDGE_R2 = "GAGTTGGATGCTGGATGG"

MIN_CLIP_LENGTH = 2
MIN_CLIP_QUALITY = 20
POLY_FRACTION_THRESHOLD = 0.80
LOW_COMPLEXITY_MIN_LENGTH = 8
SHANNON_ENTROPY_THRESHOLD = 1.0
HOMOPOLYMER_RUN_THRESHOLD = 8
DINUCLEOTIDE_REPEAT_CYCLES = 6
ADAPTER_MIN_OVERLAP = 8
ADAPTER_OVERLAP_IDENTITY = 0.90

MIN_OUTSIDE_WINDOW_IDENTITY = 85.0
PRIME_SCAFFOLD_MIN_MATCH_LENGTH = 8
PRIME_SCAFFOLD_INTERNAL_MIN_MATCH_LENGTH = 12
PRIME_SCAFFOLD_ANCHOR_SLOP = 3
PRIME_ALIGNMENT_SCORE_MARGIN = 1
BWA_PROFILE_DEFAULT = "default"
BWA_PROFILE_CAS9_SENSITIVE = "cas9-sensitive"
BWA_PROFILES = {BWA_PROFILE_DEFAULT, BWA_PROFILE_CAS9_SENSITIVE}
CAS9_SENSITIVE_BWA_MEM_ARGS = [
    "-k", "15",
    "-L", "16,16",
    "-O", "3,3",
    "-E", "1,1",
    "-w", "250",
    "-d", "250",
    "-T", "30",
]

CAS9_NW_RESCUE_DEFAULTS = {
    "enabled": False,
    "min_indel_size": 20,
    "max_indel_size": 120,
    "flank_size": 80,
    "min_anchor_length": 15,
    "min_anchor_identity": 0.90,
    "min_total_anchor_bases": 35,
    "max_mismatches_in_anchors": 3,
    "min_outside_window_identity": MIN_OUTSIDE_WINDOW_IDENTITY,
}


def resolve_bwa_profile(requested_profile, editing_tool):
    if requested_profile in (None, ""):
        return BWA_PROFILE_CAS9_SENSITIVE if editing_tool == "cas9" else BWA_PROFILE_DEFAULT
    if requested_profile not in BWA_PROFILES:
        raise ValueError(f"Unknown BWA profile: {requested_profile}")
    return requested_profile


def bwa_mem_profile_args(profile):
    if profile == BWA_PROFILE_DEFAULT:
        return []
    if profile == BWA_PROFILE_CAS9_SENSITIVE:
        return list(CAS9_SENSITIVE_BWA_MEM_ARGS)
    raise ValueError(f"Unknown BWA profile: {profile}")


def default_cas9_large_indel_nw_rescue_params(**overrides):
    params = dict(CAS9_NW_RESCUE_DEFAULTS)
    params.update(overrides)
    return params


def cas9_large_indel_nw_rescue_params_from_args(args):
    return default_cas9_large_indel_nw_rescue_params(
        enabled=bool(getattr(args, "enable_cas9_large_indel_nw_rescue", False)),
        min_indel_size=int(getattr(args, "cas9_nw_min_indel_size", CAS9_NW_RESCUE_DEFAULTS["min_indel_size"])),
        max_indel_size=int(getattr(args, "cas9_nw_max_indel_size", CAS9_NW_RESCUE_DEFAULTS["max_indel_size"])),
        flank_size=int(getattr(args, "cas9_nw_flank_size", CAS9_NW_RESCUE_DEFAULTS["flank_size"])),
        min_anchor_length=int(getattr(args, "cas9_nw_min_anchor_length", CAS9_NW_RESCUE_DEFAULTS["min_anchor_length"])),
        min_anchor_identity=float(getattr(args, "cas9_nw_min_anchor_identity", CAS9_NW_RESCUE_DEFAULTS["min_anchor_identity"])),
        min_total_anchor_bases=int(getattr(args, "cas9_nw_min_total_anchor_bases", CAS9_NW_RESCUE_DEFAULTS["min_total_anchor_bases"])),
        max_mismatches_in_anchors=int(getattr(args, "cas9_nw_max_mismatches_in_anchors", CAS9_NW_RESCUE_DEFAULTS["max_mismatches_in_anchors"])),
    )


def sanitize_name(name: str) -> str:
    keep = []
    for ch in name:
        if ch.isalnum() or ch in ("_", "-", "."):
            keep.append(ch)
        else:
            keep.append("_")
    return "".join(keep)


def is_number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def read_fasta_records(path):
    records = []
    with open(path, "r", encoding="utf-8") as handle:
        header = None
        chunks = []
        for raw_line in handle:
            line = raw_line.strip()
            if not line:
                continue
            if line.startswith(">"):
                if header is not None:
                    records.append((header, "".join(chunks).upper()))
                header = line[1:].strip().split()[0]
                chunks = []
            else:
                chunks.append(line)
        if header is not None:
            records.append((header, "".join(chunks).upper()))
    return records


def reverse_complement(seq):
    table = str.maketrans("ACGTUNacgtun", "TGCAANtgcaan")
    return seq.translate(table)[::-1]


def derive_group_name(ref_name):
    upper = ref_name.upper()
    for suffix in ("_A", "_B", "_D"):
        if upper.endswith(suffix):
            return ref_name[:-2]
    return ref_name


def is_homoeolog_reference_name(ref_name):
    upper = ref_name.upper()
    return upper.endswith("_A") or upper.endswith("_B") or upper.endswith("_D")


def derive_library_name(input_path: str) -> str:
    base = os.path.basename(input_path)

    for suffix in (
        "_R1.fq.gz", "_R2.fq.gz", "_1.fq.gz", "_2.fq.gz",
        "_R1.fastq.gz", "_R2.fastq.gz", "_1.fastq.gz", "_2.fastq.gz",
        ".fq.gz", ".fastq.gz", ".fq", ".fastq",
    ):
        if base.endswith(suffix):
            prefix = base[:-len(suffix)]
            break
    else:
        prefix = os.path.splitext(base)[0]

    return sanitize_name(prefix)


def normalize_target_gene_name(target_gene):
    if not target_gene:
        return None
    return sanitize_name(str(target_gene).strip().replace("-", "_"))


def prepare_run_root(read1_path: str, outdir: str, target_gene=None) -> str:
    library_name = derive_library_name(read1_path)
    gene_name = normalize_target_gene_name(target_gene)
    if gene_name:
        return os.path.join(outdir, library_name, gene_name)
    return os.path.join(outdir, library_name)


def run_cmd(cmd, shell=False):
    if shell:
        subprocess.run(cmd, shell=True, check=True, executable="/bin/bash")
    else:
        subprocess.run(cmd, check=True)


def file_exists_and_nonempty(path):
    return os.path.exists(path) and os.path.getsize(path) > 0


def bam_index_is_current(bam_path, bai_path):
    if not (file_exists_and_nonempty(bam_path) and file_exists_and_nonempty(bai_path)):
        return False
    return os.path.getmtime(bai_path) >= os.path.getmtime(bam_path)


def choose_parallelism(total_threads, preferred_task_threads=2):
    total_threads = max(1, int(total_threads))
    task_threads = max(1, min(preferred_task_threads, total_threads))
    max_workers = max(1, total_threads // task_threads)
    return max_workers, task_threads


def load_barcodes(barcode_file):
    barcode_map = {}
    sample_names = []

    with open(barcode_file, "r", encoding="utf-8") as f:
        for line_no, line in enumerate(f, start=1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue

            parts = line.split()
            if len(parts) < 3:
                raise ValueError(
                    f"Barcode file line {line_no} should have >= 3 columns: sample_name barcode_R1 barcode_R2"
                )

            sample_name, bc1, bc2 = parts[0], parts[1], parts[2]
            key = bc1 + bc2

            if key in barcode_map:
                raise ValueError(f"Duplicated barcode pair at line {line_no}: {bc1} {bc2}")

            barcode_map[key] = sample_name
            sample_names.append(sample_name)

    return barcode_map, sample_names


def load_amplicon_primer_definitions(path):
    """Load read-orientation primer pairs used only for coarse amplicon assignment."""
    required = ("Amplicon_ID", "Forward_Primer", "Reverse_Primer")
    definitions = []
    seen_ids = set()
    seen_pairs = set()
    with open(path, "r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        if reader.fieldnames is None or any(field not in reader.fieldnames for field in required):
            raise ValueError(
                "Amplicon primer TSV requires columns: " + ", ".join(required)
            )
        for line_no, row in enumerate(reader, start=2):
            amplicon_id = (row.get("Amplicon_ID") or "").strip()
            forward_primer = (row.get("Forward_Primer") or "").strip().upper()
            reverse_primer = (row.get("Reverse_Primer") or "").strip().upper()
            if not amplicon_id or not forward_primer or not reverse_primer:
                raise ValueError(f"Incomplete amplicon primer definition at line {line_no}")
            if set(forward_primer + reverse_primer) - DNA_BASES:
                raise ValueError(f"Non-ACGT primer base at line {line_no}")
            pair = (forward_primer, reverse_primer)
            if amplicon_id in seen_ids:
                raise ValueError(f"Duplicated Amplicon_ID at line {line_no}: {amplicon_id}")
            if pair in seen_pairs:
                raise ValueError(f"Duplicated primer pair at line {line_no}: {amplicon_id}")
            definitions.append(
                {
                    "amplicon_id": amplicon_id,
                    "forward_primer": forward_primer,
                    "reverse_primer": reverse_primer,
                }
            )
            seen_ids.add(amplicon_id)
            seen_pairs.add(pair)
    if not definitions:
        raise ValueError("Amplicon primer TSV contains no definitions")
    return definitions


def assign_amplicon_by_primer_pair(
    read1_sequence,
    read2_sequence,
    definitions,
    max_mismatches=1,
):
    """Assign a locus by the unique best R1/R2 primer pair, not by A/B/D tags."""
    if max_mismatches < 0:
        raise ValueError("max_mismatches cannot be negative")
    read1_sequence = read1_sequence.upper()
    read2_sequence = read2_sequence.upper()
    candidates = []
    for definition in definitions:
        primer_r1 = definition["forward_primer"]
        primer_r2 = definition["reverse_primer"]
        if len(read1_sequence) < len(primer_r1) or len(read2_sequence) < len(primer_r2):
            continue
        mismatches_r1 = sum(
            observed != expected
            for observed, expected in zip(read1_sequence[:len(primer_r1)], primer_r1)
        )
        mismatches_r2 = sum(
            observed != expected
            for observed, expected in zip(read2_sequence[:len(primer_r2)], primer_r2)
        )
        if mismatches_r1 <= max_mismatches and mismatches_r2 <= max_mismatches:
            candidates.append(
                (
                    mismatches_r1 + mismatches_r2,
                    mismatches_r1,
                    mismatches_r2,
                    definition["amplicon_id"],
                )
            )
    if not candidates:
        return {
            "amplicon_id": "",
            "status": "UNASSIGNED_PRIMER_PAIR",
            "mismatches_r1": "",
            "mismatches_r2": "",
        }
    candidates.sort()
    best_total = candidates[0][0]
    best = [candidate for candidate in candidates if candidate[0] == best_total]
    if len(best) != 1:
        return {
            "amplicon_id": "",
            "status": "AMBIGUOUS_PRIMER_PAIR",
            "mismatches_r1": "",
            "mismatches_r2": "",
        }
    _, mismatches_r1, mismatches_r2, amplicon_id = best[0]
    return {
        "amplicon_id": amplicon_id,
        "status": "ASSIGNED_PRIMER_PAIR",
        "mismatches_r1": mismatches_r1,
        "mismatches_r2": mismatches_r2,
    }


def build_umi_family_id(sample, amplicon_id, umi_r1, umi_r2):
    """Build a stable exact terminal-UMI family ID without claiming molecule identity."""
    family_key = "\t".join((sample, amplicon_id, umi_r1, umi_r2))
    digest = hashlib.sha256(family_key.encode("utf-8")).hexdigest()[:20]
    return f"UF_{digest}"


def _mean_phred(quality):
    scores = phred_scores(quality)
    return (sum(scores) / len(scores)) if scores else 0.0


def _combine_identical_qualities(qualities, sequence_length):
    """Combine evidence for an exact sequence, conservatively capped at Q60."""
    if not qualities:
        return "!" * sequence_length
    consensus = []
    for position in range(sequence_length):
        combined_q = sum(
            max(0, ord(quality[position]) - 33)
            for quality in qualities
            if position < len(quality)
        )
        consensus.append(chr(min(60, combined_q) + 33))
    return "".join(consensus)


def call_exact_paired_haplotype_consensus(
    observations,
    min_family_size=2,
    min_consensus_fraction=0.80,
    max_family_reads=100,
):
    """Call a conservative consensus from an exact paired R1/R2 haplotype.

    Exact paired sequences are used so supported CRISPR indels are preserved.
    This function does not infer an original molecule: it collapses a terminal
    UMI family and rejects families without a dominant paired haplotype.
    """
    if min_family_size < 2:
        raise ValueError("min_family_size must be at least 2")
    if not 0.5 < min_consensus_fraction <= 1.0:
        raise ValueError("min_consensus_fraction must be greater than 0.5 and at most 1.0")
    if max_family_reads < min_family_size:
        raise ValueError("max_family_reads must be at least min_family_size")

    observations = list(observations)
    family_size = len(observations)
    result = {
        "status": "PASS",
        "family_size": family_size,
        "dominant_count": 0,
        "dominant_fraction": 0.0,
        "reads_used": 0,
        "consensus_r1": "",
        "consensus_r2": "",
        "quality_r1": "",
        "quality_r2": "",
        "mean_quality_r1": 0.0,
        "mean_quality_r2": 0.0,
    }
    if family_size < min_family_size:
        result["status"] = (
            "SINGLETON_EXCLUDED" if family_size == 1 else "INSUFFICIENT_PAIRED_CLEAN_READS"
        )
        return result

    haplotypes = Counter(
        (item["sequence_r1"], item["sequence_r2"])
        for item in observations
    )
    ranked = haplotypes.most_common(2)
    dominant_haplotype, dominant_count = ranked[0]
    dominant_fraction = dominant_count / family_size
    result["dominant_count"] = dominant_count
    result["dominant_fraction"] = dominant_fraction
    if (
        len(ranked) > 1
        and ranked[1][1] == dominant_count
    ) or dominant_fraction < min_consensus_fraction:
        result["status"] = "HIGH_HETEROGENEITY"
        return result

    matching = [
        item
        for item in observations
        if (item["sequence_r1"], item["sequence_r2"]) == dominant_haplotype
    ]
    selected = heapq.nlargest(
        min(max_family_reads, len(matching)),
        matching,
        key=lambda item: (
            _mean_phred(item["quality_r1"]) + _mean_phred(item["quality_r2"])
        ),
    )
    sequence_r1, sequence_r2 = dominant_haplotype
    quality_r1 = _combine_identical_qualities(
        [item["quality_r1"] for item in selected], len(sequence_r1)
    )
    quality_r2 = _combine_identical_qualities(
        [item["quality_r2"] for item in selected], len(sequence_r2)
    )
    result.update(
        {
            "reads_used": len(selected),
            "consensus_r1": sequence_r1,
            "consensus_r2": sequence_r2,
            "quality_r1": quality_r1,
            "quality_r2": quality_r2,
            "mean_quality_r1": _mean_phred(quality_r1),
            "mean_quality_r2": _mean_phred(quality_r2),
        }
    )
    return result


def summarize_umi_consensus_power(stats):
    pass_count = int(stats.get("status_PASS", 0) or 0)
    singleton_count = int(stats.get("status_SINGLETON_EXCLUDED", 0) or 0)
    heterogeneous_count = int(stats.get("status_HIGH_HETEROGENEITY", 0) or 0)
    insufficient_count = int(
        stats.get("status_INSUFFICIENT_PAIRED_CLEAN_READS", 0) or 0
    )
    total = pass_count + singleton_count + heterogeneous_count + insufficient_count
    pass_rate = 0.0 if total <= 0 else pass_count / total * 100.0
    singleton_rate = 0.0 if total <= 0 else singleton_count / total * 100.0
    low_yield = pass_rate < 10.0 or singleton_rate > 90.0
    return {
        "total_terminal_umi_families": total,
        "consensus_pass_rate_percent": pass_rate,
        "singleton_rate_percent": singleton_rate,
        "consensus_power_status": (
            "LOW_CONSENSUS_YIELD" if low_yield else "ADEQUATE_CONSENSUS_YIELD"
        ),
        "consensus_power_warning": (
            "Low consensus yield limits UMI-family statistical power; retain the "
            "conservative thresholds and interpret results together with the read-level track."
            if low_yield
            else "-"
        ),
    }


def _canonical_fastq_qname(raw_name):
    token = raw_name.strip().split()[0]
    if token.startswith("@"):
        token = token[1:]
    if token.endswith("/1") or token.endswith("/2"):
        token = token[:-2]
    return token


def _iter_paired_fastq_gz(read1_path, read2_path):
    with gzip.open(read1_path, "rt", encoding="utf-8") as read1, gzip.open(
        read2_path, "rt", encoding="utf-8"
    ) as read2:
        while True:
            name1 = read1.readline()
            name2 = read2.readline()
            if not name1 and not name2:
                return
            if not name1 or not name2:
                raise ValueError("Paired clean FASTQ files are not synchronized")
            sequence1 = read1.readline().strip().upper()
            plus1 = read1.readline()
            quality1 = read1.readline().strip()
            sequence2 = read2.readline().strip().upper()
            plus2 = read2.readline()
            quality2 = read2.readline().strip()
            if not all((sequence1, plus1, quality1, sequence2, plus2, quality2)):
                raise ValueError("Truncated paired clean FASTQ record")
            qname1 = _canonical_fastq_qname(name1)
            qname2 = _canonical_fastq_qname(name2)
            if qname1 != qname2:
                raise ValueError(f"Paired clean FASTQ qnames differ: {qname1} != {qname2}")
            if len(sequence1) != len(quality1) or len(sequence2) != len(quality2):
                raise ValueError("Clean FASTQ sequence and quality lengths differ")
            yield {
                "qname": qname1,
                "sequence_r1": sequence1,
                "quality_r1": quality1,
                "sequence_r2": sequence2,
                "quality_r2": quality2,
            }


def generate_umi_family_consensus(
    run_root,
    sample_names,
    min_family_size=2,
    min_consensus_fraction=0.80,
    max_family_reads=100,
):
    """Generate auditable high-confidence terminal-UMI-family consensus FASTQs.

    Member lookup is disk-backed. Clean read observations are sharded into
    compressed temporary files so large datasets do not require loading all
    qname or sequence evidence into memory at once.
    """
    # Validate thresholds before touching any output.
    call_exact_paired_haplotype_consensus(
        [],
        min_family_size=min_family_size,
        min_consensus_fraction=min_consensus_fraction,
        max_family_reads=max_family_reads,
    )
    qc_dir = os.path.join(run_root, "qc_reports")
    summary_path = os.path.join(qc_dir, "umi_family_summary.tsv.gz")
    members_path = os.path.join(qc_dir, "umi_family_members.tsv.gz")
    for required in (summary_path, members_path):
        if not os.path.exists(required):
            raise FileNotFoundError(f"Required UMI family ledger not found: {required}")

    family_run_root = os.path.join(run_root, "umi_family_analysis")
    family_clean_dir = os.path.join(family_run_root, "split_clean")
    family_qc_dir = os.path.join(family_run_root, "qc_reports")
    os.makedirs(family_clean_dir, exist_ok=True)
    os.makedirs(family_qc_dir, exist_ok=True)
    for sample in sample_names:
        for suffix in ("_1P.fq.gz", "_2P.fq.gz"):
            stale_path = os.path.join(family_clean_dir, f"{sample}{suffix}")
            if os.path.isfile(stale_path):
                os.remove(stale_path)
    ledger_path = os.path.join(family_qc_dir, "umi_consensus_ledger.tsv.gz")
    qc_path = os.path.join(family_qc_dir, "umi_consensus_qc.tsv")
    database_path = os.path.join(family_qc_dir, ".umi_consensus.sqlite")
    if os.path.exists(database_path):
        os.remove(database_path)

    database = sqlite3.connect(database_path)
    bucket_count = 64
    stats = Counter()
    try:
        database.executescript(
            """
            CREATE TABLE families (
                family_id TEXT PRIMARY KEY,
                sample TEXT NOT NULL,
                amplicon TEXT NOT NULL,
                expected_pairs INTEGER NOT NULL
            );
            CREATE TABLE members (
                sample TEXT NOT NULL,
                qname TEXT NOT NULL,
                family_id TEXT NOT NULL,
                PRIMARY KEY (sample, qname)
            );
            CREATE TABLE consensus (
                family_id TEXT PRIMARY KEY,
                usable_pairs INTEGER NOT NULL,
                dominant_count INTEGER NOT NULL,
                dominant_fraction REAL NOT NULL,
                reads_used INTEGER NOT NULL,
                status TEXT NOT NULL,
                sequence_r1 TEXT NOT NULL,
                quality_r1 TEXT NOT NULL,
                sequence_r2 TEXT NOT NULL,
                quality_r2 TEXT NOT NULL,
                mean_quality_r1 REAL NOT NULL,
                mean_quality_r2 REAL NOT NULL
            );
            CREATE TEMP TABLE read_batch (qname TEXT PRIMARY KEY);
            """
        )
        with gzip.open(summary_path, "rt", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle, delimiter="\t")
            for row in reader:
                database.execute(
                    "INSERT INTO families VALUES (?, ?, ?, ?)",
                    (
                        row["UMI_Family_ID"],
                        row["Sample"],
                        row["Amplicon"],
                        int(row["Supporting_Read_Pairs"]),
                    ),
                )
        with gzip.open(members_path, "rt", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle, delimiter="\t")
            database.executemany(
                "INSERT OR REPLACE INTO members VALUES (?, ?, ?)",
                (
                    (row["Sample"], row["Member_Qname"], row["UMI_Family_ID"])
                    for row in reader
                ),
            )
        database.execute("CREATE INDEX members_lookup ON members(sample, qname)")
        database.commit()

        with tempfile.TemporaryDirectory(
            prefix=".umi_consensus_buckets_", dir=family_qc_dir
        ) as bucket_dir:
            bucket_handles = {}
            try:
                for sample in sample_names:
                    read1_path = os.path.join(run_root, "split_clean", f"{sample}_1P.fq.gz")
                    read2_path = os.path.join(run_root, "split_clean", f"{sample}_2P.fq.gz")
                    if not (os.path.exists(read1_path) and os.path.exists(read2_path)):
                        stats["samples_missing_clean_fastq"] += 1
                        continue
                    batch = []

                    def flush_batch():
                        if not batch:
                            return
                        database.execute("DELETE FROM read_batch")
                        database.executemany(
                            "INSERT INTO read_batch(qname) VALUES (?)",
                            ((item["qname"],) for item in batch),
                        )
                        family_by_qname = dict(
                            database.execute(
                                """
                                SELECT b.qname, m.family_id
                                FROM read_batch b
                                JOIN members m ON m.sample = ? AND m.qname = b.qname
                                JOIN families f ON f.family_id = m.family_id
                                WHERE f.expected_pairs >= ?
                                """,
                                (sample, min_family_size),
                            )
                        )
                        for item in batch:
                            family_id = family_by_qname.get(item["qname"])
                            if not family_id:
                                continue
                            bucket_index = int(
                                hashlib.sha256(family_id.encode("utf-8")).hexdigest()[:8], 16
                            ) % bucket_count
                            if bucket_index not in bucket_handles:
                                bucket_handles[bucket_index] = gzip.open(
                                    os.path.join(bucket_dir, f"bucket_{bucket_index:02d}.tsv.gz"),
                                    "wt",
                                    encoding="utf-8",
                                )
                            bucket_handles[bucket_index].write(
                                "\t".join(
                                    (
                                        family_id,
                                        item["qname"],
                                        item["sequence_r1"],
                                        item["quality_r1"],
                                        item["sequence_r2"],
                                        item["quality_r2"],
                                    )
                                ) + "\n"
                            )
                            stats["eligible_clean_pairs"] += 1
                        batch.clear()

                    for item in _iter_paired_fastq_gz(read1_path, read2_path):
                        batch.append(item)
                        if len(batch) >= 10000:
                            flush_batch()
                    flush_batch()
            finally:
                for handle in bucket_handles.values():
                    handle.close()

            for bucket_name in sorted(os.listdir(bucket_dir)):
                bucket_path = os.path.join(bucket_dir, bucket_name)
                observations_by_family = defaultdict(list)
                with gzip.open(bucket_path, "rt", encoding="utf-8") as handle:
                    for line in handle:
                        fields = line.rstrip("\n").split("\t")
                        if len(fields) != 6:
                            raise ValueError(f"Malformed consensus bucket row in {bucket_path}")
                        family_id, qname, sequence1, quality1, sequence2, quality2 = fields
                        observations_by_family[family_id].append(
                            {
                                "qname": qname,
                                "sequence_r1": sequence1,
                                "quality_r1": quality1,
                                "sequence_r2": sequence2,
                                "quality_r2": quality2,
                            }
                        )
                for family_id, observations in observations_by_family.items():
                    result = call_exact_paired_haplotype_consensus(
                        observations,
                        min_family_size=min_family_size,
                        min_consensus_fraction=min_consensus_fraction,
                        max_family_reads=max_family_reads,
                    )
                    database.execute(
                        "INSERT OR REPLACE INTO consensus VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (
                            family_id,
                            result["family_size"],
                            result["dominant_count"],
                            result["dominant_fraction"],
                            result["reads_used"],
                            result["status"],
                            result["consensus_r1"],
                            result["quality_r1"],
                            result["consensus_r2"],
                            result["quality_r2"],
                            result["mean_quality_r1"],
                            result["mean_quality_r2"],
                        ),
                    )
                database.commit()

        ledger_fields = [
            "Sample", "Amplicon", "UMI_Family_ID", "Expected_Read_Pairs",
            "Usable_Clean_Read_Pairs", "Dominant_Read_Pairs", "Dominant_Fraction",
            "Reads_Used", "Consensus_Status", "Consensus_Mean_Quality_R1",
            "Consensus_Mean_Quality_R2", "Consensus_Method", "Interpretation",
        ]
        with gzip.open(ledger_path, "wt", encoding="utf-8", newline="") as ledger_handle:
            writer = csv.DictWriter(ledger_handle, fieldnames=ledger_fields, delimiter="\t")
            writer.writeheader()
            for row in database.execute(
                """
                SELECT f.sample, f.amplicon, f.family_id, f.expected_pairs,
                       COALESCE(c.usable_pairs, 0), COALESCE(c.dominant_count, 0),
                       COALESCE(c.dominant_fraction, 0.0), COALESCE(c.reads_used, 0),
                       c.status, COALESCE(c.mean_quality_r1, 0.0),
                       COALESCE(c.mean_quality_r2, 0.0)
                FROM families f LEFT JOIN consensus c ON c.family_id = f.family_id
                ORDER BY f.family_id
                """
            ):
                status = row[8]
                if not status:
                    status = (
                        "SINGLETON_EXCLUDED"
                        if row[3] < min_family_size
                        else "INSUFFICIENT_PAIRED_CLEAN_READS"
                    )
                stats[f"status_{status}"] += 1
                writer.writerow(
                    {
                        "Sample": row[0],
                        "Amplicon": row[1],
                        "UMI_Family_ID": row[2],
                        "Expected_Read_Pairs": row[3],
                        "Usable_Clean_Read_Pairs": row[4],
                        "Dominant_Read_Pairs": row[5],
                        "Dominant_Fraction": f"{row[6]:.6f}",
                        "Reads_Used": row[7],
                        "Consensus_Status": status,
                        "Consensus_Mean_Quality_R1": f"{row[9]:.2f}",
                        "Consensus_Mean_Quality_R2": f"{row[10]:.2f}",
                        "Consensus_Method": "EXACT_PAIRED_HAPLOTYPE",
                        "Interpretation": "TERMINAL_UMI_FAMILY_NOT_ORIGINAL_MOLECULE",
                    }
                )

        eligible_samples = []
        for sample in sample_names:
            rows = database.execute(
                """
                SELECT f.family_id, c.sequence_r1, c.quality_r1,
                       c.sequence_r2, c.quality_r2
                FROM consensus c JOIN families f ON f.family_id = c.family_id
                WHERE f.sample = ? AND c.status = 'PASS'
                ORDER BY f.family_id
                """,
                (sample,),
            )
            first_row = rows.fetchone()
            if first_row is None:
                continue
            eligible_samples.append(sample)
            read1_path = os.path.join(family_clean_dir, f"{sample}_1P.fq.gz")
            read2_path = os.path.join(family_clean_dir, f"{sample}_2P.fq.gz")
            with gzip.open(read1_path, "wt", encoding="utf-8") as read1, gzip.open(
                read2_path, "wt", encoding="utf-8"
            ) as read2:
                family_id, sequence1, quality1, sequence2, quality2 = first_row
                read1.write(f"@{family_id}/1\n{sequence1}\n+\n{quality1}\n")
                read2.write(f"@{family_id}/2\n{sequence2}\n+\n{quality2}\n")
                for family_id, sequence1, quality1, sequence2, quality2 in rows:
                    read1.write(f"@{family_id}/1\n{sequence1}\n+\n{quality1}\n")
                    read2.write(f"@{family_id}/2\n{sequence2}\n+\n{quality2}\n")

        power_summary = summarize_umi_consensus_power(stats)
        with open(qc_path, "w", encoding="utf-8") as handle:
            handle.write("Metric\tValue\n")
            for key, value in sorted(stats.items()):
                handle.write(f"{key}\t{value}\n")
            for key, value in power_summary.items():
                handle.write(f"{key}\t{value}\n")
            handle.write(f"min_family_size\t{min_family_size}\n")
            handle.write(f"min_consensus_fraction\t{min_consensus_fraction}\n")
            handle.write(f"max_family_reads\t{max_family_reads}\n")
            handle.write("consensus_method\tEXACT_PAIRED_HAPLOTYPE\n")
            handle.write("interpretation\tTERMINAL_UMI_FAMILY_NOT_ORIGINAL_MOLECULE\n")
        return {
            "family_run_root": family_run_root,
            "eligible_samples": eligible_samples,
            "ledger_path": ledger_path,
            "qc_path": qc_path,
            **power_summary,
        }
    finally:
        database.close()
        if os.path.exists(database_path):
            os.remove(database_path)


def prepare_reference_records(ref_inputs, run_root):
    directory_fasta_ext = {".fa", ".fasta", ".fna", ".fas"}
    explicit_fasta_ext = directory_fasta_ext | {".txt"}
    fasta_files = []

    for item in ref_inputs:
        if os.path.isdir(item):
            for fn in sorted(os.listdir(item)):
                path = os.path.join(item, fn)
                if os.path.isfile(path):
                    ext = os.path.splitext(fn)[1].lower()
                    if ext in directory_fasta_ext:
                        fasta_files.append(os.path.abspath(path))
        elif os.path.isfile(item):
            ext = os.path.splitext(item)[1].lower()
            if ext in explicit_fasta_ext:
                fasta_files.append(os.path.abspath(item))

    seen = set()
    unique_fasta_files = []
    for x in fasta_files:
        if x not in seen:
            seen.add(x)
            unique_fasta_files.append(x)

    if not unique_fasta_files:
        raise ValueError("No valid FASTA files found.")

    ref_dir = os.path.join(run_root, "reference_records")
    os.makedirs(ref_dir, exist_ok=True)

    records = []
    seen_names = set()

    for fasta in unique_fasta_files:
        for header, seq in read_fasta_records(fasta):
            if not seq:
                raise ValueError(f"Empty sequence for reference {header}")
            if header in seen_names:
                raise ValueError(f"Duplicated reference name detected: {header}")

            safe_name = sanitize_name(header)
            out_fa = os.path.join(ref_dir, f"{safe_name}.fa")
            with open(out_fa, "w", encoding="utf-8") as out:
                out.write(f">{header}\n")
                for i in range(0, len(seq), 80):
                    out.write(seq[i:i+80] + "\n")

            records.append({
                "name": header,
                "safe_name": safe_name,
                "fasta": out_fa,
                "sequence": seq,
                "length": len(seq),
            })
            seen_names.add(header)

    return records


def phred_scores(qual: str):
    return [ord(c) - 33 for c in qual.strip()]


def region_q30_pass(qual: str, start: int, length: int, q30_threshold: int):
    scores = phred_scores(qual)
    end = start + length
    if len(scores) < end:
        return False
    return all(x >= q30_threshold for x in scores[start:end])


def split_and_qc_by_barcode(
    read1,
    read2,
    barcode_file,
    run_root,
    spacer_len=4,
    barcode_len=4,
    trim_prefix=26,
    q30_threshold=30,
    sample_ratio=1.0,
    sample_seed=12345,
):
    """
    按双端 barcode 拆样，并在拆样阶段输出基础 QC。

    这里的 sample-ratio 只对"已经通过 Q30 且已成功匹配到 barcode 的 reads"
    做随机抽样，这样不会影响前面的 barcode 质量统计口径。
    """
    split_dir = os.path.join(run_root, "split_raw")
    qc_dir = os.path.join(run_root, "qc_reports")
    os.makedirs(split_dir, exist_ok=True)
    os.makedirs(qc_dir, exist_ok=True)

    barcode_map, sample_names = load_barcodes(barcode_file)
    rng = random.Random(sample_seed)

    out_handles = {}
    try:
        for sample in sample_names:
            out_handles[f"{sample}_1"] = open(os.path.join(split_dir, f"{sample}_1.fq"), "w", encoding="utf-8")
            out_handles[f"{sample}_2"] = open(os.path.join(split_dir, f"{sample}_2.fq"), "w", encoding="utf-8")

        stats = Counter()

        with gzip.open(read1, "rt", encoding="utf-8") as r1f, gzip.open(read2, "rt", encoding="utf-8") as r2f:
            while True:
                r1name = r1f.readline()
                r2name = r2f.readline()

                if not r1name and not r2name:
                    break
                if not r1name or not r2name:
                    raise ValueError("R1 and R2 files are not synchronized.")

                r1seq = r1f.readline().strip()
                r1f.readline()
                r1qual = r1f.readline().strip()

                r2seq = r2f.readline().strip()
                r2f.readline()
                r2qual = r2f.readline().strip()

                stats["total_pairs"] += 1

                barcode_start = spacer_len

                if not region_q30_pass(r1qual, barcode_start, barcode_len, q30_threshold):
                    stats["barcode_q30_fail_r1"] += 1
                    continue
                if not region_q30_pass(r2qual, barcode_start, barcode_len, q30_threshold):
                    stats["barcode_q30_fail_r2"] += 1
                    continue

                r1_barcode = r1seq[barcode_start: barcode_start + barcode_len]
                r2_barcode = r2seq[barcode_start: barcode_start + barcode_len]
                key = r1_barcode + r2_barcode

                sample = barcode_map.get(key)
                if sample is None:
                    stats["barcode_mismatch"] += 1
                    continue

                trimmed_r1_seq = r1seq[trim_prefix:]
                trimmed_r1_qual = r1qual[trim_prefix:]
                trimmed_r2_seq = r2seq[trim_prefix:]
                trimmed_r2_qual = r2qual[trim_prefix:]

                if not trimmed_r1_seq or not trimmed_r2_seq:
                    stats["post_trim_empty"] += 1
                    continue

                # 先确认这条 reads 确实属于某个样本，再决定是否为试跑目的随机丢弃。
                if sample_ratio < 1.0 and rng.random() > sample_ratio:
                    stats["subsampled_dropped_matched"] += 1
                    continue

                out_handles[f"{sample}_1"].write(
                    f"{r1name.rstrip()}\n{trimmed_r1_seq}\n+\n{trimmed_r1_qual}\n"
                )
                out_handles[f"{sample}_2"].write(
                    f"{r2name.rstrip()}\n{trimmed_r2_seq}\n+\n{trimmed_r2_qual}\n"
                )
                stats["barcode_matched_written"] += 1

        report_path = os.path.join(qc_dir, "barcode_qc_report.tsv")
        with open(report_path, "w", encoding="utf-8") as out:
            out.write("Metric\tCount\n")
            for k, v in sorted(stats.items()):
                out.write(f"{k}\t{v}\n")

    finally:
        for h in out_handles.values():
            h.close()

    return barcode_map, sample_names


def split_extract_umi_and_qc_by_barcode(
    read1,
    read2,
    barcode_file,
    run_root,
    spacer_len=4,
    barcode_len=4,
    post_barcode_spacer_len=1,
    bridge_len=18,
    umi_len_r1=8,
    umi_len_r2=8,
    q30_threshold=30,
    min_umi_base_quality=30,
    amplicon_primer_file=None,
    amplicon_primer_max_mismatches=1,
):
    """Split reads, extract dual UMIs and optionally assign exact UMI families by locus."""
    if bridge_len != len(UMI_RAW_BRIDGE_R1) or bridge_len != len(UMI_RAW_BRIDGE_R2):
        raise ValueError("dual-primer extraction requires the validated 18 bp raw bridge definitions")
    if umi_len_r1 <= 0 or umi_len_r2 <= 0:
        raise ValueError("R1/R2 UMI lengths must be positive integers")
    if not 0 <= min_umi_base_quality <= 93:
        raise ValueError("min_umi_base_quality must be between 0 and 93")
    if amplicon_primer_max_mismatches < 0:
        raise ValueError("amplicon_primer_max_mismatches cannot be negative")

    split_dir = os.path.join(run_root, "split_raw")
    qc_dir = os.path.join(run_root, "qc_reports")
    os.makedirs(split_dir, exist_ok=True)
    os.makedirs(qc_dir, exist_ok=True)

    barcode_map, sample_names = load_barcodes(barcode_file)
    amplicon_definitions = (
        load_amplicon_primer_definitions(amplicon_primer_file)
        if amplicon_primer_file
        else []
    )
    umi_start = spacer_len + barcode_len + post_barcode_spacer_len + bridge_len
    umi_end_r1 = umi_start + umi_len_r1
    umi_end_r2 = umi_start + umi_len_r2
    bridge_start = spacer_len + barcode_len + post_barcode_spacer_len
    bridge_end = bridge_start + bridge_len
    ledger_fields = [
        "Sample",
        "Qname",
        "UMI_R1",
        "UMI_R2",
        "UMI_Min_Quality_R1",
        "UMI_Min_Quality_R2",
        "UMI_Extraction_Status",
        "Bridge_Mismatches_R1",
        "Bridge_Mismatches_R2",
        "UMI_Start_R1_0Based",
        "UMI_End_R1_0BasedExclusive",
        "UMI_Start_R2_0Based",
        "UMI_End_R2_0BasedExclusive",
        "Amplicon",
        "Amplicon_Assignment_Status",
        "Amplicon_Assignment_Method",
        "Primer_Mismatches_R1",
        "Primer_Mismatches_R2",
        "UMI_Family_ID",
        "Molecule_ID",
    ]

    def canonical_qname(raw_name):
        token = raw_name.strip().split()[0]
        if token.startswith("@"):
            token = token[1:]
        if token.endswith("/1") or token.endswith("/2"):
            token = token[:-2]
        return token

    def bridge_mismatches(sequence, expected):
        observed = sequence[bridge_start:bridge_end].upper()
        if len(observed) != bridge_len or len(expected) != bridge_len:
            return ""
        return sum(left != right for left, right in zip(observed, expected))

    stats = Counter()
    out_handles = {}
    ledger_path = os.path.join(qc_dir, "umi_read_ledger.tsv.gz")
    family_db_path = None
    family_db = None
    family_member_handle = None
    family_member_writer = None
    if amplicon_definitions:
        with tempfile.NamedTemporaryFile(
            prefix=".umi_family_counts_",
            suffix=".sqlite",
            dir=qc_dir,
            delete=False,
        ) as temp_handle:
            family_db_path = temp_handle.name
        family_db = sqlite3.connect(family_db_path)
        family_db.execute(
            """
            CREATE TABLE families (
                sample TEXT NOT NULL,
                amplicon TEXT NOT NULL,
                umi_r1 TEXT NOT NULL,
                umi_r2 TEXT NOT NULL,
                family_id TEXT NOT NULL,
                supporting_read_pairs INTEGER NOT NULL,
                PRIMARY KEY (sample, amplicon, umi_r1, umi_r2)
            )
            """
        )
        family_member_handle = gzip.open(
            os.path.join(qc_dir, "umi_family_members.tsv.gz"),
            "wt",
            encoding="utf-8",
            newline="",
        )
        family_member_writer = csv.DictWriter(
            family_member_handle,
            fieldnames=[
                "Sample",
                "Amplicon",
                "UMI_Family_ID",
                "Member_Qname",
                "Original_UMI_R1",
                "Original_UMI_R2",
                "Grouping_Method",
            ],
            delimiter="\t",
        )
        family_member_writer.writeheader()
    try:
        for sample in sample_names:
            out_handles[f"{sample}_1"] = open(
                os.path.join(split_dir, f"{sample}_1.fq"), "w", encoding="utf-8"
            )
            out_handles[f"{sample}_2"] = open(
                os.path.join(split_dir, f"{sample}_2.fq"), "w", encoding="utf-8"
            )

        with gzip.open(ledger_path, "wt", encoding="utf-8", newline="") as ledger_handle:
            ledger = csv.DictWriter(ledger_handle, fieldnames=ledger_fields, delimiter="\t")
            ledger.writeheader()

            with gzip.open(read1, "rt", encoding="utf-8") as r1f, gzip.open(read2, "rt", encoding="utf-8") as r2f:
                while True:
                    r1name = r1f.readline()
                    r2name = r2f.readline()
                    if not r1name and not r2name:
                        break
                    if not r1name or not r2name:
                        raise ValueError("R1 and R2 files are not synchronized.")

                    r1seq = r1f.readline().strip().upper()
                    r1plus = r1f.readline()
                    r1qual = r1f.readline().strip()
                    r2seq = r2f.readline().strip().upper()
                    r2plus = r2f.readline()
                    r2qual = r2f.readline().strip()
                    if not all((r1seq, r1plus, r1qual, r2seq, r2plus, r2qual)):
                        raise ValueError("Truncated FASTQ record detected.")
                    if len(r1seq) != len(r1qual) or len(r2seq) != len(r2qual):
                        raise ValueError("FASTQ sequence and quality lengths differ.")

                    qname_r1 = canonical_qname(r1name)
                    qname_r2 = canonical_qname(r2name)
                    if qname_r1 != qname_r2:
                        raise ValueError(
                            f"R1 and R2 qnames are not synchronized: {qname_r1} != {qname_r2}"
                        )

                    stats["total_pairs"] += 1
                    row = {field: "" for field in ledger_fields}
                    row["Qname"] = qname_r1
                    row["UMI_Start_R1_0Based"] = umi_start
                    row["UMI_End_R1_0BasedExclusive"] = umi_end_r1
                    row["UMI_Start_R2_0Based"] = umi_start
                    row["UMI_End_R2_0BasedExclusive"] = umi_end_r2

                    barcode_start = spacer_len
                    status = "PASS"
                    if not region_q30_pass(r1qual, barcode_start, barcode_len, q30_threshold):
                        status = "BARCODE_LOW_QUALITY_R1"
                    elif not region_q30_pass(r2qual, barcode_start, barcode_len, q30_threshold):
                        status = "BARCODE_LOW_QUALITY_R2"

                    sample = ""
                    if status == "PASS":
                        r1_barcode = r1seq[barcode_start: barcode_start + barcode_len]
                        r2_barcode = r2seq[barcode_start: barcode_start + barcode_len]
                        sample = barcode_map.get(r1_barcode + r2_barcode, "")
                        if not sample:
                            status = "BARCODE_MISMATCH"
                    row["Sample"] = sample

                    if status == "PASS" and (len(r1seq) <= umi_end_r1 or len(r2seq) <= umi_end_r2):
                        status = "READ_TOO_SHORT"

                    if status == "PASS":
                        umi_r1 = r1seq[umi_start:umi_end_r1]
                        umi_r2 = r2seq[umi_start:umi_end_r2]
                        row["UMI_R1"] = umi_r1
                        row["UMI_R2"] = umi_r2
                        bridge_mm_r1 = bridge_mismatches(r1seq, UMI_RAW_BRIDGE_R1)
                        bridge_mm_r2 = bridge_mismatches(r2seq, UMI_RAW_BRIDGE_R2)
                        row["Bridge_Mismatches_R1"] = bridge_mm_r1
                        row["Bridge_Mismatches_R2"] = bridge_mm_r2
                        if bridge_mm_r1 != "":
                            stats[f"bridge_mismatch_{bridge_mm_r1}_r1"] += 1
                        if bridge_mm_r2 != "":
                            stats[f"bridge_mismatch_{bridge_mm_r2}_r2"] += 1
                        if set(umi_r1 + umi_r2) - DNA_BASES:
                            status = "UMI_INVALID_BASE"
                        else:
                            min_q_r1 = min(phred_scores(r1qual[umi_start:umi_end_r1]))
                            min_q_r2 = min(phred_scores(r2qual[umi_start:umi_end_r2]))
                            row["UMI_Min_Quality_R1"] = min_q_r1
                            row["UMI_Min_Quality_R2"] = min_q_r2
                            if min_q_r1 < min_umi_base_quality:
                                status = "UMI_LOW_QUALITY_R1"
                            elif min_q_r2 < min_umi_base_quality:
                                status = "UMI_LOW_QUALITY_R2"

                    trimmed_r1_seq = ""
                    trimmed_r1_qual = ""
                    trimmed_r2_seq = ""
                    trimmed_r2_qual = ""
                    if status == "PASS":
                        trimmed_r1_seq = r1seq[umi_end_r1:]
                        trimmed_r1_qual = r1qual[umi_end_r1:]
                        trimmed_r2_seq = r2seq[umi_end_r2:]
                        trimmed_r2_qual = r2qual[umi_end_r2:]

                        if amplicon_definitions:
                            assignment = assign_amplicon_by_primer_pair(
                                trimmed_r1_seq,
                                trimmed_r2_seq,
                                amplicon_definitions,
                                max_mismatches=amplicon_primer_max_mismatches,
                            )
                            row["Amplicon"] = assignment["amplicon_id"]
                            row["Amplicon_Assignment_Status"] = assignment["status"]
                            row["Amplicon_Assignment_Method"] = "PRIMER_PAIR"
                            row["Primer_Mismatches_R1"] = assignment["mismatches_r1"]
                            row["Primer_Mismatches_R2"] = assignment["mismatches_r2"]
                            stats[f"amplicon_status_{assignment['status']}"] += 1
                            if assignment["status"] == "ASSIGNED_PRIMER_PAIR":
                                family_id = build_umi_family_id(
                                    sample,
                                    assignment["amplicon_id"],
                                    row["UMI_R1"],
                                    row["UMI_R2"],
                                )
                                row["UMI_Family_ID"] = family_id
                                family_db.execute(
                                    """
                                    INSERT INTO families (
                                        sample, amplicon, umi_r1, umi_r2,
                                        family_id, supporting_read_pairs
                                    ) VALUES (?, ?, ?, ?, ?, 1)
                                    ON CONFLICT(sample, amplicon, umi_r1, umi_r2)
                                    DO UPDATE SET supporting_read_pairs = supporting_read_pairs + 1
                                    """,
                                    (
                                        sample,
                                        assignment["amplicon_id"],
                                        row["UMI_R1"],
                                        row["UMI_R2"],
                                        family_id,
                                    ),
                                )
                                family_member_writer.writerow(
                                    {
                                        "Sample": sample,
                                        "Amplicon": assignment["amplicon_id"],
                                        "UMI_Family_ID": family_id,
                                        "Member_Qname": qname_r1,
                                        "Original_UMI_R1": row["UMI_R1"],
                                        "Original_UMI_R2": row["UMI_R2"],
                                        "Grouping_Method": "EXACT_TERMINAL_UMI",
                                    }
                                )
                        else:
                            row["Amplicon_Assignment_Status"] = "NOT_REQUESTED"
                            row["Amplicon_Assignment_Method"] = "NOT_REQUESTED"

                    row["UMI_Extraction_Status"] = status
                    stats[f"status_{status}"] += 1
                    ledger.writerow(row)
                    if status != "PASS":
                        continue

                    out_handles[f"{sample}_1"].write(
                        f"{r1name.rstrip()}\n{trimmed_r1_seq}\n+\n{trimmed_r1_qual}\n"
                    )
                    out_handles[f"{sample}_2"].write(
                        f"{r2name.rstrip()}\n{trimmed_r2_seq}\n+\n{trimmed_r2_qual}\n"
                    )
                    stats["umi_valid_pairs_written"] += 1

        if family_db is not None:
            family_db.commit()
            family_summary_path = os.path.join(qc_dir, "umi_family_summary.tsv.gz")
            family_fields = [
                "Sample",
                "Amplicon",
                "UMI_R1",
                "UMI_R2",
                "UMI_Family_ID",
                "Supporting_Read_Pairs",
                "Interpretation",
            ]
            with gzip.open(
                family_summary_path,
                "wt",
                encoding="utf-8",
                newline="",
            ) as family_handle:
                family_writer = csv.DictWriter(
                    family_handle,
                    fieldnames=family_fields,
                    delimiter="\t",
                )
                family_writer.writeheader()
                for family in family_db.execute(
                    """
                    SELECT sample, amplicon, umi_r1, umi_r2,
                           family_id, supporting_read_pairs
                    FROM families
                    ORDER BY sample, amplicon, supporting_read_pairs DESC,
                             umi_r1, umi_r2
                    """
                ):
                    family_writer.writerow(
                        {
                            "Sample": family[0],
                            "Amplicon": family[1],
                            "UMI_R1": family[2],
                            "UMI_R2": family[3],
                            "UMI_Family_ID": family[4],
                            "Supporting_Read_Pairs": family[5],
                            "Interpretation": "TERMINAL_UMI_FAMILY_NOT_ORIGINAL_MOLECULE",
                        }
                    )
            family_count, grouped_pairs, max_family_size = family_db.execute(
                """
                SELECT COUNT(*), COALESCE(SUM(supporting_read_pairs), 0),
                       COALESCE(MAX(supporting_read_pairs), 0)
                FROM families
                """
            ).fetchone()
            stats["terminal_umi_families"] = family_count
            stats["terminal_umi_family_grouped_pairs"] = grouped_pairs
            stats["terminal_umi_family_max_size"] = max_family_size

        barcode_report = os.path.join(qc_dir, "barcode_qc_report.tsv")
        umi_report = os.path.join(qc_dir, "umi_extraction_qc.tsv")
        for report_path in (barcode_report, umi_report):
            with open(report_path, "w", encoding="utf-8") as out:
                out.write("Metric\tCount\n")
                for key, value in sorted(stats.items()):
                    out.write(f"{key}\t{value}\n")
    finally:
        for handle in out_handles.values():
            handle.close()
        if family_db is not None:
            family_db.close()
        if family_member_handle is not None:
            family_member_handle.close()
        if family_db_path and os.path.exists(family_db_path):
            os.remove(family_db_path)

    return barcode_map, sample_names


def trim_split_reads_strict(sample_names, run_root, threads, resume=True):
    split_raw_dir = os.path.join(run_root, "split_raw")
    split_clean_dir = os.path.join(run_root, "split_clean")
    os.makedirs(split_clean_dir, exist_ok=True)

    max_workers, task_threads = choose_parallelism(threads, preferred_task_threads=2)

    def process_sample(sample):
        r1 = os.path.join(split_raw_dir, f"{sample}_1.fq")
        r2 = os.path.join(split_raw_dir, f"{sample}_2.fq")

        if not (os.path.exists(r1) and os.path.exists(r2)):
            return
        if os.path.getsize(r1) == 0 or os.path.getsize(r2) == 0:
            return

        out1p = os.path.join(split_clean_dir, f"{sample}_1P.fq.gz")
        out1u = os.path.join(split_clean_dir, f"{sample}_1U.fq.gz")
        out2p = os.path.join(split_clean_dir, f"{sample}_2P.fq.gz")
        out2u = os.path.join(split_clean_dir, f"{sample}_2U.fq.gz")

        # 已经完成过 clean reads 产物的样本直接跳过，支持断点续跑。
        if resume and all(file_exists_and_nonempty(path) for path in (out1p, out1u, out2p, out2u)):
            return

        cmd = [
            "trimmomatic", "PE",
            "-phred33",
            "-threads", str(task_threads),
            r1, r2,
            out1p, out1u, out2p, out2u,
            "LEADING:20",
            "TRAILING:20",
            "SLIDINGWINDOW:4:20",
            "MINLEN:50",
        ]
        run_cmd(cmd)

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        list(executor.map(process_sample, sample_names))


def bwa_samtools_pipeline_per_reference(mode, reference_records, sample_names, threads, run_root, fast_bwa=False, resume=True):
    """
    对每条参考序列分别执行比对流程。

    - 默认模式：保留较完整的 BAM 中间处理与 coverage 输出；
    - fast_bwa 模式：直接输出 filter.bam，用更少步骤换取更快速度。
    """
    split_clean_dir = os.path.join(run_root, "split_clean")
    summary_dir = os.path.join(run_root, "reference_results")
    os.makedirs(summary_dir, exist_ok=True)
    max_workers, task_threads = choose_parallelism(threads, preferred_task_threads=2)

    for ref in reference_records:
        safe_ref = ref["safe_name"]
        ref_fa = ref["fasta"]

        ref_root = os.path.join(summary_dir, safe_ref)
        bwa_dir = os.path.join(ref_root, "bwa")
        cov_dir = os.path.join(ref_root, "coverage")
        os.makedirs(bwa_dir, exist_ok=True)
        os.makedirs(cov_dir, exist_ok=True)

        required_index = [ref_fa + ext for ext in [".amb", ".ann", ".bwt", ".pac", ".sa"]]
        if not all(os.path.exists(x) for x in required_index):
            run_cmd(["bwa", "index", ref_fa])

        if fast_bwa and mode == "disjoint":
            def process_sample_fast(sample):
                r1 = os.path.join(split_clean_dir, f"{sample}_1P.fq.gz")
                r2 = os.path.join(split_clean_dir, f"{sample}_2P.fq.gz")

                if not (os.path.exists(r1) and os.path.exists(r2)):
                    return
                if os.path.getsize(r1) == 0 or os.path.getsize(r2) == 0:
                    return

                filt_bam = os.path.join(bwa_dir, f"{sample}.filter.bam")
                filt_bai = filt_bam + ".bai"
                if resume and bam_index_is_current(filt_bam, filt_bai):
                    return
                # 轻量模式只保留后续统计真正需要的 filter.bam。
                cmd = f"""
                set -o pipefail
                bwa mem -t {task_threads} "{ref_fa}" "{r1}" "{r2}" -R "@RG\\tID:{sample}\\tSM:{sample}\\tPL:ILLUMINA" | \\
                samtools view -@ {task_threads} -b -q 30 -F 260 - | \\
                samtools sort -@ {task_threads} -o "{filt_bam}" -
                samtools index -@ {task_threads} "{filt_bam}"
                """
                run_cmd(cmd, shell=True)

            with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
                list(executor.map(process_sample_fast, sample_names))
            continue

        def process_sample_default(sample):
            if mode == "disjoint":
                r1 = os.path.join(split_clean_dir, f"{sample}_1P.fq.gz")
                r2 = os.path.join(split_clean_dir, f"{sample}_2P.fq.gz")

                if not (os.path.exists(r1) and os.path.exists(r2)):
                    return
                if os.path.getsize(r1) == 0 or os.path.getsize(r2) == 0:
                    return

                raw_bam = os.path.join(bwa_dir, f"{sample}.raw.bam")
                name_bam = os.path.join(bwa_dir, f"{sample}.name.bam")
                fix_bam = os.path.join(bwa_dir, f"{sample}.fixmate.bam")
                pos_bam = os.path.join(bwa_dir, f"{sample}.pos.bam")
                dedup_bam = os.path.join(bwa_dir, f"{sample}.dedup.bam")
                filt_bam = os.path.join(bwa_dir, f"{sample}.filter.bam")
                coverage_tsv = os.path.join(cov_dir, f"{sample}.coverage.tsv")
                expected_outputs = (
                    raw_bam,
                    name_bam,
                    fix_bam,
                    pos_bam,
                    dedup_bam,
                    dedup_bam + ".bai",
                    filt_bam,
                    filt_bam + ".bai",
                    coverage_tsv,
                )
                if (
                    resume
                    and all(file_exists_and_nonempty(path) for path in expected_outputs)
                    and bam_index_is_current(filt_bam, filt_bam + ".bai")
                    and bam_index_is_current(dedup_bam, dedup_bam + ".bai")
                ):
                    return

                cmd = f"""
                set -o pipefail
                bwa mem -t {task_threads} "{ref_fa}" "{r1}" "{r2}" -R "@RG\\tID:{sample}\\tSM:{sample}\\tPL:ILLUMINA" |
                samtools view -@ {task_threads} -b -F 4 -o "{raw_bam}" -

                samtools sort -@ {task_threads} -n -o "{name_bam}" "{raw_bam}"
                samtools fixmate -@ {task_threads} -m "{name_bam}" "{fix_bam}"
                samtools sort -@ {task_threads} -o "{pos_bam}" "{fix_bam}"

                samtools view -@ {task_threads} -h -b -q 30 -F 256 "{pos_bam}" > "{filt_bam}"
                samtools index -@ {task_threads} "{filt_bam}"

                samtools markdup -@ {task_threads} -r "{pos_bam}" "{dedup_bam}"
                samtools index -@ {task_threads} "{dedup_bam}"
                samtools coverage "{dedup_bam}" > "{coverage_tsv}" 2>/dev/null || echo -e "#rname\\tstartpos\\tendpos\\tnumreads\\tcovbases\\tcoverage\\tmeandepth\\tmeanbaseq\\tmeanmapq" > "{coverage_tsv}"
                """
                run_cmd(cmd, shell=True)

        if mode == "disjoint":
            with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
                list(executor.map(process_sample_default, sample_names))
            continue

        for sample in sample_names:
            r1 = os.path.join(split_clean_dir, f"{sample}_1P.fq.gz")
            r2 = os.path.join(split_clean_dir, f"{sample}_2P.fq.gz")
            if not (os.path.exists(r1) and os.path.exists(r2)):
                continue
            if os.path.getsize(r1) == 0 or os.path.getsize(r2) == 0:
                continue

            bam_path = os.path.join(bwa_dir, f"{sample}.filter.bam")
            bai_path = bam_path + ".bai"
            if resume and file_exists_and_nonempty(bam_path) and file_exists_and_nonempty(bai_path):
                continue

            cmd = f"""
            set -o pipefail
            bwa mem -t {task_threads} "{ref_fa}" "{r1}" "{r2}" -R "@RG\\tID:{sample}\\tSM:{sample}\\tPL:ILLUMINA" |
            samtools view -@ {task_threads} -h -b -q 30 -F 260 - > "{bam_path}"
            samtools index -@ {task_threads} "{bam_path}"
            """
            run_cmd(cmd, shell=True)


def prepare_group_combined_references(reference_records, group_models, run_root):
    """
    Build one combined A/B/D FASTA per homoeolog group for V10.2 group-level BWA.
    """
    ref_by_name = {ref["name"]: ref for ref in reference_records}
    out_dir = os.path.join(run_root, "group_references")
    os.makedirs(out_dir, exist_ok=True)
    combined = {}

    for group_name, group_model in group_models.items():
        safe_group = sanitize_name(group_name)
        fasta_path = os.path.join(out_dir, f"{safe_group}.combined.fa")
        with open(fasta_path, "w", encoding="utf-8") as handle:
            for ref_name in group_model.get("reference_names", []):
                ref = ref_by_name.get(ref_name)
                if ref is None:
                    continue
                handle.write(f">{ref_name}\n")
                seq = str(ref.get("sequence", "")).upper()
                for idx in range(0, len(seq), 80):
                    handle.write(seq[idx:idx + 80] + "\n")
        combined[group_name] = {
            "group_name": group_name,
            "safe_name": safe_group,
            "fasta": fasta_path,
            "reference_names": list(group_model.get("reference_names", [])),
        }
    return combined


def group_bwa_dir(run_root, group_name):
    return os.path.join(run_root, "group_results", sanitize_name(group_name), "bwa")


def group_bam_path(run_root, group_name, sample):
    return os.path.join(group_bwa_dir(run_root, group_name), f"{sample}.group.filter.bam")


def backfill_umi_families_from_bwa(run_root, sample_names, group_names):
    """Backfill unassigned terminal UMI families from unique paired target-group evidence.

    This target-level step does not assign A/B/D homoeologs. A qname is eligible
    only when both R1 and R2 have mapped evidence in exactly one target group.
    """
    if pysam is None:
        raise RuntimeError("pysam is required for UMI BWA group backfill")
    sample_names = tuple(sample_names)
    group_names = tuple(group_names)

    qc_dir = os.path.join(run_root, "qc_reports")
    ledger_path = os.path.join(qc_dir, "umi_read_ledger.tsv.gz")
    members_path = os.path.join(qc_dir, "umi_family_members.tsv.gz")
    summary_path = os.path.join(qc_dir, "umi_family_summary.tsv.gz")
    if not os.path.exists(ledger_path):
        raise FileNotFoundError(f"UMI read ledger not found: {ledger_path}")

    os.makedirs(qc_dir, exist_ok=True)
    temp_paths = []
    evidence_db = None
    evidence_db_path = None

    def temporary_path(suffix):
        with tempfile.NamedTemporaryFile(
            prefix=".umi_bwa_backfill_",
            suffix=suffix,
            dir=qc_dir,
            delete=False,
        ) as handle:
            path = handle.name
        temp_paths.append(path)
        return path

    ledger_temp = temporary_path(".ledger.tsv.gz")
    members_temp = temporary_path(".members.tsv.gz")
    summary_temp = temporary_path(".summary.tsv.gz")
    evidence_db_path = temporary_path(".sqlite")
    stats = Counter()

    try:
        evidence_db = sqlite3.connect(evidence_db_path)
        evidence_db.execute(
            """
            CREATE TABLE evidence (
                sample TEXT NOT NULL,
                qname TEXT NOT NULL,
                group_name TEXT NOT NULL,
                mate_mask INTEGER NOT NULL,
                PRIMARY KEY (sample, qname, group_name)
            )
            """
        )
        for sample in sample_names:
            for group_name in group_names:
                bam_path = group_bam_path(run_root, group_name, sample)
                if not os.path.exists(bam_path):
                    continue
                with pysam.AlignmentFile(bam_path, "rb") as bam_handle:
                    for alignment in bam_handle.fetch(until_eof=True):
                        if alignment.is_unmapped:
                            continue
                        if alignment.is_read1:
                            mate_mask = 1
                        elif alignment.is_read2:
                            mate_mask = 2
                        else:
                            continue
                        evidence_db.execute(
                            """
                            INSERT INTO evidence (sample, qname, group_name, mate_mask)
                            VALUES (?, ?, ?, ?)
                            ON CONFLICT(sample, qname, group_name)
                            DO UPDATE SET mate_mask = evidence.mate_mask | excluded.mate_mask
                            """,
                            (sample, alignment.query_name, group_name, mate_mask),
                        )
        evidence_db.execute(
            """
            CREATE TABLE resolution AS
            SELECT sample, qname, COUNT(*) AS candidate_count,
                   MIN(group_name) AS unique_group
            FROM evidence
            WHERE mate_mask = 3
            GROUP BY sample, qname
            """
        )
        evidence_db.execute(
            "CREATE UNIQUE INDEX resolution_key ON resolution(sample, qname)"
        )
        evidence_db.execute(
            """
            CREATE TABLE families (
                sample TEXT NOT NULL,
                amplicon TEXT NOT NULL,
                umi_r1 TEXT NOT NULL,
                umi_r2 TEXT NOT NULL,
                family_id TEXT NOT NULL,
                supporting_read_pairs INTEGER NOT NULL,
                PRIMARY KEY (sample, amplicon, umi_r1, umi_r2)
            )
            """
        )
        evidence_db.commit()

        with gzip.open(ledger_path, "rt", encoding="utf-8", newline="") as source:
            reader = csv.DictReader(source, delimiter="\t")
            if reader.fieldnames is None:
                raise ValueError("UMI read ledger has no header")
            ledger_fields = list(reader.fieldnames)
            if "Amplicon_Assignment_Method" not in ledger_fields:
                status_index = ledger_fields.index("Amplicon_Assignment_Status") + 1
                ledger_fields.insert(status_index, "Amplicon_Assignment_Method")

            member_fields = [
                "Sample",
                "Amplicon",
                "UMI_Family_ID",
                "Member_Qname",
                "Original_UMI_R1",
                "Original_UMI_R2",
                "Grouping_Method",
            ]
            with gzip.open(
                ledger_temp, "wt", encoding="utf-8", newline=""
            ) as ledger_handle, gzip.open(
                members_temp, "wt", encoding="utf-8", newline=""
            ) as member_handle:
                ledger_writer = csv.DictWriter(
                    ledger_handle, fieldnames=ledger_fields, delimiter="\t"
                )
                member_writer = csv.DictWriter(
                    member_handle, fieldnames=member_fields, delimiter="\t"
                )
                ledger_writer.writeheader()
                member_writer.writeheader()

                for row in reader:
                    row.setdefault("Amplicon_Assignment_Method", "")
                    status = row.get("Amplicon_Assignment_Status", "")
                    if status == "ASSIGNED_PRIMER_PAIR":
                        row["Amplicon_Assignment_Method"] = "PRIMER_PAIR"
                    elif row.get("UMI_Extraction_Status") == "PASS":
                        resolution = evidence_db.execute(
                            """
                            SELECT candidate_count, unique_group
                            FROM resolution
                            WHERE sample = ? AND qname = ?
                            """,
                            (row.get("Sample", ""), row.get("Qname", "")),
                        ).fetchone()
                        if resolution and resolution[0] == 1:
                            row["Amplicon"] = resolution[1]
                            row["Amplicon_Assignment_Status"] = "ASSIGNED_BWA_GROUP"
                            row["Amplicon_Assignment_Method"] = "BWA_GROUP_BACKFILL"
                            stats["assigned_bwa_group"] += 1
                        elif resolution and resolution[0] > 1:
                            row["Amplicon"] = ""
                            row["Amplicon_Assignment_Status"] = "AMBIGUOUS_BWA_GROUP"
                            row["Amplicon_Assignment_Method"] = "BWA_GROUP_BACKFILL"
                            row["UMI_Family_ID"] = ""
                            stats["ambiguous_bwa_group"] += 1

                    family_id = ""
                    if (
                        row.get("UMI_Extraction_Status") == "PASS"
                        and row.get("Sample")
                        and row.get("Amplicon")
                        and row.get("UMI_R1")
                        and row.get("UMI_R2")
                        and row.get("Amplicon_Assignment_Status")
                        in {"ASSIGNED_PRIMER_PAIR", "ASSIGNED_BWA_GROUP"}
                    ):
                        family_id = build_umi_family_id(
                            row["Sample"],
                            row["Amplicon"],
                            row["UMI_R1"],
                            row["UMI_R2"],
                        )
                        row["UMI_Family_ID"] = family_id
                        evidence_db.execute(
                            """
                            INSERT INTO families (
                                sample, amplicon, umi_r1, umi_r2,
                                family_id, supporting_read_pairs
                            ) VALUES (?, ?, ?, ?, ?, 1)
                            ON CONFLICT(sample, amplicon, umi_r1, umi_r2)
                            DO UPDATE SET supporting_read_pairs = supporting_read_pairs + 1
                            """,
                            (
                                row["Sample"],
                                row["Amplicon"],
                                row["UMI_R1"],
                                row["UMI_R2"],
                                family_id,
                            ),
                        )
                        member_writer.writerow(
                            {
                                "Sample": row["Sample"],
                                "Amplicon": row["Amplicon"],
                                "UMI_Family_ID": family_id,
                                "Member_Qname": row["Qname"],
                                "Original_UMI_R1": row["UMI_R1"],
                                "Original_UMI_R2": row["UMI_R2"],
                                "Grouping_Method": "EXACT_TERMINAL_UMI",
                            }
                        )
                    elif status != "ASSIGNED_PRIMER_PAIR":
                        row["UMI_Family_ID"] = ""
                    ledger_writer.writerow(row)

        evidence_db.commit()
        family_fields = [
            "Sample",
            "Amplicon",
            "UMI_R1",
            "UMI_R2",
            "UMI_Family_ID",
            "Supporting_Read_Pairs",
            "Interpretation",
        ]
        with gzip.open(summary_temp, "wt", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=family_fields, delimiter="\t")
            writer.writeheader()
            for family in evidence_db.execute(
                """
                SELECT sample, amplicon, umi_r1, umi_r2,
                       family_id, supporting_read_pairs
                FROM families
                ORDER BY sample, amplicon, supporting_read_pairs DESC, umi_r1, umi_r2
                """
            ):
                writer.writerow(
                    {
                        "Sample": family[0],
                        "Amplicon": family[1],
                        "UMI_R1": family[2],
                        "UMI_R2": family[3],
                        "UMI_Family_ID": family[4],
                        "Supporting_Read_Pairs": family[5],
                        "Interpretation": "TERMINAL_UMI_FAMILY_NOT_ORIGINAL_MOLECULE",
                    }
                )

        family_count, grouped_pairs, max_family_size = evidence_db.execute(
            """
            SELECT COUNT(*), COALESCE(SUM(supporting_read_pairs), 0),
                   COALESCE(MAX(supporting_read_pairs), 0)
            FROM families
            """
        ).fetchone()
        stats["terminal_umi_families"] = family_count
        stats["terminal_umi_family_grouped_pairs"] = grouped_pairs
        stats["terminal_umi_family_max_size"] = max_family_size

        os.replace(ledger_temp, ledger_path)
        os.replace(members_temp, members_path)
        os.replace(summary_temp, summary_path)
        for path in (ledger_temp, members_temp, summary_temp):
            if path in temp_paths:
                temp_paths.remove(path)

        report_path = os.path.join(qc_dir, "umi_bwa_backfill_qc.tsv")
        with open(report_path, "w", encoding="utf-8") as handle:
            handle.write("Metric\tCount\n")
            for key, value in sorted(stats.items()):
                handle.write(f"{key}\t{value}\n")
        return stats
    finally:
        if evidence_db is not None:
            evidence_db.close()
        for path in temp_paths:
            if os.path.exists(path):
                os.remove(path)


def bwa_samtools_pipeline_per_group(
    mode,
    group_combined_references,
    sample_names,
    threads,
    run_root,
    resume=True,
    bwa_profile=BWA_PROFILE_DEFAULT,
):
    """
    V10.3 group-level BWA.

    Each sample/group is aligned once against a combined A/B/D FASTA using
    `bwa mem -a`. Secondary alignments and low-MAPQ alignments remain in the
    group BAM and are treated as ledger evidence, not directly as assigned reads.
    """
    split_clean_dir = os.path.join(run_root, "split_clean")
    max_workers, task_threads = choose_parallelism(threads, preferred_task_threads=2)
    profile_args = bwa_mem_profile_args(bwa_profile)
    profile_arg_text = (" " + " ".join(profile_args)) if profile_args else ""

    for group_name, group_ref in group_combined_references.items():
        safe_group = group_ref.get("safe_name", sanitize_name(group_name))
        ref_fa = group_ref["fasta"]
        bwa_dir = group_bwa_dir(run_root, group_name)
        os.makedirs(bwa_dir, exist_ok=True)

        required_index = [ref_fa + ext for ext in [".amb", ".ann", ".bwt", ".pac", ".sa"]]
        if not all(os.path.exists(x) for x in required_index):
            run_cmd(["bwa", "index", ref_fa])

        def process_sample(sample):
            r1 = os.path.join(split_clean_dir, f"{sample}_1P.fq.gz")
            r2 = os.path.join(split_clean_dir, f"{sample}_2P.fq.gz")
            if not (os.path.exists(r1) and os.path.exists(r2)):
                return False
            if os.path.getsize(r1) == 0 or os.path.getsize(r2) == 0:
                return False

            bam_path = group_bam_path(run_root, group_name, sample)
            bai_path = bam_path + ".bai"
            if resume and bam_index_is_current(bam_path, bai_path):
                return True

            cmd = f"""
            set -o pipefail
            bwa mem -a{profile_arg_text} -t {task_threads} "{ref_fa}" "{r1}" "{r2}" -R "@RG\\tID:{sample}\\tSM:{sample}\\tPL:ILLUMINA" | \\
            samtools view -@ {task_threads} -h -b -F 4 - | \\
            samtools sort -@ {task_threads} -o "{bam_path}" -
            samtools index -@ {task_threads} "{bam_path}"
            """
            run_cmd(cmd, shell=True)
            return True

        completed = 0
        total = len(sample_names)
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = {executor.submit(process_sample, sample): sample for sample in sample_names}
            for future in concurrent.futures.as_completed(futures):
                future.result()
                completed += 1
                print(f"BWA group {safe_group}: {completed}/{total} samples done", flush=True)


def parse_csv_values(raw_value, expected_count, caster, allow_none=False):
    if raw_value is None:
        return [None] * expected_count
    parts = [x.strip() for x in str(raw_value).split(",")]
    if len(parts) == 1:
        value = None if allow_none and parts[0] == "" else caster(parts[0])
        return [value] * expected_count
    if len(parts) != expected_count:
        raise ValueError(
            f"Expected either one value or {expected_count} comma-separated values, got: {raw_value}"
        )
    return [None if allow_none and x == "" else caster(x) for x in parts]


def load_named_sequences(sequence_inputs, default_prefix="seq", dedupe_by_sequence=True):
    if not sequence_inputs:
        return []
    loaded = []
    if isinstance(sequence_inputs, str):
        sequence_inputs = [sequence_inputs]
    for item in sequence_inputs:
        if os.path.exists(item):
            valid_ext = {".fa", ".fasta", ".fna", ".fas", ".txt"}
            if os.path.splitext(item)[1].lower() in valid_ext:
                fasta_records = read_fasta_records(item)
                if fasta_records:
                    for header, seq in fasta_records:
                        loaded.append({"name": header, "sequence": seq.replace("U", "T").upper()})
                    continue
            with open(item, "r", encoding="utf-8") as handle:
                for idx, raw_line in enumerate(handle, start=1):
                    line = raw_line.strip()
                    if not line or line.startswith(">"):
                        continue
                    loaded.append({"name": f"{os.path.basename(item)}:{idx}", "sequence": line.replace("U", "T").upper()})
        else:
            for idx, seq in enumerate(item.split(","), start=1):
                seq = seq.strip()
                if seq:
                    loaded.append({"name": f"{default_prefix}_{idx}", "sequence": seq.replace("U", "T").upper()})

    cleaned = []
    seen = set()
    for record in loaded:
        if set(record["sequence"]) - set("ACGTN"):
            raise ValueError(f"Sequence contains unsupported nucleotide characters: {record['sequence']}")
        if dedupe_by_sequence and record["sequence"] in seen:
            continue
        seen.add(record["sequence"])
        cleaned.append(record)
    return cleaned


def load_guides(guide_inputs, dedupe_by_sequence=True):
    cleaned = load_named_sequences(
        guide_inputs,
        default_prefix="guide",
        dedupe_by_sequence=dedupe_by_sequence,
    )
    if not cleaned:
        raise ValueError("No valid guide sequence was provided.")
    return cleaned


def default_cleavage_offset(editing_tool):
    """不同编辑工具的默认切割位点偏移。"""
    if editing_tool == "cas9":
        return -3
    if editing_tool == "cpf1":
        return 1
    if editing_tool == "base_editor":
        return 0
    if editing_tool == "prime_editor":
        return -3
    return None


def default_quant_window_center(editing_tool):
    """quantification window 的中心默认相对 cut site 的偏移。"""
    if editing_tool == "cas9":
        return -3
    if editing_tool == "cpf1":
        return 1
    if editing_tool == "base_editor":
        return -10
    if editing_tool == "prime_editor":
        return 0
    return None


def default_quant_window_size(editing_tool):
    """不同编辑工具默认窗口半径。"""
    if editing_tool == "cas9":
        return 10
    if editing_tool == "cpf1":
        return 10
    if editing_tool == "base_editor":
        return 10
    return None


def parse_quantification_window_coordinates(raw_value):
    if raw_value in (None, "", "None", "0"):
        return None
    positions = set()
    for block in str(raw_value).split("_"):
        block = block.strip()
        if not block:
            continue
        if "-" in block:
            start, end = block.split("-", 1)
            start_i = int(start)
            end_i = int(end)
            if end_i < start_i:
                start_i, end_i = end_i, start_i
            positions.update(range(start_i, end_i + 1))
        else:
            positions.add(int(block))
    return positions


def assign_guides_to_references(reference_records, guides):
    if len(guides) == 1:
        return {ref["name"]: deepcopy(guides[0]) for ref in reference_records}

    guide_by_name = {g["name"]: g for g in guides}
    assigned = {}
    for ref in reference_records:
        if ref["name"] in guide_by_name:
            assigned[ref["name"]] = deepcopy(guide_by_name[ref["name"]])
            continue
        group_name = derive_group_name(ref["name"])
        if group_name in guide_by_name:
            assigned[ref["name"]] = deepcopy(guide_by_name[group_name])

    if len(assigned) == len(reference_records):
        return assigned

    if len(guides) == len(reference_records):
        return {ref["name"]: deepcopy(guides[idx]) for idx, ref in enumerate(reference_records)}

    missing = [ref["name"] for ref in reference_records if ref["name"] not in assigned]
    raise ValueError("Could not map guide sequences to all references: " + ", ".join(missing))


def guide_group_key(guide_name):
    token = str(guide_name or "").strip()
    if "_" in token:
        return token.split("_", 1)[0]
    return token


def guide_record_matches_reference(ref, guide):
    guide_name = str(guide.get("name", ""))
    ref_name = ref["name"]
    group_name = derive_group_name(ref_name)
    guide_group = guide_group_key(guide_name)
    return guide_name == ref_name or guide_name == group_name or guide_group == ref_name or guide_group == group_name


def assign_multiple_guides_to_references(reference_records, guides):
    if len(guides) == 1:
        return {ref["name"]: [deepcopy(guides[0])] for ref in reference_records}
    assignments = {}
    missing = []
    for ref in reference_records:
        matched = [deepcopy(guide) for guide in guides if guide_record_matches_reference(ref, guide)]
        if matched:
            assignments[ref["name"]] = matched
        else:
            missing.append(ref["name"])
    if missing:
        raise ValueError("Could not map guide sequences to all references: " + ", ".join(missing))
    return assignments


def guide_match_in_reference(sequence, guide_seq):
    forward = sequence.find(guide_seq)
    if forward != -1:
        return {"strand": "+", "start": forward, "end": forward + len(guide_seq)}
    rev = reverse_complement(guide_seq)
    reverse = sequence.find(rev)
    if reverse != -1:
        return {"strand": "-", "start": reverse, "end": reverse + len(guide_seq)}

    best_match = None
    max_mismatches = max(2, len(guide_seq) // 5)
    for strand, candidate in [("+", guide_seq), ("-", rev)]:
        if len(candidate) > len(sequence):
            continue
        for start in range(0, len(sequence) - len(candidate) + 1):
            mismatches = 0
            window = sequence[start:start + len(candidate)]
            for a, b in zip(window, candidate):
                if a != b:
                    mismatches += 1
                    if mismatches > max_mismatches:
                        break
            if mismatches > max_mismatches:
                continue
            if best_match is None or mismatches < best_match["mismatches"]:
                best_match = {
                    "strand": strand,
                    "start": start,
                    "end": start + len(candidate),
                    "mismatches": mismatches,
                }
    if best_match is not None:
        return {k: best_match[k] for k in ("strand", "start", "end")}

    def bounded_edit_distance(seq_a, seq_b, max_distance):
        prev = list(range(len(seq_b) + 1))
        for i, char_a in enumerate(seq_a, start=1):
            curr = [i]
            row_min = curr[0]
            for j, char_b in enumerate(seq_b, start=1):
                cost = 0 if char_a == char_b else 1
                value = min(
                    prev[j] + 1,
                    curr[j - 1] + 1,
                    prev[j - 1] + cost,
                )
                curr.append(value)
                if value < row_min:
                    row_min = value
            if row_min > max_distance:
                return max_distance + 1
            prev = curr
        return prev[-1]

    best_indel_match = None
    max_distance = max(2, len(guide_seq) // 5)
    for strand, candidate in [("+", guide_seq), ("-", rev)]:
        min_len = max(1, len(candidate) - max_distance)
        max_len = min(len(sequence), len(candidate) + max_distance)
        for window_len in range(min_len, max_len + 1):
            for start in range(0, len(sequence) - window_len + 1):
                window = sequence[start:start + window_len]
                distance = bounded_edit_distance(window, candidate, max_distance)
                if distance > max_distance:
                    continue
                if best_indel_match is None or distance < best_indel_match["distance"]:
                    best_indel_match = {
                        "strand": strand,
                        "start": start,
                        "end": start + window_len,
                        "distance": distance,
                    }
    if best_indel_match is not None:
        return {k: best_indel_match[k] for k in ("strand", "start", "end")}
    return None


def find_all_exact_matches(sequence, query):
    matches = []
    if not sequence or not query:
        return matches
    start = sequence.find(query)
    while start != -1:
        matches.append({"start": start, "end": start + len(query)})
        start = sequence.find(query, start + 1)
    return matches


def direct_spacer_has_ngg_pam(reference, match):
    pam = reference[match["end"]:match["end"] + 3]
    return len(pam) == 3 and pam[1:] == "GG" and not (set(pam) - set("ACGTN"))


def reverse_spacer_has_ccn_pam(reference, match):
    pam = reference[max(0, match["start"] - 3):match["start"]]
    return len(pam) == 3 and pam[:2] == "CC" and not (set(pam) - set("ACGTN"))


def prime_orientation_payload(reference, reference_match, strand, resolved_by):
    reference_len = len(reference)
    match_on_reference = {
        "strand": strand,
        "start": int(reference_match["start"]),
        "end": int(reference_match["end"]),
    }
    if strand == "-":
        work_match = {
            "strand": "+",
            "start": reference_len - match_on_reference["end"],
            "end": reference_len - match_on_reference["start"],
        }
    else:
        work_match = {
            "strand": "+",
            "start": match_on_reference["start"],
            "end": match_on_reference["end"],
        }
    return {
        "pe_reference_strand": strand,
        "reference_needs_rc_for_pe_work": strand == "-",
        "spacer_match_on_reference": match_on_reference,
        "spacer_match_on_work_reference": work_match,
        "orientation_resolved_by": resolved_by,
    }


def resolve_prime_editing_orientation(reference_sequence, spacer_sequence):
    """
    Resolve whether the reference is in pegRNA/NGG orientation or the opposite
    orientation. Exact spacer/RC-spacer hits are primary evidence; PAM context
    is only used when exact hits are ambiguous.
    """
    reference = _clean_read_sequence(reference_sequence)
    spacer = _clean_read_sequence(spacer_sequence)
    if not reference or not spacer:
        raise ValueError("Prime editing spacer orientation cannot be resolved without reference and spacer sequence")

    spacer_rc = reverse_complement(spacer)
    direct_matches = find_all_exact_matches(reference, spacer)
    rc_matches = find_all_exact_matches(reference, spacer_rc)
    total_exact = len(direct_matches) + len(rc_matches)

    if total_exact == 1:
        if direct_matches:
            return prime_orientation_payload(reference, direct_matches[0], "+", "exact_spacer")
        return prime_orientation_payload(reference, rc_matches[0], "-", "exact_spacer_rc")

    if total_exact > 1:
        pam_candidates = []
        for match in direct_matches:
            if direct_spacer_has_ngg_pam(reference, match):
                pam_candidates.append(("+", match))
        for match in rc_matches:
            if reverse_spacer_has_ccn_pam(reference, match):
                pam_candidates.append(("-", match))
        if len(pam_candidates) == 1:
            strand, match = pam_candidates[0]
            return prime_orientation_payload(reference, match, strand, "pam_context")
        raise ValueError(
            "Prime editing spacer orientation is ambiguous; spacer and/or reverse-complement spacer "
            "matched multiple positions and PAM context did not identify a unique target"
        )

    fuzzy_match = guide_match_in_reference(reference, spacer)
    if fuzzy_match is None:
        raise ValueError("Prime editing spacer orientation could not be resolved from spacer or reverse-complement spacer")
    return prime_orientation_payload(
        reference,
        fuzzy_match,
        fuzzy_match["strand"],
        "fuzzy_guide_match",
    )


def pe_work_reference(reference_sequence, pe_orientation):
    reference = _clean_read_sequence(reference_sequence)
    if pe_orientation.get("reference_needs_rc_for_pe_work"):
        return reverse_complement(reference)
    return reference


def map_work_pos_to_reference(pos, reference_len, pe_orientation):
    if pe_orientation.get("reference_needs_rc_for_pe_work"):
        return int(reference_len) - 1 - int(pos)
    return int(pos)


def map_reference_pos_to_work(pos, reference_len, pe_orientation):
    if pe_orientation.get("reference_needs_rc_for_pe_work"):
        return int(reference_len) - 1 - int(pos)
    return int(pos)


def map_work_interval_to_reference(start, end, reference_len, pe_orientation):
    start = int(start)
    end = int(end)
    if pe_orientation.get("reference_needs_rc_for_pe_work"):
        return int(reference_len) - end, int(reference_len) - start
    return start, end


def compute_cut_boundary(guide_match, guide_len, offset_from_guide_3prime):
    if guide_match["strand"] == "+":
        return guide_match["start"] + guide_len + offset_from_guide_3prime - 1
    return guide_match["start"] - offset_from_guide_3prime - 1


def build_window_positions(sequence_length, boundary, window_size):
    if window_size is None:
        return set()
    if window_size <= 0:
        return set(range(sequence_length))
    start = max(0, boundary - window_size + 1)
    end = min(sequence_length - 1, boundary + window_size)
    return set(range(start, end + 1))


def alignment_key_sort(key):
    if key[0] == "ins":
        return (key[1], 0, key[2])
    return (key[1], 1, 0)


def feature_key_label(key):
    if key[0] == "base":
        return f"pos_{key[1] + 1}"
    return f"ins_after_{key[1] + 1}_{key[2] + 1}"


def needleman_wunsch(seq_a, seq_b, match_score=2, mismatch_score=-1, gap_score=-2):
    len_a = len(seq_a)
    len_b = len(seq_b)
    score = [[0] * (len_b + 1) for _ in range(len_a + 1)]
    trace = [[None] * (len_b + 1) for _ in range(len_a + 1)]

    for i in range(1, len_a + 1):
        score[i][0] = score[i - 1][0] + gap_score
        trace[i][0] = "U"
    for j in range(1, len_b + 1):
        score[0][j] = score[0][j - 1] + gap_score
        trace[0][j] = "L"

    for i in range(1, len_a + 1):
        for j in range(1, len_b + 1):
            diag = score[i - 1][j - 1] + (match_score if seq_a[i - 1] == seq_b[j - 1] else mismatch_score)
            up = score[i - 1][j] + gap_score
            left = score[i][j - 1] + gap_score
            best = max(diag, up, left)
            score[i][j] = best
            if best == diag:
                trace[i][j] = "D"
            elif best == up:
                trace[i][j] = "U"
            else:
                trace[i][j] = "L"

    aligned_a = []
    aligned_b = []
    i = len_a
    j = len_b
    while i > 0 or j > 0:
        move = trace[i][j]
        if move == "D":
            aligned_a.append(seq_a[i - 1])
            aligned_b.append(seq_b[j - 1])
            i -= 1
            j -= 1
        elif move == "U":
            aligned_a.append(seq_a[i - 1])
            aligned_b.append("-")
            i -= 1
        else:
            aligned_a.append("-")
            aligned_b.append(seq_b[j - 1])
            j -= 1
    return "".join(reversed(aligned_a)), "".join(reversed(aligned_b))


def affine_semiglobal_align_read_to_reference_slice(
    read_seq,
    ref_seq,
    match_score=2,
    mismatch_score=-3,
    gap_open_score=-6,
    gap_extend_score=-1,
):
    """Align every read base to any reference-slice interval with affine gaps."""
    read_len = len(read_seq)
    ref_len = len(ref_seq)
    if not read_len or not ref_len:
        return "", "", 0

    negative_infinity = -10 ** 12
    match_matrix = [[negative_infinity] * (ref_len + 1) for _ in range(read_len + 1)]
    read_gap_matrix = [[negative_infinity] * (ref_len + 1) for _ in range(read_len + 1)]
    ref_gap_matrix = [[negative_infinity] * (ref_len + 1) for _ in range(read_len + 1)]
    match_trace = [[None] * (ref_len + 1) for _ in range(read_len + 1)]
    read_gap_trace = [[None] * (ref_len + 1) for _ in range(read_len + 1)]
    ref_gap_trace = [[None] * (ref_len + 1) for _ in range(read_len + 1)]

    # Leading/trailing reference bases are free; every read base is aligned.
    for ref_index in range(ref_len + 1):
        match_matrix[0][ref_index] = 0
    for read_index in range(1, read_len + 1):
        read_gap_matrix[read_index][0] = gap_open_score + (read_index - 1) * gap_extend_score
        read_gap_trace[read_index][0] = "I" if read_index > 1 else "M"

    for read_index in range(1, read_len + 1):
        for ref_index in range(1, ref_len + 1):
            previous_score, previous_state = max(
                (
                    (match_matrix[read_index - 1][ref_index - 1], "M"),
                    (read_gap_matrix[read_index - 1][ref_index - 1], "I"),
                    (ref_gap_matrix[read_index - 1][ref_index - 1], "D"),
                ),
                key=lambda item: item[0],
            )
            match_matrix[read_index][ref_index] = previous_score + (
                match_score if read_seq[read_index - 1] == ref_seq[ref_index - 1] else mismatch_score
            )
            match_trace[read_index][ref_index] = previous_state

            read_gap_matrix[read_index][ref_index], read_gap_trace[read_index][ref_index] = max(
                (
                    (match_matrix[read_index - 1][ref_index] + gap_open_score, "M"),
                    (read_gap_matrix[read_index - 1][ref_index] + gap_extend_score, "I"),
                    (ref_gap_matrix[read_index - 1][ref_index] + gap_open_score, "D"),
                ),
                key=lambda item: item[0],
            )
            ref_gap_matrix[read_index][ref_index], ref_gap_trace[read_index][ref_index] = max(
                (
                    (match_matrix[read_index][ref_index - 1] + gap_open_score, "M"),
                    (ref_gap_matrix[read_index][ref_index - 1] + gap_extend_score, "D"),
                    (read_gap_matrix[read_index][ref_index - 1] + gap_open_score, "I"),
                ),
                key=lambda item: item[0],
            )

    _, state, ref_index = max(
        (
            (match_matrix[read_len][index], "M", index)
            for index in range(ref_len + 1)
        ),
        key=lambda item: item[0],
    )
    for matrix, candidate_state in ((read_gap_matrix, "I"), (ref_gap_matrix, "D")):
        candidate = max(
            ((matrix[read_len][index], candidate_state, index) for index in range(ref_len + 1)),
            key=lambda item: item[0],
        )
        if candidate[0] > _:
            _, state, ref_index = candidate

    aligned_read = []
    aligned_ref = []
    read_index = read_len
    while read_index > 0:
        if state == "M":
            aligned_read.append(read_seq[read_index - 1])
            aligned_ref.append(ref_seq[ref_index - 1])
            state = match_trace[read_index][ref_index]
            read_index -= 1
            ref_index -= 1
        elif state == "I":
            aligned_read.append(read_seq[read_index - 1])
            aligned_ref.append("-")
            state = read_gap_trace[read_index][ref_index]
            read_index -= 1
        else:
            aligned_read.append("-")
            aligned_ref.append(ref_seq[ref_index - 1])
            state = ref_gap_trace[read_index][ref_index]
            ref_index -= 1

    return "".join(reversed(aligned_read)), "".join(reversed(aligned_ref)), ref_index


def semi_global_overlap_identity(seq_a, seq_b, match_score=2, mismatch_score=-1, gap_score=-2):
    """
    Semi-global overlap alignment: penalize terminal gaps in seq_a only.

    Returns (aligned_overlap_len, matches, overlap_identity) where:
    - aligned_overlap_len: number of aligned positions (both non-gap)
    - matches: number of matching positions
    - overlap_identity: matches / aligned_overlap_len (0.0 if no overlap)

    Designed for adapter/bridge matching against clip sequences.
    """
    len_a = len(seq_a)
    len_b = len(seq_b)

    if len_a == 0 or len_b == 0:
        return 0, 0, 0.0

    # DP matrix
    score = [[0] * (len_b + 1) for _ in range(len_a + 1)]

    # Semi-global: no penalty for starting anywhere in seq_b (row 0 stays 0)
    # But full penalty for gaps in seq_a (column 0)
    for i in range(1, len_a + 1):
        score[i][0] = score[i - 1][0] + gap_score

    # Fill DP
    for i in range(1, len_a + 1):
        for j in range(1, len_b + 1):
            diag = score[i - 1][j - 1] + (match_score if seq_a[i - 1] == seq_b[j - 1] else mismatch_score)
            up = score[i - 1][j] + gap_score
            left = score[i][j - 1] + gap_score
            score[i][j] = max(diag, up, left)

    # Traceback: find best end position in seq_b
    best_j = max(range(1, len_b + 1), key=lambda j: score[len_a][j])

    # Traceback from (len_a, best_j)
    aligned_a = []
    aligned_b = []
    i, j = len_a, best_j
    while i > 0 and j > 0:
        diag_val = score[i - 1][j - 1] + (match_score if seq_a[i - 1] == seq_b[j - 1] else mismatch_score)
        if score[i][j] == diag_val:
            aligned_a.append(seq_a[i - 1])
            aligned_b.append(seq_b[j - 1])
            i -= 1
            j -= 1
        elif score[i][j] == score[i - 1][j] + gap_score:
            aligned_a.append(seq_a[i - 1])
            aligned_b.append("-")
            i -= 1
        else:
            aligned_a.append("-")
            aligned_b.append(seq_b[j - 1])
            j -= 1

    aligned_a.reverse()
    aligned_b.reverse()

    # Count aligned positions and matches
    aligned_pairs = 0
    match_count = 0
    for a, b in zip(aligned_a, aligned_b):
        if a != "-" and b != "-":
            aligned_pairs += 1
            if a == b:
                match_count += 1

    if aligned_pairs == 0:
        return 0, 0, 0.0

    overlap_identity = match_count / aligned_pairs
    return aligned_pairs, match_count, overlap_identity


def _has_shared_softclip_seed(seq_a, seq_b, min_overlap):
    # Use a conservative 1-base seed so legacy adapter/bridge decisions stay unchanged.
    seed_size = min(
        len(seq_a),
        len(seq_b),
        1,
    )
    if seed_size <= 0:
        return False
    kmers_a = {seq_a[i:i + seed_size] for i in range(0, len(seq_a) - seed_size + 1)}
    return any(seq_b[i:i + seed_size] in kmers_a for i in range(0, len(seq_b) - seed_size + 1))


def match_clip_against_known_sequences(
    clip_seq,
    known_sequences,
    min_overlap=ADAPTER_MIN_OVERLAP,
    min_identity=ADAPTER_OVERLAP_IDENTITY,
    match_cache=None,
):
    """
    Check if a clip sequence matches any known adapter or bridge sequence.

    Returns (is_match, matched_sequence, overlap_len, overlap_identity) if matched,
    or (False, None, 0, 0.0) if no match.
    """
    clip_upper = str(clip_seq or "").upper()
    if len(clip_upper) < min_overlap:
        return False, None, 0, 0.0
    if match_cache is None:
        match_cache = {}

    for known_seq in known_sequences:
        known_upper = str(known_seq or "").upper()
        if len(known_upper) < min_overlap:
            continue
        cache_key = (clip_upper, known_upper, min_overlap, float(min_identity))
        if cache_key in match_cache:
            cached_match, cached_overlap, cached_identity = match_cache[cache_key]
            if cached_match:
                return True, known_seq, cached_overlap, cached_identity
            continue

        if known_upper in clip_upper:
            overlap_len = len(known_upper)
            match_cache[cache_key] = (True, overlap_len, 1.0)
            return True, known_seq, overlap_len, 1.0
        if clip_upper in known_upper:
            overlap_len = len(clip_upper)
            match_cache[cache_key] = (True, overlap_len, 1.0)
            return True, known_seq, overlap_len, 1.0

        if not _has_shared_softclip_seed(clip_upper, known_upper, min_overlap):
            match_cache[cache_key] = (False, 0, 0.0)
            continue

        overlap_len, matches, identity = semi_global_overlap_identity(clip_upper, known_upper)
        if overlap_len >= min_overlap and identity >= min_identity:
            match_cache[cache_key] = (True, overlap_len, identity)
            return True, known_seq, overlap_len, identity
        match_cache[cache_key] = (False, overlap_len, identity)
    return False, None, 0, 0.0


def _shannon_entropy(seq):
    """Compute Shannon entropy of a nucleotide sequence."""
    if not seq:
        return 0.0
    counts = Counter(seq.upper())
    total = len(seq)
    import math
    entropy = 0.0
    for count in counts.values():
        if count > 0:
            freq = count / total
            entropy -= freq * math.log2(freq)
    return entropy


def _has_homopolymer_run(seq, min_run=HOMOPOLYMER_RUN_THRESHOLD):
    """Check if sequence contains a homopolymer run >= min_run bp."""
    if len(seq) < min_run:
        return False
    current_base = seq[0].upper()
    run_len = 1
    for base in seq[1:]:
        if base.upper() == current_base:
            run_len += 1
            if run_len >= min_run:
                return True
        else:
            current_base = base.upper()
            run_len = 1
    return False


def _has_dinucleotide_repeat(seq, min_cycles=DINUCLEOTIDE_REPEAT_CYCLES):
    """Check if sequence contains a dinucleotide repeat >= min_cycles."""
    if len(seq) < min_cycles * 2:
        return False
    seq_upper = seq.upper()
    for start in range(len(seq_upper) - min_cycles * 2 + 1):
        pattern = seq_upper[start:start + 2]
        if pattern[0] == pattern[1]:
            continue
        cycles = 1
        pos = start + 2
        while pos + 1 < len(seq_upper) and seq_upper[pos:pos + 2] == pattern:
            cycles += 1
            pos += 2
        if cycles >= min_cycles:
            return True
    return False


def filter_softclip_segments(softclip_segments, match_cache=None):
    """
    Apply the V8.6 soft-clip exclusion pipeline to each segment.

    Modifies segments in-place, setting filter_status and filter_reason.
    Returns counts of excluded clips by category.
    """
    counts = {
        "too_short_clip": 0,
        "low_quality_clip": 0,
        "poly_clip": 0,
        "low_complexity_clip": 0,
        "adapter_bridge_clip": 0,
        "passed_clip": 0,
    }

    if match_cache is None:
        match_cache = {}

    for seg in softclip_segments:
        clip_seq = seg.get("clip_seq", "")
        clip_len = len(clip_seq)

        # Step 1: too_short
        if clip_len < MIN_CLIP_LENGTH:
            counts["too_short_clip"] += 1
            seg["filter_status"] = "excluded"
            seg["filter_reason"] = "too_short"
            seg["softclip_event_class"] = None
            continue

        # Step 2: low quality
        if seg.get("avg_quality", 0) < MIN_CLIP_QUALITY:
            counts["low_quality_clip"] += 1
            seg["filter_status"] = "excluded"
            seg["filter_reason"] = "low_quality"
            seg["softclip_event_class"] = None
            continue

        # Step 3: polyG / polyA
        upper_seq = clip_seq.upper()
        g_count = upper_seq.count("G")
        a_count = upper_seq.count("A")
        if g_count / clip_len >= POLY_FRACTION_THRESHOLD:
            counts["poly_clip"] += 1
            seg["filter_status"] = "excluded"
            seg["filter_reason"] = "polyG"
            seg["softclip_event_class"] = None
            continue
        if a_count / clip_len >= POLY_FRACTION_THRESHOLD:
            counts["poly_clip"] += 1
            seg["filter_status"] = "excluded"
            seg["filter_reason"] = "polyA"
            seg["softclip_event_class"] = None
            continue

        # Step 4: low_complexity (only for clip_len >= 8)
        if clip_len >= LOW_COMPLEXITY_MIN_LENGTH:
            entropy = _shannon_entropy(clip_seq)
            if entropy < SHANNON_ENTROPY_THRESHOLD:
                counts["low_complexity_clip"] += 1
                seg["filter_status"] = "excluded"
                seg["filter_reason"] = "low_complexity"
                seg["softclip_event_class"] = None
                continue
            if _has_homopolymer_run(upper_seq):
                counts["low_complexity_clip"] += 1
                seg["filter_status"] = "excluded"
                seg["filter_reason"] = "low_complexity"
                seg["softclip_event_class"] = None
                continue
            if _has_dinucleotide_repeat(upper_seq):
                counts["low_complexity_clip"] += 1
                seg["filter_status"] = "excluded"
                seg["filter_reason"] = "low_complexity"
                seg["softclip_event_class"] = None
                continue

        # Step 5: adapter / bridge matching
        is_adapter, matched_seq, overlap_len, overlap_id = match_clip_against_known_sequences(
            clip_seq, KNOWN_ADAPTERS, match_cache=match_cache
        )
        if not is_adapter:
            is_adapter, matched_seq, overlap_len, overlap_id = match_clip_against_known_sequences(
                clip_seq, KNOWN_BRIDGE, match_cache=match_cache
            )
        if is_adapter:
            counts["adapter_bridge_clip"] += 1
            seg["filter_status"] = "excluded"
            seg["filter_reason"] = "adapter" if matched_seq in KNOWN_ADAPTERS else "bridge"
            seg["softclip_event_class"] = None
            continue

        # Step 6: Passed
        counts["passed_clip"] += 1
        seg["filter_status"] = "passed"
        seg["filter_reason"] = None
        seg["softclip_event_class"] = "insertion_candidate"

    return counts


def classify_softclip_segments(softclip_segments, window_positions):
    """
    Classify each passed insertion_candidate as window or outside-window.

    Modifies segments in-place. Only segments with softclip_event_class
    == 'insertion_candidate' are classified.
    """
    counts = {
        "window_insertion_candidate": 0,
        "outside_window_insertion_candidate": 0,
    }

    if not window_positions:
        for seg in softclip_segments:
            if seg.get("softclip_event_class") == "insertion_candidate":
                seg["softclip_region"] = "outside_window"
                seg["softclip_event_class"] = "outside_window_insertion_candidate"
                counts["outside_window_insertion_candidate"] += 1
        return counts

    for seg in softclip_segments:
        if seg.get("softclip_event_class") != "insertion_candidate":
            continue
        anchor = seg.get("anchor_ref_pos")
        if anchor is not None and anchor in window_positions:
            seg["softclip_region"] = "window"
            seg["softclip_event_class"] = "window_insertion_candidate"
            counts["window_insertion_candidate"] += 1
        else:
            seg["softclip_region"] = "outside_window"
            seg["softclip_event_class"] = "outside_window_insertion_candidate"
            counts["outside_window_insertion_candidate"] += 1

    return counts


def build_pairwise_key_maps(anchor_seq, other_seq):
    anchor_aln, other_aln = needleman_wunsch(anchor_seq, other_seq)
    current_anchor = -1
    current_other = -1
    insertion_counters = defaultdict(int)
    other_map = {}

    for base_anchor, base_other in zip(anchor_aln, other_aln):
        if base_anchor != "-":
            current_anchor += 1
            key = ("base", current_anchor)
            if base_other != "-":
                current_other += 1
                other_map[key] = {"state": base_other, "coord_kind": "base", "coord_pos": current_other}
            else:
                other_map[key] = {"state": "-", "coord_kind": "gap", "coord_pos": None}
        else:
            ins_idx = insertion_counters[current_anchor]
            insertion_counters[current_anchor] += 1
            key = ("ins", current_anchor, ins_idx)
            if base_other != "-":
                current_other += 1
                other_map[key] = {"state": base_other, "coord_kind": "base", "coord_pos": current_other}
            else:
                other_map[key] = {"state": "-", "coord_kind": "gap", "coord_pos": None}
    return other_map


def key_overlaps_window(key, window_positions):
    if key[0] == "base":
        return key[1] in window_positions
    return key[1] in window_positions or (key[1] + 1) in window_positions


def key_within_terminal_region(key, ref_length, flank_size=100):
    if ref_length <= flank_size * 2:
        return True
    anchor_pos = key[1]
    return anchor_pos < flank_size or anchor_pos >= ref_length - flank_size


def build_unique_kmer_tags(reference_records, k=HOMOEOLOG_KMER_SIZE):
    kmer_to_refs = defaultdict(set)
    for ref in reference_records:
        seq = ref["sequence"].upper()
        if len(seq) < k:
            continue
        for start in range(0, len(seq) - k + 1):
            kmer = seq[start:start + k]
            if set(kmer) <= DNA_BASES:
                kmer_to_refs[kmer].add(ref["name"])

    tags_by_ref = defaultdict(list)
    for kmer, ref_names in kmer_to_refs.items():
        if len(ref_names) == 1:
            tags_by_ref[next(iter(ref_names))].append(kmer)
    return {ref["name"]: sorted(tags_by_ref.get(ref["name"], [])) for ref in reference_records}


def build_snp_tag_sites(reference_records, informative_sites, features_by_ref):
    features_by_ref_site = {
        ref_name: {feature["site_id"]: feature for feature in features}
        for ref_name, features in features_by_ref.items()
    }
    tags_by_ref = defaultdict(list)
    for site in informative_sites:
        state_counts = Counter(
            state for state in site["states"].values()
            if isinstance(state, str) and state.upper() in DNA_BASES
        )
        for ref in reference_records:
            ref_name = ref["name"]
            state = site["states"].get(ref_name)
            if not isinstance(state, str):
                continue
            state = state.upper()
            if state not in DNA_BASES or state_counts[state] != 1:
                continue
            feature = features_by_ref_site.get(ref_name, {}).get(site["site_id"])
            if not feature:
                continue
            tags_by_ref[ref_name].append({
                "site_id": site["site_id"],
                "coord_pos": feature["coord_pos"],
                "expected_state": state,
                "overlaps_window": feature.get("overlaps_window", False),
            })
    return {ref["name"]: tags_by_ref.get(ref["name"], []) for ref in reference_records}


def compute_distance_to_cut(anchor_pos, ref_contexts, ref_names):
    """Compute minimum distance from a position to any cut boundary."""
    min_dist = float("inf")
    for ref_name in ref_names:
        cut = ref_contexts[ref_name].get("cut_boundary")
        if cut is None:
            continue
        dist = abs(anchor_pos - cut)
        if dist < min_dist:
            min_dist = dist
    return min_dist if min_dist != float("inf") else None


def classify_tag_type(states):
    """Classify an informative site as SNP_TAG, DEL_TAG, or INS_TAG."""
    states_upper = {k: str(v).upper() for k, v in states.items()}
    unique_values = set(states_upper.values())
    if len(unique_values) <= 1:
        return None

    non_gap = {v for v in unique_values if v != "-"}

    if "-" in unique_values:
        if len(non_gap) == 1:
            # All non-gap refs have the same base → true deletion/insertion difference
            return "DEL_TAG"
        else:
            # Multiple different non-gap bases → SNP with a gap in one ref
            return "SNP_TAG"

    all_bases = all(len(v) == 1 and v in "ACGT" for v in unique_values)
    if all_bases:
        return "SNP_TAG"
    return None


def precompute_site_state_to_refs(group_model):
    """Build a JSON-safe safe-tag state-to-reference index for composite assignment."""
    ref_names = list(group_model.get("reference_names") or [])
    safe_tags = group_model.get("safe_tags_by_ref")
    if not ref_names or not isinstance(safe_tags, dict):
        raise ValueError("group_model is missing reference_names or safe_tags_by_ref")
    if set(safe_tags) - set(ref_names):
        raise ValueError("group_model reference_names do not cover safe-tag references")
    tag_collections = [safe_tags.get(ref_name, []) for ref_name in ref_names]
    if tag_collections and not any(isinstance(tags, list) for tags in tag_collections):
        raise ValueError("group_model safe tag collections are not parseable")

    by_site = {}
    exclusion_radius = float(group_model.get("tag_exclusion_radius", 10) or 0)
    for ref_name in ref_names:
        tags = safe_tags.get(ref_name, [])
        if not isinstance(tags, list):
            continue
        for tag in tags:
            if not isinstance(tag, dict):
                continue
            site_id = tag.get("site_id")
            states = tag.get("states_by_ref")
            if not site_id or not isinstance(states, dict):
                continue
            distance_to_cut = tag.get("distance_to_cut")
            if tag.get("overlaps_window"):
                continue
            if distance_to_cut is not None and float(distance_to_cut) <= exclusion_radius:
                continue
            normalized_states = {
                name: str(states.get(name, "")).upper()
                for name in ref_names
            }
            entry = by_site.setdefault(site_id, {
                "site_id": site_id,
                "type": tag.get("type"),
                "anchor_key": tag.get("anchor_key"),
                "coord_by_ref": dict(tag.get("coord_by_ref") or {}),
                "overlaps_window": bool(tag.get("overlaps_window", False)),
                "distance_to_cut": distance_to_cut,
                "states_by_ref": normalized_states,
            })
            state_to_refs = defaultdict(list)
            for name, state in entry["states_by_ref"].items():
                if state in DNA_BASES or state == "-":
                    state_to_refs[state].append(name)
            entry["state_to_refs"] = {
                state: sorted(set(names))
                for state, names in state_to_refs.items()
            }

    group_model["state_to_refs_by_site"] = by_site
    return group_model


def build_variant_tags(group_models, ref_contexts, tag_exclusion_radius=10):
    """
    Build variant tags (SNP_TAG, DEL_TAG, INS_TAG) from group model informative sites.

    A tag is 'safe' for hard assignment only if:
    - overlaps_window == False
    - distance_to_cut > tag_exclusion_radius
    """
    for group_name, model in group_models.items():
        ref_names = model["reference_names"]
        safe_tags_by_ref = defaultdict(list)
        window_tags_by_ref = defaultdict(list)

        for site in model["informative_sites"]:
            states = site["states"]
            tag_type = classify_tag_type(states)
            if tag_type is None:
                continue

            site_id = site["site_id"]
            anchor_key = site["anchor_key"]
            if site_id.startswith("ins_"):
                tag_type = "INS_TAG"

            overlaps_window = site.get("overlaps_window", False)
            anchor_pos = anchor_key[1] if isinstance(anchor_key, tuple) else None
            distance_to_cut = compute_distance_to_cut(anchor_pos, ref_contexts, ref_names) if anchor_pos is not None else None
            is_safe = (
                not overlaps_window
                and (distance_to_cut is None or distance_to_cut > tag_exclusion_radius)
            )

            coord_by_ref = {}
            for ref_name in ref_names:
                features = model.get("features_by_ref", {}).get(ref_name, [])
                for feat in features:
                    if feat["site_id"] == site_id:
                        coord_by_ref[ref_name] = feat["coord_pos"]
                        break

            tag_entry = {
                "site_id": site_id,
                "type": tag_type,
                "anchor_key": anchor_key,
                "states_by_ref": dict(states),
                "coord_by_ref": coord_by_ref,
                "overlaps_window": overlaps_window,
                "distance_to_cut": distance_to_cut,
            }

            if is_safe:
                for ref_name in ref_names:
                    expected_state = str(states.get(ref_name, "-")).upper()
                    safe_tags_by_ref[ref_name].append({**tag_entry, "expected_state": expected_state})
            else:
                for ref_name in ref_names:
                    expected_state = str(states.get(ref_name, "-")).upper()
                    window_tags_by_ref[ref_name].append({**tag_entry, "expected_state": expected_state})

        model["safe_tags_by_ref"] = dict(safe_tags_by_ref)
        model["window_tags_by_ref"] = dict(window_tags_by_ref)
        model["tag_sites_by_ref"] = dict(safe_tags_by_ref)
        model["tag_exclusion_radius"] = tag_exclusion_radius
        precompute_site_state_to_refs(model)

    return group_models


def build_group_models(reference_records, ref_contexts, disable_homoeolog_analysis=False, tag_exclusion_radius=10):
    grouped = defaultdict(list)
    for ref in reference_records:
        group_key = ref["name"] if disable_homoeolog_analysis else derive_group_name(ref["name"])
        grouped[group_key].append(ref)

    models = {}
    for group_name, refs in grouped.items():
        refs = sorted(refs, key=lambda x: x["name"])
        anchor = next((ref for ref in refs if ref["name"].upper().endswith("_A")), refs[0])
        is_homoeolog_group = len(refs) > 1 and all(is_homoeolog_reference_name(ref["name"]) for ref in refs)

        anchor_map = {
            ("base", idx): {"state": base, "coord_kind": "base", "coord_pos": idx}
            for idx, base in enumerate(anchor["sequence"])
        }
        per_ref_maps = {anchor["name"]: anchor_map}
        all_keys = set(anchor_map.keys())

        for ref in refs:
            if ref["name"] == anchor["name"]:
                continue
            ref_map = build_pairwise_key_maps(anchor["sequence"], ref["sequence"])
            per_ref_maps[ref["name"]] = ref_map
            all_keys.update(ref_map.keys())

        informative_sites = []
        features_by_ref = defaultdict(list)
        site_id_by_ref_coord = defaultdict(dict)
        anchor_window = ref_contexts[anchor["name"]]["window_positions"]
        for key in sorted(all_keys, key=alignment_key_sort):
            states = {}
            for ref in refs:
                state_info = per_ref_maps[ref["name"]].get(key, {"state": "-", "coord_kind": "gap", "coord_pos": None})
                states[ref["name"]] = state_info["state"]
            if len(set(states.values())) <= 1:
                continue
            if not is_homoeolog_group and key_overlaps_window(key, anchor_window):
                continue
            if not key_within_terminal_region(key, anchor["length"], flank_size=100):
                continue

            informative_sites.append({
                "site_id": feature_key_label(key),
                "anchor_key": key,
                "overlaps_window": key_overlaps_window(key, anchor_window),
                "states": deepcopy(states),
            })
            for ref in refs:
                state_info = per_ref_maps[ref["name"]].get(key, {"state": "-", "coord_kind": "gap", "coord_pos": None})
                if state_info["coord_kind"] == "gap":
                    continue
                features_by_ref[ref["name"]].append({
                    "site_id": feature_key_label(key),
                    "coord_pos": state_info["coord_pos"],
                    "expected_state": state_info["state"],
                    "overlaps_window": key_overlaps_window(key, anchor_window),
                })
                site_id_by_ref_coord[ref["name"]][state_info["coord_pos"]] = feature_key_label(key)

        snp_tag_sites_by_ref = build_snp_tag_sites(refs, informative_sites, features_by_ref)
        unique_kmer_tags_by_ref = build_unique_kmer_tags(refs)

        models[group_name] = {
            "group_name": group_name,
            "reference_names": [ref["name"] for ref in refs],
            "anchor_name": anchor["name"],
            "is_homoeolog_group": is_homoeolog_group,
            "informative_sites": informative_sites,
            "features_by_ref": dict(features_by_ref),
            "snp_tag_sites_by_ref": snp_tag_sites_by_ref,
            "unique_kmer_tags_by_ref": unique_kmer_tags_by_ref,
            "site_id_by_ref_coord": {ref_name: dict(value) for ref_name, value in site_id_by_ref_coord.items()},
        }
    models = build_variant_tags(models, ref_contexts, tag_exclusion_radius=tag_exclusion_radius)
    return models


def assign_named_sequences_to_references(reference_records, loaded_sequences, label):
    if not loaded_sequences:
        return {}
    return assign_guides_to_references(reference_records, loaded_sequences)


def apply_alignment_to_sequence(reference_sequence, aligned_ref, aligned_alt):
    output = []
    ref_index = 0
    for ref_base, alt_base in zip(aligned_ref, aligned_alt):
        if ref_base != "-":
            ref_index += 1
        if ref_base == "-" and alt_base != "-":
            output.append(alt_base)
            continue
        if alt_base == "-":
            continue
        output.append(alt_base)
    return "".join(output)


def alignment_score_from_aligned(aligned_a, aligned_b, match_score=2, mismatch_score=-1, gap_score=-2):
    score = 0
    for base_a, base_b in zip(aligned_a, aligned_b):
        if base_a == "-" or base_b == "-":
            score += gap_score
        elif base_a == base_b:
            score += match_score
        else:
            score += mismatch_score
    return score


def best_reference_span_for_query(query_sequence, reference_sequence):
    """
    Find the reference span best replaced by a short query sequence.

    CRISPResso2 builds the Prime-edited reference by aligning the pegRNA
    extension DNA to the amplicon, then replacing the aligned amplicon span
    with the full extension. This helper keeps that behavior local and
    dependency-free for HiDOG context construction.
    """
    query = _clean_read_sequence(query_sequence)
    reference = _clean_read_sequence(reference_sequence)
    if not query or not reference:
        return None

    span_slop = max(20, len(query) // 2)
    min_window = max(1, len(query) - span_slop)
    max_window = min(len(reference), len(query) + span_slop)

    best = None
    for start in range(0, len(reference)):
        for end in range(start + min_window, min(len(reference), start + max_window) + 1):
            window = reference[start:end]
            aligned_query, aligned_ref = needleman_wunsch(query, window)
            score = alignment_score_from_aligned(aligned_query, aligned_ref)
            match_count = sum(
                1
                for base_q, base_r in zip(aligned_query, aligned_ref)
                if base_q == base_r and base_q != "-"
            )
            candidate = {
                "start": start,
                "end": end,
                "score": score,
                "matches": match_count,
                "length_delta": abs((end - start) - len(query)),
            }
            if best is None:
                best = candidate
                continue
            if (
                candidate["score"],
                candidate["matches"],
                -candidate["length_delta"],
                -(candidate["end"] - candidate["start"]),
            ) > (
                best["score"],
                best["matches"],
                -best["length_delta"],
                -(best["end"] - best["start"]),
            ):
                best = candidate
    return best


def infer_prime_edited_reference(reference_sequence, extension_seq):
    if not extension_seq:
        return reference_sequence
    reference = _clean_read_sequence(reference_sequence)
    extension_dna = reverse_complement(_clean_read_sequence(extension_seq))
    if not reference or not extension_dna:
        return reference_sequence
    best_span = best_reference_span_for_query(extension_dna, reference)
    if best_span is None:
        return reference
    return reference[:best_span["start"]] + extension_dna + reference[best_span["end"]:]


def get_prime_scaffold_search(
    prime_edited_ref_sequence,
    extension_seq,
    scaffold_seq,
    min_match_length=PRIME_SCAFFOLD_MIN_MATCH_LENGTH,
    reference_sequence=None,
):
    """
    Return CRISPResso2-style scaffold search metadata.

    The search string is the shortest scaffold DNA prefix such that
    extension_dna + prefix is absent from the Prime-edited reference. Reads are
    then checked only at the expected position immediately after the extension.
    """
    prime_ref = _clean_read_sequence(prime_edited_ref_sequence)
    extension_dna = reverse_complement(_clean_read_sequence(extension_seq))
    scaffold_dna = reverse_complement(_clean_read_sequence(scaffold_seq))
    if not prime_ref or not extension_dna or not scaffold_dna:
        return None

    extension_start = prime_ref.find(extension_dna)
    if extension_start < 0:
        best_span = best_reference_span_for_query(extension_dna, prime_ref)
        if best_span is None:
            return None
        scaffold_start = best_span["end"]
    else:
        scaffold_start = extension_start + len(extension_dna)

    reference_anchor = None
    reference_extension_start = None
    reference_extension_end = None
    reference = _clean_read_sequence(reference_sequence) if reference_sequence else ""
    if reference:
        reference_span = best_reference_span_for_query(extension_dna, reference)
        if reference_span is not None:
            reference_extension_start = reference_span["start"]
            reference_extension_end = reference_span["end"]
            reference_anchor = reference_span["end"] - 1

    scaffold_len = max(1, int(min_match_length or 1))
    while scaffold_len <= len(scaffold_dna):
        scaffold_search = extension_dna + scaffold_dna[:scaffold_len]
        if scaffold_search not in prime_ref:
            return {
                "scaffold_start": scaffold_start,
                "reference_scaffold_anchor": reference_anchor,
                "reference_extension_start": reference_extension_start,
                "reference_extension_end": reference_extension_end,
                "scaffold_search_sequence": scaffold_dna[:scaffold_len],
                "extension_dna": extension_dna,
                "scaffold_dna": scaffold_dna,
            }
        scaffold_len += 1
    raise ValueError(
        "The pegRNA scaffold sequence is present in the Prime-edited reference; "
        "provide a longer scaffold sequence or increase scaffold specificity."
    )


def infer_prime_edited_reference_strand_aware(reference_sequence, extension_seq, pe_orientation):
    reference = _clean_read_sequence(reference_sequence)
    work_ref = pe_work_reference(reference, pe_orientation)
    extension_on_work_ref = reverse_complement(_clean_read_sequence(extension_seq or ""))
    metadata = {
        "orientation": deepcopy(pe_orientation),
        "work_reference_length": len(work_ref),
        "extension_on_work_ref": extension_on_work_ref,
        "extension_span_work": None,
        "extension_span_reference": None,
        "prime_reference_construction_status": "missing_extension" if not extension_on_work_ref else "pending",
    }
    if not reference or not extension_on_work_ref:
        return reference, metadata

    best_span_work = best_reference_span_for_query(extension_on_work_ref, work_ref)
    if best_span_work is None:
        metadata["prime_reference_construction_status"] = "extension_span_not_found"
        return reference, metadata

    prime_work_ref = (
        work_ref[:best_span_work["start"]]
        + extension_on_work_ref
        + work_ref[best_span_work["end"]:]
    )
    if pe_orientation.get("reference_needs_rc_for_pe_work"):
        prime_ref = reverse_complement(prime_work_ref)
    else:
        prime_ref = prime_work_ref

    ref_start, ref_end = map_work_interval_to_reference(
        best_span_work["start"],
        best_span_work["end"],
        len(reference),
        pe_orientation,
    )
    metadata.update({
        "extension_span_work": {
            "start": best_span_work["start"],
            "end": best_span_work["end"],
        },
        "extension_span_reference": {
            "start": ref_start,
            "end": ref_end,
        },
        "prime_reference_construction_status": "ok",
    })
    return prime_ref, metadata


def build_prime_extension_window_positions_strand_aware(
    reference_sequence,
    extension_seq,
    window_size,
    expected_events,
    pe_orientation,
    pe_extension_metadata=None,
    ref_ctx=None,
):
    reference = _clean_read_sequence(reference_sequence)
    work_ref = pe_work_reference(reference, pe_orientation)
    extension_on_work_ref = reverse_complement(_clean_read_sequence(extension_seq or ""))
    resolved_size = 8 if window_size is None else int(window_size)
    prime_ctx = None if ref_ctx is None else ref_ctx.setdefault("prime_editing", {})

    core_start_work = None
    core_end_work = None
    span = None
    if pe_extension_metadata:
        span = pe_extension_metadata.get("extension_span_work")
    if span and span.get("start") is not None and span.get("end") is not None:
        core_start_work = int(span["start"])
        core_end_work = int(span["end"])
    elif work_ref and extension_on_work_ref:
        best_span = best_reference_span_for_query(extension_on_work_ref, work_ref)
        if best_span is not None:
            core_start_work = best_span["start"]
            core_end_work = best_span["end"]

    if core_start_work is not None:
        core_start, core_end = map_work_interval_to_reference(
            core_start_work,
            core_end_work,
            len(reference),
            pe_orientation,
        )
        work_window_positions = expand_reference_span(
            len(work_ref),
            core_start_work,
            core_end_work,
            resolved_size,
        )
        window_positions = {
            map_work_pos_to_reference(pos, len(reference), pe_orientation)
            for pos in work_window_positions
        }
    else:
        spans = [event_reference_span(event) for event in expected_events or []]
        if spans:
            core_start = min(start for start, _ in spans)
            core_end = max(end for _, end in spans)
        else:
            core_start = 0
            core_end = len(reference)
        window_positions = expand_reference_span(len(reference), core_start, core_end, resolved_size)
        work_window_positions = {
            map_reference_pos_to_work(pos, len(reference), pe_orientation)
            for pos in window_positions
        }
        core_start_work, core_end_work = map_work_interval_to_reference(
            core_start,
            core_end,
            len(reference),
            pe_orientation,
        )

    if prime_ctx is not None:
        prime_ctx["extension_window_size"] = resolved_size
        prime_ctx["extension_window_core"] = {"start": core_start, "end": core_end}
        prime_ctx["extension_window_core_work"] = {"start": core_start_work, "end": core_end_work}
        prime_ctx["extension_window_positions_work"] = sorted(work_window_positions)
        prime_ctx["pe_reference_strand"] = pe_orientation.get("pe_reference_strand")
        prime_ctx["reference_needs_rc_for_pe_work"] = bool(pe_orientation.get("reference_needs_rc_for_pe_work"))

    return set(window_positions)


def get_prime_scaffold_search_strand_aware(
    reference_sequence,
    prime_edited_reference_sequence,
    extension_seq,
    scaffold_seq,
    pe_orientation,
    pe_extension_metadata=None,
    min_match_length=PRIME_SCAFFOLD_MIN_MATCH_LENGTH,
):
    reference = _clean_read_sequence(reference_sequence)
    work_ref = pe_work_reference(reference, pe_orientation)
    prime_ref = _clean_read_sequence(prime_edited_reference_sequence)
    if pe_orientation.get("reference_needs_rc_for_pe_work"):
        prime_work_ref = reverse_complement(prime_ref)
    else:
        prime_work_ref = prime_ref
    extension_on_work_ref = reverse_complement(_clean_read_sequence(extension_seq or ""))
    scaffold_on_work_ref = reverse_complement(_clean_read_sequence(scaffold_seq or ""))
    if not work_ref or not prime_work_ref or not extension_on_work_ref or not scaffold_on_work_ref:
        return None

    extension_start_work = prime_work_ref.find(extension_on_work_ref)
    if extension_start_work < 0:
        best_prime_span = best_reference_span_for_query(extension_on_work_ref, prime_work_ref)
        if best_prime_span is None:
            return None
        extension_start_work = best_prime_span["start"]
        extension_end_work = best_prime_span["end"]
    else:
        extension_end_work = extension_start_work + len(extension_on_work_ref)
    scaffold_start_work = extension_end_work

    reference_extension_start = None
    reference_extension_end = None
    span = (pe_extension_metadata or {}).get("extension_span_reference")
    if span and span.get("start") is not None and span.get("end") is not None:
        reference_extension_start = int(span["start"])
        reference_extension_end = int(span["end"])
    else:
        work_span = (pe_extension_metadata or {}).get("extension_span_work")
        if not work_span and extension_on_work_ref:
            work_span = best_reference_span_for_query(extension_on_work_ref, work_ref)
        if work_span:
            reference_extension_start, reference_extension_end = map_work_interval_to_reference(
                work_span["start"],
                work_span["end"],
                len(reference),
                pe_orientation,
            )

    if pe_orientation.get("reference_needs_rc_for_pe_work"):
        scaffold_start_reference = (
            reference_extension_start
            if reference_extension_start is not None
            else len(reference) - scaffold_start_work
        )
        scaffold_sequence_reference = reverse_complement(scaffold_on_work_ref)
        extension_sequence_reference = reverse_complement(extension_on_work_ref)
    else:
        scaffold_start_reference = scaffold_start_work
        scaffold_sequence_reference = scaffold_on_work_ref
        extension_sequence_reference = extension_on_work_ref

    reference_anchor = scaffold_start_reference - 1 if scaffold_start_reference is not None else None
    scaffold_len = max(1, int(min_match_length or 1))
    while scaffold_len <= len(scaffold_on_work_ref):
        scaffold_search_work = extension_on_work_ref + scaffold_on_work_ref[:scaffold_len]
        if scaffold_search_work not in prime_work_ref:
            scaffold_work_prefix = scaffold_on_work_ref[:scaffold_len]
            scaffold_search_reference = (
                reverse_complement(scaffold_work_prefix)
                if pe_orientation.get("reference_needs_rc_for_pe_work")
                else scaffold_work_prefix
            )
            return {
                "pe_reference_strand": pe_orientation.get("pe_reference_strand"),
                "reference_needs_rc_for_pe_work": bool(pe_orientation.get("reference_needs_rc_for_pe_work")),
                "scaffold_start": scaffold_start_reference,
                "scaffold_start_work": scaffold_start_work,
                "reference_scaffold_anchor": reference_anchor,
                "reference_extension_start": reference_extension_start,
                "reference_extension_end": reference_extension_end,
                "scaffold_search_sequence": scaffold_search_reference,
                "scaffold_search_sequence_work": scaffold_work_prefix,
                "extension_dna": extension_sequence_reference,
                "extension_on_work_ref": extension_on_work_ref,
                "scaffold_dna": scaffold_sequence_reference,
                "scaffold_dna_work": scaffold_on_work_ref,
            }
        scaffold_len += 1
    raise ValueError(
        "The pegRNA scaffold sequence is present in the Prime-edited reference; "
        "provide a longer scaffold sequence or increase scaffold specificity."
    )


def characterize_reference_differences(reference_sequence, edited_sequence):
    ref_aln, edit_aln = needleman_wunsch(reference_sequence, edited_sequence)
    ref_pos = 0
    expected_events = []
    for ref_base, edit_base in zip(ref_aln, edit_aln):
        if ref_base != "-" and edit_base != "-":
            if ref_base != edit_base:
                expected_events.append({"kind": "SNP", "pos": ref_pos, "ref": ref_base, "alt": edit_base})
            ref_pos += 1
        elif ref_base == "-" and edit_base != "-":
            anchor = max(-1, ref_pos - 1)
            expected_events.append({"kind": "INS", "anchor": anchor, "seq": edit_base})
        elif ref_base != "-" and edit_base == "-":
            expected_events.append({"kind": "DEL", "start": ref_pos, "length": 1})
            ref_pos += 1
    return expected_events


def expected_prime_event_signatures(reference_sequence, edited_sequence):
    return {format_event_signature(event) for event in characterize_reference_differences(reference_sequence, edited_sequence)}


def event_positions(event):
    if event["kind"] == "SNP":
        return {event["pos"]}
    if event["kind"] == "DEL":
        return set(range(event["start"], event["start"] + event["length"]))
    return {event["anchor"], event["anchor"] + 1}


def expand_reference_span(sequence_length, start, end, flank_size):
    flank = max(0, int(flank_size or 0))
    core_start = max(0, int(start))
    core_end = min(sequence_length, int(end))
    if core_end < core_start:
        core_start, core_end = core_end, core_start
    window_start = max(0, core_start - flank)
    window_end = min(sequence_length, core_end + flank)
    return set(range(window_start, window_end))


def event_reference_span(event):
    if event["kind"] == "SNP":
        pos = int(event["pos"])
        return pos, pos + 1
    if event["kind"] == "DEL":
        start = int(event["start"])
        return start, start + int(event["length"])
    anchor = int(event["anchor"])
    return anchor, anchor + 1


def build_prime_extension_window_positions(reference_sequence, extension_seq, window_size, expected_events, ref_ctx=None):
    reference = _clean_read_sequence(reference_sequence)
    extension_dna = reverse_complement(_clean_read_sequence(extension_seq or ""))
    resolved_size = 8 if window_size is None else int(window_size)
    prime_ctx = None if ref_ctx is None else ref_ctx.setdefault("prime_editing", {})

    core_start = None
    core_end = None
    if reference and extension_dna:
        span = best_reference_span_for_query(extension_dna, reference)
        if span is not None:
            core_start = span["start"]
            core_end = span["end"]

    if core_start is None:
        spans = [event_reference_span(event) for event in expected_events or []]
        if spans:
            core_start = min(start for start, _ in spans)
            core_end = max(end for _, end in spans)

    if core_start is None:
        core_start = 0
        core_end = len(reference)

    if prime_ctx is not None:
        prime_ctx["extension_window_size"] = resolved_size
        prime_ctx["extension_window_core"] = {"start": core_start, "end": core_end}

    return expand_reference_span(len(reference), core_start, core_end, resolved_size)


def project_positions_between_references(source_sequence, target_sequence, source_positions):
    """
    通过全局比对把 source 参考上的坐标集合投影到 target 参考。

    这主要用于同源基因组内：某个拷贝能找到 guide，另一个拷贝找不到时，
    仍然可以把 quantification window 从已定位拷贝映射过去。
    """
    if not source_positions:
        return set()
    target_map = build_pairwise_key_maps(source_sequence, target_sequence)
    projected = set()
    for pos in source_positions:
        state_info = target_map.get(("base", pos))
        if not state_info:
            continue
        if state_info["coord_kind"] != "base" or state_info["coord_pos"] is None:
            continue
        projected.add(state_info["coord_pos"])
    return projected


def project_guide_match_between_references(source_sequence, target_sequence, source_match):
    """
    把一个参考上的 guide 命中区间近似投影到另一个同组参考上。

    返回值仍沿用 guide_match 的结构，便于后续展示相对 sgRNA 坐标。
    若区间无法稳定映射，则返回 None。
    """
    if not source_match:
        return None
    source_positions = set(range(source_match["start"], source_match["end"]))
    projected = sorted(project_positions_between_references(source_sequence, target_sequence, source_positions))
    if not projected:
        return None
    return {
        "strand": source_match["strand"],
        "start": projected[0],
        "end": projected[-1] + 1,
    }


def validate_prime_editing_group_orientation(ref_contexts):
    strands_by_group = defaultdict(list)
    for ref_name, ref_ctx in ref_contexts.items():
        prime_ctx = ref_ctx.get("prime_editing") or {}
        strand = prime_ctx.get("pe_reference_strand")
        if strand in {"+", "-"}:
            strands_by_group[ref_ctx.get("group_name", ref_name)].append((ref_name, strand))
    for group_name, values in strands_by_group.items():
        strands = {strand for _, strand in values}
        if len(strands) > 1:
            details = ", ".join(f"{ref_name}:{strand}" for ref_name, strand in values)
            raise ValueError(
                f"Prime editing spacer orientation is inconsistent within homoeolog group {group_name}. "
                "All A/B/D references must be provided in the same genomic orientation, or provide normalized references. "
                f"Observed: {details}"
            )


def prepare_analysis_context(
    reference_records,
    guide_inputs,
    editing_tool,
    quant_window_size,
    quant_window_center,
    quant_window_coordinates,
    cleavage_offset,
    prime_peg_spacer_inputs,
    prime_peg_extension_inputs,
    prime_nicking_guide_inputs,
    prime_scaffold_inputs,
    prime_scaffold_min_match_length,
    prime_extension_window_size,
    prime_override_ref_inputs,
    exclude_left,
    exclude_right,
    disable_homoeolog_analysis,
    run_root,
    tag_exclusion_radius=10,
    allow_multiple_guides_per_reference=False,
):
    """
    构建后续统计所需的"分析上下文"。

    这一层会统一整理：
    - 每条参考对应哪个 guide / pegRNA；
    - 该 editing tool 的默认 cut site 和窗口；
    - 每条参考的 quantification window 坐标；
    - A/B/D 同源基因的 informative sites。
    """
    if allow_multiple_guides_per_reference and editing_tool == "prime_editor":
        raise ValueError("--allow-multiple-guides-per-reference is not supported for prime_editor mode")

    if editing_tool == "prime_editor":
        main_guides = load_named_sequences(prime_peg_spacer_inputs, default_prefix="peg_spacer")
    else:
        main_guides = load_guides(
            guide_inputs,
            dedupe_by_sequence=not allow_multiple_guides_per_reference,
        )
    guide_assignments_by_ref = (
        assign_multiple_guides_to_references(reference_records, main_guides)
        if allow_multiple_guides_per_reference
        else {ref_name: [guide] for ref_name, guide in assign_guides_to_references(reference_records, main_guides).items()}
    )
    guide_assignments = {
        ref_name: guides[0]
        for ref_name, guides in guide_assignments_by_ref.items()
        if guides
    }

    cleavage_offsets = parse_csv_values(
        cleavage_offset if cleavage_offset is not None else default_cleavage_offset(editing_tool),
        len(reference_records),
        int,
    )
    centers = parse_csv_values(
        quant_window_center if quant_window_center is not None else default_quant_window_center(editing_tool),
        len(reference_records),
        int,
    )
    sizes = parse_csv_values(
        quant_window_size if quant_window_size is not None else default_quant_window_size(editing_tool),
        len(reference_records),
        int,
    )
    coords = parse_csv_values(
        quant_window_coordinates,
        len(reference_records),
        parse_quantification_window_coordinates,
        allow_none=True,
    )
    prime_window_sizes = parse_csv_values(
        prime_extension_window_size,
        len(reference_records),
        int,
        allow_none=True,
    ) if prime_extension_window_size is not None else [None] * len(reference_records)

    prime_extension_assignments = assign_named_sequences_to_references(
        reference_records,
        load_named_sequences(prime_peg_extension_inputs, default_prefix="peg_extension"),
        "prime extension",
    ) if prime_peg_extension_inputs else {}
    prime_nick_assignments = assign_named_sequences_to_references(
        reference_records,
        load_named_sequences(prime_nicking_guide_inputs, default_prefix="nicking_guide"),
        "prime nicking guide",
    ) if prime_nicking_guide_inputs else {}
    prime_scaffold_assignments = assign_named_sequences_to_references(
        reference_records,
        load_named_sequences(prime_scaffold_inputs, default_prefix="peg_scaffold"),
        "prime scaffold",
    ) if prime_scaffold_inputs else {}
    prime_override_assignments = assign_named_sequences_to_references(
        reference_records,
        load_named_sequences(prime_override_ref_inputs, default_prefix="prime_edited_ref"),
        "prime-edited reference",
    ) if prime_override_ref_inputs else {}

    ref_contexts = {}
    direct_matches = {}
    direct_matches_by_ref_guide = {}
    for idx, ref in enumerate(reference_records):
        per_guide_matches = {}
        for guide in guide_assignments_by_ref[ref["name"]]:
            per_guide_matches[guide["name"]] = guide_match_in_reference(ref["sequence"], guide["sequence"])
        direct_matches_by_ref_guide[ref["name"]] = per_guide_matches
        first_guide = guide_assignments[ref["name"]]
        direct_matches[ref["name"]] = per_guide_matches.get(first_guide["name"])

    grouped_refs = defaultdict(list)
    for ref in reference_records:
        grouped_refs[derive_group_name(ref["name"])].append(ref)

    for idx, ref in enumerate(reference_records):
        guide = guide_assignments[ref["name"]]
        guide_contexts = []
        prime_extension_window_metadata = {}
        prime_context_precomputed = None

        if editing_tool == "prime_editor":
            extension_seq = prime_extension_assignments.get(ref["name"], {}).get("sequence", "")
            scaffold_seq = prime_scaffold_assignments.get(ref["name"], {}).get("sequence")
            try:
                pe_orientation = resolve_prime_editing_orientation(ref["sequence"], guide["sequence"])
            except ValueError as exc:
                raise ValueError(f"Prime editing spacer orientation failed for reference {ref['name']}: {exc}") from exc

            if ref["name"] in prime_override_assignments:
                prime_edited_ref_seq = _clean_read_sequence(prime_override_assignments[ref["name"]]["sequence"])
                pe_extension_metadata = {
                    "orientation": deepcopy(pe_orientation),
                    "work_reference_length": len(pe_work_reference(ref["sequence"], pe_orientation)),
                    "extension_on_work_ref": reverse_complement(_clean_read_sequence(extension_seq or "")),
                    "extension_span_work": None,
                    "extension_span_reference": None,
                    "prime_reference_construction_status": "override",
                }
            else:
                prime_edited_ref_seq, pe_extension_metadata = infer_prime_edited_reference_strand_aware(
                    ref["sequence"],
                    extension_seq,
                    pe_orientation,
                )

            expected_events = characterize_reference_differences(ref["sequence"], prime_edited_ref_seq)
            expected_event_signatures = sorted(expected_prime_event_signatures(ref["sequence"], prime_edited_ref_seq))
            extension_window_size = prime_window_sizes[idx] if prime_window_sizes[idx] is not None else 8
            temp_prime_ctx = {"prime_editing": {"extension_window_size": extension_window_size}}
            pe_window_positions = build_prime_extension_window_positions_strand_aware(
                ref["sequence"],
                extension_seq,
                extension_window_size,
                expected_events,
                pe_orientation,
                pe_extension_metadata=pe_extension_metadata,
                ref_ctx=temp_prime_ctx,
            )
            prime_extension_window_metadata = temp_prime_ctx["prime_editing"]
            scaffold_search = get_prime_scaffold_search_strand_aware(
                reference_sequence=ref["sequence"],
                prime_edited_reference_sequence=prime_edited_ref_seq,
                extension_seq=extension_seq,
                scaffold_seq=scaffold_seq,
                pe_orientation=pe_orientation,
                pe_extension_metadata=pe_extension_metadata,
                min_match_length=prime_scaffold_min_match_length,
            ) if scaffold_seq else None
            prime_context_precomputed = {
                "pe_orientation": pe_orientation,
                "prime_edited_ref_seq": prime_edited_ref_seq,
                "expected_event_signatures": expected_event_signatures,
                "window_positions": pe_window_positions,
                "pe_extension_metadata": pe_extension_metadata,
                "scaffold_search": scaffold_search,
                "extension_window_metadata": prime_extension_window_metadata,
            }

        for guide_for_ref in guide_assignments_by_ref[ref["name"]]:
            guide_match = direct_matches_by_ref_guide[ref["name"]].get(guide_for_ref["name"])
            if editing_tool == "prime_editor" and prime_context_precomputed is not None:
                guide_match = prime_context_precomputed["pe_orientation"]["spacer_match_on_reference"]
            guide_cut_boundary = None if guide_match is None else compute_cut_boundary(
                guide_match,
                len(guide_for_ref["sequence"]),
                cleavage_offsets[idx],
            )
            guide_quant_boundary = None if guide_match is None else compute_cut_boundary(
                guide_match,
                len(guide_for_ref["sequence"]),
                centers[idx],
            )
            guide_projected_from = None

            if coords[idx] is not None:
                guide_window_positions = set(coords[idx])
            elif editing_tool == "prime_editor":
                guide_window_positions = set(prime_context_precomputed["window_positions"])
            else:
                if guide_match is not None:
                    guide_window_positions = build_window_positions(ref["length"], guide_quant_boundary, sizes[idx])
                else:
                    sibling_refs = grouped_refs[derive_group_name(ref["name"])]
                    sibling_source = next(
                        (
                            x for x in sibling_refs
                            if x["name"] != ref["name"]
                            and direct_matches_by_ref_guide.get(x["name"], {}).get(guide_for_ref["name"]) is not None
                        ),
                        None,
                    )
                    if sibling_source is None:
                        raise ValueError(f"Guide {guide_for_ref['sequence']} was not found in reference {ref['name']}")

                    sibling_match = direct_matches_by_ref_guide[sibling_source["name"]][guide_for_ref["name"]]
                    sibling_quant_boundary = compute_cut_boundary(
                        sibling_match,
                        len(guide_for_ref["sequence"]),
                        centers[idx],
                    )
                    sibling_window_positions = build_window_positions(
                        sibling_source["length"],
                        sibling_quant_boundary,
                        sizes[idx],
                    )
                    guide_window_positions = project_positions_between_references(
                        sibling_source["sequence"],
                        ref["sequence"],
                        sibling_window_positions,
                    )
                    guide_match = project_guide_match_between_references(
                        sibling_source["sequence"],
                        ref["sequence"],
                        sibling_match,
                    )
                    guide_projected_from = sibling_source["name"]
                    if not guide_window_positions:
                        raise ValueError(
                            f"Guide {guide_for_ref['sequence']} was not found in reference {ref['name']}, "
                            f"and window projection from {sibling_source['name']} also failed"
                        )

            guide_contexts.append({
                "guide_name": guide_for_ref["name"],
                "guide_sequence": guide_for_ref["sequence"],
                "guide_match": guide_match,
                "projected_from_reference": guide_projected_from,
                "cut_boundary": guide_cut_boundary,
                "quantification_boundary": guide_quant_boundary,
                "quantification_window_coordinates": sorted(guide_window_positions),
                "window_positions": set(guide_window_positions),
            })

        first_guide_context = guide_contexts[0]
        match = first_guide_context["guide_match"]
        cut_boundary = first_guide_context["cut_boundary"]
        quant_boundary = first_guide_context["quantification_boundary"]
        projected_from = first_guide_context["projected_from_reference"]
        window_positions = set()
        for guide_context in guide_contexts:
            window_positions.update(guide_context["window_positions"])

        prime_context = None
        if editing_tool == "prime_editor":
            pe_orientation = prime_context_precomputed["pe_orientation"]
            prime_extension_window_metadata = prime_context_precomputed["extension_window_metadata"]
            prime_context = {
                "reference_sequence": ref["sequence"],
                "pegRNA_spacer_sequence": guide["sequence"],
                "pegRNA_extension_sequence": prime_extension_assignments.get(ref["name"], {}).get("sequence"),
                "nicking_guide_sequence": prime_nick_assignments.get(ref["name"], {}).get("sequence"),
                "pegRNA_scaffold_sequence": prime_scaffold_assignments.get(ref["name"], {}).get("sequence"),
                "pe_reference_strand": pe_orientation["pe_reference_strand"],
                "reference_needs_rc_for_pe_work": pe_orientation["reference_needs_rc_for_pe_work"],
                "spacer_match_on_reference": pe_orientation.get("spacer_match_on_reference"),
                "spacer_match_on_work_reference": pe_orientation.get("spacer_match_on_work_reference"),
                "orientation_resolved_by": pe_orientation.get("orientation_resolved_by"),
                "prime_edited_reference_sequence": prime_context_precomputed["prime_edited_ref_seq"],
                "expected_event_signatures": prime_context_precomputed["expected_event_signatures"],
                "extension_window_size": prime_extension_window_metadata.get("extension_window_size", 8),
                "extension_window_core": prime_extension_window_metadata.get("extension_window_core"),
                "extension_window_core_work": prime_extension_window_metadata.get("extension_window_core_work"),
                "pe_extension_metadata": prime_context_precomputed["pe_extension_metadata"],
                "scaffold_search": prime_context_precomputed["scaffold_search"],
            }

        ref_contexts[ref["name"]] = {
            "reference_name": ref["name"],
            "group_name": ref["name"] if disable_homoeolog_analysis else derive_group_name(ref["name"]),
            "guide_name": guide["name"],
            "guide_sequence": guide["sequence"],
            "guide_match": match,
            "guides": guide_contexts,
            "allow_multiple_guides_per_reference": bool(allow_multiple_guides_per_reference),
            "projected_from_reference": projected_from,
            "editing_tool": editing_tool,
            "cleavage_offset": cleavage_offsets[idx],
            "quantification_window_center": centers[idx],
            "quantification_window_size": sizes[idx],
            "quantification_window_coordinates": sorted(window_positions),
            "window_positions": window_positions,
            "cut_boundary": cut_boundary,
            "quantification_boundary": quant_boundary,
            "exclude_left": exclude_left,
            "exclude_right": exclude_right,
            "prime_editing": prime_context,
        }

    if editing_tool == "prime_editor" and not disable_homoeolog_analysis:
        validate_prime_editing_group_orientation(ref_contexts)

    group_models = build_group_models(
        reference_records,
        ref_contexts,
        disable_homoeolog_analysis=disable_homoeolog_analysis,
        tag_exclusion_radius=tag_exclusion_radius,
    )
    serializable_refs = {}
    for key, value in ref_contexts.items():
        serializable_value = dict(value)
        serializable_value["window_positions"] = sorted(value["window_positions"])
        serializable_guides = []
        for guide_context in value.get("guides", []) or []:
            guide_value = dict(guide_context)
            guide_value["window_positions"] = sorted(guide_context.get("window_positions", set()) or [])
            serializable_guides.append(guide_value)
        serializable_value["guides"] = serializable_guides
        serializable_refs[key] = serializable_value

    metadata = {
        "editing_tool": editing_tool,
        "disable_homoeolog_analysis": disable_homoeolog_analysis,
        "references": serializable_refs,
        "group_models": {
            key: {
                "group_name": value["group_name"],
                "reference_names": value["reference_names"],
                "anchor_name": value["anchor_name"],
                "is_homoeolog_group": value.get("is_homoeolog_group", False),
                "informative_sites": value["informative_sites"],
                "features_by_ref": value["features_by_ref"],
                "snp_tag_sites_by_ref": value.get("snp_tag_sites_by_ref", {}),
                "unique_kmer_tags_by_ref": value.get("unique_kmer_tags_by_ref", {}),
                "site_id_by_ref_coord": value.get("site_id_by_ref_coord", {}),
                "safe_tags_by_ref": value.get("safe_tags_by_ref", {}),
                "window_tags_by_ref": value.get("window_tags_by_ref", {}),
                "tag_sites_by_ref": value.get("tag_sites_by_ref", {}),
                "tag_exclusion_radius": value.get("tag_exclusion_radius", tag_exclusion_radius),
                "state_to_refs_by_site": value.get("state_to_refs_by_site", {}),
            }
            for key, value in group_models.items()
        },
    }
    with open(os.path.join(run_root, "analysis_context.json"), "w", encoding="utf-8") as handle:
        json.dump(metadata, handle, ensure_ascii=False, indent=2)

    return {"ref_contexts": ref_contexts, "group_models": group_models}


def load_analysis_context(run_root, reference_records=None):
    """
    从 analysis_context.json 恢复分析上下文，供断点续跑使用。

    老版本 JSON 里若没有 features_by_ref，则在提供 reference_records 时回退重建。
    """
    path = os.path.join(run_root, "analysis_context.json")
    with open(path, "r", encoding="utf-8") as handle:
        metadata = json.load(handle)

    ref_contexts = {}
    for ref_name, value in metadata.get("references", {}).items():
        restored = dict(value)
        restored["window_positions"] = set(
            value.get("window_positions", value.get("quantification_window_coordinates", []))
        )
        restored_guides = []
        for guide_context in value.get("guides", []) or []:
            guide_restored = dict(guide_context)
            guide_restored["window_positions"] = set(
                guide_context.get("window_positions", guide_context.get("quantification_window_coordinates", []))
            )
            restored_guides.append(guide_restored)
        if restored_guides:
            restored["guides"] = restored_guides
        ref_contexts[ref_name] = restored

    serialized_group_models = metadata.get("group_models", {})
    if serialized_group_models:
        missing_features = any(
            "features_by_ref" not in model
            or "snp_tag_sites_by_ref" not in model
            or "unique_kmer_tags_by_ref" not in model
            or "site_id_by_ref_coord" not in model
            for model in serialized_group_models.values()
        )
        if missing_features:
            if reference_records is None:
                raise ValueError(
                    "analysis_context.json is missing features_by_ref; "
                    "reference_records are required to rebuild resume context"
                )
            group_models = build_group_models(
                reference_records,
                ref_contexts,
                disable_homoeolog_analysis=metadata.get("disable_homoeolog_analysis", False),
            )
        else:
            group_models = {}
            for key, value in serialized_group_models.items():
                group_models[key] = {
                    "group_name": value["group_name"],
                    "reference_names": value["reference_names"],
                    "anchor_name": value["anchor_name"],
                    "informative_sites": value["informative_sites"],
                    "features_by_ref": value["features_by_ref"],
                    "snp_tag_sites_by_ref": value.get("snp_tag_sites_by_ref", {}),
                    "unique_kmer_tags_by_ref": value.get("unique_kmer_tags_by_ref", {}),
                    "site_id_by_ref_coord": {
                        ref_name: {int(coord): site_id for coord, site_id in coord_map.items()}
                        for ref_name, coord_map in value.get("site_id_by_ref_coord", {}).items()
                    },
                    "safe_tags_by_ref": value.get("safe_tags_by_ref", value.get("snp_tag_sites_by_ref", {})),
                    "window_tags_by_ref": value.get("window_tags_by_ref", {}),
                    "tag_sites_by_ref": value.get("tag_sites_by_ref", value.get("safe_tags_by_ref", value.get("snp_tag_sites_by_ref", {}))),
                    "tag_exclusion_radius": value.get("tag_exclusion_radius", 10),
                    "state_to_refs_by_site": value.get("state_to_refs_by_site", {}),
                    "is_homoeolog_group": (
                        len(value["reference_names"]) > 1
                        and all(is_homoeolog_reference_name(name) for name in value["reference_names"])
                    ),
                }
    else:
        if reference_records is None:
            raise ValueError("analysis_context.json does not contain group_models")
        group_models = build_group_models(
            reference_records,
            ref_contexts,
            disable_homoeolog_analysis=metadata.get("disable_homoeolog_analysis", False),
        )

    for model in group_models.values():
        if not model.get("state_to_refs_by_site"):
            precompute_site_state_to_refs(model)

    return {"ref_contexts": ref_contexts, "group_models": group_models}

def annotate_lowercase_mutations(read):
    seq = list(read.query_sequence if read.query_sequence else "")
    if not seq:
        return ""

    try:
        aligned_pairs = read.get_aligned_pairs(with_seq=True)
    except ValueError:
        aligned_pairs = []

    for qpos, rpos, ref_base in aligned_pairs:
        if qpos is None or rpos is None or ref_base is None:
            continue
        if seq[qpos].upper() != ref_base.upper():
            seq[qpos] = seq[qpos].lower()

    query_pos = 0
    for op, length in (read.cigartuples or []):
        if op in (0, 7, 8):
            query_pos += length
        elif op == 1:
            for i in range(query_pos, min(query_pos + length, len(seq))):
                seq[i] = seq[i].lower()
            query_pos += length
        elif op == 4:
            query_pos += length
        elif op in (2, 3, 5, 6):
            pass

    return "".join(seq)


def parse_mutation_from_read(read):
    seq = read.query_sequence if read.query_sequence else ""
    if read.is_unmapped or not seq:
        return {
            "variation_type": "NA",
            "variation_info": "unmapped",
            "read_seq": seq,
        }

    snps = []
    insertions = []
    deletions = []

    try:
        aligned_pairs = read.get_aligned_pairs(with_seq=True)
    except ValueError:
        aligned_pairs = []

    for qpos, rpos, ref_base in aligned_pairs:
        if qpos is None or rpos is None or ref_base is None:
            continue
        qbase = seq[qpos]
        if qbase.upper() != ref_base.upper():
            snps.append(f"{rpos + 1}:{ref_base.upper()}->{qbase.upper()}")

    ref_pos = read.reference_start
    query_pos = 0

    for op, length in (read.cigartuples or []):
        if op in (0, 7, 8):
            ref_pos += length
            query_pos += length
        elif op == 1:
            ins_seq = seq[query_pos: query_pos + length]
            insertions.append(f"{ref_pos + 1}:{length}I:{ins_seq}")
            query_pos += length
        elif op == 2:
            deletions.append(f"{ref_pos + 1}:{length}D")
            ref_pos += length
        elif op == 4:
            query_pos += length
        elif op == 3:
            ref_pos += length
        elif op in (5, 6):
            pass

    variation_types = []
    variation_infos = []

    if snps:
        variation_types.append("SNP")
        variation_infos.append(";".join(snps))

    if insertions:
        variation_types.extend([x.split(":")[1] for x in insertions])
        variation_infos.append(";".join(insertions))

    if deletions:
        variation_types.extend([x.split(":")[1] for x in deletions])
        variation_infos.append(";".join(deletions))

    if not variation_types:
        variation_type = "WT"
        variation_info = "-"
    else:
        variation_type = ";".join(variation_types)
        variation_info = ";".join(variation_infos)

    return {
        "variation_type": variation_type,
        "variation_info": variation_info,
        "read_seq": annotate_lowercase_mutations(read),
    }


def _final_display_ratio_filter(records, min_ratio, top_n):
    if not records:
        return []

    ranked = sorted(records, key=lambda x: x["count"], reverse=True)[:top_n]

    while len(ranked) > 1:
        display_total = sum(x["count"] for x in ranked)
        if display_total == 0:
            break

        for x in ranked:
            x["_ratio_value"] = x["count"] / display_total * 100.0

        ranked = sorted(ranked, key=lambda x: x["count"], reverse=True)

        if ranked[-1]["_ratio_value"] < min_ratio:
            ranked.pop()
        else:
            break

    display_total = sum(x["count"] for x in ranked)
    if display_total == 0:
        return []

    for idx, x in enumerate(ranked, start=1):
        x["Sort"] = idx
        x["Reads number"] = x["count"]
        x["Ratio"] = f"{(x['count'] / display_total * 100.0):.2f}%"

    return ranked


def summarize_disjoint_sample(reference_record, sample, run_root, min_ratio, top_n):
    bam_path = os.path.join(
        run_root,
        "reference_results",
        reference_record["safe_name"],
        "bwa",
        f"{sample}.filter.bam"
    )
    if not os.path.exists(bam_path):
        return []

    pair_dict = defaultdict(dict)

    with pysam.AlignmentFile(bam_path, "rb") as bam:
        for read in bam:
            if read.is_secondary or read.is_supplementary or read.is_unmapped:
                continue

            qname = read.query_name
            info = parse_mutation_from_read(read)

            if read.is_read1:
                pair_dict[qname]["left"] = info
            elif read.is_read2:
                pair_dict[qname]["right"] = info

    pattern_counter = Counter()
    rep_seq_counter = defaultdict(Counter)

    for _, pair in pair_dict.items():
        left = pair.get("left")
        right = pair.get("right")
        if left is None or right is None:
            continue

        key = (
            left["variation_type"],
            right["variation_type"],
            left["variation_info"],
            right["variation_info"],
        )
        pattern_counter[key] += 1

        rep_seq_counter[(key, "L")][left["read_seq"]] += 1
        rep_seq_counter[(key, "R")][right["read_seq"]] += 1

    records = []
    for key, count in pattern_counter.items():
        left_type, right_type, left_var, right_var = key

        left_rep_seq = rep_seq_counter[(key, "L")].most_common(1)[0][0] if rep_seq_counter[(key, "L")] else "-"
        right_rep_seq = rep_seq_counter[(key, "R")].most_common(1)[0][0] if rep_seq_counter[(key, "R")] else "-"

        records.append({
            "Reference": reference_record["name"],
            "Sample": sample,
            "count": count,
            "Left variation type": left_type,
            "Right variation type": right_type,
            "Left variation": left_var,
            "Right variation": right_var,
            "Left reads seq": left_rep_seq,
            "Right reads seq": right_rep_seq,
        })

    return _final_display_ratio_filter(records, min_ratio=min_ratio, top_n=top_n)


def summarize_overlap_sample(reference_record, sample, run_root, min_ratio, top_n):
    bam_path = os.path.join(
        run_root,
        "reference_results",
        reference_record["safe_name"],
        "bwa",
        f"{sample}.filter.bam"
    )
    if not os.path.exists(bam_path):
        return []

    pattern_counter = Counter()
    rep_seq_counter = defaultdict(Counter)

    with pysam.AlignmentFile(bam_path, "rb") as bam:
        for read in bam:
            if read.is_secondary or read.is_supplementary or read.is_unmapped:
                continue

            info = parse_mutation_from_read(read)
            key = (
                info["variation_type"],
                info["variation_info"],
            )
            pattern_counter[key] += 1
            rep_seq_counter[key][info["read_seq"]] += 1

    records = []
    for key, count in pattern_counter.items():
        left_type, left_var = key
        left_rep_seq = rep_seq_counter[key].most_common(1)[0][0] if rep_seq_counter[key] else "-"

        records.append({
            "Reference": reference_record["name"],
            "Sample": sample,
            "count": count,
            "Left variation type": left_type,
            "Right variation type": "-",
            "Left variation": left_var,
            "Right variation": "-",
            "Left reads seq": left_rep_seq,
            "Right reads seq": "-",
        })

    return _final_display_ratio_filter(records, min_ratio=min_ratio, top_n=top_n)


def summarize_all_references(reference_records, sample_names, run_root, min_ratio, top_n, mode):
    results_by_reference = {}

    for ref in reference_records:
        sample_results = {}
        for sample in sample_names:
            if mode == "disjoint":
                recs = summarize_disjoint_sample(
                    reference_record=ref,
                    sample=sample,
                    run_root=run_root,
                    min_ratio=min_ratio,
                    top_n=top_n
                )
            else:
                recs = summarize_overlap_sample(
                    reference_record=ref,
                    sample=sample,
                    run_root=run_root,
                    min_ratio=min_ratio,
                    top_n=top_n
                )
            sample_results[sample] = recs

        results_by_reference[ref["name"]] = {
            "reference": ref,
            "samples": sample_results
        }

    return results_by_reference


def export_results_per_reference(results_by_reference, run_root):
    summary_dir = os.path.join(run_root, "summary_by_reference")
    os.makedirs(summary_dir, exist_ok=True)

    header = [
        "Sort",
        "Reads number",
        "Ratio",
        "Left variation type",
        "Right variation type",
        "Left variation",
        "Right variation",
        "Left reads seq",
        "Right reads seq",
    ]

    for ref_name, bundle in results_by_reference.items():
        ref = bundle["reference"]
        sample_results = bundle["samples"]
        safe_ref = ref["safe_name"]

        tsv_path = os.path.join(summary_dir, f"{safe_ref}.tsv")
        with open(tsv_path, "w", encoding="utf-8") as f:
            f.write("\t".join(header) + "\n")
            for sample, records in sample_results.items():
                if not records:
                    continue
                f.write(f"{sample}\n")
                for rec in records:
                    f.write("\t".join([
                        str(rec["Sort"]),
                        str(rec["Reads number"]),
                        rec["Ratio"],
                        rec["Left variation type"],
                        rec["Right variation type"],
                        rec["Left variation"],
                        rec["Right variation"],
                        rec["Left reads seq"],
                        rec["Right reads seq"],
                    ]) + "\n")

        xlsx_path = os.path.join(summary_dir, f"{safe_ref}.xlsx")
        if OPENPYXL_AVAILABLE:
            wb = Workbook()
            ws = wb.active
            ws.title = "Summary"

            ws.append(header)
            for sample, records in sample_results.items():
                if not records:
                    continue
                ws.append([sample] + [""] * (len(header) - 1))
                for rec in records:
                    ws.append([
                        rec["Sort"],
                        rec["Reads number"],
                        rec["Ratio"],
                        rec["Left variation type"],
                        rec["Right variation type"],
                        rec["Left variation"],
                        rec["Right variation"],
                        rec["Left reads seq"],
                        rec["Right reads seq"],
                    ])

            ws2 = wb.create_sheet("Flat")
            ws2.append(["Reference", "Sample"] + header)
            for sample, records in sample_results.items():
                for rec in records:
                    ws2.append([
                        ref_name,
                        sample,
                        rec["Sort"],
                        rec["Reads number"],
                        rec["Ratio"],
                        rec["Left variation type"],
                        rec["Right variation type"],
                        rec["Left variation"],
                        rec["Right variation"],
                        rec["Left reads seq"],
                        rec["Right reads seq"],
                    ])

            wb.save(xlsx_path)
        else:
            readme_path = os.path.join(summary_dir, f"{safe_ref}_README.txt")
            with open(readme_path, "w", encoding="utf-8") as f:
                f.write(
                    "openpyxl is not installed, so .xlsx was not created.\n"
                    "Install it with: pip install openpyxl\n"
                )


def export_library_reference_qc_report(reference_records, sample_names, run_root):
    """
    统计整个测序文库中，不同参考序列的 reads 数和比例。
    V10.2 优先使用 group-level BAM 中的 reference_name + unique qname 汇总。
    若 group BAM 不存在，则回退旧 per-reference filter.bam。

    输出：
      qc_reports/reference_mapping_ratio.tsv
      qc_reports/reference_mapping_ratio_by_sample.tsv
      qc_reports/reference_mapping_ratio.xlsx （若安装 openpyxl）
    """
    qc_dir = os.path.join(run_root, "qc_reports")
    os.makedirs(qc_dir, exist_ok=True)

    def count_unique_qnames_for_ref(ref, sample):
        if pysam is None:
            return 0

        ref_name = ref["name"]
        group_name = derive_group_name(ref_name)
        group_bam = group_bam_path(run_root, group_name, sample)
        if os.path.exists(group_bam):
            qnames = set()
            try:
                with pysam.AlignmentFile(group_bam, "rb") as bam:
                    for read in bam.fetch(until_eof=True):
                        if read.is_unmapped or read.is_supplementary:
                            continue
                        if read.reference_name == ref_name:
                            qnames.add(read.query_name)
            except Exception:
                return 0
            return len(qnames)

        legacy_bam = os.path.join(
            run_root,
            "reference_results",
            ref["safe_name"],
            "bwa",
            f"{sample}.filter.bam"
        )
        if not os.path.exists(legacy_bam):
            return 0
        qnames = set()
        try:
            with pysam.AlignmentFile(legacy_bam, "rb") as bam:
                for read in bam.fetch(until_eof=True):
                    if read.is_unmapped or read.is_supplementary:
                        continue
                    qnames.add(read.query_name)
        except Exception:
            return 0
        return len(qnames)

    rows = []
    grand_total = 0

    for ref in reference_records:
        ref_name = ref["name"]

        ref_total = 0
        per_sample_counts = []

        for sample in sample_names:
            count = count_unique_qnames_for_ref(ref, sample)
            ref_total += count
            per_sample_counts.append((sample, count))

        rows.append({
            "Reference": ref_name,
            "Reads": ref_total,
            "PerSample": per_sample_counts
        })
        grand_total += ref_total

    for row in rows:
        if grand_total > 0:
            row["Ratio"] = f"{row['Reads'] / grand_total * 100:.2f}%"
        else:
            row["Ratio"] = "0.00%"

    rows.sort(key=lambda x: x["Reads"], reverse=True)

    tsv_path = os.path.join(qc_dir, "reference_mapping_ratio.tsv")
    with open(tsv_path, "w", encoding="utf-8") as out:
        out.write("Reference\tReads\tRatio\n")
        for row in rows:
            out.write(f"{row['Reference']}\t{row['Reads']}\t{row['Ratio']}\n")
        out.write(f"TOTAL\t{grand_total}\t100.00%\n")

    detail_tsv_path = os.path.join(qc_dir, "reference_mapping_ratio_by_sample.tsv")
    with open(detail_tsv_path, "w", encoding="utf-8") as out:
        out.write("Reference\tSample\tReads\n")
        for row in rows:
            for sample, count in row["PerSample"]:
                out.write(f"{row['Reference']}\t{sample}\t{count}\n")

    if OPENPYXL_AVAILABLE:
        wb = Workbook()

        ws = wb.active
        ws.title = "ReferenceRatio"
        ws.append(["Reference", "Reads", "Ratio"])
        for row in rows:
            ws.append([row["Reference"], row["Reads"], row["Ratio"]])
        ws.append(["TOTAL", grand_total, "100.00%"])

        ws2 = wb.create_sheet("BySample")
        ws2.append(["Reference", "Sample", "Reads"])
        for row in rows:
            for sample, count in row["PerSample"]:
                ws2.append([row["Reference"], sample, count])

        xlsx_path = os.path.join(qc_dir, "reference_mapping_ratio.xlsx")
        wb.save(xlsx_path)


def export_hitom_import_qc_report(results_bundle, run_root):
    qc_dir = os.path.join(run_root, "qc_reports")
    os.makedirs(qc_dir, exist_ok=True)
    rows = []
    grand_total = 0

    reference_items = list(results_bundle["references"].items())
    total_exports = len(reference_items)
    for export_index, (ref_name, bundle) in enumerate(reference_items, start=1):
        ref_total = 0
        per_sample_counts = []
        for sample in results_bundle["sample_names"]:
            result = bundle["samples"].get(sample)
            count = 0 if result is None else int(result["stats"].get("Assigned reads", 0))
            ref_total += count
            per_sample_counts.append((sample, count))
        rows.append({"Reference": ref_name, "Reads": ref_total, "PerSample": per_sample_counts})
        grand_total += ref_total

    rows.sort(key=lambda x: x["Reads"], reverse=True)
    with open(os.path.join(qc_dir, "reference_mapping_ratio.tsv"), "w", encoding="utf-8") as out:
        out.write("Reference\tReads\tRatio\n")
        for row in rows:
            ratio = "0.00%" if grand_total == 0 else f"{row['Reads'] / grand_total * 100:.2f}%"
            out.write(f"{row['Reference']}\t{row['Reads']}\t{ratio}\n")
        out.write(f"TOTAL\t{grand_total}\t{'0.00%' if grand_total == 0 else '100.00%'}\n")

    with open(os.path.join(qc_dir, "reference_mapping_ratio_by_sample.tsv"), "w", encoding="utf-8") as out:
        out.write("Reference\tSample\tReads\n")
        for row in rows:
            for sample, count in row["PerSample"]:
                out.write(f"{row['Reference']}\t{sample}\t{count}\n")

    if OPENPYXL_AVAILABLE:
        wb = Workbook()
        ws = wb.active
        ws.title = "ReferenceRatio"
        ws.append(["Reference", "Reads", "Ratio"])
        for row in rows:
            ratio = "0.00%" if grand_total == 0 else f"{row['Reads'] / grand_total * 100:.2f}%"
            ws.append([row["Reference"], row["Reads"], ratio])
        ws.append(["TOTAL", grand_total, "0.00%" if grand_total == 0 else "100.00%"])

        ws2 = wb.create_sheet("BySample")
        ws2.append(["Reference", "Sample", "Reads"])
        for row in rows:
            for sample, count in row["PerSample"]:
                ws2.append([row["Reference"], sample, count])
        wb.save(os.path.join(qc_dir, "reference_mapping_ratio.xlsx"))


def event_overlaps_window(event, ref_ctx):
    window = ref_ctx["window_positions"]
    if event["kind"] == "SNP":
        return event["pos"] in window
    if event["kind"] == "DEL":
        return any(pos in window for pos in range(event["start"], event["start"] + event["length"]))
    if event["kind"] == "INS":
        return event["anchor"] in window or (event["anchor"] + 1) in window
    return False


def event_near_excluded_edge(event, ref_ctx, ref_length):
    left = ref_ctx["exclude_left"]
    right = ref_ctx["exclude_right"]
    if event["kind"] == "SNP":
        positions = [event["pos"]]
    elif event["kind"] == "DEL":
        positions = list(range(event["start"], event["start"] + event["length"]))
    else:
        positions = [event["anchor"], event["anchor"] + 1]
    for pos in positions:
        if pos < 0:
            continue
        if pos < left:
            return True
        if pos >= max(0, ref_length - right):
            return True
    return False


def format_event_signature(event):
    if event["kind"] == "SNP":
        return f"{event['pos'] + 1}:{event['ref']}->{event['alt']}"
    if event["kind"] == "INS":
        return f"{event['anchor'] + 2}:{len(event['seq'])}I:{event['seq']}"
    return f"{event['start'] + 1}:{event['length']}D"


def reference_position_to_guide_coordinate(ref_pos, ref_ctx):
    """
    把参考序列坐标转换为"用户提交的 sgRNA 5'->3' 坐标"。

    规则：
    - sgRNA 第一个碱基记为 1；
    - 若事件落在 sgRNA 上游，可出现 0 或负数；
    - 若事件落在 sgRNA 下游，可出现大于 sgRNA 长度的坐标。
    """
    match = ref_ctx.get("guide_match")
    guide_sequence = ref_ctx.get("guide_sequence")
    if not match or not guide_sequence:
        return ref_pos + 1
    if match["strand"] == "+":
        return ref_pos - match["start"] + 1
    return match["end"] - ref_pos


def reference_position_to_pe_pam_coordinate(ref_pos, ref_ctx):
    match = ref_ctx.get("guide_match")
    if not match:
        return ref_pos + 1
    if match["strand"] == "+":
        pam_n_ref_pos = match["end"]
        return pam_n_ref_pos - ref_pos
    pam_n_ref_pos = match["start"] - 1
    return ref_pos - pam_n_ref_pos


def format_pe_event_signature(event, ref_ctx):
    if event["kind"] == "SNP":
        guide_pos = reference_position_to_pe_pam_coordinate(event["pos"], ref_ctx)
        return f"{guide_pos}:{event['ref']}>{event['alt']}"
    if event["kind"] == "INS":
        guide_pos = reference_position_to_pe_pam_coordinate(event["anchor"] + 1, ref_ctx)
        return f"{guide_pos}:{len(event['seq'])}I:{event['seq']}"
    guide_pos = reference_position_to_pe_pam_coordinate(event["start"], ref_ctx)
    return f"{guide_pos}:{event['length']}D"


def format_in_window_event_signature(event, ref_ctx):
    """
    In-window variation 的展示专用格式。

    与内部统计不同，这里把位点统一显示成"相对于 sgRNA 第一个碱基"的编号，
    以便 base editor / prime editor 结果更直观。
    """
    if event["kind"] == "SNP":
        guide_pos = reference_position_to_guide_coordinate(event["pos"], ref_ctx)
        return f"{guide_pos}:{event['ref']}->{event['alt']}"
    if event["kind"] == "INS":
        # 插入位点沿用"插入发生在下游这个碱基之前"的展示习惯，因此取 anchor+1 的参考坐标做转换。
        guide_pos = reference_position_to_guide_coordinate(event["anchor"] + 1, ref_ctx)
        return f"{guide_pos}:{len(event['seq'])}I:{event['seq']}"
    guide_pos = reference_position_to_guide_coordinate(event["start"], ref_ctx)
    return f"{guide_pos}:{event['length']}D"


def multi_guide_contexts(ref_ctx):
    guides = (ref_ctx or {}).get("guides") or []
    return guides if len(guides) > 1 else []


def guide_variation_column_name(guide_context):
    return f"{guide_context['guide_name']}_In-window variation"


def guide_variation_columns(ref_ctx):
    return [guide_variation_column_name(guide) for guide in multi_guide_contexts(ref_ctx)]


def guide_window_signatures_for_events(events, ref_ctx):
    signatures = {}
    for guide_context in multi_guide_contexts(ref_ctx):
        guide_events = [
            event for event in events
            if event_overlaps_window(event, guide_context)
        ]
        signatures[guide_context["guide_name"]] = (
            ";".join(format_in_window_event_signature(event, guide_context) for event in guide_events)
            if guide_events else "-"
        )
    return signatures


def _extract_events_from_nw_alignment_with_spans(aligned_read, aligned_ref, ref_slice_start):
    events = []
    ref_pos = ref_slice_start
    idx = 0
    aln_len = min(len(aligned_read), len(aligned_ref))
    while idx < aln_len:
        read_base = aligned_read[idx]
        ref_base = aligned_ref[idx]
        if read_base == "-" and ref_base != "-":
            event_start = ref_pos
            aln_start = idx
            length = 0
            while idx < aln_len and aligned_read[idx] == "-" and aligned_ref[idx] != "-":
                length += 1
                ref_pos += 1
                idx += 1
            events.append({
                "kind": "DEL",
                "start": event_start,
                "length": length,
                "source": "cas9_nw_del",
                "_aln_start": aln_start,
                "_aln_end": idx,
            })
            continue
        if ref_base == "-" and read_base != "-":
            aln_start = idx
            inserted = []
            anchor = ref_pos - 1
            while idx < aln_len and aligned_ref[idx] == "-" and aligned_read[idx] != "-":
                inserted.append(aligned_read[idx])
                idx += 1
            events.append({
                "kind": "INS",
                "anchor": anchor,
                "seq": "".join(inserted),
                "source": "cas9_nw_ins",
                "_aln_start": aln_start,
                "_aln_end": idx,
            })
            continue
        if ref_base != "-":
            ref_pos += 1
        idx += 1
    return events


def _strip_internal_event_fields(event):
    return {key: value for key, value in event.items() if not key.startswith("_")}


def extract_events_from_nw_alignment(aligned_read, aligned_ref, ref_slice_start):
    return [
        _strip_internal_event_fields(event)
        for event in _extract_events_from_nw_alignment_with_spans(aligned_read, aligned_ref, ref_slice_start)
    ]


def _window_bounds(ref_ctx, ref_length):
    window_positions = sorted(ref_ctx.get("window_positions", set()) or [])
    if not window_positions:
        return 0, max(0, ref_length - 1)
    return max(0, window_positions[0]), min(ref_length - 1, window_positions[-1])


def _reference_slice_for_cas9_nw_rescue(ref_record, ref_ctx, flank_size, read_length=0):
    ref_seq = str(ref_record.get("sequence", "")).upper()
    if not ref_seq:
        return "", 0
    window_start, window_end = _window_bounds(ref_ctx, len(ref_seq))
    effective_flank = max(int(flank_size or 0), int(read_length or 0))
    slice_start = max(0, window_start - effective_flank)
    slice_end = min(len(ref_seq), window_end + effective_flank + 1)
    return ref_seq[slice_start:slice_end], slice_start


def _event_indel_size(event):
    if event.get("kind") == "DEL":
        return int(event.get("length", 0) or 0)
    if event.get("kind") == "INS":
        return len(event.get("seq", "") or event.get("inserted_seq", ""))
    return 0


def _anchor_stats_around_alignment_event(aligned_read, aligned_ref, aln_start, aln_end):
    def scan_left(pos):
        bases = 0
        matches = 0
        mismatches = 0
        while pos >= 0 and aligned_read[pos] != "-" and aligned_ref[pos] != "-":
            bases += 1
            if aligned_read[pos] == aligned_ref[pos]:
                matches += 1
            else:
                mismatches += 1
            pos -= 1
        return bases, matches, mismatches

    def scan_right(pos):
        bases = 0
        matches = 0
        mismatches = 0
        aln_len = min(len(aligned_read), len(aligned_ref))
        while pos < aln_len and aligned_read[pos] != "-" and aligned_ref[pos] != "-":
            bases += 1
            if aligned_read[pos] == aligned_ref[pos]:
                matches += 1
            else:
                mismatches += 1
            pos += 1
        return bases, matches, mismatches

    left_bases, left_matches, left_mismatches = scan_left(aln_start - 1)
    right_bases, right_matches, right_mismatches = scan_right(aln_end)
    total_bases = left_bases + right_bases
    total_matches = left_matches + right_matches
    total_mismatches = left_mismatches + right_mismatches
    identity = total_matches / total_bases if total_bases else 0.0
    return {
        "left_bases": left_bases,
        "right_bases": right_bases,
        "total_bases": total_bases,
        "identity": identity,
        "mismatches": total_mismatches,
    }


def _nw_event_has_closed_anchor_evidence(event, aligned_read, aligned_ref, params):
    stats = _anchor_stats_around_alignment_event(
        aligned_read,
        aligned_ref,
        int(event.get("_aln_start", 0) or 0),
        int(event.get("_aln_end", 0) or 0),
    )
    return (
        stats["left_bases"] >= params.get("min_anchor_length", 15)
        and stats["right_bases"] >= params.get("min_anchor_length", 15)
        and stats["total_bases"] >= params.get("min_total_anchor_bases", 35)
        and stats["identity"] >= params.get("min_anchor_identity", 0.90)
        and stats["mismatches"] <= params.get("max_mismatches_in_anchors", 3)
    )


def _softclip_segment_is_usable_for_cas9_nw_rescue(seg, ref_ctx, params):
    if not isinstance(seg, dict):
        return False
    if seg.get("filter_status") == "excluded":
        return False
    if seg.get("filter_reason"):
        return False
    anchor = seg.get("anchor_ref_pos")
    if anchor is None:
        return False
    window_start, window_end = _window_bounds(ref_ctx, max(window_positions_max(ref_ctx), int(anchor)) + 1)
    flank = int(params.get("flank_size", 80) or 80)
    return window_start - flank <= int(anchor) <= window_end + flank


def window_positions_max(ref_ctx):
    window_positions = ref_ctx.get("window_positions", set()) or set()
    return max(window_positions) if window_positions else 0


def _candidate_has_cas9_nw_rescue_signal(candidate, ref_ctx, params):
    if candidate.get("breakpoint_like_evidence") or candidate.get("large_alignment_gap_signal"):
        return True
    softclip_segments = candidate.get("softclip_segments", []) or []
    if softclip_segments:
        return any(
            _softclip_segment_is_usable_for_cas9_nw_rescue(seg, ref_ctx, params)
            for seg in softclip_segments
        )
    return False


def candidate_is_cas9_large_indel_rescue_candidate(candidate, ref_ctx, params):
    if not params or not params.get("enabled", False):
        return False
    if ref_ctx.get("editing_tool", "cas9") != "cas9":
        return False
    if candidate.get("window_events"):
        return False
    outside_id = candidate.get("outside_window_identity")
    if not candidate.get("outside_window_identity_available", outside_id is not None):
        return False
    if outside_id is None or outside_id < params.get("min_outside_window_identity", MIN_OUTSIDE_WINDOW_IDENTITY):
        return False
    if candidate.get("pair_candidate_complete") is False:
        return False
    if candidate.get("has_read1_candidate") is False or candidate.get("has_read2_candidate") is False:
        return False
    return _candidate_has_cas9_nw_rescue_signal(candidate, ref_ctx, params)


def _iter_candidate_read_parts_for_cas9_nw_rescue(candidate, ref_ctx=None, params=None):
    signal_part_names = {
        str(seg.get("part_name"))
        for seg in candidate.get("softclip_segments", []) or []
        if seg.get("part_name")
        and ref_ctx is not None
        and params is not None
        and _softclip_segment_is_usable_for_cas9_nw_rescue(seg, ref_ctx, params)
    }
    yielded = set()
    for part in candidate.get("parts", []) or []:
        if not isinstance(part, dict):
            continue
        part_name = part.get("part_name") or "read"
        if signal_part_names and part_name not in signal_part_names:
            continue
        seq = _clean_read_sequence(part.get("raw_sequence", ""))
        if seq and (part_name, seq) not in yielded:
            yielded.add((part_name, seq))
            yield part_name, seq
    if yielded:
        return
    raw_sequence = str(candidate.get("raw_sequence") or "")
    chunks = raw_sequence.split("|") if raw_sequence else []
    for idx, chunk in enumerate(chunks):
        seq = _clean_read_sequence(chunk)
        part_name = "read1" if idx == 0 else "read2" if idx == 1 else f"read{idx + 1}"
        if signal_part_names and part_name not in signal_part_names:
            continue
        if seq and (part_name, seq) not in yielded:
            yielded.add((part_name, seq))
            yield part_name, seq


def run_cas9_nw_rescue_for_candidate(candidate, ref_record, ref_ctx, params, nw_alignment_cache=None):
    accepted = []
    seen = set()
    has_reference_slice = False
    cache_context = (
        ref_record.get("name"),
        tuple(sorted(ref_ctx.get("window_positions", set()) or [])),
        int(params.get("flank_size", 80) or 80),
        int(params.get("min_indel_size", 20) or 20),
        int(params.get("max_indel_size", 120) or 120),
        int(params.get("min_anchor_length", 15) or 15),
        float(params.get("min_anchor_identity", 0.90) or 0.90),
        int(params.get("min_total_anchor_bases", 35) or 35),
        int(params.get("max_mismatches_in_anchors", 3) or 3),
    )
    for part_name, read_seq in _iter_candidate_read_parts_for_cas9_nw_rescue(candidate, ref_ctx, params):
        cache_key = (cache_context, read_seq)
        part_events = None if nw_alignment_cache is None else nw_alignment_cache.get(cache_key)
        if part_events is None:
            ref_slice, ref_slice_start = _reference_slice_for_cas9_nw_rescue(
                ref_record,
                ref_ctx,
                int(params.get("flank_size", 80) or 80),
                read_length=len(read_seq),
            )
            if not ref_slice:
                continue
            has_reference_slice = True
            aligned_read, aligned_ref, alignment_start = affine_semiglobal_align_read_to_reference_slice(
                read_seq,
                ref_slice,
            )
            alignment_ref_start = ref_slice_start + alignment_start
            part_events = []
            for event in _extract_events_from_nw_alignment_with_spans(aligned_read, aligned_ref, alignment_ref_start):
                indel_size = _event_indel_size(event)
                public_event = _strip_internal_event_fields(event)
                if indel_size < params.get("min_indel_size", 20):
                    continue
                if indel_size > params.get("max_indel_size", 120):
                    continue
                if public_event.get("kind") not in {"DEL", "INS"}:
                    continue
                if not event_overlaps_window(public_event, ref_ctx):
                    continue
                if not _nw_event_has_closed_anchor_evidence(event, aligned_read, aligned_ref, params):
                    continue
                part_events.append(public_event)
            if nw_alignment_cache is not None:
                nw_alignment_cache[cache_key] = deepcopy(part_events)
        else:
            has_reference_slice = True

        for public_event in part_events:
            signature = format_event_signature(public_event)
            if signature not in seen:
                accepted.append(public_event)
                seen.add(signature)

    if not has_reference_slice:
        return {"accepted": False, "events": [], "reason": "empty_reference_slice"}
    if accepted:
        return {"accepted": True, "events": accepted, "reason": "accepted"}
    return {"accepted": False, "events": [], "reason": "no_closed_same_read_indel"}


def apply_cas9_large_indel_nw_rescue(candidate, ref_record, ref_ctx, params, nw_alignment_cache=None):
    updated = deepcopy(candidate)
    if not params or not params.get("enabled", False):
        updated["cas9_nw_rescue_status"] = "disabled"
        return updated
    if not candidate_is_cas9_large_indel_rescue_candidate(updated, ref_ctx, params):
        updated["cas9_nw_rescue_status"] = "not_candidate"
        return updated

    rescue_result = run_cas9_nw_rescue_for_candidate(
        updated,
        ref_record,
        ref_ctx,
        params,
        nw_alignment_cache=nw_alignment_cache,
    )
    if not rescue_result.get("accepted"):
        updated["cas9_nw_rescue_status"] = "rejected"
        updated["cas9_nw_rescue_reason"] = rescue_result.get("reason", "rejected")
        return updated

    existing = list(updated.get("window_events", []) or [])
    existing_signatures = {format_event_signature(event) for event in existing}
    rescued_events = []
    for event in rescue_result.get("events", []):
        signature = format_event_signature(event)
        if signature in existing_signatures:
            continue
        existing.append(event)
        rescued_events.append(event)
        existing_signatures.add(signature)
    updated["window_events"] = existing
    updated["cas9_nw_rescue_events"] = rescued_events
    updated["cas9_nw_rescue_status"] = "accepted" if rescued_events else "rejected"
    if not rescued_events:
        updated["cas9_nw_rescue_reason"] = "duplicate_rescued_events"
    return updated


def merge_base_states(primary, secondary):
    merged = dict(primary)
    for pos, base in secondary.items():
        if pos not in merged:
            merged[pos] = base
        elif merged[pos] == base:
            continue
        elif merged[pos] == "-" or base == "-":
            continue
        else:
            merged[pos] = "N"
    return merged


def guide_overlap_count(base_states, ref_ctx):
    guide_contexts = multi_guide_contexts(ref_ctx)
    matches = [guide.get("guide_match") for guide in guide_contexts] if guide_contexts else [ref_ctx.get("guide_match")]
    matches = [match for match in matches if match]
    if not matches:
        return 0
    return max(
        sum(
            1
            for pos in range(match["start"], match["end"])
            if str(base_states.get(pos, "")).upper() in DNA_BASES
        )
        for match in matches
    )


def make_candidate_tag_part(part_name, base_states, raw_sequence, ref_ctx, events=None):
    return {
        "part_name": part_name,
        "base_states": dict(base_states),
        "events": list(events or []),
        "raw_sequence": raw_sequence,
        "guide_overlap": guide_overlap_count(base_states, ref_ctx),
    }


def collect_softclip_segment(read, query_pos, clip_len, ref_pos, part_name, op_index):
    """
    Collect data for a single soft-clip segment from a CIGAR S operation.

    Determines 5' vs 3' based on position in the read and computes the
    anchor reference position for downstream window classification.
    """
    seq = read.query_sequence or ""

    if clip_len <= 0 or query_pos + clip_len > len(seq):
        return None

    clip_seq = seq[query_pos:query_pos + clip_len]

    # Determine 5' vs 3'
    read_len = len(seq)
    if query_pos == 0:
        side = "5prime"
        anchor_ref_pos = read.reference_start
        anchor_type = "first_aligned_ref_base_after_clip"
    elif query_pos + clip_len >= read_len:
        side = "3prime"
        anchor_ref_pos = read.reference_end - 1 if read.reference_end else ref_pos - 1
        anchor_type = "last_aligned_ref_base_before_clip"
    else:
        side = "internal"
        anchor_ref_pos = ref_pos
        anchor_type = "adjacent_aligned_ref_base"

    # Get quality scores
    try:
        qual_array = read.query_qualities
        if qual_array is not None and len(qual_array) >= query_pos + clip_len:
            clip_qual = qual_array[query_pos:query_pos + clip_len]
            avg_quality = sum(clip_qual) / len(clip_qual) if clip_qual else 0.0
        else:
            clip_qual = []
            avg_quality = 0.0
    except (AttributeError, TypeError):
        clip_qual = []
        avg_quality = 0.0

    return {
        "read_end": "R1" if part_name == "read1" else "R2" if part_name == "read2" else "single",
        "part_name": part_name,
        "side": side,
        "clip_seq": clip_seq,
        "clip_len": len(clip_seq),
        "clip_qual": list(clip_qual) if clip_qual else [],
        "avg_quality": avg_quality,
        "anchor_ref_pos": anchor_ref_pos,
        "reference_start": read.reference_start,
        "reference_end": read.reference_end,
        "read_is_reverse": bool(read.is_reverse),
        "anchor_type": anchor_type,
        "filter_status": "unfiltered",
        "filter_reason": None,
        "softclip_event_class": None,
        "softclip_region": None,
        "op_index": op_index,
    }


def build_candidate_from_read(read, ref_record, ref_ctx, part_name=None):
    """
    Build a candidate dict from a single pysam AlignedSegment.

    V8.6: computes outside_window_identity separately from raw identity,
    collects soft-clip segments, and tracks cigar_has_s.
    """
    window_positions = ref_ctx.get("window_positions", set())
    ref_seq = str(ref_record["sequence"]).upper()
    seq = read.query_sequence or ""
    seq_upper = seq.upper()

    outside_matches = 0
    outside_mismatches = 0
    in_window_matches = 0
    in_window_mismatches = 0

    base_states = {}
    events = []
    insertions_bp = 0
    deletions_bp = 0
    aligned_query_bases = 0
    aligned_ref_query_pairs = 0

    cigar_has_s = False
    softclip_segments = []

    ref_pos = read.reference_start
    query_pos = 0

    for op, length in (read.cigartuples or []):
        if op in (0, 7, 8):
            for offset in range(length):
                ref_p = ref_pos + offset
                query_p = query_pos + offset
                if ref_p < 0 or ref_p >= len(ref_seq):
                    continue
                if query_p < 0 or query_p >= len(seq_upper):
                    continue
                rbase = ref_seq[ref_p]
                qbase = seq_upper[query_p]
                in_window = ref_p in window_positions
                base_states[ref_p] = qbase
                aligned_query_bases += 1
                aligned_ref_query_pairs += 1
                if qbase == rbase:
                    if in_window:
                        in_window_matches += 1
                    else:
                        outside_matches += 1
                else:
                    if in_window:
                        in_window_mismatches += 1
                    else:
                        outside_mismatches += 1
                    events.append({"kind": "SNP", "pos": ref_p, "ref": rbase, "alt": qbase})
            ref_pos += length
            query_pos += length
        elif op == 1:
            ins_seq = seq_upper[query_pos:query_pos + length]
            events.append({"kind": "INS", "anchor": ref_pos - 1, "seq": ins_seq})
            insertions_bp += length
            query_pos += length
        elif op == 2:
            for offset in range(length):
                if ref_pos + offset < len(ref_seq):
                    base_states[ref_pos + offset] = "-"
            events.append({"kind": "DEL", "start": ref_pos, "length": length})
            deletions_bp += length
            ref_pos += length
        elif op == 3:
            ref_pos += length
        elif op == 4:
            cigar_has_s = True
            segment = collect_softclip_segment(
                read=read, query_pos=query_pos, clip_len=length,
                ref_pos=ref_pos, part_name=part_name,
                op_index=len(softclip_segments),
            )
            if segment is not None:
                softclip_segments.append(segment)
            query_pos += length
        elif op == 5:
            continue
        elif op == 6:
            continue
        else:
            continue

    outside_denom = outside_matches + outside_mismatches
    if outside_denom > 0:
        outside_window_identity = outside_matches / outside_denom * 100.0
        outside_window_identity_available = True
    else:
        outside_window_identity = None
        outside_window_identity_available = False

    total_matches = outside_matches + in_window_matches
    total_mismatches = outside_mismatches + in_window_mismatches
    raw_denom = total_matches + total_mismatches + insertions_bp + deletions_bp
    if raw_denom > 0:
        identity = total_matches / raw_denom * 100.0
    else:
        identity = None

    coverage_pct = len(base_states) / max(1, ref_record["length"]) * 100.0

    window_events = []
    outside_events = []
    for event in events:
        if event_overlaps_window(event, ref_ctx):
            window_events.append(event)
        else:
            outside_events.append(event)

    candidate = {
        "ref_name": ref_record["name"],
        "qname": read.query_name,
        "part_name": part_name,
        "cigar": read.cigarstring,
        "mapq": int(read.mapping_quality or 0),
        "is_secondary_alignment": bool(getattr(read, "is_secondary", False)),
        "is_supplementary_alignment": bool(getattr(read, "is_supplementary", False)),
        "cigar_has_s": cigar_has_s,
        "softclip_segments": softclip_segments,
        "read_alignment_class": "relaxed_aligned" if cigar_has_s else "full_aligned",
        "outside_matches": outside_matches,
        "outside_mismatches": outside_mismatches,
        "outside_window_identity": outside_window_identity,
        "outside_window_identity_available": outside_window_identity_available,
        "in_window_matches": in_window_matches,
        "in_window_mismatches": in_window_mismatches,
        "insertions_bp": insertions_bp,
        "deletions_bp": deletions_bp,
        "aligned_query_bases": aligned_query_bases,
        "aligned_ref_query_pairs": aligned_ref_query_pairs,
        "identity_score": identity,
        "identity": identity,
        "coverage_pct": coverage_pct,
        "aligned_bases": aligned_ref_query_pairs,
        "base_states": base_states,
        "window_events": window_events,
        "outside_events": outside_events,
        "raw_sequence": seq,
        "parts": [],
        "tag_parts": [make_candidate_tag_part(part_name or "read", base_states, seq, ref_ctx, events)],
    }
    candidate["parts"] = [candidate]
    return candidate


def combine_candidates(ref_name, left, right):
    """
    Merge R1 and R2 per-read candidates into a pair-level candidate.

    V8.6: recomputes pair-level outside_window_identity from summed
    matches/mismatches (not averaged). Merges softclip_segments from
    both ends. Determines read_alignment_class at pair level.
    """
    if left is None and right is None:
        return None
    if left is None:
        combined = deepcopy(right)
        _ensure_v86_pair_fields(combined)
        return combined
    if right is None:
        combined = deepcopy(left)
        _ensure_v86_pair_fields(combined)
        return combined

    parts = [left, right]

    # Pair-level outside-window identity
    pair_outside_matches = sum(p.get("outside_matches", 0) for p in parts)
    pair_outside_mismatches = sum(p.get("outside_mismatches", 0) for p in parts)
    pair_outside_denom = pair_outside_matches + pair_outside_mismatches
    if pair_outside_denom > 0:
        pair_outside_window_identity = pair_outside_matches / pair_outside_denom * 100.0
        pair_outside_window_identity_available = True
    else:
        pair_outside_window_identity = None
        pair_outside_window_identity_available = False

    pair_in_window_matches = sum(p.get("in_window_matches", 0) for p in parts)
    pair_in_window_mismatches = sum(p.get("in_window_mismatches", 0) for p in parts)
    pair_cigar_has_s = any(p.get("cigar_has_s", False) for p in parts)

    # Merge softclip segments (preserving origin metadata)
    pair_softclip_segments = []
    for p in parts:
        for seg in p.get("softclip_segments", []):
            pair_softclip_segments.append(deepcopy(seg))

    # Legacy identity (stats only)
    total_matches = pair_outside_matches + pair_in_window_matches
    total_mismatches = pair_outside_mismatches + pair_in_window_mismatches
    total_insertions = sum(p.get("insertions_bp", 0) for p in parts)
    total_deletions = sum(p.get("deletions_bp", 0) for p in parts)
    raw_denom = total_matches + total_mismatches + total_insertions + total_deletions
    if raw_denom > 0:
        pair_identity = total_matches / raw_denom * 100.0
    else:
        pair_identity = None

    combined = {
        "ref_name": ref_name,
        "qname": left.get("qname", right.get("qname", "")),
        "has_read1_candidate": True,
        "has_read2_candidate": True,
        "pair_candidate_complete": True,
        "read1_mapq": int(left.get("mapq", 0) or 0),
        "read2_mapq": int(right.get("mapq", 0) or 0),
        "read1_cigar": left.get("cigar", ""),
        "read2_cigar": right.get("cigar", ""),
        "read1_has_softclip": bool(left.get("cigar_has_s", False)),
        "read2_has_softclip": bool(right.get("cigar_has_s", False)),
        "cigar_has_s": pair_cigar_has_s,
        "read_alignment_class": "relaxed_aligned" if pair_cigar_has_s else "full_aligned",
        "softclip_segments": pair_softclip_segments,
        "outside_matches": pair_outside_matches,
        "outside_mismatches": pair_outside_mismatches,
        "outside_window_identity": pair_outside_window_identity,
        "outside_window_identity_available": pair_outside_window_identity_available,
        "in_window_matches": pair_in_window_matches,
        "in_window_mismatches": pair_in_window_mismatches,
        "insertions_bp": total_insertions,
        "deletions_bp": total_deletions,
        "aligned_query_bases": sum(p.get("aligned_query_bases", 0) for p in parts),
        "aligned_ref_query_pairs": sum(p.get("aligned_ref_query_pairs", 0) for p in parts),
        "identity_score": pair_identity,
        "identity": pair_identity,
        "mapq": max(left.get("mapq", 0) or 0, right.get("mapq", 0) or 0),
        "is_secondary_alignment": all(p.get("is_secondary_alignment", False) for p in parts),
        "is_supplementary_alignment": any(p.get("is_supplementary_alignment", False) for p in parts),
        "coverage_pct": max(
            left.get("coverage_pct", 0), right.get("coverage_pct", 0)
        ),
        "aligned_bases": (
            left.get("aligned_bases", 0) + right.get("aligned_bases", 0)
        ),
        "base_states": merge_base_states(
            left.get("base_states", {}), right.get("base_states", {})
        ),
        "window_events": (
            list(left.get("window_events", [])) + list(right.get("window_events", []))
        ),
        "outside_events": (
            list(left.get("outside_events", [])) + list(right.get("outside_events", []))
        ),
        "raw_sequence": (
            f"{left.get('raw_sequence', '')}|{right.get('raw_sequence', '')}"
        ),
        "tag_parts": (
            left.get("tag_parts", []) + right.get("tag_parts", [])
        ),
        "parts": parts,
    }
    return combined


def combine_candidates_strict_pair(ref_name, left, right):
    if left is None or right is None:
        return None
    return combine_candidates(ref_name, left, right)


def _ensure_v86_pair_fields(candidate):
    """Ensure single-end candidates have all V8.6 pair-level fields."""
    if "read_alignment_class" not in candidate:
        candidate["read_alignment_class"] = (
            "relaxed_aligned" if candidate.get("cigar_has_s") else "full_aligned"
        )
    if "outside_window_identity_available" not in candidate:
        candidate["outside_window_identity_available"] = (
            candidate.get("outside_window_identity") is not None
        )
    if "parts" not in candidate:
        candidate["parts"] = [candidate]
    if "pair_candidate_complete" not in candidate:
        part_names = {p.get("part_name") for p in candidate.get("parts", []) if isinstance(p, dict)}
        has_read1 = "read1" in part_names or candidate.get("part_name") == "read1"
        has_read2 = "read2" in part_names or candidate.get("part_name") == "read2"
        candidate["has_read1_candidate"] = bool(has_read1)
        candidate["has_read2_candidate"] = bool(has_read2)
        candidate["pair_candidate_complete"] = bool(has_read1 and has_read2)


def normalize_hitom_sample_name(sample_name):
    match = re.fullmatch(r"([A-Za-z]+)0*([0-9]+)", str(sample_name).strip())
    if not match:
        return str(sample_name).strip()
    return f"{match.group(1).upper()}{int(match.group(2))}"


def parse_hitom_sequence_table(path):
    """
    Read a Hi-TOM Sequence.xls export. Hi-TOM writes this file as tab-delimited
    text with an .xls suffix, so parse it directly instead of using an Excel
    engine.
    """
    required = [
        "Sort", "Reads number", "Ratio", "Left variation type", "Right variation type",
        "Left variation", "Right variation", "Left reads seq", "Right reads seq",
    ]
    with open(path, "rb") as probe:
        signature = probe.read(4)
    if signature.startswith(b"PK"):
        return parse_hitom_sequence_workbook(path)

    rows_by_sample = defaultdict(list)
    current_sample = None

    with open(path, "r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.reader(handle, delimiter="\t")
        try:
            header = next(reader)
        except StopIteration:
            raise ValueError(f"Empty Hi-TOM sequence file: {path}")
        if header[:len(required)] != required:
            raise ValueError(
                "Unsupported Hi-TOM sequence header. Expected: " + "\t".join(required)
            )

        for parts in reader:
            if not parts or all(not x for x in parts):
                continue
            if len(parts) == 1:
                current_sample = normalize_hitom_sample_name(parts[0])
                continue
            if current_sample is None:
                raise ValueError("Encountered Hi-TOM allele row before sample label")
            if len(parts) < len(required):
                continue
            try:
                read_count = int(float(parts[1]))
            except (TypeError, ValueError):
                continue
            if read_count <= 0:
                continue
            rows_by_sample[current_sample].append({
                "Sort": parts[0],
                "Reads number": read_count,
                "Ratio": parts[2],
                "Left variation type": parts[3],
                "Right variation type": parts[4],
                "Left variation": parts[5],
                "Right variation": parts[6],
                "Left reads seq": parts[7].strip(),
                "Right reads seq": parts[8].strip(),
            })

    return dict(rows_by_sample)


def parse_hitom_sequence_workbook(path):
    if not OPENPYXL_AVAILABLE:
        raise RuntimeError("openpyxl is required to import .xlsx Hi-TOM workbooks")

    wb = load_workbook(path, read_only=True, data_only=True)
    ws = wb[wb.sheetnames[0]]
    header = [cell for cell in next(ws.iter_rows(min_row=1, max_row=1, values_only=True))]

    def col_index(name):
        for idx, value in enumerate(header):
            if str(value).strip() == name:
                return idx
        raise ValueError(f"Unsupported Hi-TOM workbook header; missing column: {name}")

    try:
        idx_sort = col_index("Sort")
    except ValueError:
        idx_sort = 0
    idx_reads = col_index("Reads number")
    idx_ratio = col_index("Ratio")
    idx_left_type = col_index("Left variation type")
    idx_right_type = col_index("Right variation type")
    idx_left_var = col_index("Left variation")
    idx_right_var = col_index("Right variation")
    idx_left_seq = col_index("Left reads seq")
    idx_right_seq = col_index("Right reads seq")

    rows_by_sample = defaultdict(list)
    current_sample = None
    for raw_row in ws.iter_rows(min_row=2, values_only=True):
        if not raw_row or all(value is None or value == "" for value in raw_row):
            continue
        sort_value = raw_row[idx_sort] if idx_sort < len(raw_row) else None
        reads_value = raw_row[idx_reads] if idx_reads < len(raw_row) else None
        if reads_value is None:
            current_sample = normalize_hitom_sample_name(sort_value)
            continue
        if current_sample is None:
            raise ValueError("Encountered Hi-TOM allele row before sample label")
        try:
            read_count = int(float(reads_value))
        except (TypeError, ValueError):
            continue
        if read_count <= 0:
            continue
        ratio_value = raw_row[idx_ratio] if idx_ratio < len(raw_row) else ""
        if isinstance(ratio_value, (int, float)):
            ratio_value = f"{ratio_value * 100:.2f}%"
        rows_by_sample[current_sample].append({
            "Sort": str(sort_value),
            "Reads number": read_count,
            "Ratio": str(ratio_value or ""),
            "Left variation type": str(raw_row[idx_left_type] or ""),
            "Right variation type": str(raw_row[idx_right_type] or ""),
            "Left variation": str(raw_row[idx_left_var] or ""),
            "Right variation": str(raw_row[idx_right_var] or ""),
            "Left reads seq": str(raw_row[idx_left_seq] or "").strip(),
            "Right reads seq": str(raw_row[idx_right_seq] or "").strip(),
        })

    return dict(rows_by_sample)


def hitom_sample_sort_key(sample):
    parsed = parse_plate_position(sample)
    if parsed is None:
        return (str(sample), 0)
    row_label, col_num = parsed
    return (row_label, col_num)


def _clean_read_sequence(seq):
    seq = (seq or "").strip()
    if not seq or seq == "-":
        return ""
    return re.sub(r"[^ACGTUNacgtun]", "", seq).upper().replace("U", "T")


def smith_waterman_query_to_reference(query, reference):
    query = _clean_read_sequence(query)
    reference = _clean_read_sequence(reference)
    if not query or not reference:
        return "", "", [], 0.0

    m = len(query)
    n = len(reference)
    gap = -2
    match_score = 2
    mismatch_score = -1
    scores = [[0] * (n + 1) for _ in range(m + 1)]
    trace = [[0] * (n + 1) for _ in range(m + 1)]
    best_score = 0
    best_cell = (0, 0)

    for i in range(1, m + 1):
        qbase = query[i - 1]
        for j in range(1, n + 1):
            rbase = reference[j - 1]
            diag = scores[i - 1][j - 1] + (match_score if qbase == rbase else mismatch_score)
            up = scores[i - 1][j] + gap
            left = scores[i][j - 1] + gap
            value = max(0, diag, up, left)
            scores[i][j] = value
            if value == 0:
                trace[i][j] = 0
            elif value == diag:
                trace[i][j] = 1
            elif value == up:
                trace[i][j] = 2
            else:
                trace[i][j] = 3
            if value > best_score:
                best_score = value
                best_cell = (i, j)

    if best_score <= 0:
        return "", "", [], 0.0

    i, j = best_cell
    aln_q = []
    aln_r = []
    ref_positions = []
    while i > 0 and j > 0 and scores[i][j] > 0:
        direction = trace[i][j]
        if direction == 1:
            aln_q.append(query[i - 1])
            aln_r.append(reference[j - 1])
            ref_positions.append(j - 1)
            i -= 1
            j -= 1
        elif direction == 2:
            aln_q.append(query[i - 1])
            aln_r.append("-")
            ref_positions.append(None)
            i -= 1
        elif direction == 3:
            aln_q.append("-")
            aln_r.append(reference[j - 1])
            ref_positions.append(j - 1)
            j -= 1
        else:
            break

    return (
        "".join(reversed(aln_q)),
        "".join(reversed(aln_r)),
        list(reversed(ref_positions)),
        float(best_score),
    )


def events_from_local_alignment(aligned_query, aligned_ref, ref_positions, ref_seq):
    base_states = {}
    events = []
    matches = 0
    mismatches = 0
    insertions_bp = 0
    deletions_bp = 0
    aligned_bases = 0
    idx = 0

    while idx < len(aligned_query):
        qbase = aligned_query[idx]
        rbase = aligned_ref[idx]
        rpos = ref_positions[idx]

        if qbase != "-" and rbase != "-" and rpos is not None:
            qbase = qbase.upper()
            rbase = rbase.upper()
            base_states[rpos] = qbase
            aligned_bases += 1
            if qbase == rbase:
                matches += 1
            else:
                mismatches += 1
                events.append({"kind": "SNP", "pos": rpos, "ref": rbase, "alt": qbase})
            idx += 1
            continue

        if qbase != "-" and rbase == "-":
            start_idx = idx
            inserted = []
            while idx < len(aligned_query) and aligned_query[idx] != "-" and aligned_ref[idx] == "-":
                inserted.append(aligned_query[idx].upper())
                idx += 1
            prev_pos = None
            for back in range(start_idx - 1, -1, -1):
                if ref_positions[back] is not None:
                    prev_pos = ref_positions[back]
                    break
            if prev_pos is None:
                next_pos = None
                for forward in range(idx, len(ref_positions)):
                    if ref_positions[forward] is not None:
                        next_pos = ref_positions[forward]
                        break
                prev_pos = -1 if next_pos is None else next_pos - 1
            ins_seq = "".join(inserted)
            events.append({"kind": "INS", "anchor": prev_pos, "seq": ins_seq})
            insertions_bp += len(ins_seq)
            continue

        if qbase == "-" and rbase != "-" and rpos is not None:
            start = rpos
            length = 0
            while idx < len(aligned_query) and aligned_query[idx] == "-" and aligned_ref[idx] != "-":
                if ref_positions[idx] is not None:
                    base_states[ref_positions[idx]] = "-"
                    length += 1
                idx += 1
            if length:
                events.append({"kind": "DEL", "start": start, "length": length})
                deletions_bp += length
            continue

        idx += 1

    denom = max(1, matches + mismatches + insertions_bp + deletions_bp)
    identity = matches / denom * 100.0
    coverage_pct = len(base_states) / max(1, len(ref_seq)) * 100.0
    return base_states, events, identity, coverage_pct, aligned_bases


def build_candidate_from_hitom_sequences(left_seq, right_seq, ref_record, ref_ctx):
    parts = []
    ref_seq = str(ref_record["sequence"]).upper()
    window_positions = ref_ctx.get("window_positions", set())
    for part_name, raw_seq in (("left", left_seq), ("right", right_seq)):
        cleaned = _clean_read_sequence(raw_seq)
        if not cleaned:
            parts.append(None)
            continue
        aligned_q, aligned_r, ref_positions, _ = smith_waterman_query_to_reference(cleaned, ref_record["sequence"])
        if not aligned_q:
            parts.append(None)
            continue
        base_states, events, identity, coverage_pct, aligned_bases = events_from_local_alignment(
            aligned_q, aligned_r, ref_positions, ref_record["sequence"]
        )
        outside_matches = 0
        outside_mismatches = 0
        in_window_matches = 0
        in_window_mismatches = 0
        for coord_pos, observed in base_states.items():
            if not isinstance(coord_pos, int):
                continue
            if coord_pos < 0 or coord_pos >= len(ref_seq):
                continue
            observed = str(observed).upper()
            if observed not in DNA_BASES:
                continue
            ref_base = ref_seq[coord_pos]
            in_window = coord_pos in window_positions
            if observed == ref_base:
                if in_window:
                    in_window_matches += 1
                else:
                    outside_matches += 1
            else:
                if in_window:
                    in_window_mismatches += 1
                else:
                    outside_mismatches += 1
        outside_denom = outside_matches + outside_mismatches
        if outside_denom > 0:
            outside_window_identity = outside_matches / outside_denom * 100.0
            outside_window_identity_available = True
        else:
            outside_window_identity = None
            outside_window_identity_available = False
        insertions_bp = sum(
            len(event.get("seq", event.get("inserted_seq", "")))
            for event in events
            if event.get("kind") == "INS"
        )
        deletions_bp = sum(
            int(event.get("length", 0))
            for event in events
            if event.get("kind") == "DEL"
        )
        window_events = []
        outside_events = []
        for event in events:
            if event_overlaps_window(event, ref_ctx):
                window_events.append(event)
            elif not event_near_excluded_edge(event, ref_ctx, ref_record["length"]):
                outside_events.append(event)
        parts.append({
            "ref_name": ref_record["name"],
            "qname": f"{part_name}:{cleaned}",
            "part_name": part_name,
            "identity_score": identity,
            "identity": identity,
            "outside_matches": outside_matches,
            "outside_mismatches": outside_mismatches,
            "outside_window_identity": outside_window_identity,
            "outside_window_identity_available": outside_window_identity_available,
            "in_window_matches": in_window_matches,
            "in_window_mismatches": in_window_mismatches,
            "insertions_bp": insertions_bp,
            "deletions_bp": deletions_bp,
            "aligned_query_bases": aligned_bases,
            "aligned_ref_query_pairs": aligned_bases,
            "read_alignment_class": "full_aligned",
            "cigar_has_s": False,
            "softclip_segments": [],
            "coverage_pct": coverage_pct,
            "aligned_bases": aligned_bases,
            "base_states": base_states,
            "window_events": window_events,
            "outside_events": outside_events,
            "raw_sequence": cleaned,
            "tag_parts": [make_candidate_tag_part(part_name, base_states, cleaned, ref_ctx, events)],
        })
    return combine_candidates(ref_record["name"], parts[0], parts[1])


def load_ref_candidates_for_sample(ref_record, sample, run_root, mode, ref_ctx):
    bam_path = os.path.join(run_root, "reference_results", ref_record["safe_name"], "bwa", f"{sample}.filter.bam")
    if not os.path.exists(bam_path):
        return {}

    if mode == "overlap":
        candidates = {}
        with pysam.AlignmentFile(bam_path, "rb") as bam:
            for read in bam:
                if read.is_secondary or read.is_supplementary or read.is_unmapped:
                    continue
                candidates[read.query_name] = build_candidate_from_read(read, ref_record, ref_ctx, "read")
        return candidates

    paired = defaultdict(dict)
    with pysam.AlignmentFile(bam_path, "rb") as bam:
        for read in bam:
            if read.is_secondary or read.is_supplementary or read.is_unmapped:
                continue
            read_part = "read1" if read.is_read1 else "read2"
            paired[read.query_name][read_part] = build_candidate_from_read(read, ref_record, ref_ctx, read_part)

    combined = {}
    for qname, parts in paired.items():
        combined[qname] = combine_candidates(ref_record["name"], parts.get("read1"), parts.get("read2"))
    return combined


def better_candidate_for_group_loader(existing, candidate):
    if existing is None:
        return candidate
    existing_key = (
        0 if existing.get("is_secondary_alignment") else 1,
        existing.get("mapq", 0) or 0,
        candidate_score_proxy(existing),
    )
    candidate_key = (
        0 if candidate.get("is_secondary_alignment") else 1,
        candidate.get("mapq", 0) or 0,
        candidate_score_proxy(candidate),
    )
    return candidate if candidate_key > existing_key else existing


def _empty_pair_candidate_qc():
    return {
        "BWA qnames": 0,
        "qnames_with_R1_alignment": 0,
        "qnames_with_R2_alignment": 0,
        "qnames_with_both_mates_alignment": 0,
        "qnames_with_pair_candidate": 0,
        "dropped_missing_R1_candidate": 0,
        "dropped_missing_R2_candidate": 0,
        "dropped_no_strict_pair_candidate": 0,
    }


def load_group_candidates_for_sample(
    group_model,
    reference_records_by_name,
    sample,
    run_root,
    mode,
    ref_contexts,
    return_pair_qc=False,
):
    """
    Load V10.2 group-level BAM once for a sample/group.

    Returns {qname: {ref_name: paired_candidate}}. Secondary and low-MAPQ
    alignments are retained as evidence, but disjoint mode only emits a
    reference candidate when both R1 and R2 can be built for that qname/ref.
    """
    if pysam is None:
        return ({}, _empty_pair_candidate_qc()) if return_pair_qc else {}
    group_name = group_model["group_name"]
    bam_path = group_bam_path(run_root, group_name, sample)
    if not os.path.exists(bam_path):
        return ({}, _empty_pair_candidate_qc()) if return_pair_qc else {}

    if mode == "overlap":
        candidates = defaultdict(dict)
        qnames = set()
        with pysam.AlignmentFile(bam_path, "rb") as bam:
            for read in bam.fetch(until_eof=True):
                if read.is_unmapped or read.is_supplementary:
                    continue
                ref_name = getattr(read, "reference_name", None)
                if ref_name not in group_model.get("reference_names", []):
                    continue
                qnames.add(read.query_name)
                candidate = build_candidate_from_read(
                    read,
                    reference_records_by_name[ref_name],
                    ref_contexts[ref_name],
                    "read",
                )
                if candidate is not None:
                    candidate["has_read1_candidate"] = True
                    candidate["has_read2_candidate"] = True
                    candidate["pair_candidate_complete"] = True
                    candidates[read.query_name][ref_name] = better_candidate_for_group_loader(
                        candidates[read.query_name].get(ref_name),
                        candidate,
                    )
        result = {qname: dict(by_ref) for qname, by_ref in candidates.items()}
        pair_qc = _empty_pair_candidate_qc()
        pair_qc["BWA qnames"] = len(qnames)
        pair_qc["qnames_with_R1_alignment"] = len(qnames)
        pair_qc["qnames_with_R2_alignment"] = len(qnames)
        pair_qc["qnames_with_both_mates_alignment"] = len(qnames)
        pair_qc["qnames_with_pair_candidate"] = len(result)
        return (result, pair_qc) if return_pair_qc else result

    paired = defaultdict(lambda: defaultdict(dict))
    qnames_with_read1 = set()
    qnames_with_read2 = set()
    with pysam.AlignmentFile(bam_path, "rb") as bam:
        for read in bam.fetch(until_eof=True):
            if read.is_unmapped or read.is_supplementary:
                continue
            ref_name = getattr(read, "reference_name", None)
            if ref_name not in group_model.get("reference_names", []):
                continue
            read_part = "read1" if read.is_read1 else "read2"
            if read_part == "read1":
                qnames_with_read1.add(read.query_name)
            elif read_part == "read2":
                qnames_with_read2.add(read.query_name)
            candidate = build_candidate_from_read(
                read,
                reference_records_by_name[ref_name],
                ref_contexts[ref_name],
                read_part,
            )
            if candidate is None:
                continue
            current = paired[read.query_name][ref_name].get(read_part)
            paired[read.query_name][ref_name][read_part] = better_candidate_for_group_loader(current, candidate)

    combined = defaultdict(dict)
    dropped_missing_r1 = set()
    dropped_missing_r2 = set()
    dropped_no_pair = set()
    for qname, by_ref in paired.items():
        for ref_name, parts in by_ref.items():
            has_read1 = parts.get("read1") is not None
            has_read2 = parts.get("read2") is not None
            if not has_read1:
                dropped_missing_r1.add(qname)
            if not has_read2:
                dropped_missing_r2.add(qname)
            candidate = combine_candidates_strict_pair(ref_name, parts.get("read1"), parts.get("read2"))
            if candidate is not None:
                combined[qname][ref_name] = candidate
        if not combined.get(qname):
            dropped_no_pair.add(qname)
    result = {qname: dict(by_ref) for qname, by_ref in combined.items()}
    qnames_with_any = set(paired)
    qnames_with_both_mates = qnames_with_read1 & qnames_with_read2
    pair_qc = {
        "BWA qnames": len(qnames_with_any),
        "qnames_with_R1_alignment": len(qnames_with_read1),
        "qnames_with_R2_alignment": len(qnames_with_read2),
        "qnames_with_both_mates_alignment": len(qnames_with_both_mates),
        "qnames_with_pair_candidate": len(result),
        "dropped_missing_R1_candidate": len(dropped_missing_r1),
        "dropped_missing_R2_candidate": len(dropped_missing_r2),
        "dropped_no_strict_pair_candidate": len(dropped_no_pair),
    }
    return (result, pair_qc) if return_pair_qc else result


def score_candidate_against_reference(candidate, features):
    if not features:
        return candidate["identity_score"], 0
    matches = 0
    covered = 0
    for feature in features:
        obs = candidate["base_states"].get(feature["coord_pos"])
        if obs is None:
            continue
        covered += 1
        if obs == feature["expected_state"]:
            matches += 1
    if covered == 0:
        return candidate["identity_score"], 0
    return matches / covered * 100.0, covered


def candidate_matches_reference_genotype(candidate, features):
    if not features:
        return False, 0, 0
    matched = 0
    total = len(features)
    for feature in features:
        observed_state = candidate["base_states"].get(feature["coord_pos"])
        if observed_state is None:
            return False, matched, total
        if observed_state != feature["expected_state"]:
            return False, matched, total
        matched += 1
    return True, matched, total


def score_candidate_soft_against_reference(candidate, features):
    """
    软分配打分：
    - 命中 informative site 加分；
    - 冲突 informative site 强扣分；
    - 未覆盖位点不扣分，只记为 unknown；
    - 轻度引入 identity score 作为并列时的辅助。
    """
    covered = 0
    matches = 0
    conflicts = 0
    for feature in features:
        observed_state = candidate["base_states"].get(feature["coord_pos"])
        if observed_state is None:
            continue
        covered += 1
        if observed_state == feature["expected_state"]:
            matches += 1
        else:
            conflicts += 1

    score = matches * 2.0 - conflicts * 3.0 + candidate["identity_score"] * 0.01
    return {
        "score": score,
        "covered": covered,
        "matches": matches,
        "conflicts": conflicts,
    }


def ordered_tag_part_groups(candidate_by_ref):
    guide_overlap_by_part = defaultdict(int)
    order_by_part = {}
    for candidate in candidate_by_ref.values():
        for part in candidate.get("tag_parts", []):
            name = part.get("part_name", "read")
            if name not in order_by_part:
                order_by_part[name] = len(order_by_part)
            guide_overlap_by_part[name] = max(
                guide_overlap_by_part[name],
                int(part.get("guide_overlap", 0) or 0),
            )

    if not order_by_part:
        return [None]

    max_overlap = max(guide_overlap_by_part.values()) if guide_overlap_by_part else 0
    if max_overlap <= 0:
        return [set(order_by_part)]

    primary = {
        name for name, overlap in guide_overlap_by_part.items()
        if overlap == max_overlap
    }
    secondary = set(order_by_part) - primary
    groups = [primary]
    if secondary:
        groups.append(secondary)
    return groups


def unique_positive_vote(votes):
    positive = {ref_name: count for ref_name, count in votes.items() if count > 0}
    if len(positive) == 1:
        return next(iter(positive))
    if len(positive) > 1:
        return "AMBIGUOUS"
    return None


def event_site_ids_on_common_coordinate(event, coord_to_site_id):
    site_ids = set()
    if event["kind"] == "SNP":
        site_id = coord_to_site_id.get(event["pos"])
        if site_id:
            site_ids.add(site_id)
        return site_ids
    if event["kind"] == "DEL":
        positions = range(event["start"], event["start"] + event["length"])
    else:
        positions = (event["anchor"], event["anchor"] + 1)
    for pos in positions:
        site_id = coord_to_site_id.get(pos)
        if site_id:
            site_ids.add(site_id)
    return site_ids


def collect_common_coordinate_tag_observations(candidate_by_ref, group_model, allowed_parts):
    observed_by_site = defaultdict(set)
    edited_site_ids = set()
    coord_maps = group_model.get("site_id_by_ref_coord", {})
    for ref_name, candidate in candidate_by_ref.items():
        coord_to_site_id = coord_maps.get(ref_name, {})
        if not coord_to_site_id:
            continue
        for part in candidate.get("tag_parts", []):
            if allowed_parts is not None and part.get("part_name", "read") not in allowed_parts:
                continue
            for coord_pos, observed in part.get("base_states", {}).items():
                site_id = coord_to_site_id.get(coord_pos)
                observed = str(observed).upper()
                if not site_id or observed not in DNA_BASES:
                    continue
                observed_by_site[site_id].add(observed)
            for event in part.get("events", []):
                edited_site_ids.update(event_site_ids_on_common_coordinate(event, coord_to_site_id))

    consensus_by_site = {}
    for site_id, observed_states in observed_by_site.items():
        if site_id in edited_site_ids or len(observed_states) != 1:
            continue
        consensus_by_site[site_id] = next(iter(observed_states))
    return consensus_by_site, edited_site_ids


def snp_tag_votes(candidate_by_ref, group_model, allowed_parts):
    votes = {ref_name: 0 for ref_name in candidate_by_ref}
    consensus_by_site, edited_site_ids = collect_common_coordinate_tag_observations(
        candidate_by_ref,
        group_model,
        allowed_parts,
    )
    for ref_name, candidate in candidate_by_ref.items():
        tags = group_model.get("snp_tag_sites_by_ref", {}).get(ref_name, [])
        if not tags:
            continue
        for tag in tags:
            site_id = tag.get("site_id")
            if site_id in edited_site_ids:
                continue
            observed = consensus_by_site.get(site_id)
            if observed and observed == tag["expected_state"]:
                votes[ref_name] += 1
    return votes


def kmer_tag_votes(candidate_by_ref, group_model, allowed_parts):
    votes = {ref_name: 0 for ref_name in candidate_by_ref}
    for ref_name, candidate in candidate_by_ref.items():
        tags = group_model.get("unique_kmer_tags_by_ref", {}).get(ref_name, [])
        if not tags:
            continue
        for part in candidate.get("tag_parts", []):
            if allowed_parts is not None and part.get("part_name", "read") not in allowed_parts:
                continue
            seq = str(part.get("raw_sequence", "")).upper()
            if not seq:
                continue
            votes[ref_name] += sum(1 for kmer in tags if kmer in seq)
    return votes


def tag_expected_state(tag):
    return str(tag.get("calibrated_expected_state", tag.get("expected_state", ""))).upper()


def tag_natural_states(tag):
    states = {
        str(value).upper()
        for value in (tag.get("states_by_ref") or {}).values()
        if str(value).upper() in DNA_BASES or str(value).upper() == "-"
    }
    expected = tag_expected_state(tag)
    if expected in DNA_BASES or expected == "-":
        states.add(expected)
    return states


def normalize_anchor_key(anchor_key):
    if isinstance(anchor_key, tuple):
        return anchor_key
    if isinstance(anchor_key, list):
        return tuple(anchor_key)
    return None


def candidate_tag_parts(candidate):
    parts = candidate.get("tag_parts")
    if parts:
        return parts
    return [
        {
            "base_states": candidate.get("base_states", {}),
            "events": candidate.get("window_events", []) + candidate.get("outside_events", []),
            "raw_sequence": candidate.get("raw_sequence", ""),
        }
    ]


def event_overlaps_position(event, coord_pos):
    if coord_pos is None:
        return False
    kind = event.get("kind")
    if kind == "SNP":
        return event.get("pos") == coord_pos
    if kind == "DEL":
        start = int(event.get("start", -1))
        length = int(event.get("length", 0))
        return start <= coord_pos < start + length
    if kind == "INS":
        anchor = event.get("anchor")
        return anchor in {coord_pos, coord_pos - 1}
    return False


def event_near_anchor(event, anchor_pos, radius=1):
    if anchor_pos is None:
        return False
    kind = event.get("kind")
    if kind == "INS":
        anchor = event.get("anchor")
        return anchor is not None and abs(int(anchor) - int(anchor_pos)) <= radius
    if kind == "SNP":
        pos = event.get("pos")
        return pos is not None and abs(int(pos) - int(anchor_pos)) <= radius
    if kind == "DEL":
        start = int(event.get("start", -1))
        length = int(event.get("length", 0))
        return start - radius <= anchor_pos <= start + length + radius
    return False


def non_gap_natural_state(tag):
    for state in tag_natural_states(tag):
        if state in DNA_BASES:
            return state
    return None


def part_has_flank_coverage(part, anchor_pos, radius=3):
    if anchor_pos is None:
        return False
    for coord_pos, observed in part.get("base_states", {}).items():
        if not isinstance(coord_pos, int):
            continue
        if abs(coord_pos - anchor_pos) > radius:
            continue
        observed = str(observed).upper()
        if observed in DNA_BASES or observed == "-":
            return True
    return False


def observe_safe_tag_part_state(part, candidate, tag):
    ref_name = candidate.get("ref_name", "")
    expected = tag_expected_state(tag)
    coord_pos = tag.get("coord_by_ref", {}).get(ref_name)
    base_states = part.get("base_states", {})
    events = part.get("events", [])

    if coord_pos is not None:
        observed = base_states.get(coord_pos)
        if observed is not None:
            observed = str(observed).upper()
            if observed in DNA_BASES or observed == "-":
                return observed, "covered"
            return None, "edited"
        if any(event.get("kind") == "DEL" and event_overlaps_position(event, coord_pos) for event in events):
            return "-", "covered"
        if any(event_overlaps_position(event, coord_pos) for event in events):
            return None, "edited"
        return None, "uncovered"

    if expected != "-":
        return None, "uncovered"

    anchor_key = normalize_anchor_key(tag.get("anchor_key"))
    anchor_pos = anchor_key[1] if anchor_key and len(anchor_key) > 1 else None
    if anchor_pos is None:
        return None, "uncovered"

    for event in events:
        if event.get("kind") == "INS" and event_near_anchor(event, anchor_pos):
            return non_gap_natural_state(tag) or "A", "covered"

    if part_has_flank_coverage(part, anchor_pos):
        return "-", "covered"
    return None, "uncovered"


def observe_safe_tag_state(candidate, tag):
    observations = set()
    edited = False
    for part in candidate_tag_parts(candidate):
        observed, status = observe_safe_tag_part_state(part, candidate, tag)
        if status == "covered":
            observations.add(observed)
        elif status == "edited":
            edited = True

    if len(observations) == 1:
        return next(iter(observations)), "covered"
    if len(observations) > 1:
        return None, "conflict"
    if edited:
        return None, "edited"
    return None, "uncovered"


def composite_tag_softclip_affected(candidate, tag):
    """Return whether a DEL/INS tag footprint intersects a soft-clip anchor."""
    ref_name = candidate.get("ref_name", "")
    coords = set()
    coord = (tag.get("coord_by_ref") or {}).get(ref_name)
    if isinstance(coord, int):
        coords.add(coord)
    anchor_key = normalize_anchor_key(tag.get("anchor_key"))
    if anchor_key and len(anchor_key) > 1 and isinstance(anchor_key[1], int):
        coords.add(anchor_key[1])
    if not coords:
        return False

    for segment in candidate.get("softclip_segments", []) or []:
        anchor = segment.get("anchor_ref_pos")
        start = segment.get("reference_start", anchor)
        end = segment.get("reference_end", anchor)
        for value in coords:
            if isinstance(anchor, int) and value == anchor:
                return True
            if isinstance(start, int) and isinstance(end, int):
                lower, upper = sorted((start, end))
                if lower <= value <= upper:
                    return True
    return False


def build_composite_tag_observations(candidate_by_ref, group_model):
    """Build one canonical safe-tag observation per site from passing candidates."""
    if not group_model.get("state_to_refs_by_site"):
        precompute_site_state_to_refs(group_model)
    site_index = group_model.get("state_to_refs_by_site", {})
    safe_tags = group_model.get("safe_tags_by_ref")
    if not isinstance(safe_tags, dict):
        raise ValueError("group_model safe_tags_by_ref is not parseable")

    tags_by_ref_site = {
        ref_name: {
            tag.get("site_id"): tag
            for tag in tags
            if isinstance(tag, dict) and tag.get("site_id")
        }
        for ref_name, tags in safe_tags.items()
        if isinstance(tags, list)
    }
    observations = []

    # Detect site_ids affected by genuine editing events (DEL/INS only).
    # SNP events are homoeolog / cultivar differences — not editing events.
    # A tag whose footprint overlaps a DEL/INS event is not usable for
    # homoeolog assignment because the event, not the subgenome, caused
    # the observed base.
    event_affected_site_ids = set()
    for ref_name, candidate in candidate_by_ref.items():
        ref_coord_to_site = {}
        for sid, s in site_index.items():
            coord = (s.get("coord_by_ref") or {}).get(ref_name)
            if coord is not None:
                ref_coord_to_site[coord] = sid
        for part in candidate_tag_parts(candidate):
            for event in (part.get("events") or []):
                if event.get("kind") not in {"DEL", "INS"}:
                    continue
                for coord, sid in ref_coord_to_site.items():
                    if event_overlaps_position(event, coord):
                        event_affected_site_ids.add(sid)

    for site_id, site in site_index.items():
        if site_id in event_affected_site_ids:
            observations.append({
                "site_id": site_id,
                "tag_type": site.get("type"),
                "observed_state": None,
                "allowed_refs": [],
                "classification": "event_affected_unusable",
                "source_parts": [],
                "allowed_refs_by_part": {},
                "distance_to_cut": site.get("distance_to_cut"),
                "softclip_affected": False,
            })
            continue
        observed_states = set()
        observed_states_by_part = defaultdict(set)
        source_parts = set()
        saw_edited = False
        softclip_affected = False
        tag_type = site.get("type")

        for ref_name, candidate in candidate_by_ref.items():
            tag = tags_by_ref_site.get(ref_name, {}).get(site_id)
            if tag is None:
                continue
            if tag_type in {"DEL_TAG", "INS_TAG"}:
                softclip_affected = softclip_affected or composite_tag_softclip_affected(candidate, tag)
            for part in candidate_tag_parts(candidate):
                observed, status = observe_safe_tag_part_state(part, candidate, tag)
                if status == "covered":
                    observed_states.add(observed)
                    part_name = part.get("part_name", "read")
                    observed_states_by_part[part_name].add(observed)
                    source_parts.add(part_name)
                elif status == "edited":
                    saw_edited = True

        observed_state = None
        allowed_refs = []
        if len(observed_states) > 1:
            classification = "mixed"
        elif len(observed_states) == 1:
            observed_state = next(iter(observed_states))
            allowed_refs = list((site.get("state_to_refs") or {}).get(observed_state, []))
            classification = "clear_natural" if allowed_refs else "non_natural"
        elif tag_type in {"DEL_TAG", "INS_TAG"} and saw_edited:
            classification = "mixed"
        else:
            classification = "uncovered"

        allowed_refs_by_part = {}
        for part_name, part_states in observed_states_by_part.items():
            if len(part_states) != 1:
                continue
            part_state = next(iter(part_states))
            part_allowed = list((site.get("state_to_refs") or {}).get(part_state, []))
            if part_allowed:
                allowed_refs_by_part[part_name] = sorted(part_allowed)

        observations.append({
            "site_id": site_id,
            "tag_type": tag_type,
            "observed_state": observed_state,
            "allowed_refs": sorted(allowed_refs),
            "classification": classification,
            "source_parts": sorted(source_parts),
            "allowed_refs_by_part": allowed_refs_by_part,
            "distance_to_cut": site.get("distance_to_cut"),
            "softclip_affected": softclip_affected,
        })
    return observations


def sort_composite_tag_observations(observations):
    """Sort composite observations by fixed evidence priority and stable ties."""
    def priority(observation):
        is_unique = len(observation.get("allowed_refs") or []) == 1
        is_snp = observation.get("tag_type") == "SNP_TAG"
        tier = 0 if is_snp and is_unique else 1 if is_snp else 2 if is_unique else 3
        return (
            tier,
            -len(observation.get("source_parts") or []),
            -float(observation.get("distance_to_cut") or 0),
            str(observation.get("site_id") or ""),
        )

    return sorted(observations, key=priority)


def composite_failure(reason, observations=None, trace=None, final_ref=None):
    """Return a uniform, non-fatal composite assignment failure."""
    observations = observations or []
    return {
        "assigned_ref": None,
        "method": None,
        "status": "failed",
        "reason": reason,
        "final_ref": final_ref,
        "used_sites": [],
        "final_ref_compatible_sites": [],
        "contextual_snp_outlier_sites": [],
        "non_natural_sites": sorted(
            obs.get("site_id")
            for obs in observations
            if obs.get("classification") == "non_natural"
        ),
        "event_affected_sites": sorted(
            obs.get("site_id")
            for obs in observations
            if obs.get("classification") == "event_affected_unusable"
        ),
        "possible_refs_trace": trace or [],
        "composite_without_single_unique_tag": False,
    }


def composite_part_singletons(observations):
    """Return per-read-part singleton refs implied by clear natural evidence."""
    possible_by_part = {}
    for observation in observations:
        if observation.get("classification") != "clear_natural":
            continue
        for part_name, allowed_refs in (observation.get("allowed_refs_by_part") or {}).items():
            allowed = set(allowed_refs)
            if not allowed:
                continue
            if part_name in possible_by_part:
                possible_by_part[part_name] &= allowed
            else:
                possible_by_part[part_name] = allowed
    return {
        part_name: next(iter(possible))
        for part_name, possible in possible_by_part.items()
        if len(possible) == 1
    }


def validate_composite_assignment(
    final_ref,
    observations,
    used_observations,
    candidate_by_ref,
    min_identity_score,
    trace=None,
):
    """Validate provisional composite assignment against final-ref evidence."""
    clear_natural = [
        obs for obs in observations
        if obs.get("classification") == "clear_natural"
    ]
    final_ref_compatible = [
        obs for obs in clear_natural
        if final_ref in (obs.get("allowed_refs") or [])
    ]
    compatible_snps = [
        obs for obs in final_ref_compatible
        if obs.get("tag_type") == "SNP_TAG"
    ]
    clear_snps = [
        obs for obs in clear_natural
        if obs.get("tag_type") == "SNP_TAG"
    ]
    contextual_snp_outliers = [
        obs for obs in clear_snps
        if final_ref not in (obs.get("allowed_refs") or [])
    ]
    delins_observations = [
        obs for obs in observations
        if obs.get("tag_type") in {"DEL_TAG", "INS_TAG"}
    ]
    clear_delins = [
        obs for obs in clear_natural
        if obs.get("tag_type") in {"DEL_TAG", "INS_TAG"}
    ]
    incompatible_delins = [
        obs for obs in clear_delins
        if final_ref not in (obs.get("allowed_refs") or [])
    ]

    if any(obs.get("classification") == "mixed" for obs in delins_observations):
        return composite_failure("composite_delins_mixed", observations, trace, final_ref)
    if any(
        obs.get("softclip_affected") and obs.get("classification") != "uncovered"
        for obs in delins_observations
    ):
        return composite_failure("composite_delins_softclip_affected", observations, trace, final_ref)
    if incompatible_delins:
        return composite_failure("composite_delins_incompatible", observations, trace, final_ref)

    if len(contextual_snp_outliers) > 1:
        result = composite_failure(
            "composite_too_many_contextual_snp_outliers",
            observations,
            trace,
            final_ref,
        )
        result["contextual_snp_outlier_sites"] = sorted(
            obs["site_id"] for obs in contextual_snp_outliers
        )
        return result

    if clear_snps:
        if len(compatible_snps) < 2:
            return composite_failure(
                "composite_insufficient_final_ref_compatible",
                observations,
                trace,
                final_ref,
            )
        unique_support = [
            obs for obs in compatible_snps
            if len(obs.get("allowed_refs") or []) == 1
        ]
        if not unique_support:
            snp_possible = None
            for obs in compatible_snps:
                allowed = set(obs.get("allowed_refs") or [])
                snp_possible = allowed if snp_possible is None else snp_possible & allowed
            if snp_possible != {final_ref}:
                return composite_failure(
                    "composite_insufficient_final_ref_compatible",
                    observations,
                    trace,
                    final_ref,
                )
        without_single_unique = not unique_support
    else:
        compatible_delins = [
            obs for obs in final_ref_compatible
            if obs.get("tag_type") in {"DEL_TAG", "INS_TAG"}
        ]
        if len(compatible_delins) >= 2:
            without_single_unique = not any(
                len(obs.get("allowed_refs") or []) == 1
                for obs in compatible_delins
            )
        elif (
            len(compatible_delins) == 1
            and len(compatible_delins[0].get("allowed_refs") or []) == 1
        ):
            candidate = candidate_by_ref.get(final_ref, {})
            outside_identity = candidate.get("outside_window_identity")
            required_identity = max(float(min_identity_score), 98.0)
            if outside_identity is None or float(outside_identity) < required_identity:
                return composite_failure(
                    "composite_delins_low_identity",
                    observations,
                    trace,
                    final_ref,
                )
            if candidate_outside_window_bases(candidate) < 50:
                return composite_failure(
                    "composite_delins_insufficient_outside_bases",
                    observations,
                    trace,
                    final_ref,
                )
            without_single_unique = False
        else:
            return composite_failure(
                "composite_delins_insufficient_support",
                observations,
                trace,
                final_ref,
            )

    event_affected_site_ids = sorted(
        obs["site_id"]
        for obs in observations
        if obs.get("classification") == "event_affected_unusable"
    )
    return {
        "assigned_ref": final_ref,
        "method": COMPOSITE_TAG_HARD,
        "status": "assigned",
        "reason": "",
        "final_ref": final_ref,
        "used_sites": [obs["site_id"] for obs in used_observations],
        "event_affected_sites": event_affected_site_ids,
        "final_ref_compatible_sites": sorted(obs["site_id"] for obs in final_ref_compatible),
        "contextual_snp_outlier_sites": sorted(obs["site_id"] for obs in contextual_snp_outliers),
        "non_natural_sites": sorted(
            obs["site_id"]
            for obs in observations
            if obs.get("classification") == "non_natural"
        ),
        "possible_refs_trace": trace or [],
        "composite_without_single_unique_tag": without_single_unique,
    }


def try_composite_tag_assignment(candidate_by_ref, group_model, min_identity_score):
    """Try safe-tag candidate elimination and contextual validation."""
    observations = sort_composite_tag_observations(
        build_composite_tag_observations(candidate_by_ref, group_model)
    )
    if any(
        obs.get("tag_type") in {"DEL_TAG", "INS_TAG"}
        and obs.get("classification") == "mixed"
        for obs in observations
    ):
        return composite_failure("composite_delins_mixed", observations)
    if any(
        obs.get("tag_type") in {"DEL_TAG", "INS_TAG"}
        and obs.get("softclip_affected")
        and obs.get("classification") != "uncovered"
        for obs in observations
    ):
        return composite_failure("composite_delins_softclip_affected", observations)
    part_singletons = composite_part_singletons(observations)
    r1_ref = part_singletons.get("read1")
    r2_ref = part_singletons.get("read2")
    if r1_ref is not None and r2_ref is not None and r1_ref != r2_ref:
        return composite_failure("mate_discordance", observations)
    possible_refs = set(group_model.get("reference_names") or [])
    if not possible_refs:
        raise ValueError("group_model is missing reference_names")
    used = []
    trace = []
    for observation in observations:
        if observation.get("classification") != "clear_natural":
            continue
        allowed = set(observation.get("allowed_refs") or [])
        next_refs = possible_refs & allowed
        trace.append({
            "site_id": observation.get("site_id"),
            "possible_refs": sorted(next_refs),
        })
        if not next_refs:
            return composite_failure("composite_snp_conflict", observations, trace)
        possible_refs = next_refs
        used.append(observation)
        if len(possible_refs) == 1:
            break

    if len(possible_refs) != 1:
        return composite_failure("composite_not_unique", observations, trace)
    final_ref = next(iter(possible_refs))
    return validate_composite_assignment(
        final_ref=final_ref,
        observations=observations,
        used_observations=used,
        candidate_by_ref=candidate_by_ref,
        min_identity_score=min_identity_score,
        trace=trace,
    )


def evaluate_snp_tag(candidate, tag):
    """Evaluate a SNP tag on a candidate. Returns 'match', 'conflict', or None."""
    observed, status = observe_safe_tag_state(candidate, tag)
    if status != "covered":
        return None
    expected = tag_expected_state(tag)
    if observed == expected:
        return "match"
    if observed in tag_natural_states(tag):
        return "conflict"
    return None


def safe_tag_site_map(group_model):
    """Return one safe informative tag per common site_id."""
    site_map = {}
    for tags in group_model.get("safe_tags_by_ref", group_model.get("tag_sites_by_ref", {})).values():
        for tag in tags:
            if tag.get("overlaps_window"):
                continue
            site_id = tag.get("site_id")
            states = tag.get("states_by_ref") or {}
            if not site_id or len(set(str(v).upper() for v in states.values())) <= 1:
                continue
            site_map.setdefault(site_id, tag)
    return site_map


def safe_tag_coord_maps(group_model, site_map):
    coord_maps = {
        ref_name: dict(coord_map)
        for ref_name, coord_map in group_model.get("site_id_by_ref_coord", {}).items()
    }
    for site_id, tag in site_map.items():
        for ref_name, coord in tag.get("coord_by_ref", {}).items():
            if coord is not None:
                coord_maps.setdefault(ref_name, {})[coord] = site_id
    return coord_maps


def event_overlaps_safe_site(event, coord_to_site_id, site_id):
    if not coord_to_site_id:
        return False
    return site_id in event_site_ids_on_common_coordinate(event, coord_to_site_id)


def collect_safe_tag_observations(candidate_by_ref, group_model):
    """
    V8.4: collect safe-tag observations independently for each reference.

    This intentionally does not build a cross-reference consensus. A/B/D
    differences are the signal used for assignment, not a reason to discard
    the tag.
    """
    observations_by_ref = {}
    skipped_edited_by_ref = {}
    skipped_uncovered_by_ref = {}
    safe_tags = group_model.get("safe_tags_by_ref", group_model.get("tag_sites_by_ref", {}))

    for ref_name, candidate in candidate_by_ref.items():
        observations = {}
        skipped_edited = set()
        skipped_uncovered = set()
        for tag in safe_tags.get(ref_name, []):
            if tag.get("overlaps_window"):
                continue
            site_id = tag.get("site_id")
            if not site_id:
                continue
            observed, status = observe_safe_tag_state(candidate, tag)
            if status == "covered":
                observations[site_id] = observed
            elif status == "conflict":
                observations[site_id] = None
            elif status == "edited":
                skipped_edited.add(site_id)
            else:
                skipped_uncovered.add(site_id)
        observations_by_ref[ref_name] = observations
        skipped_edited_by_ref[ref_name] = skipped_edited
        skipped_uncovered_by_ref[ref_name] = skipped_uncovered

    return observations_by_ref, skipped_edited_by_ref, skipped_uncovered_by_ref


def score_safe_informative_tags(candidate_by_ref, group_model):
    """
    V8.4: score each reference against its own safe-tag expectations.

    Missing coverage is neutral. Unexpected edited states are skipped. Natural
    A/B/D states that disagree with the current reference are true conflicts.
    """
    scores = {}
    safe_tags = group_model.get("safe_tags_by_ref", group_model.get("tag_sites_by_ref", {}))

    for ref_name, candidate in candidate_by_ref.items():
        matches = 0
        conflicts = 0
        skipped_edited = 0
        skipped_uncovered = 0
        details = []

        for tag in safe_tags.get(ref_name, []):
            if tag.get("overlaps_window"):
                continue
            site_id = tag.get("site_id")
            expected = tag_expected_state(tag)
            if expected not in DNA_BASES and expected != "-":
                skipped_uncovered += 1
                continue

            observed, status = observe_safe_tag_state(candidate, tag)
            if status == "uncovered":
                skipped_uncovered += 1
                continue
            if status == "edited":
                skipped_edited += 1
                continue
            if status == "conflict":
                conflicts += 1
                details.append((site_id, "mixed_observation", expected, None))
                continue

            if observed == expected:
                matches += 1
                details.append((site_id, "match", expected, observed))
            elif observed in tag_natural_states(tag):
                conflicts += 1
                details.append((site_id, "conflict", expected, observed))
            else:
                skipped_edited += 1

        covered = matches + conflicts
        scores[ref_name] = {
            "matches": matches,
            "support": matches,
            "covered": covered,
            "conflicts": conflicts,
            "skipped_edited": skipped_edited,
            "skipped_uncovered": skipped_uncovered,
            "score": matches * 2.0 - conflicts * 3.0,
            "details": details,
        }
    return scores


def evaluate_del_ins_tag(candidate, tag):
    """
    Evaluate DEL_TAG or INS_TAG using base_states pattern matching.

    Returns 'match', 'conflict', or None (skip for missing coords / unclear obs).
    """
    tag_type = tag["type"]
    anchor_key = normalize_anchor_key(tag.get("anchor_key"))
    if anchor_key is None:
        return None
    if tag_type not in {"DEL_TAG", "INS_TAG"}:
        return None

    observed, status = observe_safe_tag_state(candidate, tag)
    if status != "covered":
        return None
    expected = tag_expected_state(tag)
    if observed == expected:
        return "match"
    if observed in tag_natural_states(tag):
        return "conflict"
    return None


def score_tag_conflicts(candidate_by_ref, group_model):
    """Compatibility wrapper returning per-reference match/conflict scores."""
    return score_safe_informative_tags(candidate_by_ref, group_model)


def dynamic_hard_assignment_from_scores(scores):
    if not scores:
        return None, None

    ranked = sorted(
        scores.items(),
        key=lambda item: (
            item[1].get("matches", 0),
            item[1].get("score", 0.0),
            item[1].get("covered", 0),
            -item[1].get("conflicts", 0),
        ),
        reverse=True,
    )
    best_ref, best = ranked[0]
    best_matches = best.get("matches", 0)
    best_covered = best.get("covered", 0)
    best_conflicts = best.get("conflicts", 0)
    second_matches = ranked[1][1].get("matches", 0) if len(ranked) > 1 else 0

    if best_conflicts > 0 or best_covered <= 0 or best_matches <= 0:
        return None, None
    if best_covered <= 2:
        required_matches = 1
        required_margin = 1
    elif best_covered <= 5:
        required_matches = 2
        required_margin = 1
    else:
        required_matches = 3
        required_margin = 2
    if best_matches < required_matches:
        return None, None
    if best_matches - second_matches < required_margin:
        return None, None
    if sum(1 for _, s in ranked if s.get("matches", 0) == best_matches and s.get("conflicts", 0) == 0) > 1:
        return None, None
    return best_ref, "SAFE_TAG_HARD"


def choose_ref_by_min_conflict(scores):
    """Hard assignment by zero-conflict safe-tag compatibility."""
    return dynamic_hard_assignment_from_scores(scores)


def score_kmer_normalized(candidate_by_ref, group_model):
    """
    Normalized kmer scoring: score = raw_hits / total_available_kmers.
    Returns {ref_name: {"score": float, "hits": int}}
    """
    scores = {}
    kmer_tags = group_model.get("unique_kmer_tags_by_ref", {})

    for ref_name, candidate in candidate_by_ref.items():
        tags = kmer_tags.get(ref_name, [])
        if not tags:
            scores[ref_name] = {"score": 0.0, "hits": 0}
            continue

        kmer_strings = []
        for t in tags:
            if isinstance(t, str):
                kmer_strings.append(t)
            elif isinstance(t, dict):
                k = t.get("kmer", "")
                if k:
                    kmer_strings.append(k)

        seq = str(candidate.get("raw_sequence", "")).upper()
        if not seq or not kmer_strings:
            scores[ref_name] = {"score": 0.0, "hits": 0}
            continue

        hits = sum(1 for kmer in kmer_strings if kmer in seq)
        total = len(kmer_strings)
        scores[ref_name] = {"score": hits / total if total > 0 else 0.0, "hits": hits}

    return scores


def choose_ref_by_kmer_score(scores):
    """
    Kmer fallback: best_score >= 0.15, best_hits >= 2, margin >= 0.10.
    Returns (ref_name, "KMER_FALLBACK") or (None, None).
    """
    if not scores:
        return None, None

    ranked = sorted(scores.items(), key=lambda x: x[1]["score"], reverse=True)
    best_ref, best = ranked[0]

    if best["score"] < 0.15 or best["hits"] < 2:
        return None, None

    if len(ranked) == 1:
        return best_ref, "KMER_FALLBACK"

    second_score = ranked[1][1]["score"]
    if best["score"] - second_score < 0.10:
        return None, None

    return best_ref, "KMER_FALLBACK"


def choose_reference_by_tags(candidate_by_ref, group_model):
    """
    V8.4 safe-tag homoeolog assignment.

    Hard calls require zero conflicts and dynamic match/margin thresholds.
    Soft calls use conflict-aware scores. Kmers are only a final fallback.
    """
    scores = score_safe_informative_tags(candidate_by_ref, group_model)
    if not scores:
        return None, "AMBIGUOUS"

    hard_choice, hard_method = dynamic_hard_assignment_from_scores(scores)
    if hard_choice is not None:
        return hard_choice, hard_method

    ranked = sorted(
        scores.items(),
        key=lambda item: (
            item[1].get("score", 0.0),
            -item[1].get("conflicts", 0),
            item[1].get("matches", 0),
            item[1].get("covered", 0),
        ),
        reverse=True,
    )
    best_ref, best = ranked[0]
    best_score = best.get("score", 0.0)
    second_score = ranked[1][1].get("score", 0.0) if len(ranked) > 1 else 0.0
    if best.get("matches", 0) >= 1 and best.get("covered", 0) >= 1 and best_score - second_score >= 1.0:
        return best_ref, "SAFE_TAG_SOFT"

    kmer_choice, kmer_method = choose_ref_by_kmer_score(score_kmer_normalized(candidate_by_ref, group_model))
    if kmer_choice is not None:
        return kmer_choice, kmer_method
    return None, "AMBIGUOUS"


# ============================================================================
# V8.2: Tag Reliability & Dynamic Assignment Pipeline
# ============================================================================

def _best_alignment_score(candidates_by_ref):
    """Return the best identity_score among all references."""
    return max(
        (c.get("identity_score", 0) for c in candidates_by_ref.values()),
        default=0.0,
    )


def provisional_seed_assignment(candidates_by_qname, group_model,
                                 min_identity=90.0, min_margin=10.0):
    """
    Phase 1: Provisional alignment-based seed assignment.

    Uses alignment quality ONLY (no tag evaluation) to select high-confidence
    seed reads for downstream calibration and reliability statistics. These
    seeds are NOT used for final editing-frequency output.

    Rule:
    - best identity_score >= min_identity (90%)
    - margin to second-best >= min_margin (10%)
    - exactly 1 winner meets both criteria

    Returns {ref_name: [candidate, ...]}.
    """
    seed_assigned = defaultdict(list)
    ref_names = group_model["reference_names"]

    for qname, candidates_by_ref in candidates_by_qname.items():
        if len(candidates_by_ref) < len(ref_names):
            # Some refs not covered — cannot make a reliable comparison
            continue

        scores = {
            ref_name: cand.get("identity_score", 0)
            for ref_name, cand in candidates_by_ref.items()
        }
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        best_ref, best_score = ranked[0]
        second_score = ranked[1][1] if len(ranked) > 1 else 0.0

        if best_score < min_identity:
            continue
        if best_score - second_score < min_margin:
            continue

        seed_assigned[best_ref].append(candidates_by_ref[best_ref])

    return dict(seed_assigned)


def detect_editing_hotspots(seed_assigned, group_model, ref_contexts,
                             min_ratio=5.0):
    """
    Phase 2: Detect high-frequency variants OUTSIDE the known editing window.

    Scans outside-window events of seed reads for positions where the
    observed variant frequency exceeds min_ratio. These may indicate
    editing activity from an unprovided sgRNA.

    A hotspot is a potential unprovided sgRNA editing site and tags
    within its range are excluded from hard assignment.

    Returns:
        hotspots: list of {ref_name, pos, variant_type, frequency, nearby_tags}
        hotspot_tags: set of tag site_ids that fall within hotspot ranges
    """
    hotspots = []
    hotspot_tags = set()
    safe_tags = group_model.get("safe_tags_by_ref", {})
    window_tags = group_model.get("window_tags_by_ref", {})

    for ref_name in group_model["reference_names"]:
        candidates = seed_assigned.get(ref_name, [])
        if len(candidates) < 10:
            continue

        ref_ctx = ref_contexts.get(ref_name, {})
        window_positions = ref_ctx.get("window_positions", set())

        total = len(candidates)
        # Per-position: dedup by candidate so paired-end reads don't
        # double-count the same event at the same position.
        pos_cand_events = defaultdict(lambda: defaultdict(set))

        for cand_idx, cand in enumerate(candidates):
            for event in cand.get("outside_events", []):
                pos = event.get("pos")
                if pos is None:
                    continue
                if window_positions and pos in window_positions:
                    continue
                kind = event.get("kind", "")
                alt = str(event.get("alt", "")).upper()
                if kind == "SNP":
                    allele_key = f"SNP:{alt}"
                elif kind in ("DEL", "INS"):
                    allele_key = f"{kind}:{alt}" if alt else kind
                else:
                    allele_key = kind
                pos_cand_events[pos][allele_key].add(cand_idx)

        for pos, allele_sets in pos_cand_events.items():
            for allele_key, cand_indices in allele_sets.items():
                count = len(cand_indices)
                freq = count / total * 100.0
                if freq >= min_ratio:
                    variant_type = allele_key
                    hotspots.append({
                        "ref_name": ref_name,
                        "pos": pos,
                        "variant_type": variant_type,
                        "frequency": round(freq, 2),
                        "seed_read_count": count,
                        "total_seed_reads": total,
                    })

    # Collect tags near hotspots (within window range, including safe tags
    # that overlap the hotspot position in any reference)
    for hs in hotspots:
        ref_name = hs["ref_name"]
        hs_pos = hs["pos"]
        for tag_ref, tags in {**safe_tags, **window_tags}.items():
            for tag in tags:
                coord = tag.get("coord_by_ref", {}).get(ref_name)
                if coord is not None and abs(coord - hs_pos) <= 5:
                    hotspot_tags.add(tag["site_id"])

    return hotspots, hotspot_tags


def calibrate_expected_states(seed_assigned, group_model, hotspot_tags,
                               min_calibration_freq=95.0,
                               disable_freq_low=80.0):
    """
    Phase 3: Sample-specific tag expected_state calibration.

    Uses high-confidence seed reads to determine if the actual material's
    genotype at each tag site differs from the reference (Chinese Spring).

    Three-tier classification:
    - dominant_freq >= 95%: update expected_state → calibrated
    - 80%–95%: mark suspicious_background_polymorphism → disable tag
    - <80%: retain original expected_state

    Only SNP_TAGs are calibrated. DEL/INS tags are left unchanged.

    Returns: calibrated_model (deep copy of group_model with updated tags).
    """
    calibrated_model = deepcopy(group_model)
    safe_tags = calibrated_model.get("safe_tags_by_ref", {})

    for ref_name in group_model["reference_names"]:
        candidates = seed_assigned.get(ref_name, [])
        if len(candidates) < 10:
            continue

        tags = safe_tags.get(ref_name, [])
        if not tags:
            continue

        # Count observed alleles per tag
        tag_allele_counts = defaultdict(lambda: defaultdict(int))
        tag_observed = defaultdict(int)

        for cand in candidates:
            base_states = cand.get("base_states", {})
            for tag in tags:
                site_id = tag["site_id"]
                if site_id in hotspot_tags:
                    continue
                coord = tag.get("coord_by_ref", {}).get(ref_name)
                if coord is None:
                    continue
                obs = base_states.get(coord)
                if obs is None:
                    continue
                obs_upper = str(obs).upper()
                tag_allele_counts[site_id][obs_upper] += 1
                tag_observed[site_id] += 1

        for tag in tags:
            site_id = tag["site_id"]
            if site_id in hotspot_tags:
                tag["original_expected_state"] = tag.get("expected_state", "")
                tag["calibrated_expected_state"] = tag.get("expected_state", "")
                tag["calibration_reason"] = "hotspot_excluded"
                continue

            total_obs = tag_observed.get(site_id, 0)
            if total_obs < 10:
                tag["original_expected_state"] = tag.get("expected_state", "")
                tag["calibrated_expected_state"] = tag.get("expected_state", "")
                tag["calibration_reason"] = "insufficient_observations"
                continue

            original = str(tag.get("expected_state", "")).upper()
            allele_counts = tag_allele_counts.get(site_id, {})

            if not allele_counts:
                tag["original_expected_state"] = original
                tag["calibrated_expected_state"] = original
                tag["calibration_reason"] = "no_observations"
                continue

            dominant_allele, dominant_count = max(allele_counts.items(),
                                                   key=lambda x: x[1])
            dominant_freq = dominant_count / total_obs * 100.0

            tag["original_expected_state"] = original

            if dominant_freq >= min_calibration_freq:
                if dominant_allele != original:
                    tag["calibrated_expected_state"] = dominant_allele
                    tag["calibration_reason"] = "high_confidence_calibration"
                else:
                    tag["calibrated_expected_state"] = original
                    tag["calibration_reason"] = "confirmed_reference"
            elif dominant_freq >= disable_freq_low:
                # Suspicious but not confident enough to calibrate
                tag["calibrated_expected_state"] = original
                tag["calibration_reason"] = "suspicious_background_polymorphism"
            else:
                tag["calibrated_expected_state"] = original
                tag["calibration_reason"] = "unstable_allele_distribution"

    return calibrated_model


def classify_tag_conflict_detail(candidate, tag):
    """
    Distinguish the type of tag mismatch observed in a single read.

    Returns one of: "match", "true_conflict", "unexpected_allele",
    "indel_overlap", None (not covered).
    """
    tag_type = tag.get("type", "")
    if tag_type in ("DEL_TAG", "INS_TAG"):
        return None

    coord = None
    for ref_name, val in tag.get("coord_by_ref", {}).items():
        coord = val
        break

    if coord is None:
        return None

    base_states = candidate.get("base_states", {})
    obs = base_states.get(coord)
    if obs is None:
        # Tag position not covered by read (possibly deleted or outside)
        # Check if an indel overlaps this position
        for event in candidate.get("window_events", []):
            if event.get("pos") == coord and event.get("kind") in ("DEL", "INS"):
                return "indel_overlap"
        return None

    obs_upper = str(obs).upper()
    expected = str(tag.get("calibrated_expected_state",
                            tag.get("expected_state", ""))).upper()

    if obs_upper == expected:
        return "match"

    # Check if this is a true_conflict (matches another subgenome's state)
    # or an unexpected_allele (matches neither)
    states_by_ref = tag.get("states_by_ref", {})
    other_states = {
        str(v).upper()
        for r, v in states_by_ref.items()
        if str(v).upper() != expected
    }

    if obs_upper in other_states:
        return "true_conflict"
    else:
        return "unexpected_allele"


def compute_tag_reliability(seed_assigned, calibrated_model):
    """
    Phase 4a: Compute per-tag reliability statistics.

    For each tag in each reference, count:
    - observed_count: number of seed reads covering this tag
    - match_count: reads where observed == expected
    - true_conflict_count: reads where observed matches another subgenome
    - unexpected_allele_count: reads where observed matches neither
    - indel_overlap_count: reads where tag position is deleted/inserted
    - conflict_rate: (true_conflict + unexpected) / observed
    - reliability_class: reliable / suspicious / disabled
    """
    reliability = {}
    safe_tags = calibrated_model.get("safe_tags_by_ref", {})

    for ref_name in calibrated_model["reference_names"]:
        reliability[ref_name] = {}
        candidates = seed_assigned.get(ref_name, [])
        tags = safe_tags.get(ref_name, [])

        if not tags:
            continue

        tag_stats = {}
        for tag in tags:
            site_id = tag["site_id"]
            tag_stats[site_id] = {
                "site_id": site_id,
                "tag_type": tag.get("type", ""),
                "observed_count": 0,
                "match_count": 0,
                "true_conflict_count": 0,
                "unexpected_allele_count": 0,
                "indel_overlap_count": 0,
                "conflict_rate": 0.0,
                "reliability_class": "reliable",
                "expected_state": str(tag.get("calibrated_expected_state",
                                               tag.get("expected_state", ""))).upper(),
            }

        for cand in candidates:
            for tag in tags:
                site_id = tag["site_id"]
                detail = classify_tag_conflict_detail(cand, tag)
                if detail is None:
                    continue
                stats_entry = tag_stats[site_id]
                stats_entry["observed_count"] += 1
                if detail == "match":
                    stats_entry["match_count"] += 1
                elif detail == "true_conflict":
                    stats_entry["true_conflict_count"] += 1
                elif detail == "unexpected_allele":
                    stats_entry["unexpected_allele_count"] += 1
                elif detail == "indel_overlap":
                    stats_entry["indel_overlap_count"] += 1

        for site_id, entry in tag_stats.items():
            obs = entry["observed_count"]
            if obs > 0:
                conflicting = entry["true_conflict_count"] + entry["unexpected_allele_count"]
                entry["conflict_rate"] = conflicting / obs * 100.0

                # Classify reliability
                cr = entry["conflict_rate"]
                if cr < 2.0:
                    entry["reliability_class"] = "reliable"
                elif cr < 20.0:
                    entry["reliability_class"] = "suspicious"
                else:
                    # Check if concentrated on one allele
                    entry["reliability_class"] = "disabled_high_conflict"

            calibration_reason = None
            for tag in tags:
                if tag["site_id"] == site_id:
                    calibration_reason = tag.get("calibration_reason", "")
                    break
            if calibration_reason in ("suspicious_background_polymorphism",
                                        "hotspot_excluded"):
                entry["reliability_class"] = "disabled_background_polymorphism"

        reliability[ref_name] = tag_stats

    return reliability


def filter_tags_by_reliability(calibrated_model, tag_reliability,
                                hotspot_tags):
    """
    Phase 4b: Remove unreliable tags from the calibrated model's safe tags.

    Tags are removed if:
    - reliability_class starts with "disabled"
    - site_id in hotspot_tags
    - calibration_reason == "suspicious_background_polymorphism"

    Returns a new model with filtered safe_tags_by_ref.
    """
    filtered_model = deepcopy(calibrated_model)
    safe_tags = filtered_model.get("safe_tags_by_ref", {})

    filtered_safe_tags = {}
    for ref_name, tags in safe_tags.items():
        ref_reliability = tag_reliability.get(ref_name, {})
        kept = []
        for tag in tags:
            site_id = tag["site_id"]
            rel_entry = ref_reliability.get(site_id, {})
            rel_class = rel_entry.get("reliability_class", "reliable")
            cal_reason = tag.get("calibration_reason", "")

            # Exclusion rules
            if site_id in hotspot_tags:
                continue
            if rel_class.startswith("disabled"):
                continue
            if cal_reason == "suspicious_background_polymorphism":
                continue

            kept.append(tag)

        filtered_safe_tags[ref_name] = kept

    filtered_model["safe_tags_by_ref"] = filtered_safe_tags
    filtered_model["tag_sites_by_ref"] = filtered_safe_tags

    # Store reliability info in the model for QC export
    filtered_model["_v82_tag_reliability"] = tag_reliability

    return filtered_model


def dynamic_hard_assignment(candidate_by_ref, group_model):
    """V8.4 hard assignment based on per-reference safe-tag conflicts."""
    return dynamic_hard_assignment_from_scores(
        score_safe_informative_tags(candidate_by_ref, group_model)
    )


def export_tag_reliability_tsv(tag_reliability, group_name, sample,
                                out_dir):
    """Export per-sample tag reliability table as TSV."""
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"{group_name}_{sample}_tag_reliability.tsv")
    with open(path, "w", newline="") as f:
        writer = csv.writer(f, delimiter="\t")
        writer.writerow([
            "reference", "site_id", "tag_type", "observed_count",
            "match_count", "true_conflict_count", "unexpected_allele_count",
            "indel_overlap_count", "conflict_rate", "reliability_class",
            "expected_state",
        ])
        for ref_name, tag_stats in tag_reliability.items():
            for site_id, entry in tag_stats.items():
                writer.writerow([
                    ref_name, site_id, entry["tag_type"],
                    entry["observed_count"], entry["match_count"],
                    entry["true_conflict_count"],
                    entry["unexpected_allele_count"],
                    entry["indel_overlap_count"],
                    f"{entry['conflict_rate']:.2f}",
                    entry["reliability_class"],
                    entry["expected_state"],
                ])
    return path


def export_hotspots_tsv(hotspots, group_name, sample, out_dir):
    """Export potential unprovided editing hotspots as TSV."""
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir,
                        f"{group_name}_{sample}_potential_unprovided_editing_hotspots.tsv")
    with open(path, "w", newline="") as f:
        writer = csv.writer(f, delimiter="\t")
        writer.writerow([
            "ref_name", "pos", "variant_type", "frequency",
            "seed_read_count", "total_seed_reads",
            "suggestion",
        ])
        for hs in hotspots:
            writer.writerow([
                hs["ref_name"], hs["pos"], hs["variant_type"],
                f"{hs['frequency']:.2f}",
                hs["seed_read_count"], hs["total_seed_reads"],
                "provide additional sgRNA or exclude this region from tag set",
            ])
    return path


# ============================================================================
# End V8.2 additions
# ============================================================================


def _get_safe_snp_tags_for_ref(group_model, ref_name):
    """Extract safe SNP_TAG tags for a given reference."""
    safe_tags = group_model.get("safe_tags_by_ref", group_model.get("tag_sites_by_ref", {}))
    tags = safe_tags.get(ref_name, [])
    return [
        t for t in tags
        if t.get("type") == "SNP_TAG"
        and not t.get("overlaps_window", False)
        and t.get("site_id") is not None
    ]


def check_safe_snp_tag_coverage(candidate, group_model, ref_name):
    """
    Check criterion 2: at least 1 reliable safe SNP_TAG is covered.

    Returns (covered, evidence_tags) where evidence_tags is a list of
    (tag, observed_state, status) tuples.
    """
    safe_snp_tags = _get_safe_snp_tags_for_ref(group_model, ref_name)
    if not safe_snp_tags:
        return False, []

    softclip_affected_positions = set()
    for seg in candidate.get("softclip_segments", []):
        if seg.get("anchor_ref_pos") is not None:
            anchor = seg["anchor_ref_pos"]
            softclip_affected_positions.add(anchor)
            softclip_affected_positions.add(anchor + 1)

    base_states = candidate.get("base_states", {})
    evidence_tags = []

    for tag in safe_snp_tags:
        site_id = tag.get("site_id")
        if site_id is None:
            continue
        # Tags use coord_by_ref (dict: ref_name -> coordinate), not coord_pos
        coord_pos = tag.get("coord_by_ref", {}).get(ref_name)
        if coord_pos is None:
            continue
        # Criterion 6: skip tags whose coordinate overlaps soft-clip affected region
        if coord_pos in softclip_affected_positions:
            continue
        observed = base_states.get(coord_pos)
        if observed is None:
            continue
        expected = tag_expected_state(tag)
        if expected is None:
            continue
        if observed == expected:
            evidence_tags.append((tag, observed, "match"))
        elif observed in tag_natural_states(tag):
            evidence_tags.append((tag, observed, "conflict"))
        else:
            evidence_tags.append((tag, observed, "edited"))

    covered = len(evidence_tags) > 0
    return covered, evidence_tags


def check_mate_tag_concordance(candidate, group_model):
    """
    Check criterion 5: if both R1 and R2 have informative tags, they must
    agree on the same homoeolog.
    """
    parts = candidate.get("parts", [candidate])
    if len(parts) < 2:
        return True

    mate_assignments = []
    for part in parts:
        best_ref = None
        best_matches = 0
        for ref_name in group_model.get("reference_names", []):
            covered, evidence = check_safe_snp_tag_coverage(part, group_model, ref_name)
            if covered:
                match_count = sum(1 for _, _, status in evidence if status == "match")
                conflict_count = sum(1 for _, _, status in evidence if status == "conflict")
                if match_count > 0 and conflict_count == 0 and match_count > best_matches:
                    best_matches = match_count
                    best_ref = ref_name
        if best_ref is not None:
            mate_assignments.append(best_ref)

    if len(mate_assignments) < 2:
        return True
    return len(set(mate_assignments)) == 1


def check_relaxed_assignment_eligibility(candidate, candidate_by_ref, group_model, ref_contexts):
    """
    V8.6 relaxed_aligned assignment eligibility: 7 strict criteria.

    Returns (passed, assigned_ref, details_dict).

    7 criteria:
    1. outside_window_identity >= 85.0
    2. >=1 reliable safe SNP_TAG covered
    3. positive safe SNP_TAG points to unique homoeolog
    4. conflict == 0
    5. R1/R2 mate tag concordance
    6. soft clip does not disrupt critical tag coordinates
    7. no DEL_TAG/INS_TAG/kmer-only assignment
    """
    details = {
        "criterion_1_identity": False,
        "criterion_2_snp_coverage": False,
        "criterion_3_unique_ref": False,
        "criterion_4_no_conflict": False,
        "criterion_5_mate_concordance": False,
        "criterion_6_no_clip_disruption": False,
        "criterion_7_no_del_ins_kmer": True,
    }

    ref_names = group_model["reference_names"]

    # Score each reference
    scores = score_safe_informative_tags(candidate_by_ref, group_model)
    if not scores:
        return False, None, details

    # Find best ref
    best_ref = None
    best_score = -float("inf")
    best_details = None
    second_score = -float("inf")
    for ref_name, score_info in scores.items():
        s = score_info.get("score", 0.0)
        if s > best_score:
            second_score = best_score
            best_score = s
            best_ref = ref_name
            best_details = score_info
        elif s > second_score:
            second_score = s

    if best_ref is None or best_details is None:
        return False, None, details
    best_candidate = candidate_by_ref.get(best_ref)
    if best_candidate is None:
        return False, None, details

    # Criterion 1
    outside_id = best_candidate.get("outside_window_identity")
    if outside_id is None or outside_id < MIN_OUTSIDE_WINDOW_IDENTITY:
        return False, None, details
    details["criterion_1_identity"] = True

    # Criterion 2: safe SNP_TAG coverage
    covered, evidence_tags = check_safe_snp_tag_coverage(best_candidate, group_model, best_ref)
    if not covered:
        return False, None, details
    details["criterion_2_snp_coverage"] = True

    match_tags = [(t, o) for t, o, s in evidence_tags if s == "match"]
    conflict_tags = [(t, o) for t, o, s in evidence_tags if s == "conflict"]

    # Criterion 4: conflict == 0
    if len(conflict_tags) > 0:
        return False, None, details
    details["criterion_4_no_conflict"] = True

    # Criterion 3: unique homoeolog
    other_refs_with_support = []
    for ref_name in ref_names:
        if ref_name == best_ref:
            continue
        other_candidate = candidate_by_ref.get(ref_name)
        if other_candidate is None:
            continue
        cov, ev = check_safe_snp_tag_coverage(other_candidate, group_model, ref_name)
        if cov:
            other_matches = sum(1 for _, _, s in ev if s == "match")
            other_conflicts = sum(1 for _, _, s in ev if s == "conflict")
            if other_matches > 0 and other_conflicts == 0:
                other_refs_with_support.append(ref_name)
    if other_refs_with_support:
        return False, None, details

    if len(ref_names) > 1 and best_score - second_score < 1.0:
        return False, None, details
    details["criterion_3_unique_ref"] = True

    # Criterion 5: mate concordance
    if not check_mate_tag_concordance(best_candidate, group_model):
        return False, None, details
    details["criterion_5_mate_concordance"] = True

    # Criterion 6: clip disruption (handled in check_safe_snp_tag_coverage)
    details["criterion_6_no_clip_disruption"] = True

    # Criterion 7: no DEL/INS/kmer (implicit from SNP_TAG-only evidence)
    if not match_tags:
        return False, None, details

    return True, best_ref, details


def choose_best_reference(candidate_by_ref, group_model, min_margin=3.0, min_matches=1, min_covered=1):
    if not candidate_by_ref:
        return None, None
    if len(group_model["reference_names"]) == 1:
        return next(iter(candidate_by_ref)), "SAFE_TAG_HARD"
    return choose_reference_by_tags(candidate_by_ref, group_model)


def high_confidence_soft_choice(soft_choice, min_margin=6.0, min_matches=2, min_covered=2):
    if soft_choice is None:
        return False
    details = soft_choice.get("details") or {}
    if details.get("matches", 0) < min_matches:
        return False
    if details.get("covered", 0) < min_covered:
        return False
    margin = soft_choice.get("margin")
    return margin is None or margin >= min_margin


def choose_soft_reference(candidate_by_ref, group_model, min_margin=1.0, min_matches=1, min_covered=1):
    """Auxiliary soft assignment using the V8.4 conflict-aware safe-tag score."""
    if not candidate_by_ref:
        return None
    if len(group_model["reference_names"]) == 1:
        ref_name = next(iter(candidate_by_ref))
        details = {"matches": 1, "covered": 1, "score": 1, "conflicts": 0}
        return {"reference_name": ref_name, "details": details, "margin": None}

    scores = score_safe_informative_tags(candidate_by_ref, group_model)
    ranked = sorted(
        scores.items(),
        key=lambda item: (
            item[1].get("score", 0.0),
            -item[1].get("conflicts", 0),
            item[1].get("matches", 0),
            item[1].get("covered", 0),
        ),
        reverse=True,
    )
    if not ranked:
        return None
    best_ref, best_details = ranked[0]
    best_matches = best_details["matches"]
    best_covered = best_details["covered"]
    best_score = best_details["score"]
    if best_matches < min_matches or best_covered < min_covered:
        return None

    if len(ranked) == 1:
        return {"reference_name": best_ref, "details": best_details, "margin": None}

    second_score = ranked[1][1]["score"]
    margin = best_score - second_score
    if margin < min_margin:
        return None
    return {"reference_name": best_ref, "details": best_details, "margin": margin}


LEDGER_TIER_HARD = "HARD"
LEDGER_TIER_RESCUED = "RESCUED"
LEDGER_TIER_UNASSIGNED = "UNASSIGNED"

COMPOSITE_TAG_HARD = "COMPOSITE_TAG_HARD"
COMPOSITE_FAILURE_REASONS = (
    "composite_not_unique",
    "composite_insufficient_final_ref_compatible",
    "composite_too_many_contextual_snp_outliers",
    "composite_delins_mixed",
    "composite_delins_incompatible",
    "composite_delins_softclip_affected",
    "composite_delins_insufficient_support",
    "composite_delins_low_identity",
    "composite_delins_insufficient_outside_bases",
    "composite_snp_conflict",
)
COMPOSITE_TRANSIENT_DECISION_FIELDS = (
    "composite_status",
    "composite_final_ref",
    "composite_used_sites",
    "composite_final_ref_compatible_sites",
    "composite_contextual_snp_outlier_sites",
    "composite_non_natural_sites",
    "composite_event_affected_sites",
    "composite_possible_refs_trace",
    "composite_without_single_unique_tag",
)

UNASSIGNED_LOW_OUTSIDE_IDENTITY = "low_outside_identity"
UNASSIGNED_INSUFFICIENT_OUTSIDE_BASES = "insufficient_outside_bases"
UNASSIGNED_TRUE_CONFLICT = "true_conflict"
UNASSIGNED_MATE_DISCORDANCE = "mate_discordance"
UNASSIGNED_TIE_OR_LOW_MARGIN = "tie_or_low_margin"
UNASSIGNED_NO_INFORMATIVE_TAG = "no_informative_tag"

RESCUE_SAFE_TAG_ZERO_CONFLICT = "RESCUE_SAFE_TAG_ZERO_CONFLICT"
RESCUE_PE_SCAFFOLD_ANCHORED = "RESCUE_PE_SCAFFOLD_ANCHORED"
RESCUE_ALIGNMENT_MARGIN = "RESCUE_ALIGNMENT_MARGIN"
RESCUE_SCORE_MARGIN = "RESCUE_SCORE_MARGIN"

LEDGER_UNASSIGNED_REASONS = (
    UNASSIGNED_LOW_OUTSIDE_IDENTITY,
    UNASSIGNED_INSUFFICIENT_OUTSIDE_BASES,
    UNASSIGNED_TRUE_CONFLICT,
    UNASSIGNED_MATE_DISCORDANCE,
    UNASSIGNED_TIE_OR_LOW_MARGIN,
    UNASSIGNED_NO_INFORMATIVE_TAG,
)

LEDGER_RESCUE_METHODS = (
    RESCUE_SAFE_TAG_ZERO_CONFLICT,
    RESCUE_PE_SCAFFOLD_ANCHORED,
    RESCUE_ALIGNMENT_MARGIN,
    RESCUE_SCORE_MARGIN,
)


def candidate_outside_window_bases(candidate):
    return int(candidate.get("outside_matches", 0) or 0) + int(candidate.get("outside_mismatches", 0) or 0)


def candidate_score_proxy(candidate):
    identity = candidate.get("outside_window_identity")
    if identity is None:
        identity = candidate.get("identity_score") or candidate.get("identity") or 0.0
    mapq = candidate.get("mapq", 0) or 0
    outside_bases = candidate_outside_window_bases(candidate)
    try:
        return float(identity) + float(mapq) * 0.01 + min(outside_bases, 500) * 0.001
    except (TypeError, ValueError):
        return 0.0


def ranked_refs_by_score_proxy(candidate_by_ref):
    ranked = sorted(
        (
            (ref_name, candidate_score_proxy(candidate))
            for ref_name, candidate in candidate_by_ref.items()
        ),
        key=lambda item: item[1],
        reverse=True,
    )
    return ranked


def ledger_best_candidate_ref(candidate_by_ref):
    ranked = ranked_refs_by_score_proxy(candidate_by_ref)
    if not ranked:
        return None, None, 0.0, 0.0, 0.0
    best_ref, best_score = ranked[0]
    second_ref, second_score = (ranked[1] if len(ranked) > 1 else (None, 0.0))
    return best_ref, second_ref, best_score, second_score, best_score - second_score


def has_candidate_mate_discordance(candidate_by_ref, group_model):
    for candidate in candidate_by_ref.values():
        if not check_mate_tag_concordance(candidate, group_model):
            return True
    return False


def infer_part_assignment_ref(candidate_by_ref, group_model, part_name):
    part_candidates = {}
    for ref_name, candidate in candidate_by_ref.items():
        for part in candidate.get("parts", []) or candidate.get("tag_parts", []):
            if part.get("part_name") == part_name:
                part_candidate = deepcopy(candidate)
                part_candidate["base_states"] = part.get("base_states", {})
                part_candidate["tag_parts"] = [part]
                part_candidates[ref_name] = part_candidate
                break
    if not part_candidates:
        return None
    choice = choose_soft_reference(part_candidates, group_model, min_margin=1.0, min_matches=1, min_covered=1)
    return None if choice is None else choice.get("reference_name")


def check_final_assignment_mate_concordance(decision, final_ref):
    r1_ref = decision.get("R1_candidate_ref")
    r2_ref = decision.get("R2_candidate_ref")
    if r1_ref is not None and r1_ref != final_ref:
        return False
    if r2_ref is not None and r2_ref != final_ref:
        return False
    if r1_ref is not None and r2_ref is not None and r1_ref != r2_ref:
        return False
    return True


def candidate_has_expected_scaffold_anchor(candidate_by_ref, ref_contexts):
    for ref_name, candidate in candidate_by_ref.items():
        prime_ctx = (ref_contexts.get(ref_name, {}) or {}).get("prime_editing") or {}
        scaffold_search = prime_ctx.get("scaffold_search")
        if scaffold_search and candidate_has_prime_scaffold_softclip(candidate, scaffold_search):
            return True
    return False


def initialize_qname_assignment_decision(sample, group_model, qname, candidate_by_ref, ref_contexts, mode):
    candidate_refs = sorted(candidate_by_ref)
    best_ref, second_ref, best_score, second_score, score_margin = ledger_best_candidate_ref(candidate_by_ref)
    best_candidate = candidate_by_ref.get(best_ref) if best_ref else None
    has_softclip = any(c.get("cigar_has_s") or c.get("softclip_segments") for c in candidate_by_ref.values())
    scaffold_anchor_hit = candidate_has_expected_scaffold_anchor(candidate_by_ref, ref_contexts)
    return {
        "sample": sample,
        "group": group_model.get("group_name", ""),
        "qname": qname,
        "mode": mode,
        "bwa_pass": bool(candidate_by_ref),
        "candidate_refs": candidate_refs,
        "candidate_by_ref": candidate_by_ref,
        "best_ref": best_ref,
        "second_ref": second_ref,
        "best_mapq": 0 if best_candidate is None else int(best_candidate.get("mapq", 0) or 0),
        "best_score_proxy": best_score,
        "second_score_proxy": second_score,
        "score_margin": score_margin,
        "outside_window_identity": None if best_candidate is None else best_candidate.get("outside_window_identity"),
        "outside_window_bases": 0 if best_candidate is None else candidate_outside_window_bases(best_candidate),
        "safe_tag_support_by_ref": {},
        "safe_tag_conflict_by_ref": {},
        "R1_candidate_ref": infer_part_assignment_ref(candidate_by_ref, group_model, "read1"),
        "R2_candidate_ref": infer_part_assignment_ref(candidate_by_ref, group_model, "read2"),
        "mate_concordance": not has_candidate_mate_discordance(candidate_by_ref, group_model),
        "has_softclip": has_softclip,
        "softclip_anchor_expected": scaffold_anchor_hit,
        "scaffold_anchor_hit": scaffold_anchor_hit,
        "hard_assignment_ref": None,
        "hard_assignment_method": None,
        "composite_status": "not_attempted",
        "composite_reason": "",
        "composite_final_ref": None,
        "composite_used_sites": [],
        "composite_final_ref_compatible_sites": [],
        "composite_contextual_snp_outlier_sites": [],
        "composite_non_natural_sites": [],
        "composite_event_affected_sites": [],
        "composite_possible_refs_trace": [],
        "composite_without_single_unique_tag": False,
        "rescue_attempted": False,
        "rescue_status": "",
        "rescue_method": "",
        "final_assignment_ref": None,
        "final_assignment_tier": LEDGER_TIER_UNASSIGNED,
        "unassigned_reason": "",
    }


def ledger_set_unassigned(decision, reason):
    decision["final_assignment_ref"] = None
    decision["final_assignment_tier"] = LEDGER_TIER_UNASSIGNED
    decision["unassigned_reason"] = reason
    return decision


def compact_composite_decision_details(decision):
    """Drop per-read composite trace fields before retaining the sample ledger."""
    decision["composite_event_affected_tag"] = (
        1 if decision.get("composite_event_affected_sites") else 0
    )
    for field in COMPOSITE_TRANSIENT_DECISION_FIELDS:
        decision.pop(field, None)
    return decision


def unique_zero_conflict_supported_ref(scores, min_matches=1):
    supported = [
        ref_name for ref_name, details in scores.items()
        if details.get("matches", 0) >= min_matches and details.get("conflicts", 0) == 0
    ]
    if len(supported) == 1:
        return supported[0]
    return None


def best_ref_has_true_conflict(scores, best_ref):
    if best_ref is None:
        return False
    return scores.get(best_ref, {}).get("conflicts", 0) > 0


def any_informative_safe_tag(scores):
    return any(
        details.get("matches", 0) > 0 or details.get("conflicts", 0) > 0
        for details in scores.values()
    )


def choose_rescue_assignment(decision, passing, scores):
    unique_safe_ref = unique_zero_conflict_supported_ref(scores, min_matches=1)
    if unique_safe_ref is not None:
        if passing.get(unique_safe_ref, {}).get("is_secondary_alignment"):
            return None, None, UNASSIGNED_TIE_OR_LOW_MARGIN
        if decision.get("scaffold_anchor_hit"):
            return unique_safe_ref, RESCUE_PE_SCAFFOLD_ANCHORED, ""
        return unique_safe_ref, RESCUE_SAFE_TAG_ZERO_CONFLICT, ""

    if any_informative_safe_tag(scores):
        conflict_free = [
            ref_name for ref_name, details in scores.items()
            if details.get("matches", 0) > 0 and details.get("conflicts", 0) == 0
        ]
        if not conflict_free:
            return None, None, UNASSIGNED_TRUE_CONFLICT
        if len(conflict_free) >= 2:
            ranked = sorted(
                conflict_free,
                key=lambda r: (
                    scores[r].get("score", 0.0),
                    scores[r].get("matches", 0),
                    scores[r].get("covered", 0),
                ),
                reverse=True,
            )
            best_ref = ranked[0]
            best_score = scores[best_ref].get("score", 0.0)
            second_score = scores[ranked[1]].get("score", 0.0) if len(ranked) >= 2 else 0.0
            if (
                best_score - second_score >= 2.0
                and not passing.get(best_ref, {}).get("is_secondary_alignment")
            ):
                return best_ref, RESCUE_SCORE_MARGIN, ""
        return None, None, UNASSIGNED_TIE_OR_LOW_MARGIN

    best_ref = decision.get("best_ref")
    if (
        best_ref is not None
        and decision.get("score_margin", 0.0) >= 5.0
        and not passing.get(best_ref, {}).get("is_secondary_alignment")
    ):
        return best_ref, RESCUE_ALIGNMENT_MARGIN, ""

    if decision.get("scaffold_anchor_hit"):
        return None, None, UNASSIGNED_NO_INFORMATIVE_TAG
    return None, None, UNASSIGNED_NO_INFORMATIVE_TAG


def candidate_has_complete_pair_assignment_evidence(candidate, mode):
    if mode == "overlap":
        return True
    if candidate.get("pair_candidate_complete") is False:
        return False
    if candidate.get("has_read1_candidate") is False or candidate.get("has_read2_candidate") is False:
        return False

    has_explicit_pair_metadata = any(
        key in candidate
        for key in ("pair_candidate_complete", "has_read1_candidate", "has_read2_candidate", "parts")
    )
    if not has_explicit_pair_metadata:
        return True

    parts = [p for p in candidate.get("parts", []) or [] if isinstance(p, dict)]
    if parts:
        read1_has_sequence = any(
            p.get("part_name") == "read1" and bool(str(p.get("raw_sequence") or ""))
            for p in parts
        )
        read2_has_sequence = any(
            p.get("part_name") == "read2" and bool(str(p.get("raw_sequence") or ""))
            for p in parts
        )
        if not (read1_has_sequence and read2_has_sequence):
            return False

    raw_sequence = str(candidate.get("raw_sequence") or "")
    if "|" in raw_sequence:
        left, right = raw_sequence.split("|", 1)
        return bool(left) and bool(right)
    return not parts


def build_qname_assignment_decision(
    sample,
    group_model,
    qname,
    candidate_by_ref,
    ref_contexts,
    mode,
    min_identity_score,
):
    """
    V10 qname-level assignment ledger row.

    The ledger is the single source of truth after BWA: one qname can produce
    only one final assignment tier and one final reference.
    """
    decision = initialize_qname_assignment_decision(
        sample=sample,
        group_model=group_model,
        qname=qname,
        candidate_by_ref=candidate_by_ref,
        ref_contexts=ref_contexts,
        mode=mode,
    )

    passing = {}
    has_insufficient = False
    has_low_identity = False
    has_pair_incomplete = False
    for ref_name, candidate in candidate_by_ref.items():
        if not candidate_has_complete_pair_assignment_evidence(candidate, mode):
            has_pair_incomplete = True
            continue
        outside_id = candidate.get("outside_window_identity")
        outside_id_available = candidate.get("outside_window_identity_available", False)
        if not outside_id_available or outside_id is None:
            has_insufficient = True
            continue
        if outside_id < min_identity_score:
            has_low_identity = True
            continue
        passing[ref_name] = candidate

    if not passing:
        if has_pair_incomplete:
            return ledger_set_unassigned(decision, UNASSIGNED_MATE_DISCORDANCE)
        if has_low_identity:
            return ledger_set_unassigned(decision, UNASSIGNED_LOW_OUTSIDE_IDENTITY)
        if has_insufficient:
            return ledger_set_unassigned(decision, UNASSIGNED_INSUFFICIENT_OUTSIDE_BASES)
        return ledger_set_unassigned(decision, UNASSIGNED_NO_INFORMATIVE_TAG)

    decision["candidate_by_ref"] = passing
    decision["candidate_refs"] = sorted(passing)
    best_ref, second_ref, best_score, second_score, score_margin = ledger_best_candidate_ref(passing)
    decision["best_ref"] = best_ref
    decision["second_ref"] = second_ref
    decision["best_score_proxy"] = best_score
    decision["second_score_proxy"] = second_score
    decision["score_margin"] = score_margin
    if best_ref is not None:
        best_candidate = passing[best_ref]
        decision["best_mapq"] = int(best_candidate.get("mapq", 0) or 0)
        decision["outside_window_identity"] = best_candidate.get("outside_window_identity")
        decision["outside_window_bases"] = candidate_outside_window_bases(best_candidate)

    scores = score_safe_informative_tags(passing, group_model)
    decision["safe_tag_support_by_ref"] = {
        ref_name: details.get("matches", 0)
        for ref_name, details in scores.items()
    }
    decision["safe_tag_conflict_by_ref"] = {
        ref_name: details.get("conflicts", 0)
        for ref_name, details in scores.items()
    }
    decision["R1_candidate_ref"] = infer_part_assignment_ref(passing, group_model, "read1")
    decision["R2_candidate_ref"] = infer_part_assignment_ref(passing, group_model, "read2")
    decision["mate_concordance"] = True
    decision["scaffold_anchor_hit"] = candidate_has_expected_scaffold_anchor(passing, ref_contexts)
    decision["softclip_anchor_expected"] = decision["scaffold_anchor_hit"]

    if len(group_model.get("reference_names", []) or []) == 1 and best_ref is not None:
        if not check_final_assignment_mate_concordance(decision, best_ref):
            decision["mate_concordance"] = False
            return ledger_set_unassigned(decision, UNASSIGNED_MATE_DISCORDANCE)
        decision["hard_assignment_ref"] = best_ref
        decision["hard_assignment_method"] = "SINGLE_REFERENCE_HARD"
        decision["final_assignment_ref"] = best_ref
        decision["final_assignment_tier"] = LEDGER_TIER_HARD
        decision["unassigned_reason"] = ""
        return decision

    hard_ref, hard_method = dynamic_hard_assignment_from_scores(scores)
    if (
        hard_ref is not None
        and hard_method == "SAFE_TAG_HARD"
        and not passing.get(hard_ref, {}).get("is_secondary_alignment")
    ):
        if not check_final_assignment_mate_concordance(decision, hard_ref):
            decision["mate_concordance"] = False
            return ledger_set_unassigned(decision, UNASSIGNED_MATE_DISCORDANCE)
        decision["hard_assignment_ref"] = hard_ref
        decision["hard_assignment_method"] = hard_method
        decision["final_assignment_ref"] = hard_ref
        decision["final_assignment_tier"] = LEDGER_TIER_HARD
        decision["unassigned_reason"] = ""
        return decision

    composite = try_composite_tag_assignment(
        candidate_by_ref=passing,
        group_model=group_model,
        min_identity_score=min_identity_score,
    )
    decision["composite_status"] = composite.get("status", "failed")
    decision["composite_reason"] = composite.get("reason", "")
    decision["composite_final_ref"] = composite.get("final_ref")
    decision["composite_used_sites"] = list(composite.get("used_sites") or [])
    decision["composite_final_ref_compatible_sites"] = list(
        composite.get("final_ref_compatible_sites") or []
    )
    decision["composite_contextual_snp_outlier_sites"] = list(
        composite.get("contextual_snp_outlier_sites") or []
    )
    decision["composite_non_natural_sites"] = list(composite.get("non_natural_sites") or [])
    decision["composite_event_affected_sites"] = list(composite.get("event_affected_sites") or [])
    decision["composite_possible_refs_trace"] = list(composite.get("possible_refs_trace") or [])
    decision["composite_without_single_unique_tag"] = bool(
        composite.get("composite_without_single_unique_tag", False)
    )

    if decision["composite_reason"] == UNASSIGNED_MATE_DISCORDANCE:
        decision["mate_concordance"] = False

    composite_ref = composite.get("assigned_ref")
    if (
        composite_ref is not None
        and not passing.get(composite_ref, {}).get("is_secondary_alignment")
    ):
        if not check_final_assignment_mate_concordance(decision, composite_ref):
            decision["mate_concordance"] = False
            return ledger_set_unassigned(decision, UNASSIGNED_MATE_DISCORDANCE)
        decision["hard_assignment_ref"] = composite_ref
        decision["hard_assignment_method"] = COMPOSITE_TAG_HARD
        decision["final_assignment_ref"] = composite_ref
        decision["final_assignment_tier"] = LEDGER_TIER_HARD
        decision["unassigned_reason"] = ""
        return decision

    decision["rescue_attempted"] = True
    rescue_ref, rescue_method, unassigned_reason = choose_rescue_assignment(decision, passing, scores)
    if rescue_ref is not None:
        if not check_final_assignment_mate_concordance(decision, rescue_ref):
            decision["mate_concordance"] = False
            return ledger_set_unassigned(decision, UNASSIGNED_MATE_DISCORDANCE)
        decision["rescue_status"] = "rescued"
        decision["rescue_method"] = rescue_method
        decision["final_assignment_ref"] = rescue_ref
        decision["final_assignment_tier"] = LEDGER_TIER_RESCUED
        decision["unassigned_reason"] = ""
        return decision

    decision["rescue_status"] = "not_rescued"
    return ledger_set_unassigned(decision, unassigned_reason or UNASSIGNED_TIE_OR_LOW_MARGIN)


def assigned_candidate_from_decision(decision):
    ref_name = decision.get("final_assignment_ref")
    if not ref_name:
        return None
    candidate = (decision.get("candidate_by_ref") or {}).get(ref_name)
    if candidate is None:
        return None
    if not candidate_has_complete_pair_assignment_evidence(candidate, decision.get("mode")):
        return None
    return candidate


def partition_assignment_decisions_by_ref(decisions):
    hard_by_ref = defaultdict(list)
    hard_plus_rescued_by_ref = defaultdict(list)
    rescued_by_ref = defaultdict(list)
    qc = {
        "BWA qnames": 0,
        "hard assigned": 0,
        "rescued assigned": 0,
        "hard_plus_rescued assigned": 0,
        "unassigned after BWA": 0,
    }
    for reason in LEDGER_UNASSIGNED_REASONS:
        qc[reason] = 0
    for method in LEDGER_RESCUE_METHODS:
        qc[method] = 0
    qc[COMPOSITE_TAG_HARD] = 0
    qc["composite_event_affected_tag"] = 0
    for reason in COMPOSITE_FAILURE_REASONS:
        qc[reason] = 0

    seen = set()
    for decision in decisions:
        key = (decision.get("sample"), decision.get("group"), decision.get("qname"))
        if key in seen:
            continue
        seen.add(key)
        qc["BWA qnames"] += 1
        if decision.get("hard_assignment_method") == COMPOSITE_TAG_HARD:
            qc[COMPOSITE_TAG_HARD] += 1
        composite_reason = decision.get("composite_reason")
        if composite_reason in COMPOSITE_FAILURE_REASONS:
            qc[composite_reason] += 1
        qc["composite_event_affected_tag"] += decision.get("composite_event_affected_tag", 0)
        tier = decision.get("final_assignment_tier")
        candidate = assigned_candidate_from_decision(decision)
        ref_name = decision.get("final_assignment_ref")
        if tier == LEDGER_TIER_HARD and candidate is not None and ref_name:
            hard_by_ref[ref_name].append(candidate)
            hard_plus_rescued_by_ref[ref_name].append(candidate)
            qc["hard assigned"] += 1
        elif tier == LEDGER_TIER_RESCUED and candidate is not None and ref_name:
            rescued_by_ref[ref_name].append(candidate)
            hard_plus_rescued_by_ref[ref_name].append(candidate)
            qc["rescued assigned"] += 1
            method = decision.get("rescue_method")
            if method in LEDGER_RESCUE_METHODS:
                qc[method] += 1
        else:
            qc["unassigned after BWA"] += 1
            reason = decision.get("unassigned_reason") or UNASSIGNED_NO_INFORMATIVE_TAG
            if reason not in LEDGER_UNASSIGNED_REASONS:
                reason = UNASSIGNED_NO_INFORMATIVE_TAG
            qc[reason] += 1
            decision["unassigned_reason"] = reason

    qc["hard_plus_rescued assigned"] = qc["hard assigned"] + qc["rescued assigned"]
    return {
        "hard_by_ref": hard_by_ref,
        "rescued_by_ref": rescued_by_ref,
        "hard_plus_rescued_by_ref": hard_plus_rescued_by_ref,
        "qc": qc,
    }


def make_allele_class(window_events):
    if not window_events:
        return "WT"
    kinds = sorted({event["kind"] for event in window_events})
    if kinds == ["DEL"]:
        return "Deletion"
    if kinds == ["INS"]:
        return "Insertion"
    if kinds == ["SNP"]:
        return "Substitution"
    if kinds == ["DEL", "INS"]:
        return "Insertion+Deletion"
    if kinds == ["DEL", "SNP"]:
        return "Deletion+Substitution"
    if kinds == ["INS", "SNP"]:
        return "Insertion+Substitution"
    return "Mixed"


def guide_expected_states_in_reference(ref_ctx):
    match = ref_ctx.get("guide_match")
    guide_sequence = ref_ctx.get("guide_sequence")
    if not match or not guide_sequence:
        return {}
    oriented_guide = guide_sequence if match["strand"] == "+" else reverse_complement(guide_sequence)
    positions = {}
    for idx, base in enumerate(oriented_guide):
        positions[match["start"] + idx] = base
    return positions


def filter_expected_homoeolog_window_events(candidate, reference_name, group_model, ref_ctx):
    """
    Remove window-internal SNPs that are explained by homoeolog background.

    For each window event that is a SNP: if the observed alt allele matches
    the fixed state of ANY OTHER subgenome in the homoeolog group at that
    position, the SNP is attributed to natural subgenome variation and
    filtered out (not counted as editing).

    This is independent of the assigned reference — even if a read from
    subgenome B is misassigned to A, the A→B substitution at a known
    homoeolog site is correctly filtered.
    """
    if not group_model.get("is_homoeolog_group"):
        return candidate["window_events"]

    # Build a map: coord_pos → set of all homoeolog background states (excluding current ref)
    homoeolog_background = {}
    for feature in group_model.get("features_by_ref", {}).get(reference_name, []):
        if not feature.get("overlaps_window"):
            continue
        coord_pos = feature["coord_pos"]
        expected_here = feature["expected_state"]

        # Collect states from OTHER subgenomes at the same site
        other_states = set()
        for site in group_model.get("informative_sites", []):
            if site.get("overlaps_window"):
                for other_ref, state in site.get("states", {}).items():
                    if other_ref != reference_name:
                        other_states.add(str(state).upper())
                # Check if this site matches our feature
                for feat in group_model.get("features_by_ref", {}).get(reference_name, []):
                    if feat["site_id"] == site["site_id"] and feat["coord_pos"] == coord_pos:
                        homoeolog_background[coord_pos] = other_states
                        break

    # Also build from group model informatives directly: coord → other states
    coord_to_other_states = {}
    ref_names = group_model.get("reference_names", [])
    for site in group_model.get("informative_sites", []):
        if not site.get("overlaps_window"):
            continue
        features = group_model.get("features_by_ref", {}).get(reference_name, [])
        for feat in features:
            if feat["site_id"] == site["site_id"] and feat.get("overlaps_window"):
                coord = feat["coord_pos"]
                others = set()
                for rn in ref_names:
                    if rn != reference_name:
                        s = site["states"].get(rn, "-")
                        others.add(str(s).upper())
                coord_to_other_states[coord] = others

    filtered = []
    for event in candidate["window_events"]:
        if event["kind"] == "SNP":
            alt_base = str(event["alt"]).upper()
            bg_states = coord_to_other_states.get(event["pos"], set())
            if alt_base in bg_states and alt_base not in ("-", ""):
                # This SNP matches another subgenome's fixed state → background, filter out
                continue
        filtered.append(event)
    return filtered


def filter_display_rows(rows, total_reads, min_ratio):
    selected = []
    for row in sorted(rows, key=lambda x: x["Reads number"], reverse=True):
        ratio_value = 0.0 if total_reads == 0 else row["Reads number"] / total_reads * 100.0
        if ratio_value >= min_ratio:
            selected.append(deepcopy(row))

    display_total = sum(row["Reads number"] for row in selected)
    if display_total == 0:
        return []

    for idx, row in enumerate(selected, start=1):
        row["Sort"] = idx
        row["Ratio"] = f"{(row['Reads number'] / display_total * 100.0):.2f}%"
    return selected


def editing_frequency_is_supported(stats):
    support = str(stats.get("Editing frequency support", ""))
    return (
        (support == "computed" or support.startswith("low_depth_warning"))
        and is_number(stats.get("Editing frequency"))
    )


def evaluate_depth_support(total_assigned, min_genotype_depth=MIN_GENOTYPE_DEPTH, low_depth_warning_threshold=LOW_DEPTH_WARNING_THRESHOLD):
    if total_assigned < min_genotype_depth:
        return False, f"insufficient_support(<{min_genotype_depth})"
    if total_assigned < low_depth_warning_threshold:
        return True, f"low_depth_warning(<{low_depth_warning_threshold})"
    return True, "computed"


def make_na_summary_row():
    return {
        "Sort": "NA",
        "Reads number": "NA",
        "Ratio": "NA",
        "Read status": "NA",
        "Allele class": "NA",
        "In-window variation": "NA",
        "Outside-window variation": "NA",
        "Representative sequence": "NA|NA",
    }


def summary_rows_for_export(result, use_combined=False):
    stats = result["combined_stats"] if use_combined else result["stats"]
    if not editing_frequency_is_supported(stats):
        return [make_na_summary_row()]
    rows = result["combined_display_rows"] if use_combined else result["display_rows"]
    return [
        row for row in rows
        if all(split_representative_sequence(str(row.get("Representative sequence", "") or "")))
    ]


def displayed_summary_rows_for_values(result, use_combined=False):
    rows = result["combined_display_rows"] if use_combined else result["display_rows"]
    displayed = []
    for row in rows:
        raw_sequence = row.get("Representative sequence")
        if raw_sequence is None:
            displayed.append(row)
            continue
        if all(split_representative_sequence(str(raw_sequence or ""))):
            displayed.append(row)
    return displayed


def pe_variant_tokens_for_row(row):
    tokens = set()
    for column in ("Prime-edited", "Indel byproducts", "Scaffold-incorporated"):
        raw_value = row.get(column, "-")
        if not pe_outcome_is_present(raw_value):
            continue
        for token in str(raw_value).split(";"):
            token = token.strip()
            if token and token != "-":
                tokens.add(token)
    return sorted(tokens)


def format_pe_summary_frequency_cell(rows, display_total):
    reads = sum(row.get("Reads number", 0) for row in rows if is_number(row.get("Reads number", 0)))
    if reads <= 0:
        return "0"
    tokens = set()
    for row in rows:
        tokens.update(pe_variant_tokens_for_row(row))
    variant_text = ";".join(sorted(tokens)) if tokens else "-"
    return f"{reads / display_total * 100.0:.2f}%:{variant_text}"


def pe_genotype_from_precise_rows(display_rows, display_total):
    genotype_rows = []
    for row in display_rows:
        allele_class = row.get("Allele class")
        if row.get("Read status") == "WT" or allele_class == PE_CLASS_PRECISE:
            row_copy = deepcopy(row)
            reads_number = row_copy.get("Reads number", 0)
            row_copy["Ratio"] = f"{reads_number / display_total * 100.0:.2f}%"
            genotype_rows.append(row_copy)
    return determine_sample_genotype(genotype_rows, display_total, 0.0)


def genotype_summary_values(result, use_combined=False, editing_tool="cas9"):
    stats = result["combined_stats"] if use_combined else result["stats"]
    genotype_label = result.get("combined_genotype_display", "-") if use_combined else result.get("genotype_display", "-")
    if not editing_frequency_is_supported(stats):
        if editing_tool == "prime_editor":
            return ["NA", "NA", "NA", "NA", "NA", "NA", "NA"]
        return "NA", "NA"
    display_rows = result["combined_display_rows"] if use_combined else result["display_rows"]
    display_total = sum(row.get("Reads number", 0) for row in display_rows if is_number(row.get("Reads number", 0)))
    modified_rows = [
        row for row in display_rows
        if row.get("Read status") == "Modified" and is_number(row.get("Reads number", 0))
    ]
    modified_total = sum(row.get("Reads number", 0) for row in modified_rows)
    editing_frequency = 0.0 if display_total == 0 else modified_total / display_total * 100.0
    editing_frequency_value = f"{editing_frequency:.2f}%"
    if editing_tool != "prime_editor":
        return editing_frequency_value, (genotype_label or "-")

    display_rows = displayed_summary_rows_for_values(result, use_combined=use_combined)
    display_total = sum(row.get("Reads number", 0) for row in display_rows if is_number(row.get("Reads number", 0)))
    if display_total <= 0:
        return ["NA", "NA", "NA", "NA", "NA", "NA", "NA"]

    modified_rows = [
        row for row in display_rows
        if row.get("Read status") == "Modified" and is_number(row.get("Reads number", 0))
    ]
    modified_total = sum(row.get("Reads number", 0) for row in modified_rows)
    editing_frequency_value = f"{modified_total / display_total * 100.0:.2f}%"
    precise_rows = [row for row in modified_rows if row.get("Allele class") == PE_CLASS_PRECISE]
    byproduct_rows = [row for row in modified_rows if row.get("Allele class") == PE_CLASS_BYPRODUCT]
    precise_byproduct_rows = [row for row in modified_rows if row.get("Allele class") == PE_CLASS_PRECISE_BYPRODUCT]
    precise_scaffold_rows = [row for row in modified_rows if row.get("Allele class") == PE_CLASS_PRECISE_SCAFFOLD]

    has_scaffold = any(
        row.get("Allele class") in {PE_CLASS_SCAFFOLD_ONLY, PE_CLASS_PRECISE_SCAFFOLD}
        or pe_outcome_is_present(row.get("Scaffold-incorporated"))
        for row in modified_rows
    )
    has_byproduct = any(
        row.get("Allele class") in {PE_CLASS_BYPRODUCT, PE_CLASS_PRECISE_BYPRODUCT}
        or pe_outcome_is_present(row.get("Indel byproducts"))
        for row in modified_rows
    )
    note_parts = []
    if has_scaffold:
        note_parts.append("骨架插入")
    if has_byproduct:
        note_parts.append("副产物变异")
    note = ";".join(note_parts) if note_parts else "-"
    return [
        editing_frequency_value,
        format_pe_summary_frequency_cell(precise_rows, display_total),
        format_pe_summary_frequency_cell(byproduct_rows, display_total),
        format_pe_summary_frequency_cell(precise_byproduct_rows, display_total),
        format_pe_summary_frequency_cell(precise_scaffold_rows, display_total),
        pe_genotype_from_precise_rows(display_rows, display_total),
        note,
    ]


def split_representative_sequence(raw_sequence):
    if "|" in raw_sequence:
        left, right = raw_sequence.split("|", 1)
        return left, right
    return raw_sequence, ""


def candidate_has_paired_representative_sequence(candidate):
    if candidate.get("pair_candidate_complete") is False:
        return False
    left, right = split_representative_sequence(str(candidate.get("raw_sequence", "") or ""))
    return bool(left) and bool(right)


def candidate_prime_read_sequences(candidate):
    sequences = []
    for part in candidate.get("parts", []) or []:
        if not isinstance(part, dict):
            continue
        cleaned = _clean_read_sequence(part.get("raw_sequence", ""))
        if cleaned:
            sequences.append(cleaned)
    if not sequences:
        raw_sequence = str(candidate.get("raw_sequence") or "")
        for chunk in raw_sequence.split("|"):
            cleaned = _clean_read_sequence(chunk)
            if cleaned:
                sequences.append(cleaned)

    unique = []
    seen = set()
    for seq in sequences:
        if seq not in seen:
            unique.append(seq)
            seen.add(seq)
    return unique


def global_alignment_payload(read_sequence, reference_sequence):
    read = _clean_read_sequence(read_sequence)
    reference = _clean_read_sequence(reference_sequence)
    if not read or not reference:
        return None
    aligned_read, aligned_ref = needleman_wunsch(read, reference)
    return {
        "aligned_read": aligned_read,
        "aligned_ref": aligned_ref,
        "score": alignment_score_from_aligned(aligned_read, aligned_ref),
    }


def prime_scaffold_cache_key(scaffold_search):
    if not scaffold_search:
        return None
    return (
        scaffold_search.get("scaffold_start"),
        scaffold_search.get("scaffold_search_sequence"),
    )


def scaffold_matches_expected_prime_position(aligned_read, aligned_ref, scaffold_search):
    return scaffold_expected_prime_position_match(aligned_read, aligned_ref, scaffold_search) is not None


def scaffold_expected_prime_position_match(aligned_read, aligned_ref, scaffold_search):
    if not scaffold_search:
        return None
    scaffold_start = scaffold_search.get("scaffold_start")
    search_seq = scaffold_search.get("scaffold_search_sequence")
    if scaffold_start is None or not search_seq:
        return None

    ref_pos = -1
    target_col = 0 if scaffold_start <= 0 else None
    for col_idx, ref_base in enumerate(aligned_ref):
        if ref_base == "-":
            continue
        ref_pos += 1
        if ref_pos == scaffold_start - 1:
            target_col = col_idx + 1
            break

    if target_col is None:
        return None
    if aligned_read[target_col:target_col + len(search_seq)] != search_seq:
        return None

    scaffold_dna = _clean_read_sequence(scaffold_search.get("scaffold_dna", ""))
    observed = search_seq
    if scaffold_dna:
        max_len = min(len(scaffold_dna), len(aligned_read) - target_col)
        aligned_segment = aligned_read[target_col:target_col + max_len].replace("-", "")
        longest = ""
        for length in range(len(search_seq), min(len(scaffold_dna), len(aligned_segment)) + 1):
            if aligned_segment[:length] == scaffold_dna[:length]:
                longest = aligned_segment[:length]
        if longest:
            observed = longest
    return {
        "detection": "expected_position",
        "sequence": observed,
        "anchor": scaffold_search.get("reference_scaffold_anchor"),
    }


def format_prime_scaffold_event(scaffold_match):
    detection = (scaffold_match or {}).get("detection") or "expected_position"
    sequence = _clean_read_sequence((scaffold_match or {}).get("sequence", ""))
    if sequence:
        return f"scaffold:{detection}:{sequence}"
    return f"scaffold:{detection}"


def prime_scaffold_expected_anchors(scaffold_search):
    if not scaffold_search:
        return set()
    anchors = set()
    for key in (
        "reference_scaffold_anchor",
        "reference_extension_start",
        "reference_extension_end",
        "scaffold_start",
    ):
        value = scaffold_search.get(key)
        if value is None:
            continue
        try:
            value = int(value)
        except (TypeError, ValueError):
            continue
        anchors.add(value)
        anchors.add(value - 1)
    return anchors


def softclip_reference_anchors(segment):
    anchors = set()
    for key in ("anchor_ref_pos", "reference_start"):
        value = segment.get(key)
        if value is None:
            continue
        try:
            anchors.add(int(value))
        except (TypeError, ValueError):
            continue
    value = segment.get("reference_end")
    if value is not None:
        try:
            anchors.add(int(value))
            anchors.add(int(value) - 1)
        except (TypeError, ValueError):
            pass
    return anchors


def softclip_contains_prime_scaffold(segment, scaffold_search):
    return prime_scaffold_softclip_sequence(segment, scaffold_search) is not None


def prime_scaffold_softclip_sequence(segment, scaffold_search):
    if not scaffold_search or not segment:
        return None
    search_seq = _clean_read_sequence(scaffold_search.get("scaffold_search_sequence", ""))
    scaffold_dna = _clean_read_sequence(scaffold_search.get("scaffold_dna", ""))
    clip_seq = _clean_read_sequence(segment.get("clip_seq", ""))
    if not search_seq or not scaffold_dna or not clip_seq:
        return None

    oriented_clips = []
    for oriented_clip in (clip_seq, reverse_complement(clip_seq)):
        if oriented_clip not in oriented_clips:
            oriented_clips.append(oriented_clip)
    for oriented_clip in oriented_clips:
        if oriented_clip.startswith(search_seq):
            observed_len = min(len(oriented_clip), len(scaffold_dna))
            return oriented_clip[:observed_len]

    min_match = max(
        len(search_seq),
        min(PRIME_SCAFFOLD_INTERNAL_MIN_MATCH_LENGTH, len(scaffold_dna)),
    )
    if len(clip_seq) < min_match:
        return None

    scaffold_orientations = {scaffold_dna, reverse_complement(scaffold_dna)}
    for oriented_clip in oriented_clips:
        for idx in range(0, len(oriented_clip) - min_match + 1):
            kmer = oriented_clip[idx:idx + min_match]
            for scaffold in scaffold_orientations:
                scaffold_idx = scaffold.find(kmer)
                if scaffold_idx == -1:
                    continue
                observed_len = min(len(oriented_clip) - idx, len(scaffold) - scaffold_idx)
                return oriented_clip[idx:idx + observed_len]
    return None


def softclip_segment_matches_prime_scaffold(segment, scaffold_search, anchor_slop=PRIME_SCAFFOLD_ANCHOR_SLOP):
    return prime_scaffold_softclip_match(segment, scaffold_search, anchor_slop=anchor_slop) is not None


def prime_scaffold_softclip_match(segment, scaffold_search, anchor_slop=PRIME_SCAFFOLD_ANCHOR_SLOP):
    if not scaffold_search or not segment:
        return None
    scaffold_sequence = prime_scaffold_softclip_sequence(segment, scaffold_search)
    if not scaffold_sequence:
        return None

    anchors = prime_scaffold_expected_anchors(scaffold_search)
    if not anchors:
        return None
    observed_anchors = softclip_reference_anchors(segment)
    if not observed_anchors:
        return None
    best_anchor = None
    for observed_anchor in observed_anchors:
        for expected_anchor in anchors:
            if abs(observed_anchor - expected_anchor) <= anchor_slop:
                best_anchor = observed_anchor
                break
        if best_anchor is not None:
            break
    if best_anchor is None:
        return None
    return {
        "detection": "softclip",
        "sequence": scaffold_sequence,
        "anchor": best_anchor,
    }


def candidate_has_prime_scaffold_softclip(candidate, scaffold_search):
    return candidate_prime_scaffold_softclip_match(candidate, scaffold_search) is not None


def candidate_prime_scaffold_softclip_match(candidate, scaffold_search):
    for segment in candidate.get("softclip_segments", []) or []:
        match = prime_scaffold_softclip_match(segment, scaffold_search)
        if match:
            return match
    return None


def classify_prime_sequence_against_references(
    read_sequence,
    reference_sequence,
    prime_edited_sequence,
    scaffold_search=None,
    classification_cache=None,
):
    reference = _clean_read_sequence(reference_sequence)
    prime_ref = _clean_read_sequence(prime_edited_sequence)
    read = _clean_read_sequence(read_sequence)
    if not read or not reference or not prime_ref or reference == prime_ref:
        return None
    cache_key = (
        read,
        reference,
        prime_ref,
        prime_scaffold_cache_key(scaffold_search),
        PRIME_ALIGNMENT_SCORE_MARGIN,
    )
    if classification_cache is not None and cache_key in classification_cache:
        cached = classification_cache[cache_key]
        return dict(cached) if cached is not None else None

    oriented_reads = [read]
    read_rc = reverse_complement(read)
    if read_rc != read:
        oriented_reads.append(read_rc)

    best_reference = None
    best_prime = None
    for oriented_read in oriented_reads:
        ref_payload = global_alignment_payload(oriented_read, reference)
        prime_payload = global_alignment_payload(oriented_read, prime_ref)
        if ref_payload is not None and (
            best_reference is None or ref_payload["score"] > best_reference["score"]
        ):
            best_reference = ref_payload
        if prime_payload is not None and (
            best_prime is None or prime_payload["score"] > best_prime["score"]
        ):
            best_prime = prime_payload

    if best_reference is None or best_prime is None:
        if classification_cache is not None:
            classification_cache[cache_key] = None
        return None

    if best_prime["score"] >= best_reference["score"] + PRIME_ALIGNMENT_SCORE_MARGIN:
        best_name = "prime-edited"
    elif best_reference["score"] >= best_prime["score"] + PRIME_ALIGNMENT_SCORE_MARGIN:
        best_name = "reference"
    else:
        best_name = "ambiguous"

    scaffold_match = None
    if best_name == "prime-edited":
        scaffold_match = scaffold_expected_prime_position_match(
            best_prime["aligned_read"],
            best_prime["aligned_ref"],
            scaffold_search,
        )
    result = {
        "best_reference": best_name,
        "reference_score": best_reference["score"],
        "prime_edited_score": best_prime["score"],
        "has_scaffold": scaffold_match is not None,
        "scaffold_detection": scaffold_match.get("detection", "expected_position") if scaffold_match else "",
        "scaffold_sequence": scaffold_match.get("sequence", "") if scaffold_match else "",
        "scaffold_match": scaffold_match,
    }
    if classification_cache is not None:
        classification_cache[cache_key] = dict(result)
    return result


def classify_prime_candidate_against_references(candidate, prime_ctx, classification_cache=None):
    reference_sequence = prime_ctx.get("reference_sequence")
    prime_edited_sequence = prime_ctx.get("prime_edited_reference_sequence")
    scaffold_search = prime_ctx.get("scaffold_search")
    softclip_scaffold_match = candidate_prime_scaffold_softclip_match(candidate, scaffold_search)
    if softclip_scaffold_match:
        return {
            "best_reference": "prime-edited",
            "has_scaffold": True,
            "scaffold_detection": "softclip",
            "scaffold_sequence": softclip_scaffold_match.get("sequence", ""),
            "scaffold_match": softclip_scaffold_match,
        }
    saw_reference = False
    saw_ambiguous = False
    for read_sequence in candidate_prime_read_sequences(candidate):
        result = classify_prime_sequence_against_references(
            read_sequence,
            reference_sequence,
            prime_edited_sequence,
            scaffold_search=scaffold_search,
            classification_cache=classification_cache,
        )
        if result is None:
            continue
        if result["has_scaffold"]:
            return result
        if result["best_reference"] == "prime-edited":
            return result
        if result["best_reference"] == "reference":
            saw_reference = True
        else:
            saw_ambiguous = True

    if saw_reference:
        return {"best_reference": "reference", "has_scaffold": False}
    if saw_ambiguous:
        return {"best_reference": "ambiguous", "has_scaffold": False}
    return None


def classify_prime_editor_outcomes(candidate, filtered_window_events, ref_ctx, classification_cache=None):
    prime_ctx = ref_ctx.get("prime_editing") or {}
    expected_signatures = set(prime_ctx.get("expected_event_signatures") or [])
    prime_alignment = classify_prime_candidate_against_references(
        candidate,
        prime_ctx,
        classification_cache=classification_cache,
    )

    prime_events = []
    indel_events = []
    for event in filtered_window_events:
        internal_signature = format_event_signature(event)
        display_signature = format_pe_event_signature(event, ref_ctx)
        if internal_signature in expected_signatures:
            prime_events.append(display_signature)
        elif event["kind"] in {"INS", "DEL", "SNP"}:
            indel_events.append(display_signature)

    scaffold_events = []
    if prime_alignment and prime_alignment.get("has_scaffold"):
        scaffold_events.append(
            format_prime_scaffold_event(
                prime_alignment.get("scaffold_match")
                or {
                    "detection": prime_alignment.get("scaffold_detection") or "expected_position",
                    "sequence": prime_alignment.get("scaffold_sequence", ""),
                }
            )
        )

    read_status = "Modified" if prime_events or indel_events or scaffold_events or filtered_window_events else "WT"
    return {
        "read_status": read_status,
        "prime-edited": ";".join(prime_events) if prime_events else "-",
        "indel byproducts": ";".join(indel_events) if indel_events else "-",
        "Scaffold-incorporated": ";".join(scaffold_events) if scaffold_events else "-",
    }


def pe_outcome_is_present(value):
    return str(value or "-").strip() not in {"", "-", "NA"}


PE_CLASS_PRECISE = "Precise"
PE_CLASS_BYPRODUCT = "Byproduct"
PE_CLASS_SCAFFOLD_ONLY = "Scaffold-only"
PE_CLASS_PRECISE_BYPRODUCT = "Precise+Byproduct"
PE_CLASS_PRECISE_SCAFFOLD = "Precise+Scaffold"
PE_CLASS_WT = "WT"


def make_prime_editor_allele_class(outcomes):
    if outcomes.get("read_status") != "Modified":
        return PE_CLASS_WT
    has_prime = pe_outcome_is_present(outcomes.get("prime-edited"))
    has_byproduct = pe_outcome_is_present(outcomes.get("indel byproducts"))
    has_scaffold = pe_outcome_is_present(outcomes.get("Scaffold-incorporated"))
    if has_prime and has_scaffold:
        return PE_CLASS_PRECISE_SCAFFOLD
    if has_prime and has_byproduct:
        return PE_CLASS_PRECISE_BYPRODUCT
    if has_prime:
        return PE_CLASS_PRECISE
    if has_scaffold:
        return PE_CLASS_SCAFFOLD_ONLY
    if has_byproduct:
        return PE_CLASS_BYPRODUCT
    return PE_CLASS_BYPRODUCT


def prime_editor_plot_bucket(allele_entry):
    if allele_entry.get("read_status") != "Modified":
        return None
    has_prime = pe_outcome_is_present(allele_entry.get("prime-edited"))
    has_byproduct = pe_outcome_is_present(allele_entry.get("indel byproducts"))
    has_scaffold = pe_outcome_is_present(allele_entry.get("Scaffold-incorporated"))
    if has_scaffold:
        return "scaffold"
    if has_byproduct:
        return "byproduct"
    if has_prime:
        return "precise"
    return "byproduct"


def classify_prime_editor_allele(candidate, filtered_window_events, ref_ctx, classification_cache=None):
    """
    Compatibility wrapper for older tests/callers that expect one PE class.
    New PE exports use classify_prime_editor_outcomes() to allow coexisting outcomes.
    """
    outcomes = classify_prime_editor_outcomes(
        candidate,
        filtered_window_events,
        ref_ctx,
        classification_cache=classification_cache,
    )
    if outcomes["read_status"] != "Modified":
        return "WT", "WT"
    if outcomes["Scaffold-incorporated"] != "-":
        return "Modified", "Scaffold-incorporated"
    if outcomes["prime-edited"] != "-":
        return "Modified", "prime-edited"
    if outcomes["indel byproducts"] != "-":
        return "Modified", "indel byproducts"
    return "Modified", "Mixed"

def determine_sample_genotype(all_rows, total_assigned, min_ratio):
    """
    按 Hi-TOM 风格给单个样本/单条参考判定基因型标签。

    规则:
    - AA: 纯 WT
    - Aa: WT + 同一种编辑型，且该编辑型频率在 30%-70%
    - aa: 只有一种编辑型且频率 >70%（含纯编辑型）
    - chimeric: 两个以上主要 allele / 复杂混合 / 单一编辑型频率 <30%
    """
    if total_assigned == 0:
        return "-"

    def display_ratio(row):
        value = row.get("Ratio", "0")
        if isinstance(value, str):
            value = value.replace("%", "").strip() or "0"
        try:
            return float(value)
        except (TypeError, ValueError):
            return 0.0

    displayed_rows = [row for row in all_rows if row.get("Reads number", 0) > 0]
    modified_rows = [row for row in displayed_rows if row["Read status"] == "Modified"]
    wt_rows = [row for row in displayed_rows if row["Read status"] == "WT"]

    if not modified_rows:
        return "AA"

    if len(modified_rows) > 1:
        return "chimeric"

    main_ratio = display_ratio(modified_rows[0])
    wt_ratio = sum(display_ratio(row) for row in wt_rows)

    if main_ratio < 5.0:
        return "AA"
    if 30.0 <= main_ratio <= 70.0 and 30.0 <= wt_ratio <= 70.0:
        return "Aa"
    if main_ratio > 80.0 and wt_ratio < 20.0:
        return "aa"
    if main_ratio < 30.0:
        return "chimeric"
    return "chimeric"


def determine_special_tag(editing_tool, stats):
    """
    生成与基因型并列的"特殊事件标签"。
    - Cas9: 默认无特殊标签
    - base editor: 有 indel 时标注 indel
    - prime editor: 根据 scaffold / indel byproducts 标注
    """
    tags = []
    if editing_tool == "base_editor":
        if stats.get("Reads with insertion", 0) > 0 or stats.get("Reads with deletion", 0) > 0:
            tags.append("indel")
    elif editing_tool == "prime_editor":
        if stats.get("Scaffold-incorporated reads", 0) > 0:
            tags.append("Scaffold-incorporated")
        if stats.get("Indel byproduct reads", 0) > 0:
            tags.append("indel byproducts")
    return ";".join(tags) if tags else "-"


def genotype_suffix_for_row(row):
    """
    Hi-TOM 风格后缀：
    - *: in-frame mutation
    - #: SNP
    """
    suffix = ""
    if row.get("_HasInFrameIndel"):
        suffix += "*"
    if row.get("_HasSNP"):
        suffix += "#"
    return suffix


def decorate_genotype_label(genotype, all_rows):
    """
    给最终基因型标签追加 Hi-TOM 风格后缀。
    目前仅对 Aa / aa 追加后缀；AA/chimeric/- 直接原样返回。
    """
    if genotype not in {"Aa", "aa"}:
        return genotype
    modified_rows = [row for row in all_rows if row["Read status"] == "Modified" and row["Reads number"] > 0]
    if not modified_rows:
        return genotype
    modified_rows.sort(key=lambda row: row["Reads number"], reverse=True)
    suffix = genotype_suffix_for_row(modified_rows[0])
    return genotype + suffix if suffix else genotype


def parse_plate_position(sample_name):
    token = str(sample_name).strip()
    match = re.fullmatch(r"([A-Za-z]+)(\d+)", token)
    if match is None and "_" in token:
        token = token.rsplit("_", 1)[1]
        match = re.fullmatch(r"([A-Za-z]+)(\d+)", token)
    if not match:
        return None
    row_label = match.group(1).upper()
    col_num = int(match.group(2))
    return row_label, col_num


def export_genotype_plate_workbook(ref_name, sample_results, sample_names, out_path):
    """
    单独导出一个 Hi-TOM 风格的板式基因型结果表：
    - Sheet 1: Genotype
    - Sheet 2: SpecialTag
    """
    if not OPENPYXL_AVAILABLE:
        return

    parsed_positions = [parse_plate_position(sample) for sample in sample_names]
    parsed_positions = [x for x in parsed_positions if x is not None]
    if not parsed_positions:
        return

    rows = sorted({row for row, _ in parsed_positions})
    max_col = max(col for _, col in parsed_positions)

    workbook = Workbook()
    ws_genotype = workbook.active
    ws_genotype.title = "Genotype"
    ws_special = workbook.create_sheet("SpecialTag")

    def init_plate(ws, title):
        ws["A1"] = ""
        for col in range(1, max_col + 1):
            ws.cell(row=1, column=col + 1, value=col)
        for row_idx, row_label in enumerate(rows, start=2):
            ws.cell(row=row_idx, column=1, value=row_label)
            for col in range(1, max_col + 1):
                ws.cell(row=row_idx, column=col + 1, value="-")
        ws.cell(row=len(rows) + 3, column=1, value="Notice:")
        ws.cell(row=len(rows) + 3, column=2, value="* In-frame mutation")
        ws.cell(row=len(rows) + 4, column=2, value="# SNP")
        ws.cell(row=len(rows) + 5, column=2, value="- Missing data")

    init_plate(ws_genotype, "Genotype")
    init_plate(ws_special, "SpecialTag")

    for sample in sample_names:
        pos = parse_plate_position(sample)
        if pos is None:
            continue
        row_label, col_num = pos
        if row_label not in rows:
            continue
        row_idx = rows.index(row_label) + 2
        result = sample_results.get(sample)
        if result is None:
            continue
        genotype_label = genotype_summary_values(result)[1]
        special_tag = result.get("stats", {}).get("Special tag", "-") if genotype_label != "NA" else "NA"
        ws_genotype.cell(row=row_idx, column=col_num + 1, value=genotype_label or "-")
        ws_special.cell(row=row_idx, column=col_num + 1, value=special_tag or "-")

    workbook.save(out_path)


def iter_standard_plate_samples():
    """按 Hi-TOM 常用 96 孔顺序返回 A1-H12。"""
    for row_label in "ABCDEFGH":
        for col_num in range(1, 13):
            yield f"{row_label}{col_num}"


def collect_candidate_allele_entry(candidate, reference_record, group_model, ref_ctx, prime_classification_cache=None):
    filtered_window_events = filter_expected_homoeolog_window_events(
        candidate,
        reference_record["name"],
        group_model,
        ref_ctx,
    )
    outside_signatures = [format_event_signature(event) for event in candidate["outside_events"]]
    editing_tool = ref_ctx.get("editing_tool", "cas9")
    if editing_tool == "prime_editor":
        window_signatures = [format_pe_event_signature(event, ref_ctx) for event in filtered_window_events]
    else:
        window_signatures = [format_in_window_event_signature(event, ref_ctx) for event in filtered_window_events]
    guide_window_signatures = (
        guide_window_signatures_for_events(filtered_window_events, ref_ctx)
        if editing_tool != "prime_editor" else {}
    )
    pe_outcomes = {
        "prime-edited": "-",
        "indel byproducts": "-",
        "Scaffold-incorporated": "-",
    }
    if editing_tool == "prime_editor":
        pe_outcomes = classify_prime_editor_outcomes(
            candidate,
            filtered_window_events,
            ref_ctx,
            classification_cache=prime_classification_cache,
        )
        read_status = pe_outcomes["read_status"]
        allele_class = make_prime_editor_allele_class(pe_outcomes)
    else:
        allele_class = make_allele_class(filtered_window_events)
        read_status = "Modified" if filtered_window_events else "WT"

    def event_indel_length(event):
        if event["kind"] == "INS":
            if "length" in event:
                return event["length"]
            return len(event.get("inserted_seq", event.get("seq", "")))
        if event["kind"] == "DEL":
            return event.get("length", 0)
        return 0

    net_indel_bp = sum(
        event_indel_length(event) if event["kind"] == "INS" else -event_indel_length(event)
        for event in filtered_window_events
        if event["kind"] in {"INS", "DEL"}
    )
    return {
        "qname": candidate.get("qname"),
        "read_status": read_status,
        "allele_class": allele_class,
        "prime-edited": pe_outcomes["prime-edited"],
        "indel byproducts": pe_outcomes["indel byproducts"],
        "Scaffold-incorporated": pe_outcomes["Scaffold-incorporated"],
        "window_signatures": window_signatures,
        "guide_window_signatures": guide_window_signatures,
        "outside_signatures": outside_signatures,
        "filtered_window_events": filtered_window_events,
        "kinds": {event["kind"] for event in filtered_window_events},
        "row_key": (
            read_status,
            pe_outcomes["prime-edited"],
            pe_outcomes["indel byproducts"],
            pe_outcomes["Scaffold-incorporated"],
            ";".join(window_signatures) if window_signatures else "-",
            ";".join(outside_signatures) if outside_signatures else "-",
        ) if editing_tool == "prime_editor" else (
            read_status,
            allele_class,
            ";".join(window_signatures) if window_signatures else "-",
            tuple(sorted(guide_window_signatures.items())),
            ";".join(outside_signatures) if outside_signatures else "-",
        ),
        "representative_sequence": candidate["raw_sequence"],
        "has_snp": any(event["kind"] == "SNP" for event in filtered_window_events),
        "has_in_frame_indel": net_indel_bp != 0 and net_indel_bp % 3 == 0,
    }


def collect_candidate_allele_entry_cached(
    candidate,
    reference_record,
    group_model,
    ref_ctx,
    prime_classification_cache=None,
    allele_entry_cache=None,
):
    if allele_entry_cache is None:
        return collect_candidate_allele_entry(
            candidate,
            reference_record,
            group_model,
            ref_ctx,
            prime_classification_cache=prime_classification_cache,
        )
    cache_key = (
        candidate.get("qname"),
        reference_record.get("name"),
        candidate.get("raw_sequence", ""),
        tuple(format_event_signature(e) for e in candidate.get("window_events", [])),
        tuple(format_event_signature(e) for e in candidate.get("outside_events", [])),
        tuple(
            (
                guide.get("guide_name"),
                tuple(sorted(guide.get("window_positions", set()) or [])),
            )
            for guide in multi_guide_contexts(ref_ctx)
        ),
    )
    if cache_key not in allele_entry_cache:
        allele_entry_cache[cache_key] = collect_candidate_allele_entry(
            candidate,
            reference_record,
            group_model,
            ref_ctx,
            prime_classification_cache=prime_classification_cache,
        )
    return deepcopy(allele_entry_cache[cache_key])


def update_stats_for_allele_entry(stats, allele_entry, prefix="", include_wildtype=True, include_breakdown=True):
    read_status = allele_entry["read_status"]
    allele_class = allele_entry["allele_class"]
    kinds = allele_entry["kinds"]
    outside_signatures = allele_entry["outside_signatures"]

    if read_status == "Modified":
        modified_key = f"{prefix}Modified reads" if not prefix else f"{prefix}modified reads"
        stats[modified_key] += 1
        if not prefix:
            if pe_outcome_is_present(allele_entry.get("prime-edited")):
                stats["Prime-edited reads"] += 1
            if pe_outcome_is_present(allele_entry.get("Scaffold-incorporated")):
                stats["Scaffold-incorporated reads"] += 1
            if pe_outcome_is_present(allele_entry.get("indel byproducts")):
                stats["Indel byproduct reads"] += 1
    elif include_wildtype:
        stats["Wildtype reads"] += 1

    if not include_breakdown:
        return
    if "INS" in kinds:
        stats["Reads with insertion"] += 1
    if "DEL" in kinds:
        stats["Reads with deletion"] += 1
    if "SNP" in kinds:
        stats["Reads with substitution"] += 1
    if outside_signatures:
        stats["Reads with outside-window variation"] += 1
        stats["Outside-window event observations"] += len(outside_signatures)


def init_prime_outcome_sets(stats):
    stats["_modified_qnames"] = set()
    stats["_prime_edited_qnames"] = set()
    stats["_scaffold_qnames"] = set()
    stats["_indel_byproduct_qnames"] = set()
    stats["_pe_precise_only_plot_qnames"] = set()
    stats["_pe_scaffold_plot_qnames"] = set()
    stats["_pe_byproduct_plot_qnames"] = set()


def update_prime_outcome_sets(stats, allele_entry):
    qname = allele_entry.get("qname")
    if qname is None:
        qname = id(allele_entry)
    if allele_entry.get("read_status") == "Modified":
        stats.setdefault("_modified_qnames", set()).add(qname)
    if pe_outcome_is_present(allele_entry.get("prime-edited")):
        stats.setdefault("_prime_edited_qnames", set()).add(qname)
    if pe_outcome_is_present(allele_entry.get("Scaffold-incorporated")):
        stats.setdefault("_scaffold_qnames", set()).add(qname)
    if pe_outcome_is_present(allele_entry.get("indel byproducts")):
        stats.setdefault("_indel_byproduct_qnames", set()).add(qname)
    bucket = prime_editor_plot_bucket(allele_entry)
    if bucket == "precise":
        stats.setdefault("_pe_precise_only_plot_qnames", set()).add(qname)
    elif bucket == "scaffold":
        stats.setdefault("_pe_scaffold_plot_qnames", set()).add(qname)
    elif bucket == "byproduct":
        stats.setdefault("_pe_byproduct_plot_qnames", set()).add(qname)


def finalize_prime_outcome_stats(stats, denominator=None, support_label=None):
    modified = set(stats.get("_modified_qnames", set()))
    prime = set(stats.get("_prime_edited_qnames", set()))
    scaffold = set(stats.get("_scaffold_qnames", set()))
    byproduct = set(stats.get("_indel_byproduct_qnames", set()))
    precise_only_plot = set(stats.get("_pe_precise_only_plot_qnames", set()))
    scaffold_plot = set(stats.get("_pe_scaffold_plot_qnames", set()))
    byproduct_plot = set(stats.get("_pe_byproduct_plot_qnames", set()))
    any_pe = prime | scaffold | byproduct

    stats["Modified reads"] = len(modified)
    stats["Prime-edited reads"] = len(prime)
    stats["Scaffold-incorporated reads"] = len(scaffold)
    stats["Indel byproduct reads"] = len(byproduct)
    stats["PE modified outcome reads"] = len(any_pe)
    stats["PE precise-only reads"] = len(precise_only_plot)
    stats["PE scaffold plot reads"] = len(scaffold_plot)
    stats["PE byproduct plot reads"] = len(byproduct_plot)
    if support_label is not None:
        stats["Editing frequency support"] = support_label

    if denominator and denominator > 0:
        stats["Editing frequency"] = len(modified) / denominator * 100.0
        stats["Prime editing efficiency"] = len(any_pe) / denominator * 100.0
    else:
        stats["Editing frequency"] = "NA"
        stats["Prime editing efficiency"] = "NA"

    if any_pe:
        stats["Prime editing precision"] = len(prime) / len(any_pe) * 100.0
        stats["Scaffold incorporation rate"] = len(scaffold) / len(any_pe) * 100.0
        stats["Indel byproduct rate"] = len(byproduct) / len(any_pe) * 100.0
        stats["Scaffold residual rate"] = stats["Scaffold incorporation rate"]
    else:
        stats["Prime editing precision"] = "NA"
        stats["Scaffold incorporation rate"] = "NA"
        stats["Indel byproduct rate"] = "NA"
        stats["Scaffold residual rate"] = "NA"


def init_prime_outcome_weights(stats):
    stats["_modified_weight"] = 0
    stats["_prime_edited_weight"] = 0
    stats["_scaffold_weight"] = 0
    stats["_indel_byproduct_weight"] = 0
    stats["_pe_modified_outcome_weight"] = 0
    stats["_pe_precise_only_plot_weight"] = 0
    stats["_pe_scaffold_plot_weight"] = 0
    stats["_pe_byproduct_plot_weight"] = 0


def update_prime_outcome_weights(stats, allele_entry, weight):
    has_prime = pe_outcome_is_present(allele_entry.get("prime-edited"))
    has_scaffold = pe_outcome_is_present(allele_entry.get("Scaffold-incorporated"))
    has_byproduct = pe_outcome_is_present(allele_entry.get("indel byproducts"))
    if allele_entry.get("read_status") == "Modified":
        stats["_modified_weight"] = stats.get("_modified_weight", 0) + weight
    if has_prime:
        stats["_prime_edited_weight"] = stats.get("_prime_edited_weight", 0) + weight
    if has_scaffold:
        stats["_scaffold_weight"] = stats.get("_scaffold_weight", 0) + weight
    if has_byproduct:
        stats["_indel_byproduct_weight"] = stats.get("_indel_byproduct_weight", 0) + weight
    if has_prime or has_scaffold or has_byproduct:
        stats["_pe_modified_outcome_weight"] = stats.get("_pe_modified_outcome_weight", 0) + weight
    bucket = prime_editor_plot_bucket(allele_entry)
    if bucket == "precise":
        stats["_pe_precise_only_plot_weight"] = stats.get("_pe_precise_only_plot_weight", 0) + weight
    elif bucket == "scaffold":
        stats["_pe_scaffold_plot_weight"] = stats.get("_pe_scaffold_plot_weight", 0) + weight
    elif bucket == "byproduct":
        stats["_pe_byproduct_plot_weight"] = stats.get("_pe_byproduct_plot_weight", 0) + weight


def finalize_prime_outcome_weight_stats(stats, denominator=None, support_label=None):
    modified = stats.get("_modified_weight", 0)
    prime = stats.get("_prime_edited_weight", 0)
    scaffold = stats.get("_scaffold_weight", 0)
    byproduct = stats.get("_indel_byproduct_weight", 0)
    any_pe = stats.get("_pe_modified_outcome_weight", 0)
    precise_only_plot = stats.get("_pe_precise_only_plot_weight", 0)
    scaffold_plot = stats.get("_pe_scaffold_plot_weight", 0)
    byproduct_plot = stats.get("_pe_byproduct_plot_weight", 0)

    stats["Modified reads"] = modified
    stats["Prime-edited reads"] = prime
    stats["Scaffold-incorporated reads"] = scaffold
    stats["Indel byproduct reads"] = byproduct
    stats["PE modified outcome reads"] = any_pe
    stats["PE precise-only reads"] = precise_only_plot
    stats["PE scaffold plot reads"] = scaffold_plot
    stats["PE byproduct plot reads"] = byproduct_plot
    if support_label is not None:
        stats["Editing frequency support"] = support_label

    if denominator and denominator > 0:
        stats["Editing frequency"] = modified / denominator * 100.0
        stats["Prime editing efficiency"] = any_pe / denominator * 100.0
    else:
        stats["Editing frequency"] = "NA"
        stats["Prime editing efficiency"] = "NA"

    if any_pe:
        stats["Prime editing precision"] = prime / any_pe * 100.0
        stats["Scaffold incorporation rate"] = scaffold / any_pe * 100.0
        stats["Indel byproduct rate"] = byproduct / any_pe * 100.0
        stats["Scaffold residual rate"] = stats["Scaffold incorporation rate"]
    else:
        stats["Prime editing precision"] = "NA"
        stats["Scaffold incorporation rate"] = "NA"
        stats["Indel byproduct rate"] = "NA"
        stats["Scaffold residual rate"] = "NA"


def add_allele_entry_to_counter(allele_counter, allele_entry, sample, reference_record, group_model):
    key = allele_entry["row_key"]
    if key not in allele_counter:
        allele_counter[key] = {
            "Sample": sample,
            "Reference": reference_record["name"],
            "Group": group_model["group_name"],
            "Read status": allele_entry["read_status"],
            "Allele class": allele_entry["allele_class"],
            "Prime-edited": allele_entry.get("prime-edited", "-"),
            "Indel byproducts": allele_entry.get("indel byproducts", "-"),
            "Scaffold-incorporated": allele_entry.get("Scaffold-incorporated", "-"),
            "In-window variation": ";".join(allele_entry["window_signatures"]) if allele_entry["window_signatures"] else "-",
            "Guide window signatures": dict(allele_entry.get("guide_window_signatures", {})),
            "Outside-window variation": ";".join(allele_entry["outside_signatures"]) if allele_entry["outside_signatures"] else "-",
            "Representative sequence": allele_entry["representative_sequence"],
            "_HasSNP": allele_entry["has_snp"],
            "_HasInFrameIndel": allele_entry["has_in_frame_indel"],
            "Reads number": 0,
            "Ratio": "0.00%",
            "Sort": 0,
        }
    allele_counter[key]["Reads number"] += 1


def finalize_allele_rows(allele_counter, total_reads):
    all_rows = []
    for row in allele_counter.values():
        ratio = 0.0 if total_reads == 0 else row["Reads number"] / total_reads * 100.0
        row["Ratio"] = f"{ratio:.2f}%"
        all_rows.append(row)
    all_rows.sort(key=lambda x: x["Reads number"], reverse=True)
    return all_rows


def summarize_assigned_reads(
    reference_record,
    sample,
    assigned_reads,
    ref_ctx,
    group_model,
    min_ratio,
    group_totals,
    group_totals_by_ref=None,
    soft_assigned_reads=None,
    kmer_fallback_reads=None,
    min_genotype_depth=MIN_GENOTYPE_DEPTH,
    low_depth_warning_threshold=LOW_DEPTH_WARNING_THRESHOLD,
    min_aligned_fraction=0.9,
    allele_entry_cache=None,
    cas9_nw_rescue_params=None,
    nw_alignment_cache=None,
):
    """
    V8.6: updated Stats fields with two-tier assignment metrics,
    soft-clip insertion candidates, and deduped edited read counting.
    """
    pair_incomplete_suppressed = sum(
        1 for candidate in assigned_reads
        if not candidate_has_paired_representative_sequence(candidate)
    )
    if pair_incomplete_suppressed:
        assigned_reads = [
            candidate for candidate in assigned_reads
            if candidate_has_paired_representative_sequence(candidate)
        ]
    total_assigned = len(assigned_reads)
    soft_assigned_reads = soft_assigned_reads or []
    kmer_fallback_reads = kmer_fallback_reads or []
    group_totals_by_ref = group_totals_by_ref or {}
    editing_tool = ref_ctx.get("editing_tool", "cas9")
    if (
        nw_alignment_cache is None
        and cas9_nw_rescue_params is not None
        and cas9_nw_rescue_params.get("enabled", False)
    ):
        nw_alignment_cache = {}

    # V8.6 assignment breakdown from group_totals_by_ref
    full_aligned_assigned = group_totals_by_ref.get("full_aligned_assigned", 0)
    relaxed_aligned_assigned = group_totals_by_ref.get("relaxed_aligned_assigned", 0)
    if pair_incomplete_suppressed and full_aligned_assigned + relaxed_aligned_assigned > total_assigned:
        overflow = full_aligned_assigned + relaxed_aligned_assigned - total_assigned
        reduce_relaxed = min(relaxed_aligned_assigned, overflow)
        relaxed_aligned_assigned -= reduce_relaxed
        overflow -= reduce_relaxed
        if overflow:
            full_aligned_assigned = max(0, full_aligned_assigned - overflow)

    # Low aligned-fraction count (stats only)
    low_aligned_fraction_count = 0
    for candidate in assigned_reads:
        raw_seq = candidate.get("raw_sequence", "")
        if raw_seq:
            seq_len = len(raw_seq.replace("|", ""))
            if seq_len > 0:
                aligned_frac = candidate.get("aligned_bases", 0) / seq_len
                if aligned_frac < min_aligned_fraction / 100.0:
                    low_aligned_fraction_count += 1

    # Low raw-identity count (stats only)
    low_raw_identity_count = sum(
        1 for c in assigned_reads
        if c.get("identity", 100) is not None and c.get("identity", 100) < 60.0
    )

    allele_counter = {}
    stats = {
        "Sample": sample,
        "Reference": reference_record["name"],
        "Group": group_model["group_name"],
        "Genotype": "-",
        "Special tag": "-",
        "Editing frequency support": "computed",

        # V8.6: assignment breakdown
        "Full-aligned assigned reads": full_aligned_assigned,
        "Relaxed-aligned assigned reads": relaxed_aligned_assigned,
        "Total assigned reads": full_aligned_assigned + relaxed_aligned_assigned,
        "Relaxed unassigned reads": group_totals.get("relaxed_unassigned", 0),

        # V8.6: identity QC
        "Low outside-window identity reads": group_totals.get("low_outside_window_identity", 0),
        "Insufficient outside-window bases reads": group_totals.get("insufficient_outside_window_bases", 0),
        "Low raw-identity reads": low_raw_identity_count,
        "Low aligned-fraction reads": low_aligned_fraction_count,

        # Editing counts
        "Assigned reads": total_assigned,
        "Soft-assigned reads": len(soft_assigned_reads),
        "Modified reads": 0,
        "Soft-assigned modified reads": 0,
        "Wildtype reads": 0,
        "Prime-edited reads": 0,
        "Scaffold-incorporated reads": 0,
        "Indel byproduct reads": 0,
        "PE modified outcome reads": 0,
        "PE precise-only reads": 0,
        "PE scaffold plot reads": 0,
        "PE byproduct plot reads": 0,
        "Prime editing efficiency": "NA",
        "Prime editing precision": "NA",
        "Scaffold incorporation rate": "NA",
        "Indel byproduct rate": "NA",
        "Scaffold residual rate": "NA",
        "Reads with outside-window variation": 0,
        "Outside-window event observations": 0,
        "Reads with insertion": 0,
        "Reads with deletion": 0,
        "Reads with substitution": 0,

        # V8.6: soft-clip editing
        "Standard window edited reads": 0,
        "Softclip window editing candidate reads": 0,
        "Edited assigned reads": 0,
        "Cas9 NW rescued reads": 0,
        "Cas9 NW rescued deletion reads": 0,
        "Cas9 NW rescued insertion reads": 0,
        "Cas9 NW rejected rescue candidates": 0,

        # V8.6: soft-clip stats
        "Too-short clip observations": group_totals.get("too_short_clip", 0),
        "Low-quality clip observations": group_totals.get("low_quality_clip", 0),
        "PolyG/A clip observations": group_totals.get("poly_clip", 0),
        "Low-complexity clip observations": group_totals.get("low_complexity_clip", 0),
        "Adapter/Bridge clip observations": group_totals.get("adapter_bridge_clip", 0),
        "Window insertion candidate observations": group_totals_by_ref.get("window_insertion_candidate", 0),
        "Outside-window insertion candidate observations": group_totals_by_ref.get("outside_window_insertion_candidate", 0),

        # Legacy (preserved)
        "Ambiguous genotype reads": group_totals.get("ambiguous", 0),
        "Low-identity reads": group_totals.get("low_identity", 0),
        "Low-aligned reads": group_totals.get("low_aligned", 0),
        "Kmer-fallback reads": len(kmer_fallback_reads),
        "Pair-incomplete assigned reads suppressed": pair_incomplete_suppressed,
    }

    # Process with deduped edited read counting
    edited_qnames = set()
    softclip_candidate_qnames = set()
    cas9_nw_rescued_qnames = set()
    cas9_nw_rescued_del_qnames = set()
    cas9_nw_rescued_ins_qnames = set()
    cas9_nw_rejected_qnames = set()
    prime_classification_cache = {} if editing_tool == "prime_editor" else None
    if editing_tool == "prime_editor":
        init_prime_outcome_sets(stats)

    for candidate in assigned_reads:
        candidate_for_entry = candidate
        if cas9_nw_rescue_params is not None:
            candidate_for_entry = apply_cas9_large_indel_nw_rescue(
                candidate,
                reference_record,
                ref_ctx,
                cas9_nw_rescue_params,
                nw_alignment_cache=nw_alignment_cache,
            )
            rescue_status = candidate_for_entry.get("cas9_nw_rescue_status")
            qname_key = candidate_for_entry.get("qname", id(candidate_for_entry))
            if rescue_status == "accepted":
                cas9_nw_rescued_qnames.add(qname_key)
                for event in candidate_for_entry.get("cas9_nw_rescue_events", []):
                    if event.get("kind") == "DEL":
                        cas9_nw_rescued_del_qnames.add(qname_key)
                    elif event.get("kind") == "INS":
                        cas9_nw_rescued_ins_qnames.add(qname_key)
            elif rescue_status == "rejected":
                cas9_nw_rejected_qnames.add(qname_key)

        allele_entry = collect_candidate_allele_entry_cached(
            candidate_for_entry,
            reference_record,
            group_model,
            ref_ctx,
            prime_classification_cache=prime_classification_cache,
            allele_entry_cache=allele_entry_cache,
        )
        update_stats_for_allele_entry(stats, allele_entry)
        if editing_tool == "prime_editor":
            update_prime_outcome_sets(stats, allele_entry)
        add_allele_entry_to_counter(allele_counter, allele_entry, sample, reference_record, group_model)

        if allele_entry["read_status"] == "Modified":
            edited_qnames.add(candidate_for_entry.get("qname", id(candidate_for_entry)))

        if editing_tool != "prime_editor":
            for seg in candidate_for_entry.get("softclip_segments", []):
                if seg.get("softclip_event_class") == "window_insertion_candidate":
                    softclip_candidate_qnames.add(candidate_for_entry.get("qname", id(candidate_for_entry)))
                    break

    stats["Standard window edited reads"] = len(edited_qnames)
    stats["Softclip window editing candidate reads"] = len(softclip_candidate_qnames)
    stats["Edited assigned reads"] = len(edited_qnames)
    stats["Cas9 NW rescued reads"] = len(cas9_nw_rescued_qnames)
    stats["Cas9 NW rescued deletion reads"] = len(cas9_nw_rescued_del_qnames)
    stats["Cas9 NW rescued insertion reads"] = len(cas9_nw_rescued_ins_qnames)
    stats["Cas9 NW rejected rescue candidates"] = len(cas9_nw_rejected_qnames)

    # Soft assignment processing
    soft_allele_counter = deepcopy(allele_counter)
    combined_stats = deepcopy(stats)
    combined_stats["Assigned reads"] = total_assigned + len(soft_assigned_reads)
    combined_stats["Modified reads"] = stats["Modified reads"]
    combined_stats["Wildtype reads"] = stats["Wildtype reads"]

    for candidate in soft_assigned_reads:
        allele_entry = collect_candidate_allele_entry_cached(
            candidate,
            reference_record,
            group_model,
            ref_ctx,
            prime_classification_cache=prime_classification_cache,
            allele_entry_cache=allele_entry_cache,
        )
        update_stats_for_allele_entry(stats, allele_entry, prefix="Soft-assigned ", include_wildtype=False, include_breakdown=False)
        update_stats_for_allele_entry(combined_stats, allele_entry)
        if editing_tool == "prime_editor":
            update_prime_outcome_sets(combined_stats, allele_entry)
        add_allele_entry_to_counter(soft_allele_counter, allele_entry, sample, reference_record, group_model)

    combined_stats["Soft-assigned reads"] = len(soft_assigned_reads)
    combined_stats["Soft-assigned modified reads"] = stats["Soft-assigned modified reads"]

    all_rows = finalize_allele_rows(allele_counter, total_assigned)
    combined_all_rows = finalize_allele_rows(soft_allele_counter, combined_stats["Assigned reads"])

    # Editing frequency using deduped numerator and V8.6 denominator
    v86_denom = full_aligned_assigned + relaxed_aligned_assigned
    editing_frequency_supported, support_label = evaluate_depth_support(
        v86_denom if v86_denom > 0 else total_assigned,
        min_genotype_depth=min_genotype_depth,
        low_depth_warning_threshold=low_depth_warning_threshold,
    )
    if editing_tool == "prime_editor":
        if editing_frequency_supported:
            finalize_prime_outcome_stats(stats, v86_denom if v86_denom > 0 else total_assigned, support_label)
        else:
            finalize_prime_outcome_stats(stats, None, support_label)
    elif editing_frequency_supported and v86_denom > 0:
        stats["Editing frequency"] = stats["Edited assigned reads"] / v86_denom * 100.0
        stats["Editing frequency support"] = support_label
    else:
        stats["Editing frequency"] = "NA"
        stats["Editing frequency support"] = support_label

    combined_total = combined_stats["Assigned reads"]
    if combined_total > 0:
        stats["Editing frequency with soft assignment"] = (
            (stats["Modified reads"] + stats["Soft-assigned modified reads"]) / combined_total * 100.0
        )
    else:
        stats["Editing frequency with soft assignment"] = "NA"

    display_rows = filter_display_rows(all_rows, total_assigned, min_ratio)
    combined_display_rows = filter_display_rows(combined_all_rows, combined_total, min_ratio)
    genotype = determine_sample_genotype(display_rows, total_assigned, min_ratio)
    combined_supported, combined_support_label = evaluate_depth_support(
        combined_total,
        min_genotype_depth=min_genotype_depth,
        low_depth_warning_threshold=low_depth_warning_threshold,
    )
    if editing_tool == "prime_editor":
        if combined_supported:
            finalize_prime_outcome_stats(combined_stats, combined_total, combined_support_label)
        else:
            finalize_prime_outcome_stats(combined_stats, None, combined_support_label)
    elif combined_supported:
        combined_stats["Editing frequency"] = combined_stats["Modified reads"] / combined_total * 100.0
        combined_stats["Editing frequency support"] = combined_support_label
    else:
        combined_stats["Editing frequency"] = "NA"
        combined_stats["Editing frequency support"] = combined_support_label
    combined_stats["Editing frequency with soft assignment"] = combined_stats["Editing frequency"]
    combined_genotype = determine_sample_genotype(combined_display_rows, combined_total, min_ratio)
    special_tag = determine_special_tag(editing_tool, stats)
    combined_special_tag = determine_special_tag(editing_tool, combined_stats)
    if editing_tool == "prime_editor":
        genotype_display = genotype
        combined_genotype_display = combined_genotype
    else:
        genotype_display = decorate_genotype_label(genotype, display_rows)
        combined_genotype_display = decorate_genotype_label(combined_genotype, combined_display_rows)
    stats["Genotype"] = genotype
    stats["Special tag"] = special_tag
    combined_stats["Genotype"] = combined_genotype
    combined_stats["Special tag"] = combined_special_tag
    for row in all_rows:
        row["Genotype"] = genotype
        row["Special tag"] = special_tag
    for row in combined_all_rows:
        row["Genotype"] = combined_genotype
        row["Special tag"] = combined_special_tag
    return {
        "stats": stats,
        "combined_stats": combined_stats,
        "display_rows": display_rows,
        "combined_display_rows": combined_display_rows,
        "all_rows": all_rows,
        "combined_all_rows": combined_all_rows,
        "genotype_display": genotype_display,
        "combined_genotype_display": combined_genotype_display,
    }


def update_stats_for_weighted_allele_entry(stats, allele_entry, weight, prefix="", include_wildtype=True, include_breakdown=True):
    read_status = allele_entry["read_status"]
    allele_class = allele_entry["allele_class"]
    kinds = allele_entry["kinds"]
    outside_signatures = allele_entry["outside_signatures"]

    if read_status == "Modified":
        modified_key = f"{prefix}Modified reads" if not prefix else f"{prefix}modified reads"
        stats[modified_key] += weight
        if pe_outcome_is_present(allele_entry.get("prime-edited")):
            stats["Prime-edited reads"] += weight
        if pe_outcome_is_present(allele_entry.get("Scaffold-incorporated")):
            stats["Scaffold-incorporated reads"] += weight
        if pe_outcome_is_present(allele_entry.get("indel byproducts")):
            stats["Indel byproduct reads"] += weight
    elif include_wildtype:
        stats["Wildtype reads"] += weight

    if not include_breakdown:
        return
    if "INS" in kinds:
        stats["Reads with insertion"] += weight
    if "DEL" in kinds:
        stats["Reads with deletion"] += weight
    if "SNP" in kinds:
        stats["Reads with substitution"] += weight
    if outside_signatures:
        stats["Reads with outside-window variation"] += weight
        stats["Outside-window event observations"] += len(outside_signatures) * weight


def add_weighted_allele_entry_to_counter(allele_counter, allele_entry, sample, reference_record, group_model, weight):
    key = allele_entry["row_key"]
    if key not in allele_counter:
        allele_counter[key] = {
            "Sample": sample,
            "Reference": reference_record["name"],
            "Group": group_model["group_name"],
            "Read status": allele_entry["read_status"],
            "Allele class": allele_entry["allele_class"],
            "Prime-edited": allele_entry.get("prime-edited", "-"),
            "Indel byproducts": allele_entry.get("indel byproducts", "-"),
            "Scaffold-incorporated": allele_entry.get("Scaffold-incorporated", "-"),
            "In-window variation": ";".join(allele_entry["window_signatures"]) if allele_entry["window_signatures"] else "-",
            "Guide window signatures": dict(allele_entry.get("guide_window_signatures", {})),
            "Outside-window variation": ";".join(allele_entry["outside_signatures"]) if allele_entry["outside_signatures"] else "-",
            "Representative sequence": allele_entry["representative_sequence"],
            "_HasSNP": allele_entry["has_snp"],
            "_HasInFrameIndel": allele_entry["has_in_frame_indel"],
            "Reads number": 0,
            "Ratio": "0.00%",
            "Sort": 0,
        }
    allele_counter[key]["Reads number"] += weight


def summarize_weighted_assigned_reads(
    reference_record,
    sample,
    assigned_entries,
    ref_ctx,
    group_model,
    min_ratio,
    group_totals,
    group_totals_by_ref=None,
    soft_assigned_entries=None,
    kmer_fallback_entries=None,
    min_genotype_depth=MIN_GENOTYPE_DEPTH,
    low_depth_warning_threshold=LOW_DEPTH_WARNING_THRESHOLD,
    min_aligned_fraction=0.9,
):
    """
    V8.6: same Stats contract as summarize_assigned_reads, for Hi-TOM import mode.
    """
    soft_assigned_entries = soft_assigned_entries or []
    kmer_fallback_entries = kmer_fallback_entries or []
    group_totals_by_ref = group_totals_by_ref or {}
    total_assigned = sum(weight for _, weight in assigned_entries)
    soft_total = sum(weight for _, weight in soft_assigned_entries)
    editing_tool = ref_ctx.get("editing_tool", "cas9")

    full_aligned_assigned = group_totals_by_ref.get("full_aligned_assigned", 0)
    relaxed_aligned_assigned = group_totals_by_ref.get("relaxed_aligned_assigned", 0)

    low_aligned_fraction_count = 0
    for candidate, _ in assigned_entries:
        raw_seq = candidate.get("raw_sequence", "")
        if raw_seq:
            seq_len = len(raw_seq.replace("|", ""))
            if seq_len > 0:
                aligned_frac = candidate.get("aligned_bases", 0) / seq_len
                if aligned_frac < min_aligned_fraction / 100.0:
                    low_aligned_fraction_count += 1

    low_raw_identity_count = sum(
        1 for c, _ in assigned_entries
        if c.get("identity", 100) is not None and c.get("identity", 100) < 60.0
    )

    allele_counter = {}
    stats = {
        "Sample": sample,
        "Reference": reference_record["name"],
        "Group": group_model["group_name"],
        "Genotype": "-",
        "Special tag": "-",
        "Editing frequency support": "computed",

        "Full-aligned assigned reads": full_aligned_assigned,
        "Relaxed-aligned assigned reads": relaxed_aligned_assigned,
        "Total assigned reads": full_aligned_assigned + relaxed_aligned_assigned,
        "Relaxed unassigned reads": group_totals.get("relaxed_unassigned", 0),

        "Low outside-window identity reads": group_totals.get("low_outside_window_identity", 0),
        "Insufficient outside-window bases reads": group_totals.get("insufficient_outside_window_bases", 0),
        "Low raw-identity reads": low_raw_identity_count,
        "Low aligned-fraction reads": low_aligned_fraction_count,

        "Assigned reads": total_assigned,
        "Soft-assigned reads": soft_total,
        "Soft-assigned modified reads": 0,
        "Modified reads": 0,
        "Wildtype reads": 0,
        "Prime-edited reads": 0,
        "Scaffold-incorporated reads": 0,
        "Indel byproduct reads": 0,
        "PE modified outcome reads": 0,
        "PE precise-only reads": 0,
        "PE scaffold plot reads": 0,
        "PE byproduct plot reads": 0,
        "Prime editing efficiency": "NA",
        "Prime editing precision": "NA",
        "Scaffold incorporation rate": "NA",
        "Indel byproduct rate": "NA",
        "Scaffold residual rate": "NA",
        "Reads with outside-window variation": 0,
        "Outside-window event observations": 0,
        "Reads with insertion": 0,
        "Reads with deletion": 0,
        "Reads with substitution": 0,

        "Standard window edited reads": 0,
        "Softclip window editing candidate reads": 0,
        "Edited assigned reads": 0,

        "Too-short clip observations": group_totals.get("too_short_clip", 0),
        "Low-quality clip observations": group_totals.get("low_quality_clip", 0),
        "PolyG/A clip observations": group_totals.get("poly_clip", 0),
        "Low-complexity clip observations": group_totals.get("low_complexity_clip", 0),
        "Adapter/Bridge clip observations": group_totals.get("adapter_bridge_clip", 0),
        "Window insertion candidate observations": group_totals_by_ref.get("window_insertion_candidate", 0),
        "Outside-window insertion candidate observations": group_totals_by_ref.get("outside_window_insertion_candidate", 0),

        "Ambiguous genotype reads": group_totals.get("ambiguous", 0),
        "Low-identity reads": group_totals.get("low_identity", 0),
        "Low-aligned reads": group_totals.get("low_aligned", 0),
        "Kmer-fallback reads": len(kmer_fallback_entries),
    }

    edited_weight = 0
    softclip_candidate_weight = 0
    prime_classification_cache = {} if editing_tool == "prime_editor" else None
    if editing_tool == "prime_editor":
        init_prime_outcome_weights(stats)

    for candidate, weight in assigned_entries:
        allele_entry = collect_candidate_allele_entry(
            candidate,
            reference_record,
            group_model,
            ref_ctx,
            prime_classification_cache=prime_classification_cache,
        )
        update_stats_for_weighted_allele_entry(stats, allele_entry, weight)
        if editing_tool == "prime_editor":
            update_prime_outcome_weights(stats, allele_entry, weight)
        add_weighted_allele_entry_to_counter(allele_counter, allele_entry, sample, reference_record, group_model, weight)

        if allele_entry["read_status"] == "Modified":
            edited_weight += weight

        if editing_tool != "prime_editor":
            for seg in candidate.get("softclip_segments", []):
                if seg.get("softclip_event_class") == "window_insertion_candidate":
                    softclip_candidate_weight += weight
                    break

    stats["Standard window edited reads"] = edited_weight
    stats["Softclip window editing candidate reads"] = softclip_candidate_weight
    stats["Edited assigned reads"] = edited_weight

    soft_allele_counter = deepcopy(allele_counter)
    combined_stats = deepcopy(stats)
    combined_stats["Assigned reads"] = total_assigned + soft_total
    combined_stats["Modified reads"] = stats["Modified reads"]
    combined_stats["Wildtype reads"] = stats["Wildtype reads"]

    for candidate, weight in soft_assigned_entries:
        allele_entry = collect_candidate_allele_entry(
            candidate,
            reference_record,
            group_model,
            ref_ctx,
            prime_classification_cache=prime_classification_cache,
        )
        update_stats_for_weighted_allele_entry(stats, allele_entry, weight, prefix="Soft-assigned ", include_wildtype=False, include_breakdown=False)
        update_stats_for_weighted_allele_entry(combined_stats, allele_entry, weight)
        if editing_tool == "prime_editor":
            update_prime_outcome_weights(combined_stats, allele_entry, weight)
        add_weighted_allele_entry_to_counter(soft_allele_counter, allele_entry, sample, reference_record, group_model, weight)

    combined_stats["Soft-assigned reads"] = soft_total
    combined_stats["Soft-assigned modified reads"] = stats["Soft-assigned modified reads"]

    all_rows = finalize_allele_rows(allele_counter, total_assigned)
    combined_all_rows = finalize_allele_rows(soft_allele_counter, combined_stats["Assigned reads"])

    v86_denom = full_aligned_assigned + relaxed_aligned_assigned
    editing_frequency_supported, support_label = evaluate_depth_support(
        v86_denom if v86_denom > 0 else total_assigned,
        min_genotype_depth=min_genotype_depth,
        low_depth_warning_threshold=low_depth_warning_threshold,
    )
    if editing_tool == "prime_editor":
        if editing_frequency_supported:
            finalize_prime_outcome_weight_stats(stats, v86_denom if v86_denom > 0 else total_assigned, support_label)
        else:
            finalize_prime_outcome_weight_stats(stats, None, support_label)
    elif editing_frequency_supported and v86_denom > 0:
        stats["Editing frequency"] = stats["Edited assigned reads"] / v86_denom * 100.0
        stats["Editing frequency support"] = support_label
    else:
        stats["Editing frequency"] = "NA"
        stats["Editing frequency support"] = support_label

    combined_total = combined_stats["Assigned reads"]
    if combined_total > 0:
        stats["Editing frequency with soft assignment"] = (
            (stats["Modified reads"] + stats["Soft-assigned modified reads"]) / combined_total * 100.0
        )
    else:
        stats["Editing frequency with soft assignment"] = "NA"

    display_rows = filter_display_rows(all_rows, total_assigned, min_ratio)
    combined_display_rows = filter_display_rows(combined_all_rows, combined_total, min_ratio)
    genotype = determine_sample_genotype(display_rows, total_assigned, min_ratio)
    combined_supported, combined_support_label = evaluate_depth_support(
        combined_total,
        min_genotype_depth=min_genotype_depth,
        low_depth_warning_threshold=low_depth_warning_threshold,
    )
    if editing_tool == "prime_editor":
        if combined_supported:
            finalize_prime_outcome_weight_stats(combined_stats, combined_total, combined_support_label)
        else:
            finalize_prime_outcome_weight_stats(combined_stats, None, combined_support_label)
    elif combined_supported:
        combined_stats["Editing frequency"] = combined_stats["Modified reads"] / combined_total * 100.0
        combined_stats["Editing frequency support"] = combined_support_label
    else:
        combined_stats["Editing frequency"] = "NA"
        combined_stats["Editing frequency support"] = combined_support_label
    combined_stats["Editing frequency with soft assignment"] = combined_stats["Editing frequency"]
    combined_genotype = determine_sample_genotype(combined_display_rows, combined_total, min_ratio)
    special_tag = determine_special_tag(editing_tool, stats)
    combined_special_tag = determine_special_tag(editing_tool, combined_stats)
    if editing_tool == "prime_editor":
        genotype_display = genotype
        combined_genotype_display = combined_genotype
    else:
        genotype_display = decorate_genotype_label(genotype, display_rows)
        combined_genotype_display = decorate_genotype_label(combined_genotype, combined_display_rows)
    stats["Genotype"] = genotype
    stats["Special tag"] = special_tag
    combined_stats["Genotype"] = combined_genotype
    combined_stats["Special tag"] = combined_special_tag
    for row in all_rows:
        row["Genotype"] = genotype
        row["Special tag"] = special_tag
    for row in combined_all_rows:
        row["Genotype"] = combined_genotype
        row["Special tag"] = combined_special_tag
    return {
        "stats": stats,
        "combined_stats": combined_stats,
        "display_rows": display_rows,
        "combined_display_rows": combined_display_rows,
        "all_rows": all_rows,
        "combined_all_rows": combined_all_rows,
        "genotype_display": genotype_display,
        "combined_genotype_display": combined_genotype_display,
    }


def summarize_hitom_group_for_sample(
    group_model,
    reference_records_by_name,
    sample,
    hitom_rows,
    ref_contexts,
    min_identity_score,
    min_ratio,
    min_genotype_depth=MIN_GENOTYPE_DEPTH,
    low_depth_warning_threshold=LOW_DEPTH_WARNING_THRESHOLD,
    min_aligned_fraction=0.9,
):
    assigned_by_ref = defaultdict(list)
    soft_assigned_by_ref = defaultdict(list)
    kmer_fallback_by_ref = defaultdict(list)
    group_totals = {
        "ambiguous": 0, "low_identity": 0, "accepted": 0,
        "kmer_fallback": 0, "seed_assigned": 0, "low_aligned": 0,
        "full_aligned_assigned": 0, "relaxed_aligned_assigned": 0,
        "relaxed_unassigned": 0,
        "low_outside_window_identity": 0, "insufficient_outside_window_bases": 0,
        "too_short_clip": 0, "low_quality_clip": 0, "poly_clip": 0,
        "low_complexity_clip": 0, "adapter_bridge_clip": 0,
        "window_insertion_candidate": 0, "outside_window_insertion_candidate": 0,
    }
    group_totals_by_ref = defaultdict(lambda: {
        "full_aligned_assigned": 0, "relaxed_aligned_assigned": 0,
        "window_insertion_candidate": 0, "outside_window_insertion_candidate": 0,
        "low_quality_clip": 0, "poly_clip": 0,
        "low_complexity_clip": 0, "adapter_bridge_clip": 0,
    })

    for row in hitom_rows:
        weight = row["Reads number"]
        candidates = {}
        for ref_name in group_model["reference_names"]:
            ref_record = reference_records_by_name[ref_name]
            ref_ctx = ref_contexts[ref_name]
            candidate = build_candidate_from_hitom_sequences(
                row["Left reads seq"], row["Right reads seq"], ref_record, ref_ctx
            )
            if candidate is not None:
                candidates[ref_name] = candidate

        passing = {}
        lowest_outside_id = None
        has_insufficient = False
        for ref_name, candidate in candidates.items():
            outside_id = candidate.get("outside_window_identity")
            outside_id_available = candidate.get("outside_window_identity_available", False)
            if not outside_id_available or outside_id is None:
                has_insufficient = True
                continue
            if outside_id < min_identity_score:
                if lowest_outside_id is None or outside_id < lowest_outside_id:
                    lowest_outside_id = outside_id
                continue
            passing[ref_name] = candidate
        if not passing:
            if has_insufficient and lowest_outside_id is None:
                group_totals["insufficient_outside_window_bases"] += weight
            else:
                group_totals["low_outside_window_identity"] += weight
            continue

        chosen_ref, method = choose_best_reference(passing, group_model)
        if method in ("SAFE_TAG_HARD", "VARIANT_TAG_HARD"):
            assigned_by_ref[chosen_ref].append((passing[chosen_ref], weight))
            group_totals["accepted"] += weight
            group_totals["full_aligned_assigned"] += weight
            group_totals_by_ref[chosen_ref]["full_aligned_assigned"] += weight
        elif method == "SAFE_TAG_SOFT":
            soft_assigned_by_ref[chosen_ref].append((passing[chosen_ref], weight))
        elif method == "KMER_FALLBACK":
            kmer_fallback_by_ref[chosen_ref].append((passing[chosen_ref], weight))
            group_totals["kmer_fallback"] += weight
            group_totals["full_aligned_assigned"] += weight
            group_totals_by_ref[chosen_ref]["full_aligned_assigned"] += weight
        else:
            group_totals["ambiguous"] += weight
            soft_choice = choose_soft_reference(passing, group_model)
            if high_confidence_soft_choice(soft_choice):
                chosen_ref = soft_choice["reference_name"]
                assigned_by_ref[chosen_ref].append((passing[chosen_ref], weight))
                group_totals["accepted"] += weight
                group_totals["full_aligned_assigned"] += weight
                group_totals_by_ref[chosen_ref]["full_aligned_assigned"] += weight
            else:
                if soft_choice is not None:
                    soft_assigned_by_ref[soft_choice["reference_name"]].append((passing[soft_choice["reference_name"]], weight))

    summarized = {}
    for ref_name in group_model["reference_names"]:
        summarized[ref_name] = summarize_weighted_assigned_reads(
            reference_record=reference_records_by_name[ref_name],
            sample=sample,
            assigned_entries=assigned_by_ref.get(ref_name, []),
            ref_ctx=ref_contexts[ref_name],
            group_model=group_model,
            min_ratio=min_ratio,
            group_totals=group_totals,
            group_totals_by_ref=group_totals_by_ref.get(ref_name, {}),
            soft_assigned_entries=soft_assigned_by_ref.get(ref_name, []),
            kmer_fallback_entries=kmer_fallback_by_ref.get(ref_name, []),
            min_genotype_depth=min_genotype_depth,
            low_depth_warning_threshold=low_depth_warning_threshold,
            min_aligned_fraction=min_aligned_fraction,
        )
    return summarized


def summarize_hitom_table(
    reference_records,
    hitom_rows_by_sample,
    run_root,
    min_ratio,
    analysis_context,
    min_identity_score,
    min_aligned_fraction=0.9,
    min_genotype_depth=MIN_GENOTYPE_DEPTH,
    low_depth_warning_threshold=LOW_DEPTH_WARNING_THRESHOLD,
):
    reference_records_by_name = {ref["name"]: ref for ref in reference_records}
    sample_names = sorted(hitom_rows_by_sample, key=hitom_sample_sort_key)
    results_by_reference = {}
    for ref in reference_records:
        group_name = analysis_context["ref_contexts"][ref["name"]]["group_name"]
        results_by_reference[ref["name"]] = {
            "reference": ref,
            "group_model": analysis_context["group_models"][group_name],
            "samples": {},
        }

    for group_name, group_model in analysis_context["group_models"].items():
        for sample in sample_names:
            sample_summary = summarize_hitom_group_for_sample(
                group_model=group_model,
                reference_records_by_name=reference_records_by_name,
                sample=sample,
                hitom_rows=hitom_rows_by_sample.get(sample, []),
                ref_contexts=analysis_context["ref_contexts"],
                min_identity_score=min_identity_score,
                min_aligned_fraction=min_aligned_fraction,
                min_ratio=min_ratio,
                min_genotype_depth=min_genotype_depth,
                low_depth_warning_threshold=low_depth_warning_threshold,
            )
            for ref_name, ref_summary in sample_summary.items():
                results_by_reference[ref_name]["samples"][sample] = ref_summary

    manifest_dir = os.path.join(run_root, "hitom_import")
    os.makedirs(manifest_dir, exist_ok=True)
    with open(os.path.join(manifest_dir, "hitom_input_rows_by_sample.tsv"), "w", encoding="utf-8") as handle:
        handle.write("Sample\tAllele rows\tInput reads represented\n")
        for sample in sample_names:
            rows = hitom_rows_by_sample.get(sample, [])
            handle.write(f"{sample}\t{len(rows)}\t{sum(row['Reads number'] for row in rows)}\n")

    return {"references": results_by_reference, "sample_names": sample_names, "analysis_context": analysis_context}


def summarize_group_for_sample(
    group_model,
    reference_records_by_name,
    sample,
    run_root,
    mode,
    ref_contexts,
    min_identity_score,
    min_aligned_fraction=0.9,
    min_ratio=None,
    min_genotype_depth=MIN_GENOTYPE_DEPTH,
    low_depth_warning_threshold=LOW_DEPTH_WARNING_THRESHOLD,
    cas9_nw_rescue_params=None,
):
    """
    V10: qname-level decision ledger assignment.

    All BWA-passing candidates are first aggregated by qname. The ledger then
    determines one final assignment tier per qname; editing classifiers only
    run after this assignment decision.
    """
    candidates_by_qname, pair_qc = load_group_candidates_for_sample(
        group_model=group_model,
        reference_records_by_name=reference_records_by_name,
        sample=sample,
        run_root=run_root,
        mode=mode,
        ref_contexts=ref_contexts,
        return_pair_qc=True,
    )

    group_totals = {
        "ambiguous": 0, "low_identity": 0, "accepted": 0,
        "kmer_fallback": 0, "seed_assigned": 0, "low_aligned": 0,
        "full_aligned_assigned": 0, "relaxed_aligned_assigned": 0,
        "relaxed_unassigned": 0,
        "low_outside_window_identity": 0, "insufficient_outside_window_bases": 0,
        "too_short_clip": 0, "low_quality_clip": 0, "poly_clip": 0,
        "low_complexity_clip": 0, "adapter_bridge_clip": 0,
        "window_insertion_candidate": 0, "outside_window_insertion_candidate": 0,
    }
    hard_totals_by_ref = defaultdict(lambda: {
        "full_aligned_assigned": 0, "relaxed_aligned_assigned": 0,
        "window_insertion_candidate": 0, "outside_window_insertion_candidate": 0,
    })
    hard_plus_rescued_totals_by_ref = defaultdict(lambda: {
        "full_aligned_assigned": 0, "relaxed_aligned_assigned": 0,
        "window_insertion_candidate": 0, "outside_window_insertion_candidate": 0,
    })
    softclip_match_cache = {}
    decisions = []

    for qname, ref_candidates in candidates_by_qname.items():
        for ref_name, candidate in ref_candidates.items():
            ref_ctx2 = ref_contexts.get(ref_name, {})
            if ref_ctx2.get("editing_tool", "cas9") == "prime_editor":
                continue
            softclip_segments = candidate.get("softclip_segments", [])
            if softclip_segments:
                filter_counts = filter_softclip_segments(
                    softclip_segments,
                    match_cache=softclip_match_cache,
                )
                _accumulate_clip_counts(group_totals, filter_counts)
                win_pos = ref_ctx2.get("window_positions", set())
                classify_counts = classify_softclip_segments(softclip_segments, win_pos)
                group_totals["window_insertion_candidate"] += classify_counts["window_insertion_candidate"]
                group_totals["outside_window_insertion_candidate"] += classify_counts["outside_window_insertion_candidate"]

        decision = build_qname_assignment_decision(
            sample=sample,
            group_model=group_model,
            qname=qname,
            candidate_by_ref=ref_candidates,
            ref_contexts=ref_contexts,
            mode=mode,
            min_identity_score=min_identity_score,
        )
        decisions.append(compact_composite_decision_details(decision))

    partitions = partition_assignment_decisions_by_ref(decisions)
    qc = partitions["qc"]
    ledger_bwa_qnames = int(qc.get("BWA qnames", 0) or 0)
    pair_bwa_qnames = int(pair_qc.get("BWA qnames", ledger_bwa_qnames) or 0)
    dropped_no_pair = min(
        int(pair_qc.get("dropped_no_strict_pair_candidate", 0) or 0),
        max(0, pair_bwa_qnames - ledger_bwa_qnames),
    )
    for key, value in pair_qc.items():
        qc[key] = value
    qc["BWA qnames"] = pair_bwa_qnames
    if dropped_no_pair:
        qc["unassigned after BWA"] += dropped_no_pair
        qc[UNASSIGNED_MATE_DISCORDANCE] += dropped_no_pair
    group_totals["accepted"] = qc["hard_plus_rescued assigned"]
    group_totals["full_aligned_assigned"] = qc["hard assigned"]
    group_totals["relaxed_aligned_assigned"] = qc["rescued assigned"]
    group_totals["relaxed_unassigned"] = qc["unassigned after BWA"]
    group_totals["low_outside_window_identity"] = qc[UNASSIGNED_LOW_OUTSIDE_IDENTITY]
    group_totals["insufficient_outside_window_bases"] = qc[UNASSIGNED_INSUFFICIENT_OUTSIDE_BASES]
    group_totals["ambiguous"] = (
        qc[UNASSIGNED_TRUE_CONFLICT]
        + qc[UNASSIGNED_MATE_DISCORDANCE]
        + qc[UNASSIGNED_TIE_OR_LOW_MARGIN]
        + qc[UNASSIGNED_NO_INFORMATIVE_TAG]
    )

    for ref_name, candidates in partitions["hard_by_ref"].items():
        hard_totals_by_ref[ref_name]["full_aligned_assigned"] = len(candidates)
        for candidate in candidates:
            _track_ref_clip_candidates(candidate, hard_totals_by_ref[ref_name])
    for ref_name, candidates in partitions["rescued_by_ref"].items():
        hard_plus_rescued_totals_by_ref[ref_name]["relaxed_aligned_assigned"] = len(candidates)
    for ref_name, candidates in partitions["hard_by_ref"].items():
        hard_plus_rescued_totals_by_ref[ref_name]["full_aligned_assigned"] = len(candidates)
        for candidate in partitions["hard_plus_rescued_by_ref"].get(ref_name, []):
            _track_ref_clip_candidates(candidate, hard_plus_rescued_totals_by_ref[ref_name])

    assignment_qc_row = {
        "sample": sample,
        "group": group_model.get("group_name", ""),
        **qc,
    }

    summarized = {}
    for ref_name in group_model["reference_names"]:
        allele_entry_cache = {}
        nw_alignment_cache = (
            {} if cas9_nw_rescue_params is not None and cas9_nw_rescue_params.get("enabled", False) else None
        )
        hard_result = summarize_assigned_reads(
            reference_record=reference_records_by_name[ref_name],
            sample=sample,
            assigned_reads=partitions["hard_by_ref"].get(ref_name, []),
            ref_ctx=ref_contexts[ref_name],
            group_model=group_model,
            min_ratio=min_ratio,
            group_totals=group_totals,
            group_totals_by_ref=hard_totals_by_ref.get(ref_name, {}),
            soft_assigned_reads=[],
            kmer_fallback_reads=[],
            min_genotype_depth=min_genotype_depth,
            low_depth_warning_threshold=low_depth_warning_threshold,
            min_aligned_fraction=min_aligned_fraction,
            allele_entry_cache=allele_entry_cache,
            cas9_nw_rescue_params=cas9_nw_rescue_params,
            nw_alignment_cache=nw_alignment_cache,
        )
        hard_plus_rescued_result = summarize_assigned_reads(
            reference_record=reference_records_by_name[ref_name],
            sample=sample,
            assigned_reads=partitions["hard_plus_rescued_by_ref"].get(ref_name, []),
            ref_ctx=ref_contexts[ref_name],
            group_model=group_model,
            min_ratio=min_ratio,
            group_totals=group_totals,
            group_totals_by_ref=hard_plus_rescued_totals_by_ref.get(ref_name, {}),
            soft_assigned_reads=[],
            kmer_fallback_reads=[],
            min_genotype_depth=min_genotype_depth,
            low_depth_warning_threshold=low_depth_warning_threshold,
            min_aligned_fraction=min_aligned_fraction,
            allele_entry_cache=allele_entry_cache,
            cas9_nw_rescue_params=cas9_nw_rescue_params,
            nw_alignment_cache=nw_alignment_cache,
        )
        annotate_v10_assignment_stats(
            hard_result["stats"],
            qc,
            hard_count=len(partitions["hard_by_ref"].get(ref_name, [])),
            rescued_count=len(partitions["rescued_by_ref"].get(ref_name, [])),
            include_rescued_in_assigned=False,
        )
        annotate_v10_assignment_stats(
            hard_plus_rescued_result["stats"],
            qc,
            hard_count=len(partitions["hard_by_ref"].get(ref_name, [])),
            rescued_count=len(partitions["rescued_by_ref"].get(ref_name, [])),
            include_rescued_in_assigned=True,
        )
        hard_result["combined_stats"] = hard_plus_rescued_result["stats"]
        hard_result["combined_display_rows"] = hard_plus_rescued_result["display_rows"]
        hard_result["combined_all_rows"] = hard_plus_rescued_result["all_rows"]
        hard_result["combined_genotype_display"] = hard_plus_rescued_result["genotype_display"]
        hard_result["hard_plus_rescued_stats"] = hard_plus_rescued_result["stats"]
        hard_result["hard_plus_rescued_display_rows"] = hard_plus_rescued_result["display_rows"]
        hard_result["hard_plus_rescued_all_rows"] = hard_plus_rescued_result["all_rows"]
        hard_result["assignment_rescue_qc"] = assignment_qc_row
        summarized[ref_name] = hard_result
    return summarized


def _accumulate_clip_counts(group_totals, filter_counts):
    """Accumulate filter_softclip_segments counts into group_totals."""
    for key in ("too_short_clip", "low_quality_clip", "poly_clip",
                "low_complexity_clip", "adapter_bridge_clip"):
        group_totals[key] += filter_counts.get(key, 0)


def _track_ref_clip_candidates(candidate, ref_totals):
    """Track softclip insertion candidates per reference."""
    for seg in candidate.get("softclip_segments", []):
        event_class = seg.get("softclip_event_class", "")
        if event_class == "window_insertion_candidate":
            ref_totals["window_insertion_candidate"] += 1
        elif event_class == "outside_window_insertion_candidate":
            ref_totals["outside_window_insertion_candidate"] += 1


def annotate_v10_assignment_stats(stats, qc, hard_count, rescued_count, include_rescued_in_assigned):
    bwa_qnames = int(qc.get("BWA qnames", 0) or 0)
    assigned = hard_count + rescued_count if include_rescued_in_assigned else hard_count
    stats["BWA qnames"] = bwa_qnames
    stats["Assigned/BWA rate"] = 0.0 if bwa_qnames <= 0 else assigned / bwa_qnames * 100.0
    stats["Hard assigned reads"] = hard_count
    stats["Rescued assigned reads"] = rescued_count
    stats["Hard+rescued assigned reads"] = hard_count + rescued_count
    stats["Unassigned after BWA reads"] = int(qc.get("unassigned after BWA", 0) or 0)
    stats["Unassigned reason summary"] = ";".join(
        f"{reason}:{int(qc.get(reason, 0) or 0)}"
        for reason in LEDGER_UNASSIGNED_REASONS
        if int(qc.get(reason, 0) or 0) > 0
    ) or "-"
    stats["Editing frequency with rescued assignment"] = stats.get("Editing frequency", "NA")
    stats["Soft-assigned reads"] = 0
    stats["Soft-assigned modified reads"] = 0
    stats["Editing frequency with soft assignment"] = "NA"


def resolve_summary_worker_count(task_count):
    if task_count <= 0:
        return 1

    explicit_workers = os.environ.get("HIDOG_SUMMARY_WORKERS")
    if explicit_workers:
        try:
            return max(1, min(int(explicit_workers), task_count))
        except ValueError:
            return 1

    lsb_slots = os.environ.get("LSB_DJOB_NUMPROC")
    if lsb_slots:
        try:
            available = int(lsb_slots)
        except ValueError:
            available = 1
        return max(1, min(available, 4, task_count))

    return 1


def summarize_all_references(
    reference_records,
    sample_names,
    run_root,
    min_ratio,
    mode,
    analysis_context,
    min_identity_score,
    min_aligned_fraction=0.9,
    min_genotype_depth=MIN_GENOTYPE_DEPTH,
    low_depth_warning_threshold=LOW_DEPTH_WARNING_THRESHOLD,
    cas9_nw_rescue_params=None,
):
    reference_records_by_name = {ref["name"]: ref for ref in reference_records}
    results_by_reference = {}
    for ref in reference_records:
        group_name = analysis_context["ref_contexts"][ref["name"]]["group_name"]
        results_by_reference[ref["name"]] = {
            "reference": ref,
            "group_model": analysis_context["group_models"][group_name],
            "samples": {},
        }

    tasks = [
        (
            group_name,
            group_model,
            reference_records_by_name,
            sample,
            run_root,
            mode,
            analysis_context["ref_contexts"],
            min_identity_score,
            min_aligned_fraction,
            min_ratio,
            min_genotype_depth,
            low_depth_warning_threshold,
            cas9_nw_rescue_params,
        )
        for group_name, group_model in analysis_context["group_models"].items()
        for sample in sample_names
    ]
    total_tasks = len(tasks)
    summary_workers = resolve_summary_worker_count(total_tasks)

    if summary_workers > 1 and total_tasks > 1:
        completed = 0
        with multiprocessing.Pool(processes=summary_workers, maxtasksperchild=1) as pool:
            for group_name, sample, sample_summary in pool.imap_unordered(_summarize_group_sample_task, tasks, chunksize=1):
                for ref_name, ref_summary in sample_summary.items():
                    results_by_reference[ref_name]["samples"][sample] = ref_summary
                completed += 1
                print(f"ledger summary {completed}/{total_tasks} samples done", flush=True)
        return {"references": results_by_reference, "sample_names": list(sample_names), "analysis_context": analysis_context}

    completed = 0
    for group_name, group_model in analysis_context["group_models"].items():
        for sample in sample_names:
            sample_summary = summarize_group_for_sample(
                group_model=group_model,
                reference_records_by_name=reference_records_by_name,
                sample=sample,
                run_root=run_root,
                mode=mode,
                ref_contexts=analysis_context["ref_contexts"],
                min_identity_score=min_identity_score,
                min_aligned_fraction=min_aligned_fraction,
                min_ratio=min_ratio,
                min_genotype_depth=min_genotype_depth,
                low_depth_warning_threshold=low_depth_warning_threshold,
                cas9_nw_rescue_params=cas9_nw_rescue_params,
            )
            for ref_name, ref_summary in sample_summary.items():
                results_by_reference[ref_name]["samples"][sample] = ref_summary
            completed += 1
            print(f"ledger summary {completed}/{total_tasks} samples done", flush=True)

    return {"references": results_by_reference, "sample_names": list(sample_names), "analysis_context": analysis_context}


def _summarize_group_sample_task(args):
    (
        group_name,
        group_model,
        reference_records_by_name,
        sample,
        run_root,
        mode,
        ref_contexts,
        min_identity_score,
        min_aligned_fraction,
        min_ratio,
        min_genotype_depth,
        low_depth_warning_threshold,
        cas9_nw_rescue_params,
    ) = args
    return (
        group_name,
        sample,
        summarize_group_for_sample(
            group_model=group_model,
            reference_records_by_name=reference_records_by_name,
            sample=sample,
            run_root=run_root,
            mode=mode,
            ref_contexts=ref_contexts,
            min_identity_score=min_identity_score,
            min_aligned_fraction=min_aligned_fraction,
            min_ratio=min_ratio,
            min_genotype_depth=min_genotype_depth,
            low_depth_warning_threshold=low_depth_warning_threshold,
            cas9_nw_rescue_params=cas9_nw_rescue_params,
        ),
    )


def get_results_library_name(results_bundle, run_root):
    library_name = results_bundle.get("library_name")
    if library_name:
        return sanitize_name(library_name)

    target_gene = normalize_target_gene_name(results_bundle.get("target_gene"))
    normalized_root = os.path.normpath(run_root)
    root_name = os.path.basename(normalized_root)
    parent_name = os.path.basename(os.path.dirname(normalized_root))
    if target_gene and root_name == target_gene and parent_name:
        return sanitize_name(parent_name)
    return sanitize_name(root_name or "library")


STANDARD_ALLELE_HEADER = [
    "Sort",
    "Reads number",
    "Ratio",
    "Read status",
    "Allele class",
    "In-window variation",
    "Outside-window variation",
    "Left reads seq",
    "Right reads seq",
    "Representative sequence",
]

PE_ALLELE_HEADER = [
    "Sort",
    "Reads number",
    "Ratio",
    "Allele class",
    "prime-edited",
    "indel byproducts",
    "Scaffold-incorporated",
    "In-window variation",
    "Outside-window variation",
    "Left reads seq",
    "Right reads seq",
    "Representative sequence",
]


def allele_export_header(editing_tool, ref_ctx=None):
    if editing_tool == "prime_editor":
        return PE_ALLELE_HEADER
    guide_columns = guide_variation_columns(ref_ctx)
    if not guide_columns:
        return STANDARD_ALLELE_HEADER
    header = []
    for column in STANDARD_ALLELE_HEADER:
        if column == "In-window variation":
            header.extend(guide_columns)
        else:
            header.append(column)
    return header


def allele_export_values(row, editing_tool, ref_ctx=None):
    left_seq, right_seq = split_representative_sequence(row["Representative sequence"])
    if editing_tool == "prime_editor":
        return [
            row["Sort"],
            row["Reads number"],
            row["Ratio"],
            row.get("Allele class", "-"),
            row.get("Prime-edited", row.get("prime-edited", "-")),
            row.get("Indel byproducts", row.get("indel byproducts", "-")),
            row.get("Scaffold-incorporated", "-"),
            row["In-window variation"],
            row["Outside-window variation"],
            left_seq,
            right_seq,
            row["Representative sequence"],
        ]
    guide_columns = guide_variation_columns(ref_ctx)
    if guide_columns:
        guide_signatures = row.get("Guide window signatures", {}) or {}
        values = []
        for column in STANDARD_ALLELE_HEADER:
            if column == "In-window variation":
                for guide_context in multi_guide_contexts(ref_ctx):
                    values.append(guide_signatures.get(guide_context["guide_name"], "-"))
            elif column == "Left reads seq":
                values.append(left_seq)
            elif column == "Right reads seq":
                values.append(right_seq)
            else:
                values.append(row[column])
        return values
    return [
        row["Sort"],
        row["Reads number"],
        row["Ratio"],
        row["Read status"],
        row["Allele class"],
        row["In-window variation"],
        row["Outside-window variation"],
        left_seq,
        right_seq,
        row["Representative sequence"],
    ]


def genotype_summary_header(editing_tool):
    if editing_tool == "prime_editor":
        return [
            "Sample",
            "总编辑reads频率",
            "精准编辑频率",
            "副产物变异频率",
            "带副产物的精准编辑频率",
            "带骨架插入的精准编辑频率",
            "Genotype",
            "note",
        ]
    return ["Sample", "Editing reads ratio", "Genotype"]


COMMON_STAT_KEYS = [
    "Sample", "Reference", "Group",
    "BWA qnames", "Assigned/BWA rate",
    "Hard assigned reads", "Rescued assigned reads", "Hard+rescued assigned reads",
    "Unassigned after BWA reads", "Unassigned reason summary",
    "Pair-incomplete assigned reads suppressed",
    "Total assigned reads", "Full-aligned assigned reads", "Relaxed-aligned assigned reads",
    "Assigned reads", "Modified reads", "Wildtype reads",
    "Edited assigned reads", "Standard window edited reads", "Softclip window editing candidate reads",
    "Reads with outside-window variation", "Outside-window event observations",
    "Reads with insertion", "Reads with deletion", "Reads with substitution",
    "Relaxed unassigned reads", "Ambiguous genotype reads",
    "Low outside-window identity reads", "Insufficient outside-window bases reads",
    "Low raw-identity reads", "Low aligned-fraction reads",
    "Low-identity reads", "Low-aligned reads", "Kmer-fallback reads",
    "Too-short clip observations", "Low-quality clip observations",
    "PolyG/A clip observations", "Low-complexity clip observations",
    "Adapter/Bridge clip observations",
    "Window insertion candidate observations", "Outside-window insertion candidate observations",
    "Editing frequency", "Editing frequency support", "Editing frequency with rescued assignment",
]


PE_STAT_KEYS = [
    "Prime-edited reads", "Scaffold-incorporated reads", "Indel byproduct reads",
    "PE modified outcome reads",
    "PE precise-only reads", "PE scaffold plot reads", "PE byproduct plot reads",
    "Prime editing efficiency", "Prime editing precision",
    "Scaffold incorporation rate", "Indel byproduct rate", "Scaffold residual rate",
]


CAS9_RESCUE_STAT_KEYS = [
    "Cas9 NW rescued reads", "Cas9 NW rescued deletion reads",
    "Cas9 NW rescued insertion reads", "Cas9 NW rejected rescue candidates",
]


def stat_keys_for_export(editing_tool):
    if editing_tool == "prime_editor":
        insert_after = COMMON_STAT_KEYS.index("Wildtype reads") + 1
        return COMMON_STAT_KEYS[:insert_after] + PE_STAT_KEYS + COMMON_STAT_KEYS[insert_after:]
    return COMMON_STAT_KEYS + CAS9_RESCUE_STAT_KEYS


def _apply_variant_support_filter_to_scope(
    result,
    stats_key,
    rows_key,
    display_rows_key,
    genotype_key,
    rejected_key,
    min_variant_families,
    min_ratio,
    editing_tool,
):
    stats = result[stats_key]
    rows = list(result.get(rows_key, []))
    rejected = [
        deepcopy(row)
        for row in rows
        if row.get("Read status") == "Modified"
        and int(row.get("Reads number", 0) or 0) < min_variant_families
    ]
    retained = [
        deepcopy(row)
        for row in rows
        if not (
            row.get("Read status") == "Modified"
            and int(row.get("Reads number", 0) or 0) < min_variant_families
        )
    ]
    assigned = int(stats.get("Assigned reads", 0) or 0)
    raw_edited = sum(
        int(row.get("Reads number", 0) or 0)
        for row in rows
        if row.get("Read status") == "Modified"
    )
    retained_edited = sum(
        int(row.get("Reads number", 0) or 0)
        for row in retained
        if row.get("Read status") == "Modified"
    )
    noise_filtered = raw_edited - retained_edited

    if noise_filtered:
        wt_row = next(
            (row for row in retained if row.get("Read status") == "WT"),
            None,
        )
        if wt_row is None:
            wt_row = {
                "Reads number": 0,
                "Ratio": "0.00%",
                "Read status": "WT",
                "Allele class": "WT",
                "In-window variation": "-",
                "Outside-window variation": "-",
                "Representative sequence": "-",
            }
            retained.append(wt_row)
        wt_row["Reads number"] = int(wt_row.get("Reads number", 0) or 0) + noise_filtered

    for row in retained:
        count = int(row.get("Reads number", 0) or 0)
        row["Ratio"] = f"{(0.0 if assigned <= 0 else count / assigned * 100.0):.2f}%"
    retained.sort(key=lambda row: int(row.get("Reads number", 0) or 0), reverse=True)
    for index, row in enumerate(retained, start=1):
        row["Sort"] = index

    stats["Raw edited UMI families"] = raw_edited
    stats["Noise-filtered UMI families"] = noise_filtered
    stats["Minimum independent UMI families per variant"] = min_variant_families
    stats["Modified reads"] = retained_edited
    stats["Edited assigned reads"] = retained_edited
    stats["Wildtype reads"] = max(0, assigned - retained_edited)
    support = str(stats.get("Editing frequency support", ""))
    if assigned > 0 and (
        support == "computed" or support.startswith("low_depth_warning")
    ):
        stats["Editing frequency"] = retained_edited / assigned * 100.0
    else:
        stats["Editing frequency"] = "NA"

    result[rows_key] = retained
    result[rejected_key] = rejected
    result[display_rows_key] = filter_display_rows(retained, assigned, min_ratio)

    genotype_rows = [deepcopy(row) for row in retained]
    genotype = determine_sample_genotype(genotype_rows, assigned, min_ratio)
    result[genotype_key] = (
        genotype
        if editing_tool == "prime_editor"
        else decorate_genotype_label(genotype, genotype_rows)
    )
    stats["Genotype"] = genotype


def apply_umi_family_variant_support_filter(
    results_bundle,
    min_variant_families=2,
    min_ratio=0.0,
):
    """Remove single-family variant signatures from family frequency/genotype.

    The assigned-family denominator is retained. Rejected allele rows remain in
    per-scope audit collections and are exported separately.
    """
    if min_variant_families < 1:
        raise ValueError("min_variant_families must be at least 1")
    analysis_context = results_bundle.get("analysis_context", {})
    ref_contexts = analysis_context.get("ref_contexts", {})
    for ref_name, bundle in results_bundle.get("references", {}).items():
        editing_tool = ref_contexts.get(ref_name, {}).get("editing_tool", "cas9")
        for sample in results_bundle.get("sample_names", []):
            result = bundle.get("samples", {}).get(sample)
            if result is None:
                continue
            _apply_variant_support_filter_to_scope(
                result,
                "stats",
                "all_rows",
                "display_rows",
                "genotype_display",
                "_umi_noise_filtered_rows",
                min_variant_families,
                min_ratio,
                editing_tool,
            )
            _apply_variant_support_filter_to_scope(
                result,
                "combined_stats",
                "combined_all_rows",
                "combined_display_rows",
                "combined_genotype_display",
                "_umi_combined_noise_filtered_rows",
                min_variant_families,
                min_ratio,
                editing_tool,
            )
    return results_bundle


def export_umi_family_results(results_bundle, family_run_root):
    """Export terminal-UMI-family results without reusing read-level labels."""
    output_dir = os.path.join(family_run_root, "umi_family_results")
    os.makedirs(output_dir, exist_ok=True)
    stats_fields = [
        "Sample",
        "Reference",
        "Group",
        "Assignment_Scope",
        "BWA_UMI_Families",
        "Assigned_UMI_Families",
        "Raw_Edited_UMI_Families",
        "Noise_Filtered_UMI_Families",
        "Edited_UMI_Families",
        "Wildtype_UMI_Families",
        "UMI_Family_Editing_Frequency_Percent",
        "Frequency_Support",
        "UMI_Family_Genotype",
        "Minimum_Independent_UMI_Families_Per_Variant",
        "Frequency_Denominator_Definition",
        "Interpretation",
    ]
    genotype_fields = [
        "Sample",
        "Reference",
        "Assignment_Scope",
        "Assigned_UMI_Families",
        "Noise_Filtered_UMI_Families",
        "UMI_Family_Editing_Frequency_Percent",
        "Frequency_Support",
        "UMI_Family_Genotype",
        "Frequency_Denominator_Definition",
        "Interpretation",
    ]
    stats_rows = []
    genotype_rows = []
    interpretation = "TERMINAL_UMI_FAMILY_NOT_ORIGINAL_MOLECULE"

    for ref_name, bundle in results_bundle["references"].items():
        ref_ctx = results_bundle["analysis_context"]["ref_contexts"][ref_name]
        editing_tool = ref_ctx.get("editing_tool", "cas9")
        allele_header = [
            "UMI Families" if field == "Reads number" else field
            for field in allele_export_header(editing_tool, ref_ctx)
        ]
        for sample in results_bundle["sample_names"]:
            result = bundle["samples"].get(sample)
            if result is None:
                continue
            for scope, stats_key, rows_key, genotype_key in (
                ("hard", "stats", "all_rows", "genotype_display"),
                (
                    "hard_plus_rescued",
                    "combined_stats",
                    "combined_all_rows",
                    "combined_genotype_display",
                ),
            ):
                stats = result[stats_key]
                stats_row = {
                    "Sample": sample,
                    "Reference": ref_name,
                    "Group": stats.get("Group", bundle["group_model"].get("group_name", "")),
                    "Assignment_Scope": scope,
                    "BWA_UMI_Families": stats.get("BWA qnames", 0),
                    "Assigned_UMI_Families": stats.get("Assigned reads", 0),
                    "Raw_Edited_UMI_Families": stats.get(
                        "Raw edited UMI families",
                        stats.get("Edited assigned reads", stats.get("Modified reads", 0)),
                    ),
                    "Noise_Filtered_UMI_Families": stats.get(
                        "Noise-filtered UMI families", 0
                    ),
                    "Edited_UMI_Families": stats.get(
                        "Edited assigned reads", stats.get("Modified reads", 0)
                    ),
                    "Wildtype_UMI_Families": stats.get("Wildtype reads", 0),
                    "UMI_Family_Editing_Frequency_Percent": stats.get(
                        "Editing frequency", "NA"
                    ),
                    "Frequency_Support": stats.get("Editing frequency support", "NA"),
                    "UMI_Family_Genotype": result.get(genotype_key, "-"),
                    "Minimum_Independent_UMI_Families_Per_Variant": stats.get(
                        "Minimum independent UMI families per variant", 1
                    ),
                    "Frequency_Denominator_Definition": (
                        "ASSIGNED_CONSENSUS_PASS_TERMINAL_UMI_FAMILIES"
                    ),
                    "Interpretation": interpretation,
                }
                stats_rows.append(stats_row)
                genotype_rows.append(
                    {field: stats_row[field] for field in genotype_fields}
                )
                allele_path = os.path.join(
                    output_dir,
                    f"{sanitize_name(ref_name)}.{sanitize_name(sample)}.{scope}.umi_family_alleles.tsv",
                )
                with open(allele_path, "w", encoding="utf-8", newline="") as handle:
                    writer = csv.writer(handle, delimiter="\t", lineterminator="\n")
                    writer.writerow(["Sample", *allele_header, "Interpretation"])
                    for allele in result[rows_key]:
                        writer.writerow(
                            [
                                sample,
                                *allele_export_values(allele, editing_tool, ref_ctx),
                                interpretation,
                            ]
                        )
                rejected_key = (
                    "_umi_noise_filtered_rows"
                    if scope == "hard"
                    else "_umi_combined_noise_filtered_rows"
                )
                rejected_path = os.path.join(
                    output_dir,
                    f"{sanitize_name(ref_name)}.{sanitize_name(sample)}.{scope}."
                    "umi_family_noise_filtered_alleles.tsv",
                )
                with open(rejected_path, "w", encoding="utf-8", newline="") as handle:
                    writer = csv.writer(handle, delimiter="\t", lineterminator="\n")
                    writer.writerow(
                        ["Sample", *allele_header, "Filter_Reason", "Interpretation"]
                    )
                    for allele in result.get(rejected_key, []):
                        writer.writerow(
                            [
                                sample,
                                *allele_export_values(allele, editing_tool, ref_ctx),
                                "BELOW_MIN_INDEPENDENT_UMI_FAMILY_SUPPORT",
                                interpretation,
                            ]
                        )

    stats_path = os.path.join(output_dir, "umi_family_stats.tsv")
    with open(stats_path, "w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=stats_fields, delimiter="\t")
        writer.writeheader()
        writer.writerows(stats_rows)
    genotype_path = os.path.join(output_dir, "umi_family_genotypes.tsv")
    with open(genotype_path, "w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=genotype_fields, delimiter="\t")
        writer.writeheader()
        writer.writerows(genotype_rows)

    if OPENPYXL_AVAILABLE:
        workbook = Workbook()
        stats_sheet = workbook.active
        stats_sheet.title = "FamilyStats"
        stats_sheet.append(stats_fields)
        for row in stats_rows:
            stats_sheet.append([row[field] for field in stats_fields])
        genotype_sheet = workbook.create_sheet("FamilyGenotypes")
        genotype_sheet.append(genotype_fields)
        for row in genotype_rows:
            genotype_sheet.append([row[field] for field in genotype_fields])
        workbook.save(os.path.join(output_dir, "umi_family_results.xlsx"))

    return output_dir


def export_results_per_reference(results_bundle, run_root):
    """Export per-reference outputs under <library>_summary_by_reference."""
    library_name = get_results_library_name(results_bundle, run_root)
    summary_dir = os.path.join(run_root, f"{library_name}_summary_by_reference")
    allele_dir = os.path.join(run_root, "allele_details")
    os.makedirs(summary_dir, exist_ok=True)
    os.makedirs(allele_dir, exist_ok=True)

    header = STANDARD_ALLELE_HEADER

    qc_fields = [
        "sample", "group", "BWA qnames", "hard assigned", "rescued assigned",
        "hard_plus_rescued assigned", "unassigned after BWA",
        UNASSIGNED_LOW_OUTSIDE_IDENTITY,
        UNASSIGNED_INSUFFICIENT_OUTSIDE_BASES,
        UNASSIGNED_TRUE_CONFLICT,
        UNASSIGNED_MATE_DISCORDANCE,
        UNASSIGNED_TIE_OR_LOW_MARGIN,
        UNASSIGNED_NO_INFORMATIVE_TAG,
        RESCUE_SAFE_TAG_ZERO_CONFLICT,
        RESCUE_PE_SCAFFOLD_ANCHORED,
        RESCUE_ALIGNMENT_MARGIN,
        RESCUE_SCORE_MARGIN,
        COMPOSITE_TAG_HARD,
        "composite_event_affected_tag",
        *COMPOSITE_FAILURE_REASONS,
        "qnames_with_R1_alignment",
        "qnames_with_R2_alignment",
        "qnames_with_both_mates_alignment",
        "qnames_with_pair_candidate",
        "dropped_missing_R1_candidate",
        "dropped_missing_R2_candidate",
        "dropped_no_strict_pair_candidate",
    ]
    seen_qc = set()
    with open(os.path.join(summary_dir, "assignment_rescue_qc.tsv"), "w", encoding="utf-8") as handle:
        handle.write("\t".join(qc_fields) + "\n")
        for bundle in results_bundle["references"].values():
            for sample in results_bundle["sample_names"]:
                result = bundle["samples"].get(sample)
                if result is None:
                    continue
                qc_row = result.get("assignment_rescue_qc")
                if not qc_row:
                    continue
                key = (qc_row.get("sample"), qc_row.get("group"))
                if key in seen_qc:
                    continue
                seen_qc.add(key)
                handle.write("\t".join(str(qc_row.get(field, 0 if field not in {"sample", "group"} else "")) for field in qc_fields) + "\n")

    reference_items = list(results_bundle["references"].items())
    total_exports = len(reference_items)
    for export_index, (ref_name, bundle) in enumerate(reference_items, start=1):
        ref = bundle["reference"]
        group_model = bundle["group_model"]
        safe_ref = ref["safe_name"]
        output_ref = f"{library_name}_{safe_ref}"
        sample_results = bundle["samples"]
        ref_ctx = results_bundle["analysis_context"]["ref_contexts"][ref_name]
        editing_tool = ref_ctx.get("editing_tool", "cas9")
        header = allele_export_header(editing_tool, ref_ctx)
        stat_keys = stat_keys_for_export(editing_tool)

        with open(os.path.join(summary_dir, f"{safe_ref}.tsv"), "w", encoding="utf-8") as handle:
            handle.write("\t".join(header) + "\n")
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    continue
                handle.write(f"{sample}\n")
                for row in summary_rows_for_export(result):
                    handle.write("\t".join(str(value) for value in allele_export_values(row, editing_tool, ref_ctx)) + "\n")

        with open(os.path.join(summary_dir, f"{safe_ref}.stats.tsv"), "w", encoding="utf-8") as handle:
            handle.write("\t".join(stat_keys) + "\n")
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    continue
                stats = result["stats"]
                handle.write("\t".join([f"{stats.get(k, ''):.2f}" if isinstance(stats.get(k, ""), float) else str(stats.get(k, "")) for k in stat_keys]) + "\n")

        with open(os.path.join(summary_dir, f"{safe_ref}.hard_plus_rescued.tsv"), "w", encoding="utf-8") as handle:
            handle.write("\t".join(header) + "\n")
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    continue
                handle.write(f"{sample}\n")
                for row in summary_rows_for_export(result, use_combined=True):
                    handle.write("\t".join(str(value) for value in allele_export_values(row, editing_tool, ref_ctx)) + "\n")

        with open(os.path.join(summary_dir, f"{safe_ref}.hard_plus_rescued.stats.tsv"), "w", encoding="utf-8") as handle:
            handle.write("\t".join(stat_keys) + "\n")
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    continue
                stats = result["combined_stats"]
                handle.write("\t".join([f"{stats.get(k, ''):.2f}" if isinstance(stats.get(k, ""), float) else str(stats.get(k, "")) for k in stat_keys]) + "\n")

        with open(os.path.join(summary_dir, f"{safe_ref}.homoeolog_sites.tsv"), "w", encoding="utf-8") as handle:
            handle.write("Site\t" + "\t".join(group_model["reference_names"]) + "\n")
            for row in group_model["informative_sites"]:
                handle.write("\t".join([row["site_id"]] + [row["states"].get(name, "-") for name in group_model["reference_names"]]) + "\n")

        for sample in results_bundle["sample_names"]:
            result = sample_results.get(sample)
            if result is None:
                continue
            with open(os.path.join(allele_dir, f"{safe_ref}.{sanitize_name(sample)}.alleles.tsv"), "w", encoding="utf-8") as handle:
                handle.write("\t".join(["Sample"] + header) + "\n")
                for row in result["all_rows"]:
                    handle.write("\t".join(str(value) for value in [sample] + allele_export_values(row, editing_tool, ref_ctx)) + "\n")
            with open(os.path.join(allele_dir, f"{safe_ref}.{sanitize_name(sample)}.hard_plus_rescued.alleles.tsv"), "w", encoding="utf-8") as handle:
                handle.write("\t".join(["Sample"] + header) + "\n")
                for row in result["combined_all_rows"]:
                    handle.write("\t".join(str(value) for value in [sample] + allele_export_values(row, editing_tool, ref_ctx)) + "\n")

        if OPENPYXL_AVAILABLE:
            workbook = Workbook()
            ws_summary = workbook.active
            ws_summary.title = "Summary"
            ws_summary.append(header)
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    continue
                ws_summary.append([sample] + [""] * (len(header) - 1))
                for row in summary_rows_for_export(result):
                    ws_summary.append(allele_export_values(row, editing_tool, ref_ctx))

            ws_flat = workbook.create_sheet("Flat")
            ws_flat.append(["Reference", "Sample"] + header)
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    continue
                for row in summary_rows_for_export(result):
                    ws_flat.append([ref_name, sample] + allele_export_values(row, editing_tool, ref_ctx))

            ws_stats = workbook.create_sheet("Stats")
            ws_stats.append(stat_keys)
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    continue
                stats = result["stats"]
                ws_stats.append([stats.get(k, "") for k in stat_keys])

            ws_genotype_summary = workbook.create_sheet("GenotypeSummary")
            ws_genotype_summary.append(genotype_summary_header(editing_tool))
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    if editing_tool == "prime_editor":
                        ws_genotype_summary.append([sample, "NA", "NA", "NA", "NA", "NA", "NA", "NA"])
                    else:
                        ws_genotype_summary.append([sample, "0.00%", "-"])
                    continue
                if editing_tool == "prime_editor":
                    ws_genotype_summary.append([sample] + genotype_summary_values(result, editing_tool=editing_tool))
                else:
                    editing_frequency_value, genotype_label = genotype_summary_values(result, editing_tool=editing_tool)
                    ws_genotype_summary.append([sample, editing_frequency_value, genotype_label])

            ws_sites = workbook.create_sheet("HomoeologSites")
            ws_sites.append(["Site"] + group_model["reference_names"])
            for row in group_model["informative_sites"]:
                ws_sites.append([row["site_id"]] + [row["states"].get(name, "-") for name in group_model["reference_names"]])

            workbook.save(os.path.join(summary_dir, f"{output_ref}.xlsx"))
            export_genotype_plate_workbook(
                ref_name=ref_name,
                sample_results=sample_results,
                sample_names=results_bundle["sample_names"],
                out_path=os.path.join(summary_dir, f"{output_ref}.genotype.xlsx"),
            )

            workbook_combined = Workbook()
            ws_summary = workbook_combined.active
            ws_summary.title = "Summary"
            ws_summary.append(header)
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    continue
                ws_summary.append([sample] + [""] * (len(header) - 1))
                for row in summary_rows_for_export(result, use_combined=True):
                    ws_summary.append(allele_export_values(row, editing_tool, ref_ctx))

            ws_flat = workbook_combined.create_sheet("Flat")
            ws_flat.append(["Reference", "Sample"] + header)
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    continue
                for row in summary_rows_for_export(result, use_combined=True):
                    ws_flat.append([ref_name, sample] + allele_export_values(row, editing_tool, ref_ctx))

            ws_stats = workbook_combined.create_sheet("Stats")
            ws_stats.append(stat_keys)
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    continue
                stats = result["combined_stats"]
                ws_stats.append([stats.get(k, "") for k in stat_keys])

            ws_genotype_summary = workbook_combined.create_sheet("GenotypeSummary")
            ws_genotype_summary.append(genotype_summary_header(editing_tool))
            for sample in results_bundle["sample_names"]:
                result = sample_results.get(sample)
                if result is None:
                    if editing_tool == "prime_editor":
                        ws_genotype_summary.append([sample, "NA", "NA", "NA", "NA", "NA", "NA", "NA"])
                    else:
                        ws_genotype_summary.append([sample, "0.00%", "-"])
                    continue
                if editing_tool == "prime_editor":
                    ws_genotype_summary.append([sample] + genotype_summary_values(result, use_combined=True, editing_tool=editing_tool))
                else:
                    editing_frequency_value, genotype_label = genotype_summary_values(result, use_combined=True, editing_tool=editing_tool)
                    ws_genotype_summary.append([sample, editing_frequency_value, genotype_label])

            ws_sites = workbook_combined.create_sheet("HomoeologSites")
            ws_sites.append(["Site"] + group_model["reference_names"])
            for row in group_model["informative_sites"]:
                ws_sites.append([row["site_id"]] + [row["states"].get(name, "-") for name in group_model["reference_names"]])

            workbook_combined.save(os.path.join(summary_dir, f"{output_ref}.hard_plus_rescued.xlsx"))
            export_genotype_plate_workbook(
                ref_name=ref_name,
                sample_results={
                    sample: {
                        **result,
                        "stats": result["combined_stats"],
                        "genotype_display": result["combined_genotype_display"],
                    }
                    for sample, result in sample_results.items()
                },
                sample_names=results_bundle["sample_names"],
                out_path=os.path.join(summary_dir, f"{output_ref}.hard_plus_rescued.genotype.xlsx"),
            )

        print(f"export {export_index}/{total_exports} done", flush=True)


def safe_percent(numerator, denominator):
    return 0.0 if denominator == 0 else numerator / denominator * 100.0


def pe_plot_values(row):
    assigned = row.get("Assigned reads", 0)
    return {
        "precise_editing": safe_percent(row.get("PE precise-only reads", 0), assigned),
        "scaffold": safe_percent(row.get("PE scaffold plot reads", 0), assigned),
        "byproduct": safe_percent(row.get("PE byproduct plot reads", 0), assigned),
        "wt": safe_percent(row.get("Wildtype reads", 0), assigned),
    }


def export_reference_plot(ref_name, sample_rows, out_path, editing_tool):
    """按照不同 editing tool 输出对应风格的汇总图。"""
    if not MATPLOTLIB_AVAILABLE or not sample_rows:
        return None
    samples = [row["Sample"] for row in sample_rows]
    fig, ax = plt.subplots(figsize=(max(8, len(samples) * 0.35), 5))

    if editing_tool == "prime_editor":
        values = [pe_plot_values(row) for row in sample_rows]
        precise = [value["precise_editing"] for value in values]
        scaffold = [value["scaffold"] for value in values]
        byproduct = [value["byproduct"] for value in values]
        wildtype = [value["wt"] for value in values]
        ax.bar(samples, precise, label="Precise editing", color="#1b9e77")
        ax.bar(samples, scaffold, bottom=precise, label="Scaffold insertion", color="#7570b3")
        bottom = [a + b for a, b in zip(precise, scaffold)]
        ax.bar(samples, byproduct, bottom=bottom, label="Byproduct", color="#d95f02")
        bottom = [a + b for a, b in zip(bottom, byproduct)]
        ax.bar(samples, wildtype, bottom=bottom, label="WT", color="#66a61e")
        ax.set_title(f"{ref_name}: PE outcome distribution")
    elif editing_tool == "base_editor":
        substitutions = [safe_percent(row.get("Reads with substitution", 0), row["Assigned reads"]) for row in sample_rows]
        indels = [
            safe_percent(row.get("Reads with insertion", 0) + row.get("Reads with deletion", 0), row["Assigned reads"])
            for row in sample_rows
        ]
        wildtype = [safe_percent(row["Wildtype reads"], row["Assigned reads"]) for row in sample_rows]
        ax.bar(samples, substitutions, label="Substitution", color="#1f78b4")
        ax.bar(samples, indels, bottom=substitutions, label="Indel byproducts", color="#d95f02")
        bottom = [a + b for a, b in zip(substitutions, indels)]
        ax.bar(samples, wildtype, bottom=bottom, label="WT", color="#33a02c")
        ax.set_title(f"{ref_name}: base editing outcome distribution")
    else:
        modified = [safe_percent(row["Modified reads"], row["Assigned reads"]) for row in sample_rows]
        wildtype = [safe_percent(row["Wildtype reads"], row["Assigned reads"]) for row in sample_rows]
        ax.bar(samples, modified, label="Modified", color="#d95f02")
        ax.bar(samples, wildtype, bottom=modified, label="WT", color="#1b9e77")
        ax.set_title(f"{ref_name}: editing class distribution")

    ax.set_ylabel("Percent of assigned reads")
    ax.set_ylim(0, 100)
    ax.tick_params(axis="x", rotation=90)
    ax.legend(loc="upper right")
    fig.tight_layout()
    fig.savefig(out_path, dpi=200)
    plt.close(fig)
    return out_path


def export_html_reports(results_bundle, run_root):
    """导出每条参考对应的 HTML 报告及总索引页。"""
    html_dir = os.path.join(run_root, "html_reports")
    plot_dir = os.path.join(run_root, "plots")
    os.makedirs(html_dir, exist_ok=True)
    os.makedirs(plot_dir, exist_ok=True)

    index_rows = []
    for ref_name, bundle in results_bundle["references"].items():
        ref = bundle["reference"]
        ref_ctx = results_bundle["analysis_context"]["ref_contexts"][ref_name]
        editing_tool = ref_ctx.get("editing_tool", "cas9")
        sample_rows = [bundle["samples"][sample]["stats"] for sample in results_bundle["sample_names"] if sample in bundle["samples"]]
        plot_rows = [row for row in sample_rows if is_number(row.get("Editing frequency"))]
        plot_path = export_reference_plot(ref_name, plot_rows, os.path.join(plot_dir, f"{ref['safe_name']}.editing_summary.png"), editing_tool)

        html_name = f"{ref['safe_name']}.html"
        index_rows.append((ref_name, html_name))
        with open(os.path.join(html_dir, html_name), "w", encoding="utf-8") as handle:
            handle.write("<html><head><meta charset='utf-8'><title>{}</title>".format(ref_name))
            handle.write("<style>body{font-family:Arial,sans-serif;margin:24px;}table{border-collapse:collapse;width:100%;margin:16px 0;}th,td{border:1px solid #ccc;padding:6px 8px;font-size:13px;}th{background:#f4f4f4;}</style>")
            handle.write("</head><body>")
            handle.write(f"<h1>{ref_name}</h1><p>Reference group: <code>{bundle['group_model']['group_name']}</code></p>")
            if plot_path is not None:
                handle.write(f"<h2>Editing frequency</h2><img src='../plots/{os.path.basename(plot_path)}' style='max-width:100%;'>")
            handle.write("<h2>Sample summary</h2><table><tr>")
            if editing_tool == "prime_editor":
                columns = [
                    "Sample", "BWA qnames", "Assigned/BWA rate",
                    "Hard assigned reads", "Rescued assigned reads", "Hard+rescued assigned reads",
                    "Unassigned after BWA reads", "Total assigned reads", "Assigned reads",
                    "Prime-edited reads", "Scaffold-incorporated reads",
                    "Indel byproduct reads", "PE modified outcome reads",
                    "Modified reads", "Edited assigned reads",
                    "Prime editing precision", "Scaffold incorporation rate", "Indel byproduct rate",
                    "Editing frequency", "Editing frequency support",
                    "Full-aligned assigned reads", "Relaxed-aligned assigned reads",
                    "Relaxed unassigned reads", "Low outside-window identity reads",
                    "Editing frequency with rescued assignment", "Wildtype reads",
                    "Ambiguous genotype reads", "Low-identity reads",
                ]
            else:
                columns = [
                    "Sample", "BWA qnames", "Assigned/BWA rate",
                    "Hard assigned reads", "Rescued assigned reads", "Hard+rescued assigned reads",
                    "Unassigned after BWA reads", "Total assigned reads", "Assigned reads",
                    "Modified reads", "Edited assigned reads",
                    "Editing frequency", "Editing frequency support",
                    "Full-aligned assigned reads", "Relaxed-aligned assigned reads",
                    "Relaxed unassigned reads", "Low outside-window identity reads",
                    "Editing frequency with rescued assignment", "Wildtype reads",
                    "Reads with outside-window variation", "Outside-window event observations",
                    "Ambiguous genotype reads", "Low-identity reads",
                ]
            for col in columns:
                handle.write(f"<th>{col}</th>")
            handle.write("</tr>")
            for row in sample_rows:
                handle.write("<tr>")
                for col in columns:
                    value = row.get(col, "")
                    if isinstance(value, float):
                        value = f"{value:.2f}"
                    handle.write(f"<td>{value}</td>")
                handle.write("</tr>")
            handle.write("</table>")
            handle.write("<h2>Homoeolog sites (within 100 bp from either amplicon end)</h2><table><tr><th>Site</th>")
            for ref_label in bundle["group_model"]["reference_names"]:
                handle.write(f"<th>{ref_label}</th>")
            handle.write("</tr>")
            for row in bundle["group_model"]["informative_sites"]:
                handle.write("<tr>")
                handle.write(f"<td>{row['site_id']}</td>")
                for ref_label in bundle["group_model"]["reference_names"]:
                    handle.write(f"<td>{row['states'].get(ref_label, '-')}</td>")
                handle.write("</tr>")
            handle.write("</table></body></html>")

    with open(os.path.join(html_dir, "index.html"), "w", encoding="utf-8") as handle:
        handle.write("<html><head><meta charset='utf-8'><title>HiDOG V7_4 reports</title></head><body><h1>HiDOG V7_4 reports</h1><ul>")
        for ref_name, html_name in index_rows:
            handle.write(f"<li><a href='{html_name}'>{ref_name}</a></li>")
        handle.write("</ul></body></html>")
