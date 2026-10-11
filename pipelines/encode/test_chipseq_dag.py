import io
import math
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import chipseq_dag as dag
from argparse import Namespace


class ReproducibilityTests(unittest.TestCase):
    def test_split_is_complementary_pair_preserving_and_deterministic(self):
        header = '@HD\tVN:1.6\n'
        records = ['q%d\t%d\tchr1\t1\t60\t1M\t=\t2\t1\tA\tI\tRG:Z:r\n' % (q, flag)
                   for q in range(100) for flag in (99, 147)]
        a, b = io.StringIO(), io.StringIO()
        counts = dag.split_sam([header] + records, a, b, 'library')
        halves = [s.getvalue().splitlines()[1:] for s in (a, b)]
        self.assertEqual(sum(counts), len(records))
        self.assertFalse(set(halves[0]) & set(halves[1]))
        self.assertEqual(set(halves[0] + halves[1]), set(r.strip() for r in records))
        for half in halves:
            names = [line.split('\t')[0] for line in half]
            self.assertTrue(all(names.count(name) == 2 for name in set(names)))
        again = [io.StringIO(), io.StringIO()]
        dag.split_sam([header] + records, *again, 'library')
        self.assertEqual([s.getvalue() for s in again], [a.getvalue(), b.getvalue()])

    def test_global_idr_column_and_transformed_threshold(self):
        def row(local, global_):
            return '\t'.join(['chr1', '1', '2', 'peak', '1000', '.', '1', '1', '1', '1', str(local), str(global_)]) + '\n'
        lines = [row(0, 1), row(5, -math.log10(.05)), row(8, 2)]
        self.assertEqual(len(dag.accepted_idr(lines)), 2)
        self.assertRaises(ValueError, dag.accepted_idr, ['chr1\t1\t2'])
        self.assertRaises(ValueError, dag.accepted_idr, [row(1, float('nan'))])

    def test_missing_zero_and_single_replicate_never_pass(self):
        self.assertEqual(dag.reproducibility([], [100], None)['status'], 'not_assessed')
        self.assertEqual(dag.reproducibility([0], [100, 100], 100)['status'], 'failed')
        self.assertEqual(dag.reproducibility([100], [50, 500], 100)['status'], 'borderline')
        self.assertEqual(dag.reproducibility([100], [50, 500], 500)['status'], 'failed')
        self.assertEqual(dag.reproducibility([100], [80, 100], 150)['status'], 'pass')

    def test_pooling_uses_the_corresponding_halves_not_another_random_split(self):
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp); data = base / 'data'; control = base / 'control'
            data.mkdir(); control.mkdir()
            for name in ['r1', 'r2']:
                (data / (name + '.dedup.bam')).touch()
            (control / 'input.dedup.bam').touch()
            args = Namespace(input_dir=str(data), control_dir=str(control), threads=2, genome_size='hs', qvalue=.05)
            with patch.object(dag, 'split_bam') as split, patch.object(dag, 'run') as run, patch.object(dag, 'call_peak'):
                dag.pseudoreplicates(args)
                self.assertEqual(split.call_count, 2)
                merges = [call.args for call in run.call_args_list if call.args[1] == 'merge']
                self.assertEqual(len(merges), 3)
                self.assertTrue(all(str(p).endswith('.pr1.bam') for p in merges[1][6:]))
                self.assertTrue(all(str(p).endswith('.pr2.bam') for p in merges[2][6:]))
            (control / 'another.dedup.bam').touch()
            self.assertRaises(ValueError, dag.libraries, args)


if __name__ == '__main__':
    unittest.main()
