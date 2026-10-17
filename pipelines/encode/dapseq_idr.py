#!/usr/bin/env python3
"""TRACE DAP-seq biological-replicate IDR extension, not an ENCODE pipeline.

Use an explicit TSV: sample, target, condition, replicate, bam, control_bam.
Compare only independent libraries for the same target and condition. IDR inputs
use permissive MACS2 peaks, not the pre-filtered final peaks. Global IDR is the
-log10 value in column 12 (https://github.com/nboley/idr).
"""
import argparse
import csv
import hashlib
import itertools
import json
import math
from pathlib import Path
import re
import subprocess
import sys
import uuid


def run(*args):
    subprocess.run([str(a) for a in args], check=True)


def read_groups(sheet, input_dir, require_files=True):
    root = Path(input_dir).resolve()
    groups, samples, paths, replicates = {}, set(), set(), set()
    with Path(sheet).open(encoding='utf-8-sig', newline='') as handle:
        reader = csv.DictReader(handle, delimiter='\t')
        required = {'sample', 'target', 'condition', 'replicate', 'bam', 'control_bam'}
        if not required.issubset(reader.fieldnames or []):
            raise ValueError('Sample sheet needs columns: ' + ', '.join(sorted(required)))
        for number, row in enumerate(reader, 2):
            if not any(str(v or '').strip() for v in row.values()):
                continue
            item = {key: str(row.get(key) or '').strip() for key in required}
            if not all(item.values()):
                raise ValueError('Empty sample-sheet field on line %d' % number)
            sample = item['sample']
            if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]*', sample):
                raise ValueError('Sample must be a safe filename stem: ' + sample)
            for key in ('bam', 'control_bam'):
                p = Path(item[key])
                item[key] = p.resolve() if p.is_absolute() else (root / p).resolve()
                if require_files and (not item[key].is_file() or not item[key].stat().st_size):
                    raise ValueError('Missing or empty processed BAM: ' + str(item[key]))
            if item['bam'].name != sample + '.dedup.bam':
                raise ValueError('BAM basename must match sample + .dedup.bam: ' + sample)
            key = (item['target'], item['condition'])
            rep_key = (*key, item['replicate'])
            if sample in samples or item['bam'] in paths or rep_key in replicates:
                raise ValueError('Duplicate sample, BAM or replicate identity: ' + sample)
            samples.add(sample); paths.add(item['bam']); replicates.add(rep_key)
            groups.setdefault(key, []).append(item)
    if not groups:
        raise ValueError('No experimental libraries in sample sheet')
    controls = {r['control_bam'] for group in groups.values() for r in group}
    if paths & controls:
        raise ValueError('Control BAMs cannot also be experimental replicates')
    return groups


def group_id(key):
    label = re.sub(r'[^A-Za-z0-9_.-]+', '_', '__'.join(key)).strip('_')[:70] or 'target'
    digest = hashlib.sha256(json.dumps(key, ensure_ascii=False).encode()).hexdigest()[:8]
    return label + '-' + digest


def call_peak(args, bam, control, name, directory, permissive=False):
    directory.mkdir(parents=True, exist_ok=True)
    probability = ('-p', args.idr_peak_pvalue) if permissive else ('-q', args.qvalue)
    run('macs2', 'callpeak', '-t', bam, '-c', control, '-f', 'BAMPE',
        '-g', args.genome_size, *probability, '--keep-dup', 'all', '-n', name, '--outdir', directory)
    output = directory / (name + '_peaks.narrowPeak')
    if not output.is_file() or not output.stat().st_size:
        raise ValueError('No peaks generated: ' + str(output))
    return output


def peaks(args):
    groups = read_groups(args.sample_sheet, args.input_dir)
    directory = Path(args.input_dir).resolve() / 'peaks'
    for group in groups.values():
        for item in group:
            output = call_peak(args, item['bam'], item['control_bam'], item['sample'], directory)
            (directory / (item['sample'] + '.peaks.final.bed')).write_bytes(output.read_bytes())
            call_peak(args, item['bam'], item['control_bam'], item['sample'], directory / 'idr-inputs', True)


def accepted_idr(lines, threshold):
    cutoff = -math.log10(threshold)
    rows = {}
    for line in lines:
        if not line.strip() or line.startswith('#'):
            continue
        fields = line.rstrip('\n').split('\t')
        if len(fields) < 12:
            raise ValueError('IDR narrowPeak output needs at least 12 columns')
        score = float(fields[11])
        if not math.isfinite(score) or score < 0:
            raise ValueError('Invalid global IDR score')
        if score >= cutoff:
            rows[tuple(fields[:3])] = fields
    return rows


def pooled_bam(paths, output, threads):
    paths = sorted(set(paths))
    if len(paths) == 1:
        return paths[0]
    run('samtools', 'merge', '-f', '-@', threads, output, *paths)
    run('samtools', 'quickcheck', output)
    run('samtools', 'index', '-c', '-@', threads, output)
    return output


def assess_group(args, key, items, dest):
    identity = group_id(key)
    result = {'target': key[0], 'condition': key[1], 'samples': [r['sample'] for r in items],
              'global_idr_threshold': args.idr_threshold, 'status': 'not_assessed', 'pairs': []}
    final = dest / 'final' / (identity + '.peaks.final.bed')
    final.parent.mkdir(parents=True, exist_ok=True)
    # Never leave a previous consensus visible after a failed assessment.
    final.write_text('', encoding='utf-8')
    if len(items) < 2:
        result['reason'] = 'At least two independent biological replicates are required'
        result['accepted_peaks'] = 0
        return result
    pooled = dest / 'pooled'; pooled.mkdir(exist_ok=True)
    bam = pooled_bam([r['bam'] for r in items], pooled / (identity + '.bam'), args.threads)
    control = pooled_bam([r['control_bam'] for r in items], pooled / (identity + '.control.bam'), args.threads)
    oracle = call_peak(args, bam, control, identity, pooled, True)
    peak_dir = Path(args.input_dir).resolve() / 'peaks' / 'idr-inputs'
    intersection = None
    for a, b in itertools.combinations(items, 2):
        output = dest / (identity + '.' + a['sample'] + '.' + b['sample'] + '.idr.txt')
        inputs = [peak_dir / (item['sample'] + '_peaks.narrowPeak') for item in (a, b)]
        for p in inputs:
            if not p.is_file() or not p.stat().st_size:
                raise ValueError('Missing permissive IDR peak input: ' + str(p))
        run('idr', '--samples', *inputs, '--peak-list', oracle, '--input-file-type', 'narrowPeak',
            '--rank', 'p.value', '--output-file', output, '--soft-idr-threshold', args.idr_threshold,
            '--random-seed', '0', '--plot')
        accepted = accepted_idr(output.read_text(encoding='utf-8').splitlines(), args.idr_threshold)
        intersection = set(accepted) if intersection is None else intersection & set(accepted)
        result['pairs'].append({'replicate_1': a['sample'], 'replicate_2': b['sample'],
                                'accepted_peaks': len(accepted), 'output': str(output)})
    # Preserve the pooled oracle's narrowPeak scores/summits, not IDR scores.
    oracle_rows = [line for line in oracle.read_text(encoding='utf-8').splitlines(True)
                   if tuple(line.rstrip('\n').split('\t')[:3]) in (intersection or set())]
    final.write_text(''.join(oracle_rows), encoding='utf-8')
    result.update(accepted_peaks=len(oracle_rows), output=str(final),
                  consensus_rule='pooled oracle peaks passing every biological-replicate pair',
                  status='pass' if oracle_rows else 'failed')
    if not oracle_rows:
        result['reason'] = 'No reproducible peaks passed all replicate-pair IDR comparisons'
    return result


def write_qc(args, results, error=None):
    root = Path(args.input_dir).resolve()
    qc = root / 'qc'; qc.mkdir(parents=True, exist_ok=True)
    passed = not error and bool(results) and all(r['status'] == 'pass' for r in results.values())
    evidence = {'_dap_idr': {'status': 'pass' if passed else 'failed',
                            'global_idr_threshold': args.idr_threshold, 'groups': results,
                            'implementation': 'TRACE DAP-seq biological-replicate IDR extension; not ENCODE',
                            **({'error': str(error)} if error else {})}}
    (qc / 'idr_qc.json').write_text(json.dumps(evidence, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    dest = root / 'idr'; dest.mkdir(exist_ok=True)
    with (dest / 'idr_summary.tsv').open('w', encoding='utf-8', newline='') as handle:
        writer = csv.writer(handle, delimiter='\t')
        writer.writerow(['group', 'target', 'condition', 'replicates', 'accepted_peaks', 'status', 'reason'])
        for identity, r in results.items():
            writer.writerow([identity, r['target'], r['condition'], len(r['samples']), r.get('accepted_peaks', 0), r['status'], r.get('reason', '')])
    return passed


def idr(args):
    dest = Path(args.input_dir).resolve() / 'idr'; dest.mkdir(parents=True, exist_ok=True)
    results = {}
    try:
        # A changed sheet or early validation error must never expose an old
        # consensus as this assessment's result. Archive it for recovery.
        final = dest / 'final'
        if final.exists():
            backup = dest / ('previous-final-' + uuid.uuid4().hex)
            final.rename(backup)
            print('Previous IDR final peaks archived in: ' + str(backup))
        final.mkdir()
        groups = read_groups(args.sample_sheet, args.input_dir)
        for key, items in groups.items():
            results[group_id(key)] = assess_group(args, key, items, dest)
    except Exception as error:
        write_qc(args, results, error)
        raise
    if not write_qc(args, results):
        raise ValueError('DAP-seq IDR failed or was not assessable; downstream analysis is not recommended')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['validate', 'list-bams', 'peaks', 'idr'])
    parser.add_argument('--sample-sheet', required=True)
    parser.add_argument('--input-dir', required=True)
    parser.add_argument('--genome-size', default='')
    parser.add_argument('--threads', type=int, default=8)
    parser.add_argument('--qvalue', type=float, default=0.05)
    parser.add_argument('--idr-peak-pvalue', type=float, default=0.001)
    parser.add_argument('--idr-threshold', type=float, default=0.05)
    args = parser.parse_args()
    if args.threads < 1 or any(not 0 < v < 1 for v in (args.qvalue, args.idr_peak_pvalue, args.idr_threshold)):
        parser.error('Threads must be positive; probability thresholds must be between 0 and 1')
    if args.action == 'list-bams':
        for items in read_groups(args.sample_sheet, args.input_dir).values():
            for item in items:
                print(item['bam'])
    elif args.action == 'validate':
        groups = read_groups(args.sample_sheet, args.input_dir, False)
        if any(len(rows) < 2 for rows in groups.values()):
            raise ValueError('Each target/condition needs at least two independent biological replicates; IDR cannot pass for a single library')
        print('DAP-seq replicate identities and matched controls validated')
    else:
        if not args.genome_size:
            parser.error('An explicit effective genome size is required')
        globals()[args.action](args)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print('DAP-seq reproducibility error: ' + str(error), file=sys.stderr)
        sys.exit(1)
