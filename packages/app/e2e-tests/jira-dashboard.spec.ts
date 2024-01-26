import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'example-website' }).click();
  await page.getByTestId('header-tab-4').click();
});

test('should display header on the Jira Dashboard page', async ({ page }) => {
  await expect(page.getByText('Jira Dashboard')).toBeVisible();
});

test('should display project card with relevant information', async ({
  page,
}) => {
  await expect(page.getByTestId('project-card').getByText('BS')).toBeVisible();
  await expect(
    page.getByTestId('project-card').getByText('Backstage | software'),
  ).toBeVisible();
});

test('should filter table based on ticket id', async ({ page }) => {
  await expect(
    page.getByRole('cell', { name: 'TaskBS-657 , Opens in a new window' }),
  ).toBeVisible();
  await page.getByPlaceholder('Filter').first().click();
  await page.getByPlaceholder('Filter').first().fill('BS-653');
  await expect(
    page.getByRole('cell', { name: 'StoryBS-653 , Opens in a new window' }),
  ).toBeVisible();
  await expect(
    page.getByRole('cell', {
      name: 'TaskBS-657 , Opens in a new window',
    }),
  ).toBeHidden();
});
