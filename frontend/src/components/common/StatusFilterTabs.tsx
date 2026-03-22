import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  STATUS_FILTER_VALUES,
  type StatusFilterFlag,
} from '@/constants/Status'

export type StatusFilterValue = 'all' | StatusFilterFlag

interface StatusFilterTabsProps {
  activeFilter: StatusFilterValue
  onFilterChange: (value: StatusFilterValue) => void
  /** Already translated label for the "all" tab, e.g. "All Classes" */
  allLabel: string
}

export function StatusFilterTabs({
  activeFilter,
  onFilterChange,
  allLabel,
}: StatusFilterTabsProps) {
  const tStatus = useTranslations('Status')

  const filters: { value: StatusFilterValue; label: string }[] = [
    { value: 'all', label: allLabel },
    ...STATUS_FILTER_VALUES.map((isActive) => ({
      value: isActive as StatusFilterFlag,
      label: tStatus(isActive ? 'active' : 'inactive'),
    })),
  ]

  return (
    <div className="w-full mb-2">
      {/* --- DESKTOP VIEW (Underlined Tabs) --- */}
      <div className="hidden md:flex border-b border-border mb-6">
        <div className="flex gap-8">
          {filters.map((filter) => {
            const isSelected = activeFilter === filter.value

            return (
              <Button
                key={filter.value === 'all' ? 'all' : String(filter.value)}
                variant="ghost"
                onClick={() => onFilterChange(filter.value)}
                className={cn(
                  'pb-3 h-auto px-0 text-sm font-medium transition-colors relative rounded-none',
                  isSelected
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {filter.label}
                {isSelected && (
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
          {filters.map((filter) => {
            const isSelected = activeFilter === filter.value

            return (
              <Button
                key={filter.value === 'all' ? 'all' : String(filter.value)}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange(filter.value)}
                className={cn(
                  'rounded-full px-5 text-sm font-medium transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent',
                )}
              >
                {filter.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
