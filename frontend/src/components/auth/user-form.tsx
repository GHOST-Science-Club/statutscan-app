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

const loginSchema = z.object({
  username: z
    .string({
      errorMap: () => ({
        message: 'Nazwa użytkownika musi zawierać minimum 5 znaków',
      }),
    })
    .min(5)
    .max(50, {
      message: 'Nazwa użytkownika może zawierać maksymalnie 50 znaków',
    }),
  password: z
    .string()
    .min(8, { message: 'Hasło musi zawierać minimum 8 znaków' })
    .max(50, { message: 'Hasło może zawierać maksymalnie 50 znaków' }),
});

type Props = {
  buttonText: string;
};

function UserForm(props: Props) {
  const { buttonText } = props;

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Nazwa użytkownika</FormLabel>
              <FormControl>
                <Input placeholder="Adres-email" {...field} />
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
                <Input placeholder="Hasło" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{buttonText}</Button>
      </form>
    </Form>
  );
}

export { UserForm };
