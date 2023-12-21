import { test, expect } from '@playwright/test';

test('test if issues are visible', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('link', { name: 'example-website' }).click();
  await page.getByTestId('header-tab-4').click();
  await expect(
    page.getByRole('link', {
      name: 'Validate mandatory information for teams and repositories , Opens in a new window',
    }),
  ).toBeVisible();
});

test('test if project button works', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('link', { name: 'example-website' }).click();
  await page.getByTestId('header-tab-4').click();
  await expect(page).toHaveURL(
    '/catalog/default/component/example-website/jira-dashboard',
  );
  const page3Promise = page.waitForEvent('popup');
  await page
    .getByRole('button', { name: 'Go to project , Opens in a new window' })
    .click();
  const page3 = await page3Promise;
  await expect(page3).not.toHaveURL(
    '/catalog/default/component/example-website/jira-dashboard',
  );
});
