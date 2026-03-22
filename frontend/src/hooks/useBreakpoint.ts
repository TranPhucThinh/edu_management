import { useEffect, useState } from 'react'

type Breakpoint = 'mobile' | 'desktop'

interface UseBreakpointOptions {
  /**
   * Min-width in pixels used to determine "desktop".
   * Defaults to 768 (Tailwind `md`).
   */
  minWidth?: number
}

/**
 * Detects whether the viewport is currently mobile or desktop.
 * By default uses the Tailwind `md` breakpoint (>= 768px is treated as desktop),
 * but you can override `minWidth` if needed.
 */
export function useBreakpoint(options: UseBreakpointOptions = {}): Breakpoint {
  const { minWidth = 768 } = options
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mq = window.matchMedia(`(min-width: ${minWidth}px)`)

    const update = () => setIsDesktop(mq.matches)

    update()
    mq.addEventListener('change', update)

    return () => mq.removeEventListener('change', update)
  }, [minWidth])

  return isDesktop ? 'desktop' : 'mobile'
}

export function useIsDesktop(options?: UseBreakpointOptions): boolean {
  return useBreakpoint(options) === 'desktop'
}

export function useIsMobile(options?: UseBreakpointOptions): boolean {
  return useBreakpoint(options) === 'mobile'
}


