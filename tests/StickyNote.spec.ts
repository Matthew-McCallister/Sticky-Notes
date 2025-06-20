import { test, expect } from '@playwright/test';

test('StickyNote renders and can be edited', async ({ page }) => {
  // Start your dev server before running this test!
  await page.goto('http://localhost:5173/');

  // Check that the sticky note textarea exists
  const textarea = page.locator('textarea');
  await expect(textarea).toBeVisible();

  // Type into the sticky note
  await textarea.fill('My first sticky note!');
  await expect(textarea).toHaveValue('My first sticky note!');

  // Check that the delete button exists and works
  const deleteButton = page.locator('button[aria-label="Delete Note"]');
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  // After deletion, the textarea should be gone or empty
  await expect(textarea).toHaveValue('');
});

