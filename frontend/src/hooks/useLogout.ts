import Cookies from 'js-cookie'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { useRouter } from '@/i18n/navigation'
import { api } from '@/lib/api'
import { getSuccessMessage } from '@/lib/api-messages'

function clearAuthCookies(): void {
  Cookies.remove('teacherId', { path: '/' })
  Cookies.remove('accessToken', { path: '/' })
  Cookies.remove('refreshToken', { path: '/' })
  Cookies.remove('fullName', { path: '/' })
}

export function useLogout() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = useCallback(async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      const res = await api.post<{ messageKey?: string }>('/auth/logout')
      const text = getSuccessMessage(res.data?.messageKey)
      if (text) toast.success(text)
    } catch {
      // Even if API fails, still clear cookies and redirect
    } finally {
      clearAuthCookies()
      setIsLoggingOut(false)
      router.push('/login')
    }
  }, [isLoggingOut, router])

  return { logout, isLoggingOut }
}

