'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { loginSchema } from '@/lib/types';
import { loginUser } from '@/actions/loginUser';
import { useState } from 'react';

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    const ok = await loginUser(values);
    if (!ok) {
      setLoading(false);
      form.setError('root', {
        type: 'custom',
        message: 'Niepoprawny adres e-mail lub hasło',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Nazwa użytkownika</FormLabel>
              <FormControl>
                <Input placeholder="Adres e-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Hasło</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Hasło" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription className="ml-auto">
                <Link
                  href="/reset-password"
                  className="hover:text-foreground text-xs underline decoration-1 underline-offset-2 duration-300"
                >
                  Nie pamietam hasła.
                </Link>
              </FormDescription>
            </FormItem>
          )}
        />
        <FormRootError />
        <Button type="submit" disabled={loading}>
          {loading ? 'Logowanie' : 'Zaloguj się'}
        </Button>
      </form>
    </Form>
  );
}

export { LoginForm };
