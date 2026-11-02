'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientOnly } from '@/components/client-only';
import { LogProgressDialog } from '@/features/log-progress/log-progress-dialog';
import { useWeek } from '@/hooks/use-week';
import type { Target } from '@/lib/domain';
import { weeklyScore } from '@/lib/progress';
import { addDays } from '@/lib/week';
import { ScoreTrend } from './score-trend';
import { TargetCard } from './target-card';

function range(start: string) {
  const fmt = (d: string) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  return `${fmt(start)} – ${fmt(addDays(start, 6))}`;
}

function Loading() {
  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className='h-48 w-full' />
      ))}
    </div>
  );
}

function ThisWeekContent() {
  const week = useWeek();
  const [logTarget, setLogTarget] = useState<Target | null>(null);
  const active = week.targets.filter((t) => t.status === 'active');
  const score = Math.round(weeklyScore(week.targets, week.entries, week.weekStart) * 100);

  return (
    <PageContainer
      pageTitle='This week'
      pageDescription={range(week.weekStart)}
      pageHeaderAction={
        <Button render={<Link href='/targets' />} nativeButton={false} variant='outline' size='sm'>
          Manage targets
        </Button>
      }
    >
      <div className='flex flex-col gap-4'>
        <Card>
          <CardHeader>
            <CardDescription>Weekly score</CardDescription>
            <CardTitle className='text-3xl tabular-nums'>{score}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={score} aria-label='Weekly score' />
          </CardContent>
        </Card>

        {active.length === 0 ? (
          <Card>
            <CardContent className='text-muted-foreground py-6 text-center text-sm'>
              No active targets.{' '}
              <Link href='/targets' className='underline'>
                Create one
              </Link>
              .
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {active.map((t) => (
              <TargetCard
                key={t.id}
                target={t}
                entries={week.entries}
                weekStart={week.weekStart}
                today={week.today}
                daysElapsed={week.daysElapsed}
                onLog={setLogTarget}
              />
            ))}
          </div>
        )}

        <ScoreTrend targets={week.targets} entries={week.entries} weekStart={week.weekStart} />
      </div>
      {logTarget && (
        <LogProgressDialog
          target={logTarget}
          open
          onOpenChange={(open) => !open && setLogTarget(null)}
        />
      )}
    </PageContainer>
  );
}

export function ThisWeekView() {
  return (
    <ClientOnly fallback={<PageContainer pageTitle='This week' pageDescription=''><Loading /></PageContainer>}>
      <ThisWeekContent />
    </ClientOnly>
  );
}
