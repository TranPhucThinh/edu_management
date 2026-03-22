import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

import { ContentCard } from '@/components/common/ContentCard'
import { FormInputField } from '@/components/form/FormInputField'
import { Form } from '@/components/ui/form'
import { useCourseCreateForm } from '@/hooks'
import { createCourseSchema } from '@/lib/schemas/course'
import { FormSelectField } from '@/components/form/FormSelectField'
import { TUITION_TYPE_SELECT_OPTIONS } from '@/constants/courseSelectOptions'
import { Button } from '@/components/ui/button'

interface CourseCreateFormProps {
  /** Called after the course is created successfully (e.g. close modal). */
  onCreated?: () => void
}

export function CourseCreateForm({ onCreated }: CourseCreateFormProps) {
  const tCommon = useTranslations('Common')
  const tCourse = useTranslations('Courses')
  const tValidation = useTranslations('Courses.validation')

  const courseSchema = createCourseSchema(tValidation)

  const { form, isLoading, onSubmit } = useCourseCreateForm({
    schema: courseSchema,
    onCreated,
  })

  const { control } = form

  return (
    <ContentCard title={tCourse('createNewCourse')}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInputField
            control={control}
            name="name"
            label={tCourse('field.name')}
            placeholder={tCourse('field.namePlaceholder')}
          />
          <FormSelectField
            control={control}
            name="tuitionType"
            label={tCommon('tuitionType')}
            options={[...TUITION_TYPE_SELECT_OPTIONS]}
            getValue={(o) => o.value}
            getLabel={(o) => tCommon(o.labelKey)}
          />
          <FormInputField
            control={control}
            name="defaultFee"
            label={tCommon('defaultFee')}
            placeholder={tCommon('defaultFeePlaceholder')}
            type="number"
            inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium shadow-button transition-all hover:-translate-y-px"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tCommon('loading')}
              </>
            ) : (
              tCourse('button.createCourse')
            )}
          </Button>
        </form>
      </Form>
    </ContentCard>
  )
}
