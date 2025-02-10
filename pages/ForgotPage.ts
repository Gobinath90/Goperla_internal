import { Page, expect, Locator } from '@playwright/test'

export class ForgotPage {
	readonly page: Page
	readonly forgotPasswordLink: Locator
	readonly emailInput: Locator
	readonly submitButton: Locator
	readonly emailHelperText: Locator
	readonly signInLinkText: Locator

	constructor(page: Page) {
		this.page = page
		this.forgotPasswordLink = page.locator('text=Forgot Password?')
		this.emailInput = page.locator('input[placeholder="Email Address"]')
		this.submitButton = page.locator('button[type="submit"]')
		this.emailHelperText = page.locator('#email-helper-text')
		this.signInLinkText = page.getByRole('link', { name: 'Login' })
	}
}
