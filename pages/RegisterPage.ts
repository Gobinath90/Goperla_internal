import { Page, expect, Locator } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    readonly logo: Locator;
    readonly headings: Locator[];
    readonly emailFieldLabel: Locator;
    readonly emailInputField: Locator;
    readonly passwordFieldLabel: Locator;
    readonly passwordInputField: Locator;
    readonly confirmPasswordFieldLabel: Locator;
    readonly confirmPasswordInputField: Locator;
    readonly submitButton: Locator;
    readonly linkedInSignUpButton: Locator;
    readonly emailErrorMessage: Locator;
    readonly passwordErrorMessage: Locator;
    readonly signIn: Locator;
    readonly visibilityIconOn: Locator;
    readonly emailExists: Locator;
    readonly visibilityIconOff: Locator;

  
    constructor(page: Page) {
      this.page = page;
      this.logo = page.getByRole('img', { name: 'logo' });
      this.headings = [
        page.getByText('Perla Helps Long Term Care'),
        page.getByText('Management of Staff'),
        page.getByText('Reduce Costs, Improve'),
        page.getByText('Easily Track & Collect Staff'),
        page.getByText('Securely and Centrally Store'),
        page.getByText('Streamline Background'),
        page.getByRole('heading', { name: 'Automate your compliance' }),
        page.getByRole('heading', { name: 'with Perla' }),
        page.getByRole('heading', { name: 'Sign up with email' }),
      ];
      this.emailFieldLabel = page.getByText('Email', { exact: true });
      this.emailInputField = page.locator('input[name="email"]');

      this.passwordFieldLabel = page.getByText('Password', { exact: true });
      this.passwordInputField = page.locator('input[name="password"]');

      this.confirmPasswordFieldLabel = page.getByText('Confirm Password');
      this.confirmPasswordInputField = page.locator('input[name="confirmPassword"]');

      this.submitButton = page.getByRole('button', { name: 'Submit' });
      this.linkedInSignUpButton = page.getByRole('button', { name: 'Sign Up with LinkedIn' });
      this.passwordErrorMessage = page.locator('form');
      this.emailErrorMessage = page.locator('form');

      this.signIn= page.getByRole('link', { name: 'Sign In' });
      this.emailExists= page.getByText('A user with this email already exists');

    }

    async fillSignUpForm(email: string, password: string, confirmPassword: string) {
      await this.emailInputField.fill(email);
      await this.passwordInputField.fill(password);
      await this.confirmPasswordInputField.fill(confirmPassword);
    }
  
    async submitForm() {
      await this.submitButton.click();
    }
  }