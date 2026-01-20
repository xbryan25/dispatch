export function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (!password) {
    return errors;
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number.');
  }

  if (!/[!@#$%^&*(),.?":{}|<>\-_]/.test(password)) {
    errors.push('Password must contain at least one special character.');
  }

  return errors;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
