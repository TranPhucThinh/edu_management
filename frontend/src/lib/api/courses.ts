import { api } from '@/lib/api'
import type { CourseApiPayload } from '@/types/course'

export type CreateCoursePayload = {
  name: string
  tuitionType?: 'PER_SESSION' | 'MONTHLY_FIXED'
  defaultFee?: number
}

/** GET /courses — list courses for the authenticated teacher */
export async function fetchCourses(): Promise<CourseApiPayload[]> {
  const { data } = await api.get<CourseApiPayload[]>('/courses')
  return data
}

/** POST /courses — creates a course for the authenticated teacher */
export async function createCourse(payload: CreateCoursePayload) {
  const { data } = await api.post<unknown>('/courses', payload)
  return data
}
