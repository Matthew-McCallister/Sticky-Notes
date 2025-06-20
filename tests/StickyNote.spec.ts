import { test, expect } from '@playwright/test';

// This test suite assumes you have a StickyNote component that can be interacted with
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.evaluate(() => localStorage.clear());
  });

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

//drag and drop test case: StickyNote can be dragged and dropped
test('StickyNote can be dragged to a new position', async ({ page }) => {
    await page.goto('http://localhost:5173/');
  
    const note = page.locator('.bg-yellow-200');
    const dragHandle = note.locator('text=Drag Me');
  
    const before = await note.boundingBox();
    if (!before) throw new Error('Failed to get initial bounding box');
  
    // Drag the note diagonally 100px
    await dragHandle.hover();
    await page.mouse.down();
    await page.mouse.move(before.x + 100, before.y + 100);
    await page.mouse.up();
  
    const after = await note.boundingBox();
    if (!after) throw new Error('Failed to get bounding box after drag');
  
    // Assert the note moved
    expect(after.x).not.toBeCloseTo(before.x, 2);
    expect(after.y).not.toBeCloseTo(before.y, 2);
  });

// Test case to ensure StickyNote position persists after page reload
  test('StickyNote position persists after page reload', async ({ page }) => {
    await page.goto('http://localhost:5173/');
  
    const note = page.locator('.bg-yellow-200');
    const dragHandle = note.locator('text=Drag Me');
  
    const before = await note.boundingBox();
    if (!before) throw new Error('Failed to get bounding box before move');
  
    // Drag the note to a new position
    await dragHandle.hover();
    await page.mouse.down();
    await page.mouse.move(before.x + 80, before.y + 60);
    await page.mouse.up();
  
    // Get the new position after moving
    const moved = await note.boundingBox();
    if (!moved) throw new Error('Failed to get bounding box after move');
  
    // Refresh the page
    await page.reload();
  
    const afterReload = await page.locator('.bg-yellow-200').boundingBox();
    if (!afterReload) throw new Error('Failed to get bounding box after reload');
  
    // Ensure position persists (within 2px margin of error)
    expect(afterReload.x).toBeCloseTo(moved.x, 2);
    expect(afterReload.y).toBeCloseTo(moved.y, 2);
  });

  // Test case to ensure clicking "Add Note" creates a new sticky note
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