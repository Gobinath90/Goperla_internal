import { test as base } from '@playwright/test'
import {
	UserDetails,
	AddressDetails,
	CompanyDetails,
	PaymentCard,
	WorkspaceDetails,
    SubsidiaryDetails,
	BillingAddress
} from '../fixture/testdata'
import { getOrCreateCounter } from '../utils/counter'
import {
	MyFixtures,
	CreateCredentials,
	CompanyValidData,
	CreditCardAddress,
	WorkspaceData,
    SubsidiaryData
} from '../types/interfaces'

export const test = base.extend<MyFixtures>({
	generatedEmail: [
		async ({}, use) => {
			const counter = getOrCreateCounter()
			const email = `dorothy.wilson+000${counter}@healthPointerGroup.com`
			//const email = `gp2_test+000${counter}@twilightitsolutions.com`
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
				billingAddress1: BillingAddress.addressLine1,
				billingAddress2: BillingAddress.addressLine2,
				billingCity: BillingAddress.city,
				billingState: BillingAddress.state,
				billingCountry: BillingAddress.countryName,
				billingZipCode: BillingAddress.zipcode,
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
				domainAddress: `${CompanyDetails.domain}${counter}`,
				websiteAddress: CompanyDetails.website,
			}

			await use(companyData)
		},
		{ scope: 'test' }
	],

	createWorkspaceData: [
        async ({ generatedEmail }, use) => {
            const counter = generatedEmail.match(/\+(\d+)@/)?.[1] || '1'
            const workspaceData: WorkspaceData = {
                name: `${WorkspaceDetails.name}${counter}`,
                description: `${WorkspaceDetails.description}${counter}`
            }
            await use(workspaceData)
        },
        { scope: 'test' }
    ],

    createSubsidiaryData: [
        async ({ generatedEmail, createWorkspaceData }, use) => {
			const counter = generatedEmail.match(/\+(\d+)@/)?.[1] || '1'
            const subsidiaryData: SubsidiaryData = {
                name: `${SubsidiaryDetails.name}${counter}`,
                description: `${SubsidiaryDetails.description}${counter}`,
                assignTo: createWorkspaceData.name
            }
            await use(subsidiaryData)
        },
        { scope: 'test' }
    ]
	
})
