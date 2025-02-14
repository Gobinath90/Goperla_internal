import { test, expect } from '@playwright/test';

// Global variables
let uuid: string;
let accessToken: string;
const email = "peru5018@yopmail.com";
const password = "SmartWork@123";
const newPassword = "SmartWork@12345";
const confirmPassword = "SmartWork@12345";
const confirmationCode = "123456";
const url = "http://18.212.198.138:5001/graphql";

test.describe.skip('User Sign Up and Resend APi and Confirmation API', () => {
  
  test('User Signup', async ({ request }) => {
    if (uuid) return;

    const module = "string";

    const signUpMutation = `
      mutation {
        signUpUser(email: "${email}", password: "${password}", module: "${module}") {
          uuid
          email
        }
      }
    `;

    const response = await request.post(url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: signUpMutation }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log("SignUp Response:", data);
    uuid = data.data.signUpUser.uuid;
  });

  test('should resend OTP successfully', async ({ request }) => {
    const mutation = `
      mutation {
        resendConfirmationCode(uuid: "${uuid}")
      }
    `;

    const response = await request.post(url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });

    expect(response.status()).toBe(200);
    const responseData = await response.json();
    console.log("Resend OTP Response:", responseData);
    expect(responseData).toHaveProperty('data');
    expect(responseData.data).toHaveProperty('resendConfirmationCode');
    expect(responseData.data.resendConfirmationCode).toBe(true);
  });

  test('Confirm user signup successfully', async ({ request }) => {
    // expect(uuid).toBeDefined();
    const mutation = `
      mutation {
        confirmSignUp(uuid: "${uuid}", confirmationCode: "${confirmationCode}")
      }
    `;
    const response = await request.post(url, {
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

test.describe.skip('User Sign In API and Logout API', () => {
  test.beforeEach(async ({ request }) => {

    const module = "string";
    const signInMutation = `
      mutation {
        signInUser(email: "${email}", password: "${password}",  module: "${module}"){
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

    const response = await request.post(url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: signInMutation }
    });

    expect(response.status()).toBe(200);
    const responseData  = await response.json();
    console.log("SignIn Response", responseData )
    accessToken = responseData .data.signInUser.accessToken;
    expect(accessToken).not.toBeNull();
  });

  test('should log out successfully', async ({ request }) => {
    const mutation = `
      mutation {
        logoutUser(accessToken: "${accessToken}")
      }
    `;

    // Step 1: Send the GraphQL mutation using Playwright's request API
    const response = await request.post(url, {
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

test.describe.skip('Forgot Password and Confirm New Password API', () => {
  test('should trigger forgot password successfully', async ({ request }) => {
    const mutation = `
      mutation {
        forgotPassword(email: "${email}")
      }
    `;

    // Step 1: Send the GraphQL mutation using Playwright's request API
    const response = await request.post(url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });

    // Step 2: Verify the response status
    expect(response.status()).toBe(200);

    // Step 3: Parse the response data
    const responseData = await response.json();
    console.log("Forgot Password Response:", responseData);

    // Step 4: Validate response structure and values
    expect(responseData).toHaveProperty('data');
    expect(responseData.data).toHaveProperty('forgotPassword');
    expect(responseData.data.forgotPassword).toBe(true);
  });

  test('should confirm new password successfully', async ({ request }) => {
    const mutation = `
      mutation {
        confirmNewPassword(
          email: "${email}"
          confirmationCode: "${confirmationCode}"
          newPassword: "${newPassword}"
          confirmPassword: "${confirmPassword}"
        )
      }
    `;

    // Step 1: Send the GraphQL mutation using Playwright's request API
    const response = await request.post(url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: mutation }
    });

    // Step 2: Verify the response status
    expect(response.status()).toBe(200);

    // Step 3: Parse the response data
    const responseData = await response.json();
    console.log("Confirm New Password Response:", responseData);

    // Step 4: Validate response structure and values
    expect(responseData).toHaveProperty('data');
    expect(responseData.data).toHaveProperty('confirmNewPassword');
    expect(responseData.data.confirmNewPassword).toBe(true);
  });
});

test.describe.skip('User Sign In API with New password and Logout API', () => {
  test.beforeEach(async ({ request }) => {

    const module = "string";
    const signInMutation = `
      mutation {
        signInUser(email: "${email}", password: "${confirmPassword}",  module: "${module}"){
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

    const response = await request.post(url, {
      headers: { 'Content-Type': 'application/json' },
      data: { query: signInMutation }
    });

    expect(response.status()).toBe(200);
    const responseData  = await response.json();
    console.log("SignIn Response", responseData )
    accessToken = responseData .data.signInUser.accessToken;
    expect(accessToken).not.toBeNull();
  });

  test('log out', async ({ request }) => {
    const mutation = `
      mutation {
        logoutUser(accessToken: "${accessToken}")
      }
    `;

    // Step 1: Send the GraphQL mutation using Playwright's request API
    const response = await request.post(url, {
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

