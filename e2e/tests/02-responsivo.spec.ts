import { expect, loadWholePage, test } from './helpers';

// 320 px é a largura de referência do critério de reflow (WCAG 1.4.10).
const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440];

for (const width of WIDTHS) {
  test(`${width}px: sem rolagem horizontal e com o layout esperado`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await loadWholePage(page);

    // Nada vaza para os lados (o overflow-x global do site esconderia, então medimos o elemento).
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, 'rolagem horizontal').toBeLessThanOrEqual(0);

    // Etapas do processo: 1 coluna no celular, 2 no tablet, 3 (3 em cima e 3 embaixo) no desktop.
    const columns = await page.locator('.process-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns, 'colunas das etapas do processo').toBe(width >= 960 ? 3 : width >= 640 ? 2 : 1);

    // Cabeçalho: hambúrguer abaixo de 1200 px, menu completo a partir dele.
    if (width < 1200) {
      await expect(page.locator('.site-header__toggle')).toBeVisible();
    } else {
      await expect(page.locator('.site-header__nav')).toBeVisible();
    }

    // O botão mais largo do site (texto longo) tem que caber na tela.
    const button = page.getByRole('link', { name: /Quero automatizar um processo/ });
    await button.scrollIntoViewIfNeeded();
    const box = await button.boundingBox();
    expect(box, 'botão "Quero automatizar um processo"').not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
  });
}

test('processo: 3 cards em cima e 3 embaixo no desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await loadWholePage(page);

  const tops = await page.locator('.process-grid > *').evaluateAll((cards) => cards.map((card) => Math.round(card.getBoundingClientRect().top + window.scrollY)));
  const rows = [...new Set(tops)].map((top) => tops.filter((value) => value === top).length);

  expect(rows).toEqual([3, 3]);
});

test('áreas de toque: os botões e links do menu têm pelo menos 44px de altura no desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const heights = await page.locator('.site-header__nav-link').evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().height)));
  expect(heights.length).toBeGreaterThan(0);
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);
});
