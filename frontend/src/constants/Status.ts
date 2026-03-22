export const STATUS_FILTER_VALUES = [true, false] as const

export type StatusFilterFlag = (typeof STATUS_FILTER_VALUES)[number]