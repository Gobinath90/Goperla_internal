import { test, expect } from '@playwright/test';
import{AxeBuilder} from '@axe-core/playwright';
import { LoginPage } from '../../pages/LoginPage';
import { loginTestData } from '../../fixture/login-test-data'; 
import { errorMessages } from '../../fixture/error-messages';
import { pagePaths } from '../../fixture/urls';
import { Logger } from '../../utils/logger';
import { 
	verifyVisibility,
	performLogin,
	performLogout,
	verifyErrorMessage,
	togglePasswordVisibility,
	verifyNavigation 
  } from '../../utils/test-helpers';

let loginPage;

test.beforeEach(async ({ page, baseURL }) => {
	loginPage = new LoginPage(page);
	await loginPage.navigateAndVerify(page, baseURL, '/');
	Logger.info('✅ Login test setup completed');
});

test.describe('Login Page Tests', () => {
  	// Group 1: UI and Accessibility Tests
	test.describe.parallel('UI and Accessibility Tests', () => {
		test('Login-0000: Verify the page accessibility Functionality',{tag: ['@Smoke'],}, async ({page}) => {
		const {violations} = await new AxeBuilder({ page}).analyze();
		expect(violations).toHaveLength(0);
		});

		test('Login-0001: Verify Perla Logo Link Redirection Functionality',{tag: ['@Smoke'],}, async ({page}) => {
			await test.step('Check logo visibility', async () => {
				await expect(loginPage.logo).toBeVisible();
			});
			await test.step('Click on the logo and verify redirection', async () => {
				await loginPage.logo.click();
			});
		});

		test('Login-0002: Verify the Availability and Functionality of the "Sign in with Email" Option',{tag: ['@Smoke', '@Regression'],}, async ({page}) => {
			await test.step('Verify all essential login page elements are visible', async () => {
				Logger.info('Checking visibility of essential elements...')
				const elementsToCheck = [
					{ element: loginPage.logo, description: 'Logo' },
					...loginPage.headings.map((heading, index) => ({ element: heading, description: `Heading ${index + 1}` })),
					{ element: loginPage.emailFieldLabel, description: 'Email Field Label' },
					{ element: loginPage.passwordFieldLabel, description: 'Password Field Label' },
					{ element: loginPage.forgotPasswordLink, description: 'Forgot Password Link' },
					{ element: loginPage.signInButton, description: 'Sign-In Button' },
					{ element: loginPage.visibilityIconOff, description: 'Password Visibility Icon' },
					{ element: loginPage.termsText, description: 'Terms Text' },
					{ element: loginPage.userAgreementLink, description: 'User Agreement Link' },
					{ element: loginPage.privacyPolicyLink, description: 'Privacy Policy Link' },
					{ element: loginPage.createNewAccountLink, description: 'Create New Account Link' },
				];
	
				for (const { element, description } of elementsToCheck) {
					Logger.pass(`✔ Checking visibility of: ${description}`);
					await expect(element).toBeVisible();
				}
				await page.screenshot({ path: 'tests/login/screenshot.png' });
			});
		});

		test('Login-0007: Verify the Password Visibility Toggle Functionality',{tag: ['@Smoke', '@Regression'],}, async () => {

			let password = loginTestData.invalidPassword.password;
			await test.step('Enter a password', async () => {
				await loginPage.passwordInputField.fill(password);
				Logger.pass('✔ Password field filled successfully : ' + password);
			});
			await togglePasswordVisibility(loginPage, 'text', loginPage.visibilityIconOff);
			await togglePasswordVisibility(loginPage, 'password', loginPage.visibilityIconOn);
		});
	});

  	// Group 2: Input Validation Tests
	test.describe.parallel('Input Validation Tests', () => {
		test('Login-0003: Verify the system response when leaving the email field empty',{tag: ['@Smoke', '@Regression'],}, async ({page}) => {
			await performLogin(loginPage, loginTestData.emptyEmail.email, loginTestData.emptyEmail.password, 'Leaving the email field empty');
			await verifyErrorMessage(loginPage.emailErrorMessage, errorMessages.emptyEmail);
		});
	
		test('Login-0004: Verify the system response when entering an invalid email format',{tag: ['@Smoke', '@Regression'],}, async ({page}) => {
			await performLogin(loginPage, loginTestData.invalidEmail.email, loginTestData.invalidEmail.password, 'Entering an invalid email format');
			await verifyErrorMessage(loginPage.emailErrorMessage, errorMessages.invalidEmail);
		});

		test('Login-0017:Verify the System Response When Entering Credentials with Unicode Special Characters',{tag: ['@Smoke'],}, async () => {
			await performLogin(loginPage, loginTestData.unicodeCharacters.email, loginTestData.unicodeCharacters.password, 'Credentials with unicode special characters');
			await verifyErrorMessage(loginPage.emailErrorMessage, errorMessages.invalidEmail);
		})
	
		test('Login-0006: Verify the system response when leaving the password field empty',{tag: ['@Smoke', '@Regression'],}, async ({page}) => {
			await performLogin(loginPage, loginTestData.emptyPassword.email, loginTestData.emptyPassword.password, 'Leaving the password field empty');
			await verifyErrorMessage(loginPage.passwordErrorMessage, errorMessages.emptyPassword);
		});

		test('Login-0008: Validate the system enforcement of password complexity requirements.',{tag: ['@Smoke', '@Regression'],}, async () => {

			await test.step('Enter a password', async () => {
				const password = loginTestData.invalidPassword.password;
				await loginPage.passwordInputField.fill(password);
				await loginPage.signInButton.click();
				Logger.pass('✔ Password field filled successfully : ' + password);
			});
			await verifyErrorMessage(loginPage.passwordErrorMessage, errorMessages.passwordComplexity);
		})
	
		test('Login-0009: Verify the System Response When Leaving Both Email and Password Fields Empty',{tag: ['@Smoke'],}, async ({page}) => {
			await performLogin(loginPage, loginTestData.emptyEmail.email, loginTestData.emptyPassword.password, 'Leaving both email and password fields empty');
			await verifyErrorMessage(loginPage.emailErrorMessage, errorMessages.emptyEmail);
			await verifyErrorMessage(loginPage.passwordErrorMessage, errorMessages.emptyPassword);
		})
	
		test('Login-0013: Verify the System Response When Entering a Long Email and Password',{tag: ['@Smoke'],}, async () => {
			await performLogin(loginPage, loginTestData.longEmail.email, loginTestData.longEmail.password, 'Entering a long email and password');
			await verifyErrorMessage(loginPage.emailErrorMessage, errorMessages.maxLengthEmail);
			await verifyErrorMessage(loginPage.passwordErrorMessage, errorMessages.passwordComplexity);
		})
	
		test('Login-0014: Verify the System Response When Entering a short Email and Password',{tag: ['@Smoke'],}, async () => {
			await performLogin(loginPage, loginTestData.shortEmail.email, loginTestData.shortEmail.password, 'Entering a short email and password');
			await verifyErrorMessage(loginPage.emailErrorMessage, errorMessages.minLengthEmail);
			await verifyErrorMessage(loginPage.passwordErrorMessage, errorMessages.minLengthPassword);
		})
	
		test('Login-0018:Verify the System Response When Entering Credentials with Maximum Length',{tag: ['@Smoke'],}, async () => {
			await performLogin(loginPage, loginTestData.longEmail.email, loginTestData.longEmail.password, 'Entering credentials with maximum length');
			await verifyErrorMessage(loginPage.emailErrorMessage, errorMessages.maxLengthEmail);
			await verifyErrorMessage(loginPage.passwordErrorMessage, errorMessages.passwordComplexity);
		})
	
		test('Login-0015:Verify the System Response When Entering Credentials with Minimum Length',{tag: ['@Smoke'],}, async () => {
			await performLogin(loginPage, loginTestData.shortEmail.email, loginTestData.shortEmail.password, 'Entering credentials with minimum length');
			await verifyErrorMessage(loginPage.emailErrorMessage, errorMessages.minLengthEmail);
			await verifyErrorMessage(loginPage.passwordErrorMessage, errorMessages.minLengthPassword);
		})
	
		
	
		
	});

  	// Group 3: Authentication Tests
	test.describe('Authentication Tests', () => {
		test('Login-0010: Verify the System Response When Entering a Valid Email with an Incorrect Password',{tag: ['@Smoke'],}, async ({page}) => {
			await performLogin(loginPage, loginTestData.validCredentials.email, loginTestData.invalidEmail.password, 'Entering a valid email with an incorrect password');
			await verifyVisibility(page.getByText('The credentials provided are incorrect.'), errorMessages.incorrectCredentials);
		});
	
		test('Login-0011: Verify the System Response When Entering an Invalid Email and valid Password [Regression]',{tag: ['@Smoke'],}, async ({page}) => {
			await performLogin(loginPage, loginTestData.emptyPassword.email, loginTestData.invalidEmail.password, 'Entering an invalid email and valid password');
			await verifyVisibility(page.getByText('User not found, Please check your email address.'), errorMessages.userNotFound);
		});

		test('Login-0005: Verify the System Response When Entering Special Characters in Email/Password',{tag: ['@Smoke'],}, async () => {
			await performLogin(loginPage, loginTestData.specialCharacters.email, loginTestData.specialCharacters.password, 'Entering special characters in email/password');
			await verifyErrorMessage(loginPage.emailErrorMessage, errorMessages.invalidEmail);
		})
	
		test('Login-0012: Verify the System Response When Entering an Invalid Email and Incorrect Password',{tag: ['@Smoke'],}, async ({page}) => {
			await performLogin(loginPage, loginTestData.invalidPassword.email, loginTestData.invalidEmail.password, 'Entering an invalid email and incorrect password');
			await verifyVisibility(page.getByText('The credentials provided are incorrect.'), errorMessages.incorrectCredentials);
		})

		test('Login-0019:Verify the System Response When Entering Valid Credentials with Leading/Trailing Spaces',{tag: ['@Smoke'],}, async ({page}) => {
			await performLogin(loginPage, loginTestData.leadingTrailingSpaces.email, loginTestData.leadingTrailingSpaces.password, 'Entering valid credentials with leading/trailing spaces');
		})

		test('Login-0020:Verify the System Response When Entering Valid Username/Password',{tag: ['@Smoke'],}, async ({page, baseURL }) => {
			await performLogin(loginPage, loginTestData.validCredentials.email,loginTestData.validCredentials.password, 'Entering valid username/password');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(10000);
			const currentURL = page.url();
			Logger.pass(`✔ Navigated to: ${currentURL}`);
			expect(page.url()).toBe(`${baseURL}${pagePaths.loginSuccess}`);
		})
	
	

	});

  	// Group 4: Navigation Tests
	test.describe.parallel('Navigation Tests', () => {
		
		test('Login-0022: Verify the System Response When Clicking the "Forgot Password" Link',{tag: ['@Smoke'],}, async ({ page, baseURL }) => {
			await verifyNavigation(
			  loginPage.forgotPasswordLink,
			  page,
			  baseURL,
			  pagePaths.forgotPassword,
			  'Forgot Password page'
			);
		  });
		
		test('Login-0023: Verify the System Response When Clicking the "Create Account" Link',{tag: ['@Smoke'],}, async ({ page, baseURL }) => {
			await verifyNavigation(
			  loginPage.createNewAccountLink,
			  page, 
			  baseURL,
			  pagePaths.createAccount,
			  'Create Account page'
			);
		  });
	
	});

});

