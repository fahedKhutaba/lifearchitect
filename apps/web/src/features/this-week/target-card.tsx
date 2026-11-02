'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { PaceBadge } from '@/components/pace-badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ProgressEntry, Target } from '@/lib/domain';
import { paceStatus, perRemainingDay, remaining, weeklyTotal } from '@/lib/progress';
import { formatAmount, formatPerDay, formatQuickLog, quickLogAmounts } from '@/lib/units';
import { mockApi } from '@/mocks/store';

interface TargetCardProps {
  target: Target;
  entries: ProgressEntry[];
  weekStart: string;
  today: string;
  daysElapsed: number;
  onLog: (target: Target) => void;
}

export function TargetCard({ target, entries, weekStart, today, daysElapsed, onLog }: TargetCardProps) {
  const progress = weeklyTotal(entries, target.id, weekStart);
  const status = paceStatus(progress, target.weeklyAmount, daysElapsed);
  const left = remaining(progress, target.weeklyAmount);
  const percent = Math.min(100, Math.round((progress / target.weeklyAmount) * 100));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/targets/${target.id}`} className='hover:underline'>
            {target.name}
          </Link>
        </CardTitle>
        <CardAction>
          <PaceBadge status={status} />
        </CardAction>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <div className='flex items-baseline justify-between gap-2'>
          <span className='text-2xl font-semibold tabular-nums'>
            {formatAmount(progress, target.unit)}
          </span>
          <span className='text-muted-foreground text-sm'>
            of {formatAmount(target.weeklyAmount, target.unit)}
          </span>
        </div>
        <Progress value={percent} aria-label={`${target.name} progress`} />
        <p className='text-muted-foreground text-sm'>
          {left === 0
            ? progress > target.weeklyAmount
              ? `Exceeded by ${formatAmount(progress - target.weeklyAmount, target.unit)}`
              : 'Target reached'
            : `${formatAmount(left, target.unit)} left · ${formatPerDay(
                perRemainingDay(left, daysElapsed),
                target.unit
              )}`}
        </p>
        <div className='flex flex-wrap gap-2'>
          {quickLogAmounts(target.unit).map((amount) => (
            <Button
              key={amount}
              size='sm'
              variant='outline'
              onClick={() => {
                mockApi.addEntry(target.id, { amount, date: today });
                toast.success(`${target.name}: ${formatQuickLog(amount, target.unit)}`);
              }}
            >
              {formatQuickLog(amount, target.unit)}
            </Button>
          ))}
          <Button size='sm' variant='ghost' onClick={() => onLog(target)}>
            Log…
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
