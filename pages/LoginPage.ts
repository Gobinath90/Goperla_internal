import { test, expect, Page, Locator } from '@playwright/test'

export class LoginPage {
	readonly page: Page
	readonly logo: Locator
	readonly headings: Locator[]
	readonly emailFieldLabel: Locator
	readonly emailInputField: Locator
	readonly Message: Locator
	readonly emailErrorMessage: Locator
	readonly passwordFieldLabel: Locator
	readonly passwordInputField: Locator
	readonly passwordErrorMessage: Locator
	readonly forgotPasswordLink: Locator
	readonly signInButton: Locator
	readonly visibilityIconOn: Locator
	readonly visibilityIconOff: Locator
	readonly termsText: Locator
	readonly userAgreementLink: Locator
	readonly privacyPolicyLink: Locator
	readonly createNewAccountLink: Locator
	readonly profile: Locator
	readonly logout: Locator

	constructor(page: Page) {
		this.page = page
		this.logo = page.getByRole('img', { name: 'logo' })
		this.headings = [
			page.getByRole('heading', { name: 'Streamline your compliance' }),
			page.getByRole('heading', { name: 'with Perla' }),
			page.getByRole('heading', { name: 'Sign in with email' })
		]
		this.emailFieldLabel = page.getByText('Email', { exact: true })
		this.emailInputField = page.getByPlaceholder('Enter your email')
		this.emailErrorMessage = page.locator('#email-helper-text')

		this.passwordFieldLabel = page.getByText('Password', { exact: true })
		this.passwordInputField = page.getByPlaceholder('Enter your Password')
		this.visibilityIconOn = page.getByTestId('VisibilityIcon')
		this.visibilityIconOff = page.getByTestId('VisibilityOffIcon')
		this.passwordErrorMessage = page.locator('#password-helper-text')

		this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' })
		this.signInButton = page.getByRole('button', { name: 'Sign In', exact: true })
		this.termsText = page.getByText('By logging in you agree to')
		this.userAgreementLink = page.getByRole('link', { name: 'User Agreement' })
		this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' })
		this.createNewAccountLink = page.getByRole('link', { name: 'Create New Account' })
		this.profile = page.getByRole('img', { name: 'profile' })
		this.logout = page.getByRole('link', { name: 'Logout' })
	}

	async navigateTo(baseURL: string) {
		if (!baseURL) {
			throw new Error( 'Base URL is not defined in the Playwright configuration.' )
		}
		await this.page.goto(baseURL)
	}

	async navigateAndVerify(page, baseURL, targetPath) {
		await test.step(`Navigate to ${targetPath}`, async () => {
			await page.goto(`${baseURL}${targetPath}`)
			await page.waitForLoadState('networkidle')
			const currentURL = page.url()
			console.log(`Navigated to: ${currentURL}`)
			expect(currentURL).toBe(`${baseURL}${targetPath}`)
		})
	}
}
