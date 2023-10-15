import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { Gender } from '../modules';

export interface UserTable {
  id: Generated<string>;
  username: string;
  gender: ColumnType<Gender, string, Gender>;
  created_at: ColumnType<Date, string | undefined, never>;
  email: string;
  passwordHash: string;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
