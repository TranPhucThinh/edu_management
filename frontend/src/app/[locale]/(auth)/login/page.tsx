"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { BookOpen, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useRouter } from "@/src/i18n/navigation";
import { api } from "@/src/lib/api";
import { getErrorMessage } from "@/src/lib/api-messages";
import { LoginFormValues, createLoginSchema } from "@/src/lib/schemas/auth";

export default function LoginPage() {
  const tCommon = useTranslations("Common");
  const tLogin = useTranslations("Login");
  const tValidation = useTranslations("Login.validation");

  const loginSchema = createLoginSchema(tValidation);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control, formState } = form;
  const rootError = formState.errors.root?.message as string | undefined;

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    form.clearErrors("root");

    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { accessToken, refreshToken, fullName } = response.data;

      const decoded = jwtDecode<{ exp: number }>(accessToken);
      const expiresDate = new Date(decoded.exp * 1000);

      Cookies.set("accessToken", accessToken, {
        expires: expiresDate,
        path: "/",
      });
      if (refreshToken) {
        Cookies.set("refreshToken", refreshToken, { expires: 7, path: "/" });
      }
      Cookies.set("fullName", fullName, { expires: 7, path: "/" });

      router.push("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<{
        errorCode?: string;
        message?: string;
      }>;
      const errorCode = axiosError.response?.data?.errorCode;
      const rawMessage = axiosError.response?.data?.message;
      const fallback = typeof rawMessage === "string" ? rawMessage : undefined;

      form.setError("root", {
        message: getErrorMessage(
          errorCode,
          fallback || tLogin("invalidCredentials"),
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 md:bg-slate-100/50">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary shadow-lg shadow-primary/30">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {tCommon("appName")}
        </h1>
      </div>

      <Card className="w-full max-w-[400px] shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl font-semibold">
            {tLogin("title")}
          </CardTitle>
          <CardDescription>{tLogin("description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {rootError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                  {rootError}
                </p>
              )}
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tLogin("email")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={tLogin("emailPlaceholder")}
                          className="pl-9 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
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
                      <FormLabel>{tLogin("password")}</FormLabel>
                      <a
                        href="#"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {tLogin("forgotPassword")}
                      </a>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-9 pr-9 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                          {...field}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          tabIndex={-1} // Không cho tab vào nút này để UX mượt hơn
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
                className="w-full h-11 text-base font-medium shadow-md transition-all hover:-translate-y-px"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tCommon("loading")}
                  </>
                ) : (
                  tLogin("submit")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center border-t p-6">
          <p className="text-xs text-muted-foreground text-center">
            {tLogin("needHelp")}{" "}
            <span className="font-medium text-primary cursor-pointer hover:underline">
              {tCommon("support")}
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
