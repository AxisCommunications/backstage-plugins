import { test, expect } from '@playwright/test';

test('test that readme card is displayed', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('link', { name: 'example-website' }).click();
  await expect(
    page.getByText(
      'No README.md file found at source location: /home/fridaja/projects/backstage-plugins/examples/entities.yaml',
    ),
  ).toBeVisible();
});

test('test that readme card dialog is opened', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('link', { name: 'example-website' }).click();
  await page.getByLabel('open dialog').click();
  await expect(page.getByText('Close')).toBeVisible();
});
