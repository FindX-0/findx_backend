import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { Gender } from './entityEnums';

export type AccountVerification = {
  id: Generated<string>;
  is_verified: Generated<boolean>;
  one_time_code: number;
  user_id: string;
  created_at: Generated<Timestamp>;
};
export type RefreshToken = {
  id: Generated<string>;
  user_id: string;
  value: string;
  created_at: Generated<Timestamp>;
};
export type User = {
  id: Generated<string>;
  email: string;
  user_name: string;
  gender: Gender;
  password_hash: string;
  created_at: Generated<Timestamp>;
};
export type DB = {
  account_verification: AccountVerification;
  refresh_tokens: RefreshToken;
  users: User;
};
