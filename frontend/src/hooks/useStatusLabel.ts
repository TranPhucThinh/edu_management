import { useTranslations } from 'next-intl'

/**
 * Returns the translated label for a row status from `isActive` (API / Prisma).
 * Use this anywhere you need a human-readable status label (badges, filters, tables, etc.).
 */
export function useStatusLabel(isActive: boolean): string {
  const t = useTranslations('Status')
  return t(isActive ? 'active' : 'inactive')
}
