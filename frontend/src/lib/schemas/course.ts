import * as z from 'zod'

export const createCourseSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, { message: t('nameRequired') }),
    tuitionType: z.enum(['PER_SESSION', 'MONTHLY_FIXED']),
    defaultFee: z.preprocess(
      (v) => {
        if (v === '' || v === undefined || v === null) return undefined
        const n = typeof v === 'number' ? v : Number(v)
        return Number.isNaN(n) ? undefined : n
      },
      z.number().min(0, { message: t('defaultFeeMin') }).optional(),
    ),
  })

export type CreateCourseFormValues = z.infer<
  ReturnType<typeof createCourseSchema>
>
