import { useSyncExternalStore } from 'react';
import {
  getAnalyticsConfig,
  getChoice,
  isPreferencesOpen,
  openPreferences,
  setConsent,
  subscribe,
  type ConsentChoice,
} from '../utils/consent';

interface CookieConsent {
  /** Há analytics configurado no admin (e estamos em produção)? Sem isso não existe banner. */
  available: boolean;
  choice: ConsentChoice | null;
  /** O banner deve aparecer: ainda sem escolha, ou o visitante pediu para rever. */
  bannerVisible: boolean;
  accept: () => void;
  reject: () => void;
  reopen: () => void;
}

/** Estado do consentimento de cookies de análise, compartilhado por toda a página. */
export function useCookieConsent(): CookieConsent {
  const choice = useSyncExternalStore(subscribe, getChoice, () => null);
  const open = useSyncExternalStore(subscribe, isPreferencesOpen, () => false);
  const available = getAnalyticsConfig() !== null;

  return {
    available,
    choice,
    bannerVisible: available && (choice === null || open),
    accept: () => setConsent('accepted'),
    reject: () => setConsent('rejected'),
    reopen: openPreferences,
  };
}
