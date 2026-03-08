import * as z from 'zod'

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t('emailRequired') })
      .email({ message: t('emailInvalid') }),
    password: z
      .string()
      .min(1, { message: t('passwordRequired') })
      .min(6, { message: t('passwordMin') }),
  })

export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z
        .string()
        .min(1, { message: t('emailRequired') })
        .email({ message: t('emailInvalid') }),
      password: z
        .string()
        .min(1, { message: t('passwordRequired') })
        .min(6, { message: t('passwordMin') }),
      confirmPassword: z
        .string()
        .min(1, { message: t('passwordRequired') })
        .min(6, { message: t('passwordMin') }),
      fullName: z
        .string()
        .min(1, { message: t('fullNameRequired') })
        .min(2, { message: t('fullNameTooShort') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('confirmPasswordMatch'),
      path: ['confirmPassword'],
    })

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>
