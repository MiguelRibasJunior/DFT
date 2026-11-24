// Teste de fumaça: 1 usuário, 1 passada. Confere rotas públicas, o formato das respostas e as proteções.
// Uso: k6 run k6/smoke.js
import http from 'k6/http';
import { check, group } from 'k6';
import { BASE } from './lib.js';

export const options = {
  vus: 1,
  iterations: 1,
  // Só as verificações valem aqui: os 404 e 302 esperados (proteções) contam como "falha" para o http_req_failed do k6.
  thresholds: { checks: ['rate==1'] },
};

const INTERNAL_FIELDS = ['manager_id', 'progress', 'management_status', 'priority', 'deleted_at', 'extra_scripts'];

function noInternals(body) {
  return INTERNAL_FIELDS.every((field) => !body.includes(`"${field}"`));
}

export default function () {
  group('páginas', () => {
    for (const path of ['/', '/termos', '/privacidade']) {
      const res = http.get(`${BASE}${path}`);
      check(res, {
        [`${path} responde 200`]: (r) => r.status === 200,
        [`${path} é HTML com o app React`]: (r) => String(r.headers['Content-Type']).includes('text/html') && r.body.includes('id="app"'),
        [`${path} tem <title>`]: (r) => /<title>[^<]+<\/title>/.test(r.body),
      });
    }
    const home = http.get(`${BASE}/`);
    check(home, {
      'HTML não carrega scripts do Google (LGPD)': (r) => !r.body.includes('googletagmanager.com') && !r.body.includes('gtag('),
      'HTML não expõe debug/stack trace': (r) => !r.body.includes('Whoops') && !r.body.includes('vendor\\'),
    });
  });

  group('API pública', () => {
    for (const path of ['/api/projects', '/api/settings', '/api/contact-links', '/api/ctas/hero']) {
      const res = http.get(`${BASE}${path}`, { headers: { Accept: 'application/json' } });
      check(res, {
        [`${path} responde 200`]: (r) => r.status === 200,
        [`${path} é JSON com success`]: (r) => r.json('success') === true,
        [`${path} não expõe campos internos`]: (r) => noInternals(r.body),
      });
    }
  });

  group('arquivos públicos', () => {
    for (const path of ['/robots.txt', '/sitemap.xml']) {
      check(http.get(`${BASE}${path}`), { [`${path} responde 200`]: (r) => r.status === 200 });
    }
  });

  group('proteções', () => {
    for (const path of ['/api/admin/projects', '/api/admin/submissions', '/api/admin/login']) {
      check(http.get(`${BASE}${path}`, { headers: { Accept: 'application/json' } }), {
        [`${path} não existe (404)`]: (r) => r.status === 404,
      });
    }

    const admin = http.get(`${BASE}/admin`, { redirects: 0 });
    check(admin, {
      '/admin sem login redireciona': (r) => r.status === 302,
      '/admin redireciona para o login': (r) => String(r.headers['Location']).includes('/admin/login'),
    });

    const lost = http.get(`${BASE}/pagina-que-nao-existe`);
    check(lost, {
      '404 de página não vaza detalhes': (r) => r.status === 404 && !r.body.includes('Stack trace') && !r.body.includes('vendor\\'),
    });

    const lostApi = http.get(`${BASE}/api/nao-existe`, { headers: { Accept: 'application/json' } });
    check(lostApi, {
      '404 de API é JSON genérico, sem trace': (r) => r.status === 404 && !r.body.includes('trace') && !r.body.includes('vendor'),
    });

    for (const path of ['/.env', '/composer.json', '/storage/logs/laravel.log']) {
      check(http.get(`${BASE}${path}`), { [`${path} não é servido`]: (r) => r.status === 404 || r.status === 403 });
    }
  });
}
