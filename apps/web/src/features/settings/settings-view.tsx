'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import { ClientOnly } from '@/components/client-only';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppForm } from '@/lib/form';
import type { WeekStartDay } from '@/lib/domain';
import { mockApi, useMockData } from '@/mocks/store';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_OPTIONS = DAYS.map((label, i) => ({ value: String(i), label }));

const schema = z.object({
  timezone: z.string().min(1, 'Pick a timezone'),
  weekStartDay: z.string().min(1, 'Pick a day')
});

function SettingsForm() {
  const { settings } = useMockData();
  const zones = Intl.supportedValuesOf('timeZone');
  if (!zones.includes(settings.timezone)) zones.unshift(settings.timezone);
  const zoneOptions = zones.map((z) => ({ value: z, label: z.replace(/_/g, ' ') }));

  const form = useAppForm({
    defaultValues: { timezone: settings.timezone, weekStartDay: String(settings.weekStartDay) },
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => {
      mockApi.updateSettings({
        timezone: value.timezone,
        weekStartDay: Number(value.weekStartDay) as WeekStartDay
      });
      toast.success('Settings saved');
    }
  });

  return (
    <form
      noValidate
      className='flex flex-col gap-4'
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppField name='timezone'>
        {(field) => (
          <field.SelectField
            label='Timezone'
            description='Decides which calendar day an entry counts for.'
            options={zoneOptions}
          />
        )}
      </form.AppField>
      <form.AppField name='weekStartDay'>
        {(field) => (
          <field.SelectField
            label='Week starts on'
            description='Weekly progress resets on this day.'
            options={DAY_OPTIONS}
          />
        )}
      </form.AppField>
      <div>
        <form.AppForm>
          <form.SubmitButton>Save settings</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
}

export function SettingsView() {
  return (
    <PageContainer pageTitle='Settings' pageDescription='Timezone and week start day.'>
      <Card className='max-w-xl'>
        <CardHeader>
          <CardTitle>Your week</CardTitle>
          <CardDescription>These apply to This week, history and the weekly score.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientOnly fallback={<Skeleton className='h-48 w-full' />}>
            <SettingsForm />
          </ClientOnly>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
