import { TuitionType } from './common'
import type { ClassItem } from './class'
import type { StudentItem } from './student'

export type CourseItem = {
  id: string
  name: string
  tuitionType?: TuitionType
  defaultFee?: number
  classes?: ClassItem[]
  students?: StudentItem[]
  isActive: boolean
}

export type CourseApiPayload = CourseItem
