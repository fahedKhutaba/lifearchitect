import { describe, expect, it } from 'vitest';
import { formatAmount, formatPerDay, formatQuickLog, quickLogAmounts } from './units';

describe('units', () => {
  it('formats amounts per unit', () => {
    expect(formatAmount(1.5, 'hours')).toBe('1.5 h');
    expect(formatAmount(30, 'minutes')).toBe('30 min');
    expect(formatAmount(1, 'times')).toBe('1 time');
    expect(formatAmount(3, 'times')).toBe('3 times');
    expect(formatAmount(12.34, 'km')).toBe('12.3 km');
  });

  it('shows sub-hour per-day suggestions as minutes', () => {
    expect(formatPerDay(0.5, 'hours')).toBe('~30 min/day');
    expect(formatPerDay(1.5, 'hours')).toBe('~1.5 h/day');
  });

  it('offers quick-log defaults per unit', () => {
    expect(quickLogAmounts('hours').map((a) => formatQuickLog(a, 'hours'))).toEqual(['+30 min', '+1 h']);
    expect(quickLogAmounts('times')).toEqual([1]);
  });
});
