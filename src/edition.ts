import { normalizeTraceEdition } from '@/shared/edition';

const desktopEdition = typeof window !== 'undefined' ? window.traceDesktop?.app?.edition : undefined;
const buildEdition = (import.meta as ImportMeta & {
  readonly env?: Readonly<Record<string, string | undefined>>;
}).env?.VITE_TRACE_EDITION;

export const TRACE_EDITION = normalizeTraceEdition(
  desktopEdition || buildEdition,
);
export const IS_COMPETITION_EDITION = TRACE_EDITION === 'competition';
export const TRACE_DISPLAY_NAME = IS_COMPETITION_EDITION ? 'TRACE 竞赛版' : 'TRACE';
