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

const codeSchema = z.object({
  code: z.string().min(5).max(50),
});

function EmailConfirm() {
  const form = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: '',
    },
  });

  function onSubmit(values: z.infer<typeof codeSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 *:w-full"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-center leading-5">
                Wysłaliśmy e-mail z kodem weryfikacyjnym na podany adres
              </FormLabel>
              <FormControl>
                <Input placeholder="Wpisz kod" {...field} />
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

export { EmailConfirm };
