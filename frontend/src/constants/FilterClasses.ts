export enum FilterClasses {
  ALL_CLASSES = 'allClasses',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  UPCOMING = 'upcoming',
}

export const FILTER_CLASSES = [
  { value: FilterClasses.ALL_CLASSES, label: 'allClasses' },
  { value: FilterClasses.ACTIVE, label: 'active' },
  { value: FilterClasses.ARCHIVED, label: 'archived' },
  { value: FilterClasses.UPCOMING, label: 'upcoming' },
] as const
