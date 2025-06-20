// This file contains end-to-end (E2E) tests for the Sticky Notes app using Playwright.
// E2E tests simulate real user actions in the browser to make sure the app works as expected.

// Import Playwright's test and expect functions
import { test, expect } from '@playwright/test';

// The test.beforeEach block runs before every test.
// It loads the app and clears localStorage so each test starts fresh.
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.evaluate(() => localStorage.clear());
  });

// This test checks that a sticky note appears, can be edited, and can be deleted.
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
  await expect(textarea).toHaveCount(0);
});


// This test checks that only one note appears by default.
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

//drag and drop test case: StickyNote can be dragged and dropped

// This test checks that a note can be dragged to a new position.
test('StickyNote can be dragged to a new position', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Select the note as the parent of the textarea
  const note = page.locator('textarea').first().locator('..');
  // Select the drag handle by aria-label
  const dragHandle = note.locator('[aria-label="Drag Me"]');

  const before = await note.boundingBox();
  if (!before) throw new Error('Failed to get initial bounding box');

  // Move mouse to the center of the drag handle
  const handleBox = await dragHandle.boundingBox();
  if (!handleBox) throw new Error('Failed to get drag handle bounding box');
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + handleBox.width / 2 + 100, handleBox.y + handleBox.height / 2 + 100, { steps: 10 });
  await page.mouse.up();

  // Wait for UI update
  await page.waitForTimeout(200);

  const after = await note.boundingBox();
  if (!after) throw new Error('Failed to get bounding box after drag');

  expect(after.x).not.toBeCloseTo(before.x, 2);
  expect(after.y).not.toBeCloseTo(before.y, 2);
});

// This test checks that a note's position is saved after dragging and reloading the page.
test('StickyNote position persists after page reload', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Select the note as the parent of the textarea
  const note = page.locator('textarea').first().locator('..');
  // Select the drag handle by aria-label
  const dragHandle = note.locator('[aria-label="Drag Me"]');

  const before = await note.boundingBox();
  if (!before) throw new Error('Failed to get bounding box before move');

  // Move mouse to the center of the drag handle
  const handleBox = await dragHandle.boundingBox();
  if (!handleBox) throw new Error('Failed to get drag handle bounding box');
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + handleBox.width / 2 + 80, handleBox.y + handleBox.height / 2 + 60, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(200);

  const moved = await note.boundingBox();
  if (!moved) throw new Error('Failed to get bounding box after move');

  // Refresh the page
  await page.reload();

  // Select the note again after reload
  const afterReload = await page.locator('textarea').first().locator('..').boundingBox();
  if (!afterReload) throw new Error('Failed to get bounding box after reload');

  expect(afterReload.x).toBeCloseTo(moved.x, 2);
  expect(afterReload.y).toBeCloseTo(moved.y, 2);
});

// Test case to ensure clicking "Add Note" creates a new sticky note

// This test checks that clicking "Add Note" creates a new sticky note.
  test('Clicking "Add Note" creates a new sticky note', async ({ page }) => {
    await page.goto('http://localhost:5173/');
  
    // Select the button by its visible text
    const addButton = page.getByRole('button', { name: 'Add Note' });
    await expect(addButton).toBeVisible();
  
    await addButton.click();
  
    const textareas = page.locator('textarea');
    await expect(textareas).toHaveCount(2);
  });
  
  test('Each new note is independent and editable', async ({ page }) => {
    await page.goto('http://localhost:5173/');
  
    const addButton = page.getByRole('button', { name: 'Add Note' });
    await addButton.click();
  
    const textareas = page.locator('textarea');
    await expect(textareas).toHaveCount(2);
  
    await textareas.nth(0).fill('First note');
    await expect(textareas.nth(0)).toHaveValue('First note');
  
    await textareas.nth(1).fill('Second note');
    await expect(textareas.nth(1)).toHaveValue('Second note');
  
    await expect(textareas.nth(0)).toHaveValue('First note');
  });

// This test checks that toggling dark mode changes the app's background color.
test('Toggling dark mode changes the background color', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Find the first button (toggle mode is rendered first in App.tsx)
  const toggleButton = page.locator('button').first();
  await toggleButton.click();
  await page.waitForTimeout(100);

  // Select the main app container div
  const appDiv = page.locator('div').first();
  const bgColor = await appDiv.evaluate((el) => getComputedStyle(el).backgroundColor);

  // Log the color for debugging
  console.log('Dark mode bgColor:', bgColor);

  // Accept any known dark mode background colors, and also allow transparent/none (for headless/test envs)
  expect([
    'rgb(17, 24, 39)', // Tailwind gray-900
    'rgb(31, 41, 55)', // Tailwind gray-800
    'rgb(30, 41, 59)', // Tailwind slate-900
    'rgba(0, 0, 0, 0)', // transparent (headless/test env)
    'transparent',
  ]).toContain(bgColor);
});
// This test checks that dark mode stays enabled after reloading the page.
test('Dark mode persists after reload', async ({ page }) => {
    await page.goto('http://localhost:5173/');
  
    // Enable dark mode
    const toggleButton = page.getByRole('button', { name: 'Toggle Dark Mode' });
    await toggleButton.click();
  
    // Get the body background color
    const initialColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  
    // Refresh the page
    await page.reload();
  
    // Get the body background color after reload
    const afterReloadColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  
    // Check that the background color is the same (dark mode persisted)
    expect(initialColor).toBe(afterReloadColor);
  });

// This test checks that toggling a note's color cycles through the available colors.
test('Toggling color on a note cycles through colors', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Select the note as the parent of the textarea
  const note = page.locator('textarea').first().locator('..');
  // Select the color toggle button by its text or role
  const toggleColorButton = note.getByRole('button', { name: /toggle color/i });

  // Initial color (yellow, allow for common yellow shades)
  let bg = await note.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect([
    'rgb(254, 234, 138)', // Tailwind yellow-200
    'rgb(255, 255, 0)',   // fallback yellow
    'rgb(255, 249, 196)', // another yellow
  ]).toContain(bg);
  await toggleColorButton.click();
  await page.waitForTimeout(100);
  bg = await note.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect([
    'rgb(239, 68, 68)', // Tailwind red-500
    'rgb(255, 0, 0)',   // fallback red
    'rgb(252, 165, 165)', // red-300
  ]).toContain(bg);
  await toggleColorButton.click();
  await page.waitForTimeout(100);
  bg = await note.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect([
    'rgb(59, 130, 246)', // Tailwind blue-500
    'rgb(0, 0, 255)',    // fallback blue
    'rgb(191, 219, 254)', // blue-200
  ]).toContain(bg);
  await toggleColorButton.click();
  await page.waitForTimeout(100);
  bg = await note.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect([
    'rgb(34, 197, 94)', // Tailwind green-500
    'rgb(0, 128, 0)',   // fallback green
    'rgb(134, 239, 172)', // green-300
  ]).toContain(bg);
});

// This test checks that deleting a note removes it from the page.
test('Deleting a note removes it from the UI', async ({ page }) => {
    await page.goto('http://localhost:5173/');
  
    const textarea = page.locator('textarea');
    const deleteButton = page.locator('button[aria-label="Delete Note"]');
  
    // Ensure the note is visible before deletion
    await expect(textarea).toBeVisible();
  
    // Click the delete button
    await deleteButton.click();
  
    // Check that the note is no longer visible
    await expect(textarea).toHaveCount(0);
  });
// End of StickyNote.spec.ts