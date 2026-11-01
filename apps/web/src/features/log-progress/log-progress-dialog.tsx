'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ResponsiveOverlay } from '@/components/responsive-overlay';
import { useAppForm } from '@/lib/form';
import type { ProgressEntry, Target } from '@/lib/domain';
import { formatAmount } from '@/lib/units';
import { todayIn } from '@/lib/week';
import { mockApi, useMockData } from '@/mocks/store';

interface LogProgressDialogProps {
  target: Target;
  /** When set, the dialog edits this entry instead of adding one. */
  entry?: ProgressEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogProgressDialog({ target, entry, open, onOpenChange }: LogProgressDialogProps) {
  return (
    <ResponsiveOverlay
      open={open}
      onOpenChange={onOpenChange}
      title={entry ? 'Edit entry' : 'Log progress'}
      description={`${target.name} (${formatAmount(target.weeklyAmount, target.unit)} per week)`}
    >
      {/* Mounted only while open so every opening starts from fresh defaults. */}
      {open && (
        <LogProgressForm target={target} entry={entry} onDone={() => onOpenChange(false)} />
      )}
    </ResponsiveOverlay>
  );
}

function LogProgressForm({
  target,
  entry,
  onDone
}: {
  target: Target;
  entry?: ProgressEntry;
  onDone: () => void;
}) {
  const { settings } = useMockData();
  const today = todayIn(settings.timezone);

  const schema = z.object({
    amount: z
      .number({ error: 'Enter an amount' })
      .positive('Amount must be greater than 0'),
    date: z
      .string()
      .min(1, 'Pick a date')
      .refine((d) => d <= today, 'Date cannot be in the future'),
    note: z.string().max(200, 'Keep the note under 200 characters')
  });

  const form = useAppForm({
    defaultValues: {
      amount: entry?.amount as number | undefined,
      date: entry?.date ?? today,
      note: entry?.note ?? ''
    },
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => {
      const input = {
        amount: value.amount as number,
        date: value.date,
        note: value.note.trim() || undefined
      };
      if (entry) {
        mockApi.updateEntry(entry.id, input);
        toast.success('Entry updated');
      } else {
        mockApi.addEntry(target.id, input);
        toast.success(`Logged ${formatAmount(input.amount, target.unit)}`);
      }
      onDone();
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
      <form.AppField name='amount'>
        {(field) => (
          <field.TextField
            label={`Amount (${target.unit})`}
            type='number'
            inputMode='decimal'
            step='any'
            min={0}
            required
          />
        )}
      </form.AppField>
      <form.AppField name='date'>
        {(field) => <field.TextField label='Date' type='date' max={today} required />}
      </form.AppField>
      <form.AppField name='note'>
        {(field) => <field.TextField label='Note (optional)' type='text' maxLength={200} />}
      </form.AppField>
      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={onDone}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton>{entry ? 'Save' : 'Log progress'}</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
}
