import { describe, expect, it } from 'vitest';
import { remoteReportCandidates } from './resolveReportPath';

describe('bounded remote report paths', () => {
  it('resolves relative, dot-relative, home-relative and absolute paths', () => {
    expect(remoteReportCandidates('07_report/report.html', '/home/u', ['/project', '/run'])).toEqual(['/project/07_report/report.html', '/run/07_report/report.html']);
    expect(remoteReportCandidates('./07_report/report.html', '/home/u', ['/project', '/project'])).toEqual(['/project/07_report/report.html']);
    expect(remoteReportCandidates('~/reports/r.html', '/home/u', ['/project'])).toEqual(['/home/u/reports/r.html']);
    expect(remoteReportCandidates('/actual/report.html', '/home/u', ['/project'])).toEqual(['/actual/report.html']);
    expect(remoteReportCandidates('report.html', '/home/u')).toEqual(['/home/u/report.html']);
  });
  it('rejects directory escapes, URLs, Windows paths and unbounded hints', () => {
    for (const input of ['../secret.html', '~/../secret.html', 'http://host/r.html', 'C:\\work\\r.html', 'r\0.html']) expect(() => remoteReportCandidates(input, '/home/u', ['/project'])).toThrow();
    expect(() => remoteReportCandidates('r.html', '/home/u', ['relative'])).toThrow();
    expect(() => remoteReportCandidates('r.html', '/home/u', Array(9).fill('/project'))).toThrow();
  });
});
