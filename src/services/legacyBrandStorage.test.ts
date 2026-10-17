// @vitest-environment jsdom
import { beforeEach, expect, it } from 'vitest';
import { migrateLegacyBrowserStorage } from './legacyBrandStorage';
beforeEach(() => localStorage.clear());
it('migrates settings and keeps raw paths, encrypted values and rollback keys verbatim', () => {
  localStorage.setItem('hpclaw_theme', 'light'); localStorage.setItem('hpclaw_ai_profile', 'enc:v1:unchanged');
  localStorage.setItem('hpclaw_workflow_run_config_v1:wf', '{"path":"/home/u/hpclaw_flows/old"}');
  localStorage.setItem('unrelated', 'untouched');
  migrateLegacyBrowserStorage(localStorage);
  expect(localStorage.getItem('trace_theme')).toBe('light'); expect(localStorage.getItem('trace_ai_profile')).toBe('enc:v1:unchanged');
  expect(localStorage.getItem('trace_workflow_run_config_v1:wf')).toBe('{"path":"/home/u/hpclaw_flows/old"}');
  expect(localStorage.getItem('hpclaw_theme')).toBe('light'); expect(localStorage.getItem('unrelated')).toBe('untouched');
});
it('keeps existing TRACE preferences even if the old value differs', () => {
  localStorage.setItem('hpclaw_language', 'zh-CN'); localStorage.setItem('trace_language', 'en-US');
  migrateLegacyBrowserStorage(localStorage); migrateLegacyBrowserStorage(localStorage);
  expect(localStorage.getItem('trace_language')).toBe('en-US');
});
