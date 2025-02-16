// apiUtils.ts
import { APIRequestContext } from '@playwright/test'
import { Page, test, expect } from '@playwright/test'

const API_URL = 'http://3.80.246.141:5000/graphql'
const HEADERS = { 'Content-Type': 'application/json' }

export async function signUpUser(
	request: APIRequestContext,
	email: string,
	password: string,
	module: string
) {
	const signUpMutation = `
  mutation SignUpUser {
    signUpUser(
        signUpUser: { email: "${email}", password: "${password}", module: ${module} }
    ) {
        SignUp {
            uuid
            email
        }
    }
}
`
	const response = await request.post(API_URL, {
		headers: HEADERS,
		data: { query: signUpMutation }
	})

	if (response.status() !== 200) {
		throw new Error(`Sign-up failed with status ${response.status()}`)
	}

	const data = await response.json()
	if (!data?.data?.signUpUser?.SignUp) {
		throw new Error(`Unexpected response structure: ${JSON.stringify(data)}`)
	}

	return data.data.signUpUser.SignUp // Extracts { uuid, email }
}

export async function confirmSignUp(
	request: APIRequestContext,
	uuid: string,
	otpCode: string
) {
	console.log(`Confirming sign-up for UUID: ${uuid} with OTP: ${otpCode}...`)

	const confirmSignUpMutation = `
      mutation ConfirmSignUp {
        confirmSignUp(confirmSignUp: { uuid: "${uuid}", confirmationCode: "${otpCode}" })
      }
    `

	const response = await request.post(API_URL, {
		headers: HEADERS,
		data: { query: confirmSignUpMutation }
	})

	if (response.status() !== 200) {
		throw new Error(
			`Email confirmation failed with status ${response.status()}`
		)
	}

	const data = await response.json()

	if (!data?.data?.confirmSignUp) {
		throw new Error(`Unexpected response structure: ${JSON.stringify(data)}`)
	}
	return data.data.confirmSignUp // Should return `true` if successful
}

export async function signInResponse(
	request: APIRequestContext,
	email: string,
	password: string,
	module: string
) {
	const signInMutation = `
      mutation SignInResponse {
        signInResponce(
          signIn: {
            email: "${email}",
            password: "${password}",
            module: ${module}
          }
        ) {
          accessToken
          refreshToken
          sessionToken
          role
          email
          isPaid
          isEntity
          userId
          roleId
          success
        }
      }
    `
	const response = await request.post(API_URL, {
		headers: HEADERS,
		data: { query: signInMutation }
	})

	if (response.status() !== 200) {
		throw new Error(`Sign-in failed with status ${response.status()}`)
	}

	const data = await response.json()

	if (!data?.data?.signInResponce?.success) {
		throw new Error(`Sign-in failed: ${JSON.stringify(data)}`)
	}
	return data.data.signInResponce
}

export async function getAllProducts(request: APIRequestContext) {
	const getAllProductsQuery = `
      query GetAllProducts {
        getAllProducts {
          id
          plan_name
          price_id
        }
      }
    `

	const response = await request.post(API_URL, {
		headers: HEADERS,
		data: { query: getAllProductsQuery }
	})

	if (response.status() !== 200) {
		throw new Error(`Fetching products failed with status ${response.status()}`)
	}

	const data = await response.json()
	if (!data?.data?.getAllProducts) {
		throw new Error(`Unexpected response structure: ${JSON.stringify(data)}`)
	}

	return data.data.getAllProducts // Returns an array of products
}

export async function createCompany(
	request: APIRequestContext,
	companyData: Record<string, any>
) {
	console.log('Company Data:', companyData)

	const createCompanyMutation = `
      mutation CreateCompany {
        createCompany(
          createCompanyInput: {
            companyName: "${companyData.companyName}"
            ein: "${companyData.ein}"
            npi: "${companyData.npi}"
            streetAddress1: "${companyData.streetAddress1}"
            streetAddress2: "${companyData.streetAddress2}"
            domain: "${companyData.domain}"
            city: "${companyData.city}"
            state: "${companyData.state}"
            country: "${companyData.country}"
            zipCode: "${companyData.zipCode}"
            email: "${companyData.email}"
            phoneNumber: "${companyData.phoneNumber}"
            mobileNumber: "${companyData.mobileNumber}"
            websiteAddress: "${companyData.websiteAddress}"
            authorizeSMS: ${companyData.authorizeSMS}
          }
        )
      }
    `

	const response = await request.post(API_URL, {
		headers: HEADERS,
		data: { query: createCompanyMutation }
	})

	if (response.status() !== 200) {
		throw new Error(`Company creation failed with status ${response.status()}`)
	}

	const data = await response.json()
	console.log('Create Company API Response:', data) // Debugging log

	if (data?.data?.createCompany !== true) {
		throw new Error(`Unexpected response structure: ${JSON.stringify(data)}`)
	}

	return data.data.createCompany // Returns `true` if company creation was successful
}

export async function forgotPassword(
	request: APIRequestContext,
	email: string
) {
	const forgotPasswordQuery = `
      mutation ForgotPassword($email: String!) {
        forgotPassword(forgotpassword: { email: $email })
      }
    `

	const response = await request.post(API_URL, {
		headers: HEADERS,
		data: {
			query: forgotPasswordQuery,
			variables: { email }
		}
	})

	if (response.status() !== 200) {
		throw new Error(`Forgot Password failed with status ${response.status()} - ${await response.text()}`)
	}

	const data = await response.json()
	console.log('Forgot Password API Response:', data) // Debugging log

	if (!data?.data?.forgotPassword) {
		throw new Error(`Unexpected response structure: ${JSON.stringify(data)}`)
	}

	return data.data.forgotPassword
}

export async function confirmPassword(
	request: APIRequestContext,
	email: string,
	confirmationCode: string,
	newPassword: string,
	confirmPassword: string
) {
	const confirmPasswordQuery = `
      mutation ConfirmPassword($email: String!, $confirmationCode: String!, $newPassword: String!, $confirmPassword: String!) {
        confirmPassword(confirmNewPassword: { email: $email, confirmationCode: $confirmationCode, newPassword: $newPassword, confirmPassword: $confirmPassword })
      }
    `
	const response = await request.post(API_URL, {
		headers: HEADERS,
		data: {
			query: confirmPasswordQuery,
			variables: { email, confirmationCode, newPassword, confirmPassword }
		}
	})

	if (response.status() !== 200) {
		throw new Error(`Confirm Password failed with status ${response.status()} - ${await response.text()}`)
	}

	const data = await response.json()
	console.log('Confirm Password API Response:', data) // Debugging log

	if (!data?.data?.confirmPassword) {
		throw new Error(`Unexpected response structure: ${JSON.stringify(data)}`)
	}

	return data.data.confirmPassword
}


export async function getOTPFromEmail(email: string): Promise<string | null> {
	const emailUsername = email.split('@')[0] // Extract username from email
	const browser = await require('playwright').chromium.launch()
	const page: Page = await browser.newPage()

	try {
		console.log(`Opening YOPMail for ${email}...`)
		await page.goto(`https://yopmail.com/en/`)

		// Enter the email in the YOPMail search field
		await page.fill('#login', emailUsername)
		await page.click('button[title="Check Inbox"]')

		// Wait for email list to load
		await page.waitForTimeout(3000)

		// Click the latest email
		const emailIframe = page.frameLocator('#ifmail')
		const emailText = await emailIframe.locator('body').innerText()

		// Extract OTP (Assuming a 6-digit code)
		const otpMatch = emailText.match(/(\d{6})/)
		const otp = otpMatch ? otpMatch[1] : null

		await browser.close()
		return otp
	} catch (error) {
		console.error('Error fetching OTP:', error)
		await browser.close()
		return null
	}
}
