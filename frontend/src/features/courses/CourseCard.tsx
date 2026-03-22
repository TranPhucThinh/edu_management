import { CalendarDays, EllipsisVertical, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useStatusLabel } from '@/hooks'
import { cn } from '@/lib/utils'
import { CourseItem } from '@/types'

interface CourseCardProps {
  data: CourseItem
  className?: string
}

export function CourseCard({ data, className }: CourseCardProps) {
  const t = useTranslations('Courses')
  const tCommon = useTranslations('Common')

  const statusLabel = useStatusLabel(data.isActive)
  const studentsCount = data.students?.length ?? 0
  const classesCount = data.classes?.length ?? 0

  return (
    <Card
      className={cn(
        'flex flex-col p-5 gap-3 mb-4 transition-all hover:shadow-md border border-border rounded-xl bg-card',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base md:text-lg font-bold leading-tight text-foreground text-pretty">
            {data.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge isActive={data.isActive} label={statusLabel} variant="pill" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-1 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            <span>
              {classesCount} {t('title')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>
              {`${studentsCount} ${studentsCount > 1 ? t('students') : t('student')}`}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label={tCommon('edit')}
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{tCommon('edit')}</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              {tCommon('remove')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
