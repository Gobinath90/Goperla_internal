import { test, expect } from '@playwright/test';

async function waitForPageLoad(page) {
    await page.waitForLoadState('networkidle');
    console.log('Waiting for page to load');
    await page.waitForTimeout(8000);
    console.log('Waited for 8 seconds'); 
  }

  async function fillInput(page, placeholder, value) {
    await page.getByPlaceholder(placeholder).fill(value);
  }
  async function clickButton(page, buttonName) {
    await page.getByRole('button', { name: buttonName }).click();
  }

  async function verifyText(page, text) {
    await expect(page.getByText(text)).toBeVisible();
  }

async function loginToMicrosoft(page, email, password) {
    console.log('Login to Microsoft called');
    await page.goto('https://login.microsoftonline.com/');
    await fillInput(page, 'Email, phone, or Skype', email);
    console.log('Filled email field');
    await page.getByRole('button', { name: 'Next' }).click();
    console.log('Clicked Next button');

    await expect(page.getByRole('heading', { name: 'Enter password' })).toBeVisible();
    console.log('Verified password field');
    await fillInput(page, 'Password', password);
    console.log('Filled password field');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    console.log('Verified Sign in button');
    await clickButton(page, 'Sign in');
    console.log('Clicked Sign in button');
    await waitForPageLoad(page);
    await handleAdditionalSecurityVerification(page);
    await handleStaySignedInPrompt(page);
    await handleAdditionalSecurityVerification(page);

    if (await page.getByText('solutiongetter@gmail.com').isVisible()) {
        console.log('Verified email');
        await page.getByText('solutiongetter@gmail.com').click();
        console.log('Clicked email');
        await expect(page.getByLabel('messages').getByText('Test')).toBeVisible();
        console.log('Verified email content');
    }
}

async function handleAdditionalSecurityVerification(page) {
    try {
        await expect(page.getByRole('heading', { name: 'More information required' })).toBeVisible();
        console.log('Additional security verification required');
        await waitForPageLoad(page);
    
        console.log('Verified Next button');
        await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
        
        console.log('Clicked Next button');
        await clickButton(page, 'Next');
        await waitForPageLoad(page);
        console.log('Verified heading');
        await verifyText(page, 'Keep your account secure');
        console.log('Clicked Skip setup button');
        await clickButton(page, 'Skip setup');
        await waitForPageLoad(page);
      } catch (error) {
        console.log('No additional security verification required');
      }
}

async function handleStaySignedInPrompt(page) {
    try {
        await expect(page.getByRole('heading', { name: 'Stay signed in?' })).toBeVisible();
        console.log('Stay signed in prompt visible');
        await expect(page.getByLabel('Don\'t show this again')).toBeVisible();
        console.log('Verified checkbox');
        await page.getByLabel('Don\'t show this again').check();
        console.log('Clicked checkbox');
        await page.getByRole('button', { name: 'Yes' }).click();
        console.log('Clicked Yes button');
        await page.waitForLoadState('networkidle');
        console.log('Waiting for page to load');
        await page.waitForTimeout(8000);
        console.log('Waited for 8 seconds');
      } catch (error) {
        console.log('No stay signed in prompt');
      }
}

test('Open Google in first tab, Microsoft in second tab', async ({ browser }) => {
    const email = 'gp2_test@twilightitsolutions.com';
    const password = 'SmartWork@1234';
  
    // Create browser context
    const context = await browser.newContext();

    // Open Google in first tab
    const page1 = await context.newPage();
    await page1.goto('https://www.google.com');
    console.log("Opened Google in the first tab.");
    await page1.waitForLoadState();
    console.log('Waiting for page to load');
    await page1.waitForTimeout(5000);
    console.log('Waited for 5 seconds');

    // Open Microsoft login in the second tab
    const page2 = await context.newPage();
    await loginToMicrosoft(page2, email, password);
    console.log("Logged into Microsoft in the second tab.");

    // Switch back to the first tab (Google)
    await page1.bringToFront();
    console.log("Switched back to Google tab.");

    // Switch to the second tab (Microsoft)
    await page2.bringToFront();
    console.log("Switched back to Microsoft tab.");

    // Continue with Outlook email retrieval
    await expect(page2.getByText('solutiongetter@gmail.com')).toBeVisible();
    console.log('Verified email');
    await page2.getByText('solutiongetter@gmail.com').click();
    console.log('Clicked email');
    
    // Verify email content
    await expect(page2.getByLabel('messages').getByText('Test')).toBeVisible();
    console.log('Verified email content');
    await page2.getByLabel('Item 1 of').locator('div').click();
    console.log('Clicked email');
    await expect(page2.getByText('GoDaddy')).toBeVisible();
    console.log('Verified email content');
    await page2.getByText('GoDaddy').click();
    console.log('Clicked GoDaddy');
});

