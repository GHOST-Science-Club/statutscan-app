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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetConfirmSchema, resetSchema } from '@/lib/types';
import { redirect } from 'next/navigation';
import { resetConfirmPassword } from '@/actions/resetConfirmPassword';
import { useState } from 'react';
import { resetPassword } from '@/actions/resetPassword';

function ResetPassForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof resetSchema>) => {
    setLoading(true);
    const ok = await resetPassword(values);
    if (!ok) {
      setLoading(false);
      form.setError('email', {
        type: 'custom',
        message: 'Nie istnieje konto z podanym adresem e-mail',
      });
    } else redirect('/confirm/pass');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Podaj adres e-mail na który wyślemy link do resetu hasła
              </FormLabel>
              <FormControl>
                <Input type="Adres e-mail" placeholder="E-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Wsyłanie' : 'Wyślij'}
        </Button>
      </form>
    </Form>
  );
}

export { ResetPassForm };
