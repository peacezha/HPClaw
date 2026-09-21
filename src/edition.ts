import { normalizeHpclawEdition } from '@/shared/edition';

const desktopEdition = typeof window !== 'undefined' ? window.hpclawDesktop?.app?.edition : undefined;
const buildEdition = (import.meta as ImportMeta & {
  readonly env?: Readonly<Record<string, string | undefined>>;
}).env?.VITE_HPCLAW_EDITION;

export const HPCLAW_EDITION = normalizeHpclawEdition(
  desktopEdition || buildEdition,
);
export const IS_COMPETITION_EDITION = HPCLAW_EDITION === 'competition';
export const HPCLAW_DISPLAY_NAME = IS_COMPETITION_EDITION ? 'HPClaw 竞赛版' : 'HPClaw';
