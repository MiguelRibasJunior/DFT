// Teste de carga: visitantes navegando (página inicial + API + arquivos estáticos).
// Perfis (PROFILE): load (padrão, ~2 min, até 30 usuários), stress (sobe até 150 para achar o limite),
//                   spike (pico súbito).
// Uso: k6 run k6/load.js            |  k6 run -e PROFILE=stress k6/load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE } from './lib.js';

const PROFILES = {
  load: [
    { duration: '20s', target: 10 },
    { duration: '30s', target: 30 },
    { duration: '60s', target: 30 },
    { duration: '10s', target: 0 },
  ],
  stress: [
    { duration: '20s', target: 30 },
    { duration: '30s', target: 60 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 150 },
    { duration: '10s', target: 0 },
  ],
  spike: [
    { duration: '10s', target: 5 },
    { duration: '5s', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '5s', target: 5 },
    { duration: '20s', target: 5 },
  ],
};

const profile = __ENV.PROFILE || 'load';
const isLoad = profile === 'load';

export const options = {
  scenarios: {
    visitantes: { executor: 'ramping-vus', startVUs: 1, stages: PROFILES[profile], gracefulRampDown: '10s' },
  },
  // As metas só reprovam o perfil padrão; stress e spike servem para medir, não para aprovar.
  thresholds: isLoad
    ? {
        http_req_failed: ['rate<0.01'],
        checks: ['rate>0.99'],
        'http_req_duration{kind:page}': ['p(95)<800'],
        'http_req_duration{kind:api}': ['p(95)<500'],
        'http_req_duration{kind:static}': ['p(95)<300'],
      }
    : {},
  summaryTrendStats: ['avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

// Descobre os arquivos do build (com hash no nome) olhando o HTML da página inicial.
export function setup() {
  const html = http.get(`${BASE}/`).body;
  const assets = [...new Set([...html.matchAll(/\/build\/assets\/[^"'\s]+\.(?:js|css)/g)].map((m) => m[0]))];
  if (assets.length === 0) throw new Error('Nenhum arquivo /build/assets/ encontrado na página inicial: rode npm run build.');
  return { assets };
}

export default function (data) {
  const page = http.get(`${BASE}/`, { tags: { kind: 'page', name: 'GET /' } });
  check(page, { 'página inicial 200': (r) => r.status === 200 });

  // O navegador pede os arquivos do build e as APIs em paralelo.
  const requests = [
    ...data.assets.map((path) => ['GET', `${BASE}${path}`, null, { tags: { kind: 'static', name: 'GET /build/assets/*' } }]),
    ...['/api/projects', '/api/settings', '/api/contact-links', '/api/ctas/hero'].map((path) => [
      'GET',
      `${BASE}${path}`,
      null,
      { headers: { Accept: 'application/json' }, tags: { kind: 'api', name: `GET ${path}` } },
    ]),
  ];
  const responses = http.batch(requests);
  check(responses, { 'assets e APIs 200': (rs) => rs.every((r) => r.status === 200) });

  // Parte dos visitantes abre uma página legal.
  if (Math.random() < 0.2) {
    const legal = http.get(`${BASE}${Math.random() < 0.5 ? '/termos' : '/privacidade'}`, { tags: { kind: 'page', name: 'GET /legal' } });
    check(legal, { 'página legal 200': (r) => r.status === 200 });
  }

  sleep(1 + Math.random() * 2); // tempo de leitura
}
