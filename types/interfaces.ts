interface CreateCredentials {
	email: string
	password: string
	confirmPassword: string
}
interface CreateBillingAddress {
	addressLine1: string
	addressLine2: string
	city: string
	state: string
	countryName: string
	zipCode: string
}
interface CompanyValidData {
	companyName: string
	ein: string
	npi: string
	streetAddress1: string
	streetAddress2: string
	city: string
	state: string
	countryName: string
	zipCode: string
	phoneNumber: string
	mobileNumber: string
	websiteAddress: string
	domainAddress: string
	emailAddress: string
}
interface CreditCardAddress {
	creditCardNumber: string
	cvv: string
	expiryMonth: string
	expiryYear: string
  	billingName: string
	billingAddress1: string
	billingAddress2: string
	billingCity: string
	billingState: string
	billingCountry: string
	billingZipCode: string
  	billingEmail: string
	
}

export interface WorkspaceData {
    name: string;
    description: string;
}

export interface SubsidiaryData {
    name: string;
    description: string;
    assignTo: string;
}
interface Page {
  // define the properties of the page object
}

interface MyFixtures {
	generatedEmail: string
	createCredentials: CreateCredentials
	createCompanyValidData: CompanyValidData
	createBillingAddress: CreditCardAddress
	createACHAddress: CreateBillingAddress
	createWorkspaceData: WorkspaceData;
    createSubsidiaryData: SubsidiaryData;
}
export {
	CreateBillingAddress,
	CreateCredentials,
	CompanyValidData,
	CreditCardAddress,
	MyFixtures
}

