import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string({
      errorMap: () => ({
        message: 'Adres e-mail powinien zawierać minimum 5 znaków',
      }),
    })
    .min(5)
    .max(50, {
      message: 'Adres e-mail powinien zawierać maksymalnie 50 znaków',
    })
    .email('Niepoprawny adres e-mail'),
  password: z
    .string()
    .min(8, { message: 'Hasło musi zawierać minimum 8 znaków' })
    .max(50, { message: 'Hasło może zawierać maksymalnie 50 znaków' }),
});

const registerSchema = loginSchema
  .extend({
    re_password: z.string(),
  })
  .refine(data => data.password === data.re_password, {
    message: 'Hasła muszą być takie same',
    path: ['re_password'],
  });

const resetSchema = z.object({
  email: z
    .string({
      errorMap: () => ({
        message: 'Adres e-mail powinien zawierać minimum 5 znaków',
      }),
    })
    .min(5)
    .max(50, {
      message: 'Adres e-mail powinien zawierać minimum 50 znaków',
    })
    .email('Niepoprawny adres e-mail'),
});

const resetConfirmSchema = z
  .object({
    new_password: z
      .string()
      .min(8, { message: 'Hasło musi zawierać minimum 8 znaków' })
      .max(50, { message: 'Hasło może zawierać maksymalnie 50 znaków' }),
    re_new_password: z.string(),
  })
  .refine(data => data.new_password === data.re_new_password, {
    message: 'Hasła muszą być takie same',
    path: ['re_new_password'],
  });

export { loginSchema, registerSchema, resetSchema, resetConfirmSchema };
