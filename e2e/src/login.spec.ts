import { test, expect } from '@playwright/test';

test('login demo navega al dashboard (tabs)', async ({ page }) => {
  await page.goto('/login');

  await page
    .locator('ion-input[data-testid="login-email"]')
    .locator('input')
    .fill('demo@demo.cl');

  await page
    .locator('ion-input[data-testid="login-password"]')
    .locator('input')
    .fill('123456');

  await page.locator('ion-button[data-testid="login-submit"]').click();

  // Puede quedar en /tabs o /tabs/profile por el redirect de tabs-routing
  await expect(page).toHaveURL(/\/tabs/);

  // Algo visible del tab bar
  await expect(page.getByText(/History/i)).toBeVisible();
});
