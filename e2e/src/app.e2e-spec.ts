import { test, expect } from '@playwright/test';

test('muestra la pantalla de login', async ({ page }) => {
  await page.goto('/login');

  await expect(page.locator('ion-title')).toContainText(/sign in/i);
  await expect(
    page.locator('ion-input[data-testid="login-email"]')
  ).toBeVisible();
  await expect(
    page.locator('ion-input[data-testid="login-password"]')
  ).toBeVisible();
  await expect(
    page.locator('ion-button[data-testid="login-submit"]')
  ).toBeVisible();
});

test('ruta protegida redirige a login y luego vuelve a tabs al iniciar sesión', async ({
  page,
}) => {
  await page.goto('/tabs');

  // Guard debería empujarte a /login
  await expect(page).toHaveURL(/\/login/);

  await page
    .locator('ion-input[data-testid="login-email"]')
    .locator('input')
    .fill('demo@demo.cl');

  await page
    .locator('ion-input[data-testid="login-password"]')
    .locator('input')
    .fill('123456');

  await page.locator('ion-button[data-testid="login-submit"]').click();

  await expect(page).toHaveURL(/\/tabs/);
});
