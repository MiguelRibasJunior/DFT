import { test as base, expect, type Page } from '@playwright/test';

/**
 * `test` com duas proteções automáticas em toda página:
 * - o Google Fonts é respondido com CSS vazio (os testes não dependem de internet nem poluem o console);
 * - os scripts do Google Analytics/Tag Manager NUNCA saem para a internet: são interceptados, registrados em
 *   `googleHits` e respondidos com JavaScript vazio. Assim dá para provar que nada é pedido antes do "Aceitar".
 */
export const test = base.extend<{ googleHits: string[] }>({
  googleHits: [
    async ({ page }, use) => {
      const hits: string[] = [];
      await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => {
        hits.push(route.request().url());
        return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
      });
      await use(hits);
    },
    { auto: true },
  ],
  page: async ({ page }, use) => {
    await page.route(/fonts\.googleapis\.com/, (route) => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await page.route(/fonts\.gstatic\.com/, (route) => route.fulfill({ status: 200, contentType: 'font/woff2', body: '' }));
    await use(page);
  },
});

export { expect };

/** Erros que o visitante provocaria: exceções da página, erros no console e requisições que falharam. */
export function collectProblems(page: Page): string[] {
  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(`erro de página: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    // ERR_ABORTED é o navegador cancelando o que estava carregando ao navegar para outra tela: não é falha do site.
    if (request.failure()?.errorText === 'net::ERR_ABORTED') return;
    problems.push(`requisição falhou: ${request.url()} (${request.failure()?.errorText})`);
  });
  return problems;
}

/** Rola a página inteira para disparar as seções carregadas sob demanda (lazy) e volta ao topo. */
export async function loadWholePage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.max(300, window.innerHeight - 100);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 300));
  });
}

export const ADMIN = { email: 'e2e-admin@example.test', password: 'e2e-senha-forte-123' };

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/admin/login');
  await page.getByLabel('E-mail').fill(ADMIN.email);
  await page.locator('input[type="password"]').fill(ADMIN.password);
  await page.getByRole('button', { name: 'Login' }).click();
  // O primeiro acesso ao painel é lento no servidor embutido do PHP (compila as views do Filament).
  await expect(page).toHaveURL(/\/admin\/?$/, { timeout: 60_000 });
}
