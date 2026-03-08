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

import { Button } from '@/src/components/ui/button'
import { ContentCard } from '@/src/components/ContentCard'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { useRouter } from '@/src/i18n/navigation'
import { useRegisterForm } from '@/src/hooks'
import { createRegisterSchema } from '@/src/lib/schemas/auth'

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
        title={tRegister('title')}
        description={tRegister('description')}
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

            <FormField
              control={control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tRegister('fullName')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={tRegister('fullNamePlaceholder')}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tRegister('email')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder={tRegister('emailPlaceholder')}
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
                  <FormLabel>{tRegister('password')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={tRegister('passwordPlaceholder')}
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

            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tRegister('confirmPassword')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={tRegister('confirmPasswordPlaceholder')}
                        className="pl-9 pr-9 h-11 bg-muted border-input focus:bg-background transition-all"
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
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
                tRegister('submit')
              )}
            </Button>
          </form>
        </Form>
      </ContentCard>
    </div>
  )
}
