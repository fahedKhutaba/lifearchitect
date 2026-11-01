import { describe, expect, it } from 'vitest';
import type { ProgressEntry, Target } from './domain';
import {
  cappedCompletion,
  expectedByToday,
  paceStatus,
  perRemainingDay,
  remaining,
  scoreHistory,
  weeklyHistory,
  weeklyScore,
  weeklyTotal
} from './progress';

const target = (id: string, weeklyAmount: number, status: Target['status'] = 'active'): Target => ({
  id,
  name: id,
  unit: 'hours',
  weeklyAmount,
  status,
  createdAt: '2026-01-01T00:00:00Z'
});

const entry = (targetId: string, date: string, amount: number): ProgressEntry => ({
  id: `${targetId}-${date}-${amount}`,
  targetId,
  amount,
  date,
  source: 'manual',
  createdAt: '2026-01-01T00:00:00Z'
});

const WEEK = '2026-11-01';

describe('progress', () => {
  it('sums only the target entries inside the week', () => {
    const entries = [
      entry('a', '2026-11-01', 1),
      entry('a', '2026-11-03', 1.5),
      entry('a', '2026-10-31', 4),
      entry('b', '2026-11-02', 9)
    ];
    expect(weeklyTotal(entries, 'a', WEEK)).toBe(2.5);
  });

  it('expects weeklyAmount x days elapsed / 7', () => {
    expect(expectedByToday(5, 7)).toBe(5);
    expect(expectedByToday(7, 3)).toBe(3);
  });

  it('reports pace status', () => {
    expect(paceStatus(5, 5, 2)).toBe('done');
    expect(paceStatus(6, 5, 7)).toBe('done');
    expect(paceStatus(2, 5, 3)).toBe('behind'); // expected 2.14
    expect(paceStatus(2.2, 5, 3)).toBe('on_track');
  });

  it('computes remaining and per-day suggestion', () => {
    expect(remaining(3, 5)).toBe(2);
    expect(remaining(6, 5)).toBe(0);
    // day 5 elapsed: today + 2 days left = 3 days
    expect(perRemainingDay(3, 5)).toBe(1);
    // last day: all remaining today
    expect(perRemainingDay(2, 7)).toBe(2);
  });

  it('caps completion at 100%', () => {
    expect(cappedCompletion(6, 5)).toBe(1);
    expect(cappedCompletion(2.5, 5)).toBe(0.5);
    expect(cappedCompletion(1, 0)).toBe(0);
  });

  it('scores the average of active targets, capped, ignoring paused', () => {
    const targets = [target('a', 5), target('b', 4), target('c', 10, 'paused')];
    const entries = [entry('a', '2026-11-02', 7), entry('b', '2026-11-02', 2), entry('c', '2026-11-02', 1)];
    expect(weeklyScore(targets, entries, WEEK)).toBeCloseTo(0.75);
    expect(weeklyScore([], entries, WEEK)).toBe(0);
  });

  it('builds an 8-week history, oldest first', () => {
    const entries = [entry('a', '2026-11-02', 2), entry('a', '2026-10-20', 3)];
    const h = weeklyHistory(entries, 'a', WEEK, 8);
    expect(h).toHaveLength(8);
    expect(h[7]).toEqual({ weekStart: WEEK, actual: 2 });
    expect(h[5]).toEqual({ weekStart: '2026-10-18', actual: 3 });
    expect(h[0].weekStart).toBe('2026-09-13');
  });

  it('builds a score history', () => {
    const s = scoreHistory([target('a', 4)], [entry('a', '2026-10-20', 2)], WEEK, 3);
    expect(s.map((p) => p.score)).toEqual([0.5, 0, 0]);
  });
});
