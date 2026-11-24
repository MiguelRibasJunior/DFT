import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, loadWholePage, test } from './helpers';

/** Resume as violações do axe de forma legível (regra, impacto e onde). */
async function violationsOf(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();

  return violations.map((violation) => ({
    regra: violation.id,
    impacto: violation.impact,
    ajuda: violation.help,
    elementos: violation.nodes.slice(0, 3).map((node) => node.target.join(' ')),
  }));
}

test.describe('Acessibilidade automatizada (axe, WCAG 2.1 A/AA)', () => {
  // O axe não enxerga animações pausadas nem o canvas decorativo; desligar o movimento deixa a leitura estável.
  test.use({ reducedMotion: 'reduce' });

  test('página inicial com o banner de cookies aberto', async ({ page }) => {
    test.fail(true, 'DEFEITOS CONHECIDOS (WCAG): botão dentro de botão nos cards de projeto (nested-interactive) e nome acessível que não contém o texto visível no logo e nos cards de solução (label-content-name-mismatch).');
    await page.goto('/');
    await loadWholePage(page);
    await expect(page.getByRole('region', { name: 'Cookies e privacidade' })).toBeVisible();

    expect(await violationsOf(page)).toEqual([]);
  });

  test('página inicial depois de decidir sobre os cookies (320px)', async ({ page }) => {
    test.fail(true, 'DEFEITOS CONHECIDOS (WCAG): os mesmos da página inicial (nested-interactive e label-content-name-mismatch).');
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Recusar' }).click();
    await loadWholePage(page);

    expect(await violationsOf(page)).toEqual([]);
  });

  test('modal de solução aberto', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Recusar' }).click();
    await loadWholePage(page);
    await page.getByRole('button', { name: /Ver detalhes de Chatbots Inteligentes/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    expect(await violationsOf(page, '[role="dialog"]')).toEqual([]);
  });

  test('formulário de contato com erro de validação', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Recusar' }).click();
    await loadWholePage(page);
    await page.getByLabel('Nome completo').fill('Teste A11y');
    await page.getByLabel('E-mail profissional').fill('a@b');
    await page.getByLabel('Telefone ou WhatsApp').fill('(11) 98765-4321');
    await page.getByLabel('Descrição do projeto ou necessidade').fill('Verificando a acessibilidade do erro.');
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.getByRole('alert')).toBeVisible();

    expect(await violationsOf(page, '#contato')).toEqual([]);
  });

  test('páginas legais (/privacidade e /termos)', async ({ page }) => {
    test.fail(true, 'DEFEITO CONHECIDO (WCAG 1.4.1): links dentro de parágrafos só se diferenciam pela cor (link-in-text-block); falta sublinhado em Pages/Privacy.tsx e Terms.tsx.');
    for (const url of ['/privacidade', '/termos']) {
      await page.goto(url);
      expect(await violationsOf(page), url).toEqual([]);
    }
  });

  test('tela de login do painel', async ({ page }) => {
    test.fail(true, 'DEFEITO CONHECIDO (WCAG 1.4.3): o link "← Voltar ao site" do login tem contraste insuficiente sobre o fundo branco.');
    await page.goto('/admin/login');

    expect(await violationsOf(page)).toEqual([]);
  });
});
