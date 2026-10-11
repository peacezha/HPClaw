#!/usr/bin/env python3
"""Native paired-end TF ChIP-seq extension; not the official ENCODE WDL.

One INPUT_DIR represents biological replicates of ONE target/condition.
Template hashing creates disjoint, complementary halves (not shuffle-split).
The IDR output's global score is column 12, transformed as -log10(IDR).
"""
import argparse
import hashlib
import itertools
import json
import math
from pathlib import Path
import subprocess
import sys


def run(*args):
    subprocess.run([str(a) for a in args], check=True)


def partition_key(line, namespace):
    fields = line.rstrip('\n').split('\t')
    if len(fields) < 11:
        raise ValueError('Malformed SAM record')
    rg = next((f[5:] for f in fields[11:] if f.startswith('RG:Z:')), '')
    # Both mates and their secondary records share QNAME/RG. Namespace avoids
    # collisions when different source libraries reuse instrument identifiers.
    key = '\0'.join((namespace, rg, fields[0], 'HPClaw-41')).encode()
    return hashlib.blake2b(key, digest_size=8).digest()[0] & 1


def split_sam(lines, first, second, namespace):
    counts = [0, 0]
    for line in lines:
        if line.startswith('@'):
            first.write(line); second.write(line)
        else:
            half = partition_key(line, namespace)
            (first, second)[half].write(line)
            counts[half] += 1
    return counts


def split_bam(bam, targets, threads):
    reader = subprocess.Popen(['samtools', 'view', '-h', str(bam)], stdout=subprocess.PIPE, text=True)
    writers = [subprocess.Popen(['samtools', 'view', '-@', str(threads), '-b', '-o', str(p), '-'],
                               stdin=subprocess.PIPE, text=True) for p in targets]
    try:
        counts = split_sam(reader.stdout, writers[0].stdin, writers[1].stdin, bam.name)
        for p in writers:
            p.stdin.close()
        statuses = [reader.wait()] + [p.wait() for p in writers]
        if any(statuses):
            raise RuntimeError('SAMtools pseudoreplicate split failed: ' + str(statuses))
        if not all(counts):
            raise ValueError('Empty pseudoreplicate: cannot assess reproducibility')
    finally:
        for process in [reader] + writers:
            if process.poll() is None:
                process.terminate(); process.wait()
    for target in targets:
        run('samtools', 'quickcheck', target)
        run('samtools', 'index', '-c', '-@', threads, target)


def libraries(args):
    inputs = sorted(Path(args.input_dir).resolve().glob('*.dedup.bam'))
    controls = sorted(Path(args.control_dir).resolve().glob('*.dedup.bam'))
    if len(controls) != 1:
        raise ValueError('Provide exactly one matched, processed Input control BAM (pool controls explicitly if required)')
    inputs = [p for p in inputs if p != controls[0]]
    if not inputs:
        raise ValueError('No experimental *.dedup.bam files found')
    return inputs, controls[0]


def call_peak(args, bam, control, name, directory):
    directory.mkdir(parents=True, exist_ok=True)
    run('macs2', 'callpeak', '-t', bam, '-c', control, '-f', 'BAMPE',
        '-g', args.genome_size, '-q', args.qvalue, '--keep-dup', 'all',
        '-n', name, '--outdir', directory)
    output = directory / (name + '_peaks.narrowPeak')
    if not output.is_file() or output.stat().st_size == 0:
        raise ValueError('No peaks generated: ' + str(output))
    return output


def pseudoreplicates(args):
    inputs, control = libraries(args)
    base = Path(args.input_dir).resolve() / 'peaks'
    first, second = [], []
    audit = {'method': 'deterministic complementary template hashing', 'seed': 'HPClaw-41', 'libraries': []}
    for bam in inputs:
        name = bam.name[:-len('.dedup.bam')]
        targets = [base / 'pr' / (name + '.pr%d.bam' % i) for i in (1, 2)]
        targets[0].parent.mkdir(parents=True, exist_ok=True)
        split_bam(bam, targets, args.threads)
        for i, target in enumerate(targets, 1):
            call_peak(args, target, control, name + '.pr%d' % i, base / 'pr')
        first.append(targets[0]); second.append(targets[1])
        audit['libraries'].append({'source': str(bam), 'halves': [str(p) for p in targets]})
    if len(inputs) >= 2:
        pooled = base / 'pooled'; pooled.mkdir(parents=True, exist_ok=True)
        for name, sources in [('pooled', inputs), ('pooled.pr1', first), ('pooled.pr2', second)]:
            bam = pooled / (name + '.bam')
            run('samtools', 'merge', '-@', args.threads, '-f', bam, *sources)
            run('samtools', 'index', '-c', '-@', args.threads, bam)
            call_peak(args, bam, control, name, pooled)
    (base / 'pseudoreplicate_manifest.json').write_text(json.dumps(audit, indent=2) + '\n', encoding='utf-8')


def accepted_idr(lines, threshold=0.05):
    cutoff = -math.log10(threshold)
    rows = []
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
            rows.append('\t'.join(fields[:10]) + '\n')
    return rows


def reproducibility(true_counts, self_counts, pooled_count):
    nt = max(true_counts) if true_counts else None
    def ratio(values):
        return max(values) / min(values) if values and min(values) > 0 else None
    rescue = ratio([nt, pooled_count]) if nt is not None and pooled_count is not None else None
    consistency = ratio(self_counts)
    status = ('not_assessed' if nt is None else 'failed' if rescue is None or consistency is None else
              'failed' if rescue > 2 and consistency > 2 else 'borderline' if rescue > 2 or consistency > 2 else 'pass')
    return {'Nt_true_replicate': nt, 'Np_pooled_pseudorep': pooled_count,
            'self_pseudoreplicate_counts': self_counts, 'rescue_ratio': rescue,
            'self_consistency_ratio': consistency, 'status': status}


def idr(args):
    inputs, _control = libraries(args)
    base = Path(args.input_dir).resolve(); peaks = base / 'peaks'
    dest = base / 'idr'; dest.mkdir(exist_ok=True)
    qc = base / 'qc'; qc.mkdir(exist_ok=True)
    def compare(name, left, right, oracle):
        for p in [left, right, oracle]:
            if not p.is_file() or not p.stat().st_size:
                raise ValueError('Missing or empty IDR input: ' + str(p))
        output = dest / (name + '.txt')
        run('idr', '--samples', left, right, '--peak-list', oracle,
            '--input-file-type', 'narrowPeak', '--rank', 'p.value', '-o', output, '--plot')
        # A failed IDR invocation is never masked by || true.
        rows = accepted_idr(output.read_text(encoding='utf-8').splitlines(True), args.idr_threshold)
        bed = dest / (name + '.idr.narrowPeak')
        bed.write_text(''.join(rows), encoding='utf-8')
        return len(rows), bed
    names = [p.name[:-len('.dedup.bam')] for p in inputs]
    selfs = [compare('self.' + s, peaks / 'pr' / (s + '.pr1_peaks.narrowPeak'),
                     peaks / 'pr' / (s + '.pr2_peaks.narrowPeak'), peaks / (s + '_peaks.narrowPeak'))[0] for s in names]
    pairs, pooled_count, pooled_bed = [], None, None
    if len(names) >= 2:
        oracle = peaks / 'pooled' / 'pooled_peaks.narrowPeak'
        pairs = [compare('true.%s.%s' % (a, b), peaks / (a + '_peaks.narrowPeak'),
                         peaks / (b + '_peaks.narrowPeak'), oracle) for a, b in itertools.combinations(names, 2)]
        pooled_count, pooled_bed = compare('pooled', peaks / 'pooled' / 'pooled.pr1_peaks.narrowPeak',
                                         peaks / 'pooled' / 'pooled.pr2_peaks.narrowPeak', oracle)
        best = max(pairs, key=lambda p: p[0])
        (dest / 'conservative.idr.narrowPeak').write_bytes(best[1].read_bytes())
        (dest / 'optimal.idr.narrowPeak').write_bytes((pooled_bed if pooled_count > best[0] else best[1]).read_bytes())
    result = reproducibility([n for n, _p in pairs], selfs, pooled_count)
    result['global_idr_threshold'] = args.idr_threshold
    result['implementation'] = 'HPClaw native PE extension, not official ENCODE WDL'
    (qc / 'idr_qc.json').write_text(json.dumps({'_reproducibility': result}, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(result))
    # QC failures produce evidence and a non-success exit; no silent completion.
    if result['status'] != 'pass':
        raise ValueError('Reproducibility is ' + result['status'] + '; review QC before downstream analysis')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['peaks', 'pseudoreplicates', 'idr'])
    parser.add_argument('--input-dir', required=True)
    parser.add_argument('--control-dir', required=True)
    parser.add_argument('--genome-size', required=True)
    parser.add_argument('--threads', type=int, default=8)
    parser.add_argument('--qvalue', type=float, default=0.05)
    parser.add_argument('--idr-threshold', type=float, default=0.05)
    args = parser.parse_args()
    if args.threads < 1 or not 0 < args.qvalue < 1 or not 0 < args.idr_threshold < 1:
        parser.error('Threads must be positive; probability thresholds must be between 0 and 1')
    if args.action == 'peaks':
        inputs, control = libraries(args)
        for bam in inputs:
            name = bam.name[:-len('.dedup.bam')]
            peak = call_peak(args, bam, control, name, Path(args.input_dir).resolve() / 'peaks')
            (peak.parent / (name + '.peaks.final.bed')).write_bytes(peak.read_bytes())
    else:
        globals()[args.action](args)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, RuntimeError, subprocess.CalledProcessError) as error:
        print('CHIPSEQ_DAG_FAILED:', error, file=sys.stderr)
        sys.exit(1)
