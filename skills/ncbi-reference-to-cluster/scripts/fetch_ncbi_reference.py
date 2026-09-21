#!/usr/bin/env python3
"""Resolve and download one reproducible NCBI genome assembly."""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile


ACCESSION_RE = re.compile(r"^(GC[AF]_\d{9}\.\d+)$", re.IGNORECASE)
LEVEL_RANK = {
    "complete genome": 4,
    "complete": 4,
    "chromosome": 3,
    "scaffold": 2,
    "contig": 1,
}
CATEGORY_RANK = {
    "reference genome": 3,
    "representative genome": 2,
}


class UserError(RuntimeError):
    pass


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Select the best NCBI cellular-organism assembly, preview the choice, "
            "and optionally download it atomically with checksum verification."
        )
    )
    identity = parser.add_mutually_exclusive_group(required=True)
    identity.add_argument("--taxon", help="NCBI Taxonomy ID or scientific name")
    identity.add_argument(
        "--accession", help="Exact versioned GCF_/GCA_ assembly accession"
    )
    parser.add_argument(
        "--dest-root", required=True, type=Path, help="Approved cluster reference root"
    )
    parser.add_argument(
        "--include",
        default="genome,gff3,gtf,seq-report",
        help="Comma-separated NCBI Datasets file types",
    )
    parser.add_argument(
        "--search",
        action="append",
        default=[],
        help="NCBI text constraint; repeat for multiple constraints",
    )
    parser.add_argument(
        "--api-key-env",
        help="Environment variable containing an NCBI API key; never pass the key itself",
    )
    parser.add_argument(
        "--top", type=int, default=5, help="Number of ranked candidates to report"
    )
    parser.add_argument(
        "--yes", action="store_true", help="Perform the material download"
    )
    parser.add_argument(
        "--remove-zip",
        action="store_true",
        help="Remove the package ZIP after successful verification",
    )
    parser.add_argument(
        "--datasets-bin", default="datasets", help="NCBI Datasets executable"
    )
    args = parser.parse_args()
    if args.top < 1:
        parser.error("--top must be at least 1")
    if args.accession and not ACCESSION_RE.fullmatch(args.accession):
        parser.error("--accession must be a versioned GCF_/GCA_ accession")
    return args


def run(command: list[str], *, capture: bool = True) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            command,
            check=True,
            text=True,
            stdout=subprocess.PIPE if capture else None,
            stderr=subprocess.PIPE if capture else None,
        )
    except FileNotFoundError as exc:
        raise UserError(f"Required command not found: {command[0]}") from exc
    except subprocess.CalledProcessError as exc:
        detail = (exc.stderr or exc.stdout or "").strip()
        raise UserError(f"Command failed ({command[0]}): {detail}") from exc


def get_path(record: dict, *paths: tuple[str, ...], default=None):
    for path in paths:
        value = record
        for key in path:
            if not isinstance(value, dict) or key not in value:
                break
            value = value[key]
        else:
            if value not in (None, ""):
                return value
    return default


def as_int(value, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def date_key(value) -> int:
    if not value:
        return 0
    text = str(value)[:10]
    try:
        return int(dt.date.fromisoformat(text).strftime("%Y%m%d"))
    except ValueError:
        return 0


def candidate(record: dict) -> dict:
    accession = str(get_path(record, ("accession",), default=""))
    category = str(
        get_path(
            record,
            ("assemblyInfo", "refseqCategory"),
            ("assembly_info", "refseq_category"),
            default="",
        )
    ).lower()
    level = str(
        get_path(
            record,
            ("assemblyInfo", "assemblyLevel"),
            ("assembly_info", "assembly_level"),
            default="",
        )
    ).lower()
    source = str(
        get_path(record, ("sourceDatabase",), ("source_database",), default="")
    ).upper()
    annotation = get_path(
        record, ("annotationInfo",), ("annotation_info",), default={}
    )
    scaffold_n50 = as_int(
        get_path(
            record,
            ("assemblyStats", "scaffoldN50"),
            ("assembly_stats", "scaffold_n50"),
            default=0,
        )
    )
    contig_n50 = as_int(
        get_path(
            record,
            ("assemblyStats", "contigN50"),
            ("assembly_stats", "contig_n50"),
            default=0,
        )
    )
    contigs = as_int(
        get_path(
            record,
            ("assemblyStats", "numberOfContigs"),
            ("assembly_stats", "number_of_contigs"),
            default=10**18,
        ),
        default=10**18,
    )
    release_date = get_path(
        record,
        ("assemblyInfo", "releaseDate"),
        ("assembly_info", "release_date"),
        default="",
    )
    annotated = bool(annotation)
    rank = (
        CATEGORY_RANK.get(category, 0),
        LEVEL_RANK.get(level, 0),
        int(source == "REFSEQ" or accession.upper().startswith("GCF_")),
        int(annotated),
        scaffold_n50,
        contig_n50,
        -contigs,
        date_key(release_date),
        accession,
    )
    return {
        "accession": accession,
        "organism": get_path(
            record,
            ("organism", "organismName"),
            ("organism", "organism_name"),
            default="",
        ),
        "tax_id": get_path(
            record,
            ("organism", "taxId"),
            ("organism", "tax_id"),
            default=None,
        ),
        "assembly_name": get_path(
            record,
            ("assemblyInfo", "assemblyName"),
            ("assembly_info", "assembly_name"),
            default="",
        ),
        "refseq_category": category or None,
        "assembly_level": level or None,
        "source_database": source or None,
        "annotated": annotated,
        "scaffold_n50": scaffold_n50 or None,
        "contig_n50": contig_n50 or None,
        "contig_count": None if contigs == 10**18 else contigs,
        "release_date": release_date or None,
        "_rank": rank,
        "_raw": record,
    }


def api_key_args(args: argparse.Namespace) -> list[str]:
    if not args.api_key_env:
        return []
    value = os.environ.get(args.api_key_env)
    if not value:
        raise UserError(
            f"Environment variable {args.api_key_env!r} is unset or empty"
        )
    return ["--api-key", value]


def summary_command(args: argparse.Namespace) -> list[str]:
    command = [args.datasets_bin, "summary", "genome"]
    if args.accession:
        command.extend(["accession", args.accession])
    else:
        command.extend(
            [
                "taxon",
                args.taxon,
                "--as-json-lines",
                "--assembly-version",
                "current",
                "--exclude-atypical",
                "--exclude-multi-isolate",
                "--mag",
                "exclude",
                "--limit",
                "all",
            ]
        )
        for value in args.search:
            command.extend(["--search", value])
    command.extend(api_key_args(args))
    return command


def parse_records(output: str) -> list[dict]:
    records: list[dict] = []
    for line in output.splitlines():
        line = line.strip()
        if not line:
            continue
        value = json.loads(line)
        if isinstance(value, dict) and isinstance(value.get("reports"), list):
            records.extend(x for x in value["reports"] if isinstance(x, dict))
        elif isinstance(value, dict):
            records.append(value)
    return records


def sanitize_name(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", value.strip()).strip("._")
    return cleaned[:100] or "taxon"


def public_candidate(item: dict) -> dict:
    return {key: value for key, value in item.items() if not key.startswith("_")}


def selection_reason(item: dict, pinned: bool) -> list[str]:
    if pinned:
        return ["exact versioned accession supplied by user or project"]
    reasons = []
    if item["refseq_category"]:
        reasons.append(f"NCBI category: {item['refseq_category']}")
    reasons.append(f"assembly level: {item['assembly_level'] or 'unclassified'}")
    reasons.append(f"source: {item['source_database'] or item['accession'][:3]}")
    reasons.append("annotation available" if item["annotated"] else "no annotation reported")
    reasons.append(
        "continuity/date used only after category, level, source, and annotation"
    )
    return reasons


def ensure_safe_zip(archive: Path, destination: Path) -> None:
    root = destination.resolve()
    with zipfile.ZipFile(archive) as zf:
        for member in zf.infolist():
            target = (destination / member.filename).resolve()
            if target != root and root not in target.parents:
                raise UserError(f"Unsafe ZIP member path: {member.filename}")
            unix_mode = member.external_attr >> 16
            if (unix_mode & 0o170000) == 0o120000:
                raise UserError(f"Symlink ZIP member is not allowed: {member.filename}")
        zf.extractall(destination)


def verify_md5(root: Path) -> int:
    checksum_file = root / "md5sum.txt"
    if not checksum_file.is_file():
        raise UserError("NCBI package is missing md5sum.txt")
    checked = 0
    for line in checksum_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        parts = line.split(maxsplit=1)
        if len(parts) != 2:
            raise UserError(f"Malformed checksum line: {line}")
        expected, relative = parts
        relative = relative.lstrip("*").removeprefix("./")
        target = (root / relative).resolve()
        if root.resolve() not in target.parents or not target.is_file():
            raise UserError(f"Checksum target is missing or unsafe: {relative}")
        digest = hashlib.md5()
        with target.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
        if digest.hexdigest().lower() != expected.lower():
            raise UserError(f"MD5 mismatch: {relative}")
        checked += 1
    if checked == 0:
        raise UserError("NCBI checksum file contains no entries")
    return checked


def find_files(root: Path) -> dict[str, list[str]]:
    patterns = {
        "genome_fasta": ["*_genomic.fna"],
        "gff3": ["genomic.gff", "genomic.gff3", "*_genomic.gff", "*_genomic.gff3"],
        "gtf": ["genomic.gtf", "*_genomic.gtf"],
        "sequence_report": ["sequence_report.jsonl"],
    }
    found: dict[str, list[str]] = {}
    for label, globs in patterns.items():
        paths = []
        for pattern in globs:
            paths.extend(root.rglob(pattern))
        found[label] = sorted(
            {str(path.relative_to(root)) for path in paths if path.is_file()}
        )
    return found


def existing_status(final_dir: Path, accession: str, include: str) -> dict | None:
    provenance = final_dir / "provenance.json"
    if not final_dir.exists():
        return None
    if not provenance.is_file():
        raise UserError(
            f"Destination exists without provenance; inspect manually: {final_dir}"
        )
    data = json.loads(provenance.read_text(encoding="utf-8"))
    if data.get("accession") != accession or data.get("include") != include:
        raise UserError(
            f"Destination provenance conflicts with this request: {final_dir}"
        )
    checked = verify_md5(final_dir)
    return {
        "status": "already-present",
        "accession": accession,
        "destination": str(final_dir),
        "checksums_verified": checked,
        "files": find_files(final_dir),
    }


def download(
    args: argparse.Namespace,
    selected: dict,
    candidates: list[dict],
    datasets_version: str,
) -> dict:
    accession = selected["accession"]
    label = args.taxon or selected.get("organism") or accession
    final_dir = args.dest_root.expanduser().resolve() / sanitize_name(label) / accession
    existing = existing_status(final_dir, accession, args.include)
    if existing:
        return existing

    report = {
        "status": "preview" if not args.yes else "pending",
        "accession": accession,
        "organism": selected.get("organism"),
        "selection_reason": selection_reason(selected, bool(args.accession)),
        "destination": str(final_dir),
        "include": args.include,
        "top_candidates": [public_candidate(x) for x in candidates[: args.top]],
    }
    if not args.yes:
        report["next_step"] = "Review this report, then repeat the command with --yes"
        return report

    parent = final_dir.parent
    parent.mkdir(parents=True, exist_ok=True)
    temp_dir = Path(tempfile.mkdtemp(prefix=f".{accession}.tmp-", dir=parent))
    try:
        archive = temp_dir / "ncbi_dataset.zip"
        command = [
            args.datasets_bin,
            "download",
            "genome",
            "accession",
            accession,
            "--include",
            args.include,
            "--filename",
            str(archive),
            "--no-progressbar",
        ]
        command.extend(api_key_args(args))
        run(command, capture=True)
        ensure_safe_zip(archive, temp_dir)
        checked = verify_md5(temp_dir)
        provenance = {
            "schema_version": 1,
            "created_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
            "accession": accession,
            "organism": selected.get("organism"),
            "tax_id": selected.get("tax_id"),
            "assembly_name": selected.get("assembly_name"),
            "include": args.include,
            "requested_taxon": args.taxon,
            "search_constraints": args.search,
            "selection_reason": selection_reason(selected, bool(args.accession)),
            "selected_metadata": public_candidate(selected),
            "datasets_version": datasets_version,
            "checksum_algorithm": "MD5 supplied by NCBI data package",
            "checksums_verified": checked,
        }
        (temp_dir / "candidate_report.json").write_text(
            json.dumps(
                [public_candidate(x) for x in candidates[: args.top]],
                indent=2,
                ensure_ascii=False,
            )
            + "\n",
            encoding="utf-8",
        )
        (temp_dir / "provenance.json").write_text(
            json.dumps(provenance, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        if args.remove_zip:
            archive.unlink()
        if final_dir.exists():
            raise UserError(f"Destination appeared during download: {final_dir}")
        temp_dir.replace(final_dir)
    except Exception:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise

    return {
        "status": "downloaded",
        "accession": accession,
        "destination": str(final_dir),
        "checksums_verified": checked,
        "files": find_files(final_dir),
        "provenance": str(final_dir / "provenance.json"),
    }


def main() -> int:
    args = parse_args()
    try:
        version_result = run([args.datasets_bin, "--version"])
        datasets_version = version_result.stdout.strip()
        records = parse_records(run(summary_command(args)).stdout)
        if not records:
            raise UserError("No eligible current assembly matched the request")
        candidates = [candidate(record) for record in records]
        candidates = [item for item in candidates if item["accession"]]
        if not candidates:
            raise UserError("NCBI returned records without assembly accessions")
        candidates.sort(key=lambda item: item["_rank"], reverse=True)
        result = download(args, candidates[0], candidates, datasets_version)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return 0
    except (UserError, json.JSONDecodeError, zipfile.BadZipFile) as exc:
        print(json.dumps({"status": "error", "message": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
