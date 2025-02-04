import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { ForgotPage } from '../../pages/ForgotPage';
import { Logger } from '../../utils/logger';

test.describe('Forgot Page Tests', () => {
  let loginPage;
  let signUpPage;
  let forgotPage;

  test.beforeEach(async ({ page, baseURL }) => {
    loginPage = new LoginPage(page);
    signUpPage = new RegisterPage(page);
    forgotPage = new ForgotPage(page);

    await loginPage.navigateAndVerify(page, baseURL, '/');
  });

  test('Forgot-0001: Verify System Navigation Between "Forgot Password" and "Login" Screens',{tag: ['@Smoke', '@Regression'],}, async () => {

    await test.step('Verify logo visibility and redirection', async () => {
      console.log('Navigating to the "Forgot Password" page...');
      await loginPage.forgotPasswordLink.click();
      console.log('Successfully navigated to the "Forgot Password" page.');

      console.log('Clicking the "Sign In" link to return to the login page...');
      await forgotPage.signInLinkText.click();
      console.log('Successfully navigated back to the login page.');

    });

  });

  test('Forgot-0002: Verify the System Response When Submitting the "Forgot Password" Form Without an Email',{tag: ['@Smoke', '@Regression'],}, async ({page}) => {

    await test.step('Verify the system response when submitting the "Forgot Password" form without an email', async () => {
      console.log('Navigating to the "Forgot Password" page...');
      await loginPage.forgotPasswordLink.click();
      await page.waitForLoadState('networkidle');
      console.log('Successfully navigated to the "Forgot Password" page.');

      console.log('Submitting the "Forgot Password" form without an email...');
      await forgotPage.submitButton.click();
      console.log('Successfully submitted the "Forgot Password" form without an email.');

      console.log('Verifying the "Email Address" helper text...');
      await expect(forgotPage.emailHelperText).toHaveText('Please enter your email');
      console.log('Successfully verified the "Email Address" helper text.');

    });

  });

  test('Forgot-0003: Verify the System Response When Submitting a Registered Email for "Forgot Password"',{tag: ['@Smoke', '@Regression'],}, async () => {
    await test.step(' ', async () => {
      await loginPage.forgotPasswordLink.click();
      await forgotPage.emailInput.fill('test@example.com');
      await forgotPage.submitButton.click();
    });
    

  });

});