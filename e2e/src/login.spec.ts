import { test, expect } from '@playwright/test';

test('login demo navega al dashboard', async ({ page }) => {
  await page.goto('http://localhost:8100/login');
  await page.fill('input[type="email"]', 'demo@demo.cl');
  await page.fill('input[type="password"]', '123456');
  await page.click('ion-button[type="submit"]');
  await expect(page.getByText(/History/i)).toBeVisible(); // algo que aparezca en tabs
});
