import type { TuitionType } from '@/types/common'
import type { ClassItem } from '@/types/class'
import type { CourseApiPayload, CourseItem } from '@/types/course'

function parseDecimal(value: string | number | undefined): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

export function mapApiCourseToCourseItem(row: CourseApiPayload): CourseItem {
  return {
    id: row.id,
    name: row.name,
    tuitionType: row.tuitionType as TuitionType,
    defaultFee: parseDecimal(row.defaultFee),
    classes: (row.classes ?? []) as ClassItem[],
    students: [],
    isActive: row.isActive,
  }
}
