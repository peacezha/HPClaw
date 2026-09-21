from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
RUNNER = ROOT / "pipelines" / "hidog" / "hidogV11_hpclaw_runner.py"
REPORTER = ROOT / "pipelines" / "hidog" / "hidogV11_hpclaw_report.py"
HIDOG = ROOT / "pipelines" / "hidog" / "hidogV11.py"


def touch_data(path: Path, data: str = "x\n") -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(data, encoding="utf-8")
    return path


class HidogRunnerTests(unittest.TestCase):
    def run_dry(self, run_dir: Path, *args: str) -> list[str]:
        completed = subprocess.run(
            [
                sys.executable, str(RUNNER), "--hidog", str(HIDOG),
                "--run-dir", str(run_dir), "--dry-run", *args,
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        return json.loads(completed.stdout.splitlines()[-1])

    def test_vector_dry_run_uses_exclusive_spacer_reference(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            read1 = touch_data(root / "r1.fastq")
            read2 = touch_data(root / "r2.fastq")
            barcode = touch_data(root / "barcode.tsv")
            spacer = touch_data(root / "spacer.fa")
            command = self.run_dry(
                root, "vector-trace", "--read1", str(read1), "--read2", str(read2),
                "--barcode", str(barcode), "--anchor", "AACCGG", "--spacer-ref", str(spacer),
            )
            self.assertIn("--spacer-ref", command)
            self.assertNotIn("--guide-manifest", command)
            self.assertIn("--min-sample-anchor-reads", command)

    def test_amplicon_fastq_dry_run_wires_guide_and_output(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            read1 = touch_data(root / "r1.fastq")
            read2 = touch_data(root / "r2.fastq")
            barcode = touch_data(root / "barcode.tsv")
            reference = touch_data(root / "reference.fa", ">ref\nAACCGGTT\n")
            command = self.run_dry(
                root, "amplicon", "--read1", str(read1), "--read2", str(read2),
                "--barcode", str(barcode), "--reference", str(reference),
                "--guide-seq", "AACCGG", "--extra-args", "--min-identity-score 90",
            )
            self.assertIn("--guide-seq", command)
            self.assertIn("--min-identity-score", command)
            self.assertEqual(command[command.index("--outdir") + 1], str(root / "results" / "hidog_run"))

    def test_amplicon_rejects_invalid_umi_input_combination(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            hitom = touch_data(root / "Sequence.xls")
            reference = touch_data(root / "reference.fa", ">ref\nAACCGGTT\n")
            completed = subprocess.run(
                [
                    sys.executable, str(RUNNER), "--hidog", str(HIDOG),
                    "--run-dir", str(root), "--dry-run", "amplicon",
                    "--input-mode", "hitom", "--hitom-xls", str(hitom),
                    "--reference", str(reference), "--guide-seq", "AACCGG",
                    "--umi-mode", "dual-primer",
                ],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertNotEqual(completed.returncode, 0)
            self.assertIn("Hi-TOM", completed.stderr)


class HidogReportTests(unittest.TestCase):
    def test_vector_and_amplicon_reports(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            vector = root / "vector"
            touch_data(
                vector / "spacer_detection.tsv",
                "sample_id\tspacer_id\texact_reads\tanchor_matched_pairs\textracted_spacer_reads\tspacer_fraction\tcall\tsample_status\tno_sgrna_reason\n"
                "S1\tg1\t900\t5000\t1000\t0.9\tPRESENT\tSGRNA_DETECTED\t\n",
            )
            touch_data(vector / "vector_trace_summary.xlsx")
            touch_data(vector / "run_parameters.json", '{"parameters": {}, "run_metrics": {"pairs": 10}}')
            vector_report = root / "vector_report"
            subprocess.run(
                [sys.executable, str(REPORTER), "--mode", "vector-trace", "--input-dir", str(vector), "--report-dir", str(vector_report)],
                check=True,
            )
            vector_summary = json.loads((vector_report / "qc_summary.json").read_text(encoding="utf-8"))
            self.assertEqual(vector_summary["status"], "pass")

            amplicon = root / "amplicon"
            summary_dir = amplicon / "library_summary_by_reference"
            touch_data(
                summary_dir / "refA.stats.tsv",
                "Sample\tAssigned reads\tModified reads\tWildtype reads\tEditing frequency\tEditing frequency support\n"
                "S1\t120\t12\t108\t10.0\tcomputed\n",
            )
            touch_data(
                amplicon / "resume_state.json",
                '{"config": {"min_genotype_depth": 50, "low_depth_warning_threshold": 100}}',
            )
            amplicon_report = root / "amplicon_report"
            subprocess.run(
                [sys.executable, str(REPORTER), "--mode", "amplicon", "--input-dir", str(amplicon), "--report-dir", str(amplicon_report)],
                check=True,
            )
            amplicon_summary = json.loads((amplicon_report / "qc_summary.json").read_text(encoding="utf-8"))
            self.assertEqual(amplicon_summary["status"], "pass")
            self.assertTrue((amplicon_report / "report.html").is_file())


if __name__ == "__main__":
    unittest.main()
