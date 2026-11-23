/**
 * Consentimento de cookies de análise (LGPD).
 *
 * Regra: nenhum script do Google é carregado antes do "Aceitar". O servidor só entrega a
 * configuração (os IDs) num bloco JSON (`#dft-analytics`, ver resources/views/app.blade.php),
 * e apenas em produção e com ID válido. Aqui o navegador:
 *   1. lê essa configuração (e valida os IDs de novo, porque eles vão para dentro de um <script>);
 *   2. guarda a escolha do visitante (localStorage, 12 meses);
 *   3. só carrega o Google Analytics / Tag Manager se a escolha for "aceito";
 *   4. ao recusar depois de ter aceitado, apaga os cookies do Google e recarrega a página.
 *
 * Sem configuração de analytics não há banner: o site só usa cookies técnicos (sessão e proteção
 * contra requisições forjadas), que não dependem de consentimento.
 */

export type ConsentChoice = 'accepted' | 'rejected';

export interface AnalyticsConfig {
  ga4: string | null;
  gtm: string | null;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const STORAGE_KEY = 'dft_cookie_consent';
const STORAGE_VERSION = 1;
/** A escolha vale por 12 meses; depois o banner volta a perguntar. */
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const GA4_PATTERN = /^G-[A-Z0-9]{4,20}$/;
const GTM_PATTERN = /^GTM-[A-Z0-9]{4,12}$/;

let config: AnalyticsConfig | null | undefined;
let choice: ConsentChoice | null = null;
let preferencesOpen = false;
let analyticsLoaded = false;
let initialized = false;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

/** Configuração de analytics entregue pelo servidor, ou null se não houver (ou se for inválida). */
export function getAnalyticsConfig(): AnalyticsConfig | null {
  if (config !== undefined) return config;
  config = null;

  try {
    const raw = document.getElementById('dft-analytics')?.textContent;
    if (!raw) return config;

    const parsed = JSON.parse(raw) as Partial<AnalyticsConfig>;
    const ga4 = typeof parsed.ga4 === 'string' && GA4_PATTERN.test(parsed.ga4) ? parsed.ga4 : null;
    const gtm = typeof parsed.gtm === 'string' && GTM_PATTERN.test(parsed.gtm) ? parsed.gtm : null;

    config = ga4 || gtm ? { ga4, gtm } : null;
  } catch {
    config = null;
  }

  return config;
}

function readStoredChoice(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as { v?: number; choice?: string; at?: string };
    const savedAt = data.at ? Date.parse(data.at) : NaN;

    if (data.v !== STORAGE_VERSION || (data.choice !== 'accepted' && data.choice !== 'rejected')) return null;
    if (!Number.isFinite(savedAt) || Date.now() - savedAt > MAX_AGE_MS) return null;

    return data.choice;
  } catch {
    return null;
  }
}

function storeChoice(value: ConsentChoice): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: STORAGE_VERSION, choice: value, at: new Date().toISOString() }));
  } catch {
    // Navegação privada ou armazenamento bloqueado: a escolha vale só nesta visita.
  }
}

function injectScript(src: string, async = true): void {
  const script = document.createElement('script');
  script.src = src;
  script.async = async;
  document.head.appendChild(script);
}

/** Carrega o Google Analytics 4 e/ou o Tag Manager. Só chamar depois do consentimento. */
function loadAnalytics(cfg: AnalyticsConfig): void {
  if (analyticsLoaded) return;
  analyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];

  if (cfg.gtm) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    injectScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(cfg.gtm)}`);
  }

  if (cfg.ga4) {
    // O gtag.js exige que se empurre o objeto `arguments` (não um array) no dataLayer.
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', cfg.ga4);
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.ga4)}`);
  }
}

/** Cookies que o Google cria: _ga, _ga_XXXX, _gid, _gat*, _gcl_*. */
const GOOGLE_COOKIE = /^(_ga|_gid|_gat|_gcl_)/;

function deleteGoogleCookies(): void {
  const host = window.location.hostname;
  const parts = host.split('.');
  // Tenta o host e cada domínio-pai (ex.: www.exemplo.com, .www.exemplo.com, .exemplo.com).
  const domains: Array<string | undefined> = [undefined, host, `.${host}`];
  for (let i = 1; i < parts.length - 1; i += 1) domains.push(`.${parts.slice(i).join('.')}`);

  document.cookie.split(';').forEach((entry) => {
    const name = entry.split('=')[0].trim();
    if (!GOOGLE_COOKIE.test(name)) return;

    domains.forEach((domain) => {
      const base = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = domain ? `${base}; domain=${domain}` : base;
    });
  });
}

function disableAnalytics(cfg: AnalyticsConfig): void {
  if (cfg.ga4) window[`ga-disable-${cfg.ga4}`] = true;
  deleteGoogleCookies();
}

/**
 * Inicia o módulo no começo da aplicação (resources/js/main.tsx): lê a escolha guardada e, se o
 * visitante já tinha aceitado, carrega o analytics em qualquer página do site.
 */
export function initConsent(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const cfg = getAnalyticsConfig();
  if (!cfg) return;

  choice = readStoredChoice();
  if (choice === 'accepted') loadAnalytics(cfg);
}

export function setConsent(value: ConsentChoice): void {
  const cfg = getAnalyticsConfig();
  if (!cfg) return;

  const previous = choice;
  choice = value;
  preferencesOpen = false;
  storeChoice(value);
  notify();

  if (value === 'accepted') {
    loadAnalytics(cfg);
    return;
  }

  disableAnalytics(cfg);

  // Scripts já carregados não dá para descarregar: recarrega a página para que eles não rodem mais.
  if (previous === 'accepted' && analyticsLoaded) window.location.reload();
}

export function openPreferences(): void {
  preferencesOpen = true;
  notify();
}

export const getChoice = (): ConsentChoice | null => choice;
export const isPreferencesOpen = (): boolean => preferencesOpen;

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
