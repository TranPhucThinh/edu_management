'use client'

import { BookOpen, Eye, EyeOff, Loader2, Lock, User } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { ContentCard } from '@/components/common/ContentCard'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from '@/i18n/navigation'
import { useLoginForm } from '@/hooks'
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
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
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tLogin('email')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={tLogin('emailPlaceholder')}
                        className="pl-9 h-11 bg-muted border-input focus:bg-background transition-all"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{tLogin('password')}</FormLabel>
                    <a
                      href="#"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {tLogin('forgotPassword')}
                    </a>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-9 pr-9 h-11 bg-muted border-input focus:bg-background transition-all"
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
