// Formulário de contato: validação, honeypot, sanitização e limite de 6 envios por minuto (por IP).
// ATENÇÃO: grava contatos no banco do ambiente testado. Rode só contra um ambiente de teste e com
// CONTACT_NOTIFICATION_ENDPOINT apontando para um endereço morto (senão o aviso vai para o e-mail real).
// Uso: k6 run k6/contact.js
import http from 'k6/http';
import { check } from 'k6';
import { BASE, JSON_HEADERS, contactPayload } from './lib.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: { checks: ['rate==1'] },
};

function post(body) {
  return http.post(`${BASE}/api/contact`, body, { headers: JSON_HEADERS });
}

export default function () {
  // As 6 primeiras requisições da janela de 1 minuto passam pelo limite; a 7ª leva 429.
  const ok = post(contactPayload());
  check(ok, {
    '1) envio válido: 201': (r) => r.status === 201,
    '1) resposta tem success=true': (r) => r.json('success') === true,
  });

  const honeypot = post(contactPayload({ website_hp: 'sou um robô' }));
  check(honeypot, {
    '2) honeypot preenchido é rejeitado (422)': (r) => r.status === 422 && r.json('success') === false,
  });

  const empty = post(JSON.stringify({}));
  check(empty, {
    '3) corpo vazio: 422 com erros por campo, em português': (r) =>
      r.status === 422 && r.json('errors.nome.0') === 'Preencha o campo nome.' && r.json('errors.email') !== undefined,
  });

  const badEmail = post(contactPayload({ email: 'isto-nao-e-um-email' }));
  check(badEmail, { '4) e-mail inválido: 422': (r) => r.status === 422 && r.json('errors.email') !== undefined });

  const huge = post(contactPayload({ descricao: 'x'.repeat(3001) }));
  check(huge, { '5) descrição acima de 3000 caracteres: 422': (r) => r.status === 422 && r.json('errors.descricao') !== undefined });

  const xss = post(contactPayload({ nome: '<script>alert(1)</script>Maria' }));
  check(xss, { '6) HTML no nome é aceito e sanitizado (201)': (r) => r.status === 201 });

  const limited = post(contactPayload());
  check(limited, {
    '7) a 7ª requisição no minuto é barrada (429)': (r) => r.status === 429,
    '7) 429 informa quando tentar de novo (Retry-After)': (r) => Number(r.headers['Retry-After']) > 0,
    '7) 429 não vaza detalhes técnicos': (r) => !r.body.includes('vendor') && !r.body.includes('Stack trace'),
  });
}
