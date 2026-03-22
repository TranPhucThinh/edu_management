'use client';

import { useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'vi' as const, label: 'VI' },
  { code: 'en' as const, label: 'EN' },
] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn('flex items-center rounded-md border border-border bg-background p-0.5 shadow-sm', className)}
      role="group"
      aria-label="Switch language"
    >
      {LOCALES.map(({ code, label }) => (
        <Button
          key={code}
          type="button"
          variant={locale === code ? 'secondary' : 'ghost'}
          size="sm"
          className={cn(
            'min-w-9 h-8 text-xs font-medium',
            locale === code && 'shadow-xs',
          )}
          onClick={() => router.replace(pathname, { locale: code })}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
