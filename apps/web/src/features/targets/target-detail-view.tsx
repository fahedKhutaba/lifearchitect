'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import { ClientOnly } from '@/components/client-only';
import { Icons } from '@/components/icons';
import { AlertModal } from '@/components/modal/alert-modal';
import { PaceBadge } from '@/components/pace-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogProgressDialog } from '@/features/log-progress/log-progress-dialog';
import { useWeek } from '@/hooks/use-week';
import type { ProgressEntry } from '@/lib/domain';
import { paceStatus, perRemainingDay, remaining, weeklyTotal } from '@/lib/progress';
import { formatAmount, formatPerDay } from '@/lib/units';
import { isInWeek } from '@/lib/week';
import { mockApi } from '@/mocks/store';
import { HistoryChart } from './history-chart';

const dateLabel = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });

function DetailContent({ id }: { id: string }) {
  const week = useWeek();
  const target = week.targets.find((t) => t.id === id);
  const [logOpen, setLogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<ProgressEntry | null>(null);
  const [deleteEntry, setDeleteEntry] = useState<ProgressEntry | null>(null);

  if (!target) {
    return (
      <PageContainer pageTitle='Target not found' pageDescription='This target does not exist.'>
        <Button render={<Link href='/targets' />} nativeButton={false} variant='outline' className='w-fit'>
          Back to targets
        </Button>
      </PageContainer>
    );
  }

  const progress = weeklyTotal(week.entries, target.id, week.weekStart);
  const left = remaining(progress, target.weeklyAmount);
  const status = paceStatus(progress, target.weeklyAmount, week.daysElapsed);
  const percent = Math.min(100, Math.round((progress / target.weeklyAmount) * 100));
  const thisWeek = week.entries
    .filter((e) => e.targetId === target.id && isInWeek(e.date, week.weekStart))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <PageContainer
      pageTitle={target.name}
      pageDescription={`${formatAmount(target.weeklyAmount, target.unit)} per week`}
      pageHeaderAction={
        <Button size='sm' disabled={target.status === 'archived'} onClick={() => setLogOpen(true)}>
          <Icons.add /> Log progress
        </Button>
      }
    >
      <div className='flex flex-col gap-4'>
        <div>
          <Link href='/targets' className='text-muted-foreground text-sm hover:underline'>
            ← All targets
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>This week</CardDescription>
            <CardTitle className='flex flex-wrap items-center gap-2 text-2xl tabular-nums'>
              {formatAmount(progress, target.unit)}
              {target.status === 'active' ? (
                <PaceBadge status={status} />
              ) : (
                <Badge variant='secondary'>{target.status}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <Progress value={percent} aria-label='Progress this week' />
            <p className='text-muted-foreground text-sm'>
              {left === 0
                ? 'Target reached'
                : `${formatAmount(left, target.unit)} left · ${formatPerDay(
                    perRemainingDay(left, week.daysElapsed),
                    target.unit
                  )}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entries this week</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className='w-10'>
                    <span className='sr-only'>Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {thisWeek.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className='text-muted-foreground h-20 text-center'>
                      Nothing logged this week yet.
                    </TableCell>
                  </TableRow>
                )}
                {thisWeek.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      {dateLabel(e.date)}
                      {e.note && <div className='text-muted-foreground text-xs'>{e.note}</div>}
                    </TableCell>
                    <TableCell className='tabular-nums'>{formatAmount(e.amount, target.unit)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant='ghost' size='icon-sm' aria-label='Entry actions' />}
                        >
                          <Icons.ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => setEditEntry(e)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem variant='destructive' onClick={() => setDeleteEntry(e)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <HistoryChart target={target} entries={week.entries} weekStart={week.weekStart} />
      </div>

      <LogProgressDialog target={target} open={logOpen} onOpenChange={setLogOpen} />
      {editEntry && (
        <LogProgressDialog
          target={target}
          entry={editEntry}
          open
          onOpenChange={(open) => !open && setEditEntry(null)}
        />
      )}
      <AlertModal
        isOpen={deleteEntry !== null}
        onClose={() => setDeleteEntry(null)}
        loading={false}
        title='Delete this entry?'
        description='The weekly total will be recalculated.'
        confirmLabel='Delete'
        onConfirm={() => {
          if (deleteEntry) {
            mockApi.deleteEntry(deleteEntry.id);
            toast.success('Entry deleted');
          }
          setDeleteEntry(null);
        }}
      />
    </PageContainer>
  );
}

export function TargetDetailView({ id }: { id: string }) {
  return (
    <ClientOnly
      fallback={
        <PageContainer pageTitle='Target' pageDescription=''>
          <Skeleton className='h-64 w-full' />
        </PageContainer>
      }
    >
      <DetailContent id={id} />
    </ClientOnly>
  );
}
