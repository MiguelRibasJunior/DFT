// Faz login no painel /admin de um ambiente de TESTE e gera o plano do ZAP (zap/.tmp/plan-admin.yaml) com a sessão.
// Uso (a partir da raiz do projeto, com o e2e instalado: cd e2e && npm install):
//   ZAP_TARGET=http://127.0.0.1:8015 ZAP_ADMIN_EMAIL=zap@example.test ZAP_ADMIN_PASSWORD=... node zap/login.cjs
// Use o usuário descartável de um banco de teste, nunca a senha de um administrador real.
const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', 'e2e', 'node_modules', '@playwright/test'));

const target = process.env.ZAP_TARGET || 'http://127.0.0.1:8015';
const email = process.env.ZAP_ADMIN_EMAIL;
const password = process.env.ZAP_ADMIN_PASSWORD;
const template = path.join(__dirname, 'plan-admin.yaml');
const output = process.argv[2] || path.join(__dirname, '.tmp', 'plan-admin.yaml');

if (!email || !password) {
  console.error('Defina ZAP_ADMIN_EMAIL e ZAP_ADMIN_PASSWORD (usuário de teste).');
  process.exit(1);
}
if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(target) && process.env.ALLOW_REMOTE !== '1') {
  console.error(`ZAP_TARGET=${target} não é local. Estes testes enviam ataques; use um ambiente de teste.`);
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage();
  await page.goto(`${target}/admin/login`);
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 60000 });
  const cookies = await page.context().cookies();
  const cookie = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
  // JSON.stringify gera uma string YAML válida; o conteúdo entre aspas não passa pelo replace como padrão ($).
  const plan = fs.readFileSync(template, 'utf8').split('"__ADMIN_COOKIE__"').join(JSON.stringify(cookie));
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, plan);
  console.log('login ok; cookies:', cookies.map((c) => c.name).join(', '));
  console.log('plano gerado em', output);
  await browser.close();
})().catch((error) => {
  console.error('FALHOU:', error.message);
  process.exit(1);
});
