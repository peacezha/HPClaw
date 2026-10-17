import argparse
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('dapseq_idr', Path(__file__).with_name('dapseq_idr.py'))
dap = importlib.util.module_from_spec(spec); spec.loader.exec_module(dap)


class DapIdrTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.addCleanup(self.temp.cleanup)
        self.control = self.root / 'control.dedup.bam'; self.control.write_bytes(b'fixture')
        self.args = argparse.Namespace(input_dir=str(self.root), sample_sheet=str(self.root / 'samples.tsv'),
                                       genome_size='14000000000', threads=2, qvalue=.05,
                                       idr_peak_pvalue=.001, idr_threshold=.05)
        self.calls = []

    def sheet(self, records):
        lines = ['sample\ttarget\tcondition\treplicate\tbam\tcontrol_bam\n']
        for name, target, condition, rep in records:
            bam = self.root / (name + '.dedup.bam'); bam.write_bytes(b'fixture')
            lines.append(f'{name}\t{target}\t{condition}\t{rep}\t{bam}\t{self.control}\n')
        Path(self.args.sample_sheet).write_text(''.join(lines), encoding='utf-8')

    @staticmethod
    def peak(start=10, score=4):
        return f'chr1\t{start}\t{start+50}\tpeak\t100\t.\t10\t8\t6\t20\t0.01\t{score}\n'

    def tool(self, *raw):
        args = list(map(str, raw)); self.calls.append(args)
        if args[0] == 'macs2':
            out = Path(args[args.index('--outdir') + 1]); out.mkdir(exist_ok=True, parents=True)
            (out / (args[args.index('-n') + 1] + '_peaks.narrowPeak')).write_text(
                '\t'.join(self.peak().strip().split('\t')[:10]) + '\n', encoding='utf-8')
        if args[:2] == ['samtools', 'merge']:
            Path(args[5]).write_bytes(b'pooled')
        if args[0] == 'idr':
            Path(args[args.index('--output-file') + 1]).write_text(self.peak(), encoding='utf-8')

    def test_global_column_12_and_negative_log_transform(self):
        rows = dap.accepted_idr([self.peak(score=2), self.peak(100, .7)], .05)
        self.assertEqual(list(rows), [('chr1', '10', '60')])
        with self.assertRaises(ValueError): dap.accepted_idr(['chr1\t10\t60'], .05)
        with self.assertRaises(ValueError): dap.accepted_idr([self.peak(score=float('nan'))], .05)

    def test_explicit_groups_and_matched_controls(self):
        self.sheet([('A1', 'TF_A', 'seedling', '1'), ('A2', 'TF_A', 'seedling', '2'),
                    ('B1', 'TF_B', 'seedling', '1'), ('B2', 'TF_B', 'seedling', '2')])
        with patch.object(dap, 'run', self.tool):
            dap.peaks(self.args); dap.idr(self.args)
        comparisons = [a for a in self.calls if a[0] == 'idr']
        self.assertEqual(len(comparisons), 2)
        for call in comparisons:
            pair = call[call.index('--samples') + 1:call.index('--samples') + 3]
            self.assertTrue(all(Path(p).name.startswith('A') for p in pair) or all(Path(p).name.startswith('B') for p in pair))
            self.assertNotIn('control.dedup.bam', ' '.join(pair))
        permissive = [a for a in self.calls if a[0] == 'macs2' and '-p' in a]
        self.assertTrue(permissive)
        self.assertTrue(all(a[a.index('-f')+1] == 'BAMPE' for a in permissive))
        result = json.loads((self.root / 'qc/idr_qc.json').read_text())['_dap_idr']
        self.assertEqual(result['status'], 'pass')
        self.assertEqual(len(result['groups']), 2)
        self.assertTrue(all(r['accepted_peaks'] == 1 for r in result['groups'].values()))
        # The downstream BED retains oracle p/q values, not IDR-transformed scores.
        self.assertTrue(all(p.read_text().split('\t')[7] == '8' for p in (self.root / 'idr/final').glob('*.bed')))

    def test_duplicate_identity_and_control_as_experiment_are_rejected(self):
        self.sheet([('A1', 'TF', 'x', '1'), ('A2', 'TF', 'x', '1')])
        with self.assertRaisesRegex(ValueError, 'Duplicate'): dap.read_groups(self.args.sample_sheet, self.root)
        self.sheet([('control', 'TF', 'x', '1'), ('A2', 'TF', 'x', '2')])
        with self.assertRaisesRegex(ValueError, 'Control BAMs'): dap.read_groups(self.args.sample_sheet, self.root)

    def test_single_replicate_does_not_establish_pass(self):
        self.sheet([('A1', 'TF', 'x', '1')])
        with self.assertRaisesRegex(ValueError, 'not assessable'): dap.idr(self.args)
        result = json.loads((self.root / 'qc/idr_qc.json').read_text())['_dap_idr']
        self.assertEqual(result['status'], 'failed')
        self.assertEqual(next(iter(result['groups'].values()))['status'], 'not_assessed')

    def test_changed_or_invalid_sheet_cannot_reuse_previous_consensus(self):
        self.sheet([('A1', 'TF', 'x', '1'), ('A2', 'TF', 'x', '2')])
        with patch.object(dap, 'run', self.tool):
            dap.peaks(self.args); dap.idr(self.args)
        self.assertEqual(len(list((self.root / 'idr/final').glob('*.bed'))), 1)
        self.sheet([('B1', 'TF_B', 'x', '1'), ('B2', 'TF_B', 'x', '1')])
        with self.assertRaisesRegex(ValueError, 'Duplicate'): dap.idr(self.args)
        self.assertEqual(list((self.root / 'idr/final').glob('*.bed')), [])
        archived = list((self.root / 'idr').glob('previous-final-*/*.bed'))
        self.assertEqual(len(archived), 1)
        self.assertTrue(archived[0].stat().st_size)
        self.assertEqual(json.loads((self.root / 'qc/idr_qc.json').read_text())['_dap_idr']['status'], 'failed')

    def test_zero_peaks_and_failed_command_leave_real_failure_evidence(self):
        self.sheet([('A1', 'TF', 'x', '1'), ('A2', 'TF', 'x', '2')])
        with patch.object(dap, 'run', self.tool): dap.peaks(self.args)
        def bad_tool(*raw):
            self.tool(*raw)
            if str(raw[0]) == 'idr':
                args = list(map(str, raw))
                Path(args[args.index('--output-file')+1]).write_text(self.peak(score=.1))
        with patch.object(dap, 'run', bad_tool), self.assertRaises(ValueError): dap.idr(self.args)
        self.assertEqual(json.loads((self.root/'qc/idr_qc.json').read_text())['_dap_idr']['status'], 'failed')
        self.assertTrue(all(p.stat().st_size == 0 for p in (self.root/'idr/final').glob('*.bed')))
        def failed_tool(*raw):
            if str(raw[0]) == 'idr': raise subprocess.CalledProcessError(2, ['idr'])
            self.tool(*raw)
        with patch.object(dap, 'run', failed_tool), self.assertRaises(subprocess.CalledProcessError): dap.idr(self.args)
        self.assertIn('error', json.loads((self.root/'qc/idr_qc.json').read_text())['_dap_idr'])


if __name__ == '__main__': unittest.main()
