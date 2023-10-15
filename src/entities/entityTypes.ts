import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { Gender } from './entityEnums';

export type AccountVerification = {
  id: Generated<string>;
  isVerified: Generated<boolean>;
  oneTimeCode: number;
  userId: string;
  createdAt: Generated<Timestamp>;
};
export type RefreshToken = {
  id: Generated<string>;
  userId: string;
  value: string;
  createdAt: Generated<Timestamp>;
};
export type User = {
  id: Generated<string>;
  email: string;
  userName: string;
  gender: Gender;
  passwordHash: string;
  createdAt: Generated<Timestamp>;
};
export type DB = {
  accountVerification: AccountVerification;
  refreshTokens: RefreshToken;
  users: User;
};
