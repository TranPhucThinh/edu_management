'use client'

import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { ContentCard } from '@/components/common/ContentCard'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { FormInputField } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useRegisterForm } from '@/hooks'
import { useRouter } from '@/i18n/navigation'
import { createRegisterSchema } from '@/lib/schemas/auth'

export default function RegisterPage() {
  const tCommon = useTranslations('Common')
  const tRegister = useTranslations('Register')
  const tValidation = useTranslations('Register.validation')
  const router = useRouter()

  const registerSchema = createRegisterSchema(tValidation)
  const {
    form,
    isLoading,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    onSubmit,
  } = useRegisterForm({
    schema: registerSchema,
    defaultErrorMessage: tRegister('defaultError'),
  })

  const { control, formState } = form
  const rootError = formState.errors.root?.message as string | undefined

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted p-4">
      <LanguageSwitcher className="absolute right-4 top-4" />
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary shadow-lg shadow-primary/30">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {tCommon('appName')}
        </h1>
      </div>

      <ContentCard
        title={tRegister('title')}
        description={tRegister('description')}
        className="max-w-[400px]"
        footer={
          <p className="text-xs text-muted-foreground text-center">
            {tRegister('hasAccount')}{' '}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-primary font-medium hover:underline"
              onClick={() => router.push('/login')}
              disabled={isLoading}
            >
              {tRegister('signIn')}
            </Button>
          </p>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {rootError && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive rounded px-3 py-2">
                {rootError}
              </p>
            )}

            <FormInputField
              control={control}
              name="fullName"
              label={tRegister('fullName')}
              placeholder={tRegister('fullNamePlaceholder')}
              leftIcon={<User className="h-4 w-4" />}
              disabled={isLoading}
            />

            <FormInputField
              control={control}
              name="email"
              label={tRegister('email')}
              type="email"
              placeholder={tRegister('emailPlaceholder')}
              leftIcon={<Mail className="h-4 w-4" />}
              disabled={isLoading}
            />

            <FormInputField
              control={control}
              name="password"
              label={tRegister('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={tRegister('passwordPlaceholder')}
              leftIcon={<Lock className="h-4 w-4" />}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              disabled={isLoading}
            />

            <FormInputField
              control={control}
              name="confirmPassword"
              label={tRegister('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={tRegister('confirmPasswordPlaceholder')}
              leftIcon={<Lock className="h-4 w-4" />}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium shadow-button transition-all hover:-translate-y-px"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tCommon('loading')}
                </>
              ) : (
                tRegister('submit')
              )}
            </Button>
          </form>
        </Form>
      </ContentCard>
    </div>
  )
}
