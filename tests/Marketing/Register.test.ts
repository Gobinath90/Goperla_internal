import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { signupTestData } from '../../fixture/signup-test-data';
import { Logger } from '../../utils/logger';
import {AxeBuilder} from '@axe-core/playwright';
import { errorMessages } from '../../fixture/error-messages';
import {
  verifyVisibility,
  verifyErrorMessage,
  togglePassword,
  fillAndSubmitForm,
  fillOtp,
  verifyEleVisibility,
  verifyTextVisibility
} from '../../utils/test-helpers';

let loginPage;
let signUpPage;
const dynamicEmail = `testuser_${Date.now()}@example.com`;

test.describe('Signup Page Tests', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    loginPage = new LoginPage(page);
    signUpPage = new RegisterPage(page);
    await loginPage.navigateAndVerify(page, baseURL, '/signup');
    Logger.info('✅ Test setup completed successfully');
  });

  test.describe.parallel('UI and Accessibility Tests', () => {

    test('SignUp-0000: Verify the page accessibility Functionality',{tag: ['@Smoke'],}, async ({page}) => {
      const {violations} = await new AxeBuilder({ page}).analyze();
      expect(violations).toHaveLength(0);
      });
    test('SignUp-0001: Verify Perla Logo Link Redirection Functionalitys [Smoke]', async () => {
      await verifyVisibility(signUpPage.logo, 'Perla logo');
      await signUpPage.logo.click();
      Logger.pass('✔ Logo click verified successfully.');
    });

    test('SignUp-0002: Verify Signup Page Elements [Regression]', async ({page}) => {
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
      await fillAndSubmitForm(signUpPage,{ password: signupTestData.only.password, confirmPassword: signupTestData.only.password });
      await verifyVisibility(signUpPage.passwordInputField, 'Password field masked');
      await verifyVisibility(signUpPage.confirmPasswordInputField, 'Confirm Password field masked');
    });  

    test('SignUp-0008: Verify the Password Visibility Toggle Functionality [Smoke]', async ({ page }) => {
      await fillAndSubmitForm(signUpPage,{ password: signupTestData.only.password, confirmPassword: signupTestData.only.password });
      const toggleButtons = page.locator('form').getByRole('button');
  
      await togglePassword(signUpPage,'text', toggleButtons.first());
      await page.waitForTimeout(2000);
      await togglePassword(signUpPage,'password', toggleButtons.first());
      await page.waitForTimeout(2000);
      await togglePassword(signUpPage,'password', toggleButtons.nth(1));
      await page.waitForTimeout(2000);
      await togglePassword(signUpPage,'password', toggleButtons.nth(1));
    });
  
  });

  test.describe.parallel('Input Validation Tests', () => {
    test('SignUp-0011: Verify System Response When Leaving Both Email and Password Fields Empty [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage,{});
      await verifyErrorMessage(signUpPage.emailErrorMessage, errorMessages.emptyEmail);
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.emptyPassword);
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.emptyConfirmPassword);
    }); 

    test('SignUp-0003: Verify System Response When Leaving the Email Field Empty [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage,{ password: signupTestData.only.password, confirmPassword: signupTestData.only.password });
      await verifyErrorMessage(signUpPage.emailErrorMessage, errorMessages.emptyEmail);
    });

    test('SignUp-0004: Verify System Response for Invalid Email Format [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage,{ email: signupTestData.invalidEmail.email });
      await verifyErrorMessage(signUpPage.emailErrorMessage, errorMessages.invalidEmail);
    });

    test('SignUp-0006: Verify System Response for Email Only [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage,{ email: signupTestData.existingEmail.email });
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.emptyPassword);
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.emptyConfirmPassword);
    });

    test('SignUp-0009: Verify System Response When Password and Confirm Password Do Not Match During Sign-Up [Smoke]', async () => {  
      await fillAndSubmitForm(signUpPage,{ email: signupTestData.passwordMismatch.email, password: signupTestData.passwordMismatch.password, confirmPassword: signupTestData.passwordMismatch.confirmPassword });
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.passwordMismatch);
    });

     test('SignUp-0013: Verify System Response When Entering a Short Email and Password During Sign-Up [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage,{ email: signupTestData.short.email, password: signupTestData.short.password, confirmPassword: signupTestData.short.password });
      await verifyErrorMessage(signUpPage.emailErrorMessage, errorMessages.minLengthEmail);
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.minLengthPassword);
    });

    test('SignUp-0014: Verify the System Response When Entering Credentials with Maximum Length During Sign-Up [Smoke]', async () => {
      await fillAndSubmitForm(signUpPage,{ email: signupTestData.long.email, password: signupTestData.long.password, confirmPassword: signupTestData.long.password });
      await verifyErrorMessage(signUpPage.emailErrorMessage, errorMessages.maxLengthEmail);
      await verifyErrorMessage(signUpPage.passwordErrorMessage, errorMessages.maxLengthPassword);
    });
    
  });

  test.describe.parallel('Authentication Tests', () => {
    test('SignUp-0016: Verify System Response When Entering an Already Registered Email During Sign-Up [Smoke]', async ({ page }) => {
      await fillAndSubmitForm(signUpPage,{ email: signupTestData.existingEmail.email, password: signupTestData.existingEmail.password, confirmPassword: signupTestData.existingEmail.password });
      await verifyErrorMessage(signUpPage.emailExists, errorMessages.emailExists);
    });  
  });


// Need to Optimise the code for below area
  test.skip('SignUp-0011: Verify Unsuccessful Sign-up with Email and OTP Validation [Smoke]', async ({ page }) => {
    console.log(`Random email generated: ${dynamicEmail}`);
  
    // Step 1: Fill and submit the sign-up form
    await fillAndSubmitForm(signUpPage,{ email: dynamicEmail, password: 'Test@123', confirmPassword: 'Test@123' });
    console.log('Sign-up form filled and submitted.');

    // Step 2: Verify the "Verification code sent" message after form submission
    await verifyVisibility(page.getByText('Verification code sent'), 'Verification code sent message');
    await page.waitForLoadState('networkidle');
    console.log('Network is idle, proceeding with OTP input.');

    // Step 3: Verify OTP Verification page is visible
    await verifyEleVisibility(page, ['OTP Verification', 'A one time code has been sent', 'Enter that code here.'], 'heading');
    //await expect(page).toHaveScreenshot();

    // Step 4: Attempt to submit OTP with No values entered
    await page.getByRole('button', { name: 'Submit' }).click();
    await verifyVisibility(page.getByText('Please enter a valid OTP'), 'Please enter a valid OTP message');

    // Step 5: Fill in OTP with only 1 digit, expect validation error
    await fillOtp(page, ['1']);
    await verifyVisibility(page.getByText('OTP must be a 6-digit number'), 'OTP must be a 6-digit number');    
    
    // Step 6: Fill in OTP with 6 digits, but expect error message on submission
    await fillOtp(page, ['0', '1', '2', '3', '4', '5']);
    await page.getByRole('button', { name: 'Submit' }).click();
    await verifyVisibility(page.getByText('Error confirming sign-up.'), 'Error confirming sign-up.');    

  });

  test.skip('SignUp-0012: Verify Successful Sign-up with Email and OTP Validation [Smoke]', async ({ page }) => {
    console.log(`Random email generated: ${dynamicEmail}`);
  
    // Step 1: Fill and submit the sign-up form
    await fillAndSubmitForm(signUpPage,{ email: dynamicEmail, password: 'Test@123', confirmPassword: 'Test@123' });
    console.log('Sign-up form filled and submitted.');

    // Step 2: Verify the "Verification code sent" message
    await verifyVisibility(page.getByText('Verification code sent'), 'Verification code sent');
    await page.waitForLoadState('networkidle');

    // Step 3: Verify OTP Verification page is visible
    await verifyEleVisibility(page, ['OTP Verification'], 'heading');

    // Step 4: Fill in OTP fields and submit
    await fillOtp(page, ['1', '2', '3', '4', '5', '6']);
    await page.getByRole('button', { name: 'Submit' }).click();    
    
    // Step 5: Verify "Verified successfully!" message
    await verifyVisibility(page.getByText('Verifed successfully!'), 'Verifed successfully message');

    // Step 6: Verify various tabs and headings are visible
    await verifyEleVisibility(page, ['image Select Plans', 'image Make Payment', 'image Create Company'], 'tab');
    await verifyEleVisibility(page, ['Pricing and Benefits', 'Transparent pricing with no'], 'heading');
    await verifyEleVisibility(page, ['Billing Monthly', 'Billing Yearly'], 'tab');
    await verifyEleVisibility(page, ['Basic', 'Essential'], 'heading');
  
      // Step 7: Verify other key texts are visible
    await verifyTextVisibility(page, [
    'Locations', 'Users', 'Additional Location Per Month', 'Storage', 'Background Check Services',
    'Benefits', 'Operational Efficiency', 'Increasing Revenue', 'Policy & Regulatory Compliance', 'Risk Reduction'
    ]);

  });


});

