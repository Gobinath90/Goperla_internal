export const UserDetails = {
    firstName: 'Dorothy',
    lastName: 'Wilson',
    email: 'dorothy.wilson',
    password: 'Am@zing#Grace3401',
    confirmPassword: 'Am@zing#Grace3401'
  } as const

  export const OTP = {
    otp: '123456',
  } as const

  export const CompanyDetails = {
    companyName: 'HealthPointer NHF Group',
    EIN: '96-1712344',
    NPI: '757-555-1212',
    mobileNumber: '276-555-1212',
    phoneNumber: '757-555-1212',
    domain:'testerdomain',
    website: 'https://healthpointernhfgroup.com/'
  } as const
  
export const AddressDetails = {
    addressLine1: '987 Atlantic Avenue',
    addressLine2: 'C/O: HealthPointer NHF Group',
    city: 'Virginia Beach',
    state: 'VA',
    countryName: 'United States of America',
    zipcode: '23451'
  } as const
  
  export const BillingAddress = {
    addressLine1: '512 Hunts Neck Road',
    addressLine2: 'C/O: HealthPointer NHF Group',
    city: 'Poquoson',
    state: 'VA',
    countryName: 'United States of America',
    zipcode: '23362'
  } as const
  
  export const PaymentCard = {
    creditCardNumber: '371449635398431',
    cvv: '1024',
    expiryMonth: '11',
    expiryYear: '29'
  } as const

  export const BasicUserCount = {
    userCount: 10
  } as const
  
  export const WorkspaceDetails = {
    name: 'Workspace Name ',
    description: 'Workspace Description '
}

export const SubsidiaryDetails = {
    name: 'Subsidiary Name ',
    description: 'Subsidiary Description '
}