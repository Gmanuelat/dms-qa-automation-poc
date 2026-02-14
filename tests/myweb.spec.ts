import { test, expect } from '@playwright/test';

test('MyWeb Books homepage loads', async ({ page }) => {
  await page.goto('http://localhost:8000');

  await expect(page).toHaveTitle(/MyWeb/i);

  await expect(
    page.getByText('Welcome to MyWeb Books')
  ).toBeVisible();
});
