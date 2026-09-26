#!/usr/bin/env python3
"""Build an ENCODE-DCC paired-end stranded long RNA-seq WDL input JSON."""

from __future__ import annotations

import argparse
import csv
import json
import os
from collections import defaultdict
from pathlib import Path


def positive_int(value: str) -> int:
    parsed = int(value)
    if parsed < 1:
        raise argparse.ArgumentTypeError("必须是正整数")
    return parsed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sample-sheet", required=True)
    parser.add_argument("--star-index", required=True)
    parser.add_argument("--rsem-index", required=True)
    parser.add_argument("--kallisto-index", required=True)
    parser.add_argument("--chrom-sizes", required=True)
    parser.add_argument("--gene-type-map", required=True)
    parser.add_argument("--strand-direction", choices=("forward", "reverse"), required=True)
    parser.add_argument("--bam-root", required=True)
    parser.add_argument("--threads", type=positive_int, default=8)
    parser.add_argument("--align-ram-gb", type=positive_int, default=60)
    parser.add_argument("--rsem-ram-gb", type=positive_int, default=60)
    parser.add_argument("--kallisto-ram-gb", type=positive_int, default=30)
    parser.add_argument("--signals-ram-gb", type=positive_int, default=30)
    parser.add_argument("--task-disk", default="local-disk 200 HDD")
    parser.add_argument("--output", required=True)
    return parser.parse_args()


def usable_path(value: str) -> bool:
    return value.startswith(("http://", "https://", "s3://", "gs://")) or os.path.isabs(value)


def main() -> int:
    args = parse_args()
    grouped: dict[int, dict[str, list[str]]] = defaultdict(lambda: {"r1": [], "r2": []})
    with open(args.sample_sheet, newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        required = {"replicate", "read1", "read2"}
        if not reader.fieldnames or not required.issubset(set(reader.fieldnames)):
            raise ValueError("样本表必须包含 replicate、read1、read2 三列")
        for row_number, row in enumerate(reader, start=2):
            try:
                replicate = int((row.get("replicate") or "").strip())
            except ValueError as exc:
                raise ValueError(f"第 {row_number} 行 replicate 必须是正整数") from exc
            if replicate < 1:
                raise ValueError(f"第 {row_number} 行 replicate 必须是正整数")
            read1 = (row.get("read1") or "").strip()
            read2 = (row.get("read2") or "").strip()
            if not read1 or not read2:
                raise ValueError(f"第 {row_number} 行缺少 read1/read2；ENCPL002LPE 只接受 paired-end")
            if not usable_path(read1) or not usable_path(read2):
                raise ValueError(f"第 {row_number} 行 FASTQ 必须是绝对路径或受支持 URI")
            grouped[replicate]["r1"].append(read1)
            grouped[replicate]["r2"].append(read2)

    replicates = sorted(grouped)
    if not replicates or replicates != list(range(1, len(replicates) + 1)):
        raise ValueError("replicate 必须从 1 开始连续编号")
    references = [args.star_index, args.rsem_index, args.kallisto_index, args.chrom_sizes, args.gene_type_map]
    if any(not usable_path(item) for item in references):
        raise ValueError("所有参考文件必须是绝对路径或受支持 URI")

    payload = {
        "rna.endedness": "paired",
        "rna.fastqs_R1": [grouped[rep]["r1"] for rep in replicates],
        "rna.fastqs_R2": [grouped[rep]["r2"] for rep in replicates],
        "rna.align_index": args.star_index,
        "rna.rsem_index": args.rsem_index,
        "rna.kallisto_index": args.kallisto_index,
        "rna.run_kallisto": True,
        "rna.bamroot": args.bam_root,
        "rna.strandedness": "stranded",
        "rna.strandedness_direction": args.strand_direction,
        "rna.chrom_sizes": args.chrom_sizes,
        "rna.rna_qc_tr_id_to_gene_type_tsv": args.gene_type_map,
        "rna.align_ncpus": args.threads,
        "rna.align_ramGB": args.align_ram_gb,
        "rna.kallisto_number_of_threads": args.threads,
        "rna.kallisto_ramGB": args.kallisto_ram_gb,
        "rna.bam_to_signals_ncpus": args.threads,
        "rna.bam_to_signals_ramGB": args.signals_ram_gb,
        "rna.rsem_ncpus": args.threads,
        "rna.rsem_ramGB": args.rsem_ram_gb,
        "rna.align_disk": args.task_disk,
        "rna.kallisto_disk": args.task_disk,
        "rna.bam_to_signals_disk": args.task_disk,
        "rna.rsem_disk": args.task_disk,
        "rna.rna_qc_disk": args.task_disk,
        "rna.mad_qc_disk": args.task_disk,
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {output}: {len(replicates)} biological replicate(s), paired-end, stranded {args.strand_direction}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
