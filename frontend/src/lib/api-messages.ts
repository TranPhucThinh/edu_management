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

export type FieldError = { field: string; code: string };
export type FieldMessage = { field: string; message: string };

const messages: Record<"en" | "vi", Record<ApiKey, string>> = {
  en: (en as { Api: Record<ApiKey, string> }).Api,
  vi: (vi as { Api: Record<ApiKey, string> }).Api,
};

const successMessages: Record<"en" | "vi", Record<string, string>> = {
  en: (en as { Success?: Record<string, string> }).Success ?? {},
  vi: (vi as { Success?: Record<string, string> }).Success ?? {},
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
 * Resolve a backend success messageKey (e.g. "AUTH__LOGOUT_SUCCESS") to
 * the locale-aware translation. Falls back to `messageKey` if not in Success.
 */
export function getSuccessMessage(
  messageKey: string | undefined,
  fallback?: string,
): string {
  if (!messageKey) return fallback ?? "";
  const locale = getLocale();
  return (
    successMessages[locale]?.[messageKey] ??
    successMessages.vi?.[messageKey] ??
    fallback ??
    messageKey
  );
}

/**
 * Resolve a backend errorCode (e.g. "AUTH__INVALID_CREDENTIALS") to
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

/**
 * Map an array of { field, code } from the backend into { field, message }
 * with locale-aware translations. Use this to set form errors after a 400.
 */
export function getValidationErrors(errors: FieldError[]): FieldMessage[] {
  const locale = getLocale();
  return errors.map(({ field, code }) => ({
    field,
    message: errorMessages[locale]?.[code] ?? errorMessages.vi?.[code] ?? code,
  }));
}

export function getLocaleForRedirect(): string {
  return getLocale();
}
