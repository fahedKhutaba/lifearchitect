'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useAppForm } from '@/lib/form';
import type { Target, TargetUnit } from '@/lib/domain';
import { UNIT_OPTIONS } from '@/lib/units';
import { mockApi } from '@/mocks/store';

const schema = z.object({
  name: z.string().trim().min(1, 'Enter a name').max(60, 'Keep the name under 60 characters'),
  unit: z.enum(['hours', 'minutes', 'times', 'km'], { error: 'Pick a unit' }),
  weeklyAmount: z.number({ error: 'Enter a weekly amount' }).positive('Must be greater than 0')
});

interface TargetFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, edits this target; otherwise creates one. */
  target?: Target;
}

export function TargetFormSheet({ open, onOpenChange, target }: TargetFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-sm'>
        <SheetHeader>
          <SheetTitle>{target ? 'Edit target' : 'New target'}</SheetTitle>
          <SheetDescription>
            {target
              ? 'Changes apply from now on.'
              : 'Set an amount to reach each week, e.g. Sport training, 5 hours.'}
          </SheetDescription>
        </SheetHeader>
        {open && <TargetForm target={target} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  );
}

function TargetForm({ target, onDone }: { target?: Target; onDone: () => void }) {
  const form = useAppForm({
    defaultValues: {
      name: target?.name ?? '',
      unit: (target?.unit ?? 'hours') as TargetUnit,
      weeklyAmount: target?.weeklyAmount as number | undefined
    },
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => {
      const input = {
        name: value.name.trim(),
        unit: value.unit,
        weeklyAmount: value.weeklyAmount as number
      };
      if (target) {
        mockApi.updateTarget(target.id, input);
        toast.success('Target updated');
      } else {
        mockApi.createTarget(input);
        toast.success('Target created');
      }
      onDone();
    }
  });

  return (
    <form
      noValidate
      className='flex flex-col gap-4 px-4 pb-4'
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppField name='name'>
        {(field) => <field.TextField label='Name' type='text' maxLength={60} required />}
      </form.AppField>
      <form.AppField name='unit'>
        {(field) => <field.SelectField label='Unit' options={UNIT_OPTIONS} required />}
      </form.AppField>
      <form.AppField name='weeklyAmount'>
        {(field) => (
          <field.TextField
            label='Weekly amount'
            type='number'
            inputMode='decimal'
            step='any'
            min={0}
            required
          />
        )}
      </form.AppField>
      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={onDone}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton>{target ? 'Save' : 'Create target'}</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
}
