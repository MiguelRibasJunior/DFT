// Utilidades comuns dos testes de carga (k6).

export const BASE = (__ENV.BASE_URL || 'http://127.0.0.1:8015').replace(/\/$/, '');

// Trava de segurança: estes testes disparam centenas de requisições e gravam contatos de teste.
// Só rodam contra um endereço local, a menos que se peça explicitamente (ALLOW_REMOTE=1).
const LOCAL = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/;
if (!LOCAL.test(BASE) && __ENV.ALLOW_REMOTE !== '1') {
  throw new Error(
    `BASE_URL=${BASE} não é um endereço local. Estes testes geram carga e gravam contatos; ` +
      'rode-os contra um ambiente de teste. Para ignorar esta trava: ALLOW_REMOTE=1 (nunca contra produção).',
  );
}

/** Corpo válido do formulário de contato (campos como o front-end envia). */
export function contactPayload(overrides = {}) {
  // Object.assign (e não spread): o interpretador do k6 0.51 não aceita "...objeto".
  return JSON.stringify(
    Object.assign(
      {
        nome: 'Teste k6',
        empresa: 'k6',
        email: 'k6@example.test',
        telefone: '(41) 99999-9999',
        tipoSolucao: 'Chatbots Inteligentes',
        descricao: 'Mensagem automática do teste de carga. Pode ignorar.',
      },
      overrides,
    ),
  );
}

export const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };
