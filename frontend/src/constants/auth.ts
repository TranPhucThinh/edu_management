/**
 * Fallback number of days for refreshToken/fullName cookies when the token
 * is not a JWT (or decode fails). When the token is a JWT, we use its `exp`
 * so cookie expiry stays in sync with the backend.
 */
export const REFRESH_TOKEN_COOKIE_DAYS = 7
