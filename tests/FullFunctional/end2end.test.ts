import { test } from '../../fixture/fixture';
import * as OTPAuth from 'otpauth';
import { pagePaths } from '../../fixture/urls';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import dotenv from 'dotenv';
import { Logger } from '../../utils/logger';
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
    clickElementsByRole,
    verifyNavigation,
    login,
    verifyNavigationButtons,
    createWorkspace,
    createSubsidiary,
    editWorkspace,
    logout,
    testModalInteractions
  } from '../../utils/test-helpers';
import { AuthenticationHelper } from '../../utils/authenticationHelperm';

dotenv.config();
test.setTimeout(12000000);
test.describe.configure({ mode: 'serial' }); // Ensure tests run in order

test.describe('Email Generation Suite', () => {
    let sharedEmail: string;
    let domain: string;
    
    test.beforeAll(async ({ generatedEmail }) => {
        sharedEmail = generatedEmail;
        domain = sharedEmail.split('@')[0].split('+')[1];
    });
    test('User Signup, Company Creation & Billing Process', async ({ page, baseURL, context, createCredentials, createCompanyValidData, createBillingAddress }) => {
        Logger.info('Generated Email:', sharedEmail);
        Logger.info('Generated domain:', domain);
        Logger.info('Starting test case: User Signup, Company Creation & Billing Process');
        const auth = new AuthenticationHelper(page, context, baseURL);
        await page.goto(baseURL);
        await page.waitForLoadState('networkidle');
        
        await test.step('Navigate to Sign Up Page', async () => {
            Logger.info('Navigating to Sign Up Page');
            const loginPage = new LoginPage(page);
            await verifyNavigation(loginPage.createNewAccountLink, page, baseURL, pagePaths.createAccount, 'Create Account page');
        });

        await test.step('Sign Up and OTP Verification', async () => {
            Logger.info('Signing up and verifying OTP');
            const signUpPage = new RegisterPage(page);
            Logger.info('Generated Signup Data:', createCredentials);
            test.expect(createCredentials.email).toBe(sharedEmail);

            await fillAndSubmitForm(signUpPage, {
                email: sharedEmail,
                password: createCredentials.password,
                confirmPassword: createCredentials.password,
            });

            await verifyVisibility(page.getByText('Verification code sent'), 'Verification code sent successfully!');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);
            await page.waitForURL(`${baseURL}${pagePaths.otpVerfication}`);
            Logger.info('Network is idle, proceeding with OTP input.');
            await verifyEleVisibility(page, ['OTP Verification'], 'heading');
            
            // Handle Microsoft login and get OTP
            const outlookPage = await auth.handleMicrosoftLogin();
            const otp = await auth.getVerificationCode(outlookPage);
            await auth.completeRegistration(otp)        
        });

        await test.step('Enter Company Information', async () => {
            Logger.info('Entering company information');
            await page.waitForURL(`${baseURL}${pagePaths.subscription}`)
            console.log('Generated Company Data:', createCompanyValidData);
            await fillCompanyData(page, {
                ...createCompanyValidData,
                domain: createCompanyValidData.domainAddress.toLowerCase().replace(/\s+/g, '_')
            });
            //test.expect(createCompanyValidData.domainAddress).toBe(`HealthPointer NHF Group ${domain}`);
            await test.expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
            const smsElement = page.getByText('I authorize Perla to send SMS');
            await smsElement.scrollIntoViewIfNeeded();
            await smsElement.click();
            await page.waitForTimeout(3000);
            await clickElementsByRole(page, ['Submit'], 'button');
            await verifyVisibility(page.getByText('Company created successfully!'), 'Company created successfully Toast message is Showing successfully');
            await page.waitForTimeout(3000);
            try {
                await clickElementsByRole(page, ['Submit'], 'button');
            } catch (error) {
                
            }
        });

        await test.step('Enter Credit Card and Billing Details', async () => {
            Logger.info('Entering credit card and billing details');
            await auth.enterBillingDetails(createBillingAddress)
        });

        await test.step('Step 4: Login and Reuse the Same Credentials', async () => {
            Logger.info('Entering credit card and billing details');
            await auth.completePurchase()
            await page.waitForTimeout(3000);
        });
    });

test('Workspace and Subsidiary Management Flow', async ({ page, createCompanyValidData, createCredentials }) => {
    const count = "4a";
    const workspaceData = {
        name: `Workspace Name ${count}`,
        description: `Workspace Name ${count}`
    };
    const subsidiaryData = {
        name: `Subsidiary Name ${count}`,
        description: `Subsidiary Name ${count}`,
        assignTo:`Workspace Name ${count}`
    };

    const domain = createCompanyValidData.domainAddress.toLowerCase().replace(/\s+/g, '_');
    await login(page, sharedEmail, createCredentials, domain);
    await page.waitForTimeout(3000);  
    await verifyNavigationButtons(page);
    await testModalInteractions(page);
    await createWorkspace(page, workspaceData);
    await createSubsidiary(page, subsidiaryData);
    await editWorkspace(page, workspaceData.name);
    await logout(page);
  });

});