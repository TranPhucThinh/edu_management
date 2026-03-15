import { Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { StatusBadge } from '@/components/common/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ClassItem } from '@/types'

interface ClassCardProps {
  data: ClassItem
  className?: string
}

export function ClassCard({ data, className }: ClassCardProps) {
  const t = useTranslations('Classes')

  const statusLabel =
    data.status === 'active'
      ? t('statusActive')
      : data.status === 'archived'
        ? t('statusArchived')
        : t('statusUpcoming')

  return (
    <>
      {/* --- DESKTOP VIEW (Grid Card) --- */}
      <Card
        className={cn(
          'hidden md:flex flex-col overflow-hidden transition-all hover:shadow-md border-border p-0 gap-0',
          className,
        )}
      >
        <CardContent className="p-5 flex-1 flex flex-col pt-4 pb-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold leading-tight text-foreground">
              {data.name}
            </h3>
            <StatusBadge status={data.status} label={statusLabel} />
          </div>
          <p className="text-sm text-primary font-medium mb-4">
            {data.subject}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {data.schedule.map((day) => (
              <span
                key={day}
                className="inline-flex items-center rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {day}
              </span>
            ))}
          </div>
        </CardContent>

        {/* Footer actions */}
        <div className="px-5 py-4 mt-auto border-t flex justify-between items-center bg-card">
          <div className="flex items-center text-muted-foreground text-sm">
            <Users className="h-4 w-4 mr-2" />
            <span>{t('students', { count: data.studentCount })}</span>
          </div>
          <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t('viewDetails')}
          </button>
        </div>
      </Card>

      {/* --- MOBILE VIEW (List Item Card) --- */}
      <Card
        className={cn(
          'md:hidden flex flex-col p-5 gap-0 mb-4 transition-all active:scale-[0.98]',
          className,
        )}
      >
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-base font-bold leading-tight text-foreground">
            {data.name}
          </h3>
          <StatusBadge
            status={data.status}
            label={statusLabel}
            variant="pill"
          />
        </div>

        <p className="text-sm text-muted-foreground font-medium mb-4">
          {data.subject}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {data.schedule.map((day) => (
              <span
                key={day}
                className="inline-flex items-center rounded-full bg-secondary/30 px-3 py-1 text-xs font-semibold text-secondary-foreground"
              >
                {day}
              </span>
            ))}
          </div>

          <Badge
            variant="outline"
            className="flex items-center text-primary text-xs font-semibold bg-primary/10 px-3 py-1 rounded-full border-none"
          >
            <Users className="h-3.5 w-3.5 mr-1.5" />
            <span>
              {`${data.studentCount} ${data.studentCount > 1 ? t('students') : t('student')}`}
            </span>
          </Badge>
        </div>
      </Card>
    </>
  )
}
