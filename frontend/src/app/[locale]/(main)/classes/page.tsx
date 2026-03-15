'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { useHeaderActions } from '@/components/layout/HeaderActionsProvider'
import { Button } from '@/components/ui/button'
import { FILTER_CLASSES, FilterClasses } from '@/constants/FilterClasses'
import { ClassCard } from '@/features/classes/ClassCard'
import { ClassFilterTabs } from '@/features/classes/ClassFilterTabs'
import { MOCK_CLASSES } from '@/features/classes/mockData'

export default function ClassesPage() {
  const t = useTranslations('Classes')
  const tMessage = useTranslations('Messages')

  const { setActions } = useHeaderActions()

  const [filter, setFilter] = useState<FilterClasses>(FILTER_CLASSES[0].value)

  const filteredClasses = MOCK_CLASSES.filter((cls) => {
    if (filter === FILTER_CLASSES[0].value) return true
    return cls.status === filter
  })

  useEffect(() => {
    setActions(
      <Button className="hidden md:inline-flex rounded-full px-6 gap-2">
        <Plus className="h-4 w-4" />
        {t('createNewClass')}
      </Button>,
    )

    return () => setActions(null)
  }, [setActions, t])

  return (
    <div className="flex flex-col relative min-h-full">
      {/* Filter Tabs */}
      <ClassFilterTabs
        activeFilter={filter}
        onFilterChange={(filter) => setFilter(filter)}
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
      <div className="flex flex-col md:hidden pb-24">
        {filteredClasses.map((cls) => (
          <ClassCard key={cls.id} data={cls} />
        ))}
        {filteredClasses.length === 0 && (
          <p className="text-center py-10 text-muted-foreground text-sm">
            {tMessage('noClassesFound')}
          </p>
        )}
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <Button
        size="icon"
        className="md:hidden fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full shadow-xl shadow-primary/30 transition-transform active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
