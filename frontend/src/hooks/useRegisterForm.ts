import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { getRefreshTokenCookieExpiry } from '@/src/lib/auth-cookies'
import { useRouter } from '@/src/i18n/navigation'
import { api } from '@/src/lib/api'
import { getErrorMessage } from '@/src/lib/api-messages'
import type { RegisterFormValues } from '@/src/lib/schemas/auth'

export type UseRegisterFormOptions = {
  /** Zod schema from createRegisterSchema(tValidation) */
  schema: z.ZodType<RegisterFormValues>
  /** Fallback message when registration fails (e.g. tRegister('defaultError')) */
  defaultErrorMessage: string
  /** Redirect path after success (default: '/dashboard') */
  redirectTo?: string
}

export type UseRegisterFormReturn = {
  form: UseFormReturn<RegisterFormValues>
  isLoading: boolean
  showPassword: boolean
  showConfirmPassword: boolean
  setShowPassword: (value: boolean) => void
  setShowConfirmPassword: (value: boolean) => void
  onSubmit: (data: RegisterFormValues) => Promise<void>
}

export function useRegisterForm({
  schema,
  defaultErrorMessage,
  redirectTo = '/dashboard',
}: UseRegisterFormOptions): UseRegisterFormReturn {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zod v4 and resolver overloads
    resolver: zodResolver(schema as any),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    form.clearErrors('root')

    try {
      const response = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      })

      const { accessToken, refreshToken, fullName } = response.data

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
        message: getErrorMessage(errorCode, fallback || defaultErrorMessage),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    onSubmit,
  }
}
