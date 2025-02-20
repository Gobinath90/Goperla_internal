import { test } from '../../fixture/fixture'
import { pagePaths } from '../../fixture/urls'
import { LoginPage } from '../../pages/LoginPage'
import { RegisterPage } from '../../pages/RegisterPage'
import dotenv from 'dotenv'
import { Logger } from '../../utils/logger'
import {
	verifyVisibility,
	fillAndSubmitForm,
	fillCompanyData,
	clickElementsByRole,
	verifyNavigation,
	login,
	verifyNavigationButtons,
	createWorkspace,
	createSubsidiary,
	editWorkspace,
	logout,
	testModalInteractions,
	createMultipleWorkspaces
} from '../../utils/test-helpers'
import { AuthenticationHelper } from '../../utils/authenticationHelperm'

dotenv.config()
test.setTimeout(600000) // 10 minutes
test.describe.configure({ mode: 'serial' }) // Ensure tests run in order

test.describe('Email Generation Suite', () => {
	let sharedEmail: string
	let domain: string

	test.beforeAll(async ({ generatedEmail }) => {
		sharedEmail = generatedEmail
		domain = sharedEmail.split('@')[0].split('+')[1]
	})
	test('User Signup, Company Creation & Billing Process', async ({page,baseURL,context,createCredentials,createCompanyValidData,createBillingAddress}) => {
		test.slow() // Mark as slow-running test
        Logger.info('Starting user registration process');
		const auth = new AuthenticationHelper(page, context, baseURL)
		await page.goto(baseURL)
		await page.waitForLoadState('networkidle', { timeout: 30000 })

		Logger.info('Navigating to Sign Up Page')
		const loginPage = new LoginPage(page)
        await verifyNavigation(loginPage.createNewAccountLink, page, baseURL, pagePaths.createAccount, 'Create Account page');

        const signUpPage = new RegisterPage(page)
		test.expect(createCredentials.email).toBe(sharedEmail)

		await fillAndSubmitForm(signUpPage, {
			email: sharedEmail,
			password: createCredentials.password,
			confirmPassword: createCredentials.password
		})

        await verifyVisibility(page.getByText('Verification code sent'), 'Verification code sent successfully!');
		await page.waitForLoadState('networkidle', { timeout: 30000 })
        await page.waitForURL(`${baseURL}${pagePaths.otpVerfication}`, { timeout: 30000 });

		// Handle Microsoft login and get OTP
		const outlookPage = await auth.handleMicrosoftLogin()
		const otp = await auth.getVerificationCode(outlookPage)
		await auth.completeRegistration(otp)

		Logger.info('Entering company information')
		await page.waitForURL(`${baseURL}${pagePaths.subscription}`, {
			timeout: 30000
		})

		console.log('Generated Company Data:', createCompanyValidData)
		await fillCompanyData(page, {
			...createCompanyValidData, domain: createCompanyValidData.domainAddress.toLowerCase().replace(/\s+/g, '_')
		})

		// Enter Credit Card and Billing Details
		Logger.info('Entering credit card and billing details')
        console.log('Generated Billing Address Data:', createBillingAddress)
		await auth.enterBillingDetails(createBillingAddress)

		// Complete Purchase
		Logger.info('Completing purchase')
		await auth.completePurchase()
		await page.waitForTimeout(3000)
	})

	test('Workspace and Subsidiary Management Flow', async ({ page, createCompanyValidData, createCredentials }) => {
		const workspaceList = [
			{ name: 'Workspace_R-Virginia', description: 'Workspace_R-Virginia' },
			{ name: 'Workspace_R-Maryland', description: 'Workspace_R-Maryland' },
			{ name: 'Workspace_R-Washington_DC', description: 'Workspace_R-Washington_DC' },
			{ name: 'Workspace_R-California', description: 'Workspace_R-California' }
		  ];
		const subsidiaryList = [
			{ name: 'Entity_sub_Virginia_Beach_NHF', description: 'Entity_sub_Virginia_Beach_NHF', assignTo: 'Workspace_R-Virginia' },
			{ name: 'Entity_sub_Norfolk_NHF', description: 'Entity_sub_Norfolk_NHF', assignTo: 'Workspace_R-Virginia' },
			{ name: 'Entity_sub_Chesapeake_VAH', description: 'Entity_sub_Chesapeake_VAH', assignTo: 'Workspace_R-Virginia' },
			{ name: 'Entity_sub_Baltimore_VAH', description: 'Entity_sub_Baltimore_VAH', assignTo: 'Workspace_R-Marylanda' },
			{ name: 'Entity_sub_Germantown_NHF', description: 'Entity_sub_Germantown_NHF', assignTo: 'Workspace_R-Maryland' },
			{ name: 'Entity_sub_Ward6_VAH', description: 'Entity_sub_Ward6_VAH', assignTo: 'Workspace_R-Washington_DC' },
			{ name: 'Entity_sub_OC_North_SNF', description: 'Entity_sub_OC_North_SNF', assignTo: 'Workspace_R-California' },
			{ name: 'Entity_sub_San_Diego_SNF', description: 'Entity_sub_San_Diego_SNF', assignTo: 'Workspace_R-California' }
		  ];

		const domain = createCompanyValidData.domainAddress.toLowerCase().replace(/\s+/g, '_');

		await login(page, sharedEmail, createCredentials, domain)
		await page.waitForTimeout(3000)
		await verifyNavigationButtons(page)
		await createWorkspace(page, workspaceList)
		await createSubsidiary(page, subsidiaryList)
		await editWorkspace(page, workspaceList)
		await logout(page)
	})
})
