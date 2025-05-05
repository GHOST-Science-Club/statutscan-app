'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetConfirmSchema } from '@/lib/types';
import { useState } from 'react';
import { resetConfirmPassword } from '@/actions/resetConfirmPassword';
import { redirect } from 'next/navigation';

type Props = {
  uid: string;
  token: string;
};

function ResetPassConfirmForm(props: Props) {
  const { uid, token } = props;
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof resetConfirmSchema>>({
    resolver: zodResolver(resetConfirmSchema),
    defaultValues: {
      new_password: '',
      re_new_password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof resetConfirmSchema>) => {
    setLoading(true);
    const ok = await resetConfirmPassword({
      uid,
      token,
      ...values,
    });
    if (ok) {
      redirect('/login');
    } else {
      form.setError('root', {
        message: 'Nie udało się zresetować hasła',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Nowe hasło</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nowe hasło" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="re_new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Potwierdź hasło</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Potwierdź hasło"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormRootError />
        <Button type="submit" disabled={loading}>
          {loading ? 'Ładowanie' : 'Zmień hasło'}
        </Button>
      </form>
    </Form>
  );
}

export { ResetPassConfirmForm };
