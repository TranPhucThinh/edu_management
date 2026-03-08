"use client";

import { usePathname } from "@/src/i18n/navigation";
import { format } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { Bell } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { items } from "@/src/constants/Nav";

export default function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const locale = useLocale();

  // Map locale string to date-fns locale object
  const dateLocale = locale === "vi" ? vi : enUS;

  // Find the current active item to get the label
  const activeItem =
    items.find((item) => pathname.includes(item.href)) || items[0];

  const currentDate = format(
    new Date(),
    locale === "vi" ? "EEEE, d 'thg' M" : "EEEE, MMM d",
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
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:bg-accent rounded-full"
        >
          <Bell className="h-6 w-6" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive border-2 border-background rounded-full"></span>
        </Button>

        <Avatar className="h-10 w-10 border-2 border-background shadow-sm ring-1 ring-border">
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
          />
          <AvatarFallback className="bg-muted text-muted-foreground font-bold">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
