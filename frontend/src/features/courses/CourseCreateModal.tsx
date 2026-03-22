'use client'

import { ResponsiveModal } from '@/components/common/ResponsiveModal'
import { CourseCreateForm } from '@/features/courses/CourseCreateForm'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
}

export function CourseCreateModal({
  open,
  onOpenChange,
  title,
  description,
}: Props) {
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      headerClassName="items-start"
    >
      <CourseCreateForm onCreated={() => onOpenChange(false)} />
    </ResponsiveModal>
  )
}
