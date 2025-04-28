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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { userSchema } from '@/lib/types';

type Props = {
  buttonText: string;
  rememberPassword?: boolean;
  onSubmit: (values: z.infer<typeof userSchema>) => void;
};

function UserForm(props: Props) {
  const { buttonText, rememberPassword, onSubmit } = props;

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

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
              {rememberPassword && (
                <FormDescription className="ml-auto">
                  <Link
                    href="/reset-password"
                    className="hover:text-foreground text-xs underline decoration-1 underline-offset-2 duration-300"
                  >
                    Nie pamietam hasła.
                  </Link>
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <Button type="submit">{buttonText}</Button>
      </form>
    </Form>
  );
}

export { UserForm };
