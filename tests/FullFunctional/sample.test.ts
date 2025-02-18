import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true, // Ignore SSL certificate errors
  viewport: { height: 1050, width: 1920   } // Set viewport size
});

async function login(page, email, password) {
  await page.getByPlaceholder('Enter your email').fill(email);
  await page.getByPlaceholder('Enter your Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' , exact: true }).click();
  await expect(page.getByText('Signed in successfully!')).toBeVisible();
}

test('Automated Flow Test', async ({ page }) => {

    try {
    //  await page.goto('http://3.80.32.182:3000/');
    //   await login(page, 'gp2_test+12@twilightitsolutions.com', 'Am@zing#Grace3401');
    //   // Verify payment success page
    //   await page.goto('http://3.80.32.182:3000/payment-success');
    //   await expect(page.getByRole('heading', { name: 'Payment Success!' })).toBeVisible();
    //   await page.waitForTimeout(10000);

  // Navigate to application and login again
  await page.goto('https://healthpointernhf12.dev.goperla.com/');
  await login(page, 'gp2_test+12@twilightitsolutions.com', 'Am@zing#Grace3401');

  // Verify main dashboard elements
  const expectedButtons = ['Home', 'Workspaces', 'Users', 'Documents', 'Settings', 'Create'];
  for (const button of expectedButtons) {
    await expect(page.getByRole('button', { name: button })).toBeVisible();
  }

  // Create Workspace
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('menuitem', { name: 'Create Workspace' }).click();
  await expect(page.getByRole('heading', { name: 'Create Workspace' })).toBeVisible();
  await page.getByPlaceholder('Enter Workspace Name').fill('workspace_R');
  await page.getByPlaceholder('Select user').click();
  await page.getByRole('option', { name: 'gp2_test+' }).click();
  await page.getByPlaceholder('Enter Description').fill('Workspace_R');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Workspace created successfully')).toBeVisible();

  // Create Subsidiary
  await page.getByRole('button', { name: 'workspace-icon    workspace_R' }).getByRole('button').nth(1).click();
  await page.getByPlaceholder('Enter Subsidiary Name').fill('subsidiary name nhf');
  await page.getByPlaceholder('Enter Description').fill('description subsidiary');
  await page.getByRole('button', { name: 'Create' }).click();
  
  // Logout
  await page.getByText('Logout').click();
  await expect(page.getByText('Logged out successfully!')).toBeVisible();

    } catch (error) {
        
    }
});
