"use client";

import { useTranslations } from "next-intl";

import { items } from "@/src/constants/Nav";
import { Link, usePathname } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/utils";

export default function MobileNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon;

          const isActive = pathname.includes(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary/70",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{t(item.label)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
