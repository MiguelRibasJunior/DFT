/**
 * Executor dos testes de ponta a ponta.
 *
 * Prepara um ambiente ISOLADO (não toca no seu banco nem no seu .env), roda o Playwright e restaura tudo:
 *   1. cria um banco SQLite próprio em e2e/.tmp (migrate:fresh + seed de demonstração + IDs de analytics de teste)
 *   2. esconde public/hot (o Vite acharia que há servidor de desenvolvimento) e gera o build do front-end
 *   3. sobe o servidor PHP em modo "production" na porta 8012 (feito pelo playwright.config.ts)
 *   4. roda os testes no Microsoft Edge instalado (sem baixar navegador)
 *   5. no final, devolve public/hot ao lugar
 *
 * O aviso por e-mail do formulário (formsubmit.co) é BLOQUEADO: CONTACT_NOTIFICATION_ENDPOINT aponta para uma porta
 * sem ninguém ouvindo. Nenhum dado sai para a internet; o job registra o erro, como em uma queda de rede.
 * (Um proxy HTTP "morto" foi tentado antes e NÃO funciona: o PHP embutido o ignora e a chamada saía de verdade.)
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const tmp = path.join(here, '.tmp');
const db = path.join(tmp, 'e2e.sqlite');
const hot = path.join(root, 'public', 'hot');
const hotBackup = `${hot}.e2e-backup`;

const appEnv = {
  APP_ENV: 'production',
  APP_DEBUG: 'false',
  APP_URL: 'http://127.0.0.1:8012',
  DB_CONNECTION: 'sqlite',
  DB_DATABASE: db,
  ADMIN_EMAIL: 'e2e-admin@example.test',
  ADMIN_PASSWORD: 'e2e-senha-forte-123',
  ADMIN_NOTIFICATION_EMAIL: 'nao-enviar@example.test',
  SESSION_DRIVER: 'file',
  CACHE_STORE: 'file',
  QUEUE_CONNECTION: 'sync',
  MAIL_MAILER: 'log',
  LOG_LEVEL: 'error',
  CONTACT_NOTIFICATION_ENDPOINT: 'http://127.0.0.1:9/ajax',
};

function run(label, command, args, options = {}) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true, ...options });
  if (result.status !== 0) {
    throw new Error(`Falhou: ${label} (código ${result.status})`);
  }
}

function restore() {
  if (existsSync(hotBackup)) {
    renameSync(hotBackup, hot);
    console.log('\n↩ public/hot restaurado');
  }
}

let exitCode = 1;

// Se uma execução anterior foi interrompida à força, o public/hot ficou escondido: devolve antes de começar.
restore();

try {
  mkdirSync(tmp, { recursive: true });
  rmSync(db, { force: true });
  writeFileSync(db, '');

  if (existsSync(hot)) {
    renameSync(hot, hotBackup);
    console.log('public/hot escondido durante os testes');
  }

  run('Gerando o build do front-end', 'npm', ['run', 'build'], { cwd: root });

  const seedEnv = { ...process.env, ...appEnv, APP_ENV: 'local', APP_DEBUG: 'true' };
  run('Criando o banco de testes e o conteúdo de demonstração', 'php', ['artisan', 'migrate:fresh', '--seed', '--force'], {
    cwd: root,
    env: seedEnv,
  });
  run('Ligando analytics de teste (para exercitar o banner de cookies)', 'php', [path.join('e2e', 'support', 'set-analytics.php')], {
    cwd: root,
    env: { ...process.env, E2E_DB: db },
  });

  const args = ['playwright', 'test', ...process.argv.slice(2)];
  console.log('\n▶ Rodando os testes (Microsoft Edge)');
  const result = spawnSync('npx', args, {
    cwd: here,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...appEnv, E2E_DB: db, E2E_ROOT: root },
  });
  exitCode = result.status ?? 1;
} catch (error) {
  console.error(`\n✖ ${error.message}`);
} finally {
  restore();
}

process.exit(exitCode);
