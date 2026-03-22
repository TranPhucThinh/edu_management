export const queryKeys = {
  courses: {
    all: ['courses'] as const,
    list: () => [...queryKeys.courses.all, 'list'] as const,
    details: () => [...queryKeys.courses.all, 'details'] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
  },
}
