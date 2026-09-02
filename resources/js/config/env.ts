/**
 * Environment Variables Configuration & Validation
 */
export const ENV = {
  ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD || 'dft2026admin',
  FORM_SUBMIT_EMAIL: import.meta.env.VITE_FORM_SUBMIT_EMAIL || 'nathalia.sampaio@aluno.unc.br',
  SITE_URL: import.meta.env.VITE_SITE_URL || 'https://devsfromtomorrow.com',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
};
