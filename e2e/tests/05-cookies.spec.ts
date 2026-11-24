import { expect, loadWholePage, test } from './helpers';

/** O servidor de testes roda em "production" com IDs de analytics de teste; o Google é interceptado (googleHits). */
test.describe('Banner de cookies (LGPD)', () => {
  test('sem escolha: o banner aparece e NADA é pedido ao Google', async ({ page, googleHits }) => {
    await page.goto('/');
    await loadWholePage(page);

    const banner = page.getByRole('region', { name: 'Cookies e privacidade' });
    await expect(banner).toBeVisible();

    // "Recusar" e "Aceitar" têm exatamente o mesmo tamanho: recusar é tão fácil quanto aceitar.
    const [reject, accept] = await Promise.all([
      banner.getByRole('button', { name: 'Recusar' }).boundingBox(),
      banner.getByRole('button', { name: /Aceitar cookies de análise/ }).boundingBox(),
    ]);
    expect(Math.round(reject!.width)).toBe(Math.round(accept!.width));
    expect(Math.round(reject!.height)).toBe(Math.round(accept!.height));

    await page.waitForTimeout(1500);
    expect(googleHits, 'requisições ao Google antes do consentimento').toEqual([]);
    expect(await page.evaluate(() => localStorage.getItem('dft_cookie_consent'))).toBeNull();
  });

  test('o HTML do servidor não carrega nenhum script do Google', async ({ request }) => {
    const html = await (await request.get('/')).text();

    for (const forbidden of ['googletagmanager.com', 'google-analytics.com', 'gtag(', 'dataLayer']) {
      expect(html, forbidden).not.toContain(forbidden);
    }
    expect(html).toContain('id="dft-analytics"');
  });

  test('o banner é o primeiro foco depois do "Pular para o conteúdo"', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Cookies e privacidade' })).toBeAttached();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: /Pular para o conteúdo/ })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('region', { name: 'Cookies e privacidade' }).getByRole('link', { name: 'Política de Privacidade' })).toBeFocused();
  });

  test('aceitar: carrega GA4 e Tag Manager só agora, grava a escolha e vale na próxima visita', async ({ page, googleHits }) => {
    await page.goto('/');
    await loadWholePage(page);

    await page.getByRole('button', { name: /Aceitar cookies de análise/ }).click();

    await expect.poll(() => googleHits.length).toBeGreaterThanOrEqual(2);
    expect(googleHits.some((url) => url.includes('gtm.js?id=GTM-E2ETEST1'))).toBe(true);
    expect(googleHits.some((url) => url.includes('gtag/js?id=G-E2ETEST123'))).toBe(true);
    await expect(page.getByRole('region', { name: 'Cookies e privacidade' })).toBeHidden();

    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('dft_cookie_consent') ?? 'null'));
    expect(saved).toMatchObject({ v: 1, choice: 'accepted' });
    expect(Number.isFinite(Date.parse(saved.at))).toBe(true);

    // Nova visita: sem banner, e o analytics volta a carregar sozinho.
    const before = googleHits.length;
    await page.reload();
    await expect(page.getByRole('region', { name: 'Cookies e privacidade' })).toBeHidden();
    await expect.poll(() => googleHits.length).toBeGreaterThan(before);
  });

  test('recusar: nada é carregado, o banner some e o rodapé permite mudar de ideia', async ({ page, googleHits }) => {
    await page.goto('/');
    await loadWholePage(page);

    await page.getByRole('button', { name: 'Recusar' }).click();
    await expect(page.getByRole('region', { name: 'Cookies e privacidade' })).toBeHidden();
    await page.waitForTimeout(1000);
    expect(googleHits).toEqual([]);

    await page.reload();
    await expect(page.getByRole('region', { name: 'Cookies e privacidade' })).toBeHidden();
    expect(googleHits).toEqual([]);

    const reopen = page.getByRole('button', { name: 'Preferências de cookies' });
    await reopen.scrollIntoViewIfNeeded();
    await reopen.click();
    await expect(page.getByRole('region', { name: 'Cookies e privacidade' })).toContainText('recusados');
  });

  test('mudar de aceito para recusado apaga os cookies do Google e para de carregá-lo', async ({ page, context, googleHits, baseURL }) => {
    await page.goto('/');
    await loadWholePage(page);
    await page.getByRole('button', { name: /Aceitar cookies de análise/ }).click();
    await expect.poll(() => googleHits.length).toBeGreaterThanOrEqual(2);

    // Cookies que o Google criaria.
    await context.addCookies([
      { name: '_ga', value: 'GA1.1.1', url: baseURL! },
      { name: '_ga_E2ETEST123', value: 'GS1.1.1', url: baseURL! },
      { name: '_gid', value: 'GA1.1.2', url: baseURL! },
      { name: 'sessao_do_site', value: 'continua', url: baseURL! },
    ]);

    const reopen = page.getByRole('button', { name: 'Preferências de cookies' });
    await reopen.scrollIntoViewIfNeeded();
    await reopen.click();
    await expect(page.getByRole('region', { name: 'Cookies e privacidade' })).toContainText('aceitos');

    await page.getByRole('button', { name: 'Recusar' }).click();
    await page.waitForLoadState('load');

    await expect
      .poll(async () => (await context.cookies()).map((cookie) => cookie.name).filter((name) => /^_g/.test(name)))
      .toEqual([]);
    expect((await context.cookies()).some((cookie) => cookie.name === 'sessao_do_site')).toBe(true);

    // Depois do recarregamento, o Google não volta.
    const after = googleHits.length;
    await page.waitForTimeout(1500);
    expect(googleHits.length).toBe(after);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('dft_cookie_consent') ?? 'null').choice)).toBe('rejected');
  });

  test('uma escolha com mais de 12 meses é ignorada e o banner volta a perguntar', async ({ page, googleHits }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const old = new Date(Date.now() - 400 * 24 * 3600 * 1000).toISOString();
      localStorage.setItem('dft_cookie_consent', JSON.stringify({ v: 1, choice: 'accepted', at: old }));
    });
    await page.reload();

    await expect(page.getByRole('region', { name: 'Cookies e privacidade' })).toBeVisible();
    await page.waitForTimeout(1000);
    expect(googleHits).toEqual([]);
  });

  test('no desktop o banner é compacto e os botões têm altura normal', async ({ page }) => {
    test.fail(true, 'DEFEITO CONHECIDO: no desktop os botões do banner ficam com ~200px de altura (o flex: 1 1 200px do CSS vira altura na coluna) e o banner ocupa metade da tela. Corrija em css/components/ui.css e tire esta marca.');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const banner = page.getByRole('region', { name: 'Cookies e privacidade' });
    await expect(banner).toBeVisible();
    const box = await banner.boundingBox();
    expect(box!.height, 'altura do banner').toBeLessThan(260);

    for (const name of ['Recusar', /Aceitar cookies de análise/]) {
      const button = await banner.getByRole('button', { name }).boundingBox();
      expect(button!.height, 'altura do botão').toBeLessThanOrEqual(60);
    }
  });

  test('o banner cabe na tela de 320px sem criar rolagem horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');

    const banner = page.getByRole('region', { name: 'Cookies e privacidade' });
    await expect(banner).toBeVisible();
    const box = await banner.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    expect(box!.y + box!.height).toBeLessThanOrEqual(640);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });
});
