import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { FILTER_CLASSES, FilterClasses } from '@/constants/FilterClasses'

export type FilterValue = (typeof FILTER_CLASSES)[number]['value']

interface ClassFilterTabsProps {
  activeFilter: FilterClasses
  onFilterChange: (filter: FilterClasses) => void
}

export function ClassFilterTabs({
  activeFilter,
  onFilterChange,
}: ClassFilterTabsProps) {
  const t = useTranslations('Classes')

  return (
    <div className="w-full mb-2 md:mb-6">
      {/* --- DESKTOP VIEW (Underlined Tabs) --- */}
      <div className="hidden md:flex border-b border-border mb-6">
        <div className="flex gap-8">
          {FILTER_CLASSES.map((filter) => {
            const isActive = activeFilter === filter.value

            return (
              <Button
                key={filter.value}
                variant="ghost"
                onClick={() => onFilterChange(filter.value)}
                className={cn(
                  'pb-3 h-auto px-0 text-sm font-medium transition-colors relative rounded-none',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t(filter.label)}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {/* --- MOBILE VIEW (Scrolling Pills) --- */}
      <div className="md:hidden w-full overflow-x-auto pb-4 no-scrollbar">
        <div className="flex gap-3 w-max">
          {FILTER_CLASSES.map((filter) => {
            const isActive = activeFilter === filter.value

            return (
              <Button
                key={filter.value}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange(filter.value)}
                className={cn(
                  'rounded-full px-5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent',
                )}
              >
                {t(filter.label)}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
