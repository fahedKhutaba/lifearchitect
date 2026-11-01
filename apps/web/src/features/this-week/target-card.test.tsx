import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { ProgressEntry, Target } from '@/lib/domain';
import { mockApi } from '@/mocks/store';
import { TargetCard } from './target-card';

const target: Target = {
  id: 't1',
  name: 'Sport training',
  unit: 'hours',
  weeklyAmount: 5,
  status: 'active',
  createdAt: '2026-01-01T00:00:00Z'
};

const entry = (amount: number, date: string): ProgressEntry => ({
  id: `${date}-${amount}`,
  targetId: 't1',
  amount,
  date,
  source: 'manual',
  createdAt: '2026-01-01T00:00:00Z'
});

const props = { weekStart: '2026-11-01', today: '2026-11-04', daysElapsed: 4, onLog: () => {} };

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it('shows progress, pace and what is left', () => {
  render(<TargetCard {...props} target={target} entries={[entry(1, '2026-11-02')]} />);
  expect(screen.getByText('Behind')).toBeDefined(); // expected 2.86 h by day 4
  expect(screen.getByText('of 5 h')).toBeDefined();
  expect(screen.getByText('4 h left · ~1 h/day')).toBeDefined();
});

it('shows Done when the target is reached', () => {
  render(<TargetCard {...props} target={target} entries={[entry(5, '2026-11-02')]} />);
  expect(screen.getByText('Done')).toBeDefined();
  expect(screen.getByText('Target reached')).toBeDefined();
});

it('quick-log adds an entry for today', () => {
  const add = vi.spyOn(mockApi, 'addEntry').mockReturnValue(entry(1, '2026-11-04'));
  render(<TargetCard {...props} target={target} entries={[]} />);
  fireEvent.click(screen.getByRole('button', { name: '+1 h' }));
  expect(add).toHaveBeenCalledWith('t1', { amount: 1, date: '2026-11-04' });
});
