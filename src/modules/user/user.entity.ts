import { Insertable, Selectable, Updateable } from 'kysely';

import { User } from '@entities/entityTypes';

export type SelectableUser = Selectable<User>;
export type NewUser = Insertable<User>;
export type UserUpdate = Updateable<User>;

export type SelectableUserOmitPassword = Omit<Selectable<User>, 'passwordHash'>;
