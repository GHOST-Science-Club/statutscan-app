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

const resetSchema = z.object({
  mail: z
    .string({
      errorMap: () => ({
        message: 'Adres e-mail powinien zawierać minimum 5 znaków',
      }),
    })
    .min(5)
    .max(50, {
      message: 'Adres e-mail powinien zawierać minimum 50 znaków',
    }),
});

function ResetForm() {
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      mail: '',
    },
  });

  function onSubmit(values: z.infer<typeof resetSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="mail"
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
        <Button type="submit">Wyślij</Button>
      </form>
    </Form>
  );
}

export { ResetForm };
