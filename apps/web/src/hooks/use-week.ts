'use client';

import { useMockData } from '@/mocks/store';
import { daysElapsedInWeek, todayIn, weekStartOf } from '@/lib/week';

/** Mock data plus the current week, derived from the user's timezone and week start day. */
export function useWeek() {
  const data = useMockData();
  const today = todayIn(data.settings.timezone);
  const weekStart = weekStartOf(today, data.settings.weekStartDay);
  const daysElapsed = daysElapsedInWeek(today, weekStart);
  return { ...data, today, weekStart, daysElapsed };
}
