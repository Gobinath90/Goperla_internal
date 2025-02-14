// file: create-user.spec.ts
import { test, expect } from '@playwright/test'

let emailNumber = 9
let storedUuid
let password = 'Test@123'
let module = 'MARKETING'
let confirmationCode = '123456'
const url = 'http://35.174.104.5:5001/graphql'


test.describe('Create User and Confirm Sign Up', () => {
	test('create user', async ({ page }) => {
		const createUserMutation = `
    mutation signUpUser($email: String!, $password: String!, $module: String!) {
      signUpUser(email: $email, password: $password, module: $module) {
        uuid
        email
      }
    }
  `
		const variables = {
			email: `test_${emailNumber}@yopmail.com`,
			password: password,
			module: module
		}

		const response = await page.request.post(url, {
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({ query: createUserMutation, variables })
		})

		expect(response.status()).toBe(200)
		const data = await response.json()

		storedUuid = data.data.signUpUser.uuid
		console.log('UUID: ', storedUuid)
		console.log('Response data: ', data)

		expect(data.data.signUpUser).toEqual(
			expect.objectContaining({
				uuid: expect.any(String),
				email: expect.stringMatching(variables.email)
			})
		)
	})

	test('confirm sign up', async ({ page }) => {
		const confirmSignUpMutation = `
    mutation confirmSignUp($uuid: String!, $confirmationCode: String!) {
      confirmSignUp(uuid: $uuid, confirmationCode: $confirmationCode)
    }
  `
		const variables = {
			uuid: storedUuid,
			confirmationCode: confirmationCode
		}

		const response = await page.request.post(url, {
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({ query: confirmSignUpMutation, variables })
		})

		expect(response.status()).toBe(200)
		const data = await response.json()

		console.log('Response data: ', data)
		expect(data.errors).toBeUndefined()
		expect(data.data.confirmSignUp).toBe(true)
	})

	test('create company', async ({ page }) => {
		const createCompanyMutation = `
      mutation ($companyName: String!, $ein: Int, $npi: Int, $streetAddress1: String!, $streetAddress2: String, $city: String!, $state: String!, $zipCode: String!, $email: String, $phoneNumber: String!, $mobileNumber: String!, $websiteAddress: String, $authorizeSMS: Boolean, $country: String!, $userId: String!) {
        createCompany(
          companyName: $companyName
          ein: $ein
          npi: $npi
          streetAddress1: $streetAddress1
          streetAddress2: $streetAddress2
          city: $city
          state: $state
          zipCode: $zipCode
          email: $email
          phoneNumber: $phoneNumber
          mobileNumber: $mobileNumber
          websiteAddress: $websiteAddress
          authorizeSMS: $authorizeSMS
          country: $country
          userId: $userId
        )
      }
    `
		const variables = {
			companyName: 'sample',
			ein: 0,
			npi: 0,
			streetAddress1: 'sample',
			streetAddress2: 'sample',
			city: 'sample',
			state: 'sample',
			zipCode: '00000',
			email: `test_${emailNumber}@yopmail.com`,
			phoneNumber: '123-456-7890',
			mobileNumber: '123-456-7890',
			websiteAddress: 'http://3.80.32.182:3000/subscription',
			authorizeSMS: true,
			country: '',
			userId: storedUuid
		}
		const response = await page.request.post(url, {
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({ query: createCompanyMutation, variables })
		})

		expect(response.status()).toBe(200)
		const data = await response.json()

		console.log('Response data: ', data)
		expect(data.errors).toBeUndefined()
	})

	test('create payment', async ({ page }) => {
		const createPaymentIntentMutation = `
          mutation ($amount: Int!, $currency: String!, $payment_method_types: [String!]!) {
            createPaymentIntent(amount: $amount, currency: $currency, payment_method_types: $payment_method_types) {
              id
              client_secret
            }
          }
        `

		const variables = {
			amount: 1000,
			currency: 'usd',
			payment_method_types: ['card']
		}

		const response = await page.request.post(url, {
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({ query: createPaymentIntentMutation, variables })
		})

		expect(response.status()).toBe(400)
		const data = await response.json()

		const paymentIntentId = data.data.createPaymentIntent.id
		const clientSecret = data.data.createPaymentIntent.client_secret

		console.log('Payment Intent ID:', paymentIntentId)
		console.log('Client Secret:', clientSecret)

		// Create a payment method
		const createPaymentMethodUrl = 'https://api.stripe.com/v1/payment_methods'
		const createPaymentMethodData = {
			type: 'card',
			billing_details: {
				name: 'sample',
				address: {
					line1: '987 Atlantic Avenue',
					line2: 'C/O: HealthPointer NHF Group',
					country: 'US',
					state: 'Virginia (VA)',
					postal_code: '23451'
				}
			},
			card: {
				number: '4242424242424242',
				cvc: '123',
				exp_month: '01',
				exp_year: '25'
			}
		}

		const createPaymentMethodResponse = await page.request.post(
			createPaymentMethodUrl,
			{
				headers: { 'Content-Type': 'application/json' },
				data: JSON.stringify(createPaymentMethodData)
			}
		)

		expect(createPaymentMethodResponse.status()).toBe(200)
		const paymentMethodData = await createPaymentMethodResponse.json()

		const paymentMethodId = paymentMethodData.id

		console.log('Payment Method ID:', paymentMethodId)

		// Confirm the payment
		const confirmPaymentUrl = `https://api.stripe.com/v1/payment_intents/${paymentIntentId}/confirm`
		const confirmPaymentData = {
			payment_method: paymentMethodId
		}

		const confirmPaymentResponse = await page.request.post(confirmPaymentUrl, {
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify(confirmPaymentData)
		})

		expect(confirmPaymentResponse.status()).toBe(200)
		const confirmPaymentDataResponse = await confirmPaymentResponse.json()

		console.log('Payment Confirmation Response:', confirmPaymentDataResponse)
	})
})
