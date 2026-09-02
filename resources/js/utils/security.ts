/**
 * Security Utilities: Input Sanitization, Validation, Rate-Limiting & File Upload Controls
 */

/**
 * Sanitizes input strings by stripping HTML tags and escaping dangerous characters to prevent XSS.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&(?!#?\w+;)/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Strict Regex validation for professional emails.
 */
export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase().trim());
}

/**
 * Phone / WhatsApp format validation.
 */
export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

/**
 * Enforces rate limiting on key actions (e.g. form submissions).
 */
export function checkRateLimit(actionKey: string, cooldownSeconds: number = 30): { allowed: boolean; waitSeconds?: number } {
  const storageKey = `dft_rate_limit_${actionKey}`;
  const lastTime = localStorage.getItem(storageKey);
  const now = Date.now();

  if (lastTime) {
    const elapsed = (now - parseInt(lastTime, 10)) / 1000;
    if (elapsed < cooldownSeconds) {
      const waitSeconds = Math.ceil(cooldownSeconds - elapsed);
      return { allowed: false, waitSeconds };
    }
  }

  localStorage.setItem(storageKey, now.toString());
  return { allowed: true };
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Strict file upload validator enforcing extension whitelist, MIME-types, and 5MB limit.
 */
export function validateFileUpload(file: File): FileValidationResult {
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'pdf'];
  const ALLOWED_MIMES = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
  ];

  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado.' };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'O tamanho do arquivo excede o limite máximo permitido de 5MB.' };
  }

  const parts = file.name.split('.');
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : '';

  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Formato de arquivo não suportado. Use apenas PNG, JPG, WebP, SVG ou PDF.' };
  }

  if (file.type && !ALLOWED_MIMES.includes(file.type)) {
    return { valid: false, error: 'Tipo MIME do arquivo inválido.' };
  }

  return { valid: true };
}
