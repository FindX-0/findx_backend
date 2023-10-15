import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface AccountVerificationTable {
  id: Generated<string>;
  is_verified: boolean;
  code: string;
  user_id: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type AccountVerificationCode = Selectable<AccountVerificationTable>;
export type NewAccountVerificationCode = Insertable<AccountVerificationTable>;
export type UpdateAccountVerificationCode =
  Updateable<AccountVerificationTable>;
