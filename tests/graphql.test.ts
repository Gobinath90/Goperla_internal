import { test, expect } from '@playwright/test';

// Global variables
let uuid: string;
let accessToken: string;
const email = "peru5018@yopmail.com";
const password = "SmartWork@123";
const newPassword = "SmartWork@12345";
const confirmPassword = "SmartWork@12345";
const confirmationCode = "123456";
// const url = "http://18.212.198.138:5001/graphql";

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

test.describe('User Sign In API and Logout API', () => {
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
    const responseData = await response.json();
    console.log("SignIn Response", responseData)
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

test.describe('Forgot Password and Confirm New Password API', () => {
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

test.describe('User Sign In API with New password and Logout API', () => {
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


//Create Workspace:
let workspaceName = 'workspaceR5';
let storedWorkspaceId;
let description = 'user only';
// let kind = WORKSPACE;
let parent = null;
let managers = ['67c03a9d83bff9dac823f7d0'];
const url = 'https://api.qa.goperla.com/graphql';
const authToken = `eyJraWQiOiJSdVpUQUJuZVdrWkZ2QW1TTDNuT1lGYVYrNTIwanR0WnA4TnJUVFwvcEpsYz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3NDg4YzQ4OC1jMDYxLTcwZDEtNDgzZS03OWI3MTAzZDFkNDQiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzNkYjhlOTZiLWE5Y2QtNDYzZS1iOWQ4LWY4MGI5YmM4MTViZCIsImNvZ25pdG86Z3JvdXBzIjpbImJlMWU3NWFkLTg1Y2ItNDBmNS04N2JlLWZmYTM2MTY5ZDZmZCJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9HQXZ6cWtiUjYiLCJjbGllbnRfaWQiOiI0Y2Z1YnA1dWZhODBnOWJlbjF0Z3Y0bG0xdCIsIm9yaWdpbl9qdGkiOiIxNDEwYjUzZS1mY2Y5LTQwMGItYWJjOS1jYWU3ZGNmZGU2MjQiLCJjdXN0b206dGVuYW50SWQiOiJiZTFlNzVhZC04NWNiLTQwZjUtODdiZS1mZmEzNjE2OWQ2ZmQiLCJldmVudF9pZCI6Ijk5MDk2N2IyLTRjODEtNDhmMi1iNGFhLTA5NTJkYjI1MTZmMiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NDA2NTExODcsImN1c3RvbTpjb21wYW55TmFtZSI6ImZkc2Zkc2ZkZmRmIiwiZXhwIjoxNzQwNjU0Nzg1LCJjdXN0b206cm9sZSI6IlN1cGVyQWRtaW4iLCJpYXQiOjE3NDA2NTExODcsImp0aSI6Ijk1MGVjOGZkLWQzMzMtNDQ5NS1hN2ZjLWFiYTMwZjk1MWExNiIsInVzZXJuYW1lIjoiYjFhYmVlNGItZTJmNi00N2JhLWJiMjYtYTQxYzRiZTExZjc4In0.NWjut3_eiKf_Orp0vkA6D0Goq_zwxTLzsLdsAxzDzWS7jC8TbhomvSUMGMReSWR1HhLoHdgO1IO8PUW_X0kgUfp_Q0-kGk_-_ch0UoNZR9ltjE0g94562aUiLQ-nkSwmIvBvwLpRYLOhYGvX4YMDK-FYyJLYB7GFDInjzRgExzMKF9Aw4ft4n7I42zKfwZC6oyb2jhsFBdMZJvCXMNKIu9KMgVVwoqibe6GacZuIWhKO1GfwguU_f0-pBd1eIv3DayJVd8uveUVD-Nsar5XD9L00mIbKYDaEFsNnFV3_eAs8hm7Bb_wU864xCJAvFcfYq6rQNVV-SWdgTiYg9ybBPA`;

//Create Workspace:
test.describe('GraphQL Workspace Tests', () => {

  test('create workspace', async ({ page }) => {
    const createWorkspaceMutation = `
          mutation CreateWorkspace($name: String!, $kind: String!, $description: String!, $parent: ID, $managers: [ID!]!) {
              createWorkspace(
                  input: {
                      name: $name
                      kind: $kind
                      description: $description
                      parent: $parent
                      managers: $managers
                  }
              ) {
                  _id
                  name
                  kind
                  description
                  parent
                  managers
                  createdAt
                  updatedAt
                  deletedAt
              }
          }
      `;

    const variables = {
      name: workspaceName,
      kind: WORKSPACE,
      description: description,
      parent: parent,
      managers: managers
    };

    // Step 1: Send the GraphQL mutation request
    const response = await page.request.post(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      data: JSON.stringify({ query: createWorkspaceMutation, variables })
    });

    // Step 2: Verify the response status
    expect(response.status()).toBe(200);

    // Step 3: Parse the response data
    const data = await response.json();
    console.log('Create Workspace Response:', data);
    // Step 4: Store workspace ID for further tests
    storedWorkspaceId = data.data.createWorkspace._id;
    console.log('Workspace ID:', storedWorkspaceId);

    // Step 5: Validate response structure and values
    expect(data.data.createWorkspace).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        name: workspaceName,
        kind: 'workspace',
        description: description,
        parent: null,
        managers: managers,
        deletedAt: null
      })
    );

    // Step 6: Validate timestamps
    expect(new Date(data.data.createWorkspace.createdAt).toISOString()).toBe(data.data.createWorkspace.createdAt);
    expect(new Date(data.data.createWorkspace.updatedAt).toISOString()).toBe(data.data.createWorkspace.updatedAt);
  });

  test('get user lists', async ({ page }) => {
    const getUserListsQuery = `
        query GetUserLists {
            getUserLists {
                _id
                user_id
                f_name
                m_name
                l_name
                email
                createdAt
                updatedAt
                deletedAt
                name
            }
        }
    `;

    // Step 1: Send the GraphQL query request with headers
    const response = await page.request.post(url, {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': authToken
        },
        data: JSON.stringify({ query: getUserListsQuery })
    });

    // Step 2: Verify the response status
    expect(response.status()).toBe(200);

    // Step 3: Parse the response data
    const data = await response.json();
    console.log('Get User Lists Response:', JSON.stringify(data, null, 2));

    // Step 4: Validate response structure and values
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('getUserLists');
    expect(Array.isArray(data.data.getUserLists)).toBe(true);

    if (data.data.getUserLists.length > 0) {
        const firstUser = data.data.getUserLists[0];

        // Validate first user's structure based on actual response
        expect(firstUser).toEqual(
            expect.objectContaining({
                _id: expect.any(String),
                user_id: expect.any(String),
                f_name: expect.any(String),
                m_name: expect.any(String), // Can be an empty string
                l_name: expect.any(String), // Can be an empty string
                // email: expect.stringMatching(/@yopmail\.com$/), // Validate email format
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                // deletedAt: expect.toBeOneOf([null, expect.any(String)]), // deletedAt can be null
                name: expect.any(String),
            })
        );

        // Step 5: Validate timestamps format
        expect(new Date(firstUser.createdAt).toISOString()).toBe(firstUser.createdAt);
        expect(new Date(firstUser.updatedAt).toISOString()).toBe(firstUser.updatedAt);
    } else {
        console.log('No users found in getUserLists response.');
    }
});

});

