import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    loaded = importlib.util.module_from_spec(spec)
    sys.modules[name] = loaded
    spec.loader.exec_module(loaded)
    return loaded


native = module('native_report_locale', Path(__file__).with_name('encode_native_report.py'))
hidog = module('hidog_report_locale', Path(__file__).parents[1] / 'hidog/hidogV11_trace_report.py')


class ReportLocaleTests(unittest.TestCase):
    def test_chromatin_cli_uses_run_language_environment_and_explicit_override(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'run.json').write_text(json.dumps({
                'workflowName': 'DAP-seq', 'status': 'waiting_user',
                'steps': [{'n': 1, 'title': 'FastQC', 'status': 'done', 'summary': 'Output verified'},
                          {'n': 2, 'title': 'IDR', 'status': 'pending'}]}), encoding='utf-8')
            (root / 'qc').mkdir()
            (root / 'qc/library_verdict.tsv').write_text(
                'sample\tverdict\treason\nA1\tPASSED\tAll required library QC checks passed\n', encoding='utf-8')
            env = {**os.environ, 'TRACE_REPORT_LANGUAGE': 'en'}
            command = [sys.executable, str(Path(native.__file__)), '--run-dir', directory,
                       '--report-dir', str(root / 'reports'), '--assay', 'dap']
            result = subprocess.run(command, env=env, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            english = (root / 'reports/report.html').read_text(encoding='utf-8')
            self.assertIn('lang="en"', english)
            self.assertIn('Awaiting user confirmation', english)
            self.assertIn('has not been assessed', english)
            self.assertNotRegex(english, r'[\u3400-\u9fff]')
            result = subprocess.run(command + ['--language', 'zh'], env=env, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            chinese = (root / 'reports/report.html').read_text(encoding='utf-8')
            self.assertIn('lang="zh-CN"', chinese)
            self.assertIn('等待用户确认', chinese)
            self.assertIn('共 2 步；完成 1 步', chinese)
            self.assertIn('重复一致性未通过或尚未评估', chinese)
            self.assertNotIn('2 steps;', chinese)
            self.assertEqual(json.loads((root / 'reports/report_summary.json').read_text(encoding='utf-8'))['language'], 'zh')

    def test_dap_idr_evidence_is_displayed_and_failure_is_not_labeled_as_pass(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'qc').mkdir()
            (root / 'idr/final').mkdir(parents=True)
            (root / 'idr/final/TF_A.peaks.final.bed').write_text('chr1\t10\t60\n', encoding='utf-8')
            (root / 'qc/idr_qc.json').write_text(json.dumps({'_dap_idr': {
                'status': 'failed', 'global_idr_threshold': 0.05,
                'groups': {'TF_A': {'status': 'failed', 'accepted_peaks': 0}}}}), encoding='utf-8')
            data = native.collect(directory, directory)
            html, markdown = native.render('DAP-seq', directory, directory, data, 'en', 'dap')
            self.assertIn('IDR-reproducible peak count', html)
            self.assertIn('Failed or not assessed', html)
            self.assertIn('downstream analysis is not recommended', markdown)
            self.assertEqual(data['peaks'][0][1], 1)

    def test_hidog_report_headings_and_html_language_follow_selection(self):
        summary = {'mode': 'amplicon', 'status': 'pass', 'metrics': {'samples': 1},
                   'results': [{'reference': 'ref1', 'sample': 'sample1', 'assigned_reads': 300,
                                'editing_frequency': 35.0, 'depth_status': 'pass'}], 'files': []}
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for language in ('en', 'zh'):
                hidog.write_outputs(summary, root, root / language, language)
            english = (root / 'en/report.md').read_text(encoding='utf-8')
            self.assertIn('Editing frequency (%)', english)
            self.assertNotRegex(english, r'[\u3400-\u9fff]')
            self.assertIn("lang='en'", (root / 'en/report.html').read_text(encoding='utf-8'))
            self.assertIn('编辑频率', (root / 'zh/report.md').read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
