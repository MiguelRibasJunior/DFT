import { collectProblems, expect, loadWholePage, test } from './helpers';

test.describe('Página inicial', () => {
  test('carrega sem erros e com todas as seções', async ({ page }) => {
    const problems = collectProblems(page);

    await page.goto('/');
    await loadWholePage(page);

    await expect(page).toHaveTitle(/Devs From Tomorrow/);
    await expect(page.locator('h1')).toHaveCount(1);

    for (const id of ['hero', 'solucoes', 'automacao', 'diferenciais', 'processo', 'portfolio', 'tecnologias', 'comece-agora', 'contato']) {
      await expect(page.locator(`#${id}`), `seção #${id}`).toBeAttached();
    }

    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('não tem nenhum link para o painel administrativo', async ({ page }) => {
    await page.goto('/');
    await loadWholePage(page);

    await expect(page.locator('a[href*="/admin"]')).toHaveCount(0);
    await expect(page.getByText(/Painel Admin|Área Administrativa/i)).toHaveCount(0);
  });

  test('tem SEO completo e dados estruturados válidos', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^http/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Devs From Tomorrow/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^http/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');

    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw ?? '');
    const types = data['@graph'].map((item: { '@type': string }) => item['@type']);
    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'ProfessionalService']));
  });

  test('o primeiro foco do teclado é o "Pular para o conteúdo"', async ({ page }) => {
    await page.goto('/');
    // O React monta a página depois do evento load: sem esperar o link existir, o Tab cai no vazio.
    await expect(page.getByRole('link', { name: /Pular para o conteúdo/ })).toBeAttached();
    await page.keyboard.press('Tab');

    await expect(page.getByRole('link', { name: /Pular para o conteúdo/ })).toBeFocused();
  });

  test('o menu leva às seções com a âncora certa', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    // Espera as seções carregadas sob demanda assentarem (o caso do clique imediato está no teste abaixo).
    await page.waitForLoadState('networkidle');

    await page.locator('.site-header__nav').getByRole('link', { name: 'Processo' }).click();

    await expect(page).toHaveURL(/#processo$/);
    await expect(page.locator('#processo')).toBeInViewport();
    // A rolagem é suave: espera ela terminar antes de medir onde a seção ficou (logo abaixo do cabeçalho).
    await expect
      .poll(() => page.locator('#processo').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 8000 })
      .toBeLessThan(200);
  });

  // DEFEITO CONHECIDO: se o clique no menu acontece no primeiro instante, antes de todas as seções carregarem, a
  // página às vezes para ~1000px antes da seção (o endereço vira #processo, mas a tela não chega). Reproduzido em
  // 1 de 4 tentativas. Tire o fixme quando o deslocamento das seções carregadas sob demanda for tratado.
  test.fixme('o clique no menu logo ao abrir a página também chega na seção', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.locator('.site-header__nav').getByRole('link', { name: 'Processo' }).click();
    await page.waitForTimeout(2500);

    expect(await page.locator('#processo').evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBeLessThan(200);
  });
});

test.describe('Sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('mostra um aviso com o nome do site e os canais de contato, em vez de tela em branco', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Devs From Tomorrow' })).toBeVisible();
    await expect(page.getByRole('link', { name: /E-mail:/ })).toBeVisible();
  });
});

test.describe('Dados que o servidor entrega ao navegador', () => {
  test('a API pública devolve só projetos em destaque e sem campos internos', async ({ request }) => {
    const response = await request.get('/api/projects');
    expect(response.ok()).toBeTruthy();

    const { data } = await response.json();
    expect(data.length).toBeGreaterThan(0);
    for (const project of data) {
      for (const internal of ['manager_id', 'progress', 'management_status', 'priority', 'status', 'deleted_at']) {
        expect(project, `campo interno "${internal}"`).not.toHaveProperty(internal);
      }
    }
  });

  test('não existe API administrativa', async ({ request }) => {
    for (const path of ['/api/admin/submissions', '/api/admin/projects', '/api/admin/login']) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(404);
    }
  });

  test('as páginas Inertia enviam só as props públicas', async ({ page }) => {
    let raw = '';
    const propsOf = async (url: string) => {
      await page.goto(url);
      raw = (await page.locator('script[data-page="app"]').textContent()) ?? '';
      return JSON.parse(raw || '{}').props as Record<string, unknown>;
    };

    const home = await propsOf('/');
    expect(home).not.toHaveProperty('initialData');
    expect(home).not.toHaveProperty('projects');

    for (const url of ['/termos', '/privacidade']) {
      const props = await propsOf(url);
      expect(Object.keys(props.settings as object).sort(), url).toEqual(['copyright_text', 'email', 'site_name']);
    }

    // Só o data-page conta: o bloco #dft-analytics do <head> leva os IDs de propósito (é o que alimenta o banner).
    for (const internal of ['G-E2ETEST123', 'GTM-E2ETEST1', 'extra_scripts', 'google_analytics_id', 'privacy_policy', 'manager_id']) {
      expect(raw, internal).not.toContain(internal);
    }
  });
});
