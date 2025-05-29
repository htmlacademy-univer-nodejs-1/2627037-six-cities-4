export const UserValidationMessages = {
  name: {
    invalidFormat: 'name is required',
    lengthField: 'min length is 1, max is 15'
  },
  email: {
    invalidFormat: 'email must be a valid address',
  },
  avatarPath: {
    invalidFormat: 'avatarPath is required',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: 'min length is 6, max is 12'
  },
  token: {
    invalidFormat: 'token is required',
  },
  userType: {
    invalidFormat: 'userType must be valid UserType enum value',
  },
} as const;
