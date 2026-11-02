// The only place fake data is defined. Everything is generated relative to "today"
// so the prototype always looks current. Fake data only; no real personal data.
import type { ProgressEntry, Settings, Target, TargetUnit } from '@/lib/domain';
import { addDays, weekStartOf } from '@/lib/week';

export interface MockState {
  targets: Target[];
  entries: ProgressEntry[];
  settings: Settings;
}

interface SeedTarget {
  id: string;
  name: string;
  unit: TargetUnit;
  weeklyAmount: number;
  status: Target['status'];
  /** Entries in the current week: [day offset from week start, amount, optional note]. */
  thisWeek: [number, number, string?][];
  /** Share of the weekly amount reached in each of the 8 previous weeks, most recent first. */
  history: number[];
}

const SEED_TARGETS: SeedTarget[] = [
  {
    id: 't-sport',
    name: 'Sport training',
    unit: 'hours',
    weeklyAmount: 5,
    status: 'active',
    thisWeek: [
      [0, 1, 'Easy run'],
      [1, 1.5, 'Gym: legs'],
      [2, 1]
    ],
    history: [1.1, 0.8, 1, 0.6, 0.9, 1, 0.5, 0.7]
  },
  {
    id: 't-read',
    name: 'Reading',
    unit: 'minutes',
    weeklyAmount: 210,
    status: 'active',
    thisWeek: [
      [0, 30],
      [1, 20]
    ],
    history: [0.9, 1, 1.2, 0.7, 0.8, 1, 0.9, 0.6]
  },
  {
    id: 't-deep',
    name: 'Deep-work sessions',
    unit: 'times',
    weeklyAmount: 4,
    status: 'active',
    thisWeek: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1, 'Spec review']
    ],
    history: [0.75, 1, 1, 0.5, 0.75, 1, 0.25, 0.5]
  },
  {
    id: 't-run',
    name: 'Running distance',
    unit: 'km',
    weeklyAmount: 20,
    status: 'active',
    thisWeek: [[1, 6.5]],
    history: [0.6, 0.75, 0.9, 0.5, 1, 0.4, 0.7, 0.8]
  },
  {
    id: 't-guitar',
    name: 'Guitar practice',
    unit: 'hours',
    weeklyAmount: 3,
    status: 'paused',
    thisWeek: [],
    history: [0.5, 0.8, 1, 0.9, 0, 0, 0, 0]
  },
  {
    id: 't-swim',
    name: 'Swimming',
    unit: 'times',
    weeklyAmount: 2,
    status: 'archived',
    thisWeek: [],
    history: [0, 0, 0, 0, 1, 1, 0.5, 1]
  }
];

export function createSeed(today: string, settings: Settings): MockState {
  const weekStart = weekStartOf(today, settings.weekStartDay);
  const createdAt = `${addDays(weekStart, -70)}T09:00:00Z`;
  const targets: Target[] = [];
  const entries: ProgressEntry[] = [];
  let n = 0;

  const push = (t: SeedTarget, date: string, amount: number, note?: string) => {
    if (date > today || amount <= 0) return;
    entries.push({
      id: `e-seed-${++n}`,
      targetId: t.id,
      amount,
      date,
      note,
      source: 'manual',
      createdAt: `${date}T18:00:00Z`
    });
  };

  for (const t of SEED_TARGETS) {
    targets.push({
      id: t.id,
      name: t.name,
      unit: t.unit,
      weeklyAmount: t.weeklyAmount,
      status: t.status,
      createdAt
    });
    for (const [offset, amount, note] of t.thisWeek) {
      push(t, addDays(weekStart, offset), amount, note);
    }
    t.history.forEach((share, i) => {
      const start = addDays(weekStart, -7 * (i + 1));
      const total = Math.round(t.weeklyAmount * share * 2) / 2;
      // Two entries per past week: a bigger one early, a smaller one later.
      const first = Math.round((total * 0.6) / 0.5) * 0.5;
      push(t, addDays(start, 1), first);
      push(t, addDays(start, 4), Math.round((total - first) * 100) / 100);
    });
  }
  return { targets, entries, settings };
}

/** Fake account for the sign-in prototype. */
export const MOCK_ACCOUNT = { email: 'demo@example.com', password: 'demo-password' };
