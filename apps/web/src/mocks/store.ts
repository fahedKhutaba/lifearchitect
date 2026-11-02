// In-memory mock data layer. Stands in for the API until the contract exists (#26).
// Screens read and write only through this module.
import { useSyncExternalStore } from 'react';
import type { ProgressEntry, Settings, Target, TargetStatus } from '@/lib/domain';
import { createSeed, MOCK_ACCOUNT, type MockState } from './seed';
import { todayIn } from '@/lib/week';

let state: MockState | null = null;
const listeners = new Set<() => void>();
let counter = 0;

function defaultTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

function init(): MockState {
  const settings: Settings = { timezone: defaultTimezone(), weekStartDay: 0 };
  return createSeed(todayIn(settings.timezone), settings);
}

function getState(): MockState {
  if (!state) state = init();
  return state;
}

function set(next: MockState) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Subscribe a component to the mock data. Client-only: mount before calling. */
export function useMockData(): MockState {
  return useSyncExternalStore(subscribe, getState, getState);
}

const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++counter}`;

export interface TargetInput {
  name: string;
  unit: Target['unit'];
  weeklyAmount: number;
}

export interface EntryInput {
  amount: number;
  date: string;
  note?: string;
}

export const mockApi = {
  createTarget(input: TargetInput): Target {
    const s = getState();
    const target: Target = {
      id: nextId('t'),
      ...input,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    set({ ...s, targets: [...s.targets, target] });
    return target;
  },
  updateTarget(id: string, input: TargetInput) {
    const s = getState();
    set({ ...s, targets: s.targets.map((t) => (t.id === id ? { ...t, ...input } : t)) });
  },
  setTargetStatus(id: string, status: TargetStatus) {
    const s = getState();
    set({ ...s, targets: s.targets.map((t) => (t.id === id ? { ...t, status } : t)) });
  },
  addEntry(targetId: string, input: EntryInput): ProgressEntry {
    const s = getState();
    const entry: ProgressEntry = {
      id: nextId('e'),
      targetId,
      ...input,
      source: 'manual',
      createdAt: new Date().toISOString()
    };
    set({ ...s, entries: [...s.entries, entry] });
    return entry;
  },
  updateEntry(id: string, input: EntryInput) {
    const s = getState();
    set({ ...s, entries: s.entries.map((e) => (e.id === id ? { ...e, ...input } : e)) });
  },
  deleteEntry(id: string) {
    const s = getState();
    set({ ...s, entries: s.entries.filter((e) => e.id !== id) });
  },
  updateSettings(settings: Settings) {
    set({ ...getState(), settings });
  },
  /** Resolves after a short delay, like a network call. */
  async login(email: string, password: string): Promise<{ ok: boolean }> {
    await new Promise((r) => setTimeout(r, 400));
    return { ok: email === MOCK_ACCOUNT.email && password === MOCK_ACCOUNT.password };
  }
};

export { MOCK_ACCOUNT };
