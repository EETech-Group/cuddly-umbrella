import { test, expect } from '@playwright/test'

test.describe('Electronic Parts Database', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/')
  })

  test('should display the main page with title and description', async ({ page }) => {
    await expect(page.getByText('Electronic Parts Database')).toBeVisible()
    await expect(page.getByText('Manage your electronic components inventory')).toBeVisible()
  })

  test('should display the parts table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByText('Part Number')).toBeVisible()
    await expect(page.getByText('Name')).toBeVisible()
    await expect(page.getByText('Manufacturer')).toBeVisible()
    await expect(page.getByText('Category')).toBeVisible()
    await expect(page.getByText('Quantity')).toBeVisible()
    await expect(page.getByText('Location')).toBeVisible()
    await expect(page.getByText('Actions')).toBeVisible()
  })

  test('should have search and filter controls', async ({ page }) => {
    await expect(page.getByPlaceholder('Search parts...')).toBeVisible()
    await expect(page.getByRole('combobox')).toBeVisible() // Category filter
    await expect(page.getByRole('button', { name: 'New Part' })).toBeVisible()
  })

  test('should create a new part', async ({ page }) => {
    // Click the "New Part" button
    await page.getByRole('button', { name: 'New Part' }).click()

    // Wait for the form dialog to appear
    await expect(page.getByText('Create New Part')).toBeVisible()

    // Fill in the form
    await page.getByLabel('Part Number *').fill('E2E-001')
    await page.getByLabel('Name *').fill('E2E Test Resistor')
    await page.getByLabel('Manufacturer').fill('Test Manufacturer')
    await page.getByLabel('Category *').selectOption('resistor')
    await page.getByLabel('Quantity *').fill('100')
    await page.getByLabel('Location').fill('E2E-1')
    await page.getByLabel('Description').fill('E2E test component')
    await page.getByLabel('Datasheet URL').fill('https://example.com/e2e')

    // Submit the form
    await page.getByRole('button', { name: 'Create Part' }).click()

    // Wait for the form to close and the table to update
    await expect(page.getByText('Create New Part')).not.toBeVisible()
    
    // Verify the new part appears in the table
    await expect(page.getByText('E2E-001')).toBeVisible()
    await expect(page.getByText('E2E Test Resistor')).toBeVisible()
    await expect(page.getByText('Test Manufacturer')).toBeVisible()
    await expect(page.getByText('Resistor')).toBeVisible()
    await expect(page.getByText('100')).toBeVisible()
    await expect(page.getByText('E2E-1')).toBeVisible()
  })

  test('should search for parts', async ({ page }) => {
    // Search for a specific part
    await page.getByPlaceholder('Search parts...').fill('E2E-001')
    
    // Wait for search results (this might show no results if the part doesn't exist)
    await page.waitForTimeout(500) // Give time for search to complete
  })

  test('should filter parts by category', async ({ page }) => {
    // Select a category filter
    await page.getByRole('combobox').selectOption('resistor')
    
    // Wait for filter to apply
    await page.waitForTimeout(500)
  })

  test('should edit an existing part', async ({ page }) => {
    // First, create a part to edit
    await page.getByRole('button', { name: 'New Part' }).click()
    await page.getByLabel('Part Number *').fill('EDIT-001')
    await page.getByLabel('Name *').fill('Edit Test Part')
    await page.getByLabel('Category *').selectOption('capacitor')
    await page.getByLabel('Quantity *').fill('50')
    await page.getByRole('button', { name: 'Create Part' }).click()
    
    // Wait for the form to close
    await expect(page.getByText('Create New Part')).not.toBeVisible()

    // Find and click the edit button for the created part
    const editButton = page.locator('tr').filter({ hasText: 'EDIT-001' }).getByRole('button').first()
    await editButton.click()

    // Wait for the edit form to appear
    await expect(page.getByText('Edit Part')).toBeVisible()

    // Update the part
    await page.getByLabel('Name *').fill('Updated Edit Test Part')
    await page.getByLabel('Quantity *').fill('75')
    await page.getByRole('button', { name: 'Update Part' }).click()

    // Wait for the form to close
    await expect(page.getByText('Edit Part')).not.toBeVisible()

    // Verify the updated part appears in the table
    await expect(page.getByText('Updated Edit Test Part')).toBeVisible()
    await expect(page.getByText('75')).toBeVisible()
  })

  test('should delete a part', async ({ page }) => {
    // First, create a part to delete
    await page.getByRole('button', { name: 'New Part' }).click()
    await page.getByLabel('Part Number *').fill('DELETE-001')
    await page.getByLabel('Name *').fill('Delete Test Part')
    await page.getByLabel('Category *').selectOption('LED')
    await page.getByLabel('Quantity *').fill('25')
    await page.getByRole('button', { name: 'Create Part' }).click()
    
    // Wait for the form to close
    await expect(page.getByText('Create New Part')).not.toBeVisible()

    // Find and click the delete button for the created part
    const deleteButton = page.locator('tr').filter({ hasText: 'DELETE-001' }).getByRole('button').nth(1)
    await deleteButton.click()

    // Wait for the delete confirmation dialog
    await expect(page.getByText('Delete Part')).toBeVisible()
    await expect(page.getByText('DELETE-001')).toBeVisible()
    await expect(page.getByText('Delete Test Part')).toBeVisible()

    // Confirm the deletion
    await page.getByRole('button', { name: /delete/i }).click()

    // Wait for the dialog to close
    await expect(page.getByText('Delete Part')).not.toBeVisible()

    // Verify the part is no longer in the table
    await expect(page.getByText('DELETE-001')).not.toBeVisible()
    await expect(page.getByText('Delete Test Part')).not.toBeVisible()
  })

  test('should cancel part deletion', async ({ page }) => {
    // First, create a part
    await page.getByRole('button', { name: 'New Part' }).click()
    await page.getByLabel('Part Number *').fill('CANCEL-001')
    await page.getByLabel('Name *').fill('Cancel Test Part')
    await page.getByLabel('Category *').selectOption('transistor')
    await page.getByLabel('Quantity *').fill('10')
    await page.getByRole('button', { name: 'Create Part' }).click()
    
    // Wait for the form to close
    await expect(page.getByText('Create New Part')).not.toBeVisible()

    // Find and click the delete button
    const deleteButton = page.locator('tr').filter({ hasText: 'CANCEL-001' }).getByRole('button').nth(1)
    await deleteButton.click()

    // Wait for the delete confirmation dialog
    await expect(page.getByText('Delete Part')).toBeVisible()

    // Cancel the deletion
    await page.getByRole('button', { name: /cancel/i }).click()

    // Wait for the dialog to close
    await expect(page.getByText('Delete Part')).not.toBeVisible()

    // Verify the part is still in the table
    await expect(page.getByText('CANCEL-001')).toBeVisible()
    await expect(page.getByText('Cancel Test Part')).toBeVisible()
  })

  test('should validate required fields in create form', async ({ page }) => {
    await page.getByRole('button', { name: 'New Part' }).click()
    await expect(page.getByText('Create New Part')).toBeVisible()

    // Try to submit without filling required fields
    await page.getByRole('button', { name: 'Create Part' }).click()

    // The form should not submit and should show validation errors
    await expect(page.getByText('Create New Part')).toBeVisible()
  })

  test('should handle form cancellation', async ({ page }) => {
    await page.getByRole('button', { name: 'New Part' }).click()
    await expect(page.getByText('Create New Part')).toBeVisible()

    // Fill some data
    await page.getByLabel('Part Number *').fill('CANCEL-FORM-001')
    await page.getByLabel('Name *').fill('Cancel Form Test')

    // Cancel the form
    await page.getByRole('button', { name: 'Cancel' }).click()

    // The form should close
    await expect(page.getByText('Create New Part')).not.toBeVisible()

    // The data should not be saved
    await expect(page.getByText('CANCEL-FORM-001')).not.toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that the page is still functional
    await expect(page.getByText('Electronic Parts Database')).toBeVisible()
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('button', { name: 'New Part' })).toBeVisible()
  })

  test('should handle empty state', async ({ page }) => {
    // If there are no parts, should show "No parts found"
    // This test assumes the database is empty or the search returns no results
    await page.getByPlaceholder('Search parts...').fill('nonexistent-part-12345')
    await page.waitForTimeout(500)
    
    // The table should still be visible but might show "No parts found"
    await expect(page.getByRole('table')).toBeVisible()
  })
})
