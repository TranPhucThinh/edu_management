'use client'

import { GraduationCap, LogOut, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { items } from '@/constants/Nav'
import { Link } from '@/i18n/navigation'
import { useLogout } from '@/hooks'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const tCommon = useTranslations('Common')
  const tNav = useTranslations('Nav')

  const pathname = usePathname()
  const { logout, isLoggingOut } = useLogout()

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 border-r border-sidebar-border bg-sidebar fixed left-0 top-0">
      {/* 1. HEADER */}
      <div className="p-6 flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-sidebar-primary shadow-lg shadow-sidebar-primary/20">
          <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-sidebar-foreground leading-none">
            {tCommon('appName')}
          </h1>
          <span className="text-xs font-medium text-muted-foreground mt-1">
            SaaS Platform
          </span>
        </div>
      </div>

      {/* 2. NAVIGATION */}
      <nav className="flex-1 px-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname.includes(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-sidebar-accent-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{tNav(item.label)}</span>
            </Link>
          )
        })}
      </nav>

      {/* 3. FOOTER */}
      <div className="p-4 space-y-1 border-t border-sidebar-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 p-3 rounded-2xl text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all group"
        >
          <Settings className="h-5 w-5 text-muted-foreground group-hover:text-sidebar-accent-foreground" />
          <span className="font-medium text-sm">{tCommon('settings')}</span>
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 p-3 h-auto rounded-2xl text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:cursor-pointer font-medium transition-all group"
          onClick={logout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-sidebar-accent-foreground" />
          <span className="text-sm">{tCommon('logout')}</span>
        </Button>

        {/* PROFILE CARD */}
        <div className="mt-4 p-2 bg-sidebar-accent/50 border border-sidebar-border rounded-3xl flex items-center gap-3 hover:bg-sidebar-accent transition-colors cursor-pointer group">
          <Avatar className="h-10 w-10 border-2 border-sidebar shadow-sm ring-1 ring-sidebar-border">
            <AvatarImage src="https:/api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
            <AvatarFallback className="bg-muted text-muted-foreground font-bold">
              AJ
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-sidebar-foreground truncate">
              Alex Johnson
            </span>
            <span className="text-xs font-medium text-muted-foreground truncate">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
