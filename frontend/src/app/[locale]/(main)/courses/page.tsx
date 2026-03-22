'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import { FAB } from '@/components/common/FAB'
import {
  StatusFilterTabs,
  type StatusFilterValue,
} from '@/components/common/StatusFilterTabs'
import { useHeaderActions } from '@/components/layout/HeaderActionsProvider'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/features/courses/CourseCard'
import { useCoursesQuery } from '@/hooks'

const CourseCreateModal = dynamic(
  () =>
    import('@/features/courses/CourseCreateModal').then((m) => m.CourseCreateModal),
  {
    ssr: false,
    loading: () => null,
  },
)

export default function CoursesPage() {
  const t = useTranslations('Courses')
  const tMessage = useTranslations('Messages')
  const tCommon = useTranslations('Common')

  const { setActions } = useHeaderActions()

  const [filter, setFilter] = useState<StatusFilterValue>('all')
  const [open, setOpen] = useState(false)

  const { data: courses = [], isLoading, isError, refetch } = useCoursesQuery()

  const filteredCourses = courses.filter((course) => {
    if (filter === 'all') return true
    if (filter === true) return course.isActive
    if (filter === false) return !course.isActive
    return true
  })

  useEffect(() => {
    setActions(
      <Button
        className="hidden md:inline-flex rounded-full px-6 gap-2"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        {t('createNewCourse')}
      </Button>
    )

    return () => setActions(null)
  }, [setActions, t])

  return (
    <>
      <div className="flex flex-col relative min-h-full">
        <StatusFilterTabs
          activeFilter={filter}
          onFilterChange={setFilter}
          allLabel={t('allCourses')}
        />
        {isLoading && (
          <p className="text-center py-10 text-muted-foreground text-sm">
            {tCommon('loading')}
          </p>
        )}
        {isError && (
          <div className="text-center py-10 space-y-2">
            <p className="text-muted-foreground text-sm">
              {tMessage('coursesLoadError')}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              {tCommon('retry')}
            </Button>
          </div>
        )}
        {!isLoading && !isError && (
          <>
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} data={course} />
              ))}
              {filteredCourses.length === 0 && (
                <p className="col-span-full text-center py-10 text-muted-foreground text-sm">
                  {tMessage('noCoursesFound')}
                </p>
              )}
            </div>

            {/* Mobile List Layout */}
            <div className="flex flex-col md:hidden">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} data={course} />
              ))}
              {filteredCourses.length === 0 && (
                <p className="text-center py-10 text-muted-foreground text-sm">
                  {tMessage('noCoursesFound')}
                </p>
              )}
            </div>
          </>
        )}

        <FAB aria-label={t('createNewCourse')} onClick={() => setOpen(true)} />
      </div>
      <CourseCreateModal
        open={open}
        onOpenChange={setOpen}
        title={t('createNewCourse')}
        description={t('createNewCourseDescription')}
      />
    </>
  )
}
