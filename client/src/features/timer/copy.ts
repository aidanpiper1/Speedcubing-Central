import { formatTime, normalizeScramble, getEvent, type SolveDTO } from '@scc/shared';
import { toast } from '../../store/toast';
import type { SolveAverage } from './stats';

export function copyText(text: string, label = 'Copied to clipboard') {
  navigator.clipboard?.writeText(text).then(
    () => toast.success(label),
    () => toast.error('Copy failed'),
  );
}

// Single solve: "12.34   R U R' U' ..." (scramble spacing normalized).
export function formatSolveCopy(solve: SolveDTO, precision: number): string {
  return `${formatTime(solve.time, solve.penalty, precision)}   ${normalizeScramble(solve.scramble)}`;
}

// Average block with a numbered, scramble-aligned time list. Dropped solves
// (best & worst) are shown in parentheses, every move single-spaced.
export function formatAverageCopy(view: SolveAverage, eventId: string, precision: number): string {
  const evName = getEvent(eventId)?.name ?? eventId;
  const value = view.value === null ? '—' : !isFinite(view.value) ? 'DNF' : formatTime(Math.round(view.value), 'NONE', precision);
  const lines = [`ao${view.size}: ${value} (${evName})`, ''];
  view.window.forEach((s, i) => {
    const dropped = view.droppedIndices.includes(i);
    const t = formatTime(s.time, s.penalty, precision);
    const shown = dropped ? `(${t})` : t;
    lines.push(`${i + 1}. ${shown}\t${normalizeScramble(s.scramble)}`);
  });
  return lines.join('\n');
}
