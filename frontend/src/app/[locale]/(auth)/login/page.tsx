'use client'

import { BookOpen, Eye, EyeOff, Loader2, Lock, User } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { ContentCard } from '@/components/common/ContentCard'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { FormInputField } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useLoginForm } from '@/hooks'
import { useRouter } from '@/i18n/navigation'
import { createLoginSchema } from '@/lib/schemas/auth'

export default function LoginPage() {
  const tCommon = useTranslations('Common')
  const tLogin = useTranslations('Login')
  const tValidation = useTranslations('Login.validation')
  const router = useRouter()

  const loginSchema = createLoginSchema(tValidation)
  const {
    form,
    isLoading,
    showPassword,
    setShowPassword,
    onSubmit,
  } = useLoginForm({
    schema: loginSchema,
    invalidCredentialsMessage: tLogin('invalidCredentials'),
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
        title={tLogin('title')}
        description={tLogin('description')}
        className="max-w-[400px]"
        footer={
          <p className="text-xs text-muted-foreground text-center">
            {tLogin('needHelp')}{' '}
            <span className="font-medium text-primary cursor-pointer hover:underline">
              {tCommon('support')}
            </span>
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
              name="email"
              label={tLogin('email')}
              placeholder={tLogin('emailPlaceholder')}
              leftIcon={<User className="h-4 w-4" />}
              disabled={isLoading}
            />

            <FormInputField
              control={control}
              name="password"
              label={tLogin('password')}
              labelExtra={
                <a
                  href="#"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {tLogin('forgotPassword')}
                </a>
              }
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
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
                tLogin('submit')
              )}
            </Button>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {tLogin('noAccount')}{' '}
              </span>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary font-medium hover:underline"
                onClick={() => router.push('/register')}
                disabled={isLoading}
              >
                {tLogin('signUp')}
              </Button>
            </div>
          </form>
        </Form>
      </ContentCard>


    </div>
  )
}
