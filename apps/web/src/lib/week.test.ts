import { describe, expect, it } from 'vitest';
import { addDays, daysElapsedInWeek, diffDays, isInWeek, todayIn, weekStartOf } from './week';

describe('week', () => {
  it('finds the week start for Sunday and Monday weeks', () => {
    // 2026-11-04 is a Wednesday
    expect(weekStartOf('2026-11-04', 0)).toBe('2026-11-01');
    expect(weekStartOf('2026-11-04', 1)).toBe('2026-11-02');
    expect(weekStartOf('2026-11-01', 0)).toBe('2026-11-01');
    expect(weekStartOf('2026-11-01', 1)).toBe('2026-10-26');
  });

  it('adds and diffs days across month ends', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
    expect(diffDays('2026-11-02', '2026-10-30')).toBe(3);
  });

  it('counts elapsed days including today', () => {
    expect(daysElapsedInWeek('2026-11-01', '2026-11-01')).toBe(1);
    expect(daysElapsedInWeek('2026-11-07', '2026-11-01')).toBe(7);
  });

  it('checks week membership', () => {
    expect(isInWeek('2026-11-07', '2026-11-01')).toBe(true);
    expect(isInWeek('2026-11-08', '2026-11-01')).toBe(false);
    expect(isInWeek('2026-10-31', '2026-11-01')).toBe(false);
  });

  it('computes today in a timezone', () => {
    const now = new Date('2026-11-01T23:30:00Z');
    expect(todayIn('UTC', now)).toBe('2026-11-01');
    expect(todayIn('Asia/Tokyo', now)).toBe('2026-11-02');
  });
});
