import { EllipsisVertical, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { StatusBadge } from '@/components/common/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useStatusLabel } from '@/hooks/useStatusLabel'
import { cn } from '@/lib/utils'
import { ClassItem } from '@/types'

interface ClassCardProps {
  data: ClassItem
  className?: string
}

export function ClassCard({ data, className }: ClassCardProps) {
  const tCommon = useTranslations('Common')
  const t = useTranslations('Classes')
  const statusLabel = useStatusLabel(data.isActive)

  return (
    <Card
      className={cn(
        'flex flex-col p-5 gap-0 mb-4 transition-all hover:shadow-md border border-border rounded-xl bg-card',
        className,
      )}
    >
      <div className="flex gap-1 justify-between">
        <div className="flex flex-1 justify-between items-start mb-2">
          <div>
            <h3 className="text-base md:text-lg font-bold leading-tight text-foreground">
              {data.name}
            </h3>
            <p className="text-sm text-muted-foreground md:text-primary font-medium mt-1">
              {data.subject}
            </p>
          </div>

          <StatusBadge isActive={data.isActive} label={statusLabel} variant="pill" />
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-4 justify-between">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="Class actions"
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              {tCommon('edit')}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              {tCommon('remove')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
