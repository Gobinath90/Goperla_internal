// test.spec.ts
import { test, expect } from '@playwright/test'
import {
	signUpUser,
	confirmSignUp,
	signInResponse,
	getAllProducts,
	createCompany,
	forgotPassword,
	confirmPassword
} from '../utils/apiUtils'
import { access } from 'fs'

// Global variables
const timestamp = Date.now()
const email = `user${timestamp}@yopmail.com`
const password = 'SmartWork@123'
const module = 'MARKETING'
const otpCode = '123456'
const striptUrl = 'https://api.stripe.com/v1/payment_methods'
const stripeApiKey =
	'sk_test_51IVPHFCiqF5m9vx5oEUyIVKalDpMHAfUgegK7gXxegz2vWutE3sNwmpDCAKNHYznBcs35Qg4M7tCbnPMxp352lBG00yilk27id'
const stripePaymentType = 'card'
const stripeCardToken = 'tok_visa'

test.describe('User Sign Up and Resend API and Confirmation API', () => {
	let uuid: string
	let emailid: string
	let accessToken: string
	let priceId: string
	let paymentMethodId: string

	// ✅ **Test 1: User Sign Up & Email Confirmation**
	test('User Signup & Confirm Email', async ({ request }) => {
		console.log('🔹 Starting User Signup...')
		const userData = await signUpUser(request, email, password, module)

		expect(userData).toHaveProperty('uuid')
		expect(userData.email).toBe(email)

		uuid = userData.uuid
		emailid = userData.email
		console.log('✅ User Signed Up Successfully:', userData)

		const confirmationResponse = await confirmSignUp(request, uuid, otpCode)
		expect(confirmationResponse).toBe(true)

		console.log('✅ Email Verified Successfully!')
	})

	// ✅ **Test 2: User Sign In & Create Company**
	test('User Sign In & Create Company', async ({ request }) => {
		console.log(`🔹 Signing in user: ${emailid}...`)
		const signInData = await signInResponse(request, emailid, password, module)

		expect(signInData.success).toBe(true)
		accessToken = signInData.accessToken
		console.log('✅ User Signed In Successfully.')

		console.log('🔹 Creating Company...')
		const companyData = {
			companyName: 'Tech Solutions',
			ein: '123456789',
			npi: '9876543210',
			streetAddress1: '123 Main St',
			streetAddress2: 'Suite 100',
			domain: 'techsolutions.com',
			city: 'New York',
			state: 'NY',
			country: 'USA',
			zipCode: '10001',
			email: emailid,
			phoneNumber: '123-456-7890',
			mobileNumber: '987-654-3210',
			websiteAddress: 'https://techsolutions.com',
			authorizeSMS: true
        }

		const companyResponse = await createCompany(request, companyData)
		expect(companyResponse).toBe(true)
		console.log('✅ Company Created Successfully.', companyResponse)
	})

	// ✅ **Test 3: Fetch Products and Store Price ID**
	test('Fetch Products and Store Price ID', async ({ request }) => {
		console.log('🔹 Fetching Available Products...')
		const products = await getAllProducts(request)

		console.log('✅ Available Products:', products)
        expect(products.length).toBeGreaterThan(0)
		priceId = products[0].price_id

		console.log('✅ Stored Price ID:', priceId)
		expect(priceId).toBeDefined()
	})

	test('Create a payment method in Stripe', async ({ request }) => {
		console.log('🔹 Creating a Payment Method in Stripe...')
		const response = await request.post(striptUrl, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(stripeApiKey).toString('base64')}`
			},
			form: {
				type: stripePaymentType,
				'card[token]': stripeCardToken
			}
		})
        expect(response.status()).toBe(200)
		const responseBody = await response.json()
        //console.log(responseBody)
		expect(responseBody).toHaveProperty('id')
		paymentMethodId = responseBody.id
		console.log('✅ Stored Payment Method ID:', paymentMethodId)
	})

	// ✅ **Test 5: Forgot & Confirm Password API Test**
	test('Forgot & Confirm Password API Test', async ({ request }) => {        
		console.log(`🔹 Forgot Password API Test for ${emailid}`)
		// Step 1: Forgot Password
		const forgotPasswordResponse = await forgotPassword(request, emailid)
		expect(forgotPasswordResponse).toBe(true)
		console.log('✅ Forgot Password API executed successfully.')

		// Step 2: Confirm Password
		console.log(`🔹 Confirm Password API Test for ${emailid}`)
        const newPassword = 'SmartWork@123'
		const confirmPasswordValue = 'SmartWork@123'

		const confirmPasswordResponse = await confirmPassword(
			request,
			emailid,
			otpCode,
			newPassword,
			confirmPasswordValue
		)

		expect(confirmPasswordResponse).toBe(true)
		console.log('✅ Confirm Password API executed successfully.')
	})
})
