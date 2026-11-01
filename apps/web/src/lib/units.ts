import type { PaceStatus, TargetUnit } from './domain';

const num = (n: number) => String(Math.round(n * 10) / 10);

export function formatAmount(amount: number, unit: TargetUnit): string {
  switch (unit) {
    case 'hours':
      return `${num(amount)} h`;
    case 'minutes':
      return `${num(amount)} min`;
    case 'km':
      return `${num(amount)} km`;
    case 'times':
      return amount === 1 ? '1 time' : `${num(amount)} times`;
  }
}

/** Per-day suggestion; sub-hour amounts of an hours target read as minutes. */
export function formatPerDay(perDay: number, unit: TargetUnit): string {
  if (unit === 'hours' && perDay < 1) return `~${Math.round(perDay * 60)} min/day`;
  return `~${formatAmount(perDay, unit)}/day`;
}

export function quickLogAmounts(unit: TargetUnit): number[] {
  switch (unit) {
    case 'hours':
      return [0.5, 1];
    case 'minutes':
      return [15, 30];
    case 'km':
      return [1, 5];
    case 'times':
      return [1];
  }
}

export function formatQuickLog(amount: number, unit: TargetUnit): string {
  if (unit === 'hours' && amount < 1) return `+${Math.round(amount * 60)} min`;
  return `+${formatAmount(amount, unit)}`;
}

export const PACE_LABEL: Record<PaceStatus, string> = {
  on_track: 'On track',
  behind: 'Behind',
  done: 'Done'
};

export const UNIT_OPTIONS: { value: TargetUnit; label: string }[] = [
  { value: 'hours', label: 'Hours' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'times', label: 'Times' },
  { value: 'km', label: 'Kilometres' }
];
