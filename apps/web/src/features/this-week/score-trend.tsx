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
import { scoreHistory } from '@/lib/progress';

const config = { score: { label: 'Weekly score', color: 'var(--chart-2)' } } satisfies ChartConfig;

const label = (weekStart: string) =>
  new Date(`${weekStart}T00:00:00Z`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });

export function ScoreTrend({
  targets,
  entries,
  weekStart
}: {
  targets: Target[];
  entries: ProgressEntry[];
  weekStart: string;
}) {
  const data = scoreHistory(targets, entries, weekStart, 8).map((p) => ({
    week: label(p.weekStart),
    score: Math.round(p.score * 100)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 8 weeks</CardTitle>
        <CardDescription>Weekly score: average completion of active targets (week start dates)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className='aspect-auto h-52 w-full'>
          <BarChart data={data} margin={{ left: 0, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='week' tickLine={false} axisLine={false} interval='preserveStartEnd' />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} unit='%' width={44} />
            <ReferenceLine y={100} strokeDasharray='4 4' />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey='score' fill='var(--color-score)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
