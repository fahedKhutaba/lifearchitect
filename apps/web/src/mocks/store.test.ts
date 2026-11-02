import { describe, expect, it } from 'vitest';
import { weeklyScore } from '@/lib/progress';
import { daysElapsedInWeek, todayIn, weekStartOf } from '@/lib/week';
import { createSeed } from './seed';

describe('mock seed', () => {
  const settings = { timezone: 'UTC', weekStartDay: 0 } as const;
  const today = todayIn('UTC', new Date('2026-11-04T12:00:00Z'));
  const seed = createSeed(today, settings);

  it('has targets in every status', () => {
    const statuses = new Set(seed.targets.map((t) => t.status));
    expect(statuses).toEqual(new Set(['active', 'paused', 'archived']));
  });

  it('never has entries in the future and all reference a target', () => {
    const ids = new Set(seed.targets.map((t) => t.id));
    for (const e of seed.entries) {
      expect(e.date <= today).toBe(true);
      expect(ids.has(e.targetId)).toBe(true);
    }
  });

  it('gives a score between 0 and 1 for the current week', () => {
    const weekStart = weekStartOf(today, 0);
    expect(daysElapsedInWeek(today, weekStart)).toBe(4);
    const score = weeklyScore(seed.targets, seed.entries, weekStart);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});
