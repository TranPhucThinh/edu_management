'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { FAB } from '@/components/common/FAB'
import { StatusFilterTabs, type StatusFilterValue } from '@/components/common/StatusFilterTabs'
import { useHeaderActions } from '@/components/layout/HeaderActionsProvider'
import { Button } from '@/components/ui/button'
import { ClassCard } from '@/features/classes/ClassCard'
import { MOCK_CLASSES } from '@/features/classes/mockData'

export default function ClassesPage() {
  const t = useTranslations('Classes')
  const tMessage = useTranslations('Messages')

  const { setActions } = useHeaderActions()

  const [filter, setFilter] = useState<StatusFilterValue>('all')

  const filteredClasses = MOCK_CLASSES.filter((cls) => {
    if (filter === 'all') return true
    if (filter === true) return cls.isActive
    if (filter === false) return !cls.isActive
    return true
  })

  useEffect(() => {
    setActions(
      <Button className="hidden md:inline-flex rounded-full px-6 gap-2">
        <Plus className="h-4 w-4" />
        {t('createNewClass')}
      </Button>
    )

    return () => setActions(null)
  }, [setActions, t])

  return (
    <div className="flex flex-col relative min-h-full">
      {/* Filter Tabs */}
      <StatusFilterTabs
        activeFilter={filter}
        onFilterChange={setFilter}
        allLabel={t('allClasses')}
      />

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {filteredClasses.map((cls) => (
          <ClassCard key={cls.id} data={cls} />
        ))}
        {filteredClasses.length === 0 && (
          <p className="col-span-full text-center py-10 text-muted-foreground text-sm">
            {tMessage('noClassesFound')}
          </p>
        )}
      </div>

      {/* Mobile List Layout */}
      <div className="flex flex-col md:hidden">
        {filteredClasses.map((cls) => (
          <ClassCard key={cls.id} data={cls} />
        ))}
        {filteredClasses.length === 0 && (
          <p className="text-center py-10 text-muted-foreground text-sm">
            {tMessage('noClassesFound')}
          </p>
        )}
      </div>

      <FAB aria-label={t('createNewClass')} />
    </div>
  )
}
