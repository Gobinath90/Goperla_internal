import { test, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { sigupDetails, companyDetails} from "../fixture/apidata";

let uuid: string;
let accessToken: string;

test.describe('User Sign Up and Resend APi and Confirmation API', () => {

  test('User Signup', async ({ request }) => {
    if (uuid) return;

    const module = "string";

    const signUpMutation = `
      mutation {
        signUpUser(email: "${sigupDetails.email}", password: "${sigupDetails.password}", module: "${module}") {
          uuid
          email
        }
      }
    `;
    Logger.info('✅ signUpMutation has been added successfully.');
    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: signUpMutation }
    });


    expect(response.status()).toBe(200);
    const data = await response.json();
    Logger.pass('✔ SignUp Response is verified successfully.');
    uuid = data.data.signUpUser.uuid;
  });

  test('should resend OTP successfully', async ({ request }) => {
    const mutation = `
      mutation {
        resendConfirmationCode(uuid: "${uuid}")
      }
    `;
    Logger.info('✅ Mutation has been added successfully.');
    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });

    expect(response.status()).toBe(200);
    const responseData = await response.json();
    Logger.pass('✔ Resend OTP Response is verified successfully.');
    expect(responseData).toHaveProperty('data');
    expect(responseData.data).toHaveProperty('resendConfirmationCode');
    expect(responseData.data.resendConfirmationCode).toBe(true);
  });

  test('Confirm user signup successfully', async ({ request }) => {
    // expect(uuid).toBeDefined();
    const mutation = `
      mutation {
        confirmSignUp(uuid: "${uuid}", confirmationCode: "${sigupDetails.confirmationCode}")
      }
    `;
    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });

    expect(response.status()).toBe(200);

    const responseData = await response.json();
    console.log("Confirm SignUp Response:", responseData);

    expect(responseData).toHaveProperty('data');
    expect(responseData.data).toHaveProperty('confirmSignUp');
    expect(responseData.data.confirmSignUp).toBe(true);
  });
});

// test.describe('User Sign Up and Confirmation API', () => {
//     test.beforeEach(async ({ request }) => {
//     if (uuid) return;
//     const module = "string";

//     const mutation = `
//       mutation {
//         signUpUser(email: "${email}", password: "${password}", module: "${module}") {
//           uuid
//           email
//         }
//       }
//     `;

//     const response = await request.post(url, {
//       headers: { 'Content-Type': 'application/json' },
//       data: { query: mutation }
//     });

//     expect(response.status()).toBe(200);

//     const data = await response.json();
//     console.log("SignUp Response:", data);

//     expect(data.data).not.toBeNull();
//     expect(data.data.signUpUser).not.toBeNull();
//     expect(data.data.signUpUser.uuid).not.toBeNull();
//     expect(data.data.signUpUser.email).toBe(email);

//     uuid = data.data.signUpUser.uuid;
//   });

//   test('Confirm user signup successfully', async ({ request }) => {
//     expect(uuid).toBeDefined();
//     const mutation = `
//       mutation {
//         confirmSignUp(uuid: "${uuid}", confirmationCode: "${confirmationCode}")
//       }
//     `;
//     const response = await request.post(url, {
//       headers: { 'Content-Type': 'application/json' },
//       data: { query: mutation }
//     });

//     expect(response.status()).toBe(200);

//     const responseData = await response.json();
//     console.log("Confirm SignUp Response:", responseData);

//     expect(responseData).toHaveProperty('data');
//     expect(responseData.data).toHaveProperty('confirmSignUp');
//     expect(responseData.data.confirmSignUp).toBe(true);
//   });
// });

test.describe('User Sign In API and Logout API', () => {
  test.beforeEach(async ({ request }) => {

    const module = "string";
    const signInMutation = `
      mutation {
        signInUser(email: "${sigupDetails.email}", password: "${sigupDetails.password}",  module: "${module}"){
          accessToken
          refreshToken
          sessionToken
          email
          userId
          role
          roleId
          isPaid
          isEntity
          success
        }
      }
    `;
    Logger.info('✅ signInMutation has been added successfully.');
    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: signInMutation }
    });

    expect(response.status()).toBe(200);
    const responseData = await response.json();
    Logger.pass('✔ SignIn Response is verified successfully.');
    accessToken = responseData.data.signInUser.accessToken;
    expect(accessToken).not.toBeNull();
  });

  test('should log out successfully', async ({ request }) => {
    const mutation = `
      mutation {
        logoutUser(accessToken: "${accessToken}")
      }
    `;

    // Step 1: Send the GraphQL mutation using Playwright's request API
    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });

    // Step 2: Verify the response status
    expect(response.status()).toBe(200);

    // Step 3: Parse the response data
    const responseData = await response.json();
    console.log("Logout Response:", responseData);

    // Step 4: Validate response structure and values
    expect(responseData).toHaveProperty('data');
    expect(responseData.data).toHaveProperty('logoutUser');
    expect(responseData.data.logoutUser).toBe(true);
  });
});

test.describe('Forgot Password and Confirm New Password API', () => {
  test('should trigger forgot password successfully', async ({ request }) => {
    const mutation = `
      mutation {
        forgotPassword(email: "${sigupDetails.email}")
      }
    `;
    Logger.info('✅ Mutation has been added successfully.');
    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });
    expect(response.status()).toBe(200);
    const responseData = await response.json();
    Logger.pass('✔ Forgot Password Response is verified successfully.');
    expect(responseData).toHaveProperty('data');
    expect(responseData.data).toHaveProperty('forgotPassword');
    expect(responseData.data.forgotPassword).toBe(true);
  });

  test('should confirm new password successfully', async ({ request }) => {
    const mutation = `
      mutation {
        confirmNewPassword(
          email: "${sigupDetails.email}"
          confirmationCode: "${sigupDetails.confirmationCode}"
          newPassword: "${sigupDetails.newPassword}"
          confirmPassword: "${sigupDetails.confirmPassword}"
        )
      }
    `;
    Logger.info('✅ ConfirmNewPassword Mutation has been added successfully.');
    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });

    expect(response.status()).toBe(200);
    const responseData = await response.json();
    Logger.pass('✔ Confirm New Password Response is verified successfully.');
    expect(responseData).toHaveProperty('data');
    expect(responseData.data).toHaveProperty('confirmNewPassword');
    expect(responseData.data.confirmNewPassword).toBe(true);
  });
});

test.describe('User Sign In API with New password and Logout API', () => {
  test.beforeEach(async ({ request }) => {

    const module = "string";
    const signInMutation = `
      mutation {
        signInUser(email: "${sigupDetails.email}", password: "${sigupDetails.confirmPassword}",  module: "${module}"){
          accessToken
          refreshToken
          sessionToken
          email
          userId
          role
          roleId
          isPaid
          isEntity
          success
        }
      }
    `;

    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: signInMutation }
    });

    expect(response.status()).toBe(200);
    const responseData = await response.json();
    console.log("SignIn Response", responseData)
    accessToken = responseData.data.signInUser.accessToken;
    expect(accessToken).not.toBeNull();
  });

  test('log out', async ({ request }) => {
    const mutation = `
      mutation {
        logoutUser(accessToken: "${accessToken}")
      }
    `;

    // Step 1: Send the GraphQL mutation using Playwright's request API
    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });

    // Step 2: Verify the response status
    expect(response.status()).toBe(200);

    // Step 3: Parse the response data
    const responseData = await response.json();
    console.log("Logout Response:", responseData);

    // Step 4: Validate response structure and values
    expect(responseData).toHaveProperty('data');
    expect(responseData.data).toHaveProperty('logoutUser');
    expect(responseData.data.logoutUser).toBe(true);
  });
});

test.describe('GraphQL API Automation - Create Company', () => {

  test.beforeEach(async ({ request }) => {
    if (uuid) return;
    const module = "string";

    const mutation = `
          mutation {
            signUpUser(email: "${sigupDetails.email}", password: "${sigupDetails.password}", module: "${module}") {
              uuid
              email
            }
          }
        `;
    Logger.info('✅ Mutation has been added successfully.');
    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    Logger.pass('✔ SignUp Response is verified successfully.');
    expect(data.data).not.toBeNull();
    expect(data.data.signUpUser).not.toBeNull();
    expect(data.data.signUpUser.uuid).not.toBeNull();
    expect(data.data.signUpUser.email).toBe(sigupDetails.email);
    uuid = data.data.signUpUser.uuid;
  });

  test('Confirm user signup successfully and create company', async ({ request }) => {
    expect(uuid).toBeDefined();
    const mutation = `
          mutation {
            confirmSignUp(uuid: "${uuid}", confirmationCode: "${sigupDetails.confirmationCode}")
          }`;
    Logger.info('✅ Mutation has been added successfully.');
    const response = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });

    expect(response.status()).toBe(200);
    const responseData = await response.json();
    Logger.pass('✔ Confirm SignUp Response is verified successfully.');
    expect(responseData).toHaveProperty('data');
    expect(responseData.data).toHaveProperty('confirmSignUp');
    expect(responseData.data.confirmSignUp).toBe(true);

    const createCompanyMutation = `
    mutation {
    createCompany(
    companyName: "${companyDetails.companyName}"
    ein: ${companyDetails.ein}
    npi: ${companyDetails.npi}
    domain: "${companyDetails.domain}"
    streetAddress1: "${companyDetails.streetAddress1}"
    streetAddress2: "${companyDetails.streetAddress2}"
    city: "${companyDetails.city}"
    state: "${companyDetails.state}"
    country: "${companyDetails.country}"
    zipCode: "${companyDetails.zipCode}"
    email: "${sigupDetails.email}"
    phoneNumber: "${companyDetails.phoneNumber}"
    mobileNumber: "${companyDetails.mobileNumber}"
    websiteAddress: "${companyDetails.websiteAddress}"
    authorizeSMS: ${companyDetails.authorizeSMS}
    userId: "${uuid}"
  )
}`;
    Logger.info('✅ CreateCompanyMutation has been added successfully.');
    const response2 = await request.post(sigupDetails.url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: createCompanyMutation }
    });

    expect(response2.status()).toBe(200);
    const responseBody = await response2.json();
    Logger.pass('✔ Create Company Response is verified successfully.');
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('createCompany');
    expect(responseBody.data.createCompany).toBe(true);
  });



});

test.describe('GraphQL API Automation - Get All Products', () => {

  test('should fetch all products successfully and validate response structure', async ({ request }) => {
    
    const query = `
      query {
        getAllProducts {
          id
          plan_name
          price_id
          recurring_type
          user_count
          fee
          location
          additional_location
          storage
          check_service
          efficiency
          revenue
          compliance
          risk
        }
      }
    `;
    Logger.info('✅ Query has been added successfully.');
    const response = await request.post(sigupDetails.url, {
      headers: {'Content-Type': 'application/json'},
      data: { query: query }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    Logger.pass('✔ Get All Products Response is verified successfully.');
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('getAllProducts');
    expect(Array.isArray(responseBody.data.getAllProducts)).toBe(true);
    responseBody.data.getAllProducts.forEach((product: any) => {
      expect(product).toHaveProperty('id');
      expect(typeof product.id).toBe('number');

      expect(product).toHaveProperty('plan_name');
      expect(typeof product.plan_name).toBe('string');

      expect(product).toHaveProperty('price_id');
      expect(typeof product.price_id).toBe('string');

      expect(product).toHaveProperty('recurring_type');
      expect(typeof product.recurring_type).toBe('string');

      expect(product).toHaveProperty('user_count');
      expect(typeof product.user_count).toBe('number');

      expect(product).toHaveProperty('fee');
      expect(typeof product.fee).toBe('number');

      expect(product).toHaveProperty('location');
      expect(typeof product.location).toBe('number');

      expect(product).toHaveProperty('additional_location');
      expect(typeof product.additional_location).toBe('number');

      expect(product).toHaveProperty('storage');
      expect(typeof product.storage).toBe('number');

      expect(product).toHaveProperty('check_service');
      expect(typeof product.check_service).toBe('string');

      expect(product).toHaveProperty('efficiency');
      expect(product.efficiency === null || typeof product.efficiency === 'string').toBe(true);

      expect(product).toHaveProperty('revenue');
      expect(typeof product.revenue).toBe('boolean');

      expect(product).toHaveProperty('compliance');
      expect(typeof product.compliance).toBe('boolean');

      expect(product).toHaveProperty('risk');
      expect(typeof product.risk).toBe('boolean');
    });

  });

});


