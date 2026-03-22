import { useQuery } from '@tanstack/react-query'

import { fetchCourses } from '@/lib/api/courses'
import { mapApiCourseToCourseItem } from '@/lib/mappers/course'
import { queryKeys } from '@/lib/queryKeys'
import type { CourseItem } from '@/types/course'

export function useCoursesQuery() {
  return useQuery({
    queryKey: queryKeys.courses.list(),
    queryFn: async (): Promise<CourseItem[]> => {
      const courses = await fetchCourses()
      return courses.map(mapApiCourseToCourseItem)
    },
  })
}
