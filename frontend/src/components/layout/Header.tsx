'use client';

import { usePathname } from '@/i18n/navigation';
import { format } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { Bell, LogOutIcon, SettingsIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { items } from '@/constants/Nav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks';
import { useHeaderActions } from '@/components/layout/HeaderActionsProvider';

export default function Header() {
  const t = useTranslations('Nav');
  const tCommon = useTranslations('Common');
  const pathname = usePathname();
  const locale = useLocale();
  const { logout, isLoggingOut } = useLogout();
  const { actions } = useHeaderActions();

  // Map locale string to date-fns locale object
  const dateLocale = locale === "vi" ? vi : enUS;

  // Find the current active item to get the label
  const activeItem =
    items.find((item) => pathname.includes(item.href)) || items[0];

  const currentDate = format(
    new Date(),
    locale === 'vi' ? "EEEE, d 'thg' M" : 'EEEE, MMM d',
    {
      locale: dateLocale,
    },
  );

  return (
    <header className="flex items-center justify-between px-4 py-4 md:px-8 bg-background border-b border-border">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground leading-tight">
          {t(activeItem.label)}
        </h1>
        <p className="text-sm text-muted-foreground font-medium capitalize">
          {currentDate}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Page-specific header actions (desktop only) */}
        {actions && (
          <div className="hidden md:flex items-center gap-3">
            {actions}
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:bg-accent rounded-full"
        >
          <Bell className="h-6 w-6" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive border-2 border-background rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className='md:hidden'>
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm ring-1 ring-border md:hidden">
              <AvatarImage
                src="https:/api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="User"
              />
              <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                JD
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32" align="start">
            <DropdownMenuItem>
              <SettingsIcon />
              {tCommon('settings')}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={logout}
              disabled={isLoggingOut}
            >
              <LogOutIcon />
              {tCommon('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
