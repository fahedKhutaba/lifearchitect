// Domain types for the V1 prototype, typed from docs/product/v1-scope.md.
// To be replaced by generated contract types after the contract exists (#26).

export type TargetUnit = 'hours' | 'minutes' | 'times' | 'km';
export type TargetStatus = 'active' | 'paused' | 'archived';
export type PaceStatus = 'on_track' | 'behind' | 'done';

/** Calendar day as `YYYY-MM-DD`. */
export type DateString = string;

/** 0 = Sunday ... 6 = Saturday. */
export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Target {
  id: string;
  name: string;
  unit: TargetUnit;
  weeklyAmount: number;
  status: TargetStatus;
  createdAt: string;
}

export interface ProgressEntry {
  id: string;
  targetId: string;
  amount: number;
  date: DateString;
  note?: string;
  source: 'manual';
  externalId?: string;
  createdAt: string;
}

export interface Settings {
  timezone: string;
  weekStartDay: WeekStartDay;
}
