'use client'

import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FABProps {
  /** Icon or content. Defaults to Plus icon. */
  children?: React.ReactNode
  /** Accessible label for the button. */
  'aria-label'?: string
  className?: string
  onClick?: () => void
}

export function FAB({
  children,
  'aria-label': ariaLabel = 'Action',
  className,
  onClick,
}: FABProps) {
  return (
    <Button
      type="button"
      size="icon"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        'md:hidden fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full shadow-xl shadow-primary/30 transition-transform active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90',
        className,
      )}
    >
      {children ?? <Plus className="h-6 w-6" />}
    </Button>
  )
}
