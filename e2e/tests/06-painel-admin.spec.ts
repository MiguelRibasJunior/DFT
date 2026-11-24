import path from 'node:path';
import { collectProblems, expect, loginAsAdmin, test } from './helpers';

/**
 * O Filament limita o login a 5 tentativas por minuto. Para não esbarrar nisso, a sessão é criada UMA vez
 * (beforeAll) e reaproveitada pelos testes que já precisam estar logados. Só os testes do próprio login
 * (3 tentativas no total, com a do beforeAll) usam o navegador "limpo".
 */
const SESSION = path.join(__dirname, '..', '.tmp', 'admin-session.json');

test.beforeAll(async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await loginAsAdmin(page);
  await context.storageState({ path: SESSION });
  await context.close();
});

test.describe('Login do painel', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('visitante sem login é mandado para a tela de login', async ({ page }) => {
    for (const url of ['/admin', '/admin/projects', '/admin/contact-submissions', '/admin/settings']) {
      await page.goto(url);
      await expect(page, url).toHaveURL(/\/admin\/login/);
    }
  });

  test('a tela de login carrega o Livewire e o login funciona (sem bytes soltos nas respostas)', async ({ page }) => {
    const problems = collectProblems(page);

    await page.goto('/admin/login');
    // Se bootstrap/app.php ou routes/web.php voltarem a ter bytes antes do <?php, o livewire.js chega cortado.
    await expect.poll(() => page.evaluate(() => typeof (window as unknown as { Livewire?: unknown }).Livewire)).toBe('object');

    await loginAsAdmin(page);
    await expect(page.getByRole('link', { name: 'Projetos' }).first()).toBeVisible();

    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('senha errada não entra e mostra o erro', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('E-mail').fill('e2e-admin@example.test');
    await page.locator('input[type="password"]').fill('senha-errada-123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('body')).toContainText(/credenciais|não correspondem|incorret/i);
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('Painel (logado)', () => {
  test.use({ storageState: SESSION });

  test('todas as telas principais abrem sem erro', async ({ page }) => {
    const problems = collectProblems(page);

    const screens = [
      '/admin',
      '/admin/projects',
      '/admin/projects/create',
      '/admin/my-tasks',
      '/admin/ctas',
      '/admin/ctas/create',
      '/admin/contact-links',
      '/admin/contact-links/create',
      '/admin/contact-submissions',
      '/admin/messages',
      '/admin/messages/create',
      '/admin/users',
      '/admin/users/create',
      '/admin/settings',
      '/admin/footer',
    ];

    for (const url of screens) {
      const response = await page.goto(url);
      expect(response?.status(), url).toBe(200);
      await expect(page.locator('body'), url).not.toContainText(/Server Error|Whoops|Exception/);
    }

    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('o contato enviado pelo site aparece no painel e o aviso por e-mail falho foi registrado', async ({ page }) => {
    await page.goto('/admin/contact-submissions');

    const row = page.getByRole('row', { name: /Teste E2E Playwright/ }).first();
    await expect(row).toBeVisible();

    await row.getByRole('link', { name: /Ver detalhes/ }).click();
    // O proxy do ambiente de teste bloqueia o formsubmit.co: o contato foi salvo e o aviso ficou como falho.
    await expect(page.getByLabel('Notificação por e-mail')).toHaveValue(/Falhou/);
  });

  test('configurações: o título de SEO salvo no painel aparece no site público', async ({ page, request }) => {
    await page.goto('/admin/settings');

    await page.getByRole('tab', { name: 'SEO' }).click();
    await page.getByRole('textbox', { name: 'Meta título padrão' }).fill('DFT E2E — título de teste');
    await page.getByRole('button', { name: 'Salvar configurações' }).click();
    await expect(page.getByText('Configurações atualizadas').first()).toBeVisible();

    const html = await (await request.get('/')).text();
    expect(html).toContain('<title>DFT E2E — título de teste</title>');

    // Desfaz, para não contaminar os outros testes.
    await page.getByRole('textbox', { name: 'Meta título padrão' }).fill('');
    await page.getByRole('button', { name: 'Salvar configurações' }).click();
    await expect(page.getByText('Configurações atualizadas').first()).toBeVisible();
    expect(await (await request.get('/')).text()).toContain('<title>Devs From Tomorrow');
  });

  test('configurações: ID de analytics com formato inválido é recusado', async ({ page }) => {
    await page.goto('/admin/settings');

    await page.getByRole('tab', { name: 'Integrações' }).click();
    const field = page.getByRole('textbox', { name: 'Google Analytics ID' });
    const original = await field.inputValue();
    await field.fill('UA-123');
    await page.getByRole('button', { name: 'Salvar configurações' }).click();

    await expect(page.locator('body')).toContainText('Use o formato G-XXXXXXXXXX');

    // Não deixa o valor inválido no banco.
    await field.fill(original);
  });
});

test.describe('Lixeira de projetos', () => {
  test.use({ storageState: SESSION });

  test('apagar manda para a lixeira (some do site) e restaurar traz de volta', async ({ page, request }) => {
    const publicProjects = async () => ((await (await request.get('/api/projects')).json()).data as { title: string }[]);
    const before = await publicProjects();
    expect(before.length).toBeGreaterThan(0);
    const title = before[0].title;
    const rowName = new RegExp(title.slice(0, 18));

    await page.goto('/admin/projects');
    const row = page.getByRole('row', { name: rowName }).first();
    await expect(row).toBeVisible();

    // Apagar: o painel pede confirmação.
    await row.getByRole('button', { name: 'Excluir' }).click();
    await page.getByRole('alertdialog', { name: 'Excluir projeto' }).getByRole('button', { name: 'Excluir' }).click();
    await expect(page.getByRole('alertdialog', { name: 'Excluir projeto' })).toBeHidden();

    await expect.poll(async () => (await publicProjects()).length, { message: 'o projeto apagado some do site' }).toBe(before.length - 1);
    await expect(page.getByRole('row', { name: rowName })).toHaveCount(0);

    // Está na lixeira: o filtro "Lixeira" passa a mostrar os excluídos.
    await page.getByRole('button', { name: 'Filtrar' }).click();
    await page.getByLabel('Lixeira').selectOption({ label: 'Somente registros excluídos' });
    const apply = page.getByRole('button', { name: /Aplicar/ });
    if (await apply.isVisible().catch(() => false)) await apply.click();
    const deletedRow = page.getByRole('row', { name: rowName }).first();
    await expect(deletedRow).toBeVisible();

    // Restaurar.
    await deletedRow.getByRole('button', { name: 'Restaurar' }).click();
    // O Filament pede confirmação também para restaurar.
    const confirm = page.getByRole('alertdialog', { name: 'Restaurar projeto' });
    // O invólucro do modal não tem área própria (o Playwright o considera oculto); o botão dentro dele é o que importa.
    await confirm.getByRole('button', { name: 'Restaurar' }).click();

    await expect.poll(async () => (await publicProjects()).length, { message: 'o projeto restaurado volta ao site' }).toBe(before.length);
  });
});
