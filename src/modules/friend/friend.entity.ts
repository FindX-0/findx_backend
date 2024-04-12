import { Insertable, Selectable, Updateable } from 'kysely';

import { Friend } from '@entities/index';

import { PublicSelectableUser } from '../user/user.type';

export type NewFriend = Insertable<Friend>;
export type FriendUpdate = Updateable<Friend>;
export type SelectableFriend = Selectable<Friend>;

export type SelectableFriendWithRelations = SelectableFriend & {
  user: PublicSelectableUser | null;
  friend: PublicSelectableUser | null;
};
