import { expect, loadWholePage, test } from './helpers';
import type { Page } from '@playwright/test';

async function fillForm(page: Page, overrides: { email?: string; telefone?: string } = {}) {
  await page.getByLabel('Nome completo').fill('Teste E2E Playwright');
  await page.getByLabel('Empresa').fill('Empresa de Teste');
  await page.getByLabel('E-mail profissional').fill(overrides.email ?? 'e2e.playwright@example.test');
  await page.getByLabel('Telefone ou WhatsApp').fill(overrides.telefone ?? '(11) 98765-4321');
  await page.getByLabel('Descrição do projeto ou necessidade').fill('Mensagem criada pelo teste automatizado de ponta a ponta.');
}

async function openForm(page: Page) {
  await page.goto('/');
  await loadWholePage(page);
  await page.locator('#contato').scrollIntoViewIfNeeded();
}

test.describe('Formulário de contato', () => {
  test('os campos têm autocomplete (WCAG 1.3.5)', async ({ page }) => {
    await openForm(page);

    await expect(page.getByLabel('Nome completo')).toHaveAttribute('autocomplete', 'name');
    await expect(page.getByLabel('Empresa')).toHaveAttribute('autocomplete', 'organization');
    await expect(page.getByLabel('E-mail profissional')).toHaveAttribute('autocomplete', 'email');
    await expect(page.getByLabel('Telefone ou WhatsApp')).toHaveAttribute('autocomplete', 'tel');
  });

  test('e-mail inválido: o erro é anunciado, o campo fica marcado e recebe o foco', async ({ page }) => {
    await openForm(page);
    await fillForm(page, { email: 'a@b' });

    await page.getByRole('button', { name: 'Enviar mensagem' }).click();

    const alert = page.getByRole('alert');
    await expect(alert).toContainText('e-mail válido');

    const email = page.getByLabel('E-mail profissional');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAttribute('aria-describedby', 'contact-error');
    await expect(email).toBeFocused();

    // Ao corrigir, a marca de erro sai.
    await email.fill('e2e@example.test');
    await expect(email).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('telefone inválido: o erro é anunciado e o campo recebe o foco', async ({ page }) => {
    await openForm(page);
    await fillForm(page, { telefone: '12' });

    await page.getByRole('button', { name: 'Enviar mensagem' }).click();

    await expect(page.getByRole('alert')).toContainText('telefone');
    const phone = page.getByLabel('Telefone ou WhatsApp');
    await expect(phone).toHaveAttribute('aria-invalid', 'true');
    await expect(phone).toBeFocused();
  });

  test('envio válido: mostra a confirmação com foco e depois devolve o foco ao formulário', async ({ page }) => {
    await openForm(page);
    await fillForm(page);

    await page.getByRole('button', { name: 'Enviar mensagem' }).click();

    // O aviso por e-mail está bloqueado neste ambiente (proxy morto): mesmo assim o envio tem que dar certo.
    const heading = page.getByRole('heading', { name: 'Mensagem enviada com sucesso!' });
    await expect(heading).toBeVisible();
    await expect(heading).toBeFocused();

    await page.getByRole('button', { name: 'Enviar outra mensagem' }).click();
    await expect(page.getByLabel('Nome completo')).toBeFocused();
  });

  test('a mensagem enviada não expõe link para o painel', async ({ page }) => {
    await openForm(page);
    await fillForm(page);
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();

    await expect(page.getByRole('heading', { name: 'Mensagem enviada com sucesso!' })).toBeVisible();
    await expect(page.locator('a[href*="/admin"]')).toHaveCount(0);
  });
});
