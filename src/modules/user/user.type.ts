import { Insertable, Selectable, Updateable } from 'kysely';

import { FriendshipStatus, User } from '@entities/index';

import { LastIdPageParams } from '../../shared/type';
import { SelectableUserMeta } from '../userMeta/userMeta.entity';

export type SelectableUser = Selectable<User>;
export type NewUser = Insertable<User>;
export type UserUpdate = Updateable<User>;

export type PublicSelectableUser = Omit<
  Selectable<User>,
  'passwordHash' | 'socketId' | 'isOnline' | 'deviceId'
>;

export type SelectableUserWithRelations = SelectableUser & {
  userMeta?: SelectableUserMeta | null;
};

export type PublicSelectableUserWithRelations = PublicSelectableUser & {
  userMeta: SelectableUserMeta | null;
};

export type CreateUserParams = Omit<NewUser, 'isOnline' | 'socketId'>;

export type PublicSelectableUserWithFriendshipStatus = PublicSelectableUser & {
  friendshipStatus: FriendshipStatus | null;
};

export type FilterUserParams = {
  authUserId: string;
  searchQuery?: string | null;
} & LastIdPageParams;
