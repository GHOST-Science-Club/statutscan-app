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

const loginSchema = z.object({
  email: z
    .string({
      errorMap: () => ({
        message: 'Adres e-mail powinien zawierać minimum 5 znaków',
      }),
    })
    .min(5)
    .max(50, {
      message: 'Adres e-mail powinien zawierać minimum 50 znaków',
    }),
  password: z
    .string()
    .min(8, { message: 'Hasło musi zawierać minimum 8 znaków' })
    .max(50, { message: 'Hasło może zawierać maksymalnie 50 znaków' }),
});

type Props = {
  buttonText: string;
  rememberPassword?: boolean;
};

function UserForm(props: Props) {
  const { buttonText, rememberPassword } = props;

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
  }

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
