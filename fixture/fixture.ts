import { test as base } from '@playwright/test'
import {
	UserDetails,
	AddressDetails,
	CompanyDetails,
	PaymentCard
} from '../fixture/testdata'
import { getOrCreateCounter } from '../utils/counter'
import {
	MyFixtures,
	CreateCredentials,
	CompanyValidData,
	CreditCardAddress
} from '../types/interfaces'

export const test = base.extend<MyFixtures>({
	generatedEmail: [
		async ({}, use) => {
			const counter = getOrCreateCounter()
			//const email = `dorothy.wilson+${counter}@healthPointerGroup.com`
			const email = `gp2_test+${counter}@twilightitsolutions.com`
			await use(email)
		},
		{ scope: 'test' }
	],

	createCredentials: [
		async ({ generatedEmail }, use) => {
			const credentials: CreateCredentials = {
				email: generatedEmail,
				password: UserDetails.password,
				confirmPassword: UserDetails.confirmPassword
			}
			await use(credentials)
		},
		{ scope: 'test' }
	],
  
	createBillingAddress: [
		async ({ generatedEmail }, use) => {
			const counter = generatedEmail.match(/\+(\d+)@/)?.[1] || '1' // Removed comma
			const billingAddress: CreditCardAddress = {
				creditCardNumber: PaymentCard.creditCardNumber,
				cvv: PaymentCard.cvv,
				expiryMonth: PaymentCard.expiryMonth,
				expiryYear: PaymentCard.expiryYear,
				billingAddress1: AddressDetails.addressLine1,
				billingAddress2: AddressDetails.addressLine2,
				billingCity: AddressDetails.city,
				billingState: AddressDetails.state,
				billingCountry: AddressDetails.countryName,
				billingZipCode: AddressDetails.zipcode,
				billingName: `${UserDetails.firstName} ${UserDetails.lastName}`,
				billingEmail: generatedEmail,
			}
			await use(billingAddress)
		},
		{ scope: 'test' }
	],

	createCompanyValidData: [
		async ({ generatedEmail }, use) => {
			const counter = generatedEmail.match(/\+(\d+)@/)?.[1] || '1' // Removed comma
			const companyData: CompanyValidData = {
				companyName: CompanyDetails.companyName,
				ein: CompanyDetails.EIN,
				npi: CompanyDetails.NPI,
				streetAddress1: AddressDetails.addressLine1,
				streetAddress2: AddressDetails.addressLine2,
				city: AddressDetails.city,
				state: AddressDetails.state,
				countryName: AddressDetails.countryName,
				zipCode: AddressDetails.zipcode,
				emailAddress: generatedEmail,
				phoneNumber: CompanyDetails.phoneNumber,
				mobileNumber: CompanyDetails.mobileNumber,
				domainAddress: `${CompanyDetails.companyName} ${counter}`,
				websiteAddress: `https://healthpointernhfgroup${counter}.com/`
			}

			await use(companyData)
		},
		{ scope: 'test' }
	],

	
})
