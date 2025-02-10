export const loginTestData = {
	validCredentials: { email: 'test_41@yopmail.com', password: 'Test@12345' },
	invalidEmail: { email: 'invalid-email', password: 'Password@123' },
	invalidPassword: { email: 'test_41@yopmail.com', password: 'wrongPass' },
	emptyEmail: { email: '', password: 'Test@12345' },
	emptyPassword: { email: 'test@example.com', password: '' },
	shortEmail: { email: 't@m', password: 'Test@' },
	longEmail: { email: 'a'.repeat(243) + '@example.com', password: 'a'.repeat(32) },
	specialCharacters: { email: 'user@exa#mple.com', password: 'p@ssw#ord123!' },
	unicodeCharacters: { email: 'üser@examplé.com', password: 'pässwörd123' },
	leadingTrailingSpaces: { email: '   test_41@yopmail.com   ', password: 'Test@12345' }
}