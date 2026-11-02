'use client';

import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProgressEntry, Target } from '@/lib/domain';
import { weeklyHistory } from '@/lib/progress';
import { formatAmount } from '@/lib/units';

const config = { actual: { label: 'Logged', color: 'var(--chart-2)' } } satisfies ChartConfig;

export function HistoryChart({
  target,
  entries,
  weekStart
}: {
  target: Target;
  entries: ProgressEntry[];
  weekStart: string;
}) {
  const data = weeklyHistory(entries, target.id, weekStart, 8).map((p) => ({
    week: new Date(`${p.weekStart}T00:00:00Z`).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    }),
    actual: p.actual
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly history</CardTitle>
        <CardDescription>
          Last 8 weeks against the target of {formatAmount(target.weeklyAmount, target.unit)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className='aspect-auto h-52 w-full'>
          <BarChart data={data} margin={{ left: 0, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='week' tickLine={false} axisLine={false} interval='preserveStartEnd' />
            <YAxis tickLine={false} axisLine={false} width={44} />
            <ReferenceLine y={target.weeklyAmount} strokeDasharray='4 4' />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey='actual' fill='var(--color-actual)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
