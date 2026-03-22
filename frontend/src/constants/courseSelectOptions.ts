export const TUITION_TYPE_SELECT_OPTIONS = [
  { value: 'PER_SESSION', labelKey: 'perSession' },
  { value: 'MONTHLY_FIXED', labelKey: 'monthlyFixed' },
] as const

export type TuitionTypeSelectOption =
  (typeof TUITION_TYPE_SELECT_OPTIONS)[number]

