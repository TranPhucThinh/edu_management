import en from "@/src/messages/en.json";
import vi from "@/src/messages/vi.json";
import { routing } from "@/src/i18n/routing";

type ApiKey =
  | "networkError"
  | "defaultError"
  | "sessionExpired"
  | "noPermission"
  | "notFound"
  | "serverError"
  | "unknownError";

const messages: Record<"en" | "vi", Record<ApiKey, string>> = {
  en: (en as { Api: Record<ApiKey, string> }).Api,
  vi: (vi as { Api: Record<ApiKey, string> }).Api,
};

const errorMessages: Record<"en" | "vi", Record<string, string>> = {
  en: (en as { Errors: Record<string, string> }).Errors,
  vi: (vi as { Errors: Record<string, string> }).Errors,
};

function getLocale(): "en" | "vi" {
  if (typeof window === "undefined") return routing.defaultLocale as "vi";
  const segment = window.location.pathname.split("/")[1];
  return routing.locales.includes(segment as "en" | "vi")
    ? (segment as "en" | "vi")
    : (routing.defaultLocale as "vi");
}

export function getApiMessage(
  key: ApiKey,
  params?: { message?: string },
): string {
  const locale = getLocale();
  const text = messages[locale][key] ?? messages.vi[key] ?? key;
  if (params?.message != null && text.includes("{message}")) {
    return text.replace("{message}", params.message);
  }
  return text;
}

/**
 * Resolve a backend errorCode (e.g. "AUTH.INVALID_CREDENTIALS") to
 * the locale-aware translation. Falls back to `fallbackMessage` if
 * the code is not found in the Errors namespace.
 */
export function getErrorMessage(
  errorCode: string | undefined,
  fallbackMessage?: string,
): string {
  if (!errorCode) return fallbackMessage ?? getApiMessage("defaultError");
  const locale = getLocale();

  return errorMessages[locale]?.[errorCode] ?? fallbackMessage ?? errorCode;
}

export function getLocaleForRedirect(): string {
  return getLocale();
}
