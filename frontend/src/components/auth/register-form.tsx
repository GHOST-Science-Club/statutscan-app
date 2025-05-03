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
import { registerSchema } from '@/lib/types';
import { registerUser } from '@/actions/registerUser';

function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      re_password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const errors = await registerUser(values);
    if (errors) {
      errors.forEach(error => {
        form.setError(error.type, {
          type: 'manual',
          message: error.message,
        });
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="re_password"
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
        <Button type="submit">Utwórz konto</Button>
      </form>
    </Form>
  );
}

export { RegisterForm };
