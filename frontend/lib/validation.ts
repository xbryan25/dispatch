// Shown as a live checklist under the password field. The symbol set matches Supabase's.
export const passwordRules = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'An uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'A number', test: (value: string) => /[0-9]/.test(value) },
  {
    label: 'A symbol, such as ! ? # or -',
    test: (value: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|<>?,./`~]/.test(value),
  },
];

export function isPasswordValid(password: string): boolean {
  return passwordRules.every((rule) => rule.test(password));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export const validateImageFile = (file: File) => {
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a valid image (JPEG, PNG, WEBP).',
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`,
    };
  }

  return { isValid: true, error: null };
};
