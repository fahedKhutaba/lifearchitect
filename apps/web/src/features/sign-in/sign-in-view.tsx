'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppForm } from '@/lib/form';
import { MOCK_ACCOUNT, mockApi } from '@/mocks/store';

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password')
});

export function SignInView() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setError(null);
      const res = await mockApi.login(value.email, value.password);
      if (res.ok) router.push('/this-week');
      else setError('Wrong email or password.');
    }
  });

  return (
    <main className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-xl'>Sign in to LifeArchitect</CardTitle>
          <CardDescription>
            Accounts are created by an admin. Prototype login: {MOCK_ACCOUNT.email} /{' '}
            {MOCK_ACCOUNT.password}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            className='flex flex-col gap-4'
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            {error && (
              <Alert variant='destructive' role='alert'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form.AppField name='email'>
              {(field) => (
                <field.TextField label='Email' type='email' autoComplete='email' required />
              )}
            </form.AppField>
            <form.AppField name='password'>
              {(field) => (
                <field.TextField
                  label='Password'
                  type='password'
                  autoComplete='current-password'
                  required
                />
              )}
            </form.AppField>
            <form.AppForm>
              <form.SubmitButton className='w-full' loadingLabel='Signing in…'>
                Sign in
              </form.SubmitButton>
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
