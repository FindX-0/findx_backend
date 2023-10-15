import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface RefreshTokenTable {
  id: Generated<string>;
  user_id: boolean;
  value: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type RefreshToken = Selectable<RefreshTokenTable>;
export type NewRefreshToken = Insertable<RefreshTokenTable>;
export type UpdateRefreshToken = Updateable<RefreshTokenTable>;
