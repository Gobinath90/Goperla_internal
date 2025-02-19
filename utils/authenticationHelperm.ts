import * as OTPAuth from 'otpauth';
import { test } from '../fixture/fixture';
import { Logger } from '../utils/logger';
import { addressDetails } from '../fixture/addressDetails';
import {
    verifyVisibility,
    fillOtp,
    verifyEleVisibility,
    verifyTextVisibility,
    fillCardDetails,
    filladdressDetails,
    clickElementsByRole,
} from '../utils/test-helpers';


export class AuthenticationHelper {
    constructor(private page, private context, private baseURL) {}

    // Handles Microsoft 365 login and 2FA authentication
    async handleMicrosoftLogin() {
        try {
            Logger.info('Starting Microsoft login process');
            const outlookPage = await this.context.newPage();
            await outlookPage.goto('https://login.microsoftonline.com/');
            await outlookPage.locator('input[type=email]').fill(process.env.M365_EMAIL);
            await outlookPage.getByRole('button', { name: 'Next' }).click();
            await outlookPage.locator('input[type=password]').fill(process.env.M365_PASSWORD);
            await outlookPage.locator('input[type=submit]').click();
            await this.handle2FA(outlookPage);
            return outlookPage;
        } catch (error) {
            Logger.error('Microsoft login failed:', error);
            throw error;
        }
    }

    // Handles 2FA authentication using TOTP
    private async handle2FA(page) {
        try {
            Logger.info('Handling 2FA authentication');
            await page.waitForSelector('input[type=submit][value="Yes"]');
            await page.locator('input[type=submit][value="Yes"]').click();
            const otherWayLink = page.locator('a#signInAnotherWay');
            if (await otherWayLink.isVisible()) {
                await otherWayLink.click();
                await page.locator("div[data-value='PhoneAppOTP']").click();
            }
            const totp = this.generateTOTP();
            const otp = page.locator('input#idTxtBx_SAOTCC_OTC');
            if (await otp.isVisible()) {
                await otp.fill(totp);
                await page.locator('input[type=submit]').click();
                await page.locator('input[type=submit][value="Yes"]').click();
                Logger.info('Waiting for network stability');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(1000);
            }   
            Logger.info('2FA authentication completed successfully'); 
        } catch (error) {
            Logger.error('2FA handling failed:', error);
            throw error;
        }
    }

    // Generates a TOTP code for authentication
    private generateTOTP(): string {
        Logger.info('Generating TOTP authentication code');
        const totp = new OTPAuth.TOTP({
            issuer: 'Microsoft',
            label: process.env.M365_EMAIL,
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: process.env.TOTP_SECRET
        }).generate();
        Logger.info('TOTP code generated successfully');
        return totp;
    }

    // Retrieves the verification code from the email inbox
    async getVerificationCode(outlookPage) {
        Logger.info('Starting verification code retrieval process');
        Logger.info('Navigating to Outlook inbox');
        await outlookPage.goto('https://outlook.office.com/mail/');
        Logger.info('Waiting for inbox to load');
        await outlookPage.waitForTimeout(5000);
        Logger.info('Opening verification email');
        await outlookPage.getByText('noreply@goperla.com').first().click();
        await outlookPage.waitForTimeout(3000);
        Logger.info('Extracting verification code from email');
        const emailContent = await outlookPage
            .locator("//div[@class='x_content']//span[1]")
            .textContent();
        const otpMatch = emailContent.match(/\b\d{6}\b/);
        const otp = otpMatch ? otpMatch[0] : null;
        Logger.info(`Retrieved verification code: ${otp}`);
        return otp;

    }

    // Completes registration by entering the OTP
    async completeRegistration(otp: string) {
        Logger.info('Starting registration completion process');
        await this.page.bringToFront()
        if (otp) {
            Logger.info('Entering OTP code');
            await fillOtp(this.page, otp.split(''))
            Logger.info('Submitting OTP verification');
            await clickElementsByRole(this.page, ['Submit'], 'button')
            Logger.info('Verifying successful registration');
            await verifyVisibility(this.page.getByText('Verified successfully!'), 'Verified successfully Toast message is Showing successfully');
            Logger.info('Registration process completed successfully');
        }
        Logger.info('Waiting for final registration confirmation');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(5000);        
    }
        async enterBillingDetails(createBillingAddress) {
            Logger.info('Starting billing details entry process');
            await this.page.waitForLoadState('networkidle');
            Logger.info('Verifying pricing section visibility');
            await verifyEleVisibility(this.page, ['Transparent pricing with no'], 'heading');
            Logger.info('Selecting basic plan');
            await this.page.locator("(//div[contains(@class,'mb-4 mt-5')]//button)[1]").click();
            Logger.info('Proceeding to payment review');
            await this.page.waitForTimeout(5000);
            await this.page.waitForLoadState('networkidle');
            await verifyEleVisibility(this.page, ['Review & Make Payment'], 'heading');
            console.log('Generated Billing Data:', createBillingAddress);
            Logger.info('Entering card details');
            const Expiration = `${createBillingAddress.expiryMonth}${createBillingAddress.expiryYear}`;
            await fillCardDetails(this.page, createBillingAddress.billingName, createBillingAddress.creditCardNumber, Expiration, createBillingAddress.cvv);
            Logger.info('Entering address details');
            await filladdressDetails(this.page, addressDetails);
            Logger.info('Proceeding to review');
            await clickElementsByRole(this.page, ['Review'], 'button');
            await this.page.waitForTimeout(5000);
            Logger.info('Billing details entered successfully');
        }

        async completePurchase() {
            Logger.info('Starting purchase completion process');
            Logger.info('Verifying purchase summary details');
            await verifyTextVisibility(this.page, ['Name', 'Payment Method', 'Billing Address']);
            Logger.info('Accepting terms and conditions');
            await test.expect(this.page.getByLabel("I agree to GoPerla's Terms of")).toBeVisible();
            await this.page.getByLabel("I agree to GoPerla's Terms of").check();
            await this.page.waitForTimeout(3000);
            Logger.info('Submitting purchase');
            await clickElementsByRole(this.page, ['Complete Purchase'], 'button');
            Logger.info('Waiting for purchase confirmation');
            await this.page.waitForTimeout(10000);
            Logger.info('Purchase completed successfully');
        }
}