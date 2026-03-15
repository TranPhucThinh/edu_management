'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type HeaderActionsContextValue = {
  actions: ReactNode | null
  setActions: (node: ReactNode | null) => void
}

const HeaderActionsContext = createContext<HeaderActionsContextValue | null>(
  null,
)

export function HeaderActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActionsState] = useState<ReactNode | null>(null)

  const setActions = useCallback((node: ReactNode | null) => {
    setActionsState(node)
  }, [])

  const value = useMemo(() => ({ actions, setActions }), [actions, setActions])

  return (
    <HeaderActionsContext.Provider value={value}>
      {children}
    </HeaderActionsContext.Provider>
  )
}

export function useHeaderActions() {
  const ctx = useContext(HeaderActionsContext)
  if (!ctx) {
    throw new Error(
      'useHeaderActions must be used within HeaderActionsProvider',
    )
  }
  return ctx
}
