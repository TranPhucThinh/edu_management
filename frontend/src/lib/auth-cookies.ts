import { jwtDecode } from 'jwt-decode'

import { REFRESH_TOKEN_COOKIE_DAYS } from '@/constants/Auth'

/**
 * Returns the expiry date for refreshToken and fullName cookies.
 * If the refresh token is a JWT with `exp`, uses that so cookie and BE stay in sync.
 * Otherwise falls back to REFRESH_TOKEN_COOKIE_DAYS from now.
 */
export function getRefreshTokenCookieExpiry(refreshToken: string): Date {
  try {
    const decoded = jwtDecode<{ exp?: number }>(refreshToken)
    if (typeof decoded?.exp === 'number' && decoded.exp > 0) {
      return new Date(decoded.exp * 1000)
    }
  } catch {
    // Not a JWT or invalid – use fallback
  }
  const fallback = new Date()
  fallback.setDate(fallback.getDate() + REFRESH_TOKEN_COOKIE_DAYS)
  return fallback
}
