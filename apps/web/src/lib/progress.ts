import type { DateString, PaceStatus, ProgressEntry, Target } from './domain';
import { addDays, isInWeek } from './week';

const round = (n: number) => Math.round(n * 100) / 100;

/** Weekly progress = sum of the target's entries whose date falls in that week. */
export function weeklyTotal(
  entries: ProgressEntry[],
  targetId: string,
  weekStart: DateString
): number {
  return round(
    entries
      .filter((e) => e.targetId === targetId && isInWeek(e.date, weekStart))
      .reduce((sum, e) => sum + e.amount, 0)
  );
}

/** Expected = weeklyAmount x (days elapsed in week / 7). */
export function expectedByToday(weeklyAmount: number, daysElapsed: number): number {
  return round(weeklyAmount * (daysElapsed / 7));
}

export function paceStatus(
  progress: number,
  weeklyAmount: number,
  daysElapsed: number
): PaceStatus {
  if (progress >= weeklyAmount) return 'done';
  return progress >= expectedByToday(weeklyAmount, daysElapsed) ? 'on_track' : 'behind';
}

export function remaining(progress: number, weeklyAmount: number): number {
  return round(Math.max(0, weeklyAmount - progress));
}

/** Suggested amount per remaining day; today counts as a remaining day. */
export function perRemainingDay(remainingAmount: number, daysElapsed: number): number {
  const daysLeft = Math.max(1, 8 - daysElapsed);
  return round(remainingAmount / daysLeft);
}

/** Completion 0..1, capped at 100% (an exceeded target still shows the real value elsewhere). */
export function cappedCompletion(progress: number, weeklyAmount: number): number {
  if (weeklyAmount <= 0) return 0;
  return Math.min(1, progress / weeklyAmount);
}

/** Weekly score: average capped completion of the given targets (only active ones count). */
export function weeklyScore(
  targets: Target[],
  entries: ProgressEntry[],
  weekStart: DateString
): number {
  const active = targets.filter((t) => t.status === 'active');
  if (active.length === 0) return 0;
  const sum = active.reduce(
    (acc, t) => acc + cappedCompletion(weeklyTotal(entries, t.id, weekStart), t.weeklyAmount),
    0
  );
  return sum / active.length;
}

export interface WeekPoint {
  weekStart: DateString;
  actual: number;
}

/** Totals for the last `weeks` weeks, oldest first, ending with the week of `currentWeekStart`. */
export function weeklyHistory(
  entries: ProgressEntry[],
  targetId: string,
  currentWeekStart: DateString,
  weeks = 8
): WeekPoint[] {
  return Array.from({ length: weeks }, (_, i) => {
    const weekStart = addDays(currentWeekStart, -7 * (weeks - 1 - i));
    return { weekStart, actual: weeklyTotal(entries, targetId, weekStart) };
  });
}

/** Weekly score for each of the last `weeks` weeks, oldest first. */
export function scoreHistory(
  targets: Target[],
  entries: ProgressEntry[],
  currentWeekStart: DateString,
  weeks = 8
): { weekStart: DateString; score: number }[] {
  return Array.from({ length: weeks }, (_, i) => {
    const weekStart = addDays(currentWeekStart, -7 * (weeks - 1 - i));
    return { weekStart, score: weeklyScore(targets, entries, weekStart) };
  });
}
