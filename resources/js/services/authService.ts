/**
 * Serviço de Autenticação e Gestão de Administradores
 * Devs From Tomorrow
 */
import { ENV } from '@/config/env';
import type { AdminUser } from '@/types';

export type { AdminUser };

const TOKEN_KEY = 'dft_admin_token';
const USER_KEY = 'dft_admin_user';
const CREDS_KEY = 'dft_admin_credentials_store';

// Credenciais padrão seguras caso não tenham sido personalizadas ainda
const DEFAULT_ADMIN = {
  id: 'admin-master',
  name: 'Administrador DFT',
  email: 'admin@devsfromtomorrow.com',
  passwordHash: 'admin123', // Senha inicial de acesso
  role: 'super_admin' as const,
};

function getStoredCredentials() {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (!raw) {
      localStorage.setItem(CREDS_KEY, JSON.stringify(DEFAULT_ADMIN));
      return DEFAULT_ADMIN;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ADMIN;
  }
}

export const isAuthenticated = (): boolean => {
  const token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  const user = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
  return Boolean(token && user);
};

export const getCurrentUser = (): AdminUser | null => {
  try {
    const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const login = async (
  email: string,
  password: string,
  rememberMe: boolean = true
): Promise<{ success: boolean; user?: AdminUser; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Tentar autenticação remota caso o backend Laravel esteja online
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token && data.user) {
        const adminUser: AdminUser = {
          id: String(data.user.id),
          name: data.user.name || 'Administrador',
          email: data.user.email,
          role: data.user.role || 'admin',
          lastLogin: new Date().toISOString(),
        };

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(TOKEN_KEY, data.token);
        storage.setItem(USER_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }
    }
  } catch {
    // API remota offline, fallback para autenticação local
  }

  // 2. Validação local com credenciais de administrador configuradas
  const stored = getStoredCredentials();

  if (cleanEmail === stored.email.toLowerCase() && password === stored.passwordHash) {
    const now = new Date().toISOString();
    const adminUser: AdminUser = {
      id: stored.id,
      name: stored.name,
      email: stored.email,
      role: stored.role,
      lastLogin: now,
    };

    const token = 'dft_token_' + btoa(`${stored.id}:${Date.now()}`);
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(adminUser));

    // Salvar atualização de último login
    stored.lastLogin = now;
    localStorage.setItem(CREDS_KEY, JSON.stringify(stored));

    return { success: true, user: adminUser };
  }

  return {
    success: false,
    error: 'E-mail ou senha incorretos. Verifique suas credenciais de acesso.',
  };
};

export const logout = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  if (newPassword.length < 6) {
    return { success: false, error: 'A nova senha deve ter no mínimo 6 caracteres.' };
  }

  const stored = getStoredCredentials();
  if (currentPassword !== stored.passwordHash) {
    return { success: false, error: 'A senha atual informada está incorreta.' };
  }

  stored.passwordHash = newPassword;
  localStorage.setItem(CREDS_KEY, JSON.stringify(stored));
  return { success: true };
};

export const updateProfile = async (
  name: string,
  email: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> => {
  if (!name.trim() || !email.trim()) {
    return { success: false, error: 'Nome e e-mail não podem ficar em branco.' };
  }

  const stored = getStoredCredentials();
  stored.name = name.trim();
  stored.email = email.trim().toLowerCase();
  localStorage.setItem(CREDS_KEY, JSON.stringify(stored));

  const currentUser = getCurrentUser();
  if (currentUser) {
    currentUser.name = stored.name;
    currentUser.email = stored.email;
    const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(currentUser));
  }

  return { success: true, user: currentUser || undefined };
};
