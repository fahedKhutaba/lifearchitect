import type { DateString, WeekStartDay } from './domain';

const DAY_MS = 86_400_000;

function toUtcMs(date: DateString): number {
  const [y, m, d] = date.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function fromUtcMs(ms: number): DateString {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(date: DateString, days: number): DateString {
  return fromUtcMs(toUtcMs(date) + days * DAY_MS);
}

export function diffDays(later: DateString, earlier: DateString): number {
  return Math.round((toUtcMs(later) - toUtcMs(earlier)) / DAY_MS);
}

/** Today's calendar day in the given IANA timezone. */
export function todayIn(timezone: string, now: Date = new Date()): DateString {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
}

/** First day of the week that contains `date`. */
export function weekStartOf(date: DateString, weekStartDay: WeekStartDay): DateString {
  const dow = new Date(toUtcMs(date)).getUTCDay();
  const back = (dow - weekStartDay + 7) % 7;
  return addDays(date, -back);
}

/** Days elapsed in the week, counting `today` itself: 1 (first day) to 7 (last day). */
export function daysElapsedInWeek(today: DateString, weekStart: DateString): number {
  return Math.min(7, Math.max(1, diffDays(today, weekStart) + 1));
}

export function isInWeek(date: DateString, weekStart: DateString): boolean {
  const offset = diffDays(date, weekStart);
  return offset >= 0 && offset < 7;
}
