export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];
export const AuthProvider = {
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
  APPLE: 'APPLE',
  FACEBOOK: 'FACEBOOK',
} as const;
export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];
