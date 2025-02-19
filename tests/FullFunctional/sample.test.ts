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





test('test', async ({ page }) => {
  await page.goto('http://3.80.32.182:3000/');
  await page.getByPlaceholder('Enter your email').click();
  await page.getByPlaceholder('Enter your email').fill('test_107@yopmail.com');
  await page.getByPlaceholder('Enter your email').press('Tab');
  await page.getByPlaceholder('Enter your Password').fill('Test@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByText('Signed in successfully!').click();
  await page.getByRole('tab', { name: 'image Create Company' }).click();
  await page.locator('#domain').click();
  await page.getByPlaceholder('Enter Website address').click();
  await page.getByLabel('I authorize Perla to send SMS').check();
  await page.getByRole('tab', { name: 'image Select Plan' }).click();
  await page.locator('div').filter({ hasText: /^1030GBContact UsSelect Plan$/ }).getByRole('button').click();
  await page.getByText('Same as Company\'s physical').click();
  await page.getByRole('combobox').first().click();
  await page.getByRole('option', { name: 'US' }).click();
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'Virginia' }).click();
  await page.getByRole('button', { name: 'Review' }).click();
  await page.locator('input[name="cardholderName"]').click();
  await page.locator('input[name="cardholderName"]').fill('card');
  await page.getByRole('button', { name: 'Review' }).click();
  await page.getByLabel('I agree to GoPerla\'s Terms of').check();
  await page.getByLabel('I agree to GoPerla\'s Terms of').press('F12');
  await page.getByRole('button', { name: 'Complete Purchase' }).click();
  await page.getByText('The provided data format is').click();
  await page.getByText('Entity user super admin').click();
  await page.getByText('Logout').click();
  await page.getByText('Signed out successfully!').click();
  await page.getByPlaceholder('Enter your email').click();
  await page.getByPlaceholder('Enter your email').fill('test_107@yopmail.com');
  await page.getByPlaceholder('Enter your email').press('Tab');
  await page.getByPlaceholder('Enter your Password').fill('Test@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.goto('http://3.80.32.182:3000/subscription');
  await page.getByRole('tab', { name: 'image Create Company' }).click();
  await page.getByText('Company Information').click();
  await page.getByText('Contact Information').click();
  await page.locator('#domain').click();
  await page.locator('#domain').press('ArrowLeft');
  await page.locator('#domain').press('ArrowLeft');
  await page.locator('#domain').fill('test__107');
  await page.getByPlaceholder('Enter Zip Code').click();
  await page.getByPlaceholder('Enter Zip Code').fill('00000');
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(page.getByLabel('Create Company').getByRole('button')).toContainText('Submit');
  await page.getByRole('tab', { name: 'image Select Plan' }).click();
  await page.locator('div').filter({ hasText: /^1030GBContact UsSelect Plan$/ }).getByRole('button').click();
  await page.getByRole('tab', { name: 'image Select Plan' }).click();
  await page.locator('div').filter({ hasText: /^1030GBContact UsSelect Plan$/ }).getByRole('img').click();
  await expect(page.getByRole('heading', { name: '$40' })).toBeVisible();
  await page.locator('div').filter({ hasText: /^1030GBContact UsSelect Plan$/ }).getByRole('button').click();
  await expect(page.locator('.MuiBox-root > p:nth-child(2)').first()).toBeVisible();
  await expect(page.getByText('Total$').nth(1)).toBeVisible();
  await page.locator('input[name="cardholderName"]').click();
  await page.locator('input[name="cardholderName"]').fill('sample');
  await page.locator('input[name="cardholderName"]').press('Tab');
  await page.locator('iframe[name="__privateStripeFrame74227"]').contentFrame().getByPlaceholder('MM / YY').fill('11 / 2');
  await page.locator('iframe[name="__privateStripeFrame74227"]').contentFrame().getByPlaceholder('MM / YY').click();
  await page.locator('iframe[name="__privateStripeFrame74227"]').contentFrame().getByPlaceholder('MM / YY').fill('11 / 27');
  await page.locator('iframe[name="__privateStripeFrame74227"]').contentFrame().getByPlaceholder('MM / YY').press('Tab');
  await page.locator('iframe[name="__privateStripeFrame74228"]').contentFrame().getByPlaceholder('CVC').fill('123');
  await page.getByLabel('Same as Company\'s physical').check();
  await page.getByRole('combobox').first().click();
  await page.getByRole('option', { name: 'US' }).click();
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'Virginia' }).click();
  await page.getByRole('button', { name: 'Review' }).click();
  await page.getByRole('heading', { name: 'Billing Overview' }).click();
  await expect(page.getByText('sample')).toBeVisible();
  await expect(page.getByText('Credit Card', { exact: true })).toBeVisible();
  await expect(page.getByText('street').first()).toBeVisible();
  await expect(page.getByText('street').nth(1)).toBeVisible();
  await expect(page.getByText('city, Virginia,')).toBeVisible();
  await expect(page.getByText('US,00000')).toBeVisible();
  await page.getByText('Billing Addressstreetstreetcity, Virginia,US,00000').click();
  await page.getByLabel('I agree to GoPerla\'s Terms of').check();
  await page.getByRole('button', { name: 'Complete Purchase' }).click();
  await page.locator('div').filter({ hasText: 'The provided data format is' }).nth(2).click();
  await expect(page.getByText('The provided data format is')).toBeVisible();
  await page.getByText('Welcome User').click();
  await page.getByText('Logout').click();
  await page.getByText('Signed out successfully!').click();
});






test('testa', async ({ page }) => {
  await page.goto('https://marketing.qa.goperla.com/');
  await page.getByPlaceholder('Enter your email').fill('gopi_01@yopmail.com');
  await page.getByPlaceholder('Enter your Password').fill('Test@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByText('Signed in successfully!').click();
  await page.goto('https://gopi_01.qa.goperla.com/');
  await page.getByPlaceholder('Enter your email').fill('gopi_01@yopmail.com');
  await page.getByPlaceholder('Enter your Password').fill('Test@123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByText('Signed in successfully!').click();
  await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
    - heading "logo" [level=2]:
      - img "logo"
    - button "Home"
    - button "Workspaces"
    - button "Users"
    - button "Documents"
    - button "Settings"
    - button "Create"
    - textbox "search"
    - button:
      - img
    - button:
      - img
    - button
    `);
  await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Workspaces' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Users' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Documents' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
  await page.getByRole('button', { name: 'workspace-icon    workspace_0' }).click();
  await page.getByRole('button', { name: 'workspace-icon    workspace_0' }).getByRole('button').nth(1).click();
  await expect(page.getByRole('heading', { name: 'Create Subsidiary' })).toBeVisible();
  await expect(page.getByText('Subsidiary Name *')).toBeVisible();
  await expect(page.getByText('Assign Subsidiary to')).toBeVisible();
  await expect(page.getByText('Description')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByPlaceholder('Enter Subsidiary Name').click();
  await page.getByPlaceholder('Enter Subsidiary Name').fill('Subsidiary Name');
  await page.getByPlaceholder('Enter Subsidiary Name').press('Tab');
  await page.getByPlaceholder('Enter Description').click();
  await page.getByPlaceholder('Enter Description').fill('Subsidiary Name');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByText('Subsidiary created').click();
  await page.getByRole('button', { name: 'workspace-icon    workspace_0' }).click();
  await page.getByRole('button', { name: 'workspace-icon    workspace_0' }).click();
  await page.getByRole('button', { name: 'workspace-icon    workspace_0' }).click();
  await page.getByRole('button', { name: 'workspace-icon    workspace_0' }).click();
  await page.getByRole('button', { name: 'workspace-icon    workspace_0' }).getByRole('button').first().click();
  await page.locator('.MuiBackdrop-root').click();
  await page.getByRole('button', { name: 'workspace-icon    workspace_0' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('menuitem', { name: 'Create Workspace' }).click();
  await page.getByPlaceholder('Enter Workspace Name').click();
  await page.getByPlaceholder('Enter Workspace Name').fill('workspaceR');
  await page.getByPlaceholder('Select user').click();
  await page.getByRole('option').click();
  await page.getByPlaceholder('Enter Description').click();
  await page.getByPlaceholder('Enter Description').fill('Sample');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByText('Workspace created successfully').click();
  await expect(page.getByRole('button', { name: 'workspace-icon    workspaceR' })).toBeVisible();
  await page.getByRole('button', { name: 'workspace-icon    workspaceR' }).getByRole('button').nth(1).click();
  await page.getByPlaceholder('Enter Subsidiary Name').click();
  await page.getByPlaceholder('Enter Subsidiary Name').fill('Sub');
  await page.getByPlaceholder('Enter Description').click();
  await page.getByPlaceholder('Enter Description').fill('Sub');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByText('Subsidiary created').click();
  await page.getByRole('button', { name: 'workspace-icon    workspaceR' }).click();
  await page.getByRole('button', { name: 'workspace-icon    workspaceR' }).click();
  await page.getByRole('button', { name: 'workspace-icon    workspaceR' }).getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'edit Edit' }).click();
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByText('Workspace updated successfully').click();
  await page.getByRole('button', { name: 'workspace-icon    workspaceR' }).click();
  await page.getByRole('button', { name: 'workspace-icon    workspaceR' }).getByRole('button').first().click();
  await page.locator('.MuiBackdrop-root').click();
  await page.getByRole('button', { name: 'workspace-icon    workspaceR' }).getByRole('button').nth(1).click();
  await page.getByTestId('close-button').click();
  await page.locator('[id="\\:ra\\:"]').click();
  await page.getByText('Logout').click();
  await page.getByText('Logged out successfully!').click();
  await page.goto('https://marketing.qa.goperla.com/');
  await page.getByPlaceholder('Enter your email').click();
  await page.getByPlaceholder('Enter your email').fill('gopi_01@yopmail.com');
  await page.getByPlaceholder('Enter your Password').click();
  await page.getByPlaceholder('Enter your Password').fill('Test@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
});