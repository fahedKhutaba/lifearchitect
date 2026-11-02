'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import { ClientOnly } from '@/components/client-only';
import { Icons } from '@/components/icons';
import { AlertModal } from '@/components/modal/alert-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogProgressDialog } from '@/features/log-progress/log-progress-dialog';
import type { Target, TargetStatus } from '@/lib/domain';
import { formatAmount } from '@/lib/units';
import { mockApi, useMockData } from '@/mocks/store';
import { TargetFormSheet } from './target-form-sheet';

type Filter = TargetStatus | 'all';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'archived', label: 'Archived' },
  { value: 'all', label: 'All' }
];

const STATUS_VARIANT = { active: 'default', paused: 'secondary', archived: 'outline' } as const;

function TargetsContent() {
  const { targets } = useMockData();
  const [filter, setFilter] = useState<Filter>('active');
  const [formTarget, setFormTarget] = useState<Target | 'new' | null>(null);
  const [logTarget, setLogTarget] = useState<Target | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Target | null>(null);

  const rows = targets.filter((t) => filter === 'all' || t.status === filter);

  return (
    <PageContainer
      pageTitle='Targets'
      pageDescription='Weekly targets you track progress against.'
      pageHeaderAction={
        <Button size='sm' onClick={() => setFormTarget('new')}>
          <Icons.add /> New target
        </Button>
      }
    >
      <div className='flex flex-col gap-4'>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList className='w-full sm:w-fit'>
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className='rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='w-10'>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className='text-muted-foreground h-24 text-center'>
                    No {filter === 'all' ? '' : filter} targets.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <Link href={`/targets/${t.id}`} className='font-medium hover:underline'>
                      {t.name}
                    </Link>
                    <div className='text-muted-foreground text-xs'>
                      {formatAmount(t.weeklyAmount, t.unit)} per week
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[t.status]}>{t.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant='ghost' size='icon-sm' aria-label={`Actions for ${t.name}`} />}
                      >
                        <Icons.ellipsis />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        {t.status === 'active' && (
                          <DropdownMenuItem onClick={() => setLogTarget(t)}>Log progress</DropdownMenuItem>
                        )}
                        {t.status !== 'archived' && (
                          <DropdownMenuItem onClick={() => setFormTarget(t)}>Edit</DropdownMenuItem>
                        )}
                        {t.status === 'active' && (
                          <DropdownMenuItem
                            onClick={() => {
                              mockApi.setTargetStatus(t.id, 'paused');
                              toast.success(`${t.name} paused`);
                            }}
                          >
                            Pause
                          </DropdownMenuItem>
                        )}
                        {t.status !== 'active' && (
                          <DropdownMenuItem
                            onClick={() => {
                              mockApi.setTargetStatus(t.id, 'active');
                              toast.success(`${t.name} is active`);
                            }}
                          >
                            {t.status === 'paused' ? 'Resume' : 'Restore'}
                          </DropdownMenuItem>
                        )}
                        {t.status !== 'archived' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant='destructive' onClick={() => setArchiveTarget(t)}>
                              Archive
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <TargetFormSheet
        open={formTarget !== null}
        onOpenChange={(open) => !open && setFormTarget(null)}
        target={formTarget === 'new' || formTarget === null ? undefined : formTarget}
      />
      {logTarget && (
        <LogProgressDialog target={logTarget} open onOpenChange={(open) => !open && setLogTarget(null)} />
      )}
      <AlertModal
        isOpen={archiveTarget !== null}
        onClose={() => setArchiveTarget(null)}
        loading={false}
        title={`Archive ${archiveTarget?.name ?? 'target'}?`}
        description='It leaves This week and the weekly score. Its history is kept and you can restore it.'
        confirmLabel='Archive'
        onConfirm={() => {
          if (archiveTarget) {
            mockApi.setTargetStatus(archiveTarget.id, 'archived');
            toast.success(`${archiveTarget.name} archived`);
          }
          setArchiveTarget(null);
        }}
      />
    </PageContainer>
  );
}

export function TargetsView() {
  return (
    <ClientOnly
      fallback={
        <PageContainer pageTitle='Targets' pageDescription=''>
          <Skeleton className='h-64 w-full' />
        </PageContainer>
      }
    >
      <TargetsContent />
    </ClientOnly>
  );
}
