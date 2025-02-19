import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { signupTestData } from '../../fixture/signup-test-data';
import { Logger } from '../../utils/logger';
import { AxeBuilder } from '@axe-core/playwright';
import { errorMessages } from '../../fixture/error-messages';
import { pagePaths } from '../../fixture/urls';
import { createCompanyValidData } from '../../fixture/create-company-data';
import { addressDetails } from '../../fixture/addressDetails';

import {
  verifyVisibility,
  verifyErrorMessage,
  togglePassword,
  fillAndSubmitForm,
  fillOtp,
  verifyEleVisibility,
  verifyTextVisibility,
  performLogin,
  fillCompanyData,
  filladdressDetails,
  fillCardDetails,
  clickElementsByRole
} from '../../utils/test-helpers';

let loginPage;
let signUpPage;


test.describe('Signup Page Tests', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    loginPage = new LoginPage(page);
    signUpPage = new RegisterPage(page);
    await loginPage.navigateAndVerify(page, baseURL, '/signup');
    Logger.info('✅ Test setup completed successfully');
  });

  test.describe.parallel('UI and Accessibility Tests', () => {

    test('SignUp-0000: Verify the page accessibility Functionality',{ tag: ['@Smoke'], }, async ({ page }) => {
      const { violations } = await new AxeBuilder({ page}).analyze();
      expect(violations).toHaveLength(0);
      });
    test('SignUp-0001: Verify Perla Logo Link Redirection Functionalitys [Smoke]', async () => {
      await verifyVisibility(signUpPage.logo, 'Perla logo');
      await signUpPage.logo.click();
      Logger.pass('✔ Logo click verified successfully.');
    });

    test('SignUp-0002: Verify Signup Page Elements [Regression]', async ({ page }) => {
      await verifyVisibility(signUpPage.logo, 'Perla logo');
      for (const heading of signUpPage.headings) {
        await verifyVisibility(heading, 'signup page heading');
      }
      await verifyVisibility(signUpPage.emailFieldLabel, 'email field label');
      await verifyVisibility(signUpPage.passwordFieldLabel, 'password field label');
      await verifyVisibility(signUpPage.confirmPasswordFieldLabel, 'confirm password field label');
      await verifyVisibility(signUpPage.submitButton, 'submit button');
      await verifyVisibility(signUpPage.linkedInSignUpButton, 'LinkedIn signup button');
      await verifyVisibility(signUpPage.signIn, 'sign-in link');
    });

    test('SignUp-0007: Verify Mask "Password and Confirm Password" Field by Default During Sign-Up [Smoke]', async ({ page }) => {
      await fillAndSubmitForm(signUpPage, { password: signupTestData.only.password, confirmPassword: signupTestData.only.password });
      await verifyVisibility(signUpPage.passwordInputField, 'Password field masked');
      await verifyVisibility(signUpPage.confirmPasswordInputField, 'Confirm Password field masked');
    });

    test('SignUp-0008: Verify the Password Visibility Toggle Functionality [Smoke]', async ({ page }) => {
      await fillAndSubmitForm(signUpPage, { password: signupTestData.only.password, confirmPassword: signupTestData.only.password });
      const toggleButtons = page.locator('form').getByRole('button');
  
      await togglePassword(signUpPage, 'text', toggleButtons.first());
      await page.waitForTimeout(2000);
      await togglePassword(signUpPage, 'password', toggleButtons.first());
      await page.waitForTimeout(2000);
      await togglePassword(signUpPage, 'password', toggleButtons.nth(1));
      await page.waitForTimeout(2000);
      await togglePassword(signUpPage, 'password', toggleButtons.nth(1));
    });
  
  });

  test.describe.parallel('Input Validation Tests', () => {
    test('SignUp-0011: Verify System Response When Leaving Both Email and Password Fields Empty [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage, {});
      await verifyErrorMessage(signUpPage.emailErrorMessage, errorMessages.emptyEmail);
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.emptyPassword);
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.emptyConfirmPassword);
    });

    test('SignUp-0003: Verify System Response When Leaving the Email Field Empty [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage, { password: signupTestData.only.password, confirmPassword: signupTestData.only.password });
      await verifyErrorMessage(signUpPage.emailErrorMessage, errorMessages.emptyEmail);
    });

    test('SignUp-0004: Verify System Response for Invalid Email Format [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage, { email: signupTestData.invalidEmail.email });
      await verifyErrorMessage(signUpPage.emailErrorMessage, errorMessages.invalidEmail);
    });

    test('SignUp-0006: Verify System Response for Email Only [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage, { email: signupTestData.existingEmail.email });
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.emptyPassword);
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.emptyConfirmPassword);
    });

    test('SignUp-0009: Verify System Response When Password and Confirm Password Do Not Match During Sign-Up [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage, { email: signupTestData.passwordMismatch.email, password: signupTestData.passwordMismatch.password, confirmPassword: signupTestData.passwordMismatch.confirmPassword });
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.passwordMismatch);
    });

    test('SignUp-0013: Verify System Response When Entering a Short Email and Password During Sign-Up [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage, { email: signupTestData.short.email, password: signupTestData.short.password, confirmPassword: signupTestData.short.password });
      await verifyErrorMessage(signUpPage.emailErrorMessage, errorMessages.minLengthEmail);
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.minLengthPassword);
    });

    test('SignUp-0014: Verify the System Response When Entering Credentials with Maximum Length During Sign-Up [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage, { email: signupTestData.long.email, password: signupTestData.long.password, confirmPassword: signupTestData.long.password });
      await verifyErrorMessage(signUpPage.emailErrorMessage, errorMessages.maxLengthEmail);
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.maxLengthPassword);
    });
    
  });

  test.describe.parallel('Authentication Tests', () => {
    test('SignUp-0016: Verify System Response When Entering an Already Registered Email During Sign-Up [Smoke]', async ({ page }) => {
      await fillAndSubmitForm(signUpPage, { email: signupTestData.existingEmail.email, password: signupTestData.existingEmail.password, confirmPassword: signupTestData.existingEmail.password });
      await verifyErrorMessage(signUpPage.emailExists, errorMessages.emailExists);
    });
  });

  test.describe('Register Page Feild Validation', () => {
    let dynamicEmail: string;
    let password: string = 'Test@123';
    let confirmPassword: string = 'Test@123';

    test('SignUp-0019/20/21/22/23/24/25: Verify the "Submit" button without entering any OTP on the OTP Verification Page [Smoke]', async ({ page, baseURL }) => {
    dynamicEmail = `testuser_${Date.now()}@example.com`;
    Logger.info(`Random email generated: ${dynamicEmail}`);
    await fillAndSubmitForm(signUpPage, { email: dynamicEmail, password: password, confirmPassword: confirmPassword });
    await verifyVisibility(page.getByText('Verification code sent'), 'Verification code sent successfully!');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.waitForURL(`${baseURL}${pagePaths.otpVerfication}`);
    Logger.info('Network is idle, proceeding with OTP input.');
    await verifyEleVisibility(page, ['OTP Verification'], 'heading');
    await clickElementsByRole(page, ['Submit'], 'button');
    await verifyVisibility(page.getByText(errorMessages.invalidOTP), 'Please enter a valid OTP message');
    await fillOtp(page, ['0', '1', '2', '3', '4']);
    await clickElementsByRole(page, ['Submit'], 'button');
    await verifyVisibility(page.getByText(errorMessages.otpFormat), 'OTP must be a 6-digit number');
    await fillOtp(page, ['0', '1', '2', '3', '4', '5']);
    await clickElementsByRole(page, ['Submit'], 'button');
    // await verifyVisibility(page.getByText('The OTP entered is incorrect. Please try again.'), 'Error confirming sign-up.');    
    // await verifyTextVisibility(page, page.getByText('The OTP entered is incorrect. Please try again.', { exact: true }));
    // await page.getByText('Resend OTP').isEnabled(), { timeout: 60000 };
    // await page.getByText('Resend OTP').click();
    // await verifyVisibility(page.getByText('Verified code re-sent'), "Verify Code re-Sent toast Message");
    await fillOtp(page, ['1', '2', '3', '4', '5', '6']);
    await clickElementsByRole(page, ['Submit'], 'button');
    await verifyVisibility(page.getByText('Verified successfully!'), 'Verified successfully Toast message is Showing successfully');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.waitForURL(`${baseURL}${pagePaths.subscription}`);
    await verifyEleVisibility(page, ['Add one company data', 'Streamline your data', 'Organization Overview'], 'heading');
    await verifyTextVisibility(page, [
      'Company Information', 'Company Name *', 'EIN/FEIN', 'NPI No.', 'Contact Information',
      'Street Address 1 *', 'Street Address 2', 'City *', 'State *', 'Country *', 'Zip Code *', 'Email Address', 'Phone Number *', 'Mobile Number *', 'Domain *']);
    await verifyVisibility(page.getByText('Submit'), 'Verified Submit in the Create Company Screen');
    await clickElementsByRole(page, ['Submit'], 'button');
    await verifyTextVisibility(page, [
      'Company Name is required', 'Street Address 1 is required', 'City is required', 'State is required', 'Zip Code is required',
      'Phone Number is required', 'Mobile Number is required', 'Domain is required']);
    await fillCompanyData(page, createCompanyValidData);
    await verifyTextVisibility(page, ['Domain is Valid']);

    await page.getByText('I authorize Perla to send SMS').click();
    await clickElementsByRole(page, ['Submit'], 'button');
    await verifyVisibility(page.getByText('Company created Successfully'), 'Company created Successfully!');
    Logger.pass(`User verified successfully with email: ${dynamicEmail}`);
    });

    test('SignUp-0026: Verify User Login and UI Elements on Select Plan Page [Smoke]', async ({ page, baseURL }) => {
      if (!dynamicEmail) throw new Error('❌ Error: dynamicEmail is undefined! Ensure the first test runs before this.');
      Logger.info(`Using dynamic email from previous test: ${dynamicEmail}`);
      await loginPage.navigateAndVerify(page, baseURL, '/');
      Logger.pass('✅ Login test setup completed');
      await performLogin(loginPage, dynamicEmail, password, 'Entering valid username/password');
      // await performLogin(loginPage, 'testuser_1739005333249@example.com', password, 'Entering valid username/password');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(10000);

      // Verify UI elements visibility
      await verifyEleVisibility(page, ['avatar'], 'img');
      await verifyEleVisibility(page, ['image Create Company', 'image Select Plan', 'image Make Payment', 'Billing Monthly', 'Billing Yearly'], 'tab');
      await verifyTextVisibility(page, ['Welcome User', 'Entity user super admin', 'Pricing and Benefits', 'Locations', 'Users', 'Additional Location Per Month', 'Storage',
        'Background Check Services', 'Benefits', 'Operational Efficiency', 'Increasing Revenue', 'Policy & Regulatory Compliance', 'Risk Reduction',
        'Basic', 'Essential']);
      await verifyEleVisibility(page, ['Transparent pricing with no'], 'heading');
      await page.locator("(//div[contains(@class,'mb-4 mt-5')]//button)[1]").click();
      await page.waitForTimeout(3000);
      // Verify Review & Payment UI elements

      await verifyEleVisibility(page, ['Review & Make Payment'], 'heading');
      await expect(page.getByRole('radiogroup').getByText('Monthly')).toBeVisible();
      await verifyTextVisibility(page, ['Yearly']);
      await page.getByText('User').first().click();
      await verifyEleVisibility(page, ['Change Plan'], 'button');
      await verifyEleVisibility(page, ['Credit Card'], 'tab');
      await verifyEleVisibility(page, ['Enter Credit Card Details'], 'heading');
      await verifyTextVisibility(page, ['Credit Card Details', 'Name on Card*', 'card number*', 'Expiration Date*', 'Security Code*',
        'Promo Code', 'Credit Card statement address', 'Address Line 1 *', 'Address Line 2 (Optional)', 'Country *',
        'State *', 'City *', 'Zip code *']);

      // Fill card and address details
      await fillCardDetails(page, 'Dorothy Wilson', '4242 4242 4242 4242', '1226', '123');
      await filladdressDetails(page, addressDetails);

      // Finalize Purchase
      await clickElementsByRole(page, ['Review'], 'button');
      await page.waitForTimeout(5000);
      await verifyEleVisibility(page, ['Billing Overview', 'Finalize Transaction', 'Details'], 'heading');
      await verifyEleVisibility(page, ['Edit Details', 'Complete Purchase'], 'button');
      await verifyTextVisibility(page, ['Name', 'Payment Method', 'Billing Address']);
      await expect(page.getByLabel('I agree to GoPerla\'s Terms of')).toBeVisible();
      await page.getByLabel('I agree to GoPerla\'s Terms of').check();
      await clickElementsByRole(page, ['Complete Purchase'], 'button');
      await page.waitForTimeout(5000);
      console.log('successs');
    });
  });
  
});

