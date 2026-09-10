/**
 * Public Environment Variables Configuration
 * Strictly NO SECRETS or Passwords should be placed in VITE_ environment scope.
 */
export const ENV = {
  SITE_URL: import.meta.env.VITE_SITE_URL || 'https://devsfromtomorrow.com',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  DEFAULT_NOTIFICATION_EMAIL: 'contato@devsfromtomorrow.com',
};
