import { expect, loadWholePage, test } from './helpers';

test.describe('Modais (foco, teclado e retorno)', () => {
  test('modal de solução: o foco entra, fica preso e volta ao card no Esc', async ({ page }) => {
    await page.goto('/');
    await loadWholePage(page);

    const card = page.getByRole('button', { name: /Saiba mais sobre Chatbots Inteligentes/ });
    await card.scrollIntoViewIfNeeded();
    await card.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Fechar' }).first()).toBeFocused();

    // 12 Tabs seguidos: o foco nunca sai do modal.
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
      expect(inside, `Tab nº ${i + 1} saiu do modal`).toBe(true);
    }

    // Shift+Tab também fica dentro.
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(card).toBeFocused();
  });

  test('"Solicitar orçamento" leva ao formulário já com o serviço escolhido', async ({ page }) => {
    await page.goto('/');
    await loadWholePage(page);

    await page.getByRole('button', { name: /Saiba mais sobre Chatbots Inteligentes/ }).click();
    await page.getByRole('dialog').getByRole('button', { name: /Solicitar orçamento/ }).click();

    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.locator('#contato')).toBeInViewport();
    await expect(page.getByLabel(/Tipo de solução desejada/)).toHaveValue('Chatbot');
  });

  test('política de privacidade (rodapé): abre, prende o foco e devolve ao botão', async ({ page }) => {
    await page.goto('/');
    await loadWholePage(page);

    // O banner fica fixo na base da tela e cobre o rodapé até a pessoa decidir.
    await page.getByRole('button', { name: 'Recusar' }).click();

    const opener = page.getByRole('button', { name: 'Política de privacidade' });
    await opener.scrollIntoViewIfNeeded();
    await opener.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Política de privacidade' })).toBeVisible();
    await expect(dialog).toContainText('Cookies');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test('menu mobile: abre, prende o foco e fecha com Esc', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: /Abrir menu de navegação/ });
    await toggle.click();
    await expect(page.getByRole('button', { name: /Fechar menu de navegação/ })).toBeVisible();

    for (let i = 0; i < 14; i += 1) {
      await page.keyboard.press('Tab');
      const allowed = await page.evaluate(() => {
        const el = document.activeElement;
        return !!el && (!!el.closest('#menu-mobile') || el.classList.contains('site-header__toggle'));
      });
      expect(allowed, `Tab nº ${i + 1} saiu do menu`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: /Abrir menu de navegação/ })).toBeFocused();
  });
});
