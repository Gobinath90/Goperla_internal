export const signupTestData = {
    invalidEmail: { email: 'invalid-email' },
    only: { email: 'invalid-email', password: 'Test@12345' },
    passwordMismatch: { email: 'test@example.com', password: 'Test@12345', confirmPassword: 'Test@54321' },
    existingEmail: { email: 'test_41@yopmail.com', password: 'Test@12345' },
    long: { email: 'a'.repeat(243) + '@example.com', password: 'a'.repeat(33) },
    short: { email: 't@m', password: 'Test@' }
}
