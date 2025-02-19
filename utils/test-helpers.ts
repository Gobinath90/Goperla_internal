import { test, expect, Page } from '@playwright/test';
import { Logger } from '../utils/logger';

export const verifyVisibility = async (element, description, timeout = 5000) => {
  await test.step(`Verify visibility of ${description}`, async () => {
    Logger.info(`⏳ Checking visibility of ${description}...`);
    await expect(element).toBeVisible({ timeout });
    Logger.pass(`✅ ${description} is visible.`);
  });
};

export async function verifyErrorMessage(element, expectedText) {
  await test.step(`Verify error message: ${expectedText}`, async () => {
    Logger.info(`⏳ Checking if the error message matches: "${expectedText}"`);
    await expect(element).toContainText(expectedText);
    Logger.pass(`✅ Error message verified successfully: "${expectedText}"`);
  });
};

export async function togglePasswordVisibility(loginPage, expectedType, toggleButton) {
  await test.step(`Toggle password visibility to ${expectedType}`, async () => {
    Logger.info(`⏳ Toggling password visibility to "${expectedType}"...`);
    await toggleButton.click();
    await expect(loginPage.passwordInputField).toHaveAttribute('type', expectedType);
    Logger.pass(`✅ Password visibility set to"${expectedType}".`);
  });
};

export async function togglePassword(signUpPage, expectedType: string, toggleButton) {
  await test.step(`Toggle password visibility to ${expectedType}`, async () => {
    Logger.info(`⏳ Toggled password visibility to ${expectedType}`);  
    await toggleButton.click();
      const inputFieldType = await toggleButton.evaluate((btn) =>
          btn.closest('form').querySelector('input[type="password"], input[type="text"]')?.getAttribute('type')
      );
      expect(inputFieldType).toBe(expectedType);
  });
}


export async function verifyNavigation(link, page, baseURL, expectedPath, description) {
  await test.step(`Verify navigation to ${description}`, async () => {
    console.log(baseURL)
    Logger.info(`⏳ Navigating to ${description}...`);
    await link.click();
    await page.waitForLoadState('networkidle');
    const expectedURL = `${baseURL}${expectedPath}`;
    const currentURL = page.url();
    expect(currentURL).toBe(expectedURL);
    Logger.pass(`✅ Navigation successful: ${description}`);
  });
};

export async function performLogin(loginPage, email, password, description) {
  await test.step(description, async () => {
    Logger.info(`=== ${description} ===`);
    Logger.info(`Email to fill: ${email || '(not provided)'}`);

    if (email) {
      await loginPage.emailInputField.fill(email);
      Logger.pass('✅ Email field filled successfully : ' + email);
    } else {
      Logger.skipped('⏳ Skipping email field as no email was provided.');
    }
    
    Logger.info(`Password to fill: ${password ? '(hidden for security)' : '(not provided)'}`);
    if (password) {
      await loginPage.passwordInputField.fill(password);
      Logger.pass('✅ Password field filled successfully : ' + password);
    } else {
      Logger.skipped('⏳ Skipping password field as no password was provided.');
    }
  });

  await test.step('Click the sign-in button', async () => {
    Logger.info(`⏳ Submitting login form...`);
    await loginPage.signInButton.click();
    Logger.pass(`✅ Login form submitted`);
  });
};


export async function performLogout(loginPage) {
  await test.step('Perform logout sequence', async () => {
      Logger.info('⏳ Initiating logout process...');
      
      await test.step('Click profile icon', async () => {
          Logger.info('⏳ Clicking profile icon');
          await loginPage.profile.click();
          Logger.pass('✅ Profile icon clicked');
      });

      await test.step('Click logout button', async () => {
          Logger.info('⏳ Clicking logout button');
          await loginPage.logout.click();
          Logger.pass('✅ Logout completed successfully');
      });
  });
}

export async function fillAndSubmitForm(signUpPage, { email, password, confirmPassword }: { email?: string; password?: string; confirmPassword?: string }) {
  await test.step('Fill signup form', async () => {
    Logger.info(`⏳ Starting form fill process`);
      // Email field handling
      Logger.info(`Email to fill: ${email || '(not provided)'}`);
      if (email) {
          await signUpPage.emailInputField.fill(email);
          Logger.pass(`✅ Email entered: ${email}`);
        } else {
          Logger.warn(`⏳ Email field skipped`);
      }

      // Password field handling
      Logger.info(`Password to fill: ${password ? '(hidden for security)' : '(not provided)'}`);
      if (password) {
          await signUpPage.passwordInputField.fill(password);
          Logger.pass(`✅ Password entered: ${password}`);
        } else {
          Logger.warn(`⏳ Password field skipped`);
        }

      // Confirm Password field handling
      Logger.info(`Confirm Password to fill: ${confirmPassword ? '(hidden for security)' : '(not provided)'}`);
      if (confirmPassword) {
          await signUpPage.confirmPasswordInputField.fill(confirmPassword);
          Logger.pass(`✅ Confirm password entered`);
        } else {
          Logger.warn(`⚠️ Confirm password field skipped`);
        }
  });

  await test.step('Submit the signup form', async () => {
    Logger.info(`⏳ Submitting signup form...`);
    await signUpPage.submitForm();
    Logger.pass(`✅ Form submitted successfully`);
  });
}

export const fillOtp = async (page, otp) => {
  await test.step('Fill OTP', async () => {
    Logger.info(`⏳ Entering OTP...`);
    for (let i = 0; i < otp.length; i++) {
      await page.getByLabel(`Please enter OTP character ${i + 1}`).fill(otp[i]);
    }
    Logger.pass(`✅ OTP entered successfully`);
  });
};

export const verifyEleVisibility = async (page, elements, role) => {
  await test.step(`Verify ${role} elements visibility`, async () => {
      for (const element of elements) {
          Logger.info(`⏳ Checking ${role}: "${element}"`);
          await page.waitForSelector(`text=${element}`, { timeout: 15000 });
          await expect.soft(page.getByRole(role, { name: element })).toBeVisible();
          Logger.pass(`✅ "${element}" ${role} is visible`);
      }
  });
};

export const verifyTextVisibility = async (page, texts) => {
  await test.step('Verify text visibility', async () => {
      for (const text of texts) {
          Logger.info(`⏳ Checking text: "${text}"`);
          await expect(page.getByText(text, { exact: true })).toBeVisible();
          Logger.pass(`✅ Text "${text}" is visible`);
      }
  });
};

export const clickElementsByRole = async (page, elements, role) => {
  await test.step(`Verify ${role} elements Clicked`, async () => {
      for (const element of elements) {
          await page.getByRole(role, { name: element }).click();
          Logger.pass(`✅ ${role} "${element}" is Clicked`);
      }
  });
};

export const clickTexts = async (page, texts) => {
  await test.step('Verify text Clicked', async () => {
      for (const text of texts) {
          await page.getByText(text, { exact: true }).click();
          Logger.pass(`✅ Text "${text}" is Clicked`);
      }
  });
};

export async function fillCompanyData(page, CreateCompanyValidData) {
  const companyInformation = page.getByText('Company Information');
  if(companyInformation.isVisible){
    try {
      Logger.info('⏳ Filling Company Information...');
    await page.getByText('Company Information').isVisible();
    await page.getByPlaceholder('Enter Company Name').fill(CreateCompanyValidData.companyName);
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Enter EIN/FEIN').fill(CreateCompanyValidData.ein);
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Enter NPI No.').fill(CreateCompanyValidData.npi);
    await page.waitForTimeout(1000);
    await page.locator('#domain').fill(CreateCompanyValidData.domain);
    await page.waitForTimeout(1000);
    //await page.getByPlaceholder('Enter Website address').fill(CreateCompanyValidData.website);
    //await page.waitForTimeout(1000);
    Logger.pass('✅ Company Information filled successfully');
    } catch (error) {
      Logger.error(`Error while filling on Company Information: ${error}`);
    }
    
  }

  const contactInformation = page.getByText('Contact Information');
  if(contactInformation.isVisible){
    try {
      Logger.info('⏳ Filling Contact Information...');
    await page.getByPlaceholder('Enter Street Address 1').fill(CreateCompanyValidData.streetAddress1);
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Enter Street Address 2').fill(CreateCompanyValidData.streetAddress2);
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Enter City').fill(CreateCompanyValidData.city);
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Enter State').fill(CreateCompanyValidData.state);
    await page.waitForTimeout(1000);
    // await page.getByPlaceholder('Enter Country').fill(CreateCompanyValidData.countryName);
    // await page.waitForTimeout(1000);
    await page.getByPlaceholder('Enter Zip Code').fill(CreateCompanyValidData.zipCode);
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Enter Phone Number').fill(CreateCompanyValidData.phoneNumber);
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Enter Mobile Number').fill(CreateCompanyValidData.mobileNumber);
    await page.waitForTimeout(1000);
    Logger.pass('✅ Contact Information filled successfully');
    } catch (error) {
      Logger.error(`Error while filling on Contact Information: ${error}`);
    }
    
  }

  
}

export async function filladdressDetails(page, addressDetails) {
  try {
  await page.locator('input[name="addressLine1"]').fill(addressDetails.addressLine1);
  await page.locator('input[name="city"]').fill(addressDetails.city);
  await page.locator('input[name="zipCode"]').fill(addressDetails.zipcode);
  await page.getByRole('combobox').first().click();
  await page.waitForTimeout(2000);
  // await page.getByRole('option', { name: 'US' }).click();
  // await page.waitForTimeout(2000);
  await page.getByRole('combobox').nth(1).click();
  await page.waitForTimeout(2000);
  await page.getByRole('option', { name: 'Virginia(VA)' }).click();
  Logger.pass('✅ Address Details filled successfully');
  } catch (error) {
    Logger.error(`Error while filling on Address Details: ${error}`);
    
  }
  
}

export async function fillCardDetails(page: Page, cardName: string, cardNumber: string, expiryDate: string, cvc: string) {
try {
  await page.locator('input[name="cardholderName"]').fill(cardName);
  // Wait for the iframe to be visible
  const iframeLocator = page.locator('iframe[name*="__privateStripeFrame"]');
  await iframeLocator.first().waitFor({ state: 'visible', timeout: 50000 });
  // Define field placeholders in order
  const placeholders = ['1234 1234 1234 1234', 'MM / YY', 'CVC'];
  const values = [cardNumber, expiryDate, cvc];
  // Loop through each iframe and fill the respective field
  for (let i = 0; i < placeholders.length; i++) {
    const frame = await iframeLocator.nth(i).contentFrame();
    await frame?.getByPlaceholder(placeholders[i]).fill(values[i]);
    await page.waitForTimeout(2000);
  }
} catch (error) {
  Logger.error(`Error while filling on Card Details: ${error}`);
}

  
}


export async function login(page, sharedEmail, createCredentials, domain) {
  await test.step('Login to application', async () => {
  Logger.info('Starting login process');
  const url = `https://${domain}.qa.goperla.com/`;
  await page.goto(url);
  await page.getByPlaceholder('Enter your email').fill(sharedEmail);
  await page.getByPlaceholder('Enter your Password').fill(createCredentials.password);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();  
  await test.expect(page.getByText('Signed in successfully!')).toBeVisible();
  Logger.info('Login completed successfully');
});

}

export async function verifyNavigationButtons(page) {
  await test.step('Verify navigation elements', async () => {
    Logger.info('Verifying navigation buttons');

  const navButtons = ['Home', 'Workspaces', 'Users', 'Documents', 'Settings'];
  for (const button of navButtons) {
      await test.expect(page.getByRole('button', { name: button })).toBeVisible();
  }
  await page.waitForTimeout(1000);
  Logger.info('Navigation verification completed');
    });
}

export async function createWorkspace(page, data) {
  await test.step('Create new workspace', async () => {
  Logger.info(`Creating workspace: ${data.name}`);
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('menuitem', { name: 'Create Workspace' }).click();
  await page.getByPlaceholder('Enter Workspace Name').fill(data.name);
  await page.getByPlaceholder('Select user').click();
  await page.getByRole('listbox').click();
  await page.getByPlaceholder('Enter Description').fill(data.description);
  await page.getByRole('button', { name: 'Create' }).click();
  await test.expect(page.getByText('Workspace created successfully')).toBeVisible();
  await page.waitForTimeout(2000);
  await test.expect(page.getByRole('button', { name: `workspace-icon    ${data.name}` })).toBeVisible();
  await page.waitForTimeout(2000);
  Logger.info('Workspace created successfully');
});
}

export async function createSubsidiary(page, data) {
  await test.step('Create new subsidiary', async () => {
      Logger.info(`Creating subsidiary: ${data.name}`);
      await page.getByRole('button', { name: 'Create' }).click();
      await page.getByRole('menuitem', { name: 'Create Subsidiary' }).click();
      await page.getByPlaceholder('Enter Subsidiary Name').fill(data.name);
      await page.getByLabel('Assign Subsidiary').click();
      await page.getByRole('option', { name: data.assignTo }).click();
      await page.getByPlaceholder('Enter Description').fill(data.description);
      await page.getByRole('button', { name: 'Create' }).click();
      await test.expect(page.getByText('Subsidiary created')).toBeVisible();
      Logger.info('Subsidiary created successfully');
  });
}

export async function editWorkspace(page, workspaceName) {
  await test.step('Edit workspace', async () => {
      Logger.info(`Editing workspace: ${workspaceName}`);
      const workspaceButton = page.getByRole('button', { name: `workspace-icon    ${workspaceName}` });
      await workspaceButton.hover();
      await workspaceButton.getByRole('button').first().click();
      await page.getByRole('menuitem', { name: 'edit Edit' }).click();
      await page.getByPlaceholder('Enter Workspace Name').fill(`${workspaceName}a`);
      await page.getByRole('button', { name: 'Update' }).click();
      Logger.info('Workspace edited successfully');
  });
}


export async function logout(page) {
  await test.step('Logout from application', async () => {
      Logger.info('Starting logout process');
      await page.locator('[id="\\:rd\\:"]').click();
      await page.getByText('Logout').click();
      await test.expect(page.getByText('Logged out successfully!')).toBeVisible();
      Logger.info('Logout completed successfully');
  });
}

export async function testModalInteractions(page) {
  await test.step('Test modal interactions', async () => {
      Logger.info('Testing modal interactions');
      await openAndCloseModal(page, 'Create Workspace');
      await openAndCloseModal(page, 'Create Subsidiary');
      Logger.info('Modal interactions completed');
  });
}

export async function openAndCloseModal(page, modalType: string) {
  await test.step(`Test ${modalType} modal`, async () => {
      Logger.info(`Opening ${modalType} modal`);
      await page.getByRole('button', { name: 'Create' }).click();
      await page.getByRole('menuitem', { name: modalType }).click();
      
      Logger.info('Verifying modal content');
      await test.expect(page.getByRole('heading', { name: modalType })).toBeVisible();
      await page.waitForTimeout(2000);
      
      Logger.info('Closing modal');
      await page.getByTestId('close-button').click();
      await page.waitForTimeout(2000);
      Logger.info(`${modalType} modal test completed`);
  });
}