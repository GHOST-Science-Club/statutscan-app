import { z } from 'zod';

const userSchema = z.object({
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

export { userSchema };
