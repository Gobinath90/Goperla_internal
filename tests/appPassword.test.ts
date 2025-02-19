import { test } from '@playwright/test'
import * as OTPAuth from 'otpauth'
import { pagePaths } from '../fixture/urls'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import dotenv from 'dotenv'
import {
	verifyVisibility,
	fillAndSubmitForm,
	fillOtp,
	clickElementsByRole
} from '../utils/test-helpers'

dotenv.config()

// Constants
const AUTH_FILE = 'playwright/.auth/user.json'
const CREDENTIALS = {
	password: 'Test@123',
	baseEmail: 'gp2_test',
	domain: 'twilightitsolutions.com',
  testemail:'dorothy.wilson',
  domain2:'healthPointerGroup.com',
}

const SELECTORS = {
	email: 'input[type=email]',
	password: 'input[type=password]',
	submit: 'input[type=submit]',
	otherWay: 'a#signInAnotherWay',
	totpInput: 'input#idTxtBx_SAOTCC_OTC',
	phoneAppOtp: "div[data-value='PhoneAppOTP']",
	verificationEmail: 'noreply@goperla.com',
	otpContent: "//div[@class='x_content']//span[1]"
}

class AuthenticationHelper {
	constructor(private page, private context, private baseURL) {}

	async registerNewUser(loginPage: LoginPage, signUpPage: RegisterPage) {
		const dynamicEmail = this.generateDynamicEmail()
		console.log(`Random email generated: ${dynamicEmail}`)

		await loginPage.navigateAndVerify(this.page, this.baseURL, '/signup')
		await fillAndSubmitForm(signUpPage, {
			email: dynamicEmail,
			password: CREDENTIALS.password,
			confirmPassword: CREDENTIALS.password
		})

		await verifyVisibility(
			this.page.getByText('Verification code sent'),
			'Verification code sent successfully!'
		)
		await this.page.waitForLoadState('networkidle')
	}

	private generateDynamicEmail(): string {
		return `${CREDENTIALS.testemail}+${Date.now()}@${CREDENTIALS.domain2}`
	}

	async handleMicrosoftLogin() {
		const outlookPage = await this.context.newPage()
		await outlookPage.goto('https://login.microsoftonline.com/')

		// Login sequence
		await outlookPage.locator(SELECTORS.email).fill(process.env.M365_EMAIL)
		await outlookPage.getByRole('button', { name: 'Next' }).click()
		await outlookPage
			.locator(SELECTORS.password)
			.fill(process.env.M365_PASSWORD)
		await outlookPage.locator(SELECTORS.submit).click()
		try {
			await this.handle2FA(outlookPage)
		} catch (error) {
			console.error('2FA handling:', error)
		}
		return outlookPage
	}

	private async handle2FA(page) {
		const otherWayLink = page.locator(SELECTORS.otherWay)
		try {
			await page.locator(`${SELECTORS.submit}[value='Yes']`).click()
			await otherWayLink.waitFor({ timeout: 3000 })
			if (await otherWayLink.isVisible()) {
				await otherWayLink.click()
				await page.locator(SELECTORS.phoneAppOtp).click()
			}

			const totp = this.generateTOTP()
			await page.locator(SELECTORS.totpInput).fill(totp)
			await page.locator(SELECTORS.submit).click()
			await page.locator(`${SELECTORS.submit}[value='Yes']`).click()
		} catch (error) {
			console.error('2FA handling failed:', error)
			throw error
		}
	}

	private generateTOTP(): string {
		return new OTPAuth.TOTP({
			issuer: 'Microsoft',
			label: process.env.M365_EMAIL,
			algorithm: 'SHA1',
			digits: 6,
			period: 30,
			secret: process.env.TOTP_SECRET
		}).generate()
	}

	async getVerificationCode(outlookPage) {
		await outlookPage.goto('https://outlook.office.com/mail/')
		await outlookPage.waitForTimeout(5000)

		await outlookPage.getByText(SELECTORS.verificationEmail).first().click()
		await outlookPage.waitForTimeout(3000)
		const emailContent = await outlookPage
			.locator(SELECTORS.otpContent)
			.textContent()
		const otpMatch = emailContent.match(/\b\d{6}\b/)
		return otpMatch ? otpMatch[0] : null
	}

	async completeRegistration(otp: string) {
		await this.page.bringToFront()
		if (otp) {
			await fillOtp(this.page, otp.split(''))
			await clickElementsByRole(this.page, ['Submit'], 'button')
		}
		await this.page.waitForURL(`${this.baseURL}${pagePaths.subscription}`)
	}
}

test.describe('Authentication Flow', () => {
	test('complete registration with email verification', async ({
		context,
		page,
		baseURL
	}) => {
		const auth = new AuthenticationHelper(page, context, baseURL)
		const loginPage = new LoginPage(page)
		const signUpPage = new RegisterPage(page)

		try {
			await auth.registerNewUser(loginPage, signUpPage)
			const outlookPage = await auth.handleMicrosoftLogin()
			const otp = await auth.getVerificationCode(outlookPage)
			await auth.completeRegistration(otp)
			await outlookPage.context().storageState({ path: AUTH_FILE })
		} catch (error) {
			console.error('Authentication test failed:', error)
			throw error
		}
	})
})
