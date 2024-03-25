import { Insertable, Selectable, Updateable } from 'kysely';

import { UserMeta } from '@entities/index';

export type SelectableUserMeta = Selectable<UserMeta>;
export type NewUserMeta = Insertable<UserMeta>;
export type UserMetaUpdate = Updateable<UserMeta>;

export type UserMetaChange = {
  trophiesChange: number;
};
