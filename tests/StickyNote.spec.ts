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

//negative test case: StickyNote does not show a second textarea by default

test('StickyNote does not show a second textarea by default', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Check that there is only one textarea
    const textareas = page.locator('textarea');
    const count = await textareas.count();
    expect(count).toBe(1); // Ensure there is only one textarea

    const secondNote = textareas.nth(1);//nth(1) gets the second textarea, if it exists. 
    // nth is a method that gets the nth element in a collection, and takes the arg 1 
    //because Playwright uses zero-based indexing
    //example: nth(0) gets the first element, nth(1) gets the second element, etc
    await expect(secondNote).toHaveCount(0); // Ensure the second textarea does not exist
    });

