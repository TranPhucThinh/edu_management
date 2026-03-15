import type { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { getRefreshTokenCookieExpiry } from '@/lib/auth-cookies'
import { useRouter } from '@/i18n/navigation'
import { api } from '@/lib/api'
import { getErrorMessage, getSuccessMessage } from '@/lib/api-messages'
import type { LoginFormValues } from '@/lib/schemas/auth'
import { toast } from 'sonner'

export type UseLoginFormOptions = {
  /** Zod schema from createLoginSchema(tValidation) */
  schema: z.ZodType<LoginFormValues>
  /** Fallback message when login fails (e.g. tLogin('invalidCredentials')) */
  invalidCredentialsMessage: string
  /** Redirect path after success (default: '/dashboard') */
  redirectTo?: string
}

export type UseLoginFormReturn = {
  form: UseFormReturn<LoginFormValues>
  isLoading: boolean
  showPassword: boolean
  setShowPassword: (value: boolean) => void
  onSubmit: (data: LoginFormValues) => Promise<void>
}

export function useLoginForm({
  schema,
  invalidCredentialsMessage,
  redirectTo = '/dashboard',
}: UseLoginFormOptions): UseLoginFormReturn {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ZOD v4 and RESOLVER overloads
    resolver: zodResolver(schema as any),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    form.clearErrors('root')

    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      })

      const { accessToken, refreshToken, fullName, teacherId } = response.data

      const decoded = jwtDecode<{ exp: number }>(accessToken)
      const expiresDate = new Date(decoded.exp * 1000)

      Cookies.set('accessToken', accessToken, {
        expires: expiresDate,
        path: '/',
      })
      const refreshExpiry = getRefreshTokenCookieExpiry(refreshToken ?? '')
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, {
          expires: refreshExpiry,
          path: '/',
        })
      }
      Cookies.set('fullName', fullName, {
        expires: refreshExpiry,
        path: '/',
      })
      if (teacherId) {
        Cookies.set('teacherId', teacherId, {
          expires: refreshExpiry,
          path: '/',
        })
      }

      toast.success(getSuccessMessage('AUTH__LOGIN_SUCCESS'))
      router.push(redirectTo)
    } catch (error) {
      const axiosError = error as AxiosError<{
        errorCode?: string
        message?: string
      }>
      const errorCode = axiosError.response?.data?.errorCode
      const rawMessage = axiosError.response?.data?.message
      const fallback = typeof rawMessage === 'string' ? rawMessage : undefined

      form.setError('root', {
        message: getErrorMessage(
          errorCode,
          fallback || invalidCredentialsMessage,
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    showPassword,
    setShowPassword,
    onSubmit,
  }
}
