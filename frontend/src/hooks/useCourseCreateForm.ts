import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

import { createCourse } from '@/lib/api/courses'
import { getValidationErrors } from '@/lib/api-messages'
import { queryKeys } from '@/lib/queryKeys'
import type { CreateCourseFormValues } from '@/lib/schemas/course'

export type UseCourseCreateFormOptions = {
  schema: z.ZodType<CreateCourseFormValues>
  /** Called after successful create (e.g. close modal). */
  onCreated?: () => void
}

export function useCourseCreateForm({
  schema,
  onCreated,
}: UseCourseCreateFormOptions) {
  const qc = useQueryClient()
  const tCourses = useTranslations('Courses')

  const form = useForm<CreateCourseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ZOD v4 and RESOLVER overloads
    resolver: zodResolver(schema as any),
    defaultValues: {
      name: '',
      tuitionType: 'MONTHLY_FIXED',
      defaultFee: undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: (payload: CreateCourseFormValues) =>
      createCourse({
        name: payload.name,
        tuitionType: payload.tuitionType,
        defaultFee: payload.defaultFee,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.courses.list() })
      form.reset({
        name: '',
        tuitionType: 'MONTHLY_FIXED',
        defaultFee: undefined,
      })
      toast.success(tCourses('success.courseCreated'))
      onCreated?.()
    },
    onError: (error) => {
      const err = error as AxiosError<{
        errors?: { field: string; code: string }[]
      }>
      const fieldErrors = err.response?.data?.errors
      if (fieldErrors?.length) {
        const msgs = getValidationErrors(fieldErrors)
        for (const { field, message } of msgs) {
          form.setError(field as keyof CreateCourseFormValues, {
            type: 'server',
            message,
          })
        }
      }
    },
  })

  const onSubmit = (data: CreateCourseFormValues) => {
    mutation.mutate(data)
  }

  return {
    form,
    isLoading: mutation.isPending,
    onSubmit,
  }
}
