import { defineConfig } from '@playwright/test';
import path from 'node:path';

const root = process.env.E2E_ROOT;

if (!root || !process.env.E2E_DB) {
  throw new Error('Rode os testes por "npm test" dentro de e2e/ (ele prepara o banco isolado e o build antes).');
}

const PORT = 8012;
const baseURL = `http://127.0.0.1:${PORT}`;
const laravelRouter = path.join(root, 'vendor', 'laravel', 'framework', 'src', 'Illuminate', 'Foundation', 'resources', 'server.php');

export default defineConfig({
  testDir: './tests',
  // Um único servidor PHP embutido e um banco SQLite: sem paralelismo, e os arquivos rodam em ordem (01, 02, ...).
  workers: 1,
  fullyParallel: false,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    // Usa o Microsoft Edge instalado no computador: não é preciso baixar navegador.
    channel: 'msedge',
    headless: true,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    // Servidor embutido do PHP com o roteador do Laravel. Não dá para usar "artisan serve": ele descarta as
    // variáveis de ambiente (DB_DATABASE etc.) e o servidor leria o banco do desenvolvedor.
    // O roteador procura o index.php no diretório ATUAL, então o servidor tem que rodar dentro de public/.
    command: `php -S 127.0.0.1:${PORT} "${laravelRouter}"`,
    cwd: path.join(root, 'public'),
    // Rota PHP de verdade (e não um arquivo estático): se o Laravel quebrar, o teste falha logo em vez de esperar.
    url: `${baseURL}/api/settings`,
    timeout: 120_000,
    reuseExistingServer: false,
    // CONTACT_NOTIFICATION_ENDPOINT (definido em run.mjs) já aponta o aviso por e-mail para uma porta morta.
    env: process.env as Record<string, string>,
  },
});
