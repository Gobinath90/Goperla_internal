import * as OTPAuth from 'otpauth'
import { test } from '../fixture/fixture'
import { Logger } from '../utils/logger'
import { addressDetails } from '../fixture/addressDetails'
import {
	verifyVisibility,
	fillOtp,
	verifyEleVisibility,
	verifyTextVisibility,
	fillCardDetails,
	filladdressDetails,
	clickElementsByRole
} from '../utils/test-helpers'

export class AuthenticationHelper {
	constructor(private page, private context, private baseURL) {}

	// Handles Microsoft 365 login and 2FA authentication
	async handleMicrosoftLogin() {
		return await test.step('Microsoft Login Process', async () => {
			try {
				const outlookPage = await this.context.newPage()
				await outlookPage.goto('https://login.microsoftonline.com/')
				await outlookPage
					.locator('input[type=email]')
					.fill(process.env.M365_EMAIL)
				await outlookPage.getByRole('button', { name: 'Next' }).click()
				await outlookPage
					.locator('input[type=password]')
					.fill(process.env.M365_PASSWORD)
				await outlookPage.locator('input[type=submit]').click()
				await this.handle2FA(outlookPage)
				return outlookPage
			} catch (error) {
				Logger.error('Microsoft login failed:', error)
				throw error
			}
		})
	}

	// Handles 2FA authentication using TOTP
	private async handle2FA(page) {
		return await test.step('2FA Authentication', async () => {
			try {
				await page.waitForSelector('input[type=submit][value="Yes"]')
				await page.locator('input[type=submit][value="Yes"]').click()

				const otherWayLink = page.locator('a#signInAnotherWay')
				if (await otherWayLink.isVisible()) {
					await otherWayLink.click()
					await page.locator("div[data-value='PhoneAppOTP']").click()
				}

				const totp = await this.generateTOTP()
				const otp = page.locator('input#idTxtBx_SAOTCC_OTC')
				if (await otp.isVisible()) {
					await otp.fill(totp)
					await page.locator('input[type=submit]').click()
					await page.locator('input[type=submit][value="Yes"]').click()
					await page.waitForLoadState('networkidle')
					await page.waitForTimeout(1000)
				}
			} catch (error) {
				Logger.error('2FA handling failed:', error)
				throw error
			}
		})
	}

	// Generates a TOTP code for authentication
	private async generateTOTP(): Promise<string> {
		return await test.step('Generate TOTP Authentication Code', async () => {
			const totp = await test.step('Configure and Generate TOTP', async () => {
				Logger.info('Initializing TOTP generation')

				const generatedTotp = new OTPAuth.TOTP({
					issuer: 'Microsoft',
					label: process.env.M365_EMAIL,
					algorithm: 'SHA1',
					digits: 6,
					period: 30,
					secret: process.env.TOTP_SECRET
				}).generate()

				Logger.info(`TOTP code generated: ${generatedTotp}`)
				return generatedTotp
			})

			return totp
		})
	}

	// Retrieves the verification code from the email inbox
	async getVerificationCode(outlookPage) {
		return await test.step('Get Verification Code', async () => {
			try {
				await outlookPage.waitForTimeout(5000)
				await outlookPage.goto('https://outlook.office.com/mail/')
				await outlookPage.waitForTimeout(5000)
				await outlookPage.getByText('noreply@goperla.com').first().click()
				await outlookPage.waitForTimeout(3000)

				const emailContent = await outlookPage
					.locator("//div[@class='x_content']//span[1]")
					.textContent()
				const otpMatch = emailContent.match(/\b\d{6}\b/)
				return otpMatch ? otpMatch[0] : null
			} catch (error) {
				Logger.error('Failed to get verification code:', error)
				throw error
			}
		})
	}

	// Completes registration by entering the OTP
	async completeRegistration(otp: string) {
		await test.step('Complete Registration', async () => {
			try {
				await this.page.bringToFront()
				if (otp) {
					await fillOtp(this.page, otp.split(''))
					await clickElementsByRole(this.page, ['Submit'], 'button')
					await verifyVisibility(
						this.page.getByText('Verified successfully!'),
						'Verified successfully Toast message'
					)
				}
				await this.page.waitForLoadState('networkidle')
				await this.page.waitForTimeout(5000)
			} catch (error) {
				Logger.error('Registration completion failed:', error)
				throw error
			}
		})
	}

	async enterBillingDetails(createBillingAddress) {
		await test.step('Enter Billing Details', async () => {
			try {
				await this.page.waitForLoadState('networkidle')
				await verifyEleVisibility(
					this.page,
					['Transparent pricing with no'],
					'heading'
				)
				await this.page.getByRole('button', { name: 'Select Plan' }).first().click();
				// await this.page
				// 	.locator("(//div[contains(@class,'mb-4 mt-5')]//button)[1]")
				// 	.click()

				await this.page.waitForTimeout(3000)
				await verifyEleVisibility(
					this.page,
					['Review & Make Payment'],
					'heading'
				)

				const Expiration = `${createBillingAddress.expiryMonth}${createBillingAddress.expiryYear}`
				await fillCardDetails(
					this.page,
					createBillingAddress.billingName,
					createBillingAddress.creditCardNumber,
					Expiration,
					createBillingAddress.cvv
				)
				await this.page.getByLabel('Same as Company\'s physical').check();
				//await filladdressDetails(this.page, addressDetails)
				await clickElementsByRole(this.page, ['Review'], 'button')
				await this.page.waitForTimeout(3000)
			} catch (error) {
				Logger.error('Billing details entry failed:', error)
				throw error
			}
		})
	}

	async completePurchase() {
		await test.step('Complete Purchase', async () => {
			try {
				await verifyTextVisibility(this.page, [
					'Name',
					'Payment Method',
					'Billing Address'
				])
				await test
					.expect(this.page.getByLabel("I agree to GoPerla's Terms of"))
					.toBeVisible()
				await this.page.getByLabel("I agree to GoPerla's Terms of").check()
				await this.page.waitForTimeout(3000)

				await clickElementsByRole(this.page, ['Complete Purchase'], 'button')
				await this.page.waitForTimeout(10000)
			} catch (error) {
				Logger.error('Purchase completion failed:', error)
				throw error
			}
		})
	}
}
