import { Insertable, Selectable, Updateable } from 'kysely';

import { User } from '@entities/index';

export type SelectableUser = Selectable<User>;
export type NewUser = Insertable<User>;
export type UserUpdate = Updateable<User>;

export type PublicSelectableUser = Omit<
  Selectable<User>,
  'passwordHash' | 'socketId'
>;
